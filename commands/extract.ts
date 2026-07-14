import { existsSync, rmSync } from "fs";
import path from "path";

import { CanonicalAddresses, KnownContracts } from "../src/contracts.js";
import { defaultMastercopiesDir, writeAsset } from "../src/mastercopies.js";
import { extract, ExtractResult } from "../src/extract.js";
import { writeAbis } from "./write-abis.js";

/** Networks tried, in order, when none is specified. */
const DEFAULT_NETWORKS = ["mainnet", "gnosis", "arbitrum", "optimism", "base"];

const knownContractNames = Object.values(KnownContracts);

/**
 * Extract known mastercopies into `mastercopies/`, driven by the canonical
 * address registry. Script behaves:
 *
 *  - no name              -> every known contract, every version
 *  - name, no version     -> every version of that contract
 *  - name + version       -> just that one
 *
 * Existing folders are skipped unless `force` is true, in which case they are
 * removed and re-extracted.
 *
 * The address for each `name@version` comes from `CanonicalAddresses`. Source is
 * read from the first default explorer where the contract is verified.
 *
 * Throws on an unknown contract name or version.
 */
export async function extractKnown({
  name,
  version,
  force = false,
  networks = DEFAULT_NETWORKS,
  apiKey,
  mastercopiesDir = defaultMastercopiesDir(),
}: {
  name?: string;
  version?: string;
  /** Remove and regenerate folders that already exist (default: skip them). */
  force?: boolean;
  networks?: (string | number)[];
  apiKey?: string;
  mastercopiesDir?: string;
} = {}): Promise<void> {
  const names = resolveNames(name);
  // A fully-specified target fails loudly; a sweep stays resilient.
  const strict = name !== undefined && version !== undefined;

  for (const contractName of names) {
    const versions = CanonicalAddresses[contractName] || {};
    const versionKeys = resolveVersions(contractName, versions, version);

    for (const v of versionKeys) {
      const address = versions[v as keyof typeof versions];
      if (!address) {
        console.log(`  – ${contractName}@${v}: no address on record, skipping`);
        continue;
      }

      const dir = path.join(mastercopiesDir, contractName, v);
      if (existsSync(dir)) {
        if (!force) {
          console.log(`  ↷ ${contractName}@${v}: already on disk, skipping`);
          continue;
        }
        rmSync(dir, { recursive: true, force: true });
      }

      await extractTarget({
        contractName,
        version: v,
        address,
        networks,
        apiKey,
        mastercopiesDir,
        strict,
      });
    }
  }

  await writeAbis({ mastercopiesDir });
  console.log("  ✔ ABI exports updated");
}

/** Validate and resolve the contract name(s) to process. */
function resolveNames(name?: string): KnownContracts[] {
  if (name === undefined) return knownContractNames;

  const matched = knownContractNames.find(
    (n) => n.toLowerCase() === name.toLowerCase()
  );
  if (!matched) {
    throw new Error(
      `Unknown contract "${name}". Known contracts: ${knownContractNames.join(
        ", "
      )}`
    );
  }
  return [matched];
}

/** Validate and resolve the version(s) to process for a contract. */
function resolveVersions(
  contractName: string,
  versions: Record<string, string>,
  version?: string
): string[] {
  const keys = Object.keys(versions);
  if (version === undefined) return keys;

  if (!keys.includes(version)) {
    throw new Error(
      `Unknown version "${version}" for ${contractName}. Known versions: ${
        keys.join(", ") || "(none)"
      }`
    );
  }
  return [version];
}

/**
 * Extract one target, trying each network until one yields a complete result.
 * If every network only yields a partial result (verified source but no
 * recoverable factory deployment), the most complete partial is written so at
 * least the ABI and source make it into the registry.
 */
async function extractTarget({
  contractName,
  version,
  address,
  networks,
  apiKey,
  mastercopiesDir,
  strict,
}: {
  contractName: string;
  version: string;
  address: string;
  networks: (string | number)[];
  apiKey?: string;
  mastercopiesDir: string;
  strict: boolean;
}): Promise<void> {
  let partial: ExtractResult | undefined;

  for (const network of networks) {
    let result: ExtractResult;
    try {
      result = await extract({ network, address, apiKey });
    } catch {
      // No verified source on this network.
      continue;
    }

    if (result.errors.length === 0) {
      for (const asset of result.assets.values()) {
        writeAsset({ module: contractName, version, asset, mastercopiesDir });
      }
      console.log(
        `  ✔ ${contractName}@${version}: ${result.assets.size} asset(s)`
      );
      return;
    }

    // Keep the most complete partial result, but continue trying — another
    // network may hold more of the recoverable factory deployments.
    if (!partial || isMoreComplete(result, partial, address)) {
      partial = result;
    }
  }

  if (partial) {
    for (const asset of partial.assets.values()) {
      writeAsset({ module: contractName, version, asset, mastercopiesDir });
    }
    console.warn(
      `  ⚠ ${contractName}@${version}: partial — ${partial.errors.join("; ")}`
    );
    return;
  }

  const message = `${contractName}@${version}: could not find any verified source`;
  if (strict) throw new Error(message);
  console.warn(`  ✘ ${message}`);
}

/**
 * Prefer recovery of the root deployment, then the result with more recovered
 * assets. Use total assets and error count as deterministic tie-breakers.
 */
function isMoreComplete(
  candidate: ExtractResult,
  current: ExtractResult,
  rootAddress: string
): boolean {
  const rootKey = rootAddress.toLowerCase();
  const score = (result: ExtractResult): [number, number, number, number] => [
    result.assets.get(rootKey)?.bytecode ? 1 : 0,
    [...result.assets.values()].filter((asset) => asset.bytecode).length,
    result.assets.size,
    -result.errors.length,
  ];

  const candidateScore = score(candidate);
  const currentScore = score(current);
  return candidateScore.some(
    (value, index) =>
      value > currentScore[index] &&
      candidateScore.slice(0, index).every((v, i) => v === currentScore[i])
  );
}

/**
 * CLI entry for `zodiac extract [name] [version] [network] [--force]`.
 * Parses the subcommand's argv and invokes the orchestration above.
 */
export async function runExtract(args: string[]): Promise<void> {
  const force = args.includes("--force");
  const [name, version, network] = args.filter((a) => !a.startsWith("-"));
  await extractKnown({
    name,
    version,
    force,
    networks: network ? [network] : undefined,
  });
}

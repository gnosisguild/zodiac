import { existsSync, readdirSync, readFileSync } from "fs";
import path from "path";

import { getAddress } from "ethers";

import {
  CanonicalAddresses,
  KnownContracts,
  latestVersion,
} from "../src/contracts.js";
import {
  checkVerificationStatus,
  getCode as getExplorerCode,
  getSourceCode,
  verifySourceCode,
} from "../src/explorer.js";
import { defaultMastercopiesDir } from "../src/mastercopies.js";
import { NetworkConfig, networks } from "../src/networks.js";
import { BytecodeFile, SourceCodeFile } from "../src/types.js";
import {
  CHECK,
  CROSS,
  QUESTION,
  clearProgress,
  color,
  printStatusLine,
  printTable,
  renderProgress,
  showTransient,
} from "../src/ui.js";

interface VerificationCell {
  label: string;
}

interface VerifiableAsset {
  name: string;
  bytecode: BytecodeFile;
  sourceCode: SourceCodeFile;
}

const knownContractNames = Object.values(KnownContracts);

/**
 * CLI entry for:
 *
 *   zodiac verify <name> [version] [--all]
 *   zodiac verify list <name> [version] [--all]
 *
 * Without [version] only the latest canonical version is targeted; --all
 * widens that to every legacy version, too.
 */
export async function runVerify(args: string[]): Promise<void> {
  const all = args.includes("--all");
  const [subcommand, name, version] = args.filter((a) => !a.startsWith("-"));

  switch (subcommand) {
    case "list": {
      if (!name) {
        throw new Error("Usage: zodiac verify list <name> [version] [--all]");
      }
      await listVerifications(name, version, all);
      break;
    }
    case undefined:
      throw new Error(
        "Usage: zodiac verify <name> [version] [--all] | zodiac verify list <name> [version] [--all]"
      );
    default:
      await verifyKnown(subcommand, name, all);
  }
}

async function verifyKnown(
  name: string,
  version?: string,
  all = false
): Promise<void> {
  const contractName = resolveName(name);
  const versions = CanonicalAddresses[contractName] || {};
  const versionKeys = resolveVersions(contractName, versions, version, all);

  const total = networks.length * versionKeys.length;
  let completed = 0;
  const rows: { network: string; cells: VerificationCell[] }[] = [];

  renderProgress(completed, total, "Verifying contracts");
  for (const network of networks) {
    const cells: VerificationCell[] = [];

    for (const version of versionKeys) {
      const address = versions[version as keyof typeof versions];
      const result = address
        ? await verifyTarget({
            contractName,
            version,
            network,
            address,
          })
        : await failedVerification({
            contractName,
            version,
            network,
            reason: "no address on record",
          });

      cells.push(result);
      completed += 1;
      renderProgress(completed, total, "Verifying contracts");
    }

    rows.push({ network: network.name, cells });
  }

  clearProgress();
  printTable(["network", ...versionKeys], rows, [
    `${color(CHECK, "green")} verified`,
    `${color(CROSS, "red")} failed verification`,
  ]);
}

async function listVerifications(
  name: string,
  version?: string,
  all = false
): Promise<void> {
  const contractName = resolveName(name);
  const versions = CanonicalAddresses[contractName] || {};
  const versionKeys = resolveVersions(contractName, versions, version, all);

  const total = networks.length * versionKeys.length;
  let completed = 0;
  const rows: { network: string; cells: VerificationCell[] }[] = [];

  renderProgress(completed, total, "Checking verifications");
  for (const network of networks) {
    const cells: VerificationCell[] = [];

    for (const version of versionKeys) {
      const address = versions[version as keyof typeof versions];
      cells.push(
        address
          ? await checkVerification({
              contractName,
              version,
              network,
              address,
            })
          : errorCell()
      );
      completed += 1;
      renderProgress(completed, total, "Checking verifications");
    }

    rows.push({ network: network.name, cells });
  }

  clearProgress();
  printTable(["network", ...versionKeys], rows, [
    `${color(CHECK, "green")} verified`,
    `${color(CROSS, "red")} not verified`,
    `${color(QUESTION, "yellow")} couldn't get status`,
  ]);
}

function resolveName(name: string): KnownContracts {
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
  return matched;
}

function resolveVersions(
  contractName: KnownContracts,
  versions: Record<string, string>,
  version?: string,
  all = false
): string[] {
  const keys = Object.keys(versions);
  if (keys.length === 0) {
    throw new Error(`No versions on record for ${contractName}.`);
  }

  if (version === undefined) {
    return all ? keys : [latestVersion(keys)];
  }

  if (!keys.includes(version)) {
    throw new Error(
      `Unknown version "${version}" for ${contractName}. Known versions: ${keys.join(
        ", "
      )}`
    );
  }
  return [version];
}

async function checkVerification({
  contractName,
  version,
  network,
  address,
}: {
  contractName: KnownContracts;
  version: string;
  network: NetworkConfig;
  address: string;
}): Promise<VerificationCell> {
  if (!network.etherscanApiUrl) return errorCell();

  const assets = loadVerifiableAssets({ contractName, version, address });
  if (assets.length === 0) return errorCell();

  let sawError = false;
  for (const asset of assets) {
    const status = await assetVerificationStatus(network, asset);
    if (status === "unverified") return unverifiedCell();
    if (status === "unknown") sawError = true;
  }

  return sawError ? errorCell() : verifiedCell();
}

async function verifyTarget({
  contractName,
  version,
  network,
  address,
}: {
  contractName: KnownContracts;
  version: string;
  network: NetworkConfig;
  address: string;
}): Promise<VerificationCell> {
  if (!network.etherscanApiUrl) {
    return failedVerification({
      contractName,
      version,
      network,
      reason: "no supported explorer",
    });
  }

  const assets = loadVerifiableAssets({ contractName, version, address });
  if (assets.length === 0) {
    return failedVerification({
      contractName,
      version,
      network,
      reason: "no local verification artifact",
    });
  }

  try {
    let submitted = false;
    for (const asset of assets) {
      const status = await assetVerificationStatus(network, asset);
      if (status === "verified") continue;
      if (status === "unknown") {
        throw new Error(`${asset.name}: couldn't get status`);
      }

      const code = await getExplorerCode({
        address: asset.bytecode.address,
        network: network.name,
      });
      if (code === "0x") {
        throw new Error(`${asset.name}: not deployed`);
      }

      submitted = true;
      showTransient(
        `Verifying ${contractName}@${version} on ${network.name}...`
      );
      await submitAndWaitForVerification(network, asset);
    }

    if (submitted) {
      printStatusLine(
        `${color(CHECK, "green")} ${contractName}@${version} verified on ${
          network.name
        }: ${address}`
      );
    }
    return verifiedCell();
  } catch (error) {
    printStatusLine(
      `${color(CROSS, "red")} ${contractName}@${version} failed on ${
        network.name
      }: ${verificationErrorMessage(error)}`
    );
    return failedCell();
  }
}

async function assetVerificationStatus(
  network: NetworkConfig,
  asset: VerifiableAsset
): Promise<"verified" | "unverified" | "unknown"> {
  try {
    await getSourceCode({
      address: asset.bytecode.address,
      network: network.name,
    });
    return "verified";
  } catch (error) {
    return isUnverifiedError(error) ? "unverified" : "unknown";
  }
}

async function submitAndWaitForVerification(
  network: NetworkConfig,
  asset: VerifiableAsset
): Promise<void> {
  const sourceCode = asset.sourceCode;
  const guid = await verifySourceCode({
    address: asset.bytecode.address,
    network: network.name,
    sourceCode: JSON.stringify(sourceCode.input),
    contractName: `${sourceCode.sourceName}:${sourceCode.contractName}`,
    compilerVersion: sourceCode.compilerVersion,
    constructorArguments: sourceCode.constructorArguments || "",
    evmVersion: evmVersionFor(sourceCode),
  });
  if (guid.toLowerCase().includes("already verified")) return;

  const result = await waitForVerification(network, guid);
  if (!result.toLowerCase().includes("pass")) {
    throw new Error(`${asset.name}: ${result}`);
  }
}

async function waitForVerification(
  network: NetworkConfig,
  guid: string
): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const result = await checkVerificationStatus({
      network: network.name,
      guid,
    });
    const lower = result.toLowerCase();
    if (lower.includes("pending") || lower.includes("queued")) {
      await new Promise((resolve) => setTimeout(resolve, 3_000));
      continue;
    }
    return result;
  }
  return "verification timed out";
}

async function failedVerification({
  contractName,
  version,
  network,
  reason,
}: {
  contractName: KnownContracts;
  version: string;
  network: NetworkConfig;
  reason: string;
}): Promise<VerificationCell> {
  printStatusLine(
    `${color(CROSS, "red")} ${contractName}@${version} failed on ${
      network.name
    }: ${reason}`
  );
  return failedCell();
}

function verifiedCell(): VerificationCell {
  return { label: color(CHECK, "green") };
}

function unverifiedCell(): VerificationCell {
  return { label: color(CROSS, "red") };
}

function errorCell(): VerificationCell {
  return { label: color(QUESTION, "yellow") };
}

function failedCell(): VerificationCell {
  return { label: color(CROSS, "red") };
}

function loadVerifiableAssets({
  contractName,
  version,
  address,
}: {
  contractName: KnownContracts;
  version: string;
  address: string;
}): VerifiableAsset[] {
  const dir = path.join(defaultMastercopiesDir(), contractName, version);
  if (!existsSync(dir)) return [];

  const assets = readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const bytecodePath = path.join(dir, entry.name, "bytecode.json");
      const sourceCodePath = path.join(dir, entry.name, "sourcecode.json");
      if (!existsSync(bytecodePath) || !existsSync(sourceCodePath)) {
        return undefined;
      }

      const bytecode = JSON.parse(
        readFileSync(bytecodePath, "utf8")
      ) as BytecodeFile;
      const sourceCode = JSON.parse(
        readFileSync(sourceCodePath, "utf8")
      ) as SourceCodeFile;
      return { name: entry.name, bytecode, sourceCode };
    })
    .filter((asset): asset is VerifiableAsset => asset !== undefined);

  const normalizedAddress = getAddress(address);
  return assets.sort((a, b) => {
    const aIsMain = getAddress(a.bytecode.address) === normalizedAddress;
    const bIsMain = getAddress(b.bytecode.address) === normalizedAddress;
    if (aIsMain === bIsMain) return a.name.localeCompare(b.name);
    return aIsMain ? 1 : -1;
  });
}

function evmVersionFor(sourceCode: SourceCodeFile): string {
  const evmVersion = sourceCode.input?.settings?.evmVersion;
  return evmVersion && evmVersion !== "Default" ? evmVersion : "default";
}

function isUnverifiedError(error: unknown): boolean {
  const message = ((error as Error)?.message || String(error)).toLowerCase();
  return (
    message.includes("not verified") ||
    message.includes("source code not verified") ||
    message.includes("contract source code not verified")
  );
}

function verificationErrorMessage(error: unknown): string {
  return (error as Error)?.message || String(error);
}

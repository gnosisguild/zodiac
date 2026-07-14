import { getAddress } from "ethers";
import { predictSingletonAddress } from "@gnosis-guild/zodiac-core";

import { resolveNetwork } from "./networks.js";
import {
  getCode,
  getContractCreation,
  getSourceCode,
  getTransaction,
} from "./explorer.js";
import { recoverDeployment } from "./singleton.js";
import { Asset, BytecodeFile } from "./types.js";

/**
 * Enumerate the libraries a contract links, from its standard-JSON compiler
 * input. Shape: `settings.libraries = { [sourceName]: { [libName]: address } }`.
 */
function enumerateLibraries(
  input: any
): { sourceName: string; libraryName: string; address: string }[] {
  const libraries = input?.settings?.libraries || {};
  const out: { sourceName: string; libraryName: string; address: string }[] =
    [];
  for (const sourceName of Object.keys(libraries)) {
    for (const libraryName of Object.keys(libraries[sourceName] || {})) {
      const address = libraries[sourceName][libraryName];
      if (address) out.push({ sourceName, libraryName, address });
    }
  }
  return out;
}

export interface ExtractResult {
  /** Every asset produced, keyed by lower-cased address. */
  assets: Map<string, Asset>;
  /**
   * What couldn't be resolved (deployment metadata, a linked library, …).
   * Empty when the extraction is complete. When non-empty, some assets are
   * partial: ABI + source only, no `bytecode`.
   */
  errors: string[];
}

/**
 * Extract an asset (and, recursively, every library it links) from a block
 * explorer.
 *
 * Recursion is depth-first and deduplicated by address, so a library shared by
 * several contracts is fetched once.
 *
 * An asset is recorded as soon as its ABI and source are in hand. Failures in
 * later steps — deployment-metadata recovery, linked libraries — degrade the
 * result to a partial asset (reported via `errors`) instead of discarding
 * everything. Only an unverified root contract throws.
 *
 * @returns every asset produced, keyed by lower-cased address, plus the
 * errors that left any of them partial.
 */
export async function extract({
  network,
  address,
  apiKey,
}: {
  network: string | number;
  address: string;
  apiKey?: string;
}): Promise<ExtractResult> {
  const net = resolveNetwork(network);
  const visited = new Map<string, Asset>();
  const errors: string[] = [];
  await extractOne({
    address,
    networkName: net.name,
    apiKey,
    visited,
    errors,
  });
  return { assets: visited, errors };
}

async function extractOne({
  address,
  nameHint,
  networkName,
  apiKey,
  visited,
  errors,
}: {
  address: string;
  nameHint?: string;
  networkName: string;
  apiKey?: string;
  visited: Map<string, Asset>;
  errors: string[];
}): Promise<Asset> {
  const key = getAddress(address).toLowerCase();
  const existing = visited.get(key);
  if (existing) return existing;

  const source = await getSourceCode({ address, network: networkName, apiKey });
  const name = nameHint || source.contractName;

  // Record the asset as soon as ABI and source are in hand — before recursing,
  // so shared libraries dedupe correctly, and before deployment recovery, so a
  // failure there yields a partial asset rather than losing the ABI.
  const asset: Asset = {
    name,
    abi: source.abi,
    sourceCode: {
      contractName: source.contractName,
      sourceName: source.sourceName,
      compilerVersion: source.compilerVersion,
      constructorArguments: source.constructorArguments,
      input: source.compilerInput,
    },
  };
  visited.set(key, asset);

  try {
    asset.bytecode = await recoverBytecodeFile({
      address,
      key,
      name,
      networkName,
      apiKey,
    });
  } catch (error) {
    errors.push((error as Error)?.message || String(error));
  }

  // Recurse into linked libraries.
  for (const lib of enumerateLibraries(source.compilerInput)) {
    try {
      await extractOne({
        address: lib.address,
        nameHint: lib.libraryName,
        networkName,
        apiKey,
        visited,
        errors,
      });
    } catch (error) {
      errors.push(
        `${lib.libraryName} @ ${lib.address}: ${
          (error as Error)?.message || String(error)
        }`
      );
    }
  }

  return asset;
}

/** Recover the reproducible factory-deployment metadata for an address. */
async function recoverBytecodeFile({
  address,
  key,
  name,
  networkName,
  apiKey,
}: {
  address: string;
  key: string;
  name: string;
  networkName: string;
  apiKey?: string;
}): Promise<BytecodeFile> {
  const creation = await getContractCreation({
    address,
    network: networkName,
    apiKey,
  });
  const tx = creation?.txHash
    ? await getTransaction({
        txHash: creation.txHash,
        network: networkName,
        apiKey,
      })
    : undefined;
  const recovered = tx && recoverDeployment(tx);
  if (!recovered) {
    throw new Error(
      `${name} @ ${address} was not deployed via a known singleton factory.`
    );
  }

  const { factory, initCode: creationBytecode, salt } = recovered;

  // Sanity: the recovered creation bytecode must reproduce the on-chain address
  // via CREATE2. By construction it always does — a failure means a parsing bug.
  // zodiac-core's helper concatenates bytecode + encoded constructor args; we
  // already hold the full creation bytecode, so pass it as `bytecode` with empty
  // args (the concat is then a no-op).
  const predicted = predictSingletonAddress({
    factory,
    bytecode: creationBytecode,
    constructorArgs: { types: [], values: [] },
    salt,
  });
  if (predicted.toLowerCase() !== key) {
    throw new Error(
      `${name} @ ${address}: recovered creation bytecode reproduces ` +
        `${predicted}, not the on-chain address. Refusing to write.`
    );
  }

  // Deployed (runtime) bytecode actually stored at the address.
  const bytecode = await getCode({ address, network: networkName, apiKey });

  return {
    address: predicted,
    factory,
    salt,
    creationBytecode,
    bytecode,
  };
}

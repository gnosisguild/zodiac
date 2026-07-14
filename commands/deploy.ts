import { existsSync, readdirSync, readFileSync } from "fs";
import path from "path";

import {
  BrowserProvider,
  type Eip1193Provider,
  Interface,
  JsonRpcProvider,
  type Signer,
  Wallet,
  getAddress,
} from "ethers";
import ethProviderImport from "eth-provider";

type FrameProvider = Eip1193Provider & {
  setChain: (chainId: string | number) => void;
  close: () => void;
};

// eth-provider ships a CommonJS default export; the cast normalizes the call
// signature across module-interop quirks.
const connectProvider = ethProviderImport as unknown as (
  targets?: string | string[]
) => FrameProvider;

import { CanonicalAddresses, KnownContracts } from "../src/contracts.js";
import { defaultMastercopiesDir } from "../src/mastercopies.js";
import { NetworkConfig, networks } from "../src/networks.js";
import { getCode } from "../src/rpc.js";
import { ERC2470_FACTORY, NICK_FACTORY } from "../src/singleton.js";
import { BytecodeFile } from "../src/types.js";
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

interface DeploymentCell {
  label: string;
}

interface DeployableAsset {
  name: string;
  bytecode: BytecodeFile;
}

const knownContractNames = Object.values(KnownContracts);

/**
 * When DEPLOY_VIA_FRAME is truthy, deployments are signed through a locally
 * running Frame (https://frame.sh) wallet instead of a MNEMONIC. Frame prompts
 * for each transaction and lets you use a hardware wallet / Ledger.
 */
const useFrame = isTruthy(process.env.DEPLOY_VIA_FRAME);

function isTruthy(value: string | undefined): boolean {
  return (
    value !== undefined &&
    ["1", "true", "yes", "on"].includes(value.toLowerCase())
  );
}

const erc2470Interface = new Interface([
  "function deploy(bytes _initCode, bytes32 _salt) returns (address)",
]);

/**
 * CLI entry for:
 *
 *   zodiac deploy <name> [version]
 *   zodiac deploy list <name> [version]
 */
export async function runDeploy(args: string[]): Promise<void> {
  const [subcommand, name, version] = args;

  switch (subcommand) {
    case "list": {
      if (!name) {
        throw new Error("Usage: zodiac deploy list <name> [version]");
      }
      await listDeployments(name, version);
      break;
    }
    case undefined:
      throw new Error(
        "Usage: zodiac deploy <name> [version] | zodiac deploy list <name> [version]"
      );
    default:
      await deployKnown(subcommand, name);
  }
}

async function deployKnown(name: string, version?: string): Promise<void> {
  const contractName = resolveName(name);
  const versions = CanonicalAddresses[contractName] || {};
  const versionKeys = resolveVersions(contractName, versions, version);

  const total = networks.length * versionKeys.length;
  let completed = 0;
  const rows: { network: string; cells: DeploymentCell[] }[] = [];

  renderProgress(completed, total);
  for (const network of networks) {
    const cells: DeploymentCell[] = [];

    for (const version of versionKeys) {
      const address = versions[version as keyof typeof versions];
      const result = address
        ? await deployTarget({
            contractName,
            version,
            network,
            address,
          })
        : await failedDeployment({
            contractName,
            version,
            network,
            reason: "no address on record",
          });

      cells.push(result);
      completed += 1;
      renderProgress(completed, total);
    }

    rows.push({ network: network.name, cells });
  }

  clearProgress();
  printTable(["network", ...versionKeys], rows, [
    `${color(CHECK, "green")} deployed`,
    `${color(CROSS, "red")} failed deployment`,
  ]);
}

async function listDeployments(name: string, version?: string): Promise<void> {
  const contractName = resolveName(name);
  const versions = CanonicalAddresses[contractName] || {};
  const versionKeys = resolveVersions(contractName, versions, version);

  const requestVersions = versionKeys.filter((version) => {
    const address = versions[version as keyof typeof versions];
    return Boolean(address);
  });
  const total = networks.length * requestVersions.length;
  let completed = 0;
  const rows: { network: string; cells: DeploymentCell[] }[] = [];

  if (total > 0) renderProgress(completed, total);
  for (const network of networks) {
    const cells: DeploymentCell[] = [];

    for (const version of versionKeys) {
      const address = versions[version as keyof typeof versions];
      if (!address) {
        cells.push(errorCell());
        continue;
      }

      cells.push(await checkDeployment(network, address));
      completed += 1;
      if (total > 0) renderProgress(completed, total);
    }

    rows.push({ network: network.name, cells });
  }

  if (total > 0) clearProgress();

  printTable(["network", ...versionKeys], rows, [
    `${color(CHECK, "green")} deployed`,
    `${color(CROSS, "red")} not deployed`,
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
  version?: string
): string[] {
  const keys = Object.keys(versions);
  if (keys.length === 0) {
    throw new Error(`No versions on record for ${contractName}.`);
  }

  if (version === undefined) return keys;

  if (!keys.includes(version)) {
    throw new Error(
      `Unknown version "${version}" for ${contractName}. Known versions: ${keys.join(
        ", "
      )}`
    );
  }
  return [version];
}

async function checkDeployment(
  network: NetworkConfig,
  address: string
): Promise<DeploymentCell> {
  const rpcUrl = rpcUrlFor(network);
  if (!rpcUrl) return errorCell();

  try {
    const code = await getCode(rpcUrl, address);
    return code === "0x" ? missingCell() : deployedCell();
  } catch {
    return errorCell();
  }
}

async function deployTarget({
  contractName,
  version,
  network,
  address,
}: {
  contractName: KnownContracts;
  version: string;
  network: NetworkConfig;
  address: string;
}): Promise<DeploymentCell> {
  const rpcUrl = rpcUrlFor(network);
  if (!rpcUrl) {
    return failedDeployment({
      contractName,
      version,
      network,
      reason: "no usable RPC",
    });
  }

  try {
    const currentCode = await getCode(rpcUrl, address);
    if (currentCode !== "0x") return deployedCell();
  } catch {
    return failedDeployment({
      contractName,
      version,
      network,
      reason: "couldn't get status",
    });
  }

  const assets = loadDeployableAssets({ contractName, version, address });
  if (assets.length === 0) {
    return failedDeployment({
      contractName,
      version,
      network,
      reason: "no local deployable artifact",
    });
  }

  if (!useFrame && !process.env.MNEMONIC) {
    return failedDeployment({
      contractName,
      version,
      network,
      reason: "missing MNEMONIC",
    });
  }

  showTransient(
    `Deploying ${contractName}@${version} to ${network.name}${
      useFrame ? " via Frame" : ""
    }...`
  );

  const provider = new JsonRpcProvider(rpcUrl, network.chainId, {
    staticNetwork: true,
  });

  let signer: Signer;
  let disposeSigner: (() => void) | undefined;
  try {
    ({ signer, dispose: disposeSigner } = await createSigner(
      network,
      provider
    ));
  } catch (error) {
    provider.destroy();
    return failedDeployment({
      contractName,
      version,
      network,
      reason: useFrame
        ? `Frame unavailable: ${deploymentErrorMessage(error)}`
        : "couldn't create signer",
    });
  }

  try {
    for (const asset of assets) {
      const assetCode = await provider.getCode(asset.bytecode.address);
      if (assetCode !== "0x") continue;

      const factoryCode = await provider.getCode(asset.bytecode.factory);
      if (factoryCode === "0x") {
        throw new Error(`factory ${asset.bytecode.factory} is not deployed`);
      }

      const data = deploymentData(asset.bytecode);
      const gasLimit = await deploymentGasLimit(provider, asset.bytecode, data);
      const tx = await signer.sendTransaction({
        to: asset.bytecode.factory,
        data,
        gasLimit,
      });
      const receipt = await tx.wait();
      if (!receipt || receipt.status !== 1) {
        throw new Error(`deployment transaction failed: ${tx.hash}`);
      }

      const deployed = await waitForCode(provider, asset.bytecode.address);
      if (!deployed) {
        throw new Error(
          `${asset.name} deployment produced no code: ${tx.hash}`
        );
      }
    }

    const finalDeployed = await waitForCode(provider, address);
    if (!finalDeployed) {
      throw new Error("canonical address is still empty");
    }

    printStatusLine(
      `${color(CHECK, "green")} ${contractName}@${version} deployed to ${
        network.name
      }: ${address}`
    );
    return deployedCell();
  } catch (error) {
    printStatusLine(
      `${color(CROSS, "red")} ${contractName}@${version} failed on ${
        network.name
      }: ${deploymentErrorMessage(error)}`
    );
    return failedCell();
  } finally {
    disposeSigner?.();
    provider.destroy();
  }
}

/**
 * Builds the signer used to broadcast deployment transactions. With Frame the
 * wallet itself is the connected account (and the chain is selected on it),
 * otherwise transactions are signed locally from MNEMONIC.
 */
async function createSigner(
  network: NetworkConfig,
  provider: JsonRpcProvider
): Promise<{ signer: Signer; dispose?: () => void }> {
  if (useFrame) {
    const frame = connectProvider("frame");
    frame.setChain(network.chainId);
    const browserProvider = new BrowserProvider(frame, network.chainId);
    const signer = await browserProvider.getSigner();
    return { signer, dispose: () => frame.close() };
  }

  const signer = Wallet.fromPhrase(process.env.MNEMONIC as string, provider);
  return { signer };
}

async function failedDeployment({
  contractName,
  version,
  network,
  reason,
}: {
  contractName: KnownContracts;
  version: string;
  network: NetworkConfig;
  reason: string;
}): Promise<DeploymentCell> {
  printStatusLine(
    `${color(CROSS, "red")} ${contractName}@${version} failed on ${
      network.name
    }: ${reason}`
  );
  return failedCell();
}

function rpcUrlFor(network: NetworkConfig): string | null {
  if (network.alchemyRpcUrl && process.env.ALCHEMY_KEY) {
    return network.alchemyRpcUrl;
  }
  return network.publicRpc ?? `https://rpc.gnosisguild.org/${network.chainId}`;
}

function deployedCell(): DeploymentCell {
  return { label: color(CHECK, "green") };
}

function missingCell(): DeploymentCell {
  return { label: color(CROSS, "red") };
}

function errorCell(): DeploymentCell {
  return { label: color(QUESTION, "yellow") };
}

function failedCell(): DeploymentCell {
  return { label: color(CROSS, "red") };
}

function loadDeployableAssets({
  contractName,
  version,
  address,
}: {
  contractName: KnownContracts;
  version: string;
  address: string;
}): DeployableAsset[] {
  const dir = path.join(defaultMastercopiesDir(), contractName, version);
  if (!existsSync(dir)) return [];

  const assets = readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const bytecodePath = path.join(dir, entry.name, "bytecode.json");
      if (!existsSync(bytecodePath)) return undefined;

      const bytecode = JSON.parse(
        readFileSync(bytecodePath, "utf8")
      ) as BytecodeFile;
      return { name: entry.name, bytecode };
    })
    .filter((asset): asset is DeployableAsset => asset !== undefined);

  const normalizedAddress = getAddress(address);
  return assets.sort((a, b) => {
    const aIsMain = getAddress(a.bytecode.address) === normalizedAddress;
    const bIsMain = getAddress(b.bytecode.address) === normalizedAddress;
    if (aIsMain === bIsMain) return a.name.localeCompare(b.name);
    return aIsMain ? 1 : -1;
  });
}

function deploymentData(bytecode: BytecodeFile): string {
  const factory = getAddress(bytecode.factory);

  if (factory === getAddress(ERC2470_FACTORY)) {
    return erc2470Interface.encodeFunctionData("deploy", [
      bytecode.creationBytecode,
      bytecode.salt,
    ]);
  }

  if (factory === getAddress(NICK_FACTORY)) {
    return `${bytecode.salt}${bytecode.creationBytecode.slice(2)}`;
  }

  throw new Error(`unsupported singleton factory ${bytecode.factory}`);
}

async function deploymentGasLimit(
  provider: JsonRpcProvider,
  bytecode: BytecodeFile,
  data: string
): Promise<bigint> {
  const outerGas = await provider.estimateGas({
    to: bytecode.factory,
    data,
  });

  if (getAddress(bytecode.factory) !== getAddress(ERC2470_FACTORY)) {
    return outerGas;
  }

  /*
   * Same workaround used by zodiac-core's deployMastercopy helper: some RPCs
   * underestimate ERC-2470 deployments because the outer factory call can
   * succeed even when the inner CREATE2 returns address(0). Include the gas
   * estimate for the raw creation bytecode so the inner deployment has enough
   * gas to actually write code.
   */
  const innerGas = await provider.estimateGas({
    data: bytecode.creationBytecode,
  });
  return outerGas + innerGas;
}

function deploymentErrorMessage(error: unknown): string {
  if (isInsufficientFundsError(error)) return "insufficient funds";
  return (error as Error)?.message || String(error);
}

async function waitForCode(
  provider: JsonRpcProvider,
  address: string
): Promise<boolean> {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = await provider.getCode(address);
    if (code !== "0x") return true;
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  return false;
}

function isInsufficientFundsError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const maybeError = error as {
    code?: unknown;
    message?: unknown;
    shortMessage?: unknown;
    cause?: unknown;
    error?: unknown;
  };
  const message = `${maybeError.message ?? ""} ${
    maybeError.shortMessage ?? ""
  }`.toLowerCase();

  return (
    maybeError.code === "INSUFFICIENT_FUNDS" ||
    message.includes("insufficient funds") ||
    message.includes("not enough funds") ||
    isInsufficientFundsError(maybeError.cause) ||
    isInsufficientFundsError(maybeError.error)
  );
}

import { resolveNetwork, rpcUrlFor } from "./networks.js";
import { rpcCall } from "./rpc.js";

/**
 * Minimal Etherscan-compatible explorer client.
 *
 * Everything `extract` needs is reachable through the explorer:
 *  - `getsourcecode`     -> verified source, ABI, compiler input, constructor args
 *  - `getcontractcreation` -> the deployment transaction hash
 *  - `eth_getTransactionByHash` (proxy module) -> the raw deployment calldata
 *
 * so no separate JSON-RPC endpoint is required for extraction.
 */

export interface SourceCode {
  contractName: string;
  sourceName: string;
  compilerVersion: string;
  compilerInput: any;
  abi: any;
  /** abi-encoded constructor arguments (hex, no leading 0x). */
  constructorArguments: string;
}

export interface ContractCreation {
  txHash?: string;
  creationBytecode?: string;
}

export interface VerificationRequest {
  address: string;
  network: string | number;
  sourceCode: string;
  contractName: string;
  compilerVersion: string;
  constructorArguments?: string;
  evmVersion?: string;
  licenseType?: string;
  apiKey?: string;
}

interface ExplorerEntry {
  SourceCode: string;
  ContractName: string;
  ContractFileName?: string;
  OptimizationUsed: string;
  Runs: string;
  EVMVersion: string;
  Library?: string;
  CompilerVersion: string;
  ABI: string;
  ConstructorArguments: string;
}

interface ExplorerResponse<T = any> {
  status: string;
  message: string;
  result: T;
}

function isOk(status: unknown): boolean {
  return String(status) === "1";
}

/**
 * Etherscan double-wraps the standard-JSON source in extra braces. Parse
 * tolerantly so both `{{...}}` and `{...}` payloads succeed.
 */
function safeJsonParse(input: string): any {
  const trimmed = input.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    return JSON.parse(trimmed.replace(/^\{|\}$/g, "").trim());
  }
}

function parseLibraries(input: string | undefined): Record<string, string> {
  const libraries: Record<string, string> = {};
  for (const entry of (input || "").split(/[;,]/)) {
    const match = entry.trim().match(/^(.+?)(?::|\s)+(0x[0-9a-fA-F]{40})$/);
    if (match) libraries[match[1].trim()] = match[2];
  }
  return libraries;
}

function compilerInputFromExplorerEntry(entry: ExplorerEntry): {
  compilerInput: any;
  sourceName: string;
} {
  const sourceCode = entry.SourceCode.trim();
  const contractName = entry.ContractName;

  if (sourceCode.startsWith("{")) {
    const compilerInput = safeJsonParse(sourceCode);
    return {
      compilerInput,
      sourceName: sourceNameFor(compilerInput, contractName),
    };
  }

  const sourceName = entry.ContractFileName || `${contractName}.sol`;
  const settings: any = {};

  if (entry.OptimizationUsed !== "") {
    settings.optimizer = {
      enabled: String(entry.OptimizationUsed) === "1",
      runs: Number(entry.Runs) || 200,
    };
  }
  if (entry.EVMVersion && entry.EVMVersion !== "Default") {
    settings.evmVersion = entry.EVMVersion;
  }

  const libraries = parseLibraries(entry.Library);
  if (Object.keys(libraries).length > 0) {
    settings.libraries = { [sourceName]: libraries };
  }

  return {
    sourceName,
    compilerInput: {
      language: "Solidity",
      sources: {
        [sourceName]: { content: sourceCode },
      },
      settings,
    },
  };
}

/**
 * Resolve the API key for an explorer request: an explicit key, then a
 * per-network Etherscan override, then the shared Etherscan key. Blockscout
 * instances (ink, bob) are public and simply ignore an unrecognized key.
 */
function resolveApiKey(network: string, explicit?: string): string {
  return (
    explicit ||
    process.env[`ETHERSCAN_API_KEY_${network.toUpperCase()}`] ||
    process.env.ETHERSCAN_API_KEY ||
    ""
  );
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const RATE_LIMIT_ATTEMPTS = 5;

/**
 * Doubling backoff (3s, 6s, 12s, 24s, 48s — 93s cumulative): public Blockscout
 * instances rate-limit on a rolling per-minute window, so retries must be able
 * to outlast a full minute.
 */
const rateLimitDelay = (attempt: number) => 3_000 * 2 ** attempt;

function isRateLimited(body: any): boolean {
  const text = `${body?.message ?? ""} ${body?.result ?? ""}`.toLowerCase();
  // "rate limit" is Etherscan phrasing, "too many requests" is Blockscout's.
  return text.includes("rate limit") || text.includes("too many requests");
}

/**
 * Internal helper to perform a GET against the explorer API.
 * Resolves network, API key, and handles rate-limiting retries.
 */
async function explorerGet<T = any>(
  networkOrChainId: string | number,
  params: Record<string, string>,
  apiKey?: string,
  attempt = 0
): Promise<ExplorerResponse<T>> {
  const network = resolveNetwork(networkOrChainId);
  if (!network.etherscanApiUrl) {
    throw new Error(
      `${network.name} (chain ${network.chainId}) is not supported by Etherscan V2.`
    );
  }

  const url = new URL(network.etherscanApiUrl);
  url.searchParams.set("apikey", resolveApiKey(network.name, apiKey));
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url);
  if (response.status === 429 && attempt < RATE_LIMIT_ATTEMPTS) {
    await sleep(rateLimitDelay(attempt));
    return explorerGet(networkOrChainId, params, apiKey, attempt + 1);
  }
  if (!response.ok) {
    throw new Error(`Explorer request failed: ${response.status}`);
  }

  const body = (await response.json()) as ExplorerResponse<T>;
  if (isRateLimited(body) && attempt < RATE_LIMIT_ATTEMPTS) {
    await sleep(rateLimitDelay(attempt));
    return explorerGet(networkOrChainId, params, apiKey, attempt + 1);
  }
  return body;
}

async function explorerPost<T = any>(
  networkOrChainId: string | number,
  params: Record<string, string>,
  apiKey?: string,
  attempt = 0
): Promise<ExplorerResponse<T>> {
  const network = resolveNetwork(networkOrChainId);
  if (!network.etherscanApiUrl) {
    throw new Error(
      `${network.name} (chain ${network.chainId}) is not supported by Etherscan V2.`
    );
  }

  const body = new URLSearchParams();
  body.set("apikey", resolveApiKey(network.name, apiKey));
  for (const [key, value] of new URL(network.etherscanApiUrl).searchParams) {
    body.set(key, value);
  }
  for (const [key, value] of Object.entries(params)) {
    body.set(key, value);
  }

  const response = await fetch(network.etherscanApiUrl, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (response.status === 429 && attempt < RATE_LIMIT_ATTEMPTS) {
    await sleep(rateLimitDelay(attempt));
    return explorerPost(networkOrChainId, params, apiKey, attempt + 1);
  }
  if (!response.ok) {
    throw new Error(`Explorer request failed: ${response.status}`);
  }

  const responseBody = (await response.json()) as ExplorerResponse<T>;
  if (isRateLimited(responseBody) && attempt < RATE_LIMIT_ATTEMPTS) {
    await sleep(rateLimitDelay(attempt));
    return explorerPost(networkOrChainId, params, apiKey, attempt + 1);
  }
  return responseBody;
}

/**
 * Fetch verified source, ABI and compiler input for a deployed contract.
 */
export async function getSourceCode({
  address,
  network,
  apiKey,
}: {
  address: string;
  network: string | number;
  apiKey?: string;
}): Promise<SourceCode> {
  const { status, message, result } = await explorerGet<ExplorerEntry[]>(
    network,
    {
      module: "contract",
      action: "getsourcecode",
      address,
    },
    apiKey
  );

  if (!isOk(status)) {
    throw new Error(
      `getsourcecode failed for ${address}: ${message}${
        result ? ` (${result})` : ""
      }`
    );
  }

  const entry = result[0];
  if (!entry?.SourceCode) {
    throw new Error(`Contract ${address} is not verified on ${network}`);
  }

  const { compilerInput, sourceName } = compilerInputFromExplorerEntry(entry);

  return {
    contractName: entry.ContractName,
    sourceName,
    compilerVersion: entry.CompilerVersion,
    compilerInput,
    abi: entry.ABI ? safeJsonParse(entry.ABI) : undefined,
    constructorArguments: entry.ConstructorArguments || "",
  };
}

/**
 * Resolve the full source path for a contract name within a standard-JSON input.
 */
function sourceNameFor(compilerInput: any, contractName: string): string {
  const sources = compilerInput?.sources || {};
  // Prefer a source file whose path basename matches the contract name.
  const match = Object.keys(sources).find(
    (path) =>
      path
        .split("/")
        .pop()
        ?.replace(/\.sol$/, "") === contractName
  );
  if (match) return match;
  const [only] = Object.keys(sources);
  if (only) return only;
  throw new Error(`Could not resolve sourceName for ${contractName}`);
}

/**
 * Get creation metadata (tx hash and bytecode) for a contract.
 */
export async function getContractCreation({
  address,
  network,
  apiKey,
}: {
  address: string;
  network: string | number;
  apiKey?: string;
}): Promise<ContractCreation | undefined> {
  const { status, result } = await explorerGet<any[]>(
    network,
    {
      module: "contract",
      action: "getcontractcreation",
      contractaddresses: address,
    },
    apiKey
  );

  if (!isOk(status) || !Array.isArray(result) || result.length === 0) {
    return undefined;
  }
  return {
    txHash: result[0].txHash,
    creationBytecode: result[0].creationBytecode,
  };
}

/**
 * Fetch a transaction (input + to) via JSON-RPC.
 *
 * This deliberately uses the network RPC rather than the explorer's `proxy`
 * module: not every Etherscan-compatible explorer exposes it (Blockscout, for
 * one, returns "Unknown module").
 */
export async function getTransaction({
  txHash,
  network,
}: {
  txHash: string;
  network: string | number;
}): Promise<{ to: string | null; input: string } | undefined> {
  const rpcUrl = rpcUrlFor(resolveNetwork(network));
  const result = await rpcCall<{ to?: string | null; input?: string } | null>(
    rpcUrl,
    "eth_getTransactionByHash",
    [txHash]
  );

  if (!result?.input) return undefined;
  return { to: result.to ?? null, input: result.input };
}

/**
 * Fetch the deployed (runtime) bytecode at an address via JSON-RPC. See
 * `getTransaction` for why this does not go through the explorer proxy module.
 */
export async function getCode({
  address,
  network,
}: {
  address: string;
  network: string | number;
}): Promise<string> {
  const rpcUrl = rpcUrlFor(resolveNetwork(network));
  const result = await rpcCall<string | null>(rpcUrl, "eth_getCode", [
    address,
    "latest",
  ]);
  return result ?? "0x";
}

/**
 * Submit standard-JSON Solidity source for verification.
 */
export async function verifySourceCode({
  address,
  network,
  sourceCode,
  contractName,
  compilerVersion,
  constructorArguments = "",
  evmVersion = "default",
  licenseType = "1",
  apiKey,
}: VerificationRequest): Promise<string> {
  const { status, message, result } = await explorerPost<string>(
    network,
    {
      module: "contract",
      action: "verifysourcecode",
      contractaddress: address,
      sourceCode,
      codeformat: "solidity-standard-json-input",
      contractname: contractName,
      compilerversion: compilerVersion,
      optimizationUsed: "0",
      runs: "200",
      constructorArguments,
      evmVersion,
      licenseType,
    },
    apiKey
  );

  if (!isOk(status)) {
    if (
      typeof result === "string" &&
      result.toLowerCase().includes("already")
    ) {
      return result;
    }
    throw new Error(`${message}${result ? ` (${result})` : ""}`);
  }
  return result;
}

/**
 * Check the async source verification status for a submitted GUID.
 */
export async function checkVerificationStatus({
  guid,
  network,
  apiKey,
}: {
  guid: string;
  network: string | number;
  apiKey?: string;
}): Promise<string> {
  const { status, message, result } = await explorerPost<string>(
    network,
    {
      module: "contract",
      action: "checkverifystatus",
      guid,
    },
    apiKey
  );

  if (!isOk(status)) {
    if (typeof result === "string" && result) return result;
    throw new Error(`${message}${result ? ` (${result})` : ""}`);
  }
  return result;
}

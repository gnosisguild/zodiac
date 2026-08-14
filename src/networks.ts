/**
 * Source-of-truth network registry.
 *
 * One entry per chain referenced across the Zodiac repos (the in-repo chain
 * list plus the chains served by `ser` and `rolesSubgraph`). Each entry carries:
 *
 *  - `chainId`          the canonical chain id
 *  - `alchemyRpcUrl`    Alchemy JSON-RPC endpoint, or null when Alchemy does
 *                       not serve the chain. The key is read from `ALCHEMY_KEY`.
 *  - `publicRpc`        public JSON-RPC endpoint, or null when no public
 *                       fallback is configured.
 *  - `etherscanApiUrl`  Etherscan V2 multichain explorer API endpoint (with
 *                       `?chainid=`), or null when the chain is not supported
 *                       by Etherscan V2. V2 support was checked against
 *                       api.etherscan.io/v2/chainlist.
 *
 * Entries are sorted by `chainId`.
 *
 * Not wired into anything yet — this is a config drop, intentionally standalone.
 */

const ETHERSCAN_V2_API = "https://api.etherscan.io/v2/api";

const alchemyKey =
  typeof process !== "undefined" ? (process.env.ALCHEMY_KEY ?? "") : "";

const ETHERSCAN_V2_CHAIN_IDS = new Set([
  1, 10, 50, 51, 56, 100, 130, 143, 146, 199, 204, 252, 480, 988, 999, 1029,
  1284, 1285, 1287, 1328, 1329, 2201, 2523, 2741, 4326, 4352, 5000, 5611, 6343,
  8453, 9745, 9746, 10143, 11124, 33111, 33139, 42161, 42220, 43114, 43522,
  59144, 80069, 80094, 81457, 167000, 167013, 560048, 737373, 747474, 11155111,
  168587773,
]);

/** Build an Alchemy RPC URL from its endpoint subdomain. */
const alchemy = (subdomain: string): string =>
  `https://${subdomain}.g.alchemy.com/v2/${alchemyKey}`;

/** Build the Etherscan V2 multichain API URL for a chain. */
const etherscanV2 = (chainId: number): string | null =>
  ETHERSCAN_V2_CHAIN_IDS.has(chainId)
    ? `${ETHERSCAN_V2_API}?chainid=${chainId}`
    : null;

export interface NetworkConfig {
  name: string;
  chainId: number;
  /** Alchemy JSON-RPC URL, or null when Alchemy does not serve this chain. */
  alchemyRpcUrl: string | null;
  /** Public JSON-RPC endpoint, or null when no fallback is configured. */
  publicRpc: string | null;
  /** Etherscan V2 multichain API URL, or null when V2 does not support it. */
  etherscanApiUrl: string | null;
}

export const networks: NetworkConfig[] = [
  {
    name: "mainnet",
    chainId: 1,
    alchemyRpcUrl: alchemy("eth-mainnet"),
    publicRpc: null,
    etherscanApiUrl: etherscanV2(1),
  },
  {
    name: "optimism",
    chainId: 10,
    alchemyRpcUrl: alchemy("opt-mainnet"),
    publicRpc: null,
    etherscanApiUrl: etherscanV2(10),
  },
  {
    name: "flare",
    chainId: 14,
    alchemyRpcUrl: null,
    publicRpc: "https://flare-api.flare.network/ext/C/rpc",
    etherscanApiUrl: null,
  },
  {
    name: "bnb",
    chainId: 56,
    alchemyRpcUrl: alchemy("bnb-mainnet"),
    publicRpc: "https://bsc-dataseed.bnbchain.org",
    etherscanApiUrl: etherscanV2(56),
  },
  {
    name: "gnosis",
    chainId: 100,
    alchemyRpcUrl: null,
    publicRpc: "https://rpc.gnosischain.com",
    etherscanApiUrl: etherscanV2(100),
  },
  {
    name: "unichain",
    chainId: 130,
    alchemyRpcUrl: alchemy("unichain-mainnet"),
    publicRpc: "https://mainnet.unichain.org",
    etherscanApiUrl: etherscanV2(130),
  },
  {
    name: "polygon",
    chainId: 137,
    alchemyRpcUrl: alchemy("polygon-mainnet"),
    publicRpc: null,
    etherscanApiUrl: etherscanV2(137),
  },
  {
    name: "sonic",
    chainId: 146,
    alchemyRpcUrl: null,
    publicRpc: "https://rpc.soniclabs.com",
    etherscanApiUrl: etherscanV2(146),
  },
  {
    name: "worldchain",
    chainId: 480,
    alchemyRpcUrl: null,
    publicRpc: "https://worldchain-mainnet.g.alchemy.com/public",
    etherscanApiUrl: etherscanV2(480),
  },
  {
    name: "hyperevm",
    chainId: 999,
    alchemyRpcUrl: null, //alchemy("hyperliquid-mainnet"),
    publicRpc: "https://rpc.hyperliquid.xyz/evm",
    etherscanApiUrl: etherscanV2(999),
  },
  {
    name: "megaeth",
    chainId: 4326,
    alchemyRpcUrl: alchemy("megaeth-mainnet"),
    publicRpc: null,
    etherscanApiUrl: etherscanV2(4326),
  },
  {
    name: "mantle",
    chainId: 5000,
    alchemyRpcUrl: alchemy("mantle-mainnet"),
    publicRpc: null,
    etherscanApiUrl: etherscanV2(5000),
  },
  {
    name: "base",
    chainId: 8453,
    alchemyRpcUrl: alchemy("base-mainnet"),
    publicRpc: null,
    etherscanApiUrl: etherscanV2(8453),
  },
  {
    name: "plasma",
    chainId: 9745,
    alchemyRpcUrl: null,
    publicRpc: "https://rpc.plasma.to",
    etherscanApiUrl: etherscanV2(9745),
  },
  {
    name: "arbitrum",
    chainId: 42161,
    alchemyRpcUrl: alchemy("arb-mainnet"),
    publicRpc: null,
    etherscanApiUrl: etherscanV2(42161),
  },
  {
    name: "celo",
    chainId: 42220,
    alchemyRpcUrl: alchemy("celo-mainnet"),
    publicRpc: null,
    etherscanApiUrl: etherscanV2(42220),
  },
  {
    name: "avalanche",
    chainId: 43114,
    alchemyRpcUrl: alchemy("avax-mainnet"),
    publicRpc: null,
    etherscanApiUrl: etherscanV2(43114),
  },
  {
    name: "ink",
    chainId: 57073,
    alchemyRpcUrl: alchemy("ink-mainnet"),
    publicRpc: "https://rpc-gel.inkonchain.com",
    etherscanApiUrl: null,
  },
  {
    name: "linea",
    chainId: 59144,
    alchemyRpcUrl: alchemy("linea-mainnet"),
    publicRpc: null,
    etherscanApiUrl: etherscanV2(59144),
  },
  {
    name: "bob",
    chainId: 60808,
    alchemyRpcUrl: null,
    publicRpc: "https://rpc.gobob.xyz",
    etherscanApiUrl: null,
  },
  {
    name: "berachain",
    chainId: 80094,
    alchemyRpcUrl: null,
    publicRpc: "https://rpc.berachain.com",
    etherscanApiUrl: etherscanV2(80094),
  },
  {
    name: "scroll",
    chainId: 534352,
    alchemyRpcUrl: alchemy("scroll-mainnet"),
    publicRpc: null,
    etherscanApiUrl: null,
  },
  {
    name: "robinhood",
    chainId: 4663,
    alchemyRpcUrl: alchemy("robinhood-mainnet"),
    publicRpc: null,
    etherscanApiUrl: etherscanV2(4663),
  },
  {
    name: "katana",
    chainId: 747474,
    alchemyRpcUrl: null,
    publicRpc: "https://rpc.katana.network",
    etherscanApiUrl: etherscanV2(747474),
  },
  {
    name: "sepolia",
    chainId: 11155111,
    alchemyRpcUrl: alchemy("eth-sepolia"),
    publicRpc: null,
    etherscanApiUrl: etherscanV2(11155111),
  },
];

/**
 * Resolve a network name or chain id (string or number) to its config. An
 * unknown name throws; an unknown numeric chain id resolves to an Etherscan V2
 * entry only when that chain is listed by Etherscan V2.
 */
export function resolveNetwork(
  networkOrChainId: string | number
): NetworkConfig {
  const key = String(networkOrChainId).toLowerCase();
  const found = networks.find(
    (n) => n.name.toLowerCase() === key || String(n.chainId) === key
  );
  if (found) return found;

  if (/^\d+$/.test(key)) {
    const chainId = Number(key);
    return {
      name: key,
      chainId,
      alchemyRpcUrl: null,
      publicRpc: null,
      etherscanApiUrl: etherscanV2(chainId),
    };
  }

  throw new Error(
    `Unknown network "${networkOrChainId}". Known networks: ${networks
      .map((n) => n.name)
      .join(", ")} (or pass a numeric chain id).`
  );
}

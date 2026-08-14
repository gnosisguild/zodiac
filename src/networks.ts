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
 *  - `etherscanApiUrl`  explorer API endpoint, or null when none is configured.
 *                       Most chains use the Etherscan V2 multichain endpoint
 *                       (with `?chainid=`); chains not on Etherscan V2 get a
 *                       chain-specific Etherscan-compatible explorer instead —
 *                       a Blockscout instance (ink, bob) or another
 *                       Etherscan-family explorer (scrollscan, flarescan).
 *                       Etherscan V2 support was checked against
 *                       api.etherscan.io/v2/chainlist. The endpoint serves both
 *                       reads and contract verification; `eth_*` calls go to the
 *                       JSON-RPC URL instead (see `rpcUrlFor`), as Blockscout
 *                       has no Etherscan `proxy` module.
 *
 * Entries are sorted by `chainId`.
 *
 * Not wired into anything yet — this is a config drop, intentionally standalone.
 */

const ETHERSCAN_V2_API = "https://api.etherscan.io/v2/api";

const alchemyKey =
  typeof process !== "undefined" ? (process.env.ALCHEMY_KEY ?? "") : "";

const ETHERSCAN_V2_CHAIN_IDS = new Set([
  1, 10, 50, 51, 56, 97, 100, 130, 137, 143, 146, 199, 204, 252, 480, 988, 999,
  1029, 1284, 1285, 1287, 1301, 1328, 1329, 2201, 2523, 2741, 4326, 4352, 4801,
  5000, 5003, 5611, 6343, 8453, 9745, 9746, 10143, 11124, 14601, 33111, 33139,
  42161, 42220, 43113, 43114, 43522, 59141, 59144, 80002, 80069, 80094, 81457,
  84532, 167000, 167013, 421614, 560048, 737373, 747474, 11142220, 11155111,
  11155420, 168587773,
]);

/** Build an Alchemy RPC URL from its endpoint subdomain. */
const alchemy = (subdomain: string): string =>
  `https://${subdomain}.g.alchemy.com/v2/${alchemyKey}`;

/** Build the Etherscan V2 multichain API URL for a chain. */
const etherscanV2 = (chainId: number): string | null =>
  ETHERSCAN_V2_CHAIN_IDS.has(chainId)
    ? `${ETHERSCAN_V2_API}?chainid=${chainId}`
    : null;

/**
 * Resolve a JSON-RPC URL for a network: Alchemy when an `ALCHEMY_KEY` is set
 * and Alchemy serves the chain, otherwise the configured public RPC, otherwise
 * the Gnosis Guild multichain RPC fallback. Always returns a usable URL.
 */
export function rpcUrlFor(network: NetworkConfig): string {
  if (network.alchemyRpcUrl && (process.env.ALCHEMY_KEY ?? "")) {
    return network.alchemyRpcUrl;
  }
  return network.publicRpc ?? `https://rpc.gnosisguild.org/${network.chainId}`;
}

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
    // Blockscout instance (not on Etherscan V2); public, ignores API key.
    etherscanApiUrl: "https://flare-explorer.flare.network/api",
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
    // Blockscout instance (not on Etherscan V2); public, ignores API key.
    etherscanApiUrl: "https://explorer.inkonchain.com/api",
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
    // Blockscout instance (not on Etherscan V2); public, ignores API key.
    etherscanApiUrl: "https://explorer.gobob.xyz/api",
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
    // Etherscan-family explorer (not on Etherscan V2); uses ETHERSCAN_API_KEY.
    etherscanApiUrl: "https://scrollscan.com/api",
  },
  {
    name: "robinhood",
    chainId: 4663,
    alchemyRpcUrl: alchemy("robinhood-mainnet"),
    publicRpc: "https://rpc.mainnet.chain.robinhood.com",
    // Blockscout instance (not on Etherscan V2); public, ignores API key.
    etherscanApiUrl: "https://robinhoodchain.blockscout.com/api",
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
 * unknown name throws; an unknown numeric chain id resolves to a synthetic
 * entry whose explorer API is Etherscan V2 when supported, otherwise null.
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

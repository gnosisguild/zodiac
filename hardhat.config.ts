import "@nomicfoundation/hardhat-toolbox";

import dotenv from "dotenv";
import yargs from "yargs";

import type { HttpNetworkUserConfig } from "hardhat/types";
import "hardhat-change-network";

const { network } = yargs
  .option("network", {
    type: "string",
    default: "hardhat",
  })
  .help(false)
  .version(false)
  .parseSync();

// Load environment variables.
dotenv.config();
const { INFURA_KEY, MNEMONIC, ETHERSCAN_API_KEY, PK, ALCHEMY_KEY } =
  process.env;

import "./tasks/singleton-deployment";
import "./tasks/deploy-replay";

const DEFAULT_MNEMONIC =
  "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";

const sharedNetworkConfig: HttpNetworkUserConfig = {};
if (PK) {
  sharedNetworkConfig.accounts = [PK];
} else {
  sharedNetworkConfig.accounts = {
    mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
  };
}

if (
  ["mainnet", "goerli", "sepolia", "ropsten"].includes(network) &&
  INFURA_KEY === undefined
) {
  throw new Error(
    `Could not find Infura key in env, unable to connect to network ${network}`
  );
}

export default {
  paths: {
    artifacts: "build/artifacts",
    cache: "build/cache",
    deploy: "src/deploy",
    sources: "contracts",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      { version: "0.6.12" },
    ],
  },
  networks: {
    mainnet: {
      ...sharedNetworkConfig,
      url: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    },
    gnosis: {
      ...sharedNetworkConfig,
      url: "https://rpc.gnosischain.com",
    },
    goerli: {
      ...sharedNetworkConfig,
      url: `https://goerli.infura.io/v3/${INFURA_KEY}`,
    },
    sepolia: {
      ...sharedNetworkConfig,
      url: `https://sepolia.infura.io/v3/${INFURA_KEY}`,
    },
    arbitrum: {
      ...sharedNetworkConfig,
      url: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    },
    optimism: {
      ...sharedNetworkConfig,
      url: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    },
    polygon: {
      ...sharedNetworkConfig,
      url: "https://rpc.ankr.com/polygon",
    },
    mumbai: {
      ...sharedNetworkConfig,
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    },
    avalanche: {
      ...sharedNetworkConfig,
      url: `https://avalanche-mainnet.infura.io/v3/${INFURA_KEY}`,
    },
    bsc: {
      ...sharedNetworkConfig,
      url: "https://bsc-dataseed.binance.org",
    },
    lineaGoerli: {
      ...sharedNetworkConfig,
      url: `https://linea-goerli.infura.io/v3/${INFURA_KEY}`,
    },
    linea: {
      ...sharedNetworkConfig,
      url: `https://linea.infura.io/v3/${INFURA_KEY}`,
    },
    core: {
      ...sharedNetworkConfig,
      url: "https://rpc.coredao.org",
    },
    coreTestnet: {
      ...sharedNetworkConfig,
      url: "https://rpc.test.btcs.network",
    },
    base: {
      ...sharedNetworkConfig,
      url: "https://mainnet.base.org",
    },
    baseSepolia: {
      ...sharedNetworkConfig,
      url: "https://sepolia.base.org",
    },
    berachain: {
      ...sharedNetworkConfig,
      url: "https://rpc.berachain.com",
    },
    sonic: {
      ...sharedNetworkConfig,
      url: "'https://rpc.soniclabs.com'",
    },
    celo: {
      ...sharedNetworkConfig,
      url: "https://forno.celo.org",
    },
    zkEvm: {
      ...sharedNetworkConfig,
      url: "https://zkevm-rpc.com",
    },
    mantle: {
      ...sharedNetworkConfig,
      url: "https://rpc.mantle.xyz",
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  mocha: {
    timeout: 2000000,
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
    customChains: [
      {
        network: "coreTestnet",
        chainId: 1115,
        urls: {
          apiURL: "https://api.test.btcs.network/api",
          browserURL: "https://scan.test.btcs.network/",
        },
      },
      {
        network: "core",
        chainId: 1116,
        urls: {
          apiURL: "https://openapi.coredao.org/api",
          browserURL: "https://scan.coredao.org/",
        },
      },
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org/",
        },
      },
      {
        network: "linea",
        chainId: 59144,
        urls: {
          apiURL: "https://api.lineascan.build/api",
          browserURL: "https://lineascan.build/",
        },
      },
    ],
  },
};

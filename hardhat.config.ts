import "@nomicfoundation/hardhat-toolbox";

import dotenv from "dotenv";
import type { HttpNetworkUserConfig } from "hardhat/types";
import yargs from "yargs";
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

// import "./tasks/singleton-deployment.ts";
// import "./tasks/deploy-replay.ts";
// import "./tasks/verify-contracts.ts";

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
                version: "0.8.6",
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
        arbitrumSepolia: {
            ...sharedNetworkConfig,
            url: `https://arb-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
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
        flare: {
            ...sharedNetworkConfig,
            url: `https://flare-api-tracer.flare.network/ext/C/rpc?x-apikey=29949e05-d984-45f4-a5ee-ab00887292f6`,
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
                network: "flare",
                chainId: 14,
                urls: {
                    apiURL: "https://flare-explorer.flare.network/api",
                    browserURL: "https://flare-explorer.flare.network",
                },
            },
        ],
    },
};

import dotenv from "dotenv";
import { ContractAddresses } from "../src/factory/contracts";

import { KnownContracts } from "../src/factory/types";
import {
  setupNewNotificationChannel,
  createSentinelForModuleFactory,
  setupClients,
  createAutotaskForModuleFactory,
} from "./defender";
import { defenderNetworkToSupportedNetwork } from "./defender/util";

dotenv.config();

const NETWORK = "goerli"; // for testing

const API_KEY = process.env.OZ_DEFENDER_API_KEY;
if (API_KEY == null) {
  throw new Error("API_KEY is not defined");
}
const API_SECRET = process.env.OZ_DEFENDER_API_SECRET;
if (API_SECRET == null) {
  throw new Error("API_SECRET is not defined");
}
const DISCORD_URL_WITH_KEY = process.env.DISCORD_URL_WITH_KEY;
if (DISCORD_URL_WITH_KEY == null) {
  throw new Error("DISCORD_URL_WITH_KEY is not defined");
}

const RPC_URL = process.env.RPC_URL;
if (RPC_URL == null) {
  throw new Error("RPC_URL is not defined");
}

const EXPLORER_URL = process.env.EXPLORER_URL;
if (EXPLORER_URL == null) {
  throw new Error("EXPLORER_URL is not defined");
}

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
if (ETHERSCAN_API_KEY == null) {
  throw new Error("ETHERSCAN_API_KEY is not defined");
}

const setup = async () => {
  const clients = setupClients({
    apiKey: API_KEY,
    apiSecret: API_SECRET,
  });
  const sentinelClient = clients.sentinel;
  const autotaskClient = clients.autotask;
  console.log("Client is ready");

  const notificationChannelId = await setupNewNotificationChannel(
    sentinelClient,
    "discord",
    {
      url: DISCORD_URL_WITH_KEY,
    }
  );

  const moduleMastercopyAddress =
    ContractAddresses[defenderNetworkToSupportedNetwork(NETWORK)][
      KnownContracts.REALITY_ETH
    ];

  const factoryMastercopyAddress =
    ContractAddresses[defenderNetworkToSupportedNetwork(NETWORK)][
      KnownContracts.FACTORY
    ];

  const autotaskId = await createAutotaskForModuleFactory(
    autotaskClient,
    RPC_URL,
    DISCORD_URL_WITH_KEY,
    moduleMastercopyAddress,
    factoryMastercopyAddress,
    EXPLORER_URL,
    ETHERSCAN_API_KEY
  );

  const sentinelCreationResponds = await createSentinelForModuleFactory(
    sentinelClient,
    [notificationChannelId],
    NETWORK,
    KnownContracts.REALITY_ETH,
    autotaskId
  );
  console.log("Sentinel creation responds", sentinelCreationResponds);
};

setup();

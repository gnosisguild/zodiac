import {
  AutotaskClient,
  CreateAutotaskRequest,
} from "defender-autotask-client";
import { Network } from "defender-base-client";
import {
  CreateSentinelRequest,
  NotificationType,
  SentinelClient,
} from "defender-sentinel-client";
import { ContractAbis, ContractAddresses } from "../../src/factory/contracts";
import { KnownContracts } from "../../src/factory/types";
import {
  defenderNetworkToSupportedNetwork,
  packageCode,
  readFileAndReplace,
} from "./util";
export { NotificationType } from "defender-sentinel-client";

export const setupClients = ({
  apiKey,
  apiSecret,
}: {
  apiKey: string;
  apiSecret: string;
}) => {
  return {
    sentinel: new SentinelClient({ apiKey, apiSecret }),
    autotask: new AutotaskClient({ apiKey, apiSecret }),
  };
};

export const setupNewNotificationChannel = async (
  client: SentinelClient,
  channel: NotificationType,
  config: any
) => {
  const notificationChannel = await client.createNotificationChannel({
    type: channel,
    name: `ZodiacRealityModuleNotification-${channel}`,
    config,
    paused: false,
  });
  console.log(
    "Created Notification Channel with ID: ",
    notificationChannel.notificationId
  );

  return notificationChannel.notificationId;
};

/**
 *
 * @param client The SentinelClient
 * @param notificationChannels Where to send notifications
 * @param network What network to monitor
 * @param module The module from the `KnownContracts`
 * @param autotaskId Optional: ID of autotask to run when the sentinel triggers
 * @returns
 */
export const createSentinelForModuleFactory = async (
  client: SentinelClient,
  notificationChannels: string[],
  network: Network,
  module: KnownContracts,

  autotaskId?: string
) => {
  const moduleMastercopyAddress =
    ContractAddresses[defenderNetworkToSupportedNetwork(network)][module];
  const moduleProxyFactoryAddress =
    ContractAddresses[defenderNetworkToSupportedNetwork(network)][
      KnownContracts.FACTORY
    ];
  const requestParameters: CreateSentinelRequest = {
    type: "BLOCK",
    network,
    name: `New ${module} Module is set up via the Module Factory on (${network})`,
    addresses: [moduleProxyFactoryAddress],
    paused: false,
    abi: ContractAbis[KnownContracts.FACTORY],
    eventConditions: [
      {
        eventSignature: "ModuleProxyCreation(address,address)", // ModuleProxyCreation(proxy, mastercopy)
        expression: '$1 == "' + moduleMastercopyAddress + '"',
      },
    ],
    autotaskTrigger: autotaskId,
    notificationChannels: notificationChannels,
  };

  const sentinel = await client.create(requestParameters);
  console.log("Created Sentinel with subscriber ID: ", sentinel.subscriberId);

  return sentinel.subscriberId;
};

/**
 *
 * @param client The AutotaskClient
 * @param rpcUrl URL to generate Json Rpc Provider
 * @param discordWebHookUrl Discord URL with key
 * @returns
 */
export const createAutotaskForModuleFactory = async (
  client: AutotaskClient,
  rpcUrl: string,
  discordWebHookUrl: string
) => {
  const code = readFileAndReplace(
    "monitoring/defender/autotask/on_module_factory_events.js",
    {
      "{{rpcUrl}}": rpcUrl,
      "{{discordWebHookUrl}}": discordWebHookUrl,
    }
  );
  const params: CreateAutotaskRequest = {
    name: "Reality Module Autotask",
    encodedZippedCode: await packageCode(code),
    trigger: {
      type: "webhook",
    },
    paused: false,
  };
  const createdAutotask = await client.create(params);
  console.log("Created Autotask with ID: ", createdAutotask.autotaskId);
  return createdAutotask.autotaskId;
};

import { Network } from "defender-base-client";
import {
  CreateSentinelRequest,
  NotificationType,
  SentinelClient,
} from "defender-sentinel-client";
import { ContractAbis, ContractAddresses } from "../../src/factory/contracts";
import { KnownContracts } from "../../src/factory/types";
import { defenderNetworkToSupportedNetwork } from "./util";

export { NotificationType } from "defender-sentinel-client";

export const setupSentinelClient = ({
  apiKey,
  apiSecret,
}: {
  apiKey: string;
  apiSecret: string;
}) => new SentinelClient({ apiKey, apiSecret });

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
    name: `New ${module} Module is set up via the Module Factory on ${network})`,
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

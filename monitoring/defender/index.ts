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
import { packageCode, readFileAndReplace } from "../util";
import autotaskJsCode from "./autotasks/on_new_question_from_module";
export { NotificationType } from "defender-sentinel-client";

export const setupSentinelClient = ({ apiKey, apiSecret }) =>
  new SentinelClient({ apiKey, apiSecret });

export const setupAutotaskClient = ({ apiKey, apiSecret }) =>
  new AutotaskClient({ apiKey, apiSecret });

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
 * @param moduleMasterCopyAddress Address of master copy of the module
 * @param moduleName Name of the module. For nice notification messages
 * @param autotaskId Optional: ID of autotask to run when the sentinel triggers
 * @returns
 */
export const createSentinelForModuleFactory = async (
  client: SentinelClient,
  notificationChannels: string[],
  network: Network,
  moduleMasterCopyAddress: string,
  moduleName: string,
  autotaskId?: string
) => {
  const requestParameters: CreateSentinelRequest = {
    type: "BLOCK",
    network,
    name: `New ${moduleName} Module is set up (${moduleMasterCopyAddress} on ${network})`,
    addresses: [moduleMasterCopyAddress],
    paused: false,
    abi: `[{
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "questionId",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "proposalId",
          "type": "string"
        }
      ],
      "name": "ProposalQuestionCreated",
      "type": "event"
    }]`,
    eventConditions: [
      {
        eventSignature: "ProposalQuestionCreated(bytes32,string)",
      },
    ],
    autotaskTrigger: autotaskId,
    notificationChannels: notificationChannels,
  };

  const sentinel = await client.create(requestParameters);
  console.log("Created Sentinel with subscriber ID: ", sentinel.subscriberId);

  return sentinel.subscriberId;
};

export const createAutotask = async (
  client: AutotaskClient,
  oracleAddress: string,
  notificationChannels: string[],
  network: string,
  apiKey: string,
  apiSecret: string
) => {
  const code = readFileAndReplace(autotaskJsCode as unknown as string, {
    "{{network}}": network,
    "{{oracleAddress}}": oracleAddress,
    "{{notificationChannels}}": JSON.stringify(notificationChannels),
    "{{apiKey}}": apiKey,
    "{{apiSecret}}": apiSecret,
  });

  const params: CreateAutotaskRequest = {
    name: "Setup Sentinel for new Reality.eth question",
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

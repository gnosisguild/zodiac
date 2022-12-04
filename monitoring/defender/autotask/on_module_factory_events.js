const { ethers } = require("ethers");
const axios = require("axios");

const MIN_TIMEOUT = 86400; // 1 Day
const MIN_COOLDOWN = 0;
const MIN_BOND = 0.1;

const NETWORKS = {
  1: {
    name: "mainnet",
    networkExplorerUrl: "https://etherscan.io",
  },
  5: {
    name: "goerli",
    networkExplorerUrl: "https://goerli.etherscan.io",
  },
  100: {
    name: "gnosis_chain",
    networkExplorerUrl: "https://blockscout.com/xdai/mainnet",
  },
};

const DISCORD_PARAMS = {
  username: "zodiacbot",
  avatar_url: "",
  tts: false,
  content: "",
  embeds: [],
};

const REALITY_ETH_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_avatar",
        type: "address",
      },
      {
        internalType: "address",
        name: "_target",
        type: "address",
      },
      {
        internalType: "contract RealitioV3",
        name: "_oracle",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "timeout",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "cooldown",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "expiration",
        type: "uint32",
      },
      {
        internalType: "uint256",
        name: "bond",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "templateId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "arbitrator",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousAvatar",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newAvatar",
        type: "address",
      },
    ],
    name: "AvatarSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "guard",
        type: "address",
      },
    ],
    name: "ChangedGuard",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "questionId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "string",
        name: "proposalId",
        type: "string",
      },
    ],
    name: "ProposalQuestionCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "initiator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "avatar",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "RealityModuleSetup",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousTarget",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newTarget",
        type: "address",
      },
    ],
    name: "TargetSet",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "INVALIDATED",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TRANSACTION_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "proposalId",
        type: "string",
      },
      {
        internalType: "bytes32[]",
        name: "txHashes",
        type: "bytes32[]",
      },
    ],
    name: "addProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "proposalId",
        type: "string",
      },
      {
        internalType: "bytes32[]",
        name: "txHashes",
        type: "bytes32[]",
      },
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
    ],
    name: "addProposalWithNonce",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "answerExpiration",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "avatar",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "proposalId",
        type: "string",
      },
      {
        internalType: "bytes32[]",
        name: "txHashes",
        type: "bytes32[]",
      },
    ],
    name: "buildQuestion",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "proposalId",
        type: "string",
      },
      {
        internalType: "bytes32[]",
        name: "txHashes",
        type: "bytes32[]",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "enum Enum.Operation",
        name: "operation",
        type: "uint8",
      },
    ],
    name: "executeProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "proposalId",
        type: "string",
      },
      {
        internalType: "bytes32[]",
        name: "txHashes",
        type: "bytes32[]",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "enum Enum.Operation",
        name: "operation",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "txIndex",
        type: "uint256",
      },
    ],
    name: "executeProposalWithIndex",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "executedProposalTransactions",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "enum Enum.Operation",
        name: "operation",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
    ],
    name: "generateTransactionHashData",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getChainId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getGuard",
    outputs: [
      {
        internalType: "address",
        name: "_guard",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "question",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
    ],
    name: "getQuestionId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "enum Enum.Operation",
        name: "operation",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
    ],
    name: "getTransactionHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "guard",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "proposalId",
        type: "string",
      },
      {
        internalType: "bytes32[]",
        name: "txHashes",
        type: "bytes32[]",
      },
    ],
    name: "markProposalAsInvalid",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "questionHash",
        type: "bytes32",
      },
    ],
    name: "markProposalAsInvalidByHash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "questionHash",
        type: "bytes32",
      },
    ],
    name: "markProposalWithExpiredAnswerAsInvalid",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "minimumBond",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "oracle",
    outputs: [
      {
        internalType: "contract RealitioV3",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "questionArbitrator",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "questionCooldown",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "questionIds",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "questionTimeout",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "expiration",
        type: "uint32",
      },
    ],
    name: "setAnswerExpiration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "arbitrator",
        type: "address",
      },
    ],
    name: "setArbitrator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_avatar",
        type: "address",
      },
    ],
    name: "setAvatar",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_guard",
        type: "address",
      },
    ],
    name: "setGuard",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bond",
        type: "uint256",
      },
    ],
    name: "setMinimumBond",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "cooldown",
        type: "uint32",
      },
    ],
    name: "setQuestionCooldown",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "timeout",
        type: "uint32",
      },
    ],
    name: "setQuestionTimeout",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_target",
        type: "address",
      },
    ],
    name: "setTarget",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "templateId",
        type: "uint256",
      },
    ],
    name: "setTemplate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "initParams",
        type: "bytes",
      },
    ],
    name: "setUp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "target",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "template",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

exports.handler = async function (event) {
  console.log(
    "\n\n/************************** EVENT *****************************/"
  );
  console.log(JSON.stringify(event));
  console.log(
    "/**********************************************************/\n\n"
  );
  if (event && event.request && event.request.body) {
    // variables from autotask creation
    const nodeProvider = "{{nodeProvider}}";
    const discordWebHookUrl = "{{discordWebHookUrl}}";
    const transaction = event.request.body.transaction;
    const chainId = event.request.body.sentinel.chainId;
    const txHash = transaction.transactionHash;
    const provider = new ethers.providers.JsonRpcProvider(nodeProvider);
    const tx = await provider.getTransactionReceipt(txHash);
    const utils = ethers.utils;
    console.log(
      "\n\n/*********************** TRANSACTION **************************/"
    );
    const sig = "ModuleProxyCreation(address,address)"; //ModuleProxyCreation (index_topic_1 address proxy, index_topic_2 address masterCopy)
    const bytes = utils.toUtf8Bytes(sig);
    const keccak = utils.keccak256(bytes);
    let proxyTopic = "";
    const logs = tx.logs || [];
    console.log("logs", JSON.stringify(logs));
    if (logs) {
      logs.forEach((logs) => {
        if (logs.topics) {
          logs.topics.forEach((topic, topicIndex) => {
            if (topic === keccak) {
              proxyTopic = logs.topics[topicIndex + 1]; // Position 0 = keccak, Position 1 = address proxy, Position 2 = address masterCopy
            }
          });
        }
      });
    }
    const proxyAddress = utils.defaultAbiCoder.decode(["address"], proxyTopic); // Returns an array
    const realityContract = new ethers.Contract(
      proxyAddress[0],
      REALITY_ETH_ABI,
      provider
    );
    const questionTimeout = await realityContract.questionTimeout();
    const questionCooldown = await realityContract.questionCooldown();
    const bond = await realityContract.minimumBond();
    const minBond = utils.parseUnits(MIN_BOND.toString(), 18);
    let invalidTimeout = false;
    let invalidCooldown = false;
    let invalidBond = false;
    if (questionTimeout < MIN_TIMEOUT) {
      invalidTimeout = true;
    }
    if (questionCooldown < MIN_COOLDOWN) {
      invalidCooldown = true;
    }
    if (bond.toString() < minBond.toString()) {
      invalidBond = true;
    }
    console.log("txHash", txHash);
    console.log("invalidTimeout", invalidTimeout);
    console.log("invalidCooldown", invalidCooldown);
    console.log("invalidBond", invalidBond);
    if ([invalidBond, invalidCooldown, invalidTimeout].includes(true)) {
      const params = DISCORD_PARAMS;
      let invalidInputs = "";
      if (invalidTimeout) {
        invalidInputs = `Timeout (Min expected -  ${MIN_TIMEOUT}) = ${questionTimeout}\n`;
      }
      if (invalidCooldown) {
        invalidInputs = `${invalidInputs}Cooldown (Min expected -  ${MIN_COOLDOWN}) = ${questionCooldown}\n`;
      }
      if (invalidBond) {
        invalidInputs = `${invalidInputs}Minimum Bond (Min expected - ${minBond.toString()}) = ${bond.toString()}\n`;
      }
      params.embeds = [
        {
          type: "rich",
          title: `⚡ Autotask Notification - Some inputs from Reality Module didn't pass the validations ⚡`,
          description: `A matching transaction was detected on ${NETWORKS[chainId].name}`,
          color: 0x0e0e0e,
          fields: [
            {
              name: `Network`,

              value: `${NETWORKS[chainId].name}`,
            },
            {
              name: `Hash`,
              value: txHash,
            },
            {
              name: `Link`,

              value: `${NETWORKS[chainId].networkExplorerUrl}/tx/${txHash}`,
            },
            {
              name: `Invalid Inputs`,
              value: invalidInputs,
            },
          ],
          url: `${NETWORKS[chainId].networkExplorerUrl}/tx/${txHash}`,
        },
      ];
      await axios.post(discordWebHookUrl, params);
    }
    console.log(
      "/**********************************************************/\n\n"
    );
  }
};

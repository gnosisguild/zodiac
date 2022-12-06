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
const ENS_REGISTRY = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"; // ENS: Registry with Fallback (singleton same address on different chains)
const ABI_REGISTRY = [
  "function owner(bytes32 node) external view returns (address)",
  "function resolver(bytes32 node) external view returns (address)",
];
const ENS_BASE_REGISTRAR_GOERLI = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85";
const ENS_BASE_REGISTRAR_MAINNET = "0x8436F16c090B0A6B2A7ae4CfCc82E007302a4b38";
const ABI_BASE_REGISTRAR = [
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];

/**
 *
 * @param {number} chainId
 * @returns {string}
 */
const getBaseRegistrarContractAddress = (chainId) => {
  if (chainId === 1) {
    return ENS_BASE_REGISTRAR_MAINNET;
  }
  if (chainId === 5) {
    return ENS_BASE_REGISTRAR_GOERLI;
  }
};

/**
 *
 * @param {*} provider Ethers.providers.Provider,
 * @param {string} ensName Ens name
 * @param {string} address Avatar address
 * @returns {boolean}
 */
const checkIfIsController = async (provider, ensName, address) => {
  const ensRegistryContract = new ethers.Contract(
    ENS_REGISTRY,
    ABI_REGISTRY,
    provider
  );
  const nameHash = ethers.utils.namehash(ensName);
  const owner = await ensRegistryContract.owner(nameHash);
  return ethers.utils.getAddress(address) === ethers.utils.getAddress(owner);
};

/**
 * Grab the owner using https://docs.ens.domains/dapp-developer-guide/ens-as-nft#deriving-tokenid-from-ens-name
 * @param {*} provider Ethers.providers.Provider,
 * @param {string} ensName Ens name
 * @param {string} address Avatar address
 * @param {number} chainId Chain Id
 * @returns {boolean}
 */
const checkIfIsOwner = async (provider, ensName, address, chainId) => {
  const contract = new ethers.Contract(
    getBaseRegistrarContractAddress(chainId),
    ABI_BASE_REGISTRAR,
    provider
  );
  const BigNumber = ethers.BigNumber;
  const utils = ethers.utils;
  const name = ensName.replace(".eth", "");
  const labelHash = utils.keccak256(utils.toUtf8Bytes(name));
  const tokenId = BigNumber.from(labelHash).toString();
  const ensOwner = await contract.ownerOf(tokenId);
  return ethers.utils.getAddress(address) === ethers.utils.getAddress(ensOwner);
};

/**
 *
 * @param {Array} logs //Array of transactions logs
 * @param {*} utils //EtherJS utils
 * @returns
 */
const decode = async (logs, utils) => {
  const sig = "ModuleProxyCreation(address,address)"; //ModuleProxyCreation (index_topic_1 address proxy, index_topic_2 address masterCopy)
  const templateSig = "LogNewTemplate(uint256,address,string)"; //LogNewTemplate (index_topic_1 uint256 template_id, index_topic_2 address user, string question_text)
  const bytes = utils.toUtf8Bytes(sig);
  const templateBytes = utils.toUtf8Bytes(templateSig);
  const keccak = utils.keccak256(bytes);
  const templateKeccak = utils.keccak256(templateBytes);
  if (logs) {
    const newRealityModuleProxies = logs
      .filter((log) => log.topics !== null)
      .filter((log) => log.topics[0] === keccak)
      .map((log) => {
        const proxy = utils.defaultAbiCoder.decode(
          ["address"],
          log.topics[1]
        )[0];
        const mastercopy = utils.defaultAbiCoder.decode(
          ["address"],
          log.topics[2]
        )[0];
        const values = [proxy, mastercopy].map((_) => _.toLowerCase());
        return { proxy: values[0], mastercopy: values[1] };
      });

    const newRealityModuleTemplate = logs
      .filter((log) => log.topics !== null)
      .filter((log) => log.topics[0] === templateKeccak);
    const templateQuestionText = utils.defaultAbiCoder.decode(
      ["string"],
      newRealityModuleTemplate[0].data
    );
    return {
      proxyAddress: newRealityModuleProxies[0].proxy,
      templateQuestionText: templateQuestionText[0],
    };
  }
};

/**
 *
 * @param {number} questionTimeout
 * @param {number} questionCooldown
 * @param {number} bond
 * @param {boolean} isController
 * @param {boolean} isOwner
 * @param {string} ensName
 * @param {number} chainId
 * @param {string} txHash
 * @returns
 */
const generateDiscordParams = (
  questionTimeout,
  questionCooldown,
  bond,
  isController,
  isOwner,
  ensName,
  chainId,
  txHash
) => {
  const minBond = ethers.utils.parseUnits(MIN_BOND.toString(), 18);
  const params = DISCORD_PARAMS;
  let invalidTimeout = false;
  let invalidCooldown = false;
  let invalidBond = false;
  let sendNotification = false;
  if (questionTimeout < MIN_TIMEOUT) {
    invalidTimeout = true;
  }
  if (questionCooldown < MIN_COOLDOWN) {
    invalidCooldown = true;
  }
  if (bond.toString() < minBond.toString()) {
    invalidBond = true;
  }
  console.log("invalidTimeout", invalidTimeout);
  console.log("invalidCooldown", invalidCooldown);
  console.log("invalidBond", invalidBond);
  console.log("isOwner", isOwner);
  console.log("isController", isController);
  if (invalidTimeout) {
    invalidInputs = `Timeout (Min expected -  ${MIN_TIMEOUT}) = ${questionTimeout}\n`;
  }
  if (invalidCooldown) {
    invalidInputs = `${invalidInputs}Cooldown (Min expected -  ${MIN_COOLDOWN}) = ${questionCooldown}\n`;
  }
  if (invalidBond) {
    invalidInputs = `${invalidInputs}Minimum Bond (Min expected - ${minBond.toString()}) = ${bond.toString()}\n`;
  }
  if (!isController) {
    invalidInputs = `${invalidInputs}The ENS (${ensName}) controller is not the Avatar.\n`;
  }
  if (!isOwner) {
    invalidInputs = `${invalidInputs}The ENS (${ensName}) owner is not the Avatar.\n`;
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

  if ([invalidTimeout, invalidCooldown, invalidBond].includes(true)) {
    sendNotification = true;
  }

  if ([isController, isOwner].includes(false)) {
    sendNotification = true;
  }
  return { sendNotification, params };
};

/**
 *
 * @param {*} realityContract
 * @param {*} provider
 * @param {string} txHash
 * @param {number} chainId
 * @param {string} ensName
 * @param {string} discordWebHookUrl
 */
const handleContractMethods = async (
  realityContract,
  provider,
  txHash,
  chainId,
  ensName,
  discordWebHookUrl
) => {
  const avatar = await realityContract.avatar();
  const isController = await checkIfIsController(provider, ensName, avatar);
  const isOwner = await checkIfIsOwner(provider, ensName, avatar, chainId);
  const questionTimeout = await realityContract.questionTimeout();
  const questionCooldown = await realityContract.questionCooldown();
  const bond = await realityContract.minimumBond();
  const { sendNotification, params } = generateDiscordParams(
    questionTimeout,
    questionCooldown,
    bond,
    isController,
    isOwner,
    ensName,
    chainId,
    txHash
  );
  if (sendNotification) {
    await axios.post(discordWebHookUrl, params);
  }
};

/**
 *
 * @param {string} templateQuestionText //Template question text
 * @returns {string}
 */
const getEnsName = (templateQuestionText) => {
  if (templateQuestionText.includes(".eth")) {
    const initialTemplateText = templateQuestionText.substr(
      0,
      templateQuestionText.indexOf(".eth")
    );
    const words = initialTemplateText.split(" ");
    const ensName = words[words.length - 1];
    return `${ensName}.eth`;
  }
};

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
    const rpcUrl = "{{rpcUrl}}";
    const discordWebHookUrl = "{{discordWebHookUrl}}";
    const transaction = event.request.body.transaction;
    const logs = transaction.logs;
    const txHash = transaction.transactionHash;
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const chainId = event.request.body.sentinel.chainId;
    const utils = ethers.utils;
    console.log(
      "\n\n/*********************** TRANSACTION **************************/"
    );
    const decoded = await decode(logs, utils);
    if (decoded) {
      const { proxyAddress, templateQuestionText } = decoded;
      const ensName = getEnsName(templateQuestionText);
      const realityContract = new ethers.Contract(
        proxyAddress,
        REALITY_ETH_ABI,
        provider
      );
      await handleContractMethods(
        realityContract,
        provider,
        txHash,
        chainId,
        ensName,
        discordWebHookUrl
      );
    }
    console.log(
      "/**********************************************************/\n\n"
    );
  }
};
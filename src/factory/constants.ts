import { ContractAddresses, KnownContracts } from "./types";

/*
 * 1     - Mainnet
 * 4     - Rinkeby
 * 56    - Binance smart chain
 * 100   - Gnosis chain (Previously xdai)
 * 137   - Polygon
 * 31337 - hardhat network
 * 80001 - Mumbai
 */
export const SUPPORTED_NETWORKS = [1, 4, 56, 100, 137, 31337, 80001];

const MasterCopyAddresses: Record<KnownContracts, string> = {
  [KnownContracts.META_GUARD]: "0xe2847462a574bfd43014d1c7BB6De5769C294691",
  [KnownContracts.REALITY_ETH]: "0x72d453a685c27580acDFcF495830EB16B7E165f8",
  [KnownContracts.REALITY_ERC20]: "0x6f628F0c3A3Ff75c39CF310901f10d79692Ed889",
  [KnownContracts.BRIDGE]: "0x457042756F2B1056487173003D27f37644C119f3",
  [KnownContracts.DELAY]: "0xeD2323128055cE9539c6C99e5d7EBF4CA44A2485",
  [KnownContracts.FACTORY]: "0x00000000062c52e29e8029dc2413172f6d619d85",
  [KnownContracts.EXIT_ERC20]: "0x33bCa41bda8A3983afbAd8fc8936Ce2Fb29121da",
  [KnownContracts.EXIT_ERC721]: "0xD3579C14a4181EfC3DF35C3103D20823A8C8d718",
  [KnownContracts.SCOPE_GUARD]: "0xfDc921764b88A889F9BFa5Ba874f77607a63b832",
  [KnownContracts.CIRCULATING_SUPPLY_ERC20]: "0xb50fab2e2892E3323A5300870C042B428B564FE3",
  [KnownContracts.CIRCULATING_SUPPLY_ERC721]: "0x71530ec830CBE363bab28F4EC52964a550C0AB1E",
  [KnownContracts.ROLES]: "0x85388a8cd772b19a468F982Dc264C238856939C9",
  tellor: "",
  optimisticGovernor: "",
};

export const CONTRACT_ADDRESSES: Record<
  number,
  Record<KnownContracts, string>
> = {
  1: { ...MasterCopyAddresses, [KnownContracts.TELLOR]: "0x7D5f5EaF541AC203Ee1424895b6997041C886FBE", [KnownContracts.OPTIMISTIC_GOVERNOR]: "0xC419A1dc987d7c34243f98d66211d356023F344E" },
  4: { ...MasterCopyAddresses, [KnownContracts.TELLOR]: "0x2b0bfeBCDFE2228cAbA56dfDE9F067643B357343", [KnownContracts.OPTIMISTIC_GOVERNOR]: "0x6Ff461b854F5349857c2Ad41e0f558C19953DF89" },
  56: { ...MasterCopyAddresses },
  100: { ...MasterCopyAddresses },
  137: { ...MasterCopyAddresses, [KnownContracts.TELLOR]: "0xEAB27A2Dc46431B96126f20bFC3197eD8247ed79", [KnownContracts.OPTIMISTIC_GOVERNOR]: "0x59bC80BC7703f2573C0B31542828fFF993548994" },
  31337: { ...MasterCopyAddresses },
  80001: { ...MasterCopyAddresses, [KnownContracts.TELLOR]: "0xBCc265bDbc5a26D9279250b6e9CbD5527EEf4FAD" },
};

export const CONTRACT_ABIS: Record<KnownContracts, string[]> = {
  [KnownContracts.META_GUARD]: [
    `function setUp(bytes memory initParams) public`,
    `function setAvatar(address _avatar) public`,
    `function setMaxGuard(uint256 _maxGuard) public`,
    `function checkTransaction(
      address to,
      uint256 value,
      bytes memory data,
      Enum.Operation operation,
      uint256 safeTxGas,
      uint256 baseGas,
      uint256 gasPrice,
      address gasToken,
      address payable refundReceiver,
      bytes memory signatures,
      address msgSender
    ) external`,
    `function checkAfterExecution(bytes32 txHash, bool success) external`,
    `function removeGuard(address prevGuard, address guard) public`,
    `function addGuard(address guard) public`,
    `function isGuardAdded(address _guard) public`,
    `function getAllGuards() external`
  ],
  [KnownContracts.OPTIMISTIC_GOVERNOR]: [
    `function setUp(bytes memory initParams) public`,
    `function initialized() public view returns (bool)`
  ],
  [KnownContracts.TELLOR]: [
    `function setUp(bytes memory initParams) public`,
    `function initialized() public view returns (bool)`,
  ],
  [KnownContracts.REALITY_ETH]: [
    `function setArbitrator(address arbitrator) public`,
    `function setQuestionTimeout(uint32 timeout) public`,
    `function setQuestionCooldown(uint32 cooldown) public`,
    `function setMinimumBond(uint256 bond) public`,
    `function setTemplate(bytes32 template) public`,
    `function setAnswerExpiration(uint32 expiration) public`,
    `function setUp(bytes memory initParams) public`,
    `function initialized() public view returns (bool)`,
  ],
  [KnownContracts.REALITY_ERC20]: [
    `function setArbitrator(address arbitrator) public`,
    `function setQuestionTimeout(uint32 timeout) public`,
    `function setQuestionCooldown(uint32 cooldown) public`,
    `function setMinimumBond(uint256 bond) public`,
    `function setTemplate(bytes32 template) public`,
    `function setAnswerExpiration(uint32 expiration) public`,
    `function setUp(bytes memory initParams) public`,
    `function initialized() public view returns (bool)`,
  ],
  [KnownContracts.BRIDGE]: [
    `function setAmb(address _amb) public`,
    `function setChainId(bytes32 _chainId) public`,
    `function setOwner(address _owner) public`,
    `function setUp(bytes memory initParams) public`,
    `function initialized() public view returns (bool)`,
  ],
  [KnownContracts.DELAY]: [
    `function setTxCooldown(uint256 cooldown) public`,
    `function setTxExpiration(uint256 expiration) public`,
    `function setUp(bytes memory initParams) public`,
    `function enableModule(address module) public`,
    `function txCooldown() public view returns (uint256)`,
    `function txExpiration() public view returns (uint256)`,
    `function getModulesPaginated(
      address start,
      uint256 pageSize
    ) external view returns (
      address[] memory array,
      address next
    )`,
    `function initialized() public view returns (bool)`,
  ],
  [KnownContracts.EXIT_ERC20]: [
    `function setUp(bytes memory initParams) public`,
    `function exit(uint256 amountToRedeem, address[] calldata tokens) public`,
    `function addToDenylist(address[] calldata tokens) external`,
    `function removeFromDenylist(address[] calldata tokens) external `,
    `function setDesignatedToken(address _token) public`,
    `function getCirculatingSupply() public view returns (uint256)`,
    `function initialized() public view returns (bool)`,
  ],
  [KnownContracts.EXIT_ERC721]: [
    `function setUp(bytes memory initParams) public`,
    `function exit(uint256 tokenId, address[] calldata tokens) public`,
    `function addToDenylist(address[] calldata tokens) external`,
    `function removeFromDenylist(address[] calldata tokens) external `,
    `function setDesignatedToken(address _token) public`,
    `function getCirculatingSupply() public view returns (uint256)`,
    `function initialized() public view returns (bool)`,
  ],
  [KnownContracts.SCOPE_GUARD]: [
    `function setUp(bytes memory initParams) public`,
    `function checkTransaction(
      address to,
      uint256,
      bytes memory data,
      uint8 operation,
      uint256,
      uint256,
      uint256,
      address,
      address payable,
      bytes memory,
      address
    ) external view`,
    `function isAllowedToDelegateCall(address target) public view returns (bool)`,
    `function isAllowedFunction(address target, bytes4 functionSig) public view returns (bool)`,
    `function isScoped(address target) public view returns (bool)`,
    `function isAllowedTarget(address target) public view returns (bool)`,
    `function disallowFunction(address target, bytes4 functionSig) public returns (bool)`,
    `function allowFunction(address target, bytes4 functionSig) public`,
    `function toggleScoped(address target) public`,
    `function disallowDelegateCall(address target) public`,
    `function allowDelegateCall(address target) public`,
    `function disallowTarget(address target) public`,
    `function allowTarget(address target) public`,
    `function initialized() public view returns (bool)`,
  ],
  [KnownContracts.FACTORY]: [
    `function deployModule(
      address masterCopy,
      bytes memory initializer,
      uint256 saltNonce
    ) public returns (address proxy)`,
  ],
  [KnownContracts.CIRCULATING_SUPPLY_ERC20]: [
    `function setUp(bytes memory initializeParams) public`,
    `function get() public view returns (uint256 circulatingSupply)`,
    `function setToken(address _token) public`,
    `function removeExclusion(address prevExclusion, address exclusion) public`,
    `function exclude(address exclusion) public`,
    `function isExcluded(address _exclusion) public view returns (bool)`,
    `function getExclusionsPaginated(address start, uint256 pageSize) public view`,
  ],
  [KnownContracts.CIRCULATING_SUPPLY_ERC721]: [
    `function setUp(bytes memory initializeParams) public`,
    `function get() public view returns (uint256 circulatingSupply)`,
    `function setToken(address _token) public`,
    `function removeExclusion(address prevExclusion, address exclusion) public`,
    `function exclude(address exclusion) public`,
    `function isExcluded(address _exclusion) public view returns (bool)`,
    `function getExclusionsPaginated(address start, uint256 pageSize) public view`,
  ],
  [KnownContracts.ROLES]: [
    "constructor(address _owner, address _avatar, address _target)",
    "error ArraysDifferentLength()",
    "error ModuleTransactionFailed()",
    "error NoMembership()",
    "error SetUpModulesAlreadyCalled()",
    "event AssignRoles(address module, uint16[] roles, bool[] memberOf)",
    "event AvatarSet(address indexed previousAvatar, address indexed newAvatar)",
    "event ChangedGuard(address guard)",
    "event DisabledModule(address module)",
    "event EnabledModule(address module)",
    "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
    "event RolesModSetup(address indexed initiator, address indexed owner, address indexed avatar, address target)",
    "event SetDefaultRole(address module, uint16 defaultRole)",
    "event SetMultisendAddress(address multisendAddress)",
    "event TargetSet(address indexed previousTarget, address indexed newTarget)",
    "function allowTarget(uint16 role, address targetAddress, uint8 options)",
    "function assignRoles(address module, uint16[] _roles, bool[] memberOf)",
    "function avatar() view returns (address)",
    "function defaultRoles(address) view returns (uint16)",
    "function disableModule(address prevModule, address module)",
    "function enableModule(address module)",
    "function execTransactionFromModule(address to, uint256 value, bytes data, uint8 operation) returns (bool success)",
    "function execTransactionFromModuleReturnData(address to, uint256 value, bytes data, uint8 operation) returns (bool, bytes)",
    "function execTransactionWithRole(address to, uint256 value, bytes data, uint8 operation, uint16 role, bool shouldRevert) returns (bool success)",
    "function execTransactionWithRoleReturnData(address to, uint256 value, bytes data, uint8 operation, uint16 role, bool shouldRevert) returns (bool success, bytes returnData)",
    "function getGuard() view returns (address _guard)",
    "function getModulesPaginated(address start, uint256 pageSize) view returns (address[] array, address next)",
    "function guard() view returns (address)",
    "function isModuleEnabled(address _module) view returns (bool)",
    "function multisend() view returns (address)",
    "function owner() view returns (address)",
    "function renounceOwnership()",
    "function revokeTarget(uint16 role, address targetAddress)",
    "function scopeAllowFunction(uint16 role, address targetAddress, bytes4 functionSig, uint8 options)",
    "function scopeFunction(uint16 role, address targetAddress, bytes4 functionSig, bool[] isParamScoped, uint8[] paramType, uint8[] paramComp, bytes[] compValue, uint8 options)",
    "function scopeFunctionExecutionOptions(uint16 role, address targetAddress, bytes4 functionSig, uint8 options)",
    "function scopeParameter(uint16 role, address targetAddress, bytes4 functionSig, uint256 paramIndex, uint8 paramType, uint8 paramComp, bytes compValue)",
    "function scopeParameterAsOneOf(uint16 role, address targetAddress, bytes4 functionSig, uint256 paramIndex, uint8 paramType, bytes[] compValues)",
    "function scopeRevokeFunction(uint16 role, address targetAddress, bytes4 functionSig)",
    "function scopeTarget(uint16 role, address targetAddress)",
    "function setAvatar(address _avatar)",
    "function setDefaultRole(address module, uint16 role)",
    "function setGuard(address _guard)",
    "function setMultisend(address _multisend)",
    "function setTarget(address _target)",
    "function setUp(bytes initParams)",
    "function target() view returns (address)",
    "function transferOwnership(address newOwner)",
    "function unscopeParameter(uint16 role, address targetAddress, bytes4 functionSig, uint8 paramIndex)",
  ],
};

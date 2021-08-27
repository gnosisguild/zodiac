import { ContractAddresses, KnownContracts } from "./types";

export const CONTRACT_ADDRESSES: Record<number, ContractAddresses> = {
  1: {
    dao: "",
    amb: "",
    delay: "",
    factory: "",
    exit: "",
    scopeGuard: "",
  },
  4: {
    dao: "0x4D0D4Bd6eCA52f2F931c099B6a8a8B2ae85FFD4E",
    amb: "0xf04e9c4aE09fCBb6DF20F0717B08eE298761C770",
    delay: "0xb8215f0f08b204644507D706b544c541caD0ec16",
    factory: "0xd067410a85ffC8C55f7245DE4BfE16C95329D232",
    exit: "0xe1a55322aDE704208129E74E963fa25C8C257eD6",
    scopeGuard: "0x13d233567817E3a38B4082217E44CBa77c06Eb7f",
  },
  // for testing purposes
  31337: {
    dao: "0x4D0D4Bd6eCA52f2F931c099B6a8a8B2ae85FFD4E",
    amb: "0xf04e9c4aE09fCBb6DF20F0717B08eE298761C770",
    delay: "0xb8215f0f08b204644507D706b544c541caD0ec16",
    factory: "0xd067410a85ffC8C55f7245DE4BfE16C95329D232",
    exit: "0xe1a55322aDE704208129E74E963fa25C8C257eD6",
    scopeGuard: "0x13d233567817E3a38B4082217E44CBa77c06Eb7f",
  },
};

export const CONTRACT_ABIS: Record<keyof KnownContracts, string[]> = {
  dao: [
    `function setArbitrator(address arbitrator) public`,
    `function setQuestionTimeout(uint32 timeout) public`,
    `function setQuestionCooldown(uint32 cooldown) public`,
    `function setMinimumBond(uint256 bond) public`,
    `function setTemplate(bytes32 template) public`,
    `function setAnswerExpiration(uint32 expiration) public`,
    `function setUp(bytes memory initParams) public`,
  ],
  amb: [
    `function setAmb(address _amb) public`,
    `function setChainId(bytes32 _chainId) public`,
    `function setOwner(address _owner) public`,
    `function setUp(bytes memory initParams) public`,
  ],
  delay: [
    `function setTxCooldown(uint256 cooldown) public`,
    `function setTxExpiration(uint256 expiration) public`,
    `function setUp(bytes memory initParams) public`,
    `function enableModule(address module) public`,
    `function txCooldown() public view returns (uint256)`,
    `function txExpiration() public view returns (uint256)`,
    `function getModulesPaginated(address start, uint256 pageSize) external
     view returns (address[] memory array, address next)`,
  ],
  exit: [
    `function setUp(bytes memory initParams) public`,
    `function exit(uint256 amountToRedeem, address[] calldata tokens) public`,
    `function addToDenylist(address[] calldata tokens) external`,
    `function removeFromDenylist(address[] calldata tokens) external `,
    `function setDesignatedToken(address _token) public onlyOwner`,
    `function getCirculatingSupply() public view returns (uint256)`,
  ],
  scopeGuard: [
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
  ],
  factory: [
    `function deployModule(
      address masterCopy, 
      bytes memory initializer,
      uint256 saltNonce
    ) public returns (address proxy)`,
  ],
};

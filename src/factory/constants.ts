import { ContractAddresses, KnownContracts } from "./types";

export const CONTRACT_ADDRESSES: Record<number, ContractAddresses> = {
  1: {
    realityETH: "",
    realityERC20: "",
    bridge: "",
    delay: "",
    factory: "0x00000b28D83018aD4F2F4e3a0B4ce5271F4EEa77",
    exit: "",
    scopeGuard: "",
    circulatingSupply: "",
  },
  4: {
    realityETH: "0x1cB7D83A87708B55C4ff3c0be5f48717c222B2e5",
    realityERC20: "0xF669cfdf499e48e0B189206eED98C424F5f83dA7",
    bridge: "0x8a53d2762f90711291c7168fDfC776fB3CFFf7ab",
    delay: "0x753dAEDD9b4464D5AC0b46Ec5c54163678b5ecA3",
    factory: "0x00000b28D83018aD4F2F4e3a0B4ce5271F4EEa77",
    exit: "0x793A69fF46ce0f8C825f14e339cd0Dc8De6A8400",
    scopeGuard: "0xfDc921764b88A889F9BFa5Ba874f77607a63b832",
    circulatingSupply: "0xd7a85e7D0813F8440602E243Acb67df3CCeb5a60",
  },
  100: {
    realityETH: "",
    realityERC20: "",
    bridge: "",
    delay: "",
    factory: "0x00000b28D83018aD4F2F4e3a0B4ce5271F4EEa77",
    exit: "",
    scopeGuard: "",
    circulatingSupply: "",
  },
  137: {
    realityETH: "",
    realityERC20: "",
    bridge: "",
    delay: "",
    factory: "0x00000b28D83018aD4F2F4e3a0B4ce5271F4EEa77",
    exit: "",
    scopeGuard: "",
    circulatingSupply: "",

  },
  31337: {
    realityETH: "0x1cB7D83A87708B55C4ff3c0be5f48717c222B2e5",
    realityERC20: "0xF669cfdf499e48e0B189206eED98C424F5f83dA7",
    bridge: "0x8a53d2762f90711291c7168fDfC776fB3CFFf7ab",
    delay: "0x753dAEDD9b4464D5AC0b46Ec5c54163678b5ecA3",
    factory: "0x00000b28D83018aD4F2F4e3a0B4ce5271F4EEa77",
    exit: "0x793A69fF46ce0f8C825f14e339cd0Dc8De6A8400",
    scopeGuard: "0xfDc921764b88A889F9BFa5Ba874f77607a63b832",
    circulatingSupply: "0xd7a85e7D0813F8440602E243Acb67df3CCeb5a60",
  }
};

export const CONTRACT_ABIS: Record<keyof KnownContracts, string[]> = {
  realityETH: [
    `function setArbitrator(address arbitrator) public`,
    `function setQuestionTimeout(uint32 timeout) public`,
    `function setQuestionCooldown(uint32 cooldown) public`,
    `function setMinimumBond(uint256 bond) public`,
    `function setTemplate(bytes32 template) public`,
    `function setAnswerExpiration(uint32 expiration) public`,
    `function setUp(bytes memory initParams) public`,
    `function initialized() public view returns (bool)`,
  ],
  realityERC20: [
    `function setArbitrator(address arbitrator) public`,
    `function setQuestionTimeout(uint32 timeout) public`,
    `function setQuestionCooldown(uint32 cooldown) public`,
    `function setMinimumBond(uint256 bond) public`,
    `function setTemplate(bytes32 template) public`,
    `function setAnswerExpiration(uint32 expiration) public`,
    `function setUp(bytes memory initParams) public`,
    `function initialized() public view returns (bool)`,
  ],
  bridge: [
    `function setAmb(address _amb) public`,
    `function setChainId(bytes32 _chainId) public`,
    `function setOwner(address _owner) public`,
    `function setUp(bytes memory initParams) public`,
    `function initialized() public view returns (bool)`,
  ],
  delay: [
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
  exit: [
    `function setUp(bytes memory initParams) public`,
    `function exit(uint256 amountToRedeem, address[] calldata tokens) public`,
    `function addToDenylist(address[] calldata tokens) external`,
    `function removeFromDenylist(address[] calldata tokens) external `,
    `function setDesignatedToken(address _token) public`,
    `function getCirculatingSupply() public view returns (uint256)`,
    `function initialized() public view returns (bool)`,
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
    `function initialized() public view returns (bool)`,
  ],
  factory: [
    `function deployModule(
      address masterCopy, 
      bytes memory initializer,
      uint256 saltNonce
    ) public returns (address proxy)`,
  ],
  circulatingSupply: [
    `function setUp(bytes memory initializeParams) public`,
    `function get() public view returns (uint256 circulatingSupply)`,
    `function setToken(address _token) public`,
    `function removeExclusion(address prevExclusion, address exclusion) public`,
    `function exclude(address exclusion) public`,
    `function isExcluded(address _exclusion) public view returns (bool)`,
    `function getExclusionsPaginated(address start, uint256 pageSize) public view`
  ]
};

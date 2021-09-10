import { ContractAddresses, KnownContracts } from "./types";

export const CONTRACT_ADDRESSES: Record<number, ContractAddresses> = {
  1: {
    realityETH: "",
    realityERC20: "",
    amb: "",
    delay: "",
    factory: "",
    exit: "",
    scopeGuard: "",
    circulatingSupply: "",
  },
  4: {
    realityETH: "0x8f097901aE9A10Ff250A755eA1817f98aFF1eE5C",
    realityERC20: "0x1Ca65cAc968436F1CF12f58D34E09e74D1cE2898",
    amb: "0xf04e9c4aE09fCBb6DF20F0717B08eE298761C770",
    delay: "0xb8215f0f08b204644507D706b544c541caD0ec16",
    factory: "0x569F2e024D0aD6bBfBd8135097DFa7D0641Ae79b",
    exit: "0x43b06634Cd6c9b55460a6aFCF412dCf6e9bcBB0E",
    scopeGuard: "0x13d233567817E3a38B4082217E44CBa77c06Eb7f",
    circulatingSupply: "0xd7a85e7D0813F8440602E243Acb67df3CCeb5a60",
  },
  31337: {
    realityETH: "0x8f097901aE9A10Ff250A755eA1817f98aFF1eE5C",
    realityERC20: "",
    amb: "0xf04e9c4aE09fCBb6DF20F0717B08eE298761C770",
    delay: "0xb8215f0f08b204644507D706b544c541caD0ec16",
    factory: "0x569F2e024D0aD6bBfBd8135097DFa7D0641Ae79b",
    exit: "0x43b06634Cd6c9b55460a6aFCF412dCf6e9bcBB0E",
    scopeGuard: "0x13d233567817E3a38B4082217E44CBa77c06Eb7f",
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
  amb: [
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

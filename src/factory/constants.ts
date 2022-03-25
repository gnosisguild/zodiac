import { ContractAddresses, KnownContracts } from "./types";

const MasterCopyAddresses = {
  realityETH: "0x72d453a685c27580acDFcF495830EB16B7E165f8",
  realityERC20: "0x6f628F0c3A3Ff75c39CF310901f10d79692Ed889",
  bridge: "0x457042756F2B1056487173003D27f37644C119f3",
  delay: "0xeD2323128055cE9539c6C99e5d7EBF4CA44A2485",
  factory: "0x00000000062c52e29e8029dc2413172f6d619d85",
  exit: "0x35E35dcDc7Cd112B93C7c55987C86e5D6D419C69",
  scopeGuard: "0xfDc921764b88A889F9BFa5Ba874f77607a63b832",
  circulatingSupply: "0xd7a85e7D0813F8440602E243Acb67df3CCeb5a60",
};

/*
 * 1     - Mainnet
 * 4     - Rinkeby
 * 56    - Binance smart chain
 * 100   - Gnosis chain (Previously xdai)
 * 137   - Polygon
 * 31337 - Localhost in hardhat
 * 80001 - Mumbai
 */
export const SUPPORTED_NETWORKS = [1, 4, 56, 100, 137, 31337, 80001]

const mapNetworks = (acc: Record<string, ContractAddresses>, current: number) => {
  return {
    ...acc,
    [current]: MasterCopyAddresses
  }
}
export const CONTRACT_ADDRESSES: Record<number, ContractAddresses> = SUPPORTED_NETWORKS.reduce(mapNetworks, {})

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
    `function getExclusionsPaginated(address start, uint256 pageSize) public view`,
  ],
};

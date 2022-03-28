export enum KnownContracts {
  REALITY_ETH = "realityETH",
  REALITY_ERC20 = "realityERC20",
  BRIDGE = "bridge",
  DELAY = "delay",
  EXIT_ERC20 = "exit",
  EXIT_ERC721 = "exitERC721",
  CIRCULATING_SUPPLY_ERC20 = "circulatingSupply",
  CIRCULATING_SUPPLY_ERC721 = "circulatingSupplyERC721",
  SCOPE_GUARD = "scopeGuard",
  FACTORY = "factory",
  ROLES = 'roles'
}

type REALITY_ETH_VERSION = "v1.0.0";
type BRIDGE_VERSION = "v1.0.0";
type DELAY_VERSION = "v1.0.0";
type FACTORY_VERSION = "v1.0.0";
type SCOPE_GUARD_VERSION = "v1.0.0";
type EXIT_ERC20_VERSION = "v1.0.0" | "v1.1.0";
type EXIT_ERC721_VERSION = "v1.1.0";
type CIRCULATING_SUPPLY_ERC20_VERSION = "v1.0.0" | "v1.1.0";
type CIRCULATING_SUPPLY_ERC721_VERSION = "v1.1.0";
type ROLES_MOD_VERSION = "v1.0.0";

type ContractMasterCopies<V extends string> = Record<V, string>;

export interface ContractAddresses {
  realityETH: ContractMasterCopies<REALITY_ETH_VERSION>;
  realityERC20: ContractMasterCopies<REALITY_ETH_VERSION>;
  bridge: ContractMasterCopies<BRIDGE_VERSION>;
  delay: ContractMasterCopies<DELAY_VERSION>;
  factory: ContractMasterCopies<FACTORY_VERSION>;
  scopeGuard: ContractMasterCopies<SCOPE_GUARD_VERSION>;
  exit: ContractMasterCopies<EXIT_ERC20_VERSION>;
  exitERC721: ContractMasterCopies<EXIT_ERC721_VERSION>;
  circulatingSupplyERC20: ContractMasterCopies<CIRCULATING_SUPPLY_ERC20_VERSION>;
  circulatingSupplyERC721: ContractMasterCopies<CIRCULATING_SUPPLY_ERC721_VERSION>;
  roles: ContractMasterCopies<ROLES_MOD_VERSION>;
}

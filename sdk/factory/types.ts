export type {
  Bridge,
  CirculatingSupplyErc20,
  CirculatingSupplyErc721,
  Delay,
  Erc20Votes,
  Erc721Votes,
  ExitErc20,
  ExitErc721,
  MetaGuard,
  ModuleProxyFactory,
  OptimisticGovernor,
  OzGovernor,
  Permissions,
  RealityErc20,
  RealityEth,
  Roles,
  ScopeGuard,
  Tellor,
  Usul,
} from "../types";

export enum KnownContracts {
  META_GUARD = "metaGuard",
  OPTIMISTIC_GOVERNOR = "optimisticGovernor",
  TELLOR = "tellor",
  REALITY_ETH = "realityETH",
  REALITY_ERC20 = "realityERC20",
  BRIDGE = "bridge",
  DELAY = "delay",
  EXIT_ERC20 = "exit",
  EXIT_ERC721 = "exitERC721",
  CIRCULATING_SUPPLY_ERC20 = "circulatingSupplyERC20",
  CIRCULATING_SUPPLY_ERC721 = "circulatingSupplyERC721",
  SCOPE_GUARD = "scopeGuard",
  FACTORY = "factory",
  ROLES = "roles",
  OZ_GOVERNOR = "ozGovernor",
  ERC20_VOTES = "erc20Votes",
  ERC721_VOTES = "erc721Votes",
  MULTISEND_ENCODER = "multisendEncoder",
  PERMISSIONS = "permissions",
  CONNEXT = "connext",
}

// type META_GUARD_VERSION = "v1.0.0";
// type OPTIMISTIC_GOVERNOR_VERSION = "v1.0.0";
// type TELLOR_VERSION = "v2.0.0";
// type REALITY_ETH_VERSION = "v1.0.0";
// type BRIDGE_VERSION = "v1.0.0";
// type DELAY_VERSION = "v1.0.0";
// type FACTORY_VERSION = "v1.0.0";
// type SCOPE_GUARD_VERSION = "v1.0.0";
// type EXIT_ERC20_VERSION = "v1.0.0" | "v1.1.0";
// type EXIT_ERC721_VERSION = "v1.1.0";
// type CIRCULATING_SUPPLY_ERC20_VERSION = "v1.0.0" | "v1.1.0";
// type CIRCULATING_SUPPLY_ERC721_VERSION = "v1.1.0";
// type ROLES_MOD_VERSION = "v1.0.0";

// type ContractMasterCopies<V extends string> = Record<V, string>;

// export interface ContractAddresses {
//   metaGuard: ContractMasterCopies<META_GUARD_VERSION>;
//   optimisticGovernor: ContractMasterCopies<OPTIMISTIC_GOVERNOR_VERSION>;
//   tellor: ContractMasterCopies<TELLOR_VERSION>;
//   realityETH: ContractMasterCopies<REALITY_ETH_VERSION>;
//   realityERC20: ContractMasterCopies<REALITY_ETH_VERSION>;
//   bridge: ContractMasterCopies<BRIDGE_VERSION>;
//   delay: ContractMasterCopies<DELAY_VERSION>;
//   factory: ContractMasterCopies<FACTORY_VERSION>;
//   scopeGuard: ContractMasterCopies<SCOPE_GUARD_VERSION>;
//   exit: ContractMasterCopies<EXIT_ERC20_VERSION>;
//   exitERC721: ContractMasterCopies<EXIT_ERC721_VERSION>;
//   circulatingSupplyERC20: ContractMasterCopies<CIRCULATING_SUPPLY_ERC20_VERSION>;
//   circulatingSupplyERC721: ContractMasterCopies<CIRCULATING_SUPPLY_ERC721_VERSION>;
//   roles: ContractMasterCopies<ROLES_MOD_VERSION>;
// }

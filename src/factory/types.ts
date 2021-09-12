export interface KnownContracts {
  realityETH: string;
  realityERC20: string;
  bridge: string;
  delay: string;
  exit: string;
  scopeGuard: string;
  factory: string;
  circulatingSupply: string;
}

export type ContractAddresses = Record<keyof KnownContracts, string>;

export type KnownModules = Omit<KnownContracts, "factory">;

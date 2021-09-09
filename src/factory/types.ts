export interface KnownContracts {
  realityETH: string;
  realityERC20: string;
  amb: string;
  delay: string;
  exit: string;
  scopeGuard: string;
  factory: string;
}

export type ContractAddresses = Record<keyof KnownContracts, string>;

export type KnownModules = Omit<KnownContracts, "factory">;

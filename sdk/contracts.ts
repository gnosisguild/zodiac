import BridgeAbi from "./abi/Bridge.json";
import CirculatingSupplyErc20Abi from "./abi/CirculatingSupplyErc20.json";
import CirculatingSupplyErc721Abi from "./abi/CirculatingSupplyErc721.json";
import ConnextAbi from "./abi/Connext.json";
import DelayAbi from "./abi/Delay.json";
import Erc20VotesAbi from "./abi/Erc20Votes.json";
import Erc721VotesAbi from "./abi/Erc721Votes.json";
import ExitErc20Abi from "./abi/ExitErc20.json";
import ExitErc721Abi from "./abi/ExitErc721.json";
import MetaGuardAbi from "./abi/MetaGuard.json";
import ModuleProxyFactoryAbi from "./abi/ModuleProxyFactory.json";
import MultisendEncoderAbi from "./abi/MultisendEncoder.json";
import OptimisticGovernorAbi from "./abi/OptimisticGovernor.json";
import OzGovernorAbi from "./abi/OzGovernor.json";
import PermissionsAbi from "./abi/Permissions.json";
import RealityErc20Abi from "./abi/RealityErc20.json";
import RealityEthAbi from "./abi/RealityEth.json";
import RolesAbi from "./abi/Roles.json";
import ScopeGuardAbi from "./abi/ScopeGuard.json";
import TellorAbi from "./abi/Tellor.json";

import { KnownContracts } from "./factory/types";

import * as BridgeInitData from "./initData/Bridge";
import * as CirculatingSupplyErc20InitData from "./initData/CirculatingSupplyErc20";
import * as CirculatingSupplyErc721InitData from "./initData/CirculatingSupplyErc721";
import * as ConnextInitData from "./initData/Connext";
import * as DelayInitData from "./initData/Delay";
import * as Erc20VotesInitData from "./initData/Erc20Votes";
import * as Erc721VotesInitData from "./initData/Erc721Votes";
import * as ExitErc20InitData from "./initData/ExitErc20";
import * as ExitErc721InitData from "./initData/ExitErc721";
import * as ModuleProxyFactoryInitData from "./initData/ModuleProxyFactory";
import * as MultisendEncoderInitData from "./initData/MultisendEncoder";
import * as OzGovernorInitData from "./initData/OzGovernor";
import * as PermissionsInitData from "./initData/Permissions";
import * as RealityErc20InitData from "./initData/RealityErc20";
import * as RealityEthInitData from "./initData/RealityEth";
import * as RolesInitData from "./initData/Roles";
import * as ScopeGuardInitData from "./initData/ScopeGuard";

import { factories } from "./types";

export enum SupportedNetworks {
  Mainnet = 1,
  GnosisChain = 100,
  Goerli = 5,
  ArbitrumOne = 42161,
  Optimism = 10,
  Polygon = 137,
  Mumbai = 80001, // not supported yet
  Avalanche = 43114,
  BinanceSmartChain = 56,
  HardhatNetwork = 31337,
}

// const canonicalMasterCopyAddress = (contract: KnownContracts) => {
//   const { initCode, salt } = MasterCopyInitData[contract];
//   return getCreate2Address(SingletonFactoryAddress, salt, keccak256(initCode));
// };

/** The canonical mastercopy addresses when deployed using the singleton factory.  */
const CanonicalAddresses: Record<
  KnownContracts,
  { [version: `${number}.${number}.${number}`]: string }
> = {
  [KnownContracts.META_GUARD]: {
    "1.0.0": "0xe2847462a574bfd43014d1c7BB6De5769C294691",
  },
  [KnownContracts.REALITY_ETH]: {
    "2.0.0": "0x4e35DA39Fa5893a70A40Ce964F993d891E607cC0",
  },
  [KnownContracts.REALITY_ERC20]: {
    "2.0.0": "0x7276813b21623d89BA8984B225d5792943DD7dbF",
  },
  [KnownContracts.BRIDGE]: {
    "1.0.0": "0x03B5eBD2CB2e3339E93774A1Eb7c8634B8C393A9",
  },
  [KnownContracts.DELAY]: {
    "1.0.0": "0xD62129BF40CD1694b3d9D9847367783a1A4d5cB4",
  },
  [KnownContracts.FACTORY]: {
    "1.0.0": "0x00000000062c52e29e8029dc2413172f6d619d85",
    "1.1.0": "0x00000000000DC7F163742Eb4aBEf650037b1f588",
    "1.2.0": "0x000000000000aDdB49795b0f9bA5BC298cDda236",
  },
  [KnownContracts.EXIT_ERC20]: {
    "1.0.0": "0x35E35dcDc7Cd112B93C7c55987C86e5D6D419C69",
    "1.1.0": "0x33bCa41bda8A3983afbAd8fc8936Ce2Fb29121da",
    "1.2.0": "0x3ed380a282aDfA3460da28560ebEB2F6D967C9f5",
  },
  [KnownContracts.EXIT_ERC721]: {
    "1.1.0": "0xD3579C14a4181EfC3DF35C3103D20823A8C8d718",
    "1.2.0": "0xE0eCE32Eb4BE4E9224dcec6a4FcB335c1fe05CDe",
  },
  [KnownContracts.CIRCULATING_SUPPLY_ERC20]: {
    "1.0.0": "0xd7a85e7D0813F8440602E243Acb67df3CCeb5a60",
    "1.1.0": "0xb50fab2e2892E3323A5300870C042B428B564FE3",
    "1.2.0": "0x5Ed57C291a184cc244F5c9B5E9F11a8DD08BBd12",
  },
  [KnownContracts.CIRCULATING_SUPPLY_ERC721]: {
    "1.1.0": "0x71530ec830CBE363bab28F4EC52964a550C0AB1E",
    "1.2.0": "0xBD34D00dC0ae37C687F784A11FA6a0F2c5726Ba3",
  },
  [KnownContracts.SCOPE_GUARD]: {
    "1.0.0": "0xeF27fcd3965a866b22Fb2d7C689De9AB7e611f1F",
  },
  [KnownContracts.ROLES]: {
    "1.0.0": "0x85388a8cd772b19a468F982Dc264C238856939C9",
    "1.1.0": "0xD8DfC1d938D7D163C5231688341e9635E9011889",
  },
  [KnownContracts.PERMISSIONS]: {
    "1.0.0": "0x33D1C5A5B6a7f3885c7467e829aaa21698937597",
  },
  [KnownContracts.TELLOR]: {
    "2.0.0": "0xcc4C0ED5958770B5036189394360C33DDECf8414",
  },
  [KnownContracts.OPTIMISTIC_GOVERNOR]: {
    "1.0.0": "",
  },
  [KnownContracts.OZ_GOVERNOR]: {
    "1.0.0": "0xe28c39FAC73cce2B33C4C003049e2F3AE43f77d5",
  },
  [KnownContracts.ERC20_VOTES]: {
    "1.0.0": "0x752c61de75ADA0F8a33e048d2F773f51172f033e",
  },
  [KnownContracts.ERC721_VOTES]: {
    "1.0.0": "0xeFf38b2eBB95ACBA09761246045743f40e762568",
  },
  [KnownContracts.MULTISEND_ENCODER]: {
    "1.0.0": "0xb67EDe523171325345780fA3016b7F5221293df0",
  },
  [KnownContracts.CONNEXT]: {
    "1.0.0": "0x7dE07b9De0bf0FABf31A188DE1527034b2aF36dB",
  },
};

/**
 * Canonical addresses of head versions of each contract.
 * This export will be removed in a future version. Use `ContractAddresses` instead.
 * @deprecated
 **/
export const MasterCopyAddresses = Object.fromEntries(
  Object.entries(CanonicalAddresses).map(([key, value]) => [
    key,
    Object.values(value).pop() || "",
  ])
) as Record<KnownContracts, string>;

/** Addresses of all deployed contracts in all versions */
export const ContractVersions: Record<
  SupportedNetworks,
  Record<KnownContracts, { [version: `${number}.${number}.${number}`]: string }>
> = {
  [SupportedNetworks.Mainnet]: {
    ...CanonicalAddresses,
    [KnownContracts.OPTIMISTIC_GOVERNOR]: {
      "1.2.0": "0x28CeBFE94a03DbCA9d17143e9d2Bd1155DC26D5d",
    },
  },
  [SupportedNetworks.Goerli]: {
    ...CanonicalAddresses,
    [KnownContracts.OPTIMISTIC_GOVERNOR]: {
      "1.2.0": "0x07a7Be7AA4AaD42696A17e974486cb64A4daC47b",
    },
  },
  [SupportedNetworks.BinanceSmartChain]: CanonicalAddresses,
  [SupportedNetworks.GnosisChain]: {
    ...CanonicalAddresses,
    [KnownContracts.OPTIMISTIC_GOVERNOR]: {
      "1.2.0": "0x972396Ab668cd11dc1F6321A5ae30c6A8d3759F0",
    },
  },
  [SupportedNetworks.Polygon]: {
    ...CanonicalAddresses,
    [KnownContracts.OPTIMISTIC_GOVERNOR]: {
      "1.2.0": "0x3Cc4b597E9c3f51288c6Cd0c087DC14c3FfdD966",
    },
  },
  [SupportedNetworks.HardhatNetwork]: CanonicalAddresses,
  [SupportedNetworks.Mumbai]: CanonicalAddresses,
  [SupportedNetworks.ArbitrumOne]: {
    ...CanonicalAddresses,
    [KnownContracts.TELLOR]: {},
    [KnownContracts.OPTIMISTIC_GOVERNOR]: {
      "1.2.0": "0x30679ca4ea452d3df8a6c255a806e08810321763",
    },
  },
  [SupportedNetworks.Optimism]: {
    ...CanonicalAddresses,
    [KnownContracts.TELLOR]: {},
    [KnownContracts.OPTIMISTIC_GOVERNOR]: {
      "1.2.0": "0x357fe84E438B3150d2F68AB9167bdb8f881f3b9A",
    },
  },
  [SupportedNetworks.Avalanche]: {
    ...CanonicalAddresses,
    [KnownContracts.TELLOR]: {},
    [KnownContracts.OPTIMISTIC_GOVERNOR]: {
      "1.2.0": "0xEF8b46765ae805537053C59f826C3aD61924Db45",
    },
  },
};

/** Addresses of the head versions of all contracts */
export const ContractAddresses = Object.fromEntries(
  Object.entries(ContractVersions).map(([network, contracts]) => [
    network,
    Object.fromEntries(
      Object.entries(contracts).map(([contract, versions]) => [
        contract,
        Object.values(versions).pop() || "",
      ])
    ),
  ])
) as Record<SupportedNetworks, Record<KnownContracts, string>>;

export const ContractAbis: Record<KnownContracts, any> = {
  [KnownContracts.BRIDGE]: BridgeAbi,
  [KnownContracts.CIRCULATING_SUPPLY_ERC20]: CirculatingSupplyErc20Abi,
  [KnownContracts.CIRCULATING_SUPPLY_ERC721]: CirculatingSupplyErc721Abi,
  [KnownContracts.DELAY]: DelayAbi,
  [KnownContracts.ERC20_VOTES]: Erc20VotesAbi,
  [KnownContracts.ERC721_VOTES]: Erc721VotesAbi,
  [KnownContracts.EXIT_ERC20]: ExitErc20Abi,
  [KnownContracts.EXIT_ERC721]: ExitErc721Abi,
  [KnownContracts.FACTORY]: ModuleProxyFactoryAbi,
  [KnownContracts.META_GUARD]: MetaGuardAbi,
  [KnownContracts.OPTIMISTIC_GOVERNOR]: OptimisticGovernorAbi,
  [KnownContracts.OZ_GOVERNOR]: OzGovernorAbi,
  [KnownContracts.REALITY_ERC20]: RealityErc20Abi,
  [KnownContracts.REALITY_ETH]: RealityEthAbi,
  [KnownContracts.ROLES]: RolesAbi,
  [KnownContracts.SCOPE_GUARD]: ScopeGuardAbi,
  [KnownContracts.TELLOR]: TellorAbi,
  [KnownContracts.MULTISEND_ENCODER]: MultisendEncoderAbi,
  [KnownContracts.PERMISSIONS]: PermissionsAbi,
  [KnownContracts.CONNEXT]: ConnextAbi,
};

export const ContractFactories = {
  [KnownContracts.BRIDGE]: factories.Bridge__factory,
  [KnownContracts.CIRCULATING_SUPPLY_ERC20]:
    factories.CirculatingSupplyErc20__factory,
  [KnownContracts.CIRCULATING_SUPPLY_ERC721]:
    factories.CirculatingSupplyErc721__factory,
  [KnownContracts.DELAY]: factories.Delay__factory,
  [KnownContracts.ERC20_VOTES]: factories.Erc20Votes__factory,
  [KnownContracts.ERC721_VOTES]: factories.Erc721Votes__factory,
  [KnownContracts.EXIT_ERC20]: factories.ExitErc20__factory,
  [KnownContracts.EXIT_ERC721]: factories.ExitErc721__factory,
  [KnownContracts.FACTORY]: factories.ModuleProxyFactory__factory,
  [KnownContracts.META_GUARD]: factories.MetaGuard__factory,
  [KnownContracts.OPTIMISTIC_GOVERNOR]: factories.OptimisticGovernor__factory,
  [KnownContracts.OZ_GOVERNOR]: factories.OzGovernor__factory,
  [KnownContracts.REALITY_ERC20]: factories.RealityErc20__factory,
  [KnownContracts.REALITY_ETH]: factories.RealityEth__factory,
  [KnownContracts.ROLES]: factories.Roles__factory,
  [KnownContracts.SCOPE_GUARD]: factories.ScopeGuard__factory,
  [KnownContracts.TELLOR]: factories.Tellor__factory,
  [KnownContracts.MULTISEND_ENCODER]: factories.MultisendEncoder__factory,
  [KnownContracts.PERMISSIONS]: factories.Permissions__factory,
  [KnownContracts.CONNEXT]: factories.Connext__factory,
};

export const MasterCopyInitData: Record<
  KnownContracts,
  { initCode: string; salt: string } | undefined
> = {
  [KnownContracts.BRIDGE]: BridgeInitData,
  [KnownContracts.CIRCULATING_SUPPLY_ERC20]: CirculatingSupplyErc20InitData,
  [KnownContracts.CIRCULATING_SUPPLY_ERC721]: CirculatingSupplyErc721InitData,
  [KnownContracts.DELAY]: DelayInitData,
  [KnownContracts.ERC20_VOTES]: Erc20VotesInitData,
  [KnownContracts.ERC721_VOTES]: Erc721VotesInitData,
  [KnownContracts.EXIT_ERC20]: ExitErc20InitData,
  [KnownContracts.EXIT_ERC721]: ExitErc721InitData,
  [KnownContracts.FACTORY]: ModuleProxyFactoryInitData,
  [KnownContracts.META_GUARD]: undefined,
  [KnownContracts.OPTIMISTIC_GOVERNOR]: undefined,
  [KnownContracts.OZ_GOVERNOR]: OzGovernorInitData,
  [KnownContracts.REALITY_ERC20]: RealityErc20InitData,
  [KnownContracts.REALITY_ETH]: RealityEthInitData,
  [KnownContracts.ROLES]: RolesInitData,
  [KnownContracts.SCOPE_GUARD]: ScopeGuardInitData,
  [KnownContracts.TELLOR]: undefined,
  [KnownContracts.MULTISEND_ENCODER]: MultisendEncoderInitData,
  [KnownContracts.PERMISSIONS]: PermissionsInitData,
  [KnownContracts.CONNEXT]: ConnextInitData,
};

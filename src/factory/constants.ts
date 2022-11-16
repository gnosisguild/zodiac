import BridgeAbi from "../abi/Bridge.json";
import CirculatingSupplyErc20Abi from "../abi/CirculatingSupplyErc20.json";
import CirculatingSupplyErc721Abi from "../abi/CirculatingSupplyErc721.json";
import DelayAbi from "../abi/Delay.json";
import Erc20VotesAbi from "../abi/Erc20Votes.json";
import Erc721VotesAbi from "../abi/Erc721Votes.json";
import ExitErc20Abi from "../abi/ExitErc20.json";
import ExitErc721Abi from "../abi/ExitErc721.json";
import MetaGuardAbi from "../abi/MetaGuard.json";
import ModuleProxyFactoryAbi from "../abi/ModuleProxyFactory.json";
import OptimisticGovernorAbi from "../abi/OptimisticGovernor.json";
import OzGovernorAbi from "../abi/OzGovernor.json";
// import PermissionsAbi from "../abi/Permissions.json";
import RealityErc20Abi from "../abi/RealityErc20.json";
import RealityEthAbi from "../abi/RealityEth.json";
import RolesAbi from "../abi/Roles.json";
import ScopeGuardAbi from "../abi/ScopeGuard.json";
import TellorAbi from "../abi/Tellor.json";
// import UsulAbi from "../abi/Usul.json";
import { KnownContracts } from "./types";

export enum SUPPORTED_NETWORKS {
  Mainnet = 1,
  Goerli = 5,
  BinanceSmartChain = 56,
  GnosisChain = 100,
  Polygon = 137,
  Mumbai = 80001, // not supported yet
  ArbitrumOne = 42161,
  Optimism = 10,
  Avalanche = 43114,
  HardhatNetwork = 31337,
}

const MasterCopyAddresses: Record<KnownContracts, string> = {
  [KnownContracts.META_GUARD]: "0xe2847462a574bfd43014d1c7BB6De5769C294691", // missing: optimism, arbitrum, bsc
  [KnownContracts.REALITY_ETH]: "0x72d453a685c27580acDFcF495830EB16B7E165f8", // missing: optimism, arbitrum, mumbai
  [KnownContracts.REALITY_ERC20]: "0x6f628F0c3A3Ff75c39CF310901f10d79692Ed889", // missing: optimism, arbitrum, mumbai
  [KnownContracts.BRIDGE]: "0x457042756F2B1056487173003D27f37644C119f3", // missing: i
  [KnownContracts.DELAY]: "0xeD2323128055cE9539c6C99e5d7EBF4CA44A2485", // missing: optimism, goerli, bsc
  [KnownContracts.FACTORY]: "0x00000000000DC7F163742Eb4aBEf650037b1f588", // missing: optimism
  [KnownContracts.EXIT_ERC20]: "0x33bCa41bda8A3983afbAd8fc8936Ce2Fb29121da", // missing: mumbai, optimism, arbitrum,
  [KnownContracts.EXIT_ERC721]: "0xD3579C14a4181EfC3DF35C3103D20823A8C8d718", // missing: mumbai, arbitrum, optimism
  [KnownContracts.SCOPE_GUARD]: "0xfDc921764b88A889F9BFa5Ba874f77607a63b832", // missing: goerli, bsc, mumbai, arbitrum, optimism
  [KnownContracts.CIRCULATING_SUPPLY_ERC20]:
    "0xb50fab2e2892E3323A5300870C042B428B564FE3", // missing: mumbai, arbitrum, optimism
  [KnownContracts.CIRCULATING_SUPPLY_ERC721]:
    "0x71530ec830CBE363bab28F4EC52964a550C0AB1E", // missing: mumbai, arbitrum, optimism
  [KnownContracts.ROLES]: "0x85388a8cd772b19a468F982Dc264C238856939C9", // missing: mumbai, arbitrum, optimism
  [KnownContracts.TELLOR]: "",
  [KnownContracts.OPTIMISTIC_GOVERNOR]: "",
  [KnownContracts.OZ_GOVERNOR]: "",
  [KnownContracts.ERC20_VOTES]: "",
  [KnownContracts.ERC721_VOTES]: "",
};

export const CONTRACT_ADDRESSES: Record<
  SUPPORTED_NETWORKS,
  Record<KnownContracts, string>
> = {
  [SUPPORTED_NETWORKS.Mainnet]: {
    ...MasterCopyAddresses,
    [KnownContracts.TELLOR]: "0x7D5f5EaF541AC203Ee1424895b6997041C886FBE",
    [KnownContracts.OPTIMISTIC_GOVERNOR]:
      "0x56C11dE61e249cbBf337027B53Ed3b1dFA8a4e6F",
  },
  [SUPPORTED_NETWORKS.Goerli]: {
    ...MasterCopyAddresses,
    [KnownContracts.OPTIMISTIC_GOVERNOR]:
      "0x1340229DCF6e0bed7D9c2356929987C2A720F836",
    [KnownContracts.OZ_GOVERNOR]: "0x011Ad6A7FE4FB9226204dDBe2b6a5Fc109961dce",
    [KnownContracts.ERC20_VOTES]: "0x245CA18e8c05500160D2F0B406f89167C9efDF86",
    [KnownContracts.ERC721_VOTES]: "0x26fBbE4b69d737a8EF7afa71056256900d6647c9",
  },
  [SUPPORTED_NETWORKS.BinanceSmartChain]: { ...MasterCopyAddresses },
  [SUPPORTED_NETWORKS.GnosisChain]: { ...MasterCopyAddresses },
  [SUPPORTED_NETWORKS.Polygon]: {
    ...MasterCopyAddresses,
    [KnownContracts.TELLOR]: "0xEAB27A2Dc46431B96126f20bFC3197eD8247ed79",
    [KnownContracts.OPTIMISTIC_GOVERNOR]:
      "0x923b1AfF7D67507A5Bdf528bD3086456FEba10cB",
  },
  [SUPPORTED_NETWORKS.HardhatNetwork]: { ...MasterCopyAddresses },
  [SUPPORTED_NETWORKS.Mumbai]: {
    ...MasterCopyAddresses,
    [KnownContracts.TELLOR]: "0xBCc265bDbc5a26D9279250b6e9CbD5527EEf4FAD",
  },
  [SUPPORTED_NETWORKS.ArbitrumOne]: { ...MasterCopyAddresses }, //TODO: figure out what to change
  [SUPPORTED_NETWORKS.Optimism]: { ...MasterCopyAddresses }, //TODO: figure out what to change
  [SUPPORTED_NETWORKS.Avalanche]: { ...MasterCopyAddresses }, //TODO: figure out what to change
};

export const CONTRACT_ABIS: Record<KnownContracts, any> = {
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
  // [KnownContracts.PERMISSIONS]: PermissionsAbi,
  [KnownContracts.REALITY_ERC20]: RealityErc20Abi,
  [KnownContracts.REALITY_ETH]: RealityEthAbi,
  [KnownContracts.ROLES]: RolesAbi,
  [KnownContracts.SCOPE_GUARD]: ScopeGuardAbi,
  [KnownContracts.TELLOR]: TellorAbi,
  // [KnownContracts.USUL]: UsulAbi,
};

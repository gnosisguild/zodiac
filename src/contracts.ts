/**
 * Known Zodiac contracts and their canonical mastercopy addresses.
 *
 * Canonical mastercopy addresses by `name@version`. Most are deployed through
 * CREATE2 singleton factories, but the registry itself is pure address/name
 * data — no ABIs, bytecode or typechain types (use `extract` to capture
 * per-version artifacts into `mastercopies/`).
 */

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
  CONNEXT = "connext",
}

export const SupportedNetworks = Object.freeze({
  MAINNET: 1,
  OPTIMISM: 10,
  FLARE: 14,
  BSC: 56,
  BNB: 56,
  GNOSIS: 100,
  UNICHAIN: 130,
  POLYGON: 137,
  SONIC: 146,
  WORLDCHAIN: 480,
  HYPEREVM: 999,
  MEGAETH: 4326,
  MANTLE: 5000,
  BASE: 8453,
  PLASMA: 9745,
  ARBITRUM: 42161,
  CELO: 42220,
  AVALANCHE: 43114,
  INK: 57073,
  LINEA: 59144,
  BOB: 60808,
  BERACHAIN: 80094,
  SCROLL: 534352,
  KATANA: 747474,
  SEPOLIA: 11155111,
} as const);

export type SupportedNetworks =
  (typeof SupportedNetworks)[keyof typeof SupportedNetworks];

/** Canonical mastercopy address for each known contract, by version. */
export const CanonicalAddresses: Record<
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
    "1.0.1": "0xd54895B1121A2eE3f37b502F507631FA1331BED6",
    "1.1.0": "0x01F8cabB808D7dE0dF4202D4B60C8310d2f1339b",
    "1.1.1": "0x824175b945838d127c1ca83cbce11d8e44f6df01",
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
    "2.1.0": "0x9646fDAD06d3e24444381f44362a3B0eB343D337",
    "2.1.1": "0xf2964ce6161ce0e75964fe7927ce114cb0b283d5",
  },
  [KnownContracts.TELLOR]: {
    "2.1.0": "0xa89EC2C1e218CfBb0F82829E95352CeAbDEe9A69",
  },
  [KnownContracts.OPTIMISTIC_GOVERNOR]: {
    "1.0.0": "",
    "1.2.0": "0x28CeBFE94a03DbCA9d17143e9d2Bd1155DC26D5d",
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

export const FAULTY: Partial<
  Record<KnownContracts, { [version: `${number}.${number}.${number}`]: string }>
> = {
  [KnownContracts.DELAY]: {
    "1.1.0": "0x01F8cabB808D7dE0dF4202D4B60C8310d2f1339b",
  },
  [KnownContracts.ROLES]: {
    "2.1.0": "0x9646fDAD06d3e24444381f44362a3B0eB343D337",
  },
};

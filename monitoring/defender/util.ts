import { Network } from "defender-base-client";
import { SupportedNetworks } from "../../src/factory/contracts";

export const defenderNetworkToSupportedNetwork = (networks: Network) => {
  switch (networks) {
    case "mainnet":
      return SupportedNetworks.Mainnet;
    case "goerli":
      return SupportedNetworks.Goerli;
    case "xdai":
      return SupportedNetworks.GnosisChain;
    default:
      throw new Error(`Unsupported network ${networks}`);
  }
};

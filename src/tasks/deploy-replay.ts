import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { deployModuleFactory } from "../factory/deployModuleFactory";
import {
  deployMastercopy,
  ContractFactories,
  ContractAbis,
  KnownContracts,
} from "../factory";

export const deploy = async (_: null, hre: HardhatRuntimeEnvironment) => {
  const networks = hre.config.networks;
  const contracts = Object.values(KnownContracts);
  for (const network in networks) {
    if (
      // network != "hardhat" &&
      network != "localhost"
    ) {
      hre.changeNetwork(network);
      console.log(`\n\x1B[4m\x1B[1m${hre.network.name.toUpperCase()}\x1B[0m`);
      await deployModuleFactory(hre);
      for (let index = 0; index < contracts.length; index++) {
        console.log(`\n\x1B[4m${contracts[index]}\x1B[0m`);

        // figure out how to get `factory`
        // Do I need to import it from each of the repos?
        await deployMastercopy(hre, factory, []);
      }
    }
  }
};
task(
  "deploy-replay",
  "Replay deployment of all mastercopies on all networks defined in hardhat.config.ts"
).setAction(deploy);

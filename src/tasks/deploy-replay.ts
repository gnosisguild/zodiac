import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  KnownContracts,
  MasterCopyAddresses,
  MasterCopyInitData,
  deployMastercopyWithInitData,
} from "../factory";

export const deploy = async (_: null, hre: HardhatRuntimeEnvironment) => {
  const networks = hre.config.networks;
  const contracts = Object.values(KnownContracts);
  const [wallet] = await hre.ethers.getSigners();

  for (const network in networks) {
    delete networks.localhost;
    // delete networks.hardhat;
    hre.changeNetwork(network);
    console.log(`\n\x1B[4m\x1B[1m${hre.network.name.toUpperCase()}\x1B[0m`);
    if (await (await wallet.getBalance()).gt(0)) {
      for (let index = 0; index < contracts.length; index++) {
        const initData = MasterCopyInitData[contracts[index]];
        if (
          MasterCopyInitData[contracts[index]] &&
          initData.initCode &&
          initData.salt
        ) {
          console.log(`    \x1B[4m${contracts[index]}\x1B[0m`);
          await deployMastercopyWithInitData(
            hre,
            initData.initCode,
            initData.salt
          );
        }
      }
    } else {
      console.log("    Skipped because connected wallet has 0 balance.");
    }
  }
};
task(
  "deploy-replay",
  "Replay deployment of all mastercopies on all networks defined in hardhat.config.ts"
).setAction(deploy);

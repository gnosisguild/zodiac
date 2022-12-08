import { task, types } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  KnownContracts,
  MasterCopyInitData,
  deployMastercopyWithInitData,
} from "../factory";

interface DeployTaskArgs {
  hh: boolean;
  lh: boolean;
}

interface InitData {
  initCode?: string;
  salt?: string;
}

export const deploy = async (
  taskArgs: DeployTaskArgs,
  hre: HardhatRuntimeEnvironment
) => {
  const networks = hre.config.networks;
  const hh = taskArgs.hh;
  const lh = taskArgs.lh;

  if (!lh) {
    delete networks.localhost;
  }
  if (!hh) {
    delete networks.hardhat;
  }
  const contracts = Object.values(KnownContracts);

  for (const network in networks) {
    console.log(`\n\x1B[4m\x1B[1m${network.toUpperCase()}\x1B[0m`);

    hre.changeNetwork(network);
    const [wallet] = await hre.ethers.getSigners();
    try {
      await hre.ethers.provider.getBalance(wallet.address);
      for (let index = 0; index < contracts.length; index++) {
        const initData: InitData = MasterCopyInitData[contracts[index]];
        if (
          MasterCopyInitData[contracts[index]] &&
          initData.initCode &&
          initData.salt
        ) {
          console.log(`    \x1B[4m${contracts[index]}\x1B[0m`);
          try {
            await deployMastercopyWithInitData(
              hre,
              initData.initCode,
              initData.salt
            );
          } catch (error: any) {
            console.log(
              `        \x1B[31m✘ Deployment failed:\x1B[0m              ${error.reason}`
            );
          }
        }
      }
    } catch (error: any) {
      console.log(
        `    \x1B[31m✘ Network skipped because:\x1B[0m            ${error.reason}`
      );
    }
  }
};
task(
  "deploy-replay",
  "Replay deployment of all mastercopies on all networks defined in hardhat.config.ts"
)
  .addOptionalParam("hh", "deploy to hardhat network", undefined, types.boolean)
  .addOptionalParam("lh", "deploy to localhost", undefined, types.boolean)
  .setAction(deploy);

import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  KnownContracts,
  MasterCopyInitData,
  deployMastercopyWithInitData,
} from "../sdk/factory";

interface InitData {
  initCode?: string;
  salt?: string;
}

export const deploy = async (
  { networks }: { networks: string[] },
  hre: HardhatRuntimeEnvironment
) => {
  const contracts = Object.values(KnownContracts);

  const networkList = networks ? networks : Object.keys(hre.config.networks);

  for (const network of networkList) {
    console.log(`\n\x1B[4m\x1B[1m${network.toUpperCase()}\x1B[0m`);

    try {
      hre.changeNetwork(network);
      const [deployer] = await hre.ethers.getSigners();
      const signer = hre.ethers.provider.getSigner(deployer.address);
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
              signer,
              initData.initCode,
              initData.salt
            );
          } catch (error: any) {
            console.log(
              `        \x1B[31m✘ Deployment failed:\x1B[0m              ${
                error?.reason || error
              }`
            );
          }
        }
      }
    } catch (error: any) {
      console.log(
        `    \x1B[31m✘ Network skipped because:\x1B[0m            ${
          error?.reason || error
        }`
      );
    }
  }
};

task(
  "deploy-replay",
  "Replay deployment of all mastercopies on network names provided as arguments. If no networks names are provided, the task will iterate through all networks defined in hardhat.config.ts"
)
  .addOptionalVariadicPositionalParam("networks")
  .setAction(deploy);

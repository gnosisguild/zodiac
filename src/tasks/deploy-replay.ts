import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  KnownContracts,
  MasterCopyAddresses,
  MasterCopyInitData,
  deployMastercopyWithInitData,
} from "../factory";

interface DeployTaskArgs {
  networks: string;
}

export const deploy = async (
  taskArgs: DeployTaskArgs,
  hre: HardhatRuntimeEnvironment
) => {
  const networks = taskArgs.networks?.split(", ") || hre.config.networks;

  delete networks.localhost;
  // delete networks.hardhat;
  const contracts = Object.values(KnownContracts);

  for (const network in networks) {
    hre.changeNetwork(network);

    const [wallet] = await hre.ethers.getSigners();
    const balance = await hre.ethers.provider.getBalance(wallet.address);

    console.log(`\n\x1B[4m\x1B[1m${hre.network.name.toUpperCase()}\x1B[0m`);

    if (balance.gt(0)) {
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
      console.log(
        "    \x1B[31m✘ Network skipped because connected wallet has 0 balance.\x1B[0m"
      );
    }
  }
};
task(
  "deploy-replay",
  "Replay deployment of all mastercopies on all networks defined in hardhat.config.ts"
)
  .addOptionalParam(
    "networks",
    "list of network names, as defined in hardhat.config.ts",
    undefined,
    types.string
  )
  .setAction(deploy);

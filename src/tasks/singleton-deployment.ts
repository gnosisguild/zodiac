import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { deployModuleFactory } from "../factory/deployModuleFactory";

export const deploy = async (_: null, hre: HardhatRuntimeEnvironment) =>
  deployModuleFactory(hre);

task(
  "singleton-deployment",
  "Deploy factory through singleton factory"
).setAction(deploy);

import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { KnownContracts, MasterCopyInitData } from "../sdk/factory";
import { deployModuleFactory } from "../sdk/factory/deployModuleFactory";

const FactoryInitCode = MasterCopyInitData[KnownContracts.FACTORY].initCode;

export const deploy = async (_: null, hre: HardhatRuntimeEnvironment) => {
  const Factory = await hre.ethers.getContractFactory("ModuleProxyFactory");
  if (Factory.bytecode !== FactoryInitCode) {
    console.warn(
      "  The compiled Module Proxy Factory (from src/factory/contracts.ts) is outdated, it does " +
        "not match the bytecode stored at MasterCopyInitData[KnownContracts.FACTORY].initCode"
    );
  }

  const [deployer] = await hre.ethers.getSigners();
  await deployModuleFactory(hre.ethers.provider.getSigner(deployer.address));
};

task(
  "singleton-deployment",
  "Deploy factory through singleton factory"
).setAction(deploy);

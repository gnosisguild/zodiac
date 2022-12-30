import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import { constants as ethersConstants } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { MasterCopyInitData } from "./contracts";
import { getSingletonFactory } from "./singletonFactory";
import { KnownContracts } from "./types";

const { AddressZero } = ethersConstants;

const FactoryInitCode = MasterCopyInitData[KnownContracts.FACTORY].initCode;
const FactorySalt = MasterCopyInitData[KnownContracts.FACTORY].salt;

/**
 * Deploy a module factory via the singleton factory.
 * It will therefore get the same address on any chain.
 *
 * @param hre hardhat runtime environment
 * @returns The address of the deployed module factory, or the zero address if it was already deployed
 */
export const deployModuleFactory = async (
  hre: HardhatRuntimeEnvironment
): Promise<string> => {
  const singletonFactory = await getSingletonFactory(hre);
  console.log("    Singleton Factory:     ", singletonFactory.address);

  try {
    const Factory = await hre.ethers.getContractFactory("ModuleProxyFactory");
    if (Factory.bytecode !== FactoryInitCode) {
      console.warn(
        "The compiled ModuleProxyFactory (from src/factory/contracts.ts) is outdated, it does " +
          "not match the bytecode stored at MasterCopyInitData[KnownContracts.FACTORY].initCode"
      );
    }
  } catch (e) {
    // This is expected when the zodiac package is imported as a package.
  }

  const targetAddress = await singletonFactory.callStatic.deploy(
    FactoryInitCode,
    FactorySalt
  );
  if (targetAddress === AddressZero) {
    console.log(
      "    ModuleProxyFactory already deployed to target address on this network."
    );
    return AddressZero;
  }

  console.log("    Target Factory Address:", targetAddress);

  const transactionResponse = await singletonFactory.deploy(
    FactoryInitCode,
    FactorySalt,
    { gasLimit: 1000000 }
  );

  const result = await transactionResponse.wait();
  console.log("    Deploy transaction:    ", result.transactionHash);

  const factory = await hre.ethers.getContractAt(
    "ModuleProxyFactory",
    targetAddress
  );

  const factoryArtifact = await hre.artifacts.readArtifact(
    "ModuleProxyFactory"
  );

  if (
    (await hre.ethers.provider.getCode(factory.address)) !==
    factoryArtifact.deployedBytecode
  ) {
    throw new Error(
      "    Deployment unsuccessful: deployed bytecode does not match."
    );
  } else {
    console.log(
      "    Successfully deployed ModuleProxyFactory to target address! 🎉"
    );
  }
  return targetAddress;
};

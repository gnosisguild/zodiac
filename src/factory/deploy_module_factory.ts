import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getSingletonFactory } from "./singleton_factory";

const factorySalt =
  "0xb0519c4c4b7945db302f69180b86f1a668153a476802c1c445fcb691ef23ef16";
const AddressZero = "0x0000000000000000000000000000000000000000";

/**
 * Deploy a module factory via the singleton factory.
 * It will therefore get the same address on any chain.
 * @param hre hardhat runtime environment
 * @returns The address of the deployed module factory
 */
export const deployModuleFactory = async (hre: HardhatRuntimeEnvironment) => {
  const singletonFactory = await getSingletonFactory(hre);
  console.log("Singleton Factory:     ", singletonFactory.address);
  const Factory = await hre.ethers.getContractFactory("ModuleProxyFactory");
  // const singletonFactory = new hardhat.ethers.Contract(singletonFactoryAddress, singletonFactoryAbi)

  const targetAddress = await singletonFactory.callStatic.deploy(
    Factory.bytecode,
    factorySalt
  );
  if (targetAddress == AddressZero) {
    console.log(
      "ModuleProxyFactory already deployed to target address on this network."
    );
    return;
  } else {
    console.log("Target Factory Address:", targetAddress);
  }

  const transactionResponse = await singletonFactory.deploy(
    Factory.bytecode,
    factorySalt
  );

  const result = await transactionResponse.wait();
  console.log("Deploy transaction:    ", result.transactionHash);

  const factory = await hre.ethers.getContractAt(
    "ModuleProxyFactory",
    targetAddress
  );

  const factoryArtifact = await hre.artifacts.readArtifact(
    "ModuleProxyFactory"
  );

  if (
    (await hre.ethers.provider.getCode(factory.address)) !=
    factoryArtifact.deployedBytecode
  ) {
    throw new Error(
      "Deployment unsuccessful: deployed bytecode does not match."
    );
  } else {
    console.log(
      "Successfully deployed ModuleProxyFactory to target address! 🎉"
    );
  }
  return targetAddress;
};

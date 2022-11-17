import { ContractFactory } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getSingletonFactory } from "./singletonFactory";

const salt =
  "0xb0519c4c4b7945db302f69180b86f1a668153a476802c1c445fcb691ef23ef16";

/**
 * Deploy a module's mastercopy via the singleton factory.
 *
 * To get the same address on any chain.
 * @param hre hardhat runtime environment
 * @param mastercopyContractFactory
 * @param args
 * @returns The address of the deployed module mastercopy
 */
export const deployMastercopy = async (
  hre: HardhatRuntimeEnvironment,
  mastercopyContractFactory: ContractFactory,
  args: Array<any>
) => {
  const deploymentTx = mastercopyContractFactory.getDeployTransaction(...args);

  const singletonFactory = await getSingletonFactory(hre);

  const targetAddress = await singletonFactory.callStatic.deploy(
    deploymentTx.data,
    salt
  );

  if (targetAddress == "0x0000000000000000000000000000000000000000") {
    throw new Error(
      "Mastercopy already deployed to target address on this network. " +
        "Or the deployment will revert (the error can be checked by deploying directly without the mastercopy deployer)."
    );
  }

  console.log("   Mastercopy targetAddress", targetAddress);

  const deployData = await singletonFactory.deploy(deploymentTx.data, salt, {
    gasLimit: 10000000,
  });

  console.log("   Mastercopy deploy tx hash", deployData.hash);

  await deployData.wait();

  if ((await hre.ethers.provider.getCode(targetAddress)).length > 2) {
    console.log(
      `   Successfully deployed ModuleProxyFactory to target address (${targetAddress})! 🎉`
    );
  } else {
    throw new Error("   Deployment failed.");
  }
  return targetAddress;
};

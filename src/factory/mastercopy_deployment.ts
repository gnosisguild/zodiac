import { ContractFactory } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getSingletonFactory } from "./singleton-deployment";

const salt =
  "0xb0519c4c4b7945db302f69180b86f1a668153a476802c1c445fcb691ef23ef16";

/**
 *
 * @param hardhat Deploy a mastercopy via the singleton factory
 * @param mastercopyContractFactory
 * @param args
 * @returns
 */
export const deployMastercopy = async (
  hardhat: HardhatRuntimeEnvironment,
  mastercopyContractFactory: ContractFactory,
  args: Array<any>
) => {
  const deploymentTx = await mastercopyContractFactory.getDeployTransaction(
    ...args
  );

  console.log("initcode ready");

  const singletonFactory = await getSingletonFactory(hardhat);

  const targetAddress = await singletonFactory.callStatic.deploy(
    deploymentTx.data,
    salt
  );
  console.log("targetAddress", targetAddress);

  const deployData = await singletonFactory.deploy(deploymentTx.data, salt, {
    gasLimit: 10000000,
  });

  const recept = await deployData.wait();
  console.log("recept", recept);

  if ((await hardhat.ethers.provider.getCode(targetAddress)).length > 2) {
    console.log(
      "Successfully deployed ModuleProxyFactory to target address! 🎉"
    );
  }
  return recept;
};

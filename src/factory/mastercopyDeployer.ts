import { BytesLike, ContractFactory } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getSingletonFactory } from "./singletonFactory";

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
  args: Array<any>,
  salt: string
) => {
  const deploymentTx = mastercopyContractFactory.getDeployTransaction(...args);
  if (deploymentTx.data) {
    await deployMastercopyWithInitData(hre, deploymentTx.data, salt);
  }
};

export const deployMastercopyWithInitData = async (
  hre: HardhatRuntimeEnvironment,
  initCode: BytesLike,
  salt: string
) => {
  const singletonFactory = await getSingletonFactory(hre);

  const targetAddress = await singletonFactory.callStatic.deploy(
    initCode,
    salt
  );

  const initCodeHash = await hre.ethers.utils.solidityKeccak256(
    ["bytes"],
    [initCode]
  );
  const computedTargetAddress = await hre.ethers.utils.getCreate2Address(
    singletonFactory.address,
    salt,
    initCodeHash
  );

  if (targetAddress == "0x0000000000000000000000000000000000000000") {
    console.log(
      `        ✔ Mastercopy already deployed to: ${computedTargetAddress}`
    );
    return;
  }

  let deployData;
  if (hre.network.name == "optimism" || hre.network.name == "arbitrum") {
    deployData = await singletonFactory.deploy(initCode, salt);
  } else {
    deployData = await singletonFactory.deploy(initCode, salt, {
      gasLimit: 10000000,
    });
  }

  await deployData.wait();

  if ((await hre.ethers.provider.getCode(targetAddress)).length > 2) {
    console.log(
      `        \x1B[32m✔ Mastercopy deployed to:\x1B[0m         ${targetAddress}`
    );
  } else {
    console.log("        \x1B[31m✘ Deployment failed.\x1B[0m");
  }
  return targetAddress;
};

import {
  BytesLike,
  ContractFactory,
  constants as ethersConstants,
} from "ethers";
import { keccak256, getCreate2Address, getAddress } from "ethers/lib/utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import assert from "node:assert";
import { getSingletonFactory } from "./singletonFactory";

const { AddressZero } = ethersConstants;

/**
 * Deploy a module's mastercopy via the singleton factory.
 *
 * To get the same address on any chain.
 * @param hre hardhat runtime environment
 * @param mastercopyContractFactory mastercopy to deploy
 * @param args the arguments to pass to the mastercopy's constructor
 * @returns The address of the deployed module mastercopy or the zero address if it was already deployed
 */
export const deployMastercopy = async (
  hre: HardhatRuntimeEnvironment,
  mastercopyContractFactory: ContractFactory,
  args: Array<any>,
  salt: string
): Promise<string> => {
  const deploymentTx = mastercopyContractFactory.getDeployTransaction(...args);

  if (Array.isArray(deploymentTx.data) && deploymentTx.data.length > 0) {
    return await deployMastercopyWithInitData(hre, deploymentTx.data, salt);
  }
  throw new Error("Unable to create the deployment data (no init code).");
};

/**
 * Compute a module's mastercopy address. Where it is or will be deployed. And checks if it is already deployed.
 *
 * @param hre hardhat runtime environment
 * @param mastercopyContractFactory mastercopy to get address for
 * @param args the arguments passed to the mastercopy's constructor
 * @returns {
 *  address: string; // the address where the module mastercopy will be deployed or was already deployed
 *  isDeployed: boolean; // true if the module mastercopy was already deployed on this chain
 * }
 */
export const computeTargetAddress = async (
  hre: HardhatRuntimeEnvironment,
  mastercopyContractFactory: ContractFactory,
  args: Array<any>,
  salt: string
): Promise<{ address: string; isDeployed: boolean }> => {
  const deploymentTx = mastercopyContractFactory.getDeployTransaction(...args);
  const singletonFactory = await getSingletonFactory(hre);

  if (!Array.isArray(deploymentTx.data) || deploymentTx.data.length === 0) {
    throw new Error("Unable to create the deployment data (no init code).");
  }

  const initCodeHash = keccak256(deploymentTx.data);

  const computedAddress = getCreate2Address(
    singletonFactory.address,
    salt,
    initCodeHash
  );

  const targetAddress = getAddress(
    (await singletonFactory.callStatic.deploy(
      deploymentTx.data,
      salt
    )) as string
  );

  // Sanity check
  assert(
    computedAddress === targetAddress || targetAddress === AddressZero,
    "The computed address does not match the target address and the target address is not 0x0."
  );

  return {
    address: computedAddress,
    isDeployed: targetAddress === AddressZero,
  };
};

export const deployMastercopyWithInitData = async (
  hre: HardhatRuntimeEnvironment,
  initCode: BytesLike,
  salt: string
): Promise<string> => {
  const singletonFactory = await getSingletonFactory(hre);

  // throws if this for some reason is not a valid address
  const targetAddress = getAddress(
    (await singletonFactory.callStatic.deploy(initCode, salt)) as string
  );

  const initCodeHash = keccak256(initCode);

  const computedTargetAddress = getCreate2Address(
    singletonFactory.address,
    salt,
    initCodeHash
  );

  if (targetAddress === AddressZero) {
    console.log(
      `        ✔ Mastercopy already deployed to: ${computedTargetAddress}`
    );
    return AddressZero;
  }

  // Sanity check
  assert.equal(
    targetAddress,
    computedTargetAddress,
    "The computed address does not match the target address."
  );

  let deployData;
  switch (hre.network.name) {
    case "optimism":
      deployData = await singletonFactory.deploy(initCode, salt, {
        gasLimit: 6000000,
      });
      break;
    case "arbitrum":
      deployData = await singletonFactory.deploy(initCode, salt, {
        gasLimit: 200000000,
      });
      break;
    case "avalanche":
      deployData = await singletonFactory.deploy(initCode, salt, {
        gasLimit: 8000000,
      });
      break;
    case "mumbai":
      deployData = await singletonFactory.deploy(initCode, salt, {
        gasLimit: 8000000,
      });
      break;
    default:
      deployData = await singletonFactory.deploy(initCode, salt, {
        gasLimit: 10000000,
      });
      break;
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

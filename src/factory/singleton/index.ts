import "@nomiclabs/hardhat-ethers";
import { BigNumber } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  buildDeployData,
  calculateSingletonAddress,
  estimateDeploymentGas,
} from "./utils";

const FactorySingletonAddress = "0xce0042B868300000d44A59004Da54A005ffdcf9f";
const Deployer = "0xBb6e024b9cFFACB947A71991E386681B1Cd1477D";

export const deploySingletonContract = async (
  bytecode: string,
  salt: string,
  hardhatRuntime: HardhatRuntimeEnvironment
) => {
  const data = await buildDeployData(bytecode, salt);
  const [caller] = await hardhatRuntime.ethers.getSigners();
  console.log("this is the caller:", caller.address);

  const options: {
    gasPrice?: number;
    gasLimit?: number;
  } = {};

  const tx = {
    to: FactorySingletonAddress,
    data,
  };

  const expectedAddress = calculateSingletonAddress(FactorySingletonAddress, bytecode, salt);
  console.log("Expected address of deployed contract:", expectedAddress);

  const gas = await estimateDeploymentGas(
    hardhatRuntime.ethers.provider,
    tx,
    expectedAddress
  );

  if (hardhatRuntime.network.name === "matic") {
    options["gasPrice"] = 8000000000;
  }

  if (hardhatRuntime.network.name !== "xdai") {
    options["gasLimit"] = gas;
  }

  const deployerBalance = await hardhatRuntime.ethers.provider.getBalance(
    Deployer
  );

  const gasInGwei = BigNumber.from(10).pow(9).mul(gas);
  if (deployerBalance.lt(gasInGwei)) {
    console.log("Sending gas to deployer");
    const fillDeployerTransaction = await caller.sendTransaction({
      to: Deployer,
      value: gasInGwei
    });
    const fillDeployerReceipt = await fillDeployerTransaction.wait();
    console.log("Tx hash: ", fillDeployerReceipt.transactionHash);
  }

  console.log("Deploying contract in network: ", hardhatRuntime.network.name);
  const deploymentTransaction = await caller.sendTransaction({
    ...tx,
    ...options,
  });

  const receipt = await deploymentTransaction.wait();
  console.log("Deployment transaction hash: ", receipt.transactionHash);
};

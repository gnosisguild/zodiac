import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import { task, types } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { simpleEncode, simpleDecode, soliditySHA3 } from "ethereumjs-abi";
import { bufferToHex, toBuffer, toChecksumAddress } from "ethereumjs-util";
import { bytecode as SingleonBytecode } from "../../build/artifacts/contracts/factory/ModuleProxyFactory.sol/ModuleProxyFactory.json";
import { keccak256 } from "ethers/lib/utils";
import { BigNumber } from "ethers";

const FactorySingletonAddress = "0xce0042B868300000d44A59004Da54A005ffdcf9f";
const Deployer = "0xBb6e024b9cFFACB947A71991E386681B1Cd1477D";

interface DeployFactoryTaskArgs {
  bytecode: string;
  salt: string;
}

const buildDeployData = async (salt: string): Promise<string> => {
  return bufferToHex(
    simpleEncode(
      "deploy(bytes,bytes32):(address)",
      toBuffer(SingleonBytecode),
      toBuffer(salt)
    )
  );
};

const buildCreate2Address = (
  deployer: string,
  salt: string,
  bytecode: string
): string => {
  var addressString = soliditySHA3(
    ["bytes1", "address", "bytes32", "bytes32"],
    ["0xff", deployer, salt, keccak256(bytecode)]
  ).toString("hex");
  return toChecksumAddress("0x" + addressString.slice(-40));
};
const calculateSingletonAddress = (bytecode: string, salt: string): string => {
  return buildCreate2Address(FactorySingletonAddress, salt, bytecode);
};

const estimateDeploymentGas = async (
  provider: any,
  tx: any,
  expectedAddress: string
): Promise<number> => {
  let estimate = await provider.estimateGas(tx);
  let tries = 0;
  let address = "";
  while (
    address.toLowerCase() !== expectedAddress.toLowerCase() &&
    tries < 10
  ) {
    // Increase the estimate by 25% every time (even initially, similar to truffle)
    estimate = Math.ceil(estimate * 1.25);
    tries++;
    try {
      const resp = await provider.call(tx);
      [address] = simpleDecode(
        "deploy(bytes,bytes32):(address)",
        toBuffer(resp)
      );
    } catch (e) {}
  }
  return estimate;
};

const deploySingletonFactory = async (
  taskArgs: DeployFactoryTaskArgs,
  hardhatRuntime: HardhatRuntimeEnvironment
) => {
  const data = await buildDeployData(taskArgs.salt);
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

  const expectedAddress = calculateSingletonAddress(
    SingleonBytecode,
    taskArgs.salt
  );
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

  const gasInGwei = BigNumber.from(10).pow(9).mul(gas)
  if (deployerBalance.lt(gasInGwei)) {
    console.log("Sending gas to deployer");
    const fillDeployerTransaction = await caller.sendTransaction({
      to: Deployer,
      value: gasInGwei,
      gasPrice: 8000000000
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

task("deploySingletonFactory", "Deploy contract through singleton factory")
  .addParam(
    "salt",
    "Salt that will be used for address",
    undefined,
    types.string
  )
  .setAction(deploySingletonFactory);

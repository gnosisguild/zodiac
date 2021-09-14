import { simpleEncode, simpleDecode, soliditySHA3 } from "ethereumjs-abi";
import { bufferToHex, toBuffer, toChecksumAddress } from "ethereumjs-util";
import { keccak256 } from "ethers/lib/utils";

export const buildDeployData = async (
  bytecode: string,
  salt: string
): Promise<string> => {
  return bufferToHex(
    simpleEncode(
      "deploy(bytes,bytes32):(address)",
      toBuffer(bytecode),
      toBuffer(salt)
    )
  );
};

export const buildCreate2Address = (
  deployer: string,
  bytecode: string,
  salt: string
): string => {
  var addressString = soliditySHA3(
    ["bytes1", "address", "bytes32", "bytes32"],
    ["0xff", deployer, salt, keccak256(bytecode)]
  ).toString("hex");
  return toChecksumAddress("0x" + addressString.slice(-40));
};

export const calculateSingletonAddress = (
  deployer: string,
  bytecode: string,
  salt: string
): string => {
  return buildCreate2Address(deployer, bytecode, salt);
};

export const estimateDeploymentGas = async (
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

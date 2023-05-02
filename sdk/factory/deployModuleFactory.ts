import { constants as ethersConstants, ethers } from "ethers";
import { MasterCopyInitData } from "../contracts";
import { getSingletonFactory } from "./singletonFactory";
import { KnownContracts } from "./types";

const { AddressZero } = ethersConstants;

const FactoryInitData = MasterCopyInitData[KnownContracts.FACTORY]!;

/**
 * Deploy the Module Proxy Factory via the singleton factory.
 * It will therefore get the same address on any chain.
 *
 * @param hre hardhat runtime environment
 * @returns The address of the deployed Module Proxy Factory, or the zero address if it was already deployed
 */
export const deployModuleFactory = async (
  signer: ethers.providers.JsonRpcSigner
): Promise<string> => {
  console.log("Deploying the Module Proxy Factory...");
  const singletonFactory = await getSingletonFactory(signer);
  console.log(
    "  Singleton factory used for deployment:",
    singletonFactory.address
  );

  const targetAddress = await singletonFactory.callStatic.deploy(
    FactoryInitData.initCode,
    FactoryInitData.salt
  );
  if (targetAddress === AddressZero) {
    console.log(
      "  ✔ Module Proxy Factory already deployed to target address on this network."
    );
    return AddressZero;
  }

  console.log("  Target Module Proxy Factory address:        ", targetAddress);

  const transactionResponse = await singletonFactory.deploy(
    FactoryInitData.initCode,
    FactoryInitData.salt,
    { gasLimit: 1000000 }
  );

  const result = await transactionResponse.wait();
  console.log(
    "  Deploy transaction hash:              ",
    result.transactionHash
  );

  if ((await signer.provider.getCode(targetAddress)).length < 3) {
    // will return "0x" when there is no code
    throw new Error(
      "  \x1B[31m✘ Deployment unsuccessful: No code at target address.\x1B[0m"
    );
  } else {
    console.log(
      `  \x1B[32m✔ Successfully deployed the Module Proxy Factory to: ${targetAddress}\x1B[0m 🎉`
    );
  }
  return targetAddress;
};

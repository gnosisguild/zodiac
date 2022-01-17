import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers, Contract, Signer, BigNumber } from "ethers";

import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from "./constants";
import { KnownModules } from "./types";

export const deployAndSetUpModule = (
  contractName: keyof KnownModules,
  args: {
    types: Array<string>;
    values: Array<any>;
  },
  provider: JsonRpcProvider,
  chainId: number,
  saltNonce: string
) => {
  const { factory, module } = getFactoryAndMasterCopy(
    contractName,
    provider,
    chainId
  );

  const encodedInitParams = ethers.utils.defaultAbiCoder.encode(
    args.types,
    args.values
  );
  const moduleSetupData = module.interface.encodeFunctionData("setUp", [
    encodedInitParams,
  ]);

  const expectedModuleAddress = calculateProxyAddress(
    factory,
    module.address,
    moduleSetupData,
    saltNonce
  );

  const deployData = factory.interface.encodeFunctionData("deployModule", [
    module.address,
    moduleSetupData,
    saltNonce,
  ]);
  const transaction = {
    data: deployData,
    to: factory.address,
    value: BigNumber.from(0),
  };
  return {
    transaction,
    expectedModuleAddress,
  };
};

export const calculateProxyAddress = (
  factory: Contract,
  masterCopy: string,
  initData: string,
  saltNonce: string
) => {
  const masterCopyAddress = masterCopy.toLowerCase().replace(/^0x/, "");
  const byteCode =
    "0x602d8060093d393df3363d3d373d3d3d363d73" +
    masterCopyAddress +
    "5af43d82803e903d91602b57fd5bf3";

  const salt = ethers.utils.solidityKeccak256(
    ["bytes32", "uint256"],
    [ethers.utils.solidityKeccak256(["bytes"], [initData]), saltNonce]
  );

  return ethers.utils.getCreate2Address(
    factory.address,
    salt,
    ethers.utils.keccak256(byteCode)
  );
};

export const getModuleInstance = (
  moduleName: keyof KnownModules,
  address: string,
  provider: JsonRpcProvider | Signer
) => {
  const moduleIsNotSupported = !Object.keys(CONTRACT_ABIS).includes(moduleName);
  if (moduleIsNotSupported) {
    throw new Error("Module " + moduleName + " not supported");
  }
  return new Contract(address, CONTRACT_ABIS[moduleName], provider);
};

export const getFactoryAndMasterCopy = (
  moduleName: keyof KnownModules,
  provider: JsonRpcProvider,
  chainId: number
) => {
  const masterCopyAddress = CONTRACT_ADDRESSES[chainId][moduleName];
  const factoryAddress = CONTRACT_ADDRESSES[chainId].factory;
  const module = getModuleInstance(moduleName, masterCopyAddress, provider);
  const factory = new Contract(factoryAddress, CONTRACT_ABIS.factory, provider);

  return {
    factory,
    module,
  };
};

import { ethers, Contract, Signer, BigNumber } from "ethers";
import { ABI } from "hardhat-deploy/dist/types";

import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from "./constants";
import { KnownContracts } from "./types";

export const deployAndSetUpModule = (
  contractName: KnownContracts,
  args: {
    types: Array<string>;
    values: Array<any>;
  },
  provider: ethers.providers.JsonRpcProvider,
  chainId: number,
  saltNonce: string
) => {
  const { factory, module } = getFactoryAndMasterCopy(
    contractName,
    provider,
    chainId
  );
  return getDeployAndSetupTx(factory, module, args, saltNonce);
};

export const deployAndSetUpCustomModule = (
  masterCopyAddress: string,
  abi: ABI,
  setupArgs: {
    types: Array<string>;
    values: Array<any>;
  },
  provider: ethers.providers.JsonRpcProvider,
  chainId: number,
  saltNonce: string
) => {
  const chainContracts = CONTRACT_ADDRESSES[chainId];
  const factoryAddress = chainContracts.factory;
  const factory = new Contract(factoryAddress, CONTRACT_ABIS.factory, provider);
  const module = new Contract(masterCopyAddress, abi, provider);

  return getDeployAndSetupTx(factory, module, setupArgs, saltNonce);
};

const getDeployAndSetupTx = (
  factory: ethers.Contract,
  module: ethers.Contract,
  args: {
    types: Array<string>;
    values: Array<any>;
  },
  saltNonce: string
) => {
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
  moduleName: KnownContracts,
  address: string,
  provider: ethers.providers.JsonRpcProvider | Signer
) => {
  const moduleIsNotSupported = !Object.keys(CONTRACT_ABIS).includes(moduleName);
  if (moduleIsNotSupported) {
    throw new Error("Module " + moduleName + " not supported");
  }
  return new Contract(address, CONTRACT_ABIS[moduleName], provider);
};

export const getFactoryAndMasterCopy = (
  moduleName: KnownContracts,
  provider: ethers.providers.JsonRpcProvider,
  chainId: number
) => {
  const chainContracts = CONTRACT_ADDRESSES[chainId];
  const masterCopyAddress = chainContracts[moduleName];
  const factoryAddress = chainContracts.factory;
  const module = getModuleInstance(moduleName, masterCopyAddress, provider);
  const factory = new Contract(factoryAddress, CONTRACT_ABIS.factory, provider);

  return {
    factory,
    module,
  };
};

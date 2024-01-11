import {
  Contract,
  Signer,
  Provider,
  getCreate2Address,
  AbiCoder,
  solidityPackedKeccak256,
  keccak256,
} from "ethers";

import {
  ContractAddresses,
  ContractAbis,
  SupportedNetworks,
  ContractFactories,
} from "../contracts";
import { ModuleProxyFactory__factory } from "../types";

import { KnownContracts } from "./types";

type ABI = any[] | readonly any[];

type TxAndExpectedAddress = {
  transaction: {
    data: string;
    to: string;
    value: bigint;
  };
  expectedModuleAddress: string;
};

/**
 * Get the transaction for deploying a module proxy through the Module Proxy Factory.
 * This will also initialize the module proxy by calling the setup function.
 *
 * @param moduleName Name of the module to deploy (must be present in `KnownContracts`)
 * @param setupArgs The arguments for the setup function of the module
 * @param provider
 * @param chainId
 * @param saltNonce
 * @returns the transaction and the expected address of the module proxy
 */
export const deployAndSetUpModule = async (
  moduleName: KnownContracts,
  setupArgs: {
    types: Array<string>;
    values: Array<any>;
  },
  provider: Provider,
  chainId: number,
  saltNonce: string
): Promise<{
  transaction: { data: string; to: string; value: bigint };
  expectedModuleAddress: string;
}> => {
  const { moduleFactory, moduleMastercopy } = getModuleFactoryAndMasterCopy(
    moduleName,
    provider,
    chainId
  );

  return getDeployAndSetupTx(
    moduleFactory as unknown as Contract,
    moduleMastercopy as unknown as Contract,
    setupArgs,
    saltNonce
  );
};

/**
 * Get the transaction for deploying a module proxy through the Module Proxy Factory.
 * This will also initialize the module proxy by calling the setup function.
 *
 * This method is for modules that do not have a mastercopy listed in the `KnownContracts`
 * @param mastercopyAddress address of the mastercopy to use
 * @param abi abi of the module
 * @param setupArgs The arguments for the setup function of the module
 * @param provider
 * @param chainId
 * @param saltNonce
 * @returns the transaction and the expected address of the module proxy
 */
export const deployAndSetUpCustomModule = async (
  mastercopyAddress: string,
  abi: ABI,
  setupArgs: {
    types: Array<string>;
    values: Array<any>;
  },
  provider: Provider,
  chainId: number,
  saltNonce: string
): Promise<TxAndExpectedAddress> => {
  const chainContracts = ContractAddresses[chainId as SupportedNetworks];
  const moduleFactoryAddress = chainContracts.factory;
  const moduleFactory = new Contract(
    moduleFactoryAddress,
    ContractAbis.factory,
    provider
  );
  const moduleMastercopy = new Contract(mastercopyAddress, abi, provider);
  const deployAndSetupTx = await getDeployAndSetupTx(
    moduleFactory,
    moduleMastercopy,
    setupArgs,
    saltNonce
  );

  return deployAndSetupTx;
};

const getDeployAndSetupTx = async (
  moduleFactory: Contract,
  moduleMastercopy: Contract,
  setupArgs: {
    types: Array<string>;
    values: Array<any>;
  },
  saltNonce: string
) => {
  const encodedInitParams = AbiCoder.defaultAbiCoder().encode(
    setupArgs.types,
    setupArgs.values
  );

  const moduleSetupData = moduleMastercopy.interface.encodeFunctionData(
    "setUp",
    [encodedInitParams]
  );

  const expectedModuleAddress = await calculateProxyAddress(
    moduleFactory,
    await moduleMastercopy.getAddress(),
    moduleSetupData,
    saltNonce
  );

  const deployData = moduleFactory.interface.encodeFunctionData(
    "deployModule",
    [await moduleMastercopy.getAddress(), moduleSetupData, saltNonce]
  );
  const transaction = {
    data: deployData,
    to: await moduleFactory.getAddress(),
    value: 0n,
  };
  return {
    transaction,
    expectedModuleAddress,
  };
};

export const calculateProxyAddress = async (
  moduleFactory: Contract,
  mastercopyAddress: string,
  initData: string,
  saltNonce: string
): Promise<string> => {
  const mastercopyAddressFormatted = mastercopyAddress
    .toLowerCase()
    .replace(/^0x/, "");
  const byteCode =
    "0x602d8060093d393df3363d3d373d3d3d363d73" +
    mastercopyAddressFormatted +
    "5af43d82803e903d91602b57fd5bf3";

  const salt = solidityPackedKeccak256(
    ["bytes32", "uint256"],
    [solidityPackedKeccak256(["bytes"], [initData]), saltNonce]
  );

  return getCreate2Address(
    await moduleFactory.getAddress(),
    salt,
    keccak256(byteCode)
  );
};

export const getModuleInstance = <T extends KnownContracts>(
  moduleName: T,
  moduleAddress: string,
  provider: Provider | Signer
) => {
  const moduleIsNotSupported =
    !Object.keys(ContractFactories).includes(moduleName);
  if (moduleIsNotSupported) {
    throw new Error("Module " + moduleName + " not supported");
  }
  return ContractFactories[moduleName].connect(
    moduleAddress,
    provider
  ) as ReturnType<(typeof ContractFactories)[T]["connect"]>;
};

export const getModuleFactoryAndMasterCopy = <T extends KnownContracts>(
  moduleName: T,
  provider: Provider,
  chainId: SupportedNetworks
) => {
  const chainContracts = ContractAddresses[chainId as SupportedNetworks];
  const masterCopyAddress = chainContracts[moduleName];
  const factoryAddress = chainContracts.factory;
  const moduleMastercopy = getModuleInstance(
    moduleName,
    masterCopyAddress,
    provider
  );
  const moduleFactory = ModuleProxyFactory__factory.connect(
    factoryAddress,
    provider
  );

  return {
    moduleFactory,
    moduleMastercopy,
  };
};

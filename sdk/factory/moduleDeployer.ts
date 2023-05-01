import { Provider } from "@ethersproject/providers";
import { ethers, Contract, Signer, BigNumber } from "ethers";
import { ModuleProxyFactory__factory } from "../types";

import {
  ContractAddresses,
  ContractAbis,
  SupportedNetworks,
  ContractFactories,
} from "../contracts";
import { KnownContracts } from "./types";

type ABI = any[] | readonly any[];

type TxAndExpectedAddress = {
  transaction: {
    data: string;
    to: string;
    value: ethers.BigNumber;
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
export const deployAndSetUpModule = (
  moduleName: KnownContracts,
  setupArgs: {
    types: Array<string>;
    values: Array<any>;
  },
  provider: Provider,
  chainId: number,
  saltNonce: string
): TxAndExpectedAddress => {
  const { moduleFactory, moduleMastercopy } = getModuleFactoryAndMasterCopy(
    moduleName,
    provider,
    chainId
  );
  return getDeployAndSetupTx(
    moduleFactory,
    moduleMastercopy,
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
export const deployAndSetUpCustomModule = (
  mastercopyAddress: string,
  abi: ABI,
  setupArgs: {
    types: Array<string>;
    values: Array<any>;
  },
  provider: Provider,
  chainId: number,
  saltNonce: string
): TxAndExpectedAddress => {
  const chainContracts = ContractAddresses[chainId as SupportedNetworks];
  const moduleFactoryAddress = chainContracts.factory;
  const moduleFactory = new Contract(
    moduleFactoryAddress,
    ContractAbis.factory,
    provider
  );
  const moduleMastercopy = new Contract(mastercopyAddress, abi, provider);

  return getDeployAndSetupTx(
    moduleFactory,
    moduleMastercopy,
    setupArgs,
    saltNonce
  );
};

const getDeployAndSetupTx = (
  moduleFactory: ethers.Contract,
  moduleMastercopy: ethers.Contract,
  setupArgs: {
    types: Array<string>;
    values: Array<any>;
  },
  saltNonce: string
) => {
  const encodedInitParams = ethers.utils.defaultAbiCoder.encode(
    setupArgs.types,
    setupArgs.values
  );
  const moduleSetupData = moduleMastercopy.interface.encodeFunctionData(
    "setUp",
    [encodedInitParams]
  );

  const expectedModuleAddress = calculateProxyAddress(
    moduleFactory,
    moduleMastercopy.address,
    moduleSetupData,
    saltNonce
  );

  const deployData = moduleFactory.interface.encodeFunctionData(
    "deployModule",
    [moduleMastercopy.address, moduleSetupData, saltNonce]
  );
  const transaction = {
    data: deployData,
    to: moduleFactory.address,
    value: BigNumber.from(0),
  };
  return {
    transaction,
    expectedModuleAddress,
  };
};

export const calculateProxyAddress = (
  moduleFactory: Contract,
  mastercopyAddress: string,
  initData: string,
  saltNonce: string
): string => {
  const mastercopyAddressFormatted = mastercopyAddress
    .toLowerCase()
    .replace(/^0x/, "");
  const byteCode =
    "0x602d8060093d393df3363d3d373d3d3d363d73" +
    mastercopyAddressFormatted +
    "5af43d82803e903d91602b57fd5bf3";

  const salt = ethers.utils.solidityKeccak256(
    ["bytes32", "uint256"],
    [ethers.utils.solidityKeccak256(["bytes"], [initData]), saltNonce]
  );

  return ethers.utils.getCreate2Address(
    moduleFactory.address,
    salt,
    ethers.utils.keccak256(byteCode)
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
  ) as ReturnType<typeof ContractFactories[T]["connect"]>;
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

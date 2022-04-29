import { ethers } from "hardhat";
import { Contract } from "ethers";
import { expect } from "chai";
import {
  deployAndSetUpModule,
  deployAndSetUpCustomModule,
  getModuleInstance,
  getFactoryAndMasterCopy,
} from "../factory";
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from "../constants";

import "@nomiclabs/hardhat-ethers";
import { KnownContracts } from "../types";

const AddressOne = "0x0000000000000000000000000000000000000001";

describe("Factory JS functions ", () => {
  let newModuleAddress: string;
  let chainId: number;
  let mockContract: Contract;

  const saltNonce: string = "0x7255";
  const provider = ethers.provider;

  before(async () => {
    const Mock = await ethers.getContractFactory("MockContract");
    mockContract = await Mock.deploy();
    chainId = await (await provider.getNetwork()).chainId;
  });

  it("should execute transaction and retrieve expected address ", async () => {
    const [signer] = await ethers.getSigners();
    const args = {
      values: [
        AddressOne,
        AddressOne,
        AddressOne,
        100,
        180,
        2000,
        100000000,
        1,
      ],
      types: [
        "address",
        "address",
        "address",
        "uint32",
        "uint32",
        "uint32",
        "uint256",
        "uint256",
      ],
    };
    const { transaction: deployTx, expectedModuleAddress } =
      await deployAndSetUpModule(
        KnownContracts.REALITY_ETH,
        args,
        provider,
        chainId,
        saltNonce
      );

    const transaction = await signer.sendTransaction(deployTx);

    const receipt = await transaction.wait();
    expect(receipt.transactionHash).to.be.a("string");
    expect(receipt.status).to.be.eq(1);
    expect(expectedModuleAddress).to.a("string");
    newModuleAddress = expectedModuleAddress;
  });

  it("should execute transaction and retrieve expected address when providing the address and ABI directly", async () => {
    const [signer] = await ethers.getSigners();
    const args = {
      values: [
        AddressOne,
        AddressOne,
        AddressOne,
        100,
        180,
        2000,
        100000000,
        1,
      ],
      types: [
        "address",
        "address",
        "address",
        "uint32",
        "uint32",
        "uint32",
        "uint256",
        "uint256",
      ],
    };

    const chainContracts = CONTRACT_ADDRESSES[chainId];
    const masterCopyAddress = chainContracts[KnownContracts.REALITY_ETH];
    const abi = CONTRACT_ABIS[KnownContracts.REALITY_ETH];

    const { transaction: deployTx, expectedModuleAddress } =
      await deployAndSetUpCustomModule(
        masterCopyAddress,
        abi,
        args,
        provider,
        chainId,
        saltNonce
      );

    const transaction = await signer.sendTransaction(deployTx);

    const receipt = await transaction.wait();
    expect(receipt.transactionHash).to.be.a("string");
    expect(receipt.status).to.be.eq(1);
    expect(expectedModuleAddress).to.a("string");
    newModuleAddress = expectedModuleAddress;
  });

  it("should retrieve module instance", async () => {
    const module = await getModuleInstance(
      KnownContracts.REALITY_ETH,
      mockContract.address,
      provider
    );
    await mockContract.givenMethodReturnBool(
      module.interface.getSighash("initialized"),
      true
    );

    const initialized = await module.initialized();
    expect(initialized).to.be.true;
    expect(module).to.be.instanceOf(Contract);
  });

  it("should retrieve factory and module instance", async () => {
    const { module, factory } = await getFactoryAndMasterCopy(
      KnownContracts.REALITY_ETH,
      provider,
      chainId
    );
    expect(module).to.be.instanceOf(Contract);
    expect(factory).to.be.instanceOf(Contract);
  });
});

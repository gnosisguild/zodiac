import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

import {
  ContractAddresses,
  ContractAbis,
  SupportedNetworks,
} from "../../contracts";
import {
  deployAndSetUpModule,
  deployAndSetUpCustomModule,
  getModuleInstance,
  getModuleFactoryAndMasterCopy,
} from "../moduleDeployer";

import "@nomiclabs/hardhat-ethers";
import { KnownContracts } from "../types";

const AddressOne = "0x0000000000000000000000000000000000000001";

describe("Factory JS functions ", () => {
  //let newModuleAddress: string;
  let chainId: number;
  let mockContract: Contract;

  const saltNonce = "0x7255";
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
    //newModuleAddress = expectedModuleAddress;
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

    const chainContracts = ContractAddresses[chainId as SupportedNetworks];
    const masterCopyAddress = chainContracts[KnownContracts.REALITY_ETH];
    const abi = ContractAbis[KnownContracts.REALITY_ETH];

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
    //newModuleAddress = expectedModuleAddress;
  });

  it("should retrieve module instance", async () => {
    const module = await getModuleInstance(
      KnownContracts.REALITY_ETH,
      mockContract.address,
      provider
    );
    await mockContract.givenMethodReturnBool(
      module.interface.getSighash("owner"),
      true
    );

    const owner = await module.owner();
    expect(owner).to.equal("0x0000000000000000000000000000000000000001");
    expect(module).to.be.instanceOf(Contract);
  });

  it("should retrieve factory and module instance", async () => {
    const { moduleFactory, moduleMastercopy } =
      await getModuleFactoryAndMasterCopy(
        KnownContracts.REALITY_ETH,
        provider,
        chainId
      );
    expect(moduleFactory).to.be.instanceOf(Contract);
    expect(moduleMastercopy).to.be.instanceOf(Contract);
  });
});

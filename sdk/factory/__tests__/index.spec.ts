import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { Contract } from "ethers";
import hre from "hardhat";

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

import { KnownContracts } from "../types";

const AddressOne = "0x0000000000000000000000000000000000000001";

describe("Factory JS functions ", () => {
  const saltNonce = "0x7255";

  async function setup() {
    const Mock = await hre.ethers.getContractFactory("MockContract");
    const mock = await Mock.deploy();
    const chainId = (await hre.ethers.provider.getNetwork()).chainId;

    return { mock, chainId };
  }

  it("should execute transaction and retrieve expected address ", async () => {
    const { mock, chainId } = await loadFixture(setup);

    const [signer] = await hre.ethers.getSigners();

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
        hre.ethers.provider,
        chainId,
        saltNonce
      );

    const transaction = await signer.sendTransaction(deployTx);

    const receipt = await transaction.wait();
    expect(receipt.transactionHash).to.be.a("string");
    expect(receipt.status).to.be.eq(1);
    expect(expectedModuleAddress).to.a("string");
  });

  it("should execute transaction and retrieve expected address when providing the address and ABI directly", async () => {
    const { chainId } = await loadFixture(setup);
    const [signer] = await hre.ethers.getSigners();
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
        hre.ethers.provider,
        chainId,
        saltNonce
      );

    const transaction = await signer.sendTransaction(deployTx);

    const receipt = await transaction.wait();
    expect(receipt.transactionHash).to.be.a("string");
    expect(receipt.status).to.be.eq(1);
    expect(expectedModuleAddress).to.a("string");
  });

  it("should retrieve module instance", async () => {
    const { mock } = await loadFixture(setup);

    const module = await getModuleInstance(
      KnownContracts.REALITY_ETH,
      mock.address,
      hre.ethers.provider
    );
    await mock.givenMethodReturnBool(
      module.interface.getSighash("owner"),
      true
    );

    const owner = await module.owner();
    expect(owner).to.equal("0x0000000000000000000000000000000000000001");
    expect(module).to.be.instanceOf(Contract);
  });

  it("should retrieve factory and module instance", async () => {
    const { chainId } = await loadFixture(setup);

    const { moduleFactory, moduleMastercopy } =
      await getModuleFactoryAndMasterCopy(
        KnownContracts.REALITY_ETH,
        hre.ethers.provider,
        chainId
      );
    expect(moduleFactory).to.be.instanceOf(Contract);
    expect(moduleMastercopy).to.be.instanceOf(Contract);
  });
});

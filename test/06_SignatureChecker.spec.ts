import hre from "hardhat";
import { TestSignature__factory } from "../typechain-types";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { PopulatedTransaction } from "ethers";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import typedDataForTransaction from "./typesDataForTransaction";
import { defaultAbiCoder, solidityPack } from "ethers/lib/utils";

describe("SignatureChecker", async () => {
  async function setup() {
    const [signer, relayer] = await hre.ethers.getSigners();
    const TestSignature = await hre.ethers.getContractFactory("TestSignature");
    const testSignature = await TestSignature.deploy();

    return {
      testSignature: TestSignature__factory.connect(
        testSignature.address,
        relayer
      ),
      signer,
      relayer,
    };
  }

  const AddressZero = "0x0000000000000000000000000000000000000000";

  it("correctly detects an appended signature, for an entrypoint no arguments", async () => {
    const { testSignature, signer, relayer } = await loadFixture(setup);

    const transaction = await testSignature.populateTransaction.hello();
    const signature = await sign(testSignature.address, transaction, signer);
    const transactionWithSig = {
      ...transaction,
      data: `${transaction.data}${signature.slice(2)}`,
    };

    await expect(await relayer.sendTransaction(transaction))
      .to.emit(testSignature, "Hello")
      .withArgs(AddressZero);

    await expect(await relayer.sendTransaction(transactionWithSig))
      .to.emit(testSignature, "Hello")
      .withArgs(signer.address);
  });

  it("correctly detects an appended signature, entrypoint with arguments", async () => {
    const { testSignature, signer, relayer } = await loadFixture(setup);

    const transaction = await testSignature.populateTransaction.goodbye(
      0,
      "0xbadfed"
    );
    const signature = await sign(testSignature.address, transaction, signer);
    const transactionWithSig = {
      ...transaction,
      data: `${transaction.data}${signature.slice(2)}`,
    };

    await expect(await relayer.sendTransaction(transaction))
      .to.emit(testSignature, "Goodbye")
      .withArgs(AddressZero);

    await expect(await relayer.sendTransaction(transactionWithSig))
      .to.emit(testSignature, "Goodbye")
      .withArgs(signer.address);
  });

  it("contract signature, signer returns isValid yes", async () => {
    const { testSignature, relayer } = await loadFixture(setup);

    const ContractSigner = await hre.ethers.getContractFactory(
      "ContractSignerYes"
    );
    const contractSigner = await ContractSigner.deploy();

    const transaction = await testSignature.populateTransaction.goodbye(
      0,
      "0xbadfed"
    );

    const signature = makeContractSignature(
      contractSigner.address,
      transaction,
      "0xaabbccddeeff"
    );

    const transactionWithSig = {
      ...transaction,
      data: `${transaction.data}${signature.slice(2)}`,
    };

    await expect(await relayer.sendTransaction(transaction))
      .to.emit(testSignature, "Goodbye")
      .withArgs(AddressZero);

    await expect(await relayer.sendTransaction(transactionWithSig))
      .to.emit(testSignature, "Goodbye")
      .withArgs(contractSigner.address);
  });

  it("contract signature, signer returns isValid no", async () => {
    const { testSignature, relayer } = await loadFixture(setup);

    const Signer = await hre.ethers.getContractFactory("ContractSignerNo");
    const signer = await Signer.deploy();

    const transaction = await testSignature.populateTransaction.hello();

    const signature = makeContractSignature(
      signer.address,
      transaction,
      "0xaabbccddeeff"
    );

    const transactionWithSig = {
      ...transaction,
      data: `${transaction.data}${signature.slice(2)}`,
    };

    await expect(await relayer.sendTransaction(transactionWithSig))
      .to.emit(testSignature, "Hello")
      .withArgs(AddressZero);
  });

  it("contract signature, bad return size", async () => {
    const { testSignature, relayer } = await loadFixture(setup);

    const Signer = await hre.ethers.getContractFactory(
      "ContractSignerReturnSize"
    );
    const signer = await Signer.deploy();

    const transaction = await testSignature.populateTransaction.hello();

    const signature = makeContractSignature(
      signer.address,
      transaction,
      "0xaabbccddeeff"
    );

    const transactionWithSig = {
      ...transaction,
      data: `${transaction.data}${signature.slice(2)}`,
    };

    await expect(await relayer.sendTransaction(transactionWithSig))
      .to.emit(testSignature, "Hello")
      .withArgs(AddressZero);
  });

  it("contract signature, signer with faulty entrypoint", async () => {
    const { testSignature, relayer } = await loadFixture(setup);

    const Signer = await hre.ethers.getContractFactory("ContractSignerFaulty");
    const signer = await Signer.deploy();

    const transaction = await testSignature.populateTransaction.hello();

    const signature = makeContractSignature(
      signer.address,
      transaction,
      "0xaabbccddeeff"
    );

    const transactionWithSig = {
      ...transaction,
      data: `${transaction.data}${signature.slice(2)}`,
    };

    await expect(await relayer.sendTransaction(transactionWithSig))
      .to.emit(testSignature, "Hello")
      .withArgs(AddressZero);
  });

  it("contract signature, signer with no code deployed", async () => {
    const { testSignature, relayer } = await loadFixture(setup);

    const signerAddress = "0x1234567890000000000000000000000123456789";

    await expect(await hre.ethers.provider.getCode(signerAddress)).to.equal(
      "0x"
    );

    const transaction = await testSignature.populateTransaction.hello();

    const signature = makeContractSignature(
      signerAddress,
      transaction,
      "0xaabbccddeeff"
    );

    const transactionWithSig = {
      ...transaction,
      data: `${transaction.data}${signature.slice(2)}`,
    };

    await expect(await relayer.sendTransaction(transactionWithSig))
      .to.emit(testSignature, "Hello")
      .withArgs(AddressZero);
  });

  it("it publicly exposes the eip712 nonce", async () => {
    const { testSignature } = await loadFixture(setup);
    expect(await testSignature.moduleTxNonce()).to.equal(0);
  });
});

async function sign(
  contract: string,
  transaction: PopulatedTransaction,
  signer: SignerWithAddress
) {
  const { domain, types, message } = typedDataForTransaction(
    { contract, chainId: 31337, nonce: 0 },
    transaction.data || "0x"
  );
  return await signer._signTypedData(domain, types, message);
}

function makeContractSignature(
  contract: string,
  transaction: PopulatedTransaction,
  signature: string
) {
  const dataBytesLength = (transaction.data?.length as number) / 2 - 1;

  const r = defaultAbiCoder.encode(["address"], [contract]);
  const s = defaultAbiCoder.encode(["uint256"], [dataBytesLength]);
  const v = solidityPack(["uint8"], [0]);

  return `${signature}${r.slice(2)}${s.slice(2)}${v.slice(2)}`;
}

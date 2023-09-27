import hre from "hardhat";
import { TestSignature__factory } from "../typechain-types";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { BigNumberish, PopulatedTransaction } from "ethers";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Eip712Signature", async () => {
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
});

async function sign(
  contract: string,
  transaction: PopulatedTransaction,
  signer: SignerWithAddress
) {
  const { domain, types, message } = typedDataForTransaction(
    { contract, chainId: 31337, nonce: 0 },
    { value: transaction.value || 0, data: transaction.data || "0x" }
  );
  return await signer._signTypedData(domain, types, message);
}

function typedDataForTransaction(
  {
    contract,
    chainId,
    nonce,
  }: {
    contract: string;
    chainId: BigNumberish;
    nonce: BigNumberish;
  },
  { value, data }: { value: BigNumberish; data: string }
) {
  const domain = { verifyingContract: contract, chainId };
  const types = {
    Transaction: [
      { type: "uint256", name: "value" },
      { type: "bytes", name: "data" },
      { type: "uint256", name: "nonce" },
    ],
  };
  const message = {
    value,
    data,
    nonce,
  };

  return { domain, types, message };
}

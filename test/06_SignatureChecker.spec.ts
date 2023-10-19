import hre from "hardhat";
import { TestSignature__factory } from "../typechain-types";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { PopulatedTransaction } from "ethers";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import typedDataForTransaction from "./typedDataForTransaction";
import {
  defaultAbiCoder,
  keccak256,
  solidityPack,
  toUtf8Bytes,
} from "ethers/lib/utils";

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
    const signature = await sign(
      testSignature.address,
      transaction,
      keccak256(toUtf8Bytes("Hello this is a salt")),
      signer
    );
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
    const signature = await sign(
      testSignature.address,
      transaction,
      keccak256(toUtf8Bytes("salt")),
      signer
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
      .withArgs(signer.address);
  });

  describe("contract signature", () => {
    it("s pointing out of bounds fails", async () => {
      const { testSignature, relayer } = await loadFixture(setup);

      const ContractSigner = await hre.ethers.getContractFactory(
        "ContractSignerYes"
      );
      const signer = (await ContractSigner.deploy()).address;

      const transaction = await testSignature.populateTransaction.hello();

      // 4 bytes of selector plus 3 bytes of custom signature
      // an s of 4, 5 or 6 should be okay. 7 and higher should fail
      let signature = makeContractSignature(
        transaction,
        "0xdddddd",
        keccak256(toUtf8Bytes("salt")),
        signer,
        defaultAbiCoder.encode(["uint256"], [1000])
      );

      await expect(
        await relayer.sendTransaction({
          ...transaction,
          data: `${transaction.data}${signature.slice(2)}`,
        })
      )
        .to.emit(testSignature, "Hello")
        .withArgs(AddressZero);

      signature = makeContractSignature(
        transaction,
        "0xdddddd",
        keccak256(toUtf8Bytes("salt")),
        signer,
        defaultAbiCoder.encode(["uint256"], [6])
      );

      await expect(
        await relayer.sendTransaction({
          ...transaction,
          data: `${transaction.data}${signature.slice(2)}`,
        })
      )
        .to.emit(testSignature, "Hello")
        .withArgs(signer);
    });
    it("s pointing to selector fails", async () => {
      const { testSignature, relayer } = await loadFixture(setup);

      const ContractSigner = await hre.ethers.getContractFactory(
        "ContractSignerYes"
      );
      const signer = (await ContractSigner.deploy()).address;

      const transaction = await testSignature.populateTransaction.hello();

      let signature = makeContractSignature(
        transaction,
        "0xdddddd",
        keccak256(toUtf8Bytes("salt")),
        signer,
        defaultAbiCoder.encode(["uint256"], [3])
      );

      await expect(
        await relayer.sendTransaction({
          ...transaction,
          data: `${transaction.data}${signature.slice(2)}`,
        })
      )
        .to.emit(testSignature, "Hello")
        .withArgs(AddressZero);

      signature = makeContractSignature(
        transaction,
        "0xdddddd",
        keccak256(toUtf8Bytes("salt")),
        signer,
        defaultAbiCoder.encode(["uint256"], [4])
      );

      await expect(
        await relayer.sendTransaction({
          ...transaction,
          data: `${transaction.data}${signature.slice(2)}`,
        })
      )
        .to.emit(testSignature, "Hello")
        .withArgs(signer);
    });
    it("s pointing to signature fails", async () => {
      const { testSignature, relayer } = await loadFixture(setup);

      const ContractSigner = await hre.ethers.getContractFactory(
        "ContractSignerYes"
      );
      const signer = (await ContractSigner.deploy()).address;

      const transaction = await testSignature.populateTransaction.hello();

      let signature = makeContractSignature(
        transaction,
        "0xdddddd",
        keccak256(toUtf8Bytes("salt")),
        signer,
        defaultAbiCoder.encode(["uint256"], [60])
      );

      await expect(
        await relayer.sendTransaction({
          ...transaction,
          data: `${transaction.data}${signature.slice(2)}`,
        })
      )
        .to.emit(testSignature, "Hello")
        .withArgs(AddressZero);

      signature = makeContractSignature(
        transaction,
        "0xdddddd",
        keccak256(toUtf8Bytes("salt")),
        signer,
        defaultAbiCoder.encode(["uint256"], [6])
      );

      await expect(
        await relayer.sendTransaction({
          ...transaction,
          data: `${transaction.data}${signature.slice(2)}`,
        })
      )
        .to.emit(testSignature, "Hello")
        .withArgs(signer);
    });
    it("signer returns isValid maybe", async () => {
      const { testSignature, relayer } = await loadFixture(setup);

      const ContractSigner = await hre.ethers.getContractFactory(
        "ContractSignerMaybe"
      );
      const contractSigner = await ContractSigner.deploy();

      const transaction = await testSignature.populateTransaction.goodbye(
        0,
        "0xbadfed"
      );

      const signatureGood = makeContractSignature(
        transaction,
        "0x001122334455",
        keccak256(toUtf8Bytes("some irrelevant salt")),
        contractSigner.address
      );

      const signatureBad = makeContractSignature(
        transaction,
        "0x00112233445566",
        keccak256(toUtf8Bytes("some irrelevant salt")),
        contractSigner.address
      );

      const transactionWithGoodSig = {
        ...transaction,
        data: `${transaction.data}${signatureGood.slice(2)}`,
      };
      const transactionWithBadSig = {
        ...transaction,
        data: `${transaction.data}${signatureBad.slice(2)}`,
      };

      await expect(await relayer.sendTransaction(transaction))
        .to.emit(testSignature, "Goodbye")
        .withArgs(AddressZero);

      await expect(await relayer.sendTransaction(transactionWithGoodSig))
        .to.emit(testSignature, "Goodbye")
        .withArgs(contractSigner.address);

      await expect(await relayer.sendTransaction(transactionWithBadSig))
        .to.emit(testSignature, "Goodbye")
        .withArgs(AddressZero);
    });
    it("signer returns isValid yes", async () => {
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
        transaction,
        "0xaabbccddeeff",
        keccak256(toUtf8Bytes("salt")),
        contractSigner.address
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
    it("signer returns isValid no", async () => {
      const { testSignature, relayer } = await loadFixture(setup);

      const Signer = await hre.ethers.getContractFactory("ContractSignerNo");
      const signer = await Signer.deploy();

      const transaction = await testSignature.populateTransaction.hello();

      const signature = makeContractSignature(
        transaction,
        "0xaabbccddeeff",
        keccak256(toUtf8Bytes("salt")),
        signer.address
      );

      const transactionWithSig = {
        ...transaction,
        data: `${transaction.data}${signature.slice(2)}`,
      };

      await expect(await relayer.sendTransaction(transactionWithSig))
        .to.emit(testSignature, "Hello")
        .withArgs(AddressZero);
    });
    it("signer bad return size", async () => {
      const { testSignature, relayer } = await loadFixture(setup);

      const Signer = await hre.ethers.getContractFactory(
        "ContractSignerReturnSize"
      );
      const signer = await Signer.deploy();

      const transaction = await testSignature.populateTransaction.hello();

      const signature = makeContractSignature(
        transaction,
        "0xaabbccddeeff",
        keccak256(toUtf8Bytes("salt")),
        signer.address
      );

      const transactionWithSig = {
        ...transaction,
        data: `${transaction.data}${signature.slice(2)}`,
      };

      await expect(await relayer.sendTransaction(transactionWithSig))
        .to.emit(testSignature, "Hello")
        .withArgs(AddressZero);
    });
    it("signer with faulty entrypoint", async () => {
      const { testSignature, relayer } = await loadFixture(setup);

      const Signer = await hre.ethers.getContractFactory(
        "ContractSignerFaulty"
      );
      const signer = await Signer.deploy();

      const transaction = await testSignature.populateTransaction.hello();

      const signature = makeContractSignature(
        transaction,
        "0xaabbccddeeff",
        keccak256(toUtf8Bytes("salt")),
        signer.address
      );

      const transactionWithSig = {
        ...transaction,
        data: `${transaction.data}${signature.slice(2)}`,
      };

      await expect(await relayer.sendTransaction(transactionWithSig))
        .to.emit(testSignature, "Hello")
        .withArgs(AddressZero);
    });
    it("signer with no code deployed", async () => {
      const { testSignature, relayer } = await loadFixture(setup);

      const signerAddress = "0x1234567890000000000000000000000123456789";

      await expect(await hre.ethers.provider.getCode(signerAddress)).to.equal(
        "0x"
      );

      const transaction = await testSignature.populateTransaction.hello();

      const signature = makeContractSignature(
        transaction,
        "0xaabbccddeeff",
        keccak256(toUtf8Bytes("salt")),
        signerAddress
      );

      const transactionWithSig = {
        ...transaction,
        data: `${transaction.data}${signature.slice(2)}`,
      };

      await expect(await relayer.sendTransaction(transactionWithSig))
        .to.emit(testSignature, "Hello")
        .withArgs(AddressZero);
    });
  });
});

async function sign(
  contract: string,
  transaction: PopulatedTransaction,
  salt: string,
  signer: SignerWithAddress
) {
  const { domain, types, message } = typedDataForTransaction(
    { contract, chainId: 31337, salt },
    transaction.data || "0x"
  );

  const signature = await signer._signTypedData(domain, types, message);

  return `${salt}${signature.slice(2)}`;
}

function makeContractSignature(
  transaction: PopulatedTransaction,
  signerSpecificSignature: string,
  salt: string,
  r: string,
  s?: string
) {
  const dataBytesLength = (transaction.data?.length as number) / 2 - 1;

  r = defaultAbiCoder.encode(["address"], [r]);
  s = s || defaultAbiCoder.encode(["uint256"], [dataBytesLength]);
  const v = solidityPack(["uint8"], [0]);

  return `${signerSpecificSignature}${salt.slice(2)}${r.slice(2)}${s.slice(
    2
  )}${v.slice(2)}`;
}

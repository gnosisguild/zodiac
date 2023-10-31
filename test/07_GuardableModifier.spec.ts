import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { PopulatedTransaction } from "ethers";
import { keccak256, toUtf8Bytes } from "ethers/lib/utils";
import hre from "hardhat";

import {
  TestAvatar__factory,
  TestGuard__factory,
  TestGuardableModifier__factory,
} from "../typechain-types";

import typedDataForTransaction from "./typedDataForTransaction";

describe("GuardableModifier", async () => {
  async function setupTests() {
    const [deployer, executor, signer, someone, relayer] =
      await hre.ethers.getSigners();

    const Avatar = await hre.ethers.getContractFactory("TestAvatar");
    const avatar = TestAvatar__factory.connect(
      (await Avatar.deploy()).address,
      deployer
    );

    const Modifier = await hre.ethers.getContractFactory(
      "TestGuardableModifier"
    );
    const modifier = TestGuardableModifier__factory.connect(
      (await Modifier.connect(deployer).deploy(avatar.address, avatar.address))
        .address,
      deployer
    );
    const Guard = await hre.ethers.getContractFactory("TestGuard");
    const guard = TestGuard__factory.connect(
      (await Guard.deploy(modifier.address)).address,
      hre.ethers.provider
    );

    await avatar.enableModule(modifier.address);
    await modifier.enableModule(executor.address);

    return {
      executor,
      signer,
      someone,
      relayer,
      avatar,
      guard,
      modifier,
    };
  }

  describe("exec", async () => {
    it("skips guard pre-check if no guard is set", async () => {
      const { avatar, modifier, executor } = await loadFixture(setupTests);

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModule(avatar.address, 0, "0x", 0)
      ).to.not.be.reverted;
    });

    it("pre-checks transaction if guard is set", async () => {
      const { avatar, executor, modifier, guard } =
        await loadFixture(setupTests);
      await modifier.setGuard(guard.address);

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModule(avatar.address, 0, "0x", 0)
      )
        .to.emit(guard, "PreChecked")
        .withArgs(executor.address);
    });

    it("pre-check gets called with signer when transaction is relayed", async () => {
      const { signer, modifier, relayer, avatar, guard } =
        await loadFixture(setupTests);

      await modifier.enableModule(signer.address);
      await modifier.setGuard(guard.address);

      const inner = await avatar.populateTransaction.enableModule(
        "0xff00000000000000000000000000000000ff3456"
      );

      const { from, ...transaction } =
        await modifier.populateTransaction.execTransactionFromModule(
          avatar.address,
          0,
          inner.data as string,
          0
        );

      const signature = await sign(
        modifier.address,
        transaction,
        keccak256(toUtf8Bytes("salt")),
        signer
      );
      const transactionWithSig = {
        ...transaction,
        to: modifier.address,
        data: `${transaction.data}${signature.slice(2)}`,
        value: 0,
      };

      await expect(await relayer.sendTransaction(transactionWithSig))
        .to.emit(guard, "PreChecked")
        .withArgs(signer.address);
    });

    it("pre-checks and reverts transaction if guard is set", async () => {
      const { avatar, executor, modifier, guard } =
        await loadFixture(setupTests);
      await modifier.setGuard(guard.address);

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModule(avatar.address, 1337, "0x", 0)
      ).to.be.revertedWith("Cannot send 1337");
    });

    it("skips post-check if no guard is enabled", async () => {
      const { avatar, executor, modifier, guard } =
        await loadFixture(setupTests);

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModule(avatar.address, 0, "0x", 0)
      ).not.to.emit(guard, "PostChecked");
    });

    it("post-checks transaction if guard is set", async () => {
      const { avatar, executor, modifier, guard } =
        await loadFixture(setupTests);
      await modifier.setGuard(guard.address);

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModule(avatar.address, 0, "0x", 0)
      )
        .to.emit(guard, "PostChecked")
        .withArgs(true);
    });
  });

  describe("execAndReturnData", async () => {
    it("skips guard pre-check if no guard is set", async () => {
      const { avatar, modifier, executor } = await loadFixture(setupTests);

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModuleReturnData(avatar.address, 0, "0x", 0)
      ).to.not.be.reverted;
    });

    it("pre-checks transaction if guard is set", async () => {
      const { avatar, executor, modifier, guard } =
        await loadFixture(setupTests);
      await modifier.setGuard(guard.address);

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModuleReturnData(avatar.address, 0, "0x", 0)
      )
        .to.emit(guard, "PreChecked")
        .withArgs(executor.address);
    });

    it("pre-check gets called with signer when transaction is relayed", async () => {
      const { signer, modifier, relayer, avatar, guard } =
        await loadFixture(setupTests);

      await modifier.enableModule(signer.address);
      await modifier.setGuard(guard.address);

      const inner = await avatar.populateTransaction.enableModule(
        "0xff00000000000000000000000000000000ff3456"
      );

      const { from, ...transaction } =
        await modifier.populateTransaction.execTransactionFromModuleReturnData(
          avatar.address,
          0,
          inner.data as string,
          0
        );

      const signature = await sign(
        modifier.address,
        transaction,
        keccak256(toUtf8Bytes("salt")),
        signer
      );
      const transactionWithSig = {
        ...transaction,
        to: modifier.address,
        data: `${transaction.data}${signature.slice(2)}`,
        value: 0,
      };

      await expect(await relayer.sendTransaction(transactionWithSig))
        .to.emit(guard, "PreChecked")
        .withArgs(signer.address);
    });

    it("pre-checks and reverts transaction if guard is set", async () => {
      const { avatar, executor, modifier, guard } =
        await loadFixture(setupTests);
      await modifier.setGuard(guard.address);

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModuleReturnData(avatar.address, 1337, "0x", 0)
      ).to.be.revertedWith("Cannot send 1337");
    });

    it("skips post-check if no guard is enabled", async () => {
      const { avatar, executor, modifier, guard } =
        await loadFixture(setupTests);

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModuleReturnData(avatar.address, 0, "0x", 0)
      ).not.to.emit(guard, "PostChecked");
    });

    it("post-checks transaction if guard is set", async () => {
      const { avatar, executor, modifier, guard } =
        await loadFixture(setupTests);
      await modifier.setGuard(guard.address);

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModuleReturnData(avatar.address, 0, "0x", 0)
      )
        .to.emit(guard, "PostChecked")
        .withArgs(true);
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

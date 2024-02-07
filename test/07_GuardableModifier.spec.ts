import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { Signer, TransactionLike, keccak256, toUtf8Bytes } from "ethers";
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
      await (await Avatar.deploy()).getAddress(),
      deployer
    );

    const Modifier = await hre.ethers.getContractFactory(
      "TestGuardableModifier"
    );
    const modifier = TestGuardableModifier__factory.connect(
      await (
        await Modifier.connect(deployer).deploy(
          await avatar.getAddress(),
          await avatar.getAddress()
        )
      ).getAddress(),
      deployer
    );
    const Guard = await hre.ethers.getContractFactory("TestGuard");
    const guard = TestGuard__factory.connect(
      await (await Guard.deploy(await modifier.getAddress())).getAddress(),
      hre.ethers.provider
    );

    await avatar.enableModule(await modifier.getAddress());
    await modifier.enableModule(await executor.getAddress());

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
          .execTransactionFromModule(await avatar.getAddress(), 0, "0x", 0)
      ).to.not.be.reverted;
    });

    it("pre-checks transaction if guard is set", async () => {
      const { avatar, executor, modifier, guard } =
        await loadFixture(setupTests);
      await modifier.setGuard(await guard.getAddress());

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModule(await avatar.getAddress(), 0, "0x", 0)
      )
        .to.emit(guard, "PreChecked")
        .withArgs(await executor.getAddress());
    });

    it("pre-check gets called with signer when transaction is relayed", async () => {
      const { signer, modifier, relayer, avatar, guard } =
        await loadFixture(setupTests);

      await modifier.enableModule(await signer.getAddress());
      await modifier.setGuard(await guard.getAddress());

      const inner = await avatar.enableModule.populateTransaction(
        "0xff00000000000000000000000000000000ff3456"
      );

      const { from, ...transaction } =
        await modifier.execTransactionFromModule.populateTransaction(
          await avatar.getAddress(),
          0,
          inner.data as string,
          0
        );

      const signature = await sign(
        await modifier.getAddress(),
        transaction,
        keccak256(toUtf8Bytes("salt")),
        signer
      );
      const transactionWithSig = {
        ...transaction,
        to: await modifier.getAddress(),
        data: `${transaction.data}${signature.slice(2)}`,
        value: 0,
      };

      await expect(await relayer.sendTransaction(transactionWithSig))
        .to.emit(guard, "PreChecked")
        .withArgs(await signer.getAddress());
    });

    it("pre-checks and reverts transaction if guard is set", async () => {
      const { avatar, executor, modifier, guard } =
        await loadFixture(setupTests);
      await modifier.setGuard(await guard.getAddress());

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModule(await avatar.getAddress(), 1337, "0x", 0)
      ).to.be.revertedWith("Cannot send 1337");
    });

    it("skips post-check if no guard is enabled", async () => {
      const { avatar, executor, modifier, guard } =
        await loadFixture(setupTests);

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModule(await avatar.getAddress(), 0, "0x", 0)
      ).not.to.emit(guard, "PostChecked");
    });

    it("post-checks transaction if guard is set", async () => {
      const { avatar, executor, modifier, guard } =
        await loadFixture(setupTests);
      await modifier.setGuard(await guard.getAddress());

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModule(await avatar.getAddress(), 0, "0x", 0)
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
          .execTransactionFromModuleReturnData(
            await avatar.getAddress(),
            0,
            "0x",
            0
          )
      ).to.not.be.reverted;
    });

    it("pre-checks transaction if guard is set", async () => {
      const { avatar, executor, modifier, guard } =
        await loadFixture(setupTests);
      await modifier.setGuard(await guard.getAddress());

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModuleReturnData(
            await avatar.getAddress(),
            0,
            "0x",
            0
          )
      )
        .to.emit(guard, "PreChecked")
        .withArgs(await executor.getAddress());
    });

    it("pre-check gets called with signer when transaction is relayed", async () => {
      const { signer, modifier, relayer, avatar, guard } =
        await loadFixture(setupTests);

      await modifier.enableModule(signer.address);
      await modifier.setGuard(await guard.getAddress());

      const inner = await avatar.enableModule.populateTransaction(
        "0xff00000000000000000000000000000000ff3456"
      );

      const { from, ...transaction } =
        await modifier.execTransactionFromModuleReturnData.populateTransaction(
          await avatar.getAddress(),
          0,
          inner.data as string,
          0
        );

      const signature = await sign(
        await modifier.getAddress(),
        transaction,
        keccak256(toUtf8Bytes("salt")),
        signer
      );
      const transactionWithSig = {
        ...transaction,
        to: await modifier.getAddress(),
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
      await modifier.setGuard(await guard.getAddress());

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModuleReturnData(
            await avatar.getAddress(),
            1337,
            "0x",
            0
          )
      ).to.be.revertedWith("Cannot send 1337");
    });

    it("skips post-check if no guard is enabled", async () => {
      const { avatar, executor, modifier, guard } =
        await loadFixture(setupTests);

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModuleReturnData(
            await avatar.getAddress(),
            0,
            "0x",
            0
          )
      ).not.to.emit(guard, "PostChecked");
    });

    it("post-checks transaction if guard is set", async () => {
      const { avatar, executor, modifier, guard } =
        await loadFixture(setupTests);
      await modifier.setGuard(await guard.getAddress());

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModuleReturnData(
            await avatar.getAddress(),
            0,
            "0x",
            0
          )
      )
        .to.emit(guard, "PostChecked")
        .withArgs(true);
    });
  });
});

async function sign(
  contract: string,
  transaction: TransactionLike,
  salt: string,
  signer: Signer
) {
  const { domain, types, message } = typedDataForTransaction(
    { contract, chainId: 31337, salt },
    transaction.data || "0x"
  );

  const signature = await signer.signTypedData(domain, types, message);

  return `${salt}${signature.slice(2)}`;
}

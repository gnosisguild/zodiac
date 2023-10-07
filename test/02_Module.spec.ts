import { AddressZero } from "@ethersproject/constants";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Module", async () => {
  async function setupTests() {
    const Avatar = await hre.ethers.getContractFactory("TestAvatar");
    const avatar = await Avatar.deploy();
    const iAvatar = await hre.ethers.getContractAt("IAvatar", avatar.address);
    const Module = await hre.ethers.getContractFactory("TestModule");
    const module = await Module.deploy(iAvatar.address, iAvatar.address);
    await avatar.enableModule(module.address);
    const Guard = await hre.ethers.getContractFactory("TestGuard");
    const guard = await Guard.deploy(module.address);
    const tx = {
      to: avatar.address,
      value: 0,
      data: "0x",
      operation: 0,
      avatarTxGas: 0,
      baseGas: 0,
      gasPrice: 0,
      gasToken: AddressZero,
      refundReceiver: AddressZero,
      signatures: "0x",
    };
    return {
      iAvatar,
      guard,
      module,
      tx,
    };
  }

  describe("setAvatar", async () => {
    it("reverts if caller is not the owner", async () => {
      const { iAvatar, module } = await loadFixture(setupTests);

      const [owner, wallet1] = await hre.ethers.getSigners();

      await module.transferOwnership(wallet1.address);
      await expect(module.setAvatar(iAvatar.address))
        .to.be.revertedWithCustomError(module, "OwnableUnauthorizedAccount")
        .withArgs(owner.address);
    });

    it("allows owner to set avatar", async () => {
      const { iAvatar, module } = await loadFixture(setupTests);
      await expect(module.setAvatar(iAvatar.address));
    });

    it("emits previous owner and new owner", async () => {
      const { iAvatar, module } = await loadFixture(setupTests);

      const [, wallet1] = await hre.ethers.getSigners();

      await expect(module.setAvatar(wallet1.address))
        .to.emit(module, "AvatarSet")
        .withArgs(iAvatar.address, wallet1.address);
    });
  });

  describe("setTarget", async () => {
    it("reverts if caller is not the owner", async () => {
      const { iAvatar, module } = await loadFixture(setupTests);
      const [owner, wallet1] = await hre.ethers.getSigners();
      await module.transferOwnership(wallet1.address);
      await expect(module.setTarget(iAvatar.address))
        .to.be.revertedWithCustomError(module, "OwnableUnauthorizedAccount")
        .withArgs(owner.address);
    });

    it("allows owner to set avatar", async () => {
      const { iAvatar, module } = await loadFixture(setupTests);
      await expect(module.setTarget(iAvatar.address));
    });

    it("emits previous owner and new owner", async () => {
      const { iAvatar, module } = await loadFixture(setupTests);
      const [, wallet1] = await hre.ethers.getSigners();
      await expect(module.setTarget(wallet1.address))
        .to.emit(module, "TargetSet")
        .withArgs(iAvatar.address, wallet1.address);
    });
  });

  describe("exec", async () => {
    it("skips guard pre-check if no guard is set", async () => {
      const { module, tx } = await loadFixture(setupTests);
      await expect(
        module.executeTransaction(tx.to, tx.value, tx.data, tx.operation)
      );
    });

    it("pre-checks transaction if guard is set", async () => {
      const { guard, module, tx } = await loadFixture(setupTests);
      await module.setGuard(guard.address);
      await expect(
        module.executeTransaction(tx.to, tx.value, tx.data, tx.operation)
      )
        .to.emit(guard, "PreChecked")
        .withArgs(true);
    });

    it("executes a transaction", async () => {
      const { module, tx } = await loadFixture(setupTests);
      await expect(
        module.executeTransaction(tx.to, tx.value, tx.data, tx.operation)
      );
    });

    it("skips post-check if no guard is enabled", async () => {
      const { guard, module, tx } = await loadFixture(setupTests);
      await expect(
        module.executeTransaction(tx.to, tx.value, tx.data, tx.operation)
      ).not.to.emit(guard, "PostChecked");
    });

    it("post-checks transaction if guard is set", async () => {
      const { guard, module, tx } = await loadFixture(setupTests);
      await module.setGuard(guard.address);
      await expect(
        module.executeTransaction(tx.to, tx.value, tx.data, tx.operation)
      )
        .to.emit(guard, "PostChecked")
        .withArgs(true);
    });
  });

  describe("execAndReturnData", async () => {
    it("skips guard pre-check if no guard is set", async () => {
      const { module, tx } = await loadFixture(setupTests);
      await expect(
        module.executeTransactionReturnData(
          tx.to,
          tx.value,
          tx.data,
          tx.operation
        )
      );
    });

    it("pre-checks transaction if guard is set", async () => {
      const { guard, module, tx } = await loadFixture(setupTests);
      await module.setGuard(guard.address);
      await expect(
        module.executeTransactionReturnData(
          tx.to,
          tx.value,
          tx.data,
          tx.operation
        )
      )
        .to.emit(guard, "PreChecked")
        .withArgs(true);
    });

    it("executes a transaction", async () => {
      const { module, tx } = await loadFixture(setupTests);
      await expect(
        module.executeTransactionReturnData(
          tx.to,
          tx.value,
          tx.data,
          tx.operation
        )
      );
    });

    it("skips post-check if no guard is enabled", async () => {
      const { guard, module, tx } = await loadFixture(setupTests);
      await expect(
        module.executeTransactionReturnData(
          tx.to,
          tx.value,
          tx.data,
          tx.operation
        )
      ).not.to.emit(guard, "PostChecked");
    });

    it("post-checks transaction if guard is set", async () => {
      const { guard, module, tx } = await loadFixture(setupTests);
      await module.setGuard(guard.address);
      await expect(
        module.executeTransactionReturnData(
          tx.to,
          tx.value,
          tx.data,
          tx.operation
        )
      )
        .to.emit(guard, "PostChecked")
        .withArgs(true);
    });
  });
});

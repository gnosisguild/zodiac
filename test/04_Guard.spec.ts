import { AddressZero } from "@ethersproject/constants";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Guardable", async () => {
  async function setupTests() {
    const Avatar = await hre.ethers.getContractFactory("TestAvatar");
    const avatar = await Avatar.deploy();
    const iAvatar = await hre.ethers.getContractAt("IAvatar", avatar.address);
    const Module = await hre.ethers.getContractFactory("TestModule");
    const module = await Module.deploy(iAvatar.address, iAvatar.address);
    await avatar.enableModule(module.address);
    const Guard = await hre.ethers.getContractFactory("TestGuard");
    const guard = await Guard.deploy(module.address);
    return {
      iAvatar,
      guard,
      module,
    };
  }

  describe("setGuard", async () => {
    it("reverts if reverts if caller is not the owner", async () => {
      const { module } = await loadFixture(setupTests);
      const [, user1] = await hre.ethers.getSigners();
      await expect(module.connect(user1).setGuard(user1.address))
        .to.be.revertedWithCustomError(module, "OwnableUnauthorizedAccount")
        .withArgs(user1.address);
    });

    it("reverts if guard does not implement ERC165", async () => {
      const { module } = await loadFixture(setupTests);
      await expect(module.setGuard(module.address)).to.be.reverted;
    });

    it("sets module and emits event", async () => {
      const { module, guard } = await loadFixture(setupTests);
      await expect(module.setGuard(guard.address))
        .to.emit(module, "ChangedGuard")
        .withArgs(guard.address);
    });
  });

  describe("getGuard", async () => {
    it("returns guard address", async () => {
      const { module } = await loadFixture(setupTests);
      await expect(await module.getGuard()).to.be.equals(AddressZero);
    });
  });
});

describe("BaseGuard", async () => {
  const txHash =
    "0x0000000000000000000000000000000000000000000000000000000000000001";

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

  describe("checkTransaction", async () => {
    it("reverts if test fails", async () => {
      const { guard, tx } = await loadFixture(setupTests);
      const [user1] = await hre.ethers.getSigners();
      await expect(
        guard.checkTransaction(
          tx.to,
          1337,
          tx.data,
          tx.operation,
          tx.avatarTxGas,
          tx.baseGas,
          tx.gasPrice,
          tx.gasToken,
          tx.refundReceiver,
          tx.signatures,
          user1.address
        )
      ).to.be.revertedWith("Cannot send 1337");
    });
    it("checks transaction", async () => {
      const { guard, tx } = await loadFixture(setupTests);
      const [user1] = await hre.ethers.getSigners();
      await expect(
        guard.checkTransaction(
          tx.to,
          tx.value,
          tx.data,
          tx.operation,
          tx.avatarTxGas,
          tx.baseGas,
          tx.gasPrice,
          tx.gasToken,
          tx.refundReceiver,
          tx.signatures,
          user1.address
        )
      )
        .to.emit(guard, "PreChecked")
        .withArgs(true);
    });
  });

  describe("checkAfterExecution", async () => {
    it("reverts if test fails", async () => {
      const { guard } = await loadFixture(setupTests);
      await expect(guard.checkAfterExecution(txHash, true)).to.be.revertedWith(
        "Module cannot remove its own guard."
      );
    });
    it("checks state after execution", async () => {
      const { module, guard } = await loadFixture(setupTests);
      await expect(module.setGuard(guard.address))
        .to.emit(module, "ChangedGuard")
        .withArgs(guard.address);
      await expect(guard.checkAfterExecution(txHash, true))
        .to.emit(guard, "PostChecked")
        .withArgs(true);
    });
  });
});

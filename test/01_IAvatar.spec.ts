import { AddressZero } from "@ethersproject/constants";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import hre from "hardhat";

import { TestAvatar__factory } from "../typechain-types";

describe("IAvatar", async () => {
  async function setupTests() {
    const [signer] = await hre.ethers.getSigners();
    const Avatar = await hre.ethers.getContractFactory("TestAvatar");
    const avatar = await Avatar.connect(signer).deploy();
    const iAvatar = TestAvatar__factory.connect(avatar.address, signer);
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
      tx,
    };
  }

  describe("enableModule", async () => {
    it("allow to enable a module", async () => {
      const [user1] = await hre.ethers.getSigners();
      const { iAvatar } = await loadFixture(setupTests);
      await expect(await iAvatar.isModuleEnabled(user1.address)).to.be.equals(
        false
      );
      const transaction = await iAvatar.enableModule(user1.address);
      await transaction.wait();
      await expect(await iAvatar.isModuleEnabled(user1.address)).to.be.equals(
        true
      );
    });
  });

  describe("disableModule", async () => {
    it("allow to disable a module", async () => {
      const { iAvatar } = await loadFixture(setupTests);

      const [user1] = await hre.ethers.getSigners();

      await expect(await iAvatar.isModuleEnabled(user1.address)).to.be.equals(
        false
      );
      let transaction = await iAvatar.enableModule(user1.address);
      await transaction.wait();
      await expect(await iAvatar.isModuleEnabled(user1.address)).to.be.equals(
        true
      );
      transaction = await iAvatar.disableModule(AddressZero, user1.address);
      await transaction.wait();
      await expect(await iAvatar.isModuleEnabled(user1.address)).to.be.equals(
        false
      );
    });
  });

  describe("execTransactionFromModule", async () => {
    it("revert if module is not enabled", async () => {
      const { iAvatar, tx } = await setupTests();
      await expect(
        iAvatar.execTransactionFromModule(
          tx.to,
          tx.value,
          tx.data,
          tx.operation
        )
      ).to.be.revertedWith("Not authorized");
    });

    it("allow to execute module transaction", async () => {
      const { iAvatar, tx } = await setupTests();

      const [user1] = await hre.ethers.getSigners();

      await iAvatar.enableModule(user1.address);
      await expect(
        iAvatar.execTransactionFromModule(
          tx.to,
          tx.value,
          tx.data,
          tx.operation
        )
      );
    });
  });

  describe("execTransactionFromModuleReturnData", async () => {
    it("revert if module is not enabled", async () => {
      const { iAvatar, tx } = await setupTests();

      await expect(
        iAvatar.execTransactionFromModuleReturnData(
          tx.to,
          tx.value,
          tx.data,
          tx.operation
        )
      ).to.be.revertedWith("Not authorized");
    });

    it("allow to execute module transaction and return data", async () => {
      const { iAvatar, tx } = await setupTests();

      const [user1] = await hre.ethers.getSigners();

      await iAvatar.enableModule(user1.address);
      await expect(
        iAvatar.execTransactionFromModuleReturnData(
          tx.to,
          tx.value,
          tx.data,
          tx.operation
        )
      );
    });
  });

  describe("isModuleEnabled", async () => {
    it("returns false if module has not been enabled", async () => {
      const { iAvatar } = await loadFixture(setupTests);

      const [user1] = await hre.ethers.getSigners();

      await expect(await iAvatar.isModuleEnabled(user1.address)).to.be.equals(
        false
      );
    });

    it("returns true if module has been enabled", async () => {
      const { iAvatar } = await loadFixture(setupTests);

      const [user1] = await hre.ethers.getSigners();

      await expect(await iAvatar.isModuleEnabled(user1.address)).to.be.equals(
        false
      );
      const transaction = await iAvatar.enableModule(user1.address);
      await transaction.wait();
      await expect(await iAvatar.isModuleEnabled(user1.address)).to.be.equals(
        true
      );
    });
  });

  describe("getModulesPaginated", async () => {
    it("returns array of enabled modules", async () => {
      const { iAvatar } = await loadFixture(setupTests);

      const [user1] = await hre.ethers.getSigners();

      await iAvatar.enableModule(user1.address);
      const [array, next] = await iAvatar.getModulesPaginated(user1.address, 1);
      await expect(array.toString()).to.be.equals([user1.address].toString());
      await expect(next).to.be.equals(user1.address);
    });
  });
});

import { expect } from "chai";
import hre, { deployments, waffle, ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";
import { AddressZero } from "@ethersproject/constants";

describe("IExecutor", async () => {
  const [user1, user2] = waffle.provider.getWallets();
  // probably delete
  const abiCoder = new ethers.utils.AbiCoder();
  // probably delete
  const initializeParams = abiCoder.encode(["address"], [user1.address]);

  const setupTests = deployments.createFixture(async ({ deployments }) => {
    await deployments.fixture();
    const executorFactory = await hre.ethers.getContractFactory("TestExecutor");
    const safe = await executorFactory.deploy();
    const iSafe = await hre.ethers.getContractAt("IExecutor", safe.address);
    const tx = {
      to: safe.address,
      value: 0,
      data: "0x",
      operation: 0,
      safeTxGas: 0,
      baseGas: 0,
      gasPrice: 0,
      gasToken: AddressZero,
      refundReceiver: AddressZero,
      signatures: "0x",
    };
    return {
      iSafe,
      tx,
    };
  });

  describe("enableModule", async () => {
    it("allow to enable a module", async () => {
      const { iSafe } = await setupTests();
      await expect(await iSafe.isModuleEnabled(user1.address)).to.be.equals(
        false
      );
      let transaction = await iSafe.enableModule(user1.address);
      let receipt = await transaction.wait();
      await expect(await iSafe.isModuleEnabled(user1.address)).to.be.equals(
        true
      );
    });
  });

  describe("disableModule", async () => {
    it("allow to disable a module", async () => {
      const { iSafe } = await setupTests();
      await expect(await iSafe.isModuleEnabled(user1.address)).to.be.equals(
        false
      );
      let transaction = await iSafe.enableModule(user1.address);
      let receipt = await transaction.wait();
      await expect(await iSafe.isModuleEnabled(user1.address)).to.be.equals(
        true
      );
      transaction = await iSafe.disableModule(AddressZero, user1.address);
      receipt = await transaction.wait();
      await expect(await iSafe.isModuleEnabled(user1.address)).to.be.equals(
        false
      );
    });
  });

  describe("execTransactionFromModule", async () => {
    it("revert if module is not enabled", async () => {
      const { iSafe, tx } = await setupTests();
      await expect(
        iSafe.execTransactionFromModule(tx.to, tx.value, tx.data, tx.operation)
      ).to.be.revertedWith("Not authorized");
    });

    it("allow to execute module transaction", async () => {
      const { iSafe, tx } = await setupTests();
      await iSafe.enableModule(user1.address);
      await expect(
        iSafe.execTransactionFromModule(tx.to, tx.value, tx.data, tx.operation)
      );
    });
  });

  describe("execTransactionFromModuleReturnData", async () => {
    it("revert if module is not enabled", async () => {
      const { iSafe, tx } = await setupTests();
      await expect(
        iSafe.execTransactionFromModuleReturnData(
          tx.to,
          tx.value,
          tx.data,
          tx.operation
        )
      ).to.be.revertedWith("Not authorized");
    });

    it("allow to execute module transaction and return data", async () => {
      const { iSafe, tx } = await setupTests();
      await iSafe.enableModule(user1.address);
      await expect(
        iSafe.execTransactionFromModuleReturnData(
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
      const { iSafe } = await setupTests();
      await expect(await iSafe.isModuleEnabled(user1.address)).to.be.equals(
        false
      );
    });

    it("returns true if module has been enabled", async () => {
      const { iSafe } = await setupTests();
      await expect(await iSafe.isModuleEnabled(user1.address)).to.be.equals(
        false
      );
      let transaction = await iSafe.enableModule(user1.address);
      let receipt = await transaction.wait();
      await expect(await iSafe.isModuleEnabled(user1.address)).to.be.equals(
        true
      );
    });
  });

  describe("getModulesPaginated", async () => {
    it("returns array of enabled modules", async () => {
      const { iSafe } = await setupTests();
      let transaction = await iSafe.enableModule(user1.address);
      let array, next;
      [array, next] = await iSafe.getModulesPaginated(user1.address, 1);
      await expect(array.toString()).to.be.equals([user1.address].toString());
      await expect(next).to.be.equals(user1.address);
    });
  });
});

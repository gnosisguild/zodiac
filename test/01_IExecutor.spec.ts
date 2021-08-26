import { expect } from "chai";
import hre, { deployments, waffle, ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";
import { AddressZero } from "@ethersproject/constants";

describe("IExecutor", async () => {
  const [user1, user2] = waffle.provider.getWallets();

  const setupTests = deployments.createFixture(async ({ deployments }) => {
    await deployments.fixture();
    const Executor = await hre.ethers.getContractFactory("TestExecutor");
    const executor = await Executor.deploy();
    const iExecutor = await hre.ethers.getContractAt(
      "IExecutor",
      executor.address
    );
    const tx = {
      to: executor.address,
      value: 0,
      data: "0x",
      operation: 0,
      executorTxGas: 0,
      baseGas: 0,
      gasPrice: 0,
      gasToken: AddressZero,
      refundReceiver: AddressZero,
      signatures: "0x",
    };
    return {
      iExecutor,
      tx,
    };
  });

  describe("enableModule", async () => {
    it("allow to enable a module", async () => {
      const { iExecutor } = await setupTests();
      await expect(await iExecutor.isModuleEnabled(user1.address)).to.be.equals(
        false
      );
      let transaction = await iExecutor.enableModule(user1.address);
      let receipt = await transaction.wait();
      await expect(await iExecutor.isModuleEnabled(user1.address)).to.be.equals(
        true
      );
    });
  });

  describe("disableModule", async () => {
    it("allow to disable a module", async () => {
      const { iExecutor } = await setupTests();
      await expect(await iExecutor.isModuleEnabled(user1.address)).to.be.equals(
        false
      );
      let transaction = await iExecutor.enableModule(user1.address);
      let receipt = await transaction.wait();
      await expect(await iExecutor.isModuleEnabled(user1.address)).to.be.equals(
        true
      );
      transaction = await iExecutor.disableModule(AddressZero, user1.address);
      receipt = await transaction.wait();
      await expect(await iExecutor.isModuleEnabled(user1.address)).to.be.equals(
        false
      );
    });
  });

  describe("execTransactionFromModule", async () => {
    it("revert if module is not enabled", async () => {
      const { iExecutor, tx } = await setupTests();
      await expect(
        iExecutor.execTransactionFromModule(
          tx.to,
          tx.value,
          tx.data,
          tx.operation
        )
      ).to.be.revertedWith("Not authorized");
    });

    it("allow to execute module transaction", async () => {
      const { iExecutor, tx } = await setupTests();
      await iExecutor.enableModule(user1.address);
      await expect(
        iExecutor.execTransactionFromModule(
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
      const { iExecutor, tx } = await setupTests();
      await expect(
        iExecutor.execTransactionFromModuleReturnData(
          tx.to,
          tx.value,
          tx.data,
          tx.operation
        )
      ).to.be.revertedWith("Not authorized");
    });

    it("allow to execute module transaction and return data", async () => {
      const { iExecutor, tx } = await setupTests();
      await iExecutor.enableModule(user1.address);
      await expect(
        iExecutor.execTransactionFromModuleReturnData(
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
      const { iExecutor } = await setupTests();
      await expect(await iExecutor.isModuleEnabled(user1.address)).to.be.equals(
        false
      );
    });

    it("returns true if module has been enabled", async () => {
      const { iExecutor } = await setupTests();
      await expect(await iExecutor.isModuleEnabled(user1.address)).to.be.equals(
        false
      );
      let transaction = await iExecutor.enableModule(user1.address);
      let receipt = await transaction.wait();
      await expect(await iExecutor.isModuleEnabled(user1.address)).to.be.equals(
        true
      );
    });
  });

  describe("getModulesPaginated", async () => {
    it("returns array of enabled modules", async () => {
      const { iExecutor } = await setupTests();
      let transaction = await iExecutor.enableModule(user1.address);
      let array, next;
      [array, next] = await iExecutor.getModulesPaginated(user1.address, 1);
      await expect(array.toString()).to.be.equals([user1.address].toString());
      await expect(next).to.be.equals(user1.address);
    });
  });
});

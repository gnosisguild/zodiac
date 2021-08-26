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

  describe("disableModule", async () => {
    it("allow user to enable module", async () => {
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
});

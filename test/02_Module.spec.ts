import { expect } from "chai";
import hre, { deployments, waffle, ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";
import { AddressZero } from "@ethersproject/constants";

describe("Module", async () => {
  const [user1, user2] = waffle.provider.getWallets();
  // probably delete
  const abiCoder = new ethers.utils.AbiCoder();
  // probably delete
  const initializeParams = abiCoder.encode(["address"], [user1.address]);

  const setupTests = deployments.createFixture(async ({ deployments }) => {
    await deployments.fixture();
    const Executor = await hre.ethers.getContractFactory("TestExecutor");
    const executor = await Executor.deploy();
    const iExecutor = await hre.ethers.getContractAt(
      "IExecutor",
      executor.address
    );
    const Module = await hre.ethers.getContractFactory("TestModule");
    const module = await Module.deploy(iExecutor.address);
    await executor.enableModule(module.address);
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
      module,
      tx,
    };
  });

  describe("setExecutor", async () => {
    it("reverts if caller is not the owner", async () => {
      const { iExecutor, module } = await setupTests();
      await module.transferOwnership(user2.address);
      await expect(module.setExecutor(iExecutor.address)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("allows owner to set executor", async () => {
      const { iExecutor, module } = await setupTests();
      await expect(module.setExecutor(iExecutor.address));
    });

    it("emits previous owner and new owner", async () => {
      const { iExecutor, module } = await setupTests();
      await expect(module.setExecutor(user2.address))
        .to.emit(module, "ExecutorSet")
        .withArgs(iExecutor.address, user2.address);
    });
  });

  describe("exec", async () => {
    it("skips guard pre-check if no guard is set", async () => {
      const { iExecutor, module, tx } = await setupTests();
      await expect(
        module.executeTransaction(tx.to, tx.value, tx.data, tx.operation)
      );
    });

    it("pre-checks transaction if guard is set", async () => {
      const { iExecutor, module, tx } = await setupTests();
      await expect(
        module.executeTransaction(tx.to, tx.value, tx.data, tx.operation)
      );
    });

    //   it("executes a transaction", async () => {
    //     const { iExecutor, module } = await setupTests();
    //     await expect(true).to.be.equals(false);
    //   });
    //
    //   it("skips post-check if no guard is enabled", async () => {
    //     const { iExecutor, module } = await setupTests();
    //     await expect(true).to.be.equals(false);
    //   });
    //
    //   it("post-checks transaction if guard is set", async () => {
    //     const { iExecutor, module } = await setupTests();
    //     await expect(true).to.be.equals(false);
    //   });
    // });
    //
    // describe("execAndReturnData", async () => {
    //   it("cannot be called by external address", async () => {
    //     const { iExecutor, module } = await setupTests();
    //     await expect(true).to.be.equals(false);
    //   });
    //
    //   it("skips guard pre-check if no guard is set", async () => {
    //     const { iExecutor, module } = await setupTests();
    //     await expect(true).to.be.equals(false);
    //   });
    //
    //   it("pre-checks transaction if guard is set", async () => {
    //     const { iExecutor, module } = await setupTests();
    //     await expect(true).to.be.equals(false);
    //   });
    //
    //   it("executes a transaction", async () => {
    //     const { iExecutor, module } = await setupTests();
    //     await expect(true).to.be.equals(false);
    //   });
    //
    //   it("skips post-check if no guard is enabled", async () => {
    //     const { iExecutor, module } = await setupTests();
    //     await expect(true).to.be.equals(false);
    //   });
    //
    //   it("post-checks transaction if guard is set", async () => {
    //     const { iExecutor, module } = await setupTests();
    //     await expect(true).to.be.equals(false);
    //   });
  });
});

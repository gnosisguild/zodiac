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
    const Avatar = await hre.ethers.getContractFactory("TestAvatar");
    const avatar = await Avatar.deploy();
    const iAvatar = await hre.ethers.getContractAt("IAvatar", avatar.address);
    const Module = await hre.ethers.getContractFactory("TestModule");
    const module = await Module.deploy(iAvatar.address);
    await avatar.enableModule(module.address);
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
      module,
      tx,
    };
  });

  describe("setAvatar", async () => {
    it("reverts if caller is not the owner", async () => {
      const { iAvatar, module } = await setupTests();
      await module.transferOwnership(user2.address);
      await expect(module.setAvatar(iAvatar.address)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("allows owner to set avatar", async () => {
      const { iAvatar, module } = await setupTests();
      await expect(module.setAvatar(iAvatar.address));
    });

    it("emits previous owner and new owner", async () => {
      const { iAvatar, module } = await setupTests();
      await expect(module.setAvatar(user2.address))
        .to.emit(module, "AvatarSet")
        .withArgs(iAvatar.address, user2.address);
    });
  });

  describe("exec", async () => {
    it("skips guard pre-check if no guard is set", async () => {
      const { iAvatar, module, tx } = await setupTests();
      await expect(
        module.executeTransaction(tx.to, tx.value, tx.data, tx.operation)
      );
    });

    it("pre-checks transaction if guard is set", async () => {
      const { iAvatar, module, tx } = await setupTests();
      await expect(
        module.executeTransaction(tx.to, tx.value, tx.data, tx.operation)
      );
    });

    //   it("executes a transaction", async () => {
    //     const { iAvatar, module } = await setupTests();
    //     await expect(true).to.be.equals(false);
    //   });
    //
    //   it("skips post-check if no guard is enabled", async () => {
    //     const { iAvatar, module } = await setupTests();
    //     await expect(true).to.be.equals(false);
    //   });
    //
    //   it("post-checks transaction if guard is set", async () => {
    //     const { iAvatar, module } = await setupTests();
    //     await expect(true).to.be.equals(false);
    //   });
    // });
    //
    // describe("execAndReturnData", async () => {
    //   it("cannot be called by external address", async () => {
    //     const { iAvatar, module } = await setupTests();
    //     await expect(true).to.be.equals(false);
    //   });
    //
    //   it("skips guard pre-check if no guard is set", async () => {
    //     const { iAvatar, module } = await setupTests();
    //     await expect(true).to.be.equals(false);
    //   });
    //
    //   it("pre-checks transaction if guard is set", async () => {
    //     const { iAvatar, module } = await setupTests();
    //     await expect(true).to.be.equals(false);
    //   });
    //
    //   it("executes a transaction", async () => {
    //     const { iAvatar, module } = await setupTests();
    //     await expect(true).to.be.equals(false);
    //   });
    //
    //   it("skips post-check if no guard is enabled", async () => {
    //     const { iAvatar, module } = await setupTests();
    //     await expect(true).to.be.equals(false);
    //   });
    //
    //   it("post-checks transaction if guard is set", async () => {
    //     const { iAvatar, module } = await setupTests();
    //     await expect(true).to.be.equals(false);
    //   });
  });
});

import { expect } from "chai";
import hre, { deployments, waffle, ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";
import { AddressZero } from "@ethersproject/constants";

describe("Modifier", async () => {
  const [user1, user2] = waffle.provider.getWallets();
  const SENTINEL_MODULES = "0x0000000000000000000000000000000000000001";

  const setupTests = deployments.createFixture(async ({ deployments }) => {
    await deployments.fixture();
    const Avatar = await hre.ethers.getContractFactory("TestAvatar");
    const avatar = await Avatar.deploy();
    const iAvatar = await hre.ethers.getContractAt("IAvatar", avatar.address);
    const Modifier = await hre.ethers.getContractFactory("TestModifier");
    const modifier = await Modifier.deploy(iAvatar.address, iAvatar.address);
    await iAvatar.enableModule(modifier.address);
    // await modifier.enableModule(user1.address);
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
      modifier,
      tx,
    };
  });

  describe("enableModule", async () => {
    it("reverts if caller is not the owner", async () => {
      const { modifier } = await setupTests();
      await expect(
        modifier.connect(user2).enableModule(user2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("reverts if module is zero address", async () => {
      const { modifier } = await setupTests();
      await expect(modifier.enableModule(AddressZero)).to.be.revertedWith(
        "reverted with custom error 'InvalidModule(\"0x0000000000000000000000000000000000000000\")'"
      );
    });

    it("reverts if module is SENTINEL_MODULES", async () => {
      const { iAvatar, modifier } = await setupTests();
      await expect(modifier.enableModule(SENTINEL_MODULES)).to.be.revertedWith(
        "reverted with custom error 'InvalidModule(\"0x0000000000000000000000000000000000000001\")'"
      );
    });

    it("reverts if module is already enabled", async () => {
      const { modifier } = await setupTests();
      await expect(modifier.enableModule(user1.address))
        .to.emit(modifier, "EnabledModule")
        .withArgs(user1.address);
      await expect(modifier.enableModule(user1.address))
        .to.emit(modifier, "EnabledModule")
        .withArgs(user1.address);
      await expect(modifier.enableModule(user1.address)).to.be.revertedWith(
        "reverted with custom error 'AlreadyEnabledModule(\"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266\")'"
      );
    });

    it("enables a module", async () => {
      const { modifier } = await setupTests();
      await expect(modifier.enableModule(user1.address))
        .to.emit(modifier, "EnabledModule")
        .withArgs(user1.address);
    });
  });

  describe("disableModule", async () => {
    it("reverts if caller is not the owner", async () => {
      const { modifier } = await setupTests();
      await expect(
        modifier.connect(user2).disableModule(SENTINEL_MODULES, user2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("reverts if module is zero address", async () => {
      const { modifier } = await setupTests();
      await expect(
        modifier.disableModule(SENTINEL_MODULES, AddressZero)
      ).to.be.revertedWith("reverted with custom error 'InvalidModule(\"0x0000000000000000000000000000000000000000\")'");
    });

    it("reverts if module is SENTINEL_MODULES", async () => {
      const { modifier } = await setupTests();
      await expect(
        modifier.disableModule(SENTINEL_MODULES, SENTINEL_MODULES)
      ).to.be.revertedWith("reverted with custom error 'InvalidModule(\"0x0000000000000000000000000000000000000001\")'");
    });

    it("reverts if module is already disabled", async () => {
      const { modifier } = await setupTests();
      await expect(modifier.enableModule(user1.address))
        .to.emit(modifier, "EnabledModule")
        .withArgs(user1.address);
      await expect(modifier.disableModule(SENTINEL_MODULES, user1.address))
        .to.emit(modifier, "DisabledModule")
        .withArgs(user1.address);
      await expect(
        modifier.disableModule(SENTINEL_MODULES, user1.address)
      ).to.be.revertedWith("reverted with custom error 'AlreadyDisabledModule(\"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266\")'");
    });

    it("disables a module", async () => {
      const { modifier } = await setupTests();
      await expect(modifier.enableModule(user1.address))
        .to.emit(modifier, "EnabledModule")
        .withArgs(user1.address);
      await expect(modifier.disableModule(SENTINEL_MODULES, user1.address))
        .to.emit(modifier, "DisabledModule")
        .withArgs(user1.address);
    });
  });

  describe("isModuleEnabled", async () => {
    it("returns false if SENTINEL_MODULES is provided", async () => {
      const { modifier } = await setupTests();
      await expect(
        await modifier.isModuleEnabled(SENTINEL_MODULES)
      ).to.be.equals(false);
    });

    it("returns false if AddressZero is provided", async () => {
      const { modifier } = await setupTests();
      await expect(await modifier.isModuleEnabled(AddressZero)).to.be.equals(
        false
      );
    });

    it("returns false if module is not enabled", async () => {
      const { modifier } = await setupTests();
      await expect(await modifier.isModuleEnabled(user1.address)).to.be.equals(
        false
      );
    });

    it("returns true if module is enabled", async () => {
      const { modifier } = await setupTests();
      // delete once you figure out why you need to do this twice
      await expect(await modifier.enableModule(user1.address))
        .to.emit(modifier, "EnabledModule")
        .withArgs(user1.address);

      await expect(await modifier.enableModule(user2.address))
        .to.emit(modifier, "EnabledModule")
        .withArgs(user2.address);
      await expect(await modifier.isModuleEnabled(user2.address)).to.be.equals(
        true
      );
    });
  });

  describe("getModulesPaginated", async () => {
    it("returns empty array if no modules are enabled.", async () => {
      const { modifier } = await setupTests();
      let tx = await modifier.getModulesPaginated(SENTINEL_MODULES, 3);
      tx = tx.toString();
      await expect(tx).to.be.equals(
        [[], "0x0000000000000000000000000000000000000000"].toString()
      );
    });

    it("returns one module if one module is enabled", async () => {
      const { modifier } = await setupTests();
      await modifier.enableModule(user1.address);
      let tx = await modifier.getModulesPaginated(SENTINEL_MODULES, 3);
      tx = tx.toString();
      await expect(tx).to.be.equals(
        [
          [user1.address],
          "0x0000000000000000000000000000000000000000",
        ].toString()
      );
    });

    it("returns two modules if two modules are enabled", async () => {
      const { modifier } = await setupTests();
      await expect(modifier.enableModule(user1.address))
        .to.emit(modifier, "EnabledModule")
        .withArgs(user1.address);
      // delete once you figure out why you need to do this twice
      await expect(modifier.enableModule(user2.address))
        .to.emit(modifier, "EnabledModule")
        .withArgs(user2.address);
      let tx = await modifier.getModulesPaginated(SENTINEL_MODULES, 3);
      tx = tx.toString();
      await expect(tx).to.be.equals(
        [
          user2.address,
          user1.address,
          "0x0000000000000000000000000000000000000000",
        ].toString()
      );
    });
  });

  describe("execTransactionFromModule", async () => {
    it("reverts if module is not enabled", async () => {
      const { iAvatar, modifier, tx } = await setupTests();
      await expect(
        modifier.execTransactionFromModule(
          tx.to,
          tx.value,
          tx.data,
          tx.operation
        )
      ).to.be.revertedWith("reverted with custom error 'NotAuthorized(\"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266\")'");
    });

    it("execute a transaction.", async () => {
      const { iAvatar, modifier, tx } = await setupTests();
      await expect(await modifier.enableModule(user1.address))
        .to.emit(modifier, "EnabledModule")
        .withArgs(user1.address);
      // delete once you figure out why you need to do this twice
      await expect(await modifier.enableModule(user1.address))
        .to.emit(modifier, "EnabledModule")
        .withArgs(user1.address);

      await expect(
        modifier.execTransactionFromModule(
          tx.to,
          tx.value,
          tx.data,
          tx.operation
        )
      ).to.emit(modifier, "executed");
    });
  });

  describe("execTransactionFromModuleReturnData", async () => {
    it("reverts if module is not enabled", async () => {
      const { iAvatar, modifier, tx } = await setupTests();
      await expect(
        modifier.execTransactionFromModuleReturnData(
          tx.to,
          tx.value,
          tx.data,
          tx.operation
        )
      ).to.be.revertedWith("reverted with custom error 'NotAuthorized(\"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266\")'");
    });

    it("execute a transaction.", async () => {
      const { iAvatar, modifier, tx } = await setupTests();
      await expect(await modifier.enableModule(user1.address))
        .to.emit(modifier, "EnabledModule")
        .withArgs(user1.address);
      // delete once you figure out why you need to do this twice
      await expect(await modifier.enableModule(user1.address))
        .to.emit(modifier, "EnabledModule")
        .withArgs(user1.address);

      await expect(
        modifier.execTransactionFromModuleReturnData(
          tx.to,
          tx.value,
          tx.data,
          tx.operation
        )
      ).to.emit(modifier, "executedAndReturnedData");
    });
  });
});

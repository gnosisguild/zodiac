import { AddressZero } from "@ethersproject/constants";
import { AddressOne } from "@gnosis.pm/safe-contracts";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Modifier", async () => {
  const SENTINEL_MODULES = "0x0000000000000000000000000000000000000001";

  async function setupTests() {
    const Avatar = await hre.ethers.getContractFactory("TestAvatar");
    const avatar = await Avatar.deploy();
    const iAvatar = await hre.ethers.getContractAt("IAvatar", avatar.address);
    const Modifier = await hre.ethers.getContractFactory("TestModifier");
    const modifier = await Modifier.deploy(iAvatar.address, iAvatar.address);
    await iAvatar.enableModule(modifier.address);
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
  }

  describe("setupModules", async () => {
    it("reverts if called more than once", async () => {
      const { modifier } = await loadFixture(setupTests);
      await expect(
        modifier.attemptToSetupModules()
      ).to.be.revertedWithCustomError(modifier, "SetupModulesAlreadyCalled");
    });
  });
  describe("enableModule", async () => {
    it("reverts if caller is not the owner", async () => {
      const { modifier } = await loadFixture(setupTests);

      const [, user2] = await hre.ethers.getSigners();

      await expect(
        modifier.connect(user2).enableModule(user2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("reverts if module is zero address", async () => {
      const { modifier } = await loadFixture(setupTests);
      await expect(modifier.enableModule(AddressZero))
        .to.be.revertedWithCustomError(modifier, "InvalidModule")
        .withArgs(AddressZero);
    });

    it("reverts if module is SENTINEL_MODULES", async () => {
      const { modifier } = await loadFixture(setupTests);
      await expect(modifier.enableModule(SENTINEL_MODULES))
        .to.be.revertedWithCustomError(modifier, "InvalidModule")
        .withArgs(AddressOne);
    });

    it("reverts if module is already enabled", async () => {
      const { modifier } = await loadFixture(setupTests);

      const [user1] = await hre.ethers.getSigners();

      await expect(modifier.enableModule(user1.address))
        .to.emit(modifier, "EnabledModule")
        .withArgs(user1.address);
      await expect(modifier.enableModule(user1.address))
        .to.be.revertedWithCustomError(modifier, "AlreadyEnabledModule")
        .withArgs("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    });

    it("enables a module", async () => {
      const { modifier } = await loadFixture(setupTests);
      const [user1] = await hre.ethers.getSigners();
      await expect(modifier.enableModule(user1.address))
        .to.emit(modifier, "EnabledModule")
        .withArgs(user1.address);
    });
  });

  describe("disableModule", async () => {
    it("reverts if caller is not the owner", async () => {
      const { modifier } = await loadFixture(setupTests);
      const [, user2] = await hre.ethers.getSigners();
      await expect(
        modifier.connect(user2).disableModule(SENTINEL_MODULES, user2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("reverts if module is zero address", async () => {
      const { modifier } = await loadFixture(setupTests);
      await expect(modifier.disableModule(SENTINEL_MODULES, AddressZero))
        .to.be.revertedWithCustomError(modifier, "InvalidModule")
        .withArgs(AddressZero);
    });

    it("reverts if module is SENTINEL_MODULES", async () => {
      const { modifier } = await loadFixture(setupTests);
      await expect(modifier.disableModule(SENTINEL_MODULES, SENTINEL_MODULES))
        .to.be.revertedWithCustomError(modifier, "InvalidModule")
        .withArgs(AddressOne);
    });

    it("reverts if module is already disabled", async () => {
      const { modifier } = await loadFixture(setupTests);
      const [user1] = await hre.ethers.getSigners();
      await expect(modifier.enableModule(user1.address))
        .to.emit(modifier, "EnabledModule")
        .withArgs(user1.address);
      await expect(modifier.disableModule(SENTINEL_MODULES, user1.address))
        .to.emit(modifier, "DisabledModule")
        .withArgs(user1.address);
      await expect(modifier.disableModule(SENTINEL_MODULES, user1.address))
        .to.be.revertedWithCustomError(modifier, "AlreadyDisabledModule")
        .withArgs("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    });

    it("disables a module", async () => {
      const { modifier } = await loadFixture(setupTests);
      const [user1] = await hre.ethers.getSigners();
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
      const { modifier } = await loadFixture(setupTests);
      await expect(
        await modifier.isModuleEnabled(SENTINEL_MODULES)
      ).to.be.equals(false);
    });

    it("returns false if AddressZero is provided", async () => {
      const { modifier } = await loadFixture(setupTests);
      await expect(await modifier.isModuleEnabled(AddressZero)).to.be.equals(
        false
      );
    });

    it("returns false if module is not enabled", async () => {
      const { modifier } = await loadFixture(setupTests);
      const [user1] = await hre.ethers.getSigners();
      await expect(await modifier.isModuleEnabled(user1.address)).to.be.equals(
        false
      );
    });

    it("returns true if module is enabled", async () => {
      const { modifier } = await loadFixture(setupTests);
      const [user1, user2] = await hre.ethers.getSigners();
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
    it("requires page size to be greater than 0", async () => {
      const { modifier } = await loadFixture(setupTests);
      await expect(
        modifier.getModulesPaginated(AddressOne, 0)
      ).to.be.revertedWithCustomError(modifier, "InvalidPageSize");
    });

    it("requires start to be a module or start pointer", async () => {
      const { modifier } = await loadFixture(setupTests);
      const [user1, user2] = await hre.ethers.getSigners();

      await expect(modifier.getModulesPaginated(AddressZero, 1)).to.be.reverted;
      await modifier.enableModule(user1.address);

      expect(
        await modifier.getModulesPaginated(user1.address, 1)
      ).to.be.deep.equal([[], AddressOne]);

      await expect(
        modifier.getModulesPaginated(user2.address, 1)
      ).to.be.revertedWithCustomError(modifier, `InvalidModule`);
    });
    it("returns empty array if no modules are enabled.", async () => {
      const { modifier } = await loadFixture(setupTests);

      const result = await modifier.getModulesPaginated(SENTINEL_MODULES, 3);

      expect(result).to.be.deep.equal([[], SENTINEL_MODULES]);
    });

    it("returns empty array if no modules are enabled.", async () => {
      const { modifier } = await loadFixture(setupTests);

      const result = await modifier.getModulesPaginated(SENTINEL_MODULES, 3);

      expect(result).to.be.deep.equal([[], SENTINEL_MODULES]);
    });

    it("returns one module if one module is enabled", async () => {
      const { modifier } = await loadFixture(setupTests);
      const [user1] = await hre.ethers.getSigners();
      await modifier.enableModule(user1.address);
      const result = await modifier.getModulesPaginated(SENTINEL_MODULES, 3);

      expect(result).to.be.deep.equal([[user1.address], SENTINEL_MODULES]);
    });

    it("returns two modules if two modules are enabled", async () => {
      const { modifier } = await loadFixture(setupTests);
      const [user1, user2] = await hre.ethers.getSigners();

      await expect(modifier.enableModule(user1.address))
        .to.emit(modifier, "EnabledModule")
        .withArgs(user1.address);
      // delete once you figure out why you need to do this twice
      await expect(modifier.enableModule(user2.address))
        .to.emit(modifier, "EnabledModule")
        .withArgs(user2.address);
      const result = await modifier.getModulesPaginated(SENTINEL_MODULES, 3);

      expect(result).to.be.deep.equal([
        [user2.address, user1.address],
        SENTINEL_MODULES,
      ]);
    });

    it("returns all modules over multiple pages", async () => {
      const { modifier } = await loadFixture(setupTests);
      const [user1, user2, user3] = await hre.ethers.getSigners();

      await expect(modifier.enableModule(user1.address));
      await expect(modifier.enableModule(user2.address));
      await expect(modifier.enableModule(user3.address));

      await expect(await modifier.isModuleEnabled(user1.address)).to.be.true;
      await expect(await modifier.isModuleEnabled(user2.address)).to.be.true;
      await expect(await modifier.isModuleEnabled(user3.address)).to.be.true;

      // page size 2
      await expect(
        await modifier.getModulesPaginated(AddressOne, 2)
      ).to.be.deep.equal([[user3.address, user2.address], user2.address]);

      await expect(
        await modifier.getModulesPaginated(user2.address, 2)
      ).to.be.deep.equal([[user1.address], AddressOne]);

      // page size 1
      await expect(
        await modifier.getModulesPaginated(AddressOne, 1)
      ).to.be.deep.equal([[user3.address], user3.address]);
      await expect(
        await modifier.getModulesPaginated(user3.address, 1)
      ).to.be.deep.equal([[user2.address], user2.address]);
      await expect(
        await modifier.getModulesPaginated(user2.address, 1)
      ).to.be.deep.equal([[user1.address], AddressOne]);
    });

    it("returns an empty array and end pointer for a safe with no modules", async () => {
      const { modifier } = await loadFixture(setupTests);
      expect(
        await modifier.getModulesPaginated(AddressOne, 10)
      ).to.be.deep.equal([[], AddressOne]);
    });
  });

  describe("execTransactionFromModule", async () => {
    it("reverts if module is not enabled", async () => {
      const { modifier, tx } = await loadFixture(setupTests);
      await expect(
        modifier.execTransactionFromModule(
          tx.to,
          tx.value,
          tx.data,
          tx.operation
        )
      )
        .to.be.revertedWithCustomError(modifier, "NotAuthorized")
        .withArgs("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    });

    it("execute a transaction.", async () => {
      const { modifier, tx } = await loadFixture(setupTests);
      const [user1] = await hre.ethers.getSigners();
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
      const { modifier, tx } = await loadFixture(setupTests);
      await expect(
        modifier.execTransactionFromModuleReturnData(
          tx.to,
          tx.value,
          tx.data,
          tx.operation
        )
      )
        .to.be.revertedWithCustomError(modifier, "NotAuthorized")
        .withArgs("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    });

    it("execute a transaction.", async () => {
      const { modifier, tx } = await loadFixture(setupTests);
      const [user1] = await hre.ethers.getSigners();
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

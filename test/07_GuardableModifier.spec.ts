import hre from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import {
  TestAvatar__factory,
  TestGuard__factory,
  TestGuardableModifier__factory,
} from "../typechain-types";

describe("GuardableModifier", async () => {
  async function setupTests() {
    const [signer, someone, executor] = await hre.ethers.getSigners();

    const Avatar = await hre.ethers.getContractFactory("TestAvatar");
    const avatar = TestAvatar__factory.connect(
      (await Avatar.deploy()).address,
      signer
    );

    const Modifier = await hre.ethers.getContractFactory(
      "TestGuardableModifier"
    );
    const modifier = TestGuardableModifier__factory.connect(
      (await Modifier.connect(signer).deploy(avatar.address, avatar.address))
        .address,
      signer
    );
    const Guard = await hre.ethers.getContractFactory("TestGuard");
    const guard = TestGuard__factory.connect(
      (await Guard.deploy(modifier.address)).address,
      hre.ethers.provider
    );

    await avatar.enableModule(modifier.address);
    await modifier.enableModule(executor.address);

    return {
      avatar,
      someone,
      executor,
      guard,
      modifier,
    };
  }

  describe("exec", async () => {
    it("skips guard pre-check if no guard is set", async () => {
      const { avatar, modifier, executor } = await loadFixture(setupTests);

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModule(avatar.address, 0, "0x", 0)
      ).to.not.be.reverted;
    });

    it("pre-checks transaction if guard is set", async () => {
      const { avatar, executor, modifier, guard } = await loadFixture(
        setupTests
      );
      await modifier.setGuard(guard.address);

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModule(avatar.address, 0, "0x", 0)
      )
        .to.emit(guard, "PreChecked")
        .withArgs(true);
    });

    it("pre-checks and reverts transaction if guard is set", async () => {
      const { avatar, executor, modifier, guard } = await loadFixture(
        setupTests
      );
      await modifier.setGuard(guard.address);

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModule(avatar.address, 1337, "0x", 0)
      ).to.be.revertedWith("Cannot send 1337");
    });

    it("skips post-check if no guard is enabled", async () => {
      const { avatar, executor, modifier, guard } = await loadFixture(
        setupTests
      );

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModule(avatar.address, 0, "0x", 0)
      ).not.to.emit(guard, "PostChecked");
    });

    it("post-checks transaction if guard is set", async () => {
      const { avatar, executor, modifier, guard } = await loadFixture(
        setupTests
      );
      await modifier.setGuard(guard.address);

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModule(avatar.address, 0, "0x", 0)
      )
        .to.emit(guard, "PostChecked")
        .withArgs(true);
    });
  });

  describe("execAndReturnData", async () => {
    it("skips guard pre-check if no guard is set", async () => {
      const { avatar, modifier, executor } = await loadFixture(setupTests);

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModuleReturnData(avatar.address, 0, "0x", 0)
      ).to.not.be.reverted;
    });

    it("pre-checks transaction if guard is set", async () => {
      const { avatar, executor, modifier, guard } = await loadFixture(
        setupTests
      );
      await modifier.setGuard(guard.address);

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModuleReturnData(avatar.address, 0, "0x", 0)
      )
        .to.emit(guard, "PreChecked")
        .withArgs(true);
    });

    it("pre-checks and reverts transaction if guard is set", async () => {
      const { avatar, executor, modifier, guard } = await loadFixture(
        setupTests
      );
      await modifier.setGuard(guard.address);

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModuleReturnData(avatar.address, 1337, "0x", 0)
      ).to.be.revertedWith("Cannot send 1337");
    });

    it("skips post-check if no guard is enabled", async () => {
      const { avatar, executor, modifier, guard } = await loadFixture(
        setupTests
      );

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModuleReturnData(avatar.address, 0, "0x", 0)
      ).not.to.emit(guard, "PostChecked");
    });

    it("post-checks transaction if guard is set", async () => {
      const { avatar, executor, modifier, guard } = await loadFixture(
        setupTests
      );
      await modifier.setGuard(guard.address);

      await expect(
        modifier
          .connect(executor)
          .execTransactionFromModuleReturnData(avatar.address, 0, "0x", 0)
      )
        .to.emit(guard, "PostChecked")
        .withArgs(true);
    });
  });
});

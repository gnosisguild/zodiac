import { AddressOne } from "@gnosis.pm/safe-contracts";
import { expect } from "chai";
import { AbiCoder, Contract, ZeroAddress } from "ethers";
import { ethers } from "hardhat";

import { calculateProxyAddress } from "../sdk/factory";

const AddressZero = ZeroAddress;

describe("ModuleProxyFactory", async () => {
  let moduleFactory: Contract;
  let moduleMasterCopy: Contract;
  let avatarAddress: string;
  let initData: string;

  const saltNonce = "0x7255";

  beforeEach(async () => {
    const Avatar = await ethers.getContractFactory("TestAvatar");
    const avatar = await Avatar.deploy();
    const ModuleProxyFactory =
      await ethers.getContractFactory("ModuleProxyFactory");
    moduleFactory = await ModuleProxyFactory.deploy();

    const MasterCopyModule = await ethers.getContractFactory("TestModule");
    moduleMasterCopy = await MasterCopyModule.deploy(
      await avatar.getAddress(),
      await avatar.getAddress()
    );
    const encodedInitParams = AbiCoder.defaultAbiCoder().encode(
      ["address", "address"],
      [await avatar.getAddress(), await avatar.getAddress()]
    );
    initData = moduleMasterCopy.interface.encodeFunctionData("setUp", [
      encodedInitParams,
    ]);
    avatarAddress = await avatar.getAddress();
  });

  describe("createProxy", () => {
    it("should deploy the expected address ", async () => {
      const expectedAddress = await calculateProxyAddress(
        moduleFactory,
        await moduleMasterCopy.getAddress(),
        initData,
        saltNonce
      );

      const deploymentTx = await moduleFactory.deployModule(
        await moduleMasterCopy.getAddress(),
        initData,
        saltNonce
      );

      const transaction = await deploymentTx.wait();
      const [moduleAddress] = transaction.logs[2].args;
      expect(moduleAddress).to.be.equal(expectedAddress);
    });

    it("should fail to deploy module because address is zero ", async () => {
      await expect(moduleFactory.deployModule(AddressZero, initData, saltNonce))
        .to.be.revertedWithCustomError(moduleFactory, "ZeroAddress")
        .withArgs(AddressZero);
    });
    it("should fail to deploy module because target has no code deployed ", async () => {
      await expect(moduleFactory.deployModule(AddressOne, initData, saltNonce))
        .to.be.revertedWithCustomError(moduleFactory, "TargetHasNoCode")
        .withArgs(AddressOne);
    });

    it("should fail to deploy because address its already taken ", async () => {
      await moduleFactory.deployModule(
        await moduleMasterCopy.getAddress(),
        initData,
        saltNonce
      );

      await expect(
        moduleFactory.deployModule(
          await moduleMasterCopy.getAddress(),
          initData,
          saltNonce
        )
      )
        .to.be.revertedWithCustomError(moduleFactory, "TakenAddress")
        .withArgs(AddressZero);
    });
  });

  describe("deployModule ", () => {
    it("should deploy module", async () => {
      const deploymentTx = await moduleFactory.deployModule(
        await moduleMasterCopy.getAddress(),
        initData,
        saltNonce
      );
      const transaction = await deploymentTx.wait();
      const [moduleAddress] = transaction.logs[2].args;

      const newModule = await ethers.getContractAt("TestModule", moduleAddress);

      const moduleAvatar = await newModule.avatar();
      expect(moduleAvatar).to.be.equal(avatarAddress);
    });

    it("should emit event on module deployment", async () => {
      const moduleAddress = await calculateProxyAddress(
        moduleFactory,
        await moduleMasterCopy.getAddress(),
        initData,
        saltNonce
      );
      await expect(
        moduleFactory.deployModule(
          await moduleMasterCopy.getAddress(),
          initData,
          saltNonce
        )
      )
        .to.emit(moduleFactory, "ModuleProxyCreation")
        .withArgs(moduleAddress, await moduleMasterCopy.getAddress());
    });

    it("should fail to deploy because parameters are not valid ", async () => {
      await expect(
        moduleFactory.deployModule(
          await moduleMasterCopy.getAddress(),
          "0xaabc",
          saltNonce
        )
      ).to.be.revertedWithCustomError(moduleFactory, "FailedInitialization");
    });
  });
});

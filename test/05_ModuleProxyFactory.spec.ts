import { AddressZero } from "@ethersproject/constants";
import { AddressOne } from "@gnosis.pm/safe-contracts";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { calculateProxyAddress } from "../sdk/factory";

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
      avatar.address,
      avatar.address
    );
    const encodedInitParams = new ethers.utils.AbiCoder().encode(
      ["address", "address"],
      [avatar.address, avatar.address]
    );
    initData = moduleMasterCopy.interface.encodeFunctionData("setUp", [
      encodedInitParams,
    ]);
    avatarAddress = avatar.address;
  });

  describe("createProxy", () => {
    it("should deploy the expected address ", async () => {
      const expectedAddress = await calculateProxyAddress(
        moduleFactory,
        moduleMasterCopy.address,
        initData,
        saltNonce
      );

      const deploymentTx = await moduleFactory.deployModule(
        moduleMasterCopy.address,
        initData,
        saltNonce
      );

      const transaction = await deploymentTx.wait();
      const [moduleAddress] = transaction.events[2].args;
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
        moduleMasterCopy.address,
        initData,
        saltNonce
      );

      await expect(
        moduleFactory.deployModule(
          moduleMasterCopy.address,
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
        moduleMasterCopy.address,
        initData,
        saltNonce
      );
      const transaction = await deploymentTx.wait();
      const [moduleAddress] = transaction.events[2].args;

      const newModule = await ethers.getContractAt("TestModule", moduleAddress);

      const moduleAvatar = await newModule.avatar();
      expect(moduleAvatar).to.be.equal(avatarAddress);
    });

    it("should emit event on module deployment", async () => {
      const moduleAddress = await calculateProxyAddress(
        moduleFactory,
        moduleMasterCopy.address,
        initData,
        saltNonce
      );
      await expect(
        moduleFactory.deployModule(
          moduleMasterCopy.address,
          initData,
          saltNonce
        )
      )
        .to.emit(moduleFactory, "ModuleProxyCreation")
        .withArgs(moduleAddress, moduleMasterCopy.address);
    });

    it("should fail to deploy because parameters are not valid ", async () => {
      await expect(
        moduleFactory.deployModule(
          moduleMasterCopy.address,
          "0xaabc",
          saltNonce
        )
      ).to.be.revertedWithCustomError(moduleFactory, "FailedInitialization");
    });
  });
});

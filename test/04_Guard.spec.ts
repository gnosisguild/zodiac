import { expect } from "chai";
import hre, { deployments, waffle, ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";
import { AddressZero } from "@ethersproject/constants";

describe("Guard", async () => {
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
    const Modifier = await hre.ethers.getContractFactory("TestModifier");
    const modifier = await Modifier.deploy(iAvatar.address);
    await avatar.enableModule(modifier.address);
    await modifier.enableModule(user1.address);
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

  describe("ToDo", async () => {});
});

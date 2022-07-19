import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { resolvePtr } from "dns";

const singletonFactoryAbi = [
  "function deploy(bytes memory _initCode, bytes32 _salt) public returns (address payable createdContract)",
];
const singletonFactoryAddress = "0xce0042b868300000d44a59004da54a005ffdcf9f";
const factorySalt =
  "0xb0519c4c4b7945db302f69180b86f1a668153a476802c1c445fcb691ef23ef16";
const AddressZero = "0x0000000000000000000000000000000000000000";

const deployFactory = async (_: null, hardhat: HardhatRuntimeEnvironment) => {
  const [deployer] = await hardhat.ethers.getSigners();
  console.log("Deployer address:      ", deployer.address);

  const singletonDeployer = "0xBb6e024b9cFFACB947A71991E386681B1Cd1477D";
  const singletonFactory = new hardhat.ethers.Contract(
    singletonFactoryAddress,
    singletonFactoryAbi,
    deployer
  );

  // check if singleton factory is deployed.
  if (
    (await hardhat.ethers.provider.getCode(singletonFactory.address)) === "0x"
  ) {
    // fund the singleton factory deployer account
    await deployer.sendTransaction({
      to: singletonDeployer,
      value: hardhat.ethers.utils.parseEther("0.0247"),
    });

    // deploy the singleton factory
    await (
      await hardhat.ethers.provider.sendTransaction(
        "0xf9016c8085174876e8008303c4d88080b90154608060405234801561001057600080fd5b50610134806100206000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80634af63f0214602d575b600080fd5b60cf60048036036040811015604157600080fd5b810190602081018135640100000000811115605b57600080fd5b820183602082011115606c57600080fd5b80359060200191846001830284011164010000000083111715608d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550509135925060eb915050565b604080516001600160a01b039092168252519081900360200190f35b6000818351602085016000f5939250505056fea26469706673582212206b44f8a82cb6b156bfcc3dc6aadd6df4eefd204bc928a4397fd15dacf6d5320564736f6c634300060200331b83247000822470"
      )
    ).wait();

    if (
      (await hardhat.ethers.provider.getCode(singletonFactory.address)) == "0x"
    ) {
      console.log(
        "Singleton factory could not be deployed to correct address, deployment haulted."
      );
      return;
    }
  }
  console.log("Singleton Factory:     ", singletonFactory.address);

  const Factory = await hardhat.ethers.getContractFactory("ModuleProxyFactory");
  // const singletonFactory = new hardhat.ethers.Contract(singletonFactoryAddress, singletonFactoryAbi)

  const targetAddress = await singletonFactory.callStatic.deploy(
    Factory.bytecode,
    factorySalt
  );
  if (targetAddress == AddressZero) {
    console.log(
      "ModuleProxyFactory already deployed to target address on this network."
    );
    return;
  } else {
    console.log("Target Factory Address:", targetAddress);
  }

  const transactionResponse = await singletonFactory.deploy(
    Factory.bytecode,
    factorySalt
  );

  const result = await transactionResponse.wait();
  console.log("Deploy transaction:    ", result.transactionHash);

  const factory = await hardhat.ethers.getContractAt(
    "ModuleProxyFactory",
    targetAddress
  );

  const factoryArtifact = await hardhat.artifacts.readArtifact(
    "ModuleProxyFactory"
  );

  if (
    (await hardhat.ethers.provider.getCode(factory.address)) !=
    factoryArtifact.deployedBytecode
  ) {
    console.log("Deployment unsuccessful: deployed bytecode does not match.");
    return;
  } else {
    console.log(
      "Successfully deployed ModuleProxyFactory to target address! 🎉"
    );
  }
};

task(
  "singleton-deployment",
  "Deploy factory through singleton factory"
).setAction(deployFactory);

module.exports = {};

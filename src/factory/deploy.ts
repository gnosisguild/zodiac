import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;


// await deploySingletonFactory()

  const factory = await deploy("ModuleProxyFactory", {
    from: deployer,
    args: [],
    log: true,
  });
  await hre.run("verify:verify", {
    address: factory.address,
    constructorArguments: [],
  });
};
export default deploy;
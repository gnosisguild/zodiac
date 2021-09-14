import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { deploySingletonFactory } from "../factory/singleton";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  if (hre.network.name !== "hardhat") {
    const salt = "0xddab1fa8c9085d8d8677711bcd78e94f7af3cbd1ca711def31ea3e0cf982d90c";
    await deploySingletonFactory(salt, hre);
  }
};

deploy.tags = ["proxy-factory"];
export default deploy;

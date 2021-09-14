import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { deploySingletonContract } from "../factory/singleton";
import { bytecode as ProxyFactoryByteCode } from "../../build/artifacts/contracts/factory/ModuleProxyFactory.sol/ModuleProxyFactory.json";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  if (hre.network.name !== "hardhat") {
    // const salt = "0xddab1fa8c9085d8d8677711bcd78e94f7af3cbd1ca711def31ea3e0cf982d90c";
    const salt = "0x7777745"
    await deploySingletonContract(ProxyFactoryByteCode, salt, hre);
  }
};

deploy.tags = ["proxy-factory"];
export default deploy;

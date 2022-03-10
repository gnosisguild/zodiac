import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const singletonFactoryAbi = [ 'function deploy(bytes memory _initCode, bytes32 _salt) public returns (address payable createdContract)']
const singletonFactoryAddress = '0xce0042b868300000d44a59004da54a005ffdcf9f'
const factorySalt = '0xddab1fa8c9085d8d8677711bcd78e94f7af3cbd1ca711def31ea3e0cf982d90c'

const deployFactory = async (_: null, hardhat: HardhatRuntimeEnvironment) => {
    const factory = await hardhat.ethers.getContractFactory("ModuleProxyFactory")
    const singletonFactory = new hardhat.ethers.Contract(singletonFactoryAddress, singletonFactoryAbi)
    const encodedData = singletonFactory.interface.encodeFunctionData(
        'deploy(bytes memory _initCode, bytes32 _salt)',
        [
            factory.bytecode,
            factorySalt
        ]
    )
    const [deployer] = await hardhat.ethers.getSigners()

    const transactionResponse = await deployer.sendTransaction({
        to: singletonFactoryAddress,
        from: deployer.address,
        data: encodedData,
        gasLimit: 894_693
    })

    console.log("Mining transaction....")
    const result = await transactionResponse.wait(3)
    console.log(`Transaction with hash ${result.transactionHash} mined`)
}

task(
    "singleton-deployment",
    "Deploy factory through singleton factory"
).setAction(deployFactory)

module.exports = {}
# Module Factory

The purpose of the Module Factory is to make the deployment of Safe Modules easier. 
Applying the Minimal Proxy Pattern, this module reduces the gas cost and simplifies the track of deployed modules. 
The Minimal Proxy Pattern has been used because the modules do not need to be upgradeable since a safe can deploy a new one. 
It's worth mentioning that it costs roughly 5k additional gas for each transaction when using a proxy.
Thus, after a certain number of transactions (~700) it would likely be cheaper to deploy the module from the constructor rather than the proxy.

There's also a JS API, allowing the developers to interact with the ProxyFactory Contract more easily. 
You can check the factory file to see more details, it consists of 4 methods, described individually in the following sections:

### 1. Deploy and set up module

- Interface: `deployAndSetUpModule(moduleName, args, provider, chainId)`
- Arguments:
  - `moduleName`: Name of the module to be deployed, note that it needs to exist as a key in the [CONTRACT_ADDRESSES](./src/constants.ts) object
  - `args`: Arguments of the `setUp` function of the module to deploy
  - `provider`: Ethereum provider, expects an instance of `JsonRpcProvider` from `ethers`
  - `chainId`: Number of network to interact with
- Returns: An object with the transaction built in order to be executed by the Safe, and the expected address of the new module, this will allow developers to batch the transaction of deployment + enable module on safe. Example:

```json
{
  "transaction": {
    "data": "0x",
    "to": "0x",
    "value": "0x"
  },
  "expectedModuleAddress": "0x"
}
```

### 2. Calculate new module address

- Interface: `calculateProxyAddress(factory, masterCopy, initData)`
- Arguments:
  - `factory`: Address of the Module Proxy Factory contract
  - `masterCopy`: Address of the Master Copy of the Module
  - `initData`: Encoded function data that is used to set up the module
- Returns: A string with the expected address

### 3. Get Module

- Interface: `getModuleInstance(moduleName, address, provider)`
- Arguments:

  - `moduleName`: Name of the module to be deployed, note that it needs to exist as a key in the [CONTRACT_ADDRESSES](./src/constants.ts) object
  - `address`: Address of the Module contract
  - `provider`: Ethereum provider, expects an instance of `JsonRpcProvider` from `ethers`

- Returns: A Contract instance of the Module

### 4. Get Factory and Master Copy

- Interface: `getFactoryAndMasterCopy(moduleName, provider, chainId)`
- Arguments:
  - `moduleName`: Name of the module to be deployed, note that it needs to exist as a key in the [CONTRACT_ADDRESSES](./src/constants.ts) object
  - `provider`: Ethereum provider, expects an instance of `JsonRpcProvider` from `ethers`
  - `chainId`: Number of network to interact with
- Returns: An object with the the factory contract instance and with the module contracts instance. Example:

```json
{
    "factory": Contract,
    "module": Contract,
}
```

## Deployments

The latest deployments for each network (supported on mainnet and rinkeby) can be found in the [constants](./src/constants.ts) file

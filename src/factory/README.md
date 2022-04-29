# Module Factory

The purpose of the Module Factory is to make the deployment of Safe Modules easier.
Applying the Minimal Proxy Pattern, this module reduces the gas cost and simplifies the track of deployed modules.
The Minimal Proxy Pattern has been used because the modules do not need to be upgradeable since a safe can deploy a new one.
It's worth mentioning that it costs roughly 5k additional gas for each transaction when using a proxy.
Thus, after a certain number of transactions (~700) it would likely be cheaper to deploy the module from the constructor rather than the proxy.

There's also a JS API, allowing the developers to interact with the ProxyFactory Contract more easily.
You can check the factory file to see more details, it consists of 5 methods, described individually in the following sections:

### 1. Deploy and set up a known module

This method is menthe for deploying contracts that is available in `./constants.ts`.

- Interface: `deployAndSetUpModule(moduleName, args, provider, chainId)`
- Arguments:
  - `moduleName`: Name of the module to be deployed, note that it needs to exist as a key in the [CONTRACT_ADDRESSES](./constants.ts#L3-L12) object
  - `args`: An object with two attributes: `value` and `types`
    - In `value` it expects an array of the arguments of the `setUp` function of the module to deploy
    - In `types` it expects an array of the types of every value
  - `provider`: Ethereum provider, expects an instance of `JsonRpcProvider` from `ethers`
  - `chainId`: Number of network to interact with
- Returns: An object with the transaction built in order to be executed by the Safe, and the expected address of the new module, this will allow developers to batch the transaction of deployment + enable module on safe. Example:

```json
{
  "transaction": {
    "data": "0x",
    "to": "0x",
    "value": "0x" // 0 as BigNumber
  },
  "expectedModuleAddress": "0x"
}
```

### 2. Deploy and set up an custom module

This method is similar to `deployAndSetUpModule`. However it deals with the deployment of contracts that is NOT available in `./constants.ts`.

- Interface: `deployAndSetUpCustomModule(masterCopyAddress, abi, args, provider, chainId)`
- Arguments:
  - `masterCopyAddress`: The address of the module to be deployed
  - `abi`: The ABI of the module to be deployed
  - `args`: An object with two attributes: `value` and `types`
    - In `value` it expects an array of the arguments of the `setUp` function of the module to deploy
    - In `types` it expects an array of the types of every value
  - `provider`: Ethereum provider, expects an instance of `JsonRpcProvider` from `ethers`
  - `chainId`: Number of network to interact with
- Returns: An object with the transaction built in order to be executed by the Safe, and the expected address of the new module, this will allow developers to batch the transaction of deployment + enable module on safe. Example:

```json
{
  "transaction": {
    "data": "0x",
    "to": "0x",
    "value": "0x" // 0 as BigNumber
  },
  "expectedModuleAddress": "0x"
}
```

### 3. Calculate new module address

- Interface: `calculateProxyAddress(factory, masterCopy, initData)`
- Arguments:
  - `factory`: Address of the Module Proxy Factory contract
  - `masterCopy`: Address of the Master Copy of the Module
  - `initData`: Encoded function data that is used to set up the module
- Returns: A string with the expected address

### 4. Get Module

- Interface: `getModuleInstance(moduleName, address, provider)`
- Arguments:

  - `moduleName`: Name of the module to be deployed, note that it needs to exist as a key in the [CONTRACT_ADDRESSES](./constants.ts#L3-L12) object
  - `address`: Address of the Module contract
  - `provider`: Ethereum provider, expects an instance of `JsonRpcProvider` from `ethers`

- Returns: A Contract instance of the Module

### 5. Get Factory and Master Copy

- Interface: `getFactoryAndMasterCopy(moduleName, provider, chainId)`
- Arguments:
  - `moduleName`: Name of the module to be deployed, note that it needs to exist as a key in the [CONTRACT_ADDRESSES](./constants.ts#L3-L12) object
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

Deterministic deployment is being used to deploy factory and modules, meaning that the modules
will have the same address in supported networks, you can check which networks are supported in the
[constants file](./constants.ts#L14-L22)

[Singleton factory](https://eips.ethereum.org/EIPS/eip-2470) is used to deploy the Module Factory, if you want to deploy it
into a not supported chain, you will need to use the [`singleton-deployment` script file](./singleton-deployment.ts)

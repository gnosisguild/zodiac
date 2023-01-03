# Module Proxy Factory

The purpose of the Module Proxy Factory is to make the deployment of Zodiac Modules easier. Applying the Minimal Proxy Pattern, this factory reduces the gas cost of deployment and simplifies the tracking of deployed modules. The Minimal Proxy Pattern has been used because the modules do not need to be upgradeable, since a safe can cheaply deploy a module if needed.

It's worth mentioning that it costs roughly 5k additional gas for each transaction when using a proxy.
Thus, after a certain number of transactions (~700) it would likely be cheaper to deploy the module from the constructor rather than the proxy.

There's also a JS API, allowing the developers to easily:

- Deploy the Module Proxy Factory (and the Singleton Factory if it's not already deployed to the current chain). See `src/factory/deployModuleFactory.ts`.
- Deploy Module Mastercopys via the Singleton Factory. See `src/factory/mastercopyDeployer.ts`.
- Deploy Module minimal proxies (Clones) via the Module Proxy Factory. See `src/factory/moduleDeployer.ts`.

The deployments can either be for your own custom modules or any of the already created Zodiac modules listed in `src/factory/contracts.ts`.

Description of the module deployment functionality:

### 1. Deploy and set up a known module

This method is used to deploy contracts listed in `./constants.ts`.

- Interface: `deployAndSetUpModule(moduleName, setupArgs, provider, chainId, salt)`
- Arguments:
  - `moduleName`: Name of the module to be deployed, note that it needs to exist as a key in the [CONTRACT_ADDRESSES](./constants.ts#L3-L12) object
  - `setupArgs`: An object with two attributes: `value` and `types`
    - In `values` it expects an array of the arguments of the `setUp` function of the module to deploy
    - In `types` it expects an array of the types of every value
  - `provider`: Ethereum provider, expects an instance of `JsonRpcProvider` from `ethers`
  - `chainId`: Number of network to interact with
  - `saltNonce`: Salt for the Create2 op code
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

This method is similar to `deployAndSetUpModule`, however, it deals with the deployment of contracts that is NOT listed in `./constants.ts`.

- Interface: `deployAndSetUpCustomModule(mastercopyAddress, abi, setupArgs, provider, chainId, saltNonce)`
- Arguments:
  - `mastercopyAddress`: The address of the module to be deployed
  - `abi`: The ABI of the module to be deployed
  - `setupArgs`: An object with two attributes: `value` and `types`
    - In `values` it expects an array of the arguments of the `setUp` function of the module to deploy
    - In `types` it expects an array of the types of every value
  - `provider`: Ethereum provider, expects an instance of `JsonRpcProvider` from `ethers`
  - `chainId`: Number of network to interact with
  - `saltNonce`: Some salt to use for the deployment
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

This method is used to calculate the resulting address of a deployed module given the provided parameters. It is useful for building multisend transactions that both deploy a module and then make calls to that module or calls referencing the module's address.

- Interface: `calculateProxyAddress(moduleFactory, mastercopyAddress, initData, saltNonce)`
- Arguments:
  - `moduleFactory`: The Module Proxy Factory contract object
  - `mastercopyAddress`: Address of the Master Copy of the Module
  - `initData`: Encoded function data that is used to set up the module
  - `saltNonce`: Some salt to use for the deployment
- Returns: A string with the expected address

### 4. Get Module

This method returns an instance of a given module.

- Interface: `getModuleInstance(moduleName, moduleAddress, provider)`
- Arguments:

  - `moduleName`: Name of the module to be deployed, note that it needs to exist as a key in the [CONTRACT_ADDRESSES](./constants.ts#L3-L12) object
  - `moduleAddress`: Address of the Module contract
  - `provider`: Ethereum provider, expects an instance of `JsonRpcProvider` from `ethers`

- Returns: A Contract instance of the Module

### 5. Get Factory and Master Copy

This method returns an object with the an instance of the factory contract and the given module's mastercopy.

- Interface: `getFactoryAndMasterCopy(moduleName, provider, chainId)`
- Arguments:
  - `moduleName`: Name of the module to be deployed, note that it needs to exist as a key in the [CONTRACT_ADDRESSES](./constants.ts#L3-L12) object
  - `provider`: Ethereum provider, expects an instance of `JsonRpcProvider` from `ethers`
  - `chainId`: Number of network to interact with
- Returns: An object with the the factory contract instance and with the module contracts instance. Example:

```json
{
    "moduleFactory": Contract,
    "moduleMastercopy": Contract,
}
```

## Deployments

We use a deterministic deployment to deploy the factory and mastercopies of each module, so that they can be deployed with the same address on supported networks. You can check which networks are supported in the
[constants file](./constants.ts#L14-L22)

The [Singleton Factory](https://eips.ethereum.org/EIPS/eip-2470) is used to deploy the Module Proxy Factory. If it is not already deployed at the correct address on your network, the [`singleton-deployment` script file](./singleton-deployment.ts) will attempt to deploy it before deploying the Module Proxy Factory. If the Singleton Factory cannot be deployed to the correct address, the script will fail.

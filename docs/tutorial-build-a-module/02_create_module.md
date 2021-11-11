---
sidebar_position: 2
---

# Build Your Module

## What is a module?

By default, Gnosis Safes operate as multisig wallets, requiring confirmation from _n_ of _m_ signers in order to execute transactions. However, in addition to (or instead of) using the multisig logic, you can enable "modules" on your Gnosis Safe. Modules are simply addresses that are allowed to bypass the normal multisig logic by calling some special functions, `execTransactionFromModule()` or `execTransactionFromModuleReturnData()`.

Earlier, you deployed and set up a Mock Safe and a Button that can only be pushed by the Mock Safe.

Now we'll create a Module that can trigger the Mock Safe to push the Button.

## Import Module.sol

First and foremost, Zodiac is a philosophy for building composable DAO tooling. To make easier on aspiring module developers, we've built a library of tools that you can import into your own contracts to help ensure your modules are Zodiac compatible and to reduce the amount of time and effort for you to implement your module.

Simply import [Module.sol](https://github.com/gnosis/zodiac/blob/master/contracts/core/Module.sol) from the Zodiac library and add whatever logic your module needs.

```solidity
pragma solidity ^0.8.6;

import "@gnosis.pm/zodiac/contracts/core/Module.sol";

contract MyModule is Module {
  /// insert your code here
}
```

In our case, we want to add a function to tell our Safe to push the button.

Define and `address button` variable and add a `pushButton` function to your contract which calls the `exec()` function from `Module.sol`.

`exec()` will call the `execTransactionFromModule()` function on the connected Safe.
It has four parameters:

- **to:** the address that the safe will call. The Button contract in our case.
- **value:** the amount of ETH in wei that should be sent with the transaction. This is zero in our case.
- **data:** the ABI encoded transaction data that the data for the safe's transaction. In our case this is the function selector for the `pushButton()` function.
- **operation:** defines whether the transaction should be a call or a delegate call. In our case, we'll just do a call.

```solidity
address button;

function pushButton() external {
    exec(
        button,
        0,
        abi.encodePacked(bytes4(keccak256("pushButton()"))),
        Enum.Operation.Call
    );
}
```

That's essentially it!
The bulk of your work in creating a module is defining the conditions under which `exec()` can be called.

## Factory Friendly

Wait... I'm still seeing compiler errors.

`Module.sol` provides another convenience feature to enable any module to be compatible with our [ModuleProxyFactory](https://github.com/gnosis/zodiac/blob/master/contracts/factory/ModuleProxyFactory.sol) and the Zodiac Safe App. This makes it easier to streamline deployment and setup of modules so, for example, we can do things like batch deployment of a safe, its modules, and the calls to enable the modules into one Ethereum transaction. 🤯

Before our contract will compile, you'll need to add a constructor and a setup function.
Notice that our constructor simply ABI encodes the parameters that were passed in and then calls the `setUp()` function. This gives users the option to deploy the module directly, or to deploy it using the [ModuleProxyFactory](https://github.com/gnosis/zodiac/blob/master/contracts/factory/ModuleProxyFactory.sol).

```solidity
constructor(address _owner, address _button) {
    bytes memory initializeParams = abi.encode(_owner, _button);
    setUp(initializeParams);
}

/// @dev Initialize function, will be triggered when a new proxy is deployed
/// @param initializeParams Parameters of initialization encoded
function setUp(bytes memory initializeParams) public override {
    __Ownable_init();
    (address _owner, address _button) = abi.decode(initializeParams, (address, address));

    button = _button;
    setAvatar(_owner);
    setTarget(_owner);
    transferOwnership(_owner);
}
```

Our `setUp()` function will set the `button` address, then `avatar`, `target`, and `owner` will all be set to the same address.
In most cases, these three addresses will be set to the same, but there are subtle distinctions between the three and sometimes they may need to be different.

- **Avatar:** is the Safe. The Address that will ultimately execute the transaction that is passed by the module.
- **Target:** is the address that this module will call `execTransactionFromModule()` on. In most cases this will be the Safe, but in some cases it could be a special kind of module called a [modifier](https://github.com/gnosis/zodiac/blob/master/contracts/core/Modifier.sol), that sits between a module and an avatar and... well... modifies the transactions passed to it in some way.
- **Owner:** is the address that has permissions to call `OnlyOwner()` functions on the module.

In case your `MyModule.sol` is still not compiled, [here's one we baked earlier](https://gist.github.com/auryn-macmillan/841906d0bc6c2624e83598cdfac17de8).

# Zodiac

[![Build Status](https://github.com/gnosis/zodiac/workflows/zodiac/badge.svg?branch=main)](https://github.com/gnosis/zodiac/actions)
[![Coverage Status](https://coveralls.io/repos/github/gnosis/zodiac/badge.svg?branch=main)](https://coveralls.io/github/gnosis/zodiac)

A library for composable DAO tooling built on top of programmable accounts, like the [Gnosis Safe](https://gnosis-safe.io).
Zodiac enables:

- Flexible module based control of programmable accounts.
- Un-opinionated standards for controlling programmable accounts.
- Reusable implementations of core and factory logic.

## Overview

### Installation

```bash
yarn add https://github.com/gnosis/zodiac
```

### Usage

Once installed, you can use the contracts in the library by importing them:

```solidity
pragma solidity ^0.8.0;

import "https://github.com/gnosis/contracts/core/Module.sol";

contract MyModule is Module {
  /// insert your code here
}

```

### Zodiac compliant tools

#### Programmable accounts

- **[Gnosis Safe](https://gnosis-safe.io):** The most trusted multisig solution for the Ethereum ecosystem, but also a powerful and extensible programmable account standard. The Gnosis Safe is the reference implementation of the [IExecutor.sol](contracts/core/IExecutor.sol) interface specified in this library.

#### Modules

- **[dao-module](https://github.com/gnosis/dao-module):** allows on-chain execution based on the outcome of events reported by Reality.eth. Used to build the SafeSnap module for [Snapshot](https://snapshot.org).
- **[SafeBridge](https://github.com/gnosis/SafeBridge):** allows an address on one chain to control an executor on another chain, via an arbitrary message bridge.
- **[SafeExit](https://github.com/gnosis/SafeExit):** allows users to redeem a designated token for a relative share of an accounts assets, similar to Moloch's infamous `rageQuit()` function.

#### Modifiers

- **[SafeDelay](https://github.com/gnosis/SafeDelay):** allows accounts to enforce a time delay between when a module initiates a transaction and when it will be executed by the account.

#### Misc.

- **[ScopeGuard](https://github.com/gnosis/ScopeGuard):** a transaction guard for the Gnosis Safe that restricts the multisig owners to only calling specific addresses and function signatures.

Built something cool Zodiac and want to add it to the list? Open a PR!

### License

Zodiac is created under the [LGPL-3.0+ license](LICENSE).

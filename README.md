# Zodiac

[![Build Status](https://github.com/gnosis/zodiac/workflows/zodiac/badge.svg?branch=master)](https://github.com/gnosis/zodiac/actions?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/gnosis/zodiac/badge.svg?branch=master)](https://coveralls.io/github/gnosis/zodiac?branch=master)

A library for composable DAO tooling built on top of programmable accounts, like the [Gnosis Safe](https://gnosis-safe.io).

Zodiac enables:

- Flexible module based control of programmable accounts.
- Un-opinionated standards for controlling programmable accounts.
- Reusable implementations of core and factory logic.

Zodiac defines four key components:

**1. Avatars:** Programmable Ethereum accounts, like the [Gnosis Safe](https://gnosis-safe.io). Avatars are the address that holds balances, owns systems, executes transaction, is referenced externally, and ultimately represents your DAO.
Avatars must expose an interface like `IAvatar.sol`.

**Modules:** Contracts that are enabled by an Avatar and implement some decision making logic. They should import `Module.sol`.

**Modifiers:** Contracts that sit between Modules and Avatars to modify the Module's behavior. For example, they might enforce a timelock on all functions a Module attempts to execute. Modifiers should import `Modifier.sol` and must expose an interface like `IAvatar.sol`

**Guards:** Contracts that can be enabled on Modules and implement pre and/or post-checks on each transaction that the Module executes. Allowing Avatars to do things like limit the scope of addresses and functions that a module can call or ensure certain state is never changed by a module.
Guards should improt `BaseGuard.sol`.

## Overview

### Installation

```bash
yarn add https://github.com/gnosis/zodiac
```

### Usage

Once installed, you can use the contracts in the library by importing them into your contract:

```solidity
pragma solidity ^0.8.6;

import "https://github.com/gnosis/contracts/core/Module.sol";

contract MyModule is Module {
  /// insert your code here
}

```

### Zodiac compliant tools

#### Avatars

- **[Gnosis Safe](https://gnosis-safe.io):** The most trusted multisig solution for the Ethereum ecosystem, but also a powerful and extensible programmable avatar standard. The Gnosis Safe is the reference implementation of the [IAvatar.sol](contracts/core/IAvatar.sol) interface specified in this library.

#### Modules

- **[Reality](https://github.com/gnosis/zodiac-module-reality):** allows on-chain execution based on the outcome of events reported by Reality.eth. Used to build the SafeSnap module for [Snapshot](https://snapshot.org).
- **[Bridge](https://github.com/gnosis/zodiac-module-bridge):** allows an address on one chain to control an avatar on another chain, via an arbitrary message bridge.
- **[Exit](https://github.com/gnosis/zodiac-module-exit):** allows users to redeem a designated token for a relative share of an avatars assets, similar to Moloch's infamous `rageQuit()` function.
- **[Minion Safe](https://github.com/HausDAO/MinionSummonerV2/blob/main/contracts/SafeMinion.sol)**: This module allows Moloch DAOs to manage the assets in a Gnosis Safe based on the outcome of v2 Moloch DAO proposals. Built by the DAOHaus team, this enables a wide variety of migration paths and treasury structures for Moloch DAOs. It enables Moloch DAOs to manage collections of NFTs, manage LP positions with AMMs, and any other arbitrary interactions. It enables DAOs that start as a Gnosis Safe can delegate governance to a Moloch DAO. It also enables DAOs to upgrade their governance framework over time while keeping the assets in one location.

#### Modifiers

- **[Delay](https://github.com/gnosis/zodiac-modifier-delay):** allows avatars to enforce a time delay between when a module initiates a transaction and when it will be executed by the avatar.

#### Guards.

- **[Scope](https://github.com/gnosis/zodiac-guard-scope):** a transaction guard for the Gnosis Safe that restricts the multisig owners to only calling specific addresses and function signatures.

Built something cool Zodiac and want to add it to the list? Open a PR!

### License

Zodiac is created under the [LGPL-3.0+ license](LICENSE).

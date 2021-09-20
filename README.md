# Zodiac

[![Build Status](https://github.com/gnosis/zodiac/workflows/zodiac/badge.svg?branch=master)](https://github.com/gnosis/zodiac/actions)
[![Coverage Status](https://coveralls.io/repos/github/gnosis/zodiac/badge.svg?branch=master)](https://coveralls.io/github/gnosis/zodiac)

A composable design philosophy for DAOs, Zodiac is a collection of tools built according to an open standard. 

The Zodiac collection of tools can be accessed through the Zodiac App available on [Gnosis Safe](https://gnosis-safe.io/), as well as through the repositories below. If you have any questions about Zodiac, join the [Gnosis Guild Discord](https://discord.gg/wwmBWTgyEq). Follow [@GnosisGuild](https://twitter.com/gnosisguild) on Twitter for updates.

Zodiac enables:

- Flexible, module-based control of programmable accounts
- Un-opinionated standards for programmable account interaction
- Reusable implementations of core and factory logic

The Zodiac open standard consists of Avatars, Modules, Modifiers, and Guards architecture:


**1. Avatars** are programmable Ethereum accounts, like the [Gnosis Safe](https://gnosis-safe.io). Avatars are the address that holds balances, owns systems, executes transaction, is referenced externally, and ultimately represents your DAO. Avatars must expose an interface like `IAvatar.sol`.

**2. Modules** are contracts enabled by an Avatar that implement some decision making logic. They should import `Module.sol`.

**3. Modifiers** are contracts that sit between Modules and Avatars to modify the Module's behavior. For example, they might enforce a delay on all functions a Module attempts to execute. Modifiers should import `Modifier.sol` and must expose an interface like `IAvatar.sol`

**4. Guards** are contracts that can be enabled on Modules and implement pre- or post-checks on each transaction that the Module executes. This allows Avatars to do things like limit the scope of addresses and functions that a module can call or ensure a certain state is never changed by a module. Guards should import `BaseGuard.sol`.

## Overview

### Installation

```bash
yarn add https://github.com/gnosis/zodiac
```

### Usage

Once installed, you can use the contracts in the library by importing them to your contract:

```solidity
pragma solidity ^0.8.0;

import "https://github.com/gnosis/contracts/core/Module.sol";

contract MyModule is Module {
  /// insert your code here
}

```

### Zodiac compliant tools

#### Avatars

- **[Gnosis Safe](https://gnosis-safe.io):** The most trusted platform for managing digital assets on Ethereum. Zodiac embraces Gnosis Safe as a powerful, extensible and programmable account standard. Gnosis Safe is the reference implementation of the [IAvatar.sol](contracts/core/IAvatar.sol) interface specified in this library. However, all Zodiac tools are framework agnostic, and they can be plugged into any programmable account that implements the IAvatar interface.

#### Modules

- **[Reality](https://github.com/gnosis/dao-module):** This module allows on-chain execution based on the outcome of events reported by Reality.eth. While built initially to execute Gnosis Safe transactions according to Snapshot proposals, this module is framework agnostic. It can enable proposal execution from just about anywhere. For example, it can bring Discord polls on-chain. 

- **[Bridge](https://github.com/gnosis/SafeBridge):** This module allows an address on one chain to control an avatar on another chain using an Arbitrary Message Bridge (AMB). This enables a DAO on one chain to control assets and interact with systems like a Gnosis Safe on a different chain.
- **[Exit](https://github.com/gnosis/SafeExit):** This module allows users to redeem a designated token for a relative share of an avatar's assets, similar to MolochDAO's infamous rageQuit() function. 

#### Modifiers

- **[Delay](https://github.com/gnosis/SafeDelay):** This modifier allows avatars to enforce a time delay between when a module initiates a transaction and when it will be executed by an avatar.

#### Guards

- **[Scope](https://github.com/gnosis/ScopeGuard):** This guard allows an avatar to limit the scope of the addressable functions with which its owners can interact. This enables the avatar to define granular permissions for different control mechanisms.

## Support and Contributions

Have you built something cool belonging to the Zodiac collection of tools, and want to add it to the list? Open a PR!

If you have any questions about Zodiac, join the [Gnosis Guild Discord](https://discord.gg/wwmBWTgyEq). Follow [@GnosisGuild](https://twitter.com/gnosisguild) on Twitter for updates.

### License

Zodiac is created under the [LGPL-3.0+ license](LICENSE).

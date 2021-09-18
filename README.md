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

**2. Modules:** Contracts that are enabled by an Avatar and implement some decision making logic. They should import `Module.sol`.

**3. Modifiers:** Contracts that sit between Modules and Avatars to modify the Module's behavior. For example, they might enforce a timelock on all functions a Module attempts to execute. Modifiers should import `Modifier.sol` and must expose an interface like `IAvatar.sol`

**4. Guards:** Contracts that can be enabled on Modules and implement pre and/or post-checks on each transaction that the Module executes. Allowing Avatars to do things like limit the scope of addresses and functions that a module can call or ensure certain state is never changed by a module.
Guards should import `BaseGuard.sol`.

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

- **[Gnosis Safe](https://gnosis-safe.io):** The most trusted multisig solution for the Ethereum ecosystem, but also a powerful and extensible programmable avatar standard. The Gnosis Safe is the reference implementation of the [IAvatar.sol](contracts/core/IAvatar.sol) interface specified in this library. (Built by [Gnosis](https://gnosis.io))

#### Modules

- **[Reality](https://github.com/gnosis/zodiac-module-reality):** allows on-chain execution based on the outcome of events reported by Reality.eth. Used to build the SafeSnap module for [Snapshot](https://snapshot.org). (Built by [Gnosis Guild](https://twitter.com/gnosisguild))
- **[Bridge](https://github.com/gnosis/zodiac-module-bridge):** allows an address on one chain to control an avatar on another chain, via an arbitrary message bridge. (Built by [Gnosis Guild](https://twitter.com/gnosisguild))
- **[Exit](https://github.com/gnosis/zodiac-module-exit):** allows users to redeem a designated token for a relative share of an avatars assets, similar to Moloch's infamous `rageQuit()` function. (Built by [Gnosis Guild](https://twitter.com/gnosisguild))
- **[Safe Minion](https://github.com/HausDAO/MinionSummonerV2/blob/main/contracts/SafeMinion.sol):** This module allows Moloch DAOs to manage the assets in a Gnosis Safe based on the outcome of v2 Moloch DAO proposals. Safe Minion enables Moloch DAOs to manage collections of NFTs, manage LP positions with AMMs, and initiate any other arbitrary interactions. It enables DAOs that start as a Gnosis Safe to later delegate governance to a Moloch DAO. (Built by [DAOHaus](https://daohaus.club))
- **[Seele](https://github.com/TokenWalk/Seele):** allows avatars to operate with trustless DeGov, similar to Compound or Gitcoin, with a time-boxed proposal core that can register swappable voting contracts, allowing DAOs to choose from various on-chain voting methods that best suit their needs. (Built by [TokenWalk](https://www.tokenwalk.org))

#### Modifiers

- **[Delay](https://github.com/gnosis/zodiac-modifier-delay):** allows avatars to enforce a time delay between when a module initiates a transaction and when it will be executed by the avatar. (Built by [Gnosis Guild](https://twitter.com/gnosisguild))

#### Guards.

- **[Scope](https://github.com/gnosis/zodiac-guard-scope):** a transaction guard for the Gnosis Safe that restricts the multisig owners to only calling specific addresses and function signatures. (Built by [Gnosis Guild](https://twitter.com/gnosisguild))

Built something cool Zodiac and want to add it to the list? Open a PR!

### Audits

Zodiac has been audited by the [G0 group](https://github.com/g0-group).

All issues and notes of the audit have been addressed in the release candidate [v0.1.0](https://github.com/gnosis/zodiac/releases/tag/v0.1.0) with commit hash [8a77e7b224af8004bd9f2ff4e2919642e93ffd85](https://github.com/gnosis/zodiac/commit/8a77e7b224af8004bd9f2ff4e2919642e93ffd85), and the subsequent release [v1.0.0](https://github.com/gnosis/zodiac/releases/tag/v1.0.0)

The audit results are available as a pdf [in this repo](./audits/GnosisZodiac2021Sep.pdf) or in the [g0-group's github repo](https://github.com/g0-group/Audits/blob/master/GnosisZodiac2021Sep.pdf).

### Security and Liability

All contracts are WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

### License

Zodiac is created under the [LGPL-3.0+ license](LICENSE).

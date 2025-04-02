# Zodiac: The expansion pack for DAOs

[![Build Status](https://github.com/gnosisguild/zodiac/workflows/zodiac/badge.svg?branch=master)](https://github.com/gnosisguild/zodiac/actions?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/gnosis/zodiac/badge.svg?branch=master)](https://coveralls.io/github/gnosisguild/zodiac?branch=master)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://github.com/gnosisguild/CODE_OF_CONDUCT)

A composable design philosophy for DAOs, [Zodiac](https://gnosisguild.mirror.xyz/OuhG5s2X5uSVBx1EK4tKPhnUc91Wh9YM0fwSnC8UNcg) is a collection of tools built according to an open standard.

![Zodiac Icons](https://images.mirror-media.xyz/nft/c8c9031b-06b1-4344-baf2-c1d2d24cfc4f.png)

The Zodiac collection of tools can be accessed through the Zodiac App available on [Safe](https://safe.global/), as well as through the repositories below. If you have any questions about Zodiac, join the [Gnosis Guild Discord](https://discord.gnosisguild.org).

This repository links to technical tutorials on how to configure each using the CLI. (For operator tutorials, visit [zodiac.wiki](https://zodiac.wiki/documentation).)

Zodiac enables:

- Flexible, module-based control of programmable accounts
- Un-opinionated standards for programmable account interaction
- Reusable implementations of core and factory logic

The Zodiac open standard consists of Avatars, Modules, Modifiers, and Guards architecture:

**1. Avatars** are programmable Ethereum accounts, like [Safe](https://safe.global/). Avatars are the address that holds balances, owns systems, executes transaction, is referenced externally, and ultimately represents your DAO. Avatars must expose an interface like `IAvatar.sol`.

**2. Modules** are contracts enabled by an Avatar that implement some decision making logic. They should import `Module.sol`.

**3. Modifiers** are contracts that sit between Modules and Avatars to modify the Module's behavior. For example, they might enforce a delay on all functions a Module attempts to execute. Modifiers should import `Modifier.sol` and must expose an interface like `IAvatar.sol`

**4. Guards** are contracts that can be enabled on Modules and implement pre- or post-checks on each transaction that the Module executes. This allows Avatars to do things like limit the scope of addresses and functions that a module can call or ensure a certain state is never changed by a module. Guards should import `BaseGuard.sol`.

## Overview

### Installation

```bash
yarn add @gnosis-guild/zodiac
```

### Usage

Once installed, you can use the contracts in the library by importing them to your contract:

```solidity
pragma solidity ^0.8.6;

import "@gnosis-guild/zodiac/contracts/core/Module.sol";

contract MyModule is Module {
  /// insert your code here
}

```

### Zodiac compliant tools

#### Avatars

- **[Safe](https://safe.global)**: The most trusted platform for managing digital assets on Ethereum. Zodiac embraces Safe as a powerful, extensible and programmable account standard. Safe is the reference implementation of the [IAvatar.sol](contracts/interfaces/IAvatar.sol) interface specified in this library. However, all Zodiac tools are framework agnostic, and they can be plugged into any programmable account that implements the IAvatar interface.

#### Modules

- **[Bridge](https://github.com/gnosisguild/zodiac-module-bridge)** (developed by [Gnosis Guild](https://twitter.com/gnosisguild)): This module allows an address on one chain to control an avatar on another chain using an Arbitrary Message Bridge (AMB). This enables a DAO on one chain to control assets and interact with systems like a Safe on a different chain.
- **[Exit](https://github.com/gnosisguild/zodiac-module-exit)** (developed by [Gnosis Guild](https://twitter.com/gnosisguild)): This module allows users to redeem a designated token for a relative share of an avatar's assets, similar to MolochDAO's infamous rageQuit() function.
- **[Governor](https://github.com/gnosisguild/zodiac-module-oz-governor/)** (Developed by [Gnosis Guild](https://twitter.com/gnosisguild)): An opinionated implementation of [OpenZeppelin's Governor contracts](https://docs.openzeppelin.com/contracts/4.x/api/governance) designed to be used in a Zodiac-style setup, allowing a Avatar (like a Safe) to controlled by on-chain governance similar to [Compound's Governor Alpha and Bravo](https://compound.finance/docs/governance).
- **[Optimistic Governor](https://docs.outcome.finance/optimistic-governance/what-is-the-optimistic-governor)** (developed by [Outcome Finance](https://www.outcome.finance/): This module allows on-chain executions based on Snapshot proposal results. The module utilizes UMA's optimistic oracle to govern a Safe based on a set of rules defined off-chain.
- **[Reality](https://github.com/gnosisguild/zodiac-module-reality)** (developed by [Gnosis Guild](https://twitter.com/gnosisguild)): This module allows on-chain execution based on the outcome of events reported by Reality.eth. While built initially to execute Safe transactions according to Snapshot proposals, this module is framework agnostic. It can enable proposal execution from just about anywhere. For example, it can bring Discord polls on-chain.
- **[Safe Minion](https://github.com/HausDAO/MinionSummonerV2/blob/main/contracts/SafeMinion.sol)** (developed by [DAOHaus](https://daohaus.club)): This module allows Moloch DAOs to manage the assets in a Safe based on the outcome of v2 Moloch DAO proposals. Safe Minion enables Moloch DAOs to manage collections of NFTs, manage LP positions with AMMs, and initiate any other arbitrary interactions. It enables DAOs that start as a Safe to later delegate governance to a Moloch DAO.
- **[Tellor](https://github.com/tellor-io/snapshot-zodiac-module)** (developed by [Tellor](https://tellor.io)): This module allows on-chain executions based on Snapshot proposal results, it uses the Tellor oracle to retrieve the data in a secure and decentralized manner.
- **[Usul](https://github.com/SekerDAO/Usul)** (developed by [SekerDAO](https://github.com/SekerDAO)): This module allows avatars to operate with trustless tokenized DeGov, similar to Compound or Gitcoin, with a time-boxed proposal core that can register swappable voting contracts. This enables DAOs to choose from various on-chain voting methods that best suit their needs.

#### Modifiers

- **[Delay](https://github.com/gnosisguild/zodiac-modifier-delay)** (developed by [Gnosis Guild](https://twitter.com/gnosisguild)): This modifier allows avatars to enforce a time delay between when a module initiates a transaction and when it will be executed by an avatar.
- **[Roles](https://github.com/gnosisguild/zodiac-modifier-roles)** (developed by [Gnosis Guild](https://twitter.com/gnosisguild)): This modifier allows for fine-grained, role-based, access control for enabled modules. Scopes for a given role include allowed addresses, and optionally include allowed functions on allowed addresses, allowed parameters on allowed functions, whether or not delegate calls are allowed to an allowed address, and whether or not value (ETH) can be sent to an allowed address.

#### Guards

- **[Meta](https://github.com/cardstack/cardstack-meta-guard)** (developed by [Cardstack](https://twitter.com/cardstack)): This guard allows an avatar to have multiple checking processes by registering multiple guards to this meta guard.
- **[Scope](https://github.com/gnosisguild/zodiac-guard-scope)** (developed by [Gnosis Guild](https://twitter.com/gnosisguild)): This guard allows an avatar to limit the scope of the addressable functions with which its owners can interact. This enables the avatar to define granular permissions for different control mechanisms.

## Support and Contributions

Have you built something cool that belongs in this collection of Zodiac tools and want to add it to the list? Follow our [contribution guidelines](/CONTRIBUTING.md) to open a PR!

If you have any questions about Zodiac, join the [Gnosis Guild Discord](https://discord.gnosisguild.org/). Follow [@GnosisGuild](https://twitter.com/gnosisguild) on Twitter for updates.

The [Zodiac documentation](https://github.com/gnosisguild/zodiac) offers tutorials on how to use the Zodiac App, and detailed developer resources on how to build your own Zodiac module, modifier, or guard will be available soon.

### Zodiac Banners and Badges

Show your support for Zodiac by adding a badge or banner to your website or repository. Check out the preview images below, and select your preferred design for download. Please wrap the image with a hyperlink to [Zodiac](https://github.com/gnosisguild/zodiac).

NOTE: To guarantee the most current design, copy the image URL and use the hosted version for embedding on your platform.

Your support through these badges and banners is greatly appreciated!

**Banners**

![White on Black Banner](https://raw.githubusercontent.com/gnosisguild/zodiac/master/branding/zodiac-banner-black-white.svg)
![Black on White Banner](https://raw.githubusercontent.com/gnosisguild/zodiac/master/branding/zodiac-banner-white-black.svg)

![Light Gradient Banner](https://raw.githubusercontent.com/gnosisguild/zodiac/master/branding/zodiac-banner-gradient-light.svg)
![Dark Gradient Banner](https://raw.githubusercontent.com/gnosisguild/zodiac/master/branding/zodiac-banner-gradient-dark.svg)

**Badges**

![White on Black Badge](https://raw.githubusercontent.com/gnosisguild/zodiac/master/branding/zodiac-badge-black-white.svg)
![Black on White Badge](https://raw.githubusercontent.com/gnosisguild/zodiac/master/branding/zodiac-badge-white-black.svg)
![Light Gradient Badge](https://raw.githubusercontent.com/gnosisguild/zodiac/master/branding/zodiac-badge-gradient-light.svg)
![Dark Gradient Badge](https://raw.githubusercontent.com/gnosisguild/zodiac/master/branding/zodiac-badge-gradient-dark.svg)

**Copy and paste markdown** (for README's)
These snippets will render an image that links to this github repo.

[![White on black banner](https://raw.githubusercontent.com/gnosisguild/zodiac/master/branding/zodiac-badge-black-white.svg)](https://github.com/gnosisguild/zodiac)

```
[![White on black banner](https://raw.githubusercontent.com/gnosisguild/zodiac/master/branding/zodiac-badge-black-white.svg)](https://github.com/gnosisguild/zodiac)
```

[![Black on White Banner](https://raw.githubusercontent.com/gnosisguild/zodiac/master/branding/zodiac-banner-white-black.svg)](https://github.com/gnosisguild/zodiac)

```
[![Black on White Banner](https://raw.githubusercontent.com/gnosisguild/zodiac/master/branding/zodiac-banner-white-black.svg)](https://github.com/gnosisguild/zodiac)
```

### Audits

Zodiac has been audited by the [G0 group](https://github.com/g0-group).

All issues and notes of the audit have been addressed in the release candidate [v0.1.0](https://github.com/gnosisguild/zodiac/releases/tag/v0.1.0) with commit hash [8a77e7b224af8004bd9f2ff4e2919642e93ffd85](https://github.com/gnosisguild/zodiac/commit/8a77e7b224af8004bd9f2ff4e2919642e93ffd85) and the subsequent release [v1.0.0](https://github.com/gnosisguild/zodiac/releases/tag/v1.0.0).

The audit results are available as a pdf [in this repo](./audits/GnosisZodiac2021Sep.pdf) or in the [g0-group's github repo](https://github.com/g0-group/Audits/blob/master/GnosisZodiac2021Sep.pdf).

### Security and Liability

All contracts are WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

### License

Zodiac is created under the [LGPL-3.0+ license](LICENSE).

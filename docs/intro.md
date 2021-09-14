---
sidebar_position: 1
---

# Zodiac Introduction

Let's discover **Zodiac in less than 5 minutes**.

Anyone can contribute to the Zodiac compliant collection of tools by submitting a pull request on the repository: https://github.com/gnosis/zodiac. 

## What Is Zodiac?

The expansion pack for DAOs, Zodiac is a collection of tools built according to an open standard. 

The Zodiac open standard enables DAOs to act more like constellations, connecting protocols, platforms, and chains, no longer confined to monolithic designs.

To learn more about the ideas behind Zodiac, visit the [blog](http://gnosisguild.mirror.xyz/). If you have any questions about Zodiac, join the [Gnosis Guild Discord](https://discord.gg/wwmBWTgyEq). 

The Zodiac open standard enables:

- Flexible, module-based control of programmable accounts
- Un-opinionated standards for programmable account interaction
- Reusable implementations of core and factory logic


## Build a Zodiac Module

Import Module.sol into your module.

```solidity
import "@gnosis/zodiac/contracts/core/Module.sol";

contract YourModule is Module {
  /// insert your code here
}

```

---
sidebar_position: 1
---

# Zodiac Introduction

Let's discover **Zodiac in less than 5 minutes**.

## What Is Zodiac?

Zodiac is a library for composable DAO tooling built on top of programmable accounts, like the [Gnosis Safe](https://gnosis-safe.io).
Zodiac enables:

- Flexible module based control of programmable accounts.
- Un-opinionated standards for controlling programmable accounts.
- Reusable implementations of core and factory logic.

## Build Your Own Module

Import Module.sol into your module.

```solidity
import "@gnosis/zodiac/contracts/core/Module.sol";

contract YourModule is Module {
  /// insert your code here
}

```

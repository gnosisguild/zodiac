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

### License

Zodiac is created under the [LGPL-3.0+ license](LICENSE).

// SPDX-License-Identifier: LGPL-3.0-only

pragma solidity >=0.7.0 <0.9.0;

import "./BaseModifier.sol";
import "./GuardableModule.sol";

abstract contract GuardableModifier is GuardableModule, BaseModifier {}

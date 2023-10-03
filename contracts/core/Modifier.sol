// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

import "./Module.sol";
import "./BaseModifier.sol";

/// @title Modifier Interface - A contract that sits between a Module and an Avatar and enforces some additional logic.
abstract contract Modifier is Module, BaseModifier {

}

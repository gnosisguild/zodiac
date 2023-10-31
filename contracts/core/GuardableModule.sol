// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

import {Enum} from "@gnosis.pm/safe-contracts/contracts/common/Enum.sol";
import {IGuard} from "../interfaces/IGuard.sol";
import {Guardable} from "../guard/Guardable.sol";
import {Module} from "./Module.sol";
import {IAvatar} from "../interfaces/IAvatar.sol";

/// @title GuardableModule  - A contract that can pass messages to a Module Manager contract if enabled by that contract.
abstract contract GuardableModule is Module, Guardable {
  /// @dev Passes a transaction to be executed by the avatar.
  /// @notice Can only be called by this contract.
  /// @param to Destination address of module transaction.
  /// @param value Ether value of module transaction.
  /// @param data Data payload of module transaction.
  /// @param operation Operation type of module transaction: 0 == call, 1 == delegate call.
  function exec(
    address to,
    uint256 value,
    bytes memory data,
    Enum.Operation operation
  ) internal override returns (bool success) {
    address currentGuard = guard;
    if (currentGuard != address(0)) {
      IGuard(currentGuard).checkTransaction(
        /// Transaction info used by module transactions.
        to,
        value,
        data,
        operation,
        /// Zero out the redundant transaction information only used for Safe multisig transctions.
        0,
        0,
        0,
        address(0),
        payable(0),
        "",
        msg.sender
      );
    }
    success = IAvatar(target).execTransactionFromModule(
      to,
      value,
      data,
      operation
    );
    if (currentGuard != address(0)) {
      IGuard(currentGuard).checkAfterExecution(bytes32(0), success);
    }
  }

  /// @dev Passes a transaction to be executed by the target and returns data.
  /// @notice Can only be called by this contract.
  /// @param to Destination address of module transaction.
  /// @param value Ether value of module transaction.
  /// @param data Data payload of module transaction.
  /// @param operation Operation type of module transaction: 0 == call, 1 == delegate call.
  function execAndReturnData(
    address to,
    uint256 value,
    bytes memory data,
    Enum.Operation operation
  ) internal virtual override returns (bool success, bytes memory returnData) {
    address currentGuard = guard;
    if (currentGuard != address(0)) {
      IGuard(currentGuard).checkTransaction(
        /// Transaction info used by module transactions.
        to,
        value,
        data,
        operation,
        /// Zero out the redundant transaction information only used for Safe multisig transctions.
        0,
        0,
        0,
        address(0),
        payable(0),
        "",
        msg.sender
      );
    }

    (success, returnData) = IAvatar(target).execTransactionFromModuleReturnData(
      to,
      value,
      data,
      operation
    );

    if (currentGuard != address(0)) {
      IGuard(currentGuard).checkAfterExecution(bytes32(0), success);
    }
  }
}

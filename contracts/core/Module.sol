// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

import "../factory/FactoryFriendly.sol";
import "../interfaces/IAvatar.sol";

/// @title Module Interface - A contract that can pass messages to a Module Manager contract if enabled by that contract.
abstract contract Module is FactoryFriendly {
  /// @dev Address that will ultimately execute function calls.
  address public avatar;
  /// @dev Address that this module will pass transactions to.
  address public target;

  /// @dev Emitted each time the avatar is set.
  event AvatarSet(address indexed previousAvatar, address indexed newAvatar);
  /// @dev Emitted each time the Target is set.
  event TargetSet(address indexed previousTarget, address indexed newTarget);

  /// @dev Sets the avatar to a new avatar (`newAvatar`).
  /// @notice Can only be called by the current owner.
  function setAvatar(address _avatar) public onlyOwner {
    address previousAvatar = avatar;
    avatar = _avatar;
    emit AvatarSet(previousAvatar, _avatar);
  }

  /// @dev Sets the target to a new target (`newTarget`).
  /// @notice Can only be called by the current owner.
  function setTarget(address _target) public onlyOwner {
    address previousTarget = target;
    target = _target;
    emit TargetSet(previousTarget, _target);
  }

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
  ) internal virtual returns (bool success) {
    return
      IAvatar(target).execTransactionFromModule(to, value, data, operation);
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
  ) internal virtual returns (bool success, bytes memory returnData) {
    return
      IAvatar(target).execTransactionFromModuleReturnData(
        to,
        value,
        data,
        operation
      );
  }
}

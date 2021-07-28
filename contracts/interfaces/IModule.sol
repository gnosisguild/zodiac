// SPDX-License-Identifier: LGPL-3.0-only

/// @title Module Interface - A contract that can pass messages to a Module Manager contract if enabled by that contract.
pragma solidity >=0.7.0 <0.9.0;

interface IModule {
    /// @dev Emitted each time the owner is set.
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /// @dev Emitted each time the executor is set.
    event ExecutorSet(
        address indexed previousExecutor,
        address indexed newExecutor
    );

    /// @dev Returns the address of the owner.
    /// @notice Can only be called by the current owner.
    function owner() external returns (address) {}

    /// @dev Leaves the contract without an Owner, disabling any functions only accessable to the owner.
    function renounceOwnership() external {}

    /// @dev Transfers ownership of the contract to a new account (`newOwner`).
    /// @notice Can only be called by the current owner.
    function transferOwnership(address newOwner) external {}

    /// @dev Returns the address of the executor.
    function executor() external returns (address) {}

    /// @dev Sets the executor to a new account (`newExecutor`).
    /// @notice Can only be called by the current owner.
    function setExecutor(address newExecutor) external {}
}

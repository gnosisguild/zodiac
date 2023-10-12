// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.0 <0.9.0;

/// @title ExecutionTracker - A contract that keeps track of executed and invalidated hashes
contract ExecutionTracker {
    error HashAlreadyExecuted(bytes32);
    error HashInvalidated(bytes32);

    mapping(address => mapping(bytes32 => bool)) public executed;
    mapping(address => mapping(bytes32 => bool)) public invalidated;

    function invalidate(bytes32 hash) external {
        invalidated[msg.sender][hash] = true;
    }
}

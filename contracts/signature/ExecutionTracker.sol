// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.0 <0.9.0;

/// @title ExecutionTracker - A contract that keeps track of executed and invalidated hashes
contract ExecutionTracker {
    error HashAlreadyConsumed(bytes32);

    event HashExecuted(bytes32);
    event HashInvalidated(bytes32);

    mapping(address => mapping(bytes32 => bool)) public consumed;

    function invalidate(bytes32 hash) external {
        consumed[msg.sender][hash] = true;
        emit HashInvalidated(hash);
    }
}

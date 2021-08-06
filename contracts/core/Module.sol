// SPDX-License-Identifier: LGPL-3.0-only

/// @title Module Interface - A contract that can pass messages to a Module Manager contract if enabled by that contract.
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IExecutor.sol";

abstract contract Module is Ownable {
    /// @dev Emitted each time the executor is set.
    event ExecutorSet(
        address indexed previousExecutor,
        address indexed newExecutor
    );

    /// @dev Address that this module will pass transactions to.
    address public executor;

    /// @dev Sets the executor to a new account (`newExecutor`).
    /// @notice Can only be called by the current owner.
    function setExecutor(address _executor) public onlyOwner {
        executor = _executor;
    }

    /// @dev
    function exec(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation
    ) internal returns (bool success) {
        success = IExecutor(executor).execTransactionFromModule(
            to,
            value,
            data,
            operation
        );
    }

    /// @dev
    function execAndReturnData(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation
    ) internal returns (bool success, bytes memory returnData) {
        return
            IExecutor(executor).execTransactionFromModuleReturnData(
                to,
                value,
                data,
                operation
            );
    }
}

// SPDX-License-Identifier: LGPL-3.0-only

/// @title Modifier Interface - A contract that sits between a Aodule and an Account and enforce some additional logic.
pragma solidity >=0.7.0 <0.9.0;

import "../core/Module.sol";

contract TestModule is Module {
    function executeTransaction(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation
    ) public returns (bool success) {
        success = exec(to, value, data, operation);
        return success;
    }

    function executeTransactionReturnData(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation
    ) public returns (bool success, bytes memory returnData) {
        (success, returnData) = execAndReturnData(to, value, data, operation);
        return (success, returnData);
    }

    function setUp(bytes calldata initializeParams) public override {}
}

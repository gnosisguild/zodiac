// SPDX-License-Identifier: LGPL-3.0-only

/// @title Modifier Interface - A contract that sits between a Module and an Avatar and enforce some additional logic.
pragma solidity >=0.7.0 <0.9.0;

import "../core/Modifier.sol";

contract TestModifier is Modifier {
    event executed(
        address to,
        uint256 value,
        bytes data,
        Enum.Operation operation,
        bool success
    );

    event executedAndReturnedData(
        address to,
        uint256 value,
        bytes data,
        Enum.Operation operation,
        bytes returnData,
        bool success
    );

    constructor(address _avatar, address _target) {
        bytes memory initParams = abi.encode(_avatar, _target);
        setUp(initParams);
    }

    /// @dev Passes a transaction to the modifier.
    /// @param to Destination address of module transaction
    /// @param value Ether value of module transaction
    /// @param data Data payload of module transaction
    /// @param operation Operation type of module transaction
    /// @notice Can only be called by enabled modules
    function execTransactionFromModule(
        address to,
        uint256 value,
        bytes calldata data,
        Enum.Operation operation
    ) public override moduleOnly returns (bool success) {
        success = exec(to, value, data, operation);
        emit executed(to, value, data, operation, success);
    }

    /// @dev Passes a transaction to the modifier, expects return data.
    /// @param to Destination address of module transaction
    /// @param value Ether value of module transaction
    /// @param data Data payload of module transaction
    /// @param operation Operation type of module transaction
    /// @notice Can only be called by enabled modules
    function execTransactionFromModuleReturnData(
        address to,
        uint256 value,
        bytes calldata data,
        Enum.Operation operation
    )
        public
        override
        moduleOnly
        returns (bool success, bytes memory returnData)
    {
        (success, returnData) = execAndReturnData(to, value, data, operation);
        emit executedAndReturnedData(
            to,
            value,
            data,
            operation,
            returnData,
            success
        );
    }

    function setUp(bytes memory initializeParams) public override initializer {
        __Ownable_init();
        (address _avatar, address _target) = abi.decode(
            initializeParams,
            (address, address)
        );
        avatar = _avatar;
        target = _target;
    }
}

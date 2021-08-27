// SPDX-License-Identifier: LGPL-3.0-only

/// @title Modifier Interface - A contract that sits between a Aodule and an Avatar and enforce some additional logic.
pragma solidity >=0.7.0 <0.9.0;

import "../guard/BaseGuard.sol";
import "../factory/FactoryFriendly.sol";
import "@gnosis.pm/safe-contracts/contracts/GnosisSafe.sol";
import "@gnosis.pm/safe-contracts/contracts/interfaces/IERC165.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract TestGuard is FactoryFriendly, OwnableUpgradeable, BaseGuard {
    function checkTransaction(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address payable refundReceiver,
        bytes memory signatures,
        address msgSender
    ) public override {}

    function checkAfterExecution(bytes32 txHash, bool success)
        public
        override
    {}

    function setUp(bytes calldata initializeParams) public override {}
}

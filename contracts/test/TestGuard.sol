// SPDX-License-Identifier: LGPL-3.0-only

/// @title Modifier Interface - A contract that sits between a Aodule and an Avatar and enforce some additional logic.
pragma solidity >=0.7.0 <0.9.0;

import "../guard/BaseGuard.sol";
import "../factory/FactoryFriendly.sol";
import "@gnosis.pm/safe-contracts/contracts/GnosisSafe.sol";
import "@gnosis.pm/safe-contracts/contracts/interfaces/IERC165.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../core/Module.sol";

contract TestGuard is FactoryFriendly, OwnableUpgradeable, BaseGuard {
    event preChecked(bool checked);
    event postChecked(bool checked);

    address public module;

    constructor(address _module) {
        __Ownable_init();
        module = _module;
    }

    function setModule(address _module) public {
        module = _module;
    }

    function checkTransaction(
        address to,
        uint256,
        bytes memory,
        Enum.Operation,
        uint256,
        uint256,
        uint256,
        address,
        address payable,
        bytes memory,
        address
    ) public override {
        require(to != address(0), "Cannot send to zero address");
        emit preChecked(true);
    }

    function checkAfterExecution(bytes32, bool) public override {
        require(
            Module(module).guard() == address(this),
            "Module cannot remove its own guard."
        );
        emit postChecked(true);
    }

    function setUp(bytes calldata initializeParams) public override {}
}

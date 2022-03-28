// SPDX-License-Identifier: LGPL-3.0-only

/// @title Modifier Interface - A contract that sits between a Module and an Avatar and enforce some additional logic.
pragma solidity >=0.7.0 <0.9.0;

import "../guard/BaseGuard.sol";
import "../factory/FactoryFriendly.sol";
import "@gnosis.pm/safe-contracts/contracts/GnosisSafe.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../core/Module.sol";

contract TestGuard is FactoryFriendly, BaseGuard {
    event PreChecked(bool checked);
    event PostChecked(bool checked);

    address public module;

    constructor(address _module) {
        bytes memory initParams = abi.encode(_module);
        setUp(initParams);
    }

    function setModule(address _module) public {
        module = _module;
    }

    function checkTransaction(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        uint256,
        uint256,
        uint256,
        address,
        address payable,
        bytes memory,
        address
    ) public override {
        require(to != address(0), "Cannot send to zero address");
        require(value != 1337, "Cannot send 1337");
        require(bytes3(data) != bytes3(0xbaddad), "Cannot call 0xbaddad");
        require(operation != Enum.Operation(1), "No delegate calls");
        emit PreChecked(true);
    }

    function checkAfterExecution(bytes32, bool) public override {
        require(
            Module(module).guard() == address(this),
            "Module cannot remove its own guard."
        );
        emit PostChecked(true);
    }

    function setUp(bytes memory initializeParams) public override initializer {
        address _module = abi.decode(initializeParams, (address));
        module = _module;
    }
}

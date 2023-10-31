// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import {BaseGuard} from "../guard/BaseGuard.sol";
import {Enum} from "@gnosis.pm/safe-contracts/contracts/common/Enum.sol";
import {FactoryFriendly} from "../factory/FactoryFriendly.sol";
import {GuardableModule} from "../core/GuardableModule.sol";

/* solhint-disable */

contract TestGuard is FactoryFriendly, BaseGuard {
  event PreChecked(address sender);
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
    address sender
  ) public override {
    require(to != address(0), "Cannot send to zero address");
    require(value != 1337, "Cannot send 1337");
    require(bytes3(data) != bytes3(0xbaddad), "Cannot call 0xbaddad");
    require(operation != Enum.Operation(1), "No delegate calls");
    emit PreChecked(sender);
  }

  function checkAfterExecution(bytes32, bool) public override {
    require(
      GuardableModule(module).guard() == address(this),
      "Module cannot remove its own guard."
    );
    emit PostChecked(true);
  }

  function setUp(bytes memory initializeParams) public override initializer {
    address _module = abi.decode(initializeParams, (address));
    module = _module;
  }
}

contract TestNonCompliantGuard is IERC165 {
  function supportsInterface(bytes4) external pure returns (bool) {
    return false;
  }

  function checkTransaction(
    address,
    uint256,
    bytes memory,
    Enum.Operation,
    uint256,
    uint256,
    uint256,
    address,
    address,
    bytes memory,
    address
  ) public {}

  function checkAfterExecution(bytes32, bool) public {}
}

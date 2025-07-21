// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.0;

contract Enum {
  enum Operation {
    Call,
    DelegateCall
  }
}

contract TestAvatar {
  mapping(address => address) public modules;
  address public constant SENTINEL_MODULES = address(0x1);

  constructor() {
    modules[SENTINEL_MODULES] = SENTINEL_MODULES;
  }

  receive() external payable {}

  function enableModule(address _module) external {
    require(
      _module != address(0) && _module != SENTINEL_MODULES,
      "Invalid module"
    );
    require(modules[_module] == address(0), "Module already enabled");

    modules[_module] = modules[SENTINEL_MODULES];
    modules[SENTINEL_MODULES] = _module;
  }

  function disableModule(address prevModule, address _module) external {
    require(
      _module != address(0) && _module != SENTINEL_MODULES,
      "Invalid module"
    );
    require(modules[prevModule] == _module, "Invalid prev module");

    modules[prevModule] = modules[_module];
    modules[_module] = address(0);
  }

  function isModuleEnabled(address _module) external view returns (bool) {
    return _module != SENTINEL_MODULES && modules[_module] != address(0);
  }

  function execTransactionFromModule(
    address payable to,
    uint256 value,
    bytes calldata data,
    uint8 operation
  ) external returns (bool success) {
    require(modules[msg.sender] != address(0), "Not authorized");
    if (operation == 1) (success, ) = to.delegatecall(data);
    else (success, ) = to.call{value: value}(data);
  }

  function execTransactionFromModuleReturnData(
    address payable to,
    uint256 value,
    bytes calldata data,
    uint8 operation
  ) external returns (bool success, bytes memory returnData) {
    require(modules[msg.sender] != address(0), "Not authorized");
    if (operation == 1) (success, ) = to.delegatecall(data);
    else (success, returnData) = to.call{value: value}(data);
  }

  function getModulesPaginated(
    address start,
    uint256 pageSize
  ) external view returns (address[] memory array, address next) {
    require(pageSize > 0, "Invalid page size");

    // Count modules
    uint256 moduleCount = 0;
    address current = modules[start];
    while (current != SENTINEL_MODULES && current != address(0)) {
      moduleCount++;
      current = modules[current];
    }

    // Create array
    array = new address[](moduleCount);
    current = modules[start];
    for (uint256 i = 0; i < moduleCount; i++) {
      array[i] = current;
      current = modules[current];
    }

    next = current;
  }
}

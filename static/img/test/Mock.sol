// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.6.0 <0.7.0;

// We import the contract so truffle compiles it, and we have the ABI
// available when working from truffle console.
import "@gnosis.pm/mock-contract/contracts/MockContract.sol";

contract Mock is MockContract {
    function exec(address payable to, uint256 value, bytes calldata data) external {
        bool success;
        bytes memory response;
        (success,response) = to.call{value: value}(data);
        if(!success) {
            assembly {
                revert(add(response, 0x20), mload(response))
            }
        }
    }
}

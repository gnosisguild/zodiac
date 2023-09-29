// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.0;

import "../signature/SignatureChecker.sol";

contract TestSignature is SignatureChecker {
    event Hello(address signer);

    event Goodbye(address signer);

    function hello() public {
        emit Hello(moduleTxSignedBy());
    }

    function goodbye(uint256, bytes memory) public {
        emit Goodbye(moduleTxSignedBy());
    }
}

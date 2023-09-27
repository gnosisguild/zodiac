// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.0;

import "../signature/Eip712Signature.sol";

contract TestSignature is Eip712Signature {
    event Hello(address signer);

    event Goodbye(address signer);

    function hello() public {
        emit Hello(eip712SignedBy());
    }

    function goodbye(uint256, bytes memory) public {
        emit Goodbye(eip712SignedBy());
    }
}

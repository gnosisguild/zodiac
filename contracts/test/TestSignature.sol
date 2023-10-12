// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.0;

import "../signature/SignatureChecker.sol";

contract ContractSignerYes is IERC1271 {
    function isValidSignature(
        bytes32,
        bytes memory
    ) external pure override returns (bytes4) {
        return 0x1626ba7e;
    }
}

contract ContractSignerNo is IERC1271 {
    function isValidSignature(
        bytes32,
        bytes memory
    ) external pure override returns (bytes4) {
        return 0x33333333;
    }
}

contract ContractSignerFaulty {}

contract ContractSignerReturnSize {
    function isValidSignature(
        bytes32,
        bytes memory
    ) external pure returns (bytes2) {
        return 0x1626;
    }
}

contract TestSignature is SignatureChecker {
    event Hello(address signer);

    event Goodbye(address signer);

    function hello() public {
        (, address signer) = moduleTxSignedBy();
        emit Hello(signer);
    }

    function goodbye(uint256, bytes memory) public {
        (, address signer) = moduleTxSignedBy();
        emit Goodbye(signer);
    }
}

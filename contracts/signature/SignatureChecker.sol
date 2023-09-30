// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.0 <0.9.0;

import "./IERC1271.sol";

/// @title SignatureChecker - A contract that extracts and inspects signatures appended to calldata.
/// @notice currently supporting eip-712 and eip-1271 signatures
abstract contract SignatureChecker {
    uint256 private nonce;

    /**
     * @dev Returns the current nonce value.
     */
    function moduleTxNonce() public view returns (uint256) {
        return nonce;
    }

    /**
     * @dev Increments nonce.
     */
    function moduleTxNonceBump() internal {
        nonce = nonce + 1;
    }

    /**
     * @dev When signature present in calldata, returns the address of the signer.
     */
    function moduleTxSignedBy() internal view returns (address signer) {
        bytes calldata data = msg.data;
        if (data.length >= 4 + 65) {
            (
                bytes32 r,
                bytes32 s,
                uint8 v,
                bool isContractSignature,
                uint256 start,
                uint256 end
            ) = _splitSignature(data);

            bytes32 hash = _moduleTxHash(data[:start], nonce);

            if (isContractSignature) {
                // When handling contract signatures the address
                // of the contract is encoded into r
                signer = address(uint160(uint256(r)));
                if (!isValidContractSignature(signer, hash, data[start:end])) {
                    signer = address(0);
                }
            } else {
                signer = ecrecover(hash, v, r, s);
            }
        }
    }

    /**
     * @dev Extracts signature from calldata, and divides it into `uint8 v, bytes32 r, bytes32 s`.
     * @param data current transaction calldata.
     */
    function _splitSignature(
        bytes calldata data
    )
        private
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v,
            bool isEIP1271,
            uint256 start,
            uint256 end
        )
    {
        uint256 length = data.length;
        r = bytes32(data[length - 65:]);
        s = bytes32(data[length - 33:]);
        v = uint8(bytes1(data[length - 1:]));
        isEIP1271 = v == 0 && (uint256(s) < (length - 65));
        start = isEIP1271 ? uint256(s) : length - 65;
        end = isEIP1271 ? length - 65 : length;
    }

    /**
     * @dev Hashes the EIP-712 data structure that will be signed by owner.
     * @param data The data for the transaction.
     * @param _nonce The nonce value.
     * @return the bytes32 hash to be signed by owners.
     */
    function _moduleTxHash(
        bytes calldata data,
        uint256 _nonce
    ) private view returns (bytes32) {
        bytes32 domainSeparator = keccak256(
            abi.encode(DOMAIN_SEPARATOR_TYPEHASH, block.chainid, this)
        );
        bytes memory moduleTxData = abi.encodePacked(
            bytes1(0x19),
            bytes1(0x01),
            domainSeparator,
            keccak256(abi.encode(MODULE_TX_TYPEHASH, keccak256(data), _nonce))
        );
        return keccak256(moduleTxData);
    }

    function isValidContractSignature(
        address signer,
        bytes32 hash,
        bytes calldata signature
    ) internal view returns (bool result) {
        uint256 size;
        assembly {
            size := extcodesize(signer)
        }
        if (size == 0) {
            return false;
        }

        (bool success, bytes memory returnData) = signer.staticcall(
            abi.encodeWithSelector(
                IERC1271.isValidSignature.selector,
                hash,
                signature
            )
        );

        return success == true && bytes4(returnData) == EIP1271_MAGIC_VALUE;
    }

    // keccak256(
    //     "EIP712Domain(uint256 chainId,address verifyingContract)"
    // );
    bytes32 private constant DOMAIN_SEPARATOR_TYPEHASH =
        0x47e79534a245952e8b16893a336b85a3d9ea9fa8c573f3d803afb92a79469218;

    // keccak256(
    //     "ModuleTx(bytes data,uint256 nonce)"
    // );
    bytes32 private constant MODULE_TX_TYPEHASH =
        0xd6c6b5df57eef4e79cab990a377d29dc4c5bbb016a6293120d53f49c54144227;

    // bytes4(keccak256("isValidSignature(bytes32,bytes)")
    bytes4 private constant EIP1271_MAGIC_VALUE = 0x1626ba7e;
}

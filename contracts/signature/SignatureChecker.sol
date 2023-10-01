// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.0 <0.9.0;

import "./IERC1271.sol";

/// @title SignatureChecker - A contract that extracts and inspects signatures appended to calldata.
/// @notice currently supports eip-712 and eip-1271
abstract contract SignatureChecker {
    uint256 private nonce;

    /**
     * @notice Returns the current nonce value.
     */
    function moduleTxNonce() public view returns (uint256) {
        return nonce;
    }

    /**
     * @notice Increments nonce.
     */
    function moduleTxNonceBump() internal {
        nonce = nonce + 1;
    }

    /**
     * @notice Searches for a valid signature, and returns address of signer.
     * @dev When signature not found or not valid, Zero address is returned
     * @return the address of the signer.
     */
    function moduleTxSignedBy() internal view returns (address) {
        bytes calldata data = msg.data;

        /*
         * The overarching idea is to provide transparent checking to
         * modules using `onlyModule`
         *
         * Since it's a generic mechanism we don't have a definitive way to
         * know if the trailling bytes are a signature. We just slice those
         * bytes and recover a signature
         *
         * Hence, we require the calldata to be at least as long as a function
         * selector plus a signature - 4 + 65. Anything than that is guaranteed
         * to not contain a signature
         */
        if (data.length < 4 + 65) {
            return address(0);
        }

        (
            bytes32 r,
            bytes32 s,
            uint8 v,
            bool isContractSignature,
            uint256 start
        ) = _splitSignature(data);

        bytes32 txHash = moduleTxHash(data[:start], nonce);

        if (isContractSignature) {
            // When handling contract signatures the address
            // of the contract is encoded into r
            address signer = address(uint160(uint256(r)));
            return
                _isValidContractSignature(
                    signer,
                    txHash,
                    data[start:data.length - 65]
                )
                    ? signer
                    : address(0);
        } else {
            return ecrecover(txHash, v, r, s);
        }
    }

    /**
     * @dev Hashes the EIP-712 data structure that will be signed.
     * @param data The current transaction's calldata.
     * @param _nonce The nonce value.
     * @return The 32-byte hash that is to be signed.
     */
    function moduleTxHash(
        bytes calldata data,
        uint256 _nonce
    ) public view returns (bytes32) {
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

    /**
     * @dev Extracts signature from calldata, and divides it into `uint8 v, bytes32 r, bytes32 s`.
     * @param data The current transaction's calldata.
     */
    function _splitSignature(
        bytes calldata data
    )
        private
        pure
        returns (bytes32 r, bytes32 s, uint8 v, bool isEIP1271, uint256 start)
    {
        /*
         * When handling contract signatures:
         *  v - is zero
         *  r - contains the signer
         *  s - contains the offset within calldata where the signer specific
         *      signature is located
         *
         *  We detect contract signatures by the following three conditions:
         *  1- v is zero
         *  2- s points within te buffer
         *  3- the position pointed by S has non zero length
         */

        uint256 length = data.length;
        r = bytes32(data[length - 65:]);
        s = bytes32(data[length - 33:]);
        v = uint8(bytes1(data[length - 1:]));
        isEIP1271 = v == 0 && (uint256(s) < (length - 65));
        start = isEIP1271 ? uint256(s) : length - 65;
    }

    /**
     * @dev Calls the signer contract, and validates the provided signature.
     * @param signer The address of the signer.
     * @param txHash The hash of the message that was signed.
     * @param signature The signature to validate.
     * @return result indicates whether the signature is valid.
     */
    function _isValidContractSignature(
        address signer,
        bytes32 txHash,
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
                txHash,
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

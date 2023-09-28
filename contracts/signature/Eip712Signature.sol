// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.0 <0.9.0;

/// @title EIP712Signature - A contract that extracts and inspects EIP-712 signatures appended to calldata.

abstract contract EIP712Signature {
    uint256 private nonce;

    /**
     * @dev Returns the current nonce value.
     */
    function eip712Nonce() public view returns (uint256) {
        return nonce;
    }

    /**
     * @dev Increments nonce.
     */
    function eip712BumpNonce() internal {
        nonce = nonce + 1;
    }

    /**
     * @dev When signature present, returns the signer address.
     */
    function eip712SignedBy() internal returns (address signer) {
        if (msg.data.length >= 4 + 65) {
            (
                bytes calldata dataTrimmed,
                uint8 v,
                bytes32 r,
                bytes32 s
            ) = _splitSignature(msg.data);

            bytes32 txHash = _transactionHash(dataTrimmed, nonce);

            signer = ecrecover(txHash, v, r, s);
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
        returns (bytes calldata dataTrimmed, uint8 v, bytes32 r, bytes32 s)
    {
        uint256 length = data.length;
        dataTrimmed = data[0:length - 65];
        r = bytes32(data[length - 65:]);
        s = bytes32(data[length - 33:]);
        v = uint8(bytes1(data[length - 1:]));
    }

    /**
     * @dev Hashes the EIP-712 data structure that will be signed by owner.
     * @param data The data for the transaction.
     * @param _nonce The nonce value.
     * @return the bytes32 hash to be signed by owners.
     */
    function _transactionHash(
        bytes calldata data,
        uint256 _nonce
    ) private view returns (bytes32) {
        bytes32 domainSeparator = keccak256(
            abi.encode(DOMAIN_SEPARATOR_TYPEHASH, block.chainid, this)
        );
        return
            keccak256(
                abi.encodePacked(
                    bytes1(0x19),
                    bytes1(0x01),
                    domainSeparator,
                    keccak256(
                        abi.encode(MODULE_TX_TYPEHASH, keccak256(data), _nonce)
                    )
                )
            );
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
}

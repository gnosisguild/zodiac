// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.0 <0.9.0;

abstract contract Eip712Signature {
    uint256 private nonce;

    function eip712Nonce() internal returns (uint256 signed) {
        return nonce;
    }

    function eip712Increment() internal {
        nonce = nonce + 1;
    }

    function eip712SignedBy() internal returns (address signer) {
        if (msg.data.length >= 4 + 65) {
            (
                bytes calldata dataTrimmed,
                uint8 v,
                bytes32 r,
                bytes32 s
            ) = signatureSplit(msg.data);

            bytes32 txHash = transactionHash(msg.value, dataTrimmed, nonce);

            signer = ecrecover(txHash, v, r, s);
        }
    }

    function signatureSplit(
        bytes calldata data
    )
        internal
        pure
        returns (bytes calldata dataTrimmed, uint8 v, bytes32 r, bytes32 s)
    {
        uint256 length = data.length;
        dataTrimmed = data[0:data.length - 65];
        r = bytes32(data[length - 65:]);
        s = bytes32(data[length - 33:]);
        v = uint8(bytes1(data[length - 1:]));
    }

    // keccak256(
    //     "EIP712Domain(uint256 chainId,address verifyingContract)"
    // );
    bytes32 private constant DOMAIN_SEPARATOR_TYPEHASH =
        0x47e79534a245952e8b16893a336b85a3d9ea9fa8c573f3d803afb92a79469218;

    // keccak256(
    //     "Transaction(uint256 value,bytes data,uint256 nonce)"
    // );
    bytes32 private constant TRANSACTION_TYPEHASH =
        0x04c518a746e9715fde6a6d3ebdf678ea51c6d591b95e35d73b7e312afa44dd71;

    function transactionHash(
        uint256 value,
        bytes calldata data,
        uint256 _nonce
    ) private view returns (bytes32) {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }

        bytes32 domainSeparator = keccak256(
            abi.encode(DOMAIN_SEPARATOR_TYPEHASH, chainId, this)
        );
        return
            keccak256(
                abi.encodePacked(
                    bytes1(0x19),
                    bytes1(0x01),
                    domainSeparator,
                    keccak256(
                        abi.encode(
                            TRANSACTION_TYPEHASH,
                            value,
                            keccak256(data),
                            _nonce
                        )
                    )
                )
            );
    }
}

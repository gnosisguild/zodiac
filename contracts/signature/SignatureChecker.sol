// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.0 <0.9.0;

import {IERC1271} from "./IERC1271.sol";

/// @title SignatureChecker - A contract that retrieves and validates signatures appended to transaction calldata.
/// @dev currently supports eip-712 and eip-1271 signatures
abstract contract SignatureChecker {
  /**
   * @notice Searches for a signature, validates it, and returns the signer's address.
   * @dev When signature not found or invalid, zero address is returned
   * @return The address of the signer.
   */
  function moduleTxSignedBy() internal view returns (bytes32, address) {
    bytes calldata data = msg.data;

    /*
     * The idea is to extend `onlyModule` and provide signature checking
     * without code changes to inheriting contracts (Modifiers).
     *
     * Since it's a generic mechanism, there is no way to conclusively
     * identify the trailing bytes as a signature. We simply slice those
     * and recover signer.
     *
     * As a result, we impose a minimum calldata length equal to a function
     * selector plus salt, plus a signature (i.e., 4 + 32 + 65 bytes), any
     * shorter and calldata it guaranteed to not contain a signature.
     */
    if (data.length < 4 + 32 + 65) {
      return (bytes32(0), address(0));
    }

    (uint8 v, bytes32 r, bytes32 s) = _splitSignature(data);

    uint256 end = data.length - (32 + 65);
    bytes32 salt = bytes32(data[end:]);

    /*
     * When handling contract signatures:
     *  v - is zero
     *  r - contains the signer
     *  s - contains the offset within calldata where the signer specific
     *      signature is located
     *
     * We detect contract signatures by checking:
     *  1- `v` is zero
     *  2- `s` points within the buffer, is after selector, is before
     *      salt and delimits a non-zero length buffer
     */
    if (v == 0) {
      uint256 start = uint256(s);
      if (start < 4 || start > end) {
        return (bytes32(0), address(0));
      }
      address signer = address(uint160(uint256(r)));

      bytes32 hash = moduleTxHash(data[:start], salt);
      return
        _isValidContractSignature(signer, hash, data[start:end])
          ? (hash, signer)
          : (bytes32(0), address(0));
    } else {
      bytes32 hash = moduleTxHash(data[:end], salt);
      return (hash, ecrecover(hash, v, r, s));
    }
  }

  /**
   * @notice Hashes the transaction EIP-712 data structure.
   * @dev The produced hash is intended to be signed.
   * @param data The current transaction's calldata.
   * @param salt The salt value.
   * @return The 32-byte hash that is to be signed.
   */
  function moduleTxHash(
    bytes calldata data,
    bytes32 salt
  ) public view returns (bytes32) {
    bytes32 domainSeparator = keccak256(
      abi.encode(DOMAIN_SEPARATOR_TYPEHASH, block.chainid, this)
    );
    bytes memory moduleTxData = abi.encodePacked(
      bytes1(0x19),
      bytes1(0x01),
      domainSeparator,
      keccak256(abi.encode(MODULE_TX_TYPEHASH, keccak256(data), salt))
    );
    return keccak256(moduleTxData);
  }

  /**
   * @dev Extracts signature from calldata, and divides it into `uint8 v, bytes32 r, bytes32 s`.
   * @param data The current transaction's calldata.
   * @return v The ECDSA v value
   * @return r The ECDSA r value
   * @return s The ECDSA s value
   */
  function _splitSignature(
    bytes calldata data
  ) private pure returns (uint8 v, bytes32 r, bytes32 s) {
    v = uint8(bytes1(data[data.length - 1:]));
    r = bytes32(data[data.length - 65:]);
    s = bytes32(data[data.length - 33:]);
  }

  /**
   * @dev Calls the signer contract, and validates the contract signature.
   * @param signer The address of the signer contract.
   * @param hash Hash of the data signed
   * @param signature The contract signature.
   * @return result Indicates whether the signature is valid.
   */
  function _isValidContractSignature(
    address signer,
    bytes32 hash,
    bytes calldata signature
  ) internal view returns (bool result) {
    uint256 size;
    // eslint-disable-line no-inline-assembly
    assembly {
      size := extcodesize(signer)
    }
    if (size == 0) {
      return false;
    }

    (, bytes memory returnData) = signer.staticcall(
      abi.encodeWithSelector(
        IERC1271.isValidSignature.selector,
        hash,
        signature
      )
    );

    return bytes4(returnData) == EIP1271_MAGIC_VALUE;
  }

  // keccak256(
  //     "EIP712Domain(uint256 chainId,address verifyingContract)"
  // );
  bytes32 private constant DOMAIN_SEPARATOR_TYPEHASH =
    0x47e79534a245952e8b16893a336b85a3d9ea9fa8c573f3d803afb92a79469218;

  // keccak256(
  //     "ModuleTx(bytes data,bytes32 salt)"
  // );
  bytes32 private constant MODULE_TX_TYPEHASH =
    0x2939aeeda3ca260200c9f7b436b19e13207547ccc65cfedc857751c5ea6d91d4;

  // bytes4(keccak256(
  //     "isValidSignature(bytes32,bytes)"
  // ));
  bytes4 private constant EIP1271_MAGIC_VALUE = 0x1626ba7e;
}

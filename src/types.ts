/**
 * Artifacts written for a single asset (the main contract or a linked library)
 * under `mastercopies/<module>/<version>/<asset>/`. Each field maps to one file:
 * `abi.json`, `sourcecode.json`, `bytecode.json`.
 */

/** Contents of `sourcecode.json`. */
export interface SourceCodeFile {
  contractName: string;
  sourceName: string;
  compilerVersion: string;
  /** abi-encoded constructor arguments (hex, no leading 0x). */
  constructorArguments?: string;
  /** Solidity standard-JSON compiler input (verified source + settings). */
  input: any;
}

/** Contents of `bytecode.json` — reproducible factory deployment metadata. */
export interface BytecodeFile {
  /** CREATE2 address. Reproduces on every chain from factory + salt + creationBytecode. */
  address: string;
  /** CREATE2 singleton factory the creation bytecode was relayed through. */
  factory: string;
  /** Salt recovered from the singleton-factory deployment transaction. */
  salt: string;
  /**
   * Creation bytecode: the exact init code (creation code + abi-encoded
   * constructor args, with any libraries linked). Relay this, with the same
   * factory + salt, to redeploy at `address` on any other network.
   */
  creationBytecode: string;
  /**
   * Deployed (runtime) bytecode stored at `address` (`eth_getCode`). Not used
   * to deploy — it's the on-chain identity, for comparison/verification.
   */
  bytecode: string;
}

/** A single extracted asset: one folder, up to three files. */
export interface Asset {
  /** Folder name: the main contract name or a linked-library name. */
  name: string;
  abi: any;
  sourceCode: SourceCodeFile;
  /**
   * Absent on a partial extraction: the ABI and source were verified but the
   * deployment couldn't be recovered from a known singleton factory. Such
   * assets ship `abi.json` and `sourcecode.json` only.
   */
  bytecode?: BytecodeFile;
}

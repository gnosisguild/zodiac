import { BigNumberish } from "ethers";

export default function typedDataForTransaction(
  {
    contract,
    chainId,
    salt,
  }: {
    contract: string;
    chainId: BigNumberish;
    salt: string;
  },
  data: string
) {
  const domain = { verifyingContract: contract, chainId };
  const types = {
    ModuleTx: [
      { type: "bytes", name: "data" },
      { type: "bytes32", name: "salt" },
    ],
  };
  const message = {
    data,
    salt,
  };

  return { domain, types, message };
}

import { BigNumberish } from "ethers";

export default function typedDataForTransaction(
  {
    contract,
    chainId,
    nonce,
  }: {
    contract: string;
    chainId: BigNumberish;
    nonce: BigNumberish;
  },
  data: string
) {
  const domain = { verifyingContract: contract, chainId };
  const types = {
    ModuleTx: [
      { type: "bytes", name: "data" },
      { type: "uint256", name: "nonce" },
    ],
  };
  const message = {
    data,
    nonce,
  };

  return { domain, types, message };
}

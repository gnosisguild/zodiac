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
  { value, data }: { value: BigNumberish; data: string }
) {
  const domain = { verifyingContract: contract, chainId };
  const types = {
    Transaction: [
      { type: "uint256", name: "value" },
      { type: "bytes", name: "data" },
      { type: "uint256", name: "nonce" },
    ],
  };
  const message = {
    value,
    data,
    nonce,
  };

  return { domain, types, message };
}

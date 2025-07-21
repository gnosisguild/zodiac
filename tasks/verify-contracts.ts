import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// Contract addresses deployed on Flare network
const CONTRACT_ADDRESSES = {
  realityETH: "0x4e35DA39Fa5893a70A40Ce964F993d891E607cC0",
  realityERC20: "0x7276813b21623d89BA8984B225d5792943DD7dbF",
  bridge: "0x03B5eBD2CB2e3339E93774A1Eb7c8634B8C393A9",
  delay: "0xd54895B1121A2eE3f37b502F507631FA1331BED6",
  exit: "0x3ed380a282aDfA3460da28560ebEB2F6D967C9f5",
  exitERC721: "0xE0eCE32Eb4BE4E9224dcec6a4FcB335c1fe05CDe",
  circulatingSupplyERC20: "0x5Ed57C291a184cc244F5c9B5E9F11a8DD08BBd12",
  circulatingSupplyERC721: "0xBD34D00dC0ae37C687F784A11FA6a0F2c5726Ba3",
  scopeGuard: "0xeF27fcd3965a866b22Fb2d7C689De9AB7e611f1F",
  factory: "0x000000000000aDdB49795b0f9bA5BC298cDda236",
  roles: "0xD8DfC1d938D7D163C5231688341e9635E9011889",
  ozGovernor: "0xe28c39FAC73cce2B33C4C003049e2F3AE43f77d5",
  erc20Votes: "0x752c61de75ADA0F8a33e048d2F773f51172f033e",
  erc721Votes: "0xeFf38b2eBB95ACBA09761246045743f40e762568",
  multisendEncoder: "0xb67EDe523171325345780fA3016b7F5221293df0",
  permissions: "0x33D1C5A5B6a7f3885c7467e829aaa21698937597",
  connext: "0x7dE07b9De0bf0FABf31A188DE1527034b2aF36dB",
};

export const verifyAllContracts = async (
  _: unknown,
  hre: HardhatRuntimeEnvironment
) => {
  console.log(
    "🔍 Starting verification of all contracts on Flare network...\n"
  );

  for (const [contractName, address] of Object.entries(CONTRACT_ADDRESSES)) {
    try {
      console.log(`📋 Verifying ${contractName} at ${address}...`);

      // Run the verify task for each contract
      await hre.run("verify:verify", {
        address: address,
        network: "flare",
      });

      console.log(`✅ Successfully verified ${contractName}\n`);
    } catch (error: any) {
      if (error.message.includes("Already Verified")) {
        console.log(`ℹ️  ${contractName} is already verified\n`);
      } else {
        console.log(`❌ Failed to verify ${contractName}: ${error.message}\n`);
      }
    }
  }

  console.log("🎉 Verification process completed!");
};

export const verifySingleContract = async (
  args: { contract: string },
  hre: HardhatRuntimeEnvironment
) => {
  const { contract } = args;
  const address =
    CONTRACT_ADDRESSES[contract as keyof typeof CONTRACT_ADDRESSES];

  if (!address) {
    console.error(
      `❌ Contract "${contract}" not found in the list of deployed contracts`
    );
    console.log(
      "Available contracts:",
      Object.keys(CONTRACT_ADDRESSES).join(", ")
    );
    return;
  }

  try {
    console.log(`📋 Verifying ${contract} at ${address}...`);

    await hre.run("verify:verify", {
      address: address,
      network: "flare",
    });

    console.log(`✅ Successfully verified ${contract}`);
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log(`ℹ️  ${contract} is already verified`);
    } else {
      console.log(`❌ Failed to verify ${contract}: ${error.message}`);
    }
  }
};

task("verify-all", "Verify all deployed contracts on Flare network").setAction(
  verifyAllContracts
);

task("verify-contract", "Verify a specific contract on Flare network")
  .addParam("contract", "Name of the contract to verify")
  .setAction(verifySingleContract);

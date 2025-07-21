const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🔍 Checking Safe connection and ownership...\n");

  // Get environment variables
  const SAFE_ADDRESS = process.env.SAFE_ADDRESS;
  const SAFE_OWNER_PRIVATE_KEY = process.env.SAFE_OWNER_PRIVATE_KEY;

  console.log("📋 Environment Variables:");
  console.log(`- SAFE_ADDRESS: ${SAFE_ADDRESS}`);
  console.log(
    `- SAFE_OWNER_PRIVATE_KEY: ${
      SAFE_OWNER_PRIVATE_KEY
        ? SAFE_OWNER_PRIVATE_KEY.substring(0, 10) + "..."
        : "NOT SET"
    }`
  );
  console.log("");

  // Check network connection
  console.log("🌐 Network Information:");
  const network = await ethers.provider.getNetwork();
  console.log(`- Network: ${network.name}`);
  console.log(`- Chain ID: ${network.chainId}`);
  console.log(`- Expected Chain ID for Flare: 14`);
  console.log("");

  // Check signer
  console.log("👤 Signer Information:");
  const signer = new ethers.Wallet(SAFE_OWNER_PRIVATE_KEY, ethers.provider);
  console.log(`- Signer Address: ${signer.address}`);

  const balance = await signer.getBalance();
  console.log(`- Balance: ${ethers.utils.formatEther(balance)} FLR`);
  console.log("");

  // Check Safe contract
  console.log("🏦 Safe Contract Information:");
  const SafeABI = [
    "function getOwners() external view returns (address[] memory)",
    "function getThreshold() external view returns (uint256)",
    "function isOwner(address owner) external view returns (bool)",
    "function isModuleEnabled(address module) external view returns (bool)",
    "function getModulesPaginated(address start, uint256 pageSize) external view returns (address[] memory array, address next)",
  ];

  try {
    const safeContract = new ethers.Contract(SAFE_ADDRESS, SafeABI, signer);

    // Get Safe owners
    const owners = await safeContract.getOwners();
    console.log(`- Safe Owners: ${owners.join(", ")}`);

    // Get threshold
    const threshold = await safeContract.getThreshold();
    console.log(`- Threshold: ${threshold}`);

    // Check if signer is owner
    const isOwner = await safeContract.isOwner(signer.address);
    console.log(`- Is Signer Owner: ${isOwner}`);

    // Get current modules
    const [modules, next] = await safeContract.getModulesPaginated(
      ethers.constants.AddressZero,
      10
    );
    console.log(`- Current Modules: ${modules.join(", ")}`);
    console.log(`- Next Module Pointer: ${next}`);

    console.log("");
    console.log("✅ Safe contract is accessible!");

    if (!isOwner) {
      console.log("❌ WARNING: The signer is NOT an owner of the Safe!");
      console.log("   This will cause the tests to fail.");
      console.log("   Please check:");
      console.log("   1. The SAFE_ADDRESS is correct");
      console.log("   2. The SAFE_OWNER_PRIVATE_KEY corresponds to an owner");
    } else {
      console.log("✅ The signer IS an owner of the Safe!");
    }
  } catch (error) {
    console.log("❌ Error accessing Safe contract:");
    console.log(`   ${error.message}`);
    console.log("");
    console.log("Possible issues:");
    console.log("1. SAFE_ADDRESS is incorrect");
    console.log("2. Safe contract doesn't exist at that address");
    console.log("3. Network connection issues");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

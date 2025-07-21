const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing TestAvatar functionality...\n");

  // Deploy TestAvatar
  const TestAvatar = await ethers.getContractFactory("TestAvatar");
  const avatar = await TestAvatar.deploy();
  await avatar.deployed();
  console.log(`TestAvatar deployed at: ${avatar.address}`);

  // Get a test address
  const [signer] = await ethers.getSigners();
  const testModuleAddress = signer.address;

  console.log(`\n📋 Test Details:`);
  console.log(`- Test module address: ${testModuleAddress}`);
  console.log(`- SENTINEL_MODULES: ${await avatar.SENTINEL_MODULES()}`);

  // Check initial state
  console.log(`\n🔍 Initial State:`);
  const initiallyEnabled = await avatar.isModuleEnabled(testModuleAddress);
  console.log(`- Module initially enabled: ${initiallyEnabled}`);

  // Enable module
  console.log(`\n✅ Enabling module...`);
  const tx = await avatar.enableModule(testModuleAddress);
  await tx.wait();
  console.log(`- Transaction hash: ${tx.hash}`);

  // Check if enabled
  console.log(`\n🔍 After Enabling:`);
  const enabled = await avatar.isModuleEnabled(testModuleAddress);
  console.log(`- Module enabled: ${enabled}`);

  // Check modules mapping
  const sentinelValue = await avatar.modules(await avatar.SENTINEL_MODULES());
  const moduleValue = await avatar.modules(testModuleAddress);
  console.log(`- modules[SENTINEL_MODULES]: ${sentinelValue}`);
  console.log(`- modules[${testModuleAddress}]: ${moduleValue}`);

  // Get modules paginated
  console.log(`\n📄 Modules Paginated:`);
  const [modules, next] = await avatar.getModulesPaginated(
    await avatar.SENTINEL_MODULES(),
    10
  );
  console.log(`- Modules: ${modules.join(", ")}`);
  console.log(`- Next: ${next}`);

  // Disable module
  console.log(`\n❌ Disabling module...`);
  const disableTx = await avatar.disableModule(
    await avatar.SENTINEL_MODULES(),
    testModuleAddress
  );
  await disableTx.wait();

  // Check if disabled
  console.log(`\n🔍 After Disabling:`);
  const disabled = await avatar.isModuleEnabled(testModuleAddress);
  console.log(`- Module enabled: ${disabled}`);

  console.log(`\n✅ Test completed!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

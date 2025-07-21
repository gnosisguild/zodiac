import { expect } from "chai";
import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

describe("Zodiac Roles Module Diagnostic Test", function () {
  let safeOwner: any;

  // Environment variables
  const safeAddress = process.env.SAFE_ADDRESS;
  const safeOwnerPrivateKey = process.env.SAFE_OWNER_PRIVATE_KEY;
  const flareRpcUrl = process.env.FLARE_RPC_URL;

  // Flare mainnet deployed addresses
  const FLARE_ADDRESSES = {
    roles: "0xD8DfC1d938D7D163C5231688341e9635E9011889", // Roles mastercopy deployed on Flare
    factory: "0x000000000000aDdB49795b0f9bA5BC298cDda236", // Factory deployed on Flare
  };

  before(async function () {
    // Validate environment variables
    if (!safeAddress || !safeOwnerPrivateKey || !flareRpcUrl) {
      console.log(
        "❌ Missing environment variables. Please check your .env file."
      );
      this.skip();
      return;
    }

    // Setup signer
    const provider = new ethers.providers.JsonRpcProvider(flareRpcUrl);
    safeOwner = new ethers.Wallet(safeOwnerPrivateKey, provider);
  });

  describe("Contract Address Verification", function () {
    it("should verify factory contract exists", async function () {
      console.log("🔍 Checking factory contract...");

      const code = await ethers.provider.getCode(FLARE_ADDRESSES.factory);
      console.log("Factory code length:", code.length);
      expect(code).to.not.equal("0x");
      console.log("✅ Factory contract exists");
    });

    it("should verify roles mastercopy exists", async function () {
      console.log("🔍 Checking roles mastercopy...");

      const code = await ethers.provider.getCode(FLARE_ADDRESSES.roles);
      console.log("Roles code length:", code.length);
      expect(code).to.not.equal("0x");
      console.log("✅ Roles mastercopy exists");
    });

    it("should test factory interface", async function () {
      console.log("🔍 Testing factory interface...");

      const factoryAbi = [
        "function deployModule(address masterCopy, bytes calldata initializer, uint256 saltNonce) external returns (address proxy)",
        "function calculateProxyAddress(address masterCopy, bytes calldata initializer, uint256 saltNonce) external view returns (address proxy)",
      ];

      const factory = new ethers.Contract(
        FLARE_ADDRESSES.factory,
        factoryAbi,
        safeOwner
      );

      // Test calculateProxyAddress function
      const initData = ethers.utils.defaultAbiCoder.encode(
        ["address", "address"],
        [safeAddress, safeAddress]
      );
      const saltNonce = ethers.utils.hexZeroPad(
        ethers.utils.hexlify(Date.now()),
        32
      );

      try {
        const expectedAddress = await factory.calculateProxyAddress(
          FLARE_ADDRESSES.roles,
          initData,
          saltNonce
        );
        console.log("✅ Factory calculateProxyAddress works");
        console.log("Expected proxy address:", expectedAddress);
      } catch (error: any) {
        console.log("❌ Factory calculateProxyAddress failed:", error.message);
        throw error;
      }
    });
  });

  describe("Safe Verification", function () {
    it("should verify Safe ownership", async function () {
      console.log("🔍 Verifying Safe ownership...");

      const safeAbi = [
        "function getOwners() external view returns (address[] memory)",
        "function getThreshold() external view returns (uint256)",
      ];

      const safeContract = new ethers.Contract(safeAddress, safeAbi, safeOwner);

      const owners = await safeContract.getOwners();
      const threshold = await safeContract.getThreshold();

      console.log("Safe owners:", owners);
      console.log("Safe threshold:", threshold);

      expect(owners).to.include(safeOwner.address);
      console.log("✅ Safe ownership verified");
    });

    it("should check Safe balance", async function () {
      console.log("🔍 Checking Safe balance...");

      const balance = await ethers.provider.getBalance(safeAddress);
      console.log("Safe balance:", ethers.utils.formatEther(balance), "FLR");

      const ownerBalance = await safeOwner.getBalance();
      console.log(
        "Owner balance:",
        ethers.utils.formatEther(ownerBalance),
        "FLR"
      );

      expect(ownerBalance).to.be.gt(0);
      console.log("✅ Owner has sufficient balance");
    });
  });

  describe("Factory Deployment Test", function () {
    it("should test factory deployment with minimal data", async function () {
      console.log("🔍 Testing factory deployment...");

      const factoryAbi = [
        "function deployModule(address masterCopy, bytes calldata initializer, uint256 saltNonce) external returns (address proxy)",
      ];

      const factory = new ethers.Contract(
        FLARE_ADDRESSES.factory,
        factoryAbi,
        safeOwner
      );

      // Try with minimal initialization data
      const minimalInitData = "0x"; // Empty initialization
      const saltNonce = ethers.utils.hexZeroPad(
        ethers.utils.hexlify(Date.now()),
        32
      );

      try {
        console.log("Attempting deployment with minimal data...");
        const deployTx = await factory.deployModule(
          FLARE_ADDRESSES.roles,
          minimalInitData,
          saltNonce
        );
        console.log("🚀 Deployment transaction hash:", deployTx.hash);
        const receipt = await deployTx.wait();
        console.log("✅ Deployment successful!");
        console.log("Receipt:", receipt);
      } catch (error: any) {
        console.log("❌ Deployment failed:", error.message);

        // Try to get more details about the error
        if (error.data) {
          console.log("Error data:", error.data);
        }
        if (error.transaction) {
          console.log("Transaction data:", error.transaction);
        }

        // Don't throw, just log the error for diagnosis
        console.log(
          "This helps us understand what's wrong with the deployment"
        );
      }
    });

    it("should test factory deployment with proper initialization", async function () {
      console.log(
        "🔍 Testing factory deployment with proper initialization..."
      );

      const factoryAbi = [
        "function deployModule(address masterCopy, bytes calldata initializer, uint256 saltNonce) external returns (address proxy)",
      ];

      const factory = new ethers.Contract(
        FLARE_ADDRESSES.factory,
        factoryAbi,
        safeOwner
      );

      // Try with proper initialization data
      const initData = ethers.utils.defaultAbiCoder.encode(
        ["address", "address"],
        [safeAddress, safeAddress]
      );
      const saltNonce = ethers.utils.hexZeroPad(
        ethers.utils.hexlify(Date.now() + 1),
        32
      );

      console.log("Initialization data:", initData);
      console.log("Salt nonce:", saltNonce);

      try {
        console.log("Attempting deployment with proper initialization...");
        const deployTx = await factory.deployModule(
          FLARE_ADDRESSES.roles,
          initData,
          saltNonce
        );
        console.log("🚀 Deployment transaction hash:", deployTx.hash);
        const receipt = await deployTx.wait();
        console.log("✅ Deployment successful!");

        // Look for the ModuleProxyCreation event
        const moduleProxyCreationEvent = receipt.events?.find(
          (event: any) => event.event === "ModuleProxyCreation"
        );

        if (moduleProxyCreationEvent) {
          console.log("✅ ModuleProxyCreation event found");
          console.log("Proxy address:", moduleProxyCreationEvent.args.proxy);
        } else {
          console.log("⚠️  ModuleProxyCreation event not found");
          console.log(
            "Available events:",
            receipt.events?.map((e: any) => e.event)
          );
        }
      } catch (error: any) {
        console.log("❌ Deployment failed:", error.message);

        // Try to get more details about the error
        if (error.data) {
          console.log("Error data:", error.data);
        }
        if (error.transaction) {
          console.log("Transaction data:", error.transaction);
        }

        console.log(
          "This helps us understand what's wrong with the deployment"
        );
      }
    });
  });

  describe("Diagnostic Summary", function () {
    it("should provide diagnostic summary", async function () {
      console.log("🎯 === DIAGNOSTIC SUMMARY ===");
      console.log("");
      console.log("🔍 CONTRACT VERIFICATION:");
      console.log(`   • Factory Address: ${FLARE_ADDRESSES.factory}`);
      console.log(`   • Roles Mastercopy: ${FLARE_ADDRESSES.roles}`);
      console.log(`   • Safe Address: ${safeAddress}`);
      console.log(`   • Owner Address: ${safeOwner.address}`);
      console.log("");
      console.log("📋 NEXT STEPS:");
      console.log("   • Review the diagnostic results above");
      console.log("   • Check if contracts are properly deployed");
      console.log("   • Verify initialization data format");
      console.log("   • Ensure proper permissions");
      console.log("");
      console.log("🔧 POSSIBLE ISSUES:");
      console.log("   • Factory contract not properly deployed");
      console.log("   • Roles mastercopy not compatible");
      console.log("   • Initialization data format incorrect");
      console.log("   • Permission issues");
      console.log("");
      console.log("🎉 DIAGNOSTIC COMPLETED!");
      console.log("================================================");
    });
  });
});

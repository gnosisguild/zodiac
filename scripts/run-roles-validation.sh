#!/bin/bash

# Zodiac Roles Module On-Chain Validation Script
# This script validates the Zodiac Roles module functionality on a real Gnosis Safe on Flare mainnet
# Uses Zodiac Roles SDK and Safe SDK Protocol Kit with already deployed contracts

set -e

echo "🔐 ========================================="
echo "🔐 ZODIAC ROLES MODULE ON-CHAIN VALIDATION"
echo "🔐 ========================================="
echo ""
echo "🌐 Network: Flare Mainnet (Chain ID: 14)"
echo "📋 Using deployed Zodiac contracts:"
echo "   - Roles Module: 0xD8DfC1d938D7D163C5231688341e9635E9011889"
echo "   - Factory: 0x000000000000aDdB49795b0f9bA5BC298cDda236"
echo ""
echo "🔧 SDKs used:"
echo "   - Safe SDK Protocol Kit (@safe-global/protocol-kit)"
echo "   - Zodiac Roles SDK (zodiac-roles-sdk)"
echo ""
echo "⚠️  WARNING: This test will execute REAL transactions on your Safe!"
echo "⚠️  WARNING: The Roles module will be enabled on your Safe!"
echo "⚠️  WARNING: This will modify your Safe's state permanently!"
echo ""
echo "📋 What this test will do:"
echo "   1. Enable the Roles module on your Safe using Safe SDK Protocol Kit"
echo "   2. Configure roles using Zodiac Roles SDK"
echo "   3. Assign permissions to roles"
echo "   4. Execute transactions through the module"
echo "   5. Validate all functionality on-chain"
echo ""
echo "💰 Gas costs:"
echo "   - Module enable: ~100,000 gas"
echo "   - Role configuration: ~200,000 gas"
echo "   - Transaction executions: ~50,000 gas each"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with the following variables:"
    echo "SAFE_ADDRESS=0xYourSafeAddress"
    echo "SAFE_OWNER_PRIVATE_KEY=0xYourPrivateKey"
    echo "FLARE_RPC_URL=https://flare-api-tracer.flare.network/ext/C/rpc?x-apikey=your-api-key"
    exit 1
fi

# Load environment variables
source .env

# Check required environment variables
if [ -z "$SAFE_ADDRESS" ] || [ -z "$SAFE_OWNER_PRIVATE_KEY" ] || [ -z "$FLARE_RPC_URL" ]; then
    echo "❌ Error: Missing required environment variables!"
    echo "Please check your .env file contains:"
    echo "SAFE_ADDRESS, SAFE_OWNER_PRIVATE_KEY, FLARE_RPC_URL"
    exit 1
fi

echo "✅ Environment variables loaded:"
echo "   Safe Address: ${SAFE_ADDRESS:0:10}...${SAFE_ADDRESS: -8}"
echo "   Safe Owner: ${SAFE_OWNER_PRIVATE_KEY:0:10}...${SAFE_OWNER_PRIVATE_KEY: -8}"
echo "   Flare RPC: ${FLARE_RPC_URL:0:50}..."
echo ""

# Ask for confirmation
echo "🤔 Do you want to proceed with the Roles module validation?"
echo "   This will execute real transactions on your Safe."
echo ""
read -p "Type 'YES' to continue: " confirmation

if [ "$confirmation" != "YES" ]; then
    echo "❌ Validation cancelled by user."
    exit 0
fi

echo ""
echo "🚀 Starting Zodiac Roles Module validation..."

# Compile contracts
echo "🔨 Compiling contracts..."
yarn build

# Run the validation test
echo "🧪 Running Roles module validation test..."
echo ""

yarn test:roles

echo ""
echo "✅ Roles module validation completed!"
echo ""
echo "📋 Summary:"
echo "   - Roles module enabled on your Safe using Safe SDK Protocol Kit"
echo "   - Roles configured using Zodiac Roles SDK"
echo "   - Transactions executed successfully through module"
echo "   - All functionality validated on-chain"
echo ""
echo "🎉 Your Safe is now validated for Zodiac Roles module functionality!"
echo ""
echo "💡 Next steps:"
echo "   - The Roles module is now enabled on your Safe"
echo "   - You can use it to manage roles and permissions"
echo "   - Consider running other Zodiac module validations"
echo ""

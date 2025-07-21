#!/bin/bash

# Zodiac Roles Module REAL Validation Script
# This script will execute REAL transactions on your Safe to validate the Zodiac Roles Module

set -e

echo "🚀 === ZODIAC ROLES MODULE REAL VALIDATION ==="
echo ""
echo "⚠️  WARNING: This script will execute REAL transactions on your Safe!"
echo "   • Deploy a Roles module proxy on Flare mainnet"
echo "   • Enable the module on your Safe"
echo "   • Configure roles and permissions"
echo "   • Execute test transactions through the module"
echo ""
echo "💰 This will cost FLR for gas fees"
echo "🔒 Your Safe will be modified with the new module"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "   Please create a .env file with your configuration:"
    echo "   SAFE_ADDRESS=your_safe_address"
    echo "   SAFE_OWNER_PRIVATE_KEY=your_private_key"
    echo "   FLARE_RPC_URL=your_flare_rpc_url"
    exit 1
fi

# Load environment variables
source .env

# Validate required environment variables
if [ -z "$SAFE_ADDRESS" ] || [ -z "$SAFE_OWNER_PRIVATE_KEY" ] || [ -z "$FLARE_RPC_URL" ]; then
    echo "❌ Error: Missing required environment variables!"
    echo "   Please check your .env file contains:"
    echo "   - SAFE_ADDRESS"
    echo "   - SAFE_OWNER_PRIVATE_KEY"
    echo "   - FLARE_RPC_URL"
    exit 1
fi

echo "✅ Configuration validated:"
echo "   - Safe Address: $SAFE_ADDRESS"
echo "   - Flare RPC: $FLARE_RPC_URL"
echo ""

# Ask for confirmation
read -p "🤔 Do you want to proceed with REAL validation? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Validation cancelled by user"
    exit 1
fi

echo ""
echo "🔨 Compiling contracts..."
yarn build

echo ""
echo "🧪 Running REAL Roles module validation..."
echo "   This will execute actual transactions on Flare mainnet"
echo ""

# Run the real validation test
npx hardhat test test/09_RealRolesValidation.spec.ts --network flare

echo ""
echo "🎉 REAL validation completed!"
echo ""
echo "📋 What happened:"
echo "   ✅ A Roles module proxy was deployed on Flare mainnet"
echo "   ✅ The module was enabled on your Safe"
echo "   ✅ Roles and permissions were configured"
echo "   ✅ Transaction execution was tested"
echo ""
echo "🔍 You can now check your Safe at:"
echo "   https://safe.palmeradao.xyz/transactions/history?safe=flare:$SAFE_ADDRESS"
echo ""
echo "💡 The module is now ready for use in your DAO!"

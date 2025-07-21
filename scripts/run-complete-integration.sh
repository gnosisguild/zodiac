#!/bin/bash

# Zodiac Roles Module Complete Integration Script
# This script will deploy, configure, and test the Zodiac Roles Module with real transactions

set -e

echo "🚀 === ZODIAC ROLES MODULE COMPLETE INTEGRATION ==="
echo ""
echo "⚠️  WARNING: This script will execute REAL transactions on your Safe!"
echo "   • Deploy a new Roles module proxy on Flare mainnet"
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
    echo "   Please create a .env file with the following variables:"
    echo "   SAFE_ADDRESS=your_safe_address"
    echo "   SAFE_OWNER_PRIVATE_KEY=your_private_key"
    echo "   FLARE_RPC_URL=your_flare_rpc_url"
    exit 1
fi

# Check if required environment variables are set
if [ -z "$SAFE_ADDRESS" ] || [ -z "$SAFE_OWNER_PRIVATE_KEY" ] || [ -z "$FLARE_RPC_URL" ]; then
    echo "❌ Error: Missing required environment variables!"
    echo "   Please set SAFE_ADDRESS, SAFE_OWNER_PRIVATE_KEY, and FLARE_RPC_URL"
    exit 1
fi

echo "✅ Environment variables validated"
echo ""

# Ask for confirmation
echo "🤔 Do you want to proceed with the complete integration?"
echo "   This will modify your Safe and execute real transactions."
echo ""
read -p "   Type 'YES' to continue: " confirmation

if [ "$confirmation" != "YES" ]; then
    echo "❌ Integration cancelled by user"
    exit 1
fi

echo ""
echo "🎯 Starting complete integration..."

# Run the complete integration test
echo "📋 Running complete integration test..."
npx hardhat test test/14_CompleteRolesIntegration.spec.ts --network flare

echo ""
echo "🎉 === INTEGRATION COMPLETED ==="
echo ""
echo "✅ Your Zodiac Roles Module is now fully integrated!"
echo ""
echo "📋 Next steps:"
echo "   1. Check your Safe interface for the new module"
echo "   2. Configure additional roles as needed"
echo "   3. Start using role-based access control"
echo ""
echo "🔗 Safe Interface: https://safe.palmeradao.xyz"
echo "📊 Transaction History: https://flare-explorer.flare.network"
echo ""

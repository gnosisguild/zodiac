#!/bin/bash

# Zodiac Roles Module REAL Safe Execution Script
# This script will execute REAL transactions on your Safe to deploy and configure the Zodiac Roles Module

set -e

echo "🚀 === ZODIAC ROLES MODULE REAL SAFE EXECUTION ==="
echo ""
echo "⚠️  WARNING: This script will execute REAL transactions on your Safe!"
echo "   • Deploy a new Roles module proxy on Flare mainnet"
echo "   • Enable the module on your Safe"
echo "   • Configure roles and permissions"
echo "   • Execute test transactions through the module"
echo ""
echo "💰 This will cost FLR for gas fees"
echo "🔒 Your Safe will be modified with the new module"
echo "📋 Transactions will appear in your Safe history"
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

# Load environment variables
source .env

# Check if required environment variables are set
if [ -z "$SAFE_ADDRESS" ] || [ -z "$SAFE_OWNER_PRIVATE_KEY" ] || [ -z "$FLARE_RPC_URL" ]; then
    echo "❌ Error: Missing required environment variables!"
    echo "   Please set SAFE_ADDRESS, SAFE_OWNER_PRIVATE_KEY, and FLARE_RPC_URL"
    exit 1
fi

echo "✅ Environment variables validated"
echo ""

# Display current configuration
echo "📋 Current Configuration:"
echo "   • Safe Address: $SAFE_ADDRESS"
echo "   • Owner Address: $(echo $SAFE_OWNER_PRIVATE_KEY | sed 's/0x//' | xargs -I {} node -e "const { ethers } = require('ethers'); console.log(new ethers.Wallet('0x{}').address)")"
echo "   • Network: Flare mainnet"
echo ""

# Ask for confirmation
echo "🤔 Do you want to proceed with REAL Safe execution?"
echo "   This will modify your Safe and execute real transactions."
echo "   You can verify the transactions at: https://safe.palmeradao.xyz/transactions/history?safe=flare:$SAFE_ADDRESS"
echo ""
read -p "   Type 'YES' to continue: " confirmation

if [ "$confirmation" != "YES" ]; then
    echo "❌ Execution cancelled by user"
    exit 1
fi

echo ""
echo "🎯 Starting real Safe execution..."

# Run the real execution test
echo "📋 Running real execution test..."
npx hardhat test test/15_RealSafeExecution.spec.ts --network flare

echo ""
echo "🎉 === REAL EXECUTION COMPLETED ==="
echo ""
echo "✅ Your Zodiac Roles Module is now fully integrated!"
echo ""
echo "📋 What happened:"
echo "   • Module proxy deployed on Flare mainnet"
echo "   • Module enabled on your Safe"
echo "   • Roles configured (ADMIN, EXECUTOR)"
echo "   • Test transactions executed"
echo ""
echo "🔗 Verify the results:"
echo "   • Safe Interface: https://safe.palmeradao.xyz"
echo "   • Transaction History: https://safe.palmeradao.xyz/transactions/history?safe=flare:$SAFE_ADDRESS"
echo "   • Flare Explorer: https://flare-explorer.flare.network"
echo ""
echo "💡 Next steps:"
echo "   1. Check your Safe interface for the new module"
echo "   2. Configure additional roles as needed"
echo "   3. Start using role-based access control"
echo ""

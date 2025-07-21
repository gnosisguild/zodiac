#!/bin/bash

# Script to run Zodiac tests on Flare mainnet
# Usage: ./scripts/run-flare-tests.sh

set -e

echo "🚀 Starting Zodiac tests on Flare mainnet..."

# Check required environment variables
if [ -z "$SAFE_ADDRESS" ]; then
    echo "❌ Error: SAFE_ADDRESS is not configured"
    echo "Please configure SAFE_ADDRESS with your Safe address on Flare mainnet"
    exit 1
fi

if [ -z "$SAFE_OWNER_PRIVATE_KEY" ]; then
    echo "❌ Error: SAFE_OWNER_PRIVATE_KEY is not configured"
    echo "Please configure SAFE_OWNER_PRIVATE_KEY with the private key of a Safe owner"
    exit 1
fi

# Optional variables with default values
export FLARE_RPC_URL=${FLARE_RPC_URL:-"https://flare-api-tracer.flare.network/ext/C/rpc?x-apikey=29949e05-d984-45f4-a5ee-ab00887292f6"}

echo "✅ Configuration validated:"
echo "   - Safe Address: $SAFE_ADDRESS"
echo "   - Safe Owner: $(echo $SAFE_OWNER_PRIVATE_KEY | cut -c1-6)...$(echo $SAFE_OWNER_PRIVATE_KEY | cut -c-6)"
echo "   - Flare RPC: $FLARE_RPC_URL"

# Compile contracts
echo "🔨 Compiling contracts..."
yarn build

# Run specific tests for real Safe
echo "🧪 Running real Safe integration tests..."
npx hardhat test test/06_RealSafeTest.spec.ts --network flare

echo "✅ Tests completed successfully!"

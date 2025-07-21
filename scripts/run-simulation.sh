#!/bin/bash

# Script to run Zodiac simulation tests (NO Safe modification)
# Usage: ./scripts/run-simulation.sh

set -e

echo "🎭 Starting Zodiac simulation tests (NO Safe modification)..."

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
echo ""
echo "🛡️  SAFETY: These tests will NOT modify your real Safe!"
echo "   - Only READ-ONLY operations on your Safe"
echo "   - All modifications happen on simulation contracts"
echo "   - Your Safe state remains unchanged"
echo ""

# Compile contracts
echo "🔨 Compiling contracts..."
yarn build

# Run simulation tests
echo "🧪 Running Zodiac simulation tests..."
npx hardhat test test/07_SimulationTest.spec.ts --network flare

echo ""
echo "✅ Simulation tests completed successfully!"
echo "🎯 Your Safe is compatible with Zodiac!"
echo "💡 If you want to run the real tests that modify your Safe, use: ./scripts/run-flare-tests.sh"

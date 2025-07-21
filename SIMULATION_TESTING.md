# Zodiac Simulation Testing (Safe & Secure)

This guide explains how to run **safe simulation tests** that validate Zodiac functionality **without modifying your real Safe**.

## 🛡️ Safety First

These simulation tests are **100% safe** for your real Safe:

- ✅ **READ-ONLY** operations on your Safe
- ✅ All modifications happen on **simulation contracts**
- ✅ Your Safe state remains **completely unchanged**
- ✅ Validates all Zodiac functionality

## 🚀 Quick Start

1. **Setup Environment**

   ```bash
   cp env.example .env
   # Edit .env with your Safe address and private key
   ```

2. **Run Simulation**

   ```bash
   # Option 1: Using the script
   ./scripts/run-simulation.sh

   # Option 2: Using yarn command
   yarn test:simulation

   # Option 3: Manual command
   npx hardhat test test/07_SimulationTest.spec.ts --network flare
   ```

## 🧪 What the Simulation Tests Do

### ✅ **Safe Operations (READ-ONLY)**

- Validate Safe ownership
- Get Safe owners and threshold
- Check current modules (without modification)
- Verify Safe interface compatibility

### ✅ **Zodiac Functionality (Simulation)**

- Deploy test contracts (separate from your Safe)
- Test module enable/disable on simulation avatar
- Test modifier functionality on simulation avatar
- Test guard functionality on simulation contracts
- Demonstrate complete Zodiac workflow

### ✅ **Compatibility Validation**

- Verify your Safe can accept Zodiac modules
- Test Safe interface methods
- Validate network configuration

## 📊 Expected Output

```
🎭 Starting Zodiac simulation tests (NO Safe modification)...
✅ Configuration validated:
   - Safe Address: 0x1234...5678
   - Safe Owner: 0xabcd...ef01
🛡️  SAFETY: These tests will NOT modify your real Safe!
   - Only READ-ONLY operations on your Safe
   - All modifications happen on simulation contracts
   - Your Safe state remains unchanged

🔨 Compiling contracts...
🧪 Running Zodiac simulation tests...
Testing on network: flare (Chain ID: 14)
Safe owner address: 0xabcd...ef01
Simulation Avatar deployed at: 0x5678...9abc
TestModule deployed at: 0xdef0...1234
TestModifier deployed at: 0x5678...9abc
TestGuard deployed at: 0xdef0...1234

=== Safe State Verification ===
Current Safe state:
- Owners: 0xabcd...ef01, 0x1234...5678
- Threshold: 2
- Modules: 0x0000...0000
- Next module pointer: 0x0000...0001
✅ Safe state verified - no modifications made

=== Starting Zodiac Workflow Simulation ===
1. Enabling module on simulation avatar...
2. Setting guard on module...
3. Enabling modifier on simulation avatar...
4. Verifying connections...
=== Zodiac Workflow Simulation completed successfully ===
✅ Your Safe is compatible with Zodiac!

✅ Simulation tests completed successfully!
🎯 Your Safe is compatible with Zodiac!
```

## 🔍 What Gets Validated

| Test Type             | What It Does                               | Safe Impact  |
| --------------------- | ------------------------------------------ | ------------ |
| **Safe Read-Only**    | Validates ownership, gets owners/threshold | ❌ No impact |
| **Interface Check**   | Verifies Safe has required methods         | ❌ No impact |
| **Module Simulation** | Tests modules on simulation avatar         | ❌ No impact |
| **Guard Simulation**  | Tests guards on simulation contracts       | ❌ No impact |
| **Workflow Demo**     | Shows complete Zodiac flow                 | ❌ No impact |

## 🎯 Benefits of Simulation

1. **Zero Risk**: Your Safe remains completely untouched
2. **Full Validation**: All Zodiac functionality is tested
3. **Compatibility Check**: Confirms your Safe works with Zodiac
4. **Cost Effective**: Only pays for simulation contract deployment
5. **Confidence Building**: Validates everything before real deployment

## 🔄 Next Steps

After successful simulation:

1. **Review Results**: Check that all tests passed
2. **Understand Compatibility**: Your Safe is ready for Zodiac
3. **Optional Real Tests**: If you want to test with real modifications:
   ```bash
   ./scripts/run-flare-tests.sh
   ```

## 🛠️ Troubleshooting

### Error: "Not authorized"

- Verify your private key corresponds to a Safe owner
- Check that the Safe address is correct

### Error: "Insufficient funds"

- Ensure the owner has enough FLR for simulation contract deployment
- Simulation costs are much lower than real Safe modifications

### Error: "Network error"

- Check your internet connection
- Verify the Flare RPC URL is correct

## 💡 Pro Tips

- **Run simulation first**: Always start with simulation tests
- **Check Safe state**: Simulation shows your current Safe configuration
- **Understand costs**: Simulation only costs gas for test contract deployment
- **Build confidence**: Simulation validates everything without risk

## 🔗 Related Files

- `test/07_SimulationTest.spec.ts` - Simulation test implementation
- `scripts/run-simulation.sh` - Simulation execution script
- `test/06_RealSafeTest.spec.ts` - Real Safe modification tests
- `scripts/run-flare-tests.sh` - Real test execution script

---

**🎭 Simulation tests are your safe first step to validating Zodiac compatibility!**

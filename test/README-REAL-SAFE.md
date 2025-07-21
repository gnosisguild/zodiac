# Zodiac Tests with Real Safe on Flare Mainnet

This document explains how to run Zodiac tests with a real Safe on Flare mainnet to validate that everything works correctly.

## 📋 Prerequisites

1. **Safe on Flare mainnet**: You must have a Safe deployed on Flare mainnet
2. **Owner private key**: You need the private key of at least one Safe owner
3. **FLR balance**: The owner must have sufficient FLR to pay for gas
4. **Node.js and Yarn**: Installed on your system

## 🔧 Configuration

### 1. Environment Variables

Copy the example file and configure your variables:

```bash
cp env.example .env
```

Edit the `.env` file with your values:

```env
# Your Safe address on Flare mainnet
SAFE_ADDRESS=0x1234567890123456789012345678901234567890

# Private key of a Safe owner (without 0x prefix)
SAFE_OWNER_PRIVATE_KEY=abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890

# Flare RPC URL (optional)
FLARE_RPC_URL=https://flare-api-tracer.flare.network/ext/C/rpc?x-apikey=29949e05-d984-45f4-a5ee-ab00887292f6
```

### 2. Install Dependencies

```bash
yarn install
```

## 🚀 Running Tests

### Option 1: Automatic Script

```bash
chmod +x scripts/run-flare-tests.sh
./scripts/run-flare-tests.sh
```

### Option 2: Manual Command

```bash
# Compile contracts
yarn build

# Run specific tests
npx hardhat test test/06_RealSafeTest.spec.ts --network flare
```

### Option 3: Run All Tests

```bash
# Unit tests (Hardhat network)
yarn test

# Tests with real Safe (Flare mainnet)
npx hardhat test test/06_RealSafeTest.spec.ts --network flare
```

## 🧪 Included Tests

The file `test/06_RealSafeTest.spec.ts` includes the following tests:

### 1. Safe Basic Validation

- Verifies that the signer is an owner of the Safe
- Gets Safe owners and threshold

### 2. Module Integration

- Enables and disables modules on the Safe
- Gets modules paginated

### 3. Modifier Integration

- Enables modifiers on the Safe
- Verifies transaction execution functionality

### 4. Guard Integration

- Configures guards on modules
- Validates pre/post check functionality

### 5. End-to-End Workflow

- Demonstrates the complete Zodiac workflow
- Verifies all connections between components

### 6. Network Validation

- Confirms you're on Flare mainnet (Chain ID 14)
- Verifies FLR balance

## 📊 Expected Results

### Successful Tests

- ✅ All components deploy correctly
- ✅ Safe accepts modules and modifiers
- ✅ Guards work as expected
- ✅ Complete workflow executes without errors

### Possible Errors

- ❌ **"Not authorized"**: Signer is not an owner of the Safe
- ❌ **"Insufficient balance"**: Not enough FLR for gas
- ❌ **"Network error"**: Connectivity issues with Flare
- ❌ **"Contract deployment failed"**: Error deploying test contracts

## 🔍 Debugging

### Verify Flare Connection

```bash
# Verify you can connect to Flare
npx hardhat console --network flare
> await ethers.provider.getNetwork()
```

### Check Balance

```bash
npx hardhat console --network flare
> const signer = new ethers.Wallet(process.env.SAFE_OWNER_PRIVATE_KEY, ethers.provider)
> await signer.getBalance()
```

### Verify Safe

```bash
npx hardhat console --network flare
> const SafeABI = ["function getOwners() external view returns (address[] memory)"]
> const safe = new ethers.Contract(process.env.SAFE_ADDRESS, SafeABI, ethers.provider)
> await safe.getOwners()
```

## ⚠️ Security Considerations

1. **Never share your private key**
2. **Use a test account with limited funds**
3. **Verify the Safe address before running**
4. **Tests may modify your Safe state**

## 🛠️ Troubleshooting

### Error: "SAFE_OWNER_PRIVATE_KEY environment variable is required"

- Verify that the `.env` file exists and has the variable configured
- Make sure there are no extra spaces in the private key

### Error: "Not authorized"

- Verify that the private key corresponds to a Safe owner
- Confirm that the Safe address is correct

### Error: "Insufficient funds"

- Make sure the owner has enough FLR for gas
- Consider using an account with more funds

### Error: "Network connection failed"

- Check your internet connection
- Confirm that the Flare RPC URL is correct

## 📝 Logs and Output

The tests generate detailed logs that include:

- Deployed contract addresses
- Module and modifier states
- Validation results
- Network and balance information

Example of successful output:

```
🚀 Starting Zodiac tests on Flare mainnet...
✅ Configuration validated:
   - Safe Address: 0x1234...5678
   - Safe Owner: 0xabcd...ef01
   - Flare RPC: https://flare-api-tracer.flare.network/...
🔨 Compiling contracts...
🧪 Running real Safe integration tests...
Testing on network: flare (Chain ID: 14)
Safe owner address: 0xabcd...ef01
TestModule deployed at: 0x5678...9abc
TestModifier deployed at: 0xdef0...1234
TestGuard deployed at: 0x5678...9abc
=== Starting End-to-End Zodiac Workflow ===
1. Enabling module on Safe...
2. Setting guard on module...
3. Enabling modifier on Safe...
4. Verifying connections...
- Module enabled: true
- Modifier enabled: true
- Guard set: 0x5678...9abc
=== Zodiac Workflow completed successfully ===
✅ Tests completed successfully!
```

## 🎯 **Resumen de Opciones de Testing**

### ️ **1. SIMULACIÓN SEGURA (Recomendada)**

- **Archivo**: `test/07_SimulationTest.spec.ts`
- **Script**: `./scripts/run-simulation.sh`
- **Comando**: `yarn test:simulation`
- **Impacto en tu Safe**: ❌ **CERO impacto**
- **Qué hace**:
  - Solo operaciones de **LECTURA** en tu Safe
  - Todas las modificaciones en contratos de simulación
  - Valida toda la funcionalidad de Zodiac
  - Confirma compatibilidad sin riesgo

### ⚠️ **2. TESTS REALES (Avanzado)**

- **Archivo**: `test/06_RealSafeTest.spec.ts`
- **Script**: `./scripts/run-flare-tests.sh`
- **Comando**: `yarn test:flare`
- **Impacto en tu Safe**: ✅ **Modifica tu Safe**
- **Qué hace**:
  - Agrega/remueve módulos en tu Safe
  - Configura guards
  - Despliega contratos de test
  - Ejecuta workflow completo

## 🚀 **Flujo Recomendado**

1. **Primero**: Ejecuta simulación

   ```bash
   ./scripts/run-simulation.sh
   ```

2. **Si la simulación pasa**: Tu Safe es compatible con Zodiac

3. **Opcional**: Si quieres probar modificaciones reales
   ```bash
   ./scripts/run-flare-tests.sh
   ```

## 💡 **Ventajas de la Simulación**

- ✅ **100% seguro** - No toca tu Safe
- ✅ **Valida todo** - Prueba toda la funcionalidad
- ✅ **Costo bajo** - Solo gas para contratos de simulación
- ✅ **Confianza** - Confirma compatibilidad antes de modificar
- ✅ **Debugging** - Identifica problemas sin riesgo

## **Archivos Creados**

- `test/07_SimulationTest.spec.ts` - Tests de simulación seguros
- `scripts/run-simulation.sh` - Script para simulación
- `SIMULATION_TESTING.md` - Documentación de simulación
- `FLARE_TESTING.md` - Guía actualizada con ambas opciones

¿Te parece bien empezar con la simulación? Es la opción más segura y te dará toda la información que necesitas sin ningún riesgo para tu Safe.

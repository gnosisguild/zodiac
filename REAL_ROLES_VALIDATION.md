# Zodiac Roles Module REAL Validation

Este documento explica cómo ejecutar la validación **REAL** del Zodiac Roles Module que modificará tu Safe y ejecutará transacciones reales en Flare mainnet.

## ⚠️ **ADVERTENCIA IMPORTANTE**

Este proceso **SÍ modificará tu Safe** y ejecutará transacciones reales que:

- ✅ **Desplegarán un módulo Roles proxy** en Flare mainnet
- ✅ **Habilitarán el módulo** en tu Safe
- ✅ **Configurarán roles y permisos**
- ✅ **Ejecutarán transacciones de prueba** a través del módulo
- 💰 **Costarán FLR** en gas fees
- 🔒 **Modificarán el estado** de tu Safe

## 📋 **Prerrequisitos**

1. **Safe en Flare mainnet** - Debes tener un Safe desplegado
2. **Private key del owner** - Necesitas la clave privada de al menos un owner
3. **Balance de FLR** - El owner debe tener suficiente FLR para gas
4. **Node.js y Yarn** - Instalados en tu sistema

## 🔧 **Configuración**

### 1. Variables de Entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp env.example .env
```

Edita el archivo `.env` con tus valores:

```env
# Tu dirección de Safe en Flare mainnet
SAFE_ADDRESS=0x7C9C1aa9623448d85A23685B08181E02bEfE4972

# Clave privada de un owner del Safe (sin prefijo 0x)
SAFE_OWNER_PRIVATE_KEY=abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890

# URL RPC de Flare (opcional)
FLARE_RPC_URL=https://flare-api-tracer.flare.network/ext/C/rpc?x-apikey=29949e05-d984-45f4-a5ee-ab00887292f6
```

### 2. Instalar Dependencias

```bash
yarn install
```

## 🚀 **Ejecutar Validación REAL**

### Opción 1: Script Automático (Recomendado)

```bash
./scripts/run-real-roles-validation.sh
```

### Opción 2: Comando Manual

```bash
# Compilar contratos
yarn build

# Ejecutar test específico
npx hardhat test test/09_RealRolesValidation.spec.ts --network flare
```

## 🧪 **Qué Hace la Validación REAL**

El archivo `test/09_RealRolesValidation.spec.ts` ejecuta las siguientes operaciones **REALES**:

### 1. **Despliegue del Módulo Roles**
- Despliega un proxy del módulo Roles usando la factory
- Configura el avatar y target como tu Safe
- Verifica que el proxy tiene código desplegado

### 2. **Integración con Safe**
- Habilita el módulo en tu Safe
- Verifica que el módulo puede ejecutar transacciones
- Confirma la integración completa

### 3. **Configuración de Roles**
- Asigna roles al módulo
- Configura el rol por defecto
- Verifica la configuración de permisos

### 4. **Pruebas de Ejecución**
- Ejecuta transacciones a través del módulo
- Prueba ejecución basada en roles
- Valida el funcionamiento completo

## 📊 **Resultados Esperados**

### ✅ **Transacciones que se Ejecutarán**

1. **Deployment del proxy** - Despliega el módulo Roles
2. **Configuración del módulo** - Set avatar y target
3. **Habilitación en Safe** - Enable module en tu Safe
4. **Asignación de roles** - Assign roles al módulo
5. **Configuración de rol por defecto** - Set default role
6. **Ejecuciones de prueba** - Test transactions

### 📈 **Logs de Salida**

```
🚀 === ZODIAC ROLES MODULE REAL VALIDATION ===

✅ Configuration validated:
   - Safe Address: 0x7C9C1aa9623448d85A23685B08181E02bEfE4972
   - Flare RPC: https://flare-api-tracer.flare.network/...

🔨 Compiling contracts...
🧪 Running REAL Roles module validation...

✅ Connected to Flare mainnet (Chain ID: 14)
✅ Safe ownership validated: 0xabcd...ef01
✅ Test target deployed at: 0x5678...9abc

🔧 Deploying Roles module proxy...
📋 Expected proxy address: 0xdef0...1234
🚀 Deployment transaction hash: 0x1234...5678
✅ Module proxy deployed at: 0xdef0...1234

🔧 Configuring Roles module...
✅ Avatar set to Safe address
✅ Target set to Safe address
✅ Module configuration verified

🔧 Enabling Roles module on Safe...
🚀 Enable transaction hash: 0x5678...9abc
✅ Module enabled on Safe

🔧 Testing module transaction execution...
🚀 Module execution transaction hash: 0x9abc...def0
✅ Module transaction execution successful

🔧 Configuring roles for module...
🚀 Role assignment transaction hash: 0xdef0...1234
✅ Roles assigned to module
✅ Role assignment verified

🚀 Default role transaction hash: 0x1234...5678
✅ Default role set
✅ Default role verified

🔧 Testing role-based transaction execution...
🚀 Role-based execution transaction hash: 0x5678...9abc
✅ Role-based transaction execution successful

🎯 === ZODIAC ROLES MODULE REAL VALIDATION SUMMARY ===

✅ VALIDATION RESULTS:
   ✅ Flare mainnet connection: SUCCESS
   ✅ Safe ownership verification: SUCCESS
   ✅ Roles module proxy deployment: SUCCESS
   ✅ Module configuration: SUCCESS
   ✅ Safe module integration: SUCCESS
   ✅ Role configuration: SUCCESS

📋 WHAT WAS ACCOMPLISHED:
   • Deployed a Roles module proxy on Flare mainnet
   • Configured the module with your Safe as avatar and target
   • Enabled the module on your Safe
   • Configured roles and permissions
   • Tested transaction execution through the module

🔧 MODULE DETAILS:
   • Module Proxy Address: 0xdef0...1234
   • Safe Address: 0x7C9C1aa9623448d85A23685B08181E02bEfE4972
   • Owner Address: 0xabcd...ef01

🎉 REAL VALIDATION COMPLETED SUCCESSFULLY!
```

## 🔍 **Verificar Resultados**

### 1. **En el Historial de tu Safe**

Después de la validación, podrás ver las transacciones en:
```
https://safe.palmeradao.xyz/transactions/history?safe=flare:0x7C9C1aa9623448d85A23685B08181E02bEfE4972
```

### 2. **Transacciones Esperadas**

- **Deployment del módulo** - Transacción de despliegue del proxy
- **Configuración** - Set avatar y target
- **Habilitación** - Enable module en Safe
- **Roles** - Assign roles y set default role
- **Ejecuciones** - Test transactions

### 3. **Estado Final**

- ✅ Módulo Roles habilitado en tu Safe
- ✅ Roles configurados y funcionando
- ✅ Transacciones ejecutándose correctamente
- ✅ Sistema listo para uso en DAO

## ⚠️ **Posibles Errores**

### ❌ **"Insufficient balance"**
- El owner no tiene suficiente FLR para gas
- Solución: Añadir más FLR a la cuenta

### ❌ **"Not authorized"**
- La private key no corresponde a un owner del Safe
- Solución: Verificar la private key

### ❌ **"Module already enabled"**
- El módulo ya está habilitado en el Safe
- Solución: Normal, el test continuará

### ❌ **"Transaction failed"**
- Error en la ejecución de transacciones
- Solución: Revisar logs para detalles específicos

## 💡 **Después de la Validación**

Una vez completada la validación REAL:

1. **El módulo está listo** para uso en tu DAO
2. **Los roles están configurados** y funcionando
3. **Puedes usar la interfaz de Safe** para gestionar el módulo
4. **Puedes configurar roles adicionales** según necesites

## 🔧 **Gestión del Módulo**

### Ver Módulos Habilitados
```bash
npx hardhat console --network flare
> const SafeABI = ["function getModulesPaginated(address start, uint256 pageSize) external view returns (address[] memory array, address next)"]
> const safe = new ethers.Contract("0x7C9C1aa9623448d85A23685B08181E02bEfE4972", SafeABI, ethers.provider)
> await safe.getModulesPaginated("0x0000000000000000000000000000000000000001", 10)
```

### Verificar Configuración del Módulo
```bash
npx hardhat console --network flare
> const RolesABI = ["function avatar() external view returns (address)", "function target() external view returns (address)"]
> const roles = new ethers.Contract("MODULE_PROXY_ADDRESS", RolesABI, ethers.provider)
> await roles.avatar()
> await roles.target()
```

## 🎯 **Resumen**

La validación REAL del Zodiac Roles Module:

- ✅ **Despliega un módulo real** en Flare mainnet
- ✅ **Modifica tu Safe** habilitando el módulo
- ✅ **Configura roles y permisos** completamente
- ✅ **Ejecuta transacciones reales** para validar funcionamiento
- ✅ **Confirma que todo funciona** en producción

**¡Tu Safe estará completamente configurado y listo para usar Zodiac en tu DAO!**

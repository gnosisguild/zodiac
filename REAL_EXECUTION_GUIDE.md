# Zodiac Roles Module - Real Execution Guide

## 🎯 Ejecución Real en el Safe

Este documento explica el proceso de ejecución real que modificará tu Safe y ejecutará transacciones reales en Flare mainnet.

## ⚠️ ADVERTENCIAS IMPORTANTES

### Lo que va a pasar:
- **Transacciones reales** se ejecutarán en Flare mainnet
- **Tu Safe será modificado** con un nuevo módulo
- **Costos de gas** en FLR serán incurridos
- **Transacciones aparecerán** en el historial del Safe
- **Cambios son permanentes** (aunque el módulo se puede deshabilitar)

### Verificación:
- Puedes verificar las transacciones en: [Safe Interface](https://safe.palmeradao.xyz/transactions/history?safe=flare:0x7C9C1aa9623448d85A23685B08181E02bEfE4972)
- Todas las transacciones serán visibles en el historial
- El módulo aparecerá en la interfaz del Safe

## 🚀 Cómo Ejecutar

### Opción 1: Script Automatizado (Recomendado)
```bash
./scripts/run-real-execution.sh
```

### Opción 2: Comando Directo
```bash
npm run test:real-execution
```

### Opción 3: Comando Hardhat
```bash
npx hardhat test test/15_RealSafeExecution.spec.ts --network flare
```

## 📋 Pasos de la Ejecución

### Paso 1: Despliegue del Proxy del Módulo
- **Acción**: Despliega un nuevo proxy del módulo Roles
- **Costo**: ~0.1-0.2 FLR
- **Resultado**: Nuevo contrato proxy desplegado
- **Transacción**: Aparecerá en el historial del Safe

### Paso 2: Habilitación del Módulo en el Safe
- **Acción**: Habilita el módulo en tu Safe
- **Costo**: ~0.05-0.1 FLR
- **Resultado**: El módulo aparece en la lista de módulos del Safe
- **Transacción**: Aparecerá en el historial del Safe

### Paso 3: Configuración de Roles
- **Acción**: Configura roles ADMIN y EXECUTOR
- **Costo**: ~0.1-0.15 FLR
- **Resultado**: Roles configurados en el módulo
- **Transacciones**: Múltiples transacciones para configurar roles

### Paso 4: Pruebas de Transacciones
- **Acción**: Ejecuta transacciones de prueba a través del módulo
- **Costo**: ~0.05-0.1 FLR
- **Resultado**: Verificación de que el módulo funciona correctamente
- **Transacciones**: Transacciones de prueba ejecutadas

## 💰 Estimación de Costos

### Costos Totales Estimados:
- **Despliegue del proxy**: ~0.1-0.2 FLR
- **Habilitación del módulo**: ~0.05-0.1 FLR
- **Configuración de roles**: ~0.1-0.15 FLR
- **Transacciones de prueba**: ~0.05-0.1 FLR
- **Total estimado**: ~0.3-0.55 FLR

### Costos Operacionales Futuros:
- **Asignación de roles**: ~0.03 FLR por rol
- **Ejecución de transacciones**: ~0.1 FLR por transacción
- **Gestión del módulo**: ~0.05 FLR por operación

## 🔍 Verificación de Resultados

### En el Safe Interface:
1. Ve a [Safe Interface](https://safe.palmeradao.xyz)
2. Conecta tu wallet
3. Selecciona tu Safe
4. Ve a la pestaña "Apps" o "Modules"
5. Deberías ver el módulo Roles habilitado

### En el Historial de Transacciones:
1. Ve a [Historial de Transacciones](https://safe.palmeradao.xyz/transactions/history?safe=flare:0x7C9C1aa9623448d85A23685B08181E02bEfE4972)
2. Deberías ver las siguientes transacciones:
   - Transacción de despliegue del proxy
   - Transacción de habilitación del módulo
   - Transacciones de configuración de roles
   - Transacciones de prueba

### En Flare Explorer:
1. Ve a [Flare Explorer](https://flare-explorer.flare.network)
2. Busca las direcciones de las transacciones
3. Verifica que los contratos se desplegaron correctamente

## 🎭 Configuración de Roles

### Roles Configurados:
- **Role 1 (ADMIN)**: Acceso administrativo completo
- **Role 2 (EXECUTOR)**: Puede ejecutar transacciones (ROL PREDETERMINADO)
- **Role 3 (VIEWER)**: Acceso de solo lectura (disponible para uso futuro)

### Permisos:
- **ADMIN**: Puede asignar/revocar roles, modificar el módulo
- **EXECUTOR**: Puede ejecutar transacciones a través del módulo
- **VIEWER**: Solo puede ver información (sin ejecución)

## 🔧 Gestión Post-Ejecución

### En el Safe Interface:
1. **Ver módulos**: Ve a Apps > Modules
2. **Configurar roles**: Usa la interfaz del módulo para gestionar roles
3. **Ejecutar transacciones**: Usa el módulo para transacciones con roles

### Comandos Útiles:
```bash
# Verificar estado del módulo
npx hardhat test test/13_FinalRolesValidation.spec.ts --network flare

# Ejecutar validación completa
npx hardhat test test/14_CompleteRolesIntegration.spec.ts --network flare
```

## 🚨 Solución de Problemas

### Si las transacciones fallan:
1. **Verificar balance**: Asegúrate de tener suficiente FLR
2. **Verificar permisos**: Confirma que eres owner del Safe
3. **Verificar red**: Confirma que estás en Flare mainnet
4. **Revisar logs**: Los logs mostrarán detalles del error

### Si el módulo no aparece:
1. **Esperar confirmaciones**: Las transacciones pueden tardar
2. **Refrescar interfaz**: Recarga la página del Safe
3. **Verificar dirección**: Confirma que el proxy se desplegó correctamente

## 📞 Soporte

### En caso de problemas:
1. **Revisar logs**: Los logs del test mostrarán detalles
2. **Verificar transacciones**: Usa el explorador de Flare
3. **Contactar soporte**: Si persisten los problemas

### Recursos útiles:
- [Safe Interface](https://safe.palmeradao.xyz)
- [Flare Explorer](https://flare-explorer.flare.network)
- [Documentación de Zodiac](https://zodiac.wiki/)

## ✅ Confirmación

Antes de ejecutar, confirma que:
- [ ] Tienes suficiente FLR para los costos de gas
- [ ] Eres owner del Safe
- [ ] Entiendes que se ejecutarán transacciones reales
- [ ] Aceptas que tu Safe será modificado
- [ ] Puedes verificar las transacciones en el historial

---

**¿Estás listo para proceder con la ejecución real?**

Ejecuta: `./scripts/run-real-execution.sh`

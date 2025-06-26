# 🔧 Solución de Problemas de Firebase

## 🚨 Problema: No aparecen tipos de documento ni se puede iniciar sesión

### Solución Rápida desde la Consola del Navegador

1. **Abre la aplicación** en tu navegador (http://localhost:5177/)
2. **Abre las herramientas de desarrollador** (F12)
3. **Ve a la pestaña Console**
4. **Ejecuta estos comandos en orden:**

```javascript
// 1. Verificar conexión a Firebase
await window.eldenDB.checkFirebase()

// 2. Forzar inicialización de datos
await window.eldenDB.forceInit()

// 3. Ver información de la base de datos
await window.eldenDB.showInfo()
```

### Solución desde el Panel de Administración

1. **Inicia sesión** con cualquier cuenta (o crea una nueva)
2. **Ve a Ajustes** en el menú lateral
3. **Haz clic en "Base de Datos"** (sección 6.8)
4. **Ejecuta en orden:**
   - "Verificar Conexión"
   - "Forzar Inicialización"
   - "Ver Información"

## 🔍 Verificación de Datos

### Después de la inicialización, deberías ver:

**Tipos de Documento:**
- Cédula de ciudadanía (CC)
- Tarjeta de identidad (TI)
- Cédula de extranjería (CE)
- Pasaporte (PA)
- NIT
- RUT

**Usuarios de Prueba:**
- **Admin**: admin@elden.com / admin123
- **Empleado**: empleado@elden.com / empleado123

## 🛠️ Comandos de Consola Disponibles

```javascript
// Verificar Firebase
window.eldenDB.checkFirebase()

// Forzar inicialización
window.eldenDB.forceInit()

// Mostrar información
window.eldenDB.showInfo()

// Reinicializar todo
window.eldenDB.reset()
```

## 📊 Verificación de Estado

### En la consola deberías ver algo como:

```
📊 Database Information:
📁 users: 2 items
📁 employees: 1 items
📁 positions: 4 items
📁 documentTypes: 6 items
📁 paymentMethods: 5 items
📁 sports: 4 items
📁 fields: 3 items
📁 timeSlots: 0 items
📁 reservations: 0 items
📁 messages: 0 items
```

## 🚨 Si sigue sin funcionar:

1. **Verifica la configuración de Firebase** en `src/services/firebase.ts`
2. **Asegúrate de que Firestore esté habilitado** en tu proyecto de Firebase
3. **Verifica las reglas de seguridad** de Firestore
4. **Limpia el caché del navegador** y recarga la página

## 📝 Reglas de Firestore Recomendadas

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Solo para desarrollo
    }
  }
}
```

## 🎯 Pasos Finales

1. **Ejecuta la inicialización**
2. **Verifica que aparezcan los tipos de documento**
3. **Prueba iniciar sesión** con los usuarios de prueba
4. **Crea una nueva cuenta** con cédula de ciudadanía

¡Si sigues teniendo problemas, revisa la consola para ver errores específicos! 
# Configuración de Firebase para Campos Deportivos Elden

## ¿Por qué Firebase?

Firebase te permite tener una base de datos centralizada donde todos los usuarios pueden:
- ✅ Crear cuentas que se guardan en la nube
- ✅ Hacer reservas que se ven en tiempo real
- ✅ Ver las reservas de otros usuarios
- ✅ Tener datos persistentes entre sesiones

## Pasos para configurar Firebase

### 1. Crear proyecto en Firebase

1. Ve a [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto"
3. Dale un nombre como "Campos Deportivos Elden"
4. Puedes desactivar Google Analytics si quieres
5. Haz clic en "Crear proyecto"

### 2. Configurar Authentication

1. En el panel de Firebase, ve a "Authentication" en el menú lateral
2. Haz clic en "Get started"
3. Ve a la pestaña "Sign-in method"
4. Habilita "Email/Password"
5. Haz clic en "Save"

### 3. Configurar Firestore Database

1. En el panel de Firebase, ve a "Firestore Database" en el menú lateral
2. Haz clic en "Create database"
3. Selecciona "Start in test mode" (para desarrollo)
4. Selecciona la ubicación más cercana a tu país
5. Haz clic en "Done"

### 4. Obtener configuración de la app

1. En el panel de Firebase, ve a "Project Settings" (ícono de engranaje)
2. En la pestaña "General", busca "Your apps"
3. Haz clic en "Add app" y selecciona el ícono de web (</>)
4. Dale un nombre como "Campos Deportivos Elden Web"
5. Puedes desactivar Firebase Hosting si quieres
6. Haz clic en "Register app"
7. Copia la configuración que aparece

### 5. Configurar el código

1. En tu proyecto, ve a `src/services/firebase.ts`
2. Reemplaza la configuración de ejemplo con la tuya:

```typescript
const firebaseConfig = {
  apiKey: "tu-api-key-real",
  authDomain: "tu-proyecto-real.firebaseapp.com",
  projectId: "tu-proyecto-real-id",
  storageBucket: "tu-proyecto-real.appspot.com",
  messagingSenderId: "tu-messaging-sender-id",
  appId: "tu-app-id-real"
};
```

### 6. Configurar reglas de seguridad (opcional)

Por defecto, Firestore está en modo de prueba. Para producción, deberías configurar reglas de seguridad:

1. Ve a Firestore Database > Rules
2. Reemplaza las reglas con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura a usuarios autenticados
    match /{document=**} {
      allow read: if request.auth != null;
    }
    
    // Permitir escritura a usuarios autenticados
    match /users/{userId} {
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /reservations/{reservationId} {
      allow write: if request.auth != null;
    }
    
    match /{collection}/{document} {
      allow write: if request.auth != null;
    }
  }
}
```

## Estructura de la base de datos

Firebase creará automáticamente las siguientes colecciones:

- `users` - Usuarios registrados
- `positions` - Cargos de empleados
- `documentTypes` - Tipos de documento
- `paymentMethods` - Métodos de pago
- `sports` - Deportes disponibles
- `fields` - Canchas disponibles
- `timeSlots` - Horarios disponibles
- `reservations` - Reservas realizadas
- `employees` - Empleados registrados

## Ventajas de Firebase

### ✅ Base de datos centralizada
- Todos los usuarios comparten la misma base de datos
- Los datos persisten entre sesiones
- No hay problemas de sincronización

### ✅ Tiempo real
- Las reservas se actualizan instantáneamente
- Todos ven los cambios en tiempo real
- No necesitas refrescar la página

### ✅ Escalable
- Firebase maneja automáticamente el escalado
- Funciona con miles de usuarios
- No necesitas configurar servidores

### ✅ Seguro
- Autenticación integrada
- Reglas de seguridad configurables
- Datos encriptados

### ✅ Gratis para proyectos pequeños
- 50,000 lecturas/día gratis
- 20,000 escrituras/día gratis
- 1GB de almacenamiento gratis

## Solución de problemas

### Error: "Firebase: Error (auth/invalid-api-key)"
- Verifica que la API key sea correcta
- Asegúrate de que el proyecto esté activo

### Error: "Firebase: Error (auth/operation-not-allowed)"
- Verifica que Email/Password esté habilitado en Authentication

### Error: "Firebase: Error (permission-denied)"
- Verifica las reglas de seguridad de Firestore
- Asegúrate de que el usuario esté autenticado

### Los datos no se guardan
- Verifica que Firestore esté en modo de prueba
- Revisa la consola del navegador para errores

## Próximos pasos

Una vez configurado Firebase:

1. **Prueba la aplicación**: Crea algunas cuentas y reservas
2. **Configura usuarios admin**: Crea un usuario administrador manualmente en Firebase
3. **Personaliza los datos**: Modifica deportes, canchas, etc.
4. **Configura reglas de seguridad**: Para producción
5. **Monitorea el uso**: Revisa el dashboard de Firebase

## Soporte

Si tienes problemas:
1. Revisa la consola del navegador para errores
2. Verifica la configuración de Firebase
3. Consulta la [documentación de Firebase](https://firebase.google.com/docs)
4. Revisa los logs en la consola de Firebase 
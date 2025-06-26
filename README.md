# Campos Deportivos Elden

Sistema de gestión de reservas para campos deportivos con base de datos en tiempo real usando Firebase.

## 🚀 Características

- **Base de datos centralizada**: Todos los usuarios comparten la misma base de datos
- **Tiempo real**: Las reservas se actualizan instantáneamente para todos los usuarios
- **Autenticación segura**: Sistema de login/registro con Firebase Auth
- **Gestión de reservas**: Crear, editar y cancelar reservas
- **Múltiples roles**: Administrador, empleado y cliente
- **Interfaz moderna**: Diseño responsive con Tailwind CSS
- **TypeScript**: Código tipado y seguro

## 📋 Requisitos

- Node.js 16 o superior
- Cuenta de Firebase (gratuita)

## 🛠️ Instalación

1. **Clona el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd ProyectoElden
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura Firebase**
   - Sigue las instrucciones en [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - Copia `src/services/firebase.example.ts` como `src/services/firebase.ts`
   - Reemplaza la configuración con tus credenciales de Firebase

4. **Ejecuta el proyecto**
   ```bash
   npm run dev
   ```

5. **Abre en el navegador**
   - Ve a `http://localhost:5173`

## 🔥 Configuración de Firebase

**IMPORTANTE**: Para que la aplicación funcione correctamente, necesitas configurar Firebase. Sigue las instrucciones detalladas en [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

### Resumen rápido:
1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Authentication (Email/Password)
3. Crea una base de datos Firestore
4. Copia la configuración a `src/services/firebase.ts`

## 👥 Roles de Usuario

### Cliente
- Crear cuenta y perfil
- Ver canchas disponibles
- Hacer reservas
- Ver historial de reservas
- Cancelar reservas propias

### Empleado
- Todo lo del cliente
- Gestionar reservas de otros usuarios
- Ver reportes básicos
- Configurar horarios de canchas

### Administrador
- Todo lo del empleado
- Gestionar usuarios
- Configurar canchas y deportes
- Ver reportes completos
- Gestión completa del sistema

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Admin/          # Componentes de administración
│   ├── Auth/           # Componentes de autenticación
│   ├── Layout/         # Componentes de layout
│   └── Sections/       # Páginas principales
├── contexts/           # Contextos de React
│   ├── AuthContext.tsx # Contexto de autenticación
│   └── DataContext.tsx # Contexto de datos
├── services/           # Servicios
│   ├── firebase.ts     # Configuración de Firebase
│   └── firebase.example.ts # Ejemplo de configuración
└── types/              # Tipos de TypeScript
```

## 🗄️ Base de Datos

La aplicación usa Firebase Firestore con las siguientes colecciones:

- **users**: Usuarios registrados
- **reservations**: Reservas realizadas
- **fields**: Canchas disponibles
- **sports**: Deportes disponibles
- **timeSlots**: Horarios disponibles
- **employees**: Empleados
- **positions**: Cargos de empleados
- **documentTypes**: Tipos de documento
- **paymentMethods**: Métodos de pago

## 🔄 Migración desde IndexedDB

Si tenías la versión anterior con IndexedDB:

1. **Los datos locales se perderán** - Firebase es una base de datos en la nube
2. **Configura Firebase** siguiendo las instrucciones
3. **Los usuarios necesitarán registrarse nuevamente**
4. **Las reservas se harán desde cero**

### Ventajas de la migración:
- ✅ Base de datos centralizada
- ✅ Tiempo real entre usuarios
- ✅ Datos persistentes
- ✅ Escalabilidad
- ✅ Seguridad mejorada

## 🚀 Despliegue

### Netlify (Recomendado)
1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno si es necesario
3. Despliega automáticamente

### Vercel
1. Conecta tu repositorio a Vercel
2. Configura el framework como Vite
3. Despliega

### Firebase Hosting
1. Instala Firebase CLI: `npm install -g firebase-tools`
2. Inicia sesión: `firebase login`
3. Inicializa: `firebase init hosting`
4. Despliega: `firebase deploy`

## 🐛 Solución de Problemas

### Error de configuración de Firebase
- Verifica que `src/services/firebase.ts` tenga la configuración correcta
- Asegúrate de que Authentication esté habilitado
- Verifica que Firestore esté creado

### Los datos no se guardan
- Revisa la consola del navegador para errores
- Verifica las reglas de seguridad de Firestore
- Asegúrate de que el usuario esté autenticado

### Problemas de autenticación
- Verifica que Email/Password esté habilitado en Firebase
- Revisa que la API key sea correcta
- Verifica que el proyecto esté activo

## 📝 Scripts Disponibles

```bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm run preview      # Previsualizar build de producción
npm run lint         # Ejecutar linter
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas:
1. Revisa la consola del navegador
2. Consulta [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
3. Revisa la [documentación de Firebase](https://firebase.google.com/docs)
4. Abre un issue en GitHub

## 🔮 Próximas Características

- [ ] Notificaciones push
- [ ] Pagos en línea
- [ ] App móvil
- [ ] Reportes avanzados
- [ ] Sistema de calificaciones
- [ ] Chat en tiempo real 
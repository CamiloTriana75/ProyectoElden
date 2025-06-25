# Campos Deportivos Elden

**Sistema de gestión y reservas para campos deportivos.**

## Descripción

Campos Deportivos Elden es una aplicación web desarrollada con React y Vite para la gestión integral de reservas, administración de canchas, horarios, reportes y comunicación entre clientes y empleados de un complejo deportivo. El sistema permite a los usuarios registrarse, reservar canchas, enviar mensajes de contacto y gestionar su perfil, mientras que los empleados y administradores pueden gestionar recursos, aprobar/rechazar reservas, ver reportes y responder mensajes de clientes.

## Características principales

- **Registro y autenticación de usuarios** (clientes, empleados y administradores)
- **Gestión de reservas**: creación, confirmación, cancelación y filtrado por estado y deporte
- **Gestión de canchas**: alta, edición y eliminación de canchas por deporte
- **Gestión de horarios**: configuración de horarios disponibles y precios por cancha
- **Gestión de empleados**: alta, edición y eliminación de empleados y cargos
- **Gestión de métodos de pago y tipos de documento**
- **Reportes y estadísticas**: visualización de reservas, ingresos, deportes más populares y horarios más utilizados
- **Mensajería interna**: clientes pueden enviar mensajes de contacto, empleados pueden ver, filtrar y responder mensajes
- **Panel de ajustes**: notificaciones, seguridad, preferencias de idioma y tema
- **Persistencia local**: todos los datos se almacenan en el navegador usando IndexedDB
- **Interfaz moderna y responsiva** con TailwindCSS y componentes personalizados

## Tecnologías utilizadas

- **React 18** (con hooks y contextos)
- **Vite** (entorno de desarrollo ultrarrápido)
- **TypeScript**
- **TailwindCSS** (estilos y diseño responsivo)
- **IndexedDB** (persistencia local de datos)
- **Lucide React** (iconos)
- **date-fns** (manejo de fechas)
- **ESLint** (calidad de código)

## Estructura de carpetas principal

```
src/
  components/
    Sections/        # Páginas principales (Home, Reservas, Reportes, Contacto, etc.)
    Admin/           # Gestión de recursos (empleados, canchas, horarios, etc.)
    Layout/          # Sidebar, Header, Spinner
    Auth/            # Login y registro
  contexts/          # Contextos de autenticación y datos
  services/          # Lógica de base de datos (IndexedDB)
  types/             # Tipos y modelos TypeScript
  data/              # Datos de ejemplo o mock
  index.css          # Estilos globales
  main.tsx           # Punto de entrada
```

## Instalación y ejecución

1. **Clona el repositorio**
   ```bash
   git clone <url-del-repo>
   cd campos-deportivos-elden
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```
   La app estará disponible en [http://localhost:5173](http://localhost:5173) (o el puerto que indique Vite).

4. **Comandos adicionales**
   - `npm run build` — Genera la versión de producción
   - `npm run preview` — Previsualiza la build de producción
   - `npm run lint` — Ejecuta el linter

## Usuarios por defecto

- **Administrador**
  - Email: `admin@elden.com`
  - Contraseña: `admin123`
- **Empleado**
  - Email: `empleado@elden.com`
  - Contraseña: `empleado123`

## Roles y permisos

- **Cliente:** puede reservar, ver canchas, enviar mensajes y gestionar su perfil.
- **Empleado:** puede gestionar canchas, horarios, reservas, reportes y ver mensajes de clientes.
- **Administrador:** acceso total a la gestión y reportes, solo ve la sección de reservas.

## Notas técnicas

- **Persistencia:** Todos los datos se almacenan en el navegador usando IndexedDB. No requiere backend.
- **Seguridad:** Las contraseñas se almacenan en texto plano solo para desarrollo. No usar en producción real.
- **Responsive:** El diseño es adaptable a dispositivos móviles y escritorio.
- **Personalización:** Puedes modificar los deportes, canchas, horarios y métodos de pago desde la interfaz de empleado/admin.

## Créditos

Desarrollado por el equipo de Campos Deportivos Elden. 
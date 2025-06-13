# Event Hub - Dashboard Administrativo

Un dashboard completo de administración para Event Hub desarrollado en React con Tailwind CSS y Axios.

## 🚀 Características

### Funcionalidades Principales
- **Autenticación segura** con JWT y protección de rutas
- **Gestión de Administradores** - Registro y listado de usuarios administrativos
- **Gestión de Eventos** - Control completo de eventos con bloqueo/desbloqueo
- **Gestión de Usuarios** - Administración de usuarios del sistema
- **Dashboard principal** con estadísticas en tiempo real
- **Interfaz responsive** optimizada para desktop y móvil

### Tecnologías Utilizadas
- **React 18** - Framework principal
- **Tailwind CSS** - Estilos y diseño responsive
- **Axios** - Cliente HTTP para API calls
- **React Router** - Navegación y rutas protegidas
- **Lucide React** - Iconografía moderna
- **shadcn/ui** - Componentes UI de alta calidad

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o pnpm
- Backend Event Hub ejecutándose (por defecto en `https://backendeventhub.onrender.com`)

## 🛠️ Instalación

1. **Clonar o extraer el proyecto**
   ```bash
   cd event-hub-admin
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   # o
   npm install
   ```

3. **Configurar variables de entorno**
   
   El proyecto está preconfigurado para usar la API en `https://backendeventhub.onrender.com`. 
   
   Si necesitas cambiar la URL de la API, edita el archivo `src/constants/api.js`:
   ```javascript
   export const API_BASE_URL = 'https://tu-api-url.com';
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   pnpm run dev
   # o
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes UI base (shadcn/ui)
│   ├── DashboardLayout.jsx
│   └── ProtectedRoute.jsx
├── contexts/           # Contextos de React
│   └── AuthContext.jsx
├── pages/              # Páginas principales
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── AdminManagement.jsx
│   ├── EventManagement.jsx
│   └── UserManagement.jsx
├── services/           # Servicios de API
│   └── api.js
├── constants/          # Constantes y configuración
│   └── api.js
└── utils/              # Utilidades
```

## 🔐 Autenticación

El sistema utiliza JWT para autenticación. Las credenciales se almacenan de forma segura en localStorage y se incluyen automáticamente en todas las peticiones a la API.

### Flujo de Autenticación
1. Usuario ingresa credenciales en `/login`
2. Sistema valida con la API backend
3. Token JWT se almacena localmente
4. Usuario es redirigido al dashboard
5. Todas las rutas están protegidas y requieren autenticación

## 📱 Páginas y Funcionalidades

### 1. Dashboard Principal (`/dashboard`)
- Estadísticas generales del sistema
- Resumen de usuarios, eventos y administradores
- Navegación rápida a todas las secciones

### 2. Gestión de Administradores (`/dashboard/admins`)
- **Listar administradores** existentes
- **Registrar nuevos administradores** con formulario completo
- **Búsqueda y filtrado** por nombre, usuario o email
- **Visualización de roles** (ADMIN, SUBADMIN)

### 3. Gestión de Eventos (`/dashboard/events`)
- **Listar todos los eventos** del sistema
- **Bloquear/Desbloquear eventos** individualmente
- **Cambiar estado** de eventos (Active, Inactive, Cancelled, Completed)
- **Filtros avanzados** por estado y bloqueo
- **Estadísticas rápidas** de eventos

### 4. Gestión de Usuarios (`/dashboard/users`)
- **Listar todos los usuarios** registrados
- **Ver detalles completos** de cada usuario
- **Cambiar estado** de usuarios (Active, Inactive, Blocked, Pending)
- **Filtros por rol y estado**
- **Búsqueda avanzada**

## 🔧 API Endpoints Utilizados

### Autenticación
- `POST /auth/login` - Iniciar sesión

### Administradores
- `POST /admin/register` - Registrar administrador
- `GET /users` - Obtener usuarios (filtrado por rol ADMIN/SUBADMIN)

### Eventos
- `GET /events` - Obtener todos los eventos
- `PUT /admin/events/{id}/toggle-block` - Bloquear/desbloquear evento
- `PUT /admin/events/{id}/status` - Cambiar estado del evento

### Usuarios
- `GET /users` - Obtener todos los usuarios
- `PUT /admin/users/{id}/status` - Cambiar estado del usuario

## 🎨 Diseño y UX

### Principios de Diseño
- **Interfaz limpia y moderna** con Tailwind CSS
- **Navegación intuitiva** con sidebar colapsable
- **Feedback visual** para todas las acciones
- **Estados de carga** y manejo de errores
- **Responsive design** para todos los dispositivos

### Componentes UI
- Formularios con validación en tiempo real
- Tablas con paginación y filtros
- Modales para acciones importantes
- Badges para estados visuales
- Dropdowns para acciones contextuales

## 🚀 Despliegue

### Desarrollo Local
```bash
pnpm run dev
```

### Build de Producción
```bash
pnpm run build
```

Los archivos de producción se generarán en la carpeta `dist/`.

### Despliegue en Servidor
1. Ejecutar `pnpm run build`
2. Subir contenido de `dist/` al servidor web
3. Configurar servidor para SPA (Single Page Application)

## 🔒 Seguridad

- **Rutas protegidas** - Acceso solo con autenticación válida
- **Tokens JWT** con expiración automática
- **Validación de permisos** en cada acción administrativa
- **Sanitización de inputs** en formularios
- **HTTPS requerido** en producción

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de conexión a la API**
   - Verificar que el backend esté ejecutándose
   - Comprobar la URL en `src/constants/api.js`
   - Revisar configuración CORS en el backend

2. **Problemas de autenticación**
   - Limpiar localStorage: `localStorage.clear()`
   - Verificar credenciales con el administrador del sistema

3. **Errores de build**
   - Eliminar `node_modules` y reinstalar dependencias
   - Verificar versión de Node.js (18+)

## 📞 Soporte

Para soporte técnico o reportar problemas:
- Revisar la consola del navegador para errores
- Verificar logs del servidor backend
- Contactar al equipo de desarrollo

## 📄 Licencia

Este proyecto es parte del sistema Event Hub y está sujeto a las políticas de la organización.

---

**Event Hub Dashboard v1.0** - Desarrollado con ❤️ usando React y Tailwind CSS


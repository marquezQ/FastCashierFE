# FastCashier — Frontend

Sistema de punto de venta (POS) full-featured construido con React 19 y Vite. Diseñado para restaurantes y negocios con flujo de caja, cocina y administración en tiempo real.

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura General](#arquitectura-general)
- [Roles y Dominios](#roles-y-dominios)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Variables de Entorno](#variables-de-entorno)
- [Comandos Disponibles](#comandos-disponibles)
- [Conexión con la API (FastCashierBE)](#conexión-con-la-api-fastcashierbe)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Rutas de la Aplicación](#rutas-de-la-aplicación)

---

## Descripción del Proyecto

FastCashierFE es el cliente web del sistema **FastCashier**, un POS moderno orientado a restaurantes. Integra tres interfaces diferenciadas por rol en una sola SPA:

- **Admin**: Dashboard con KPIs, gestión de usuarios, productos, turnos y reportes de ventas con gráficas comparativas.
- **Cajero (Cashier)**: Catálogo de productos, carrito de pedidos, apertura/cierre de sesión con resumen financiero, historial de órdenes y estadísticas de turno.
- **Cocina (Kitchen)**: Monitor de órdenes en tiempo real con WebSockets, actualización de estados, historial y notificación de audio por TTS.
- **Display Público (TV)**: Vista pública token-based para mostrar el menu en pantallas de cliente

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
| :--- | :--- | :--- |
| UI Framework | React (con React Compiler) | ^19.2.0 |
| Lenguaje | TypeScript | ~5.9.3 |
| Build Tool | Vite | ^7.2.4 |
| Estilos | Tailwind CSS v4 + tw-animate-css | ^4.1.18 |
| Componentes | Radix UI (headless) + Shadcn/UI | Multiple |
| Routing | React Router DOM | ^7.12.0 |
| Server State | TanStack Query (React Query) | ^5.90.16 |
| Client State | Zustand | ^5.0.9 |
| HTTP Client | Axios | ^1.13.2 |
| Formularios | React Hook Form + Zod | ^7.71.1 / ^4.3.5 |
| Notificaciones | Sonner (Toast) | ^2.0.7 |
| Iconos | Lucide React | ^0.562.0 |
| Gráficas | Recharts | ^3.8.0 |
| WebSocket | Socket.IO Client | ^4.8.1 |
| Animaciones | Motion (Framer Motion) | ^12.38.0 |
| PWA | vite-plugin-pwa | ^1.2.0 |

---

## Arquitectura General

```
Componente
    │
    ▼
Zustand Store (estado cliente: sesión, carrito, tema, auth)
    │
    ▼
TanStack Query Hook (useQuery / useMutation)
    │
    ▼
Service Function (src/api/)
    │
    ▼
Axios Instance → FastCashierBE (http://localhost:3000/api)
    ▲
    │ (real-time)
Socket.IO (/orders) → useKitchenSocket → invalidateQueries()
```

**Flujo de autenticación**: JWT almacenado en `localStorage['token']` y sincronizado en el store de Zustand. Un interceptor de Axios inyecta el token en cada request. Si el servidor responde con 401, el interceptor hace logout automático y redirige a `/login`.

---

## Roles y Dominios

| Rol | Ruta Base | Color Identidad | Descripción |
| :--- | :--- | :--- | :--- |
| `ADMIN` | `/admin` | Azul (`primary`) | Gestión total del sistema |
| `CASHIER` | `/cashier` | Esmeralda (`emerald-500`) | Caja, pedidos y estadísticas de turno |
| `KITCHEN` | `/kitchen` | Ámbar/Naranja (`orange-500`) | Monitor de órdenes en tiempo real |
| Public TV | `/display/:token` | Violeta (`violet-400`) | Pantalla pública sin autenticación |

---

## Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **FastCashierBE** corriendo localmente (ver sección de conexión con la API)

---

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd FastCashierFE
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus valores (ver sección siguiente).

### 4. Levantar el servidor de desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`.

---

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# URL base de la API de FastCashierBE
# El cliente Axios usa esta URL como baseURL: ${VITE_API_URL}
# El cliente WebSocket elimina el sufijo /api para conectarse al servidor de Socket.IO
VITE_API_URL=http://localhost:3000/api
```

> **Nota**: Todas las variables expuestas al cliente deben tener el prefijo `VITE_`. El archivo `.env` **no** debe commitearse al repositorio si contiene valores sensibles.

### Ejemplo `.env.example`

```env
VITE_API_URL=http://localhost:3000/api
```

---

## Comandos Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo con HMR |
| `npm run build` | Compila TypeScript y genera el bundle de producción |
| `npm run preview` | Sirve el bundle de producción localmente |
| `npm run lint` | Ejecuta ESLint sobre todo el proyecto |

---

## Conexión con la API (FastCashierBE)

Este frontend consume la API REST de **FastCashierBE** (NestJS). Para conectarlos:

### 1. Levantar el backend

Asegúrate de tener FastCashierBE corriendo. Por defecto escucha en el puerto `3000`:

```bash
# En el directorio de FastCashierBE
npm run start:dev
```

### 2. Verificar la URL de la API

En el archivo `.env` del frontend, la variable `VITE_API_URL` debe apuntar al backend:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. CORS

El backend debe tener CORS habilitado para aceptar peticiones desde `http://localhost:5173` (o el puerto donde corra el frontend).

### 4. WebSocket

El cliente Socket.IO se conecta al namespace `/orders` del backend. La URL se deriva automáticamente de `VITE_API_URL` eliminando el sufijo `/api`:

```
VITE_API_URL=http://localhost:3000/api → Socket conecta a ws://localhost:3000/orders
```

### 5. Endpoints principales consumidos

| Dominio | Método | Endpoint |
| :--- | :--- | :--- |
| Auth | POST | `/auth/login` |
| Auth | POST | `/auth/register` |
| Órdenes | POST | `/orders` |
| Órdenes | GET | `/orders/kitchen-display` |
| Órdenes | PATCH | `/orders/:id/status` |
| Sesiones de Caja | POST | `/cashier-sessions` |
| Sesiones de Caja | POST | `/cashier-sessions/:id/close` |
| Sesiones de Caja | GET | `/cashier-sessions/current/:userId` |
| Métricas Admin | GET | `/orders/metrics/dashboard` |
| Dashboard | GET | `/dashboard/summary` |
| Reportes | GET | `/reports/sales` |
| Reportes | GET | `/reports/payment-methods` |
| Reportes | GET | `/reports/order-types` |
| Productos | GET/POST/PATCH | `/products` |
| Usuarios | GET/PATCH/DELETE | `/users/:id` |
| Display TV | GET | `/display/:token` |
| TTS | GET | `/tts/pedido/:numero` |

---

## Estructura del Proyecto

```
src/
├── api/                    # Capa de servicios HTTP (Axios)
│   ├── axiosConfig.ts      # Instancia base, interceptores JWT y 401
│   ├── orderService.ts     # CRUD de órdenes
│   ├── cashierSessionService.ts  # Sesiones de caja
│   ├── adminMetricsService.ts    # KPIs del dashboard admin
│   ├── reportService.ts    # Reportes avanzados (ventas, pagos, tipos de orden)
│   ├── dashboardService.ts # Resumen unificado del dashboard (v2)
│   ├── displayService.ts   # Display TV público y configuraciones
│   └── ttsService.ts       # Text-to-Speech del backend (MP3)
├── components/
│   ├── ui/                 # 23 primitivos Radix/Shadcn (Button, Dialog, Chart, etc.)
│   ├── layout/             # Shell de la app (Sidebar, Navbar, layouts por rol)
│   ├── cashier/            # Componentes del dominio Cajero
│   ├── kitchen/            # Componentes del dominio Cocina
│   ├── admin/              # Componentes del dominio Admin
│   ├── Dashboard/          # Métricas y cards del dashboard admin
│   ├── products/           # CRUD de productos
│   ├── users/              # CRUD de usuarios
│   ├── auth/               # Formulario de login
│   └── shared/             # Componentes reutilizables entre dominios
├── config/
│   └── queryClient.ts      # Config global de TanStack Query
├── constants/              # Roles, menús de navegación por rol
├── hooks/                  # 24+ hooks (wrappers de TanStack Query, WebSocket, TTS)
├── lib/
│   ├── utils.ts            # cn() — clsx + tailwind-merge
│   └── socket.ts           # Instancia de Socket.IO (/orders)
├── pages/                  # Páginas por rol + DisplayPage pública
├── schemas/                # Esquemas Zod (auth, products, display)
├── store/                  # Stores de Zustand (auth, cashier, theme)
├── types/                  # Tipos TypeScript globales
├── utils/                  # Utilidades (fechas, impresión, audio, roles)
├── App.tsx                 # Router raíz con guards por rol
├── main.tsx                # Entry point: providers y configuración global
└── index.css               # Sistema de diseño Tailwind v4 (tokens OKLCH)
```

---

## Rutas de la Aplicación

```
/login                   → Página de login (pública)
/admin                   → Dashboard Admin
/admin/usuarios          → Gestión de usuarios
/admin/productos         → Gestión de productos
/admin/turnos            → Historial de turnos/sesiones
/admin/ordenes           → Monitor de órdenes (admin)
/admin/reportes          → Reportes y gráficas de ventas
/admin/profile           → Perfil del administrador
/admin/settings          → Configuración (display TV, etc.)
/cashier/pedidos         → Caja — catálogo y carrito de pedidos
/cashier/historial       → Historial de órdenes del turno
/cashier/estadisticas    → Estadísticas del turno activo
/kitchen/pedidos         → Cocina — monitor de órdenes en tiempo real
/kitchen/historial       → Historial de órdenes completadas
/display/:token          → Display público para TV (sin autenticación)
/                        → Redirige al rol del usuario autenticado o a /login
```

Todas las rutas de `/admin`, `/cashier` y `/kitchen` están protegidas por `ProtectedRoute`, que verifica el JWT y el rol del usuario. El acceso a una ruta con rol incorrecto redirige a `/login`.

# 🏗️ Architecture & Stack — FastCashierFE

Deep reference for all technical foundations, project structure, data flow, and routing conventions for FastCashierFE.

---

## 🛠️ Tech Stack & Versions

| Layer | Technology | Version |
| :--- | :--- | :--- |
| **UI Framework** | React | ^19.2.0 (with React Compiler via `babel-plugin-react-compiler`) |
| **Language** | TypeScript | ~5.9.3 |
| **Build Tool** | Vite | ^7.2.4 |
| **Styling** | Tailwind CSS v4 + `tw-animate-css` | ^4.1.18 |
| **Component Library** | Radix UI (headless) + Shadcn/UI patterns | Multiple |
| **Routing** | React Router DOM | ^7.12.0 |
| **Server State** | TanStack Query (React Query) | ^5.90.16 |
| **Client State** | Zustand | ^5.0.9 |
| **HTTP Client** | Axios | ^1.13.2 |
| **Forms** | React Hook Form + Zod | ^7.71.1 / ^4.3.5 |
| **Notifications** | Sonner (Toast) | ^2.0.7 |
| **Icons** | Lucide React | ^0.562.0 |

**API Base URL:** `http://localhost:3000/api` — configurable via `VITE_API_URL` in `.env`.

---

## 📂 Source Directory Reference (`src/`)

```
src/
├── api/                    # HTTP service layer (Axios)
│   ├── axiosConfig.ts      # Base instance, auth & 401 interceptors
│   ├── cashierSessionService.ts
│   ├── orderService.ts
│   └── adminMetricsService.ts
├── components/             # All UI components
│   ├── ui/                 # 22 low-level Radix/Shadcn primitives (Button, Dialog, etc.)
│   ├── layout/             # App shell: Sidebar, Navbar, Cashier & Kitchen layouts
│   ├── cashier/            # Cashier domain: ProductCatalog, OpenRegisterForm, OrderSummary, history/, stats/
│   ├── kitchen/            # Kitchen domain: KitchenOrderCard, KitchenHistoryCard, KitchenOrderColumn
│   ├── admin/              # Admin: TurnoDetalleCard, turno-detalle/, ordenes/
│   ├── products/           # Product CRUD dialogs and grid components
│   ├── users/              # User CRUD dialogs and user table
│   ├── Dashboard/          # Admin dashboard metrics components
│   ├── auth/               # LoginForm and related auth components
│   └── shared/             # Cross-domain reusable components
├── config/
│   └── queryClient.ts      # TanStack Query global config (staleTime: 5min, retry: 1)
├── constants/
│   ├── roles.ts            # ROLES map, getRoleById, getRoleRoute helpers
│   ├── menu.constants.ts   # Admin sidebar menu items
│   ├── cashier-menu.constants.ts   # Cashier sidebar menu items
│   └── kitchen-menu.constants.ts  # Kitchen sidebar menu items
├── hooks/                  # 17 custom hooks (all TanStack Query wrappers)
├── pages/
│   ├── LoginPage.tsx
│   ├── AdminPage.tsx       # Admin shell with collapsible Sidebar + Navbar
│   ├── CashierPage.tsx     # Cashier shell (starts collapsed, emerald identity)
│   ├── KitchenPage.tsx     # Kitchen shell (xl: breakpoint for desktop transition)
│   ├── admin/              # 8 Admin sub-views
│   ├── cashier/            # 3 Cashier sub-views
│   └── kitchen/            # 2 Kitchen sub-views
├── schemas/
│   ├── auth.schema.ts      # loginSchema, createUserSchema, updateUserSchema
│   └── products.schema.ts  # createProductSchema, updateProductSchema
├── store/
│   ├── authStore.ts        # JWT auth, login/logout (persist: 'auth-storage')
│   ├── useCashierStore.ts  # Active session + shopping cart (persist: 'cashier-storage')
│   └── themeStore.ts       # Light/Dark mode (persist: 'theme-storage')
├── types/
│   ├── auth.ts             # User, AuthResponse, LoginCredentials, UserWithRole, Role
│   ├── cashierSession.ts   # CashierSession, SessionStatistics, CreateSessionDto, CloseSessionDto
│   ├── order.ts            # Order, OrderDetail, CreateOrderDto, OrderStatus, OrderType, PaymentMethod
│   ├── products.ts         # Product, Category, ProductsGroupedByCategory
│   ├── adminMetrics.ts     # DashboardMetricsResponse, TopProduct, MetricsParams, Period
│   └── dashboard.types.ts  # Dashboard-specific display types
├── utils/
│   ├── voice.utils.ts      # Web Speech API — speakOrderReady() with LATAM voice prioritization
│   ├── print.utils.tsx     # Thermal printer via hidden iframe (80mm ticket)
│   ├── session.utils.ts    # groupSessionsByDate, formatDateHeader
│   ├── date.utils.ts       # formatDate, formatDateLong, formatTime (es-ES locale)
│   ├── role.utils.ts       # getRoleBadgeConfig, getRoleNameInSpanish
│   ├── product.utils.ts    # Product-specific format helpers
│   ├── error-handlers.ts   # Centralized Axios error message extraction
│   └── string.utils.ts     # General string formatting
├── App.tsx                 # Root router (BrowserRouter, ProtectedRoute guards)
├── main.tsx                # Entry point: QueryClientProvider, Toaster, StrictMode
└── index.css               # Tailwind v4 design system (OKLCH tokens, role identities, typography classes)
```

---

## 🧩 Core Business Entities

### 👤 User & Auth
- **Roles**: `ADMIN` (ID 1), `CASHIER` (ID 2), `KITCHEN` (ID 3).
- **User fields**: `idUser`, `fullName`, `email`, `roleId`, `isActive`, `phone`, `lastAccess`.
- **Session**: JWT stored both in `localStorage` (key `'token'`) and Zustand `auth-storage`.
- **Auto-logout**: 401 interceptor in `axiosConfig.ts` detects expired tokens, clears `localStorage` and hard-redirects to `/login`.

### 💰 Cashier Session (`CashierSession`)
- **Lifecycle**: `OPEN` → `CLOSED`.
- **Key fields**: `idSession`, `userId`, `openingDate`, `closingDate`, `initialAmount`, `totalCash`, `totalQr`, `totalSales`, `orderCount`, `difference`, `status`.
- **DTOs**: `CreateSessionDto` (userId, openingDate, initialAmount, observations?), `CloseSessionDto` (closingCashAmount, closingDate, closingQrAmount).
- **Statistics**: `SessionStatistics` includes `expectedCash`, `expectedQr`, `averageOrderValue`, `responsiblePerson`.
- **State**: `useCashierStore` persists `currentSession` and `isSessionActive`. `setSession()` is the canonical method — it checks `session.status === 'OPEN'` automatically.

### 📝 Order (`Order`)
- **Statuses**: `PENDING` → `IN_PREPARATION` → `READY` → `DELIVERED` (or `CANCELLED`).
- **Types**: `DINE_IN` | `TAKEOUT`.
- **Payment**: `CASH` | `QR`.
- **Key fields**: `orderNumber`, `subtotal`, `total`, `amountPaid`, `changeAmount`, `customer`, `tableNumber`, `observations`, `cookId`.
- **Details**: `OrderDetail[]` with `productId`, `quantity`, `unitPrice`, `subtotal`, and the full `Product` object.

### 🍱 Product & Category
- **Product**: `idProduct`, `code`, `name`, `description`, `price` (string decimal), `imageUrl`, `isActive`.
- **Category**: `idCategory`, `name`, `description`, `imageUrl`, `order`, `productCount`, `products[]`.
- **Image upload**: `multipart/form-data` via `useCreateProduct` / `useUpdateProduct` hooks — max 20MB, JPG/PNG/WEBP.

### 📊 Admin Metrics (`DashboardMetricsResponse`)
- Endpoint: `GET /orders/metrics/dashboard`
- Response: `{ summary: {totalSales, orderCount, averageTicket}, kitchen: {averageKitchenTime}, channels: {dineIn, takeout}, topProducts: [{name, imageUrl, totalQuantity}] }`.
- Period filter: `'today' | '7d' | 'this-month' | 'range'` (with optional `startDate`/`endDate`).

---

## 🔀 Routing Strategy

```
/login                     → LoginPage (public, rediriges to role route if authenticated)
/admin/*                   → AdminPage (ProtectedRoute: ['ADMIN'])
  /admin                   → DashboardView
  /admin/usuarios          → UsuariosView
  /admin/productos         → ProductosView
  /admin/turnos            → TurnosView
  /admin/ordenes           → OrdenesView
  /admin/reportes          → ReportesView
  /admin/profile           → ProfileView
  /admin/settings          → SettingsView
/cashier/*                 → CashierPage (ProtectedRoute: ['CASHIER'])
  /cashier                 → redirects to /cashier/pedidos
  /cashier/pedidos         → PedidosView
  /cashier/historial       → HistorialView
  /cashier/estadisticas    → EstadisticasView
/kitchen/*                 → KitchenPage (ProtectedRoute: ['KITCHEN'])
  /kitchen                 → redirects to /kitchen/pedidos
  /kitchen/pedidos         → PedidosView (kitchen)
  /kitchen/historial       → HistorialView (kitchen)
/                          → Redirects to role route or /login
/*                         → Redirects to /
```

`ProtectedRoute` reads `useAuthStore` and checks `allowedRoles`. Unauthenticated users → `/login`. Wrong role → `/login`.

---

## 🔁 Data Flow Architecture

```
 Component
    │
    │ reads state
    ▼
 Zustand Store ◄─────────── setSession / clearCart / logout
    │
    │ triggers on mutation success
    ▼
 TanStack Query Hook (useQuery / useMutation)
    │
    │ calls service
    ▼
 Service Function (src/api/)
    │
    │ uses
    ▼
 Axios Instance (axiosConfig.ts)
    │
    │ JWT from localStorage (request interceptor)
    ▼
 FastCashierBE (http://localhost:3000/api)
```

---

## 📡 Complete API Endpoint Map

| Service | Method | Endpoint | Purpose |
| :--- | :--- | :--- | :--- |
| `orderService` | POST | `/orders` | Create order |
| `orderService` | GET | `/orders/session/:id` | Orders by cashier session |
| `orderService` | POST | `/orders/:id/cancel` | Cancel order with reason |
| `orderService` | GET | `/orders/kitchen-display` | Active orders for kitchen |
| `orderService` | PATCH | `/orders/:id/status` | Update order status (+ cookId) |
| `orderService` | GET | `/orders/history` | Kitchen completed order history |
| `cashierSessionService` | POST | `/cashier-sessions` | Open session |
| `cashierSessionService` | POST | `/cashier-sessions/:id/close` | Close session |
| `cashierSessionService` | GET | `/cashier-sessions` | List sessions (filter: status/period) |
| `cashierSessionService` | GET | `/cashier-sessions/:id/statistics` | Session stats |
| `adminMetricsService` | GET | `/orders/metrics/dashboard` | Admin KPI dashboard |
| `adminMetricsService` | GET | `/orders/metrics/cancellations` | Cancellation audit |
| User mutations | POST | `/auth/register` | Create user |
| User mutations | PATCH | `/users/:id` | Update user |
| User mutations | DELETE | `/users/:id` | Delete user |
| User mutations | PATCH | `/users/:id/status` | Toggle user active status |
| Product mutations | POST | `/products` | Create product (FormData) |
| Product mutations | PATCH | `/products/:id` | Update product (FormData or JSON) |

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
| **Charts** | Recharts | ^3.8.0 |
| **WebSocket** | Socket.IO Client | ^4.8.1 |
| **PWA** | vite-plugin-pwa | ^1.2.0 |

**API Base URL:** `http://localhost:3000/api` — configurable via `VITE_API_URL` in `.env`.

---

## 📂 Source Directory Reference (`src/`)

```
src/
├── api/                    # HTTP service layer (Axios) + TTS
│   ├── axiosConfig.ts      # Base instance, auth & 401 interceptors
│   ├── cashierSessionService.ts  # Session open/close/current/stats/history
│   ├── orderService.ts     # Order CRUD, kitchen display, status updates
│   ├── adminMetricsService.ts    # Dashboard KPIs and cancellation audit
│   ├── displayService.ts   # Public TV display configs and data (public/private mix)
│   ├── reportService.ts    # Advanced reports: Sales, Payment methods, Order types
│   ├── dashboardService.ts # Unified dashboard summary (Dashboard v2)
│   └── ttsService.ts       # Backend TTS: parseOrderNumber() + fetchOrderAudio()
├── components/             # All UI components
│   ├── ui/                 # 23 low-level Radix/Shadcn primitives (Button, Dialog, Chart, etc.)
│   ├── layout/             # App shell: Sidebar, Navbar, Cashier & Kitchen layouts
│   ├── cashier/            # Cashier domain:
│   │   ├── ProductCatalog, OpenRegisterForm, OrderSummary
│   │   ├── CloseSessionDialog   # Enhanced session close with QR, thermal print, PDF
│   │   ├── RequireCashierSession # Backend-first session guard (replaces Zustand-only check)
│   │   ├── history/        # HistoryHeader, HistorySearch, HistoryTable, HistoryTableRow
│   │   └── stats/          # StatsGrid, StatsHeader, CashClosingCard, SalesDistributionCard, StatsSkeleton, StatsError
│   ├── kitchen/            # KitchenOrderCard, KitchenHistoryCard, KitchenOrderColumn
│   ├── admin/              # TurnoDetalleCard, turno-detalle/, ordenes/
│   │   └── Reports/        # SalesLineChart (Recharts line chart with date range + granularity)
│   ├── Dashboard/          # DashboardHeader, StatCard, StatsGrid (Admin dashboard metrics)
│   ├── products/           # Product CRUD dialogs and grid components
│   ├── users/              # User CRUD dialogs and user table
│   ├── auth/               # LoginForm and related auth components
│   └── shared/             # Cross-domain reusable components:
│       ├── OrderProcessDialog.tsx    # Unified confirm/success order dialog
│       ├── ThermalTicket.tsx         # 80mm order thermal ticket (React → static HTML)
│       └── ThermalSessionTicket.tsx  # 80mm session closure ticket
├── config/
│   └── queryClient.ts      # TanStack Query global config (staleTime: 5min, retry: 1)
├── constants/
│   ├── roles.ts            # ROLES map, getRoleById, getRoleRoute helpers
│   ├── menu.constants.ts   # Admin sidebar menu items
│   ├── cashier-menu.constants.ts   # Cashier sidebar menu items
│   └── kitchen-menu.constants.ts   # Kitchen sidebar menu items
├── hooks/                  # 24 custom hooks (TanStack Query wrappers + WebSocket + TTS)
│   ├── useProductMutations.ts # Consolidated product CRUD
│   ├── useUserMutations.ts    # Consolidated user CRUD
│   ├── useDisplay.ts         # Public TV hooks
│   └── ...                   # (see state-fetching.md for full list)
├── lib/
│   ├── utils.ts            # cn() — clsx + tailwind-merge
│   └── socket.ts           # Socket.IO client instance (/orders namespace)
├── pages/
│   ├── LoginPage.tsx
│   ├── AdminPage.tsx       # Admin shell with collapsible Sidebar + Navbar
│   ├── CashierPage.tsx     # Cashier shell (starts collapsed, emerald identity)
│   ├── KitchenPage.tsx     # Kitchen shell (xl: breakpoint for desktop transition)
│   ├── admin/              # 8 Admin sub-views (DashboardView, UsuariosView, ProductosView, TurnosView, OrdenesView, ReportesView, ProfileView, SettingsView)
│   ├── cashier/            # 3 Cashier sub-views (PedidosView, HistorialView, EstadisticasView)
│   ├── kitchen/            # 2 Kitchen sub-views (PedidosView, HistorialView)
│   └── DisplayPage.tsx     # Public TV display view (token-based)
├── schemas/
│   ├── auth.schema.ts      # loginSchema, createUserSchema, updateUserSchema
│   └── products.schema.ts  # createProductSchema, updateProductSchema
├── store/
│   ├── authStore.ts        # JWT auth, login/logout (persist: 'auth-storage')
│   ├── useCashierStore.ts  # Active session + shopping cart (persist: 'cashier-storage')
│   └── themeStore.ts       # Light/Dark mode (persist: 'theme-storage')
├── types/
│   ├── auth.ts             # User, AuthResponse, LoginCredentials, UserWithRole, Role
│   ├── cashierSession.ts   # CashierSession, SessionStatistics, CreateSessionDto, CloseSessionDto, CloseSessionResponse
│   ├── order.ts            # Order, OrderDetail, OrderItem, CreateOrderDto, OrderItemDto, OrderStatus, OrderType, PaymentMethod
│   ├── products.ts         # Product, Category, ProductsGroupedByCategory
│   ├── adminMetrics.ts     # DashboardMetricsResponse, TopProduct, MetricsParams, Period
│   ├── dashboard.types.ts  # Dashboard-specific display types
│   ├── display.ts          # Public TV DisplayConfig and DisplayData types
│   └── reports.ts          # Advanced report response types
├── utils/
│   ├── audioQueue.ts       # AudioQueueManager — sequential audio playback with autoplay unlock
│   ├── print.utils.tsx     # Cross-platform printing: Desktop (auto-print) + Android (manual button)
│   ├── session.utils.ts    # groupSessionsByDate, formatDateHeader
│   ├── date.utils.ts       # formatDate, formatDateLong, formatTime (es-ES locale)
│   ├── role.utils.ts       # getRoleBadgeConfig, getRoleNameInSpanish
│   ├── product.utils.ts    # Product-specific format helpers (formatPrice)
│   ├── error-handlers.ts   # Centralized Axios error message extraction
│   └── string.utils.ts     # General string formatting
├── App.tsx                 # Root router (BrowserRouter, ProtectedRoute guards)
├── main.tsx                # Entry point: QueryClientProvider, Toaster, ReactQueryDevtools, StrictMode
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
- **Key fields**: `idSession`, `userId`, `openingDate`, `closingDate`, `initialAmount`, `totalCash`, `totalQr`, `closingCashAmount`, `closingQrAmount`, `totalSales`, `orderCount`, `difference`, `observations`, `status`, `user?`.
- **DTOs**:
  - `CreateSessionDto`: `userId`, `initialAmount`, `observations?` — **note**: `openingDate` is no longer sent; the server generates it.
  - `CloseSessionDto`: `closingCashAmount`, `closingQrAmount`, `observations?` — **note**: `closingDate` is server-generated.
- **Close Response**: `CloseSessionResponse` returns `{ message, summary }` with detailed financial breakdown including `initialCash`, `cashSales`, `totalExpectedCash`, `declaredCash`, `totalExpectedQr`, `declaredQr`, `difference`, `totalOrders`, `startTime`, `endTime`.
- **Statistics**: `SessionStatistics` includes `expectedCash`, `expectedQr`, `totalOrders`, `cashOrderCount`, `qrOrderCount`, `initialAmount`, `openingDate`, `averageOrderValue`, `totalSales`, `status`, `responsiblePerson`.
- **State**: `useCashierStore` persists `currentSession` and `isSessionActive`. `setSession()` is the canonical method — it checks `session.status === 'OPEN'` automatically.
- **Session Guard**: `RequireCashierSession` component queries the backend (`GET /cashier-sessions/current/:userId`) as the source of truth, then syncs to Zustand. This prevents stale local state from showing incorrect views.

### 📝 Order (`Order`)
- **Statuses**: `PENDING` → `IN_PREPARATION` → `READY` → `DELIVERED` (or `CANCELLED`).
- **Types**: `DINE_IN` | `TAKEOUT`.
- **Payment**: `CASH` | `QR`.
- **Key fields**: `orderNumber`, `subtotal`, `total`, `amountPaid`, `changeAmount`, `customer`, `tableNumber`, `observations`, `cookId`, `preparationStartDate`, `completedDate`.
- **Details**: `OrderDetail[]` with `productId`, `quantity`, `unitPrice`, `subtotal`, and the full `Product` object.
- **OrderItem**: Extends `Product` with `quantity` — used for cart state and display.

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
/login                     → LoginPage (public, redirects to role route if authenticated)
/admin/*                   → AdminPage (ProtectedRoute: ['ADMIN'])
  /admin                   → DashboardView
  /admin/usuarios          → UsuariosView
  /admin/productos         → ProductosView
  /admin/turnos            → TurnosView
  /admin/ordenes           → OrdenesView
  /admin/reportes          → ReportesView (SalesLineChart + export actions)
  /admin/profile           → ProfileView
  /admin/settings          → SettingsView
/cashier/*                 → CashierPage (ProtectedRoute: ['CASHIER'])
  /cashier                 → redirects to /cashier/pedidos
  /cashier/pedidos         → PedidosView (wrapped in RequireCashierSession)
  /cashier/historial       → HistorialView
  /cashier/estadisticas    → EstadisticasView
/kitchen/*                 → KitchenPage (ProtectedRoute: ['KITCHEN'])
  /kitchen                 → redirects to /kitchen/pedidos
  /kitchen/pedidos         → PedidosView (kitchen — WebSocket-driven)
  /kitchen/historial       → HistorialView (kitchen)
/display/:token            → DisplayPage (Public, token-based data fetching)
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
    ▲
    │ (real-time events)
    │
 Socket.IO (/orders namespace)
    │
    │ invalidates queries
    ▼
 useKitchenSocket hook → queryClient.invalidateQueries()
```

---

## 🔌 WebSocket Integration

### Socket Configuration (`src/lib/socket.ts`)
- Uses `socket.io-client` connecting to the `/orders` namespace.
- URL derived from `VITE_API_URL` (strips `/api` suffix) or defaults to `http://localhost:3000`.
- Transport: `websocket` only (no long-polling).
- `autoConnect: true` — connects on import.

### Events Handled (`useKitchenSocket` hook)
| Event | Action |
| :--- | :--- |
| `new_order` | Invalidates `['kitchen-orders']`, shows toast notification |
| `order_status_updated` | Invalidates `['kitchen-orders']`, shows cancellation alert if status is `CANCELLED` (8s duration) |
| `connect_error` | Logs error only if socket is actively trying to connect |

---

## 🔊 Audio Notification System (TTS)

The project uses a **backend-driven TTS** system instead of the browser's SpeechSynthesis API. This ensures consistent voice quality across all platforms, including Android PWAs.

### Architecture
1. **`ttsService.ts`** — Fetches MP3 audio from `GET /api/tts/pedido/:numero`. Parses order numbers (e.g., `ORD-0045` → `45`). Returns a `blob:` URL.
2. **`audioQueue.ts`** — `AudioQueueManager` class (extends `EventTarget`):
   - `unlock()` — Plays a silent WAV to bypass browser autoplay restrictions (dispatches `unlockchange` event).
   - `enqueue(blobUrl)` — Adds audio to queue, processes sequentially.
   - `processQueue()` — Plays one audio at a time, revokes blob URLs after playback.
3. **`useTtsAudio` hook** — React wrapper exposing `isAudioUnlocked`, `unlockAudio()`, `playOrderAudio(orderNumber)`.

### Flow
Kitchen `PedidosView` calls `playOrderAudio(orderNumber)` in the `onSuccess` callback of `useUpdateOrderStatus` when the new status is `READY`.

---

## 🖨️ Printing System

Cross-platform thermal printing using `printComponent()` from `src/utils/print.utils.tsx`:

| Platform | Behavior |
| :--- | :--- |
| **Desktop** | Opens new window → auto-triggers `window.print()` → auto-closes via `onafterprint` |
| **Android** | Opens new window with visible "🖨️ IMPRIMIR TICKET" button — user triggers print manually (preserves user gesture for Android's print engine) |

### Printable Components
- `ThermalTicket` — Order receipt (80mm width, monospace, `es-ES` date formatting).
- `ThermalSessionTicket` — Session closure receipt with full cash/QR financial breakdown.

> **Note**: This is a temporary frontend-only solution. Production-grade approach is server-side PDF (`GET /orders/:id/ticket/pdf`).

---

## 📺 Public Display System (TV)

The project includes a public-facing display system for customers to track their order status (PENDING / READY).

### Architecture
1. **Admin Management**: Admins create "Display Configurations" (tokens) via `ProductosView` or a dedicated Settings view. Each configuration can have its own name (e.g., "Main TV", "Side TV").
2. **Token-based Access**: Displays do not require a user login. They access data via a unique UUID token in the URL: `/display/:token`.
3. **Public API**: `displayService.ts` uses a separate `publicApi` Axios instance (without auth interceptors) to fetch data from `/display/:token`.
4. **Polling Strategy**: To ensure reliability on smart TVs where WebSockets might be unstable or blocked, the display uses a 5-minute refetch interval (`useDisplayData` hook).

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
| `cashierSessionService` | POST | `/cashier-sessions` | Open session (server sets openingDate) |
| `cashierSessionService` | POST | `/cashier-sessions/:id/close` | Close session → returns `CloseSessionResponse` |
| `cashierSessionService` | GET | `/cashier-sessions/current/:userId` | Get current active session for a user |
| `cashierSessionService` | GET | `/cashier-sessions/:id/statistics` | Session stats |
| `cashierSessionService` | GET | `/cashier-sessions` | List sessions (filter: period, startDate, endDate) |
| `cashierSessionService` | GET | `/cashier-sessions/:id/report/pdf` | Download session closure PDF report |
| `ttsService` | GET | `/tts/pedido/:numero` | Backend TTS — returns MP3 audio for order announcement |
| `adminMetricsService` | GET | `/orders/metrics/dashboard` | Admin KPI dashboard |
| `adminMetricsService` | GET | `/orders/metrics/cancellations` | Cancellation audit |
| User mutations | POST | `/auth/register` | Create user |
| User mutations | PATCH | `/users/:id` | Update user |
| User mutations | DELETE | `/users/:id` | Delete user |
| User mutations | PATCH | `/users/:id/status` | Toggle user active status |
| Product mutations | POST | `/products` | Create product (FormData) |
| Product mutations | PATCH | `/products/:id` | Update product (FormData or JSON) |
| `reportService` | GET | `/reports/sales` | Sales evolution report |
| `reportService` | GET | `/reports/payment-methods` | Distribution by payment method |
| `reportService` | GET | `/reports/order-types` | Distribution by order type (Dine-in/Takeout) |
| `displayService` | GET | `/display-configs` | List all TV configurations (Admin) |
| `displayService` | POST | `/display-configs` | Create new TV configuration (Admin) |
| `displayService` | PATCH | `/display-configs/:id` | Update TV configuration (Admin) |
| `displayService` | DELETE | `/display-configs/:id` | Delete TV configuration (Admin) |
| `displayService` | GET | `/display/:token` | **Public** — get active orders for TV |
| `dashboardService` | GET | `/dashboard/summary` | Unified dashboard summary KPIs |

# ⚙️ State & Data Fetching — FastCashierFE

Complete reference for global state (Zustand), server state (TanStack Query), real-time events (WebSocket), audio notifications (TTS), and the HTTP communication layer (Axios).

---

## 💾 Global State — Zustand Stores

All stores use `persist` middleware with `localStorage`. The theme is also applied eagerly in `main.tsx` before React renders to avoid FOUC.

### `authStore.ts` — `useAuthStore`
- **LocalStorage Key**: `auth-storage`
- **State**: `user: User | null`, `isAuthenticated: boolean`.
- **Actions**:
  - `setSession(auth)` — validates the returned role, stores the JWT in raw `localStorage['token']` for Axios interceptors, and sets local auth state.
  - `logout()` — removes `localStorage['token']`, resets all state to null/false.
- **Note**: `role` is derived from `user.roleId` when it is needed; it is not stored separately.

### `useLogin` — authentication mutation
- **Service**: `authService.login(credentials)` calls `POST /auth/login`.
- **Hook**: `useLogin()` wraps the service with `useMutation`, disables retries, removes cached server data from a previous user, then delegates local state to `authStore.setSession()`.

### `useCashierStore.ts` — `useCashierStore`
- **LocalStorage Key**: `cashier-storage`
- **State**: `currentSession: CashierSession | null`, `isSessionActive: boolean`, `orderItems: OrderItem[]`.
- **Actions**:
  - `setSession(session | null)` — **canonical action**. Sets both `currentSession` and automatically derives `isSessionActive` (`= !!session && session.status === 'OPEN'`). Always prefer this over `openSession`.
  - `openSession(session)` — legacy alias, sets `isSessionActive: true` unconditionally.
  - `closeSession()` — nullifies session, sets `isSessionActive: false`, **also clears the cart**.
  - `addItem(product)` — adds product to cart or increments quantity if already present.
  - `removeItem(productId)` — removes item completely.
  - `updateQuantity(productId, delta)` — applies delta, enforces minimum quantity of 1.
  - `clearCart()` — empties `orderItems`.
- **Partialize**: Persists only `currentSession`, `isSessionActive`, and `orderItems`.
- **Important**: `RequireCashierSession` component is the bridge between backend state and Zustand. It queries the backend as the source of truth and calls `setSession()` to sync. Never rely solely on Zustand for session validation.

### `themeStore.ts` — `useThemeStore`
- **LocalStorage Key**: `theme-storage`
- **State**: `theme: 'light' | 'dark'`.
- **Actions**:
  - `toggleTheme()` — flips theme and adds/removes `.dark` class on `document.documentElement`.
  - `setTheme(theme)` — sets explicit theme and updates class.
- **Eager Init**: `main.tsx` reads `theme-storage` from localStorage before rendering React to immediately set the correct class, preventing flash.

---

## 🔄 Server State — TanStack Query

### Global Config (`src/config/queryClient.ts`)
```typescript
{
  staleTime: 300_000,        // 5 minutes — avoids unnecessary refetches
  refetchOnWindowFocus: false,
  retry: 1,
}
```

### Complete Hook Inventory (`src/hooks/`)

#### Query Hooks (Read)
| Hook | Query Key | Source Endpoint | Purpose |
| :--- | :--- | :--- | :--- |
| `useProducts` | `['products']` | `GET /products` | Product catalog, grouped by category |
| `useActiveProducts` | `['products', 'active']` | `GET /products?active=true` | Only active products for cashier catalog |
| `useUsers` | `['users']` | `GET /users` | All users with roles (admin) |
| `useSessionStatistics` | `['cashier-session-statistics', sessionId]` | `GET /cashier-sessions/:id/statistics` | Live stats for the current session |
| `useOrdersBySession` | `['orders', 'session', sessionId]` | `GET /orders/session/:id` | Orders history for a session |
| `useCashierSessionsHistory` | `['cashier-sessions']` | `GET /cashier-sessions` | All sessions (admin turnos/history) |
| `useKitchenOrders` | `['kitchen-orders']` | `GET /orders/kitchen-display` | Live orders for kitchen display |
| `useKitchenHistory` | `['kitchen-history']` | `GET /orders/history` | Completed orders for kitchen |
| `useAdminMetrics` | `['admin-metrics', params]` | `GET /orders/metrics/dashboard` | Dashboard KPIs (legacy) |
| `useDashboardSummary` | `['dashboard-summary']` | `GET /dashboard/summary` | Unified dashboard summary (Dashboard v2) |
| `useSalesReport` | `['salesReport', period]` | `GET /reports/sales` | Sales evolution chart data |
| `usePaymentMethodsReport` | `['paymentMethodsReport', period]` | `GET /reports/payment-methods` | Payment distribution chart data |
| `useOrderTypesReport` | `['orderTypesReport', period]` | `GET /reports/order-types` | Order type distribution chart data |
| `useDisplayConfigs` | `['display-configs']` | `GET /display-configs` | List of TV configurations (Admin) |
| `useDisplayData` | `['display-data', token]` | `GET /display/:token` | **Public** — Active orders for TV display |
| `useAdminNavigation` | — | — | Navigation helper (no API call) |
| `useTest` | `['test']` | — | Dev/testing hook |

#### Mutation Hooks (Write)
| Hook | Exported Mutations | Invalidates | Side Effects |
| :--- | :--- | :--- | :--- |
| `useCashierSession` | `openSession`, `closeSession` | `['current-cashier-session']`, `['cashier-sessions']`, `['cashier-session-statistics']` | Syncs `useCashierStore` via `setSession()`, shows toast. **Close mutation does NOT auto-invalidate** — deferred to `handleFinalize` to prevent premature UI unmounting. |
| `useCreateOrder` | `mutate / mutateAsync` | `['orders']`, `['cashier-session-statistics']` | `clearCart()` on success, toast with order number |
| `useCancelOrder` | `mutate / mutateAsync` | `['orders', 'session']`, `['cashier-session-statistics']` | Toast on success/error |
| `useUpdateOrderStatus` | `mutate / mutateAsync` | `['kitchen-orders']`, `['kitchen-history']` | Reads `authStore.user.idUser` for `cookId`, toast |
| `useCreateProduct` | `mutate / mutateAsync` | `['products']` | (in `useProductMutations.ts`) Sends `multipart/form-data` |
| `useUpdateProduct` | `mutate / mutateAsync` | `['products']` | (in `useProductMutations.ts`) Sends `FormData` if image, JSON otherwise |
| `useCreateUser` | `mutate / mutateAsync` | `['users']` | (in `useUserMutations.ts`) Calls `POST /auth/register` |
| `useUpdateUser` | `mutate / mutateAsync` | `['users']` | (in `useUserMutations.ts`) Calls `PATCH /users/:id` |
| `useDeleteUser` | `mutate / mutateAsync` | `['users']` | (in `useUserMutations.ts`) Calls `DELETE /users/:id` |
| `useToggleUserStatus` | `mutate / mutateAsync` | `['users']` | (in `useUserMutations.ts`) Calls `PATCH /users/:id/status` |
| `useCreateDisplayConfig` | `mutate` | `['display-configs']` | (in `useDisplay.ts`) Creates TV config |
| `useUpdateDisplayConfig` | `mutate` | `['display-configs']` | (in `useDisplay.ts`) Updates TV config |
| `useDeleteDisplayConfig` | `mutate` | `['display-configs']` | (in `useDisplay.ts`) Deletes TV config |

#### WebSocket Hook
| Hook | Events | Purpose |
| :--- | :--- | :--- |
| `useKitchenSocket` | `new_order`, `order_status_updated`, `connect_error` | Real-time kitchen order updates. Invalidates `['kitchen-orders']` on events. Shows cancellation alerts. |

#### Audio Hook
| Hook | Returns | Purpose |
| :--- | :--- | :--- |
| `useTtsAudio` | `{ isAudioUnlocked, unlockAudio(), playOrderAudio(orderNumber) }` | Backend TTS audio playback. Fetches MP3 from `/api/tts/pedido/:numero`, enqueues into `AudioQueueManager`. |

### Data Synchronization Pattern
```typescript
// Standard mutation with invalidation
useMutation({
  mutationFn: serviceFunction,
  onSuccess: () => {
    // 1. Update local Zustand state if needed
    store.setSession(data);
    // 2. Invalidate related server state to trigger refetch
    queryClient.invalidateQueries({ queryKey: ['cashier-sessions'] });
    // 3. Notify user
    toast.success('Operación exitosa');
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.message || 'Error genérico');
  },
});
```

### Deferred Invalidation Pattern (Session Close)
The `useCashierSession.closeSession` mutation intentionally does **NOT** invalidate queries or clear Zustand state in `onSuccess`. This prevents `RequireCashierSession` from unmounting the entire Navbar before the user sees the financial summary. Invalidation is handled manually in `handleFinalize`:
```typescript
// CloseSessionDialog.tsx — handleFinalize()
clearSessionStore();                                            // Clear Zustand
queryClient.invalidateQueries({ queryKey: ['current-cashier-session'] });
queryClient.invalidateQueries({ queryKey: ['cashier-sessions'] });
queryClient.invalidateQueries({ queryKey: ['cashier-session-statistics'] });
```

### Manual Refetch Pattern
Views like `EstadisticasView` expose a `Sincronizar` button:
```typescript
const { data, refetch, isFetching } = useSessionStatistics(sessionId);
// → refetch() is triggered by a button in the UI for user-controlled sync
```

---

## 📡 Backend Communication — Axios

### Instance (`src/api/axiosConfig.ts`)
```typescript
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});
```

### Request Interceptor — JWT Injection
Reads raw token from `localStorage.getItem('token')` and injects it as `Authorization: Bearer <token>`. This runs on every request automatically.

### Response Interceptor — 401 Auto-Logout
```typescript
// Triggers ONLY when:
// 1. Status is 401
// 2. The failing request is NOT /auth/login
// 3. The user previously had a token (was authenticated)
// → removes token from localStorage, hard redirects to /login
```
This prevents false logouts on login page authentication failures.

### FormData Exception
`useCreateProduct` and `useUpdateProduct` override `Content-Type` to `multipart/form-data` when an image `File` is present. The Axios base config default is overridden per-request only.

### TTS Service Exception
`ttsService.ts` uses native `fetch()` instead of the Axios instance because it needs `response.blob()` handling for MP3 audio files. It reads `VITE_API_URL` directly from `import.meta.env`.

---

## 🔌 Real-Time Communication — Socket.IO

### Connection (`src/lib/socket.ts`)
```typescript
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : 'http://localhost:3000';

export const ordersSocket = io(`${SOCKET_URL}/orders`, {
    autoConnect: true,
    transports: ['websocket'],
});
```

### Kitchen Integration
`useKitchenSocket` is used in the Kitchen PedidosView. It listens for real-time events and triggers React Query invalidation to refresh the UI without manual polling.

---

## 🔑 Query Key Conventions

Consistent query keys are critical for invalidation. Follow this naming:

| Data Domain | Query Key Pattern |
| :--- | :--- |
| Products | `['products']`, `['products', 'active']` |
| Users | `['users']` |
| Orders (by session) | `['orders', 'session', sessionId]` |
| Kitchen orders | `['kitchen-orders']` |
| Kitchen history | `['kitchen-history']` |
| Cashier sessions | `['cashier-sessions']` |
| Current cashier session | `['current-cashier-session', userId]` |
| Session stats | `['cashier-session-statistics', sessionId]` |
| Admin metrics | `['admin-metrics', params]` |
| Dashboard summary | `['dashboard-summary']` |
| Sales report | `['salesReport', period]` |
| Payment methods report | `['paymentMethodsReport', period]` |
| Order types report | `['orderTypesReport', period]` |
| Display configs | `['display-configs']` |
| Display data (Public) | `['display-data', token]` |

> **Rule**: When adding a new query, register its key here and in all related mutations' `invalidateQueries` calls.

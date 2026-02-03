# ⚙️ State & Data Fetching (Extended)

This document details how the application handles persistence, communication, and synchronization with the backend.

## 💾 Global State (Zustand)

We use Zustand with the `persist` middleware for data that must survive page refreshes.

### `authStore.ts`
- **Key**: `auth-storage`
- **Responsibility**: JWT Token management, user profile, and authentication status.
- **Methods**: `login(user, token)`, `logout()`, `updateUser(data)`.

### `useCashierStore.ts`
- **Key**: `cashier-storage`
- **Responsibility**: Management of the active cashier session.
- **Properties**: `currentSession`, `isSessionActive`.
- **Methods**: `openSession(sessionData)`, `closeSession()`.

### `themeStore.ts`
- **Key**: `theme-storage`
- **Responsibility**: Light/Dark mode state.

---

## 🔄 Server State (TanStack Query)

### Global Config (`src/config/queryClient.ts`)
- `staleTime`: 300,000ms (5 minutes).
- `refetchOnWindowFocus`: `false`.
- `retry`: 1.

### Data Synchronization Pattern
1. **Fetch**: Wrapped in a custom hook (e.g., `useSessionStatistics.ts`).
2. **Mutate**: Use `useMutation` for POST/PUT/DELETE in hooks like `useCreateOrder.ts` or `useCancelOrder.ts`.
3. **Invalidate**: Upon successful mutation, invalidate the related query key to trigger an automatic background refetch:
   ```typescript
   onSuccess: () => {
     // Trigger update for global statistics
     queryClient.invalidateQueries({ queryKey: ['cashier-session-statistics'] });
     // Trigger update for order history
     queryClient.invalidateQueries({ queryKey: ['orders'] });
   }
   ```
4. **Manual Sync**: Views like `EstadisticasView` provide a fallback "Sincronizar" button using the `refetch` function for user control.

---

## 📡 Backend Communication (Axios)

### Configuration (`src/api/axiosConfig.ts`)
The `api` instance is pre-configured with:
- `baseURL`: From environment (`VITE_API_URL`).
- `headers`: `Content-Type: application/json`.

### Interceptors
- **Request Interceptor**: intercepts every request to inject the JWT from `authStore`.
- **Response Interceptor**:
  - `Success`: Returns `response.data`.
  - `Error (401)`: Triggered when the token expires or is invalid. Executes `authStore.logout()` and redirects the user to `/login`.

### Service Patterns
Services are organized by module in `src/api/`.
- **Cashier Session**: `cashierSessionService.ts` handles opening, closing, and statuses.
- **Orders**: `orderService.ts` handles creation and history.
- **Users**: Admin CRUD operations.

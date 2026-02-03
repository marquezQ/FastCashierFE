# 🏗️ Architecture & Stack (Extended)

This document provides a deep dive into the technical foundations and organizational patterns of FastCashierFE.

## 🛠️ Tech Stack & API

- **Core**: React 19 (React Compiler active), TypeScript 5.9.
- **API Base**: `http://localhost:3000/api` (configurable via `VITE_API_URL`).
- **Data Flow**: TanStack Query manages server state, Zustand manages client/global state, and Axios handles requests.

## 📂 Folder Guide (Deep Dive)

| Directory | Purpose | Key Patterns |
| :--- | :--- | :--- |
| `src/api/` | Data fetching logic. | Axios instances, interceptors (auth), and service functions per module (e.g., `orderService.ts`). |
| `src/components/` | Modular UI elements. | `ui/` for low-level Radix/Shadcn, specialized folders (e.g., `cashier/`) for business components. |
| `src/constants/` | Constant values. | Role definitions, menu structures, and static configuration. |
| `src/hooks/` | Business & logic reuse. | Wrappers around TanStack Query (`useQuery`/`useMutation`) to keep components clean. |
| `src/pages/` | Routing entry points. | Layout-specific pages (e.g., `CashierPage.tsx`) that use `<Outlet />` for sub-routes. |
| `src/schemas/` | Type enforcement. | Zod schemas paired with React Hook Form types. |
| `src/store/` | Global state. | Zustand stores with `persist` middleware for things like auth and active sessions. |
| `src/types/` | TS Type definitions. | Global interfaces shared across the app. |

## 🧩 Core Business Entities

### 👤 User & Role
- **Roles**: `ADMIN` (ID 1), `CASHIER` (ID 2), `KITCHEN` (ID 3).
- **Session Auth**: Managed via JWT in `localStorage` (`auth-storage`).

### 💰 Cashier Session
- **Properties**: `idSession`, `idUser`, `openingDate`, `initialAmount`, `expectedCash`, `expectedQr`.
- **Flow**: A cashier must open a register (`OpenRegisterForm`) before accessing sales or stats.

### 📝 Order
- **Structure**: Contains `items` (Product variants), `totalAmount`, `paymentMethod` (Cash/QR), and `orderType` (Dine-in/Takeout).
- **Validation**: Enforced via Zod during creation.

### 🍱 Product & Category
- **Hierarchy**: Categories contain multiple Products.
- **Attributes**: `code`, `price` (as string/decimal), `imageUrl`.

## 🔀 Routing Strategy
We use `react-router-dom` with a "Layout Pattern":
1. **Public**: `/login`.
2. **Protected**: Wrapped in `ProtectedRoute` checking for `authStore`.
3. **Role-Based**: Nested layouts like `/admin/*` or `/cashier` that render their respective views via `<Outlet />`.

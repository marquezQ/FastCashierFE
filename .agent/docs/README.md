# 📚 AI Context Directory — FastCashierFE

This folder contains structured technical documentation designed to give any AI agent immediate, accurate context about the FastCashierFE project — without requiring a full codebase scan.

---

## 📂 Documentation Map

| File | Description |
| :--- | :--- |
| 🏗️ [architecture.md](./architecture.md) | Full tech stack, folder structure, all business entities (Order, Session, Product, User), complete API endpoint map, WebSocket events, and routing tree. |
| ⚙️ [state-fetching.md](./state-fetching.md) | Three Zustand stores (auth, cashier, theme), all 19 custom hooks with query keys, mutation side effects, WebSocket integration, and query invalidation patterns. |
| 🎨 [styles-design.md](./styles-design.md) | Tailwind v4 OKLCH design tokens, three role color identities (Admin/Cashier/Kitchen), typography classes, rounding conventions, and CSS utilities. |
| 📝 [forms-validation.md](./forms-validation.md) | React Hook Form + Zod patterns, full schema inventory, File field handling, loading state best practices, and list of forms that still need schemas. |
| 🤖 [ai-agent-guide.md](./ai-agent-guide.md) | AI-specific coding rules, domain quick-start guides, key utility reference, and common mistakes to avoid. |

---

## 🏢 Project Overview

**FastCashierFE** is the frontend for a fast-food restaurant POS system. It serves three distinct user roles, each with their own UI shell and color identity:

| Role | Route | Identity | Key Functionality |
| :--- | :--- | :--- | :--- |
| ADMIN | `/admin/*` | 🔵 Blue | Dashboard KPIs, user CRUD, product CRUD, session history, cancellation audit, sales reports (Recharts), PDF/Excel export |
| CASHIER | `/cashier/*` | 🟢 Emerald/Teal | Order creation, cart management, session open/close with financial summary, thermal printing (80mm), stats, history |
| KITCHEN | `/kitchen/*` | 🟠 Amber/Orange | Real-time order queue (WebSocket), status progression, backend TTS audio announcements, history |

---

## 🚀 Quick Agent Workflow

When assigned a task on this project:

1. **Read this README** to understand the domain.
2. **Read the relevant doc(s)** for your task area (styling task → `styles-design.md`, new API call → `state-fetching.md`, etc.).
3. **Identify the role/domain** you're working in and apply the correct color identity.
4. **Check `src/components/ui/`** before building low-level elements.
5. **Verify query keys** won't break existing invalidation chains.

---

## 📦 Key Technologies at a Glance

```
React 19 (Compiler) · TypeScript 5.9 · Vite 7
Tailwind CSS v4 (OKLCH tokens) · Radix UI / Shadcn
TanStack Query v5 · Zustand v5 · Axios
React Hook Form v7 · Zod v4 · Sonner (toasts)
React Router DOM v7 · Lucide React
Recharts 3 · Socket.IO Client 4 · PWA (vite-plugin-pwa)
```

---

## 🗂 Last Updated
- **Date**: April 2026
- **Analyzed by**: AI Agent (deep full-codebase scan)
- **Covers**: React app source (`src/`), all 3 role shells, 19 hooks, 3 Zustand stores, 5 API services, 6 type files, 2 schemas, 8 utils, WebSocket layer, TTS audio system, thermal printing, full design system

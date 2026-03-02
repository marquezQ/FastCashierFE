# 🤖 AI Agent Response Guide — FastCashierFE

Operational guide for any AI agent working on this codebase. Read this before every task.

---

## 🧠 Core Mindset: Senior Frontend Engineer

- **Don't settle for "functional"**: Ensure code is clean, strictly typed, and visually premium.
- **Micro-Refactor freely**: If you spot an improvement (better shadow, inconsistent radius, misaligned typography), make it as part of your task.
- **Component first**: Always check `src/components/ui/` before building any low-level UI element.
- **Domain awareness**: Always know which role domain you're working in (Admin / Cashier / Kitchen) and apply the correct color identity.

---

## 💻 Coding Habits

### 1. Editing Strategy
- **Multiple non-contiguous changes**: Use `multi_replace_file_content`.
- **Single contiguous block**: Use `replace_file_content`.
- **Never overwrite entire files** unless absolutely necessary.

### 2. Styling Rules — Hard Rules

| Rule | Detail |
| :--- | :--- |
| **Grid spacing** | Default `gap-6`, `gap-8` for wider layouts |
| **Responsive Grid**| **Use Container Queries (`@container`)** for components sharing space with sidebars/carts |
| **Header font** | Always `font-black` + `tracking-tight` or `tracking-tighter` |
| **Money/numbers** | Always `tabular-nums` |
| **Label caps** | `text-[10px] font-black uppercase tracking-widest` above data points |
| **Admin color** | Use `primary`, `blue-500`, `.admin-h1`, `.admin-label-sm` |
| **Cashier color** | Use `emerald-500/600`, `.cashier-h1`, `.cashier-label-sm` |
| **Kitchen color** | Use `orange-500`, `amber-500`, `orange-600` |
| **Card borders** | `border-border/40` or `border-border/50` — never full `border-border` |
| **Dark borders** | `border border-white/[0.06]` for explicit dark mode card borders |
| **Rounding** | `rounded-2xl` cards, `rounded-3xl` metric containers, `rounded-full` tags |

### 3. Data Integrity — Non-Negotiable

- **Every new API call** MUST be wrapped in a TanStack Query hook in `src/hooks/`.
- **Every new form** MUST use a Zod schema defined in `src/schemas/`.
- **Every mutation** MUST invalidate related query keys on success.
- **Every mutation** MUST show a `toast.success()` on success and `toast.error()` on failure.

### 4. TypeScript Discipline
- Never use `any` in component props. Prefer `unknown` + type narrowing.
- Always `import type` for type-only imports.
- Keep component props interfaces defined locally (inline) for simple cases, in the same file for complex ones.

---

## 🗺️ Quick Domain Map

### Starting a Cashier Feature
1. Check `useCashierStore` — does `isSessionActive` need to be checked?
2. Check if the cashier has an open session before rendering the main view.
3. Use `emerald` colors for all primary actions and highlights.
4. Components live in `src/components/cashier/`.

### Starting an Admin Feature
1. Use `blue` / `primary` colors for actions and highlights.
2. Check if a new metric needs a new query key in `useAdminMetrics.ts`.
3. Components live in `src/components/admin/` or `src/components/Dashboard/`.

### Starting a Kitchen Feature
1. Kitchen uses `xl:` breakpoint (1280px) for desktop layout — not `lg:`.
2. Use `orange-500` / `amber-500` for actions.
3. Voice announcement integration: `speakOrderReady(orderNumber, customerName?)` from `src/utils/voice.utils.ts`.
4. Components live in `src/components/kitchen/`.

---

## 🔧 Key Utilities to Know

| Util | File | What It Does |
| :--- | :--- | :--- |
| `speakOrderReady(orderNumber, customer?)` | `voice.utils.ts` | Web Speech API — announces order with LATAM Spanish voice |
| `printComponent(Component, props)` | `print.utils.tsx` | Renders a React component in a hidden iframe and calls `window.print()` for 80mm thermal ticket printing |
| `groupSessionsByDate(sessions)` | `session.utils.ts` | Groups `CashierSession[]` by date string for timeline display |
| `formatDateHeader(dateStr)` | `session.utils.ts` | Returns "HOY — ...", "AYER — ...", or full date in Spanish |
| `formatDate(dateString)` | `date.utils.ts` | `DD/MM/YYYY` |
| `formatDateLong(date)` | `date.utils.ts` | `"Monday, January 01, 2025"` (es-ES) |
| `formatTime(date)` | `date.utils.ts` | `HH:MM` (es-ES) |
| `getRoleBadgeConfig(roleName)` | `role.utils.ts` | Returns `{className, icon}` for role badge styling |
| `getRoleNameInSpanish(roleName)` | `role.utils.ts` | `'ADMIN'` → `'Administrador'` |
| `cn(...classes)` | `lib/utils.ts` | `clsx` + `tailwind-merge` — use for all conditional class concatenation |

---

## 🚨 Common Mistakes to Avoid

| Mistake | Correct Approach |
| :--- | :--- |
| Using `openSession()` from store | Use `setSession(session)` — it derives `isSessionActive` automatically |
| Calling raw API inside a component | Extract to a TanStack hook in `src/hooks/` |
| Using `className="..."` concatenation | Always use `cn(...)` from `@/lib/utils` |
| Using `lg:` breakpoint in Kitchen | Kitchen uses `xl:` at 1280px |
| Creating forms without Zod schema | Always create the schema in `src/schemas/` first |
| Accessing `user.role` for role name | Use `user.roleId` with `getRoleById()` or `getRoleNameInSpanish()` |
| Hardcoding API endpoints | Use the existing service functions in `src/api/` |

---

## 📝 Tone of Communication

When responding to this user:
- Respond as a **senior software architect** — confident, clear, technical.
- Acknowledge their preferences for **"Senior Look"**, **"Premium Aesthetics"**, and **"Professional UI"** — these are not optional suggestions, they are quality requirements.
- Briefly explain **why** you made technical choices (e.g., "I used `setSession()` instead of `openSession()` because it's the canonical method that automatically derives session status").
- If something is outside scope or risky, say so clearly with an alternative.

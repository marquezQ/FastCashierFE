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
| **Public TV color** | Use `violet-400`, `indigo-500`, background `#05050A` |
| **Card borders** | `border-border/40` or `border-border/50` — never full `border-border` |
| **Dark borders** | `border border-white/[0.06]` for explicit dark mode card borders |
| **Rounding** | `rounded-2xl` cards, `rounded-3xl` metric containers, `rounded-full` tags |
| **Dialogs** | `rounded-2xl` or `rounded-3xl` with `shadow-2xl` |
| **Active buttons** | Add `active:scale-95` for tactile feedback on primary actions |

### 3. Data Integrity — Non-Negotiable

- **Every new API call** MUST be wrapped in a TanStack Query hook in `src/hooks/`.
- **Every new form** MUST use a Zod schema defined in `src/schemas/`.
- **Every mutation** MUST invalidate related query keys on success.
- **Every mutation** MUST show a `toast.success()` on success and `toast.error()` on failure.
- **Session close mutation** uses deferred invalidation — do NOT auto-invalidate queries on success (see `state-fetching.md` for the pattern).

### 4. TypeScript Discipline
- Never use `any` in component props. Prefer `unknown` + type narrowing.
- Always `import type` for type-only imports.
- Keep component props interfaces defined locally (inline) for simple cases, in the same file for complex ones.

### 5. Timestamp Discipline
- **Never send timestamps from the frontend** for session open/close operations. The server generates `openingDate` and `closingDate` using its own system clock.
- `CreateSessionDto` only sends `userId`, `initialAmount`, `observations?`.
- `CloseSessionDto` only sends `closingCashAmount`, `closingQrAmount`, `observations?`.

---

## 🗺️ Quick Domain Map

### Starting a Cashier Feature
1. Check `RequireCashierSession` — it guards all cashier views and is the source of truth for session state.
2. Use `useCashierStore` for cart operations; session state is synced from the backend by `RequireCashierSession`.
3. Use `emerald` colors for all primary actions and highlights.
4. Components live in `src/components/cashier/`.
5. For session close flow, study `CloseSessionDialog.tsx` — it uses the deferred invalidation pattern.

### Starting an Admin Feature
1. Use `blue` / `primary` colors for actions and highlights.
2. Check if a new metric needs a new query key in `useAdminMetrics.ts`.
3. Components live in `src/components/admin/` or `src/components/Dashboard/`.
4. For charts/reports, use Recharts with `ChartContainer` and `ChartTooltipContent` from `src/components/ui/chart.tsx`.

### Starting a Kitchen Feature
1. Kitchen uses `xl:` breakpoint (1280px) for desktop layout — not `lg:`.
2. Use `orange-500` / `amber-500` for actions.
3. Audio announcement: Use `useTtsAudio` hook → `playOrderAudio(orderNumber)` — NOT browser SpeechSynthesis.
4. Real-time updates: `useKitchenSocket` hook handles WebSocket events and auto-invalidates queries.
5. Components live in `src/components/kitchen/`.

### Starting a Public Display (TV) Feature
1. Public displays are **unauthenticated**; they use a token in the URL: `/display/:token`.
2. Always fetch data using `useDisplayData(token)` hook.
3. Use `violet-400` / `indigo-500` colors and an ultra-dark background `#05050A`.
4. Components live in `src/components/display/`.
5. Polling is used (5 min) instead of WebSockets to ensure stability on Smart TVs.

---

## 🔧 Key Utilities to Know

| Util | File | What It Does |
| :--- | :--- | :--- |
| `playOrderAudio(orderNumber)` | `useTtsAudio` hook | Fetches MP3 from backend TTS endpoint, enqueues for sequential playback |
| `unlockAudio()` | `useTtsAudio` hook | Plays silent WAV to bypass browser autoplay restrictions (must be user-initiated) |
| `audioQueue` | `utils/audioQueue.ts` | `AudioQueueManager` — sequential audio playback, autoplay unlock, blob URL cleanup |
| `printComponent(Component, props)` | `print.utils.tsx` | Renders React component to static HTML in new window. Desktop: auto-print. Android: manual print button. |
| `groupSessionsByDate(sessions)` | `session.utils.ts` | Groups `CashierSession[]` by date string for timeline display |
| `formatDateHeader(dateStr)` | `session.utils.ts` | Returns "HOY — ...", "AYER — ...", or full date in Spanish |
| `formatDate(dateString)` | `date.utils.ts` | `DD/MM/YYYY` |
| `formatDateLong(date)` | `date.utils.ts` | `"lunes, 1 de enero de 2025"` (es-ES) |
| `formatTime(date)` | `date.utils.ts` | `HH:MM` (es-ES) |
| `formatPrice(value)` | `product.utils.ts` | Formats decimal string as currency |
| `getRoleBadgeConfig(roleName)` | `role.utils.ts` | Returns `{className, icon}` for role badge styling |
| `getRoleNameInSpanish(roleName)` | `role.utils.ts` | `'ADMIN'` → `'Administrador'` |
| `parseOrderNumber(orderNumber)` | `ttsService.ts` | `'ORD-0045'` → `45` (extracts numeric part for TTS API) |
| `cn(...classes)` | `lib/utils.ts` | `clsx` + `tailwind-merge` — use for all conditional class concatenation |

---

## 🚨 Common Mistakes to Avoid

| Mistake | Correct Approach |
| :--- | :--- |
| Using `openSession()` from store | Use `setSession(session)` — it derives `isSessionActive` automatically |
| Checking session state from Zustand only | `RequireCashierSession` queries the backend as source of truth |
| Invalidating queries in session close `onSuccess` | Use deferred invalidation in `handleFinalize` to prevent premature UI unmounting |
| Sending timestamps in session DTOs | Server generates all timestamps — never send `openingDate` or `closingDate` |
| Using `speakOrderReady()` / SpeechSynthesis | **Removed.** Use `useTtsAudio` hook → `playOrderAudio(orderNumber)` for backend TTS |
| Calling raw API inside a component | Extract to a TanStack hook in `src/hooks/` |
| Using `className="..."` concatenation | Always use `cn(...)` from `@/lib/utils` |
| Using `lg:` breakpoint in Kitchen | Kitchen uses `xl:` at 1280px |
| Creating forms without Zod schema | Always create the schema in `src/schemas/` first |
| Accessing `user.role` for role name | Use `user.roleId` with `getRoleById()` or `getRoleNameInSpanish()` |
| Hardcoding API endpoints | Use the existing service functions in `src/api/` |
| Using Axios for TTS audio fetch | `ttsService.ts` uses native `fetch()` for blob handling |

---

## 📝 Tone of Communication

When responding to this user:
- Respond as a **senior software architect** — confident, clear, technical.
- Acknowledge their preferences for **"Senior Look"**, **"Premium Aesthetics"**, and **"Professional UI"** — these are not optional suggestions, they are quality requirements.
- Briefly explain **why** you made technical choices (e.g., "I used `setSession()` instead of `openSession()` because it's the canonical method that automatically derives session status").
- If something is outside scope or risky, say so clearly with an alternative.

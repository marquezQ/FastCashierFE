# 🎨 Styles & Design System — FastCashierFE

Full reference for the OKLCH-based design system, role color identities, layout standards, typography classes, and CSS component utilities.

---

## 🌐 CSS Setup

- **Engine**: Tailwind CSS v4 via `@import "tailwindcss"` (no `tailwind.config.js` file — config lives in CSS).
- **Animations**: `tw-animate-css` imported for utility animations.
- **Dark Mode**: Custom variant `@custom-variant dark (&:is(.dark *))`, toggled by `.dark` class on `<html>`.
- **Theming**: All design tokens are CSS custom properties using OKLCH color space for consistent transitions and accessibility.

---

## 🌈 Role-Based Color Identities

This is a core design rule. Every UI area has a distinct color identity to prevent users from mixing up contexts.

### 🔵 Admin Identity — Blue
| Variable | Value | Purpose |
| :--- | :--- | :--- |
| `--primary` (light) | `oklch(0.55 0.18 255)` | Buttons, active states, primary actions |
| `--primary` (dark) | `oklch(0.65 0.20 255)` | Brighter blue for dark backgrounds |
| `--sidebar` (light) | `oklch(0.20 0.04 250)` | Dark blue sidebar |
| `--sidebar-primary` | `oklch(0.62 0.22 250)` | Active nav item highlight |
| Tailwind classes | `blue-500`, `primary` | Ad-hoc color references |

### 🟢 Cashier Identity — Emerald/Teal
| Variable | Value | Purpose |
| :--- | :--- | :--- |
| `--cashier-sidebar` (light) | `oklch(0.28 0.08 180)` | Dark teal/green sidebar |
| `--cashier-sidebar-primary` | `oklch(0.55 0.14 180)` | Active nav item |
| Tailwind classes | `emerald-500`, `emerald-600`, `emerald-700` | Revenue metrics, session info, CTA buttons |

### 🟠 Kitchen Identity — Amber/Orange
| Variable | Value | Purpose |
| :--- | :--- | :--- |
| `--kitchen-sidebar` (light) | `oklch(0.25 0.08 45)` | Warm dark sidebar |
| `--kitchen-sidebar-primary` | `oklch(0.65 0.22 45)` | Active nav item |
| Tailwind classes | `orange-500`, `amber-500`, `orange-600` | Order cards, action buttons, alerts |

### 🟣 Public TV Display Identity — Violet/Indigo
| Variable | Value | Purpose |
| :--- | :--- | :--- |
| Background | `#05050A` | Ultra-dark OLED-optimized background for TVs |
| Primary Icon | `violet-400` | Branding and status icons |
| Tailwind classes | `violet-400`, `indigo-500` | Branding, progress bars, highlights |
| Animation | `.animate-progress` | TV-specific loading/refresh progress bar |

> **Rule**: When building components, ask "which role/domain does this UI belong to?" and apply the corresponding color family strictly.

---

## 🎨 Full Token Reference (`index.css`)

### Light Mode (`:root`)
| Variable | OKLCH Value | Purpose |
| :--- | :--- | :--- |
| `--background` | `oklch(0.99 0.002 264)` | Page background (almost white, blue-tinted) |
| `--foreground` | `oklch(0.15 0.04 264)` | Primary text (dark blue-black) |
| `--card` | `oklch(1 0 0)` | Pure white card surfaces |
| `--primary` | `oklch(0.55 0.18 255)` | Vibrant blue — primary CTA |
| `--secondary` | `oklch(0.96 0.01 264)` | Light blue-grey — secondary backgrounds |
| `--muted` | `oklch(0.96 0.01 264)` | Muted backgrounds, icon areas |
| `--muted-foreground` | `oklch(0.50 0.03 264)` | Secondary text |
| `--destructive` | `oklch(0.60 0.24 25)` | Error/delete states (red) |
| `--border` | `oklch(0.90 0.01 264)` | Subtle dividers |
| `--radius` | `0.75rem` | Base radius for all rounded corners |

### Dark Mode (`.dark`)
| Variable | OKLCH Value | Purpose |
| :--- | :--- | :--- |
| `--background` | `oklch(0.11 0.01 264)` | Deep dark base (level 0) |
| `--card` | `oklch(0.22 0.02 264)` | Elevated surface (level 2) |
| `--muted` | `oklch(0.18 0.02 264)` | Intermediate surface (level 1) |
| `--popover` | `oklch(0.18 0.03 264)` | Dialogs and dropdowns |
| `--border` | `oklch(1 0 0 / 12%)` | 12% white opacity border — key dark mode pattern |
| `--primary` | `oklch(0.65 0.20 255)` | Brighter blue for dark backgrounds |

> The **elevation strategy** in dark mode is: `background (0.11)` < `muted (0.18)` < `popover (0.18)` < `card (0.22)` < `secondary (0.25)`.

### Chart Colors
Light and dark mode each have 5 chart colors (`--chart-1` through `--chart-5`) optimized for Recharts usage. These are mapped through `@theme inline` as `--color-chart-*`.

### Radius Scale
| Token | Calculation | Approximate value |
| :--- | :--- | :--- |
| `--radius-sm` | `var(--radius) - 4px` | `8px` |
| `--radius-md` | `var(--radius) - 2px` | `10px` |
| `--radius-lg` | `var(--radius)` | `12px` |
| `--radius-xl` | `var(--radius) + 4px` | `16px` |
| `--radius-2xl` | `var(--radius) + 8px` | `20px` |
| `--radius-3xl` | `var(--radius) + 12px` | `24px` |
| `--radius-4xl` | `var(--radius) + 16px` | `28px` |

---

## ✨ Senior UI Rules

### 🪟 Depth & Glassmorphism
- **Cards**: `border border-border/40` or `border-border/50` for soft definition.
- **Sticky/floating elements**: `backdrop-blur-md` or `backdrop-blur-xl`.
- **Elevation**: `shadow-card` (custom), `shadow-sm`, `shadow-md` for increasing depth.
- **Gradient depth**: `bg-gradient-to-br from-emerald-500/[0.03] to-transparent` for subtle warmth in cards.
- **Glassmorphic cards**: `bg-card/60 backdrop-blur-md ring-1 ring-border/50` (used in Reports SalesLineChart).

### 📐 Spacing & Layout Standards
| Context | Class | Notes |
| :--- | :--- | :--- |
| Section grids | `gap-6` or `gap-8` | Default for multi-column layouts |
| Card padding | `p-4` or `p-6` | Use `p-4` for compact, `p-6` for spacious |
| Inner content | `space-y-4` or `space-y-6` | Vertical stacks |
| **Responsive Grids** | **Container Queries** | **Preferred over screen-based breakpoints for complex layouts** |

#### 📦 Container Queries (Modern Pattern)
We use Tailwind 4 `@container` for components that need to be responsive to their parent's width, specifically in the Cashier and Admin dashboards.

**Pattern**:
1. Wrap the area in a named container: `<div className="@container/id ...">`
2. Apply styles based on container width: `@[400px]/id:grid-cols-2`

### 🔡 Typography Classes (from `index.css @layer components`)

#### Admin Domain
```css
.admin-h1      → text-3xl md:text-4xl font-black tracking-tight
.admin-subtitle → text-muted-foreground font-medium mt-1 text-sm md:text-base
.admin-h2      → text-xl font-bold tracking-tight
.admin-label-sm → text-[10px] font-black uppercase tracking-widest text-muted-foreground
```

#### Cashier Domain
```css
.cashier-h1      → text-3xl md:text-4xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight
.cashier-subtitle → text-muted-foreground font-medium mt-1 text-sm md:text-base
.cashier-h2      → text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-500
.cashier-label-sm → text-[10px] font-black uppercase text-emerald-600/70 dark:text-emerald-400/70 tracking-widest
```

#### General Typography Rules
- **Headers**: Always `font-black` + `tracking-tight` or `tracking-tighter`.
- **Metric numbers**: Always `tabular-nums` for prices/quantities.
- **Labels over data**: `text-[10px] uppercase font-black tracking-widest` — acts as a "caption" above values.
- **Gradients**: `text-gradient-primary` (`.bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent`).

### 🧩 Rounding Conventions
| Element | Class |
| :--- | :--- |
| Standard cards | `rounded-2xl` |
| Main metric containers | `rounded-3xl` |
| Analysis/side-by-side blocks | `rounded-[2rem]` |
| Dialog content | `rounded-2xl` or `rounded-3xl` |
| Buttons (default) | `rounded-lg` (via Shadcn variant) |
| Buttons (premium) | `rounded-xl` |
| Tags/badges | `rounded-full` |

---

## 🎭 Animation & Interactivity

- **Engine**: Tailwind 4 Transitions + **Framer Motion** (`motion` package) for complex layout and entrance animations.
- **Global utility**: `.transition-smooth` = `transition-all duration-200 ease-in-out`.
- **Layout transitions**: Sidebar collapse uses `transition-all duration-300` on the content wrapper.
- **Alert pulse**: `animate-pulse` on `AlertCircle` when an order exceeds 20 minutes wait time.
- **Page entrance**: `animate-in fade-in duration-500` used on view wrappers for smooth page transitions.
- **Active scale**: `active:scale-95` on interactive buttons for tactile feedback.
- **Spinner pattern**: `<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />` for inline loading states.
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` resets all animations to `0.01ms` for accessibility.

---

## 📜 Custom CSS Utilities

```css
.no-scrollbar         /* Hides scrollbar but keeps scroll functionality */
.shadow-card          /* box-shadow: 0 1px 3px oklch(0 0 0 / 5%), 0 1px 2px oklch(0 0 0 / 3%) */
.transition-smooth    /* transition-all duration-200 ease-in-out */
.gradient-primary     /* 135deg gradient using --primary */
.text-gradient-primary /* Clipped text gradient from primary to primary/60 */
.animate-progress      /* TV Display refresh progress (scaleX(0) to scaleX(1)) */
```

### Custom Scrollbar Styling
```css
::-webkit-scrollbar      → w-2 h-2
::-webkit-scrollbar-track → bg-secondary
::-webkit-scrollbar-thumb → bg-muted-foreground/30 rounded-md hover:bg-muted-foreground/50
```

---

## 📦 Component Library (Shadcn/UI via Radix)

All low-level components live in `src/components/ui/` (23 components). These are headless Radix primitives with Tailwind styling baked in via `class-variance-authority` (CVA).

**Available UI primitives**: `alert`, `alert-dialog`, `avatar`, `badge`, `button`, `card`, `chart`, `dialog`, `dropdown-menu`, `form`, `input`, `label`, `password-input`, `progress`, `select`, `separator`, `sheet`, `skeleton`, `switch`, `table`, `tabs`, `textarea`, `tooltip`.

> Always check `src/components/ui/` first before building any low-level element. Never duplicate what Shadcn already provides.

### Notable UI Additions (since March 2026)
- **`chart.tsx`** — Recharts wrapper components (`ChartContainer`, `ChartTooltipContent`) with design system integration. Used by `SalesLineChart`.
- **`password-input.tsx`** — Password input with show/hide toggle.
- **`sheet.tsx`** — Radix Sheet (mobile-friendly slide-out panel).
- **`textarea.tsx`** — Styled textarea component.

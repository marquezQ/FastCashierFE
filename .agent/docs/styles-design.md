# 🎨 Styles & Design System (Extended)

This project uses a specialized design system based on Tailwind CSS v4 and OKLCH color spaces.

## 🌈 Role-Based Identities

To distinguish between administrative and operational tasks, the UI uses distinct color anchors:

### 👤 Administrator Identity (Blue/Primary)
- **Primary Color**: `oklch(0.55 0.18 255)` (Blue vibrante)
- **Keywords**: `primary`, `blue-500`
- **Use Case**: Management, reports, user CRUD, global settings.
- **Sidebar Variable**: `--sidebar` (Dark blue/teal context).

### 💵 Cashier Identity (Green/Emerald)
- **Primary Color**: `oklch(0.55 0.14 180)` (Verde azulado/Emerald)
- **Keywords**: `emerald-600`, `emerald-500`
- **Use Case**: Points of sale, session stats, register opening/closing.
- **Sidebar Variable**: `--cashier-sidebar` (Dark green/teal context).

## 💎 Design Tokens (OKLCH)

We use OKLCH for better color transitions and accessibility. Key tokens in `index.css`:

| Variable | Light Mode | Dark Mode | Purpose |
| :--- | :--- | :--- | :--- |
| `--background` | Casi blanco (264) | Base profunda (264) | Page background. |
| `--card` | Blanco puro | Superficie nivel 2 | Component containers. |
| `--primary` | Blue 255 | Bright Blue 255 | Primary actions (Admin default). |
| `--border` | Gray/Blue subtle | 12% opacity white | Separation lines. |

## ✨ Senior UI Framework

### 🪟 Glassmorphism & Depth
- **Blur**: Use `backdrop-blur-md` or `backdrop-blur-xl` for overlays and headers.
- **Elevation**: Use `shadow-card` or `shadow-xl` for main components.
- **Borders**: Most cards should have `border-border/40` or `border-border/50` for a soft definition.

### 📐 Spacing & Radius
- **Grid Gap**: Standard `gap-6` or `gap-8` for sections.
- **Rounding**: `rounded-2xl` for standard cards, `rounded-3xl` for main metric containers, `rounded-[2rem]` for side-by-side analysis blocks.

### 🔡 Typography Patterns
- **Headers**: `font-black` with `tracking-tight` or `tracking-tighter`.
- **Labels**: `text-[10px]` or `text-xs`, `uppercase`, `font-black`, `tracking-widest`.
- **Tabular Data**: Always use `tabular-nums` for prices to ensure readability.
- **Gradients**: Use `bg-gradient-to-br from-emerald-500/[0.03] to-transparent` for subtle depth in cards.

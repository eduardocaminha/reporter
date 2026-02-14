---
name: reporter-design-system
description: >
  Design system and UI conventions for Reporter by Radiologic.
  Use this skill when creating or modifying any UI component,
  page, layout, menu, or interactive element.
---

# Reporter Design System

## When to Use

Apply this skill whenever you:

- Create a new page, route, or layout
- Add or modify a UI component
- Build a menu, modal, dropdown, or interactive element
- Style text, buttons, cards, or inputs
- Add animations or transitions

## Core Principles

1. **Minimal and muted** -- secondary elements use `bg-muted text-muted-foreground`. Avoid loud colors.
2. **Foreground inversion for CTAs** -- primary actions use `bg-foreground text-background` (dark on light, light on dark).
3. **SquircleCard for content areas** -- main content surfaces use `<SquircleCard className="p-8">`, not plain divs or shadcn Card.
4. **Rounded-full buttons, rounded-2xl cards** -- buttons are always `rounded-full` (built into the variant). Cards and alerts use `rounded-2xl`.
5. **Spacious** -- generous padding (`p-8` cards, `px-8 sm:px-12 lg:px-16` containers), ample whitespace.
6. **Consistent motion** -- Framer Motion with `easeOut`, 0.2-0.4s durations, `y` offsets for entry.

## Quick Reference

| Element | Pattern |
|---------|---------|
| Header | `h-[72px]`, `bg-card/80 backdrop-blur-sm border-b border-border/30 sticky top-0 z-50` |
| Container padding | `px-8 sm:px-12 lg:px-16` |
| Max width | `max-w-6xl lg:max-w-none mx-auto` |
| Toolbar button | `variant="ghost"` + `gap-1.5 bg-muted text-muted-foreground hover:text-foreground` + icon `w-3.5 h-3.5` |
| Icon button | `variant="ghost" size="icon"` + `h-8 w-8 bg-muted text-muted-foreground/40 hover:text-muted-foreground` |
| CTA button | `bg-foreground text-background hover:bg-foreground/90 shadow-none rounded-full` |
| Destructive ghost | `bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive` |
| Active toggle | `bg-foreground/80 text-background hover:bg-foreground/70 hover:text-background` |
| Card surface | `<SquircleCard className="p-8">` (cornerRadius=32, bg-card) |
| Error card | `bg-destructive/5 border border-destructive/30 rounded-2xl p-4` |
| Entry animation | `initial={{ opacity: 0, y: 20 }}` + `duration: 0.4, ease: "easeOut"` |
| Dropdown anim | `initial={{ opacity: 0, y: -10 }}` + `duration: 0.2` |
| Expand/collapse | `height: 0 -> "auto"` + `duration: 0.25, ease: [0.25, 0.1, 0.25, 1]` |

## Do

- Use `variant="ghost"` with custom `className` overrides for all toolbar/action buttons.
- Use the same `px-8 sm:px-12 lg:px-16` horizontal padding on every page container.
- Keep the header at exactly `h-[72px]`.
- Use `text-muted-foreground` with opacity levels (`/40`, `/60`) for hierarchy -- never raw gray values.
- Use `AnimatePresence` with `mode="wait"` when switching content (tabs, pages).
- Use `border-border/30` or `border-border/50` for subtle borders -- never full-opacity borders.
- Import motion from `"motion/react"` (not `"framer-motion"`).

## Don't

- Don't use shadcn `Card` for main content areas -- use `SquircleCard` instead.
- Don't hardcode hex/rgb colors -- always use CSS variable tokens (`bg-muted`, `text-foreground`, etc.).
- Don't use `duration` above 0.5s for UI transitions -- keep everything snappy (0.2-0.4s).
- Don't use `border-border` at full opacity -- use `/30` or `/50`.
- Don't add `shadow-*` utilities to buttons -- buttons are flat by design. Use `shadow-none` when overriding defaults.
- Don't use `rounded-lg` or `rounded-md` on buttons -- they are always `rounded-full`.
- Don't create full-screen overlays for menus -- use header expansion or dropdowns.

## References

See `references/` for detailed documentation on each topic:

| File | Content |
|------|---------|
| `tokens-colors.md` | Color tokens, semantic usage, light/dark theme, opacity conventions |
| `tokens-spacing.md` | Spacing scale, padding, gaps, max-widths, header height |
| `typography.md` | Font stack, sizes, weights, tracking, muted levels |
| `components-button.md` | Button variants, sizes, 4 recipe patterns, active states |
| `components-card.md` | SquircleCard, Card, Alert, surface hierarchy |
| `components-input.md` | Input, floating fields, OTP, textarea, focus styles |
| `components-misc.md` | Avatar, Kbd, Switch, Toggle, Tooltip, TextEffect |
| `layout-pages.md` | Page scaffolding: dashboard, login, landing, header menu |
| `motion.md` | Framer Motion conventions, durations, easings, stagger |
| `patterns-interactive.md` | Toggle states, hover, destructive, focus, disabled, errors |

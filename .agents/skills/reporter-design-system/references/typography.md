# Typography

## Font Stack

Defined in `app/layout.tsx` and `app/globals.css`:

```
--font-sans: "Google Sans Flex", "Google Sans Flex Fallback", system-ui, sans-serif
--font-mono: "Google Sans Flex", monospace
```

Google Sans Flex is loaded as a variable font (weight 100-900).

## Heading Scale

| Context | Classes | Size |
|---------|---------|------|
| Page title (login, sections) | `text-xl font-medium tracking-tight text-foreground` | 20px |
| Hero tagline (landing) | `text-6xl font-medium tracking-tight leading-[0.85] drop-shadow-sm` | 60px |
| Landing subtitle | `text-xl font-medium tracking-tight text-muted-foreground/70 leading-tight` | 20px |
| Brand/logo | `text-xl font-medium tracking-tight text-foreground` | 20px |

Key pattern: headings always use `font-medium tracking-tight`. Never `font-bold` or `font-semibold` for UI headings.

## Body Text

| Context | Classes |
|---------|---------|
| Default body | `text-sm` (14px) or `text-base` (16px) |
| Textarea content | `text-base sm:text-lg` (responsive) |
| Report content | Controlled by font-size stepper: `text-xs` / `text-sm sm:text-base` / `text-base sm:text-lg` / `text-lg sm:text-xl` |

## Labels & Small Text

| Context | Classes |
|---------|---------|
| Section label | `text-xs font-medium text-muted-foreground` |
| Button text | `text-sm font-medium` (built into Button) |
| Badge text | `text-[10px] font-semibold` |
| Footer | `text-xl text-muted-foreground/30` |
| Legal/terms | `text-xs text-center text-muted-foreground/40 leading-relaxed` |
| Timestamps | `text-xs text-muted-foreground` |
| Font size control label | `text-[9px] font-medium text-muted-foreground/60` |

## Text Color Hierarchy

From most prominent to least:

1. `text-foreground` -- primary text, headings, active labels
2. `text-foreground/70` -- toolbar button text (inactive)
3. `text-muted-foreground` -- secondary text, descriptions
4. `text-muted-foreground/60` -- dimmed labels, placeholders
5. `text-muted-foreground/40` -- faint text, icon buttons, terms
6. `text-muted-foreground/30` -- footer text

## Placeholder Text

- Inputs: `placeholder:text-muted-foreground/60`
- Textarea (dashboard): `placeholder:text-muted-foreground/30`
- Floating inputs (login): `placeholder:text-transparent` (hidden, label replaces it)

## Font Weight Rules

- `font-medium` (500) -- headings, labels, buttons, brand
- `font-semibold` (600) -- badges only
- `font-bold` (700) -- never used in UI; only in laudo formatting classes (`.laudo-titulo`, `.laudo-secao`)
- Default (400) -- body text, descriptions

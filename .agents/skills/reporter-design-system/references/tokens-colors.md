# Color Tokens

Source: `app/globals.css`

## Light Theme (`:root`)

| Token | Value | Purpose |
|-------|-------|---------|
| `--background` | `oklch(0.985 0.002 260)` | Page background (near-white) |
| `--foreground` | `oklch(0.18 0.01 260)` | Primary text (near-black) |
| `--card` | `oklch(1 0 0)` | Card/surface backgrounds (pure white) |
| `--card-foreground` | `oklch(0.18 0.01 260)` | Text on cards |
| `--primary` | `oklch(0.65 0.1 160)` | Primary accent (green) |
| `--primary-foreground` | `oklch(0.99 0 0)` | Text on primary |
| `--secondary` | `oklch(0.965 0.005 160)` | Secondary surfaces |
| `--secondary-foreground` | `oklch(0.3 0.02 260)` | Text on secondary |
| `--muted` | `oklch(0.965 0.003 260)` | Muted backgrounds (light gray) |
| `--muted-foreground` | `oklch(0.5 0.01 260)` | Secondary/muted text |
| `--accent` | `oklch(0.92 0.04 160)` | Accent surfaces (light green) |
| `--accent-foreground` | `oklch(0.3 0.06 160)` | Text on accent |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Error/destructive (red) |
| `--border` | `oklch(0.935 0.003 260)` | Borders |
| `--input` | `oklch(0.97 0.003 260)` | Input backgrounds |
| `--ring` | `oklch(0.65 0.1 160)` | Focus rings (matches primary) |
| `--radius` | `1rem` | Base border radius |

## Dark Theme (`.dark`)

| Token | Value | Purpose |
|-------|-------|---------|
| `--background` | `oklch(0.145 0 0)` | Page background |
| `--foreground` | `oklch(0.985 0 0)` | Primary text |
| `--card` | `oklch(0.145 0 0)` | Card surfaces |
| `--primary` | `oklch(0.985 0 0)` | Primary (white, inverted) |
| `--primary-foreground` | `oklch(0.205 0 0)` | Text on primary |
| `--muted` | `oklch(0.269 0 0)` | Muted backgrounds |
| `--muted-foreground` | `oklch(0.708 0 0)` | Secondary text |
| `--accent` | `oklch(0.269 0 0)` | Accent surfaces |
| `--destructive` | `oklch(0.396 0.141 25.723)` | Error/destructive |
| `--border` | `oklch(0.269 0 0)` | Borders |
| `--input` | `oklch(0.269 0 0)` | Input backgrounds |
| `--ring` | `oklch(0.439 0 0)` | Focus rings |

## Semantic Usage Map

| Purpose | Tailwind Class |
|---------|----------------|
| Page background | `bg-background` |
| Card/elevated surface | `bg-card` |
| Muted/secondary surface | `bg-muted` |
| Subtle surface | `bg-muted/40` or `bg-muted/50` |
| Primary text | `text-foreground` |
| Secondary text | `text-muted-foreground` |
| Dimmed text | `text-muted-foreground/60` |
| Faint text | `text-muted-foreground/40` |
| Accent surface (hover) | `bg-accent` |
| Accent text | `text-accent-foreground` |
| CTA background | `bg-foreground` |
| CTA text | `text-background` |
| Error background | `bg-destructive/5` |
| Error text | `text-destructive` |
| Error border | `border-destructive/30` |

## Opacity Conventions

| Opacity | Usage |
|---------|-------|
| `/30` | Subtle borders (`border-border/30`) |
| `/40` | Faint text (`text-muted-foreground/40`), icon buttons |
| `/50` | Moderate borders (`border-border/50`), input backgrounds (`bg-input/50`) |
| `/60` | Dimmed text (`text-muted-foreground/60`) |
| `/70` | Active CTA hover (`hover:bg-foreground/70`) |
| `/80` | Active toggle state (`bg-foreground/80`), header bg (`bg-card/80`) |

## Locale-Specific Colors

| Locale | Badge | Pulse Animation |
|--------|-------|-----------------|
| PT (Portuguese) | `bg-amber-500/15 text-amber-700 dark:text-amber-400` | `animate-pulse-amber` |
| EN (English) | `bg-blue-500/15 text-blue-700 dark:text-blue-400` | `animate-pulse-blue` |
| ES (Spanish) | `bg-emerald-500/15 text-emerald-700 dark:text-emerald-400` | `animate-pulse-emerald` |

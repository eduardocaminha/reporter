# Button Component

Source: `components/ui/button.tsx`

Uses `class-variance-authority` (cva). Always `rounded-full`.

## Variants

| Variant | Classes |
|---------|---------|
| `default` | `bg-primary text-primary-foreground hover:bg-primary/85` |
| `destructive` | `bg-destructive text-white hover:bg-destructive/90` |
| `outline` | `border bg-background shadow-none hover:bg-accent hover:text-accent-foreground` |
| `secondary` | `bg-secondary text-secondary-foreground hover:bg-secondary/80` |
| `ghost` | `hover:bg-accent hover:text-accent-foreground` |
| `link` | `text-primary underline-offset-4 hover:underline` |

## Sizes

| Size | Classes |
|------|---------|
| `default` | `h-11 px-7 py-2.5` |
| `sm` | `h-9 gap-1.5 px-5` |
| `lg` | `h-12 px-8 text-base` |
| `icon` | `size-11 rounded-full` |
| `icon-sm` | `size-9 rounded-full` |
| `icon-lg` | `size-12 rounded-full` |

## Recipe Patterns

These are the 4 button "recipes" used throughout the app. When building new features, pick from these -- do not invent new combinations.

### 1. Toolbar Button (most common)

Used for: Radiopaedia, Ditar, History, Copy, menu items.

```tsx
<Button
  variant="ghost"
  className="gap-1.5 bg-muted text-muted-foreground hover:text-foreground"
>
  <Icon className="w-3.5 h-3.5" />
  <span>{label}</span>
</Button>
```

### 2. Icon Button

Used for: hamburger menu, back arrow, close (X), font size controls.

```tsx
<Button
  variant="ghost"
  size="icon"
  className="h-8 w-8 bg-muted text-muted-foreground/40 hover:text-muted-foreground"
>
  <Icon className="w-4 h-4" />
</Button>
```

### 3. CTA Button

Used for: login submit, verify, landing page CTA.

```tsx
<Button
  className="w-full gap-2 rounded-full bg-foreground text-background hover:bg-foreground/90 shadow-none"
>
  <Icon className="w-4 h-4" />
  {label}
</Button>
```

### 4. Destructive Ghost

Used for: logout, clear history.

```tsx
<Button
  variant="ghost"
  className="bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
>
  <Icon className="w-4 h-4" />
  <span>{label}</span>
</Button>
```

## Active/Toggle States

When a toolbar button is "on" (e.g. recording, search active, dropdown open):

```
bg-foreground/80 text-background hover:bg-foreground/70 hover:text-background
```

## Generate Button (special case)

The "Gerar laudo" button uses `size="lg"`:

```tsx
<Button
  size="lg"
  className="gap-2 bg-muted text-foreground/70 hover:bg-accent hover:text-accent-foreground shadow-none"
>
```

## OAuth Buttons

```tsx
<Button
  variant="ghost"
  className="w-full gap-3 rounded-full h-11 bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground shadow-none"
>
```

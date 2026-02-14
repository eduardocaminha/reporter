# Card & Surface Components

## SquircleCard (Primary)

Source: `components/ui/squircle-card.tsx`

The main content surface. Uses `figma-squircle` for smooth rounded corners via clip-path.

### Props

| Prop | Type | Default |
|------|------|---------|
| `cornerRadius` | number | `32` |
| `cornerSmoothing` | number | `0.6` |
| `className` | string | -- |

### Base Class

```
bg-card
```

### Usage

```tsx
// Dictation input area
<SquircleCard className="relative p-8">
  {children}
</SquircleCard>

// Report output
<SquircleCard className={`p-8 min-h-[200px] ${isError ? "text-destructive" : ""}`}>
  {children}
</SquircleCard>
```

Always use `p-8` for inner padding. Use SquircleCard for primary content areas -- not shadcn Card.

## Card (shadcn -- secondary use)

Source: `components/ui/card.tsx`

Available but **not currently used** in the app. Reserve for secondary/settings panels if needed.

```
bg-card text-card-foreground rounded-2xl border border-border/50 py-8
```

## Alert

Source: `components/ui/alert.tsx`

Used in `sugestoes.tsx` for suggestions.

```tsx
// Suggestions alert
<Alert className="bg-accent/30 border-accent/40">
  <AlertTitle className="text-accent-foreground/80">{title}</AlertTitle>
  <AlertDescription>{content}</AlertDescription>
</Alert>
```

Default classes: `rounded-2xl border-border/50 px-5 py-4`

## Surface Hierarchy

From most elevated to least:

1. `bg-card` -- SquircleCard, header (`bg-card/80`)
2. `bg-background` -- page background
3. `bg-muted` -- toolbar buttons, input fields, badges
4. `bg-muted/40` -- bars, subtle containers (waveform bar)
5. `bg-muted/50` -- font size pill

## Error Surfaces

```tsx
// Error card
<div className="bg-destructive/5 border border-destructive/30 rounded-2xl p-4">
  <p className="text-sm font-medium text-destructive">{message}</p>
</div>

// Error on SquircleCard
<SquircleCard className="p-8 min-h-[200px] text-destructive">
```

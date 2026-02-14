# Interactive Patterns

## Toggle States (On/Off)

Used for: Radiopaedia, Ditar (recording), History dropdown.

| State | Classes |
|-------|---------|
| Off (default) | `bg-muted text-muted-foreground hover:text-foreground` |
| On (active) | `bg-foreground/80 text-background hover:bg-foreground/70 hover:text-background` |

The toggle is applied via conditional `className` on a `variant="ghost"` Button:

```tsx
<Button
  variant="ghost"
  className={`gap-1.5 ${
    isActive
      ? "bg-foreground/80 text-background hover:bg-foreground/70 hover:text-background"
      : "bg-muted text-muted-foreground hover:text-foreground"
  }`}
>
```

## Hover Patterns

| Context | Hover Classes |
|---------|---------------|
| Text-only hover | `hover:text-foreground` |
| Surface hover (accent) | `hover:bg-accent hover:text-accent-foreground` |
| Surface hover (muted) | `hover:bg-muted/50 hover:text-foreground` |
| CTA hover | `hover:bg-foreground/90` |
| Destructive hover | `hover:bg-destructive/10 hover:text-destructive` |
| Link hover | `hover:text-foreground transition-colors` (on `text-muted-foreground/60`) |

## Destructive Actions

Used for: logout, clear history, error states.

### Destructive Button

```tsx
<Button
  variant="ghost"
  className="bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
>
```

### Destructive Inline (small actions)

```tsx
<Button
  variant="ghost"
  className="rounded-full h-6 px-2.5 text-[10px] font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
>
```

### Error Display

```tsx
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-destructive/5 border border-destructive/30 rounded-2xl p-4"
>
  <p className="text-sm font-medium text-destructive">{error}</p>
</motion.div>
```

## Focus States

Universal focus ring pattern for all interactive elements:

```
focus-visible:ring-[3px] focus-visible:ring-ring/30
```

Inputs additionally get:

```
focus-visible:border-ring focus-visible:bg-background
```

## Disabled States

Built into all components:

```
disabled:pointer-events-none disabled:opacity-50
```

For custom elements, add `disabled:cursor-not-allowed`.

## Transitions

All interactive elements use CSS transitions:

```
transition-colors duration-200
```

or for transform-based effects:

```
transition-all duration-200
```

or the shorter:

```
transition-colors
```

(Tailwind default 150ms is acceptable for simple hover color changes.)

## Keyboard Shortcut Hints

Kbd hints are hidden by default and slide in on parent group hover:

```tsx
<div className="group/name relative">
  <Button>...</Button>

  <div className="absolute ... pointer-events-none hidden sm:block">
    <div className="... -translate-x-full opacity-0 group-hover/name:translate-x-0 group-hover/name:opacity-100 transition-all duration-300 ease-out">
      <KbdGroup>
        <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
        <span className="text-xs text-foreground/30">+</span>
        <Kbd>G</Kbd>
      </KbdGroup>
    </div>
  </div>
</div>
```

Direction: slides from left for left-aligned buttons, from right for right-aligned.

## Selection / Highlight

Text selection styling (on inputs):

```
selection:bg-border/60 selection:text-foreground
```

Or primary:

```
selection:bg-primary selection:text-primary-foreground
```

## Mic Recording States

Special pulse animation per locale when recording:

```tsx
className={`... ${isRecording ? `bg-foreground/80 text-background ${localePulseClass}` : "..."}`}
```

Pulse classes: `animate-pulse-amber` (PT), `animate-pulse-blue` (EN), `animate-pulse-emerald` (ES).

## Waveform Bar

Appears when recording, with height expand animation:

```tsx
<div className="flex items-center gap-4 bg-muted/40 rounded-full px-5 py-2 h-11">
  {/* Frequency bars */}
  <div className="flex items-center justify-end gap-[1.5px] h-6 flex-1 overflow-hidden">
    {bars.map((val) => (
      <div
        className="flex-1 min-w-0 rounded-full bg-foreground/60 transition-[height] duration-75"
        style={{ maxWidth: 4, height: Math.max(2, (val / 255) * 24) }}
      />
    ))}
  </div>
  {/* Timer + controls */}
</div>
```

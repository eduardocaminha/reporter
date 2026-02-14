# Miscellaneous Components

## Avatar

Source: `components/ui/avatar.tsx`

Radix-based. Used in the header for user profile.

### Sizes

| Size | Class |
|------|-------|
| `default` | `size-11` |
| `sm` | `size-8` |
| `lg` | `size-12` |

### Usage

```tsx
<Avatar size="default">
  <AvatarImage src={user.imageUrl} alt={name} />
  <AvatarFallback className="bg-background text-muted-foreground">
    {initials}
  </AvatarFallback>
</Avatar>
```

Fallback: `bg-muted text-muted-foreground`, centered text, `rounded-full`.

## Kbd (Keyboard Shortcut)

Source: `components/ui/kbd.tsx`

### Default

```
bg-muted text-foreground/40
h-5 min-w-5 rounded-sm px-1 text-xs font-medium
```

### Active (hover state with parent group)

```
group-hover:bg-foreground/80 group-hover:text-background
```

### Pattern

```tsx
<KbdGroup>
  <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
  <span className="text-xs text-foreground/30">+</span>
  <Kbd>G</Kbd>
</KbdGroup>
```

Kbd hints slide in from the side using CSS transform + opacity on parent group hover.

## TextEffect

Source: `components/ui/text-effect.tsx`

Animated text reveal. Used for logo and landing text.

### Common Usage

```tsx
<TextEffect
  preset="blur"
  per="word"
  as="span"
  className="block text-xl font-medium tracking-tight text-foreground"
  variants={{
    item: {
      hidden: { opacity: 0, filter: "blur(4px)" },
      visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.25 } },
      exit: { opacity: 0, filter: "blur(4px)", transition: { duration: 0.25 } },
    },
  }}
>
  {text}
</TextEffect>
```

Presets available: `blur`, `shake`, `scale`, `fade`, `slide`.

## RippleLoader

Source: `components/ui/ripple-loader.tsx`

Loading spinner with concentric pulsating rings.

### Sizes

| Size | Class |
|------|-------|
| `sm` | `h-8 w-8` |
| `md` | `h-12 w-12` |
| `lg` | `h-16 w-16` |

### Full-page loader

```tsx
import { PageLoader } from "@/components/ui/ripple-loader"

// Renders: flex min-h-dvh items-center justify-center bg-background
<PageLoader />
```

## Switch

Source: `components/ui/switch.tsx`

Radix-based. Not currently used in the app, but available.

```
h-[1.15rem] w-8 rounded-full
data-[state=checked]:bg-foreground/80
data-[state=unchecked]:bg-input
```

## Tooltip

Source: `components/ui/tooltip.tsx`

Radix-based. `delayDuration=0` by default.

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>{trigger}</TooltipTrigger>
    <TooltipContent>{content}</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

Content: `bg-foreground text-background rounded-xl px-3.5 py-2.5 text-xs shadow-lg`

## Toggle

Source: `components/ui/toggle.tsx`

Radix-based. Not currently used directly.

```
rounded-full text-sm font-medium
data-[state=on]:bg-accent data-[state=on]:text-accent-foreground
hover:bg-muted hover:text-muted-foreground
```

# Motion & Animation

Import: `import { motion, AnimatePresence } from "motion/react"`

**Not** `"framer-motion"` -- this project uses the `motion` package.

## Standard Entry Animation

Used for page content, columns, cards:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
>
```

## Header Entry

Slides down from above:

```tsx
<motion.header
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
```

## Dropdown / Popover

Appears from above:

```tsx
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.2 }}
>
```

## Expand / Collapse (height)

Used for header menu, waveform bar:

```tsx
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
  className="overflow-hidden"
>
```

Always use `overflow-hidden` on the animated container.

## Stagger Children

Used for dashboard columns:

```tsx
// Parent
<motion.main
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }}
>
  {/* Children */}
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    }}
  >
```

## Content Switching

For tabs, sections, streaming/result states:

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={activeKey}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    {content}
  </motion.div>
</AnimatePresence>
```

Always use `mode="wait"` and a unique `key` to trigger exit/enter.

## Text/Logo Blur Transition

```tsx
<TextEffect
  preset="blur"
  per="word"
  as="span"
  variants={{
    item: {
      hidden: { opacity: 0, filter: "blur(4px)" },
      visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.25 } },
      exit: { opacity: 0, filter: "blur(4px)", transition: { duration: 0.25 } },
    },
  }}
>
```

## Icon Rotation (toggle)

For hamburger/X toggle:

```tsx
<AnimatePresence mode="wait" initial={false}>
  {isOpen ? (
    <motion.span
      key="close"
      initial={{ opacity: 0, rotate: -90 }}
      animate={{ opacity: 1, rotate: 0 }}
      exit={{ opacity: 0, rotate: 90 }}
      transition={{ duration: 0.15 }}
    >
      <X />
    </motion.span>
  ) : (
    <motion.span
      key="menu"
      initial={{ opacity: 0, rotate: 90 }}
      animate={{ opacity: 1, rotate: 0 }}
      exit={{ opacity: 0, rotate: -90 }}
      transition={{ duration: 0.15 }}
    >
      <Menu />
    </motion.span>
  )}
</AnimatePresence>
```

## Error Entry

```tsx
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
>
```

No exit animation -- errors are replaced, not dismissed with animation.

## Duration Reference

| Context | Duration | Ease |
|---------|----------|------|
| Page entry | 0.4s | `"easeOut"` |
| Header entry | 0.3s | `"easeOut"` |
| Content switch | 0.3s | `"easeOut"` |
| Dropdown | 0.2s | default |
| Expand/collapse | 0.25s | `[0.25, 0.1, 0.25, 1]` |
| Text blur | 0.25s | default |
| Icon rotate | 0.15s | default |
| Stagger delay | 0.1s | -- |
| Landing delayed | 0.6-0.9s delay | `"easeOut"` |

Never exceed 0.5s for interactive transitions. Landing page delays are the only exception.

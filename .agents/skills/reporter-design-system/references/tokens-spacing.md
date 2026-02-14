# Spacing Tokens

## Horizontal Padding (Universal)

Every page container and header uses the same responsive padding:

```
px-8 sm:px-12 lg:px-16
```

- `px-8` = 2rem (mobile)
- `sm:px-12` = 3rem (640px+)
- `lg:px-16` = 4rem (1024px+)

## Max Widths

| Context | Classes |
|---------|---------|
| Dashboard / main content | `max-w-6xl lg:max-w-none mx-auto` |
| Login form | `max-w-md` |
| History dropdown | `w-80` |

## Header

- Height: `h-[72px]` (fixed, every page)
- Inner layout: `flex items-center justify-between`

## Vertical Spacing

| Context | Values |
|---------|--------|
| Dashboard main | `py-10` |
| Login page | `pt-16 sm:pt-20 pb-16` |
| Landing header gap | Varies per section |

## Card Padding

| Component | Padding |
|-----------|---------|
| SquircleCard (main areas) | `p-8` |
| Dropdown items | `p-4` |
| Alert | `px-5 py-4` |
| Error card | `p-4` or `p-5` |

## Gaps

| Context | Gap |
|---------|-----|
| Header right-side items | `gap-2` |
| Icon + text in button | `gap-1.5` |
| Button + hamburger to logo | `gap-3` |
| Form fields | `space-y-4` |
| Form sections | `space-y-6` |
| Dashboard columns | `lg:gap-8` |
| Section spacing | `gap-6` |

## Border Radius

| Element | Radius |
|---------|--------|
| Buttons | `rounded-full` (built into Button component) |
| SquircleCard | `cornerRadius=32` (clip-path, not CSS) |
| Cards / alerts | `rounded-2xl` |
| Inputs (default) | `rounded-xl` |
| Inputs (login floating) | `rounded-full` |
| OTP slots | `rounded-lg` |
| Login right panel | `rounded-l-3xl` |

## Container Pattern

Standard page container (used on dashboard, header, menu):

```tsx
<div className="max-w-6xl lg:max-w-none mx-auto px-8 sm:px-12 lg:px-16">
  {children}
</div>
```

## Menu Alignment

When items need to align below the logo (after hamburger button):

```
pl-11
```

This equals 2.75rem = hamburger `h-8 w-8` (2rem) + `gap-3` (0.75rem).

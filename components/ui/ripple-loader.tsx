"use client"

import { cn } from "@/lib/utils"

interface RippleLoaderProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

/**
 * Pulsating ripple loader — concentric circles that expand outward.
 * Inspired by 21st.dev/community/components/mvp_Subha/pulsating-loader/ripple-loader
 * Uses foreground color to respect light/dark theme.
 */
export function RippleLoader({ className, size = "md" }: RippleLoaderProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Three concentric ripple rings with staggered delays */}
      <div className="absolute inset-0 animate-ripple rounded-full border-[1.5px] border-foreground/25" />
      <div className="absolute inset-0 animate-ripple rounded-full border-[1.5px] border-foreground/25 [animation-delay:0.5s]" />
      <div className="absolute inset-0 animate-ripple rounded-full border-[1.5px] border-foreground/25 [animation-delay:1s]" />
      {/* Center dot */}
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/40" />
    </div>
  )
}

/**
 * Full-page centered loader — use in loading.tsx files.
 */
export function PageLoader() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <RippleLoader size="lg" />
    </div>
  )
}

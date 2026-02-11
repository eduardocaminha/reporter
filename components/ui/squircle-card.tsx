"use client"

import { cn } from "@/lib/utils"

interface SquircleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function SquircleCard({
  className,
  children,
  ...props
}: SquircleCardProps) {
  return (
    <div
      className={cn("bg-card rounded-[2rem]", className)}
      {...props}
    >
      {children}
    </div>
  )
}

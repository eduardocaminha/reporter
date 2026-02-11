"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const localeConfig: Record<string, { label: string; hoverBg: string }> = {
  "pt-BR": { label: "PT", hoverBg: "hover:bg-emerald-500/20" },
  "en-US": { label: "EN", hoverBg: "hover:bg-blue-500/20" },
  "es-MX": { label: "ES", hoverBg: "hover:bg-amber-500/20" },
}

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const locales = routing.locales
  const currentIndex = locales.indexOf(locale as (typeof locales)[number])
  const nextIndex = (currentIndex + 1) % locales.length
  const nextLocale = locales[nextIndex]
  const config = localeConfig[nextLocale]

  function handleToggle() {
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className={cn(
        "text-muted-foreground/60 min-w-[36px] px-2 transition-colors",
        config?.hoverBg
      )}
    >
      {config?.label ?? nextLocale}
    </Button>
  )
}

"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { Button } from "@/components/ui/button"

const localeLabels: Record<string, string> = {
  "pt-BR": "PT",
  "en-US": "EN",
}

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const nextLocale = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale

  function handleSwitch() {
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSwitch}
      className="text-muted-foreground hover:text-foreground min-w-[40px]"
    >
      {localeLabels[nextLocale] ?? nextLocale}
    </Button>
  )
}

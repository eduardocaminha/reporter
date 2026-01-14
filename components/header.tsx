"use client"

import { motion } from "motion/react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

type ReportMode = "ps" | "eletivo" | "comparativo"

interface HeaderProps {
  reportMode: ReportMode
  onReportModeChange: (value: ReportMode) => void
}

export function Header({ reportMode, onReportModeChange }: HeaderProps) {
  const router = useRouter()
  const modes: { value: ReportMode; label: string; key: string }[] = [
    { value: "ps", label: "PS", key: "p" },
    { value: "eletivo", label: "Eletivo", key: "e" },
    { value: "comparativo", label: "Comparativo", key: "c" },
  ]

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl ou Cmd + Shift + tecla
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && !e.altKey) {
        if (e.key.toLowerCase() === "p") {
          e.preventDefault()
          onReportModeChange("ps")
        } else if (e.key.toLowerCase() === "e") {
          e.preventDefault()
          onReportModeChange("eletivo")
        } else if (e.key.toLowerCase() === "c") {
          e.preventDefault()
          onReportModeChange("comparativo")
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onReportModeChange])

  async function handleLogout() {
    try {
      await fetch("/api/auth", {
        method: "DELETE",
      })
      router.push("/login")
      router.refresh()
    } catch {
      // Em caso de erro, ainda redireciona para login
      router.push("/login")
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="border-b border-border bg-card sticky top-0 z-50"
    >
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight text-foreground">RadReport</span>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {modes.map((mode) => (
              <Toggle
                key={mode.value}
                pressed={reportMode === mode.value}
                onPressedChange={() => onReportModeChange(mode.value)}
                aria-label={mode.label}
                variant="outline"
                size="sm"
                className="px-3 py-1.5 text-sm font-medium data-[state=on]:bg-card data-[state=on]:shadow-sm"
              >
                <span className="relative z-10">{mode.label}</span>
                <KbdGroup className="ml-1.5 hidden sm:inline-flex">
                  <Kbd className="text-[10px]">Ctrl</Kbd>
                  <span className="text-muted-foreground text-[10px]">+</span>
                  <Kbd className="text-[10px]">Shift</Kbd>
                  <span className="text-muted-foreground text-[10px]">+</span>
                  <Kbd className="text-[10px]">{mode.key.toUpperCase()}</Kbd>
                </KbdGroup>
              </Toggle>
            ))}
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </div>
    </motion.header>
  )
}

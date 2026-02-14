"use client"

import { motion, AnimatePresence } from "motion/react"
import { X, ChevronRight, Settings, FileText, Paintbrush } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { useEffect, useState, useCallback } from "react"

type MenuSection = "configLLM" | "geradorMascaras" | "formatadorMascaras"

interface MenuOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems: { id: MenuSection; icon: typeof Settings }[] = [
  { id: "configLLM", icon: Settings },
  { id: "geradorMascaras", icon: FileText },
  { id: "formatadorMascaras", icon: Paintbrush },
]

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const t = useTranslations("Menu")
  const [activeSection, setActiveSection] = useState<MenuSection>("configLLM")

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
      // Prevent body scroll when overlay is open
      document.body.style.overflow = "hidden"
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, handleKeyDown])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-100 bg-background"
        >
          {/* Header bar with close button */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="h-[72px] flex items-center px-8 sm:px-12 lg:px-16"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full h-10 w-10"
            >
              <X className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* Main content area */}
          <div className="flex flex-col lg:flex-row h-[calc(100vh-72px)] overflow-hidden">
            {/* Left panel - Menu items */}
            <motion.nav
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="lg:w-[340px] xl:w-[400px] shrink-0 px-8 sm:px-12 lg:px-16 py-6 lg:py-12 flex flex-col gap-1"
            >
              {menuItems.map((item, index) => {
                const isActive = activeSection === item.id
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: 0.15 + index * 0.06,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    onClick={() => setActiveSection(item.id)}
                    className={`group flex items-center justify-between w-full py-4 px-5 rounded-2xl text-left transition-colors duration-200 ${
                      isActive
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <span className="text-lg font-medium tracking-tight">
                      {t(item.id)}
                    </span>
                    <ChevronRight
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isActive
                          ? "text-foreground translate-x-0"
                          : "text-muted-foreground/50 group-hover:translate-x-0.5"
                      }`}
                    />
                  </motion.button>
                )
              })}
            </motion.nav>

            {/* Right panel - Content area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex-1 px-8 sm:px-12 lg:px-16 py-6 lg:py-12 overflow-y-auto"
            >
              <div className="bg-secondary/50 rounded-3xl p-8 sm:p-10 lg:p-14 min-h-[300px] lg:min-h-[500px] flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    className="flex-1 flex flex-col"
                  >
                    {/* Section heading */}
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-foreground mb-4">
                      {t(`${activeSection}Title`)}
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed">
                      {t(`${activeSection}Desc`)}
                    </p>

                    {/* Placeholder cards */}
                    <SectionContent section={activeSection} t={t} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Placeholder content cards for each section */
function SectionContent({
  section,
  t,
}: {
  section: MenuSection
  t: ReturnType<typeof useTranslations<"Menu">>
}) {
  const cards = getSectionCards(section, t)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.06 }}
          className="group flex items-start gap-4 bg-background/80 rounded-2xl p-5 border border-border/40 hover:border-border/80 transition-colors cursor-default"
        >
          <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <card.icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-foreground">
              {card.label}
            </span>
            <span className="text-xs text-muted-foreground leading-relaxed">
              {card.description}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function getSectionCards(
  section: MenuSection,
  t: ReturnType<typeof useTranslations<"Menu">>,
) {
  switch (section) {
    case "configLLM":
      return [
        {
          icon: Settings,
          label: t("configCard1"),
          description: t("configCard1Desc"),
        },
        {
          icon: Settings,
          label: t("configCard2"),
          description: t("configCard2Desc"),
        },
      ]
    case "geradorMascaras":
      return [
        {
          icon: FileText,
          label: t("geradorCard1"),
          description: t("geradorCard1Desc"),
        },
        {
          icon: FileText,
          label: t("geradorCard2"),
          description: t("geradorCard2Desc"),
        },
      ]
    case "formatadorMascaras":
      return [
        {
          icon: Paintbrush,
          label: t("formatadorCard1"),
          description: t("formatadorCard1Desc"),
        },
        {
          icon: Paintbrush,
          label: t("formatadorCard2"),
          description: t("formatadorCard2Desc"),
        },
      ]
  }
}

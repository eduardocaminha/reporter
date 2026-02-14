"use client"

import { motion, AnimatePresence } from "motion/react"
import { X, ChevronRight, Settings, FileText, Paintbrush } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SquircleCard } from "@/components/ui/squircle-card"
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

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
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
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-100 bg-white"
        >
          {/* Header — matches the app header height */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="h-[72px] flex items-center px-8 sm:px-12 lg:px-16 border-b border-border/30"
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

          {/* Body */}
          <div className="max-w-6xl lg:max-w-none mx-auto px-8 sm:px-12 lg:px-16 py-10 h-[calc(100vh-72px)] overflow-y-auto">
            <div className="flex flex-col lg:flex-row lg:gap-8">
              {/* Left — nav items */}
              <motion.nav
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
                className="lg:w-1/2 flex flex-col gap-2 mb-8 lg:mb-0"
              >
                {menuItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.id
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.12 + index * 0.05,
                        ease: "easeOut",
                      }}
                      onClick={() => setActiveSection(item.id)}
                      className={`group flex items-center gap-4 w-full py-4 px-5 rounded-2xl text-left transition-colors duration-200 cursor-pointer ${
                        isActive
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <div
                        className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                          isActive
                            ? "bg-foreground/80 text-white"
                            : "bg-muted text-muted-foreground group-hover:bg-muted"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="flex-1 text-base font-medium tracking-tight">
                        {t(item.id)}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition-all duration-200 ${
                          isActive
                            ? "text-foreground/60 translate-x-0"
                            : "text-muted-foreground/30 group-hover:text-muted-foreground/60 group-hover:translate-x-0.5"
                        }`}
                      />
                    </motion.button>
                  )
                })}
              </motion.nav>

              {/* Right — content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
                className="lg:w-1/2"
              >
                <SquircleCard className="p-8 min-h-[300px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSection}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider mb-4">
                        {t(activeSection)}
                      </p>
                      <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground mb-2">
                        {t(`${activeSection}Title`)}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                        {t(`${activeSection}Desc`)}
                      </p>

                      {/* Placeholder cards */}
                      <div className="flex flex-col gap-3">
                        <SectionCards section={activeSection} t={t} />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </SquircleCard>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SectionCards({
  section,
  t,
}: {
  section: MenuSection
  t: ReturnType<typeof useTranslations<"Menu">>
}) {
  const cards = getCards(section, t)

  return (
    <>
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 + i * 0.04 }}
          className="flex items-start gap-3.5 bg-muted/40 rounded-2xl p-4 cursor-default"
        >
          <div className="shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <card.icon className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-medium text-foreground">
              {card.label}
            </span>
            <span className="text-xs text-muted-foreground leading-relaxed">
              {card.description}
            </span>
          </div>
        </motion.div>
      ))}
    </>
  )
}

function getCards(
  section: MenuSection,
  t: ReturnType<typeof useTranslations<"Menu">>,
) {
  switch (section) {
    case "configLLM":
      return [
        { icon: Settings, label: t("configCard1"), description: t("configCard1Desc") },
        { icon: Settings, label: t("configCard2"), description: t("configCard2Desc") },
      ]
    case "geradorMascaras":
      return [
        { icon: FileText, label: t("geradorCard1"), description: t("geradorCard1Desc") },
        { icon: FileText, label: t("geradorCard2"), description: t("geradorCard2Desc") },
      ]
    case "formatadorMascaras":
      return [
        { icon: Paintbrush, label: t("formatadorCard1"), description: t("formatadorCard1Desc") },
        { icon: Paintbrush, label: t("formatadorCard2"), description: t("formatadorCard2Desc") },
      ]
  }
}

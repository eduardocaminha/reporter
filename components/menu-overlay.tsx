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
          className="fixed inset-0 z-100 flex bg-white"
        >
          {/* ── Left column: gray bg, menu items ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
            className="w-full lg:w-1/2 flex flex-col bg-background"
          >
            {/* Header with close button — same position/height as main header */}
            <div className="h-[72px] flex items-center px-8 sm:px-12 lg:px-16">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 bg-muted text-muted-foreground/40 hover:text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Menu items */}
            <nav className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 pb-20">
              <div className="flex flex-col gap-1">
                {menuItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.id
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.1 + index * 0.05,
                        ease: "easeOut",
                      }}
                      onClick={() => setActiveSection(item.id)}
                      className={`group flex items-center gap-4 w-full py-4 px-5 rounded-2xl text-left transition-colors duration-200 cursor-pointer ${
                        isActive
                          ? "bg-card text-foreground"
                          : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                      }`}
                    >
                      <div
                        className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                          isActive
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground/60 group-hover:text-muted-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="flex-1 text-[17px] font-medium tracking-tight">
                        {t(item.id)}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition-all duration-200 ${
                          isActive
                            ? "text-foreground/40"
                            : "text-muted-foreground/20 group-hover:text-muted-foreground/40 group-hover:translate-x-0.5"
                        }`}
                      />
                    </motion.button>
                  )
                })}
              </div>
            </nav>
          </motion.div>

          {/* ── Right column: white, page content ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="hidden lg:flex lg:w-1/2 flex-col bg-white"
          >
            {/* Spacer to align with header height */}
            <div className="h-[72px]" />

            {/* Page content */}
            <div className="flex-1 flex flex-col justify-center px-16 pb-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="max-w-lg"
                >
                  <h1 className="text-3xl font-medium tracking-tight text-foreground mb-3">
                    {t(`${activeSection}Title`)}
                  </h1>
                  <p className="text-base text-muted-foreground leading-relaxed mb-10">
                    {t(`${activeSection}Desc`)}
                  </p>

                  <div className="flex flex-col gap-3">
                    <PageCards section={activeSection} t={t} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function PageCards({
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
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.06 + i * 0.04 }}
          className="flex items-start gap-4 rounded-2xl bg-background p-5 cursor-default"
        >
          <div className="shrink-0 w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
            <card.icon className="w-4 h-4 text-muted-foreground/60" />
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

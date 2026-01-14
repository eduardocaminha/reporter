"use client"

import { motion, AnimatePresence } from "motion/react"
import { AlertCircle } from "lucide-react"

interface SugestoesProps {
  sugestoes: string[]
}

export function Sugestoes({ sugestoes }: SugestoesProps) {
  if (!sugestoes || sugestoes.length === 0) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="bg-accent/50 border border-accent rounded-xl p-4"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-accent-foreground mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-accent-foreground mb-2">
              Sugestões de completude:
            </p>
            <ul className="space-y-1.5">
              {sugestoes.map((sugestao, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-accent-foreground mt-1">•</span>
                  <span>{sugestao}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

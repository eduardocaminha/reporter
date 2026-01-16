"use client"

import { motion, AnimatePresence } from "motion/react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
      >
        <Alert className="bg-accent/50 border-accent">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Sugestões de completude:</AlertTitle>
          <AlertDescription className="mt-2">
            <ul className="space-y-1.5">
              {sugestoes.map((sugestao, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-accent-foreground mt-1 shrink-0">•</span>
                  <span>{sugestao}</span>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      </motion.div>
    </AnimatePresence>
  )
}

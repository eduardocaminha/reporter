"use client"

import type React from "react"
import { motion } from "motion/react"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { DictationInput } from "@/components/dictation-input"
import { ReportOutput } from "@/components/report-output"

type ReportMode = "ps" | "eletivo" | "comparativo"

interface ItemHistorico {
  id: string
  texto: string
  laudo: string
  data: string
}

const MAX_HISTORICO = 5

export default function Home() {
  const [dictatedText, setDictatedText] = useState("")
  const [generatedReport, setGeneratedReport] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportMode, setReportMode] = useState<ReportMode>("ps")
  const [historico, setHistorico] = useState<ItemHistorico[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("radreport_historico")
    if (saved) {
      setHistorico(JSON.parse(saved))
    }
  }, [])

  const adicionarAoHistorico = (texto: string, laudo: string) => {
    const novoItem: ItemHistorico = {
      id: Date.now().toString(),
      texto: texto.slice(0, 100),
      laudo,
      data: new Date().toLocaleString("pt-BR"),
    }

    setHistorico((prev) => {
      const novo = [novoItem, ...prev].slice(0, MAX_HISTORICO)
      localStorage.setItem("radreport_historico", JSON.stringify(novo))
      return novo
    })
  }

  const limparHistorico = () => {
    setHistorico([])
    localStorage.removeItem("radreport_historico")
  }

  const handleGenerate = async () => {
    if (!dictatedText.trim()) return
    setIsGenerating(true)

    try {
      const response = await fetch("/api/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texto: dictatedText,
          modoPS: reportMode === "ps",
        }),
      })

      const data = await response.json()

      if (data.erro) {
        setGeneratedReport(`<p class="text-destructive">${data.erro}</p>`)
      } else if (data.laudo) {
        setGeneratedReport(data.laudo)
        adicionarAoHistorico(dictatedText, data.laudo)
      }
    } catch {
      setGeneratedReport('<p class="text-destructive">Erro ao conectar com o servidor</p>')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleGenerate()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header reportMode={reportMode} onReportModeChange={setReportMode} />

      <motion.main
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
        className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
          }}
        >
          <DictationInput
            value={dictatedText}
            onChange={setDictatedText}
            onGenerate={handleGenerate}
            onKeyDown={handleKeyDown}
            isGenerating={isGenerating}
            historico={historico}
            onLimparHistorico={limparHistorico}
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
          }}
        >
          <ReportOutput report={generatedReport} isGenerating={isGenerating} />
        </motion.div>
      </motion.main>
    </div>
  )
}

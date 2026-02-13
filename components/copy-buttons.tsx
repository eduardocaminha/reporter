"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { formatarLaudoHTML, removerFormatacao } from "@/lib/formatador"

interface CopyButtonsProps {
  laudo: string | null
}

export function CopyButtons({ laudo }: CopyButtonsProps) {
  const [copiado, setCopiado] = useState(false)

  if (!laudo) return null

  async function copiar() {
    const html = formatarLaudoHTML(laudo!)
    
    try {
      const blob = new Blob([html], { type: "text/html" })
      const data = new ClipboardItem({
        "text/html": blob,
        "text/plain": new Blob([removerFormatacao(laudo!)], { type: "text/plain" }),
      })
      await navigator.clipboard.write([data])
    } catch {
      await navigator.clipboard.writeText(removerFormatacao(laudo!))
    }
    
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      onClick={copiar}
      className="min-w-11 sm:min-w-0 gap-2 text-muted-foreground hover:text-foreground"
    >
      {copiado ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
      <span className="hidden sm:inline">{copiado ? "Copiado" : "Copiar"}</span>
    </Button>
  )
}

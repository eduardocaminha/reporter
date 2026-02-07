export interface ReportBlock {
  id: string
  type: 'titulo' | 'urgencia' | 'secao' | 'paragrafo' | 'espacamento'
  html: string
  sectionName?: string
  draggable: boolean
}

export function parseReportBlocks(html: string): ReportBlock[] {
  const blocks: ReportBlock[] = []
  let id = 0
  let currentSection = ''

  // Regex que captura elementos HTML individuais (h1, p, br)
  const elementRegex = /<(h1|p)([^>]*)>[\s\S]*?<\/\1>|<br\s*\/?>/gi
  let match

  while ((match = elementRegex.exec(html)) !== null) {
    const element = match[0]
    id++
    const blockId = `block-${id}`

    if (element.includes('laudo-titulo')) {
      blocks.push({ id: blockId, type: 'titulo', html: element, draggable: false })
    } else if (element.includes('laudo-urgencia')) {
      blocks.push({ id: blockId, type: 'urgencia', html: element, draggable: false })
    } else if (element.includes('laudo-secao')) {
      const sectionMatch = element.match(/>([^<]+)</)
      currentSection = sectionMatch?.[1]?.replace(':', '').trim() || ''
      blocks.push({ id: blockId, type: 'secao', html: element, sectionName: currentSection, draggable: false })
    } else if (/^<br\s*\/?>$/i.test(element)) {
      blocks.push({ id: blockId, type: 'espacamento', html: element, draggable: false })
    } else {
      // Parágrafos da ANÁLISE são draggable
      const isDraggable = currentSection === 'ANÁLISE' || currentSection === 'ANALISE'
      blocks.push({ id: blockId, type: 'paragrafo', html: element, sectionName: currentSection, draggable: isDraggable })
    }
  }

  return blocks
}

export function blocksToHtml(blocks: ReportBlock[]): string {
  return blocks.map(b => b.html).join('')
}

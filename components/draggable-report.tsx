"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import type { ReportBlock } from "@/lib/report-blocks"

/* ------------------------------------------------------------------ */
/*  Formatting pill — appears above the block being edited            */
/* ------------------------------------------------------------------ */

function FormatPill({
  contentRef,
}: {
  contentRef: React.RefObject<HTMLDivElement | null>
}) {
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)

  // Re-check format state after every selection / key / click inside the editable
  const sync = useCallback(() => {
    setIsBold(document.queryCommandState("bold"))
    setIsItalic(document.queryCommandState("italic"))
  }, [])

  // Listen for selectionchange on the document so we always stay in sync
  useEffect(() => {
    document.addEventListener("selectionchange", sync)
    return () => document.removeEventListener("selectionchange", sync)
  }, [sync])

  const applyBold = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      contentRef.current?.focus()
      document.execCommand("bold")
      sync()
    },
    [contentRef, sync],
  )

  const applyItalic = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      contentRef.current?.focus()
      document.execCommand("italic")
      sync()
    },
    [contentRef, sync],
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.15 }}
      className="absolute -top-7 right-0 flex items-center bg-muted/60 rounded-full h-5 overflow-hidden z-20"
    >
      <button
        onMouseDown={applyBold}
        className={`h-full px-2 flex items-center justify-center text-[10px] font-bold transition-colors cursor-pointer ${
          isBold
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground/50 hover:bg-accent hover:text-accent-foreground"
        }`}
      >
        N
      </button>
      <div className="w-px h-3 bg-border/40" />
      <button
        onMouseDown={applyItalic}
        className={`h-full px-2 flex items-center justify-center text-[10px] italic transition-colors cursor-pointer ${
          isItalic
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground/50 hover:bg-accent hover:text-accent-foreground"
        }`}
      >
        I
      </button>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  SortableBlock — drag + click-to-edit                              */
/* ------------------------------------------------------------------ */

function SortableBlock({
  block,
  isEditing,
  onStartEdit,
  onFinishEdit,
}: {
  block: ReportBlock
  isEditing: boolean
  onStartEdit: () => void
  onFinishEdit: (newHtml: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id, disabled: !block.draggable })

  const contentRef = useRef<HTMLDivElement>(null)

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // Save and exit editing
  const finishEditing = useCallback(() => {
    if (!contentRef.current) return
    onFinishEdit(contentRef.current.innerHTML)
  }, [onFinishEdit])

  // Handle Escape to exit
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        finishEditing()
      }
    },
    [finishEditing],
  )

  // Click handler — only for draggable blocks, enter edit mode
  const handleClick = useCallback(() => {
    if (block.draggable && !isEditing) {
      onStartEdit()
    }
  }, [block.draggable, isEditing, onStartEdit])

  // Set innerHTML imperatively ONCE on entering edit mode (avoids React
  // re-render resetting the content & killing the selection/cursor).
  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.innerHTML = block.html
      contentRef.current.focus()
      // Place cursor at end
      const range = document.createRange()
      range.selectNodeContents(contentRef.current)
      range.collapse(false)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on edit toggle
  }, [isEditing])

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${block.draggable ? "group" : ""}`}
    >
      {/* Drag handle */}
      {block.draggable && !isEditing && (
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 cursor-grab active:cursor-grabbing transition-opacity"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      )}

      {/* Formatting pill */}
      <AnimatePresence>
        {isEditing && <FormatPill contentRef={contentRef} />}
      </AnimatePresence>

      {/* Block content */}
      {isEditing ? (
        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          onKeyDown={handleKeyDown}
          className="outline-none bg-muted/40 rounded-sm px-1 -mx-1 cursor-text"
        />
      ) : (
        <div
          onClick={handleClick}
          className={block.draggable ? "cursor-pointer" : ""}
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  DraggableReport                                                   */
/* ------------------------------------------------------------------ */

interface DraggableReportProps {
  blocks: ReportBlock[]
  onReorder: (blocks: ReportBlock[]) => void
  onBlockUpdate: (blockId: string, newHtml: string) => void
}

export function DraggableReport({
  blocks,
  onReorder,
  onBlockUpdate,
}: DraggableReportProps) {
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)
      onReorder(arrayMove(blocks, oldIndex, newIndex))
    }
  }

  // Click outside listener — exit editing mode
  useEffect(() => {
    if (!editingBlockId) return

    function handleClickOutside(e: MouseEvent) {
      // If clicking inside the format pill or the editable block, ignore
      const target = e.target as HTMLElement
      if (containerRef.current && !containerRef.current.contains(target)) {
        setEditingBlockId(null)
      }
    }

    // Small delay so the click that started editing doesn't immediately close it
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside)
    }, 0)

    return () => {
      clearTimeout(timer)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [editingBlockId])

  const handleStartEdit = useCallback((blockId: string) => {
    setEditingBlockId(blockId)
  }, [])

  const handleFinishEdit = useCallback(
    (blockId: string, newHtml: string) => {
      setEditingBlockId(null)
      onBlockUpdate(blockId, newHtml)
    },
    [onBlockUpdate],
  )

  const sortableIds = blocks.filter((b) => b.draggable).map((b) => b.id)

  return (
    <div ref={containerRef}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortableIds}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              isEditing={editingBlockId === block.id}
              onStartEdit={() => handleStartEdit(block.id)}
              onFinishEdit={(newHtml) => handleFinishEdit(block.id, newHtml)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}

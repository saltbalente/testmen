"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Keyword } from "@/types/keyword"

interface KeywordNotesDialogProps {
  keyword: Keyword
  onSave: (keywordId: string, notes: string) => void
  onCancel: () => void
}

export default function KeywordNotesDialog({ keyword, onSave, onCancel }: KeywordNotesDialogProps) {
  const [notes, setNotes] = useState(keyword.notes || "")
  const [open, setOpen] = useState(true)

  // Asegurar que el diálogo se abra cuando se recibe una nueva keyword
  useEffect(() => {
    setNotes(keyword.notes || "")
    setOpen(true)
  }, [keyword])

  // Manejar cierre del diálogo
  const handleClose = () => {
    setOpen(false)
    onCancel()
  }

  // Manejar guardado de notas
  const handleSave = () => {
    setOpen(false)
    onSave(keyword.id, notes)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Notas para: {keyword.keyword}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Añade notas sobre esta keyword..."
            className="min-h-[200px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar notas</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

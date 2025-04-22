"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { Keyword, KeywordCategory } from "@/types/keyword"

interface KeywordEditDialogProps {
  keyword: Keyword
  categories: KeywordCategory[]
  onSave: (editedKeyword: Keyword) => void
  onCancel: () => void
}

export default function KeywordEditDialog({ keyword, categories, onSave, onCancel }: KeywordEditDialogProps) {
  const [editedKeyword, setEditedKeyword] = useState<Keyword>({ ...keyword })
  const [open, setOpen] = useState(true)

  // Asegurar que el diálogo se abra cuando se recibe una nueva keyword
  useEffect(() => {
    setEditedKeyword({ ...keyword })
    setOpen(true)
  }, [keyword])

  // Manejar cierre del diálogo
  const handleClose = () => {
    setOpen(false)
    onCancel()
  }

  // Manejar guardado de cambios
  const handleSave = () => {
    setOpen(false)
    onSave(editedKeyword)
  }

  // Actualizar campo de texto
  const handleTextChange = (field: keyof Keyword, value: string) => {
    setEditedKeyword((prev) => ({ ...prev, [field]: value }))
  }

  // Actualizar campo numérico
  const handleNumberChange = (field: keyof Keyword, value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      setEditedKeyword((prev) => ({ ...prev, [field]: numValue }))
    }
  }

  // Actualizar competencia (slider)
  const handleCompetitionChange = (value: number[]) => {
    setEditedKeyword((prev) => ({ ...prev, competition: value[0] / 100 }))
  }

  // Actualizar categoría
  const handleCategoryChange = (value: string) => {
    setEditedKeyword((prev) => ({ ...prev, category: value === "none" ? undefined : value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Keyword</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="keyword" className="text-right">
              Keyword
            </Label>
            <Input
              id="keyword"
              value={editedKeyword.keyword}
              onChange={(e) => handleTextChange("keyword", e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="volume" className="text-right">
              Volumen
            </Label>
            <Input
              id="volume"
              type="number"
              value={editedKeyword.volume}
              onChange={(e) => handleNumberChange("volume", e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="competition" className="text-right">
              Competencia
            </Label>
            <div className="col-span-3 flex items-center gap-4">
              <Slider
                id="competition"
                value={[editedKeyword.competition * 100]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleCompetitionChange}
                className="flex-1"
              />
              <span className="w-12 text-right">{(editedKeyword.competition * 100).toFixed(0)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cpc" className="text-right">
              CPC
            </Label>
            <Input
              id="cpc"
              type="text"
              value={editedKeyword.cpcOriginal || `$${editedKeyword.cpc.toFixed(2)}`}
              onChange={(e) => {
                // Guardar el valor original tal como se ingresa
                setEditedKeyword((prev) => ({
                  ...prev,
                  cpcOriginal: e.target.value,
                  // También actualizar el valor numérico para cálculos
                  cpc: Number.parseFloat(e.target.value.replace(/[^\d.-]/g, "")) || 0,
                }))
              }}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Categoría
            </Label>
            <Select value={editedKeyword.category || "none"} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category" className="col-span-3">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin categoría</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

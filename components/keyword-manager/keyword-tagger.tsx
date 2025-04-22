"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import { Tag, Plus, X, Save } from "lucide-react"
import type { Keyword } from "@/types/keyword"

interface KeywordTaggerProps {
  selectedKeywords: Keyword[]
  onTagKeywords: (keywordIds: string[], tags: string[]) => void
}

export default function KeywordTagger({ selectedKeywords, onTagKeywords }: KeywordTaggerProps) {
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [commonTags, setCommonTags] = useState<string[]>([])

  // Cargar etiquetas disponibles
  useEffect(() => {
    const savedTags = localStorage.getItem("keywordTags")
    if (savedTags) {
      try {
        setAvailableTags(JSON.parse(savedTags))
      } catch (e) {
        console.error("Error loading saved tags:", e)
      }
    }
  }, [])

  // Guardar etiquetas cuando cambien
  useEffect(() => {
    if (availableTags.length > 0) {
      localStorage.setItem("keywordTags", JSON.stringify(availableTags))
    }
  }, [availableTags])

  // Encontrar etiquetas comunes entre las keywords seleccionadas
  useEffect(() => {
    if (selectedKeywords.length === 0) {
      setCommonTags([])
      setSelectedTags([])
      return
    }

    // Obtener todas las etiquetas de la primera keyword
    const firstKeywordTags = selectedKeywords[0].tags || []

    // Encontrar las etiquetas que están en todas las keywords seleccionadas
    const common = firstKeywordTags.filter((tag) => selectedKeywords.every((kw) => kw.tags && kw.tags.includes(tag)))

    setCommonTags(common)
    setSelectedTags(common)
  }, [selectedKeywords])

  // Agregar nueva etiqueta
  const handleAddTag = useCallback(() => {
    if (!newTag.trim()) return

    const trimmedTag = newTag.trim()

    // Verificar si la etiqueta ya existe
    if (!availableTags.includes(trimmedTag)) {
      setAvailableTags((prev) => [...prev, trimmedTag])
    }

    // Agregar a las etiquetas seleccionadas si no está ya
    if (!selectedTags.includes(trimmedTag)) {
      setSelectedTags((prev) => [...prev, trimmedTag])
    }

    setNewTag("")
  }, [newTag, availableTags, selectedTags])

  // Seleccionar/deseleccionar etiqueta existente
  const handleToggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }, [])

  // Eliminar etiqueta de las disponibles
  const handleDeleteTag = useCallback((tag: string) => {
    setAvailableTags((prev) => prev.filter((t) => t !== tag))
    setSelectedTags((prev) => prev.filter((t) => t !== tag))

    toast({
      title: "Etiqueta eliminada",
      description: `La etiqueta "${tag}" ha sido eliminada`,
    })
  }, [])

  // Aplicar etiquetas a las keywords seleccionadas
  const handleApplyTags = useCallback(() => {
    if (selectedKeywords.length === 0) {
      toast({
        title: "No hay keywords seleccionadas",
        description: "Selecciona al menos una keyword para aplicar etiquetas",
        variant: "destructive",
      })
      return
    }

    const keywordIds = selectedKeywords.map((kw) => kw.id)
    onTagKeywords(keywordIds, selectedTags)

    toast({
      title: "Etiquetas aplicadas",
      description: `Se aplicaron ${selectedTags.length} etiquetas a ${keywordIds.length} keywords`,
    })
  }, [selectedKeywords, selectedTags, onTagKeywords])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Tag className="mr-2 h-5 w-5" />
          Etiquetas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedKeywords.length === 0 ? (
          <div className="text-center py-2 text-muted-foreground">Selecciona keywords para gestionar etiquetas</div>
        ) : (
          <>
            <div className="text-sm text-muted-foreground mb-2">{selectedKeywords.length} keywords seleccionadas</div>

            {commonTags.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Etiquetas comunes:</div>
                <div className="flex flex-wrap gap-2">
                  {commonTags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Input
                placeholder="Nueva etiqueta..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              />
              <Button variant="outline" size="icon" onClick={handleAddTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Etiquetas disponibles:</div>
              <ScrollArea className="h-[150px]">
                <div className="flex flex-wrap gap-2 p-1">
                  {availableTags.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-2">No hay etiquetas disponibles</div>
                  ) : (
                    availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer flex items-center gap-1"
                        onClick={() => handleToggleTag(tag)}
                      >
                        {tag}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteTag(tag)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            <Button className="w-full" onClick={handleApplyTags}>
              <Save className="mr-2 h-4 w-4" />
              Aplicar etiquetas
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

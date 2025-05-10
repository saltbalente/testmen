"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Keyword, KeywordCategory } from "@/types/keyword"
import { Tag, Trash } from "lucide-react"

interface KeywordCategorizerProps {
  selectedKeywords: Keyword[]
  categories: KeywordCategory[]
  onCategorize: (keywordIds: string[], categoryName: string | null) => void
}

export default function KeywordCategorizer({ selectedKeywords, categories, onCategorize }: KeywordCategorizerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)

  // Manejar asignación de categoría
  const handleAssignCategory = useCallback(() => {
    if (selectedKeywords.length === 0) return

    const keywordIds = selectedKeywords.map((kw) => kw.id)
    onCategorize(keywordIds, selectedCategory || null)
  }, [selectedKeywords, selectedCategory, onCategorize])

  // Manejar eliminación de categoría
  const handleRemoveCategory = useCallback(() => {
    if (selectedKeywords.length === 0) return

    const keywordIds = selectedKeywords.map((kw) => kw.id)
    onCategorize(keywordIds, null)
  }, [selectedKeywords, onCategorize])

  // Verificar si hay keywords seleccionadas con categorías
  const hasKeywordsWithCategory = selectedKeywords.some((kw) => kw.category)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Categorizar Keywords</CardTitle>
        <CardDescription>Asigna categorías a las keywords seleccionadas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedKeywords.length > 0 ? (
          <>
            <div className="grid gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleAssignCategory} disabled={!selectedCategory} className="w-full">
                <Tag className="h-4 w-4 mr-2" />
                Asignar categoría
              </Button>

              {hasKeywordsWithCategory && (
                <Button variant="outline" onClick={handleRemoveCategory} className="w-full">
                  <Trash className="h-4 w-4 mr-2" />
                  Quitar categoría
                </Button>
              )}
            </div>

            <div className="text-xs text-gray-500">{selectedKeywords.length} keywords seleccionadas</div>
          </>
        ) : (
          <div className="text-sm text-center text-gray-500 py-4">Selecciona keywords para categorizarlas</div>
        )}
      </CardContent>
    </Card>
  )
}

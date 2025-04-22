"use client"

import { useState, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Keyword, KeywordCategory, KeywordFilter } from "@/types/keyword"
import { Edit, ArrowUpDown, FileText, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface KeywordTableProps {
  keywords: Keyword[]
  categories: KeywordCategory[]
  onSelectKeywords: (keywords: Keyword[]) => void
  onEditKeyword: (keyword: Keyword) => void
  onEditNotes: (keyword: Keyword) => void
  filter: KeywordFilter
}

export default function KeywordTable({
  keywords,
  categories,
  onSelectKeywords,
  onEditKeyword,
  onEditNotes,
  filter,
}: KeywordTableProps) {
  const [filteredKeywords, setFilteredKeywords] = useState<Keyword[]>([])
  const [sortColumn, setSortColumn] = useState<keyof Keyword>("keyword")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    let result = [...keywords]

    // Aplicar filtros
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      result = result.filter(
        (kw) =>
          kw.keyword.toLowerCase().includes(searchLower) || (kw.notes && kw.notes.toLowerCase().includes(searchLower)),
      )
    }

    if (filter.categories && filter.categories.length > 0) {
      result = result.filter((kw) => !kw.category || filter.categories.includes(kw.category))
    }

    if (filter.minVolume !== undefined) {
      result = result.filter((kw) => kw.volume >= filter.minVolume!)
    }

    if (filter.maxVolume !== undefined) {
      result = result.filter((kw) => kw.volume <= filter.maxVolume!)
    }

    if (filter.minCompetition !== undefined) {
      result = result.filter((kw) => kw.competition >= filter.minCompetition!)
    }

    if (filter.maxCompetition !== undefined) {
      result = result.filter((kw) => kw.competition <= filter.maxCompetition!)
    }

    if (filter.minCpc !== undefined) {
      result = result.filter((kw) => kw.cpc >= filter.minCpc!)
    }

    if (filter.maxCpc !== undefined) {
      result = result.filter((kw) => kw.cpc <= filter.maxCpc!)
    }

    if (filter.hasNotes) {
      result = result.filter((kw) => kw.notes && kw.notes.trim() !== "")
    }

    if (filter.hasTags) {
      result = result.filter((kw) => kw.tags && kw.tags.length > 0)
    }

    // Ordenar
    result.sort((a, b) => {
      let valueA = a[sortColumn]
      let valueB = b[sortColumn]

      // Manejar valores n  => {

      // Manejar valores nulos o undefined
      if (valueA === undefined || valueA === null) valueA = ""
      if (valueB === undefined || valueB === null) valueB = ""

      // Comparar según el tipo de dato
      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
      } else {
        return sortDirection === "asc"
          ? valueA < valueB
            ? -1
            : valueA > valueB
              ? 1
              : 0
          : valueB < valueA
            ? -1
            : valueB > valueA
              ? 1
              : 0
      }
    })

    setFilteredKeywords(result)

    // Actualizar selecciones
    const newSelectedKeywords = new Set<string>()
    selectedKeywords.forEach((id) => {
      if (result.some((kw) => kw.id === id)) {
        newSelectedKeywords.add(id)
      }
    })
    setSelectedKeywords(newSelectedKeywords)

    // Actualizar estado de selección
    updateSelectionState(newSelectedKeywords, result)
  }, [keywords, filter, sortColumn, sortDirection])

  // Actualizar selecciones cuando cambian las keywords filtradas
  useEffect(() => {
    const newSelectedKeywords = new Set<string>()
    selectedKeywords.forEach((id) => {
      if (filteredKeywords.some((kw) => kw.id === id)) {
        newSelectedKeywords.add(id)
      }
    })

    if (newSelectedKeywords.size !== selectedKeywords.size) {
      setSelectedKeywords(newSelectedKeywords)
      updateSelectionState(newSelectedKeywords, filteredKeywords)
    }
  }, [filteredKeywords])

  // Actualizar el estado de selección (todos, algunos o ninguno)
  const updateSelectionState = useCallback((selected: Set<string>, keywordsToCheck: Keyword[]) => {
    if (keywordsToCheck.length === 0) {
      setSelectAll(false)
      setIndeterminate(false)
      return
    }

    const selectedCount = keywordsToCheck.filter((kw) => selected.has(kw.id)).length

    setSelectAll(selectedCount === keywordsToCheck.length)
    setIndeterminate(selectedCount > 0 && selectedCount < keywordsToCheck.length)
  }, [])

  // Manejar cambio en la selección de todas las keywords
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const newSelected = new Set<string>()
        filteredKeywords.forEach((kw) => newSelected.add(kw.id))
        setSelectedKeywords(newSelected)
        setSelectAll(true)
        setIndeterminate(false)
      } else {
        setSelectedKeywords(new Set())
        setSelectAll(false)
        setIndeterminate(false)
      }
    },
    [filteredKeywords],
  )

  // Manejar cambio en la selección de una keyword
  const handleSelectKeyword = useCallback((checked: boolean, keyword: Keyword) => {
    setSelectedKeywords((prev) => {
      const newSelected = new Set(prev)

      if (checked) {
        newSelected.add(keyword.id)
      } else {
        newSelected.delete(keyword.id)
      }

      // No llamar a updateSelectionState aquí, se hará en el efecto
      return newSelected
    })
  }, [])

  // Manejar cambio en la columna de ordenamiento
  const handleSort = useCallback(
    (column: keyof Keyword) => {
      if (sortColumn === column) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
      } else {
        setSortColumn(column)
        setSortDirection("asc")
      }
    },
    [sortColumn, sortDirection],
  )

  // Notificar al componente padre sobre las keywords seleccionadas
  useEffect(() => {
    const selected = filteredKeywords.filter((kw) => selectedKeywords.has(kw.id))
    onSelectKeywords(selected)
  }, [selectedKeywords, filteredKeywords, onSelectKeywords])

  // Obtener el color de la categoría
  const getCategoryColor = useCallback(
    (categoryName?: string) => {
      if (!categoryName) return "#A0A0A0" // Color por defecto para "Sin categoría"
      const category = categories.find((c) => c.name === categoryName)
      return category ? category.color : "#A0A0A0"
    },
    [categories],
  )

  // Formatear el valor de competencia
  const formatCompetition = useCallback((value: number) => {
    return `${(value * 100).toFixed(0)}%`
  }, [])

  // Formatear el valor de CPC
  const formatCPC = useCallback((keyword: Keyword) => {
    // Si existe cpcOriginal, usarlo
    if (keyword.cpcOriginal) {
      return keyword.cpcOriginal
    }

    // Si no, formatear el valor numérico
    return `$${keyword.cpc.toFixed(2)}`
  }, [])

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectAll}
                indeterminate={indeterminate ? true : undefined}
                onCheckedChange={handleSelectAll}
                aria-label="Seleccionar todas las palabras clave"
              />
            </TableHead>

            <TableHead className="min-w-[180px]">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" onClick={() => handleSort("keyword")} className="p-0 h-8">
                  Palabra Clave
                  <ArrowUpDown
                    className={cn("ml-1 h-4 w-4", sortColumn === "keyword" ? "opacity-100" : "opacity-40")}
                  />
                </Button>
              </div>
            </TableHead>

            <TableHead className="w-24">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" onClick={() => handleSort("volume")} className="p-0 h-8">
                  Volumen
                  <ArrowUpDown className={cn("ml-1 h-4 w-4", sortColumn === "volume" ? "opacity-100" : "opacity-40")} />
                </Button>
              </div>
            </TableHead>

            <TableHead className="w-28">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" onClick={() => handleSort("competition")} className="p-0 h-8">
                  Competencia
                  <ArrowUpDown
                    className={cn("ml-1 h-4 w-4", sortColumn === "competition" ? "opacity-100" : "opacity-40")}
                  />
                </Button>
              </div>
            </TableHead>

            <TableHead className="w-24">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" onClick={() => handleSort("cpc")} className="p-0 h-8">
                  CPC
                  <ArrowUpDown className={cn("ml-1 h-4 w-4", sortColumn === "cpc" ? "opacity-100" : "opacity-40")} />
                </Button>
              </div>
            </TableHead>

            <TableHead className="w-32">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" onClick={() => handleSort("category")} className="p-0 h-8">
                  Categoría
                  <ArrowUpDown
                    className={cn("ml-1 h-4 w-4", sortColumn === "category" ? "opacity-100" : "opacity-40")}
                  />
                </Button>
              </div>
            </TableHead>

            <TableHead className="w-20 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredKeywords.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No se encontraron palabras clave.
              </TableCell>
            </TableRow>
          ) : (
            filteredKeywords.map((keyword) => (
              <TableRow key={keyword.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedKeywords.has(keyword.id)}
                    onCheckedChange={(checked) => handleSelectKeyword(!!checked, keyword)}
                    aria-label={`Seleccionar ${keyword.keyword}`}
                  />
                </TableCell>

                <TableCell className="font-medium">{keyword.keyword}</TableCell>

                <TableCell>{keyword.volume.toLocaleString()}</TableCell>

                <TableCell>
                  <div
                    className="w-full h-2 rounded-full bg-gray-200 overflow-hidden"
                    title={formatCompetition(keyword.competition)}
                  >
                    <div
                      className={cn(
                        "h-full",
                        keyword.competition < 0.3
                          ? "bg-green-500"
                          : keyword.competition < 0.7
                            ? "bg-yellow-500"
                            : "bg-red-500",
                      )}
                      style={{ width: `${keyword.competition * 100}%` }}
                    />
                  </div>
                  <div className="text-xs mt-1 text-center">{formatCompetition(keyword.competition)}</div>
                </TableCell>

                <TableCell>{formatCPC(keyword)}</TableCell>

                <TableCell>
                  {keyword.category ? (
                    <Badge
                      style={{
                        backgroundColor: getCategoryColor(keyword.category),
                        color: "#fff",
                      }}
                    >
                      {keyword.category}
                    </Badge>
                  ) : (
                    <Badge variant="outline">Sin categoría</Badge>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => onEditKeyword(keyword)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar palabra clave</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => onEditNotes(keyword)}>
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar notas</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {keyword.notes && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-blue-500">
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">{keyword.notes}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

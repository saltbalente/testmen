"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Search, Database, Tag, BarChart3, Trash2, Download, Filter, ArrowUpDown, Plus } from "lucide-react"
import KeywordImporter from "./keyword-importer"
import { CustomPagination } from "./custom-pagination"

// Interfaz para las keywords importadas
interface ImportedKeyword {
  keyword: string
  searchVolume?: number
  difficulty?: number
  cpc?: number
  competition?: number
  seasonality?: string
  intent?: string
  source?: string
  tags?: string[]
  lastUpdated?: Date
}

// Interfaz para los filtros
interface KeywordFilters {
  search: string
  intent: string
  minVolume: number
  maxDifficulty: number
  tags: string[]
  source: string
}

export default function KeywordDatabase({
  onAddKeywords,
}: {
  onAddKeywords: (keywords: string[]) => void
}) {
  const [activeTab, setActiveTab] = useState<string>("database")
  const [keywords, setKeywords] = useState<ImportedKeyword[]>([])
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [filters, setFilters] = useState<KeywordFilters>({
    search: "",
    intent: "",
    minVolume: 0,
    maxDifficulty: 1,
    tags: [],
    source: "",
  })
  const [sortField, setSortField] = useState<keyof ImportedKeyword>("keyword")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [availableSources, setAvailableSources] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const { toast } = useToast()

  // Función para sincronizar con el servidor (guardar)
  const syncToServer = useCallback(async () => {
    try {
      const response = await fetch("/api/keywords/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keywords }),
      })

      if (!response.ok) {
        throw new Error("Error al guardar en el servidor")
      }

      const data = await response.json()

      toast({
        title: "Sincronización completada",
        description: `Se han guardado ${keywords.length} keywords en el servidor.`,
      })

      return data
    } catch (error) {
      console.error("Error al sincronizar con el servidor:", error)
      toast({
        title: "Error de sincronización",
        description: "No se pudieron guardar los datos en el servidor.",
        variant: "destructive",
      })
    }
  }, [keywords, toast])

  // Función para cargar desde el servidor
  const loadFromServer = useCallback(async () => {
    try {
      const response = await fetch("/api/keywords/load")

      if (!response.ok) {
        throw new Error("Error al cargar desde el servidor")
      }

      const data = await response.json()

      if (data.keywords && Array.isArray(data.keywords)) {
        // Combinar con keywords existentes, evitando duplicados
        const existingKeywords = new Set(keywords.map((k) => k.keyword.toLowerCase()))
        const newKeywords = data.keywords.filter((k) => !existingKeywords.has(k.keyword.toLowerCase()))

        if (newKeywords.length > 0) {
          setKeywords((prev) => [...prev, ...newKeywords])
          toast({
            title: "Datos cargados",
            description: `Se han cargado ${newKeywords.length} keywords nuevas desde el servidor.`,
          })
        } else {
          toast({
            title: "Datos cargados",
            description: "No hay keywords nuevas para cargar desde el servidor.",
          })
        }
      }

      return data
    } catch (error) {
      console.error("Error al cargar desde el servidor:", error)
      toast({
        title: "Error al cargar",
        description: "No se pudieron cargar los datos desde el servidor.",
        variant: "destructive",
      })
    }
  }, [keywords, toast])

  // Sincronizar automáticamente cuando cambian las keywords
  useEffect(() => {
    // Debounce para no hacer demasiadas llamadas
    const timer = setTimeout(() => {
      syncToServer()
    }, 5000) // 5 segundos después de la última modificación

    return () => clearTimeout(timer)
  }, [keywords, syncToServer])

  // Cargar datos del servidor al iniciar
  useEffect(() => {
    loadFromServer()
  }, [loadFromServer])

  // Cargar keywords desde localStorage al iniciar
  useEffect(() => {
    const savedKeywords = localStorage.getItem("keyword_database")
    if (savedKeywords) {
      try {
        const parsed = JSON.parse(savedKeywords)
        setKeywords(parsed)

        // Extraer tags y sources únicos
        const tags = new Set<string>()
        const sources = new Set<string>()

        parsed.forEach((kw: ImportedKeyword) => {
          if (kw.source) sources.add(kw.source)
          if (kw.tags) kw.tags.forEach((tag) => tags.add(tag))
        })

        setAvailableTags(Array.from(tags))
        setAvailableSources(Array.from(sources))
      } catch (error) {
        console.error("Error al cargar keywords:", error)
      }
    }
  }, [])

  // Guardar keywords en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("keyword_database", JSON.stringify(keywords))

    // Actualizar tags y sources disponibles
    const tags = new Set<string>()
    const sources = new Set<string>()

    keywords.forEach((kw) => {
      if (kw.source) sources.add(kw.source)
      if (kw.tags) kw.tags.forEach((tag) => tags.add(tag))
    })

    setAvailableTags(Array.from(tags))
    setAvailableSources(Array.from(sources))
  }, [keywords])

  // Manejar la importación de nuevas keywords
  const handleImport = (importedKeywords: ImportedKeyword[]) => {
    // Verificar duplicados
    const existingKeywords = new Set(keywords.map((k) => k.keyword.toLowerCase()))
    const newKeywords = importedKeywords.filter((k) => !existingKeywords.has(k.keyword.toLowerCase()))

    if (newKeywords.length === 0) {
      toast({
        title: "No hay keywords nuevas",
        description: "Todas las keywords ya existen en la base de datos.",
        variant: "warning",
      })
      return
    }

    // Añadir las nuevas keywords
    setKeywords((prev) => [...prev, ...newKeywords])

    toast({
      title: "Keywords importadas",
      description: `Se han importado ${newKeywords.length} keywords nuevas.`,
    })

    // Cambiar a la pestaña de base de datos
    setActiveTab("database")
  }

  // Filtrar keywords según los filtros aplicados
  const filteredKeywords = keywords.filter((kw) => {
    // Filtro de búsqueda
    if (filters.search && !kw.keyword.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }

    // Filtro de intención
    if (filters.intent && kw.intent !== filters.intent) {
      return false
    }

    // Filtro de volumen mínimo
    if (filters.minVolume > 0 && (!kw.searchVolume || kw.searchVolume < filters.minVolume)) {
      return false
    }

    // Filtro de dificultad máxima
    if (filters.maxDifficulty < 1 && (kw.difficulty === undefined || kw.difficulty > filters.maxDifficulty)) {
      return false
    }

    // Filtro de etiquetas
    if (filters.tags.length > 0) {
      if (!kw.tags || !filters.tags.some((tag) => kw.tags?.includes(tag))) {
        return false
      }
    }

    // Filtro de fuente
    if (filters.source && kw.source !== filters.source) {
      return false
    }

    return true
  })

  // Ordenar keywords
  const sortedKeywords = [...filteredKeywords].sort((a, b) => {
    const valueA = a[sortField]
    const valueB = b[sortField]

    // Manejar valores undefined
    if (valueA === undefined) return sortDirection === "asc" ? -1 : 1
    if (valueB === undefined) return sortDirection === "asc" ? 1 : -1

    // Comparar según el tipo de dato
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
    }

    // Para números
    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA
    }

    // Para fechas
    if (valueA instanceof Date && valueB instanceof Date) {
      return sortDirection === "asc" ? valueA.getTime() - valueB.getTime() : valueB.getTime() - valueA.getTime()
    }

    return 0
  })

  // Paginación
  const totalPages = Math.ceil(sortedKeywords.length / itemsPerPage)
  const paginatedKeywords = sortedKeywords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Cambiar el ordenamiento
  const toggleSort = (field: keyof ImportedKeyword) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Seleccionar/deseleccionar una keyword
  const toggleKeywordSelection = (keyword: string) => {
    setSelectedKeywords((prev) => (prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]))
  }

  // Seleccionar/deseleccionar todas las keywords de la página actual
  const toggleSelectAll = () => {
    if (selectedKeywords.length === paginatedKeywords.length) {
      setSelectedKeywords([])
    } else {
      setSelectedKeywords(paginatedKeywords.map((kw) => kw.keyword))
    }
  }

  // Añadir keywords seleccionadas a la lista principal
  const handleAddSelected = () => {
    if (selectedKeywords.length === 0) {
      toast({
        title: "No hay keywords seleccionadas",
        description: "Selecciona al menos una keyword para añadir.",
        variant: "warning",
      })
      return
    }

    onAddKeywords(selectedKeywords)

    toast({
      title: "Keywords añadidas",
      description: `Se han añadido ${selectedKeywords.length} keywords a tu lista.`,
    })

    setSelectedKeywords([])
  }

  // Eliminar keywords seleccionadas de la base de datos
  const handleDeleteSelected = () => {
    if (selectedKeywords.length === 0) {
      toast({
        title: "No hay keywords seleccionadas",
        description: "Selecciona al menos una keyword para eliminar.",
        variant: "warning",
      })
      return
    }

    setKeywords((prev) => prev.filter((kw) => !selectedKeywords.includes(kw.keyword)))

    toast({
      title: "Keywords eliminadas",
      description: `Se han eliminado ${selectedKeywords.length} keywords de la base de datos.`,
    })

    setSelectedKeywords([])
  }

  // Exportar keywords seleccionadas como CSV
  const handleExportSelected = () => {
    if (selectedKeywords.length === 0) {
      toast({
        title: "No hay keywords seleccionadas",
        description: "Selecciona al menos una keyword para exportar.",
        variant: "warning",
      })
      return
    }

    // Obtener las keywords completas
    const keywordsToExport = keywords.filter((kw) => selectedKeywords.includes(kw.keyword))

    // Crear el contenido CSV
    const headers = [
      "keyword",
      "searchVolume",
      "difficulty",
      "cpc",
      "competition",
      "seasonality",
      "intent",
      "tags",
      "source",
    ]
    const csvContent = [
      headers.join(","),
      ...keywordsToExport.map((kw) => {
        return [
          `"${kw.keyword}"`,
          kw.searchVolume !== undefined ? kw.searchVolume : "",
          kw.difficulty !== undefined ? kw.difficulty : "",
          kw.cpc !== undefined ? kw.cpc : "",
          kw.competition !== undefined ? kw.competition : "",
          kw.seasonality ? `"${kw.seasonality}"` : "",
          kw.intent ? `"${kw.intent}"` : "",
          kw.tags ? `"${kw.tags.join(", ")}"` : "",
          kw.source ? `"${kw.source}"` : "",
        ].join(",")
      }),
    ].join("\n")

    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "keywords_export.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Keywords exportadas",
      description: `Se han exportado ${selectedKeywords.length} keywords como CSV.`,
    })
  }

  // Actualizar un filtro
  const updateFilter = (key: keyof KeywordFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
    setCurrentPage(1) // Resetear a la primera página al cambiar filtros
  }

  // Limpiar todos los filtros
  const clearFilters = () => {
    setFilters({
      search: "",
      intent: "",
      minVolume: 0,
      maxDifficulty: 1,
      tags: [],
      source: "",
    })
  }

  // Renderizar la sección de filtros
  const renderFilters = () => {
    return (
      <div className="space-y-4 p-4 border rounded-md bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Filtros</h3>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="intent-filter">Intención de búsqueda</Label>
            <Select value={filters.intent} onValueChange={(value) => updateFilter("intent", value)}>
              <SelectTrigger id="intent-filter">
                <SelectValue placeholder="Todas las intenciones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las intenciones</SelectItem>
                <SelectItem value="informational">Informacional</SelectItem>
                <SelectItem value="transactional">Transaccional</SelectItem>
                <SelectItem value="navigational">Navegacional</SelectItem>
                <SelectItem value="commercial">Comercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="volume-filter">Volumen mínimo</Label>
            <Select
              value={String(filters.minVolume)}
              onValueChange={(value) => updateFilter("minVolume", Number(value))}
            >
              <SelectTrigger id="volume-filter">
                <SelectValue placeholder="Cualquier volumen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Cualquier volumen</SelectItem>
                <SelectItem value="10">10+</SelectItem>
                <SelectItem value="100">100+</SelectItem>
                <SelectItem value="1000">1,000+</SelectItem>
                <SelectItem value="10000">10,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty-filter">Dificultad máxima</Label>
            <Select
              value={String(filters.maxDifficulty)}
              onValueChange={(value) => updateFilter("maxDifficulty", Number(value))}
            >
              <SelectTrigger id="difficulty-filter">
                <SelectValue placeholder="Cualquier dificultad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Cualquier dificultad</SelectItem>
                <SelectItem value="0.3">Baja (0-30%)</SelectItem>
                <SelectItem value="0.6">Media (0-60%)</SelectItem>
                <SelectItem value="0.8">Alta (0-80%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source-filter">Fuente</Label>
            <Select value={filters.source} onValueChange={(value) => updateFilter("source", value)}>
              <SelectTrigger id="source-filter">
                <SelectValue placeholder="Todas las fuentes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las fuentes</SelectItem>
                {availableSources.map((source, index) => (
                  <SelectItem key={index} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label>Etiquetas</Label>
            <ScrollArea className="h-20 border rounded-md p-2">
              <div className="space-y-2">
                {availableTags.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay etiquetas disponibles</p>
                ) : (
                  availableTags.map((tag, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${index}`}
                        checked={filters.tags.includes(tag)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilter("tags", [...filters.tags, tag])
                          } else {
                            updateFilter(
                              "tags",
                              filters.tags.filter((t) => t !== tag),
                            )
                          }
                        }}
                      />
                      <Label htmlFor={`tag-${index}`} className="text-sm">
                        {tag}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Base de Datos de Keywords</CardTitle>
          <CardDescription>Importa, gestiona y utiliza tu propia base de datos de keywords</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={loadFromServer} title="Cargar datos desde el servidor">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Cargar
          </Button>
          <Button variant="outline" size="sm" onClick={syncToServer} title="Guardar datos en el servidor">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Guardar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="database">
              <Database className="h-4 w-4 mr-2" />
              Base de Datos ({keywords.length})
            </TabsTrigger>
            <TabsTrigger value="import">
              <Plus className="h-4 w-4 mr-2" />
              Importar Nuevas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="database" className="space-y-4">
            {keywords.length === 0 ? (
              <div className="text-center py-8">
                <Database className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <h3 className="mt-2 text-lg font-medium">No hay keywords en la base de datos</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Importa keywords para comenzar a utilizar la base de datos
                </p>
                <Button className="mt-4" onClick={() => setActiveTab("import")}>
                  Importar Keywords
                </Button>
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar keywords..."
                      className="pl-8"
                      value={filters.search}
                      onChange={(e) => updateFilter("search", e.target.value)}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                      <Filter className="h-4 w-4 mr-2" />
                      {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
                    </Button>

                    <Select
                      value={String(itemsPerPage)}
                      onValueChange={(value) => {
                        setItemsPerPage(Number(value))
                        setCurrentPage(1)
                      }}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="10 por página" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 por página</SelectItem>
                        <SelectItem value="25">25 por página</SelectItem>
                        <SelectItem value="50">50 por página</SelectItem>
                        <SelectItem value="100">100 por página</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {showFilters && renderFilters()}

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={
                              paginatedKeywords.length > 0 && selectedKeywords.length === paginatedKeywords.length
                            }
                            onCheckedChange={toggleSelectAll}
                            aria-label="Seleccionar todas"
                          />
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => toggleSort("keyword")}>
                          <div className="flex items-center">
                            Keyword
                            {sortField === "keyword" && (
                              <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => toggleSort("searchVolume")}>
                          <div className="flex items-center">
                            Volumen
                            {sortField === "searchVolume" && (
                              <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => toggleSort("difficulty")}>
                          <div className="flex items-center">
                            Dificultad
                            {sortField === "difficulty" && (
                              <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Intención</TableHead>
                        <TableHead>Etiquetas</TableHead>
                        <TableHead>Fuente</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedKeywords.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No se encontraron keywords que coincidan con los filtros
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedKeywords.map((kw, index) => (
                          <TableRow
                            key={index}
                            className={selectedKeywords.includes(kw.keyword) ? "bg-primary/10" : ""}
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedKeywords.includes(kw.keyword)}
                                onCheckedChange={() => toggleKeywordSelection(kw.keyword)}
                                aria-label={`Seleccionar ${kw.keyword}`}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{kw.keyword}</TableCell>
                            <TableCell>
                              {kw.searchVolume !== undefined ? (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  <BarChart3 className="h-3 w-3 mr-1" />
                                  {kw.searchVolume.toLocaleString()}
                                </Badge>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>
                              {kw.difficulty !== undefined ? (
                                <Badge
                                  variant="outline"
                                  className={`
                                    ${
                                      kw.difficulty <= 0.3
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : kw.difficulty <= 0.6
                                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                          : "bg-red-50 text-red-700 border-red-200"
                                    }
                                  `}
                                >
                                  {Math.round(kw.difficulty * 100)}%
                                </Badge>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>
                              {kw.intent ? (
                                <Badge
                                  variant="outline"
                                  className={`
                                    ${
                                      kw.intent === "informational"
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : kw.intent === "transactional"
                                          ? "bg-green-50 text-green-700 border-green-200"
                                          : kw.intent === "navigational"
                                            ? "bg-purple-50 text-purple-700 border-purple-200"
                                            : "bg-orange-50 text-orange-700 border-orange-200"
                                    }
                                  `}
                                >
                                  {kw.intent}
                                </Badge>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>
                              {kw.tags && kw.tags.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {kw.tags.slice(0, 2).map((tag, i) => (
                                    <Badge key={i} variant="outline" className="bg-gray-50">
                                      <Tag className="h-3 w-3 mr-1" />
                                      {tag}
                                    </Badge>
                                  ))}
                                  {kw.tags.length > 2 && (
                                    <Badge variant="outline" className="bg-gray-50">
                                      +{kw.tags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>
                              {kw.source ? (
                                <Badge variant="outline" className="bg-gray-50">
                                  {kw.source}
                                </Badge>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {paginatedKeywords.length} de {filteredKeywords.length} keywords
                    {filteredKeywords.length !== keywords.length && <> (filtradas de {keywords.length} total)</>}
                  </div>

                  {totalPages > 1 && (
                    <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                  )}
                </div>

                <div className="flex flex-wrap gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportSelected}
                    disabled={selectedKeywords.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar seleccionadas
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteSelected}
                    disabled={selectedKeywords.length === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar seleccionadas
                  </Button>

                  <Button size="sm" onClick={handleAddSelected} disabled={selectedKeywords.length === 0}>
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir seleccionadas
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="import">
            <KeywordImporter onImport={handleImport} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

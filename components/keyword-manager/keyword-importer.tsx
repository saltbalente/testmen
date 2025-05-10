"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileSpreadsheet, AlertCircle, Check, X, Download } from "lucide-react"
import { useState as useReactState } from "react"

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

// Interfaz para el mapeo de columnas
interface ColumnMapping {
  keyword: string
  searchVolume?: string
  difficulty?: string
  cpc?: string
  competition?: string
  seasonality?: string
  intent?: string
  tags?: string
}

export default function KeywordImporter({
  onImport,
  keywords = [],
}: {
  onImport: (keywords: ImportedKeyword[]) => void
  keywords?: ImportedKeyword[]
}) {
  const [activeTab, setActiveTab] = useState<string>("csv")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [pastedText, setPastedText] = useState<string>("")
  const [previewData, setPreviewData] = useState<string[][]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({ keyword: "" })
  const [importedKeywords, setImportedKeywords] = useState<ImportedKeyword[]>([])
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const [formValues, setValue] = useReactState({
    exportFormat: "csv",
  })

  // Función para exportar las keywords
  const handleExport = () => {
    if (keywords.length === 0) {
      toast({
        title: "No hay keywords para exportar",
        description: "No hay datos disponibles para exportar.",
        variant: "warning",
      })
      return
    }

    let content = ""
    const format = formValues.exportFormat

    if (format === "csv") {
      // Crear encabezados
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
        "lastUpdated",
      ].join(",")

      // Crear filas
      const rows = keywords.map((kw) => {
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
          kw.lastUpdated ? new Date(kw.lastUpdated).toISOString() : "",
        ].join(",")
      })

      content = [headers, ...rows].join("\n")
    } else if (format === "json") {
      content = JSON.stringify(keywords, null, 2)
    } else {
      // Texto plano
      content = keywords.map((kw) => kw.keyword).join("\n")
    }

    // Crear y descargar el archivo
    const blob = new Blob([content], {
      type: `text/${format === "json" ? "json" : format === "csv" ? "csv" : "plain"}`,
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `keywords_export.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Keywords exportadas con éxito",
      description: `Se han exportado ${keywords.length} keywords en formato ${format.toUpperCase()}.`,
    })
  }

  // Función para manejar la carga de archivos CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]
    if (!file) return

    // Verificar que es un archivo CSV
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Por favor, sube un archivo CSV válido.")
      return
    }

    setCsvFile(file)
    parseCSV(file)
  }

  // Función para analizar el archivo CSV
  const parseCSV = (file: File) => {
    setIsProcessing(true)
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const result = parseCSVText(text)
        setPreviewData(result.data)
        setHeaders(result.headers)

        // Intentar mapeo automático de columnas
        const mapping: ColumnMapping = { keyword: "" }
        result.headers.forEach((header) => {
          const lowerHeader = header.toLowerCase()
          if (lowerHeader.includes("keyword") || lowerHeader.includes("palabra") || lowerHeader.includes("término")) {
            mapping.keyword = header
          } else if (
            lowerHeader.includes("volume") ||
            lowerHeader.includes("volumen") ||
            lowerHeader.includes("búsquedas")
          ) {
            mapping.searchVolume = header
          } else if (lowerHeader.includes("difficulty") || lowerHeader.includes("dificultad")) {
            mapping.difficulty = header
          } else if (lowerHeader.includes("cpc") || lowerHeader.includes("costo")) {
            mapping.cpc = header
          } else if (lowerHeader.includes("competition") || lowerHeader.includes("competencia")) {
            mapping.competition = header
          } else if (lowerHeader.includes("season") || lowerHeader.includes("estacional")) {
            mapping.seasonality = header
          } else if (lowerHeader.includes("intent") || lowerHeader.includes("intención")) {
            mapping.intent = header
          } else if (lowerHeader.includes("tag") || lowerHeader.includes("etiqueta")) {
            mapping.tags = header
          }
        })

        setColumnMapping(mapping)
      } catch (error) {
        console.error("Error al analizar CSV:", error)
        setError("Error al analizar el archivo CSV. Verifica el formato.")
      } finally {
        setIsProcessing(false)
      }
    }

    reader.onerror = () => {
      setError("Error al leer el archivo. Intenta de nuevo.")
      setIsProcessing(false)
    }

    reader.readAsText(file)
  }

  // Función para analizar texto CSV
  const parseCSVText = (text: string) => {
    // Dividir por líneas
    const lines = text.split(/\r\n|\n/)

    // Eliminar líneas vacías
    const nonEmptyLines = lines.filter((line) => line.trim().length > 0)

    if (nonEmptyLines.length === 0) {
      throw new Error("El archivo CSV está vacío")
    }

    // Detectar el delimitador (coma, punto y coma, o tabulación)
    const firstLine = nonEmptyLines[0]
    let delimiter = ","
    if (firstLine.includes(";")) {
      delimiter = ";"
    } else if (firstLine.includes("\t")) {
      delimiter = "\t"
    }

    // Procesar las líneas
    const data: string[][] = []
    nonEmptyLines.forEach((line) => {
      // Manejar valores entre comillas que pueden contener delimitadores
      const values: string[] = []
      let inQuotes = false
      let currentValue = ""

      for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === delimiter && !inQuotes) {
          values.push(currentValue.trim())
          currentValue = ""
        } else {
          currentValue += char
        }
      }

      // Añadir el último valor
      values.push(currentValue.trim())
      data.push(values)
    })

    // Extraer encabezados
    const headers = data[0].map((header) => header.replace(/^["'](.*)["']$/, "$1"))

    // Eliminar encabezados de los datos
    const rowsData = data.slice(1)

    return { headers, data: rowsData }
  }

  // Función para manejar el texto pegado
  const handlePastedText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setError(null)
    setPastedText(e.target.value)

    if (e.target.value.trim()) {
      try {
        const result = parseCSVText(e.target.value)
        setPreviewData(result.data)
        setHeaders(result.headers)

        // Intentar mapeo automático de columnas
        const mapping: ColumnMapping = { keyword: "" }
        result.headers.forEach((header) => {
          const lowerHeader = header.toLowerCase()
          if (lowerHeader.includes("keyword") || lowerHeader.includes("palabra") || lowerHeader.includes("término")) {
            mapping.keyword = header
          } else if (
            lowerHeader.includes("volume") ||
            lowerHeader.includes("volumen") ||
            lowerHeader.includes("búsquedas")
          ) {
            mapping.searchVolume = header
          } else if (lowerHeader.includes("difficulty") || lowerHeader.includes("dificultad")) {
            mapping.difficulty = header
          } else if (lowerHeader.includes("cpc") || lowerHeader.includes("costo")) {
            mapping.cpc = header
          } else if (lowerHeader.includes("competition") || lowerHeader.includes("competencia")) {
            mapping.competition = header
          } else if (lowerHeader.includes("season") || lowerHeader.includes("estacional")) {
            mapping.seasonality = header
          } else if (lowerHeader.includes("intent") || lowerHeader.includes("intención")) {
            mapping.intent = header
          } else if (lowerHeader.includes("tag") || lowerHeader.includes("etiqueta")) {
            mapping.tags = header
          }
        })

        setColumnMapping(mapping)
      } catch (error) {
        console.error("Error al analizar texto pegado:", error)
        setError("Error al analizar el texto. Verifica el formato.")
      }
    } else {
      setPreviewData([])
      setHeaders([])
    }
  }

  // Función para actualizar el mapeo de columnas
  const updateColumnMapping = (field: keyof ColumnMapping, value: string) => {
    setColumnMapping((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Función para procesar los datos y convertirlos en keywords
  const processData = () => {
    setError(null)

    // Verificar que se ha seleccionado una columna para keyword
    if (!columnMapping.keyword) {
      setError("Debes seleccionar una columna para las keywords.")
      return
    }

    try {
      const keywordIndex = headers.indexOf(columnMapping.keyword)
      if (keywordIndex === -1) {
        throw new Error("No se encontró la columna de keywords seleccionada.")
      }

      const processed: ImportedKeyword[] = []

      previewData.forEach((row) => {
        // Verificar que la fila tiene suficientes columnas y la keyword no está vacía
        if (row.length <= keywordIndex || !row[keywordIndex].trim()) {
          return
        }

        const keyword: ImportedKeyword = {
          keyword: row[keywordIndex].trim(),
          source: csvFile ? csvFile.name : "Texto pegado",
          lastUpdated: new Date(),
        }

        // Añadir campos opcionales si están mapeados
        if (columnMapping.searchVolume) {
          const index = headers.indexOf(columnMapping.searchVolume)
          if (index !== -1 && row[index]) {
            // Limpiar y convertir a número
            const value = row[index].replace(/[^\d.]/g, "")
            keyword.searchVolume = Number.parseFloat(value) || 0
          }
        }

        if (columnMapping.difficulty) {
          const index = headers.indexOf(columnMapping.difficulty)
          if (index !== -1 && row[index]) {
            // Normalizar a un valor entre 0 y 1
            let value = Number.parseFloat(row[index].replace(/[^\d.]/g, "")) || 0
            // Si el valor es mayor que 1 y menor o igual a 100, asumimos que es un porcentaje
            if (value > 1 && value <= 100) {
              value = value / 100
            }
            keyword.difficulty = value
          }
        }

        if (columnMapping.cpc) {
          const index = headers.indexOf(columnMapping.cpc)
          if (index !== -1 && row[index]) {
            const value = row[index].replace(/[^\d.]/g, "")
            keyword.cpc = Number.parseFloat(value) || 0
          }
        }

        if (columnMapping.competition) {
          const index = headers.indexOf(columnMapping.competition)
          if (index !== -1 && row[index]) {
            // Normalizar a un valor entre 0 y 1
            let value = Number.parseFloat(row[index].replace(/[^\d.]/g, "")) || 0
            if (value > 1 && value <= 100) {
              value = value / 100
            }
            keyword.competition = value
          }
        }

        if (columnMapping.seasonality) {
          const index = headers.indexOf(columnMapping.seasonality)
          if (index !== -1 && row[index]) {
            keyword.seasonality = row[index].trim()
          }
        }

        if (columnMapping.intent) {
          const index = headers.indexOf(columnMapping.intent)
          if (index !== -1 && row[index]) {
            keyword.intent = row[index].trim()
          }
        }

        if (columnMapping.tags) {
          const index = headers.indexOf(columnMapping.tags)
          if (index !== -1 && row[index]) {
            // Dividir las etiquetas por comas
            keyword.tags = row[index]
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          }
        }

        processed.push(keyword)
      })

      if (processed.length === 0) {
        throw new Error("No se pudieron procesar keywords válidas.")
      }

      setImportedKeywords(processed)

      toast({
        title: "Datos procesados correctamente",
        description: `Se han procesado ${processed.length} keywords.`,
      })

      return processed
    } catch (error: any) {
      console.error("Error al procesar datos:", error)
      setError(error.message || "Error al procesar los datos.")
      return null
    }
  }

  // Función para importar las keywords procesadas
  const handleImport = () => {
    const processed = processData()
    if (processed) {
      onImport(processed)

      toast({
        title: "Keywords importadas",
        description: `Se han importado ${processed.length} keywords correctamente.`,
      })

      // Limpiar el estado
      if (activeTab === "csv") {
        setCsvFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        setPastedText("")
      }

      setPreviewData([])
      setHeaders([])
      setColumnMapping({ keyword: "" })
      setImportedKeywords([])
    }
  }

  // Función para renderizar la vista previa de los datos
  const renderPreview = () => {
    if (headers.length === 0 || previewData.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <FileSpreadsheet className="mx-auto h-12 w-12 opacity-50" />
          <p className="mt-2">No hay datos para previsualizar</p>
        </div>
      )
    }

    return (
      <div className="overflow-auto max-h-[400px] border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index} className="whitespace-nowrap">
                  {header}
                  {columnMapping.keyword === header && <Badge className="ml-2 bg-primary">Keyword</Badge>}
                  {columnMapping.searchVolume === header && <Badge className="ml-2 bg-blue-500">Volumen</Badge>}
                  {columnMapping.difficulty === header && <Badge className="ml-2 bg-red-500">Dificultad</Badge>}
                  {columnMapping.cpc === header && <Badge className="ml-2 bg-green-500">CPC</Badge>}
                  {columnMapping.competition === header && <Badge className="ml-2 bg-orange-500">Competencia</Badge>}
                  {columnMapping.seasonality === header && <Badge className="ml-2 bg-purple-500">Estacionalidad</Badge>}
                  {columnMapping.intent === header && <Badge className="ml-2 bg-indigo-500">Intención</Badge>}
                  {columnMapping.tags === header && <Badge className="ml-2 bg-pink-500">Etiquetas</Badge>}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {previewData.slice(0, 10).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex} className="whitespace-nowrap">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {previewData.length > 10 && (
              <TableRow>
                <TableCell colSpan={headers.length} className="text-center text-muted-foreground">
                  ... y {previewData.length - 10} filas más
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Función para renderizar el mapeo de columnas
  const renderColumnMapping = () => {
    if (headers.length === 0) {
      return null
    }

    return (
      <div className="space-y-4 mt-4">
        <h3 className="text-lg font-medium">Mapeo de columnas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="keyword-column" className="flex items-center">
              Keyword <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select value={columnMapping.keyword} onValueChange={(value) => updateColumnMapping("keyword", value)}>
              <SelectTrigger id="keyword-column">
                <SelectValue placeholder="Selecciona la columna de keywords" />
              </SelectTrigger>
              <SelectContent>
                {headers.map((header, index) => (
                  <SelectItem key={index} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="volume-column">Volumen de búsqueda</Label>
            <Select
              value={columnMapping.searchVolume || ""}
              onValueChange={(value) => updateColumnMapping("searchVolume", value)}
            >
              <SelectTrigger id="volume-column">
                <SelectValue placeholder="Selecciona la columna de volumen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_mapear">No mapear</SelectItem>
                {headers.map((header, index) => (
                  <SelectItem key={index} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty-column">Dificultad</Label>
            <Select
              value={columnMapping.difficulty || ""}
              onValueChange={(value) => updateColumnMapping("difficulty", value)}
            >
              <SelectTrigger id="difficulty-column">
                <SelectValue placeholder="Selecciona la columna de dificultad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_mapear">No mapear</SelectItem>
                {headers.map((header, index) => (
                  <SelectItem key={index} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpc-column">CPC</Label>
            <Select value={columnMapping.cpc || ""} onValueChange={(value) => updateColumnMapping("cpc", value)}>
              <SelectTrigger id="cpc-column">
                <SelectValue placeholder="Selecciona la columna de CPC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_mapear">No mapear</SelectItem>
                {headers.map((header, index) => (
                  <SelectItem key={index} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="competition-column">Competencia</Label>
            <Select
              value={columnMapping.competition || ""}
              onValueChange={(value) => updateColumnMapping("competition", value)}
            >
              <SelectTrigger id="competition-column">
                <SelectValue placeholder="Selecciona la columna de competencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_mapear">No mapear</SelectItem>
                {headers.map((header, index) => (
                  <SelectItem key={index} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seasonality-column">Estacionalidad</Label>
            <Select
              value={columnMapping.seasonality || ""}
              onValueChange={(value) => updateColumnMapping("seasonality", value)}
            >
              <SelectTrigger id="seasonality-column">
                <SelectValue placeholder="Selecciona la columna de estacionalidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_mapear">No mapear</SelectItem>
                {headers.map((header, index) => (
                  <SelectItem key={index} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="intent-column">Intención de búsqueda</Label>
            <Select value={columnMapping.intent || ""} onValueChange={(value) => updateColumnMapping("intent", value)}>
              <SelectTrigger id="intent-column">
                <SelectValue placeholder="Selecciona la columna de intención" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_mapear">No mapear</SelectItem>
                {headers.map((header, index) => (
                  <SelectItem key={index} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags-column">Etiquetas</Label>
            <Select value={columnMapping.tags || ""} onValueChange={(value) => updateColumnMapping("tags", value)}>
              <SelectTrigger id="tags-column">
                <SelectValue placeholder="Selecciona la columna de etiquetas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_mapear">No mapear</SelectItem>
                {headers.map((header, index) => (
                  <SelectItem key={index} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Importador de Keywords</CardTitle>
        <CardDescription>Importa keywords desde archivos CSV o texto copiado de hojas de cálculo</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="csv">Archivo CSV</TabsTrigger>
            <TabsTrigger value="paste">Copiar y Pegar</TabsTrigger>
            <TabsTrigger value="export">Exportar</TabsTrigger>
          </TabsList>

          <TabsContent value="csv" className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-8">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-4">
                Arrastra y suelta un archivo CSV o haz clic para seleccionarlo
              </p>
              <Input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="max-w-xs" />
              {csvFile && (
                <div className="mt-2 flex items-center">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  <span className="text-sm">{csvFile.name}</span>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="paste" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pasted-text">Pega tus datos tabulados</Label>
              <Textarea
                id="pasted-text"
                placeholder="Pega aquí datos de Excel, Google Sheets u otra hoja de cálculo"
                value={pastedText}
                onChange={handlePastedText}
                rows={8}
              />
              <p className="text-xs text-muted-foreground">
                Asegúrate de incluir una fila de encabezados. Los datos pueden estar separados por comas, punto y coma o
                tabulaciones.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="export-format">Formato de exportación</Label>
                <Select defaultValue="csv" onValueChange={(value) => setValue("exportFormat", value)}>
                  <SelectTrigger id="export-format">
                    <SelectValue placeholder="Selecciona un formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="txt">Texto plano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {keywords.length > 0 ? (
                <>
                  <div className="p-4 border rounded-md bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Keywords disponibles para exportar</p>
                        <p className="text-sm text-muted-foreground">Se exportarán {keywords.length} keywords</p>
                      </div>
                      <Badge variant="outline">{keywords.length}</Badge>
                    </div>
                  </div>

                  <Button onClick={handleExport} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar keywords
                  </Button>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Download className="mx-auto h-12 w-12 opacity-50" />
                  <p className="mt-2">No hay keywords para exportar</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isProcessing ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {headers.length > 0 && (
              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Vista previa de datos</h3>
                  <p className="text-sm text-muted-foreground">
                    Se muestran las primeras 10 filas de {previewData.length} en total
                  </p>
                </div>

                {renderPreview()}
                {renderColumnMapping()}
              </div>
            )}
          </>
        )}

        {importedKeywords.length > 0 && (
          <Alert className="mt-6 bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-500" />
            <AlertTitle>Datos procesados correctamente</AlertTitle>
            <AlertDescription>
              Se han procesado {importedKeywords.length} keywords. Haz clic en "Importar" para añadirlas a tu lista.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setCsvFile(null)
            setPastedText("")
            setPreviewData([])
            setHeaders([])
            setColumnMapping({ keyword: "" })
            setImportedKeywords([])
            setError(null)
            if (fileInputRef.current) {
              fileInputRef.current.value = ""
            }
          }}
        >
          <X className="mr-2 h-4 w-4" />
          Limpiar
        </Button>
        <Button onClick={handleImport} disabled={headers.length === 0 || !columnMapping.keyword}>
          Importar
        </Button>
      </CardFooter>
    </Card>
  )
}

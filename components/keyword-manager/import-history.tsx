"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Download, Eye, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "@/hooks/use-toast"
import type { ImportRecord, Keyword } from "@/types/keyword"

interface ImportHistoryProps {
  onLoadKeywords: (keywords: Keyword[]) => void
}

export default function ImportHistory({ onLoadKeywords }: ImportHistoryProps) {
  const [importHistory, setImportHistory] = useState<ImportRecord[]>([])
  const [activeTab, setActiveTab] = useState<"list" | "stats">("list")

  // Cargar historial de importaciones
  useEffect(() => {
    const savedHistory = localStorage.getItem("keywordImportHistory")
    if (savedHistory) {
      try {
        setImportHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("Error loading import history:", e)
      }
    }
  }, [])

  // Guardar historial cuando cambie
  useEffect(() => {
    if (importHistory.length > 0) {
      localStorage.setItem("keywordImportHistory", JSON.stringify(importHistory))
    }
  }, [importHistory])

  // Cargar keywords de una importación específica
  const handleLoadKeywords = (recordId: string) => {
    const record = importHistory.find((r) => r.id === recordId)
    if (record && record.keywords) {
      onLoadKeywords(record.keywords)
      toast({
        title: "Keywords cargadas",
        description: `Se cargaron ${record.keywords.length} keywords de la importación del ${format(new Date(record.date), "dd/MM/yyyy HH:mm", { locale: es })}`,
      })
    }
  }

  // Eliminar un registro de importación
  const handleDeleteRecord = (recordId: string) => {
    setImportHistory((prev) => prev.filter((r) => r.id !== recordId))
    toast({
      title: "Registro eliminado",
      description: "El registro de importación ha sido eliminado",
    })
  }

  // Exportar keywords de una importación específica
  const handleExportRecord = (record: ImportRecord) => {
    if (!record.keywords || record.keywords.length === 0) return

    // Crear CSV
    const headers = ["Keyword", "Volumen", "Competencia", "CPC", "Categoría", "Notas"]
    const rows = record.keywords.map((kw) => [
      kw.keyword,
      kw.volume.toString(),
      (kw.competition * 100).toFixed(0) + "%",
      kw.cpcOriginal || `$${kw.cpc.toFixed(2)}`,
      kw.category || "",
      kw.notes || "",
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")),
    ].join("\n")

    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `keywords_import_${format(new Date(record.date), "yyyyMMdd_HHmm")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Exportación exitosa",
      description: `Se exportaron ${record.keywords.length} palabras clave`,
    })
  }

  // Calcular estadísticas de importaciones
  const getImportStats = () => {
    if (importHistory.length === 0) return null

    const totalKeywords = importHistory.reduce((sum, record) => sum + (record.keywords?.length || 0), 0)
    const avgKeywordsPerImport = Math.round(totalKeywords / importHistory.length)
    const mostRecentImport = importHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    const largestImport = importHistory.reduce(
      (largest, current) => ((current.keywords?.length || 0) > (largest.keywords?.length || 0) ? current : largest),
      importHistory[0],
    )

    return {
      totalImports: importHistory.length,
      totalKeywords,
      avgKeywordsPerImport,
      mostRecentImport,
      largestImport,
    }
  }

  const stats = getImportStats()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Historial de Importaciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "list" | "stats")}>
          <TabsList className="mb-4">
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            {importHistory.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">No hay registros de importaciones previas</div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Fuente</TableHead>
                      <TableHead>Keywords</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importHistory
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{format(new Date(record.date), "dd/MM/yyyy HH:mm", { locale: es })}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{record.source}</Badge>
                          </TableCell>
                          <TableCell>{record.keywords?.length || 0}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-1">
                              <Button variant="ghost" size="icon" onClick={() => handleLoadKeywords(record.id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleExportRecord(record)}>
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteRecord(record.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats">
            {!stats ? (
              <div className="text-center py-6 text-muted-foreground">
                No hay datos suficientes para mostrar estadísticas
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Total de importaciones</div>
                    <div className="text-2xl font-bold">{stats.totalImports}</div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Total de keywords</div>
                    <div className="text-2xl font-bold">{stats.totalKeywords}</div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Promedio por importación</div>
                    <div className="text-2xl font-bold">{stats.avgKeywordsPerImport}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Importación más reciente</h4>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span>{format(new Date(stats.mostRecentImport.date), "dd/MM/yyyy HH:mm", { locale: es })}</span>
                      <span>{stats.mostRecentImport.keywords?.length || 0} keywords</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Fuente: {stats.mostRecentImport.source}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Importación más grande</h4>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span>{format(new Date(stats.largestImport.date), "dd/MM/yyyy HH:mm", { locale: es })}</span>
                      <span>{stats.largestImport.keywords?.length || 0} keywords</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Fuente: {stats.largestImport.source}</div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

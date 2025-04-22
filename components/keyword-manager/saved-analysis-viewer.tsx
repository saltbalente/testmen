"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalysisStorageService, type SavedAnalysis } from "@/services/analysis-storage"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export function SavedAnalysisViewer() {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([])
  const [activeTab, setActiveTab] = useState<"all" | "intent" | "cluster">("all")

  useEffect(() => {
    loadAnalyses()
  }, [])

  const loadAnalyses = () => {
    try {
      const allAnalyses = AnalysisStorageService.getAnalyses()
      setAnalyses(allAnalyses)
    } catch (error) {
      console.error("Error al cargar los análisis:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los análisis guardados",
        variant: "destructive",
      })
    }
  }

  const deleteAnalysis = (id: string) => {
    try {
      AnalysisStorageService.deleteAnalysis(id)
      setAnalyses((prevAnalyses) => prevAnalyses.filter((analysis) => analysis.id !== id))
      toast({
        title: "Análisis eliminado",
        description: "El análisis ha sido eliminado correctamente",
      })
    } catch (error) {
      console.error("Error al eliminar el análisis:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el análisis",
        variant: "destructive",
      })
    }
  }

  const filteredAnalyses = activeTab === "all" ? analyses : analyses.filter((analysis) => analysis.type === activeTab)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const renderAnalysisContent = (analysis: SavedAnalysis) => {
    if (analysis.type === "intent") {
      return (
        <div className="space-y-2">
          <h4 className="font-medium">Intenciones de búsqueda:</h4>
          <div className="grid grid-cols-1 gap-2">
            {analysis.data.map((intent: any, index: number) => (
              <div key={index} className="border rounded p-2">
                <div className="flex justify-between">
                  <span className="font-medium">{intent.intent}</span>
                  <Badge variant="outline">{intent.percentage}%</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{intent.description}</p>
              </div>
            ))}
          </div>
        </div>
      )
    } else if (analysis.type === "cluster") {
      return (
        <div className="space-y-2">
          <h4 className="font-medium">Clusters de palabras clave:</h4>
          <div className="grid grid-cols-1 gap-2">
            {analysis.data.map((cluster: any, index: number) => (
              <div key={index} className="border rounded p-2">
                <div className="font-medium">{cluster.name}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {cluster.keywords.map((keyword: string, kidx: number) => (
                    <Badge key={kidx} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Análisis Guardados</h2>
        <Button onClick={loadAnalyses} variant="outline" size="sm">
          Actualizar
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="intent">Intención</TabsTrigger>
          <TabsTrigger value="cluster">Clusters</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredAnalyses.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No hay análisis guardados</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAnalyses.map((analysis) => (
                <Card key={analysis.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{analysis.name}</CardTitle>
                        <CardDescription>Keyword: {analysis.primaryKeyword}</CardDescription>
                        <CardDescription>{formatDate(analysis.date)}</CardDescription>
                      </div>
                      <Badge variant={analysis.type === "intent" ? "default" : "secondary"}>
                        {analysis.type === "intent" ? "Intención" : "Clusters"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>{renderAnalysisContent(analysis)}</CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="destructive" size="sm" onClick={() => deleteAnalysis(analysis.id)}>
                      Eliminar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

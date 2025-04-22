"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalysisStorageService } from "@/services/analysis-storage"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SavedAnalysesPage() {
  const [analyses, setAnalyses] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    loadAnalyses()
  }, [])

  const loadAnalyses = () => {
    const allAnalyses = AnalysisStorageService.getAnalyses()
    setAnalyses(allAnalyses)
  }

  const deleteAnalysis = (id: string) => {
    try {
      AnalysisStorageService.deleteAnalysis(id)
      setAnalyses((prev) => prev.filter((analysis) => analysis.id !== id))
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

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver al gestor de keywords
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Análisis Guardados</h1>
          <p className="text-muted-foreground">Gestiona tus análisis de intención y clusters guardados</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="intent">Análisis de Intención</TabsTrigger>
          <TabsTrigger value="cluster">Análisis de Clusters</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredAnalyses.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">No hay análisis guardados</p>
              <p className="text-sm text-muted-foreground mt-2">Los análisis que guardes aparecerán aquí</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAnalyses.map((analysis) => (
                <Card key={analysis.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{analysis.name}</CardTitle>
                        <CardDescription>
                          {analysis.type === "intent" ? "Análisis de Intención" : "Análisis de Clusters"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Keyword principal:</span> {analysis.primaryKeyword}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Fecha:</span> {new Date(analysis.date).toLocaleString()}
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button variant="destructive" size="sm" onClick={() => deleteAnalysis(analysis.id)}>
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

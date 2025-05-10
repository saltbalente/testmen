"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Copy } from "lucide-react"
import { generateKeywordClusters } from "@/app/actions/ai-actions"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

interface ClusterGroup {
  title: string
  keywords: string[]
}

interface ClusterResult {
  mainKeyword: string
  clusters: ClusterGroup[]
}

export function KeywordClusterGenerator() {
  const [keyword, setKeyword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeModel, setActiveModel] = useState<"openai" | "deepseek">("openai")
  const [result, setResult] = useState<ClusterResult | null>(null)
  const { toast } = useToast()

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [selectedKeywordTypes, setSelectedKeywordTypes] = useState<string[]>([])
  const [clusterCount, setClusterCount] = useState(5)
  const [keywordsPerCluster, setKeywordsPerCluster] = useState(5)

  const keywordTypes = [
    { value: "commercial", label: "Comerciales" },
    { value: "transactional", label: "Transaccionales" },
    { value: "informational", label: "Informacionales" },
    { value: "navigational", label: "Navegacionales" },
    { value: "local", label: "Locales" },
    { value: "longtail", label: "Long Tail" },
    { value: "branded", label: "De Marca" },
    { value: "competitor", label: "De Competencia" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!keyword.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa una palabra clave",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const clusters = await generateKeywordClusters(
        keyword,
        activeModel,
        selectedKeywordTypes,
        clusterCount,
        keywordsPerCluster,
      )
      setResult(clusters)
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al generar los clusters. Por favor intenta de nuevo.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!result) return

    let text = `${result.mainKeyword}: Keyword Cluster\n\n`

    result.clusters.forEach((cluster) => {
      text += `${cluster.title}\n\n`
      cluster.keywords.forEach((kw) => {
        text += `${kw}\n`
      })
      text += "\n"
    })

    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado",
      description: "Clusters copiados al portapapeles",
    })
  }

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Generador de Clusters de Palabras Clave</CardTitle>
          <CardDescription>Genera clusters de palabras clave agrupados por tipos utilizando IA</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="keyword" className="text-sm font-medium">
                Palabra Clave Principal
              </label>
              <Input
                id="keyword"
                placeholder="Ej: comidas rapidas, marketing digital, zapatos deportivos"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                >
                  {showAdvancedOptions ? "Ocultar opciones avanzadas" : "Mostrar opciones avanzadas"}
                </Button>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs bg-gradient-to-r from-amber-500 to-amber-300 text-white px-2 py-0.5 rounded-full">
                  Premium
                </span>
              </div>
            </div>

            {showAdvancedOptions && (
              <div className="p-4 border rounded-md space-y-4 bg-muted/30">
                <h3 className="text-sm font-medium mb-2">Características de palabras clave</h3>
                <div className="grid grid-cols-2 gap-2">
                  {keywordTypes.map((type) => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.value}
                        checked={selectedKeywordTypes.includes(type.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedKeywordTypes([...selectedKeywordTypes, type.value])
                          } else {
                            setSelectedKeywordTypes(selectedKeywordTypes.filter((value) => value !== type.value))
                          }
                        }}
                      />
                      <label
                        htmlFor={type.value}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <label htmlFor="clusterCount" className="text-sm font-medium">
                    Número de clusters (3-10)
                  </label>
                  <Input
                    id="clusterCount"
                    type="number"
                    min={3}
                    max={10}
                    value={clusterCount}
                    onChange={(e) => setClusterCount(Number(e.target.value))}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="keywordsPerCluster" className="text-sm font-medium">
                    Palabras clave por cluster (3-10)
                  </label>
                  <Input
                    id="keywordsPerCluster"
                    type="number"
                    min={3}
                    max={10}
                    value={keywordsPerCluster}
                    onChange={(e) => setKeywordsPerCluster(Number(e.target.value))}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            <Tabs defaultValue="openai" onValueChange={(v) => setActiveModel(v as "openai" | "deepseek")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="openai">OpenAI</TabsTrigger>
                <TabsTrigger value="deepseek">DeepSeek</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando clusters...
                </>
              ) : (
                "Generar Clusters"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{result.mainKeyword}: Keyword Cluster</CardTitle>
              <CardDescription>{result.clusters.length} grupos de palabras clave generados</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {result.clusters.map((cluster, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-lg font-bold">{cluster.title}</h3>
                  <ul className="space-y-1 pl-4">
                    {cluster.keywords.map((kw, kwIndex) => (
                      <li key={kwIndex} className="text-sm">
                        {kw}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

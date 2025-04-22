"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Plus, Download, Upload, Trash2, ExternalLink } from "lucide-react"
import AISettings from "./ai-settings"
import SemanticAnalyzer from "./semantic-analyzer"
import StrategicGenerator from "./strategic-generator"
import KeywordDatabase from "./keyword-database"
import { Settings, InfoIcon } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/components/ui/use-toast"

export default function KeywordManager() {
  const [keywords, setKeywords] = useState<string[]>([])
  const [newKeyword, setNewKeyword] = useState("")
  const [bulkText, setBulkText] = useState("")

  // Cargar keywords guardadas al montar el componente
  useEffect(() => {
    const savedKeywords = localStorage.getItem("keywords")
    if (savedKeywords) {
      try {
        setKeywords(JSON.parse(savedKeywords))
      } catch (error) {
        console.error("Error al cargar keywords:", error)
      }
    }
  }, [])

  // Guardar keywords cuando cambian
  useEffect(() => {
    localStorage.setItem("keywords", JSON.stringify(keywords))
  }, [keywords])

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      setKeywords((prev) => [...prev, newKeyword.trim()])
      setNewKeyword("")
    }
  }

  const handleRemoveKeyword = (index: number) => {
    setKeywords((prev) => prev.filter((_, i) => i !== index))
  }

  const handleBulkAdd = () => {
    if (bulkText.trim()) {
      const newKeywords = bulkText
        .split(/[\n,]/)
        .map((k) => k.trim())
        .filter((k) => k.length > 0)

      setKeywords((prev) => [...prev, ...newKeywords])
      setBulkText("")
    }
  }

  const handleClearAll = () => {
    if (confirm("¿Estás seguro de que quieres eliminar todas las keywords?")) {
      setKeywords([])
    }
  }

  const handleExport = () => {
    const blob = new Blob([keywords.join("\n")], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "keywords.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        const importedKeywords = content
          .split(/[\n,]/)
          .map((k) => k.trim())
          .filter((k) => k.length > 0)
        setKeywords((prev) => [...prev, ...importedKeywords])
      }
      reader.readAsText(file)
      e.target.value = ""
    }
  }

  const handleAddKeywords = (newKeywords: string[]) => {
    // Filtrar para evitar duplicados
    const uniqueNewKeywords = newKeywords.filter((kw) => !keywords.includes(kw))

    if (uniqueNewKeywords.length > 0) {
      setKeywords((prev) => [...prev, ...uniqueNewKeywords])
    }
  }

  const openExternalTool = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="space-y-6 md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Mis Keywords</CardTitle>
            <CardDescription>Gestiona tu lista de keywords</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Añadir keyword..."
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddKeyword()
                    }
                  }}
                />
                <Button onClick={handleAddKeyword}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="rounded-md border">
                <ScrollArea className="h-[200px] rounded-md">
                  {keywords.length > 0 ? (
                    <div className="p-4">
                      {keywords.map((keyword, index) => (
                        <div
                          key={index}
                          className="mb-2 flex items-center justify-between rounded-md border p-2 last:mb-0"
                        >
                          <span className="mr-2 truncate">{keyword}</span>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveKeyword(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
                      No hay keywords. Añade algunas para empezar.
                    </div>
                  )}
                </ScrollArea>
              </div>

              <div className="flex items-center justify-between">
                <Badge>{keywords.length} keywords</Badge>
                {keywords.length > 0 && (
                  <Button variant="outline" size="sm" onClick={handleClearAll}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Limpiar todo
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={handleExport} disabled={keywords.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <div>
              <input id="import-file" type="file" accept=".txt,.csv" className="hidden" onChange={handleImport} />
              <Button variant="outline" size="sm" onClick={() => document.getElementById("import-file")?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Importar
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Añadir en Lote</CardTitle>
            <CardDescription>Añade múltiples keywords a la vez</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Introduce keywords separadas por comas o saltos de línea..."
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleBulkAdd} disabled={!bulkText.trim()} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Añadir en lote
            </Button>
          </CardFooter>
        </Card>

        <div className="hidden md:block">
          <AISettings />
        </div>
      </div>
      <div className="md:col-span-2">
        <Tabs defaultValue="semantic">
          <TabsList className="w-full">
            <TabsTrigger value="semantic" className="relative">
              Análisis Semántico
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="strategic">Generación Estratégica</TabsTrigger>
            <TabsTrigger value="database">Base de Datos</TabsTrigger>
            <TabsTrigger value="external-tools">Herramientas Externas</TabsTrigger>
          </TabsList>
          <TabsContent value="semantic" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Análisis Semántico</h2>
                <p className="text-muted-foreground">
                  Analiza la intención y entidades de tus keywords para optimizar tu estrategia de contenido
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Cargar configuración de API desde localStorage
                  const provider = localStorage.getItem("ai_provider") || "openai"
                  const apiKey =
                    provider === "openai"
                      ? localStorage.getItem("openai_api_key")
                      : localStorage.getItem("deepseek_api_key")

                  if (!apiKey) {
                    toast({
                      title: "Configuración incompleta",
                      description: "Por favor, configura tu API key en la sección de Análisis Semántico",
                      variant: "destructive",
                    })
                  } else {
                    toast({
                      title: "Configuración cargada",
                      description: `Usando proveedor: ${provider}`,
                    })
                  }
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Verificar Configuración
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <Alert className="mb-6">
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Consejo Pro</AlertTitle>
                  <AlertDescription>
                    Para obtener mejores resultados, introduce keywords específicas y relevantes a tu nicho. Puedes
                    analizar hasta 20 keywords a la vez.
                  </AlertDescription>
                </Alert>

                <SemanticAnalyzer
                  keywords={keywords}
                  onUpdateKeywords={setKeywords}
                  onAddKeywords={handleAddKeywords}
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Guía de Intenciones</CardTitle>
                  <CardDescription>Comprende los diferentes tipos de intención de búsqueda</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-500">informational</Badge>
                      <span>El usuario busca información o respuestas a preguntas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-500">transactional</Badge>
                      <span>El usuario quiere realizar una acción o transacción</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-purple-500">navigational</Badge>
                      <span>El usuario busca llegar a un sitio o página específica</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-amber-500">commercial</Badge>
                      <span>El usuario está investigando productos o servicios para comprar</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Solución de Problemas</CardTitle>
                  <CardDescription>Resuelve problemas comunes con el análisis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Error de API key</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Verifica que has introducido correctamente tu API key de OpenAI o DeepSeek. La key debe
                          comenzar con "sk-" para OpenAI.
                        </p>
                        <p className="mt-2">
                          Si la key es correcta, asegúrate de que tiene saldo disponible y permisos para usar los
                          modelos de lenguaje.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>El análisis tarda demasiado</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Reduce el número de keywords a analizar. Analizar muchas keywords a la vez puede llevar
                          tiempo.
                        </p>
                        <p className="mt-2">
                          Si el problema persiste, puedes cancelar el análisis y volver a intentarlo más tarde.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Resultados incorrectos o imprecisos</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Asegúrate de que tus keywords son claras y específicas. Keywords muy genéricas pueden dar
                          resultados ambiguos.
                        </p>
                        <p className="mt-2">
                          Prueba a usar un modelo más avanzado como GPT-4 si está disponible en tu cuenta.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="strategic" className="mt-6">
            <StrategicGenerator keywords={keywords} onUpdateKeywords={setKeywords} onAddKeywords={handleAddKeywords} />
          </TabsContent>
          <TabsContent value="database" className="mt-6">
            <KeywordDatabase onAddKeywords={handleAddKeywords} />
          </TabsContent>
          <TabsContent value="external-tools" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Herramientas Externas de Palabras Clave</CardTitle>
                <CardDescription>Accede a herramientas populares para investigación de palabras clave</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border border-purple-500/20 hover:border-purple-500/50 transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Ryan Robinson Keyword Tool</CardTitle>
                      <CardDescription>Herramienta gratuita para volúmenes de búsqueda</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">
                        Encuentra palabras clave relacionadas y volúmenes de búsqueda para mejorar tu SEO.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => openExternalTool("https://www.ryrob.com/keyword-tool/")}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Abrir herramienta
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="border border-purple-500/20 hover:border-purple-500/50 transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Ubersuggest</CardTitle>
                      <CardDescription>Herramienta de Neil Patel</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">
                        Obtén ideas de palabras clave, volúmenes de búsqueda, dificultad SEO y más.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => openExternalTool("https://app.neilpatel.com/es/ubersuggest/")}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Abrir herramienta
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="border border-purple-500/20 hover:border-purple-500/50 transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">AnswerThePublic</CardTitle>
                      <CardDescription>Visualiza preguntas de búsqueda</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">
                        Descubre lo que la gente está preguntando sobre tu tema en los motores de búsqueda.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => openExternalTool("https://answerthepublic.com/")}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Abrir herramienta
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="border border-purple-500/20 hover:border-purple-500/50 transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Google Keyword Planner</CardTitle>
                      <CardDescription>Herramienta oficial de Google</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">
                        Herramienta oficial de Google para investigación de palabras clave y planificación de campañas.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => openExternalTool("https://ads.google.com/home/tools/keyword-planner/")}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Abrir herramienta
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 md:hidden">
          <AISettings />
        </div>
      </div>
    </div>
  )
}

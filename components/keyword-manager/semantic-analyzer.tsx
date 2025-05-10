"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { getAIService, type AIEntityAnalysis, type AIIntentAnalysis, type AIServiceConfig } from "@/services/ai-service"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

export default function SemanticAnalyzer({
  keywords,
  onUpdateKeywords,
  onAddKeywords,
}: {
  keywords: string[]
  onUpdateKeywords: (keywords: string[]) => void
  onAddKeywords: (keywords: string[]) => void
}) {
  const [keywordInput, setKeywordInput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState("intent")
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const [analyzeIndividually, setAnalyzeIndividually] = useState(true)

  // Resultados múltiples para análisis individual
  const [multipleIntentResults, setMultipleIntentResults] = useState<
    Array<{ keyword: string; analysis: AIIntentAnalysis }>
  >([])
  const [multipleEntityResults, setMultipleEntityResults] = useState<
    Array<{ keyword: string; analysis: AIEntityAnalysis }>
  >([])

  // Resultado único para análisis conjunto
  const [singleIntentAnalysis, setSingleIntentAnalysis] = useState<AIIntentAnalysis | null>(null)
  const [singleEntityAnalysis, setEntityAnalysis] = useState<AIEntityAnalysis | null>(null)

  // Verificar si la configuración de IA está completa
  const [isConfigured, setIsConfigured] = useState(false)

  // Añadir estados para la configuración directa de la API
  const [provider, setProvider] = useState<"openai" | "deepseek">("openai")
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("gpt-3.5-turbo")

  // Añadir estos estados y referencias
  const [isCheckingConnection, setIsCheckingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"none" | "success" | "error">("none")
  const [connectionMessage, setConnectionMessage] = useState("")
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // Cargar la configuración inicial
    loadApiConfiguration()
  }, [])

  const loadApiConfiguration = () => {
    console.log("Cargando configuración de API...")

    // Cargar el proveedor
    const savedProvider = localStorage.getItem("ai_provider")
    console.log("Proveedor guardado:", savedProvider)
    if (savedProvider && (savedProvider === "openai" || savedProvider === "deepseek")) {
      setProvider(savedProvider)
    }

    // Cargar la API key según el proveedor
    if (savedProvider === "openai") {
      const savedKey = localStorage.getItem("openai_api_key")
      console.log("OpenAI API Key guardada:", savedKey ? "Existe (no mostrada por seguridad)" : "No existe")
      if (savedKey) {
        setApiKey(savedKey)
      }
    } else if (savedProvider === "deepseek") {
      const savedKey = localStorage.getItem("deepseek_api_key")
      console.log("DeepSeek API Key guardada:", savedKey ? "Existe (no mostrada por seguridad)" : "No existe")
      if (savedKey) {
        setApiKey(savedKey)
      }
    }

    // Cargar el modelo
    const savedModel = localStorage.getItem("ai_model")
    console.log("Modelo guardado:", savedModel)
    if (savedModel) {
      setModel(savedModel)
    } else {
      // Establecer modelo predeterminado según el proveedor
      setModel(savedProvider === "openai" ? "gpt-3.5-turbo" : "deepseek-chat")
    }

    // Verificar si la configuración es válida
    checkAIConfiguration()
  }

  const checkAIConfiguration = () => {
    console.log("Verificando configuración de IA...")

    // Verificar directamente con los estados locales
    const hasValidConfig = provider && apiKey
    console.log("Proveedor:", provider)
    console.log("API Key existe:", !!apiKey)
    console.log("Configuración válida:", hasValidConfig)

    setIsConfigured(!!hasValidConfig)
    return !!hasValidConfig
  }

  const saveApiConfiguration = () => {
    console.log("Guardando configuración de API...")
    localStorage.setItem("ai_provider", provider)

    if (provider === "openai") {
      localStorage.setItem("openai_api_key", apiKey)
    } else if (provider === "deepseek") {
      localStorage.setItem("deepseek_api_key", apiKey)
    }

    localStorage.setItem("ai_model", model)

    // Verificar después de guardar
    checkAIConfiguration()
  }

  const verifyConnection = async () => {
    // Verificar si hay una API key configurada
    if (!apiKey) {
      setConnectionStatus("error")
      setConnectionMessage("No has configurado una clave API.")

      toast({
        title: "API no configurada",
        description: "Por favor, introduce una clave API válida en el campo de texto.",
        variant: "destructive",
      })

      return false
    }

    // Guardar la configuración actual
    saveApiConfiguration()

    // Verificar si la configuración es válida
    if (!checkAIConfiguration()) {
      setConnectionStatus("error")
      setConnectionMessage("No se ha configurado correctamente el servicio de IA.")

      toast({
        title: "Configuración incompleta",
        description: "Por favor, configura un proveedor de IA y una clave API válida.",
        variant: "destructive",
      })

      return false
    }

    setIsCheckingConnection(true)
    setConnectionStatus("none")
    setConnectionMessage("")

    try {
      // Crear la configuración explícita para el servicio de IA
      const config: AIServiceConfig = {
        provider,
        apiKey,
        model,
      }

      console.log("Verificando conexión con configuración:", {
        provider: config.provider,
        model: config.model,
        apiKeyExists: !!config.apiKey,
      })

      // Implementar una verificación simplificada que no dependa de la estructura de respuesta completa
      // Esto evita el error "undefined is not an object (evaluating 'data.choices[0]')"
      try {
        // Realizar una solicitud directa a la API para verificar la autenticación
        const url = provider === "openai" ? "https://api.openai.com/v1/models" : "https://api.deepseek.com/v1/models"

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Error de API: ${response.status} ${response.statusText}`)
        }

        // Si llegamos aquí, la conexión fue exitosa
        setConnectionStatus("success")
        setConnectionMessage("Conexión exitosa con la API.")

        toast({
          title: "Conexión exitosa",
          description: "La API está configurada correctamente y funciona.",
          variant: "default",
        })

        setIsCheckingConnection(false)
        return true
      } catch (apiError: any) {
        // Capturar errores específicos de la API
        throw new Error(`Error al verificar la API: ${apiError.message}`)
      }
    } catch (error: any) {
      console.error("Error al verificar la conexión:", error)
      setConnectionStatus("error")

      // Manejar diferentes tipos de errores
      if (error.message?.includes("401") || error.message?.includes("authentication")) {
        setConnectionMessage("Error de autenticación. Verifica tu clave API.")
      } else if (error.message?.includes("429") || error.message?.includes("limit")) {
        setConnectionMessage("Has excedido el límite de solicitudes. Intenta más tarde.")
      } else if (error.message?.includes("timeout") || error.message?.includes("ETIMEDOUT")) {
        setConnectionMessage("Tiempo de espera agotado. Verifica tu conexión a internet.")
      } else {
        setConnectionMessage(error.message || "Error al conectar con la API.")
      }

      toast({
        title: "Error de conexión",
        description: error.message || "No se pudo conectar con la API. Verifica tu configuración.",
        variant: "destructive",
      })

      setIsCheckingConnection(false)
      return false
    }
  }

  const handleAnalyze = async () => {
    if (!keywordInput.trim()) {
      toast({
        title: "Keyword vacía",
        description: "Por favor, introduce al menos una keyword para analizar",
        variant: "destructive",
      })
      return
    }

    // Verificar si hay una API key configurada
    if (!apiKey) {
      toast({
        title: "API no configurada",
        description: "Por favor, introduce una clave API válida y verifica la conexión.",
        variant: "destructive",
      })
      return
    }

    // Guardar la configuración actual
    saveApiConfiguration()

    // Verificar si la configuración de IA está completa y la conexión funciona
    if (!(await verifyConnection())) {
      return
    }

    // Dividir el input en líneas para analizar cada keyword individualmente
    const keywordsToAnalyze = keywordInput
      .split("\n")
      .map((k) => k.trim())
      .filter((k) => k.length > 0)

    // Verificar límites
    const MAX_KEYWORDS = 20
    if (keywordsToAnalyze.length > MAX_KEYWORDS) {
      toast({
        title: "Demasiadas keywords",
        description: `Por favor, reduce el número de keywords a analizar (máximo ${MAX_KEYWORDS})`,
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setError(null)

    // Limpiar resultados anteriores
    if (analyzeIndividually) {
      setMultipleIntentResults([])
      setMultipleEntityResults([])
    } else {
      setSingleIntentAnalysis(null)
      setEntityAnalysis(null)
    }

    // Cancelar cualquier solicitud anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Crear un nuevo AbortController para esta solicitud
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    try {
      // Crear la configuración explícita para el servicio de IA
      const config: AIServiceConfig = {
        provider,
        apiKey,
        model,
      }

      console.log("Analizando con configuración:", {
        provider: config.provider,
        model: config.model,
        apiKeyExists: !!config.apiKey,
      })

      // Obtener el servicio de IA con la configuración explícita
      const aiService = getAIService(config)

      // Configurar un timeout global
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
        throw new Error("Tiempo de espera agotado. La operación tardó demasiado.")
      }, 60000) // 60 segundos de timeout

      if (analyzeIndividually) {
        // Analizar cada keyword individualmente
        for (const kw of keywordsToAnalyze) {
          if (signal.aborted) break

          if (activeTab === "intent") {
            const result = await aiService.analyzeIntent(kw)
            setMultipleIntentResults((prev) => [...prev, { keyword: kw, analysis: result }])
          } else if (activeTab === "entities") {
            const result = await aiService.extractEntities(kw)
            setMultipleEntityResults((prev) => [...prev, { keyword: kw, analysis: result }])
          }
        }
      } else {
        // Analizar todas las keywords como un conjunto
        if (activeTab === "intent") {
          const result = await aiService.analyzeIntent(keywordInput)
          setSingleIntentAnalysis(result)
        } else if (activeTab === "entities") {
          const result = await aiService.extractEntities(keywordInput)
          setEntityAnalysis(result)
        }
      }

      clearTimeout(timeoutId)
    } catch (error: any) {
      console.error("Error al analizar la keyword:", error)

      // Manejar diferentes tipos de errores
      if (error.name === "AbortError") {
        if (signal.aborted) {
          setError("Análisis cancelado por el usuario.")
        } else {
          setError("Tiempo de espera agotado. La operación tardó demasiado.")
        }
      } else if (error.message?.includes("401") || error.message?.includes("authentication")) {
        setError("Error de autenticación. Verifica tu clave API.")
      } else if (error.message?.includes("429") || error.message?.includes("limit")) {
        setError("Has excedido el límite de solicitudes. Intenta más tarde.")
      } else {
        setError(error.message || "Error desconocido al analizar la keyword")
      }

      toast({
        title: "Error en el análisis",
        description: error.message || "Error desconocido al analizar la keyword",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
      abortControllerRef.current = null
    }
  }

  // Función para renderizar el color de la badge según la intención
  const getIntentColor = (intent: string) => {
    switch (intent) {
      case "informational":
        return "bg-blue-500"
      case "transactional":
        return "bg-green-500"
      case "navigational":
        return "bg-purple-500"
      case "commercial":
        return "bg-amber-500"
      default:
        return "bg-gray-500"
    }
  }

  // Función para renderizar el color de la badge según la relevancia
  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 0.8) return "bg-green-500"
    if (relevance >= 0.5) return "bg-amber-500"
    return "bg-red-500"
  }

  const saveKeyword = (keyword: string) => {
    // Validar que la keyword no esté vacía y tenga una longitud mínima
    const trimmedKeyword = keyword.trim()
    if (!trimmedKeyword) {
      toast({
        title: "Keyword inválida",
        description: "La keyword no puede estar vacía",
        variant: "destructive",
      })
      return
    }

    if (trimmedKeyword.length < 3) {
      toast({
        title: "Keyword demasiado corta",
        description: "La keyword debe tener al menos 3 caracteres",
        variant: "destructive",
      })
      return
    }

    if (!keywords.includes(trimmedKeyword)) {
      onAddKeywords([trimmedKeyword])
      toast({
        title: "Keyword guardada",
        description: `Se ha añadido "${trimmedKeyword}" a tu lista de keywords`,
      })
    } else {
      toast({
        title: "Keyword ya existe",
        description: `La keyword "${trimmedKeyword}" ya está en tu lista`,
      })
    }
  }

  // Función para cancelar el análisis
  const cancelAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsAnalyzing(false)
      toast({
        title: "Análisis cancelado",
        description: "Has cancelado el análisis en curso",
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Análisis Semántico</CardTitle>
            <CardDescription>Analiza la intención de búsqueda y las entidades de una o varias keywords</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Sección de configuración de API */}
        <div className="mb-6 p-4 border rounded-md">
          <h3 className="text-lg font-medium mb-3">Configuración de API</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="api-provider">Proveedor</Label>
                <select
                  id="api-provider"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as "openai" | "deepseek")}
                  className="w-full p-2 border rounded-md mt-1"
                >
                  <option value="openai">OpenAI</option>
                  <option value="deepseek">DeepSeek</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="api-key">Clave API de {provider === "openai" ? "OpenAI" : "DeepSeek"}</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Introduce tu clave API de ${provider === "openai" ? "OpenAI" : "DeepSeek"}`}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                {connectionStatus === "success" && (
                  <div className="text-sm flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>API conectada correctamente</span>
                  </div>
                )}

                {connectionStatus === "error" && (
                  <div className="text-sm flex items-center text-red-600">
                    <XCircle className="h-4 w-4 mr-2" />
                    <span>{connectionMessage || "Error de conexión"}</span>
                  </div>
                )}
              </div>

              <Button variant="outline" size="sm" onClick={verifyConnection} disabled={isCheckingConnection}>
                {isCheckingConnection ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Verificar API
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="keywords-input">Introduce keywords (una por línea):</Label>
            <Textarea
              id="keywords-input"
              placeholder="Introduce keywords para analizar (una por línea)..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              className="min-h-[100px] mt-2"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="analyze-individually"
              checked={analyzeIndividually}
              onCheckedChange={(checked) => setAnalyzeIndividually(checked as boolean)}
            />
            <Label htmlFor="analyze-individually">Analizar cada keyword individualmente</Label>
          </div>

          {keywords.length > 0 && (
            <div className="space-y-2">
              <Label>Seleccionar de mis keywords:</Label>
              <ScrollArea className="h-[100px] rounded-md border">
                <div className="p-2">
                  {keywords.map((kw, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="mb-1 justify-start w-full text-left"
                      onClick={() => {
                        // Si ya hay texto, añadir en una nueva línea
                        if (keywordInput.trim()) {
                          setKeywordInput((prev) => prev + "\n" + kw)
                        } else {
                          setKeywordInput(kw)
                        }
                      }}
                    >
                      {kw}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="intent">Intención</TabsTrigger>
              <TabsTrigger value="entities">Entidades</TabsTrigger>
            </TabsList>

            <TabsContent value="intent" className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Analiza la intención de búsqueda detrás de {analyzeIndividually ? "cada keyword" : "las keywords"}.
              </p>

              {/* Resultados individuales para cada keyword */}
              {analyzeIndividually && multipleIntentResults.length > 0 && (
                <Accordion type="single" collapsible className="w-full">
                  {multipleIntentResults.map((result, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center justify-between w-full pr-4">
                          <span className="font-medium">Keyword: {result.keyword}</span>
                          <Badge className={getIntentColor(result.analysis.intent)}>{result.analysis.intent}</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 p-2">
                          <div>
                            <h4 className="text-sm font-medium">Confianza:</h4>
                            <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full bg-blue-500"
                                style={{ width: `${result.analysis.confidence * 100}%` }}
                              ></div>
                            </div>
                            <p className="mt-1 text-xs text-right">{Math.round(result.analysis.confidence * 100)}%</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium">Explicación:</h4>
                            <p className="mt-1 text-sm">{result.analysis.explanation}</p>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full"
                            onClick={() => saveKeyword(result.keyword)}
                          >
                            Guardar keyword en mi lista
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}

              {/* Resultado único para todas las keywords */}
              {!analyzeIndividually && singleIntentAnalysis && (
                <div className="space-y-4 rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Intención detectada:</h3>
                    <Badge className={getIntentColor(singleIntentAnalysis.intent)}>{singleIntentAnalysis.intent}</Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium">Confianza:</h4>
                    <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${singleIntentAnalysis.confidence * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-xs text-right">{Math.round(singleIntentAnalysis.confidence * 100)}%</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium">Explicación:</h4>
                    <p className="mt-1 text-sm">{singleIntentAnalysis.explanation}</p>
                  </div>

                  <Button
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={() => {
                      // Guardar todas las keywords del input
                      const newKeywords = keywordInput
                        .split("\n")
                        .map((k) => k.trim())
                        .filter((k) => k.length > 0 && !keywords.includes(k))

                      if (newKeywords.length > 0) {
                        onAddKeywords(newKeywords)
                        toast({
                          title: "Keywords guardadas",
                          description: `Se han añadido ${newKeywords.length} keywords a tu lista`,
                        })
                      } else {
                        toast({
                          title: "No hay keywords nuevas",
                          description: "Todas las keywords ya existen en tu lista",
                        })
                      }
                    }}
                  >
                    Guardar todas las keywords en mi lista
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="entities" className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Extrae las entidades (personas, lugares, conceptos, etc.) de{" "}
                {analyzeIndividually ? "cada keyword" : "las keywords"}.
              </p>

              {/* Resultados individuales para cada keyword */}
              {analyzeIndividually && multipleEntityResults.length > 0 && (
                <Accordion type="single" collapsible className="w-full">
                  {multipleEntityResults.map((result, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center justify-between w-full pr-4">
                          <span className="font-medium">Keyword: {result.keyword}</span>
                          <span className="text-sm text-muted-foreground">
                            {result.analysis.entities.length} entidades
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 p-2">
                          {result.analysis.entities.length > 0 ? (
                            <div className="space-y-2">
                              {result.analysis.entities.map((entity, entityIndex) => (
                                <div
                                  key={entityIndex}
                                  className="flex items-center justify-between rounded-md border p-2"
                                >
                                  <div>
                                    <span className="font-medium">{entity.name}</span>
                                    <span className="ml-2 text-xs text-muted-foreground">({entity.type})</span>
                                  </div>
                                  <Badge className={getRelevanceColor(entity.relevance)}>
                                    {Math.round(entity.relevance * 100)}%
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center text-muted-foreground">
                              No se detectaron entidades en esta keyword.
                            </div>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full"
                            onClick={() => saveKeyword(result.keyword)}
                          >
                            Guardar keyword en mi lista
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}

              {/* Resultado único para todas las keywords */}
              {!analyzeIndividually && singleEntityAnalysis && (
                <div className="space-y-4 rounded-md border p-4">
                  <h3 className="text-lg font-medium">Entidades detectadas:</h3>

                  {singleEntityAnalysis.entities.length > 0 ? (
                    <div className="space-y-2">
                      {singleEntityAnalysis.entities.map((entity, index) => (
                        <div key={index} className="flex items-center justify-between rounded-md border p-2">
                          <div>
                            <span className="font-medium">{entity.name}</span>
                            <span className="ml-2 text-xs text-muted-foreground">({entity.type})</span>
                          </div>
                          <Badge className={getRelevanceColor(entity.relevance)}>
                            {Math.round(entity.relevance * 100)}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md border p-4 text-center text-muted-foreground">
                      No se detectaron entidades en estas keywords.
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={() => {
                      // Guardar todas las keywords del input
                      const newKeywords = keywordInput
                        .split("\n")
                        .map((k) => k.trim())
                        .filter((k) => k.length > 0 && !keywords.includes(k))

                      if (newKeywords.length > 0) {
                        onAddKeywords(newKeywords)
                        toast({
                          title: "Keywords guardadas",
                          description: `Se han añadido ${newKeywords.length} keywords a tu lista`,
                        })
                      } else {
                        toast({
                          title: "No hay keywords nuevas",
                          description: "Todas las keywords ya existen en tu lista",
                        })
                      }
                    }}
                  >
                    Guardar todas las keywords en mi lista
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !keywordInput.trim() || !apiKey}
          className="w-full mr-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analizando...
            </>
          ) : (
            `Analizar ${analyzeIndividually ? "cada keyword" : "todas las keywords"}`
          )}
        </Button>

        {isAnalyzing && (
          <Button variant="destructive" onClick={cancelAnalysis} className="ml-2">
            Cancelar
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

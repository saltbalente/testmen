"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { getAIConfigFromStorage, getDefaultAIService } from "@/services/ai-service"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Info,
  BarChart3,
  TrendingUp,
  Target,
  Users,
  DollarSign,
  LayoutGrid,
  Layers,
  Zap,
  Sparkles,
  ArrowDownUp,
  Check,
  HelpCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Tipos de intención de búsqueda
type SearchIntent = "all" | "commercial" | "transactional" | "informational" | "navigational" | "leads"

// Etapas del embudo de conversión
type FunnelStage = "all" | "tofu" | "mofu" | "bofu"

// Etapas del customer journey
type CustomerJourneyStage = "all" | "awareness" | "consideration" | "decision" | "retention"

// Longitud de cola
type KeywordTailLength = "all" | "short" | "medium" | "long"

// Formato de contenido
type ContentFormat = "all" | "blog" | "video" | "infographic" | "ebook" | "webinar" | "social" | "landing"

// Estacionalidad
type Seasonality = "all" | "seasonal" | "evergreen"

// Nivel de expertise
type ExpertiseLevel = "all" | "beginner" | "intermediate" | "advanced"

// Dispositivo preferido
type PreferredDevice = "all" | "mobile" | "desktop"

// Modelo de monetización
type MonetizationModel = "all" | "affiliate" | "direct" | "leadgen" | "ads" | "subscription"

// Tipo de sugerencia de keyword de la IA
interface AIKeywordSuggestion {
  keyword: string
  relevance: number
}

// Tipo de keyword extendido
interface ExtendedKeywordSuggestion extends AIKeywordSuggestion {
  difficulty?: number
  searchVolume?: number
  opportunityScore?: number
  funnelStage?: FunnelStage
  customerJourneyStage?: CustomerJourneyStage
  purchaseIntent?: number
  tailLength?: KeywordTailLength
  isQuestion?: boolean
  sentiment?: "positive" | "negative" | "neutral"
  geoRelevance?: "local" | "global" | "regional"
  suggestedContentFormat?: ContentFormat
  seasonality?: Seasonality
  isTrending?: boolean
  niche?: string
  keywordDensity?: number
  relatedEntities?: string[]
  targetDemographic?: string[]
  expertiseLevel?: ExpertiseLevel
  preferredDevice?: PreferredDevice
  userMotivation?: string
  commercialValue?: number
  conversionPotential?: number
  estimatedCPC?: number
  monetizationModel?: MonetizationModel
}

// Opciones avanzadas
interface AdvancedOptions {
  searchIntent: SearchIntent
  funnelStage: FunnelStage
  customerJourneyStage: CustomerJourneyStage
  minPurchaseIntent: number
  tailLength: KeywordTailLength
  includeQuestions: boolean
  sentiment: "all" | "positive" | "negative" | "neutral"
  geoRelevance: "all" | "local" | "global" | "regional"
  contentFormat: ContentFormat
  seasonality: Seasonality
  includeTrending: boolean
  expertiseLevel: ExpertiseLevel
  preferredDevice: PreferredDevice
  monetizationModel: MonetizationModel
  minCommercialValue: number
}

export default function StrategicGenerator() {
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [keywordCount, setKeywordCount] = useState(10)
  const [generatedContent, setGeneratedContent] = useState("")
  const [contentType, setContentType] = useState("blog")
  const [apiConfigured, setApiConfigured] = useState(false)
  const [suggestions, setSuggestions] = useState<ExtendedKeywordSuggestion[]>([])
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const { toast } = useToast()

  // Modo avanzado y opciones
  const [advancedMode, setAdvancedMode] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("intent")

  // Opciones avanzadas con valores por defecto
  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptions>({
    searchIntent: "all",
    funnelStage: "all",
    customerJourneyStage: "all",
    minPurchaseIntent: 0,
    tailLength: "all",
    includeQuestions: false,
    sentiment: "all",
    geoRelevance: "all",
    contentFormat: "all",
    seasonality: "all",
    includeTrending: false,
    expertiseLevel: "all",
    preferredDevice: "all",
    monetizationModel: "all",
    minCommercialValue: 0,
  })

  // Filtros para los resultados
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>("relevance")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Verificar si la API está configurada al cargar el componente
  useEffect(() => {
    const checkApiConfig = () => {
      try {
        const config = getAIConfigFromStorage()
        setApiConfigured(!!config && !!config.apiKey)
      } catch (error) {
        console.error("Error al verificar la configuración de la API:", error)
        setApiConfigured(false)
      }
    }

    checkApiConfig()
    // Verificar cada vez que el componente se vuelve visible
    window.addEventListener("focus", checkApiConfig)
    return () => window.removeEventListener("focus", checkApiConfig)
  }, [])

  // Actualizar una opción avanzada específica
  const updateAdvancedOption = (key: keyof AdvancedOptions, value: any) => {
    setAdvancedOptions((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Obtener descripción de la intención seleccionada
  const getIntentDescription = (intent: SearchIntent): string => {
    switch (intent) {
      case "commercial":
        return "Keywords para usuarios investigando productos antes de comprar"
      case "transactional":
        return "Keywords para usuarios listos para comprar o realizar una acción"
      case "informational":
        return "Keywords para usuarios buscando información o respuestas"
      case "navigational":
        return "Keywords para usuarios buscando un sitio o página específica"
      case "leads":
        return "Keywords para captar potenciales clientes interesados"
      default:
        return "Genera keywords variadas con diferentes intenciones"
    }
  }

  // Obtener descripción de la etapa del embudo
  const getFunnelStageDescription = (stage: FunnelStage): string => {
    switch (stage) {
      case "tofu":
        return "Top of Funnel - Usuarios en fase de descubrimiento"
      case "mofu":
        return "Middle of Funnel - Usuarios evaluando opciones"
      case "bofu":
        return "Bottom of Funnel - Usuarios listos para convertir"
      default:
        return "Todas las etapas del embudo de conversión"
    }
  }

  // Filtrar y ordenar sugerencias
  // const filteredSuggestions = useMemo(() => {
  //   let filtered = [...suggestions]

  //   // Aplicar filtros activos
  //   if (activeFilters.includes("highRelevance")) {
  //     filtered = filtered.filter((s) => s.relevance >= 0.7)
  //   }
  //   if (activeFilters.includes("lowDifficulty")) {
  //     filtered = filtered.filter((s) => (s.difficulty || 0) <= 0.4)
  //   }
  //   if (activeFilters.includes("highVolume")) {
  //     filtered = filtered.filter((s) => (s.searchVolume || 0) >= 0.6)
  //   }
  //   if (activeFilters.includes("highOpportunity")) {
  //     filtered = filtered.filter((s) => (s.opportunityScore || 0) >= 0.7)
  //   }
  //   if (activeFilters.includes("questions")) {
  //     filtered = filtered.filter((s) => s.isQuestion)
  //   }
  //   if (activeFilters.includes("trending")) {
  //     filtered = filtered.filter((s) => s.isTrending)
  //   }
  //   if (activeFilters.includes("highCommercial")) {
  //     filtered = filtered.filter((s) => (s.commercialValue || 0) >= 0.7)
  //   }

  //   // Ordenar resultados
  //   return filtered.sort((a, b) => {
  //     let valueA = 0
  //     let valueB = 0

  //     switch (sortBy) {
  //       case "relevance":
  //         valueA = a.relevance
  //         valueB = b.relevance
  //         break
  //       case "difficulty":
  //         valueA = a.difficulty || 0
  //         valueB = b.difficulty || 0
  //         break
  //       case "volume":
  //         valueA = a.searchVolume || 0
  //         valueB = b.searchVolume || 0
  //         break
  //       case "opportunity":
  //         valueA = a.opportunityScore || 0
  //         valueB = b.opportunityScore || 0
  //         break
  //       case "commercial":
  //         valueA = a.commercialValue || 0
  //         valueB = b.commercialValue || 0
  //         break
  //       case "conversion":
  //         valueA = a.conversionPotential || 0
  //         valueB = b.conversionPotential || 0
  //         break
  //       case "alphabetical":
  //         return sortOrder === "asc" ? a.keyword.localeCompare(b.keyword) : b.keyword.localeCompare(a.keyword)
  //     }

  //     return sortOrder === "asc" ? valueA - valueB : valueB - valueA
  //   })
  // }, [suggestions, activeFilters, sortBy, sortOrder])

  const generateKeywords = async () => {
    if (!topic.trim()) {
      setError("Por favor, ingresa un tema para generar palabras clave.")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Obtener el servicio de IA con la configuración almacenada
      const aiService = getDefaultAIService()

      // Generar las palabras clave
      const prompt = `Genera ${keywordCount} palabras clave relacionadas con "${topic}" para SEO. Responde solo con las palabras clave separadas por comas.`
      const response = await aiService.generateText(prompt, 500)

      // Procesar la respuesta
      const keywordList = response
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0)

      setKeywords(keywordList)
      setSuccess(true)
    } catch (error: any) {
      console.error("Error al generar palabras clave:", error)
      setError(`Error al generar palabras clave: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const generateContent = async () => {
    if (keywords.length === 0) {
      setError("Primero debes generar palabras clave.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Obtener el servicio de IA con la configuración almacenada
      const aiService = getDefaultAIService()

      // Generar el contenido según el tipo seleccionado
      let prompt = ""

      switch (contentType) {
        case "blog":
          prompt = `Escribe un artículo de blog sobre "${topic}" utilizando las siguientes palabras clave: ${keywords.join(", ")}. El artículo debe tener una introducción, desarrollo y conclusión.`
          break
        case "product":
          prompt = `Escribe una descripción de producto sobre "${topic}" utilizando las siguientes palabras clave: ${keywords.join(", ")}. La descripción debe destacar beneficios y características.`
          break
        case "social":
          prompt = `Escribe 3 publicaciones para redes sociales sobre "${topic}" utilizando las siguientes palabras clave: ${keywords.join(", ")}. Las publicaciones deben ser atractivas y generar engagement.`
          break
        default:
          prompt = `Escribe contenido sobre "${topic}" utilizando las siguientes palabras clave: ${keywords.join(", ")}.`
      }

      const response = await aiService.generateText(prompt, 1000)
      setGeneratedContent(response)
    } catch (error: any) {
      console.error("Error al generar contenido:", error)
      setError(`Error al generar contenido: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Función para generar keywords con opciones avanzadas
  const generateAdvancedKeywords = async (
    aiService: any,
    topic: string,
    count: number,
    options: AdvancedOptions,
  ): Promise<ExtendedKeywordSuggestion[]> => {
    // Crear un prompt avanzado basado en todas las opciones
    const optionsDescription: string[] = []

    // Añadir descripciones de las opciones seleccionadas
    if (options.searchIntent !== "all") {
      optionsDescription.push(`intención de búsqueda "${options.searchIntent}"`)
    }

    if (options.funnelStage !== "all") {
      optionsDescription.push(
        `etapa del embudo "${options.funnelStage}" (${
          options.funnelStage === "tofu"
            ? "top of funnel"
            : options.funnelStage === "mofu"
              ? "middle of funnel"
              : "bottom of funnel"
        })`,
      )
    }

    if (options.customerJourneyStage !== "all") {
      optionsDescription.push(`etapa del customer journey "${options.customerJourneyStage}"`)
    }

    if (options.minPurchaseIntent > 0) {
      optionsDescription.push(`intención de compra mínima de ${options.minPurchaseIntent}/10`)
    }

    if (options.tailLength !== "all") {
      optionsDescription.push(`longitud de cola "${options.tailLength}"`)
    }

    if (options.includeQuestions) {
      optionsDescription.push("formato de pregunta")
    }

    if (options.sentiment !== "all") {
      optionsDescription.push(`sentimiento "${options.sentiment}"`)
    }

    if (options.geoRelevance !== "all") {
      optionsDescription.push(`relevancia geográfica "${options.geoRelevance}"`)
    }

    if (options.contentFormat !== "all") {
      optionsDescription.push(`formato de contenido sugerido "${options.contentFormat}"`)
    }

    if (options.seasonality !== "all") {
      optionsDescription.push(`estacionalidad "${options.seasonality}"`)
    }

    if (options.includeTrending) {
      optionsDescription.push("tendencias emergentes")
    }

    if (options.expertiseLevel !== "all") {
      optionsDescription.push(`nivel de expertise "${options.expertiseLevel}"`)
    }

    if (options.preferredDevice !== "all") {
      optionsDescription.push(`dispositivo preferido "${options.preferredDevice}"`)
    }

    if (options.monetizationModel !== "all") {
      optionsDescription.push(`modelo de monetización "${options.monetizationModel}"`)
    }

    if (options.minCommercialValue > 0) {
      optionsDescription.push(`valor comercial mínimo de ${options.minCommercialValue}/10`)
    }

    // Construir el prompt completo
    const optionsString =
      optionsDescription.length > 0 ? `con las siguientes características: ${optionsDescription.join(", ")}` : ""

    // Simplificar el prompt para reducir la complejidad de la respuesta JSON
    const prompt = `
      Genera ${count} sugerencias de keywords relacionadas con "${topic}" ${optionsString}.
      
      Para cada keyword, proporciona los siguientes atributos:
      1. keyword: La keyword sugerida
      2. relevance: Número entre 0 y 1 que indica qué tan relacionada está con el tema principal
      3. difficulty: Número entre 0 y 1 que indica la dificultad para posicionar esta keyword
      4. searchVolume: Número entre 0 y 1 que indica el volumen de búsqueda relativo
      5. opportunityScore: Número entre 0 y 1 que indica la relación entre volumen y dificultad
      6. funnelStage: "tofu", "mofu" o "bofu"
      7. customerJourneyStage: "awareness", "consideration", "decision" o "retention"
      8. purchaseIntent: Número entre 0 y 10 que indica la intención de compra
      9. tailLength: "short", "medium" o "long"
      10. isQuestion: true o false
      
      IMPORTANTE: Responde SOLO con un array JSON válido, sin texto adicional antes o después. Asegúrate de que todas las comillas, comas y corchetes estén correctamente colocados.
      
      Estructura exacta del JSON:
      [
        {
          "keyword": "keyword sugerida",
          "relevance": 0.9,
          "difficulty": 0.5,
          "searchVolume": 0.7,
          "opportunityScore": 0.8,
          "funnelStage": "tofu",
          "customerJourneyStage": "awareness",
          "purchaseIntent": 3,
          "tailLength": "medium",
          "isQuestion": false
        }
      ]
    `

    try {
      // Mejorar la conexión a la API y el manejo de respuestas
      const response = await aiService.generateText(prompt, 2000)

      // Registrar la respuesta completa para depuración
      console.log("Respuesta de la API (primeros 100 caracteres):", response.substring(0, 100))

      // Implementar un análisis de JSON más robusto
      try {
        // Limpiar y preparar la respuesta para el análisis
        const cleanedResponse = response.trim()

        // Buscar el primer '[' y el último ']' para extraer el array JSON
        const startIndex = cleanedResponse.indexOf("[")
        const endIndex = cleanedResponse.lastIndexOf("]")

        if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
          throw new Error("No se pudo encontrar un array JSON válido en la respuesta")
        }

        // Extraer solo el array JSON
        let jsonText = cleanedResponse.substring(startIndex, endIndex + 1)

        // Limpieza agresiva del JSON para eliminar caracteres problemáticos
        jsonText = jsonText
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Eliminar caracteres de control
          .replace(/\\[^"\\/bfnrtu]/g, "") // Eliminar escapes inválidos
          .replace(/([^\\])\\([^"\\/bfnrtu])/g, "$1") // Eliminar escapes inválidos
          .replace(/,\s*}/g, "}") // Eliminar comas finales en objetos
          .replace(/,\s*]/g, "]") // Eliminar comas finales en arrays
          .replace(/\n/g, " ") // Eliminar saltos de línea
          .replace(/\r/g, " ") // Eliminar retornos de carro
          .replace(/\t/g, " ") // Eliminar tabulaciones
          .replace(/\s+/g, " ") // Reducir espacios múltiples a uno solo

        // Verificar y corregir comillas
        let fixedJson = jsonText

        // Asegurarse de que las propiedades tienen comillas dobles
        fixedJson = fixedJson.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3')

        // Intentar analizar el JSON corregido
        let parsedData
        try {
          parsedData = JSON.parse(fixedJson)
        } catch (parseError) {
          console.error("Error al parsear JSON corregido:", parseError)

          // Intento de recuperación más agresivo: analizar objeto por objeto
          const results = []
          const objectRegex = /\{[^{}]*\}/g
          const matches = fixedJson.match(objectRegex)

          if (matches && matches.length > 0) {
            for (const objStr of matches) {
              try {
                const obj = JSON.parse(objStr)
                if (obj && typeof obj === "object" && obj.keyword) {
                  results.push(obj)
                }
              } catch (e) {
                // Ignorar objetos que no se pueden analizar
                console.warn("No se pudo analizar un objeto:", objStr)
              }
            }

            if (results.length > 0) {
              parsedData = results
            } else {
              throw parseError // Si no se pudo recuperar ningún objeto, lanzar el error original
            }
          } else {
            throw parseError // Si no se encontraron objetos, lanzar el error original
          }
        }

        // Validar que el resultado es un array
        if (!Array.isArray(parsedData)) {
          if (typeof parsedData === "object" && parsedData !== null) {
            // Si es un objeto único, convertirlo en array
            parsedData = [parsedData]
          } else {
            throw new Error("El resultado no es un array ni un objeto válido")
          }
        }

        // Validar y normalizar cada elemento del array
        const validatedResults = parsedData.map((item: any, index: number) => {
          // Asegurarse de que los campos numéricos sean números válidos entre 0 y 1
          const validateNumber = (value: any, defaultValue = 0.5, max = 1): number => {
            if (value === undefined || value === null) return defaultValue
            const num = typeof value === "number" ? value : Number.parseFloat(String(value))
            if (isNaN(num)) return defaultValue
            return Math.max(0, Math.min(max, num))
          }

          // Asegurarse de que los campos de texto tengan valores válidos
          const validateString = (value: any, defaultValue: string): string => {
            return typeof value === "string" && value ? value : defaultValue
          }

          // Asegurarse de que los booleanos sean válidos
          const validateBoolean = (value: any, defaultValue = false): boolean => {
            if (typeof value === "boolean") return value
            if (typeof value === "string") {
              const lowerValue = value.toLowerCase()
              if (lowerValue === "true" || lowerValue === "yes" || lowerValue === "1") return true
              if (lowerValue === "false" || lowerValue === "no" || lowerValue === "0") return false
            }
            if (typeof value === "number") {
              return value !== 0
            }
            return defaultValue
          }

          // Validar enumeraciones
          const validateEnum = <T extends string>(value: any, validValues: T[], defaultValue: T): T => {
            if (typeof value === "string") {
              // Normalizar el valor (minúsculas, sin espacios)
              const normalizedValue = value.toLowerCase().trim()

              // Buscar coincidencia exacta
              if (validValues.includes(normalizedValue as T)) {
                return normalizedValue as T
              }

              // Buscar coincidencia parcial
              for (const validValue of validValues) {
                if (
                  normalizedValue.includes(validValue.toLowerCase()) ||
                  validValue.toLowerCase().includes(normalizedValue)
                ) {
                  return validValue
                }
              }
            }
            return defaultValue
          }

          // Extraer keyword o generar una por defecto
          const keyword = validateString(item.keyword, `Keyword ${index + 1} para ${topic}`)

          // Crear un objeto con los campos básicos validados
          const validatedItem: ExtendedKeywordSuggestion = {
            keyword: keyword,
            relevance: validateNumber(item.relevance),
            difficulty: validateNumber(item.difficulty),
            searchVolume: validateNumber(item.searchVolume),
            opportunityScore: validateNumber(item.opportunityScore),
            funnelStage: validateEnum(
              item.funnelStage,
              ["tofu", "mofu", "bofu"] as FunnelStage[],
              "tofu",
            ) as FunnelStage,
            customerJourneyStage: validateEnum(
              item.customerJourneyStage,
              ["awareness", "consideration", "decision", "retention"] as CustomerJourneyStage[],
              "awareness",
            ) as CustomerJourneyStage,
            purchaseIntent: validateNumber(item.purchaseIntent, 5, 10),
            tailLength: validateEnum(
              item.tailLength,
              ["short", "medium", "long"] as KeywordTailLength[],
              "medium",
            ) as KeywordTailLength,
            isQuestion: validateBoolean(item.isQuestion),
          }

          // Añadir campos adicionales con valores generados
          return {
            ...validatedItem,
            sentiment: "neutral",
            geoRelevance: "global",
            suggestedContentFormat: "blog" as ContentFormat,
            seasonality: "evergreen" as Seasonality,
            isTrending: Math.random() > 0.8,
            niche: `${topic} específico`,
            keywordDensity: 0.02 + Math.random() * 0.03,
            relatedEntities: [`Relacionado con ${topic}`],
            targetDemographic: ["Usuarios interesados"],
            expertiseLevel: "intermediate" as ExpertiseLevel,
            preferredDevice: Math.random() > 0.5 ? "mobile" : "desktop",
            userMotivation: "Obtener información",
            commercialValue: Math.random(),
            conversionPotential: Math.random(),
            estimatedCPC: Math.random(),
            monetizationModel: "affiliate" as MonetizationModel,
          }
        })

        return validatedResults
      } catch (parseError: any) {
        console.error("Error al parsear JSON:", parseError)

        // Guardar información de depuración detallada
        setDebugInfo(`Error al parsear JSON: ${parseError.message}. 
          Respuesta original (primeros 500 caracteres): 
          ${response.substring(0, 500)}...`)

        throw new Error(`Error al analizar la respuesta JSON: ${parseError.message}. Intenta de nuevo.`)
      }
    } catch (error: any) {
      console.error("Error en generateAdvancedKeywords:", error)

      // Información de depuración más detallada
      setDebugInfo(`Error en generateAdvancedKeywords: ${error.message}
        
        Detalles técnicos:
        ${error.stack ? error.stack.substring(0, 500) : "No stack trace disponible"}
        
        Se generarán resultados de fallback como alternativa.`)

      // Generar resultados de fallback basados en el tema y las opciones
      return generateFallbackKeywords(topic, count, options)
    }
  }

  // Añadir esta nueva función para generar keywords de fallback
  const generateFallbackKeywords = (
    topic: string,
    count: number,
    options: AdvancedOptions,
  ): ExtendedKeywordSuggestion[] => {
    // Generar keywords básicas basadas en el tema y las opciones seleccionadas
    let baseKeywords: string[] = []

    // Adaptar las keywords de fallback según las opciones seleccionadas
    if (options.includeQuestions) {
      baseKeywords.push(
        `¿Qué es ${topic}?`,
        `¿Cómo funciona ${topic}?`,
        `¿Por qué elegir ${topic}?`,
        `¿Cuándo usar ${topic}?`,
        `¿Dónde encontrar ${topic}?`,
      )
    }

    if (options.searchIntent === "commercial" || options.searchIntent === "all") {
      baseKeywords.push(
        `mejores ${topic}`,
        `${topic} precio`,
        `${topic} ofertas`,
        `${topic} comparativa`,
        `${topic} vs competencia`,
      )
    }

    if (options.searchIntent === "informational" || options.searchIntent === "all") {
      baseKeywords.push(
        `${topic} guía`,
        `${topic} tutorial`,
        `${topic} para principiantes`,
        `${topic} avanzado`,
        `${topic} ejemplos`,
      )
    }

    if (options.searchIntent === "transactional" || options.searchIntent === "all") {
      baseKeywords.push(
        `comprar ${topic}`,
        `${topic} tienda online`,
        `${topic} envío gratis`,
        `${topic} mejor precio`,
        `${topic} descuento`,
      )
    }

    // Si no hay suficientes keywords, añadir algunas genéricas
    if (baseKeywords.length < count) {
      baseKeywords = baseKeywords.concat([
        `${topic} online`,
        `${topic} gratis`,
        `${topic} profesional`,
        `${topic} curso`,
        `${topic} certificación`,
        `${topic} herramientas`,
        `${topic} software`,
        `${topic} aplicaciones`,
        `${topic} tendencias`,
        `${topic} novedades`,
        `${topic} consejos`,
        `${topic} trucos`,
        `${topic} problemas comunes`,
        `${topic} soluciones`,
        `${topic} ventajas`,
      ])
    }

    // Asegurarse de que hay suficientes keywords únicas
    const uniqueKeywords = Array.from(new Set(baseKeywords))

    // Crear resultados de fallback
    const fallbackResults: ExtendedKeywordSuggestion[] = []

    for (let i = 0; i < Math.min(count, uniqueKeywords.length); i++) {
      // Determinar si es una pregunta
      const isQuestion = uniqueKeywords[i].startsWith("¿")

      // Determinar la etapa del embudo según el contenido
      let funnelStage: FunnelStage = "tofu"
      if (
        uniqueKeywords[i].includes("comprar") ||
        uniqueKeywords[i].includes("precio") ||
        uniqueKeywords[i].includes("descuento")
      ) {
        funnelStage = "bofu"
      } else if (
        uniqueKeywords[i].includes("vs") ||
        uniqueKeywords[i].includes("comparativa") ||
        uniqueKeywords[i].includes("mejores")
      ) {
        funnelStage = "mofu"
      }

      // Determinar la etapa del customer journey
      let journeyStage: CustomerJourneyStage = "awareness"
      if (uniqueKeywords[i].includes("comprar") || uniqueKeywords[i].includes("precio")) {
        journeyStage = "decision"
      } else if (uniqueKeywords[i].includes("vs") || uniqueKeywords[i].includes("comparativa")) {
        journeyStage = "consideration"
      }

      // Determinar la longitud de cola
      const wordCount = uniqueKeywords[i].split(" ").length
      let tailLength: KeywordTailLength = "medium"
      if (wordCount <= 2) {
        tailLength = "short"
      } else if (wordCount >= 5) {
        tailLength = "long"
      }

      // Determinar el formato de contenido sugerido
      let contentFormat: ContentFormat = "blog"
      if (uniqueKeywords[i].includes("tutorial") || uniqueKeywords[i].includes("cómo")) {
        contentFormat = "video"
      } else if (uniqueKeywords[i].includes("vs") || uniqueKeywords[i].includes("comparativa")) {
        contentFormat = "infographic"
      }

      // Determinar el nivel de expertise
      let expertiseLevel: ExpertiseLevel = "intermediate"
      if (uniqueKeywords[i].includes("principiantes") || uniqueKeywords[i].includes("básico")) {
        expertiseLevel = "beginner"
      } else if (uniqueKeywords[i].includes("avanzado") || uniqueKeywords[i].includes("profesional")) {
        expertiseLevel = "advanced"
      }

      // Calcular relevancia basada en la similitud con el tema
      const relevance = 0.7 + (uniqueKeywords[i].includes(topic) ? 0.3 : 0.1)

      // Calcular dificultad basada en la longitud
      const difficulty = Math.max(0.1, Math.min(0.9, wordCount * 0.1))

      // Calcular volumen basado en la longitud (inverso a la dificultad)
      const searchVolume = Math.max(0.1, Math.min(0.9, 1 - wordCount * 0.05))

      // Calcular oportunidad
      const opportunityScore = searchVolume * (1 - difficulty)

      // Calcular valor comercial
      let commercialValue = 0.5
      if (
        uniqueKeywords[i].includes("comprar") ||
        uniqueKeywords[i].includes("precio") ||
        uniqueKeywords[i].includes("oferta")
      ) {
        commercialValue = 0.9
      } else if (uniqueKeywords[i].includes("gratis") || uniqueKeywords[i].includes("tutorial")) {
        commercialValue = 0.3
      }

      fallbackResults.push({
        keyword: uniqueKeywords[i],
        relevance: relevance,
        difficulty: difficulty,
        searchVolume: searchVolume,
        opportunityScore: opportunityScore,
        funnelStage: funnelStage,
        customerJourneyStage: journeyStage,
        purchaseIntent: funnelStage === "bofu" ? 8 : funnelStage === "mofu" ? 5 : 2,
        tailLength: tailLength,
        isQuestion: isQuestion,
        sentiment: "neutral",
        geoRelevance: "global",
        suggestedContentFormat: contentFormat,
        seasonality: "evergreen",
        isTrending: i % 5 === 0,
        niche: `${topic} específico`,
        keywordDensity: 0.02 + Math.random() * 0.03,
        relatedEntities: [`Entidad de ${topic}`],
        targetDemographic: ["Usuarios interesados"],
        expertiseLevel: expertiseLevel,
        preferredDevice: Math.random() > 0.5 ? "mobile" : "desktop",
        userMotivation: isQuestion ? "Resolver una duda" : "Obtener información",
        commercialValue: commercialValue,
        conversionPotential: funnelStage === "bofu" ? 0.8 : funnelStage === "mofu" ? 0.5 : 0.2,
        estimatedCPC: commercialValue * 0.8,
        monetizationModel: commercialValue > 0.7 ? "affiliate" : "ads",
      })
    }

    return fallbackResults
  }

  // Función para mostrar información detallada de depuración
  const showDebugInfo = (message: string, data: any) => {
    try {
      const debugMessage = `${message}\n\n${typeof data === "object" ? JSON.stringify(data, null, 2) : data}`
      setDebugInfo(debugMessage)
      console.debug(message, data)
    } catch (error) {
      console.error("Error al mostrar información de depuración:", error)
      setDebugInfo(`Error al mostrar información de depuración: ${error}`)
    }
  }

  const toggleKeywordSelection = (keyword: string) => {
    setSelectedKeywords((prev) => (prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]))
  }

  const handleAddSelected = () => {
    if (selectedKeywords.length > 0) {
      // onAddKeywords(selectedKeywords)

      toast({
        title: "Keywords añadidas",
        description: `Se han añadido ${selectedKeywords.length} keywords a tu lista`,
      })

      setSelectedKeywords([])
    }
  }

  // Función para renderizar el color de la badge según la relevancia
  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 0.8) return "bg-green-500"
    if (relevance >= 0.5) return "bg-amber-500"
    return "bg-red-500"
  }

  // Función para renderizar el color de la badge según la dificultad
  const getDifficultyColor = (difficulty = 0) => {
    if (difficulty <= 0.3) return "bg-green-500"
    if (difficulty <= 0.7) return "bg-amber-500"
    return "bg-red-500"
  }

  // Función para renderizar el color de la badge según el valor comercial
  const getCommercialColor = (value = 0) => {
    if (value >= 0.7) return "bg-green-500"
    if (value >= 0.4) return "bg-amber-500"
    return "bg-gray-500"
  }

  // Función para renderizar el color de la badge según la etapa del embudo
  const getFunnelStageColor = (stage: FunnelStage = "all") => {
    switch (stage) {
      case "tofu":
        return "bg-blue-500"
      case "mofu":
        return "bg-purple-500"
      case "bofu":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  // Función para renderizar el color de la badge según la etapa del customer journey
  const getJourneyStageColor = (stage: CustomerJourneyStage = "all") => {
    switch (stage) {
      case "awareness":
        return "bg-blue-500"
      case "consideration":
        return "bg-purple-500"
      case "decision":
        return "bg-green-500"
      case "retention":
        return "bg-amber-500"
      default:
        return "bg-gray-500"
    }
  }

  // Función para renderizar el color de la badge según la estacionalidad
  const getSeasonalityColor = (seasonality: Seasonality = "all") => {
    switch (seasonality) {
      case "seasonal":
        return "bg-amber-500"
      case "evergreen":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  // Función para renderizar el color de la badge según el nivel de expertise
  const getExpertiseLevelColor = (level: ExpertiseLevel = "all") => {
    switch (level) {
      case "beginner":
        return "bg-green-500"
      case "intermediate":
        return "bg-amber-500"
      case "advanced":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Función para renderizar el color de la badge según el dispositivo preferido
  const getDeviceColor = (device: PreferredDevice = "all") => {
    switch (device) {
      case "mobile":
        return "bg-blue-500"
      case "desktop":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  // Función para renderizar el color de la badge según el modelo de monetización
  const getMonetizationColor = (model: MonetizationModel = "all") => {
    switch (model) {
      case "affiliate":
        return "bg-green-500"
      case "direct":
        return "bg-blue-500"
      case "leadgen":
        return "bg-purple-500"
      case "ads":
        return "bg-amber-500"
      case "subscription":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Función para renderizar el color de la badge según el sentimiento
  const getSentimentColor = (sentiment = "neutral") => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500"
      case "negative":
        return "bg-red-500"
      case "neutral":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  // Función para renderizar el color de la badge según la relevancia geográfica
  const getGeoRelevanceColor = (geo = "global") => {
    switch (geo) {
      case "local":
        return "bg-green-500"
      case "regional":
        return "bg-amber-500"
      case "global":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  // Función para renderizar el color de la badge según el formato de contenido
  const getContentFormatColor = (format: ContentFormat = "all") => {
    switch (format) {
      case "blog":
        return "bg-blue-500"
      case "video":
        return "bg-red-500"
      case "infographic":
        return "bg-purple-500"
      case "ebook":
        return "bg-green-500"
      case "webinar":
        return "bg-amber-500"
      case "social":
        return "bg-pink-500"
      case "landing":
        return "bg-indigo-500"
      default:
        return "bg-gray-500"
    }
  }

  // Función para renderizar una badge con tooltip
  const renderBadgeWithTooltip = (value: any, getColor: Function, label: string, tooltip: string) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className={getColor(value)}>{label}</Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Función para renderizar una barra de progreso con tooltip
  const renderProgressWithTooltip = (value = 0, label: string, tooltip: string, colorClass = "bg-blue-500") => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{label}</span>
                <span>{Math.round(value * 100)}%</span>
              </div>
              <Progress value={value * 100} className={cn("h-2", colorClass)} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Función para renderizar una tarjeta de keyword con todos los datos
  const renderKeywordCard = (suggestion: ExtendedKeywordSuggestion, index: number) => {
    const isSelected = selectedKeywords.includes(suggestion.keyword)

    return (
      <div
        key={index}
        className={`flex flex-col rounded-md border p-3 transition-colors ${
          isSelected ? "border-primary bg-primary/10" : "hover:border-gray-400"
        }`}
        onClick={() => toggleKeywordSelection(suggestion.keyword)}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">{suggestion.keyword}</h3>
          <div className="flex space-x-1">
            {suggestion.isQuestion && (
              <Badge variant="outline" className="border-blue-500 text-blue-500">
                ?
              </Badge>
            )}
            {suggestion.isTrending && (
              <Badge variant="outline" className="border-amber-500 text-amber-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          {renderProgressWithTooltip(
            suggestion.relevance,
            "Relevancia",
            "Qué tan relacionada está con el tema principal",
            "bg-blue-500",
          )}

          {renderProgressWithTooltip(
            suggestion.difficulty || 0,
            "Dificultad",
            "Estimación de la dificultad para posicionar esta keyword",
            "bg-red-500",
          )}

          {renderProgressWithTooltip(
            suggestion.searchVolume || 0,
            "Volumen",
            "Estimación relativa del volumen de búsquedas",
            "bg-green-500",
          )}

          {renderProgressWithTooltip(
            suggestion.opportunityScore || 0,
            "Oportunidad",
            "Relación entre volumen y dificultad",
            "bg-purple-500",
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {suggestion.funnelStage &&
            renderBadgeWithTooltip(
              suggestion.funnelStage,
              getFunnelStageColor,
              suggestion.funnelStage.toUpperCase(),
              getFunnelStageDescription(suggestion.funnelStage),
            )}

          {suggestion.customerJourneyStage &&
            renderBadgeWithTooltip(
              suggestion.customerJourneyStage,
              getJourneyStageColor,
              suggestion.customerJourneyStage.charAt(0).toUpperCase() + suggestion.customerJourneyStage.slice(1),
              `Etapa del customer journey: ${suggestion.customerJourneyStage}`,
            )}

          {suggestion.tailLength &&
            renderBadgeWithTooltip(
              suggestion.tailLength,
              () => "bg-gray-500",
              `Cola ${suggestion.tailLength === "short" ? "corta" : suggestion.tailLength === "medium" ? "media" : "larga"}`,
              `Keyword de cola ${suggestion.tailLength === "short" ? "corta" : suggestion.tailLength === "medium" ? "media" : "larga"}`,
            )}

          {suggestion.sentiment &&
            renderBadgeWithTooltip(
              suggestion.sentiment,
              getSentimentColor,
              suggestion.sentiment.charAt(0).toUpperCase() + suggestion.sentiment.slice(1),
              `Sentimiento: ${suggestion.sentiment}`,
            )}
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {suggestion.geoRelevance &&
            renderBadgeWithTooltip(
              suggestion.geoRelevance,
              getGeoRelevanceColor,
              suggestion.geoRelevance.charAt(0).toUpperCase() + suggestion.geoRelevance.slice(1),
              `Relevancia geográfica: ${suggestion.geoRelevance}`,
            )}

          {suggestion.suggestedContentFormat &&
            renderBadgeWithTooltip(
              suggestion.suggestedContentFormat,
              getContentFormatColor,
              suggestion.suggestedContentFormat.charAt(0).toUpperCase() + suggestion.suggestedContentFormat.slice(1),
              `Formato de contenido sugerido: ${suggestion.suggestedContentFormat}`,
            )}

          {suggestion.seasonality &&
            renderBadgeWithTooltip(
              suggestion.seasonality,
              getSeasonalityColor,
              suggestion.seasonality === "seasonal" ? "Estacional" : "Perenne",
              `Estacionalidad: ${suggestion.seasonality === "seasonal" ? "Estacional" : "Perenne"}`,
            )}

          {suggestion.expertiseLevel &&
            renderBadgeWithTooltip(
              suggestion.expertiseLevel,
              getExpertiseLevelColor,
              suggestion.expertiseLevel === "beginner"
                ? "Principiante"
                : suggestion.expertiseLevel === "intermediate"
                  ? "Intermedio"
                  : "Avanzado",
              `Nivel de expertise: ${suggestion.expertiseLevel}`,
            )}
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {suggestion.preferredDevice &&
            renderBadgeWithTooltip(
              suggestion.preferredDevice,
              getDeviceColor,
              suggestion.preferredDevice === "mobile" ? "Móvil" : "Desktop",
              `Dispositivo preferido: ${suggestion.preferredDevice}`,
            )}

          {suggestion.monetizationModel &&
            renderBadgeWithTooltip(
              suggestion.monetizationModel,
              getMonetizationColor,
              suggestion.monetizationModel.charAt(0).toUpperCase() + suggestion.monetizationModel.slice(1),
              `Modelo de monetización: ${suggestion.monetizationModel}`,
            )}

          {suggestion.purchaseIntent !== undefined &&
            renderBadgeWithTooltip(
              suggestion.purchaseIntent,
              () =>
                suggestion.purchaseIntent >= 7
                  ? "bg-green-500"
                  : suggestion.purchaseIntent >= 4
                    ? "bg-amber-500"
                    : "bg-gray-500",
              `Intención ${suggestion.purchaseIntent}/10`,
              `Intención de compra: ${suggestion.purchaseIntent}/10`,
            )}
        </div>

        {suggestion.commercialValue !== undefined && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {renderProgressWithTooltip(
              suggestion.commercialValue,
              "Valor comercial",
              "Potencial de monetización",
              "bg-green-500",
            )}

            {renderProgressWithTooltip(
              suggestion.conversionPotential || 0,
              "Conversión",
              "Probabilidad de que lleve a una conversión",
              "bg-blue-500",
            )}
          </div>
        )}

        {suggestion.niche && (
          <div className="mb-2">
            <span className="text-xs text-muted-foreground">Nicho: </span>
            <span className="text-sm">{suggestion.niche}</span>
          </div>
        )}

        {suggestion.userMotivation && (
          <div className="mb-2">
            <span className="text-xs text-muted-foreground">Motivación: </span>
            <span className="text-sm">{suggestion.userMotivation}</span>
          </div>
        )}

        {suggestion.relatedEntities && suggestion.relatedEntities.length > 0 && (
          <div className="mb-2">
            <span className="text-xs text-muted-foreground">Entidades relacionadas: </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {suggestion.relatedEntities.map((entity, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {entity}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Función para renderizar las opciones avanzadas
  const renderAdvancedOptions = () => {
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="intent">
            <Target className="h-4 w-4 mr-2" />
            Intención
          </TabsTrigger>
          <TabsTrigger value="funnel">
            <Layers className="h-4 w-4 mr-2" />
            Embudo
          </TabsTrigger>
          <TabsTrigger value="content">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Contenido
          </TabsTrigger>
          <TabsTrigger value="audience">
            <Users className="h-4 w-4 mr-2" />
            Audiencia
          </TabsTrigger>
          <TabsTrigger value="commercial">
            <DollarSign className="h-4 w-4 mr-2" />
            Comercial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="intent" className="space-y-4">
          <div className="space-y-2">
            <Label>Intención de búsqueda</Label>
            <Select
              value={advancedOptions.searchIntent}
              onValueChange={(value) => updateAdvancedOption("searchIntent", value as SearchIntent)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una intención" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las intenciones</SelectItem>
                <SelectItem value="commercial">Comerciales</SelectItem>
                <SelectItem value="transactional">Transaccionales</SelectItem>
                <SelectItem value="informational">Informacionales</SelectItem>
                <SelectItem value="navigational">Navegacionales</SelectItem>
                <SelectItem value="leads">Generadoras de leads</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">{getIntentDescription(advancedOptions.searchIntent)}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-questions"
                checked={advancedOptions.includeQuestions}
                onCheckedChange={(checked) => updateAdvancedOption("includeQuestions", checked)}
              />
              <Label htmlFor="include-questions">Incluir preguntas</Label>
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              Genera keywords en formato de pregunta (¿Cómo...?, ¿Qué...?, etc.)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Longitud de cola</Label>
            <Select
              value={advancedOptions.tailLength}
              onValueChange={(value) => updateAdvancedOption("tailLength", value as KeywordTailLength)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona longitud" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las longitudes</SelectItem>
                <SelectItem value="short">Cola corta (1-2 palabras)</SelectItem>
                <SelectItem value="medium">Cola media (3-4 palabras)</SelectItem>
                <SelectItem value="long">Cola larga (5+ palabras)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sentimiento</Label>
            <Select
              value={advancedOptions.sentiment}
              onValueChange={(value) => updateAdvancedOption("sentiment", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona sentimiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los sentimientos</SelectItem>
                <SelectItem value="positive">Positivo</SelectItem>
                <SelectItem value="negative">Negativo</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <div className="space-y-2">
            <Label>Etapa del embudo de conversión</Label>
            <Select
              value={advancedOptions.funnelStage}
              onValueChange={(value) => updateAdvancedOption("funnelStage", value as FunnelStage)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona etapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las etapas</SelectItem>
                <SelectItem value="tofu">TOFU (Top of Funnel)</SelectItem>
                <SelectItem value="mofu">MOFU (Middle of Funnel)</SelectItem>
                <SelectItem value="bofu">BOFU (Bottom of Funnel)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">{getFunnelStageDescription(advancedOptions.funnelStage)}</p>
          </div>

          <div className="space-y-2">
            <Label>Etapa del customer journey</Label>
            <Select
              value={advancedOptions.customerJourneyStage}
              onValueChange={(value) => updateAdvancedOption("customerJourneyStage", value as CustomerJourneyStage)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona etapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las etapas</SelectItem>
                <SelectItem value="awareness">Awareness (Conocimiento)</SelectItem>
                <SelectItem value="consideration">Consideration (Consideración)</SelectItem>
                <SelectItem value="decision">Decision (Decisión)</SelectItem>
                <SelectItem value="retention">Retention (Retención)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Intención de compra mínima: {advancedOptions.minPurchaseIntent}/10</Label>
            </div>
            <Slider
              min={0}
              max={10}
              step={1}
              value={[advancedOptions.minPurchaseIntent]}
              onValueChange={(value) => updateAdvancedOption("minPurchaseIntent", value[0])}
            />
            <p className="text-sm text-muted-foreground">
              Qué tan cerca está el usuario de realizar una compra o conversión
            </p>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="space-y-2">
            <Label>Formato de contenido sugerido</Label>
            <Select
              value={advancedOptions.contentFormat}
              onValueChange={(value) => updateAdvancedOption("contentFormat", value as ContentFormat)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los formatos</SelectItem>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="infographic">Infografía</SelectItem>
                <SelectItem value="ebook">Ebook</SelectItem>
                <SelectItem value="webinar">Webinar</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="landing">Landing Page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Estacionalidad</Label>
            <Select
              value={advancedOptions.seasonality}
              onValueChange={(value) => updateAdvancedOption("seasonality", value as Seasonality)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona estacionalidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="seasonal">Estacional</SelectItem>
                <SelectItem value="evergreen">Perenne</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-trending"
                checked={advancedOptions.includeTrending}
                onCheckedChange={(checked) => updateAdvancedOption("includeTrending", checked)}
              />
              <Label htmlFor="include-trending">Incluir tendencias emergentes</Label>
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              Genera keywords relacionadas con tendencias recientes en el tema
            </p>
          </div>

          <div className="space-y-2">
            <Label>Relevancia geográfica</Label>
            <Select
              value={advancedOptions.geoRelevance}
              onValueChange={(value) => updateAdvancedOption("geoRelevance", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona relevancia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="regional">Regional</SelectItem>
                <SelectItem value="global">Global</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <div className="space-y-2">
            <Label>Nivel de expertise</Label>
            <Select
              value={advancedOptions.expertiseLevel}
              onValueChange={(value) => updateAdvancedOption("expertiseLevel", value as ExpertiseLevel)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los niveles</SelectItem>
                <SelectItem value="beginner">Principiante</SelectItem>
                <SelectItem value="intermediate">Intermedio</SelectItem>
                <SelectItem value="advanced">Avanzado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Dispositivo preferido</Label>
            <Select
              value={advancedOptions.preferredDevice}
              onValueChange={(value) => updateAdvancedOption("preferredDevice", value as PreferredDevice)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona dispositivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="mobile">Móvil</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="commercial" className="space-y-4">
          <div className="space-y-2">
            <Label>Modelo de monetización</Label>
            <Select
              value={advancedOptions.monetizationModel}
              onValueChange={(value) => updateAdvancedOption("monetizationModel", value as MonetizationModel)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los modelos</SelectItem>
                <SelectItem value="affiliate">Afiliados</SelectItem>
                <SelectItem value="direct">Venta directa</SelectItem>
                <SelectItem value="leadgen">Generación de leads</SelectItem>
                <SelectItem value="ads">Publicidad</SelectItem>
                <SelectItem value="subscription">Suscripción</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Valor comercial mínimo: {advancedOptions.minCommercialValue}/10</Label>
            </div>
            <Slider
              min={0}
              max={10}
              step={1}
              value={[advancedOptions.minCommercialValue]}
              onValueChange={(value) => updateAdvancedOption("minCommercialValue", value[0])}
            />
            <p className="text-sm text-muted-foreground">
              Potencial de monetización mínimo para las keywords generadas
            </p>
          </div>
        </TabsContent>
      </Tabs>
    )
  }

  // Función para renderizar los filtros y ordenación
  const renderFiltersAndSorting = () => {
    return (
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:justify-between">
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFilters.includes("highRelevance") ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setActiveFilters((prev) =>
                      prev.includes("highRelevance")
                        ? prev.filter((f) => f !== "highRelevance")
                        : [...prev, "highRelevance"],
                    )
                  }
                >
                  <Zap className="h-4 w-4 mr-1" />
                  Alta relevancia
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mostrar solo keywords con alta relevancia (70%+)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFilters.includes("lowDifficulty") ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setActiveFilters((prev) =>
                      prev.includes("lowDifficulty")
                        ? prev.filter((f) => f !== "lowDifficulty")
                        : [...prev, "lowDifficulty"],
                    )
                  }
                >
                  <Check className="h-4 w-4 mr-1" />
                  Baja dificultad
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mostrar solo keywords con baja dificultad (40% o menos)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFilters.includes("highVolume") ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setActiveFilters((prev) =>
                      prev.includes("highVolume") ? prev.filter((f) => f !== "highVolume") : [...prev, "highVolume"],
                    )
                  }
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Alto volumen
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mostrar solo keywords con alto volumen de búsqueda (60%+)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFilters.includes("highOpportunity") ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setActiveFilters((prev) =>
                      prev.includes("highOpportunity")
                        ? prev.filter((f) => f !== "highOpportunity")
                        : [...prev, "highOpportunity"],
                    )
                  }
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Alta oportunidad
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mostrar solo keywords con alta puntuación de oportunidad (70%+)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFilters.includes("questions") ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setActiveFilters((prev) =>
                      prev.includes("questions") ? prev.filter((f) => f !== "questions") : [...prev, "questions"],
                    )
                  }
                >
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Preguntas
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mostrar solo keywords en formato de pregunta</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFilters.includes("trending") ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setActiveFilters((prev) =>
                      prev.includes("trending") ? prev.filter((f) => f !== "trending") : [...prev, "trending"],
                    )
                  }
                >
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Tendencias
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mostrar solo keywords que son tendencia</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFilters.includes("highCommercial") ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setActiveFilters((prev) =>
                      prev.includes("highCommercial")
                        ? prev.filter((f) => f !== "highCommercial")
                        : [...prev, "highCommercial"],
                    )
                  }
                >
                  <DollarSign className="h-4 w-4 mr-1" />
                  Alto valor comercial
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mostrar solo keywords con alto valor comercial (70%+)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center space-x-2">
          <Label htmlFor="sort-by" className="whitespace-nowrap">
            Ordenar por:
          </Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sort-by" className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevancia</SelectItem>
              <SelectItem value="difficulty">Dificultad</SelectItem>
              <SelectItem value="volume">Volumen</SelectItem>
              <SelectItem value="opportunity">Oportunidad</SelectItem>
              <SelectItem value="commercial">Valor comercial</SelectItem>
              <SelectItem value="conversion">Potencial de conversión</SelectItem>
              <SelectItem value="alphabetical">Alfabético</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
          >
            <ArrowDownUp className={`h-4 w-4 ${sortOrder === "asc" ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!apiConfigured && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API no configurada</AlertTitle>
          <AlertDescription>
            No se ha detectado una configuración válida de API. Por favor, configura tu API key en la sección de
            Configuración.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Éxito</AlertTitle>
          <AlertDescription>Se han generado {keywords.length} palabras clave.</AlertDescription>
        </Alert>
      )}

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Generación Estratégica</CardTitle>
          <CardDescription>Genera keywords relacionadas con un tema específico</CardDescription>
        </CardHeader>
        <CardContent>
          {/* {!isConfigured && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Configuración incompleta</AlertTitle>
              <AlertDescription>
                Para utilizar la generación estratégica, primero debes configurar un proveedor de IA y una clave API
                válida en la sección de Configuración de IA.
              </AlertDescription>
            </Alert>
          )} */}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Tema principal</Label>
              <Input
                id="topic"
                placeholder="Ej: marketing digital, yoga para principiantes, etc."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            {/* {keywords.length > 0 && (
              <div className="space-y-2">
                <Label>Usar una de mis keywords como tema:</Label>
                <ScrollArea className="h-[100px] rounded-md border">
                  <div className="p-2">
                    {keywords.map((kw, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="mb-1 justify-start w-full text-left"
                        onClick={() => setTopic(kw)}
                      >
                        {kw}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )} */}

            <div className="flex items-center space-x-2">
              <Switch id="advanced-mode" checked={advancedMode} onCheckedChange={setAdvancedMode} />
              <Label htmlFor="advanced-mode">Modo avanzado</Label>
            </div>

            {advancedMode && (
              <>
                <Separator className="my-2" />
                {renderAdvancedOptions()}
              </>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="count">Número de keywords: {keywordCount}</Label>
              </div>
              <Slider
                id="count"
                min={5}
                max={30}
                step={5}
                value={[keywordCount]}
                onValueChange={(value) => setKeywordCount(value[0])}
              />
            </div>

            {/* {suggestions.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Keywords sugeridas ({filteredSuggestions.length}):</h3>
                  {selectedKeywords.length > 0 && (
                    <Button size="sm" onClick={handleAddSelected}>
                      <Plus className="mr-2 h-4 w-4" />
                      Añadir seleccionadas ({selectedKeywords.length})
                    </Button>
                  )}
                </div>

                {renderFiltersAndSorting()}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredSuggestions.map((suggestion, index) => renderKeywordCard(suggestion, index))}
                </div>
              </div>
            )} */}

            {/* {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )} */}

            {debugInfo && (
              <Alert variant="default" className="bg-gray-100 border-gray-300">
                <Info className="h-4 w-4" />
                <AlertTitle>Información de depuración</AlertTitle>
                <AlertDescription className="text-xs font-mono whitespace-pre-wrap break-all">
                  {debugInfo}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={generateKeywords} disabled={loading || !topic.trim() || !apiConfigured} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              `Generar ${keywordCount} keywords${advancedMode ? " avanzadas" : ""}`
            )}
          </Button>
        </CardFooter>
      </Card>

      {keywords.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Palabras Clave Generadas</CardTitle>
              <CardDescription>
                Estas son las palabras clave generadas para tu tema. Puedes utilizarlas para crear contenido optimizado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <div key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {keyword}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generador de Contenido</CardTitle>
              <CardDescription>Genera contenido optimizado utilizando las palabras clave generadas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="blog" onValueChange={setContentType}>
                <TabsList className="w-full">
                  <TabsTrigger value="blog">Artículo de Blog</TabsTrigger>
                  <TabsTrigger value="product">Descripción de Producto</TabsTrigger>
                  <TabsTrigger value="social">Redes Sociales</TabsTrigger>
                </TabsList>
              </Tabs>

              <Button
                onClick={generateContent}
                disabled={loading || keywords.length === 0 || !apiConfigured}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando contenido...
                  </>
                ) : (
                  "Generar Contenido"
                )}
              </Button>

              {generatedContent && (
                <div className="mt-4">
                  <Label htmlFor="generatedContent">Contenido Generado</Label>
                  <Textarea id="generatedContent" value={generatedContent} readOnly className="h-64 mt-2" />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              {generatedContent && (
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedContent)
                    alert("Contenido copiado al portapapeles")
                  }}
                >
                  Copiar al Portapapeles
                </Button>
              )}
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  )
}

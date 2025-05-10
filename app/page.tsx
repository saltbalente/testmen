"use client"

import { Checkbox } from "@/components/ui/checkbox"

import { Card } from "@/components/ui/card"

import type React from "react"

import { useState, useEffect } from "react"
import { type AIProvider, getAIService, testApiConnection } from "@/services/ai-service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles } from "lucide-react"
import AnimatedBackground from "@/components/animated-background"
import FloatingSymbols from "@/components/floating-symbols"
import MysticalHeader from "@/components/mystical-header"
import GlassCard from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { PromptGenerator } from "@/components/prompt-generator"
import CodeRecycler from "@/components/code-recycler"
import {
  CopyIcon,
  DownloadIcon,
  WandSparklesIcon,
  Code,
  RecycleIcon,
  ArchiveIcon,
  FileTypeIcon,
  LayoutTemplate,
  Menu,
  EyeIcon,
  FileIcon as FileHtml,
  Type,
  Brain,
  ImageIcon,
  ExternalLinkIcon,
  KeyRound,
  HistoryIcon,
  MessageSquare,
  Layers,
} from "lucide-react"
import { useTheme } from "next-themes"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import Link from "next/link"

// Importar componentes
import CodePreview from "@/components/code-preview"
import DesignVault from "@/components/design-vault"
import CssOptimizer from "@/components/css-optimizer"
import TemplatesManager from "@/components/templates-manager"
import BlogspotStudio from "@/components/blogspot-studio"
import { EsotericLandingTextGenerator } from "@/components/esoteric-landing-text-generator"
import { NeurotransmitterPromptGenerator } from "@/components/neurotransmitter-prompt-generator"
import { ImageCompressor } from "@/components/image-compressor"
import { PinterestExtractor } from "@/components/pinterest-extractor"
import KeywordManager from "@/components/keyword-manager/keyword-manager"
import { PromptHistory } from "@/components/prompt-history"
import { AdGenerator } from "@/components/ad-generator"
import { KeywordClusterGenerator } from "@/components/keyword-cluster-generator"
import { ImageGenerator } from "@/components/image-generator"

// Importar los componentes de presets
import { PromptPresets } from "@/components/prompt-presets"
import { HeroPresets } from "@/components/hero-presets"
import { BenefitsPresets } from "@/components/benefits-presets"
import { ServicesPresets } from "@/components/services-presets"
import { TestimonialsPresets } from "@/components/testimonials-presets"
import { FaqPresets } from "@/components/faq-presets"

// Import ConversionTextGenerator
import { ConversionTextGenerator } from "@/components/conversion-text-generator"

// Import GoogleAdsGenerator
import { GoogleAdsGenerator } from "@/components/google-ads-generator"

// Import CampaignStructureGenerator
import { CampaignStructureGenerator } from "@/components/campaign-structure-generator"

// Import LandingPageAnalyzer
import { LandingPageAnalyzer } from "@/components/landing-page-analyzer"

// Función segura para acceder a localStorage
const getLocalStorage = (key: string, defaultValue: any = "[]") => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key)
    return stored ? stored : defaultValue
  }
  return defaultValue
}

// Función segura para guardar en localStorage
const setLocalStorage = (key: string, value: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value)
  }
}

export default function Home() {
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [recyclerPrompt, setRecyclerPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRecycling, setIsRecycling] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentPartIndex, setCurrentPartIndex] = useState(0)
  const { theme, setTheme } = useTheme()
  const [inputCode, setInputCode] = useState("")
  const [parsedCode, setParsedCode] = useState("")
  const [activeTab, setActiveTab] = useState("generator")
  const [promptParts, setPromptParts] = useState<string[]>([])

  const [promptHistory, setPromptHistory] = useState<
    Array<{
      id: string
      date: string
      prompt: string
      title: string
      type: string
    }>
  >([])

  // Estado para la configuración de IA
  const [aiProvider, setAiProvider] = useState<AIProvider>("openai")
  const [openaiApiKey, setOpenaiApiKey] = useState<string>("")
  const [deepseekApiKey, setDeepseekApiKey] = useState<string>("")
  const [aiModel, setAiModel] = useState<string>("gpt-4o")

  // Estado para la optimización con DeepSeek
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)
  const [isOptimized, setIsOptimized] = useState(false)

  const [keywordGroups, setKeywordGroups] = useState<
    Array<{
      name: string
      keywords: string[]
    }>
  >([])

  // Eliminar cualquier estado de sesión al cargar la página
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn")
    }
  }, [])

  // Añadir después de los useEffect existentes
  // Cargar el historial de prompts al iniciar
  useEffect(() => {
    const savedHistory = localStorage.getItem("prompt_history")
    if (savedHistory) {
      try {
        setPromptHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("Error al cargar el historial de prompts:", e)
      }
    }
  }, [])

  // Cargar API keys guardadas
  useEffect(() => {
    const savedOpenaiKey = localStorage.getItem("openai_api_key")
    const savedDeepseekKey = localStorage.getItem("deepseek_api_key")
    const savedProvider = localStorage.getItem("ai_provider") as AIProvider
    const savedModel = localStorage.getItem("ai_model")

    if (savedOpenaiKey) setOpenaiApiKey(savedOpenaiKey)
    if (savedDeepseekKey) setDeepseekApiKey(savedDeepseekKey)
    if (savedProvider) setAiProvider(savedProvider)
    if (savedModel) setAiModel(savedModel)
  }, [])

  // Guardar configuración de IA
  const saveAiConfig = (provider: AIProvider, model: string) => {
    setAiProvider(provider)
    setAiModel(model)
    localStorage.setItem("ai_provider", provider)
    localStorage.setItem("ai_model", model)
  }

  // Función para dividir el prompt en partes si es necesario
  const splitPromptIntoParts = (prompt: string, maxLength: number): string[] => {
    if (prompt.length <= maxLength) return [prompt]

    const parts: string[] = []
    let currentIndex = 0

    while (currentIndex < prompt.length) {
      // Buscar un punto o salto de línea para hacer un corte limpio
      let endIndex = currentIndex + maxLength
      if (endIndex >= prompt.length) {
        endIndex = prompt.length
      } else {
        // Buscar hacia atrás desde el límite para encontrar un buen punto de corte
        const possibleBreakPoints = ["\n\n", "\n", ". ", ", ", " "]

        for (const breakPoint of possibleBreakPoints) {
          const breakIndex = prompt.lastIndexOf(breakPoint, endIndex)
          if (breakIndex > currentIndex && breakIndex <= endIndex) {
            endIndex = breakIndex + breakPoint.length
            break
          }
        }
      }

      parts.push(prompt.substring(currentIndex, endIndex))
      currentIndex = endIndex
    }

    return parts
  }

  // Modificar la función handleGeneratePrompt para guardar en el historial
  // Reemplazar la función handleGeneratePrompt existente con esta versión

  const handleGeneratePrompt = (formData: any) => {
    setIsGenerating(true)
    setProgress(0)

    // Simular llamada a API o tiempo de procesamiento
    setTimeout(() => {
      const prompt = generatePromptFromFormData(formData)

      // Dividir el prompt en partes si es necesario
      const parts = formData.splitCodeOutput ? splitPromptIntoParts(prompt, formData.maxPartLength) : [prompt]

      setPromptParts(parts)
      setCurrentPartIndex(0)
      setGeneratedPrompt(parts[0])

      // Guardar en el historial
      const newHistoryItem = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        prompt: prompt,
        title: `${formData.sectionType || "Prompt"} - ${new Date().toLocaleDateString()}`,
        type: formData.sectionType || "general",
      }

      const updatedHistory = [newHistoryItem, ...promptHistory].slice(0, 50) // Limitar a 50 entradas
      setPromptHistory(updatedHistory)
      localStorage.setItem("prompt_history", JSON.stringify(updatedHistory))

      setIsGenerating(false)

      // Mostrar notificación si hay múltiples partes
      if (parts.length > 1) {
        toast({
          title: "Prompt dividido en partes",
          description: `El prompt ha sido dividido en ${parts.length} partes debido a su longitud.`,
        })
      }
    }, 1500)
  }

  // Manejar el reciclaje de código
  const handleRecycleCode = (originalCode: string, generatedPrompt: string, options: any) => {
    setIsRecycling(true)

    // Simular procesamiento
    setTimeout(() => {
      setRecyclerPrompt(generatedPrompt)
      setIsRecycling(false)

      toast({
        title: "Prompt de reciclaje generado",
        description: `Se ha generado un prompt para reciclar el componente de tipo ${options.componentType}.`,
      })
    }, 1000)
  }

  // Manejar la generación de prompts para textos de landing pages esotéricas
  const handleGenerateEsotericLandingText = (formData: any) => {
    setIsGenerating(true)
    setProgress(0)

    // Simular procesamiento
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 10
      })
    }, 150)

    setTimeout(() => {
      clearInterval(progressInterval)
      setProgress(100)

      // We don't need to do anything with the prompt here since it's displayed in the component
      setIsGenerating(false)

      toast({
        title: "Prompt para texto esotérico generado",
        description: "Se ha generado un prompt para crear textos persuasivos de landing pages esotéricas.",
      })
    }, 1500)
  }

  // Actualizar la función generatePromptFromFormData para incluir las nuevas categorías opcionales
  const generatePromptFromFormData = (data: any) => {
    // Esta función contendría la lógica para crear un prompt basado en los datos del formulario
    let prompt = `Crea una sección de ${data.sectionType} para un sitio web con las siguientes características:\n\n`

    prompt += `- Estilo: ${data.designStyle}\n`
    prompt += `- Plataforma objetivo: ${data.targetPlatform}\n`
    prompt += `- Esquema de color: ${Array.isArray(data.colorScheme) ? data.colorScheme.join(", ") : "No especificado"}\n`

    if (data.includeImages) {
      prompt += `- Incluir imágenes: Sí\n`
      prompt += `- Estilo de imagen: ${data.imageStyle}\n`
    } else {
      prompt += `- Incluir imágenes: No\n`
    }

    if (data.includeBackgroundVideo) {
      prompt += `- Incluir video de fondo: Sí\n`
      // Añadir configuración de video si está habilitada
      prompt += `- Modo de reproducción de video: ${data.videoPlayback}\n`
      prompt += `- Reproducción en bucle: ${data.videoLoop ? "Sí" : "No"}\n`
      prompt += `- Video silenciado: ${data.videoMuted ? "Sí" : "No"}\n`
      prompt += `- Carga diferida de video: ${data.videoLazyLoad ? "Sí" : "No"}\n`
      prompt += `- Reproducir solo cuando es visible: ${data.videoIntersectionObserver ? "Sí" : "No"}\n`
      prompt += `- Efecto de video: ${data.videoEffect}\n`
      prompt += `- Opacidad del video: ${data.videoOpacity}%\n`
      prompt += `- Velocidad de reproducción: ${data.videoPlaybackSpeed / 100}x\n`
    } else {
      prompt += `- Incluir video de fondo: No\n`
    }

    prompt += `- Tipo de fuente: ${data.fontType}\n`
    prompt += `- Tipo de animación: ${data.animationType}\n`
    prompt += `- Estilo de borde: ${data.borderStyle}\n`

    if (data.contactInfo) {
      prompt += `- Incluir información de contacto: Sí\n`
    } else {
      prompt += `- Incluir información de contacto: No\n`
    }

    // Añadir opciones avanzadas si están seleccionadas
    if (data.performance && Array.isArray(data.performance) && data.performance.length > 0) {
      prompt += `\n- Optimizaciones de rendimiento: ${data.performance.join(", ")}\n`
    }

    if (data.seo && Array.isArray(data.seo) && data.seo.length > 0) {
      prompt += `\n- Optimizaciones SEO: ${data.seo.join(", ")}\n`
    }

    if (data.browserCompatibility && Array.isArray(data.browserCompatibility) && data.browserCompatibility.length > 0) {
      prompt += `\n- Compatibilidad con navegadores: ${data.browserCompatibility.join(", ")}\n`
    }

    if (data.interactivity && Array.isArray(data.interactivity) && data.interactivity.length > 0) {
      prompt += `\n- Interactividad: ${data.interactivity.join(", ")}\n`
    }

    if (data.transitions && Array.isArray(data.transitions) && data.transitions.length > 0) {
      prompt += `\n- Transiciones: ${data.transitions.join(", ")}\n`
    }

    if (data.esotericElements && Array.isArray(data.esotericElements) && data.esotericElements.length > 0) {
      prompt += `\n- Elementos esotéricos interactivos: ${data.esotericElements.join(", ")}\n`
    }

    // Añadir configuración de código
    prompt += `\n- Estilo de código: ${data.codeStyle}\n`
    if (data.addDetailedComments) {
      prompt += `- Incluir comentarios detallados: Sí\n`
    }

    prompt += `\nLa sección debe tener una estética ${data.designStyle} con animaciones ${data.animationType}. Utilizar tipografía ${data.fontType} y bordes ${data.borderStyle}. `

    // Añadir instrucciones específicas según la plataforma objetivo
    if (data.targetPlatform === "mobile" || data.targetPlatform === "mobile-first") {
      prompt += `El diseño debe estar OPTIMIZADO PARA DISPOSITIVOS MÓVILES, asegurando que todos los elementos sean fácilmente accesibles con el pulgar, con botones de tamaño adecuado para interacción táctil, y una disposición vertical que aproveche el desplazamiento natural en smartphones. `
    } else if (data.targetPlatform === "tablet") {
      prompt += `El diseño debe estar OPTIMIZADO PARA TABLETS, aprovechando el espacio adicional de pantalla mientras mantiene la facilidad de uso táctil, con elementos interactivos de tamaño adecuado y considerando ambas orientaciones (vertical y horizontal). `
    } else if (data.targetPlatform === "desktop") {
      prompt += `El diseño debe estar OPTIMIZADO PARA COMPUTADORAS DE ESCRITORIO, aprovechando el espacio amplio de pantalla con layouts más complejos, interacciones basadas en mouse/teclado y mayor densidad de información. `
    } else if (data.targetPlatform === "all") {
      prompt += `El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido. `
    }

    prompt += `El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.\n\n`

    // Añadir requisitos técnicos
    prompt += `\nREQUISITOS TÉCNICOS IMPORTANTES:\n`
    prompt += `1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.\n`
    prompt += `2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).\n`

    return prompt
  }

  const copyToClipboard = (text: string, message = "Copiado al portapapeles") => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado al portapapeles",
      description: message,
    })
  }

  const downloadPrompt = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedPrompt], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "prompt-diseno-web.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const downloadRecyclerPrompt = () => {
    const element = document.createElement("a")
    const file = new Blob([recyclerPrompt], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "prompt-reciclaje-codigo.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const downloadAllParts = () => {
    if (promptParts.length <= 1) {
      downloadPrompt()
      return
    }

    const element = document.createElement("a")
    const file = new Blob([promptParts.join("\n\n--- NUEVA PARTE ---\n\n")], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "prompt-diseno-web-completo.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "Descarga completa",
      description: `Se han descargado todas las ${promptParts.length} partes del prompt en un solo archivo.`,
    })
  }

  const loadPromptFromHistory = (historyItem: any) => {
    const parts = splitPromptIntoParts(historyItem.prompt, 2000)
    setPromptParts(parts)
    setCurrentPartIndex(0)
    setGeneratedPrompt(parts[0])
    setActiveTab("result")

    toast({
      title: "Prompt cargado del historial",
      description: `Se ha cargado el prompt "${historyItem.title}"`,
    })
  }

  const removePromptFromHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Evitar que se active el onClick del elemento padre

    const updatedHistory = promptHistory.filter((item) => item.id !== id)
    setPromptHistory(updatedHistory)
    localStorage.setItem("prompt_history", JSON.stringify(updatedHistory))

    toast({
      title: "Prompt eliminado",
      description: "Se ha eliminado el prompt del historial",
    })
  }

  const parseHtmlForBlogger = () => {
    if (!inputCode) return

    // Función para parsear HTML para Blogger
    const parseForBlogger = (html: string) => {
      return html
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/&/g, "&amp;")
        .replace(/\{/g, "&#123;")
        .replace(/}/g, "&#125;")
        .replace(/\[/g, "&#91;")
        .replace(/\]/g, "&#93;")
    }

    const parsed = parseForBlogger(inputCode)
    setParsedCode(parsed)

    toast({
      title: "Código parseado correctamente",
      description: "El código ha sido parseado y está listo para Blogger.",
    })
  }

  // Define messages here
  const messages = [
    {
      role: "system",
      content: `Eres un experto en la creación de prompts para la generación de diseños web vanguardistas y esotéricos. Tu objetivo es ayudar a los usuarios a obtener prompts detallados y efectivos para crear secciones web visualmente impactantes y llenas de misterio.`,
    },
    {
      role: "user",
      content: `Optimiza el siguiente prompt para obtener el mejor resultado posible. Asegúrate de que el prompt sea claro, conciso y contenga todos los detalles necesarios para generar una sección web con una estética esotérica y vanguardista.`,
    },
  ]

  const navigateToPart = (index: number) => {
    if (index >= 0 && index < promptParts.length) {
      setCurrentPartIndex(index)
      setGeneratedPrompt(promptParts[index])
    }
  }

  // Reemplazar la función generateKeywordGroups actual con esta versión que usa la API de OpenAI
  // Reemplazar la función generateKeywordGroups actual con esta versión mejorada:

  const generateKeywordGroups = async () => {
    // Obtener los valores de los campos
    const keywordsInput = document.getElementById("keywords-input") as HTMLTextAreaElement
    const maxGroupsInput = document.getElementById("max-groups") as HTMLInputElement
    const keywordsPerGroupInput = document.getElementById("keywords-per-group") as HTMLInputElement

    // Validar que hay palabras clave
    if (!keywordsInput?.value) {
      toast({
        title: "Error",
        description: "Por favor, ingresa al menos una palabra clave",
        variant: "destructive",
      })
      return
    }

    // Obtener las palabras clave como array
    const keywords = keywordsInput.value
      .split("\n")
      .map((k) => k.trim())
      .filter((k) => k.length > 0)

    if (keywords.length < 2) {
      toast({
        title: "Error",
        description: "Necesitas al menos 2 palabras clave para crear grupos",
        variant: "destructive",
      })
      return
    }

    // Obtener los valores de configuración
    const maxGroups = Number.parseInt(maxGroupsInput?.value || "5")
    const keywordsPerGroup = Number.parseInt(keywordsPerGroupInput?.value || "10")

    // Obtener las opciones de intención de búsqueda
    const commercialIntent = (document.getElementById("commercial-intent") as HTMLInputElement)?.checked
    const transactionalIntent = (document.getElementById("transactional-intent") as HTMLInputElement)?.checked
    const leadIntent = (document.getElementById("lead-intent") as HTMLInputElement)?.checked

    // Obtener la opción de eliminar duplicados
    const removeDuplicates = (document.getElementById("remove-duplicates") as HTMLInputElement)?.checked

    // Verificar si hay una API key configurada
    if (!openaiApiKey) {
      toast({
        title: "Error",
        description: "Por favor, configura una API key de OpenAI en la pestaña 'Generador'",
        variant: "destructive",
      })
      return
    }

    // Mostrar estado de carga y progreso
    setKeywordGroups([])
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 10))
    }, 500)

    toast({
      title: "Generando grupos",
      description: "Analizando y agrupando palabras clave con OpenAI...",
    })

    try {
      // Crear el prompt para la IA
      const prompt = `
    Eres un experto en marketing digital especializado en agrupar palabras clave para campañas de Google Ads.
    
    Necesito que agrupes las siguientes palabras clave en grupos temáticos coherentes para una campaña de anuncios esotéricos.
    
    PALABRAS CLAVE:
    ${keywords.join("\n")}
    
    INSTRUCCIONES:
    1. Crea un máximo de ${maxGroups} grupos temáticos.
    2. Cada grupo debe tener un máximo de ${keywordsPerGroup} palabras clave.
    3. Cada grupo debe tener un nombre descriptivo que refleje su temática principal.
    4. Las palabras clave deben estar agrupadas por similitud semántica y relevancia temática.
    5. Asegúrate de que cada grupo sea coherente y tenga un enfoque claro.
    6. Considera la intención de búsqueda al agrupar: ${commercialIntent ? "Comercial, " : ""}${
      transactionalIntent ? "Transaccional, " : ""
    }${leadIntent ? "Generador de leads" : ""}.
    7. ${
      removeDuplicates
        ? "Elimina palabras clave duplicadas o con significado muy similar, manteniendo solo la más representativa de cada concepto."
        : "Mantén todas las palabras clave, incluso si son similares entre sí."
    }
    
    FORMATO DE RESPUESTA:
    Devuelve tu respuesta ÚNICAMENTE en formato JSON con la siguiente estructura exacta:
    [
      {
        "name": "Nombre del Grupo 1",
        "keywords": ["palabra clave 1", "palabra clave 2", ...]
      },
      {
        "name": "Nombre del Grupo 2",
        "keywords": ["palabra clave 3", "palabra clave 4", ...]
      }
    ]
    
    IMPORTANTE: Responde ÚNICAMENTE con el JSON, sin texto adicional antes o después.
    `

      // Realizar la llamada a la API de OpenAI directamente
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: aiModel || "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || `Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const responseContent = data.choices[0].message.content

      // Intentar parsear la respuesta como JSON
      let parsedResponse
      try {
        // Buscar si hay un objeto JSON en la respuesta
        const jsonMatch = responseContent.match(/\[\s*\{[\s\S]*}\s*\]/) // Fixed: Removed backslash before } character
        const jsonString = jsonMatch ? jsonMatch[0] : responseContent
        parsedResponse = JSON.parse(jsonString)
      } catch (parseError) {
        console.error("Error al parsear la respuesta JSON:", parseError)
        console.log("Respuesta recibida:", responseContent)
        throw new Error("La respuesta de la IA no tiene el formato esperado. Por favor, intenta de nuevo.")
      }

      // Validar la estructura de la respuesta
      if (!Array.isArray(parsedResponse)) {
        throw new Error("La respuesta no es un array válido")
      }

      // Detener el intervalo de progreso y completar al 100%
      clearInterval(progressInterval)
      setProgress(100)

      // Actualizar el estado con los grupos generados
      setKeywordGroups(parsedResponse)

      // Mostrar notificación de éxito
      toast({
        title: "Grupos generados",
        description: `Se han creado ${parsedResponse.length} grupos de anuncios optimizados con IA`,
      })

      // Resetear el progreso después de un tiempo
      setTimeout(() => {
        setProgress(0)
      }, 2000)
    } catch (error) {
      // Detener el intervalo de progreso en caso de error
      clearInterval(progressInterval)
      setProgress(0)

      console.error("Error al generar grupos con IA:", error)
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al generar los grupos. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Buscar la función que genera el prompt para los anuncios (probablemente generateAdPrompt o similar)
  // y modificar las instrucciones para la IA

  // Reemplazar las instrucciones actuales con estas instrucciones mejoradas:

  const generateAdPrompt = (keyword: string) => {
    return `Genera 10 anuncios de Google Ads para la palabra clave "${keyword}" siguiendo estas reglas estrictas:

1. IMPORTANTE: NO USES CORCHETES [] EN NINGUNA PARTE DEL ANUNCIO. Los corchetes son solo para concordancia de palabras clave, no para textos de anuncios.

2. Cada anuncio debe tener:
   - 3 títulos (máximo 30 caracteres cada uno)
   - 2 descripciones (máximo 90 caracteres cada uno)

3. IMPORTANTE: Todos los títulos y descripciones deben ser FRASES COMPLETAS con sentido. Si una frase no cabe en el límite de caracteres, REFORMÚLALA para que sea más corta pero mantenga el sentido completo.

4. Ejemplo de lo que NO debes hacer:
   - "Auténtico [hechizos para enamo" (incorrecto: tiene corchetes y está incompleta)
   
   Ejemplo de lo que SÍ debes hacer:
   - "Auténticos hechizos de amor" (correcto: sin corchetes y frase completa)

5. Incluye llamadas a la acción efectivas.

6. Usa un lenguaje persuasivo y directo.

7. Asegúrate de que el anuncio sea relevante para la palabra clave.

8. Formato de salida: JSON con esta estructura:
{
  "ads": [
    {
      "headlines": ["Título 1", "Título 2", "Título 3"],
      "descriptions": ["Descripción 1", "Descripción 2"]
    },
    ...
  ]
}`
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <FloatingSymbols />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <MysticalHeader />

        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2"></div>
          </div>

          <div className="flex flex-col w-full space-y-4">
            {/* Categorías principales en pestañas */}
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-1 border border-purple-500/20 overflow-x-auto">
              <div className="flex items-center min-w-max">
                <Button
                  variant={
                    activeTab === "generator" || activeTab === "result" || activeTab === "recycler"
                      ? "default"
                      : "ghost"
                  }
                  onClick={() => setActiveTab("generator")}
                  className="rounded-md px-3 py-2 text-sm font-medium"
                >
                  <WandSparklesIcon className="h-4 w-4 mr-2" />
                  Generador
                </Button>

                <div className="h-4 border-r border-purple-500/20 mx-1"></div>

                <Button
                  variant={
                    activeTab === "landing-text" ||
                    activeTab === "neurotransmitter" ||
                    activeTab === "conversion-texts" ||
                    activeTab === "google-ads"
                      ? "default"
                      : "ghost"
                  }
                  onClick={() => setActiveTab("landing-text")}
                  className="rounded-md px-3 py-2 text-sm font-medium"
                >
                  <Type className="h-4 w-4 mr-2" />
                  Textos
                </Button>

                <div className="h-4 border-r border-purple-500/20 mx-1"></div>

                <Button
                  variant={activeTab === "keys" || activeTab === "keyword-planner" ? "default" : "ghost"}
                  onClick={() => setActiveTab("keys")}
                  className="rounded-md px-3 py-2 text-sm font-medium"
                >
                  <KeyRound className="h-4 w-4 mr-2" />
                  Keywords
                </Button>

                <div className="h-4 border-r border-purple-500/20 mx-1"></div>

                <Button
                  variant={
                    activeTab === "pinterest-extractor" || activeTab === "image-compressor" ? "default" : "ghost"
                  }
                  onClick={() => setActiveTab("pinterest-extractor")}
                  className="rounded-md px-3 py-2 text-sm font-medium"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Multimedia
                </Button>

                <div className="h-4 border-r border-purple-500/20 mx-1"></div>

                <Button
                  variant={activeTab === "history" ? "default" : "ghost"}
                  onClick={() => setActiveTab("history")}
                  className="rounded-md px-3 py-2 text-sm font-medium"
                >
                  <HistoryIcon className="h-4 w-4 mr-2" />
                  Historial
                </Button>

                <div className="h-4 border-r border-purple-500/20 mx-1"></div>
              </div>
            </div>

            {/* Submenú contextual basado en la categoría seleccionada */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 px-1">
              {/* Submenú para Generador */}
              {(activeTab === "generator" || activeTab === "result" || activeTab === "recycler") && (
                <>
                  <Button
                    variant={activeTab === "generator" ? "default" : "outline"}
                    onClick={() => setActiveTab("generator")}
                    size="sm"
                    className="px-3"
                  >
                    <WandSparklesIcon className="h-3.5 w-3.5 mr-1" />
                    Configuración
                  </Button>
                  <Button
                    variant={activeTab === "result" ? "default" : "outline"}
                    onClick={() => setActiveTab("result")}
                    size="sm"
                    className="px-3"
                  >
                    Prompt
                  </Button>
                  <Button
                    variant={activeTab === "recycler" ? "default" : "outline"}
                    onClick={() => setActiveTab("recycler")}
                    size="sm"
                    className="px-3"
                  >
                    <RecycleIcon className="h-3.5 w-3.5 mr-1" />
                    Reciclador
                  </Button>
                  <Button
                    variant={activeTab === "image-generator" ? "default" : "outline"}
                    onClick={() => setActiveTab("image-generator")}
                    size="sm"
                    className="px-3"
                  >
                    <ImageIcon className="h-3.5 w-3.5 mr-1" />
                    Generador de Imágenes
                  </Button>
                </>
              )}

              {/* Submenú para Textos */}
              {(activeTab === "landing-text" ||
                activeTab === "neurotransmitter" ||
                activeTab === "conversion-texts" ||
                activeTab === "google-ads") && (
                <>
                  <Button
                    variant={activeTab === "landing-text" ? "default" : "outline"}
                    onClick={() => setActiveTab("landing-text")}
                    size="sm"
                    className="px-3"
                  >
                    <Type className="h-3.5 w-3.5 mr-1" />
                    Landing Pages
                  </Button>
                  <Button
                    variant={activeTab === "neurotransmitter" ? "default" : "outline"}
                    onClick={() => setActiveTab("neurotransmitter")}
                    size="sm"
                    className="px-3"
                  >
                    <Brain className="h-3.5 w-3.5 mr-1" />
                    Neurotransmisores
                  </Button>
                  <Button
                    variant={activeTab === "conversion-texts" ? "default" : "outline"}
                    onClick={() => setActiveTab("conversion-texts")}
                    size="sm"
                    className="px-3"
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                    Textos para Conversiones
                  </Button>
                  <Button
                    variant={activeTab === "google-ads" ? "default" : "outline"}
                    onClick={() => setActiveTab("google-ads")}
                    size="sm"
                    className="px-3"
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    Google Ads
                  </Button>
                </>
              )}

              {/* Submenú para Keywords */}
              {(activeTab === "keys" || activeTab === "keyword-planner") && (
                <>
                  <Button
                    variant={activeTab === "keys" ? "default" : "outline"}
                    onClick={() => setActiveTab("keys")}
                    size="sm"
                    className="px-3"
                  >
                    <KeyRound className="h-3.5 w-3.5 mr-1" />
                    Gestor
                  </Button>
                  <Button
                    variant={activeTab === "keyword-cluster" ? "default" : "outline"}
                    onClick={() => setActiveTab("keyword-cluster")}
                    size="sm"
                  >
                    <Layers className="h-3.5 w-3.5 mr-1" />
                    Clusters
                  </Button>
                </>
              )}

              {/* Submenú para Multimedia */}
              {(activeTab === "pinterest-extractor" || activeTab === "image-compressor") && (
                <>
                  <Button
                    variant={activeTab === "pinterest-extractor" ? "default" : "outline"}
                    onClick={() => setActiveTab("pinterest-extractor")}
                    size="sm"
                    className="px-3"
                  >
                    <ExternalLinkIcon className="h-3.5 w-3.5 mr-1" />
                    Pinterest
                  </Button>
                  <Button
                    variant={activeTab === "image-compressor" ? "default" : "outline"}
                    onClick={() => setActiveTab("image-compressor")}
                    size="sm"
                    className="px-3"
                  >
                    <ImageIcon className="h-3.5 w-3.5 mr-1" />
                    Compresor
                  </Button>
                </>
              )}

              {/* Menú de herramientas siempre visible */}
              <div className="ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="px-3">
                      <Menu className="h-3.5 w-3.5 mr-1" />
                      Herramientas
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/herramienta-ia">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Herramienta Multiusos IA
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="https://v0-ultra-seo-optimizer.vercel.app/" target="_blank" rel="noopener noreferrer">
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
                          className="h-4 w-4 mr-2 text-blue-400"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                          <path d="m15.5 9-4.5 4.5L9.5 12"></path>
                        </svg>
                        Optimizar Prompts
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a
                        href="https://v0-ultra-seo-optimizer-rh3m09.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
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
                          className="h-4 w-4 mr-2 text-green-400"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                          <path d="m15.5 9-4.5 4.5L9.5 12"></path>
                        </svg>
                        Contenido Indetectable IA
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="https://v0-clonando-gqk6o7.vercel.app/" target="_blank" rel="noopener noreferrer">
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
                          className="h-4 w-4 mr-2 text-blue-500"
                        >
                          <rect width="20" height="14" x="2" y="5" rx="2" />
                          <line x1="2" x2="22" y1="10" y2="10" />
                        </svg>
                        Herramienta de Scrapeo
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("parser")}>
                      <Code className="h-4 w-4 mr-2" />
                      Parseador HTML
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("css-optimizer")}>
                      <FileTypeIcon className="h-4 w-4 mr-2" />
                      Optimizador CSS
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("preview")}>
                      <EyeIcon className="h-4 w-4 mr-2" />
                      Vista Previa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("vault")}>
                      <ArchiveIcon className="h-4 w-4 mr-2" />
                      Baúl de Diseños
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("templates")}>
                      <LayoutTemplate className="h-4 w-4 mr-2" />
                      Templates
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="https://v0-fuentes-brujeria.vercel.app/" target="_blank" rel="noopener noreferrer">
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
                          className="h-4 w-4 mr-2 text-purple-500"
                        >
                          <path d="M4 7V4h16v3"></path>
                          <path d="M9 20h6"></path>
                          <path d="M12 4v16"></path>
                        </svg>
                        Fuentes Esotéricas
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("blogspot")}>
                      <FileHtml className="h-4 w-4 mr-2" />
                      Blogspot Studio
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="https://wa-generador.vercel.app/" target="_blank" rel="noopener noreferrer">
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
                          className="h-4 w-4 mr-2 text-green-500"
                        >
                          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path>
                          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"></path>
                          <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"></path>
                          <path d="M9.5 15.25a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-.5a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 0-.5.5v.5Z"></path>
                        </svg>
                        Generador de WhatsApp
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="https://v0-clonando-slztdr.vercel.app/" target="_blank" rel="noopener noreferrer">
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
                          className="h-4 w-4 mr-2 text-yellow-400" // Example color, adjust if needed
                        >
                          <path d="M21.73 18a2.64 2.64 0 0 0-3.78 0l-1.48 1.48a2.64 2.64 0 0 0 0 3.78l1.48 1.48a2.64 2.64 0 0 0 3.78 0l1.48-1.48a2.64 2.64 0 0 0 0-3.78l-1.48-1.48z" />
                          <path d="M2.27 6a2.64 2.64 0 0 0 3.78 0l1.48-1.48a2.64 2.64 0 0 0 0-3.78L6.05.26a2.64 2.64 0 0 0-3.78 0L.79 1.74a2.64 2.64 0 0 0 0 3.78l1.48 1.48z" />
                          <path d="m8 8 8 8" />
                        </svg>
                        Remplazador de wa.me
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Contenido existente */}
            {/* ... */}

            {/* Nueva pestaña para el Generador de Ads */}
            <TabsContent value="ad-generator">
              <GlassCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-purple-400" />
                    Generador de Anuncios con Análisis Gramatical
                  </CardTitle>
                  <CardDescription>
                    Crea anuncios optimizados con análisis gramatical inteligente para mejorar su efectividad
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdGenerator />
                </CardContent>
              </GlassCard>
            </TabsContent>

            {/* Resto de pestañas existentes */}
            <TabsContent value="generator">
              <GlassCard>
                <div className="mb-6 p-4 rounded-lg border border-purple-500/30 bg-purple-500/5">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    Configuración de Inteligencia Artificial
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="ai-provider">Proveedor de IA</Label>
                      <Select
                        value={aiProvider}
                        onValueChange={(value: AIProvider) =>
                          saveAiConfig(value, value === "openai" ? "gpt-4o" : "deepseek-chat")
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un proveedor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="deepseek">DeepSeek</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ai-model">Modelo de IA</Label>
                      <Select value={aiModel} onValueChange={(value) => saveAiConfig(aiProvider, value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un modelo" />
                        </SelectTrigger>
                        <SelectContent>
                          {aiProvider === "openai" ? (
                            <>
                              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                              <SelectItem value="gpt-4">GPT-4</SelectItem>
                              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="deepseek-chat">DeepSeek Chat</SelectItem>
                              <SelectItem value="deepseek-coder">DeepSeek Coder</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <Label htmlFor="api-key" className="flex items-center justify-between">
                      <span>API Key de {aiProvider === "openai" ? "OpenAI" : "DeepSeek"}</span>
                      {aiProvider === "openai" ? (
                        <a
                          href="https://platform.openai.com/api-keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-purple-400 hover:text-purple-300"
                        >
                          Obtener API Key
                        </a>
                      ) : (
                        <a
                          href="https://platform.deepseek.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-purple-400 hover:text-purple-300"
                        >
                          Obtener API Key
                        </a>
                      )}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="api-key"
                        type="password"
                        placeholder={`Ingresa tu API key de ${aiProvider === "openai" ? "OpenAI" : "DeepSeek"}`}
                        value={aiProvider === "openai" ? openaiApiKey : deepseekApiKey}
                        onChange={(e) => {
                          if (aiProvider === "openai") {
                            setOpenaiApiKey(e.target.value)
                            localStorage.setItem("openai_api_key", e.target.value)
                          } else {
                            setDeepseekApiKey(e.target.value)
                            localStorage.setItem("deepseek_api_key", e.target.value)
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        className="bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30"
                        onClick={async () => {
                          try {
                            // Mostrar notificación de prueba en curso
                            toast({
                              title: "Probando conexión",
                              description: `Conectando con ${aiProvider === "openai" ? "OpenAI" : "DeepSeek"}...`,
                            })

                            // Obtener la API key correcta según el proveedor
                            const apiKey = aiProvider === "openai" ? openaiApiKey : deepseekApiKey

                            if (!apiKey) {
                              throw new Error(
                                `Por favor, ingresa una API key de ${aiProvider === "openai" ? "OpenAI" : "DeepSeek"}`,
                              )
                            }

                            // Probar la conexión
                            const result = await testApiConnection({
                              provider: aiProvider,
                              apiKey: apiKey,
                              model: aiModel,
                            })

                            if (result.success) {
                              toast({
                                title: "Conexión exitosa",
                                description: result.message,
                                variant: "default",
                              })
                            } else {
                              throw new Error(result.message)
                            }
                          } catch (error) {
                            console.error("Error al probar la conexión:", error)
                            toast({
                              title: "Error de conexión",
                              description:
                                error.message ||
                                `No se pudo conectar con ${aiProvider === "openai" ? "OpenAI" : "DeepSeek"}`,
                              variant: "destructive",
                            })
                          }
                        }}
                      >
                        Probar Conexión
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tu API key se almacena localmente en tu navegador y nunca se envía a nuestros servidores.
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          aiProvider === "openai"
                            ? openaiApiKey
                              ? "bg-green-500"
                              : "bg-red-500"
                            : deepseekApiKey
                              ? "bg-green-500"
                              : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-sm">
                        {aiProvider === "openai"
                          ? openaiApiKey
                            ? "OpenAI conectado"
                            : "OpenAI no configurado"
                          : deepseekApiKey
                            ? "DeepSeek conectado"
                            : "DeepSeek no configurado"}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        if (aiProvider === "openai") {
                          setOpenaiApiKey("")
                          localStorage.removeItem("openai_api_key")
                        } else {
                          setDeepseekApiKey("")
                          localStorage.removeItem("deepseek_api_key")
                        }

                        toast({
                          title: "API key eliminada",
                          description: `Se ha eliminado la API key de ${aiProvider === "openai" ? "OpenAI" : "DeepSeek"}`,
                        })
                      }}
                    >
                      Borrar API Key
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <WandSparklesIcon className="h-5 w-5 text-purple-400" />
                    Generador de Prompts de Diseño
                  </CardTitle>
                  <CardDescription>
                    Selecciona tus preferencias para generar un prompt de diseño web personalizado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PromptGenerator onGenerate={handleGeneratePrompt} isGenerating={isGenerating} />
                </CardContent>
                {isGenerating && (
                  <div className="px-6 pb-6">
                    <p className="text-sm text-muted-foreground mb-2">Generando prompt...</p>
                    <Progress value={progress} className="h-2 bg-purple-950" />
                  </div>
                )}
              </GlassCard>
            </TabsContent>

            <TabsContent value="result">
              <GlassCard>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span>Prompt Generado</span>
                      {isOptimized && (
                        <Badge
                          variant="outline"
                          className="ml-2 bg-green-500/10 text-green-200 border-green-500/30 flex items-center gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          Optimizado con DeepSeek
                        </Badge>
                      )}
                    </div>
                    {promptParts.length > 1 && (
                      <Badge variant="outline" className="ml-2 bg-purple-500/10 text-purple-200 border-purple-500/30">
                        Parte {currentPartIndex + 1} de {promptParts.length}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>Usa este prompt para crear tu sección web vanguardista y esotérica</CardDescription>
                  {isOptimizing && (
                    <div className="mt-2">
                      <p className="text-sm text-blue-300 mb-1 flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Optimizando con DeepSeek...
                      </p>
                      <Progress value={optimizationProgress} className="h-1 bg-blue-950" />
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full rounded-md border border-white/10 bg-black/20 p-4 overflow-auto">
                    <div className="h-full w-full overflow-auto">
                      <Textarea
                        value={generatedPrompt}
                        readOnly
                        className="min-h-[360px] w-full font-mono text-sm border-0 resize-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  {promptParts.length > 1 && (
                    <Pagination className="w-full">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => navigateToPart(currentPartIndex - 1)}
                            className={currentPartIndex === 0 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>

                        {promptParts.map((_, index) => (
                          <PaginationItem key={index}>
                            <PaginationLink onClick={() => navigateToPart(index)} isActive={currentPartIndex === index}>
                              {index + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => navigateToPart(currentPartIndex + 1)}
                            className={
                              currentPartIndex === promptParts.length - 1 ? "pointer-events-none opacity-50" : ""
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}

                  <div className="flex justify-end gap-2 w-full">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(generatedPrompt, "El prompt ha sido copiado al portapapeles.")}
                      disabled={!generatedPrompt}
                      className="bg-background/50 hover:bg-background/80 transition-colors"
                    >
                      <CopyIcon className="h-4 w-4 mr-2" />
                      Copiar Parte Actual
                    </Button>
                    <Button
                      variant="outline"
                      onClick={downloadPrompt}
                      disabled={!generatedPrompt}
                      className="bg-background/50 hover:bg-background/80 transition-colors"
                    >
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Descargar Parte
                    </Button>
                    {promptParts.length > 1 && (
                      <Button
                        onClick={downloadAllParts}
                        disabled={!generatedPrompt}
                        className="bg-primary/80 hover:bg-primary transition-colors"
                      >
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Descargar Todo
                      </Button>
                    )}
                  </div>
                </CardFooter>

                <div className="mt-6">
                  <PromptPresets
                    onSelectPreset={(presetPrompt) => {
                      const parts = splitPromptIntoParts(presetPrompt, 2000)
                      setPromptParts(parts)
                      setCurrentPartIndex(0)
                      setGeneratedPrompt(parts[0])

                      toast({
                        title: "Preset aplicado",
                        description: "Se ha cargado el preset de prompt seleccionado.",
                      })
                    }}
                  />
                </div>

                <div className="mt-6">
                  <HeroPresets
                    onSelectPreset={(presetPrompt) => {
                      const parts = splitPromptIntoParts(presetPrompt, 2000)
                      setPromptParts(parts)
                      setCurrentPartIndex(0)
                      setGeneratedPrompt(parts[0])

                      toast({
                        title: "Preset aplicado",
                        description: "Se ha cargado el preset de prompt para Hero seleccionado.",
                      })
                    }}
                  />
                </div>

                <div className="mt-6">
                  <BenefitsPresets
                    onSelectPreset={(presetPrompt) => {
                      const parts = splitPromptIntoParts(presetPrompt, 2000)
                      setPromptParts(parts)
                      setCurrentPartIndex(0)
                      setGeneratedPrompt(parts[0])

                      toast({
                        title: "Preset aplicado",
                        description: "Se ha cargado el preset de prompt para Beneficios seleccionado.",
                      })
                    }}
                  />
                </div>

                <div className="mt-6">
                  <ServicesPresets
                    onSelectPreset={(presetPrompt) => {
                      const parts = splitPromptIntoParts(presetPrompt, 2000)
                      setPromptParts(parts)
                      setCurrentPartIndex(0)
                      setGeneratedPrompt(parts[0])

                      toast({
                        title: "Preset aplicado",
                        description: "Se ha cargado el preset de prompt para Servicios seleccionado.",
                      })
                    }}
                  />
                </div>

                <div className="mt-6">
                  <TestimonialsPresets
                    onSelectPreset={(presetPrompt) => {
                      const parts = splitPromptIntoParts(presetPrompt, 2000)
                      setPromptParts(parts)
                      setCurrentPartIndex(0)
                      setGeneratedPrompt(parts[0])

                      toast({
                        title: "Preset aplicado",
                        description: "Se ha cargado el preset de prompt para Testimonios seleccionado.",
                      })
                    }}
                  />
                </div>
                {/* Find the section in the "result" TabsContent where the other presets are added */}
                {/* Add the following code after the TestimonialsPresets component: */}
                <div className="mt-6">
                  <FaqPresets
                    onSelectPreset={(presetPrompt) => {
                      const parts = splitPromptIntoParts(presetPrompt, 2000)
                      setPromptParts(parts)
                      setCurrentPartIndex(0)
                      setGeneratedPrompt(parts[0])

                      toast({
                        title: "Preset aplicado",
                        description: "Se ha cargado el preset de prompt para FAQs esotéricas.",
                      })
                    }}
                  />
                </div>
                {/* Apartado de optimización con DeepSeek */}
                <div className="mt-8 p-6 rounded-lg border border-blue-500/30 bg-blue-500/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-6 w-6 text-blue-400" />
                    <h3 className="text-xl font-semibold">Optimización avanzada con DeepSeek</h3>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    DeepSeek puede proporcionar una optimización adicional a tu prompt, enfocándose en aspectos técnicos
                    y creativos que pueden mejorar significativamente los resultados. Esta optimización es especialmente
                    útil para:
                  </p>

                  <ul className="list-disc pl-5 mb-4 space-y-1 text-sm text-muted-foreground">
                    <li>Mejorar la claridad y precisión de las instrucciones</li>
                    <li>Añadir detalles técnicos relevantes que podrían haberse omitido</li>
                    <li>Incorporar referencias artísticas y estilísticas específicas</li>
                    <li>Optimizar la estructura para obtener mejores resultados visuales</li>
                  </ul>

                  <div className="flex gap-4 items-center">
                    <Button
                      variant="outline"
                      className="flex-1 h-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border-blue-500/30"
                      onClick={async () => {
                        if (!deepseekApiKey) {
                          toast({
                            title: "API Key no configurada",
                            description: "Por favor, configura tu API Key de DeepSeek en la pestaña 'Generador'",
                            variant: "destructive",
                          })
                          return
                        }

                        if (!generatedPrompt || generatedPrompt.trim() === "") {
                          toast({
                            title: "No hay prompt para optimizar",
                            description: "Primero genera un prompt antes de intentar optimizarlo",
                            variant: "destructive",
                          })
                          return
                        }

                        try {
                          // Iniciar estado de optimización
                          setIsOptimizing(true)
                          setOptimizationProgress(0)
                          setIsOptimized(false)

                          // Simular progreso
                          const progressInterval = setInterval(() => {
                            setOptimizationProgress((prev) => {
                              if (prev >= 90) {
                                clearInterval(progressInterval)
                                return 90
                              }
                              return prev + 10
                            })
                          }, 300)

                          // Mostrar estado de carga
                          toast({
                            title: "Optimizando prompt",
                            description: "DeepSeek está mejorando tu prompt...",
                          })

                          // Obtener el servicio de IA con DeepSeek
                          const aiService = getAIService({
                            provider: "deepseek",
                            apiKey: deepseekApiKey,
                            model: "deepseek-chat",
                            temperature: 0.7,
                          })

                          console.log("Servicio AI obtenido:", aiService) // Depuración

                          // Preparar el prompt para la optimización
                          const systemPrompt = messages[0].content
                          const userPrompt = messages[1].content
                          const optimizationPrompt = `${systemPrompt}\n\nPrompt a optimizar:\n${userPrompt}`

                          // Hacer la solicitud a la API usando el método correcto
                          console.log("Enviando prompt a DeepSeek:", optimizationPrompt) // Depuración
                          const response = await aiService.generateText(optimizationPrompt, 2000)
                          console.log("Respuesta recibida:", response) // Depuración

                          // La respuesta ya es una cadena de texto
                          let optimizedPrompt = response

                          // Verificar que la respuesta no esté vacía
                          if (!optimizedPrompt || optimizedPrompt.trim() === "") {
                            throw new Error("DeepSeek devolvió una respuesta vacía")
                          }

                          // Intentar limpiar la respuesta para extraer solo el prompt optimizado
                          // Eliminar posibles explicaciones o texto adicional al inicio
                          const promptStart = optimizedPrompt.indexOf("```")
                          if (promptStart !== -1) {
                            const promptEnd = optimizedPrompt.lastIndexOf("```")
                            if (promptEnd > promptStart) {
                              optimizedPrompt = optimizedPrompt.substring(promptStart + 3, promptEnd).trim()
                            }
                          }

                          console.log("Prompt optimizado:", optimizedPrompt) // Depuración

                          // Actualizar el prompt generado
                          setGeneratedPrompt(optimizedPrompt)

                          // Actualizar también el array de partes del prompt
                          const updatedParts = splitPromptIntoParts(optimizedPrompt, 2000)
                          setPromptParts(updatedParts)
                          setCurrentPartIndex(0)

                          // Completar el progreso
                          clearInterval(progressInterval)
                          setOptimizationProgress(100)

                          // Breve pausa antes de mostrar como completado
                          setTimeout(() => {
                            setIsOptimizing(false)
                            setIsOptimized(true)

                            // Mostrar mensaje de éxito
                            toast({
                              title: "Prompt optimizado",
                              description: "Tu prompt ha sido mejorado con DeepSeek",
                            })
                          }, 500)
                        } catch (error) {
                          console.error("Error al optimizar el prompt:", error)
                          setIsOptimizing(false)
                          setOptimizationProgress(0)
                          toast({
                            title: "Error al optimizar",
                            description:
                              error.message ||
                              "Ocurrió un error al optimizar el prompt. Revisa la consola para más detalles.",
                            variant: "destructive",
                          })
                        }
                      }}
                      disabled={isOptimizing}
                    >
                      {isOptimizing ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Optimizando...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          Optimizar con DeepSeek
                        </>
                      )}
                    </Button>

                    <div className="text-sm text-muted-foreground">
                      {deepseekApiKey ? (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span>DeepSeek configurado</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <span>DeepSeek no configurado</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Añadir el componente de historial */}
                <div className="mt-8">
                  <PromptHistory
                    history={promptHistory}
                    onLoadPrompt={loadPromptFromHistory}
                    onRemovePrompt={removePromptFromHistory}
                  />
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="recycler">
              <GlassCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RecycleIcon className="h-5 w-5 text-purple-400" />
                    Generador de Prompts para Reciclaje de Código
                  </CardTitle>
                  <CardDescription>
                    Genera prompts detallados para reciclar y mejorar componentes existentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeRecycler onRecycle={handleRecycleCode} isProcessing={isRecycling} />
                </CardContent>
                {recyclerPrompt && (
                  <CardFooter className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(recyclerPrompt, "El prompt de reciclaje ha sido copiado al portapapeles.")
                      }
                      disabled={!recyclerPrompt}
                      className="bg-background/50 hover:bg-background/80 transition-colors"
                    >
                      <CopyIcon className="h-4 w-4 mr-2" />
                      Copiar Prompt
                    </Button>
                    <Button
                      variant="outline"
                      onClick={downloadRecyclerPrompt}
                      disabled={!recyclerPrompt}
                      className="bg-background/50 hover:bg-background/80 transition-colors"
                    >
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Descargar Prompt
                    </Button>
                  </CardFooter>
                )}
              </GlassCard>
            </TabsContent>
            <TabsContent value="image-generator">
              <GlassCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-purple-400" />
                    Generador de Imágenes Esotéricas con IA
                  </CardTitle>
                  <CardDescription>
                    Crea imágenes esotéricas impactantes con inteligencia artificial avanzada
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageGenerator />
                </CardContent>
              </GlassCard>
            </TabsContent>

            <TabsContent value="landing-text">
              <GlassCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-5 w-5 text-purple-400" />
                    Generador de Prompts para Textos de Landing Pages Esotéricas
                  </CardTitle>
                  <CardDescription>
                    Crea prompts para generar textos persuasivos y de alto impacto para servicios esotéricos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EsotericLandingTextGenerator
                    onGenerate={handleGenerateEsotericLandingText}
                    isGenerating={isGenerating}
                  />
                </CardContent>
                {isGenerating && (
                  <div className="px-6 pb-6">
                    <p className="text-sm text-muted-foreground mb-2">Generando prompt...</p>
                    <Progress value={progress} className="h-2 bg-purple-950" />
                  </div>
                )}
              </GlassCard>
            </TabsContent>

            <TabsContent value="parser">
              <GlassCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-purple-400" />
                    Parseador HTML para Blogger
                  </CardTitle>
                  <CardDescription>Convierte tu código HTML a un formato compatible con Blogger</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="input-code">Código HTML</Label>
                    <Textarea
                      id="input-code"
                      className="min-h-[100px] w-full font-mono text-sm resize-none bg-black/20 border-white/10"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                    />
                  </div>
                  <div>
                    <Button
                      onClick={parseHtmlForBlogger}
                      disabled={!inputCode}
                      className="bg-primary/80 hover:bg-primary transition-colors"
                    >
                      Parsear Código
                    </Button>
                  </div>
                  {parsedCode && (
                    <div>
                      <Label htmlFor="parsed-code">Código Parseado</Label>
                      <Textarea
                        id="parsed-code"
                        className="min-h-[100px] w-full font-mono text-sm resize-none bg-black/20 border-white/10"
                        value={parsedCode}
                        readOnly
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(parsedCode, "El código parseado ha sido copiado al portapapeles.")}
                    disabled={!parsedCode}
                    className="bg-background/50 hover:bg-background/80 transition-colors"
                  >
                    Copiar Código Parseado
                  </Button>
                </CardFooter>
              </GlassCard>
            </TabsContent>

            <TabsContent value="css-optimizer">
              <GlassCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileTypeIcon className="h-5 w-5 text-purple-400" />
                    Optimizador y Compresor de CSS Avanzado
                  </CardTitle>
                  <CardDescription>
                    Optimiza y comprime tu CSS para mejorar el rendimiento y reducir el tamaño
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CssOptimizer />
                </CardContent>
              </GlassCard>
            </TabsContent>

            <TabsContent value="preview">
              <GlassCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-purple-400" />
                    Vista Previa de Código
                  </CardTitle>
                  <CardDescription>Visualiza HTML, CSS y JavaScript en tiempo real</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodePreview />
                </CardContent>
              </GlassCard>
            </TabsContent>

            <TabsContent value="vault">
              <GlassCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArchiveIcon className="h-5 w-5 text-purple-400" />
                    Baúl de Diseños
                  </CardTitle>
                  <CardDescription>Guarda, organiza y reutiliza tus diseños favoritos por categorías</CardDescription>
                </CardHeader>
                <CardContent>
                  <DesignVault />
                </CardContent>
              </GlassCard>
            </TabsContent>

            <TabsContent value="templates">
              <GlassCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LayoutTemplate className="h-5 w-5 text-purple-400" />
                    Gestor de Templates
                  </CardTitle>
                  <CardDescription>
                    Administra tus templates de Blogger y HTML con todas sus características
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TemplatesManager />
                </CardContent>
              </GlassCard>
            </TabsContent>

            <TabsContent value="blogspot">
              <GlassCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileHtml className="h-5 w-5 text-purple-400" />
                    Blogspot Studio
                  </CardTitle>
                  <CardDescription>Editor avanzado para crear y editar templates de Blogger</CardDescription>
                </CardHeader>
                <CardContent>
                  <BlogspotStudio />
                </CardContent>
              </GlassCard>
            </TabsContent>

            <TabsContent value="neurotransmitter">
              <GlassCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-400" />
                    Generador de Prompts para Neurotransmisores
                  </CardTitle>
                  <CardDescription>
                    Crea prompts de diseño web que estimulen neurotransmisores específicos para aumentar el engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NeurotransmitterPromptGenerator onGenerate={handleGeneratePrompt} isGenerating={isGenerating} />
                </CardContent>
                {isGenerating && (
                  <div className="px-6 pb-6">
                    <p className="text-sm text-muted-foreground mb-2">Generando prompt...</p>
                    <Progress value={progress} className="h-2 bg-purple-950" />
                  </div>
                )}
              </GlassCard>
            </TabsContent>

            <TabsContent value="conversion-texts">
              <GlassCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    Generador de Textos para Conversiones
                  </CardTitle>
                  <CardDescription>
                    Crea textos persuasivos optimizados para maximizar conversiones usando IA avanzada
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ConversionTextGenerator />
                </CardContent>
              </GlassCard>
            </TabsContent>
            {/* Añadir un nuevo TabsContent para el compresor de imágenes */}
            {/* Buscar donde están definidos los otros TabsContent y añadir: */}
            <TabsContent value="image-compressor">
              <GlassCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-purple-400" />
                    Compresor de Imágenes Avanzado
                  </CardTitle>
                  <CardDescription>
                    Comprime, optimiza y personaliza tus imágenes con opciones avanzadas y filtros esotéricos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageCompressor />
                </CardContent>
              </GlassCard>
            </TabsContent>
            <TabsContent value="pinterest-extractor">
              <GlassCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLinkIcon className="h-5 w-5 text-purple-400" />
                    Extractor de URLs de Pinterest
                  </CardTitle>
                  <CardDescription>Extrae URLs directas de imágenes y videos desde pins de Pinterest</CardDescription>
                </CardHeader>
                <CardContent>
                  <PinterestExtractor />
                </CardContent>
              </GlassCard>
            </TabsContent>
            {/* Añadir el TabsContent para la pestaña "Keys" */}
            <TabsContent value="keys">
              <GlassCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <KeyRound className="h-5 w-5 text-purple-400" />
                    Gestor de Keywords para Google Ads Esotéricas
                  </CardTitle>
                  <CardDescription>
                    Importa, organiza, categoriza y analiza palabras clave para tus campañas esotéricas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <KeywordManager />
                </CardContent>
              </GlassCard>
            </TabsContent>
            {/* Add the new tab content in the conditional rendering section */}
            {activeTab === "keyword-cluster" && <KeywordClusterGenerator />}
            {/* Buscar la sección donde se definen los TabsContent */}
            {/* Añadir un nuevo TabsContent para la pestaña "history" después del TabsContent para "keys" */}

            <TabsContent value="history">
              <GlassCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HistoryIcon className="h-5 w-5 text-purple-400" />
                    Historial de Prompts Generados
                  </CardTitle>
                  <CardDescription>
                    Accede, visualiza y reutiliza todos tus prompts generados anteriormente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PromptHistory
                    history={promptHistory}
                    onLoadPrompt={loadPromptFromHistory}
                    onRemovePrompt={removePromptFromHistory}
                  />
                </CardContent>
              </GlassCard>
            </TabsContent>
            {/* Añadir un nuevo TabsContent para la pestaña "google-ads" */}
            <TabsContent value="google-ads">
              <GlassCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-purple-400" />
                    Generador de Anuncios para Google Ads
                  </CardTitle>
                  <CardDescription>Genera anuncios persuasivos para Google Ads con IA</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="anuncios" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="anuncios">Generador de Anuncios</TabsTrigger>
                      <TabsTrigger value="estructura">Estructura de Campañas</TabsTrigger>
                      <TabsTrigger value="agrupador">Agrupador de Keywords</TabsTrigger>
                      <TabsTrigger value="landing-analysis">Análisis de Landing</TabsTrigger>
                    </TabsList>
                    <TabsContent value="anuncios">
                      <GoogleAdsGenerator />
                    </TabsContent>
                    <TabsContent value="estructura">
                      <div className="space-y-6">
                        <div className="p-4 border border-purple-500/20 rounded-lg bg-black/20">
                          <h3 className="text-lg font-medium mb-2">Estructura de Campañas con IA</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Ingresa tus palabras clave (una por línea) y la IA generará una estructura de campañas
                            optimizada para Google Ads.
                          </p>
                          <CampaignStructureGenerator />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="agrupador">
                      <div className="space-y-6">
                        <div className="p-4 border border-purple-500/20 rounded-lg bg-black/20">
                          <h3 className="text-lg font-medium mb-2">Agrupador Inteligente de Keywords para Anuncios</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Ingresa tus palabras clave y la IA las agrupará en conjuntos temáticos optimizados para
                            maximizar la relevancia y el rendimiento en Google Ads.
                          </p>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="keywords-input">Palabras clave (una por línea)</Label>
                              <Textarea
                                id="keywords-input"
                                placeholder="tarot amor online
limpieza energética hogar
lectura de tarot amor urgente
cursos de astrología online
limpieza energética contra malas vibraciones
..."
                                className="min-h-[150px]"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="max-groups">Número máximo de grupos</Label>
                                <Input id="max-groups" type="number" min={2} max={10} defaultValue={5} />
                                <p className="text-xs text-muted-foreground">
                                  Recomendado: 3-7 grupos para mejor organización
                                </p>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="keywords-per-group">Palabras clave por grupo</Label>
                                <Input id="keywords-per-group" type="number" min={5} max={20} defaultValue={10} />
                                <p className="text-xs text-muted-foreground">
                                  Recomendado: 5-20 palabras clave por grupo
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Estrategia de concordancia</Label>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="exact-match" defaultChecked />
                                  <Label htmlFor="exact-match" className="text-sm">
                                    Exacta [ ]
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="phrase-match" defaultChecked />
                                  <Label htmlFor="phrase-match" className="text-sm">
                                    Frase " "
                                  </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Checkbox id="broad-match" />
                                  <Label htmlFor="broad-match" className="text-sm">
                                    Amplia
                                  </Label>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2 mt-4">
                              <Label>Intención de búsqueda</Label>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="commercial-intent" defaultChecked />
                                  <Label htmlFor="commercial-intent" className="text-sm">
                                    Comercial
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="transactional-intent" />
                                  <Label htmlFor="transactional-intent" className="text-sm">
                                    Transaccional
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id="lead-intent" />
                                  <Label htmlFor="lead-intent" className="text-sm">
                                    Generador de leads
                                  </Label>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2 mt-4">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="remove-duplicates" defaultChecked />
                                <Label htmlFor="remove-duplicates" className="text-sm">
                                  Eliminar palabras clave duplicadas o similares
                                </Label>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Elimina palabras clave con significado similar y mantiene solo la más representativa
                              </p>
                            </div>

                            <div className="flex justify-end">
                              <Button
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                                onClick={generateKeywordGroups}
                                disabled={progress > 0}
                              >
                                {progress > 0 ? (
                                  <>
                                    <svg
                                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    Generando... {progress}%
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Generar Grupos Optimizados con IA
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {keywordGroups.length > 0 && (
                          <div className="mt-6 space-y-4">
                            <h3 className="text-lg font-medium">Grupos de Anuncios Optimizados</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {keywordGroups.map((group, index) => (
                                <Card key={index} className="bg-black/30 border-purple-500/20">
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-md flex items-center">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mr-2 text-purple-400"
                                      >
                                        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
                                      </svg>
                                      {group.name}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-2">
                                      {group.keywords.map((keyword, kidx) => {
                                        // Aplicar formato de concordancia directamente a la palabra clave
                                        let formattedKeyword = keyword

                                        // Verificar qué checkboxes están marcados
                                        const exactMatch = document.getElementById("exact-match") as HTMLInputElement
                                        const phraseMatch = document.getElementById("phrase-match") as HTMLInputElement
                                        const broadMatch = document.getElementById("broad-match") as HTMLInputElement

                                        // Determinar qué tipos de concordancia están habilitados
                                        const enabledTypes = []
                                        if (exactMatch?.checked) enabledTypes.push("exact")
                                        if (phraseMatch?.checked) enabledTypes.push("phrase")
                                        if (broadMatch?.checked) enabledTypes.push("broad")

                                        // Si no hay tipos habilitados, usar todos por defecto
                                        const types =
                                          enabledTypes.length > 0 ? enabledTypes : ["exact", "phrase", "broad"]

                                        // Asignar tipo de concordancia basado en el índice y los tipos habilitados
                                        const concordanceType = types[kidx % types.length]

                                        // Aplicar formato según el tipo de concordancia
                                        if (concordanceType === "exact") {
                                          // Concordancia exacta
                                          formattedKeyword = `[${keyword}]`
                                        } else if (concordanceType === "phrase") {
                                          // Concordancia de frase
                                          formattedKeyword = `"${keyword}"`
                                        }
                                        // Para concordancia amplia, dejamos la palabra clave sin modificar

                                        return (
                                          <div key={kidx} className="flex items-center justify-between">
                                            <span className="text-sm">{formattedKeyword}</span>
                                            <Badge
                                              variant="outline"
                                              className="text-xs bg-purple-500/10 border-purple-500/30"
                                            >
                                              {concordanceType === "exact"
                                                ? "Exacta"
                                                : concordanceType === "phrase"
                                                  ? "Frase"
                                                  : "Amplia"}
                                            </Badge>
                                          </div>
                                        )
                                      })}
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-purple-500/20">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-xs bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30"
                                        onClick={() => {
                                          // Verificar qué checkboxes están marcados
                                          const exactMatch = document.getElementById("exact-match") as HTMLInputElement
                                          const phraseMatch = document.getElementById(
                                            "phrase-match",
                                          ) as HTMLInputElement
                                          const broadMatch = document.getElementById("broad-match") as HTMLInputElement

                                          // Determinar qué tipos de concordancia están habilitados
                                          const enabledTypes = []
                                          if (exactMatch?.checked) enabledTypes.push("exact")
                                          if (phraseMatch?.checked) enabledTypes.push("phrase")
                                          if (broadMatch?.checked) enabledTypes.push("broad")

                                          // Si no hay tipos habilitados, usar todos por defecto
                                          const types =
                                            enabledTypes.length > 0 ? enabledTypes : ["exact", "phrase", "broad"]

                                          // Crear un string con todas las palabras clave formateadas, una por línea
                                          const keywordsText = group.keywords
                                            .map((keyword, idx) => {
                                              const concordanceType = types[idx % types.length]

                                              if (concordanceType === "exact") {
                                                return `[${keyword}]`
                                              } else if (concordanceType === "phrase") {
                                                return `"${keyword}"`
                                              } else {
                                                // Concordancia amplia sin modificar
                                                return keyword
                                              }
                                            })
                                            .join("\n")

                                          // Copiar al portapapeles
                                          navigator.clipboard.writeText(keywordsText)

                                          // Mostrar notificación
                                          toast({
                                            title: "Palabras clave copiadas",
                                            description: `Se han copiado ${group.keywords.length} palabras clave del grupo "${group.name}"`,
                                          })
                                        }}
                                      >
                                        <CopyIcon className="h-3.5 w-3.5 mr-1.5" />
                                        Copiar palabras clave
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="landing-analysis">
                      <div className="space-y-6">
                        <div className="p-4 border border-purple-500/20 rounded-lg bg-black/20">
                          <Tabs defaultValue="content-analysis" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                              <TabsTrigger value="content-analysis">Análisis de Contenido</TabsTrigger>
                              <TabsTrigger value="performance-analysis">Análisis de Rendimiento</TabsTrigger>
                              <TabsTrigger value="competitor-analysis">Análisis Competitivo</TabsTrigger>
                              <TabsTrigger value="historical-tracking">Seguimiento Histórico</TabsTrigger>
                            </TabsList>

                            <TabsContent value="content-analysis">
                              <div className="p-4 border border-purple-500/20 rounded-lg bg-black/20 mt-4">
                                <LandingPageAnalyzer />
                              </div>
                            </TabsContent>

                            <TabsContent value="performance-analysis">
                              <div className="p-4 border border-purple-500/20 rounded-lg bg-black/20 mt-4">
                                <Card className="w-full">
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-purple-400"
                                      >
                                        <path d="m22 12-4 4-1.3-1.3"></path>
                                        <path d="m22 18-4 4-1.3-1.3"></path>
                                        <path d="m6 12 4 4 8-8"></path>
                                        <path d="m6 6 4 4 8-8"></path>
                                      </svg>
                                      Análisis de Rendimiento Web
                                    </CardTitle>
                                    <CardDescription>
                                      Análisis completo de velocidad, rendimiento y experiencia de usuario de tu landing
                                      page
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="flex justify-center items-center p-8">
                                      <div className="text-center">
                                        <p className="text-muted-foreground mb-4">
                                          Esta función estará disponible próximamente
                                        </p>
                                        <Button
                                          variant="outline"
                                          className="bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30"
                                        >
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
                                            <path d="M12 2v4"></path>
                                            <path d="M12 18v4"></path>
                                            <path d="M4.93 4.93l2.83 2.83"></path>
                                            <path d="M16.24 16.24l2.83 2.83"></path>
                                            <path d="M2 12h4"></path>
                                            <path d="M18 12h4"></path>
                                            <path d="M4.93 19.07l2.83-2.83"></path>
                                            <path d="M16.24 7.76l2.83-2.83"></path>
                                          </svg>
                                          Activar Análisis Competitivo
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </TabsContent>

                            <TabsContent value="historical-tracking">
                              <div className="p-4 border border-purple-500/20 rounded-lg bg-black/20 mt-4">
                                <Card className="w-full">
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-purple-400"
                                      >
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                      </svg>
                                      Seguimiento Histórico
                                    </CardTitle>
                                    <CardDescription>
                                      Monitorea el progreso de tus mejoras a lo largo del tiempo
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="flex justify-center items-center p-8">
                                      <div className="text-center">
                                        <p className="text-muted-foreground mb-4">
                                          Esta función estará disponible próximamente
                                        </p>
                                        <Button
                                          variant="outline"
                                          className="bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30"
                                        >
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
                                            <path d="M12 2v4"></path>
                                            <path d="M12 18v4"></path>
                                            <path d="M4.93 4.93l2.83 2.83"></path>
                                            <path d="M16.24 16.24l2.83 2.83"></path>
                                            <path d="M2 12h4"></path>
                                            <path d="M18 12h4"></path>
                                            <path d="M4.93 19.07l2.83-2.83"></path>
                                            <path d="M16.24 7.76l2.83-2.83"></path>
                                          </svg>
                                          Activar Seguimiento Histórico
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>

                        <div className="p-4 border border-purple-500/20 rounded-lg bg-black/20">
                          <h3 className="text-lg font-medium mb-4">Suite Profesional de Análisis SEO</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-md flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mr-2 text-purple-400"
                                  >
                                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                                    <path d="M5 3v4"></path>
                                    <path d="M19 17v4"></path>
                                    <path d="M3 5h4"></path>
                                    <path d="M17 19h4"></path>
                                  </svg>
                                  Análisis Esotérico
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground">
                                  Análisis especializado para nichos esotéricos y místicos
                                </p>
                                <ul className="text-xs mt-2 space-y-1 text-muted-foreground">
                                  <li className="flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1 text-green-400"
                                    >
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Análisis de términos esotéricos
                                  </li>
                                  <li className="flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1 text-green-400"
                                    >
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Optimización para búsquedas místicas
                                  </li>
                                  <li className="flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1 text-green-400"
                                    >
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Recomendaciones para conversión
                                  </li>
                                </ul>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-md flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mr-2 text-purple-400"
                                  >
                                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                                    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                                    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                                  </svg>
                                  Integración con APIs
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground">
                                  Conecta con herramientas profesionales de SEO
                                </p>
                                <ul className="text-xs mt-2 space-y-1 text-muted-foreground">
                                  <li className="flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1 text-green-400"
                                    >
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Google Search Console
                                  </li>
                                  <li className="flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1 text-green-400"
                                    >
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Google Analytics
                                  </li>
                                  <li className="flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1 text-green-400"
                                    >
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Ahrefs / SEMrush
                                  </li>
                                </ul>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-md flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mr-2 text-purple-400"
                                  >
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                  </svg>
                                  Informes Avanzados
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground">
                                  Exporta informes detallados en múltiples formatos
                                </p>
                                <ul className="text-xs mt-2 space-y-1 text-muted-foreground">
                                  <li className="flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1 text-green-400"
                                    >
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    PDF con diseño profesional
                                  </li>
                                  <li className="flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1 text-green-400"
                                    >
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Excel para análisis detallado
                                  </li>
                                  <li className="flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1 text-green-400"
                                    >
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Presentaciones para clientes
                                  </li>
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

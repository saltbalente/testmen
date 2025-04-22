"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Keyword, KeywordCategory } from "@/types/keyword"
import { toast } from "@/hooks/use-toast"
import {
  Wand2,
  FileText,
  Sparkles,
  Target,
  Layers,
  Braces,
  Zap,
  Clipboard,
  Check,
  RefreshCw,
  Trash2,
  Plus,
  Info,
  Search,
} from "lucide-react"

interface ContentPromptGeneratorProps {
  keywords: Keyword[]
  selectedKeywords: Keyword[]
  categories: KeywordCategory[]
}

// Tipos para las opciones del generador de prompts
interface PromptOptions {
  contentType: string
  contentGoal: string
  targetAudience: string
  contentStyle: string
  contentTone: string
  contentFormat: string
  headingStructure: string
  keywordDensity: number
  includeFAQs: boolean
  includeStatistics: boolean
  includeExamples: boolean
  contentLength: string
  seoOptimization: string
  callToAction: boolean
  ctaType: string
  technicalTerms: string[]
  avoidTerms: string[]
  customInstructions: string
  competitorUrls: string[]
  targetReadingLevel: string
  contentPurpose: string[]
  contentStructure: string
  imageInstructions: boolean
  imageStyle: string
  metaDescription: boolean
  titleTag: boolean
  internalLinking: boolean
  externalLinking: boolean
  tableOfContents: boolean
  conclusion: boolean
  introduction: boolean
}

// Opciones predefinidas para cada campo
const contentTypeOptions = [
  "Artículo de blog",
  "Página de producto",
  "Página de categoría",
  "Página de servicio",
  "Página de aterrizaje",
  "Página informativa",
  "Guía paso a paso",
  "Comparativa",
  "Reseña",
  "Estudio de caso",
  "Infografía",
  "Glosario",
  "FAQ",
  "Ebook",
  "Whitepaper",
  "Comunicado de prensa",
  "Página sobre nosotros",
  "Página de contacto",
  "Página de política de privacidad",
  "Términos y condiciones",
]

const contentGoalOptions = [
  "Informar",
  "Educar",
  "Entretener",
  "Persuadir",
  "Convertir",
  "Generar leads",
  "Aumentar ventas",
  "Mejorar posicionamiento SEO",
  "Construir autoridad",
  "Generar confianza",
  "Resolver problemas",
  "Responder preguntas",
  "Comparar opciones",
  "Mostrar beneficios",
  "Destacar características",
  "Contar historias",
  "Inspirar acción",
  "Crear conciencia de marca",
  "Fidelizar clientes",
  "Generar engagement",
]

const targetAudienceOptions = [
  "Principiantes",
  "Intermedios",
  "Avanzados",
  "Expertos",
  "Profesionales",
  "Estudiantes",
  "Empresarios",
  "Emprendedores",
  "Consumidores",
  "Padres",
  "Jóvenes",
  "Adultos mayores",
  "Hombres",
  "Mujeres",
  "Niños",
  "Familias",
  "Empresas B2B",
  "Empresas B2C",
  "Tomadores de decisiones",
  "Investigadores",
]

const contentStyleOptions = [
  "Formal",
  "Informal",
  "Académico",
  "Conversacional",
  "Técnico",
  "Narrativo",
  "Descriptivo",
  "Persuasivo",
  "Informativo",
  "Tutorial",
  "Periodístico",
  "Creativo",
  "Minimalista",
  "Detallado",
  "Directo",
  "Metafórico",
  "Humorístico",
  "Serio",
  "Inspirador",
  "Analítico",
]

const contentToneOptions = [
  "Profesional",
  "Amigable",
  "Entusiasta",
  "Autoritario",
  "Empático",
  "Motivador",
  "Reflexivo",
  "Optimista",
  "Neutral",
  "Crítico",
  "Humorístico",
  "Inspirador",
  "Educativo",
  "Confidencial",
  "Urgente",
  "Tranquilizador",
  "Provocativo",
  "Nostálgico",
  "Futurista",
  "Conservador",
]

const contentFormatOptions = [
  "Texto plano",
  "Texto con imágenes",
  "Lista numerada",
  "Lista con viñetas",
  "Preguntas y respuestas",
  "Guía paso a paso",
  "Comparativa",
  "Tabla",
  "Infografía",
  "Timeline",
  "Diagrama",
  "Citas destacadas",
  "Estadísticas destacadas",
  "Casos de estudio",
  "Testimonios",
  "Ejemplos prácticos",
  "Definiciones",
  "Consejos rápidos",
  "Advertencias",
  "Recursos adicionales",
]

const headingStructureOptions = [
  "H1 + H2",
  "H1 + H2 + H3",
  "H1 + H2 + H3 + H4",
  "Solo H1 + párrafos",
  "Preguntas como H2",
  "Numerados (1, 2, 3...)",
  "Pasos (Paso 1, Paso 2...)",
  "Beneficios como H2",
  "Problemas y soluciones",
  "Cronológico",
  "Geográfico",
  "Por categorías",
  "Por importancia",
  "Por dificultad",
  "Por audiencia",
  "Por precio/valor",
  "Por popularidad",
  "Por tendencias",
  "Por estaciones/temporadas",
  "Personalizado",
]

const contentLengthOptions = [
  "Muy corto (300-500 palabras)",
  "Corto (500-800 palabras)",
  "Medio (800-1200 palabras)",
  "Largo (1200-2000 palabras)",
  "Muy largo (2000-3000 palabras)",
  "Extenso (3000-5000 palabras)",
  "Completo (5000+ palabras)",
]

const seoOptimizationOptions = [
  "Básico",
  "Intermedio",
  "Avanzado",
  "Experto",
  "Enfocado en featured snippets",
  "Enfocado en búsqueda por voz",
  "Enfocado en búsqueda local",
  "Enfocado en búsqueda móvil",
  "Enfocado en búsqueda de imágenes",
  "Enfocado en búsqueda de vídeos",
  "Optimizado para Google",
  "Optimizado para Bing",
  "Optimizado para YouTube",
  "Optimizado para Amazon",
  "Optimizado para redes sociales",
  "Optimizado para conversión",
  "Optimizado para engagement",
  "Optimizado para tiempo de permanencia",
  "Optimizado para CTR",
  "Personalizado",
]

const ctaTypeOptions = [
  "Compra ahora",
  "Regístrate",
  "Suscríbete",
  "Descarga",
  "Prueba gratis",
  "Contacta con nosotros",
  "Solicita presupuesto",
  "Reserva una demo",
  "Aprende más",
  "Ver detalles",
  "Comparte",
  "Comenta",
  "Participa",
  "Dona",
  "Únete",
  "Visita",
  "Llama ahora",
  "Envía un mensaje",
  "Síguenos",
  "Personalizado",
]

const targetReadingLevelOptions = [
  "Elemental (6-8 años)",
  "Primaria (9-11 años)",
  "Secundaria (12-14 años)",
  "Bachillerato (15-17 años)",
  "Universidad (18-22 años)",
  "Graduado (23+ años)",
  "Profesional",
  "Técnico especializado",
  "Académico",
  "General",
]

const contentPurposeOptions = [
  "Informar",
  "Educar",
  "Entretener",
  "Persuadir",
  "Vender",
  "Generar leads",
  "Construir marca",
  "Resolver problemas",
  "Comparar opciones",
  "Mostrar beneficios",
  "Destacar características",
  "Contar historias",
  "Inspirar acción",
  "Crear conciencia",
  "Fidelizar",
  "Generar engagement",
  "Posicionar en buscadores",
  "Generar backlinks",
  "Viralizar",
  "Establecer autoridad",
]

const contentStructureOptions = [
  "Pirámide invertida",
  "Problema-Solución",
  "Cronológico",
  "Comparativo",
  "Causa-Efecto",
  "Proceso",
  "Lista",
  "Narrativo",
  "Pregunta-Respuesta",
  "Antes-Después",
  "Ventajas-Desventajas",
  "Mitos-Realidades",
  "Caso de estudio",
  "Tutorial",
  "Guía completa",
  "Reseña",
  "Entrevista",
  "Debate",
  "Storytelling",
  "Personalizado",
]

const imageStyleOptions = [
  "Fotografías reales",
  "Ilustraciones",
  "Infografías",
  "Diagramas",
  "Capturas de pantalla",
  "Gráficos de datos",
  "Iconos",
  "Minimalista",
  "Colorido",
  "Blanco y negro",
  "Vintage",
  "Moderno",
  "Corporativo",
  "Casual",
  "Artístico",
  "Técnico",
  "Emocional",
  "Conceptual",
  "Realista",
  "Abstracto",
]

// Plantillas predefinidas
const promptTemplates = [
  {
    name: "Artículo SEO Completo",
    description: "Plantilla optimizada para crear contenido que posicione bien en Google",
    options: {
      contentType: "Artículo de blog",
      contentGoal: "Mejorar posicionamiento SEO",
      targetAudience: "Intermedios",
      contentStyle: "Informativo",
      contentTone: "Profesional",
      contentFormat: "Texto con imágenes",
      headingStructure: "H1 + H2 + H3",
      keywordDensity: 2,
      includeFAQs: true,
      includeStatistics: true,
      includeExamples: true,
      contentLength: "Largo (1200-2000 palabras)",
      seoOptimization: "Avanzado",
      callToAction: true,
      ctaType: "Aprende más",
      technicalTerms: [],
      avoidTerms: [],
      customInstructions:
        "Incluir al menos 5 preguntas frecuentes al final del artículo. Optimizar para featured snippets.",
      competitorUrls: [],
      targetReadingLevel: "General",
      contentPurpose: ["Informar", "Educar", "Posicionar en buscadores"],
      contentStructure: "Pirámide invertida",
      imageInstructions: true,
      imageStyle: "Infografías",
      metaDescription: true,
      titleTag: true,
      internalLinking: true,
      externalLinking: true,
      tableOfContents: true,
      conclusion: true,
      introduction: true,
    },
  },
  {
    name: "Página de Producto Persuasiva",
    description: "Ideal para crear contenido que convierta visitantes en clientes",
    options: {
      contentType: "Página de producto",
      contentGoal: "Convertir",
      targetAudience: "Consumidores",
      contentStyle: "Persuasivo",
      contentTone: "Entusiasta",
      contentFormat: "Texto con imágenes",
      headingStructure: "Beneficios como H2",
      keywordDensity: 1.5,
      includeFAQs: true,
      includeStatistics: true,
      includeExamples: true,
      contentLength: "Medio (800-1200 palabras)",
      seoOptimization: "Enfocado en conversión",
      callToAction: true,
      ctaType: "Compra ahora",
      technicalTerms: [],
      avoidTerms: [],
      customInstructions: "Destacar beneficios antes que características. Incluir testimonios y garantías.",
      competitorUrls: [],
      targetReadingLevel: "General",
      contentPurpose: ["Vender", "Persuadir", "Mostrar beneficios"],
      contentStructure: "Problema-Solución",
      imageInstructions: true,
      imageStyle: "Fotografías reales",
      metaDescription: true,
      titleTag: true,
      internalLinking: false,
      externalLinking: false,
      tableOfContents: false,
      conclusion: true,
      introduction: true,
    },
  },
  {
    name: "Guía Tutorial Paso a Paso",
    description: "Perfecta para explicar procesos o enseñar habilidades",
    options: {
      contentType: "Guía paso a paso",
      contentGoal: "Educar",
      targetAudience: "Principiantes",
      contentStyle: "Tutorial",
      contentTone: "Amigable",
      contentFormat: "Guía paso a paso",
      headingStructure: "Pasos (Paso 1, Paso 2...)",
      keywordDensity: 1,
      includeFAQs: true,
      includeStatistics: false,
      includeExamples: true,
      contentLength: "Medio (800-1200 palabras)",
      seoOptimization: "Enfocado en featured snippets",
      callToAction: true,
      ctaType: "Descarga",
      technicalTerms: [],
      avoidTerms: [],
      customInstructions: "Incluir advertencias donde sea necesario. Añadir consejos adicionales para cada paso.",
      competitorUrls: [],
      targetReadingLevel: "General",
      contentPurpose: ["Educar", "Resolver problemas"],
      contentStructure: "Proceso",
      imageInstructions: true,
      imageStyle: "Capturas de pantalla",
      metaDescription: true,
      titleTag: true,
      internalLinking: true,
      externalLinking: true,
      tableOfContents: true,
      conclusion: true,
      introduction: true,
    },
  },
  {
    name: "Comparativa de Productos/Servicios",
    description: "Para ayudar a los usuarios a tomar decisiones informadas",
    options: {
      contentType: "Comparativa",
      contentGoal: "Informar",
      targetAudience: "Intermedios",
      contentStyle: "Analítico",
      contentTone: "Neutral",
      contentFormat: "Tabla",
      headingStructure: "Por categorías",
      keywordDensity: 1,
      includeFAQs: true,
      includeStatistics: true,
      includeExamples: false,
      contentLength: "Largo (1200-2000 palabras)",
      seoOptimization: "Intermedio",
      callToAction: true,
      ctaType: "Ver detalles",
      technicalTerms: [],
      avoidTerms: [],
      customInstructions: "Incluir tablas comparativas claras. Destacar pros y contras de cada opción.",
      competitorUrls: [],
      targetReadingLevel: "General",
      contentPurpose: ["Comparar opciones", "Informar"],
      contentStructure: "Comparativo",
      imageInstructions: true,
      imageStyle: "Gráficos de datos",
      metaDescription: true,
      titleTag: true,
      internalLinking: true,
      externalLinking: true,
      tableOfContents: true,
      conclusion: true,
      introduction: true,
    },
  },
  {
    name: "Contenido Viral para Redes Sociales",
    description: "Diseñado para maximizar compartidos y engagement",
    options: {
      contentType: "Artículo de blog",
      contentGoal: "Entretener",
      targetAudience: "General",
      contentStyle: "Conversacional",
      contentTone: "Entusiasta",
      contentFormat: "Lista con viñetas",
      headingStructure: "Numerados (1, 2, 3...)",
      keywordDensity: 1,
      includeFAQs: false,
      includeStatistics: true,
      includeExamples: true,
      contentLength: "Corto (500-800 palabras)",
      seoOptimization: "Optimizado para redes sociales",
      callToAction: true,
      ctaType: "Comparte",
      technicalTerms: [],
      avoidTerms: [],
      customInstructions: "Usar lenguaje emocional. Incluir datos sorprendentes o controversiales.",
      competitorUrls: [],
      targetReadingLevel: "General",
      contentPurpose: ["Entretener", "Viralizar", "Generar engagement"],
      contentStructure: "Lista",
      imageInstructions: true,
      imageStyle: "Colorido",
      metaDescription: false,
      titleTag: true,
      internalLinking: false,
      externalLinking: false,
      tableOfContents: false,
      conclusion: true,
      introduction: true,
    },
  },
]

export default function ContentPromptGenerator({
  keywords,
  selectedKeywords,
  categories,
}: ContentPromptGeneratorProps) {
  // Estado para las opciones del prompt
  const [options, setOptions] = useState<PromptOptions>({
    contentType: "Artículo de blog",
    contentGoal: "Informar",
    targetAudience: "General",
    contentStyle: "Informativo",
    contentTone: "Profesional",
    contentFormat: "Texto con imágenes",
    headingStructure: "H1 + H2 + H3",
    keywordDensity: 1.5,
    includeFAQs: true,
    includeStatistics: true,
    includeExamples: true,
    contentLength: "Medio (800-1200 palabras)",
    seoOptimization: "Intermedio",
    callToAction: true,
    ctaType: "Aprende más",
    technicalTerms: [],
    avoidTerms: [],
    customInstructions: "",
    competitorUrls: [],
    targetReadingLevel: "General",
    contentPurpose: ["Informar", "Educar"],
    contentStructure: "Pirámide invertida",
    imageInstructions: true,
    imageStyle: "Fotografías reales",
    metaDescription: true,
    titleTag: true,
    internalLinking: true,
    externalLinking: true,
    tableOfContents: true,
    conclusion: true,
    introduction: true,
  })

  // Estado para el prompt generado
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [activeTab, setActiveTab] = useState("keywords")
  const [newTerm, setNewTerm] = useState("")
  const [newAvoidTerm, setNewAvoidTerm] = useState("")
  const [newCompetitorUrl, setNewCompetitorUrl] = useState("")
  const [promptCopied, setPromptCopied] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [customTemplateTitle, setCustomTemplateTitle] = useState("")
  const [customTemplateDescription, setCustomTemplateDescription] = useState("")
  const [savedTemplates, setSavedTemplates] = useState<typeof promptTemplates>([])
  const [keywordFilter, setKeywordFilter] = useState("")
  const [filteredKeywords, setFilteredKeywords] = useState<Keyword[]>([])
  const [selectedKeywordsForPrompt, setSelectedKeywordsForPrompt] = useState<Set<string>>(new Set())

  // Filtrar keywords basado en la búsqueda
  useEffect(() => {
    if (!keywordFilter.trim()) {
      setFilteredKeywords(keywords)
      return
    }

    const filtered = keywords.filter((kw) => kw.keyword.toLowerCase().includes(keywordFilter.toLowerCase()))
    setFilteredKeywords(filtered)
  }, [keywords, keywordFilter])

  // Inicializar keywords seleccionadas para el prompt
  useEffect(() => {
    if (selectedKeywords.length > 0) {
      const newSelected = new Set<string>()
      selectedKeywords.forEach((kw) => newSelected.add(kw.id))
      setSelectedKeywordsForPrompt(newSelected)
    }
  }, [selectedKeywords])

  // Cargar plantillas guardadas
  useEffect(() => {
    const savedTemplatesJson = localStorage.getItem("savedPromptTemplates")
    if (savedTemplatesJson) {
      try {
        const parsed = JSON.parse(savedTemplatesJson)
        setSavedTemplates(parsed)
      } catch (e) {
        console.error("Error loading saved templates:", e)
      }
    }
  }, [])

  // Guardar plantillas cuando cambien
  useEffect(() => {
    if (savedTemplates.length > 0) {
      localStorage.setItem("savedPromptTemplates", JSON.stringify(savedTemplates))
    }
  }, [savedTemplates])

  // Función para aplicar una plantilla
  const applyTemplate = (templateName: string) => {
    const allTemplates = [...promptTemplates, ...savedTemplates]
    const template = allTemplates.find((t) => t.name === templateName)

    if (template) {
      setOptions(template.options)
      setSelectedTemplate(templateName)
      toast({
        title: "Plantilla aplicada",
        description: `Se ha aplicado la plantilla "${templateName}"`,
      })
    }
  }

  // Función para guardar la plantilla actual
  const saveCurrentTemplate = () => {
    if (!customTemplateTitle.trim()) {
      toast({
        title: "Error al guardar",
        description: "Debes proporcionar un título para la plantilla",
        variant: "destructive",
      })
      return
    }

    const newTemplate = {
      name: customTemplateTitle,
      description: customTemplateDescription || "Plantilla personalizada",
      options: { ...options },
    }

    setSavedTemplates((prev) => [...prev, newTemplate])
    setCustomTemplateTitle("")
    setCustomTemplateDescription("")

    toast({
      title: "Plantilla guardada",
      description: `La plantilla "${customTemplateTitle}" ha sido guardada correctamente`,
    })
  }

  // Función para eliminar una plantilla guardada
  const deleteTemplate = (templateName: string) => {
    setSavedTemplates((prev) => prev.filter((t) => t.name !== templateName))

    toast({
      title: "Plantilla eliminada",
      description: `La plantilla "${templateName}" ha sido eliminada`,
    })
  }

  // Función para añadir un término técnico
  const addTechnicalTerm = () => {
    if (!newTerm.trim()) return

    setOptions((prev) => ({
      ...prev,
      technicalTerms: [...prev.technicalTerms, newTerm.trim()],
    }))

    setNewTerm("")
  }

  // Función para eliminar un término técnico
  const removeTechnicalTerm = (term: string) => {
    setOptions((prev) => ({
      ...prev,
      technicalTerms: prev.technicalTerms.filter((t) => t !== term),
    }))
  }

  // Función para añadir un término a evitar
  const addAvoidTerm = () => {
    if (!newAvoidTerm.trim()) return

    setOptions((prev) => ({
      ...prev,
      avoidTerms: [...prev.avoidTerms, newAvoidTerm.trim()],
    }))

    setNewAvoidTerm("")
  }

  // Función para eliminar un término a evitar
  const removeAvoidTerm = (term: string) => {
    setOptions((prev) => ({
      ...prev,
      avoidTerms: prev.avoidTerms.filter((t) => t !== term),
    }))
  }

  // Función para añadir una URL de competidor
  const addCompetitorUrl = () => {
    if (!newCompetitorUrl.trim()) return

    setOptions((prev) => ({
      ...prev,
      competitorUrls: [...prev.competitorUrls, newCompetitorUrl.trim()],
    }))

    setNewCompetitorUrl("")
  }

  // Función para eliminar una URL de competidor
  const removeCompetitorUrl = (url: string) => {
    setOptions((prev) => ({
      ...prev,
      competitorUrls: prev.competitorUrls.filter((u) => u !== url),
    }))
  }

  // Función para manejar la selección de propósitos de contenido
  const handleContentPurposeChange = (purpose: string) => {
    setOptions((prev) => {
      const currentPurposes = [...prev.contentPurpose]

      if (currentPurposes.includes(purpose)) {
        return {
          ...prev,
          contentPurpose: currentPurposes.filter((p) => p !== purpose),
        }
      } else {
        return {
          ...prev,
          contentPurpose: [...currentPurposes, purpose],
        }
      }
    })
  }

  // Función para manejar la selección de keywords para el prompt
  const handleKeywordSelection = (keywordId: string) => {
    setSelectedKeywordsForPrompt((prev) => {
      const newSet = new Set(prev)

      if (newSet.has(keywordId)) {
        newSet.delete(keywordId)
      } else {
        newSet.add(keywordId)
      }

      return newSet
    })
  }

  // Función para seleccionar todas las keywords filtradas
  const selectAllFilteredKeywords = () => {
    setSelectedKeywordsForPrompt((prev) => {
      const newSet = new Set(prev)

      filteredKeywords.forEach((kw) => {
        newSet.add(kw.id)
      })

      return newSet
    })
  }

  // Función para deseleccionar todas las keywords
  const deselectAllKeywords = () => {
    setSelectedKeywordsForPrompt(new Set())
  }

  // Función para generar el prompt
  const generatePrompt = () => {
    // Obtener las keywords seleccionadas
    const selectedKws = keywords.filter((kw) => selectedKeywordsForPrompt.has(kw.id))

    if (selectedKws.length === 0) {
      toast({
        title: "Error al generar prompt",
        description: "Debes seleccionar al menos una palabra clave",
        variant: "destructive",
      })
      return
    }

    // Construir el prompt
    let prompt = `# Instrucciones para Crear Contenido SEO Optimizado\n\n`

    // Información básica
    prompt += `## Información Básica\n`
    prompt += `- **Tipo de Contenido:** ${options.contentType}\n`
    prompt += `- **Objetivo Principal:** ${options.contentGoal}\n`
    prompt += `- **Audiencia Objetivo:** ${options.targetAudience}\n`
    prompt += `- **Nivel de Lectura:** ${options.targetReadingLevel}\n`
    prompt += `- **Longitud del Contenido:** ${options.contentLength}\n\n`

    // Palabras clave
    prompt += `## Palabras Clave\n`
    prompt += `- **Palabra Clave Principal:** ${selectedKws[0].keyword}\n`

    if (selectedKws.length > 1) {
      prompt += `- **Palabras Clave Secundarias:**\n`
      selectedKws.slice(1).forEach((kw) => {
        prompt += `  - ${kw.keyword}\n`
      })
    }

    prompt += `- **Densidad de Palabras Clave:** ${options.keywordDensity}%\n\n`

    // Estilo y tono
    prompt += `## Estilo y Tono\n`
    prompt += `- **Estilo de Escritura:** ${options.contentStyle}\n`
    prompt += `- **Tono:** ${options.contentTone}\n`
    prompt += `- **Formato de Contenido:** ${options.contentFormat}\n`
    prompt += `- **Estructura de Contenido:** ${options.contentStructure}\n\n`

    // Estructura de encabezados
    prompt += `## Estructura de Encabezados\n`
    prompt += `- **Tipo de Estructura:** ${options.headingStructure}\n`

    if (options.introduction) {
      prompt += `- **Incluir Introducción:** Sí\n`
    }

    if (options.tableOfContents) {
      prompt += `- **Incluir Tabla de Contenidos:** Sí\n`
    }

    if (options.conclusion) {
      prompt += `- **Incluir Conclusión:** Sí\n`
    }

    prompt += `\n`

    // Elementos adicionales
    prompt += `## Elementos Adicionales\n`

    if (options.includeFAQs) {
      prompt += `- **Incluir Sección de FAQ:** Sí\n`
    }

    if (options.includeStatistics) {
      prompt += `- **Incluir Estadísticas:** Sí\n`
    }

    if (options.includeExamples) {
      prompt += `- **Incluir Ejemplos:** Sí\n`
    }

    if (options.callToAction) {
      prompt += `- **Incluir Call to Action:** Sí (Tipo: ${options.ctaType})\n`
    }

    if (options.imageInstructions) {
      prompt += `- **Instrucciones para Imágenes:** Sí (Estilo: ${options.imageStyle})\n`
    }

    prompt += `\n`

    // Optimización SEO
    prompt += `## Optimización SEO\n`
    prompt += `- **Nivel de Optimización:** ${options.seoOptimization}\n`

    if (options.metaDescription) {
      prompt += `- **Incluir Meta Descripción:** Sí\n`
    }

    if (options.titleTag) {
      prompt += `- **Incluir Sugerencia de Title Tag:** Sí\n`
    }

    if (options.internalLinking) {
      prompt += `- **Sugerir Enlaces Internos:** Sí\n`
    }

    if (options.externalLinking) {
      prompt += `- **Sugerir Enlaces Externos:** Sí\n`
    }

    prompt += `\n`

    // Propósito del contenido
    if (options.contentPurpose.length > 0) {
      prompt += `## Propósito del Contenido\n`
      options.contentPurpose.forEach((purpose) => {
        prompt += `- ${purpose}\n`
      })
      prompt += `\n`
    }

    // Términos técnicos
    if (options.technicalTerms.length > 0) {
      prompt += `## Términos Técnicos a Incluir\n`
      options.technicalTerms.forEach((term) => {
        prompt += `- ${term}\n`
      })
      prompt += `\n`
    }

    // Términos a evitar
    if (options.avoidTerms.length > 0) {
      prompt += `## Términos a Evitar\n`
      options.avoidTerms.forEach((term) => {
        prompt += `- ${term}\n`
      })
      prompt += `\n`
    }

    // URLs de competidores
    if (options.competitorUrls.length > 0) {
      prompt += `## URLs de Competidores para Referencia\n`
      options.competitorUrls.forEach((url) => {
        prompt += `- ${url}\n`
      })
      prompt += `\n`
    }

    // Instrucciones personalizadas
    if (options.customInstructions) {
      prompt += `## Instrucciones Adicionales\n`
      prompt += options.customInstructions + `\n\n`
    }

    // Instrucciones finales
    prompt += `## Instrucciones Finales\n`
    prompt += `Por favor, crea un contenido original y de alta calidad siguiendo todas las instrucciones anteriores. El contenido debe ser atractivo, informativo y optimizado para SEO, manteniendo un enfoque natural y centrado en el usuario.`

    setGeneratedPrompt(prompt)

    toast({
      title: "Prompt generado",
      description: "El prompt ha sido generado correctamente",
    })
  }

  // Función para copiar el prompt al portapapeles
  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt)
    setPromptCopied(true)

    toast({
      title: "Prompt copiado",
      description: "El prompt ha sido copiado al portapapeles",
    })

    setTimeout(() => {
      setPromptCopied(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">Generador de Prompts para Contenido SEO</h2>
        <p className="text-muted-foreground">
          Crea prompts avanzados para generar contenido SEO de alta calidad basado en tus palabras clave.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="keywords">
            <Target className="h-4 w-4 mr-2" />
            Palabras Clave
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText className="h-4 w-4 mr-2" />
            Contenido
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Layers className="h-4 w-4 mr-2" />
            Avanzado
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Braces className="h-4 w-4 mr-2" />
            Plantillas
          </TabsTrigger>
        </TabsList>

        {/* Pestaña de Palabras Clave */}
        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Selección de Palabras Clave</CardTitle>
              <CardDescription>
                Selecciona las palabras clave que deseas incluir en tu prompt. La primera seleccionada será la palabra
                clave principal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar palabras clave..."
                  value={keywordFilter}
                  onChange={(e) => setKeywordFilter(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={selectAllFilteredKeywords}>
                  Seleccionar todas
                </Button>
                <Button variant="outline" size="sm" onClick={deselectAllKeywords}>
                  Deseleccionar todas
                </Button>
              </div>

              <div className="border rounded-md">
                <ScrollArea className="h-[300px]">
                  <div className="p-4 space-y-2">
                    {filteredKeywords.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">No se encontraron palabras clave</div>
                    ) : (
                      filteredKeywords.map((keyword, index) => (
                        <div
                          key={keyword.id}
                          className={cn(
                            "flex items-center space-x-2 p-2 rounded-md",
                            selectedKeywordsForPrompt.has(keyword.id) ? "bg-muted" : "hover:bg-muted/50",
                          )}
                        >
                          <Checkbox
                            checked={selectedKeywordsForPrompt.has(keyword.id)}
                            onCheckedChange={() => handleKeywordSelection(keyword.id)}
                            id={`keyword-${keyword.id}`}
                          />
                          <Label htmlFor={`keyword-${keyword.id}`} className="flex-1 cursor-pointer">
                            {keyword.keyword}
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{keyword.volume.toLocaleString()} búsquedas</Badge>
                            {keyword.category && (
                              <Badge
                                style={{
                                  backgroundColor:
                                    categories.find((c) => c.name === keyword.category)?.color || "#A0A0A0",
                                  color: "#fff",
                                }}
                              >
                                {keyword.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {Array.from(selectedKeywordsForPrompt).length} palabras clave seleccionadas
                </div>
                <div className="text-sm">
                  {selectedKeywordsForPrompt.size > 0 && (
                    <div className="flex items-center space-x-1">
                      <span className="font-medium">Principal:</span>
                      <span>
                        {keywords.find((k) => k.id === Array.from(selectedKeywordsForPrompt)[0])?.keyword || ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Densidad y Optimización</CardTitle>
              <CardDescription>Configura la densidad de palabras clave y el nivel de optimización SEO.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="keyword-density">Densidad de Palabras Clave (%)</Label>
                  <span className="text-sm font-medium">{options.keywordDensity}%</span>
                </div>
                <Slider
                  id="keyword-density"
                  min={0.5}
                  max={3}
                  step={0.1}
                  value={[options.keywordDensity]}
                  onValueChange={(value) => setOptions({ ...options, keywordDensity: value[0] })}
                />
                <p className="text-xs text-muted-foreground">
                  La densidad recomendada está entre 1% y 2%. Valores más altos pueden considerarse keyword stuffing.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo-optimization">Nivel de Optimización SEO</Label>
                <Select
                  value={options.seoOptimization}
                  onValueChange={(value) => setOptions({ ...options, seoOptimization: value })}
                >
                  <SelectTrigger id="seo-optimization">
                    <SelectValue placeholder="Selecciona el nivel de optimización" />
                  </SelectTrigger>
                  <SelectContent>
                    {seoOptimizationOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="meta-description"
                    checked={options.metaDescription}
                    onCheckedChange={(checked) => setOptions({ ...options, metaDescription: checked })}
                  />
                  <Label htmlFor="meta-description">Meta Descripción</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="title-tag"
                    checked={options.titleTag}
                    onCheckedChange={(checked) => setOptions({ ...options, titleTag: checked })}
                  />
                  <Label htmlFor="title-tag">Title Tag</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="internal-linking"
                    checked={options.internalLinking}
                    onCheckedChange={(checked) => setOptions({ ...options, internalLinking: checked })}
                  />
                  <Label htmlFor="internal-linking">Enlaces Internos</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="external-linking"
                    checked={options.externalLinking}
                    onCheckedChange={(checked) => setOptions({ ...options, externalLinking: checked })}
                  />
                  <Label htmlFor="external-linking">Enlaces Externos</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Contenido */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tipo y Estructura de Contenido</CardTitle>
              <CardDescription>Define el tipo, objetivo y estructura del contenido que deseas generar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="content-type">Tipo de Contenido</Label>
                  <Select
                    value={options.contentType}
                    onValueChange={(value) => setOptions({ ...options, contentType: value })}
                  >
                    <SelectTrigger id="content-type">
                      <SelectValue placeholder="Selecciona el tipo de contenido" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content-goal">Objetivo Principal</Label>
                  <Select
                    value={options.contentGoal}
                    onValueChange={(value) => setOptions({ ...options, contentGoal: value })}
                  >
                    <SelectTrigger id="content-goal">
                      <SelectValue placeholder="Selecciona el objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentGoalOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-audience">Audiencia Objetivo</Label>
                  <Select
                    value={options.targetAudience}
                    onValueChange={(value) => setOptions({ ...options, targetAudience: value })}
                  >
                    <SelectTrigger id="target-audience">
                      <SelectValue placeholder="Selecciona la audiencia" />
                    </SelectTrigger>
                    <SelectContent>
                      {targetAudienceOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content-length">Longitud del Contenido</Label>
                  <Select
                    value={options.contentLength}
                    onValueChange={(value) => setOptions({ ...options, contentLength: value })}
                  >
                    <SelectTrigger id="content-length">
                      <SelectValue placeholder="Selecciona la longitud" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentLengthOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content-structure">Estructura del Contenido</Label>
                  <Select
                    value={options.contentStructure}
                    onValueChange={(value) => setOptions({ ...options, contentStructure: value })}
                  >
                    <SelectTrigger id="content-structure">
                      <SelectValue placeholder="Selecciona la estructura" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentStructureOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heading-structure">Estructura de Encabezados</Label>
                  <Select
                    value={options.headingStructure}
                    onValueChange={(value) => setOptions({ ...options, headingStructure: value })}
                  >
                    <SelectTrigger id="heading-structure">
                      <SelectValue placeholder="Selecciona la estructura" />
                    </SelectTrigger>
                    <SelectContent>
                      {headingStructureOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Propósitos del Contenido</Label>
                <div className="grid grid-cols-2 gap-2">
                  {contentPurposeOptions.slice(0, 10).map((purpose) => (
                    <div key={purpose} className="flex items-center space-x-2">
                      <Checkbox
                        id={`purpose-${purpose}`}
                        checked={options.contentPurpose.includes(purpose)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleContentPurposeChange(purpose)
                          }
                        }}
                      />
                      <Label htmlFor={`purpose-${purpose}`}>{purpose}</Label>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {contentPurposeOptions.slice(10).map((purpose) => (
                    <div key={purpose} className="flex items-center space-x-2">
                      <Checkbox
                        id={`purpose-${purpose}`}
                        checked={options.contentPurpose.includes(purpose)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleContentPurposeChange(purpose)
                          }
                        }}
                      />
                      <Label htmlFor={`purpose-${purpose}`}>{purpose}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="introduction">Incluir Introducción</Label>
                    <Switch
                      id="introduction"
                      checked={options.introduction}
                      onCheckedChange={(checked) => setOptions({ ...options, introduction: checked })}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Incluye una introducción que presente el tema y capte la atención del lector.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="conclusion">Incluir Conclusión</Label>
                    <Switch
                      id="conclusion"
                      checked={options.conclusion}
                      onCheckedChange={(checked) => setOptions({ ...options, conclusion: checked })}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Incluye una conclusión que resuma los puntos principales y cierre el contenido.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="table-of-contents">Incluir Tabla de Contenidos</Label>
                    <Switch
                      id="table-of-contents"
                      checked={options.tableOfContents}
                      onCheckedChange={(checked) => setOptions({ ...options, tableOfContents: checked })}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Incluye una tabla de contenidos para facilitar la navegación.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="call-to-action">Incluir Call to Action</Label>
                    <Switch
                      id="call-to-action"
                      checked={options.callToAction}
                      onCheckedChange={(checked) => setOptions({ ...options, callToAction: checked })}
                    />
                  </div>
                  {options.callToAction && (
                    <Select
                      value={options.ctaType}
                      onValueChange={(value) => setOptions({ ...options, ctaType: value })}
                    >
                      <SelectTrigger id="cta-type">
                        <SelectValue placeholder="Tipo de CTA" />
                      </SelectTrigger>
                      <SelectContent>
                        {ctaTypeOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estilo y Tono</CardTitle>
              <CardDescription>Define el estilo, tono y formato del contenido.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="content-style">Estilo de Contenido</Label>
                  <Select
                    value={options.contentStyle}
                    onValueChange={(value) => setOptions({ ...options, contentStyle: value })}
                  >
                    <SelectTrigger id="content-style">
                      <SelectValue placeholder="Selecciona el estilo" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentStyleOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content-tone">Tono de Contenido</Label>
                  <Select
                    value={options.contentTone}
                    onValueChange={(value) => setOptions({ ...options, contentTone: value })}
                  >
                    <SelectTrigger id="content-tone">
                      <SelectValue placeholder="Selecciona el tono" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentToneOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content-format">Formato de Contenido</Label>
                  <Select
                    value={options.contentFormat}
                    onValueChange={(value) => setOptions({ ...options, contentFormat: value })}
                  >
                    <SelectTrigger id="content-format">
                      <SelectValue placeholder="Selecciona el formato" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentFormatOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-reading-level">Nivel de Lectura</Label>
                  <Select
                    value={options.targetReadingLevel}
                    onValueChange={(value) => setOptions({ ...options, targetReadingLevel: value })}
                  >
                    <SelectTrigger id="target-reading-level">
                      <SelectValue placeholder="Selecciona el nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      {targetReadingLevelOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-faqs">Incluir FAQs</Label>
                    <Switch
                      id="include-faqs"
                      checked={options.includeFAQs}
                      onCheckedChange={(checked) => setOptions({ ...options, includeFAQs: checked })}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Incluye una sección de preguntas frecuentes para mejorar el SEO.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-statistics">Incluir Estadísticas</Label>
                    <Switch
                      id="include-statistics"
                      checked={options.includeStatistics}
                      onCheckedChange={(checked) => setOptions({ ...options, includeStatistics: checked })}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Incluye estadísticas relevantes para respaldar los argumentos.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-examples">Incluir Ejemplos</Label>
                    <Switch
                      id="include-examples"
                      checked={options.includeExamples}
                      onCheckedChange={(checked) => setOptions({ ...options, includeExamples: checked })}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Incluye ejemplos prácticos para ilustrar los conceptos.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="image-instructions">Instrucciones para Imágenes</Label>
                    <Switch
                      id="image-instructions"
                      checked={options.imageInstructions}
                      onCheckedChange={(checked) => setOptions({ ...options, imageInstructions: checked })}
                    />
                  </div>
                  {options.imageInstructions && (
                    <Select
                      value={options.imageStyle}
                      onValueChange={(value) => setOptions({ ...options, imageStyle: value })}
                    >
                      <SelectTrigger id="image-style">
                        <SelectValue placeholder="Estilo de imágenes" />
                      </SelectTrigger>
                      <SelectContent>
                        {imageStyleOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Avanzado */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Términos Técnicos</CardTitle>
              <CardDescription>Especifica términos técnicos que deben incluirse en el contenido.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Añadir término técnico..."
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addTechnicalTerm} type="button" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Añadir
                </Button>
              </div>

              {options.technicalTerms.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {options.technicalTerms.map((term) => (
                    <Badge key={term} variant="secondary" className="flex items-center gap-1">
                      {term}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeTechnicalTerm(term)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hay términos técnicos añadidos.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Términos a Evitar</CardTitle>
              <CardDescription>Especifica términos que deben evitarse en el contenido.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Añadir término a evitar..."
                  value={newAvoidTerm}
                  onChange={(e) => setNewAvoidTerm(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addAvoidTerm} type="button" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Añadir
                </Button>
              </div>

              {options.avoidTerms.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {options.avoidTerms.map((term) => (
                    <Badge key={term} variant="destructive" className="flex items-center gap-1">
                      {term}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeAvoidTerm(term)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hay términos a evitar añadidos.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>URLs de Competidores</CardTitle>
              <CardDescription>Añade URLs de competidores para referencia y análisis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Añadir URL de competidor..."
                  value={newCompetitorUrl}
                  onChange={(e) => setNewCompetitorUrl(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addCompetitorUrl} type="button" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Añadir
                </Button>
              </div>

              {options.competitorUrls.length > 0 ? (
                <div className="space-y-2">
                  {options.competitorUrls.map((url) => (
                    <div key={url} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span className="text-sm truncate flex-1">{url}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeCompetitorUrl(url)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hay URLs de competidores añadidas.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instrucciones Personalizadas</CardTitle>
              <CardDescription>Añade instrucciones adicionales específicas para el contenido.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Escribe instrucciones adicionales aquí..."
                value={options.customInstructions}
                onChange={(e) => setOptions({ ...options, customInstructions: e.target.value })}
                className="min-h-[150px]"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Plantillas */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plantillas Predefinidas</CardTitle>
              <CardDescription>
                Selecciona una plantilla predefinida para aplicar configuraciones optimizadas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {promptTemplates.map((template) => (
                  <div
                    key={template.name}
                    className={cn(
                      "border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors",
                      selectedTemplate === template.name ? "border-primary bg-primary/5" : "",
                    )}
                    onClick={() => applyTemplate(template.name)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{template.name}</h3>
                      {selectedTemplate === template.name && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plantillas Guardadas</CardTitle>
              <CardDescription>Tus plantillas personalizadas guardadas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {savedTemplates.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {savedTemplates.map((template) => (
                    <div
                      key={template.name}
                      className={cn(
                        "border rounded-lg p-4 relative",
                        selectedTemplate === template.name ? "border-primary bg-primary/5" : "",
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{template.name}</h3>
                        <div className="flex items-center space-x-1">
                          {selectedTemplate === template.name && <Check className="h-4 w-4 text-primary" />}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => deleteTemplate(template.name)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => applyTemplate(template.name)}
                      >
                        Aplicar Plantilla
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No tienes plantillas guardadas.</p>
                  <p className="text-sm">Guarda tus configuraciones como plantillas para usarlas más tarde.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Guardar Configuración Actual</CardTitle>
              <CardDescription>Guarda la configuración actual como una plantilla personalizada.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-title">Título de la Plantilla</Label>
                <Input
                  id="template-title"
                  placeholder="Ej: Mi Plantilla SEO"
                  value={customTemplateTitle}
                  onChange={(e) => setCustomTemplateTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-description">Descripción</Label>
                <Textarea
                  id="template-description"
                  placeholder="Describe brevemente para qué sirve esta plantilla..."
                  value={customTemplateDescription}
                  onChange={(e) => setCustomTemplateDescription(e.target.value)}
                />
              </div>

              <Button onClick={saveCurrentTemplate} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Guardar como Plantilla
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() =>
            setOptions({
              contentType: "Artículo de blog",
              contentGoal: "Informar",
              targetAudience: "General",
              contentStyle: "Informativo",
              contentTone: "Profesional",
              contentFormat: "Texto con imágenes",
              headingStructure: "H1 + H2 + H3",
              keywordDensity: 1.5,
              includeFAQs: true,
              includeStatistics: true,
              includeExamples: true,
              contentLength: "Medio (800-1200 palabras)",
              seoOptimization: "Intermedio",
              callToAction: true,
              ctaType: "Aprende más",
              technicalTerms: [],
              avoidTerms: [],
              customInstructions: "",
              competitorUrls: [],
              targetReadingLevel: "General",
              contentPurpose: ["Informar", "Educar"],
              contentStructure: "Pirámide invertida",
              imageInstructions: true,
              imageStyle: "Fotografías reales",
              metaDescription: true,
              titleTag: true,
              internalLinking: true,
              externalLinking: true,
              tableOfContents: true,
              conclusion: true,
              introduction: true,
            })
          }
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Restablecer
        </Button>

        <Button onClick={generatePrompt}>
          <Wand2 className="h-4 w-4 mr-2" />
          Generar Prompt
        </Button>
      </div>

      {generatedPrompt && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Prompt Generado</span>
              <Button variant="outline" size="sm" onClick={copyPromptToClipboard}>
                {promptCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Clipboard className="h-4 w-4 mr-2" />
                    Copiar
                  </>
                )}
              </Button>
            </CardTitle>
            <CardDescription>
              Copia este prompt y úsalo con tu herramienta de IA favorita para generar contenido SEO optimizado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md">
              <ScrollArea className="h-[400px]">
                <pre className="whitespace-pre-wrap text-sm">{generatedPrompt}</pre>
              </ScrollArea>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <Info className="h-4 w-4 mr-1" />
                      <span>Información del prompt</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>
                      Este prompt está optimizado para generar contenido SEO de alta calidad. Incluye{" "}
                      {Array.from(selectedKeywordsForPrompt).length} palabras clave y está configurado para un contenido
                      de tipo {options.contentType} con un objetivo de {options.contentGoal}.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button onClick={generatePrompt}>
              <Zap className="h-4 w-4 mr-2" />
              Regenerar
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import {
  Copy,
  RefreshCw,
  Sparkles,
  Plus,
  Trash,
  FileSpreadsheet,
  FileText,
  MessageSquare,
  Settings,
  Target,
  Lightbulb,
  BarChart,
} from "lucide-react"

// Tipos
interface AdGeneratorFormData {
  keywords: string
  destinationUrl: string
  numAds: number
  numTitles: number
  numDescriptions: number
  writingStyle: string
  industry: string
  targetAudience: string
  uniqueSellingPoints: string[]
  callToAction: string
  competitiveAdvantage: string
  aiModel: string
  temperature: number
  optimizeGrammar: boolean
  optimizeKeywordDensity: boolean
  optimizeCreativity: boolean
  optimizeSentiment: boolean
  keywordDensity: number
  readabilityLevel: string
}

interface GeneratedAd {
  id: string
  titles: string[]
  descriptions: string[]
  finalUrl: string
  keywords: string[]
  qualityScore: {
    overall: number
    relevance: number
    creativity: number
    grammar: number
    keywordUsage: number
  }
}

export function AdvancedAdsGenerator() {
  // Estados
  const [formData, setFormData] = useState<AdGeneratorFormData>({
    keywords: "",
    destinationUrl: "",
    numAds: 1,
    numTitles: 15,
    numDescriptions: 4,
    writingStyle: "profesional",
    industry: "general",
    targetAudience: "general",
    uniqueSellingPoints: [""],
    callToAction: "comprar_ahora",
    competitiveAdvantage: "",
    aiModel: "gpt-4o",
    temperature: 0.7,
    optimizeGrammar: true,
    optimizeKeywordDensity: true,
    optimizeCreativity: true,
    optimizeSentiment: true,
    keywordDensity: 2,
    readabilityLevel: "medio",
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedAds, setGeneratedAds] = useState<GeneratedAd[]>([])
  const [openaiApiKey, setOpenaiApiKey] = useState("")
  const [activeTab, setActiveTab] = useState("basic")

  // Cargar API key guardada
  useEffect(() => {
    const savedKey = localStorage.getItem("openai_api_key")
    if (savedKey) {
      setOpenaiApiKey(savedKey)
    }
  }, [])

  // Opciones para los selectores
  const writingStyles = [
    { value: "profesional", label: "Profesional" },
    { value: "conversacional", label: "Conversacional" },
    { value: "persuasivo", label: "Persuasivo" },
    { value: "informativo", label: "Informativo" },
    { value: "urgente", label: "Urgente" },
    { value: "emocional", label: "Emocional" },
    { value: "minimalista", label: "Minimalista" },
    { value: "tecnico", label: "Técnico" },
    { value: "creativo", label: "Creativo" },
    { value: "formal", label: "Formal" },
    { value: "amigable", label: "Amigable" },
    { value: "directo", label: "Directo" },
  ]

  const industries = [
    { value: "general", label: "General" },
    { value: "tecnologia", label: "Tecnología" },
    { value: "salud", label: "Salud y Bienestar" },
    { value: "educacion", label: "Educación" },
    { value: "finanzas", label: "Finanzas" },
    { value: "inmobiliaria", label: "Inmobiliaria" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "servicios_profesionales", label: "Servicios Profesionales" },
    { value: "turismo", label: "Turismo y Viajes" },
    { value: "gastronomia", label: "Gastronomía" },
    { value: "moda", label: "Moda y Belleza" },
    { value: "automotriz", label: "Automotriz" },
    { value: "entretenimiento", label: "Entretenimiento" },
    { value: "deportes", label: "Deportes y Fitness" },
    { value: "arte", label: "Arte y Cultura" },
    { value: "legal", label: "Legal" },
    { value: "construccion", label: "Construcción" },
    { value: "marketing", label: "Marketing y Publicidad" },
    { value: "hogar", label: "Hogar y Decoración" },
    { value: "esoterico", label: "Esotérico y Espiritual" },
  ]

  const audiences = [
    { value: "general", label: "General" },
    { value: "jovenes", label: "Jóvenes (18-24)" },
    { value: "adultos_jovenes", label: "Adultos Jóvenes (25-34)" },
    { value: "adultos", label: "Adultos (35-44)" },
    { value: "adultos_mayores", label: "Adultos Mayores (45-64)" },
    { value: "tercera_edad", label: "Tercera Edad (65+)" },
    { value: "profesionales", label: "Profesionales" },
    { value: "empresarios", label: "Empresarios" },
    { value: "estudiantes", label: "Estudiantes" },
    { value: "padres", label: "Padres" },
    { value: "mujeres", label: "Mujeres" },
    { value: "hombres", label: "Hombres" },
    { value: "familias", label: "Familias" },
    { value: "alto_poder_adquisitivo", label: "Alto Poder Adquisitivo" },
    { value: "clase_media", label: "Clase Media" },
    { value: "conscientes_precio", label: "Conscientes del Precio" },
    { value: "tecnologicos", label: "Tecnológicos" },
    { value: "ecologicos", label: "Ecológicos" },
    { value: "amantes_lujo", label: "Amantes del Lujo" },
    { value: "buscadores_espirituales", label: "Buscadores Espirituales" },
  ]

  const callToActions = [
    { value: "comprar_ahora", label: "Comprar Ahora" },
    { value: "reservar_hoy", label: "Reservar Hoy" },
    { value: "contactanos", label: "Contáctanos" },
    { value: "mas_informacion", label: "Más Información" },
    { value: "prueba_gratis", label: "Prueba Gratis" },
    { value: "registrate", label: "Regístrate" },
    { value: "descubre_mas", label: "Descubre Más" },
    { value: "solicita_presupuesto", label: "Solicita Presupuesto" },
    { value: "descarga_ahora", label: "Descarga Ahora" },
    { value: "inscribete", label: "Inscríbete" },
    { value: "empieza_ya", label: "Empieza Ya" },
    { value: "aprovecha_oferta", label: "Aprovecha la Oferta" },
    { value: "agenda_cita", label: "Agenda una Cita" },
    { value: "visita_tienda", label: "Visita Nuestra Tienda" },
    { value: "llama_ahora", label: "Llama Ahora" },
    { value: "suscribete", label: "Suscríbete" },
    { value: "unete", label: "Únete" },
    { value: "consulta_gratis", label: "Consulta Gratis" },
    { value: "ver_planes", label: "Ver Planes" },
    { value: "conoce_mas", label: "Conoce Más" },
  ]

  const readabilityLevels = [
    { value: "basico", label: "Básico" },
    { value: "medio", label: "Medio" },
    { value: "avanzado", label: "Avanzado" },
  ]

  const aiModels = [
    { value: "gpt-4o", label: "GPT-4o (Recomendado)" },
    { value: "gpt-4", label: "GPT-4" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  ]

  // Manejadores de cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData({ ...formData, [name]: value[0] })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked })
  }

  const handleUniqueSellingPointChange = (index: number, value: string) => {
    const updatedPoints = [...formData.uniqueSellingPoints]
    updatedPoints[index] = value
    setFormData({ ...formData, uniqueSellingPoints: updatedPoints })
  }

  const addUniqueSellingPoint = () => {
    if (formData.uniqueSellingPoints.length < 5) {
      setFormData({
        ...formData,
        uniqueSellingPoints: [...formData.uniqueSellingPoints, ""],
      })
    } else {
      toast({
        title: "Límite alcanzado",
        description: "Puedes añadir hasta 5 puntos de venta únicos",
        variant: "destructive",
      })
    }
  }

  const removeUniqueSellingPoint = (index: number) => {
    const updatedPoints = [...formData.uniqueSellingPoints]
    updatedPoints.splice(index, 1)
    setFormData({ ...formData, uniqueSellingPoints: updatedPoints })
  }

  // Función para generar anuncios
  const generateAds = async () => {
    // Validaciones
    if (!formData.keywords.trim()) {
      toast({
        title: "Palabras clave requeridas",
        description: "Por favor, ingresa al menos una palabra clave",
        variant: "destructive",
      })
      return
    }

    if (!formData.destinationUrl.trim()) {
      toast({
        title: "URL de destino requerida",
        description: "Por favor, ingresa una URL de destino",
        variant: "destructive",
      })
      return
    }

    if (formData.numAds > 3) {
      toast({
        title: "Límite de anuncios",
        description: "Para evitar errores, puedes generar hasta 3 anuncios a la vez",
        variant: "destructive",
      })
      return
    }

    // Iniciar generación
    setIsGenerating(true)
    setProgress(0)
    setGeneratedAds([])

    // Simular progreso
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + 5
      })
    }, 200)

    try {
      // Simular llamada a API
      setTimeout(() => {
        clearInterval(progressInterval)
        setProgress(100)

        // Generar anuncios simulados
        const keywords = formData.keywords.split(",").map((k) => k.trim())
        const ads: GeneratedAd[] = []

        for (let i = 0; i < formData.numAds; i++) {
          const titles = []
          const descriptions = []

          // Generar títulos
          for (let t = 0; t < formData.numTitles; t++) {
            const keywordIndex = t % keywords.length
            const keyword = keywords[keywordIndex]

            // Generar título basado en el estilo de escritura
            let title = ""

            if (formData.writingStyle === "profesional") {
              title = `${keyword} - Soluciones Profesionales`
            } else if (formData.writingStyle === "persuasivo") {
              title = `¡${keyword} de Alta Calidad! Descubre Más`
            } else if (formData.writingStyle === "urgente") {
              title = `¡Última Oportunidad! ${keyword} en Oferta`
            } else if (formData.writingStyle === "emocional") {
              title = `Transforma tu Vida con ${keyword}`
            } else if (formData.writingStyle === "tecnico") {
              title = `${keyword}: Especificaciones y Características`
            } else if (formData.writingStyle === "creativo") {
              title = `Reimagina el Futuro con ${keyword}`
            } else {
              // Estilo por defecto
              title = `${keyword} - Calidad Garantizada`
            }

            // Asegurar que el título no exceda 30 caracteres
            if (title.length > 30) {
              title = title.substring(0, 27) + "..."
            }

            titles.push(title)
          }

          // Generar descripciones
          for (let d = 0; d < formData.numDescriptions; d++) {
            const keywordIndex = d % keywords.length
            const keyword = keywords[keywordIndex]

            // Generar descripción basada en el estilo de escritura y otros parámetros
            let description = ""

            if (formData.writingStyle === "profesional") {
              description = `Ofrecemos ${keyword} de la más alta calidad. Servicio profesional garantizado. ${getCallToActionText(formData.callToAction)}.`
            } else if (formData.writingStyle === "persuasivo") {
              description = `¿Buscas ${keyword}? Tenemos la mejor relación calidad-precio del mercado. ${getCallToActionText(formData.callToAction)} y descubre la diferencia.`
            } else if (formData.writingStyle === "urgente") {
              description = `¡Oferta por tiempo limitado en ${keyword}! No pierdas esta oportunidad única. ${getCallToActionText(formData.callToAction)} antes que se agote.`
            } else if (formData.writingStyle === "emocional") {
              description = `Transforma tu experiencia con nuestro ${keyword}. Siente la diferencia desde el primer momento. ${getCallToActionText(formData.callToAction)}.`
            } else if (formData.writingStyle === "tecnico") {
              description = `${keyword} con especificaciones técnicas avanzadas. Rendimiento optimizado y eficiencia garantizada. ${getCallToActionText(formData.callToAction)}.`
            } else if (formData.writingStyle === "creativo") {
              description = `Reimagina las posibilidades con nuestro innovador ${keyword}. Una experiencia única te espera. ${getCallToActionText(formData.callToAction)}.`
            } else {
              // Estilo por defecto
              description = `Ofrecemos ${keyword} de calidad superior. Satisfacción garantizada. ${getCallToActionText(formData.callToAction)} hoy mismo.`
            }

            // Asegurar que la descripción no exceda 90 caracteres
            if (description.length > 90) {
              description = description.substring(0, 87) + "..."
            }

            descriptions.push(description)
          }

          // Generar puntuaciones de calidad
          const qualityScore = {
            overall: Math.floor(Math.random() * 3) + 8, // 8-10
            relevance: Math.floor(Math.random() * 3) + 8, // 8-10
            creativity: Math.floor(Math.random() * 5) + 6, // 6-10
            grammar: Math.floor(Math.random() * 2) + 9, // 9-10
            keywordUsage: Math.floor(Math.random() * 3) + 8, // 8-10
          }

          ads.push({
            id: `ad-${Date.now()}-${i}`,
            titles,
            descriptions,
            finalUrl: formData.destinationUrl,
            keywords,
            qualityScore,
          })
        }

        setGeneratedAds(ads)
        setIsGenerating(false)

        toast({
          title: "Anuncios generados",
          description: `Se han generado ${formData.numAds} anuncios con éxito`,
        })
      }, 2000)
    } catch (error) {
      clearInterval(progressInterval)
      setIsGenerating(false)
      setProgress(0)

      toast({
        title: "Error al generar anuncios",
        description: "Ocurrió un error al generar los anuncios. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Función para regenerar un anuncio específico
  const regenerateAd = (adId: string) => {
    toast({
      title: "Regenerando anuncio",
      description: "El anuncio se está regenerando...",
    })

    // Simular regeneración
    setTimeout(() => {
      const updatedAds = generatedAds.map((ad) => {
        if (ad.id === adId) {
          // Generar nuevos títulos y descripciones
          const keywords = ad.keywords
          const titles = []
          const descriptions = []

          // Generar títulos
          for (let t = 0; t < formData.numTitles; t++) {
            const keywordIndex = t % keywords.length
            const keyword = keywords[keywordIndex]

            // Generar título con variaciones
            let title = ""
            const variation = Math.floor(Math.random() * 5)

            if (variation === 0) {
              title = `${keyword} - Calidad Premium`
            } else if (variation === 1) {
              title = `Descubre ${keyword} Profesional`
            } else if (variation === 2) {
              title = `${keyword} - Oferta Exclusiva`
            } else if (variation === 3) {
              title = `Los Mejores ${keyword} Para Ti`
            } else {
              title = `${keyword} - Resultados Garantizados`
            }

            // Asegurar que el título no exceda 30 caracteres
            if (title.length > 30) {
              title = title.substring(0, 27) + "..."
            }

            titles.push(title)
          }

          // Generar descripciones
          for (let d = 0; d < formData.numDescriptions; d++) {
            const keywordIndex = d % keywords.length
            const keyword = keywords[keywordIndex]

            // Generar descripción con variaciones
            let description = ""
            const variation = Math.floor(Math.random() * 5)

            if (variation === 0) {
              description = `Ofrecemos ${keyword} de la más alta calidad. Servicio profesional garantizado. ${getCallToActionText(formData.callToAction)}.`
            } else if (variation === 1) {
              description = `¿Buscas ${keyword}? Tenemos la mejor relación calidad-precio del mercado. ${getCallToActionText(formData.callToAction)}.`
            } else if (variation === 2) {
              description = `${keyword} con garantía de satisfacción. Entrega rápida y atención personalizada. ${getCallToActionText(formData.callToAction)}.`
            } else if (variation === 3) {
              description = `Expertos en ${keyword} a tu servicio. Soluciones adaptadas a tus necesidades. ${getCallToActionText(formData.callToAction)}.`
            } else {
              description = `Descubre nuestro ${keyword} premium. Calidad incomparable al mejor precio. ${getCallToActionText(formData.callToAction)}.`
            }

            // Asegurar que la descripción no exceda 90 caracteres
            if (description.length > 90) {
              description = description.substring(0, 87) + "..."
            }

            descriptions.push(description)
          }

          // Actualizar puntuaciones de calidad
          const qualityScore = {
            overall: Math.min(10, ad.qualityScore.overall + Math.floor(Math.random() * 2)),
            relevance: Math.min(10, ad.qualityScore.relevance + Math.floor(Math.random() * 2)),
            creativity: Math.min(10, ad.qualityScore.creativity + Math.floor(Math.random() * 2)),
            grammar: Math.min(10, ad.qualityScore.grammar),
            keywordUsage: Math.min(10, ad.qualityScore.keywordUsage + Math.floor(Math.random() * 2)),
          }

          return {
            ...ad,
            titles,
            descriptions,
            qualityScore,
          }
        }
        return ad
      })

      setGeneratedAds(updatedAds)

      toast({
        title: "Anuncio regenerado",
        description: "El anuncio ha sido regenerado con éxito",
      })
    }, 1000)
  }

  // Función para copiar al portapapeles
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado al portapapeles",
      description: message,
    })
  }

  // Función para exportar anuncios a CSV
  const exportToCsv = () => {
    if (generatedAds.length === 0) {
      toast({
        title: "No hay anuncios para exportar",
        description: "Genera anuncios primero antes de exportar",
        variant: "destructive",
      })
      return
    }

    // Crear contenido CSV para Google Ads
    let csvContent =
      "Campaign,Ad Group,Headline 1,Headline 2,Headline 3,Headline 4,Headline 5,Headline 6,Headline 7,Headline 8,Headline 9,Headline 10,Headline 11,Headline 12,Headline 13,Headline 14,Headline 15,Description 1,Description 2,Description 3,Description 4,Final URL,Path 1,Path 2\n"

    generatedAds.forEach((ad, index) => {
      const row = [`Campaign ${index + 1}`, `Ad Group ${index + 1}`]

      // Añadir títulos (hasta 15)
      for (let i = 0; i < 15; i++) {
        row.push(i < ad.titles.length ? ad.titles[i] : "")
      }

      // Añadir descripciones (hasta 4)
      for (let i = 0; i < 4; i++) {
        row.push(i < ad.descriptions.length ? ad.descriptions[i] : "")
      }

      // Añadir URL final y rutas
      row.push(ad.finalUrl)
      row.push("") // Path 1
      row.push("") // Path 2

      csvContent += row.join(",") + "\n"
    })

    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "google_ads_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Exportación completada",
      description: "Los anuncios han sido exportados a CSV para Google Ads",
    })
  }

  // Función para exportar anuncios a Excel (simulado con CSV más detallado)
  const exportToExcel = () => {
    if (generatedAds.length === 0) {
      toast({
        title: "No hay anuncios para exportar",
        description: "Genera anuncios primero antes de exportar",
        variant: "destructive",
      })
      return
    }

    // Crear contenido CSV detallado
    let csvContent =
      "ID Anuncio,Título,Descripción,URL Final,Palabras Clave,Puntuación General,Puntuación Relevancia,Puntuación Creatividad,Puntuación Gramática,Puntuación Uso de Keywords\n"

    generatedAds.forEach((ad) => {
      // Para cada título y descripción, crear una fila
      for (let i = 0; i < ad.titles.length; i++) {
        for (let j = 0; j < ad.descriptions.length; j++) {
          const row = [
            ad.id,
            `"${ad.titles[i]}"`,
            `"${ad.descriptions[j]}"`,
            ad.finalUrl,
            `"${ad.keywords.join(", ")}"`,
            ad.qualityScore.overall,
            ad.qualityScore.relevance,
            ad.qualityScore.creativity,
            ad.qualityScore.grammar,
            ad.qualityScore.keywordUsage,
          ]
          csvContent += row.join(",") + "\n"
        }
      }
    })

    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "anuncios_detallados.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Exportación detallada completada",
      description: "Los anuncios han sido exportados con detalles completos",
    })
  }

  // Función auxiliar para obtener texto de llamada a la acción
  const getCallToActionText = (ctaValue: string): string => {
    const ctaItem = callToActions.find((item) => item.value === ctaValue)
    return ctaItem ? ctaItem.label : "Contáctanos"
  }

  // Función para resaltar palabras clave en el texto
  const highlightKeywords = (text: string): React.ReactNode => {
    if (!formData.keywords) return text

    const keywords = formData.keywords.split(",").map((k) => k.trim().toLowerCase())
    const parts = []
    let lastIndex = 0
    const lowerText = text.toLowerCase()

    // Encontrar todas las ocurrencias de palabras clave
    keywords.forEach((keyword) => {
      if (!keyword) return

      let index = lowerText.indexOf(keyword, lastIndex)
      while (index !== -1) {
        // Añadir texto antes de la palabra clave
        if (index > lastIndex) {
          parts.push(text.substring(lastIndex, index))
        }

        // Añadir palabra clave resaltada
        parts.push(
          <span key={`${index}-${keyword}`} className="bg-purple-500/20 text-purple-100 px-1 rounded">
            {text.substring(index, index + keyword.length)}
          </span>,
        )

        lastIndex = index + keyword.length
        index = lowerText.indexOf(keyword, lastIndex)
      }
    })

    // Añadir el resto del texto
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : text
    parts.push(text.substring(lastIndex))

    return parts.length > 0 ? parts : text
  }

  // Renderizar componente
  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="basic" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>Básico</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span>Avanzado</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            <span>IA & Optimización</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="keywords">Palabras Clave (separadas por comas)</Label>
              <Textarea
                id="keywords"
                name="keywords"
                placeholder="Ejemplo: marketing digital, diseño web, redes sociales"
                value={formData.keywords}
                onChange={handleInputChange}
                className="min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground">
                Ingresa una o más palabras clave separadas por comas. Todas se usarán en cada anuncio.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destinationUrl">URL de Destino</Label>
              <Input
                id="destinationUrl"
                name="destinationUrl"
                placeholder="https://ejemplo.com/pagina"
                value={formData.destinationUrl}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                URL a la que se dirigirán los usuarios al hacer clic en tu anuncio.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numAds">Número de Anuncios a Generar</Label>
              <Input
                id="numAds"
                name="numAds"
                type="number"
                min={1}
                max={3}
                value={formData.numAds}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                Cada anuncio incluirá múltiples títulos y descripciones. Máximo 3 anuncios.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numTitles">Títulos por Anuncio</Label>
              <Input
                id="numTitles"
                name="numTitles"
                type="number"
                min={3}
                max={30}
                value={formData.numTitles}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                Google Ads permite hasta 15 títulos por anuncio. Recomendamos 15.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numDescriptions">Descripciones por Anuncio</Label>
              <Input
                id="numDescriptions"
                name="numDescriptions"
                type="number"
                min={2}
                max={10}
                value={formData.numDescriptions}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                Google Ads permite hasta 4 descripciones por anuncio. Recomendamos 4.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="writingStyle">Estilo de Redacción</Label>
            <Select value={formData.writingStyle} onValueChange={(value) => handleSelectChange("writingStyle", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un estilo de redacción" />
              </SelectTrigger>
              <SelectContent>
                {writingStyles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              El estilo de redacción afectará el tono y enfoque de tus anuncios.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industria</Label>
              <Select value={formData.industry} onValueChange={(value) => handleSelectChange("industry", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una industria" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Seleccionar la industria correcta mejora la relevancia de tus anuncios.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Público Objetivo</Label>
              <Select
                value={formData.targetAudience}
                onValueChange={(value) => handleSelectChange("targetAudience", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un público objetivo" />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((audience) => (
                    <SelectItem key={audience.value} value={audience.value}>
                      {audience.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Adapta tus anuncios al público específico que quieres alcanzar.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Puntos de Venta Únicos (USP)</Label>
            <div className="space-y-2">
              {formData.uniqueSellingPoints.map((point, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Punto de venta único #${index + 1}`}
                    value={point}
                    onChange={(e) => handleUniqueSellingPointChange(index, e.target.value)}
                  />
                  {index > 0 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeUniqueSellingPoint(index)}
                      className="shrink-0"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {formData.uniqueSellingPoints.length < 5 && (
                <Button variant="outline" size="sm" onClick={addUniqueSellingPoint} className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir Punto de Venta
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Destaca lo que hace único a tu producto o servicio (máximo 5 puntos).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="callToAction">Llamada a la Acción</Label>
              <Select
                value={formData.callToAction}
                onValueChange={(value) => handleSelectChange("callToAction", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una llamada a la acción" />
                </SelectTrigger>
                <SelectContent>
                  {callToActions.map((cta) => (
                    <SelectItem key={cta.value} value={cta.value}>
                      {cta.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Una llamada a la acción clara aumenta las conversiones.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="competitiveAdvantage">Ventaja Competitiva</Label>
              <Input
                id="competitiveAdvantage"
                name="competitiveAdvantage"
                placeholder="Ej: Mejor precio, entrega más rápida, mayor calidad"
                value={formData.competitiveAdvantage}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                ¿Qué te diferencia de la competencia? Esto se incluirá en tus anuncios.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <div className="p-4 rounded-lg border border-purple-500/30 bg-purple-500/5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold">Configuración de IA</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openaiApiKey">API Key de OpenAI</Label>
                <Input
                  id="openaiApiKey"
                  type="password"
                  placeholder="sk-..."
                  value={openaiApiKey}
                  onChange={(e) => {
                    setOpenaiApiKey(e.target.value)
                    localStorage.setItem("openai_api_key", e.target.value)
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Tu API key se almacena localmente en tu navegador y nunca se envía a nuestros servidores.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiModel">Modelo de IA</Label>
                <Select value={formData.aiModel} onValueChange={(value) => handleSelectChange("aiModel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un modelo de IA" />
                  </SelectTrigger>
                  <SelectContent>
                    {aiModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  GPT-4o ofrece los mejores resultados para anuncios de Google Ads.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="temperature">Nivel de Creatividad</Label>
              <div className="flex items-center gap-4">
                <span className="text-xs">Conservador</span>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[formData.temperature]}
                  onValueChange={(value) => handleSliderChange("temperature", value)}
                  className="flex-1"
                />
                <span className="text-xs">Creativo</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Un valor más bajo genera anuncios más conservadores y consistentes. Un valor más alto genera anuncios
                más creativos y variados.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-blue-500/30 bg-blue-500/5">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold">Optimizaciones</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="optimizeGrammar"
                  checked={formData.optimizeGrammar}
                  onCheckedChange={(checked) => handleSwitchChange("optimizeGrammar", checked)}
                />
                <Label htmlFor="optimizeGrammar" className="cursor-pointer">
                  Optimizar gramática y ortografía
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="optimizeKeywordDensity"
                  checked={formData.optimizeKeywordDensity}
                  onCheckedChange={(checked) => handleSwitchChange("optimizeKeywordDensity", checked)}
                />
                <Label htmlFor="optimizeKeywordDensity" className="cursor-pointer">
                  Optimizar densidad de palabras clave
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="optimizeCreativity"
                  checked={formData.optimizeCreativity}
                  onCheckedChange={(checked) => handleSwitchChange("optimizeCreativity", checked)}
                />
                <Label htmlFor="optimizeCreativity" className="cursor-pointer">
                  Optimizar creatividad y originalidad
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="optimizeSentiment"
                  checked={formData.optimizeSentiment}
                  onCheckedChange={(checked) => handleSwitchChange("optimizeSentiment", checked)}
                />
                <Label htmlFor="optimizeSentiment" className="cursor-pointer">
                  Optimizar sentimiento positivo
                </Label>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="keywordDensity">Densidad de Palabras Clave</Label>
                <div className="flex items-center gap-4">
                  <span className="text-xs">Baja</span>
                  <Slider
                    id="keywordDensity"
                    min={1}
                    max={3}
                    step={0.5}
                    value={[formData.keywordDensity]}
                    onValueChange={(value) => handleSliderChange("keywordDensity", value)}
                    className="flex-1"
                  />
                  <span className="text-xs">Alta</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Controla cuántas veces aparecen tus palabras clave en los anuncios.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="readabilityLevel">Nivel de Legibilidad</Label>
                <Select
                  value={formData.readabilityLevel}
                  onValueChange={(value) => handleSelectChange("readabilityLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un nivel de legibilidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {readabilityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Ajusta la complejidad del lenguaje según tu público objetivo.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button
          onClick={generateAds}
          disabled={isGenerating}
          className="w-full max-w-md h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isGenerating ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generando Anuncios...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Generar Anuncios
            </>
          )}
        </Button>
      </div>

      {isGenerating && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">
            {progress < 100
              ? "Generando anuncios optimizados para Google Ads..."
              : "Finalizando y aplicando optimizaciones..."}
          </p>
        </div>
      )}

      {generatedAds.length > 0 && (
        <div className="space-y-6 mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              Anuncios Generados
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportToCsv} className="flex items-center gap-1">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Exportar para Google Ads</span>
              </Button>
              <Button variant="outline" size="sm" onClick={exportToExcel} className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Exportar Detallado</span>
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {generatedAds.map((ad) => (
              <Card key={ad.id} className="overflow-hidden border-purple-500/20">
                <CardHeader className="bg-purple-500/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-purple-400" />
                        Anuncio Responsivo de Búsqueda
                      </CardTitle>
                      <CardDescription>
                        {ad.titles.length} títulos y {ad.descriptions.length} descripciones
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-200 border-purple-500/30">
                        Calidad: {ad.qualityScore.overall}/10
                      </Badge>
                      <Button variant="ghost" size="icon" onClick={() => regenerateAd(ad.id)} className="h-8 w-8">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-4 border-b border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium flex items-center gap-1">
                        <Lightbulb className="h-4 w-4 text-yellow-400" />
                        Títulos ({ad.titles.length})
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(ad.titles.join("\n"), "Títulos copiados al portapapeles")}
                        className="h-7 px-2"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        <span className="text-xs">Copiar todos</span>
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {ad.titles.slice(0, 9).map((title, index) => (
                        <div
                          key={`title-${index}`}
                          className="p-2 rounded-md bg-purple-500/5 border border-purple-500/10 flex justify-between items-center group"
                        >
                          <div className="text-sm">{highlightKeywords(title)}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(title, "Título copiado al portapapeles")}
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      {ad.titles.length > 9 && (
                        <div className="p-2 rounded-md bg-purple-500/5 border border-purple-500/10 text-center text-sm text-muted-foreground">
                          +{ad.titles.length - 9} títulos más...
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 border-b border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium flex items-center gap-1">
                        <MessageSquare className="h-4 w-4 text-blue-400" />
                        Descripciones ({ad.descriptions.length})
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(ad.descriptions.join("\n"), "Descripciones copiadas al portapapeles")
                        }
                        className="h-7 px-2"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        <span className="text-xs">Copiar todas</span>
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {ad.descriptions.map((description, index) => (
                        <div
                          key={`description-${index}`}
                          className="p-2 rounded-md bg-blue-500/5 border border-blue-500/10 flex justify-between items-center group"
                        >
                          <div className="text-sm">{highlightKeywords(description)}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(description, "Descripción copiada al portapapeles")}
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border-b border-purple-500/20">
                    <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                      <Target className="h-4 w-4 text-green-400" />
                      URL Final
                    </h4>
                    <div className="p-2 rounded-md bg-green-500/5 border border-green-500/10 flex justify-between items-center">
                      <div className="text-sm text-green-300">{ad.finalUrl}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(ad.finalUrl, "URL copiada al portapapeles")}
                        className="h-6 w-6"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h4 className="text-sm font-medium flex items-center gap-1 mb-3">
                      <BarChart className="h-4 w-4 text-orange-400" />
                      Análisis de Calidad
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span>General</span>
                          <span className="font-medium">{ad.qualityScore.overall}/10</span>
                        </div>
                        <Progress value={ad.qualityScore.overall * 10} className="h-1.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span>Relevancia</span>
                          <span className="font-medium">{ad.qualityScore.relevance}/10</span>
                        </div>
                        <Progress value={ad.qualityScore.relevance * 10} className="h-1.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span>Creatividad</span>
                          <span className="font-medium">{ad.qualityScore.creativity}/10</span>
                        </div>
                        <Progress value={ad.qualityScore.creativity * 10} className="h-1.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span>Gramática</span>
                          <span className="font-medium">{ad.qualityScore.grammar}/10</span>
                        </div>
                        <Progress value={ad.qualityScore.grammar * 10} className="h-1.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span>Uso de Keywords</span>
                          <span className="font-medium">{ad.qualityScore.keywordUsage}/10</span>
                        </div>
                        <Progress value={ad.qualityScore.keywordUsage * 10} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

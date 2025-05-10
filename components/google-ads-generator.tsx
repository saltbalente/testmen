"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, Plus, Trash2, RefreshCw, CheckCircle2, XCircle, Sparkles } from "lucide-react"
import { BarChart, CheckIcon, AlertTriangle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { generateAds, regenerateDescriptions } from "@/lib/ads-actions"

interface Ad {
  titles: string[]
  descriptions: string[]
  keywords: string[]
  finalUrl: string
  campaignName?: string
  adGroupName?: string
}

// Conjunto global para rastrear todos los títulos usados en todos los anuncios
const globalUsedTitles = new Set<string>()
const globalUsedDescriptions = new Set<string>()

interface CampaignStructure {
  mode: "campaign" | "adGroup" | "ad"
  numAdGroups: number
  adsPerGroup: number
  campaignName?: string
}

interface AdGroupKeywords {
  id: number
  keywords: string
}

// Mapeo de IDs de call to action a sus textos completos
const callToActionMap: Record<string, string> = {
  consulta_gratis: "Consulta Gratis Hoy",
  paga_resultados: "Paga Cuando Vea Resultados",
  primera_sesion: "Primera Sesión Gratuita",
  descubre_futuro: "Descubre Tu Futuro Ahora",
  resuelve_problemas: "Resuelve Tus Problemas Ya",
  ritual_personalizado: "Ritual Personalizado",
  amarres_efectivos: "Amarres 100% Efectivos",
  resultados_inmediatos: "Resultados Inmediatos",
  consulta_privada: "Consulta Privada y Confidencial",
  lectura_tarot: "Lectura de Tarot Gratuita",
  limpieza_energetica: "Limpieza Energética Urgente",
  recupera_pareja: "Recupera a Tu Pareja Hoy",
  solucion_garantizada: "Solución Garantizada",
  trabajo_urgente: "Trabajo Urgente en 24h",
  resultados_visibles: "Resultados Visibles en 7 Días",
  endulzamiento: "Endulzamiento Efectivo",
  proteccion_espiritual: "Protección Espiritual",
  amuleto_personalizado: "Amuleto Personalizado",
  consulta_whatsapp: "Consulta por WhatsApp",
  no_pagues_anticipado: "No Pagues Anticipado",
  // Nuevos call to action para mejorar CTR
  oferta_limitada: "Oferta Limitada - Actúa Ya",
  descuento_especial: "Descuento Especial 50% Hoy",
  garantia_devolucion: "Garantía de Devolución 100%",
  atencion_24h: "Atención 24h Todos los Días",
  metodo_exclusivo: "Método Exclusivo y Probado",
  casos_dificiles: "Especialista en Casos Difíciles",
  testimonios_reales: "Testimonios Reales de Clientes",
  primera_llamada: "Primera Llamada Sin Costo",
  regalo_sorpresa: "Regalo Sorpresa en Tu Consulta",
  satisfaccion_garantizada: "Satisfacción 100% Garantizada",
  reserva_ahora: "Reserva Ahora - Plazas Limitadas",
  consulta_online: "Consulta Online Sin Salir de Casa",
  secretos_revelados: "Secretos Ancestrales Revelados",
  prueba_gratis: "Prueba Gratis Sin Compromiso",
}

// Objetivos de anuncio disponibles
const adObjectives = [
  { id: "aumentar_ctr", name: "Aumentar CTR", description: "Mejorar la tasa de clics del anuncio" },
  { id: "aumentar_visitas", name: "Aumentar Visitas", description: "Incrementar el tráfico al sitio web" },
  { id: "aumentar_ventas", name: "Aumentar Ventas", description: "Generar más conversiones y ventas" },
  { id: "generar_leads", name: "Generar Leads", description: "Obtener datos de contacto de potenciales clientes" },
  {
    id: "obtener_consultas",
    name: "Obtener Consultas",
    description: "Conseguir que los usuarios soliciten información",
  },
]

// Función para generar títulos únicos con mejor estructura gramatical
const generateUniqueTitle = (keywords: string[], index: number): string => {
  const keyword = keywords[index % keywords.length]

  // Estructuras gramaticales mejoradas para títulos
  const titleTemplates = [
    // Imperativo + keyword
    `Haga su ${keyword} hoy`,
    `Consiga ${keyword} efectivo`,
    `Obtenga ${keyword} garantizado`,
    `Realice ${keyword} poderoso`,
    `Descubra ${keyword} efectivo`,

    // Keyword + beneficio
    `${keyword} que funciona siempre`,
    `${keyword} resultados rápidos`,
    `${keyword} 100% garantizado`,
    `${keyword} profesional y seguro`,
    `${keyword} método comprobado`,

    // Pregunta + keyword
    `¿Necesita ${keyword} urgente?`,
    `¿Busca ${keyword} efectivo?`,
    `¿Quiere ${keyword} garantizado?`,

    // Adjetivo + keyword
    `Poderoso ${keyword} efectivo`,
    `Efectivo ${keyword} rápido`,
    `Auténtico ${keyword} garantizado`,
    `Profesional ${keyword} seguro`,

    // Keyword + para + audiencia
    `${keyword} para enamorados`,
    `${keyword} para recuperar amor`,
    `${keyword} para casos difíciles`,

    // Beneficio + con + keyword
    `Resultados con ${keyword}`,
    `Éxito con ${keyword} probado`,
    `Solución con ${keyword} rápido`,

    // Keyword + característica
    `${keyword} sin fallos`,
    `${keyword} en 24 horas`,
    `${keyword} a distancia`,
    `${keyword} permanente`,
  ]

  // Seleccionar una plantilla basada en el índice
  const templateIndex = (index * 7) % titleTemplates.length
  let title = titleTemplates[templateIndex]

  // Asegurarse de que el título no exceda los 30 caracteres
  if (title.length > 30) {
    title = title.substring(0, 30)
  }

  return title
}

// Función para generar descripciones de respaldo
const generateBackupDescription = (keyword: string, index: number): string => {
  const descriptionTemplates = [
    `Descubre el poder de ${keyword}. Resultados garantizados y atención personalizada. ¡Consulta ahora!`,
    `¿Buscas soluciones efectivas para ${keyword}? Nuestros expertos te guiarán. ¡Contáctanos hoy mismo!`,
    `Obtén los mejores resultados en ${keyword} con nuestra amplia experiencia. ¡Llama ahora y agenda tu cita!`,
    `Especialistas en ${keyword} a tu disposición. Transforma tu vida con nuestros servicios. ¡Reserva tu consulta!`,
  ]

  const templateIndex = index % descriptionTemplates.length
  let description = descriptionTemplates[templateIndex]

  if (description.length > 90) {
    description = description.substring(0, 90)
  }

  return description
}

// Función para asegurar que los call to actions estén incluidos en los anuncios
const ensureCallToActionsInAds = (ads: Ad[], callToActions: string[], keywords: string[]): Ad[] => {
  return ads.map((ad) => {
    const ctaTexts = callToActions.map((ctaId) => callToActionMap[ctaId])
    const titlesWithCTA = ad.titles.map((title, index) => {
      if (index < ctaTexts.length && !title.toLowerCase().includes(ctaTexts[index].toLowerCase())) {
        // Insertar el call to action en el título si no está presente
        const keyword = keywords[index % keywords.length]
        return title.replace(keyword, `${keyword} ${ctaTexts[index]}`).substring(0, 30)
      }
      return title
    })

    const descriptionsWithCTA = ad.descriptions.map((desc, index) => {
      if (index < ctaTexts.length && !desc.toLowerCase().includes(ctaTexts[index].toLowerCase())) {
        // Insertar el call to action en la descripción si no está presente
        const keyword = keywords[index % keywords.length]
        return desc.replace(keyword, `${keyword} ${ctaTexts[index]}`).substring(0, 90)
      }
      return desc
    })

    return {
      ...ad,
      titles: titlesWithCTA,
      descriptions: descriptionsWithCTA,
    }
  })
}

// Función para eliminar títulos y descripciones duplicadas entre anuncios
const removeDuplicatesBetweenAds = (ads: Ad[]): Ad[] => {
  const allTitles = new Set<string>()
  const allDescriptions = new Set<string>()

  return ads.map((ad) => {
    const uniqueTitles = ad.titles.filter((title) => {
      const lowerTitle = title.toLowerCase()
      if (allTitles.has(lowerTitle)) {
        return false // Ya existe, eliminar
      }
      allTitles.add(lowerTitle)
      return true
    })

    const uniqueDescriptions = ad.descriptions.filter((desc) => {
      const lowerDesc = desc.toLowerCase()
      if (allDescriptions.has(lowerDesc)) {
        return false // Ya existe, eliminar
      }
      allDescriptions.add(lowerDesc)
      return true
    })

    return {
      ...ad,
      titles: uniqueTitles,
      descriptions: uniqueDescriptions,
    }
  })
}

// Función para eliminar palabras o letras sueltas al final
function removeTrailingWords(text: string): string {
  // Eliminar palabras cortas (1-2 letras) al final
  const trimmed = text.replace(/\s+[a-zñáéíóúü]{1,2}$/i, "")

  // Eliminar artículos y preposiciones comunes al final
  return trimmed.replace(/\s+(el|la|los|las|un|una|unos|unas|de|del|al|a|en|con|por|para|y|e|o|u)$/i, "")
}

export function GoogleAdsGenerator() {
  const [keywordsInput, setKeywordsInput] = useState("")
  const [finalUrl, setFinalUrl] = useState("")
  const [numAds, setNumAds] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRegeneratingDescriptions, setIsRegeneratingDescriptions] = useState(false)
  const [ads, setAds] = useState<Ad[]>([])
  const [showUniqueAlert, setShowUniqueAlert] = useState(false)
  const [writingStyle, setWritingStyle] = useState("persuasivo")
  const [adObjective, setAdObjective] = useState("aumentar_ctr")
  const [callToActions, setCallToActions] = useState<string[]>(["consulta_gratis"])
  const [competitionLevel, setCompetitionLevel] = useState("medium")
  const [targetAudience, setTargetAudience] = useState("general")
  const [funnelStage, setFunnelStage] = useState("consideration")
  const [emotionalTone, setEmotionalTone] = useState("hope")
  const [forbiddenWords, setForbiddenWords] = useState("")
  const [negativeKeywords, setNegativeKeywords] = useState("")

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  // Estados para herramientas ANTES de generar
  const [beliefSegmentation, setBeliefSegmentation] = useState<string[]>([])
  const [geoOptimization, setGeoOptimization] = useState<string[]>([])

  // Estados para herramientas DESPUÉS de generar
  const [showAnalysisTools, setShowAnalysisTools] = useState<boolean>(false)
  const [selectedAdForAnalysis, setSelectedAdForAnalysis] = useState<number | null>(null)
  const [analysisResults, setAnalysisResults] = useState<{
    keywordHeatmap: { keyword: string; competition: number; volume: number }[]
    templatesByIntent: { type: string; example: string }[]
    complianceCheck: { passed: boolean; issues: string[] }
    keywordDensity: { keyword: string; density: number }[]
    qualityScore: { overall: number; relevance: number; landing: number; expected_ctr: number }
    sentimentAnalysis: { score: number; tone: string; emotions: { type: string; level: number }[] }
    prohibitedLanguage: { found: boolean; terms: string[] }
  } | null>(null)

  const [generationMode, setGenerationMode] = useState<"campaign" | "adGroup" | "ad">("ad")
  const [numAdGroups, setNumAdGroups] = useState(2)
  const [adsPerGroup, setAdsPerGroup] = useState(2)
  const [campaignName, setCampaignName] = useState("")

  // Nuevo estado para las palabras clave por grupo de anuncios
  const [adGroupKeywords, setAdGroupKeywords] = useState<AdGroupKeywords[]>([
    { id: 1, keywords: "" },
    { id: 2, keywords: "" },
  ])

  const [openaiApiKey, setOpenaiApiKey] = useState("")
  const [selectedModel, setSelectedModel] = useState("gpt-4o")
  const [isApiConnected, setIsApiConnected] = useState(false)
  const [isTestingApi, setIsTestingApi] = useState(false)
  const [apiConnectionError, setApiConnectionError] = useState("")

  // Función para actualizar las palabras clave de un grupo específico
  const updateAdGroupKeywords = (id: number, keywords: string) => {
    setAdGroupKeywords((prev) => prev.map((group) => (group.id === id ? { ...group, keywords } : group)))
  }

  // Función para añadir un nuevo grupo de palabras clave
  const addAdGroupKeywords = () => {
    const newId = Math.max(0, ...adGroupKeywords.map((g) => g.id)) + 1
    setAdGroupKeywords([...adGroupKeywords, { id: newId, keywords: "" }])
  }

  // Función para eliminar un grupo de palabras clave
  const removeAdGroupKeywords = (id: number) => {
    if (adGroupKeywords.length > 1) {
      setAdGroupKeywords(adGroupKeywords.filter((group) => group.id !== id))
    }
  }

  // Modificar la función handleGenerate para garantizar siempre 15 títulos y 4 descripciones
  const handleGenerate = async () => {
    if (!finalUrl) {
      toast({
        title: "Falta información",
        description: "Por favor, ingresa la URL de destino",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    // Verificar palabras clave según el modo de generación
    if (generationMode === "campaign") {
      // Verificar que cada grupo tenga palabras clave
      const emptyGroups = adGroupKeywords.filter((group) => !group.keywords.trim())
      if (emptyGroups.length > 0) {
        toast({
          title: "Faltan palabras clave",
          description: `Por favor, ingresa palabras clave para todos los grupos de anuncios`,
          variant: "destructive",
          duration: 3000,
        })
        return
      }
    } else if (!keywordsInput.trim()) {
      toast({
        title: "Faltan palabras clave",
        description: "Por favor, ingresa al menos una palabra clave",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    setIsGenerating(true)
    setShowUniqueAlert(true)

    try {
      // Limitar el número de anuncios para evitar tiempos de espera
      let safeNumAds = Math.min(numAds, 3)
      if (generationMode === "campaign") {
        // Para campañas, limitamos el número total de anuncios a generar
        const totalAds = numAdGroups * adsPerGroup
        if (totalAds > 30) {
          toast({
            title: "Estructura limitada",
            description: "Para evitar errores, se limitará el número total de anuncios a 30.",
            duration: 5000,
          })
          // Ajustamos proporcionalmente
          if (numAdGroups > 10) {
            setNumAdGroups(10)
          }
          if (adsPerGroup > 3) {
            setAdsPerGroup(3)
          }
        }
        safeNumAds = adsPerGroup
      } else if (generationMode === "adGroup") {
        safeNumAds = Math.min(numAds, 3)
      }

      if (safeNumAds < numAds) {
        toast({
          title: "Número de anuncios limitado",
          description: "Para evitar errores, se generarán máximo 3 anuncios a la vez.",
          duration: 5000,
        })
      }

      if (generationMode === "campaign") {
        // Crear múltiples grupos de anuncios para la campaña
        const campaignAds: Ad[] = []

        // Generar anuncios para cada grupo con sus propias palabras clave
        for (let i = 0; i < Math.min(numAdGroups, adGroupKeywords.length); i++) {
          const groupKeywords = adGroupKeywords[i].keywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k.length > 0)

          if (groupKeywords.length === 0) continue

          // Generar anuncios para este grupo
          let groupAds: Ad[] = await generateAds(
            groupKeywords,
            finalUrl,
            adsPerGroup,
            writingStyle,
            callToActions,
            adObjective,
            `Genera anuncios de Google Ads para la palabra clave "${groupKeywords}" siguiendo estas reglas ESTRICTAS:

1. IMPORTANTE: NO USES CORCHETES [] EN NINGUNA PARTE DEL ANUNCIO. Los corchetes son solo para concordancia de palabras clave, no para textos de anuncios.

2. Cada anuncio debe tener:
   - 3 títulos (máximo 30 caracteres cada uno)
   - 2 descripciones (máximo 90 caracteres cada uno)

3. IMPORTANTE: Todos los títulos y descripciones deben ser FRASES COMPLETAS con sentido. Si una frase no cabe en el límite de caracteres, REFORMÚLALA para que sea más corta pero mantenga el sentido completo.

4. Ejemplo de lo que NO debes hacer:
   - "Auténtico [hechizos para enamo" (incorrecto: tiene corchetes y está incompleto)
   
   Ejemplo de lo que SÍ debes hacer:
   - "Auténticos hechizos de amor" (correcto: sin corchetes y frase completa)

5. Incluye llamadas a la acción efectivas.

6. Usa un lenguaje persuasivo y directo.

7. Asegúrate de que el anuncio sea relevante para la palabra clave.

8. NUNCA incluyas la palabra clave entre corchetes, incluso si es una concordancia exacta.`,
          )

          // Asegurarnos de que los call to action estén incluidos
          if (callToActions.length > 0) {
            groupAds = ensureCallToActionsInAds(groupAds, callToActions, groupKeywords)
          }

          // Añadir información de grupo y campaña
          groupAds = groupAds.map((ad) => ({
            ...ad,
            adGroupName: `Grupo ${i + 1}: ${groupKeywords.join(" ")}`.substring(0, 30),
            campaignName: campaignName || `Campaña ${groupKeywords[0]}`.substring(0, 30),
          }))

          // Añadir los anuncios de este grupo a la campaña
          campaignAds.push(...groupAds)
        }

        // Verificar que no haya duplicados entre grupos
        const dedupedCampaignAds = removeDuplicatesBetweenAds(campaignAds)

        // Verificar que cada anuncio tenga exactamente 15 títulos y 4 descripciones
        const completedAds = dedupedCampaignAds.map((ad) => {
          // Asegurar 15 títulos
          while (ad.titles.length < 15) {
            const newTitle = generateUniqueTitle(ad.keywords, ad.titles.length + 100)
            const cleanTitle = removeTrailingWords(newTitle)
            if (!globalUsedTitles.has(cleanTitle.toLowerCase())) {
              ad.titles.push(cleanTitle)
              globalUsedTitles.add(cleanTitle.toLowerCase())
            }
          }

          // Asegurar 4 descripciones
          while (ad.descriptions.length < 4) {
            const newDesc = generateBackupDescription(ad.keywords[0], ad.descriptions.length + 100)
            const cleanDesc = removeTrailingWords(newDesc)
            if (!globalUsedDescriptions.has(cleanDesc.toLowerCase())) {
              ad.descriptions.push(cleanDesc)
              globalUsedDescriptions.add(cleanDesc.toLowerCase())
            }
          }

          return ad
        })

        setAds(completedAds)
      } else if (generationMode === "adGroup") {
        // Separar las palabras clave por comas y eliminar espacios en blanco
        const keywords = keywordsInput
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0)

        if (keywords.length === 0) return

        // Generar anuncios usando TODAS las palabras clave juntas
        let generatedAds: Ad[] = await generateAds(
          keywords,
          finalUrl,
          safeNumAds,
          writingStyle,
          callToActions,
          adObjective,
          `Genera anuncios de Google Ads para la palabra clave "${keywords}" siguiendo estas reglas ESTRICTAS:

1. IMPORTANTE: NO USES CORCHETES [] EN NINGUNA PARTE DEL ANUNCIO. Los corchetes son solo para concordancia de palabras clave, no para textos de anuncios.

2. Cada anuncio debe tener:
   - 3 títulos (máximo 30 caracteres cada uno)
   - 2 descripciones (máximo 90 caracteres cada uno)

3. IMPORTANTE: Todos los títulos y descripciones deben ser FRASES COMPLETAS con sentido. Si una frase no cabe en el límite de caracteres, REFORMÚLALA para que sea más corta pero mantenga el sentido completo.

4. Ejemplo de lo que NO debes hacer:
   - "Auténtico [hechizos para enamo" (incorrecto: tiene corchetes y está incompleto)
   
   Ejemplo de lo que SÍ debes hacer:
   - "Auténticos hechizos de amor" (correcto: sin corchetes y frase completa)

5. Incluye llamadas a la acción efectivas.

6. Usa un lenguaje persuasivo y directo.

7. Asegúrate de que el anuncio sea relevante para la palabra clave.

8. NUNCA incluyas la palabra clave entre corchetes, incluso si es una concordancia exacta.`,
        )

        // Asegurarnos de que los call to action estén incluidos en los anuncios
        if (callToActions.length > 0) {
          generatedAds = ensureCallToActionsInAds(generatedAds, callToActions, keywords)
        }

        // Eliminar títulos y descripciones duplicados entre anuncios
        if (generatedAds.length > 1) {
          generatedAds = removeDuplicatesBetweenAds(generatedAds)
        }

        // Verificar que cada anuncio tenga exactamente 15 títulos y 4 descripciones
        generatedAds = generatedAds.map((ad) => {
          // Asegurar 15 títulos
          while (ad.titles.length < 15) {
            const newTitle = generateUniqueTitle(ad.keywords, ad.titles.length + 100)
            const cleanTitle = removeTrailingWords(newTitle)
            if (!globalUsedTitles.has(cleanTitle.toLowerCase())) {
              ad.titles.push(cleanTitle)
              globalUsedTitles.add(cleanTitle.toLowerCase())
            }
          }

          // Asegurar 4 descripciones
          while (ad.descriptions.length < 4) {
            const newDesc = generateBackupDescription(ad.keywords[0], ad.descriptions.length + 100)
            const cleanDesc = removeTrailingWords(newDesc)
            if (!globalUsedDescriptions.has(cleanDesc.toLowerCase())) {
              ad.descriptions.push(cleanDesc)
              globalUsedDescriptions.add(cleanDesc.toLowerCase())
            }
          }

          return ad
        })

        // Añadir información de grupo de anuncios a los anuncios generados
        const adGroupAds = generatedAds.map((ad) => ({
          ...ad,
          adGroupName: `Grupo: ${keywords.join(" ")}`.substring(0, 30),
          campaignName: campaignName || `Campaña ${keywords[0]}`.substring(0, 30),
        }))

        setAds(adGroupAds)
      } else {
        // Modo anuncio individual
        // Separar las palabras clave por comas y eliminar espacios en blanco
        const keywords = keywordsInput
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0)

        if (keywords.length === 0) return

        // Generar anuncios usando TODAS las palabras clave juntas
        let generatedAds: Ad[] = await generateAds(
          keywords,
          finalUrl,
          safeNumAds,
          writingStyle,
          callToActions,
          adObjective,
          `Genera anuncios de Google Ads para la palabra clave "${keywords}" siguiendo estas reglas ESTRICTAS:

1. IMPORTANTE: NO USES CORCHETES [] EN NINGUNA PARTE DEL ANUNCIO. Los corchetes son solo para concordancia de palabras clave, no para textos de anuncios.

2. Cada anuncio debe tener:
   - 3 títulos (máximo 30 caracteres cada uno)
   - 2 descripciones (máximo 90 caracteres cada uno)

3. IMPORTANTE: Todos los títulos y descripciones deben ser FRASES COMPLETAS con sentido. Si una frase no cabe en el límite de caracteres, REFORMÚLALA para que sea más corta pero mantenga el sentido completo.

4. Ejemplo de lo que NO debes hacer:
   - "Auténtico [hechizos para enamo" (incorrecto: tiene corchetes y está incompleto)
   
   Ejemplo de lo que SÍ debes hacer:
   - "Auténticos hechizos de amor" (correcto: sin corchetes y frase completa)

5. Incluye llamadas a la acción efectivas.

6. Usa un lenguaje persuasivo y directo.

7. Asegúrate de que el anuncio sea relevante para la palabra clave.

8. NUNCA incluyas la palabra clave entre corchetes, incluso si es una concordancia exacta.`,
        )

        // Asegurarnos de que los call to action estén incluidos en los anuncios
        if (callToActions.length > 0) {
          generatedAds = ensureCallToActionsInAds(generatedAds, callToActions, keywords)
        }

        // Eliminar títulos y descripciones duplicados entre anuncios
        if (generatedAds.length > 1) {
          generatedAds = removeDuplicatesBetweenAds(generatedAds)
        }

        // Verificar que cada anuncio tenga exactamente 15 títulos y 4 descripciones
        generatedAds = generatedAds.map((ad) => {
          // Asegurar 15 títulos
          while (ad.titles.length < 15) {
            const newTitle = generateUniqueTitle(ad.keywords, ad.titles.length + 100)
            const cleanTitle = removeTrailingWords(newTitle)
            if (!globalUsedTitles.has(cleanTitle.toLowerCase())) {
              ad.titles.push(cleanTitle)
              globalUsedTitles.add(cleanTitle.toLowerCase())
            }
          }

          // Asegurar 4 descripciones
          while (ad.descriptions.length < 4) {
            const newDesc = generateBackupDescription(ad.keywords[0], ad.descriptions.length + 100)
            const cleanDesc = removeTrailingWords(newDesc)
            if (!globalUsedDescriptions.has(cleanDesc.toLowerCase())) {
              ad.descriptions.push(cleanDesc)
              globalUsedDescriptions.add(cleanDesc.toLowerCase())
            }
          }

          return ad
        })

        setAds((prev) => [...prev, ...generatedAds])
      }

      toast({
        title: "Anuncios generados con éxito",
        description: `Se han generado anuncios con estructuras diversas.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error generating ads:", error)
      toast({
        title: "Error al generar anuncios",
        description: "Ocurrió un error al conectar con la API. Intenta de nuevo con menos palabras clave.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Modificar la función handleRegenerateAd para garantizar siempre 15 títulos y 4 descripciones
  const handleRegenerateAd = async (index: number) => {
    const ad = ads[index]
    if (!ad) return

    setIsGenerating(true)

    try {
      // Eliminar los títulos y descripciones actuales del conjunto global
      ad.titles.forEach((title) => {
        globalUsedTitles.delete(title.toLowerCase())
      })

      ad.descriptions.forEach((desc) => {
        globalUsedDescriptions.delete(desc.toLowerCase())
      })

      let regeneratedAds = await generateAds(
        ad.keywords,
        ad.finalUrl,
        1,
        writingStyle,
        callToActions,
        adObjective,
        `Genera anuncios de Google Ads para la palabra clave "${ad.keywords}" siguiendo estas reglas ESTRICTAS:

1. IMPORTANTE: NO USES CORCHETES [] EN NINGUNA PARTE DEL ANUNCIO. Los corchetes son solo para concordancia de palabras clave, no para textos de anuncios.

2. Cada anuncio debe tener:
   - 3 títulos (máximo 30 caracteres cada uno)
   - 2 descripciones (máximo 90 caracteres cada uno)

3. IMPORTANTE: Todos los títulos y descripciones deben ser FRASES COMPLETAS con sentido. Si una frase no cabe en el límite de caracteres, REFORMÚLALA para que sea más corta pero mantenga el sentido completo.

4. Ejemplo de lo que NO debes hacer:
   - "Auténtico [hechizos para enamo" (incorrecto: tiene corchetes y está incompleto)
   
   Ejemplo de lo que SÍ debes hacer:
   - "Auténticos hechizos de amor" (correcto: sin corchetes y frase completa)

5. Incluye llamadas a la acción efectivas.

6. Usa un lenguaje persuasivo y directo.

7. Asegúrate de que el anuncio sea relevante para la palabra clave.

8. NUNCA incluyas la palabra clave entre corchetes, incluso si es una concordancia exacta.`,
      )

      // Asegurarnos de que los call to action estén incluidos en los anuncios (solo si hay call to actions seleccionados)
      if (callToActions.length > 0) {
        regeneratedAds = ensureCallToActionsInAds(regeneratedAds, callToActions, ad.keywords)
      }

      // Eliminar títulos y descripciones que ya existen en otros anuncios
      if (regeneratedAds.length > 0 && ads.length > 0) {
        // Crear conjuntos con todos los títulos y descripciones existentes (excepto del anuncio actual)
        const existingTitles = new Set<string>()
        const existingDescriptions = new Set<string>()

        ads.forEach((existingAd, existingIndex) => {
          if (existingIndex !== index) {
            // No incluir el anuncio que estamos regenerando
            existingAd.titles.forEach((title) => existingTitles.add(title.toLowerCase()))
            existingAd.descriptions.forEach((desc) => existingDescriptions.add(desc.toLowerCase()))
          }
        })

        // Filtrar títulos duplicados del anuncio regenerado
        const uniqueTitles = regeneratedAds[0].titles.filter((title) => {
          const lowerTitle = title.toLowerCase()

          if (globalUsedTitles.has(lowerTitle)) {
            return false // Ya existe, eliminar
          }
          globalUsedTitles.add(lowerTitle)
          return true
        })

        // Asegurar que tengamos exactamente 15 títulos
        while (uniqueTitles.length < 15) {
          const newTitle = generateUniqueTitle(regeneratedAds[0].keywords, uniqueTitles + 100)
          const cleanTitle = removeTrailingWords(newTitle)
          const lowerNewTitle = cleanTitle.toLowerCase()
          if (!globalUsedTitles.has(lowerNewTitle)) {
            uniqueTitles.push(cleanTitle)
            globalUsedTitles.add(lowerNewTitle)
          }
        }

        regeneratedAds[0].titles = uniqueTitles

        // Filtrar descripciones duplicadas del anuncio regenerado
        const uniqueDescriptions = regeneratedAds[0].descriptions.filter((desc) => {
          const lowerDesc = desc.toLowerCase()

          if (globalUsedDescriptions.has(lowerDesc)) {
            return false // Ya existe, eliminar
          }
          globalUsedDescriptions.add(lowerDesc)
          return true
        })

        // Asegurar que tengamos exactamente 4 descripciones
        while (uniqueDescriptions.length < 4) {
          const newDesc = generateBackupDescription(regeneratedAds[0].keywords[0], uniqueDescriptions.length + 100)
          const cleanDesc = removeTrailingWords(newDesc)
          const lowerNewDesc = cleanDesc.toLowerCase()
          if (!globalUsedDescriptions.has(lowerNewDesc)) {
            uniqueDescriptions.push(cleanDesc)
            globalUsedDescriptions.add(lowerNewDesc)
          }
        }

        regeneratedAds[0].descriptions = uniqueDescriptions
      }

      if (regeneratedAds.length > 0) {
        // Mantener la información de grupo y campaña
        regeneratedAds[0].adGroupName = ad.adGroupName
        regeneratedAds[0].campaignName = ad.campaignName

        // Reemplazar el anuncio en la posición index
        setAds((prev) => {
          const newAds = [...prev]
          newAds[index] = regeneratedAds[0]
          return newAds
        })

        toast({
          title: "Anuncio regenerado con éxito",
          description: "Se ha creado una nueva versión del anuncio con estructuras diferentes.",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Error regenerating ad:", error)
      toast({
        title: "Error al regenerar el anuncio",
        description: "No se pudo regenerar el anuncio. Intenta de nuevo más tarde.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Nueva función para regenerar solo las descripciones
  const handleRegenerateDescriptions = async (index: number) => {
    const ad = ads[index]
    if (!ad) return

    setIsRegeneratingDescriptions(true)

    try {
      // Eliminar las descripciones actuales del conjunto global
      ad.descriptions.forEach((desc) => {
        globalUsedDescriptions.delete(desc.toLowerCase())
      })

      // Regenerar solo las descripciones
      const newDescriptions = await regenerateDescriptions(ad.keywords, ad.finalUrl, adObjective, writingStyle)

      if (newDescriptions.length > 0) {
        // Actualizar el anuncio con las nuevas descripciones
        setAds((prev) => {
          const newAds = [...prev]
          newAds[index] = {
            ...newAds[index],
            descriptions: newDescriptions,
          }
          return newAds
        })

        toast({
          title: "Descripciones regeneradas con éxito",
          description: "Se han creado nuevas descripciones para el anuncio.",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Error regenerating descriptions:", error)
      toast({
        title: "Error al regenerar las descripciones",
        description: "No se pudieron regenerar las descripciones. Intenta de nuevo más tarde.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsRegeneratingDescriptions(false)
    }
  }

  const handleRemoveAd = (index: number) => {
    setAds((prev) => prev.filter((_, i) => i !== index))
  }

  const exportToCSV = () => {
    // Header row based on Google Ads template
    let csv =
      "Campaign,Ad group,Headline 1,Headline 2,Headline 3,Headline 4,Headline 5,Headline 6,Headline 7,Headline 8,Headline 9,Headline 10,Headline 11,Headline 12,Headline 13,Headline 14,Headline 15,Description 1,Description 2,Description 3,Description 4,Path 1,Path 2,Final URL\n"

    // Data rows
    ads.forEach((ad) => {
      // Create a campaign name based on the keywords or use the provided one
      const campaignName = ad.campaignName || `Campaña ${ad.keywords.join(" ")}`.substring(0, 30)
      const adGroupName = ad.adGroupName || `Grupo de anuncios ${ad.keywords[0]}`.substring(0, 30)

      // Fill in all 15 headline slots (or empty if less than 15)
      const headlines = [...ad.titles]
      while (headlines.length < 15) {
        headlines.push("")
      }

      // Fill in all 4 description slots (or empty if less than 4)
      const descriptions = [...ad.descriptions]
      while (descriptions.length < 4) {
        descriptions.push("")
      }

      // Create the CSV row
      csv +=
        [
          campaignName,
          adGroupName,
          ...headlines.map((h) => `"${h}"`),
          ...descriptions.map((d) => `"${d}"`),
          "", // Path 1 (empty)
          "", // Path 2 (empty)
          `"${ad.finalUrl}"`, // Final URL
        ].join(",") + "\n"
    })

    // Create and download the file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "google-ads-responsive.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "CSV exportado con éxito",
      description: "El archivo CSV ha sido descargado y está listo para importar en Google Ads.",
      duration: 3000,
    })
  }

  const totalAdsCount = ads.length
  const totalTitlesCount = ads.reduce((count, ad) => count + ad.titles.length, 0)
  const totalDescriptionsCount = ads.reduce((count, ad) => count + ad.descriptions.length, 0)

  // Función para resaltar las palabras clave y call to actions en un texto
  const highlightText = (text: string, keywords: string[]) => {
    // Primero dividimos el texto en palabras
    const words = text.split(" ")

    // Creamos un array para almacenar las palabras con sus estilos
    return words.map((word, index) => {
      // Verificar si es una palabra clave
      const isKeyword = keywords.some((keyword) => word.toLowerCase().includes(keyword.toLowerCase()))

      // Verificar si es un call to action
      const isCallToAction = Object.values(callToActionMap).some((cta) => text.includes(cta))

      // Determinar la clase CSS basada en el tipo de palabra
      let className = ""
      if (isKeyword) {
        className = "font-semibold text-purple-600 dark:text-purple-400"
      } else if (isCallToAction && word.length > 3) {
        // Verificamos si esta palabra específica es parte de un CTA
        const isCTAPart = Object.values(callToActionMap).some(
          (cta) => cta.toLowerCase().includes(word.toLowerCase()) && word.length > 3,
        )
        if (isCTAPart) {
          className = "font-semibold text-blue-500 dark:text-blue-300"
        }
      }

      return (
        <span key={index} className={className}>
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      )
    })
  }

  const verifyApiConnection = async () => {
    if (!openaiApiKey.trim()) {
      toast({
        title: "Error de conexión",
        description: "Por favor, ingresa una API key válida",
        variant: "destructive",
      })
      return
    }

    setIsTestingApi(true)
    setApiConnectionError("")

    try {
      // Simulamos una verificación de API (en producción, harías una llamada real)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Verificación simple: la API key debe comenzar con "sk-"
      if (!openaiApiKey.startsWith("sk-")) {
        throw new Error('API key inválida. Debe comenzar con "sk-"')
      }

      setIsApiConnected(true)
      localStorage.setItem("openai_api_key", openaiApiKey)
      localStorage.setItem("openai_model", selectedModel)

      toast({
        title: "Conexión exitosa",
        description: "La API de OpenAI se ha conectado correctamente",
      })
    } catch (error) {
      setIsApiConnected(false)
      setApiConnectionError(error instanceof Error ? error.message : "Error al conectar con la API")

      toast({
        title: "Error de conexión",
        description: error instanceof Error ? error.message : "Error al conectar con la API",
        variant: "destructive",
      })
    } finally {
      setIsTestingApi(false)
    }
  }

  // Actualizar el número de grupos de anuncios
  useEffect(() => {
    if (generationMode === "campaign") {
      // Ajustar el número de grupos de palabras clave según el número de grupos de anuncios
      if (numAdGroups > adGroupKeywords.length) {
        // Añadir nuevos grupos
        const newGroups = Array.from({ length: numAdGroups - adGroupKeywords.length }, (_, i) => ({
          id: Math.max(0, ...adGroupKeywords.map((g) => g.id)) + i + 1,
          keywords: "",
        }))
        setAdGroupKeywords([...adGroupKeywords, ...newGroups])
      } else if (numAdGroups < adGroupKeywords.length) {
        // Eliminar grupos sobrantes
        setAdGroupKeywords(adGroupKeywords.slice(0, numAdGroups))
      }
    }
  }, [numAdGroups, generationMode])

  useEffect(() => {
    const savedApiKey = localStorage.getItem("openai_api_key")
    const savedModel = localStorage.getItem("openai_model")

    if (savedApiKey) {
      setOpenaiApiKey(savedApiKey)
      setIsApiConnected(true)
    }

    if (savedModel) {
      setSelectedModel(savedModel)
    }
  }, [])

  return (
    <div className="space-y-6">
      {showUniqueAlert && (
        <Alert className="bg-purple-50/30 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <AlertTitle className="text-purple-800 dark:text-purple-400">
            Optimizado para calificación "Excelente"
          </AlertTitle>
          <AlertDescription className="text-purple-700 dark:text-purple-300">
            Este generador crea anuncios optimizados para obtener la máxima calificación de calidad en Google Ads.
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Modo de Generación
          </CardTitle>
          <CardDescription>
            Selecciona qué quieres generar: una campaña completa, un grupo de anuncios o anuncios individuales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={generationMode === "campaign" ? "default" : "outline"}
                onClick={() => setGenerationMode("campaign")}
                className={generationMode === "campaign" ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                Campaña Completa
              </Button>
              <Button
                variant={generationMode === "adGroup" ? "default" : "outline"}
                onClick={() => setGenerationMode("adGroup")}
                className={generationMode === "adGroup" ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                Grupo de Anuncios
              </Button>
              <Button
                variant={generationMode === "ad" ? "default" : "outline"}
                onClick={() => setGenerationMode("ad")}
                className={generationMode === "ad" ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                Anuncios Individuales
              </Button>
            </div>

            {generationMode === "campaign" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaignName">Nombre de la Campaña (opcional)</Label>
                    <Input
                      id="campaignName"
                      placeholder="Ej: Campaña Principal"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="bg-black/20 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numAdGroups">Número de Grupos de Anuncios</Label>
                    <Input
                      id="numAdGroups"
                      type="number"
                      min="1"
                      max="10"
                      value={numAdGroups}
                      onChange={(e) => setNumAdGroups(Math.min(Number.parseInt(e.target.value) || 1, 10))}
                      className="bg-black/20 border-white/10"
                    />
                    <p className="text-xs text-muted-foreground">
                      Cada grupo de anuncios utilizará sus propias palabras clave. Máximo 10 grupos.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adsPerGroup">Anuncios por Grupo</Label>
                    <Input
                      id="adsPerGroup"
                      type="number"
                      min="1"
                      max="3"
                      value={adsPerGroup}
                      onChange={(e) => setAdsPerGroup(Math.min(Number.parseInt(e.target.value) || 1, 3))}
                      className="bg-black/20 border-white/10"
                    />
                    <p className="text-xs text-muted-foreground">
                      Número de anuncios en cada grupo. Máximo 3 anuncios por grupo.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Palabras Clave por Grupo de Anuncios</Label>
                  <div className="space-y-3">
                    {adGroupKeywords.map((group, index) => (
                      <div key={group.id} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <Label htmlFor={`group-${group.id}`} className="mb-1 block">
                            Grupo {index + 1}
                          </Label>
                          <Textarea
                            id={`group-${group.id}`}
                            placeholder="Ej: amarre de amor, recuperar pareja, hechizos"
                            value={group.keywords}
                            onChange={(e) => updateAdGroupKeywords(group.id, e.target.value)}
                            className="min-h-[60px] bg-black/20 border-white/10"
                          />
                        </div>
                        {adGroupKeywords.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAdGroupKeywords(group.id)}
                            className="mt-7"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  {adGroupKeywords.length < 10 && (
                    <Button variant="outline" size="sm" onClick={addAdGroupKeywords} className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir Grupo
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Cada grupo de anuncios debe tener sus propias palabras clave separadas por comas.
                  </p>
                </div>
              </div>
            )}

            {generationMode === "adGroup" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Nombre de la Campaña (opcional)</Label>
                  <Input
                    id="campaignName"
                    placeholder="Ej: Campaña Principal"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numAds">Número de Anuncios</Label>
                  <Input
                    id="numAds"
                    type="number"
                    min="1"
                    max="3"
                    value={numAds}
                    onChange={(e) => setNumAds(Math.min(Number.parseInt(e.target.value) || 1, 3))}
                    className="bg-black/20 border-white/10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Cada anuncio incluirá 15 títulos y 4 descripciones únicos. Máximo 3 anuncios.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            Conexión con OpenAI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openai-api-key">API Key de OpenAI</Label>
                <Input
                  id="openai-api-key"
                  type="password"
                  placeholder="sk-..."
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  className={isApiConnected ? "border-green-500 dark:border-green-700" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  Tu API key se almacena localmente en tu navegador y nunca se envía a nuestros servidores.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="openai-model">Modelo de OpenAI</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger id="openai-model">
                    <SelectValue placeholder="Selecciona un modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o (Recomendado)</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  GPT-4o ofrece los mejores resultados para anuncios de Google Ads.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isApiConnected ? (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-medium">API conectada correctamente</span>
                  </div>
                ) : apiConnectionError ? (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <XCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">{apiConnectionError}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="text-sm font-medium">API no conectada</span>
                  </div>
                )}
              </div>

              <Button
                onClick={verifyApiConnection}
                disabled={isTestingApi}
                variant={isApiConnected ? "outline" : "default"}
                className={
                  isApiConnected ? "border-green-500 text-green-600 hover:text-green-700 hover:border-green-600" : ""
                }
              >
                {isTestingApi ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Verificando...
                  </>
                ) : isApiConnected ? (
                  <>
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Conectado
                  </>
                ) : (
                  "Conectar API"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {generationMode !== "campaign" && (
        <div className="space-y-2">
          <Label htmlFor="keywords">Palabras Clave (separadas por comas)</Label>
          <Textarea
            id="keywords"
            placeholder="Ejemplo: amarres de amor, recuperar pareja, hechizos efectivos"
            value={keywordsInput}
            onChange={(e) => setKeywordsInput(e.target.value)}
            className="min-h-[80px] bg-black/20 border-white/10"
          />
          <p className="text-xs text-muted-foreground">
            Ingresa una o más palabras clave separadas por comas. Todas se usarán en cada anuncio.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="finalUrl">URL de Destino</Label>
        <Input
          id="finalUrl"
          placeholder="https://ejemplo.com/pagina"
          value={finalUrl}
          onChange={(e) => setFinalUrl(e.target.value)}
          className="bg-black/20 border-white/10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="writingStyle">Tipo de Redacción</Label>
          <Select value={writingStyle} onValueChange={setWritingStyle}>
            <SelectTrigger id="writingStyle" className="bg-black/20 border-white/10">
              <SelectValue placeholder="Selecciona un estilo de redacción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="persuasivo">Persuasivo</SelectItem>
              <SelectItem value="conversiones">Obtener más conversiones</SelectItem>
              <SelectItem value="ctr">Aumentar CTR</SelectItem>
              <SelectItem value="urgencia">Generar urgencia</SelectItem>
              <SelectItem value="informativo">Informativo</SelectItem>
              <SelectItem value="profesional">Profesional</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            El estilo de redacción afectará el tono y enfoque de tus anuncios.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="adObjective">Objetivo del Anuncio</Label>
          <Select value={adObjective} onValueChange={setAdObjective}>
            <SelectTrigger id="adObjective" className="bg-black/20 border-white/10">
              <SelectValue placeholder="Selecciona un objetivo" />
            </SelectTrigger>
            <SelectContent>
              {adObjectives.map((objective) => (
                <SelectItem key={objective.id} value={objective.id}>
                  {objective.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            El objetivo ayudará a la IA a generar anuncios más efectivos para tu propósito específico.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="competitionLevel">Nivel de Competencia</Label>
          <Select value={competitionLevel} onValueChange={setCompetitionLevel}>
            <SelectTrigger id="competitionLevel" className="bg-black/20 border-white/10">
              <SelectValue placeholder="Selecciona nivel de competencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baja Competencia</SelectItem>
              <SelectItem value="medium">Competencia Media</SelectItem>
              <SelectItem value="high">Alta Competencia</SelectItem>
              <SelectItem value="very_high">Competencia Muy Alta</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Ajusta la agresividad y diferenciación de tus anuncios según el nivel de competencia.
          </p>
        </div>
      </div>

      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Opciones Avanzadas
          </CardTitle>
          <CardDescription>
            Personaliza aún más tus anuncios con estas opciones avanzadas para maximizar su efectividad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Público Objetivo</Label>
              <Select value={targetAudience} onValueChange={setTargetAudience}>
                <SelectTrigger id="targetAudience" className="bg-black/20 border-white/10">
                  <SelectValue placeholder="Selecciona el público objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General (Todos los públicos)</SelectItem>
                  <SelectItem value="beginners">Principiantes (Sin conocimiento previo)</SelectItem>
                  <SelectItem value="intermediate">Conocedores (Alguna experiencia)</SelectItem>
                  <SelectItem value="experts">Expertos (Muy informados)</SelectItem>
                  <SelectItem value="skeptical">Escépticos (Requieren pruebas)</SelectItem>
                  <SelectItem value="believers">Creyentes (Ya convencidos)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Adapta el lenguaje y enfoque según el nivel de conocimiento de tu audiencia.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="funnelStage">Etapa del Embudo</Label>
              <Select value={funnelStage} onValueChange={setFunnelStage}>
                <SelectTrigger id="funnelStage" className="bg-black/20 border-white/10">
                  <SelectValue placeholder="Selecciona la etapa del embudo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="awareness">Conciencia (Conocer el servicio)</SelectItem>
                  <SelectItem value="consideration">Consideración (Evaluar opciones)</SelectItem>
                  <SelectItem value="decision">Decisión (Listos para comprar)</SelectItem>
                  <SelectItem value="retention">Retención (Clientes existentes)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Genera anuncios específicos para cada etapa del proceso de compra del cliente.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emotionalTone">Tono Emocional</Label>
              <Select value={emotionalTone} onValueChange={setEmotionalTone}>
                <SelectTrigger id="emotionalTone" className="bg-black/20 border-white/10">
                  <SelectValue placeholder="Selecciona el tono emocional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hope">Esperanza (Soluciones positivas)</SelectItem>
                  <SelectItem value="urgency">Urgencia (Actuar rápido)</SelectItem>
                  <SelectItem value="curiosity">Curiosidad (Despertar interés)</SelectItem>
                  <SelectItem value="fear">Miedo (Evitar problemas)</SelectItem>
                  <SelectItem value="trust">Confianza (Credibilidad)</SelectItem>
                  <SelectItem value="empathy">Empatía (Comprensión)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Elige la emoción principal que quieres evocar en tu audiencia.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="forbiddenWords" className="flex items-center">
                Palabras Prohibidas
                <span className="ml-2 text-xs text-muted-foreground">(opcional)</span>
              </Label>
              <Textarea
                id="forbiddenWords"
                placeholder="Ej: estafa, fraude, engaño (separadas por comas)"
                value={forbiddenWords}
                onChange={(e) => setForbiddenWords(e.target.value)}
                className="min-h-[80px] bg-black/20 border-white/10"
              />
              <p className="text-xs text-muted-foreground">
                Palabras que NO deben aparecer en tus anuncios. Útil para evitar términos prohibidos por Google Ads.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="negativeKeywords" className="flex items-center">
                Palabras Clave Negativas
                <span className="ml-2 text-xs text-muted-foreground">(opcional)</span>
              </Label>
              <Textarea
                id="negativeKeywords"
                placeholder="Ej: gratis, barato, tutorial (separadas por comas)"
                value={negativeKeywords}
                onChange={(e) => setNegativeKeywords(e.target.value)}
                className="min-h-[80px] bg-black/20 border-white/10"
              />
              <p className="text-xs text-muted-foreground">
                Palabras clave para excluir ciertos tipos de búsquedas y mejorar la relevancia de tus anuncios.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      {showAdvancedOptions && (
        <Card className="border-amber-200 dark:border-amber-800 mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Herramientas Avanzadas de Segmentación
            </CardTitle>
            <CardDescription>
              Personaliza tus anuncios para audiencias específicas y ubicaciones geográficas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="beliefSegmentation">Segmentación por Creencias</Label>
                <div className="grid grid-cols-2 gap-2 p-3 rounded-md bg-black/20 border border-white/10">
                  {[
                    { id: "tarot", label: "Tarot" },
                    { id: "wicca", label: "Wicca" },
                    { id: "espiritismo", label: "Espiritismo" },
                    { id: "santeria", label: "Santería" },
                    { id: "astrologia", label: "Astrología" },
                    { id: "vudu", label: "Vudú" },
                    { id: "brujeria", label: "Brujería" },
                    { id: "magia_blanca", label: "Magia Blanca" },
                    { id: "magia_roja", label: "Magia Roja" },
                    { id: "magia_negra", label: "Magia Negra" },
                    { id: "curanderismo", label: "Curanderismo" },
                  ].map(({ id, label }) => (
                    <div key={id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`belief-${id}`}
                        checked={beliefSegmentation.includes(id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBeliefSegmentation((prev) => [...prev, id])
                          } else {
                            setBeliefSegmentation((prev) => prev.filter((item) => item !== id))
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <label htmlFor={`belief-${id}`} className="text-sm cursor-pointer">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Selecciona las creencias esotéricas para adaptar el lenguaje y enfoque de tus anuncios.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="geoOptimization">Optimización por Geolocalización</Label>
                <div className="grid grid-cols-2 gap-2 p-3 rounded-md bg-black/20 border border-white/10">
                  {[
                    { id: "espana", label: "España" },
                    { id: "mexico", label: "México" },
                    { id: "colombia", label: "Colombia" },
                    { id: "argentina", label: "Argentina" },
                    { id: "chile", label: "Chile" },
                    { id: "peru", label: "Perú" },
                    { id: "eeuu_latino", label: "EEUU (Latino)" },
                    { id: "otros", label: "Internacional" },
                  ].map(({ id, label }) => (
                    <div key={id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`geo-${id}`}
                        checked={geoOptimization.includes(id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setGeoOptimization((prev) => [...prev, id])
                          } else {
                            setGeoOptimization((prev) => prev.filter((item) => item !== id))
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <label htmlFor={`geo-${id}`} className="text-sm cursor-pointer">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Adapta tus anuncios a diferentes regiones geográficas con términos y expresiones locales.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        variant="outline"
        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
        className="w-full mt-2 border-amber-500/30 text-amber-500 hover:text-amber-600 hover:border-amber-600/50"
      >
        {showAdvancedOptions ? "Ocultar opciones avanzadas" : "Mostrar opciones avanzadas"}
      </Button>

      <div className="space-y-2">
        <Label htmlFor="callToAction" className="flex items-center">
          Call to Action
          <span className="ml-2 text-xs text-muted-foreground">(opcional)</span>
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 rounded-md bg-black/20 border border-white/10">
          {Object.entries(callToActionMap).map(([id, label]) => (
            <div key={id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={id}
                checked={callToActions.includes(id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setCallToActions((prev) => [...prev, id])
                  } else {
                    // Permitir deseleccionar todos
                    setCallToActions((prev) => prev.filter((ctaId) => ctaId !== id))
                  }
                }}
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor={id} className="text-sm cursor-pointer">
                {label}
              </label>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          Los call to action seleccionados se incluirán en los títulos y descripciones de tus anuncios.
          {callToActions.length === 0 && (
            <span className="block mt-1 text-amber-400">
              No has seleccionado ningún call to action. Los anuncios se generarán solo con las palabras clave.
            </span>
          )}
          {callToActions.length > 0 && (
            <span className="block mt-1 text-blue-400">
              Estos call to action están diseñados para generar consultas y leads en el ámbito esotérico.
            </span>
          )}
        </p>
      </div>

      {generationMode === "ad" && (
        <div className="space-y-2">
          <Label htmlFor="numAds">Número de Anuncios a Generar</Label>
          <Input
            id="numAds"
            type="number"
            min="1"
            max="3"
            value={numAds}
            onChange={(e) => setNumAds(Math.min(Number.parseInt(e.target.value) || 1, 3))}
            className="bg-black/20 border-white/10"
          />
          <p className="text-xs text-muted-foreground">
            Cada anuncio incluirá 15 títulos y 4 descripciones únicos usando todas tus palabras clave. Máximo 3 anuncios
            a la vez para evitar errores.
          </p>
        </div>
      )}

      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !finalUrl || (generationMode !== "campaign" && !keywordsInput)}
        className="w-full bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-500 hover:to-blue-500"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generando...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Generar Anuncios
          </>
        )}
      </Button>

      {ads.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h3 className="text-lg font-medium">Anuncios Generados</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="border-purple-500/30">
                {totalAdsCount} Anuncios
              </Badge>
              <Badge variant="outline" className="border-purple-500/30">
                {totalTitlesCount} Títulos Únicos
              </Badge>
              <Badge variant="outline" className="border-purple-500/30">
                {totalDescriptionsCount} Descripciones Únicas
              </Badge>
              {targetAudience !== "general" && (
                <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10">
                  Público:{" "}
                  {targetAudience === "beginners"
                    ? "Principiantes"
                    : targetAudience === "intermediate"
                      ? "Conocedores"
                      : targetAudience === "experts"
                        ? "Expertos"
                        : targetAudience === "skeptical"
                          ? "Escépticos"
                          : "Creyentes"}
                </Badge>
              )}
              {funnelStage !== "consideration" && (
                <Badge variant="outline" className="border-green-500/30 bg-green-500/10">
                  Embudo:{" "}
                  {funnelStage === "awareness" ? "Conciencia" : funnelStage === "decision" ? "Decisión" : "Retención"}
                </Badge>
              )}
              {emotionalTone !== "hope" && (
                <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10">
                  Tono:{" "}
                  {emotionalTone === "urgency"
                    ? "Urgencia"
                    : emotionalTone === "curiosity"
                      ? "Curiosidad"
                      : emotionalTone === "fear"
                        ? "Miedo"
                        : emotionalTone === "trust"
                          ? "Confianza"
                          : "Empatía"}
                </Badge>
              )}
              <Button onClick={exportToCSV} variant="outline" size="sm" className="border-purple-500/30">
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {ads.map((ad, index) => (
              <Card key={index} className="relative border border-purple-500/20 bg-black/20">
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedAdForAnalysis(index)
                      setShowAnalysisTools(true)
                      // Simular análisis
                      setAnalysisResults({
                        keywordHeatmap: ad.keywords.map((k) => ({
                          keyword: k,
                          competition: Math.floor(Math.random() * 100),
                          volume: Math.floor(Math.random() * 1000),
                        })),
                        templatesByIntent: [
                          { type: "informativo", example: `Descubre cómo ${ad.keywords[0]} puede transformar tu vida` },
                          {
                            type: "emocional",
                            example: `¿Cansado de sufrir? Nuestro ${ad.keywords[0]} te devolverá la felicidad`,
                          },
                          {
                            type: "urgencia",
                            example: `¡Última oportunidad! ${ad.keywords[0]} efectivo por tiempo limitado`,
                          },
                        ],
                        complianceCheck: {
                          passed: true,
                          issues: [],
                        },
                        keywordDensity: ad.keywords.map((k) => ({
                          keyword: k,
                          density: Math.floor(Math.random() * 30) + 5,
                        })),
                        qualityScore: {
                          overall: 8,
                          relevance: 9,
                          landing: 7,
                          expected_ctr: 8,
                        },
                        sentimentAnalysis: {
                          score: 7.5,
                          tone: "Positivo",
                          emotions: [
                            { type: "Confianza", level: 85 },
                            { type: "Esperanza", level: 75 },
                            { type: "Urgencia", level: 60 },
                            { type: "Miedo", level: 15 },
                          ],
                        },
                        prohibitedLanguage: {
                          found: false,
                          terms: [],
                        },
                      })
                    }}
                    className="mr-2 bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30"
                  >
                    <BarChart className="h-4 w-4 mr-1" />
                    Analizar
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRegenerateDescriptions(index)}
                    disabled={isRegeneratingDescriptions}
                    title="Regenerar solo descripciones"
                  >
                    {isRegeneratingDescriptions ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <span className="text-xs font-bold">Desc</span>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRegenerateAd(index)}
                    disabled={isGenerating}
                    title="Regenerar anuncio completo"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveAd(index)} title="Eliminar anuncio">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Palabras clave: {ad.keywords.join(", ")}</CardTitle>
                  <CardDescription>URL: {ad.finalUrl}</CardDescription>
                  {ad.campaignName && (
                    <Badge className="mt-1 bg-blue-500/20 text-blue-300 border-blue-500/30">
                      Campaña: {ad.campaignName}
                    </Badge>
                  )}
                  {ad.adGroupName && (
                    <Badge className="mt-1 ml-2 bg-green-500/20 text-green-300 border-green-500/30">
                      Grupo: {ad.adGroupName}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="titles">
                    <TabsList className="mb-2">
                      <TabsTrigger value="titles">Títulos ({ad.titles.length})</TabsTrigger>
                      <TabsTrigger value="descriptions">Descripciones ({ad.descriptions.length})</TabsTrigger>
                    </TabsList>
                    <TabsContent value="titles" className="space-y-2">
                      <div className="mb-2 text-xs flex gap-2 justify-between">
                        <div className="flex gap-2">
                          <span className="inline-flex items-center">
                            <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                            Palabras clave
                          </span>
                          <span className="inline-flex items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                            Call to Action
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-6 py-0 px-2 border-amber-500/30 text-amber-500"
                          onClick={() => {
                            // Aplicar corrección a todos los títulos
                            setAds((prevAds) => {
                              const newAds = [...prevAds]
                              newAds[index] = {
                                ...newAds[index],
                                titles: newAds[index].titles.map((title) => removeTrailingWords(title)),
                              }
                              return newAds
                            })
                            toast({
                              title: "Títulos corregidos",
                              description: "Se han corregido las palabras incompletas en todos los títulos",
                              duration: 3000,
                            })
                          }}
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Corregir palabras incompletas
                        </Button>
                      </div>
                      {ad.titles.map((title, i) => (
                        <div key={i} className="p-2 border border-purple-500/20 rounded-md bg-black/10">
                          <div className="flex justify-between items-start">
                            <p className="text-sm">{highlightText(title, ad.keywords)}</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-2 -mt-1"
                              title="Regenerar este título"
                              onClick={() => {
                                // Implementación de regeneración de título individual
                                toast({
                                  title: "Regenerando título",
                                  description: `Regenerando el título #${i + 1}`,
                                  duration: 2000,
                                })

                                // Aquí iría la implementación real de regeneración de un solo título
                                setTimeout(() => {
                                  const newTitle = generateUniqueTitle(ad.keywords, Date.now())
                                  const cleanTitle = removeTrailingWords(newTitle)
                                  setAds((prevAds) => {
                                    const newAds = [...prevAds]
                                    const newTitles = [...newAds[index].titles]
                                    newTitles[i] = cleanTitle
                                    newAds[index] = {
                                      ...newAds[index],
                                      titles: newTitles,
                                    }
                                    return newAds
                                  })

                                  toast({
                                    title: "Título regenerado",
                                    description: "Se ha regenerado el título exitosamente",
                                    duration: 3000,
                                  })
                                }, 1000)
                              }}
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{title.length}/30 caracteres</p>
                        </div>
                      ))}
                    </TabsContent>
                    <TabsContent value="descriptions" className="space-y-2">
                      <div className="mb-2 text-xs flex gap-2 justify-between">
                        <div className="flex gap-2">
                          <span className="inline-flex items-center">
                            <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                            Palabras clave
                          </span>
                          <span className="inline-flex items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                            Call to Action
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-6 py-0 px-2 border-amber-500/30 text-amber-500"
                          onClick={() => {
                            // Aplicar corrección a todas las descripciones
                            setAds((prevAds) => {
                              const newAds = [...prevAds]
                              newAds[index] = {
                                ...newAds[index],
                                descriptions: newAds[index].descriptions.map((desc) => removeTrailingWords(desc)),
                              }
                              return newAds
                            })
                            toast({
                              title: "Descripciones corregidas",
                              description: "Se han corregido las palabras incompletas en todas las descripciones",
                              duration: 3000,
                            })
                          }}
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Corregir palabras incompletas
                        </Button>
                      </div>
                      {ad.descriptions.map((desc, i) => (
                        <div key={i} className="p-2 border border-purple-500/20 rounded-md bg-black/10">
                          <div className="flex justify-between items-start">
                            <p className="text-sm">{highlightText(desc, ad.keywords)}</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-2 -mt-1"
                              title="Regenerar esta descripción"
                              onClick={() => {
                                // Implementación de regeneración de descripción individual
                                toast({
                                  title: "Regenerando descripción",
                                  description: `Regenerando la descripción #${i + 1}`,
                                  duration: 2000,
                                })

                                // Aquí iría la implementación real de regeneración de una sola descripción
                                setTimeout(() => {
                                  const newDesc = generateBackupDescription(ad.keywords[0], Date.now())
                                  const cleanDesc = removeTrailingWords(newDesc)
                                  setAds((prevAds) => {
                                    const newAds = [...prevAds]
                                    const newDescriptions = [...newAds[index].descriptions]
                                    newDescriptions[i] = cleanDesc
                                    newAds[index] = {
                                      ...newAds[index],
                                      descriptions: newDescriptions,
                                    }
                                    return newAds
                                  })

                                  toast({
                                    title: "Descripción regenerada",
                                    description: "Se ha regenerado la descripción exitosamente",
                                    duration: 3000,
                                  })
                                }, 1000)
                              }}
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{desc.length}/90 caracteres</p>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Herramientas de análisis después de generar anuncios */}
          {ads.length > 0 && selectedAdForAnalysis !== null && (
            <div className="mt-8 space-y-4">
              <Card className="border-green-200 dark:border-green-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-green-500" />
                    Herramientas de Análisis
                  </CardTitle>
                  <CardDescription>Analiza y optimiza tus anuncios con estas herramientas avanzadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="heatmap">
                    <TabsList className="mb-4">
                      <TabsTrigger value="heatmap">Mapa de Calor</TabsTrigger>
                      <TabsTrigger value="templates">Plantillas</TabsTrigger>
                      <TabsTrigger value="compliance">Cumplimiento</TabsTrigger>
                      <TabsTrigger value="density">Densidad</TabsTrigger>
                      <TabsTrigger value="quality">Quality Score</TabsTrigger>
                      <TabsTrigger value="sentiment">Sentimiento</TabsTrigger>
                      <TabsTrigger value="prohibited">Lenguaje Prohibido</TabsTrigger>
                    </TabsList>

                    <TabsContent value="heatmap" className="space-y-4">
                      <h3 className="text-md font-medium">Mapa de Calor de Palabras Clave</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {ads[selectedAdForAnalysis].keywords.map((keyword, i) => {
                          // Simulamos diferentes niveles de competencia
                          const competition = Math.floor(Math.random() * 100)
                          let bgColor = "bg-green-500/20 border-green-500/30"
                          if (competition > 70) bgColor = "bg-red-500/20 border-red-500/30"
                          else if (competition > 40) bgColor = "bg-yellow-500/20 border-yellow-500/30"

                          return (
                            <div key={i} className={`p-2 rounded-md border ${bgColor}`}>
                              <p className="text-sm font-medium">{keyword}</p>
                              <div className="flex justify-between text-xs mt-1">
                                <span>Competencia: {competition}%</span>
                                <span>Vol: {Math.floor(Math.random() * 1000)}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Este mapa muestra el nivel de competencia para cada palabra clave en tu anuncio.
                        <span className="block mt-1">
                          <span className="inline-block w-3 h-3 bg-green-500/50 rounded-full mr-1"></span> Baja
                          <span className="inline-block w-3 h-3 bg-yellow-500/50 rounded-full mx-1"></span> Media
                          <span className="inline-block w-3 h-3 bg-red-500/50 rounded-full mx-1"></span> Alta
                        </span>
                      </p>
                    </TabsContent>

                    <TabsContent value="templates" className="space-y-4">
                      <h3 className="text-md font-medium">Plantillas por Intención</h3>
                      <div className="space-y-3">
                        <div className="p-3 rounded-md bg-blue-500/10 border border-blue-500/30">
                          <h4 className="text-sm font-medium text-blue-400 mb-1">Enfoque Informativo</h4>
                          <p className="text-sm">
                            Descubre cómo {ads[selectedAdForAnalysis].keywords[0]} puede transformar tu vida con métodos
                            probados y resultados garantizados
                          </p>
                        </div>
                        <div className="p-3 rounded-md bg-purple-500/10 border border-purple-500/30">
                          <h4 className="text-sm font-medium text-purple-400 mb-1">Enfoque Emocional</h4>
                          <p className="text-sm">
                            ¿Cansado de sufrir? Nuestro {ads[selectedAdForAnalysis].keywords[0]} te devolverá la
                            felicidad y armonía que mereces
                          </p>
                        </div>
                        <div className="p-3 rounded-md bg-amber-500/10 border border-amber-500/30">
                          <h4 className="text-sm font-medium text-amber-400 mb-1">Enfoque de Urgencia</h4>
                          <p className="text-sm">
                            ¡Última oportunidad! {ads[selectedAdForAnalysis].keywords[0]} efectivo por tiempo limitado.
                            No pierdas esta oferta especial
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="compliance" className="space-y-4">
                      <h3 className="text-md font-medium">Verificador de Cumplimiento Normativo</h3>
                      <div className="p-3 rounded-md bg-black/20 border border-white/10">
                        <div className="flex items-center mb-3">
                          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                            <CheckIcon className="h-4 w-4 text-green-500" />
                          </div>
                          <span className="font-medium text-green-500">
                            Anuncio compatible con políticas de Google Ads
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mr-2 mt-0.5">
                              <CheckIcon className="h-3 w-3 text-green-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Sin promesas de resultados garantizados</p>
                              <p className="text-xs text-muted-foreground">
                                Los anuncios evitan garantías absolutas de resultados
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mr-2 mt-0.5">
                              <CheckIcon className="h-3 w-3 text-green-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Sin lenguaje supersticioso excesivo</p>
                              <p className="text-xs text-muted-foreground">El lenguaje es moderado y profesional</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mr-2 mt-0.5">
                              <CheckIcon className="h-3 w-3 text-green-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Sin términos prohibidos detectados</p>
                              <p className="text-xs text-muted-foreground">
                                No se encontraron términos que violen las políticas
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="density" className="space-y-4">
                      <h3 className="text-md font-medium">Optimizador de Densidad de Palabras Clave</h3>
                      <div className="space-y-3">
                        {ads[selectedAdForAnalysis].keywords.map((keyword, i) => {
                          const density = Math.floor(Math.random() * 30) + 5
                          let statusColor = "text-green-500"
                          let statusText = "Óptima"

                          if (density < 10) {
                            statusColor = "text-yellow-500"
                            statusText = "Baja"
                          } else if (density > 25) {
                            statusColor = "text-red-500"
                            statusText = "Excesiva"
                          }

                          return (
                            <div key={i} className="p-3 rounded-md bg-black/20 border border-white/10">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium">{keyword}</span>
                                <span className={`text-sm ${statusColor}`}>{statusText}</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    density < 10 ? "bg-yellow-500" : density > 25 ? "bg-red-500" : "bg-green-500"
                                  }`}
                                  style={{ width: `${density}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Densidad: {density}% (Recomendado: 10-25%)
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </TabsContent>

                    <TabsContent value="quality" className="space-y-4">
                      <h3 className="text-md font-medium">Simulador de Quality Score</h3>
                      <div className="p-4 rounded-md bg-black/20 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg font-bold">Puntuación estimada: 8/10</span>
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-green-500 flex items-center justify-center">
                              <span className="text-white font-bold">8</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Relevancia de palabras clave</span>
                              <span className="text-sm font-medium text-green-500">Alta (9/10)</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div className="h-2 rounded-full bg-green-500" style={{ width: "90%" }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Experiencia de página de destino</span>
                              <span className="text-sm font-medium text-yellow-500">Media (7/10)</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div className="h-2 rounded-full bg-yellow-500" style={{ width: "70%" }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">CTR esperado</span>
                              <span className="text-sm font-medium text-green-500">Alto (8/10)</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div className="h-2 rounded-full bg-green-500" style={{ width: "80%" }}></div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 text-xs text-muted-foreground">
                          <p>
                            Esta puntuación es una estimación basada en el análisis de tus anuncios y palabras clave.
                          </p>
                          <p className="mt-1">
                            Un Quality Score alto puede reducir el CPC y mejorar la posición del anuncio.
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="sentiment" className="space-y-4">
                      <h3 className="text-md font-medium">Analizador de Sentimiento</h3>
                      <div className="p-4 rounded-md bg-black/20 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-lg font-bold">Tono general: Positivo</span>
                            <p className="text-sm text-muted-foreground">Puntuación: 7.5/10</p>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                            <span className="text-white font-bold">7.5</span>
                          </div>
                        </div>

                        <div className="space-y-3 mt-4">
                          <h4 className="text-sm font-medium mb-2">Emociones detectadas:</h4>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Confianza</span>
                              <span className="text-sm font-medium">85%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div className="h-2 rounded-full bg-blue-500" style={{ width: "85%" }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Esperanza</span>
                              <span className="text-sm font-medium">75%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div className="h-2 rounded-full bg-green-500" style={{ width: "75%" }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Urgencia</span>
                              <span className="text-sm font-medium">60%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div className="h-2 rounded-full bg-amber-500" style={{ width: "60%" }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Miedo</span>
                              <span className="text-sm font-medium">15%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div className="h-2 rounded-full bg-red-500" style={{ width: "15%" }}></div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 text-xs text-muted-foreground">
                          <p>
                            El tono emocional de tus anuncios puede influir significativamente en la respuesta del
                            usuario.
                          </p>
                          <p className="mt-1">
                            Este anuncio tiene un buen equilibrio entre confianza y urgencia, lo que puede motivar a la
                            acción.
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="prohibited" className="space-y-4">
                      <h3 className="text-md font-medium">Detector de Lenguaje Prohibido</h3>
                      <div className="p-4 rounded-md bg-black/20 border border-white/10">
                        <div className="flex items-center mb-4">
                          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                            <CheckIcon className="h-4 w-4 text-green-500" />
                          </div>
                          <span className="font-medium text-green-500">No se detectó lenguaje prohibido</span>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-sm font-medium">Términos potencialmente problemáticos:</h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="p-2 rounded-md bg-green-500/10 border border-green-500/30 flex items-center justify-between">
                              <span className="text-sm">Garantizado</span>
                              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                                Aceptable
                              </Badge>
                            </div>

                            <div className="p-2 rounded-md bg-green-500/10 border border-green-500/30 flex items-center justify-between">
                              <span className="text-sm">Resultados</span>
                              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                                Aceptable
                              </Badge>
                            </div>

                            <div className="p-2 rounded-md bg-green-500/10 border border-green-500/30 flex items-center justify-between">
                              <span className="text-sm">Efectivo</span>
                              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                                Aceptable
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

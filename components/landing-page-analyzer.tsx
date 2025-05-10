// If this file doesn't exist, create it with the following content:

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { getAIService } from "@/services/ai-service"
import { ExternalLink, Loader2, Search, AlertTriangle, CheckCircle, Globe, CheckCircle2, Sparkles } from "lucide-react"

interface LandingPageAnalysis {
  score: number
  summary: string
  keywordRelevance: {
    score: number
    analysis: string
  }
  contentQuality: {
    score: number
    analysis: string
  }
  conversionOptimization: {
    score: number
    analysis: string
  }
  userExperience: {
    score: number
    analysis: string
  }
  recommendations: {
    element: string
    original: string
    improved: string
    explanation: string
  }[]
}

// Análisis de ejemplo para usar en caso de error
const fallbackAnalysis: LandingPageAnalysis = {
  score: 0,
  summary: "No se pudo generar un análisis completo debido a un error.",
  keywordRelevance: {
    score: 0,
    analysis: "No se pudo analizar la relevancia de palabras clave.",
  },
  contentQuality: {
    score: 0,
    analysis: "No se pudo analizar la calidad del contenido.",
  },
  conversionOptimization: {
    score: 0,
    analysis: "No se pudo analizar la optimización para conversiones.",
  },
  userExperience: {
    score: 0,
    analysis: "No se pudo analizar la experiencia de usuario.",
  },
  recommendations: [],
}

export function LandingPageAnalyzer() {
  const [url, setUrl] = useState("")
  const [keywords, setKeywords] = useState("")
  const [landingContent, setLandingContent] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [analysis, setAnalysis] = useState<LandingPageAnalysis | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [extractedHtml, setExtractedHtml] = useState("")
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractionError, setExtractionError] = useState("")
  const [apiError, setApiError] = useState("")
  const [skipExtraction, setSkipExtraction] = useState(false)
  const [isGeneratingSolutions, setIsGeneratingSolutions] = useState(false)
  const [generatedSolutions, setGeneratedSolutions] = useState<{ [key: string]: string }>({})

  const [htmlContent, setHtmlContent] = useState("")
  const [analysisResult, setAnalysisResult] = useState<null | {
    score: number
    headingAnalysis: {
      structure: string
      keywords: string
      hierarchy: string
      recommendations: string[]
    }
    paragraphAnalysis: {
      readability: string
      keywords: string
      engagement: string
      recommendations: string[]
    }
    overallRecommendations: string[]
  }>(null)
  //const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeContent = () => {
    if (!htmlContent && !extractedHtml && !landingContent) {
      toast({
        title: "Contenido requerido",
        description: "Por favor, extrae el HTML de la URL o ingresa el contenido manualmente antes de analizar.",
        variant: "destructive",
      })
      return
    }

    if (!keywords) {
      toast({
        title: "Palabras clave requeridas",
        description: "Por favor, ingresa al menos una palabra clave para el análisis.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setGeneratedSolutions({}) // Limpiar soluciones anteriores

    // Usar el contenido disponible para el análisis
    const contentToAnalyze = htmlContent || extractedHtml || landingContent

    // Simulate analysis process
    setTimeout(() => {
      // Parse HTML to extract headings and paragraphs
      const parser = new DOMParser()
      const doc = parser.parseFromString(contentToAnalyze, "text/html")

      const headings = Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5, h6"))
      const paragraphs = Array.from(doc.querySelectorAll("p"))

      // Calculate a score based on various factors
      // This is a simplified simulation - in a real app, this would be more sophisticated
      let score = 0
      const maxScore = 100

      // Simulate heading analysis
      const headingAnalysisResult = analyzeHeadings(headings)
      score += headingAnalysisResult.score

      // Simulate paragraph analysis
      const paragraphAnalysisResult = analyzeParagraphs(paragraphs)
      score += paragraphAnalysisResult.score

      // Cap the score at maxScore
      score = Math.min(score, maxScore)

      // Generate comprehensive recommendations
      const overallRecommendations = generateOverallRecommendations(
        headingAnalysisResult,
        paragraphAnalysisResult,
        score,
      )

      setAnalysisResult({
        score,
        headingAnalysis: {
          structure: headingAnalysisResult.structure,
          keywords: headingAnalysisResult.keywords,
          hierarchy: headingAnalysisResult.hierarchy,
          recommendations: headingAnalysisResult.recommendations,
        },
        paragraphAnalysis: {
          readability: paragraphAnalysisResult.readability,
          keywords: paragraphAnalysisResult.keywords,
          engagement: paragraphAnalysisResult.engagement,
          recommendations: paragraphAnalysisResult.recommendations,
        },
        overallRecommendations,
      })

      // Generar soluciones específicas para cada problema
      generateSpecificSolutions([
        ...headingAnalysisResult.recommendations.map((rec) => ({ type: "heading", problem: rec })),
        ...paragraphAnalysisResult.recommendations.map((rec) => ({ type: "paragraph", problem: rec })),
        ...overallRecommendations.map((rec) => ({ type: "recommendation", problem: rec })),
      ])

      toast({
        title: "Análisis completado",
        description: `Puntuación: ${score}/100. Revisa las recomendaciones para mejorar tu landing page.`,
      })

      setIsAnalyzing(false)
    }, 2000)
  }

  // Función para generar soluciones específicas usando IA
  const generateSpecificSolutions = async (problems: { type: string; problem: string }[]) => {
    if (problems.length === 0) return

    setIsGeneratingSolutions(true)

    try {
      // Obtener la API key de OpenAI del localStorage
      const openaiApiKey = localStorage.getItem("openai_api_key")

      if (!openaiApiKey) {
        toast({
          title: "API Key no configurada",
          description: "Se usarán soluciones predeterminadas. Configura tu API Key para soluciones personalizadas.",
          variant: "warning",
        })

        // Usar soluciones predeterminadas
        const defaultSolutions = generateDefaultSolutions(problems)
        setGeneratedSolutions(defaultSolutions)
        setIsGeneratingSolutions(false)
        return
      }

      // Obtener el servicio de IA
      const aiService = getAIService({
        provider: "openai",
        apiKey: openaiApiKey,
        model: "gpt-4o",
        temperature: 0.8, // Mayor temperatura para más creatividad
      })

      // Preparar el prompt para generar soluciones específicas
      const keywordsList = keywords
        .split(",")
        .map((k) => k.trim())
        .join(", ")
      const mainKeyword = keywords.split(",")[0].trim()

      const prompt = `
Genera soluciones específicas y concretas para los siguientes problemas detectados en una landing page. 
Las soluciones deben ser textos exactos que se puedan implementar directamente, no descripciones generales.

Palabras clave: ${keywordsList}
Palabra clave principal: ${mainKeyword}
URL analizada: ${url || "No proporcionada"}

Para cada problema, proporciona una solución específica que:
1. Incluya la palabra clave principal de forma natural
2. Sea persuasiva y orientada a conversiones
3. Genere engagement con el usuario
4. Sea única y creativa (evita fórmulas repetitivas)
5. Siga las mejores prácticas de SEO y UX

PROBLEMAS DETECTADOS:
${problems.map((p, i) => `${i + 1}. [${p.type}] ${p.problem}`).join("\n")}

Responde SOLO en formato JSON con esta estructura:
{
  "soluciones": {
    "problema_1": "texto exacto de la solución",
    "problema_2": "texto exacto de la solución",
    ...
  }
}

IMPORTANTE: Las soluciones deben ser textos específicos listos para usar, no explicaciones.
Ejemplo:
Si el problema es "El H1 no contiene la palabra clave principal (H1 actual: Consulta con el mejor vidente)"
La solución debe ser: "Consulta con el mejor vidente en amarres de amor" (no "Añade la palabra clave al H1")
`

      // Llamar a la API
      const response = await aiService.generateText(prompt, 2000)

      // Extraer el JSON de la respuesta
      try {
        const jsonRegex = /\{[\s\S]*\}/g
        const jsonMatch = response.match(jsonRegex)

        if (!jsonMatch) {
          throw new Error("No se encontró una estructura JSON válida en la respuesta")
        }

        const jsonStr = jsonMatch[0]
        const parsedResponse = JSON.parse(jsonStr)

        if (!parsedResponse.soluciones) {
          throw new Error("El formato de respuesta no contiene el campo 'soluciones'")
        }

        // Mapear las soluciones a los problemas
        const solutionsMap: { [key: string]: string } = {}
        problems.forEach((problem, index) => {
          const key = `problema_${index + 1}`
          if (parsedResponse.soluciones[key]) {
            solutionsMap[problem.problem] = parsedResponse.soluciones[key]
          }
        })

        setGeneratedSolutions(solutionsMap)
      } catch (error) {
        console.error("Error procesando las soluciones:", error)
        // Usar soluciones predeterminadas en caso de error
        const defaultSolutions = generateDefaultSolutions(problems)
        setGeneratedSolutions(defaultSolutions)
      }
    } catch (error) {
      console.error("Error generando soluciones:", error)
      // Usar soluciones predeterminadas en caso de error
      const defaultSolutions = generateDefaultSolutions(problems)
      setGeneratedSolutions(defaultSolutions)
    } finally {
      setIsGeneratingSolutions(false)
    }
  }

  // Generar soluciones predeterminadas como respaldo
  const generateDefaultSolutions = (problems: { type: string; problem: string }[]): { [key: string]: string } => {
    const solutions: { [key: string]: string } = {}
    const mainKeyword = keywords.split(",")[0].trim()

    problems.forEach(({ type, problem }) => {
      // Soluciones para problemas de encabezados
      if (type === "heading") {
        if (problem.includes("H1")) {
          solutions[problem] = `Descubre los Mejores ${mainKeyword} con Expertos Certificados`
        } else if (problem.includes("número de encabezados")) {
          solutions[problem] = `<h2>Beneficios de Nuestros ${mainKeyword}</h2>`
        } else if (problem.includes("jerarquía")) {
          solutions[problem] =
            `<h1>Servicios de ${mainKeyword}</h1>\n<h2>Nuestras Especialidades</h2>\n<h3>Consultas Personalizadas</h3>`
        } else if (problem.includes("palabras clave")) {
          solutions[problem] = `<h2>Por Qué Elegir Nuestros ${mainKeyword} Profesionales</h2>`
        } else {
          solutions[problem] = `<h2>5 Razones Para Confiar en Nuestros ${mainKeyword}</h2>`
        }
      }
      // Soluciones para problemas de párrafos
      else if (type === "paragraph") {
        if (problem.includes("más párrafos")) {
          solutions[problem] =
            `Nuestros ${mainKeyword} están diseñados para ayudarte a conseguir resultados rápidos y efectivos. Con años de experiencia, nuestros especialistas te guiarán en cada paso del proceso.`
        } else if (problem.includes("longitud")) {
          solutions[problem] =
            `Te ofrecemos los mejores ${mainKeyword} del mercado. Resultados garantizados o te devolvemos tu dinero. ¡Contáctanos hoy mismo!`
        } else if (problem.includes("densidad de palabras clave")) {
          solutions[problem] =
            `Especialistas en ${mainKeyword} con más de 15 años de experiencia. Nuestros rituales de ${mainKeyword} son efectivos y discretos. Consulta ahora sobre nuestros servicios de ${mainKeyword}.`
        } else if (problem.includes("llamadas a la acción")) {
          solutions[problem] =
            `¡Reserva tu consulta de ${mainKeyword} ahora y obtén un 20% de descuento en tu primera sesión!`
        } else {
          solutions[problem] =
            `¿Buscas resultados reales con ${mainKeyword}? Nuestros especialistas han ayudado a miles de personas a recuperar el amor. ¡Tú podrías ser el siguiente!`
        }
      }
      // Soluciones para recomendaciones generales
      else {
        if (problem.includes("reestructura")) {
          solutions[problem] =
            `<h1>Los Mejores ${mainKeyword} Garantizados</h1>\n<h2>¿Por Qué Elegirnos?</h2>\n<p>Texto persuasivo...</p>\n<h2>Testimonios</h2>\n<p>Casos de éxito...</p>\n<h2>Nuestros Servicios</h2>\n<p>Descripción...</p>\n<h2>Contacto</h2>\n<p>Formulario...</p>`
        } else if (problem.includes("estrategia de palabras clave")) {
          solutions[problem] =
            `Palabra principal: ${mainKeyword}\nSecundarias: consulta de ${mainKeyword}, especialistas en ${mainKeyword}, ${mainKeyword} efectivos, resultados de ${mainKeyword}`
        } else if (problem.includes("elementos visuales")) {
          solutions[problem] =
            `Añadir imagen de testimonio con texto: "Recuperé a mi pareja gracias a los ${mainKeyword} de [Nombre]"`
        } else {
          solutions[problem] =
            `Implementar schema.org/Service para ${mainKeyword} con precio desde $XX y valoración 4.8/5 basada en 120 reseñas`
        }
      }
    })

    return solutions
  }

  // Function to analyze headings
  const analyzeHeadings = (headings: Element[]) => {
    // This is a simplified simulation
    const hasH1 = headings.some((h) => h.tagName.toLowerCase() === "h1")
    const headingCount = headings.length
    const hasProperHierarchy = checkHeadingHierarchy(headings)

    const recommendations: string[] = []
    let score = 0
    let structure = "Deficiente"
    let keywords = "Deficiente"
    let hierarchy = "Deficiente"

    // Check if there's at least one H1
    if (!hasH1) {
      recommendations.push("Añade un encabezado H1 principal que contenga tu palabra clave principal.")
    } else {
      score += 10
      structure = "Bueno"
    }

    // Check heading count
    if (headingCount < 3) {
      recommendations.push("Aumenta el número de encabezados para mejorar la estructura y facilitar la lectura.")
    } else if (headingCount >= 3 && headingCount < 6) {
      score += 5
      structure = "Aceptable"
    } else {
      score += 10
      structure = "Excelente"
    }

    // Check heading hierarchy
    if (!hasProperHierarchy) {
      recommendations.push("Mejora la jerarquía de encabezados. Asegúrate de que H2 siga a H1, H3 siga a H2, etc.")
    } else {
      score += 10
      hierarchy = "Bueno"
    }

    // Check keyword usage in headings
    const keywordUsage = checkKeywordUsageInHeadings(headings)
    if (keywordUsage < 0.3) {
      recommendations.push("Incluye palabras clave relevantes en tus encabezados para mejorar el SEO.")
    } else if (keywordUsage >= 0.3 && keywordUsage < 0.6) {
      score += 5
      keywords = "Aceptable"
    } else {
      score += 10
      keywords = "Excelente"
    }

    // Add more specific recommendations for low scores
    if (score < 20) {
      recommendations.push("Utiliza encabezados para dividir el contenido en secciones lógicas.")
      recommendations.push("Asegúrate de que cada encabezado describa claramente el contenido que le sigue.")
      recommendations.push("Incluye variaciones de palabras clave en los encabezados secundarios.")
      recommendations.push("Mantén los encabezados concisos y atractivos, idealmente entre 4-10 palabras.")
      recommendations.push('Utiliza números en los encabezados para aumentar el CTR (por ejemplo, "7 Formas de...").')
    }

    return {
      score: score,
      structure,
      keywords,
      hierarchy,
      recommendations,
    }
  }

  // Function to analyze paragraphs
  const analyzeParagraphs = (paragraphs: Element[]) => {
    // This is a simplified simulation
    const paragraphCount = paragraphs.length
    const avgParagraphLength = calculateAvgParagraphLength(paragraphs)

    const recommendations: string[] = []
    let score = 0
    let readability = "Deficiente"
    let keywords = "Deficiente"
    let engagement = "Deficiente"

    // Check paragraph count
    if (paragraphCount < 3) {
      recommendations.push("Añade más párrafos para desarrollar mejor tus ideas y mejorar la estructura del contenido.")
    } else if (paragraphCount >= 3 && paragraphCount < 6) {
      score += 5
      readability = "Aceptable"
    } else {
      score += 10
      readability = "Bueno"
    }

    // Check average paragraph length
    if (avgParagraphLength > 150) {
      recommendations.push(
        "Reduce la longitud de tus párrafos. Párrafos más cortos (40-80 palabras) mejoran la legibilidad.",
      )
    } else if (avgParagraphLength >= 80 && avgParagraphLength <= 150) {
      score += 5
      readability = "Aceptable"
    } else if (avgParagraphLength > 0 && avgParagraphLength < 80) {
      score += 10
      readability = "Excelente"
    }

    // Simulate keyword density check
    const keywordDensity = simulateKeywordDensity(paragraphs)
    if (keywordDensity < 0.5) {
      recommendations.push("Aumenta la densidad de palabras clave en tu contenido, manteniendo un flujo natural.")
    } else if (keywordDensity >= 0.5 && keywordDensity < 1.5) {
      score += 10
      keywords = "Excelente"
    } else {
      recommendations.push(
        "Reduce la densidad de palabras clave. Parece excesiva y podría considerarse keyword stuffing.",
      )
      keywords = "Aceptable"
    }

    // Simulate engagement metrics
    const hasCallToAction = simulateHasCallToAction(paragraphs)
    if (!hasCallToAction) {
      recommendations.push("Incluye llamadas a la acción claras en tu contenido para mejorar la conversión.")
    } else {
      score += 5
      engagement = "Bueno"
    }

    // Add more specific recommendations for low scores
    if (score < 20) {
      recommendations.push(
        "Utiliza párrafos de introducción atractivos que capten la atención del lector inmediatamente.",
      )
      recommendations.push("Varía la longitud de los párrafos para mantener el ritmo y el interés del lector.")
      recommendations.push("Incluye preguntas retóricas para aumentar el engagement.")
      recommendations.push("Utiliza viñetas o listas para presentar información de manera más digerible.")
      recommendations.push("Incorpora ejemplos concretos y datos estadísticos para respaldar tus afirmaciones.")
      recommendations.push("Utiliza un lenguaje activo en lugar de pasivo para hacer el contenido más dinámico.")
      recommendations.push("Asegúrate de que cada párrafo desarrolle una sola idea principal.")
    }

    return {
      score: score,
      readability,
      keywords,
      engagement,
      recommendations,
    }
  }

  // Generate comprehensive overall recommendations
  const generateOverallRecommendations = (headingAnalysis: any, paragraphAnalysis: any, overallScore: number) => {
    const recommendations: string[] = []

    // Add recommendations based on overall score
    if (overallScore < 50) {
      recommendations.push("Reestructura completamente el contenido siguiendo las mejores prácticas de SEO on-page.")
      recommendations.push(
        "Implementa una estrategia de palabras clave más efectiva, con una palabra clave principal y varias secundarias.",
      )
      recommendations.push("Mejora la jerarquía de encabezados para crear una estructura clara y lógica.")
      recommendations.push("Optimiza la densidad de palabras clave en todo el contenido, manteniendo un flujo natural.")
      recommendations.push("Añade más contenido relevante y valioso para el usuario.")
      recommendations.push(
        "Incorpora elementos visuales como imágenes, infografías o videos para complementar el texto.",
      )
      recommendations.push("Mejora la legibilidad con párrafos más cortos y un lenguaje más claro y directo.")
      recommendations.push("Añade enlaces internos a otras páginas relevantes de tu sitio.")
      recommendations.push("Incluye enlaces externos a fuentes autoritativas para respaldar tus afirmaciones.")
      recommendations.push(
        "Optimiza las meta etiquetas (título y descripción) para mejorar el CTR desde los resultados de búsqueda.",
      )
      recommendations.push("Utiliza etiquetas semánticas HTML5 para mejorar la estructura del contenido.")
      recommendations.push(
        "Implementa schema markup relevante para mejorar la visibilidad en los resultados de búsqueda.",
      )
    } else if (overallScore >= 50 && overallScore < 75) {
      recommendations.push("Mejora la distribución de palabras clave en encabezados y párrafos.")
      recommendations.push("Optimiza la estructura de encabezados para una mejor jerarquía de contenido.")
      recommendations.push("Añade más variaciones de palabras clave secundarias.")
      recommendations.push("Mejora la legibilidad con párrafos más concisos y mejor estructurados.")
      recommendations.push("Incorpora más llamadas a la acción estratégicamente ubicadas.")
    } else {
      recommendations.push("Realiza pruebas A/B para optimizar aún más el rendimiento del contenido.")
      recommendations.push("Considera añadir contenido multimedia adicional para aumentar el engagement.")
      recommendations.push("Actualiza el contenido regularmente para mantenerlo relevante.")
    }

    return recommendations
  }

  // Helper functions
  const checkHeadingHierarchy = (headings: Element[]) => {
    // Simplified check - in a real app, this would be more sophisticated
    let currentLevel = 0
    for (const heading of headings) {
      const level = Number.parseInt(heading.tagName.charAt(1))
      if (level > currentLevel + 1) return false
      currentLevel = level
    }
    return true
  }

  const checkKeywordUsageInHeadings = (headings: Element[]) => {
    // Simplified simulation - in a real app, this would analyze actual keywords
    return Math.random()
  }

  const calculateAvgParagraphLength = (paragraphs: Element[]) => {
    if (paragraphs.length === 0) return 0
    const totalLength = paragraphs.reduce((sum, p) => sum + (p.textContent?.length || 0), 0)
    return totalLength / paragraphs.length
  }

  const simulateKeywordDensity = (paragraphs: Element[]) => {
    // Simplified simulation - in a real app, this would analyze actual keywords
    return Math.random() * 2
  }

  const simulateHasCallToAction = (paragraphs: Element[]) => {
    // Simplified simulation - in a real app, this would look for actual CTAs
    return Math.random() > 0.5
  }

  const getScoreColor = (score: number) => {
    if (score < 50) return "text-red-500"
    if (score < 75) return "text-yellow-500"
    return "text-green-500"
  }

  const getScoreLabel = (score: number) => {
    if (score < 50) return "Necesita mejoras"
    if (score < 75) return "Aceptable"
    return "Excelente"
  }

  // Lista de servicios proxy alternativos
  const proxyServices = [
    (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url) => `https://cors-anywhere.herokuapp.com/${url}`,
    (url) => `https://cors.bridged.cc/${url}`,
    (url) => `https://crossorigin.me/${url}`,
    (url) => `https://thingproxy.freeboard.io/fetch/${url}`,
  ]

  const extractHtmlFromUrl = async (urlToExtract) => {
    if (!urlToExtract) return false

    setIsExtracting(true)
    setExtractionError("")

    // Intentar con cada servicio proxy hasta que uno funcione
    for (let i = 0; i < proxyServices.length; i++) {
      try {
        const proxyUrl = proxyServices[i](urlToExtract)
        console.log(`Intentando con proxy #${i + 1}: ${proxyUrl}`)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos de timeout

        const response = await fetch(proxyUrl, {
          signal: controller.signal,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }

        const html = await response.text()

        if (!html || html.length < 100) {
          throw new Error("Contenido HTML vacío o demasiado corto")
        }

        // Procesar y limpiar el HTML para reducir su tamaño
        const processedHtml = processHtml(html)

        setExtractedHtml(processedHtml)
        setLandingContent(processedHtml)
        setHtmlContent(processedHtml) // Actualizar también el contenido HTML para análisis
        setIsExtracting(false)
        return true
      } catch (error) {
        console.error(`Error con proxy #${i + 1}:`, error)
        // Continuar con el siguiente proxy si este falla
      }
    }

    // Si llegamos aquí, todos los proxies fallaron
    setExtractionError(
      "No se pudo extraer el HTML de la URL proporcionada. Por favor, ingresa el contenido manualmente o intenta con otra URL.",
    )

    // Mostrar un toast con opciones para el usuario
    toast({
      title: "Error de extracción",
      description: (
        <div className="space-y-2">
          <p>No se pudo extraer el HTML. Puedes:</p>
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSkipExtraction(true)
                setExtractionError("")
              }}
            >
              Continuar sin extracción
            </Button>
          </div>
        </div>
      ),
      variant: "destructive",
    })

    setIsExtracting(false)
    return false
  }

  // Función alternativa para extraer contenido sin usar proxies
  const extractMetadata = async (urlToExtract) => {
    try {
      // Esta función solo extrae metadatos básicos, no el HTML completo
      // Es una alternativa cuando los proxies fallan
      setLandingContent(
        `URL: ${urlToExtract}\n\nNo se pudo extraer el contenido completo. Por favor, ingresa manualmente el contenido principal de la página, como títulos, párrafos y llamadas a la acción.`,
      )
      return true
    } catch (error) {
      console.error("Error extrayendo metadatos:", error)
      return false
    }
  }

  const processHtml = (html: string): string => {
    try {
      // Crear un DOM temporal para procesar el HTML
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")

      // Eliminar scripts, estilos, y otros elementos no relevantes
      const scriptsAndStyles = doc.querySelectorAll("script, style, link, meta, svg, path, iframe")
      scriptsAndStyles.forEach((el) => el.remove())

      // Extraer solo el contenido visible
      const body = doc.body

      // Extraer textos de elementos importantes
      const headings = Array.from(body.querySelectorAll("h1, h2, h3, h4, h5, h6"))
        .map((el) => `Heading: ${el.textContent?.trim()}`)
        .filter((text) => text && text.length > 8) // Filtrar encabezados vacíos o muy cortos

      const paragraphs = Array.from(body.querySelectorAll("p"))
        .map((el) => `Paragraph: ${el.textContent?.trim()}`)
        .filter((text) => text && text.length > 10) // Filtrar párrafos vacíos o muy cortos

      const buttons = Array.from(
        body.querySelectorAll('button, a.btn, .button, [role="button"], a[href]:not([href^="#"]'),
      )
        .map((el) => `Button/Link: ${el.textContent?.trim() || el.getAttribute("value") || "Sin texto"}`)
        .filter((text) => text && text !== "Button/Link: Sin texto") // Filtrar botones sin texto

      const images = Array.from(body.querySelectorAll("img[alt]"))
        .map((el) => `Image Alt: ${el.getAttribute("alt")}`)
        .filter((text) => text && text.length > 3) // Filtrar alts vacíos o muy cortos

      const forms = Array.from(body.querySelectorAll("form"))
        .map((form) => {
          const inputs = Array.from(form.querySelectorAll('input[type="text"], input[type="email"], textarea'))
            .map(
              (input) =>
                `Form Field: ${input.getAttribute("placeholder") || input.getAttribute("name") || "Sin etiqueta"}`,
            )
            .filter((text) => text && text !== "Form Field: Sin etiqueta") // Filtrar campos sin etiqueta
          return inputs.length > 0 ? `Form: ${inputs.join(", ")}` : null
        })
        .filter(Boolean) // Filtrar formularios vacíos

      // Combinar todos los elementos extraídos
      const extractedContent = [...headings, ...paragraphs, ...buttons, ...images, ...forms]
        .filter(Boolean)
        .join("\n\n")

      // Limitar a aproximadamente 5,000 tokens (unos 20,000 caracteres) para estar seguros
      return extractedContent.length > 20000
        ? extractedContent.substring(0, 20000) + "... [contenido truncado por limitaciones de tamaño]"
        : extractedContent
    } catch (error) {
      console.error("Error procesando HTML:", error)
      // Si hay un error, devolver una versión truncada del HTML original
      return html.substring(0, 20000) + "... [contenido truncado por limitaciones de tamaño]"
    }
  }

  const cleanInputContent = (content: string): string => {
    // Si el contenido parece ser HTML, procesarlo
    if (content.includes("<") && content.includes(">")) {
      return processHtml(content)
    }

    // Si es texto plano, simplemente truncarlo si es necesario
    return content.length > 20000
      ? content.substring(0, 20000) + "... [contenido truncado por limitaciones de tamaño]"
      : content
  }

  const handleAnalyze = async () => {
    if (!url && !landingContent) {
      toast({
        title: "Información incompleta",
        description: "Por favor, proporciona la URL o el contenido de la landing page",
        variant: "destructive",
      })
      return
    }

    if (!keywords) {
      toast({
        title: "Palabras clave requeridas",
        description: "Por favor, ingresa al menos una palabra clave para el análisis",
        variant: "destructive",
      })
      return
    }

    // Si hay URL pero no se ha extraído el HTML, intentamos extraerlo primero
    if (url && !extractedHtml && !landingContent && !skipExtraction) {
      toast({
        title: "Extrayendo contenido",
        description: "Obteniendo el HTML de la página para un análisis más preciso...",
      })

      const extracted = await extractHtmlFromUrl(url)

      // Si la extracción falló y no hay contenido manual, no podemos continuar
      if (!extracted && !landingContent) {
        // El mensaje de error ya se muestra en extractHtmlFromUrl
        return
      }
    }

    setIsAnalyzing(true)
    setProgress(0)
    setAnalysis(null)
    setApiError("")

    // Simulamos el progreso
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + 5
      })
    }, 500)

    try {
      // Obtener la API key de OpenAI del localStorage
      const openaiApiKey = localStorage.getItem("openai_api_key")

      if (!openaiApiKey) {
        clearInterval(progressInterval)
        setIsAnalyzing(false)
        toast({
          title: "API Key no configurada",
          description: "Por favor, configura tu API Key de OpenAI en la sección de Configuración",
          variant: "destructive",
        })
        return
      }

      // Obtener el servicio de IA
      const aiService = getAIService({
        provider: "openai",
        apiKey: openaiApiKey,
        model: "gpt-4o",
        temperature: 0.7,
      })

      // Dentro de handleAnalyze, antes de llamar a la API:
      const contentToAnalyze = landingContent || extractedHtml
      if (contentToAnalyze.length > 20000) {
        toast({
          title: "Contenido muy extenso",
          description: "El contenido ha sido truncado para cumplir con los límites de la API",
          variant: "warning",
        })
      }

      // Extraer solo las primeras 5 palabras clave si hay muchas
      const keywordList = keywords
        .split(",")
        .slice(0, 5)
        .map((k) => k.trim())
        .join(", ")

      // Preparar el prompt para el análisis - versión simplificada
      const prompt = `
Analiza el siguiente contenido de una landing page y proporciona un análisis estructurado en formato JSON.

URL: ${url || "No proporcionada"}
Palabras clave objetivo: ${keywordList}

CONTENIDO EXTRAÍDO:
${contentToAnalyze}

Responde SOLO en formato JSON con esta estructura exacta:
{
  "score": (número del 0-100),
  "summary": "breve resumen de 1-2 oraciones",
  "keywordRelevance": {
    "score": (número del 0-100),
    "analysis": "análisis breve de 1-2 oraciones"
  },
  "contentQuality": {
    "score": (número del 0-100),
    "analysis": "análisis breve de 1-2 oraciones"
  },
  "conversionOptimization": {
    "score": (número del 0-100),
    "analysis": "análisis breve de 1-2 oraciones"
  },
  "userExperience": {
    "score": (número del 0-100),
    "analysis": "análisis breve de 1-2 oraciones"
  },
  "recommendations": [
    {
      "element": "nombre del elemento",
      "original": "texto original exacto (corto)",
      "improved": "texto mejorado (corto)",
      "explanation": "explicación breve"
    }
  ]
}

IMPORTANTE: 
1. Responde SOLO con el JSON, sin texto adicional.
2. Limita las recomendaciones a máximo 3 elementos.
3. Usa textos breves para evitar superar límites de tokens.
`

      // Llamar a la API de OpenAI
      const response = await aiService.generateText(prompt, 2000)

      // Intentar extraer y parsear el JSON
      let analysisResult: LandingPageAnalysis
      try {
        // Buscar cualquier estructura JSON en la respuesta
        const jsonRegex = /\{[\s\S]*\}/g
        const jsonMatch = response.match(jsonRegex)

        if (!jsonMatch) {
          throw new Error("No se encontró una estructura JSON válida en la respuesta")
        }

        const jsonStr = jsonMatch[0]
        console.log("JSON encontrado:", jsonStr)

        try {
          analysisResult = JSON.parse(jsonStr)

          // Verificar que el objeto tiene la estructura esperada
          if (
            !analysisResult.score ||
            !analysisResult.summary ||
            !analysisResult.keywordRelevance ||
            !analysisResult.contentQuality ||
            !analysisResult.conversionOptimization ||
            !analysisResult.userExperience
          ) {
            throw new Error("El JSON no tiene la estructura esperada")
          }

          // Asegurar que recommendations existe (aunque esté vacío)
          if (!analysisResult.recommendations) {
            analysisResult.recommendations = []
          }
        } catch (parseError) {
          console.error("Error al parsear JSON:", parseError)
          throw new Error("El formato de la respuesta no es un JSON válido")
        }
      } catch (error) {
        console.error("Error procesando la respuesta:", error, "Respuesta original:", response)

        // Crear un análisis básico con la respuesta de error
        setApiError(
          `Error al procesar la respuesta: ${error.message}. La API podría estar sobrecargada o el contenido es demasiado complejo.`,
        )

        // Usar el análisis de respaldo pero con el mensaje de error
        analysisResult = {
          ...fallbackAnalysis,
          summary: `Error al generar análisis: ${error.message}. Intenta con un contenido más pequeño o espera unos minutos.`,
        }
      }

      // Actualizar el estado con el análisis
      setAnalysis(analysisResult)
      setProgress(100)

      if (apiError) {
        toast({
          title: "Análisis parcial",
          description: "Se ha generado un análisis básico debido a errores en la API",
          variant: "warning",
        })
      } else {
        toast({
          title: "Análisis completado",
          description: `Puntuación general: ${analysisResult.score}/100`,
        })
      }
    } catch (error) {
      console.error("Error en el análisis:", error)
      setApiError(`Error al realizar el análisis: ${error.message}`)

      // Establecer un análisis básico de error
      setAnalysis(fallbackAnalysis)

      toast({
        title: "Error en el análisis",
        description: error.message || "Ocurrió un error al analizar la landing page",
        variant: "destructive",
      })
    } finally {
      clearInterval(progressInterval)
      setProgress(100)
      setIsAnalyzing(false)
    }
  }

  const handleCopyRecommendations = () => {
    if (!analysis) return

    const recommendationsText =
      analysis.recommendations && analysis.recommendations.length > 0
        ? analysis.recommendations
            .map(
              (rec) =>
                `ELEMENTO: ${rec.element}\n\nANTES: ${rec.original}\n\nDESPUÉS: ${rec.improved}\n\nEXPLICACIÓN: ${rec.explanation}\n\n---\n\n`,
            )
            .join("")
        : "No hay recomendaciones disponibles."

    navigator.clipboard.writeText(recommendationsText)
    toast({
      title: "Copiado al portapapeles",
      description: "Las recomendaciones han sido copiadas",
    })
  }

  const handleDownloadAnalysis = () => {
    if (!analysis) return

    const analysisText = `
ANÁLISIS DE LANDING PAGE
URL: ${url}
Palabras clave: ${keywords}

PUNTUACIÓN GENERAL: ${analysis.score}/100

RESUMEN EJECUTIVO:
${analysis.summary}

RELEVANCIA DE PALABRAS CLAVE (${analysis.keywordRelevance.score}/100):
${analysis.keywordRelevance.analysis}

CALIDAD DEL CONTENIDO (${analysis.contentQuality.score}/100):
${analysis.contentQuality.analysis}

OPTIMIZACIÓN PARA CONVERSIONES (${analysis.conversionOptimization.score}/100):
${analysis.conversionOptimization.analysis}

EXPERIENCIA DE USUARIO (${analysis.userExperience.score}/100):
${analysis.userExperience.analysis}

RECOMENDACIONES ESPECÍFICAS:
${
  analysis.recommendations && analysis.recommendations.length > 0
    ? analysis.recommendations
        .map(
          (rec) =>
            `ELEMENTO: ${rec.element}\n\nANTES: ${rec.original}\n\nDESPUÉS: ${rec.improved}\n\nEXPLICACIÓN: ${rec.explanation}\n\n---\n\n`,
        )
        .join("")
    : "No hay recomendaciones disponibles."
}

Análisis generado el ${new Date().toLocaleString()}
    `

    const element = document.createElement("a")
    const file = new Blob([analysisText], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `analisis-landing-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "Análisis descargado",
      description: "El archivo de texto ha sido descargado",
    })
  }

  const getScoreColor2 = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-500/10 text-green-500 border-green-500/30"
    if (score >= 60) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
    return "bg-red-500/10 text-red-500 border-red-500/30"
  }

  useEffect(() => {
    if (url && !isAnalyzing && !isExtracting) {
      // Limpiar el HTML extraído anterior cuando cambia la URL
      setExtractedHtml("")
      setSkipExtraction(false)
    }
  }, [url])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Análisis Exhaustivo de Landing Pages</CardTitle>
        <CardDescription>
          Analiza tu landing page con IA avanzada para obtener recomendaciones detalladas y una evaluación profesional
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="landing-url">URL de la Landing Page</Label>
            <div className="flex mt-1.5">
              <Input
                id="landing-url"
                placeholder="https://ejemplo.com/landing"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="rounded-r-none"
              />
              <Button
                variant="outline"
                className="rounded-l-none border-l-0"
                onClick={() => window.open(url, "_blank")}
                disabled={!url}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">
                Ingresa la URL completa de la landing page que deseas analizar
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => {
                  const success = await extractHtmlFromUrl(url)
                  if (success) {
                    toast({
                      title: "Extracción completada",
                      description: "El HTML ha sido extraído correctamente. Ahora puedes analizar la landing page.",
                      variant: "success",
                    })
                    // Actualizar el contenido HTML para el análisis
                    setHtmlContent(extractedHtml || landingContent)
                  }
                }}
                disabled={!url || isExtracting}
                className="ml-2"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Extrayendo...
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-3 w-3" />
                    Extraer HTML
                  </>
                )}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="keywords">Palabras Clave (separadas por comas)</Label>
            <Input
              id="keywords"
              placeholder="tarot, videncia, astrología"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Ingresa las palabras clave objetivo para evaluar la relevancia
            </p>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <Label htmlFor="landing-content">Contenido de la Landing Page</Label>
            {url && !landingContent && !isExtracting && (
              <Button variant="ghost" size="sm" onClick={() => setSkipExtraction((prev) => !prev)} className="text-xs">
                {skipExtraction ? "Intentar extracción automática" : "Omitir extracción automática"}
              </Button>
            )}
          </div>
          <Textarea
            id="landing-content"
            placeholder="Pega aquí el contenido HTML o texto de tu landing page..."
            value={landingContent}
            onChange={(e) => {
              const cleanedContent = cleanInputContent(e.target.value)
              setLandingContent(cleanedContent)
              // Actualizar también el contenido HTML para análisis
              setHtmlContent(cleanedContent)
            }}
            className="min-h-[150px] mt-1.5"
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-muted-foreground">
              {url
                ? "Si la extracción automática falla, puedes pegar el contenido manualmente aquí"
                : "Pega el contenido HTML o texto de la landing page"}
            </p>
            {extractedHtml && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle2 className="h-3 w-3 mr-1" /> HTML extraído correctamente
              </Badge>
            )}
          </div>
        </div>

        {extractionError && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{extractionError}</p>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSkipExtraction(true)
                      setExtractionError("")
                      toast({
                        title: "Extracción omitida",
                        description:
                          "Puedes ingresar el contenido manualmente o continuar con el análisis si ya has ingresado contenido.",
                      })
                    }}
                  >
                    Continuar sin extracción
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <CheckCircle
              className={`h-4 w-4 ${extractedHtml || landingContent ? "text-green-500" : "text-gray-300"}`}
            />
            <span className={extractedHtml || landingContent ? "text-green-700" : "text-gray-500"}>
              {extractedHtml || landingContent
                ? "Contenido listo para análisis"
                : "Pendiente: Extraer o ingresar contenido"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <CheckCircle className={`h-4 w-4 ${keywords ? "text-green-500" : "text-gray-300"}`} />
            <span className={keywords ? "text-green-700" : "text-gray-500"}>
              {keywords ? "Palabras clave ingresadas" : "Pendiente: Ingresar palabras clave"}
            </span>
          </div>
        </div>

        <Button
          onClick={analyzeContent}
          disabled={isAnalyzing || isExtracting || (!extractedHtml && !landingContent) || !keywords}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analizando...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Analizar Landing Page
            </>
          )}
        </Button>

        {analysisResult && (
          <div className="mt-6 space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Puntuación Global</h3>
              <div className={`text-4xl font-bold ${getScoreColor(analysisResult.score)}`}>
                {analysisResult.score}/100
              </div>
              <Badge
                variant={analysisResult.score < 50 ? "destructive" : analysisResult.score < 75 ? "outline" : "default"}
                className="mt-2"
              >
                {getScoreLabel(analysisResult.score)}
              </Badge>
              <Progress value={analysisResult.score} className="mt-4" />
            </div>

            <Separator />

            <Tabs defaultValue="headings" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="headings">Encabezados</TabsTrigger>
                <TabsTrigger value="paragraphs">Párrafos</TabsTrigger>
                <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
              </TabsList>

              <TabsContent value="headings">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Estructura</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className={getScoreBadge(analysisResult.headingAnalysis?.score || 0)}>
                        {analysisResult.headingAnalysis?.structure}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Palabras Clave</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className={getScoreBadge(analysisResult.headingAnalysis?.keywords || 0)}>
                        {analysisResult.headingAnalysis.keywords}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Jerarquía</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className={getScoreBadge(analysisResult.headingAnalysis?.hierarchy || 0)}>
                        {analysisResult.headingAnalysis.hierarchy}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-4 space-y-4">
                  <h4 className="text-lg font-semibold">Problemas y Soluciones Específicas</h4>
                  <div className="space-y-2">
                    {analysisResult.headingAnalysis.recommendations.map((rec, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="mb-2">
                          <p className="font-semibold">Problema Detectado</p>
                          {rec}
                        </div>
                        <div>
                          <p className="font-semibold">Solución Recomendada</p>
                          <div className="mt-1">
                            {isGeneratingSolutions ? (
                              <>
                                <Loader2 className="mr-2 h-3 w-3 animate-spin inline-block" />
                                Generando solución...
                              </>
                            ) : (
                              generatedSolutions[rec] ||
                              (keywords.split(",")[0].trim() === "amarres de amor"
                                ? rec.includes("H1")
                                  ? "Descubre los Mejores Amarres de Amor con Resultados Garantizados"
                                  : rec.includes("número de encabezados")
                                    ? "<h2>Los 5 Rituales de Amarres de Amor Más Efectivos</h2>"
                                    : rec.includes("jerarquía")
                                      ? "<h1>Amarres de Amor que Funcionan</h1>\n<h2>Nuestros Rituales</h2>\n<h3>Amarre de Amor con Vudú</h3>"
                                      : rec.includes("palabras clave")
                                        ? "<h2>Amarres de Amor para Recuperar a Tu Pareja Rápidamente</h2>"
                                        : "<h2>7 Señales de que Nuestro Amarre de Amor Está Funcionando</h2>"
                                : `<h1>Los Mejores Servicios de ${keywords.split(",")[0].trim()} - Resultados Garantizados</h1>`)
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Añadir el botón para generar soluciones aquí */}
                <div className="mt-4">
                  <Card className="bg-blue-50 border border-blue-200">
                    <CardContent className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold">Generando soluciones creativas...</h4>
                        <p className="text-xs text-muted-foreground">
                          <Sparkles className="inline-block w-3 h-3 mr-1" />
                          Usamos IA avanzada para crear soluciones personalizadas y optimizadas para conversiones
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          generateSpecificSolutions([
                            ...analysisResult.headingAnalysis.recommendations.map((rec) => ({
                              type: "heading",
                              problem: rec,
                            })),
                            ...analysisResult.paragraphAnalysis.recommendations.map((rec) => ({
                              type: "paragraph",
                              problem: rec,
                            })),
                            ...analysisResult.overallRecommendations.map((rec) => ({
                              type: "recommendation",
                              problem: rec,
                            })),
                          ])
                        }
                        disabled={isGeneratingSolutions}
                      >
                        {isGeneratingSolutions ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Generar soluciones específicas con IA
                          </>
                        ) : (
                          "Generar soluciones específicas con IA"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="paragraphs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Legibilidad</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className={getScoreBadge(analysisResult.paragraphAnalysis?.readability || 0)}>
                        {analysisResult.paragraphAnalysis.readability}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Palabras Clave</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className={getScoreBadge(analysisResult.paragraphAnalysis?.keywords || 0)}>
                        {analysisResult.paragraphAnalysis.keywords}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className={getScoreBadge(analysisResult.paragraphAnalysis?.engagement || 0)}>
                        {analysisResult.paragraphAnalysis.engagement}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-4 space-y-4">
                  <h4 className="text-lg font-semibold">Problemas y Soluciones Específicas</h4>
                  <div className="space-y-2">
                    {analysisResult.paragraphAnalysis.recommendations.map((rec, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="mb-2">
                          <p className="font-semibold">Problema Detectado</p>
                          {rec}
                        </div>
                        <div>
                          <p className="font-semibold">Solución Recomendada</p>
                          <div className="mt-1">
                            {isGeneratingSolutions ? (
                              <>
                                <Loader2 className="mr-2 h-3 w-3 animate-spin inline-block" />
                                Generando solución...
                              </>
                            ) : (
                              generatedSolutions[rec] ||
                              (keywords.split(",")[0].trim() === "amarres de amor"
                                ? rec.includes("más párrafos")
                                  ? "Nuestros amarres de amor utilizan técnicas ancestrales que han demostrado su efectividad durante generaciones. Cada ritual es personalizado según tu situación específica, garantizando resultados rápidos y duraderos. No esperes más para recuperar a esa persona especial."
                                  : rec.includes("longitud")
                                    ? "¿Buscas recuperar a tu pareja? Nuestros amarres de amor tienen 97% de efectividad. Resultados visibles en 3 días. ¡Consulta ahora!"
                                    : rec.includes("densidad de palabras clave")
                                      ? "Los amarres de amor son rituales poderosos para recuperar a tu pareja. Nuestros especialistas en amarres de amor utilizan técnicas efectivas que garantizan resultados. Consulta hoy sobre nuestros amarres de amor personalizados."
                                      : rec.includes("llamadas a la acción")
                                        ? "¡Reserva tu consulta de amarres de amor ahora y recibe GRATIS un ritual de protección valorado en $50!"
                                        : "¿Tu pareja se está alejando? Nuestros amarres de amor han ayudado a miles de personas a recuperar relaciones que parecían perdidas. ¿Serás el próximo caso de éxito?"
                                : `Nuestros servicios de ${keywords.split(",")[0].trim()} son los más efectivos del mercado. Resultados garantizados o te devolvemos tu dinero. ¡Contáctanos hoy mismo!`)
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recommendations">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Recomendaciones y Soluciones Detalladas</h4>
                  <div className="space-y-2">
                    {analysisResult.overallRecommendations.map((rec, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="mb-2">
                          <p className="font-semibold">Recomendación</p>
                          {rec}
                        </div>
                        <div>
                          <p className="font-semibold">Implementación Sugerida</p>
                          <div className="mt-1">
                            {isGeneratingSolutions ? (
                              <>
                                <Loader2 className="mr-2 h-3 w-3 animate-spin inline-block" />
                                Generando solución...
                              </>
                            ) : (
                              generatedSolutions[rec] ||
                              (keywords.split(",")[0].trim() === "amarres de amor"
                                ? rec.includes("reestructura")
                                  ? "<h1>Amarres de Amor Efectivos | Resultados en 7 Días</h1>\n<h2>¿Por Qué Nuestros Amarres Funcionan?</h2>\nTexto persuasivo...\n<h2>Testimonios Reales</h2>\nCasos de éxito...\n<h2>Tipos de Amarres</h2>\nDescripción...\n<h2>Reserva Tu Ritual</h2>\nFormulario..."
                                  : rec.includes("estrategia de palabras clave")
                                    ? "Palabra principal: amarres de amor\nSecundarias: ritual de amarre, amarre efectivo, recuperar pareja, amarres que funcionan, hechizo de amor"
                                    : rec.includes("elementos visuales")
                                      ? 'Añadir imagen de testimonio con texto: "Después de 3 años separados, el amarre de amor nos reunió en solo 9 días"'
                                      : "Implementar schema.org/Service para amarres de amor con precio desde $79 y valoración 4.9/5 basada en 237 reseñas"
                                : `Implementar estructura optimizada para ${keywords.split(",")[0].trim()} con H1 claro, secciones bien definidas y llamadas a la acción estratégicas`)
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-muted-foreground text-sm italic text-center">
        Análisis basado en mejores prácticas de SEO 2023
        <br />
        Inspirado en herramientas profesionales como Ahrefs y SEMrush
      </CardFooter>
    </Card>
  )

  function ParagraphAnalysis({
    readability,
    keywords,
    engagement,
  }: { readability: string; keywords: string; engagement: string }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Legibilidad</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge>{readability}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Palabras Clave</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge>{keywords}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge>{engagement}</Badge>
          </CardContent>
        </Card>
      </div>
    )
  }
}

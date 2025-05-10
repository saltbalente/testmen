"use server"

import { type AIProvider, getAIService } from "@/services/ai-service"

interface GenerateAdsParams {
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
  apiKey: string
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

export async function generateAdsWithAI(params: GenerateAdsParams): Promise<GeneratedAd[]> {
  try {
    // Validar parámetros
    if (!params.keywords.trim()) {
      throw new Error("Palabras clave requeridas")
    }

    if (!params.destinationUrl.trim()) {
      throw new Error("URL de destino requerida")
    }

    if (!params.apiKey) {
      throw new Error("API key requerida")
    }

    // Obtener servicio de IA
    const aiService = getAIService({
      provider: "openai" as AIProvider,
      apiKey: params.apiKey,
      model: params.aiModel,
      temperature: params.temperature,
    })

    // Preparar el prompt para la IA
    const prompt = createPromptForAds(params)

    // Generar texto con la IA
    const response = await aiService.generateText(prompt, 4000)

    // Procesar la respuesta
    const ads = parseAIResponse(response, params)

    return ads
  } catch (error) {
    console.error("Error al generar anuncios:", error)
    throw error
  }
}

function createPromptForAds(params: GenerateAdsParams): string {
  const {
    keywords,
    destinationUrl,
    numAds,
    numTitles,
    numDescriptions,
    writingStyle,
    industry,
    targetAudience,
    uniqueSellingPoints,
    callToAction,
    competitiveAdvantage,
    optimizeGrammar,
    optimizeKeywordDensity,
    optimizeCreativity,
    optimizeSentiment,
    keywordDensity,
    readabilityLevel,
  } = params

  // Crear un prompt detallado para la IA
  let prompt = `Genera ${numAds} anuncios responsivos de búsqueda para Google Ads con las siguientes especificaciones:

PALABRAS CLAVE: ${keywords}
URL DE DESTINO: ${destinationUrl}
ESTILO DE REDACCIÓN: ${writingStyle}
INDUSTRIA: ${industry}
PÚBLICO OBJETIVO: ${targetAudience}
LLAMADA A LA ACCIÓN: ${callToAction}
`

  // Añadir puntos de venta únicos si existen
  if (uniqueSellingPoints.filter((p) => p.trim()).length > 0) {
    prompt += `\nPUNTOS DE VENTA ÚNICOS:\n`
    uniqueSellingPoints
      .filter((p) => p.trim())
      .forEach((point, index) => {
        prompt += `${index + 1}. ${point}\n`
      })
  }

  // Añadir ventaja competitiva si existe
  if (competitiveAdvantage.trim()) {
    prompt += `\nVENTAJA COMPETITIVA: ${competitiveAdvantage}\n`
  }

  // Añadir requisitos específicos
  prompt += `
REQUISITOS:
- Cada anuncio debe tener ${numTitles} títulos diferentes (máximo 30 caracteres cada uno)
- Cada anuncio debe tener ${numDescriptions} descripciones diferentes (máximo 90 caracteres cada una)
- Los títulos y descripciones deben incluir las palabras clave proporcionadas
- Densidad de palabras clave: ${keywordDensity}/3 (donde 1 es baja y 3 es alta)
- Nivel de legibilidad: ${readabilityLevel}
`

  // Añadir optimizaciones específicas
  prompt += `\nOPTIMIZACIONES:\n`
  if (optimizeGrammar) prompt += `- Optimizar gramática y ortografía\n`
  if (optimizeKeywordDensity) prompt += `- Optimizar densidad de palabras clave\n`
  if (optimizeCreativity) prompt += `- Optimizar creatividad y originalidad\n`
  if (optimizeSentiment) prompt += `- Optimizar sentimiento positivo\n`

  // Añadir instrucciones de formato para facilitar el parsing
  prompt += `
FORMATO DE RESPUESTA:
Devuelve la respuesta en formato JSON con la siguiente estructura:
{
  "ads": [
    {
      "titles": ["Título 1", "Título 2", ...],
      "descriptions": ["Descripción 1", "Descripción 2", ...],
      "finalUrl": "URL de destino",
      "keywords": ["keyword1", "keyword2", ...],
      "qualityScore": {
        "overall": 8,
        "relevance": 9,
        "creativity": 7,
        "grammar": 10,
        "keywordUsage": 8
      }
    },
    ...
  ]
}
`

  return prompt
}

function parseAIResponse(response: string, params: GenerateAdsParams): GeneratedAd[] {
  try {
    // Intentar extraer el JSON de la respuesta
    let jsonStr = response

    // Buscar el inicio y fin del JSON en caso de que la IA incluya texto adicional
    const jsonStartIndex = response.indexOf("{")
    const jsonEndIndex = response.lastIndexOf("}") + 1

    if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
      jsonStr = response.substring(jsonStartIndex, jsonEndIndex)
    }

    const data = JSON.parse(jsonStr)

    if (!data.ads || !Array.isArray(data.ads)) {
      throw new Error("Formato de respuesta inválido")
    }

    // Convertir la respuesta al formato esperado
    return data.ads.map((ad: any, index: number) => ({
      id: `ad-${Date.now()}-${index}`,
      titles: Array.isArray(ad.titles) ? ad.titles : [],
      descriptions: Array.isArray(ad.descriptions) ? ad.descriptions : [],
      finalUrl: ad.finalUrl || params.destinationUrl,
      keywords: Array.isArray(ad.keywords) ? ad.keywords : params.keywords.split(",").map((k) => k.trim()),
      qualityScore: {
        overall: ad.qualityScore?.overall || 8,
        relevance: ad.qualityScore?.relevance || 8,
        creativity: ad.qualityScore?.creativity || 7,
        grammar: ad.qualityScore?.grammar || 9,
        keywordUsage: ad.qualityScore?.keywordUsage || 8,
      },
    }))
  } catch (error) {
    console.error("Error al procesar la respuesta de la IA:", error)

    // Generar anuncios simulados en caso de error
    const keywords = params.keywords.split(",").map((k) => k.trim())
    const ads: GeneratedAd[] = []

    for (let i = 0; i < params.numAds; i++) {
      ads.push({
        id: `ad-${Date.now()}-${i}`,
        titles: Array(params.numTitles)
          .fill(0)
          .map((_, j) => `Título ${j + 1} con ${keywords[j % keywords.length]}`),
        descriptions: Array(params.numDescriptions)
          .fill(0)
          .map((_, j) => `Descripción ${j + 1} que incluye ${keywords[j % keywords.length]} y destaca beneficios.`),
        finalUrl: params.destinationUrl,
        keywords,
        qualityScore: {
          overall: 8,
          relevance: 8,
          creativity: 7,
          grammar: 9,
          keywordUsage: 8,
        },
      })
    }

    return ads
  }
}

// Este es un servicio simulado para la extracción de palabras clave relacionadas
// En una implementación real, esto se conectaría con un backend que realizaría el scraping

import { v4 as uuidv4 } from "uuid"

export interface RelatedKeyword {
  id: string
  keyword: string
  source: "Google" | "Bing"
  category?: string
  selected: boolean
}

export interface ExtractionOptions {
  mainKeyword: string
  sources: {
    google: boolean
    bing: boolean
  }
  delaySeconds: number
}

// Función simulada para extraer palabras clave relacionadas
export async function extractRelatedKeywords(
  options: ExtractionOptions,
  progressCallback: (progress: number) => void,
): Promise<RelatedKeyword[]> {
  const { mainKeyword, sources, delaySeconds } = options

  // Simulamos el proceso de extracción
  let progress = 0
  const totalSteps = 10

  for (let i = 0; i < totalSteps; i++) {
    // Simulamos el retraso entre solicitudes
    await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000))

    progress += 100 / totalSteps
    progressCallback(Math.min(progress, 100))
  }

  // Generamos resultados simulados basados en la palabra clave principal
  const results: RelatedKeyword[] = []

  if (sources.google) {
    results.push(
      { id: uuidv4(), keyword: `${mainKeyword} en casa`, source: "Google", selected: false },
      { id: uuidv4(), keyword: `${mainKeyword} faciles`, source: "Google", selected: false },
      { id: uuidv4(), keyword: `${mainKeyword} gratis`, source: "Google", selected: false },
      { id: uuidv4(), keyword: `tipos de ${mainKeyword}`, source: "Google", selected: false },
      { id: uuidv4(), keyword: `${mainKeyword} con ropa interior`, source: "Google", selected: false },
      { id: uuidv4(), keyword: `${mainKeyword} efectivos`, source: "Google", selected: false },
      { id: uuidv4(), keyword: `${mainKeyword} fuertes`, source: "Google", selected: false },
      { id: uuidv4(), keyword: `como hacer un ${mainKeyword}`, source: "Google", selected: false },
    )
  }

  if (sources.bing) {
    results.push(
      { id: uuidv4(), keyword: `${mainKeyword} profesionales`, source: "Bing", selected: false },
      { id: uuidv4(), keyword: `${mainKeyword} rapidos`, source: "Bing", selected: false },
      { id: uuidv4(), keyword: `${mainKeyword} caseros`, source: "Bing", selected: false },
      { id: uuidv4(), keyword: `${mainKeyword} para el amor`, source: "Bing", selected: false },
    )
  }

  return results
}

// Función simulada para categorizar palabras clave con IA
export async function categorizeKeywordsWithAI(keywords: RelatedKeyword[]): Promise<RelatedKeyword[]> {
  // Simulamos el proceso de categorización con IA
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return keywords.map((kw) => {
    let category = "General"

    if (kw.keyword.includes("casa") || kw.keyword.includes("caseros")) {
      category = "Caseros"
    } else if (kw.keyword.includes("facil") || kw.keyword.includes("rapido")) {
      category = "Principiantes"
    } else if (kw.keyword.includes("efectivo") || kw.keyword.includes("fuerte")) {
      category = "Avanzados"
    } else if (kw.keyword.includes("como") || kw.keyword.includes("hacer")) {
      category = "Tutoriales"
    } else if (kw.keyword.includes("gratis")) {
      category = "Gratuitos"
    }

    return { ...kw, category }
  })
}

// Función simulada para añadir palabras clave a la base de datos
export async function addKeywordsToDatabase(keywords: RelatedKeyword[]): Promise<number> {
  // Simulamos el proceso de añadir a la base de datos
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return keywords.length
}

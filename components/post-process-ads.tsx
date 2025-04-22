"use client"

/**
 * Componente de utilidad para procesar anuncios generados por IA
 * Este componente se puede usar para limpiar y mejorar los anuncios generados
 */

import type React from "react"
import { useEffect } from "react"

interface Ad {
  headlines?: string[]
  descriptions?: string[]
  [key: string]: any
}

interface AdsData {
  ads?: Ad[]
  [key: string]: any
}

interface PostProcessAdsProps {
  data: AdsData | string
  onProcessed: (processedData: AdsData | string) => void
}

export const PostProcessAds: React.FC<PostProcessAdsProps> = ({ data, onProcessed }) => {
  useEffect(() => {
    // Procesar los datos cuando cambian
    const processedData = processAdsData(data)
    onProcessed(processedData)
  }, [data, onProcessed])

  return null // Este es un componente de utilidad, no renderiza nada
}

/**
 * Procesa los datos de anuncios para eliminar corchetes y asegurar títulos completos
 */
export const processAdsData = (data: AdsData | string): AdsData | string => {
  // Si es un string, intentar parsearlo como JSON
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data)
      return processAdsData(parsed)
    } catch (e) {
      // Si no se puede parsear, limpiar el string directamente
      return cleanAdText(data)
    }
  }

  // Si es un objeto con anuncios
  if (data && data.ads && Array.isArray(data.ads)) {
    return {
      ...data,
      ads: data.ads.map((ad) => ({
        ...ad,
        headlines: ad.headlines?.map(cleanAdText) || [],
        descriptions: ad.descriptions?.map(cleanAdText) || [],
      })),
    }
  }

  // Si es otro tipo de objeto, devolver sin cambios
  return data
}

/**
 * Limpia un texto de anuncio para eliminar corchetes y asegurar que es una frase completa
 */
export const cleanAdText = (text: string): string => {
  if (!text) return text

  // Eliminar corchetes manteniendo el contenido
  let cleaned = text.replace(/\[([^\]]+)\]/g, "$1")

  // Verificar si el texto parece estar truncado (termina en medio de una palabra)
  const lastWordMatch = cleaned.match(/\s(\w+)$/)
  if (lastWordMatch && lastWordMatch[1].length < 3) {
    // Si la última palabra es muy corta, probablemente está truncada
    cleaned = cleaned.replace(/\s\w+$/, "")
  }

  return cleaned
}

export default PostProcessAds

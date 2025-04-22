"use client"

/**
 * Hook personalizado para procesar anuncios generados por IA
 */

import { useState, useCallback } from "react"
import { processAdsData } from "../components/post-process-ads"

interface Ad {
  headlines?: string[]
  descriptions?: string[]
  [key: string]: any
}

interface AdsData {
  ads?: Ad[]
  [key: string]: any
}

export function useAdProcessor() {
  const [processedData, setProcessedData] = useState<AdsData | string | null>(null)

  const processAds = useCallback((data: AdsData | string) => {
    const processed = processAdsData(data)
    setProcessedData(processed)
    return processed
  }, [])

  return {
    processedData,
    processAds,
  }
}

export default useAdProcessor

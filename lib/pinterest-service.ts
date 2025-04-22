/**
 * Servicio para extraer URLs directas de videos desde pins de Pinterest
 */

export interface PinterestVideoInfo {
  url: string
  title?: string
  description?: string
  author?: string
  dimensions?: string
  originalUrl: string
}

export class PinterestError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message)
    this.name = "PinterestError"
  }
}

/**
 * Valida que una URL sea un pin válido de Pinterest
 */
export function validatePinterestUrl(url: string): boolean {
  const pinterestRegex = /^https?:\/\/(?:www\.|[a-z]{2}\.)?pinterest\.com\/pin\/[0-9]+\/?/i
  return pinterestRegex.test(url)
}

/**
 * Extrae el ID del pin de una URL de Pinterest
 */
export function extractPinId(url: string): string | null {
  const match = url.match(/\/pin\/([0-9]+)/)
  return match ? match[1] : null
}

/**
 * Extrae la URL del video desde un pin de Pinterest
 * utilizando nuestra API del lado del servidor
 */
export async function extractPinterestVideo(url: string): Promise<PinterestVideoInfo> {
  if (!validatePinterestUrl(url)) {
    throw new PinterestError("La URL no parece ser un pin válido de Pinterest", "INVALID_URL")
  }

  try {
    // Llamar a nuestra API del lado del servidor
    const response = await fetch(`/api/pinterest-extract?url=${encodeURIComponent(url)}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new PinterestError(errorData.error || `Error del servidor: ${response.status}`, "API_ERROR")
    }

    const data = await response.json()

    // Verificar que sea un video
    if (data.type !== "video") {
      throw new PinterestError(
        "El pin no contiene un video. Asegúrate de que el pin contenga un video, no solo imágenes.",
        "NO_VIDEO_FOUND",
      )
    }

    return {
      url: data.url,
      title: data.title,
      description: data.description,
      author: data.author,
      dimensions: data.dimensions,
      originalUrl: url,
    }
  } catch (error) {
    if (error instanceof PinterestError) {
      throw error
    }

    console.error("Error al extraer la URL del video:", error)
    throw new PinterestError(
      "No se pudo extraer la URL del video. Verifica que el pin exista, sea accesible y contenga un video.",
      "EXTRACTION_ERROR",
    )
  }
}

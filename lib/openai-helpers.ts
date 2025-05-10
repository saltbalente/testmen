"use server"

/**
 * Función para llamar a la API de OpenAI desde el servidor
 */
export async function callOpenAI(endpoint: string, data: any) {
  try {
    // Usar la clave API desde las variables de entorno del servidor
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      throw new Error("OpenAI API key not configured")
    }

    // Construir la URL completa para la API de OpenAI
    const url = `https://api.openai.com/v1/${endpoint}`

    // Realizar la solicitud a la API de OpenAI
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(data),
    })

    // Obtener la respuesta como JSON
    const result = await response.json()

    return result
  } catch (error) {
    console.error("Error calling OpenAI API:", error)
    throw new Error("Failed to call OpenAI API")
  }
}

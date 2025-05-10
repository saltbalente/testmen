// Interfaces para los resultados de análisis
export interface AIIntentAnalysis {
  intent: string
  confidence: number
  explanation: string
}

export interface AIEntityAnalysis {
  entities: Array<{
    name: string
    type: string
    relevance: number
  }>
}

export interface AIKeywordSuggestion {
  keyword: string
  relevance: number
}

// Configuración del servicio de IA
export interface AIServiceConfig {
  provider: "openai" | "deepseek"
  apiKey: string
  model?: string
  temperature?: number
  maxTokens?: number
}

// Tipo para el proveedor de IA
export type AIProvider = "openai" | "deepseek"

// Clase base para servicios de IA
abstract class BaseAIService {
  protected config: AIServiceConfig

  constructor(config: AIServiceConfig) {
    this.config = config
  }

  abstract generateText(prompt: string, maxTokens?: number): Promise<string>
  abstract generateKeywordSuggestions(topic: string, count: number): Promise<AIKeywordSuggestion[]>
  abstract analyzeIntent(keyword: string): Promise<AIIntentAnalysis>
  abstract extractEntities(keyword: string): Promise<AIEntityAnalysis>
}

// Función auxiliar para extraer JSON de respuestas que pueden contener bloques de código Markdown
function extractJsonFromResponse(response: string): any {
  try {
    // Intento 1: Parsear directamente la respuesta completa
    try {
      return JSON.parse(response)
    } catch (e) {
      // Si falla, continuamos con otros métodos
    }

    // Intento 2: Buscar contenido entre bloques de código Markdown
    const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)```/
    const match = response.match(codeBlockRegex)
    if (match && match[1]) {
      try {
        return JSON.parse(match[1].trim())
      } catch (e) {
        // Si falla, continuamos con otros métodos
      }
    }

    // Intento 3: Buscar cualquier estructura JSON válida en la respuesta
    const jsonRegex = /(\{[\s\S]*\}|\[[\s\S]*\])/
    const jsonMatch = response.match(jsonRegex)
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1])
    }

    // Si llegamos aquí, no pudimos extraer JSON válido
    throw new Error("No se pudo extraer JSON válido de la respuesta")
  } catch (error) {
    console.error("Error al extraer JSON de la respuesta:", error)
    console.log("Respuesta original:", response)
    throw error
  }
}

// Implementación para OpenAI
class OpenAIService extends BaseAIService {
  constructor(config: AIServiceConfig) {
    super(config)
  }

  async generateText(prompt: string, maxTokens = 100): Promise<string> {
    try {
      console.log("OpenAI generateText - Iniciando solicitud")

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model || "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: maxTokens,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Error en la API de OpenAI: ${response.status} ${response.statusText} - ${
            errorData.error?.message || JSON.stringify(errorData)
          }`,
        )
      }

      const data = await response.json()

      // Verificar la estructura de la respuesta
      if (!data || !data.choices || !data.choices.length || !data.choices[0].message) {
        console.error("Respuesta inesperada de OpenAI:", data)
        throw new Error("Respuesta inesperada de la API de OpenAI. Verifica tu API key y configuración.")
      }

      return data.choices[0].message.content.trim()
    } catch (error: any) {
      console.error("Error en OpenAI generateText:", error)
      throw new Error(`Error al generar texto con OpenAI: ${error.message}`)
    }
  }

  async generateKeywordSuggestions(topic: string, count: number): Promise<AIKeywordSuggestion[]> {
    const prompt = `Genera ${count} sugerencias de palabras clave relacionadas con "${topic}". Responde solo con un array JSON de objetos con los campos "keyword" y "relevance".`
    const response = await this.generateText(prompt)

    try {
      return JSON.parse(response)
    } catch (error) {
      console.error("Error al parsear la respuesta de OpenAI:", error)
      return []
    }
  }

  async analyzeIntent(keyword: string): Promise<AIIntentAnalysis> {
    try {
      const prompt = `
Analiza la intención de búsqueda detrás de la siguiente keyword: "${keyword}"

Clasifica la intención en una de las siguientes categorías:
- informational: El usuario busca información o respuestas
- transactional: El usuario quiere realizar una acción o transacción
- navigational: El usuario busca llegar a un sitio o página específica
- commercial: El usuario está investigando productos o servicios para comprar

Responde SOLO con un objeto JSON con la siguiente estructura exacta:
{
  "intent": "categoría de la intención",
  "confidence": número entre 0 y 1 que indica tu nivel de confianza,
  "explanation": "explicación breve de por qué has clasificado así la intención"
}
`

      const response = await this.generateText(prompt, 500)

      try {
        return extractJsonFromResponse(response)
      } catch (parseError) {
        console.error("Error al parsear la respuesta JSON:", parseError)
        console.log("Respuesta recibida:", response)

        // Devolver un objeto predeterminado en caso de error
        return {
          intent: "informational",
          confidence: 0.5,
          explanation: "No se pudo analizar correctamente la intención. Error en el formato de respuesta.",
        }
      }
    } catch (error: any) {
      console.error("Error en OpenAI analyzeIntent:", error)
      throw new Error(`Error al analizar la intención con OpenAI: ${error.message}`)
    }
  }

  async extractEntities(keyword: string): Promise<AIEntityAnalysis> {
    try {
      const prompt = `
Extrae las entidades principales de la siguiente keyword: "${keyword}"

Identifica personas, lugares, conceptos, productos, servicios u otras entidades relevantes.

Responde SOLO con un objeto JSON con la siguiente estructura exacta:
{
  "entities": [
    {
      "name": "nombre de la entidad",
      "type": "tipo de entidad (persona, lugar, producto, etc.)",
      "relevance": número entre 0 y 1 que indica la relevancia de esta entidad en la keyword
    }
  ]
}
`

      const response = await this.generateText(prompt, 500)

      try {
        return extractJsonFromResponse(response)
      } catch (parseError) {
        console.error("Error al parsear la respuesta JSON:", parseError)
        console.log("Respuesta recibida:", response)

        // Devolver un objeto predeterminado en caso de error
        return {
          entities: [],
        }
      }
    } catch (error: any) {
      console.error("Error en OpenAI extractEntities:", error)
      throw new Error(`Error al extraer entidades con OpenAI: ${error.message}`)
    }
  }
}

// Implementación para DeepSeek
class DeepSeekService extends BaseAIService {
  constructor(config: AIServiceConfig) {
    super(config)
  }

  async generateText(prompt: string, maxTokens = 100): Promise<string> {
    try {
      console.log("DeepSeek generateText - Iniciando solicitud")

      // URL base para la API de DeepSeek
      const apiUrl = "https://api.deepseek.com/v1/chat/completions"

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model || "deepseek-chat",
          messages: [{ role: "user", content: prompt }],
          max_tokens: maxTokens,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Error en la API de DeepSeek: ${response.status} ${response.statusText} - ${
            errorData.error?.message || JSON.stringify(errorData)
          }`,
        )
      }

      const data = await response.json()

      // Verificar la estructura de la respuesta
      if (!data || !data.choices || !data.choices.length || !data.choices[0].message) {
        console.error("Respuesta inesperada de DeepSeek:", data)
        throw new Error("Respuesta inesperada de la API de DeepSeek. Verifica tu API key y configuración.")
      }

      return data.choices[0].message.content.trim()
    } catch (error: any) {
      console.error("Error en DeepSeek generateText:", error)
      throw new Error(`Error al generar texto con DeepSeek: ${error.message}`)
    }
  }

  async generateKeywordSuggestions(topic: string, count: number): Promise<AIKeywordSuggestion[]> {
    const prompt = `Genera ${count} sugerencias de palabras clave relacionadas con "${topic}". Responde solo con un array JSON de objetos con los campos "keyword" y "relevance".`
    const response = await this.generateText(prompt)

    try {
      return JSON.parse(response)
    } catch (error) {
      console.error("Error al parsear la respuesta de DeepSeek:", error)
      return []
    }
  }

  async analyzeIntent(keyword: string): Promise<AIIntentAnalysis> {
    try {
      const prompt = `
Analiza la intención de búsqueda detrás de la siguiente keyword: "${keyword}"

Clasifica la intención en una de las siguientes categorías:
- informational: El usuario busca información o respuestas
- transactional: El usuario quiere realizar una acción o transacción
- navigational: El usuario busca llegar a un sitio o página específica
- commercial: El usuario está investigando productos o servicios para comprar

Responde SOLO con un objeto JSON con la siguiente estructura exacta:
{
  "intent": "categoría de la intención",
  "confidence": número entre 0 y 1 que indica tu nivel de confianza,
  "explanation": "explicación breve de por qué has clasificado así la intención"
}
`

      const response = await this.generateText(prompt, 500)

      try {
        return extractJsonFromResponse(response)
      } catch (parseError) {
        console.error("Error al parsear la respuesta JSON:", parseError)
        console.log("Respuesta recibida:", response)

        // Devolver un objeto predeterminado en caso de error
        return {
          intent: "informational",
          confidence: 0.5,
          explanation: "No se pudo analizar correctamente la intención. Error en el formato de respuesta.",
        }
      }
    } catch (error: any) {
      console.error("Error en DeepSeek analyzeIntent:", error)
      throw new Error(`Error al analizar la intención con DeepSeek: ${error.message}`)
    }
  }

  async extractEntities(keyword: string): Promise<AIEntityAnalysis> {
    try {
      const prompt = `
Extrae las entidades principales de la siguiente keyword: "${keyword}"

Identifica personas, lugares, conceptos, productos, servicios u otras entidades relevantes.

Responde SOLO con un objeto JSON con la siguiente estructura exacta:
{
  "entities": [
    {
      "name": "nombre de la entidad",
      "type": "tipo de entidad (persona, lugar, producto, etc.)",
      "relevance": número entre 0 y 1 que indica la relevancia de esta entidad en la keyword
    }
  ]
}
`

      const response = await this.generateText(prompt, 500)

      try {
        return extractJsonFromResponse(response)
      } catch (parseError) {
        console.error("Error al parsear la respuesta JSON:", parseError)
        console.log("Respuesta recibida:", response)

        // Devolver un objeto predeterminado en caso de error
        return {
          entities: [],
        }
      }
    } catch (error: any) {
      console.error("Error en DeepSeek extractEntities:", error)
      throw new Error(`Error al extraer entidades con DeepSeek: ${error.message}`)
    }
  }
}

// Función para probar la conexión a la API
export async function testApiConnection(config: AIServiceConfig): Promise<{ success: boolean; message: string }> {
  try {
    const aiService = getAIService(config)
    const testPrompt = "Responde con 'OK' si puedes leer este mensaje."
    await aiService.generateText(testPrompt, 10)
    return { success: true, message: "Conexión exitosa con la API." }
  } catch (error: any) {
    console.error("Error al probar la conexión:", error)
    return { success: false, message: error.message || "Error al conectar con la API." }
  }
}

// Función para obtener el servicio de IA adecuado
export function getAIService(config: AIServiceConfig): BaseAIService {
  // Verificar que config no sea undefined
  if (!config) {
    console.error("Error: La configuración del servicio de IA es undefined")
    throw new Error("Configuración del servicio de IA no proporcionada. Verifica tu configuración.")
  }

  // Verificar que apiKey no sea undefined
  if (!config.apiKey) {
    console.error("Error: API key no configurada en la configuración:", config)
    throw new Error(`API key de ${config.provider} no configurada. Verifica tu configuración.`)
  }

  if (config.provider === "openai") {
    return new OpenAIService(config)
  } else if (config.provider === "deepseek") {
    return new DeepSeekService(config)
  } else {
    throw new Error(`Proveedor de IA no soportado: ${config.provider}`)
  }
}

// Función para obtener la configuración de IA desde localStorage
export function getAIConfigFromStorage(): AIServiceConfig | null {
  try {
    // Intentar obtener la configuración del localStorage
    const storedConfig = localStorage.getItem("aiConfig")
    if (!storedConfig) {
      console.warn("No se encontró configuración de IA en localStorage")
      return null
    }

    const config = JSON.parse(storedConfig)

    // Verificar que la configuración tenga los campos necesarios
    if (!config || !config.provider || !config.apiKey) {
      console.warn("Configuración de IA incompleta en localStorage:", config)
      return null
    }

    return config
  } catch (error) {
    console.error("Error al obtener la configuración de IA desde localStorage:", error)
    return null
  }
}

// Función para obtener el servicio de IA con la configuración almacenada
export function getDefaultAIService(): BaseAIService {
  const config = getAIConfigFromStorage()

  if (!config) {
    throw new Error("No se encontró configuración de IA. Por favor, configura primero el proveedor y la API key.")
  }

  return getAIService(config)
}

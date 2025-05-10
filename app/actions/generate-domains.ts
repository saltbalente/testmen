"use server"

import { z } from "zod"

// Esquema de validación para los parámetros de entrada
const domainGeneratorSchema = z.object({
  keyword: z.string().min(1, "La palabra clave es obligatoria"),
  count: z.number().min(1).max(20),
  keepAllWords: z.boolean(),
  useHyphens: z.boolean(),
  includeNumbers: z.boolean(),
  rootDomain: z.string().optional(),
})

type DomainGeneratorInput = z.infer<typeof domainGeneratorSchema>

export async function generateDomainNames(data: DomainGeneratorInput) {
  try {
    // Validar los datos de entrada
    const validatedData = domainGeneratorSchema.parse(data)

    // Construir el prompt para la API de OpenAI
    const prompt = `
    Genera ${validatedData.count} nombres de subdominios creativos y memorables basados en la palabra clave "${validatedData.keyword}".
    
    Requisitos:
    ${validatedData.keepAllWords ? "- Mantén todas las palabras del término ingresado." : "- Puedes modificar o eliminar palabras del término ingresado."}
    ${validatedData.useHyphens ? "- Usa guiones entre palabras." : "- No uses guiones entre palabras."}
    ${validatedData.includeNumbers ? "- Puedes incluir números en los nombres." : "- No incluyas números en los nombres."}
    
    Formato de respuesta:
    Devuelve SOLO un array JSON de strings con los subdominios generados, sin ningún texto adicional.
    Ejemplo: ["subdominio1", "subdominio2", "subdominio3"]
    
    IMPORTANTE: No incluyas marcadores de código como \`\`\`json o \`\`\` en tu respuesta.
    
    Asegúrate de que los nombres sean:
    - Cortos y fáciles de recordar
    - Relevantes al tema o industria
    - Fáciles de pronunciar y escribir
    - Únicos y distintivos
    - Adecuados para uso en internet
    `

    // Llamada a OpenAI
    let results: string[] = []

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Eres un experto en naming y dominios web. Tu tarea es generar nombres de subdominios creativos y efectivos. Responde SOLO con un array JSON de strings, sin marcadores de código ni texto adicional.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`Error en la API de OpenAI: ${openaiResponse.statusText}`)
    }

    const openaiData = await openaiResponse.json()

    // Limpiar la respuesta de cualquier marcador de código
    let content = openaiData.choices[0].message.content.trim()

    // Eliminar marcadores de código markdown si existen
    content = content.replace(/```json|```/g, "").trim()

    try {
      // Intentar parsear la respuesta como JSON
      results = JSON.parse(content)

      // Asegurarse de que el resultado es un array
      if (!Array.isArray(results)) {
        throw new Error("La respuesta no es un array")
      }
    } catch (e) {
      console.error("Error al parsear JSON:", e)
      // Si falla el parsing, extraer los dominios del texto
      results = content
        .replace(/[[\]"']/g, "")
        .split(",")
        .map((item: string) => item.trim())
        .filter((item: string) => item.length > 0)
    }

    // Limpiar cada dominio de posibles marcadores de código
    results = results.map((domain) => {
      return domain.replace(/```json|```/g, "").trim()
    })

    // Limitar al número solicitado
    const limitedResults = results.slice(0, validatedData.count)

    // Si no hay suficientes resultados, generar un error
    if (limitedResults.length === 0) {
      throw new Error("No se pudieron generar subdominios. Por favor, intenta con otra palabra clave.")
    }

    return {
      success: true,
      domains: limitedResults,
      rootDomain: validatedData.rootDomain,
    }
  } catch (error) {
    console.error("Error al generar dominios:", error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Datos de entrada inválidos: " + error.errors.map((e) => e.message).join(", "),
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al generar dominios",
    }
  }
}

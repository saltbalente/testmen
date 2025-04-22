import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { keywords, prompt, existingCategories } = await request.json()

    if (!keywords || keywords.length === 0) {
      return NextResponse.json({ error: "No se proporcionaron palabras clave" }, { status: 400 })
    }

    // Preparar el prompt para OpenAI
    const keywordsText = Array.isArray(keywords) ? keywords.join("\n") : keywords

    const categoriesText =
      existingCategories && existingCategories.length > 0
        ? `Categorías existentes que puedes usar: ${existingCategories.join(", ")}.`
        : "Crea categorías apropiadas para estas palabras clave."

    const systemPrompt = `
      Eres un experto en marketing digital especializado en nichos esotéricos.
      Tu tarea es categorizar las siguientes palabras clave en grupos lógicos.
      ${categoriesText}
      Responde SOLO con un formato JSON que contenga un objeto con la palabra clave como clave y la categoría como valor.
      Ejemplo: {"tarot amor": "Tarot", "piedra amatista": "Cristales"}
    `

    const userPrompt = `
      ${prompt || "Categoriza estas palabras clave esotéricas en grupos lógicos."}
      
      Palabras clave a categorizar:
      ${keywordsText}
    `

    // Llamar a la API de OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    })

    // Extraer y parsear la respuesta
    const content = response.choices[0].message.content

    if (!content) {
      throw new Error("No se recibió respuesta de la IA")
    }

    // Extraer el JSON de la respuesta (puede estar rodeado de texto)
    const jsonMatch = content.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      throw new Error("No se pudo extraer JSON de la respuesta")
    }

    const categorizedKeywords = JSON.parse(jsonMatch[0])

    return NextResponse.json({ categorizedKeywords })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}

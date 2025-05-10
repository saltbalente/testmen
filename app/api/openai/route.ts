import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { endpoint, data } = await request.json()

    // Usar la clave API desde las variables de entorno del servidor
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
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

    // Devolver la respuesta al cliente
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error calling OpenAI API:", error)
    return NextResponse.json({ error: "Failed to call OpenAI API" }, { status: 500 })
  }
}

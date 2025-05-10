import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json({ error: "DeepSeek API key is not configured" }, { status: 400 })
  }

  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const response = await fetch(process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You are an expert prompt engineer. Your task is to optimize and improve the given prompt to make it more effective, clear, and likely to produce better results from AI models. Maintain the original intent but enhance structure, clarity, and specificity.",
          },
          {
            role: "user",
            content: `Please optimize this prompt:\n\n${prompt}`,
          },
        ],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to optimize prompt" },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json({ optimizedPrompt: data.choices[0].message.content })
  } catch (error) {
    console.error("Error in optimize-template route:", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}

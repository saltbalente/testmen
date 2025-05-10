import type { AISettingsState } from "@/components/ai-settings"

export async function generateWithDeepSeek(
  prompt: string,
  aiSettings: AISettingsState,
): Promise<{ success: boolean; text: string; error?: string }> {
  try {
    if (!aiSettings.apiKey) {
      return {
        success: false,
        text: "",
        error: "No se ha configurado una API key para DeepSeek",
      }
    }

    const response = await fetch(aiSettings.apiUrl || "https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aiSettings.apiKey}`,
      },
      body: JSON.stringify({
        model: aiSettings.model || "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: aiSettings.temperature || 0.7,
        max_tokens: aiSettings.maxTokens || 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        text: "",
        error: `Error de API: ${errorData.error?.message || response.statusText}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      text: data.choices[0].message.content,
    }
  } catch (error) {
    console.error("Error al llamar a DeepSeek:", error)
    return {
      success: false,
      text: "",
      error: `Error al conectar con DeepSeek: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

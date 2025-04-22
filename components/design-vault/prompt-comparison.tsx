"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Copy, Download, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { type AIProvider, type AIServiceConfig, getAIService } from "@/services/ai-service"

// Modelos de IA por proveedor
const aiModels = {
  openai: ["gpt-4o", "gpt-4", "gpt-3.5-turbo"],
  deepseek: ["deepseek-chat", "deepseek-coder"],
}

export function PromptComparison() {
  // Estado para el prompt base
  const [basePrompt, setBasePrompt] = useState("")

  // Estado para los resultados
  const [openaiResult, setOpenaiResult] = useState("")
  const [deepseekResult, setDeepseekResult] = useState("")

  // Estado para los modelos seleccionados
  const [openaiModel, setOpenaiModel] = useState("gpt-4o")
  const [deepseekModel, setDeepseekModel] = useState("deepseek-chat")

  // Estado para indicar si está procesando
  const [isProcessingOpenai, setIsProcessingOpenai] = useState(false)
  const [isProcessingDeepseek, setIsProcessingDeepseek] = useState(false)

  // Estado para la configuración de IA
  const [aiConfig, setAiConfig] = useState<AIServiceConfig | null>(null)

  // Cargar configuración de IA al inicio
  useEffect(() => {
    const loadAiConfig = () => {
      try {
        const savedConfig = localStorage.getItem("aiConfig")
        if (savedConfig) {
          const config = JSON.parse(savedConfig) as AIServiceConfig
          setAiConfig(config)
        } else {
          // Configuración por defecto si no hay nada guardado
          setAiConfig({
            provider: "openai",
            apiKey: "", // API Key should be handled server-side
            model: "gpt-4o",
          })
        }
      } catch (error) {
        console.error("Error al cargar la configuración de IA:", error)
      }
    }

    loadAiConfig()
  }, [])

  // Función para mejorar el prompt con un proveedor específico
  const enhancePromptWithProvider = async (
    provider: AIProvider,
    model: string,
    setResult: (result: string) => void,
    setIsProcessing: (isProcessing: boolean) => void,
  ) => {
    if (!aiConfig || !aiConfig.apiKey) {
      toast({
        title: "Configuración de IA no encontrada",
        description: "Por favor, configura tu API de IA en la sección de Configuración",
        variant: "destructive",
      })
      return
    }

    if (!basePrompt.trim()) {
      toast({
        title: "Prompt vacío",
        description: "Por favor, ingresa un prompt base para mejorar",
        variant: "destructive",
      })
      return
    }

    try {
      setIsProcessing(true)

      // Crear una configuración temporal con el proveedor y modelo seleccionados
      const tempConfig: AIServiceConfig = {
        ...aiConfig,
        provider,
        model,
      }

      const aiService = getAIService(tempConfig)

      const messages = [
        {
          role: "system",
          content: `Eres un experto en diseño web y UX/UI. Tu tarea es mejorar el siguiente prompt para generar un diseño web excepcional.
          Añade detalles técnicos específicos, principios de diseño, referencias a tendencias actuales, y sugerencias para mejorar la usabilidad y experiencia del usuario.
          Mantén un tono profesional y específico. No uses lenguaje florido o innecesariamente complejo.
          Estructura el prompt en secciones claras: Estilo, Colores, Elementos, Layout, Experiencia de usuario, y Detalles técnicos.
          Responde ÚNICAMENTE con el prompt mejorado, sin comentarios adicionales.`,
        },
        { role: "user", content: basePrompt },
      ]

      // The API key should be passed securely, ideally via server actions or a secure backend.
      // This example assumes the aiService.getEndpoint() handles authentication correctly.
      const response = await fetch(aiService.getEndpoint(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${aiConfig.apiKey}`, // Removed direct API key usage
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || "Error al comunicarse con la API")
      }

      const data = await response.json()
      const enhancedText = data.choices[0].message.content

      setResult(enhancedText)
    } catch (error) {
      console.error(`Error al mejorar el prompt con ${provider}:`, error)
      toast({
        title: `Error con ${provider}`,
        description: error.message || "Ocurrió un error al comunicarse con la API de IA",
        variant: "destructive",
      })
      setResult(`Error: ${error.message || "Ocurrió un error al procesar el prompt"}`)
    } finally {
      setIsProcessing(false)
    }
  }

  // Función para mejorar con ambos proveedores
  const enhanceWithBothProviders = async () => {
    await Promise.all([
      enhancePromptWithProvider("openai", openaiModel, setOpenaiResult, setIsProcessingOpenai),
      enhancePromptWithProvider("deepseek", deepseekModel, setDeepseekResult, setIsProcessingDeepseek),
    ])
  }

  // Función para copiar texto al portapapeles
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Texto copiado",
      description: "El texto ha sido copiado al portapapeles",
    })
  }

  // Función para descargar texto como archivo
  const downloadText = (text: string, filename: string) => {
    const element = document.createElement("a")
    const file = new Blob([text], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Comparador de Prompts</CardTitle>
        <CardDescription>Compara cómo diferentes modelos de IA mejoran tus prompts de diseño</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prompt base */}
        <div className="space-y-2">
          <Label htmlFor="base-prompt">Prompt Base</Label>
          <Textarea
            id="base-prompt"
            placeholder="Ingresa tu prompt de diseño base aquí..."
            value={basePrompt}
            onChange={(e) => setBasePrompt(e.target.value)}
            className="min-h-[100px]"
          />
          <Button
            onClick={enhanceWithBothProviders}
            disabled={!basePrompt.trim() || !aiConfig || !aiConfig.apiKey || isProcessingOpenai || isProcessingDeepseek}
            className="w-full mt-2"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {isProcessingOpenai || isProcessingDeepseek ? "Procesando..." : "Mejorar con ambos proveedores"}
          </Button>
        </div>

        <Separator />

        {/* Resultados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* OpenAI */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>OpenAI</Label>
              <Select value={openaiModel} onValueChange={setOpenaiModel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecciona un modelo" />
                </SelectTrigger>
                <SelectContent>
                  {aiModels.openai.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="El resultado de OpenAI aparecerá aquí"
              value={openaiResult}
              readOnly
              className="min-h-[200px]"
            />
            <div className="flex gap-2">
              <Button onClick={() => copyText(openaiResult)} disabled={!openaiResult} size="sm" className="flex-1">
                <Copy className="mr-2 h-4 w-4" /> Copiar
              </Button>
              <Button
                onClick={() => downloadText(openaiResult, "openai-enhanced-prompt.txt")}
                disabled={!openaiResult}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" /> Descargar
              </Button>
            </div>
          </div>

          {/* DeepSeek */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>DeepSeek</Label>
              <Select value={deepseekModel} onValueChange={setDeepseekModel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecciona un modelo" />
                </SelectTrigger>
                <SelectContent>
                  {aiModels.deepseek.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="El resultado de DeepSeek aparecerá aquí"
              value={deepseekResult}
              readOnly
              className="min-h-[200px]"
            />
            <div className="flex gap-2">
              <Button onClick={() => copyText(deepseekResult)} disabled={!deepseekResult} size="sm" className="flex-1">
                <Copy className="mr-2 h-4 w-4" /> Copiar
              </Button>
              <Button
                onClick={() => downloadText(deepseekResult, "deepseek-enhanced-prompt.txt")}
                disabled={!deepseekResult}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" /> Descargar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Compara cómo diferentes modelos de IA mejoran tus prompts para obtener los mejores resultados
        </p>
      </CardFooter>
    </Card>
  )
}

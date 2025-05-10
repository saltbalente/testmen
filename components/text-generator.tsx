"use client"

import { useState } from "react"
import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAISettings } from "@/context/ai-settings"

const TextGenerator = () => {
  const [prompt, setPrompt] = useState("")
  const [generatedText, setGeneratedText] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { aiSettings } = useAISettings()

  // Añadir esta sección al principio del componente, justo después de los estados
  // Verificar si hay una API key configurada
  const apiKeyConfigured = !!aiSettings.apiKey

  const generateText = async () => {
    if (!prompt) {
      toast({
        title: "Por favor, introduce un prompt.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setGeneratedText(data.result)
    } catch (error: any) {
      console.error("Error generating text:", error)
      toast({
        title: "Error al generar el texto.",
        description: error.message || "Ha ocurrido un error inesperado.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      {/* Añadir esta alerta al principio del JSX, antes del formulario principal */}
      {!apiKeyConfigured && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Key no configurada</AlertTitle>
          <AlertDescription>
            Para generar textos reales con DeepSeek, necesitas configurar tu API key en la sección de Configuración de
            IA.
          </AlertDescription>
        </Alert>
      )}
      <h1 className="text-2xl font-bold mb-4">Generador de Texto con DeepSeek</h1>
      <div className="mb-4">
        <Label htmlFor="prompt">Prompt:</Label>
        <Input
          type="text"
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Introduce tu prompt aquí"
        />
      </div>
      <Button onClick={generateText} disabled={loading}>
        {loading ? "Generando..." : "Generar Texto"}
      </Button>
      {generatedText && (
        <div className="mt-4">
          <Label htmlFor="generatedText">Texto Generado:</Label>
          <Textarea id="generatedText" value={generatedText} readOnly className="mt-2" />
        </div>
      )}
    </div>
  )
}

export default TextGenerator

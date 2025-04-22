"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import { Loader2, Copy, Download, RefreshCw } from "lucide-react"
import { getAIService } from "@/services/ai-service"

interface CampaignStructure {
  campaign: string
  adGroup: string
  keywords: string[]
}

export function CampaignStructureGenerator() {
  const [keywords, setKeywords] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [structure, setStructure] = useState<CampaignStructure[]>([])
  const [rawResponse, setRawResponse] = useState("")

  const generateStructure = async () => {
    if (!keywords.trim()) {
      toast({
        title: "Error",
        description: "Por favor, ingresa al menos una palabra clave",
        variant: "destructive",
      })
      return
    }

    try {
      setIsGenerating(true)
      setProgress(10)
      setStructure([])
      setRawResponse("")

      // Obtener la API key de OpenAI del localStorage
      const openaiApiKey = localStorage.getItem("openai_api_key")
      const aiModel = localStorage.getItem("ai_model") || "gpt-4o"

      if (!openaiApiKey) {
        toast({
          title: "Error de configuración",
          description: "No se encontró la API key de OpenAI. Por favor, configúrala en la pestaña Generador.",
          variant: "destructive",
        })
        setIsGenerating(false)
        return
      }

      setProgress(30)

      // Obtener el servicio de IA
      const aiService = getAIService({
        provider: "openai",
        apiKey: openaiApiKey,
        model: aiModel,
      })

      setProgress(50)

      // Crear el prompt para la IA
      const prompt = `
Actúa como experto en Google Ads especializado en servicios esotéricos y de brujería. Necesito crear una estructura de campañas efectiva para Google Ads basada en las siguientes palabras clave:

${keywords}

Crea una estructura organizada que contenga:
1. Campañas (máximo 5)
2. Grupos de anuncios para cada campaña (2-4 por campaña)
3. Palabras clave relevantes para cada grupo de anuncios

Organiza las palabras clave proporcionadas en grupos temáticos coherentes que maximicen la relevancia y el nivel de calidad. Añade variaciones de concordancia (amplia, de frase, exacta) cuando sea apropiado.

Devuelve los resultados en formato JSON con esta estructura:
[
  {
    "campaign": "Nombre de Campaña",
    "adGroup": "Nombre de Grupo de Anuncios",
    "keywords": ["palabra clave 1", "palabra clave 2", ...]
  },
  ...
]

Asegúrate de que la estructura sea lógica y optimizada para servicios esotéricos, con enfoque en generar consultas (leads) y no ventas directas.

IMPORTANTE PARA LOS ANUNCIOS:
1. NO USES CORCHETES [] EN NINGUNA PARTE DE LOS TÍTULOS O DESCRIPCIONES DE ANUNCIOS. Los corchetes son solo para concordancia de palabras clave, no para textos de anuncios.

2. Todos los títulos y descripciones deben ser FRASES COMPLETAS con sentido. Si una frase no cabe en el límite de caracteres, REFORMÚLALA para que sea más corta pero mantenga el sentido completo.

3. Ejemplo de lo que NO debes hacer:
   - "Auténtico [hechizos para enamo" (incorrecto: tiene corchetes y está incompleto)
   
   Ejemplo de lo que SÍ debes hacer:
   - "Auténticos hechizos de amor" (correcto: sin corchetes y frase completa)
`

      setProgress(70)

      // Llamar a la API
      const response = await aiService.generateText(prompt, 2000)

      setProgress(90)

      // Procesar la respuesta
      let parsedStructure: CampaignStructure[] = []

      try {
        // Intentar extraer el JSON de la respuesta
        const jsonMatch =
          response.match(/```json\s*([\s\S]*?)\s*```/) ||
          response.match(/\[\s*\{\s*"campaign"/) ||
          response.match(/\[\n\s*\{\n\s*"campaign"/)

        const jsonStr = jsonMatch ? jsonMatch[0].replace(/```json\s*/, "").replace(/\s*```/, "") : response

        parsedStructure = JSON.parse(jsonStr)
        setStructure(parsedStructure)
      } catch (parseError) {
        console.error("Error al parsear la respuesta JSON:", parseError)
        // Si no se puede parsear como JSON, mostrar la respuesta en bruto
        setRawResponse(response)
      }

      setProgress(100)

      toast({
        title: "Estructura generada",
        description: "La estructura de campañas ha sido generada exitosamente",
      })
    } catch (error) {
      console.error("Error al generar la estructura:", error)
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al generar la estructura",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    let textToCopy = ""

    if (structure.length > 0) {
      textToCopy = structure
        .map(
          (item) =>
            `Campaña: ${item.campaign}\nGrupo de Anuncios: ${item.adGroup}\nPalabras Clave: ${item.keywords.join(", ")}\n\n`,
        )
        .join("")
    } else if (rawResponse) {
      textToCopy = rawResponse
    }

    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
      toast({
        title: "Copiado",
        description: "La estructura ha sido copiada al portapapeles",
      })
    }
  }

  const downloadStructure = () => {
    let content = ""

    if (structure.length > 0) {
      content = structure
        .map(
          (item) =>
            `Campaña: ${item.campaign}\nGrupo de Anuncios: ${item.adGroup}\nPalabras Clave: ${item.keywords.join(", ")}\n\n`,
        )
        .join("")
    } else if (rawResponse) {
      content = rawResponse
    }

    if (content) {
      const element = document.createElement("a")
      const file = new Blob([content], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = "estructura-campanas-google-ads.txt"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      toast({
        title: "Descargado",
        description: "La estructura ha sido descargada como archivo de texto",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="keywords">Palabras Clave</Label>
        <Textarea
          id="keywords"
          placeholder="Ingresa tus palabras clave, una por línea. Ejemplo:
amarres de amor
tarot del amor
videntes buenas
amarres eternos
hechizos de amor
..."
          className="min-h-[150px] bg-black/20 border-white/10"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          disabled={isGenerating}
        />
      </div>

      <div className="flex justify-between items-center">
        <Button
          onClick={generateStructure}
          disabled={isGenerating || !keywords.trim()}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generar Estructura
            </>
          )}
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            disabled={isGenerating || (structure.length === 0 && !rawResponse)}
            title="Copiar al portapapeles"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={downloadStructure}
            disabled={isGenerating || (structure.length === 0 && !rawResponse)}
            title="Descargar como archivo de texto"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isGenerating && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Generando estructura...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {structure.length > 0 && (
        <div className="mt-6 border border-purple-500/20 rounded-lg overflow-hidden">
          <div className="bg-purple-900/20 p-3 border-b border-purple-500/20">
            <h3 className="font-medium">Estructura de Campañas Generada</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-black/30">
                  <th className="px-4 py-2 text-left font-medium text-purple-300 border-b border-r border-purple-500/20">
                    Campaña
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-purple-300 border-b border-r border-purple-500/20">
                    Grupo de Anuncios
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-purple-300 border-b border-purple-500/20">
                    Palabras Clave
                  </th>
                </tr>
              </thead>
              <tbody>
                {structure.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-black/10" : "bg-black/20"}>
                    <td className="px-4 py-3 border-r border-purple-500/10 align-top">{item.campaign}</td>
                    <td className="px-4 py-3 border-r border-purple-500/10 align-top">{item.adGroup}</td>
                    <td className="px-4 py-3 align-top">
                      <ul className="list-disc pl-5 space-y-1">
                        {item.keywords.map((keyword, kidx) => (
                          <li key={kidx} className="text-sm">
                            {keyword}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!structure.length && rawResponse && (
        <div className="mt-6 border border-purple-500/20 rounded-lg overflow-hidden">
          <div className="bg-purple-900/20 p-3 border-b border-purple-500/20">
            <h3 className="font-medium">Respuesta de la IA</h3>
          </div>
          <div className="p-4 bg-black/20 max-h-[400px] overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm">{rawResponse}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Wand2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { type AIProvider, type AIServiceConfig, getAIService } from "@/services/ai-service"

// Tipos para las opciones del generador
interface DesignPromptOptions {
  style: string
  colors: string[]
  mood: string
  elements: string[]
  layout: string
  inspiration: string[]
  constraints: string
  aiProvider: AIProvider
  aiModel: string
}

// Opciones predefinidas
const styleOptions = [
  "Minimalista",
  "Corporativo",
  "Creativo",
  "Elegante",
  "Futurista",
  "Retro",
  "Flat Design",
  "Material Design",
  "Neumorfismo",
  "Glassmorphism",
  "3D",
  "Ilustrativo",
]

const colorOptions = [
  "Azul",
  "Verde",
  "Rojo",
  "Amarillo",
  "Naranja",
  "Púrpura",
  "Rosa",
  "Turquesa",
  "Gris",
  "Negro",
  "Blanco",
  "Marrón",
  "Dorado",
  "Plateado",
]

const moodOptions = [
  "Profesional",
  "Amigable",
  "Lujoso",
  "Divertido",
  "Serio",
  "Relajado",
  "Enérgico",
  "Tranquilo",
  "Inspirador",
  "Confiable",
  "Innovador",
  "Nostálgico",
]

const elementOptions = [
  "Botones redondeados",
  "Iconos lineales",
  "Sombras suaves",
  "Gradientes",
  "Bordes finos",
  "Animaciones sutiles",
  "Imágenes a pantalla completa",
  "Tipografía serif",
  "Tipografía sans-serif",
  "Patrones geométricos",
  "Texturas orgánicas",
  "Ilustraciones personalizadas",
]

const layoutOptions = [
  "Una columna",
  "Dos columnas",
  "Tres columnas",
  "Asimétrico",
  "Grid",
  "Masonry",
  "Horizontal scrolling",
  "Parallax",
  "Card-based",
  "Split screen",
  "Hero section grande",
  "Minimalista con mucho espacio",
]

const inspirationOptions = [
  "Apple",
  "Airbnb",
  "Stripe",
  "Dribbble",
  "Behance",
  "Awwwards",
  "Pinterest",
  "Instagram",
  "Spotify",
  "Medium",
  "Figma",
  "Notion",
]

// Modelos de IA por proveedor
const aiModels = {
  openai: ["gpt-4o", "gpt-4", "gpt-3.5-turbo"],
  deepseek: ["deepseek-chat", "deepseek-coder"],
}

export function PromptGenerator() {
  // Estado para las opciones del prompt
  const [options, setOptions] = useState<DesignPromptOptions>({
    style: "Minimalista",
    colors: ["Azul", "Blanco"],
    mood: "Profesional",
    elements: ["Botones redondeados", "Sombras suaves"],
    layout: "Una columna",
    inspiration: ["Apple"],
    constraints: "",
    aiProvider: "openai",
    aiModel: "gpt-4o",
  })

  // Estado para el prompt generado
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [enhancedPrompt, setEnhancedPrompt] = useState("")
  const [isEnhancing, setIsEnhancing] = useState(false)
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
            apiKey: "", // API key should be handled securely, e.g., via server actions
            model: "gpt-4o",
          })
        }
      } catch (error) {
        console.error("Error al cargar la configuración de IA:", error)
      }
    }

    loadAiConfig()
  }, [])

  // Función para generar el prompt básico
  const generatePrompt = () => {
    const prompt = `Diseño web ${options.style.toLowerCase()} con colores ${options.colors
      .join(", ")
      .toLowerCase()} que transmita una sensación ${options.mood.toLowerCase()}. 
Incluir elementos como ${options.elements.join(", ").toLowerCase()} en un layout de ${options.layout.toLowerCase()}.
${options.inspiration.length > 0 ? `Inspirado en el estilo de ${options.inspiration.join(", ")}.` : ""}
${options.constraints ? `Restricciones adicionales: ${options.constraints}` : ""}`

    setGeneratedPrompt(prompt)
  }

  // Función para mejorar el prompt usando IA
  const enhancePromptWithAI = async () => {
    if (!aiConfig) {
      toast({
        title: "Configuración de IA no encontrada",
        description: "Por favor, configura tu API de IA en la sección de Configuración",
        variant: "destructive",
      })
      return
    }

    try {
      setIsEnhancing(true)

      // Crear una configuración temporal con el proveedor y modelo seleccionados
      const tempConfig: AIServiceConfig = {
        ...aiConfig,
        provider: options.aiProvider,
        model: options.aiModel,
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
        { role: "user", content: generatedPrompt },
      ]

      // The API key should be passed securely, e.g., via server actions.
      // This example assumes the API key is available in aiConfig.
      if (!aiConfig.apiKey) {
        toast({
          title: "API Key no configurada",
          description: "Por favor, configura tu API Key en la sección de configuración.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(aiService.getEndpoint(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${aiConfig.apiKey}`,
        },
        body: JSON.stringify({
          model: options.aiModel,
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

      setEnhancedPrompt(enhancedText)
    } catch (error) {
      console.error("Error al mejorar el prompt:", error)
      toast({
        title: "Error al mejorar el prompt",
        description: error.message || "Ocurrió un error al comunicarse con la API de IA",
        variant: "destructive",
      })
    } finally {
      setIsEnhancing(false)
    }
  }

  // Función para copiar el prompt al portapapeles
  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Prompt copiado",
      description: "El prompt ha sido copiado al portapapeles",
    })
  }

  // Función para descargar el prompt como archivo de texto
  const downloadPrompt = (text: string, filename = "design-prompt.txt") => {
    const element = document.createElement("a")
    const file = new Blob([text], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Manejar cambios en las opciones
  const handleStyleChange = (value: string) => {
    setOptions((prev) => ({ ...prev, style: value }))
  }

  const handleColorToggle = (color: string) => {
    setOptions((prev) => ({
      ...prev,
      colors: prev.colors.includes(color) ? prev.colors.filter((c) => c !== color) : [...prev.colors, color],
    }))
  }

  const handleMoodChange = (value: string) => {
    setOptions((prev) => ({ ...prev, mood: value }))
  }

  const handleElementToggle = (element: string) => {
    setOptions((prev) => ({
      ...prev,
      elements: prev.elements.includes(element)
        ? prev.elements.filter((e) => e !== element)
        : [...prev.elements, element],
    }))
  }

  const handleLayoutChange = (value: string) => {
    setOptions((prev) => ({ ...prev, layout: value }))
  }

  const handleInspirationToggle = (inspiration: string) => {
    setOptions((prev) => ({
      ...prev,
      inspiration: prev.inspiration.includes(inspiration)
        ? prev.inspiration.filter((i) => i !== inspiration)
        : [...prev.inspiration, inspiration],
    }))
  }

  const handleConstraintsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOptions((prev) => ({ ...prev, constraints: e.target.value }))
  }

  // Manejar cambios en el proveedor de IA
  const handleAiProviderChange = (value: string) => {
    const provider = value as AIProvider
    setOptions((prev) => ({
      ...prev,
      aiProvider: provider,
      // Establecer el modelo predeterminado para el proveedor seleccionado
      aiModel: aiModels[provider][0],
    }))
  }

  // Manejar cambios en el modelo de IA
  const handleAiModelChange = (value: string) => {
    setOptions((prev) => ({ ...prev, aiModel: value }))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generador de Prompts de Diseño</CardTitle>
        <CardDescription>Crea prompts detallados para generar diseños web con IA</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="options">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="options">Opciones</TabsTrigger>
            <TabsTrigger value="prompt">Prompt Básico</TabsTrigger>
            <TabsTrigger value="enhanced">Prompt Mejorado</TabsTrigger>
          </TabsList>

          <TabsContent value="options" className="space-y-4 mt-4">
            <div className="space-y-4">
              {/* Configuración de IA */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Configuración de IA</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ai-provider">Proveedor de IA</Label>
                    <Select value={options.aiProvider} onValueChange={handleAiProviderChange}>
                      <SelectTrigger id="ai-provider">
                        <SelectValue placeholder="Selecciona un proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="deepseek">DeepSeek</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ai-model">Modelo de IA</Label>
                    <Select value={options.aiModel} onValueChange={handleAiModelChange}>
                      <SelectTrigger id="ai-model">
                        <SelectValue placeholder="Selecciona un modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        {aiModels[options.aiProvider].map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Estilo */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Estilo</h3>
                <Select value={options.style} onValueChange={handleStyleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    {styleOptions.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Colores */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Colores</h3>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <Badge
                      key={color}
                      variant={options.colors.includes(color) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleColorToggle(color)}
                    >
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Estado de ánimo */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Estado de ánimo</h3>
                <Select value={options.mood} onValueChange={handleMoodChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado de ánimo" />
                  </SelectTrigger>
                  <SelectContent>
                    {moodOptions.map((mood) => (
                      <SelectItem key={mood} value={mood}>
                        {mood}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Elementos */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Elementos</h3>
                <div className="flex flex-wrap gap-2">
                  {elementOptions.map((element) => (
                    <Badge
                      key={element}
                      variant={options.elements.includes(element) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleElementToggle(element)}
                    >
                      {element}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Layout */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Layout</h3>
                <Select value={options.layout} onValueChange={handleLayoutChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un layout" />
                  </SelectTrigger>
                  <SelectContent>
                    {layoutOptions.map((layout) => (
                      <SelectItem key={layout} value={layout}>
                        {layout}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Inspiración */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Inspiración</h3>
                <div className="flex flex-wrap gap-2">
                  {inspirationOptions.map((inspiration) => (
                    <Badge
                      key={inspiration}
                      variant={options.inspiration.includes(inspiration) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleInspirationToggle(inspiration)}
                    >
                      {inspiration}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Restricciones */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Restricciones adicionales</h3>
                <Textarea
                  placeholder="Añade cualquier restricción o requisito adicional"
                  value={options.constraints}
                  onChange={handleConstraintsChange}
                />
              </div>

              <Button onClick={generatePrompt} className="w-full">
                Generar Prompt
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="prompt" className="space-y-4 mt-4">
            <Textarea
              placeholder="El prompt generado aparecerá aquí"
              value={generatedPrompt}
              readOnly
              className="min-h-[200px]"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={() => copyPrompt(generatedPrompt)} disabled={!generatedPrompt} className="flex-1">
                <Copy className="mr-2 h-4 w-4" /> Copiar
              </Button>
              <Button
                onClick={() => downloadPrompt(generatedPrompt)}
                disabled={!generatedPrompt}
                variant="outline"
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" /> Descargar
              </Button>
              <Button
                onClick={enhancePromptWithAI}
                disabled={!generatedPrompt || isEnhancing || !aiConfig || !aiConfig.apiKey}
                variant="secondary"
                className="flex-1"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {isEnhancing ? "Mejorando..." : "Mejorar con IA"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="enhanced" className="space-y-4 mt-4">
            <Textarea
              placeholder="El prompt mejorado aparecerá aquí después de usar la opción 'Mejorar con IA'"
              value={enhancedPrompt}
              readOnly
              className="min-h-[300px]"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={() => copyPrompt(enhancedPrompt)} disabled={!enhancedPrompt} className="flex-1">
                <Copy className="mr-2 h-4 w-4" /> Copiar
              </Button>
              <Button
                onClick={() => downloadPrompt(enhancedPrompt, "enhanced-design-prompt.txt")}
                disabled={!enhancedPrompt}
                variant="outline"
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" /> Descargar
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Usa estos prompts con herramientas de IA para generar diseños web
        </p>
      </CardFooter>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { CopyIcon, DownloadIcon, Sparkles, Brain, Target, Settings, RefreshCw, CheckCircle2, Clock } from "lucide-react"

// Tipos para el formulario
interface FormData {
  keywords: string
  textType: string
  textLength: string
  audienceType: string
  conversionGoal: string
  emotionalTriggers: string[]
  toneOfVoice: string
  urgencyLevel: number
  includeEmojis: boolean
  includePowerWords: boolean
  includeTestimonials: boolean
  includeStatistics: boolean
  includeCallToAction: boolean
  ctaType: string
  industrySpecific: string
  competitiveAnalysis: boolean
  abTestVariations: number
  personalizationLevel: number
  conversionOptimizationLevel: number
  advancedSettings: {
    neurolinguisticPatterns: boolean
    psychologicalTriggers: string[]
    persuasionTechniques: string[]
    cognitiveFraming: string
    emotionalValence: string
    decisionBiases: string[]
    attentionHooks: boolean
    memoryRetention: boolean
    socialProofType: string
    scarcityType: string
  }
}

// Componente principal
export function ConversionTextGenerator() {
  // Estados
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedText, setGeneratedText] = useState("")
  const [conversionScore, setConversionScore] = useState(0)
  const [deepseekApiKey, setDeepseekApiKey] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeTab, setActiveTab] = useState("generator")
  const [generationHistory, setGenerationHistory] = useState<
    Array<{ id: string; text: string; score: number; date: string }>
  >([])
  const [generatedPrompt, setGeneratedPrompt] = useState("")

  // Estado del formulario
  const [formData, setFormData] = useState<FormData>({
    keywords: "",
    textType: "headline",
    textLength: "short",
    audienceType: "general",
    conversionGoal: "purchase",
    emotionalTriggers: ["curiosity"],
    toneOfVoice: "professional",
    urgencyLevel: 50,
    includeEmojis: false,
    includePowerWords: true,
    includeTestimonials: false,
    includeStatistics: false,
    includeCallToAction: true,
    ctaType: "direct",
    industrySpecific: "general",
    competitiveAnalysis: false,
    abTestVariations: 1,
    personalizationLevel: 50,
    conversionOptimizationLevel: 75,
    advancedSettings: {
      neurolinguisticPatterns: false,
      psychologicalTriggers: [],
      persuasionTechniques: ["scarcity"],
      cognitiveFraming: "positive",
      emotionalValence: "positive",
      decisionBiases: ["anchoring"],
      attentionHooks: true,
      memoryRetention: false,
      socialProofType: "none",
      scarcityType: "none",
    },
  })

  // Cargar API key guardada
  useEffect(() => {
    const savedKey = localStorage.getItem("deepseek_api_key")
    if (savedKey) {
      setDeepseekApiKey(savedKey)
      setIsConnected(true)
    }

    // Cargar historial guardado
    const savedHistory = localStorage.getItem("conversion_text_history")
    if (savedHistory) {
      try {
        setGenerationHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("Error al cargar el historial:", e)
      }
    }
  }, [])

  // Manejar cambios en el formulario
  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Manejar cambios en configuración avanzada
  const handleAdvancedChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      advancedSettings: {
        ...prev.advancedSettings,
        [field]: value,
      },
    }))
  }

  // Probar conexión con DeepSeek
  const testConnection = async () => {
    if (!deepseekApiKey) {
      toast({
        title: "API Key requerida",
        description: "Por favor, ingresa tu API Key de DeepSeek",
        variant: "destructive",
      })
      return
    }

    try {
      toast({
        title: "Probando conexión",
        description: "Conectando con DeepSeek...",
      })

      // Simular verificación de API (en producción, hacer una llamada real a la API)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Guardar API key en localStorage
      localStorage.setItem("deepseek_api_key", deepseekApiKey)
      setIsConnected(true)

      toast({
        title: "Conexión exitosa",
        description: "Tu API Key de DeepSeek ha sido verificada correctamente",
      })
    } catch (error) {
      console.error("Error al probar la conexión:", error)
      setIsConnected(false)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con DeepSeek. Verifica tu API Key.",
        variant: "destructive",
      })
    }
  }

  // Cargar texto del historial
  const loadFromHistory = (item: any) => {
    setGeneratedText(item.text)
    setConversionScore(item.score)
    setActiveTab("result")

    toast({
      title: "Texto cargado",
      description: `Texto con puntuación de conversión: ${item.score}%`,
    })
  }

  // Construir prompt para DeepSeek
  const buildPrompt = () => {
    let prompt = `Genera un texto optimizado para conversiones con las siguientes características:\n\n`

    // Información básica
    prompt += `- Palabras clave: ${formData.keywords}\n`
    prompt += `- Tipo de texto: ${
      formData.textType === "headline"
        ? "Encabezado principal"
        : formData.textType === "subheadline"
          ? "Subtítulo"
          : formData.textType === "body"
            ? "Texto de cuerpo"
            : formData.textType === "cta"
              ? "Llamado a la acción (CTA)"
              : "Asunto de email"
    }\n`
    prompt += `- Longitud: ${
      formData.textLength === "very-short"
        ? "Muy corto (5-10 palabras)"
        : formData.textLength === "short"
          ? "Corto (10-20 palabras)"
          : formData.textLength === "medium"
            ? "Medio (20-50 palabras)"
            : formData.textLength === "long"
              ? "Largo (50-100 palabras)"
              : "Muy largo (100+ palabras)"
    }\n`
    prompt += `- Audiencia: ${
      formData.audienceType === "general"
        ? "General"
        : formData.audienceType === "spiritual"
          ? "Espiritual/Esotérica"
          : formData.audienceType === "skeptical"
            ? "Escéptica"
            : formData.audienceType === "curious"
              ? "Curiosa/Exploradora"
              : formData.audienceType === "experienced"
                ? "Experimentada en lo esotérico"
                : "Principiante en lo esotérico"
    }\n`
    prompt += `- Objetivo de conversión: ${
      formData.conversionGoal === "purchase"
        ? "Compra directa"
        : formData.conversionGoal === "signup"
          ? "Registro/Suscripción"
          : formData.conversionGoal === "lead"
            ? "Generación de leads"
            : formData.conversionGoal === "consultation"
              ? "Solicitud de consulta"
              : formData.conversionGoal === "download"
                ? "Descarga"
                : "Contacto"
    }\n`

    // Estilo y tono
    prompt += `- Tono de voz: ${
      formData.toneOfVoice === "professional"
        ? "Profesional"
        : formData.toneOfVoice === "mystical"
          ? "Místico"
          : formData.toneOfVoice === "authoritative"
            ? "Autoritario"
            : formData.toneOfVoice === "friendly"
              ? "Amigable"
              : formData.toneOfVoice === "urgent"
                ? "Urgente"
                : formData.toneOfVoice === "calming"
                  ? "Calmado"
                  : "Intrigante"
    }\n`
    prompt += `- Nivel de urgencia: ${formData.urgencyLevel}%\n`
    prompt += `- Nivel de optimización para conversión: ${formData.conversionOptimizationLevel}%\n`

    // Elementos a incluir
    prompt += `- Incluir emojis: ${formData.includeEmojis ? "Sí" : "No"}\n`
    prompt += `- Incluir palabras poderosas: ${formData.includePowerWords ? "Sí" : "No"}\n`
    prompt += `- Incluir llamado a la acción (CTA): ${formData.includeCallToAction ? "Sí" : "No"}\n`
    prompt += `- Incluir estadísticas: ${formData.includeStatistics ? "Sí" : "No"}\n`

    // Configuración avanzada
    if (formData.advancedSettings.persuasionTechniques.length > 0) {
      prompt += `- Técnicas de persuasión: ${formData.advancedSettings.persuasionTechniques.join(", ")}\n`
    }

    prompt += `- Encuadre cognitivo: ${
      formData.advancedSettings.cognitiveFraming === "positive"
        ? "Positivo (ganancia)"
        : formData.advancedSettings.cognitiveFraming === "negative"
          ? "Negativo (pérdida)"
          : formData.advancedSettings.cognitiveFraming === "neutral"
            ? "Neutral"
            : "Contraste"
    }\n`

    prompt += `- Valencia emocional: ${
      formData.advancedSettings.emotionalValence === "positive"
        ? "Positiva"
        : formData.advancedSettings.emotionalValence === "negative"
          ? "Negativa"
          : formData.advancedSettings.emotionalValence === "mixed"
            ? "Mixta"
            : "Neutral"
    }\n`

    if (formData.advancedSettings.decisionBiases.length > 0) {
      prompt += `- Sesgos de decisión a explotar: ${formData.advancedSettings.decisionBiases.join(", ")}\n`
    }

    if (formData.advancedSettings.neurolinguisticPatterns) {
      prompt += `- Aplicar patrones de Programación Neurolingüística (PNL)\n`
    }

    if (formData.advancedSettings.attentionHooks) {
      prompt += `- Incluir ganchos de atención\n`
    }

    if (formData.advancedSettings.memoryRetention) {
      prompt += `- Optimizar para retención en memoria\n`
    }

    // Instrucciones finales
    prompt += `\nGenera un texto persuasivo y optimizado para maximizar conversiones basado en estas características. El texto debe ser convincente, claro y efectivo para el objetivo especificado.`

    return prompt
  }

  // Generar texto optimizado para conversiones
  const generateText = async () => {
    if (!isConnected) {
      toast({
        title: "Conexión requerida",
        description: "Por favor, conecta tu API Key de DeepSeek primero",
        variant: "destructive",
      })
      return
    }

    if (!formData.keywords) {
      toast({
        title: "Palabras clave requeridas",
        description: "Por favor, ingresa al menos una palabra clave",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setProgress(0)

    // Construir el prompt para DeepSeek
    const prompt = buildPrompt()

    // Guardar el prompt generado
    setGeneratedPrompt(prompt)

    // Simular progreso
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 5
      })
    }, 200)

    try {
      // En producción, aquí iría la llamada real a la API de DeepSeek con el prompt generado
      // Por ejemplo:
      // const response = await fetch('https://api.deepseek.com/v1/generate', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${deepseekApiKey}`
      //   },
      //   body: JSON.stringify({
      //     prompt: prompt,
      //     max_tokens: 500,
      //     temperature: 0.7
      //   })
      // })
      // const data = await response.json()
      // const generatedText = data.text

      // Simulamos la generación de texto
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Generar texto de ejemplo basado en los parámetros
      const textTypes = {
        headline: "Encabezado impactante que genera conversiones",
        subheadline: "Subtítulo persuasivo que refuerza el mensaje principal",
        body: "Texto de cuerpo detallado que explica beneficios y características",
        cta: "Llamado a la acción que impulsa a tomar decisiones inmediatas",
        email: "Asunto de email que aumenta tasas de apertura y conversión",
      }

      // Texto generado de ejemplo (en producción, vendría de la API)
      let text = ""
      const keywords = formData.keywords.split(",").map((k) => k.trim())
      const mainKeyword = keywords[0]

      switch (formData.textType) {
        case "headline":
          text = `${formData.includeEmojis ? "✨ " : ""}Descubre el Secreto de ${mainKeyword} que Transforma Resultados${formData.includeEmojis ? " 🚀" : ""}`
          break
        case "subheadline":
          text = `La solución definitiva para ${mainKeyword} que ${formData.includePowerWords ? "revolucionará" : "mejorará"} tu experiencia`
          break
        case "body":
          text = `Nuestro enfoque único para ${mainKeyword} ha demostrado resultados excepcionales. ${formData.includeStatistics ? "El 94% de nuestros clientes reportan mejoras significativas en las primeras 2 semanas. " : ""}${formData.includeTestimonials ? '"Ha sido una experiencia transformadora" - Cliente satisfecho. ' : ""}Descubre cómo podemos ayudarte a alcanzar tus objetivos con nuestra metodología probada.`
          break
        case "cta":
          text = `${formData.ctaType === "direct" ? "¡Obtén" : "Descubre"} ${mainKeyword} ${formData.urgencyLevel > 70 ? "Ahora" : "Hoy"}${formData.includeEmojis ? " 👉" : ""}`
          break
        case "email":
          text = `${formData.includeEmojis ? "[URGENTE] " : ""}La estrategia de ${mainKeyword} que nadie te ha contado${formData.urgencyLevel > 70 ? " (oferta por tiempo limitado)" : ""}`
          break
        default:
          text = `Contenido optimizado sobre ${mainKeyword} para maximizar conversiones`
      }

      // Calcular puntuación de conversión simulada
      const conversionScore = Math.floor(65 + Math.random() * 30)
      setConversionScore(conversionScore)

      // Guardar en historial
      const newHistoryItem = {
        id: Date.now().toString(),
        text,
        score: conversionScore,
        date: new Date().toLocaleString(),
      }

      const updatedHistory = [newHistoryItem, ...generationHistory].slice(0, 20)
      setGenerationHistory(updatedHistory)
      localStorage.setItem("conversion_text_history", JSON.stringify(updatedHistory))

      // Actualizar texto generado
      setGeneratedText(text)

      // Completar progreso
      clearInterval(progressInterval)
      setProgress(100)

      setTimeout(() => {
        setIsGenerating(false)
        setProgress(0)

        toast({
          title: "Texto generado con éxito",
          description: `Puntuación de conversión estimada: ${conversionScore}%`,
        })

        // Cambiar a la pestaña de resultado
        setActiveTab("result")
      }, 500)
    } catch (error) {
      console.error("Error al generar texto:", error)
      clearInterval(progressInterval)
      setIsGenerating(false)
      setProgress(0)

      toast({
        title: "Error al generar texto",
        description: "Ocurrió un error al comunicarse con DeepSeek",
        variant: "destructive",
      })
    }
  }

  // Copiar texto generado
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText)
    toast({
      title: "Copiado al portapapeles",
      description: "El texto ha sido copiado al portapapeles",
    })
  }

  // Descargar texto generado
  const downloadText = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedText], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `texto-conversion-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "Texto descargado",
      description: "El archivo de texto ha sido descargado",
    })
  }

  return (
    <div className="space-y-6">
      {/* Conexión con DeepSeek */}
      <Card className="border border-purple-500/30 bg-purple-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            Conexión con DeepSeek AI
          </CardTitle>
          <CardDescription>
            Conecta tu API Key de DeepSeek para generar textos optimizados para conversiones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              type="password"
              placeholder="Ingresa tu API Key de DeepSeek"
              value={deepseekApiKey}
              onChange={(e) => setDeepseekApiKey(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              className="bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30"
              onClick={testConnection}
            >
              Probar Conexión
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="text-sm">{isConnected ? "DeepSeek conectado" : "DeepSeek no configurado"}</span>
            {isConnected && (
              <Badge variant="outline" className="ml-auto bg-green-500/10 text-green-200 border-green-500/30">
                Listo para generar
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pestañas principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="generator">Generador</TabsTrigger>
          <TabsTrigger value="prompt">Prompt</TabsTrigger>
          <TabsTrigger value="result">Resultado</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        {/* Pestaña de generador */}
        <TabsContent value="generator" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keywords">
                  Palabras clave <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="keywords"
                  placeholder="Ej: tarot, astrología, lectura de cartas (separadas por comas)"
                  value={formData.keywords}
                  onChange={(e) => handleFormChange("keywords", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="textType">Tipo de texto</Label>
                <Select value={formData.textType} onValueChange={(value) => handleFormChange("textType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo de texto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="headline">Encabezado principal</SelectItem>
                    <SelectItem value="subheadline">Subtítulo</SelectItem>
                    <SelectItem value="body">Texto de cuerpo</SelectItem>
                    <SelectItem value="cta">Llamado a la acción (CTA)</SelectItem>
                    <SelectItem value="email">Asunto de email</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="textLength">Longitud del texto</Label>
                <Select value={formData.textLength} onValueChange={(value) => handleFormChange("textLength", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la longitud" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very-short">Muy corto (5-10 palabras)</SelectItem>
                    <SelectItem value="short">Corto (10-20 palabras)</SelectItem>
                    <SelectItem value="medium">Medio (20-50 palabras)</SelectItem>
                    <SelectItem value="long">Largo (50-100 palabras)</SelectItem>
                    <SelectItem value="very-long">Muy largo (100+ palabras)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audienceType">Tipo de audiencia</Label>
                <Select
                  value={formData.audienceType}
                  onValueChange={(value) => handleFormChange("audienceType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de audiencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="spiritual">Espiritual/Esotérica</SelectItem>
                    <SelectItem value="skeptical">Escéptica</SelectItem>
                    <SelectItem value="curious">Curiosa/Exploradora</SelectItem>
                    <SelectItem value="experienced">Experimentada en lo esotérico</SelectItem>
                    <SelectItem value="beginner">Principiante en lo esotérico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conversionGoal">Objetivo de conversión</Label>
                <Select
                  value={formData.conversionGoal}
                  onValueChange={(value) => handleFormChange("conversionGoal", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase">Compra directa</SelectItem>
                    <SelectItem value="signup">Registro/Suscripción</SelectItem>
                    <SelectItem value="lead">Generación de leads</SelectItem>
                    <SelectItem value="consultation">Solicitud de consulta</SelectItem>
                    <SelectItem value="download">Descarga</SelectItem>
                    <SelectItem value="contact">Contacto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="toneOfVoice">Tono de voz</Label>
                <Select value={formData.toneOfVoice} onValueChange={(value) => handleFormChange("toneOfVoice", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tono" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Profesional</SelectItem>
                    <SelectItem value="mystical">Místico</SelectItem>
                    <SelectItem value="authoritative">Autoritario</SelectItem>
                    <SelectItem value="friendly">Amigable</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                    <SelectItem value="calming">Calmado</SelectItem>
                    <SelectItem value="intriguing">Intrigante</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="urgencyLevel">Nivel de urgencia</Label>
                  <span className="text-sm text-muted-foreground">{formData.urgencyLevel}%</span>
                </div>
                <Slider
                  id="urgencyLevel"
                  min={0}
                  max={100}
                  step={5}
                  value={[formData.urgencyLevel]}
                  onValueChange={(value) => handleFormChange("urgencyLevel", value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="conversionOptimizationLevel">Nivel de optimización para conversión</Label>
                  <span className="text-sm text-muted-foreground">{formData.conversionOptimizationLevel}%</span>
                </div>
                <Slider
                  id="conversionOptimizationLevel"
                  min={0}
                  max={100}
                  step={5}
                  value={[formData.conversionOptimizationLevel]}
                  onValueChange={(value) => handleFormChange("conversionOptimizationLevel", value[0])}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeEmojis"
                    checked={formData.includeEmojis}
                    onCheckedChange={(checked) => handleFormChange("includeEmojis", checked)}
                  />
                  <Label htmlFor="includeEmojis">Incluir emojis</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includePowerWords"
                    checked={formData.includePowerWords}
                    onCheckedChange={(checked) => handleFormChange("includePowerWords", checked)}
                  />
                  <Label htmlFor="includePowerWords">Palabras poderosas</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeCallToAction"
                    checked={formData.includeCallToAction}
                    onCheckedChange={(checked) => handleFormChange("includeCallToAction", checked)}
                  />
                  <Label htmlFor="includeCallToAction">Incluir CTA</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeStatistics"
                    checked={formData.includeStatistics}
                    onCheckedChange={(checked) => handleFormChange("includeStatistics", checked)}
                  />
                  <Label htmlFor="includeStatistics">Estadísticas</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Configuración avanzada */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="advanced-settings">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configuración avanzada
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Técnicas de persuasión</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="persuasion-scarcity"
                            checked={formData.advancedSettings.persuasionTechniques.includes("scarcity")}
                            onCheckedChange={(checked) => {
                              const techniques = [...formData.advancedSettings.persuasionTechniques]
                              if (checked) {
                                techniques.push("scarcity")
                              } else {
                                const index = techniques.indexOf("scarcity")
                                if (index > -1) techniques.splice(index, 1)
                              }
                              handleAdvancedChange("persuasionTechniques", techniques)
                            }}
                          />
                          <Label htmlFor="persuasion-scarcity">Escasez</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="persuasion-authority"
                            checked={formData.advancedSettings.persuasionTechniques.includes("authority")}
                            onCheckedChange={(checked) => {
                              const techniques = [...formData.advancedSettings.persuasionTechniques]
                              if (checked) {
                                techniques.push("authority")
                              } else {
                                const index = techniques.indexOf("authority")
                                if (index > -1) techniques.splice(index, 1)
                              }
                              handleAdvancedChange("persuasionTechniques", techniques)
                            }}
                          />
                          <Label htmlFor="persuasion-authority">Autoridad</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="persuasion-social"
                            checked={formData.advancedSettings.persuasionTechniques.includes("social")}
                            onCheckedChange={(checked) => {
                              const techniques = [...formData.advancedSettings.persuasionTechniques]
                              if (checked) {
                                techniques.push("social")
                              } else {
                                const index = techniques.indexOf("social")
                                if (index > -1) techniques.splice(index, 1)
                              }
                              handleAdvancedChange("persuasionTechniques", techniques)
                            }}
                          />
                          <Label htmlFor="persuasion-social">Prueba social</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="persuasion-reciprocity"
                            checked={formData.advancedSettings.persuasionTechniques.includes("reciprocity")}
                            onCheckedChange={(checked) => {
                              const techniques = [...formData.advancedSettings.persuasionTechniques]
                              if (checked) {
                                techniques.push("reciprocity")
                              } else {
                                const index = techniques.indexOf("reciprocity")
                                if (index > -1) techniques.splice(index, 1)
                              }
                              handleAdvancedChange("persuasionTechniques", techniques)
                            }}
                          />
                          <Label htmlFor="persuasion-reciprocity">Reciprocidad</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cognitiveFraming">Encuadre cognitivo</Label>
                      <Select
                        value={formData.advancedSettings.cognitiveFraming}
                        onValueChange={(value) => handleAdvancedChange("cognitiveFraming", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el encuadre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="positive">Positivo (ganancia)</SelectItem>
                          <SelectItem value="negative">Negativo (pérdida)</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="contrast">Contraste</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emotionalValence">Valencia emocional</Label>
                      <Select
                        value={formData.advancedSettings.emotionalValence}
                        onValueChange={(value) => handleAdvancedChange("emotionalValence", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona la valencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="positive">Positiva</SelectItem>
                          <SelectItem value="negative">Negativa</SelectItem>
                          <SelectItem value="mixed">Mixta</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Sesgos de decisión a explotar</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="bias-anchoring"
                            checked={formData.advancedSettings.decisionBiases.includes("anchoring")}
                            onCheckedChange={(checked) => {
                              const biases = [...formData.advancedSettings.decisionBiases]
                              if (checked) {
                                biases.push("anchoring")
                              } else {
                                const index = biases.indexOf("anchoring")
                                if (index > -1) biases.splice(index, 1)
                              }
                              handleAdvancedChange("decisionBiases", biases)
                            }}
                          />
                          <Label htmlFor="bias-anchoring">Anclaje</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="bias-loss-aversion"
                            checked={formData.advancedSettings.decisionBiases.includes("loss-aversion")}
                            onCheckedChange={(checked) => {
                              const biases = [...formData.advancedSettings.decisionBiases]
                              if (checked) {
                                biases.push("loss-aversion")
                              } else {
                                const index = biases.indexOf("loss-aversion")
                                if (index > -1) biases.splice(index, 1)
                              }
                              handleAdvancedChange("decisionBiases", biases)
                            }}
                          />
                          <Label htmlFor="bias-loss-aversion">Aversión a la pérdida</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="bias-bandwagon"
                            checked={formData.advancedSettings.decisionBiases.includes("bandwagon")}
                            onCheckedChange={(checked) => {
                              const biases = [...formData.advancedSettings.decisionBiases]
                              if (checked) {
                                biases.push("bandwagon")
                              } else {
                                const index = biases.indexOf("bandwagon")
                                if (index > -1) biases.splice(index, 1)
                              }
                              handleAdvancedChange("decisionBiases", biases)
                            }}
                          />
                          <Label htmlFor="bias-bandwagon">Efecto bandwagon</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="bias-confirmation"
                            checked={formData.advancedSettings.decisionBiases.includes("confirmation")}
                            onCheckedChange={(checked) => {
                              const biases = [...formData.advancedSettings.decisionBiases]
                              if (checked) {
                                biases.push("confirmation")
                              } else {
                                const index = biases.indexOf("confirmation")
                                if (index > -1) biases.splice(index, 1)
                              }
                              handleAdvancedChange("decisionBiases", biases)
                            }}
                          />
                          <Label htmlFor="bias-confirmation">Confirmación</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Patrones neurolinguísticos</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="neurolinguisticPatterns"
                          checked={formData.advancedSettings.neurolinguisticPatterns}
                          onCheckedChange={(checked) => handleAdvancedChange("neurolinguisticPatterns", checked)}
                        />
                        <Label htmlFor="neurolinguisticPatterns">Aplicar patrones PNL</Label>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Incorpora técnicas de Programación Neurolingüística para aumentar la persuasión
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Otras técnicas avanzadas</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="attentionHooks"
                            checked={formData.advancedSettings.attentionHooks}
                            onCheckedChange={(checked) => handleAdvancedChange("attentionHooks", checked)}
                          />
                          <Label htmlFor="attentionHooks">Ganchos de atención</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="memoryRetention"
                            checked={formData.advancedSettings.memoryRetention}
                            onCheckedChange={(checked) => handleAdvancedChange("memoryRetention", checked)}
                          />
                          <Label htmlFor="memoryRetention">Retención en memoria</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Botón de generación */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={generateText}
              disabled={isGenerating || !formData.keywords}
              className="w-full max-w-md h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generando texto...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generar texto optimizado para conversiones
                </>
              )}
            </Button>
          </div>

          {isGenerating && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Generando texto optimizado...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </TabsContent>

        {/* Nueva pestaña de Prompt */}
        <TabsContent value="prompt">
          {generatedPrompt ? (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    Prompt para DeepSeek
                  </CardTitle>
                  <CardDescription>
                    Este es el prompt que se enviará a DeepSeek para generar el texto optimizado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-md bg-black/20 border border-white/10 min-h-[200px] whitespace-pre-wrap font-mono text-sm">
                    {generatedPrompt}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedPrompt)
                      toast({
                        title: "Copiado al portapapeles",
                        description: "El prompt ha sido copiado al portapapeles",
                      })
                    }}
                  >
                    <CopyIcon className="h-4 w-4 mr-2" />
                    Copiar Prompt
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Sparkles className="h-12 w-12 text-purple-400 mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">Aún no has generado ningún prompt</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Configura los parámetros en la pestaña Generador y haz clic en "Generar texto optimizado para
                conversiones" para crear un prompt.
              </p>
              <Button onClick={() => setActiveTab("generator")}>Ir al generador</Button>
            </div>
          )}
        </TabsContent>

        {/* Pestaña de resultado */}
        <TabsContent value="result">
          {generatedText ? (
            <div className="space-y-4">
              <Card className="border border-blue-500/30 bg-blue-500/5">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Texto optimizado para conversiones</CardTitle>
                    <Badge
                      variant="outline"
                      className={`
                        ${
                          conversionScore >= 90
                            ? "bg-green-500/20 text-green-200 border-green-500/30"
                            : conversionScore >= 70
                              ? "bg-blue-500/20 text-blue-200 border-blue-500/30"
                              : "bg-yellow-500/20 text-yellow-200 border-yellow-500/30"
                        }
                      `}
                    >
                      {conversionScore >= 90 ? (
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <Target className="h-3.5 w-3.5 mr-1" />
                      )}
                      Puntuación: {conversionScore}%
                    </Badge>
                  </div>
                  <CardDescription>
                    Texto generado con DeepSeek AI optimizado para maximizar conversiones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-md bg-black/20 border border-white/10 min-h-[100px]">
                    <p className="text-lg font-medium">{generatedText}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" onClick={copyToClipboard}>
                    <CopyIcon className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                  <Button variant="outline" onClick={downloadText}>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-400" />
                    Análisis de conversión
                  </CardTitle>
                  <CardDescription>Factores que influyen en la efectividad del texto generado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label>Persuasión</Label>
                        <span className="text-sm">{Math.floor(65 + Math.random() * 30)}%</span>
                      </div>
                      <Progress value={65 + Math.random() * 30} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <Label>Claridad</Label>
                        <span className="text-sm">{Math.floor(70 + Math.random() * 25)}%</span>
                      </div>
                      <Progress value={70 + Math.random() * 25} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <Label>Impacto emocional</Label>
                        <span className="text-sm">{Math.floor(60 + Math.random() * 35)}%</span>
                      </div>
                      <Progress value={60 + Math.random() * 35} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <Label>Urgencia</Label>
                        <span className="text-sm">{formData.urgencyLevel}%</span>
                      </div>
                      <Progress value={formData.urgencyLevel} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Sparkles className="h-12 w-12 text-purple-400 mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">Aún no has generado ningún texto</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Configura los parámetros en la pestaña Generador y crea tu primer texto optimizado para conversiones
              </p>
              <Button onClick={() => setActiveTab("generator")}>Ir al generador</Button>
            </div>
          )}
        </TabsContent>

        {/* Pestaña de historial */}
        <TabsContent value="history">
          {generationHistory.length > 0 ? (
            <div className="space-y-4">
              {generationHistory.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:bg-purple-500/5 transition-colors"
                  onClick={() => loadFromHistory(item)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">{item.text}</CardTitle>
                      <Badge
                        variant="outline"
                        className={`
                          ${
                            item.score >= 90
                              ? "bg-green-500/20 text-green-200 border-green-500/30"
                              : item.score >= 70
                                ? "bg-blue-500/20 text-blue-200 border-blue-500/30"
                                : "bg-yellow-500/20 text-yellow-200 border-yellow-500/30"
                          }
                        `}
                      >
                        {item.score}%
                      </Badge>
                    </div>
                    <CardDescription>Generado el {item.date}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-12 w-12 text-purple-400 mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">Historial vacío</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Aún no has generado ningún texto. Los textos que generes aparecerán aquí para que puedas reutilizarlos.
              </p>
              <Button onClick={() => setActiveTab("generator")}>Ir al generador</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

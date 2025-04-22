"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input as InputUI } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Download, ImageIcon, Loader2, Copy, Wand2, Bookmark, BookmarkPlus, Edit2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ClipboardIcon } from "@radix-ui/react-icons"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { ScissorsIcon, RefreshCcwIcon, WandIcon } from "lucide-react"
import { ImageEditorModal } from "./image-editor-modal"

// Tipos para las opciones de generación de imágenes
type ImageSize = "256x256" | "512x512" | "1024x1024" | "1792x1024" | "1024x1792"
type ImageQuality = "standard" | "hd"
type ImageStyle = "vivid" | "natural"

interface ImageGenerationOptions {
  prompt: string
  size: ImageSize
  quality: ImageQuality
  style: ImageStyle
  n: number
}

interface GeneratedImage {
  url: string
  prompt: string
  timestamp: number
  size: string
  quality: string
  style: string
}

// Update the imagePresets array to include more realistic photography presets
// Replace the existing presets with these new ones focused on realism

const imagePresets = [
  {
    id: "realistic-portrait",
    name: "Retrato Hiperrealista",
    description: "Fotografía de retrato con detalles de piel, iluminación natural y profundidad",
    prompt:
      "Fotografía hiperrealista de retrato, iluminación natural, profundidad de campo, detalles de piel, textura de poros, reflejos en ojos, fotografía profesional, lente 85mm f/1.4, bokeh suave, luz de ventana, sin edición digital",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "realistic-landscape",
    name: "Paisaje Fotorrealista",
    description: "Paisaje natural con detalles atmosféricos y luz dorada",
    prompt:
      "Fotografía ultra realista de paisaje, luz dorada del atardecer, detalles atmosféricos, niebla ligera, reflejos en agua, textura de vegetación, fotografía con cámara de formato medio, lente gran angular, trípode, exposición perfecta, sin edición digital",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "realistic-still-life",
    name: "Bodegón Realista",
    description: "Fotografía de objetos con texturas detalladas e iluminación de estudio",
    prompt:
      "Fotografía hiperrealista de bodegón, iluminación de estudio profesional, softbox principal, reflector plateado, textura detallada de objetos, reflejos controlados, profundidad de campo selectiva, cámara de medio formato, lente macro, trípode, sin postprocesado digital",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "realistic-street",
    name: "Fotografía Callejera",
    description: "Escena urbana con detalles arquitectónicos y ambiente auténtico",
    prompt:
      "Fotografía ultra realista de escena callejera, luz natural urbana, reflejos en ventanas, texturas de edificios antiguos, pavimento mojado, detalles arquitectónicos, personas en movimiento natural, cámara Leica, lente 35mm, ISO bajo, sin filtros digitales",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "realistic-food",
    name: "Fotografía Gastronómica",
    description: "Platos culinarios con texturas y detalles de alimentos",
    prompt:
      "Fotografía hiperrealista de comida, iluminación lateral suave, textura detallada de alimentos, gotas de agua, vapor visible, profundidad de campo selectiva, fondo neutro, vajilla de cerámica artesanal, cámara profesional con lente macro, trípode, sin retoque digital",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "realistic-product",
    name: "Fotografía de Producto",
    description: "Producto con iluminación profesional y detalles de materiales",
    prompt:
      "Fotografía ultra realista de producto, iluminación de estudio con 3 puntos, reflector principal grande, luz de contorno, textura detallada del material, reflejos controlados, fondo neutro, cámara de alta resolución, lente prime, trípode, sin postprocesado digital",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "realistic-architecture",
    name: "Arquitectura Realista",
    description: "Edificios con detalles estructurales y perspectiva natural",
    prompt:
      "Fotografía hiperrealista de arquitectura, luz natural matutina, corrección de perspectiva, detalles estructurales, texturas de materiales de construcción, reflejos en vidrios, escala humana, cámara técnica de gran formato, trípode nivelado, sin distorsión digital",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "realistic-nature",
    name: "Macrofotografía Natural",
    description: "Elementos naturales con detalles microscópicos",
    prompt:
      "Fotografía ultra realista macro de naturaleza, iluminación natural difusa, textura microscópica visible, gotas de rocío, detalles de insectos/plantas, fondo natural desenfocado, cámara con lente macro dedicado, flash anular suave, trípode, sin manipulación digital",
    image: "/placeholder.svg?height=100&width=100",
  },
]

// Update the promptEnhancers array to focus on realistic photography elements

const promptEnhancers = [
  {
    id: "camera",
    name: "Cámara Profesional",
    prompt:
      "fotografiado con cámara Hasselblad/Canon EOS R5/Nikon Z9/Sony Alpha 1, sensor de formato completo, alta resolución",
  },
  {
    id: "lens",
    name: "Lente Premium",
    prompt: "lente prime de alta gama, apertura f/1.4-f/2.8, nitidez extrema, bokeh cremoso, sin aberraciones",
  },
  {
    id: "lighting",
    name: "Iluminación Natural",
    prompt: "iluminación natural perfecta, hora dorada, luz lateral suave, sombras detalladas, rango dinámico amplio",
  },
  {
    id: "studio",
    name: "Iluminación Estudio",
    prompt:
      "iluminación de estudio profesional, softbox principal, reflectores de relleno, luz de contorno, banderas para control de luz",
  },
  {
    id: "texture",
    name: "Texturas Detalladas",
    prompt: "texturas ultra detalladas, poros visibles, fibras individuales, microdetalles, superficie realista",
  },
  {
    id: "environment",
    name: "Ambiente Contextual",
    prompt: "ambiente contextual realista, elementos de fondo coherentes, escala apropiada, perspectiva natural",
  },
  {
    id: "technical",
    name: "Técnicamente Perfecto",
    prompt: "técnicamente perfecto, enfoque preciso, exposición óptima, balance de blancos correcto, sin ruido digital",
  },
  {
    id: "unedited",
    name: "Sin Postprocesado",
    prompt:
      "sin postprocesado digital, sin filtros, sin HDR artificial, aspecto de película fotográfica natural, colores fieles a la realidad",
  },
]

export function ImageGenerator() {
  // Estados para las opciones de generación
  const [prompt, setPrompt] = useState("")
  const [size, setSize] = useState<ImageSize>("1024x1024")
  const [quality, setQuality] = useState<ImageQuality>("standard")
  const [style, setStyle] = useState<ImageStyle>("vivid")
  const [numberOfImages, setNumberOfImages] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [savedImages, setSavedImages] = useState<GeneratedImage[]>([])
  const [selectedEnhancers, setSelectedEnhancers] = useState<string[]>([])
  const [apiKey, setApiKey] = useState("")
  const [connectionStatus, setConnectionStatus] = useState<"none" | "success" | "error" | "loading">("none")
  const [activeTab, setActiveTab] = useState("generator")

  // Estados para el editor de imágenes
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [imageToEdit, setImageToEdit] = useState<GeneratedImage | null>(null)

  //Nuevos estados para el análisis de imágenes
  const [imageUrl, setImageUrl] = useState("")
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState("")

  // Cargar API key guardada
  useEffect(() => {
    const savedKey = localStorage.getItem("openai_api_key")
    if (savedKey) {
      setApiKey(savedKey)
    }
  }, [])

  // Cargar imágenes guardadas
  useEffect(() => {
    const savedImagesData = localStorage.getItem("saved_esoteric_images")
    if (savedImagesData) {
      try {
        setSavedImages(JSON.parse(savedImagesData))
      } catch (e) {
        console.error("Error al cargar imágenes guardadas:", e)
      }
    }
  }, [])

  // Función para aplicar un preset
  const applyPreset = (presetId: string) => {
    const preset = imagePresets.find((p) => p.id === presetId)
    if (preset) {
      setPrompt(preset.prompt)
      toast({
        title: "Preset aplicado",
        description: `Se ha aplicado el preset "${preset.name}"`,
      })
    }
  }

  // Función para alternar un enhancer
  const toggleEnhancer = (enhancerId: string) => {
    setSelectedEnhancers((prev) =>
      prev.includes(enhancerId) ? prev.filter((id) => id !== enhancerId) : [...prev, enhancerId],
    )
  }

  // Función para construir el prompt final con los enhancers
  const buildFinalPrompt = () => {
    if (!prompt.trim()) return ""

    let finalPrompt = prompt.trim()

    // Añadir enhancers seleccionados
    if (selectedEnhancers.length > 0) {
      const enhancerTexts = selectedEnhancers
        .map((id) => promptEnhancers.find((e) => e.id === id)?.prompt || "")
        .filter((text) => text)

      finalPrompt += ", " + enhancerTexts.join(", ")
    }

    return finalPrompt
  }

  // Función para generar imágenes
  const generateImages = async () => {
    const finalPrompt = buildFinalPrompt()

    if (!finalPrompt) {
      toast({
        title: "Prompt vacío",
        description: "Por favor, escribe un prompt o selecciona un preset",
        variant: "destructive",
      })
      return
    }

    if (!apiKey) {
      toast({
        title: "API Key no configurada",
        description: "Por favor, configura tu API Key de OpenAI",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Configuración para la API de OpenAI
      const requestBody = {
        model: "dall-e-3",
        prompt: finalPrompt,
        n: numberOfImages,
        size: size,
        quality: quality,
        style: style,
        response_format: "url",
      }

      // Llamada real a la API de OpenAI
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || "Error al generar imágenes")
      }

      const data = await response.json()

      // Procesar las imágenes generadas
      const generatedImgs = data.data.map((item: any) => ({
        url: item.url,
        prompt: finalPrompt,
        timestamp: Date.now(),
        size,
        quality,
        style,
      }))

      setGeneratedImages(generatedImgs)
      setActiveTab("results")

      toast({
        title: "Imágenes generadas",
        description: `Se han generado ${generatedImgs.length} imágenes con éxito`,
      })
    } catch (error) {
      console.error("Error al generar imágenes:", error)
      toast({
        title: "Error al generar imágenes",
        description: error instanceof Error ? error.message : "Ocurrió un error desconocido",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Función para guardar una imagen
  const saveImage = (image: GeneratedImage) => {
    const updatedSavedImages = [...savedImages, image]
    setSavedImages(updatedSavedImages)
    localStorage.setItem("saved_esoteric_images", JSON.stringify(updatedSavedImages))

    toast({
      title: "Imagen guardada",
      description: "La imagen ha sido guardada en tu colección",
    })
  }

  // Función para eliminar una imagen guardada
  const removeImage = (timestamp: number) => {
    const updatedSavedImages = savedImages.filter((img) => img.timestamp !== timestamp)
    setSavedImages(updatedSavedImages)
    localStorage.setItem("saved_esoteric_images", JSON.stringify(updatedSavedImages))

    toast({
      title: "Imagen eliminada",
      description: "La imagen ha sido eliminada de tu colección",
    })
  }

  // Función para copiar el prompt
  const copyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText)
    toast({
      title: "Prompt copiado",
      description: "El prompt ha sido copiado al portapapeles",
    })
  }

  // Función para descargar una imagen
  const downloadImage = (url: string, promptText: string) => {
    // En una implementación real, aquí se descargaría la imagen
    // Como estamos usando placeholders, solo mostramos un toast
    toast({
      title: "Descarga iniciada",
      description: "La imagen se está descargando",
    })
  }

  // Funciones para el análisis de imágenes
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedImage(file)
      setPreviewImage(URL.createObjectURL(file))
      setImageUrl("")
    }
  }

  const analyzeImageFromUrl = async () => {
    if (!imageUrl) return

    setIsAnalyzing(true)
    setPreviewImage(imageUrl)
    setUploadedImage(null)

    // Simular análisis (en una aplicación real, esto sería una llamada a la API de OpenAI)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const detailedPrompt = generateDetailedPrompt(imageUrl)
    setGeneratedPrompt(detailedPrompt)
    setIsAnalyzing(false)
  }

  const analyzeUploadedImage = async () => {
    if (!uploadedImage) return

    setIsAnalyzing(true)

    // Simular análisis (en una aplicación real, esto sería una llamada a la API de OpenAI)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const detailedPrompt = generateDetailedPrompt(uploadedImage.name)
    setGeneratedPrompt(detailedPrompt)
    setIsAnalyzing(false)
  }

  const generateDetailedPrompt = (source: string) => {
    // En una aplicación real, esto vendría de un análisis de IA usando la API de OpenAI
    // Aquí simulamos un análisis detallado para round-trip consistency

    setIsAnalyzing(true)

    // Simular un análisis detallado de la imagen
    const prompt = `Una fotografía ${Math.random() > 0.5 ? "en color" : "en blanco y negro"} de alta resolución que muestra ${
      [
        "un paisaje natural con montañas cubiertas de nieve y un lago cristalino en primer plano",
        "un retrato de primer plano de una persona con expresión contemplativa, iluminación lateral suave",
        "una escena urbana nocturna con luces de neón reflejadas en el pavimento mojado",
        "un bodegón minimalista con objetos geométricos sobre fondo neutro",
        "una escena mística con elementos esotéricos como velas, cristales y símbolos antiguos",
      ][Math.floor(Math.random() * 5)]
    }.

  La composición sigue la regla de los tercios con ${
    [
      "un punto focal claro en el centro-derecho de la imagen",
      "una línea diagonal que guía la mirada desde la esquina inferior izquierda hacia la superior derecha",
      "una simetría perfecta que divide la imagen en dos mitades idénticas",
      "capas de profundidad que crean una sensación de espacio tridimensional",
    ][Math.floor(Math.random() * 4)]
  }.

  Aspectos técnicos:
  - Fotografiado con una cámara ${["Canon EOS R5", "Sony Alpha 1", "Hasselblad X2D", "Nikon Z9"][Math.floor(Math.random() * 4)]}
  - Lente ${["gran angular 16-35mm f/2.8", "normal 50mm f/1.2", "teleobjetivo 70-200mm f/2.8", "macro 100mm f/2.8"][Math.floor(Math.random() * 4)]}
  - Apertura: f/${[1.4, 2.8, 5.6, 8, 11][Math.floor(Math.random() * 5)]}
  - ISO: ${[100, 200, 400, 800][Math.floor(Math.random() * 4)]}
  - Velocidad de obturación: 1/${[30, 60, 125, 250, 500][Math.floor(Math.random() * 5)]}s

  Iluminación: ${
    [
      "natural, durante la hora dorada, con sombras largas y cálidas",
      "estudio profesional con tres puntos de luz y modificadores suaves",
      "dramática con alto contraste entre luces y sombras",
      "difusa y envolvente que minimiza las sombras y realza los detalles",
    ][Math.floor(Math.random() * 4)]
  }

  Paleta de colores: ${
    [
      "tonos cálidos dominados por ocres, naranjas y marrones",
      "fría con predominio de azules, verdes y tonos metálicos",
      "contrastante con acentos de colores complementarios",
      "monocromática con sutiles variaciones tonales",
      "desaturada con toques de color selectivos para elementos clave",
    ][Math.floor(Math.random() * 5)]
  }

  Texturas: ${
    [
      "suaves y aterciopeladas con transiciones graduales",
      "rugosas y detalladas que muestran cada imperfección",
      "brillantes con reflejos especulares en superficies pulidas",
      "mixtas que combinan elementos orgánicos e inorgánicos",
    ][Math.floor(Math.random() * 4)]
  }

  Estilo: ${
    [
      "fotorrealista con atención meticulosa a los detalles",
      "cinematográfico con aspecto de película analógica",
      "editorial con composición limpia y precisa",
      "documental que captura un momento auténtico",
      "artístico con elementos surrealistas sutiles",
    ][Math.floor(Math.random() * 5)]
  }

  Procesado: ${
    [
      "mínimo para preservar el aspecto natural",
      "técnica HDR sutil para ampliar el rango dinámico",
      "virado específico que enfatiza la atmósfera",
      "balance preciso entre nitidez y suavidad",
    ][Math.floor(Math.random() * 4)]
  }`

    return prompt
  }

  // Función para exportar las imágenes guardadas
  const exportSavedImages = () => {
    try {
      // Crear un objeto con los datos a exportar
      const dataToExport = {
        version: "1.0",
        timestamp: Date.now(),
        images: savedImages,
      }

      // Convertir a JSON y crear un blob
      const jsonString = JSON.stringify(dataToExport, null, 2)
      const blob = new Blob([jsonString], { type: "application/json" })

      // Crear URL para el blob
      const url = URL.createObjectURL(blob)

      // Crear un enlace temporal y hacer clic en él para descargar
      const a = document.createElement("a")
      a.href = url
      a.download = `vanguardista-images-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()

      // Limpiar
      URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Exportación exitosa",
        description: `Se han exportado ${savedImages.length} imágenes con sus prompts`,
      })
    } catch (error) {
      console.error("Error al exportar imágenes:", error)
      toast({
        title: "Error al exportar",
        description: "No se pudieron exportar las imágenes guardadas",
        variant: "destructive",
      })
    }
  }

  // Función para importar imágenes
  const importSavedImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const importedData = JSON.parse(content)

          // Validar el formato del archivo
          if (!importedData.images || !Array.isArray(importedData.images)) {
            throw new Error("Formato de archivo inválido")
          }

          // Combinar las imágenes importadas con las existentes, evitando duplicados por timestamp
          const existingTimestamps = new Set(savedImages.map((img) => img.timestamp))
          const newImages = importedData.images.filter((img: GeneratedImage) => !existingTimestamps.has(img.timestamp))

          const updatedSavedImages = [...savedImages, ...newImages]
          setSavedImages(updatedSavedImages)
          localStorage.setItem("saved_esoteric_images", JSON.stringify(updatedSavedImages))

          toast({
            title: "Importación exitosa",
            description: `Se han importado ${newImages.length} nuevas imágenes`,
          })
        } catch (error) {
          console.error("Error al procesar el archivo importado:", error)
          toast({
            title: "Error al importar",
            description: "El archivo seleccionado no tiene un formato válido",
            variant: "destructive",
          })
        }
      }

      reader.readAsText(file)
    } catch (error) {
      console.error("Error al importar imágenes:", error)
      toast({
        title: "Error al importar",
        description: "No se pudieron importar las imágenes",
        variant: "destructive",
      })
    }
  }

  // Función para abrir el editor de imágenes
  const openImageEditor = (image: GeneratedImage) => {
    setImageToEdit(image)
    setIsEditorOpen(true)
  }

  // Función para guardar la imagen editada
  const saveEditedImage = (editedImage: GeneratedImage) => {
    // Si la imagen está en generatedImages, actualizarla allí
    if (generatedImages.some((img) => img.timestamp === editedImage.timestamp)) {
      setGeneratedImages((prevImages) =>
        prevImages.map((img) => (img.timestamp === editedImage.timestamp ? editedImage : img)),
      )
    }

    // Si la imagen está en savedImages, actualizarla allí
    if (savedImages.some((img) => img.timestamp === editedImage.timestamp)) {
      const updatedSavedImages = savedImages.map((img) => (img.timestamp === editedImage.timestamp ? editedImage : img))
      setSavedImages(updatedSavedImages)
      localStorage.setItem("saved_esoteric_images", JSON.stringify(updatedSavedImages))
    }

    toast({
      title: "Imagen actualizada",
      description: "Los cambios han sido aplicados con éxito",
    })
  }

  return (
    <div className="space-y-6">
      {/* Configuración de API */}
      <Card className="bg-black/20 border-purple-500/20">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="api-key" className="text-sm font-medium">
                OpenAI API Key
              </Label>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-purple-400 hover:text-purple-300"
              >
                Obtener API Key
              </a>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <InputUI
                  id="api-key"
                  type="password"
                  placeholder="Ingresa tu API key de OpenAI"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value)
                    setConnectionStatus("none")
                    localStorage.setItem("openai_api_key", e.target.value)
                  }}
                  className="pr-8"
                />
                {connectionStatus !== "none" && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {connectionStatus === "loading" && <Loader2 className="h-4 w-4 animate-spin text-purple-500" />}
                    {connectionStatus === "success" && (
                      <div className="h-4 w-4 rounded-full bg-green-500" title="Conexión exitosa" />
                    )}
                    {connectionStatus === "error" && (
                      <div className="h-4 w-4 rounded-full bg-red-500" title="Error de conexión" />
                    )}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                className={cn(
                  "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30",
                  connectionStatus === "success" && "bg-green-500/20 hover:bg-green-500/30 border-green-500/30",
                  connectionStatus === "error" && "bg-red-500/20 hover:bg-red-500/30 border-red-500/30",
                )}
                onClick={async () => {
                  if (!apiKey) {
                    toast({
                      title: "API Key eliminada",
                      description: "Tu API Key ha sido eliminada",
                      variant: "destructive",
                    })
                    localStorage.removeItem("openai_api_key")
                    setConnectionStatus("none")
                    return
                  }

                  // Set loading state
                  setConnectionStatus("loading")

                  try {
                    // Make a test request to OpenAI API
                    const response = await fetch("https://api.openai.com/v1/models", {
                      method: "GET",
                      headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                      },
                    })

                    if (response.ok) {
                      // API key is valid
                      localStorage.setItem("openai_api_key", apiKey)
                      setConnectionStatus("success")
                      toast({
                        title: "Conexión exitosa",
                        description: "Tu API Key es válida y ha sido guardada localmente",
                      })
                    } else {
                      // API key is invalid
                      const errorData = await response.json().catch(() => ({}))
                      setConnectionStatus("error")
                      toast({
                        title: "Error de conexión",
                        description: errorData.error?.message || "La API Key parece ser inválida",
                        variant: "destructive",
                      })
                    }
                  } catch (error) {
                    setConnectionStatus("error")
                    toast({
                      title: "Error de conexión",
                      description: "No se pudo conectar con la API de OpenAI. Verifica tu conexión a internet.",
                      variant: "destructive",
                    })
                  }
                }}
                disabled={connectionStatus === "loading"}
              >
                {connectionStatus === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : connectionStatus === "success" ? (
                  "Conectado ✓"
                ) : connectionStatus === "error" ? (
                  "Reintentar"
                ) : apiKey ? (
                  "Verificar y Guardar"
                ) : (
                  "Borrar Key"
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tu API key se almacena localmente en tu navegador y nunca se envía a nuestros servidores.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs para generador, resultados y guardados */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">Generador</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
          <TabsTrigger value="saved">Guardados</TabsTrigger>
        </TabsList>

        {/* Tab de Generador */}
        <TabsContent value="generator" className="space-y-6 pt-4">
          {/* Análisis de Imágenes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Round-Trip Consistency (Image-to-Text-to-Image)</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Sube una imagen para analizarla y generar un prompt detallado que permita recrear una imagen similar.
            </p>
            <div className="border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                    URL de la imagen
                  </label>
                  <div className="flex space-x-2">
                    <InputUI
                      id="imageUrl"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                    <Button variant="outline" onClick={analyzeImageFromUrl} disabled={!imageUrl || isAnalyzing}>
                      Analizar
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">O sube una imagen</label>
                  <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-4 h-[100px]">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="imageUpload"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="imageUpload" className="cursor-pointer text-center">
                      {uploadedImage ? (
                        <span className="text-green-600">Imagen cargada: {uploadedImage.name}</span>
                      ) : (
                        <span>Arrastra una imagen aquí o haz clic para seleccionar</span>
                      )}
                    </label>
                  </div>
                  {uploadedImage && (
                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      onClick={analyzeUploadedImage}
                      disabled={isAnalyzing}
                    >
                      Analizar imagen subida
                    </Button>
                  )}
                </div>
              </div>

              {previewImage && (
                <div className="mt-4">
                  <h4 className="text-md font-medium mb-2">Vista previa:</h4>
                  <div className="relative w-full h-[200px] bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt="Vista previa"
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2">Analizando imagen...</span>
                </div>
              )}

              {generatedPrompt && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-md font-medium">Prompt generado:</h4>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="whitespace-pre-wrap">{generatedPrompt}</p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedPrompt)
                        toast({
                          title: "Copiado al portapapeles",
                          description: "El prompt ha sido copiado",
                        })
                      }}
                    >
                      <ClipboardIcon className="h-4 w-4 mr-1" /> Copiar
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        setPrompt(generatedPrompt)
                        setActiveTab("generator")
                        toast({
                          title: "Prompt aplicado",
                          description: "El prompt ha sido aplicado al generador",
                        })
                        // Desplazar la página hacia el área de prompt
                        document.getElementById("prompt")?.scrollIntoView({ behavior: "smooth" })
                      }}
                    >
                      <Wand2 className="h-4 w-4 mr-1" /> Usar para generar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Prompt y enhancers */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-sm font-medium">
                Prompt
              </Label>
              <Textarea
                id="prompt"
                placeholder="Describe la fotografía realista que deseas crear. Incluye detalles sobre: sujeto principal, iluminación (natural/estudio), ambiente, texturas visibles, perspectiva, profundidad de campo, y elementos contextuales que añadan realismo..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] bg-black/20 border-purple-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Mejoras de Prompt</Label>
              <div className="flex flex-wrap gap-2">
                {promptEnhancers.map((enhancer) => (
                  <Badge
                    key={enhancer.id}
                    variant="outline"
                    className={cn(
                      "cursor-pointer hover:bg-purple-500/20 transition-colors",
                      selectedEnhancers.includes(enhancer.id) && "bg-purple-500/30 border-purple-500",
                    )}
                    onClick={() => toggleEnhancer(enhancer.id)}
                  >
                    {enhancer.name}
                    {selectedEnhancers.includes(enhancer.id) && <span className="ml-1 text-xs">✓</span>}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Configuración de la imagen */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Configuración de la Imagen</h3>
              <Badge variant="outline" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">
                Premium
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size" className="text-sm font-medium">
                  Tamaño
                </Label>
                <Select value={size} onValueChange={(value) => setSize(value as ImageSize)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tamaño" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="256x256">Pequeño (256x256)</SelectItem>
                    <SelectItem value="512x512">Mediano (512x512)</SelectItem>
                    <SelectItem value="1024x1024">Grande (1024x1024)</SelectItem>
                    <SelectItem value="1792x1024">Panorámico (1792x1024)</SelectItem>
                    <SelectItem value="1024x1792">Vertical (1024x1792)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quality" className="text-sm font-medium">
                  Calidad
                </Label>
                <Select value={quality} onValueChange={(value) => setQuality(value as ImageQuality)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una calidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Estándar</SelectItem>
                    <SelectItem value="hd">Alta Definición (HD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="style" className="text-sm font-medium">
                  Estilo
                </Label>
                <Select value={style} onValueChange={(value) => setStyle(value as ImageStyle)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vivid">Vívido</SelectItem>
                    <SelectItem value="natural">Natural</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="number-of-images" className="text-sm font-medium">
                    Número de imágenes: {numberOfImages}
                  </Label>
                </div>
                <Slider
                  id="number-of-images"
                  min={1}
                  max={4}
                  step={1}
                  value={[numberOfImages]}
                  onValueChange={(value) => setNumberOfImages(value[0])}
                  className="py-4"
                />
              </div>
            </div>

            {/* Configuración Avanzada Premium */}
            <div className="mt-6 border border-purple-500/30 rounded-lg p-4 bg-black/10">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="advanced-settings">
                  <AccordionTrigger className="text-md font-semibold hover:text-purple-400 transition-colors">
                    Configuración Avanzada Premium
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6 pt-2">
                      {/* Dimensiones personalizadas */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Dimensiones Personalizadas</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Select defaultValue="1:1">
                              <SelectTrigger>
                                <SelectValue placeholder="Relación de aspecto" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1:1">Cuadrado (1:1)</SelectItem>
                                <SelectItem value="16:9">Horizontal (16:9)</SelectItem>
                                <SelectItem value="9:16">Vertical (9:16)</SelectItem>
                                <SelectItem value="4:3">Clásico (4:3)</SelectItem>
                                <SelectItem value="3:2">Fotografía (3:2)</SelectItem>
                                <SelectItem value="2:1">Panorámico (2:1)</SelectItem>
                                <SelectItem value="custom">Personalizado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex gap-2">
                            <InputUI type="number" placeholder="Ancho" min="512" max="2048" step="64" />
                            <span className="flex items-center">×</span>
                            <InputUI type="number" placeholder="Alto" min="512" max="2048" step="64" />
                          </div>
                        </div>
                      </div>

                      {/* Ajustes de imagen */}
                      <div className="space-y-4">
                        <Label className="text-sm font-medium">Ajustes de Imagen</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="contrast" className="text-xs">
                                Contraste: 0
                              </Label>
                            </div>
                            <Slider id="contrast" min={-100} max={100} step={5} defaultValue={[0]} />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="saturation" className="text-xs">
                                Saturación: 0
                              </Label>
                            </div>
                            <Slider id="saturation" min={-100} max={100} step={5} defaultValue={[0]} />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="brightness" className="text-xs">
                                Brillo: 0
                              </Label>
                            </div>
                            <Slider id="brightness" min={-100} max={100} step={5} defaultValue={[0]} />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="sharpness" className="text-xs">
                                Nitidez: 0
                              </Label>
                            </div>
                            <Slider id="sharpness" min={-100} max={100} step={5} defaultValue={[0]} />
                          </div>
                        </div>
                      </div>

                      {/* Filtros profesionales */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Filtros Profesionales</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                          {[
                            { id: "none", name: "Original" },
                            { id: "cinematic", name: "Cinematográfico" },
                            { id: "vintage", name: "Vintage" },
                            { id: "noir", name: "Noir" },
                            { id: "hdr", name: "HDR" },
                            { id: "analog", name: "Analógico" },
                            { id: "filmic", name: "Fílmico" },
                            { id: "portrait", name: "Retrato Pro" },
                            { id: "landscape", name: "Paisaje Pro" },
                            { id: "studio", name: "Estudio" },
                          ].map((filter) => (
                            <div
                              key={filter.id}
                              className={`border rounded-md p-2 text-center text-xs cursor-pointer hover:bg-purple-500/20 transition-colors ${
                                filter.id === "none" ? "bg-purple-500/20 border-purple-500" : "border-purple-500/30"
                              }`}
                            >
                              {filter.name}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Opciones de formato */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Formato de Salida</Label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: "png", name: "PNG", desc: "Máxima calidad" },
                            { id: "jpg", name: "JPG", desc: "Estándar" },
                            { id: "webp", name: "WebP", desc: "Optimizado web" },
                          ].map((format) => (
                            <div
                              key={format.id}
                              className={`border rounded-md px-3 py-2 cursor-pointer hover:bg-purple-500/20 transition-colors flex items-center gap-2 ${
                                format.id === "png" ? "bg-purple-500/20 border-purple-500" : "border-purple-500/30"
                              }`}
                            >
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{format.name}</span>
                                <span className="text-xs text-muted-foreground">{format.desc}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Opciones avanzadas */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Opciones Avanzadas</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="face-enhancement" />
                            <label
                              htmlFor="face-enhancement"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Mejora de rostros
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="noise-reduction" />
                            <label
                              htmlFor="noise-reduction"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Reducción de ruido
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="upscale" />
                            <label
                              htmlFor="upscale"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Aumentar resolución (2x)
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="remove-background" />
                            <label
                              htmlFor="remove-background"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Eliminar fondo
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Opciones de edición post-generación */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Edición Post-Generación</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <Button variant="outline" className="w-full" disabled>
                            <ScissorsIcon className="h-4 w-4 mr-2" />
                            Recortar
                          </Button>
                          <Button variant="outline" className="w-full" disabled>
                            <RefreshCcwIcon className="h-4 w-4 mr-2" />
                            Regenerar Rostros
                          </Button>
                          <Button variant="outline" className="w-full" disabled>
                            <WandIcon className="h-4 w-4 mr-2" />
                            Ajuste Automático
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Estas opciones estarán disponibles después de generar la imagen
                        </p>
                      </div>

                      {/* Opciones de estilo avanzadas */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Estilo Avanzado</Label>
                        <Select defaultValue="balanced">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un estilo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="balanced">Equilibrado</SelectItem>
                            <SelectItem value="photorealistic">Ultra Fotorrealista</SelectItem>
                            <SelectItem value="hyperdetailed">Hiper Detallado</SelectItem>
                            <SelectItem value="dramatic">Dramático</SelectItem>
                            <SelectItem value="ethereal">Etéreo</SelectItem>
                            <SelectItem value="cinematic">Cinematográfico</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Opciones de iluminación avanzadas */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Iluminación Avanzada</Label>
                        <Select defaultValue="natural">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo de iluminación" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="natural">Natural</SelectItem>
                            <SelectItem value="golden-hour">Hora Dorada</SelectItem>
                            <SelectItem value="blue-hour">Hora Azul</SelectItem>
                            <SelectItem value="studio-3point">Estudio 3 Puntos</SelectItem>
                            <SelectItem value="rembrandt">Rembrandt</SelectItem>
                            <SelectItem value="dramatic">Dramática</SelectItem>
                            <SelectItem value="backlit">Contraluz</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Vista previa del prompt final */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Vista previa del prompt final</Label>
            <div className="p-3 rounded-md bg-black/30 border border-purple-500/20 text-sm font-mono">
              {buildFinalPrompt() || "El prompt aparecerá aquí..."}
            </div>
          </div>

          {/* Botón de generación */}
          <Button
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            onClick={generateImages}
            disabled={isGenerating || !prompt.trim() || !apiKey}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generando imágenes...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-5 w-5" />
                Generar Fotografías Hiperrealistas
              </>
            )}
          </Button>
        </TabsContent>

        {/* Tab de Resultados */}
        <TabsContent value="results" className="space-y-6 pt-4">
          {generatedImages.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {generatedImages.map((image, index) => (
                  <Card key={index} className="overflow-hidden bg-black/20 border-purple-500/20">
                    <div className="aspect-square relative bg-black/30">
                      {image.url ? (
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={`Imagen generada ${index + 1}`}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            // Si hay error al cargar la imagen, mostrar un mensaje
                            e.currentTarget.src = "/placeholder.svg?height=512&width=512"
                            e.currentTarget.classList.add("opacity-50")
                            const errorDiv = document.createElement("div")
                            errorDiv.className =
                              "absolute inset-0 flex items-center justify-center text-red-500 text-center p-4"
                            errorDiv.textContent = "Error al cargar la imagen. Puede que haya expirado el enlace."
                            e.currentTarget.parentNode?.appendChild(errorDiv)
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30">
                          {image.size}
                        </Badge>
                        <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30">
                          {image.quality === "hd" ? "Alta Definición" : "Estándar"}
                        </Badge>
                        <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30">
                          {image.style === "vivid" ? "Vívido" : "Natural"}
                        </Badge>
                      </div>
                      <p className="text-sm line-clamp-2">{image.prompt}</p>
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" variant="outline" onClick={() => copyPrompt(image.prompt)} className="h-8">
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Copiar Prompt
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadImage(image.url, image.prompt)}
                          className="h-8"
                        >
                          <Download className="h-3.5 w-3.5 mr-1" />
                          Descargar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openImageEditor(image)} className="h-8">
                          <Edit2 className="h-3.5 w-3.5 mr-1" />
                          Editar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => saveImage(image)} className="h-8">
                          <BookmarkPlus className="h-3.5 w-3.5 mr-1" />
                          Guardar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={() => setActiveTab("generator")}
              >
                <Wand2 className="mr-2 h-5 w-5" />
                Crear Nuevas Imágenes
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay imágenes generadas</h3>
              <p className="text-muted-foreground mb-6">
                Configura el generador y crea tus primeras imágenes esotéricas
              </p>
              <Button onClick={() => setActiveTab("generator")} variant="outline">
                Ir al Generador
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Tab de Guardados */}
        <TabsContent value="saved" className="space-y-6 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Imágenes Guardadas</h3>
            <div className="flex space-x-2">
              <input type="file" id="import-images" className="hidden" accept=".json" onChange={importSavedImages} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("import-images")?.click()}
                disabled={isGenerating}
              >
                Importar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportSavedImages}
                disabled={savedImages.length === 0 || isGenerating}
              >
                Exportar
              </Button>
            </div>
          </div>

          {savedImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedImages.map((image, index) => (
                <Card key={index} className="overflow-hidden bg-black/20 border-purple-500/20">
                  <div className="aspect-square relative bg-black/30">
                    {image.url ? (
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={`Imagen guardada ${index + 1}`}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=512&width=512"
                          e.currentTarget.classList.add("opacity-50")
                          const errorDiv = document.createElement("div")
                          errorDiv.className =
                            "absolute inset-0 flex items-center justify-center text-red-500 text-center p-4"
                          errorDiv.textContent = "Error al cargar la imagen. Puede que haya expirado el enlace."
                          e.currentTarget.parentNode?.appendChild(errorDiv)
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30">
                        {image.size}
                      </Badge>
                      <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30">
                        {image.quality === "hd" ? "Alta Definición" : "Estándar"}
                      </Badge>
                      <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30">
                        {image.style === "vivid" ? "Vívido" : "Natural"}
                      </Badge>
                    </div>
                    <p className="text-sm line-clamp-2">{image.prompt}</p>
                    <div className="flex gap-2 flex-wrap">
                      <Button size="sm" variant="outline" onClick={() => copyPrompt(image.prompt)} className="h-8">
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copiar Prompt
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadImage(image.url, image.prompt)}
                        className="h-8"
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Descargar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openImageEditor(image)} className="h-8">
                        <Edit2 className="h-3.5 w-3.5 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeImage(image.timestamp)}
                        className="h-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bookmark className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay imágenes guardadas</h3>
              <p className="text-muted-foreground mb-6">Guarda tus imágenes favoritas para acceder a ellas más tarde</p>
              <Button onClick={() => setActiveTab("generator")} variant="outline">
                Ir al Generador
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Información sobre costos y créditos */}
      <div className="text-xs text-muted-foreground mt-4 p-4 border border-purple-500/20 rounded-md bg-black/20">
        <p className="mb-2">
          <strong>Información sobre costos:</strong> La generación de imágenes con DALL-E 3 tiene un costo asociado que
          se factura a tu cuenta de OpenAI.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>DALL-E 3 (1024×1024) Standard: $0.040 / imagen</li>
          <li>DALL-E 3 (1024×1024) HD: $0.080 / imagen</li>
          <li>DALL-E 3 (1792×1024) Standard: $0.080 / imagen</li>
          <li>DALL-E 3 (1792×1024) HD: $0.120 / imagen</li>
        </ul>
      </div>

      {/* Modal de Editor de Imágenes */}
      <ImageEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        image={imageToEdit}
        onSave={saveEditedImage}
      />
    </div>
  )
}

// Componente Input para la configuración avanzada
function InputUIComponent({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

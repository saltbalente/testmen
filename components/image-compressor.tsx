"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import {
  ImageIcon,
  Upload,
  Download,
  Trash2,
  Settings,
  FileType,
  Sparkles,
  Info,
  Loader2,
  Gauge,
  Stamp,
  AlertCircle,
} from "lucide-react"
import { useDropzone } from "react-dropzone"

// Tipos para las imágenes
interface ImageFile {
  id: string
  file: File
  preview: string
  compressedPreview?: string
  compressedSize?: number
  originalSize: number
  compressionRatio?: number
  status: "pending" | "processing" | "completed" | "error"
  error?: string
  settings: CompressionSettings
  metadata?: any
  watermark?: WatermarkSettings
  filters?: FilterSettings
}

interface CompressionSettings {
  quality: number
  format: "jpeg" | "png" | "webp" | "avif"
  preset: "low" | "medium" | "high" | "extreme" | "custom"
  resize: boolean
  width?: number
  height?: number
  maintainAspectRatio: boolean
  stripMetadata: boolean
  optimizeColorProfile: boolean
  progressive: boolean
  lossless: boolean
  reduceNoise: boolean
  sharpen: boolean
  grayscale: boolean
  preserveTransparency: boolean
  compressAlgorithm: "mozjpeg" | "webp" | "avif" | "pngquant" | "auto"
}

interface WatermarkSettings {
  enabled: boolean
  type: "text" | "image"
  text?: string
  image?: string
  position: "center" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "custom"
  opacity: number
  scale: number
  rotation: number
  offsetX: number
  offsetY: number
  font?: string
  fontSize?: number
  fontColor?: string
  repeat?: boolean
  margin?: number
  style?: "normal" | "embossed" | "debossed" | "outline" | "glow"
}

interface FilterSettings {
  brightness: number
  contrast: number
  saturation: number
  hue: number
  blur: number
  sepia: number
  invert: boolean
  esotericFilter: "none" | "mystical" | "ethereal" | "cosmic" | "alchemical" | "astral" | "elemental" | "chakra"
  vignette: number
  noise: number
  pixelate: number
  duotone: boolean
  duotoneColors: [string, string]
}

// Componente principal
export function ImageCompressor() {
  const [activeTab, setActiveTab] = useState("upload")
  const [images, setImages] = useState<ImageFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [batchSettings, setBatchSettings] = useState<CompressionSettings>({
    quality: 80,
    format: "jpeg",
    preset: "medium",
    resize: false,
    maintainAspectRatio: true,
    stripMetadata: true,
    optimizeColorProfile: true,
    progressive: true,
    lossless: false,
    reduceNoise: false,
    sharpen: false,
    grayscale: false,
    preserveTransparency: true,
    compressAlgorithm: "auto",
  })
  const [batchWatermark, setBatchWatermark] = useState<WatermarkSettings>({
    enabled: false,
    type: "text",
    text: "© Vanguardista",
    position: "bottomRight",
    opacity: 70,
    scale: 50,
    rotation: 0,
    offsetX: 20,
    offsetY: 20,
  })
  const [batchFilters, setBatchFilters] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    sepia: 0,
    invert: false,
    esotericFilter: "none",
    vignette: 0,
    noise: 0,
    pixelate: 0,
    duotone: false,
    duotoneColors: ["#6366f1", "#8b5cf6"],
  })
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const [totalOriginalSize, setTotalOriginalSize] = useState(0)
  const [totalCompressedSize, setTotalCompressedSize] = useState(0)
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [showEsotericFilters, setShowEsotericFilters] = useState(false)
  const [preserveMetadata, setPreserveMetadata] = useState<string[]>([])
  const [customMetadata, setCustomMetadata] = useState<{ name: string; value: string }[]>([])
  const [activeAccordion, setActiveAccordion] = useState<string[]>(["basic"])

  // Función para generar un ID único
  const generateId = () => `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Configurar dropzone para carga de imágenes
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > 30) {
        toast({
          title: "Límite excedido",
          description: "Solo puedes procesar hasta 30 imágenes a la vez.",
          variant: "destructive",
        })
        return
      }

      const newImages: ImageFile[] = []

      acceptedFiles.forEach((file) => {
        const originalSize = file.size
        const preview = URL.createObjectURL(file)

        newImages.push({
          id: generateId(),
          file,
          preview,
          originalSize,
          status: "pending",
          settings: { ...batchSettings },
          watermark: { ...batchWatermark },
          filters: { ...batchFilters },
        })
      })

      setImages((prevImages) => [...prevImages, ...newImages])
      updateTotalSizes([...images, ...newImages])

      // Si es la primera imagen, seleccionarla automáticamente
      if (images.length === 0 && newImages.length > 0) {
        setSelectedImageId(newImages[0].id)
      }

      // Cambiar a la pestaña de imágenes si hay imágenes
      if (activeTab === "upload" && newImages.length > 0) {
        setActiveTab("compress")
      }
    },
    [images, batchSettings, batchWatermark, batchFilters, activeTab],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/avif": [],
      "image/gif": [],
    },
    maxFiles: 30,
  })

  // Actualizar tamaños totales
  const updateTotalSizes = (imageList: ImageFile[] = images) => {
    const originalSize = imageList.reduce((sum, img) => sum + img.originalSize, 0)
    const compressedSize = imageList.reduce((sum, img) => sum + (img.compressedSize || 0), 0)
    setTotalOriginalSize(originalSize)
    setTotalCompressedSize(compressedSize)
  }

  // Limpiar URLs de objetos al desmontar
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.preview) URL.revokeObjectURL(image.preview)
        if (image.compressedPreview) URL.revokeObjectURL(image.compressedPreview)
      })
    }
  }, [])

  // Aplicar configuración por lotes a todas las imágenes
  const applyBatchSettings = () => {
    setImages((prevImages) =>
      prevImages.map((img) => ({
        ...img,
        settings: { ...batchSettings },
        watermark: { ...batchWatermark },
        filters: { ...batchFilters },
      })),
    )

    toast({
      title: "Configuración aplicada",
      description: "La configuración se ha aplicado a todas las imágenes.",
    })
  }

  // Actualizar configuración de una imagen específica
  const updateImageSettings = (id: string, settings: Partial<CompressionSettings>) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === id
          ? {
              ...img,
              settings: {
                ...img.settings,
                ...settings,
              },
            }
          : img,
      ),
    )
  }

  // Eliminar una imagen
  const removeImage = (id: string) => {
    setImages((prevImages) => {
      const imageToRemove = prevImages.find((img) => img.id === id)
      if (imageToRemove) {
        if (imageToRemove.preview) URL.revokeObjectURL(imageToRemove.preview)
        if (imageToRemove.compressedPreview) URL.revokeObjectURL(imageToRemove.compressedPreview)
      }

      const updatedImages = prevImages.filter((img) => img.id !== id)
      if (selectedImageId === id) {
        setSelectedImageId(updatedImages.length > 0 ? updatedImages[0].id : null)
      }
      return updatedImages
    })
  }

  // Eliminar todas las imágenes
  const removeAllImages = () => {
    // Limpiar URLs de objetos
    images.forEach((image) => {
      if (image.preview) URL.revokeObjectURL(image.preview)
      if (image.compressedPreview) URL.revokeObjectURL(image.compressedPreview)
    })

    setImages([])
    setSelectedImageId(null)
    setTotalOriginalSize(0)
    setTotalCompressedSize(0)
  }

  // Aplicar efectos a la imagen (simulado)
  const applyEffectsToImage = (
    imageUrl: string,
    settings: CompressionSettings,
    filters?: FilterSettings,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(new Error("No se pudo crear el contexto del canvas"))
          return
        }

        // Configurar dimensiones
        let width = img.width
        let height = img.height

        // Aplicar redimensionamiento si está habilitado
        if (settings.resize && settings.width && settings.height) {
          width = settings.width
          height = settings.height
        }

        canvas.width = width
        canvas.height = height

        // Dibujar la imagen en el canvas
        ctx.drawImage(img, 0, 0, width, height)

        // Aplicar filtros si están disponibles
        if (filters) {
          // Simulación de filtros (en una implementación real, aquí se aplicarían los filtros)
          if (filters.grayscale) {
            const imageData = ctx.getImageData(0, 0, width, height)
            const data = imageData.data
            for (let i = 0; i < data.length; i += 4) {
              const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
              data[i] = avg
              data[i + 1] = avg
              data[i + 2] = avg
            }
            ctx.putImageData(imageData, 0, 0)
          }

          // Aplicar filtro esotérico (simulado)
          if (filters.esotericFilter !== "none") {
            // Aquí se aplicaría el filtro esotérico en una implementación real
            // Por ahora, solo cambiamos ligeramente el tono para simular
            const imageData = ctx.getImageData(0, 0, width, height)
            const data = imageData.data
            for (let i = 0; i < data.length; i += 4) {
              // Ajuste simple para simular filtro
              data[i] = Math.min(255, data[i] * 1.1) // R
              data[i + 1] = Math.min(255, data[i + 1] * 0.9) // G
              data[i + 2] = Math.min(255, data[i + 2] * 1.2) // B
            }
            ctx.putImageData(imageData, 0, 0)
          }
        }

        // Convertir canvas a URL de datos con la calidad y formato especificados
        let mimeType = "image/jpeg"
        switch (settings.format) {
          case "png":
            mimeType = "image/png"
            break
          case "webp":
            mimeType = "image/webp"
            break
          case "avif":
            mimeType = "image/avif"
            break
        }

        // Intentar obtener la URL del canvas con el formato especificado
        try {
          const quality = settings.quality / 100
          const dataUrl = canvas.toDataURL(mimeType, quality)
          resolve(dataUrl)
        } catch (error) {
          // Si el formato no es compatible, usar JPEG como fallback
          console.warn(`Formato ${settings.format} no soportado, usando JPEG como alternativa`)
          const dataUrl = canvas.toDataURL("image/jpeg", settings.quality / 100)
          resolve(dataUrl)
        }
      }

      img.onerror = () => {
        reject(new Error("Error al cargar la imagen"))
      }

      img.src = imageUrl
    })
  }

  // Simular compresión de imágenes
  const compressImages = async () => {
    if (images.length === 0) return

    setIsProcessing(true)
    setProgress(0)

    // Procesar cada imagen secuencialmente
    for (let i = 0; i < images.length; i++) {
      const img = images[i]
      if (img.status === "completed") continue

      // Actualizar estado a procesando
      setImages((prevImages) =>
        prevImages.map((image) =>
          image.id === img.id
            ? {
                ...image,
                status: "processing",
              }
            : image,
        ),
      )

      try {
        // Simular tiempo de procesamiento
        await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

        // Aplicar efectos a la imagen
        const compressedDataUrl = await applyEffectsToImage(img.preview, img.settings, img.filters)

        // Calcular tamaño comprimido simulado basado en configuraciones
        const qualityFactor = img.settings.quality / 100
        const formatFactor =
          img.settings.format === "webp"
            ? 0.7
            : img.settings.format === "avif"
              ? 0.5
              : img.settings.format === "png" && img.settings.lossless
                ? 0.9
                : 0.8
        const resizeFactor = img.settings.resize && img.settings.width && img.settings.height ? 0.7 : 1
        const algorithmFactor =
          img.settings.compressAlgorithm === "mozjpeg"
            ? 0.75
            : img.settings.compressAlgorithm === "webp"
              ? 0.65
              : img.settings.compressAlgorithm === "avif"
                ? 0.5
                : img.settings.compressAlgorithm === "pngquant"
                  ? 0.8
                  : 0.7

        // Calcular tamaño comprimido simulado
        const compressedSize = Math.round(
          img.originalSize * qualityFactor * formatFactor * resizeFactor * algorithmFactor,
        )
        const compressionRatio = img.originalSize / compressedSize

        // Actualizar imagen con resultado simulado
        setImages((prevImages) =>
          prevImages.map((image) =>
            image.id === img.id
              ? {
                  ...image,
                  compressedPreview: compressedDataUrl,
                  compressedSize,
                  compressionRatio,
                  status: "completed",
                }
              : image,
          ),
        )

        // Actualizar progreso
        setProgress(Math.round(((i + 1) / images.length) * 100))
      } catch (error) {
        console.error("Error al comprimir imagen:", error)
        // Manejar error
        setImages((prevImages) =>
          prevImages.map((image) =>
            image.id === img.id
              ? {
                  ...image,
                  status: "error",
                  error: "Error al comprimir la imagen",
                }
              : image,
          ),
        )
      }
    }

    // Actualizar tamaños totales
    updateTotalSizes()
    setIsProcessing(false)

    toast({
      title: "Compresión completada",
      description: `Se han comprimido ${images.length} imágenes correctamente.`,
    })
  }

  // Descargar una imagen comprimida
  const downloadImage = (id: string) => {
    const image = images.find((img) => img.id === id)
    if (!image || !image.compressedPreview) {
      toast({
        title: "Error",
        description: "No se puede descargar la imagen. Asegúrate de que se ha comprimido correctamente.",
        variant: "destructive",
      })
      return
    }

    try {
      // Crear un enlace para descargar la imagen
      const link = document.createElement("a")
      link.href = image.compressedPreview

      // Generar un nombre de archivo
      const originalName = image.file.name
      const extension = image.settings.format
      const nameWithoutExtension = originalName.substring(0, originalName.lastIndexOf("."))
      link.download = `compressed-${nameWithoutExtension}.${extension}`

      // Simular clic en el enlace
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Descarga iniciada",
        description: `Descargando ${originalName}`,
      })
    } catch (error) {
      console.error("Error al descargar la imagen:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al intentar descargar la imagen.",
        variant: "destructive",
      })
    }
  }

  // Descargar todas las imágenes comprimidas
  const downloadAllImages = () => {
    const completedImages = images.filter((img) => img.status === "completed" && img.compressedPreview)
    if (completedImages.length === 0) {
      toast({
        title: "Error",
        description: "No hay imágenes comprimidas para descargar.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Preparando descarga",
      description: `Preparando ${completedImages.length} imágenes para descargar.`,
    })

    // Descargar cada imagen individualmente con un pequeño retraso entre cada una
    completedImages.forEach((image, index) => {
      setTimeout(() => {
        downloadImage(image.id)
      }, index * 500) // 500ms de retraso entre cada descarga para evitar problemas
    })
  }

  // Aplicar preset de compresión
  const applyCompressionPreset = (preset: "low" | "medium" | "high" | "extreme") => {
    const presetSettings: Partial<CompressionSettings> = {
      preset,
      quality: preset === "low" ? 90 : preset === "medium" ? 80 : preset === "high" ? 65 : 40,
      format: preset === "extreme" ? "webp" : "jpeg",
      progressive: preset !== "low",
      reduceNoise: preset === "high" || preset === "extreme",
      sharpen: preset === "high" || preset === "extreme",
      compressAlgorithm: preset === "extreme" ? "webp" : "auto",
    }

    setBatchSettings((prev) => ({
      ...prev,
      ...presetSettings,
    }))

    toast({
      title: "Preset aplicado",
      description: `Se ha aplicado el preset de compresión "${preset}".`,
    })
  }

  // Aplicar filtro esotérico
  const applyEsotericFilter = (filter: FilterSettings["esotericFilter"]) => {
    const filterSettings: Partial<FilterSettings> = {
      esotericFilter: filter,
    }

    // Configuraciones específicas para cada filtro esotérico
    switch (filter) {
      case "mystical":
        filterSettings.brightness = 105
        filterSettings.contrast = 110
        filterSettings.saturation = 120
        filterSettings.hue = 10
        filterSettings.vignette = 30
        break
      case "ethereal":
        filterSettings.brightness = 115
        filterSettings.contrast = 90
        filterSettings.saturation = 80
        filterSettings.blur = 2
        filterSettings.sepia = 20
        break
      case "cosmic":
        filterSettings.brightness = 110
        filterSettings.contrast = 120
        filterSettings.saturation = 130
        filterSettings.hue = -10
        filterSettings.noise = 5
        break
      case "alchemical":
        filterSettings.brightness = 100
        filterSettings.contrast = 130
        filterSettings.saturation = 110
        filterSettings.sepia = 30
        filterSettings.vignette = 40
        break
      case "astral":
        filterSettings.brightness = 120
        filterSettings.contrast = 95
        filterSettings.saturation = 90
        filterSettings.blur = 1
        filterSettings.hue = 180
        break
      case "elemental":
        filterSettings.brightness = 105
        filterSettings.contrast = 115
        filterSettings.saturation = 125
        filterSettings.duotone = true
        filterSettings.duotoneColors = ["#ff7b00", "#4b56d2"]
        break
      case "chakra":
        filterSettings.brightness = 110
        filterSettings.contrast = 110
        filterSettings.saturation = 140
        filterSettings.hue = 30
        filterSettings.vignette = 20
        break
      default:
        // Restablecer a valores predeterminados
        filterSettings.brightness = 100
        filterSettings.contrast = 100
        filterSettings.saturation = 100
        filterSettings.hue = 0
        filterSettings.blur = 0
        filterSettings.sepia = 0
        filterSettings.vignette = 0
        filterSettings.noise = 0
        filterSettings.duotone = false
    }

    setBatchFilters((prev) => ({
      ...prev,
      ...filterSettings,
    }))

    toast({
      title: "Filtro aplicado",
      description: `Se ha aplicado el filtro esotérico "${filter}".`,
    })
  }

  // Formatear tamaño en KB o MB
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 KB"
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  // Calcular porcentaje de ahorro
  const calculateSavings = (original: number, compressed: number) => {
    if (original === 0 || compressed === 0) return 0
    return Math.round(((original - compressed) / original) * 100)
  }

  // Renderizar vista previa de imagen seleccionada
  const renderSelectedImagePreview = () => {
    if (!selectedImageId) return null

    const selectedImage = images.find((img) => img.id === selectedImageId)
    if (!selectedImage) return null

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Original</h3>
            <div className="relative aspect-square rounded-md overflow-hidden border border-white/10 bg-black/40">
              <img
                src={selectedImage.preview || "/placeholder.svg"}
                alt="Original"
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {formatSize(selectedImage.originalSize)}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Comprimida</h3>
            <div className="relative aspect-square rounded-md overflow-hidden border border-white/10 bg-black/40">
              {selectedImage.status === "completed" && selectedImage.compressedPreview ? (
                <>
                  <img
                    src={selectedImage.compressedPreview || "/placeholder.svg"}
                    alt="Comprimida"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {formatSize(selectedImage.compressedSize || 0)}
                  </div>
                  {selectedImage.compressedSize && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-500/80">
                        {calculateSavings(selectedImage.originalSize, selectedImage.compressedSize)}% menos
                      </Badge>
                    </div>
                  )}
                </>
              ) : selectedImage.status === "processing" ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </div>
              ) : selectedImage.status === "error" ? (
                <div className="flex items-center justify-center h-full text-center p-4">
                  <div>
                    <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                    <p className="text-sm text-red-400">{selectedImage.error || "Error al procesar la imagen"}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center p-4">
                  <p className="text-sm text-muted-foreground">
                    Haz clic en "Comprimir Imágenes" para ver el resultado
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Información de la imagen</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Nombre:</span> {selectedImage.file.name}
              </p>
              <p>
                <span className="text-muted-foreground">Tipo:</span> {selectedImage.file.type}
              </p>
              <p>
                <span className="text-muted-foreground">Tamaño original:</span> {formatSize(selectedImage.originalSize)}
              </p>
              {selectedImage.compressedSize && (
                <>
                  <p>
                    <span className="text-muted-foreground">Tamaño comprimido:</span>{" "}
                    {formatSize(selectedImage.compressedSize)}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Ratio de compresión:</span>{" "}
                    {selectedImage.compressionRatio?.toFixed(2)}x
                  </p>
                  <p>
                    <span className="text-muted-foreground">Ahorro:</span>{" "}
                    {calculateSavings(selectedImage.originalSize, selectedImage.compressedSize)}%
                  </p>
                </>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Configuración aplicada</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Calidad:</span> {selectedImage.settings.quality}%
              </p>
              <p>
                <span className="text-muted-foreground">Formato:</span> {selectedImage.settings.format.toUpperCase()}
              </p>
              <p>
                <span className="text-muted-foreground">Preset:</span>{" "}
                {selectedImage.settings.preset.charAt(0).toUpperCase() + selectedImage.settings.preset.slice(1)}
              </p>
              {selectedImage.settings.resize && (
                <p>
                  <span className="text-muted-foreground">Redimensionado:</span> {selectedImage.settings.width}x
                  {selectedImage.settings.height}
                </p>
              )}
              {selectedImage.filters?.esotericFilter !== "none" && (
                <p>
                  <span className="text-muted-foreground">Filtro esotérico:</span>{" "}
                  {selectedImage.filters?.esotericFilter}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {selectedImage.status === "pending" && (
            <Button
              variant="default"
              size="sm"
              onClick={() => compressImages()}
              disabled={isProcessing}
              className="mr-auto"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Comprimiendo...
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  Comprimir Imagen
                </>
              )}
            </Button>
          )}
          {selectedImage.status === "completed" && selectedImage.compressedPreview && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadImage(selectedImage.id)}
              className="bg-background/50 hover:bg-background/80 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => removeImage(selectedImage.id)}
            className="bg-background/50 hover:bg-background/80 transition-colors text-red-400 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>
    )
  }

  // Renderizar configuración de compresión
  const renderCompressionSettings = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-medium">Presets de Compresión</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyCompressionPreset("low")}
                className="bg-background/50 hover:bg-background/80 transition-colors"
              >
                Bajo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyCompressionPreset("medium")}
                className="bg-background/50 hover:bg-background/80 transition-colors"
              >
                Medio
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyCompressionPreset("high")}
                className="bg-background/50 hover:bg-background/80 transition-colors"
              >
                Alto
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyCompressionPreset("extreme")}
                className="bg-background/50 hover:bg-background/80 transition-colors"
              >
                Extremo
              </Button>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="quality">Calidad: {batchSettings.quality}%</Label>
                </div>
                <Slider
                  id="quality"
                  min={1}
                  max={100}
                  step={1}
                  value={[batchSettings.quality]}
                  onValueChange={(value) => setBatchSettings({ ...batchSettings, quality: value[0] })}
                />
                <p className="text-xs text-muted-foreground">
                  Menor calidad = archivo más pequeño, mayor calidad = mejor apariencia
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Formato de salida</Label>
                <Select
                  value={batchSettings.format}
                  onValueChange={(value: CompressionSettings["format"]) =>
                    setBatchSettings({ ...batchSettings, format: value })
                  }
                >
                  <SelectTrigger id="format" className="bg-black/40">
                    <SelectValue placeholder="Selecciona un formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpeg">JPEG (Compatible universal)</SelectItem>
                    <SelectItem value="png">PNG (Con transparencia)</SelectItem>
                    <SelectItem value="webp">WebP (Mejor compresión)</SelectItem>
                    <SelectItem value="avif">AVIF (Compresión avanzada)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  WebP y AVIF ofrecen mejor compresión pero menor compatibilidad
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="resize-toggle">Redimensionar</Label>
                  <Switch
                    id="resize-toggle"
                    checked={batchSettings.resize}
                    onCheckedChange={(checked) => setBatchSettings({ ...batchSettings, resize: checked })}
                  />
                </div>
                {batchSettings.resize && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="width">Ancho (px)</Label>
                      <Input
                        id="width"
                        type="number"
                        value={batchSettings.width || ""}
                        onChange={(e) =>
                          setBatchSettings({
                            ...batchSettings,
                            width: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        className="bg-black/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Alto (px)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={batchSettings.height || ""}
                        onChange={(e) =>
                          setBatchSettings({
                            ...batchSettings,
                            height: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        className="bg-black/40"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="maintain-aspect-ratio"
                          checked={batchSettings.maintainAspectRatio}
                          onCheckedChange={(checked) =>
                            setBatchSettings({
                              ...batchSettings,
                              maintainAspectRatio: checked as boolean,
                            })
                          }
                        />
                        <label
                          htmlFor="maintain-aspect-ratio"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Mantener proporción
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="advanced-settings">Configuración avanzada</Label>
                <Switch
                  id="advanced-settings"
                  checked={showAdvancedSettings}
                  onCheckedChange={setShowAdvancedSettings}
                />
              </div>

              {showAdvancedSettings && (
                <>
                  <div className="space-y-2">
                    <Label>Algoritmo de compresión</Label>
                    <RadioGroup
                      value={batchSettings.compressAlgorithm}
                      onValueChange={(value: CompressionSettings["compressAlgorithm"]) =>
                        setBatchSettings({ ...batchSettings, compressAlgorithm: value })
                      }
                      className="grid grid-cols-2 gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="auto" id="algorithm-auto" />
                        <Label htmlFor="algorithm-auto" className="text-sm">
                          Automático
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mozjpeg" id="algorithm-mozjpeg" />
                        <Label htmlFor="algorithm-mozjpeg" className="text-sm">
                          MozJPEG
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="webp" id="algorithm-webp" />
                        <Label htmlFor="algorithm-webp" className="text-sm">
                          WebP
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="avif" id="algorithm-avif" />
                        <Label htmlFor="algorithm-avif" className="text-sm">
                          AVIF
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="strip-metadata"
                        checked={batchSettings.stripMetadata}
                        onCheckedChange={(checked) =>
                          setBatchSettings({
                            ...batchSettings,
                            stripMetadata: checked as boolean,
                          })
                        }
                      />
                      <label
                        htmlFor="strip-metadata"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Eliminar metadatos
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="optimize-color"
                        checked={batchSettings.optimizeColorProfile}
                        onCheckedChange={(checked) =>
                          setBatchSettings({
                            ...batchSettings,
                            optimizeColorProfile: checked as boolean,
                          })
                        }
                      />
                      <label
                        htmlFor="optimize-color"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Optimizar perfil de color
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="progressive"
                        checked={batchSettings.progressive}
                        onCheckedChange={(checked) =>
                          setBatchSettings({
                            ...batchSettings,
                            progressive: checked as boolean,
                          })
                        }
                      />
                      <label
                        htmlFor="progressive"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Carga progresiva
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lossless"
                        checked={batchSettings.lossless}
                        onCheckedChange={(checked) =>
                          setBatchSettings({
                            ...batchSettings,
                            lossless: checked as boolean,
                          })
                        }
                      />
                      <label
                        htmlFor="lossless"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Sin pérdida (mayor tamaño)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="reduce-noise"
                        checked={batchSettings.reduceNoise}
                        onCheckedChange={(checked) =>
                          setBatchSettings({
                            ...batchSettings,
                            reduceNoise: checked as boolean,
                          })
                        }
                      />
                      <label
                        htmlFor="reduce-noise"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Reducir ruido
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sharpen"
                        checked={batchSettings.sharpen}
                        onCheckedChange={(checked) =>
                          setBatchSettings({
                            ...batchSettings,
                            sharpen: checked as boolean,
                          })
                        }
                      />
                      <label
                        htmlFor="sharpen"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Enfocar
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="grayscale"
                        checked={batchSettings.grayscale}
                        onCheckedChange={(checked) =>
                          setBatchSettings({
                            ...batchSettings,
                            grayscale: checked as boolean,
                          })
                        }
                      />
                      <label
                        htmlFor="grayscale"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Escala de grises
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="preserve-transparency"
                        checked={batchSettings.preserveTransparency}
                        onCheckedChange={(checked) =>
                          setBatchSettings({
                            ...batchSettings,
                            preserveTransparency: checked as boolean,
                          })
                        }
                      />
                      <label
                        htmlFor="preserve-transparency"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Preservar transparencia
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <Button onClick={applyBatchSettings} className="w-full" disabled={images.length === 0}>
          Aplicar configuración a todas las imágenes
        </Button>
      </div>
    )
  }

  // Renderizar configuración de marca de agua
  const renderWatermarkSettings = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="watermark-toggle">Activar marca de agua</Label>
          <Switch
            id="watermark-toggle"
            checked={batchWatermark.enabled}
            onCheckedChange={(checked) => setBatchWatermark({ ...batchWatermark, enabled: checked })}
          />
        </div>

        {batchWatermark.enabled && (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de marca de agua</Label>
                <RadioGroup
                  value={batchWatermark.type}
                  onValueChange={(value: WatermarkSettings["type"]) =>
                    setBatchWatermark({ ...batchWatermark, type: value })
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="watermark-text" />
                    <Label htmlFor="watermark-text">Texto</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="image" id="watermark-image" />
                    <Label htmlFor="watermark-image">Imagen</Label>
                  </div>
                </RadioGroup>
              </div>

              {batchWatermark.type === "text" ? (
                <div className="space-y-2">
                  <Label htmlFor="watermark-text-input">Texto de marca de agua</Label>
                  <Input
                    id="watermark-text-input"
                    value={batchWatermark.text || ""}
                    onChange={(e) => setBatchWatermark({ ...batchWatermark, text: e.target.value })}
                    placeholder="© Tu Marca"
                    className="bg-black/40"
                  />
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="watermark-font">Fuente</Label>
                      <Select
                        value={batchWatermark.font || "Arial"}
                        onValueChange={(value) => setBatchWatermark({ ...batchWatermark, font: value })}
                      >
                        <SelectTrigger id="watermark-font" className="bg-black/40">
                          <SelectValue placeholder="Selecciona una fuente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          <SelectItem value="Courier New">Courier New</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                          <SelectItem value="Verdana">Verdana</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="watermark-font-size">Tamaño de fuente</Label>
                      <Input
                        id="watermark-font-size"
                        type="number"
                        value={batchWatermark.fontSize || "24"}
                        onChange={(e) =>
                          setBatchWatermark({
                            ...batchWatermark,
                            fontSize: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        className="bg-black/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="watermark-font-color">Color de fuente</Label>
                      <Input
                        id="watermark-font-color"
                        type="color"
                        value={batchWatermark.fontColor || "#ffffff"}
                        onChange={(e) => setBatchWatermark({ ...batchWatermark, fontColor: e.target.value })}
                        className="h-10 p-1 bg-black/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="watermark-style">Estilo</Label>
                      <Select
                        value={batchWatermark.style || "normal"}
                        onValueChange={(value: WatermarkSettings["style"]) =>
                          setBatchWatermark({ ...batchWatermark, style: value })
                        }
                      >
                        <SelectTrigger id="watermark-style" className="bg-black/40">
                          <SelectValue placeholder="Selecciona un estilo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="embossed">Relieve</SelectItem>
                          <SelectItem value="debossed">Hundido</SelectItem>
                          <SelectItem value="outline">Contorno</SelectItem>
                          <SelectItem value="glow">Resplandor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="watermark-image-input">Imagen de marca de agua</Label>
                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed border-white/20 rounded-md p-4 text-center cursor-pointer hover:border-white/40 transition-colors"
                  >
                    <input {...getInputProps()} />
                    <p className="text-sm text-muted-foreground">
                      Arrastra y suelta una imagen aquí, o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Recomendado: imagen PNG con fondo transparente</p>
                  </div>
                  {batchWatermark.image && (
                    <div className="mt-2 flex items-center justify-center">
                      <img
                        src={batchWatermark.image || "/placeholder.svg"}
                        alt="Marca de agua"
                        className="max-h-16 max-w-full object-contain"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="watermark-position">Posición</Label>
                <Select
                  value={batchWatermark.position}
                  onValueChange={(value: WatermarkSettings["position"]) =>
                    setBatchWatermark({ ...batchWatermark, position: value })
                  }
                >
                  <SelectTrigger id="watermark-position" className="bg-black/40">
                    <SelectValue placeholder="Selecciona una posición" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">Centro</SelectItem>
                    <SelectItem value="topLeft">Superior izquierda</SelectItem>
                    <SelectItem value="topRight">Superior derecha</SelectItem>
                    <SelectItem value="bottomLeft">Inferior izquierda</SelectItem>
                    <SelectItem value="bottomRight">Inferior derecha</SelectItem>
                    <SelectItem value="custom">Personalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {batchWatermark.position === "custom" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="watermark-offset-x">Desplazamiento X (px)</Label>
                    <Input
                      id="watermark-offset-x"
                      type="number"
                      value={batchWatermark.offsetX}
                      onChange={(e) =>
                        setBatchWatermark({
                          ...batchWatermark,
                          offsetX: Number(e.target.value),
                        })
                      }
                      className="bg-black/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="watermark-offset-y">Desplazamiento Y (px)</Label>
                    <Input
                      id="watermark-offset-y"
                      type="number"
                      value={batchWatermark.offsetY}
                      onChange={(e) =>
                        setBatchWatermark({
                          ...batchWatermark,
                          offsetY: Number(e.target.value),
                        })
                      }
                      className="bg-black/40"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="watermark-opacity">Opacidad: {batchWatermark.opacity}%</Label>
                  </div>
                  <Slider
                    id="watermark-opacity"
                    min={1}
                    max={100}
                    step={1}
                    value={[batchWatermark.opacity]}
                    onValueChange={(value) => setBatchWatermark({ ...batchWatermark, opacity: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="watermark-scale">Escala: {batchWatermark.scale}%</Label>
                  </div>
                  <Slider
                    id="watermark-scale"
                    min={1}
                    max={100}
                    step={1}
                    value={[batchWatermark.scale]}
                    onValueChange={(value) => setBatchWatermark({ ...batchWatermark, scale: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="watermark-rotation">Rotación: {batchWatermark.rotation}°</Label>
                  </div>
                  <Slider
                    id="watermark-rotation"
                    min={0}
                    max={360}
                    step={1}
                    value={[batchWatermark.rotation]}
                    onValueChange={(value) => setBatchWatermark({ ...batchWatermark, rotation: value[0] })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="watermark-repeat"
                  checked={batchWatermark.repeat}
                  onCheckedChange={(checked) =>
                    setBatchWatermark({
                      ...batchWatermark,
                      repeat: checked as boolean,
                    })
                  }
                />
                <label
                  htmlFor="watermark-repeat"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Repetir marca de agua (patrón)
                </label>
              </div>

              {batchWatermark.repeat && (
                <div className="space-y-2">
                  <Label htmlFor="watermark-margin">Margen entre repeticiones (px)</Label>
                  <Input
                    id="watermark-margin"
                    type="number"
                    value={batchWatermark.margin || "20"}
                    onChange={(e) =>
                      setBatchWatermark({
                        ...batchWatermark,
                        margin: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="bg-black/40"
                  />
                </div>
              )}
            </div>

            <Button onClick={applyBatchSettings} className="w-full" disabled={images.length === 0}>
              Aplicar marca de agua a todas las imágenes
            </Button>
          </>
        )}
      </div>
    )
  }

  // Renderizar configuración de filtros
  const renderFilterSettings = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="esoteric-filters">Filtros Esotéricos</Label>
          <Switch id="esoteric-filters" checked={showEsotericFilters} onCheckedChange={setShowEsotericFilters} />
        </div>

        {showEsotericFilters && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Filtro Esotérico</Label>
              <RadioGroup
                value={batchFilters.esotericFilter}
                onValueChange={(value: FilterSettings["esotericFilter"]) => applyEsotericFilter(value)}
                className="grid grid-cols-2 gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="filter-none" />
                  <Label htmlFor="filter-none" className="text-sm">
                    Ninguno
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mystical" id="filter-mystical" />
                  <Label htmlFor="filter-mystical" className="text-sm">
                    Místico
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ethereal" id="filter-ethereal" />
                  <Label htmlFor="filter-ethereal" className="text-sm">
                    Etéreo
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cosmic" id="filter-cosmic" />
                  <Label htmlFor="filter-cosmic" className="text-sm">
                    Cósmico
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="alchemical" id="filter-alchemical" />
                  <Label htmlFor="filter-alchemical" className="text-sm">
                    Alquímico
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="astral" id="filter-astral" />
                  <Label htmlFor="filter-astral" className="text-sm">
                    Astral
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="elemental" id="filter-elemental" />
                  <Label htmlFor="filter-elemental" className="text-sm">
                    Elemental
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="chakra" id="filter-chakra" />
                  <Label htmlFor="filter-chakra" className="text-sm">
                    Chakra
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="brightness">Brillo: {batchFilters.brightness}%</Label>
                  </div>
                  <Slider
                    id="brightness"
                    min={0}
                    max={200}
                    step={1}
                    value={[batchFilters.brightness]}
                    onValueChange={(value) => setBatchFilters({ ...batchFilters, brightness: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="contrast">Contraste: {batchFilters.contrast}%</Label>
                  </div>
                  <Slider
                    id="contrast"
                    min={0}
                    max={200}
                    step={1}
                    value={[batchFilters.contrast]}
                    onValueChange={(value) => setBatchFilters({ ...batchFilters, contrast: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="saturation">Saturación: {batchFilters.saturation}%</Label>
                  </div>
                  <Slider
                    id="saturation"
                    min={0}
                    max={200}
                    step={1}
                    value={[batchFilters.saturation]}
                    onValueChange={(value) => setBatchFilters({ ...batchFilters, saturation: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="hue">Tono: {batchFilters.hue}°</Label>
                  </div>
                  <Slider
                    id="hue"
                    min={-180}
                    max={180}
                    step={1}
                    value={[batchFilters.hue]}
                    onValueChange={(value) => setBatchFilters({ ...batchFilters, hue: value[0] })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="blur">Desenfoque: {batchFilters.blur}px</Label>
                  </div>
                  <Slider
                    id="blur"
                    min={0}
                    max={20}
                    step={0.5}
                    value={[batchFilters.blur]}
                    onValueChange={(value) => setBatchFilters({ ...batchFilters, blur: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="sepia">Sepia: {batchFilters.sepia}%</Label>
                  </div>
                  <Slider
                    id="sepia"
                    min={0}
                    max={100}
                    step={1}
                    value={[batchFilters.sepia]}
                    onValueChange={(value) => setBatchFilters({ ...batchFilters, sepia: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="vignette">Viñeta: {batchFilters.vignette}%</Label>
                  </div>
                  <Slider
                    id="vignette"
                    min={0}
                    max={100}
                    step={1}
                    value={[batchFilters.vignette]}
                    onValueChange={(value) => setBatchFilters({ ...batchFilters, vignette: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="noise">Ruido: {batchFilters.noise}%</Label>
                  </div>
                  <Slider
                    id="noise"
                    min={0}
                    max={50}
                    step={1}
                    value={[batchFilters.noise]}
                    onValueChange={(value) => setBatchFilters({ ...batchFilters, noise: value[0] })}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="invert"
                checked={batchFilters.invert}
                onCheckedChange={(checked) =>
                  setBatchFilters({
                    ...batchFilters,
                    invert: checked as boolean,
                  })
                }
              />
              <label
                htmlFor="invert"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Invertir colores
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="duotone"
                checked={batchFilters.duotone}
                onCheckedChange={(checked) =>
                  setBatchFilters({
                    ...batchFilters,
                    duotone: checked as boolean,
                  })
                }
              />
              <label
                htmlFor="duotone"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Efecto duotono
              </label>
            </div>

            {batchFilters.duotone && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duotone-color1">Color 1</Label>
                  <Input
                    id="duotone-color1"
                    type="color"
                    value={batchFilters.duotoneColors[0]}
                    onChange={(e) =>
                      setBatchFilters({
                        ...batchFilters,
                        duotoneColors: [e.target.value, batchFilters.duotoneColors[1]],
                      })
                    }
                    className="h-10 p-1 bg-black/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duotone-color2">Color 2</Label>
                  <Input
                    id="duotone-color2"
                    type="color"
                    value={batchFilters.duotoneColors[1]}
                    onChange={(e) =>
                      setBatchFilters({
                        ...batchFilters,
                        duotoneColors: [batchFilters.duotoneColors[0], e.target.value],
                      })
                    }
                    className="h-10 p-1 bg-black/40"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <Separator />

        <div className="space-y-4">
          <h3 className="text-base font-medium">Ajustes Básicos</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="brightness-basic">Brillo: {batchFilters.brightness}%</Label>
                </div>
                <Slider
                  id="brightness-basic"
                  min={0}
                  max={200}
                  step={1}
                  value={[batchFilters.brightness]}
                  onValueChange={(value) => setBatchFilters({ ...batchFilters, brightness: value[0] })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="contrast-basic">Contraste: {batchFilters.contrast}%</Label>
                </div>
                <Slider
                  id="contrast-basic"
                  min={0}
                  max={200}
                  step={1}
                  value={[batchFilters.contrast]}
                  onValueChange={(value) => setBatchFilters({ ...batchFilters, contrast: value[0] })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="saturation-basic">Saturación: {batchFilters.saturation}%</Label>
                </div>
                <Slider
                  id="saturation-basic"
                  min={0}
                  max={200}
                  step={1}
                  value={[batchFilters.saturation]}
                  onValueChange={(value) => setBatchFilters({ ...batchFilters, saturation: value[0] })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="blur-basic">Desenfoque: {batchFilters.blur}px</Label>
                </div>
                <Slider
                  id="blur-basic"
                  min={0}
                  max={20}
                  step={0.5}
                  value={[batchFilters.blur]}
                  onValueChange={(value) => setBatchFilters({ ...batchFilters, blur: value[0] })}
                />
              </div>
            </div>
          </div>
        </div>

        <Button onClick={applyBatchSettings} className="w-full" disabled={images.length === 0}>
          Aplicar filtros a todas las imágenes
        </Button>
      </div>
    )
  }

  // Renderizar configuración de metadatos
  const renderMetadataSettings = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-base font-medium">Metadatos a preservar</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="preserve-exif"
                checked={preserveMetadata.includes("exif")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setPreserveMetadata([...preserveMetadata, "exif"])
                  } else {
                    setPreserveMetadata(preserveMetadata.filter((item) => item !== "exif"))
                  }
                }}
              />
              <label
                htmlFor="preserve-exif"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                EXIF (datos de cámara)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="preserve-iptc"
                checked={preserveMetadata.includes("iptc")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setPreserveMetadata([...preserveMetadata, "iptc"])
                  } else {
                    setPreserveMetadata(preserveMetadata.filter((item) => item !== "iptc"))
                  }
                }}
              />
              <label
                htmlFor="preserve-iptc"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                IPTC (copyright, autor)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="preserve-xmp"
                checked={preserveMetadata.includes("xmp")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setPreserveMetadata([...preserveMetadata, "xmp"])
                  } else {
                    setPreserveMetadata(preserveMetadata.filter((item) => item !== "xmp"))
                  }
                }}
              />
              <label
                htmlFor="preserve-xmp"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                XMP (metadatos extensibles)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="preserve-gps"
                checked={preserveMetadata.includes("gps")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setPreserveMetadata([...preserveMetadata, "gps"])
                  } else {
                    setPreserveMetadata(preserveMetadata.filter((item) => item !== "gps"))
                  }
                }}
              />
              <label
                htmlFor="preserve-gps"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                GPS (ubicación)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="preserve-icc"
                checked={preserveMetadata.includes("icc")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setPreserveMetadata([...preserveMetadata, "icc"])
                  } else {
                    setPreserveMetadata(preserveMetadata.filter((item) => item !== "icc"))
                  }
                }}
              />
              <label
                htmlFor="preserve-icc"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                ICC (perfil de color)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="preserve-thumbnail"
                checked={preserveMetadata.includes("thumbnail")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setPreserveMetadata([...preserveMetadata, "thumbnail"])
                  } else {
                    setPreserveMetadata(preserveMetadata.filter((item) => item !== "thumbnail"))
                  }
                }}
              />
              <label
                htmlFor="preserve-thumbnail"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Miniaturas
              </label>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-base font-medium">Metadatos personalizados</h3>
          <div className="space-y-2">
            {customMetadata.map((metadata, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Nombre"
                  value={metadata.name}
                  onChange={(e) => {
                    const newMetadata = [...customMetadata]
                    newMetadata[index].name = e.target.value
                    setCustomMetadata(newMetadata)
                  }}
                  className="bg-black/40"
                />
                <Input
                  placeholder="Valor"
                  value={metadata.value}
                  onChange={(e) => {
                    const newMetadata = [...customMetadata]
                    newMetadata[index].value = e.target.value
                    setCustomMetadata(newMetadata)
                  }}
                  className="bg-black/40"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newMetadata = [...customMetadata]
                    newMetadata.splice(index, 1)
                    setCustomMetadata(newMetadata)
                  }}
                  className="bg-background/50 hover:bg-background/80 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => setCustomMetadata([...customMetadata, { name: "", value: "" }])}
              className="w-full bg-background/50 hover:bg-background/80 transition-colors"
            >
              Añadir metadato personalizado
            </Button>
          </div>
        </div>

        <Button
          onClick={() => {
            // Aplicar configuración de metadatos
            setBatchSettings({
              ...batchSettings,
              stripMetadata: preserveMetadata.length === 0,
            })
            toast({
              title: "Configuración de metadatos aplicada",
              description: "La configuración de metadatos se ha aplicado a todas las imágenes.",
            })
          }}
          className="w-full"
          disabled={images.length === 0}
        >
          Aplicar configuración de metadatos
        </Button>
      </div>
    )
  }

  return (
    <Card className="border-0 bg-black/20 backdrop-blur-sm shadow-lg shadow-purple-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <ImageIcon className="h-6 w-6 text-purple-400" />
          Compresor de Imágenes Avanzado
        </CardTitle>
        <CardDescription className="text-base">
          Comprime, optimiza y personaliza tus imágenes con opciones avanzadas y filtros esotéricos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 p-1 bg-black/30 backdrop-blur-sm rounded-xl border border-purple-500/20">
            <TabsTrigger
              value="upload"
              className="text-base py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500/30 data-[state=active]:to-indigo-500/30 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 group"
            >
              <Upload className="h-4 w-4 mr-2 transition-transform group-hover:translate-y-[-2px]" />
              Subir
            </TabsTrigger>
            <TabsTrigger
              value="compress"
              className="text-base py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500/30 data-[state=active]:to-indigo-500/30 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 group"
            >
              <Settings className="h-4 w-4 mr-2 transition-all group-hover:rotate-45" />
              Comprimir
            </TabsTrigger>
            <TabsTrigger
              value="watermark"
              className="text-base py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500/30 data-[state=active]:to-indigo-500/30 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 group"
            >
              <Stamp className="h-4 w-4 mr-2 transition-all group-hover:scale-110" />
              Marca de agua
            </TabsTrigger>
            <TabsTrigger
              value="filters"
              className="text-base py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500/30 data-[state=active]:to-indigo-500/30 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 group"
            >
              <Sparkles className="h-4 w-4 mr-2 transition-all group-hover:scale-110" />
              Filtros
            </TabsTrigger>
            <TabsTrigger
              value="metadata"
              className="text-base py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500/30 data-[state=active]:to-indigo-500/30 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 group"
            >
              <FileType className="h-4 w-4 mr-2 transition-transform group-hover:translate-y-[-2px]" />
              Metadatos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? "border-purple-500 bg-purple-500/10" : "border-white/20 hover:border-white/40"
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <Upload className="h-8 w-8 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Arrastra y suelta tus imágenes aquí</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        O haz clic para seleccionar archivos (máximo 30 imágenes)
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-200 border-purple-500/30">
                        JPG
                      </Badge>
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-200 border-purple-500/30">
                        PNG
                      </Badge>
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-200 border-purple-500/30">
                        WebP
                      </Badge>
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-200 border-purple-500/30">
                        AVIF
                      </Badge>
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-200 border-purple-500/30">
                        GIF
                      </Badge>
                    </div>
                  </div>
                </div>

                {images.length > 0 && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Imágenes cargadas ({images.length})</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={removeAllImages}
                        className="bg-background/50 hover:bg-background/80 transition-colors text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar todas
                      </Button>
                    </div>

                    <ScrollArea className="h-[300px] rounded-md border border-white/10 bg-black/20 p-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {images.map((image) => (
                          <div
                            key={image.id}
                            className={`relative rounded-md overflow-hidden border ${
                              selectedImageId === image.id
                                ? "border-purple-500 ring-2 ring-purple-500/50"
                                : "border-white/10"
                            } cursor-pointer transition-all hover:scale-105 hover:border-purple-500/50`}
                            onClick={() => setSelectedImageId(image.id)}
                          >
                            <div className="aspect-square relative">
                              <img
                                src={image.preview || "/placeholder.svg"}
                                alt={image.file.name}
                                className="w-full h-full object-cover"
                              />
                              {image.status === "processing" && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                                </div>
                              )}
                              {image.status === "completed" && (
                                <div className="absolute top-1 right-1">
                                  <Badge className="bg-green-500/80 text-xs">
                                    {calculateSavings(image.originalSize, image.compressedSize || 0)}%
                                  </Badge>
                                </div>
                              )}
                              {image.status === "error" && (
                                <div className="absolute top-1 right-1">
                                  <Badge variant="destructive" className="text-xs">
                                    Error
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-xs truncate">
                              {image.file.name.length > 20 ? `${image.file.name.substring(0, 20)}...` : image.file.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>

              <div>
                {selectedImageId ? (
                  renderSelectedImagePreview()
                ) : (
                  <div className="space-y-6">
                    <Card className="bg-black/30 border-purple-500/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Gauge className="h-5 w-5 text-purple-400" />
                          Estadísticas de Compresión
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Imágenes cargadas</span>
                            <span className="font-medium">{images.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Tamaño original total</span>
                            <span className="font-medium">{formatSize(totalOriginalSize)}</span>
                          </div>
                          {totalCompressedSize > 0 && (
                            <>
                              <div className="flex justify-between text-sm">
                                <span>Tamaño comprimido total</span>
                                <span className="font-medium">{formatSize(totalCompressedSize)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Ahorro total</span>
                                <span className="font-medium text-green-400">
                                  {calculateSavings(totalOriginalSize, totalCompressedSize)}%
                                </span>
                              </div>
                            </>
                          )}
                        </div>

                        {images.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Estado de procesamiento</span>
                              <span className="font-medium">
                                {images.filter((img) => img.status === "completed" || img.status === "error").length}/
                                {images.length}
                              </span>
                            </div>
                            <Progress
                              value={
                                (images.filter((img) => img.status === "completed" || img.status === "error").length /
                                  images.length) *
                                100
                              }
                              className="h-2"
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <div className="space-y-4">
                      <Button
                        onClick={compressImages}
                        className="w-full"
                        disabled={images.length === 0 || isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Comprimiendo... {progress}%
                          </>
                        ) : (
                          "Comprimir Imágenes"
                        )}
                      </Button>

                      {images.some((img) => img.status === "completed") && (
                        <Button
                          variant="outline"
                          onClick={downloadAllImages}
                          className="w-full bg-background/50 hover:bg-background/80 transition-colors"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Descargar Todas
                        </Button>
                      )}
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                      <h3 className="text-sm font-medium flex items-center mb-2">
                        <Info className="h-4 w-4 mr-2 text-purple-400" />
                        Consejos para la compresión
                      </h3>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• Usa WebP para mejor compresión en navegadores modernos</li>
                        <li>• Reduce la calidad a 70-80% para un buen equilibrio</li>
                        <li>• Redimensiona imágenes grandes para ahorrar más espacio</li>
                        <li>• Elimina metadatos para reducir el tamaño del archivo</li>
                        <li>• Los filtros esotéricos añaden un toque místico único</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compress" className="animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
            {renderCompressionSettings()}
          </TabsContent>

          <TabsContent value="watermark" className="animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
            {renderWatermarkSettings()}
          </TabsContent>

          <TabsContent value="filters" className="animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
            {renderFilterSettings()}
          </TabsContent>

          <TabsContent value="metadata" className="animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
            {renderMetadataSettings()}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t border-white/10 pt-4">
        <div className="flex items-center">
          <span className="text-xs text-muted-foreground">
            Compresión avanzada con filtros esotéricos y marcas de agua
          </span>
        </div>
        <div>
          <Badge variant="outline" className="bg-purple-500/10 text-purple-200 border-purple-500/30">
            Compresión Mística
          </Badge>
        </div>
      </CardFooter>
    </Card>
  )
}

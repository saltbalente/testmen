"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import {
  Download,
  Loader2,
  RefreshCw,
  Crop,
  Wand2,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Palette,
  Sliders,
  FileOutput,
  Sparkles,
} from "lucide-react"

interface GeneratedImage {
  url: string
  prompt: string
  timestamp: number
  size: string
  quality: string
  style: string
}

interface ImageEditorModalProps {
  isOpen: boolean
  onClose: () => void
  image: GeneratedImage | null
  onSave: (editedImage: GeneratedImage) => void
}

export function ImageEditorModal({ isOpen, onClose, image, onSave }: ImageEditorModalProps) {
  const [activeTab, setActiveTab] = useState("ajustes")
  const [isProcessing, setIsProcessing] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)

  // Estados para los ajustes
  const [contrast, setContrast] = useState(0)
  const [brightness, setBrightness] = useState(0)
  const [saturation, setSaturation] = useState(0)
  const [sharpness, setSharpness] = useState(0)
  const [selectedFilter, setSelectedFilter] = useState("none")
  const [selectedFormat, setSelectedFormat] = useState("png")

  // Función para aplicar los cambios
  const applyChanges = () => {
    if (!image) return

    setIsProcessing(true)

    // Simulación de procesamiento
    setTimeout(() => {
      setIsProcessing(false)

      // En una implementación real, aquí se procesaría la imagen
      // y se devolvería la URL de la imagen procesada

      onSave({
        ...image,
        // En una implementación real, aquí se actualizaría la URL con la imagen editada
      })

      toast({
        title: "Cambios aplicados",
        description: "La imagen ha sido editada con éxito",
      })

      onClose()
    }, 1500)
  }

  // Función para descargar la imagen
  const downloadImage = () => {
    if (!image) return

    toast({
      title: "Descarga iniciada",
      description: `La imagen se está descargando en formato ${selectedFormat.toUpperCase()}`,
    })

    // En una implementación real, aquí se descargaría la imagen
    // en el formato seleccionado
  }

  // Función para resetear los ajustes
  const resetAdjustments = () => {
    setContrast(0)
    setBrightness(0)
    setSaturation(0)
    setSharpness(0)
    setSelectedFilter("none")

    toast({
      title: "Ajustes reseteados",
      description: "Todos los ajustes han sido restablecidos a sus valores predeterminados",
    })
  }

  if (!image) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
              Editor Avanzado Premium
            </div>
            <Badge variant="outline" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">
              Premium
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow overflow-hidden">
          {/* Panel de previsualización */}
          <div className="md:col-span-2 bg-black/20 rounded-lg overflow-hidden flex flex-col">
            <div className="bg-black/40 p-2 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs">{zoomLevel}%</span>
                <Button variant="ghost" size="icon" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Crop className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Undo className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Redo className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-grow overflow-auto flex items-center justify-center p-4">
              <div
                className="relative"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transition: "transform 0.2s ease-in-out",
                  filter: `
                    contrast(${100 + contrast}%) 
                    brightness(${100 + brightness}%) 
                    saturate(${100 + saturation}%)
                    ${
                      selectedFilter !== "none"
                        ? `sepia(${selectedFilter === "vintage" ? 50 : 0}%) 
                                                  grayscale(${selectedFilter === "noir" ? 100 : 0}%)`
                        : ""
                    }
                  `,
                }}
              >
                <img
                  src={image.url || "/placeholder.svg?height=512&width=512"}
                  alt="Imagen para editar"
                  className="max-w-full max-h-[60vh] object-contain rounded-md"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=512&width=512"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Panel de herramientas */}
          <div className="bg-black/20 rounded-lg overflow-hidden flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
              <TabsList className="grid grid-cols-5 h-auto p-1">
                <TabsTrigger value="ajustes" className="flex flex-col items-center py-2 px-1 h-auto">
                  <Sliders className="h-4 w-4 mb-1" />
                  <span className="text-xs">Ajustes</span>
                </TabsTrigger>
                <TabsTrigger value="filtros" className="flex flex-col items-center py-2 px-1 h-auto">
                  <Palette className="h-4 w-4 mb-1" />
                  <span className="text-xs">Filtros</span>
                </TabsTrigger>
                <TabsTrigger value="avanzado" className="flex flex-col items-center py-2 px-1 h-auto">
                  <Wand2 className="h-4 w-4 mb-1" />
                  <span className="text-xs">Avanzado</span>
                </TabsTrigger>
                <TabsTrigger value="recorte" className="flex flex-col items-center py-2 px-1 h-auto">
                  <Crop className="h-4 w-4 mb-1" />
                  <span className="text-xs">Recorte</span>
                </TabsTrigger>
                <TabsTrigger value="exportar" className="flex flex-col items-center py-2 px-1 h-auto">
                  <FileOutput className="h-4 w-4 mb-1" />
                  <span className="text-xs">Exportar</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex-grow overflow-auto p-4">
                {/* Tab de Ajustes */}
                <TabsContent value="ajustes" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="contrast" className="text-sm">
                        Contraste: {contrast}%
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={() => setContrast(0)}
                        disabled={contrast === 0}
                      >
                        Reset
                      </Button>
                    </div>
                    <Slider
                      id="contrast"
                      min={-100}
                      max={100}
                      step={1}
                      value={[contrast]}
                      onValueChange={(value) => setContrast(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="brightness" className="text-sm">
                        Brillo: {brightness}%
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={() => setBrightness(0)}
                        disabled={brightness === 0}
                      >
                        Reset
                      </Button>
                    </div>
                    <Slider
                      id="brightness"
                      min={-100}
                      max={100}
                      step={1}
                      value={[brightness]}
                      onValueChange={(value) => setBrightness(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="saturation" className="text-sm">
                        Saturación: {saturation}%
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={() => setSaturation(0)}
                        disabled={saturation === 0}
                      >
                        Reset
                      </Button>
                    </div>
                    <Slider
                      id="saturation"
                      min={-100}
                      max={100}
                      step={1}
                      value={[saturation]}
                      onValueChange={(value) => setSaturation(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="sharpness" className="text-sm">
                        Nitidez: {sharpness}%
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={() => setSharpness(0)}
                        disabled={sharpness === 0}
                      >
                        Reset
                      </Button>
                    </div>
                    <Slider
                      id="sharpness"
                      min={-100}
                      max={100}
                      step={1}
                      value={[sharpness]}
                      onValueChange={(value) => setSharpness(value[0])}
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    onClick={resetAdjustments}
                    disabled={contrast === 0 && brightness === 0 && saturation === 0 && sharpness === 0}
                  >
                    Resetear todos los ajustes
                  </Button>
                </TabsContent>

                {/* Tab de Filtros */}
                <TabsContent value="filtros" className="mt-0">
                  <div className="grid grid-cols-2 gap-2">
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
                        className={`border rounded-md p-3 text-center cursor-pointer hover:bg-purple-500/20 transition-colors ${
                          filter.id === selectedFilter ? "bg-purple-500/20 border-purple-500" : "border-purple-500/30"
                        }`}
                        onClick={() => setSelectedFilter(filter.id)}
                      >
                        {filter.name}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Tab de Avanzado */}
                <TabsContent value="avanzado" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label className="text-sm">Mejoras Avanzadas</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="face-enhancement" />
                        <label
                          htmlFor="face-enhancement"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Mejora de rostros
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="noise-reduction" />
                        <label
                          htmlFor="noise-reduction"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Reducción de ruido
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="upscale" />
                        <label
                          htmlFor="upscale"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Aumentar resolución (2x)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remove-background" />
                        <label
                          htmlFor="remove-background"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Eliminar fondo
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Regeneración de Elementos</Label>
                    <Button variant="outline" className="w-full" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerar Rostros
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Estilo Avanzado</Label>
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
                </TabsContent>

                {/* Tab de Recorte */}
                <TabsContent value="recorte" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label className="text-sm">Relación de Aspecto</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "free", name: "Libre" },
                        { id: "1:1", name: "1:1" },
                        { id: "4:3", name: "4:3" },
                        { id: "16:9", name: "16:9" },
                        { id: "3:2", name: "3:2" },
                        { id: "9:16", name: "9:16" },
                      ].map((ratio) => (
                        <div
                          key={ratio.id}
                          className="border rounded-md p-2 text-center text-sm cursor-pointer hover:bg-purple-500/20 transition-colors border-purple-500/30"
                        >
                          {ratio.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Rotación</Label>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4 mr-1" />
                        -90°
                      </Button>
                      <Button variant="outline" size="sm">
                        <RotateCw className="h-4 w-4 mr-1" />
                        +90°
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Button variant="outline" className="w-full" size="sm">
                      <Crop className="h-4 w-4 mr-2" />
                      Aplicar Recorte
                    </Button>
                  </div>
                </TabsContent>

                {/* Tab de Exportar */}
                <TabsContent value="exportar" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label className="text-sm">Formato de Archivo</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: "png", name: "PNG", desc: "Máxima calidad, con transparencia" },
                        { id: "jpg", name: "JPG", desc: "Buena calidad, tamaño reducido" },
                        { id: "webp", name: "WebP", desc: "Formato moderno optimizado para web" },
                      ].map((format) => (
                        <div
                          key={format.id}
                          className={`border rounded-md px-3 py-2 cursor-pointer hover:bg-purple-500/20 transition-colors flex items-center gap-2 ${
                            format.id === selectedFormat ? "bg-purple-500/20 border-purple-500" : "border-purple-500/30"
                          }`}
                          onClick={() => setSelectedFormat(format.id)}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{format.name}</span>
                            <span className="text-xs text-muted-foreground">{format.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Calidad de Compresión</Label>
                    <Slider id="quality" min={1} max={100} step={1} defaultValue={[85]} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Menor tamaño</span>
                      <span>Mayor calidad</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Dimensiones</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Ancho</Label>
                        <Input type="number" defaultValue={1024} className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Alto</Label>
                        <Input type="number" defaultValue={1024} className="mt-1" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Checkbox id="maintain-aspect-ratio" defaultChecked />
                      <label
                        htmlFor="maintain-aspect-ratio"
                        className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Mantener relación de aspecto
                      </label>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-4" onClick={downloadImage}>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar como {selectedFormat.toUpperCase()}
                  </Button>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={applyChanges} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Componente Input para el tab de exportar
function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

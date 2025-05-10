"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { extractPinterestVideo, PinterestError, validatePinterestUrl } from "@/lib/pinterest-service"
import { toast } from "@/hooks/use-toast"
import { AlertCircle, CopyIcon, DownloadIcon, ExternalLinkIcon, Loader2, VideoIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function PinterestExtractor() {
  const [pinterestUrl, setPinterestUrl] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [videoInfo, setVideoInfo] = useState<{
    title?: string
    description?: string
    author?: string
    dimensions?: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleExtract = async () => {
    if (!pinterestUrl) {
      setError("Por favor, introduce una URL de Pinterest")
      return
    }

    if (!validatePinterestUrl(pinterestUrl)) {
      setError("La URL no parece ser un pin válido de Pinterest. Ejemplo válido: https://pinterest.com/pin/123456789/")
      return
    }

    setIsLoading(true)
    setError("")
    setVideoUrl("")
    setVideoInfo(null)

    try {
      const videoInfo = await extractPinterestVideo(pinterestUrl)

      // Verificar que la URL sea MP4
      if (!videoInfo.url.endsWith(".mp4")) {
        throw new PinterestError(
          "No se pudo obtener la URL MP4 del video. Por favor, intenta con otro pin.",
          "NO_MP4_FOUND",
        )
      }

      setVideoUrl(videoInfo.url)
      setVideoInfo({
        title: videoInfo.title,
        description: videoInfo.description,
        author: videoInfo.author,
        dimensions: videoInfo.dimensions,
      })
      toast({
        title: "¡Extracción exitosa!",
        description: "Se ha extraído la URL MP4 del video correctamente.",
      })
    } catch (err) {
      console.error("Error al extraer la URL:", err)
      if (err instanceof PinterestError) {
        setError(err.message)
      } else {
        setError("No se pudo extraer la URL del video. Verifica que el pin exista, sea accesible y contenga un video.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "URL copiada",
      description: "La URL del video ha sido copiada al portapapeles.",
    })
  }

  const downloadVideo = async () => {
    if (!videoUrl) return

    try {
      setIsLoading(true)

      // Obtener el blob del video
      const response = await fetch(videoUrl)
      if (!response.ok) {
        throw new Error(`Error al descargar: ${response.status} ${response.statusText}`)
      }

      const blob = await response.blob()

      // Crear un objeto URL para el blob
      const url = URL.createObjectURL(blob)

      // Crear un elemento de enlace para descargar
      const a = document.createElement("a")
      a.href = url

      // Extraer el nombre del archivo de la URL
      const fileName = videoUrl.split("/").pop() || `pinterest_video_${Date.now()}.mp4`

      a.download = fileName
      document.body.appendChild(a)
      a.click()

      // Limpiar
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Descarga iniciada",
        description: `El video se está descargando como ${fileName}.`,
      })
    } catch (err) {
      console.error("Error al descargar:", err)
      toast({
        title: "Error de descarga",
        description: "No se pudo descargar el video. Intenta copiar la URL y descargar manualmente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border border-white/10 bg-black/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <VideoIcon className="h-5 w-5 text-purple-400" />
          Extractor de Videos MP4 de Pinterest
        </CardTitle>
        <CardDescription>
          Extrae URLs directas de videos MP4 desde pins de Pinterest para usar en tus proyectos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-blue-900/20 border-blue-500/50">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertTitle>Formato MP4 garantizado</AlertTitle>
          <AlertDescription className="text-sm">
            Esta herramienta convierte automáticamente las URLs de streaming (m3u8) a formato MP4 directo, ideal para
            descargar e incrustar en sitios web.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="pinterest-url">URL del Pin de Pinterest con Video</Label>
          <div className="flex gap-2">
            <Input
              id="pinterest-url"
              type="url"
              value={pinterestUrl}
              onChange={(e) => setPinterestUrl(e.target.value)}
              placeholder="https://pinterest.com/pin/123456789/"
              className="bg-black/40"
            />
            <Button
              onClick={handleExtract}
              disabled={isLoading}
              className="bg-primary/80 hover:bg-primary transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extrayendo...
                </>
              ) : (
                "Extraer Video MP4"
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Introduce la URL de un pin de Pinterest que contenga un video, no una imagen.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-red-900/20 border-red-500/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {videoUrl && (
          <div className="space-y-4">
            {/* Sección destacada para la URL directa del video */}
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <VideoIcon className="h-4 w-4 text-purple-400" />
                  URL Directa del Video MP4
                </h3>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-200 border-purple-500/30">
                  MP4
                </Badge>
              </div>
              <Textarea value={videoUrl} readOnly className="bg-black/40 font-mono text-xs h-16 resize-none" />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(videoUrl)}
                  className="bg-background/50 hover:bg-background/80 transition-colors"
                >
                  <CopyIcon className="h-3 w-3 mr-1" />
                  Copiar URL
                </Button>
                <Button
                  size="sm"
                  onClick={() => window.open(videoUrl, "_blank")}
                  className="bg-primary/80 hover:bg-primary transition-colors"
                >
                  <ExternalLinkIcon className="h-3 w-3 mr-1" />
                  Abrir Video
                </Button>
              </div>
            </div>

            {/* Previsualización del video */}
            <div className="space-y-2">
              <Label>Previsualización del Video MP4</Label>
              <div className="rounded-md overflow-hidden bg-black/30 aspect-video">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full"
                  poster={videoInfo?.title ? `/api/og?title=${encodeURIComponent(videoInfo.title)}` : undefined}
                />
              </div>
            </div>

            {/* Código para incrustar */}
            <div className="space-y-2">
              <Label>Código para Incrustar</Label>
              <Textarea
                readOnly
                className="bg-black/40 font-mono text-xs h-24 resize-none"
                value={`<video width="100%" controls>
  <source src="${videoUrl}" type="video/mp4">
  Tu navegador no soporta videos HTML5.
</video>`}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  copyToClipboard(`<video width="100%" controls>
  <source src="${videoUrl}" type="video/mp4">
  Tu navegador no soporta videos HTML5.
</video>`)
                }
                className="bg-background/50 hover:bg-background/80 transition-colors"
              >
                <CopyIcon className="h-3 w-3 mr-1" />
                Copiar Código
              </Button>
            </div>

            {/* Información del video */}
            {videoInfo && (
              <div className="bg-black/20 p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">Información del video:</h3>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  {videoInfo.title && (
                    <div>
                      <span className="font-medium">Título:</span> {videoInfo.title}
                    </div>
                  )}
                  {videoInfo.author && (
                    <div>
                      <span className="font-medium">Autor:</span> {videoInfo.author}
                    </div>
                  )}
                  {videoInfo.dimensions && (
                    <div>
                      <span className="font-medium">Dimensiones:</span> {videoInfo.dimensions}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Formato:</span> MP4
                  </div>
                </div>
                {videoInfo.description && (
                  <div className="mt-2">
                    <span className="text-xs font-medium">Descripción:</span>
                    <p className="text-xs mt-1 text-muted-foreground">{videoInfo.description}</p>
                  </div>
                )}
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => window.open(videoUrl, "_blank")}
                className="bg-background/50 hover:bg-background/80 transition-colors"
              >
                <ExternalLinkIcon className="h-4 w-4 mr-2" />
                Abrir en nueva pestaña
              </Button>
              <Button
                onClick={downloadVideo}
                disabled={isLoading}
                className="bg-primary/80 hover:bg-primary transition-colors"
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Descargar Video
              </Button>
            </div>
          </div>
        )}

        <Separator className="bg-white/10" />

        <div className="text-sm text-muted-foreground">
          <h3 className="font-medium text-white mb-2">Cómo usar el extractor de videos MP4:</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Copia la URL del pin de Pinterest que contenga un video</li>
            <li>Pega la URL en el campo de entrada</li>
            <li>Haz clic en "Extraer Video MP4" para obtener la URL directa del video</li>
            <li>Usa los botones para copiar la URL, abrir en una nueva pestaña o descargar el video</li>
          </ol>
          <p className="mt-4">
            <strong>Nota:</strong> Esta herramienta convierte automáticamente las URLs de streaming (m3u8) a formato MP4
            directo.
          </p>
        </div>
      </CardContent>
      <CardFooter className="border-t border-white/10 pt-4">
        <div className="flex items-center gap-2 w-full justify-between">
          <div className="flex items-center gap-1">
            <VideoIcon className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-muted-foreground">Extractor especializado en videos MP4 de Pinterest</span>
          </div>
          <p className="text-xs text-muted-foreground">Extractor v1.0</p>
        </div>
      </CardFooter>
    </Card>
  )
}

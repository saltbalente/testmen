"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyIcon, PlayIcon, DownloadIcon, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function CodePreview() {
  const [html, setHtml] = useState<string>(`<div class="container">
  <h1>Bienvenido a la Vista Previa</h1>
  <p>Edita el HTML, CSS y JavaScript para ver los cambios en tiempo real.</p>
  <button id="demo-button">Haz clic aquí</button>
</div>`)

  const [css, setCss] = useState<string>(`.container {
  font-family: 'Arial', sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  color: #6366f1;
  margin-bottom: 20px;
}

p {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 30px;
}

button {
  background-color: #6366f1;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #4f46e5;
}`)

  const [js, setJs] = useState<string>(`document.getElementById('demo-button').addEventListener('click', function() {
  alert('¡Hola! Has hecho clic en el botón.');
});`)

  const [previewSrc, setPreviewSrc] = useState<string>("")
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true)

  // Función para generar el contenido del iframe
  const generatePreview = () => {
    const combinedContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
      </html>
    `

    // Crear un blob y generar una URL para el iframe
    const blob = new Blob([combinedContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)

    // Liberar la URL anterior para evitar fugas de memoria
    if (previewSrc) {
      URL.revokeObjectURL(previewSrc)
    }

    setPreviewSrc(url)
  }

  // Generar la vista previa cuando cambie el código (si autoRefresh está activado)
  useEffect(() => {
    if (autoRefresh) {
      const timeoutId = setTimeout(() => {
        generatePreview()
      }, 1000) // Retraso de 1 segundo para evitar actualizaciones constantes mientras se escribe

      return () => clearTimeout(timeoutId)
    }
  }, [html, css, js, autoRefresh])

  // Generar la vista previa inicial
  useEffect(() => {
    generatePreview()

    // Limpiar la URL del blob cuando se desmonte el componente
    return () => {
      if (previewSrc) {
        URL.revokeObjectURL(previewSrc)
      }
    }
  }, [])

  // Función para copiar el código combinado
  const copyFullCode = () => {
    const combinedCode = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
${css}
  </style>
</head>
<body>
${html}
  <script>
${js}
  </script>
</body>
</html>`

    navigator.clipboard.writeText(combinedCode)
    toast({
      title: "Código copiado",
      description: "El código completo ha sido copiado al portapapeles.",
    })
  }

  // Función para descargar el código como archivo HTML
  const downloadCode = () => {
    const combinedCode = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
${css}
  </style>
</head>
<body>
${html}
  <script>
${js}
  </script>
</body>
</html>`

    const blob = new Blob([combinedCode], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "preview.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>HTML</CardTitle>
            <CardDescription>Edita el código HTML</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
              placeholder="Escribe tu HTML aquí..."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>CSS</CardTitle>
            <CardDescription>Edita los estilos CSS</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={css}
              onChange={(e) => setCss(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
              placeholder="Escribe tu CSS aquí..."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>JavaScript</CardTitle>
            <CardDescription>Edita el código JavaScript</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={js}
              onChange={(e) => setJs(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
              placeholder="Escribe tu JavaScript aquí..."
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Vista Previa</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={autoRefresh ? "bg-primary/10" : ""}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {autoRefresh ? "Auto" : "Manual"}
                </Button>
                {!autoRefresh && (
                  <Button variant="outline" size="sm" onClick={generatePreview}>
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Actualizar
                  </Button>
                )}
              </div>
            </div>
            <CardDescription>Visualización en tiempo real del código</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="w-full h-[500px] border rounded-md overflow-hidden bg-white">
              {previewSrc && (
                <iframe
                  src={previewSrc}
                  className="w-full h-full"
                  title="Vista previa"
                  sandbox="allow-scripts allow-same-origin"
                />
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={copyFullCode}>
              <CopyIcon className="h-4 w-4 mr-2" />
              Copiar Código
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCode}>
              <DownloadIcon className="h-4 w-4 mr-2" />
              Descargar HTML
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

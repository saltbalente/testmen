"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Check, Copy, RefreshCw, Wand2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function AdGenerator() {
  const [adText, setAdText] = React.useState("")
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [showResults, setShowResults] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("analysis")

  const handleAnalyze = () => {
    if (!adText.trim()) {
      toast({
        title: "Texto vacío",
        description: "Por favor, ingresa un texto para analizar",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    // Simulamos el análisis
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResults(true)
      setActiveTab("results")

      toast({
        title: "Análisis completado",
        description: "Se ha analizado el texto correctamente",
      })
    }, 1500)
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulamos la generación
    setTimeout(() => {
      setIsGenerating(false)
      setAdText(
        "Quitamos brujería profesionalmente. Nuestro servicio garantiza resultados inmediatos. ¿Necesitas ayuda? Contáctanos hoy.",
      )

      toast({
        title: "Texto generado",
        description: "Se ha generado un nuevo texto optimizado",
      })
    }, 2000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(adText)
    toast({
      title: "Copiado al portapapeles",
      description: "El texto ha sido copiado correctamente",
    })
  }

  return (
    <Card className="w-full border border-purple-500/20 bg-black/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-white">
          Generador de Anuncios con Análisis Gramatical
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="ad-text" className="text-lg font-medium">
            Texto del anuncio
          </Label>
          <Textarea
            id="ad-text"
            placeholder="Ingresa el texto de tu anuncio aquí..."
            className="min-h-[120px] bg-black/20 border-purple-500/30 text-white"
            value={adText}
            onChange={(e) => setAdText(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !adText.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analizando...
                </>
              ) : (
                "Analizar gramática"
              )}
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              variant="outline"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generar ejemplo
                </>
              )}
            </Button>
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
              disabled={!adText.trim()}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copiar texto
            </Button>
          </div>
        </div>

        {showResults && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black/30">
              <TabsTrigger value="analysis">Análisis</TabsTrigger>
              <TabsTrigger value="improvements">Mejoras</TabsTrigger>
              <TabsTrigger value="results">Resultados</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-4 mt-4">
              <div className="rounded-lg border border-purple-500/20 bg-black/20 p-4">
                <h3 className="text-xl font-bold mb-4">Análisis Gramatical Inteligente</h3>
                <p className="text-muted-foreground mb-4">Ahora el sistema:</p>

                <ol className="space-y-4 ml-6 list-decimal">
                  <li className="text-white">
                    <span className="font-medium">Detecta verbos en primera persona</span> como "quitarme", "ayudarme",
                    "liberarme", etc.
                  </li>
                  <li className="text-white">
                    <span className="font-medium">Adapta automáticamente la gramática</span> según el contexto del
                    anuncio:
                    <ul className="ml-6 mt-2 space-y-2 list-disc text-muted-foreground">
                      <li>Para preguntas: "¿Necesitas quitar una brujería?"</li>
                      <li>Para imperativos: "Quita una brujería ahora"</li>
                      <li>Para afirmaciones: "Quitamos brujería profesionalmente"</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </TabsContent>

            <TabsContent value="improvements" className="space-y-4 mt-4">
              <div className="rounded-lg border border-purple-500/20 bg-black/20 p-4">
                <h3 className="text-xl font-bold mb-4">Prompts Mejorados con Instrucciones Gramaticales</h3>
                <p className="text-muted-foreground mb-4">Los prompts ahora incluyen instrucciones específicas para:</p>

                <ol className="space-y-4 ml-6 list-decimal">
                  <li className="text-white">
                    <span className="font-medium">Transformar verbos en primera persona</span> a formas gramaticalmente
                    correctas
                  </li>
                  <li className="text-white">
                    <span className="font-medium">Mantener la coherencia semántica</span> de las palabras clave
                  </li>
                  <li className="text-white">
                    <span className="font-medium">Adaptar la estructura</span> según el tipo de anuncio
                  </li>
                </ol>
              </div>

              <div className="rounded-lg border border-purple-500/20 bg-black/20 p-4">
                <h3 className="text-xl font-bold mb-4">Respaldos Gramaticalmente Correctos</h3>
                <p className="text-muted-foreground mb-4">También he mejorado las funciones de respaldo para que:</p>

                <ol className="space-y-4 ml-6 list-decimal">
                  <li className="text-white">
                    <span className="font-medium">Detecten y corrijan</span> problemas gramaticales en las palabras
                    clave
                  </li>
                  <li className="text-white">
                    <span className="font-medium">Generen frases coherentes</span> incluso con palabras clave complejas
                  </li>
                  <li className="text-white">
                    <span className="font-medium">Adapten preposiciones</span> según el contexto ("de", "para", "con",
                    etc.)
                  </li>
                </ol>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-4 mt-4">
              <div className="rounded-lg border border-purple-500/20 bg-black/20 p-4">
                <h3 className="text-xl font-bold mb-4">Resultados del Análisis</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
                      <Check className="h-3 w-3 mr-1" /> Correcto
                    </Badge>
                    <p className="text-white">Estructura gramatical adecuada para anuncios</p>
                  </div>

                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
                      <Check className="h-3 w-3 mr-1" /> Correcto
                    </Badge>
                    <p className="text-white">Uso apropiado de verbos en primera persona del plural</p>
                  </div>

                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
                      <Check className="h-3 w-3 mr-1" /> Correcto
                    </Badge>
                    <p className="text-white">Coherencia semántica en todo el texto</p>
                  </div>

                  <div className="mt-6">
                    <p className="text-muted-foreground mb-2">
                      Estas mejoras garantizan que todos los anuncios tengan sentido gramatical y comercial,
                      independientemente del tipo de palabras clave que se utilicen, lo que aumentará significativamente
                      la efectividad de tus campañas en Google Ads.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

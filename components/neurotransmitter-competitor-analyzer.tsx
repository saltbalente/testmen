"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Zap,
  Smile,
  Activity,
  Heart,
  Users,
  Waves,
  BookOpen,
  Search,
  Loader2,
  Globe,
  BarChart3,
  ArrowRight,
  Eye,
  Lightbulb,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Simulación de análisis de sitio web
const analyzeWebsite = async (
  url: string,
): Promise<{
  neurotransmitters: {
    name: string
    score: number
    elements: string[]
  }[]
  conversionStrategy: string
  recommendations: string[]
}> => {
  // En una implementación real, esto haría una llamada a una API
  // Aquí simulamos un análisis basado en la URL

  // Esperar un tiempo para simular el análisis
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Análisis simulado basado en el dominio
  if (url.includes("amazon") || url.includes("shop") || url.includes("store")) {
    return {
      neurotransmitters: [
        {
          name: "dopamine",
          score: 85,
          elements: [
            "Sistema de recomendaciones personalizado",
            'Indicadores de escasez ("Quedan solo 3 en stock")',
            "Reseñas y valoraciones visibles",
            "Ofertas por tiempo limitado",
          ],
        },
        {
          name: "noradrenaline",
          score: 70,
          elements: [
            "Contrastes de color en CTAs",
            'Etiquetas de urgencia ("Oferta del día")',
            "Contadores de tiempo",
            "Notificaciones de stock bajo",
          ],
        },
        {
          name: "oxytocin",
          score: 45,
          elements: [
            "Reseñas con fotos de usuarios reales",
            "Historias de clientes satisfechos",
            "Servicio al cliente destacado",
            "Comunidad de compradores",
          ],
        },
      ],
      conversionStrategy: "Enfoque en compra impulsiva con elementos de urgencia y validación social",
      recommendations: [
        "Aumentar elementos de oxitocina para crear mayor lealtad a largo plazo",
        "Balancear la noradrenalina con serotonina para reducir la ansiedad de compra",
        "Implementar elementos de endorfinas para crear experiencias más satisfactorias post-compra",
      ],
    }
  } else if (url.includes("wellness") || url.includes("meditation") || url.includes("yoga")) {
    return {
      neurotransmitters: [
        {
          name: "serotonin",
          score: 90,
          elements: [
            "Espacios visuales amplios",
            "Paleta de colores armoniosa",
            "Navegación intuitiva y predecible",
            "Ritmo pausado de contenido",
          ],
        },
        {
          name: "gaba",
          score: 75,
          elements: [
            "Diseño minimalista",
            "Animaciones suaves y lentas",
            "Ausencia de elementos disruptivos",
            "Espacios de descanso visual",
          ],
        },
        {
          name: "oxytocin",
          score: 60,
          elements: [
            "Testimonios de practicantes",
            "Imágenes de comunidad y conexión",
            "Historias de transformación personal",
            "Comunicación empática y cálida",
          ],
        },
      ],
      conversionStrategy: "Enfoque en bienestar y transformación personal con elementos de calma y comunidad",
      recommendations: [
        "Incorporar elementos de dopamina para aumentar la motivación a la acción",
        "Añadir más elementos de endorfinas para destacar la sensación de logro",
        "Mantener el equilibrio entre serotonina y GABA para preservar la esencia de bienestar",
      ],
    }
  } else {
    // Análisis genérico para cualquier otra URL
    return {
      neurotransmitters: [
        {
          name: "dopamine",
          score: 55,
          elements: [
            "Elementos interactivos básicos",
            "Algunas recompensas visuales",
            "Estructura de contenido progresiva",
            "Feedback visual limitado",
          ],
        },
        {
          name: "serotonin",
          score: 40,
          elements: [
            "Diseño relativamente ordenado",
            "Navegación predecible",
            "Espacios visuales adecuados",
            "Consistencia visual básica",
          ],
        },
        {
          name: "noradrenaline",
          score: 35,
          elements: [
            "Contraste limitado en CTAs",
            "Pocos elementos de urgencia",
            "Señales de acción moderadas",
            "Estímulos visuales básicos",
          ],
        },
      ],
      conversionStrategy: "Estrategia neuroquímica no claramente definida, con elementos básicos de estimulación",
      recommendations: [
        "Definir una estrategia neuroquímica clara basada en objetivos de conversión específicos",
        "Aumentar la presencia de neurotransmisores primarios según el objetivo (dopamina para acción, oxitocina para confianza, etc.)",
        "Implementar patrones de estimulación más definidos (gradual, pulsado, etc.)",
      ],
    }
  }
}

// Mapeo de neurotransmisores a iconos y colores
const neurotransmitterIcons = {
  dopamine: {
    icon: <Zap className="h-4 w-4" />,
    color: "text-amber-400",
    bgColor: "bg-amber-400/20",
    borderColor: "border-amber-500/30",
  },
  serotonin: {
    icon: <Smile className="h-4 w-4" />,
    color: "text-blue-400",
    bgColor: "bg-blue-400/20",
    borderColor: "border-blue-500/30",
  },
  noradrenaline: {
    icon: <Activity className="h-4 w-4" />,
    color: "text-red-400",
    bgColor: "bg-red-400/20",
    borderColor: "border-red-500/30",
  },
  endorphins: {
    icon: <Heart className="h-4 w-4" />,
    color: "text-pink-400",
    bgColor: "bg-pink-400/20",
    borderColor: "border-pink-500/30",
  },
  oxytocin: {
    icon: <Users className="h-4 w-4" />,
    color: "text-green-400",
    bgColor: "bg-green-400/20",
    borderColor: "border-green-500/30",
  },
  gaba: {
    icon: <Waves className="h-4 w-4" />,
    color: "text-teal-400",
    bgColor: "bg-teal-400/20",
    borderColor: "border-teal-500/30",
  },
  acetylcholine: {
    icon: <BookOpen className="h-4 w-4" />,
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/20",
    borderColor: "border-indigo-500/30",
  },
}

// Nombres completos de neurotransmisores
const neurotransmitterNames = {
  dopamine: "Dopamina",
  serotonin: "Serotonina",
  noradrenaline: "Noradrenalina",
  endorphins: "Endorfinas",
  oxytocin: "Oxitocina",
  gaba: "GABA",
  acetylcholine: "Acetilcolina",
}

export function NeurotransmitterCompetitorAnalyzer() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("analysis")

  const handleAnalyze = async () => {
    if (!url) {
      toast({
        title: "URL requerida",
        description: "Por favor ingresa una URL para analizar.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    try {
      const result = await analyzeWebsite(url)
      setAnalysisResult(result)
      setActiveTab("analysis")
    } catch (error) {
      toast({
        title: "Error de análisis",
        description: "No se pudo analizar la URL proporcionada.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="border-0 bg-black/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-purple-400" />
          Análisis Neuroquímico de Competencia
        </CardTitle>
        <CardDescription>
          Analiza sitios web para identificar estrategias neuroquímicas y obtener insights competitivos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input
            placeholder="Ingresa URL del sitio web (ej. amazon.com, wellness.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-black/40"
          />
          <Button onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analizar
              </>
            )}
          </Button>
        </div>

        {analysisResult && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="analysis" className="text-sm py-2">
                <BarChart3 className="h-4 w-4 mr-2" />
                Análisis
              </TabsTrigger>
              <TabsTrigger value="elements" className="text-sm py-2">
                <Eye className="h-4 w-4 mr-2" />
                Elementos
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="text-sm py-2">
                <Lightbulb className="h-4 w-4 mr-2" />
                Recomendaciones
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analysis">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Perfil Neuroquímico</h3>
                  <div className="space-y-4">
                    {analysisResult.neurotransmitters.map((neuro) => {
                      const icon = neurotransmitterIcons[neuro.name]
                      return (
                        <div key={neuro.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Badge
                                variant="outline"
                                className={`${icon.bgColor} ${icon.color} ${icon.borderColor} mr-2`}
                              >
                                {icon.icon}
                                <span className="ml-1">{neurotransmitterNames[neuro.name]}</span>
                              </Badge>
                              <span className="text-xs text-muted-foreground">{neuro.score}%</span>
                            </div>
                          </div>
                          <Progress value={neuro.score} className="h-1.5" />
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Estrategia de Conversión</h3>
                  <p className="text-sm text-muted-foreground bg-black/30 p-3 rounded-md">
                    {analysisResult.conversionStrategy}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="elements">
              <div className="space-y-4">
                {analysisResult.neurotransmitters.map((neuro) => {
                  const icon = neurotransmitterIcons[neuro.name]
                  return (
                    <Card key={neuro.name} className="border border-white/10 bg-black/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center">
                          <Badge variant="outline" className={`${icon.bgColor} ${icon.color} ${icon.borderColor} mr-2`}>
                            {icon.icon}
                            <span className="ml-1">{neurotransmitterNames[neuro.name]}</span>
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="text-xs space-y-1">
                          {neuro.elements.map((element, i) => (
                            <li key={i} className="flex items-start">
                              <span className="inline-block w-1 h-1 rounded-full bg-purple-400 mt-1.5 mr-2"></span>
                              {element}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="recommendations">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Recomendaciones de Mejora</h3>
                <div className="bg-black/30 p-4 rounded-md">
                  <ul className="text-sm space-y-3">
                    {analysisResult.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start">
                        <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-purple-400" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

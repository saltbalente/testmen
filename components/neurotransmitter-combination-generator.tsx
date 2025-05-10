"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  Smile,
  Activity,
  Heart,
  Users,
  Waves,
  BookOpen,
  ArrowRight,
  Sparkles,
  Lightbulb,
  Flame,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Objetivos de conversión
const conversionGoals = [
  {
    value: "immediate-action",
    label: "Acción Inmediata",
    description: "Lograr que el usuario realice una acción específica de inmediato (compra, registro, etc.)",
    combinations: [
      { primary: "noradrenaline", secondary: "dopamine", ratio: 60 },
      { primary: "dopamine", secondary: "cortisol", ratio: 70 },
    ],
  },
  {
    value: "long-term-engagement",
    label: "Compromiso a Largo Plazo",
    description: "Crear una relación duradera con el usuario que fomente visitas recurrentes",
    combinations: [
      { primary: "serotonin", secondary: "dopamine", ratio: 60 },
      { primary: "oxytocin", secondary: "dopamine", ratio: 50 },
    ],
  },
  {
    value: "trust-building",
    label: "Construcción de Confianza",
    description: "Generar confianza en la marca o servicio para facilitar decisiones futuras",
    combinations: [
      { primary: "oxytocin", secondary: "serotonin", ratio: 70 },
      { primary: "serotonin", secondary: "gaba", ratio: 60 },
    ],
  },
  {
    value: "emotional-connection",
    label: "Conexión Emocional",
    description: "Crear un vínculo emocional profundo con la marca o servicio",
    combinations: [
      { primary: "oxytocin", secondary: "endorphins", ratio: 50 },
      { primary: "endorphins", secondary: "phenylethylamine", ratio: 60 },
    ],
  },
  {
    value: "information-retention",
    label: "Retención de Información",
    description: "Maximizar la memorabilidad y comprensión de la información presentada",
    combinations: [
      { primary: "acetylcholine", secondary: "dopamine", ratio: 70 },
      { primary: "glutamate", secondary: "noradrenaline", ratio: 60 },
    ],
  },
  {
    value: "creative-exploration",
    label: "Exploración Creativa",
    description: "Fomentar la exploración y el descubrimiento dentro del sitio",
    combinations: [
      { primary: "dopamine", secondary: "anandamide", ratio: 50 },
      { primary: "glutamate", secondary: "dopamine", ratio: 40 },
    ],
  },
  {
    value: "stress-reduction",
    label: "Reducción de Estrés",
    description: "Crear una experiencia que reduzca la ansiedad y promueva la calma",
    combinations: [
      { primary: "gaba", secondary: "serotonin", ratio: 70 },
      { primary: "serotonin", secondary: "endorphins", ratio: 60 },
    ],
  },
]

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
  glutamate: {
    icon: <Zap className="h-4 w-4" />,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/20",
    borderColor: "border-yellow-500/30",
  },
  cortisol: {
    icon: <Activity className="h-4 w-4" />,
    color: "text-orange-400",
    bgColor: "bg-orange-400/20",
    borderColor: "border-orange-500/30",
  },
  anandamide: {
    icon: <Sparkles className="h-4 w-4" />,
    color: "text-amber-300",
    bgColor: "bg-amber-300/20",
    borderColor: "border-amber-400/30",
  },
  phenylethylamine: {
    icon: <Flame className="h-4 w-4" />,
    color: "text-red-300",
    bgColor: "bg-red-300/20",
    borderColor: "border-red-400/30",
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
  glutamate: "Glutamato",
  cortisol: "Cortisol",
  anandamide: "Anandamida",
  phenylethylamine: "Feniletilamina",
}

// Efectos principales de cada combinación
const combinationEffects = {
  "noradrenaline-dopamine": [
    "Atención inmediata y focalizada",
    "Impulso a la acción rápida",
    "Sensación de urgencia y recompensa",
    "Toma de decisiones acelerada",
  ],
  "dopamine-cortisol": [
    "Motivación impulsada por presión temporal",
    "Sensación de oportunidad limitada",
    "Anticipación de recompensa inmediata",
    "Foco en evitar pérdidas potenciales",
  ],
  "serotonin-dopamine": [
    "Confianza con motivación sostenida",
    "Bienestar con deseo de repetición",
    "Satisfacción con anticipación",
    "Lealtad reforzada por recompensas",
  ],
  "oxytocin-dopamine": [
    "Conexión social con motivación",
    "Confianza que impulsa la acción",
    "Pertenencia con deseo de participación",
    "Vínculo emocional con recompensa",
  ],
  "oxytocin-serotonin": [
    "Confianza profunda y duradera",
    "Conexión social con bienestar",
    "Apertura emocional en entorno seguro",
    "Vínculo comunitario armonioso",
  ],
  "serotonin-gaba": [
    "Calma profunda con bienestar",
    "Reducción de ansiedad con satisfacción",
    "Confianza en entorno relajado",
    "Receptividad sin presión",
  ],
  "oxytocin-endorphins": [
    "Conexión emocional eufórica",
    "Vínculo social con sensación de liberación",
    "Confianza con bienestar profundo",
    "Pertenencia con satisfacción intensa",
  ],
  "endorphins-phenylethylamine": [
    "Euforia con excitación emocional",
    "Bienestar profundo con atracción intensa",
    "Liberación con deseo apasionado",
    "Transformación con conexión magnética",
  ],
  "acetylcholine-dopamine": [
    "Aprendizaje con motivación",
    "Memoria reforzada por recompensa",
    "Atención sostenida con satisfacción",
    "Retención con deseo de continuar",
  ],
  "glutamate-noradrenaline": [
    "Conexiones cognitivas con alerta",
    "Insights con foco intenso",
    "Procesamiento rápido con atención aguda",
    "Comprensión profunda con energía mental",
  ],
  "dopamine-anandamide": [
    "Motivación con creatividad",
    "Recompensa en exploración libre",
    "Satisfacción en descubrimiento",
    "Curiosidad con anticipación",
  ],
  "glutamate-dopamine": [
    "Conexiones mentales con recompensa",
    "Insights con satisfacción",
    "Comprensión con motivación",
    "Descubrimiento con anticipación",
  ],
  "gaba-serotonin": [
    "Relajación profunda con bienestar",
    "Calma con satisfacción",
    "Reducción de ansiedad con confianza",
    "Desaceleración con armonía",
  ],
  "serotonin-endorphins": [
    "Bienestar con euforia suave",
    "Satisfacción con liberación",
    "Confianza con alivio profundo",
    "Armonía con transformación",
  ],
}

// Estrategias de diseño para cada combinación
const designStrategies = {
  "noradrenaline-dopamine": [
    "Contrastes cromáticos intensos con elementos de recompensa visual",
    "CTAs prominentes con feedback satisfactorio inmediato",
    "Temporizadores o elementos de escasez con indicadores de progreso",
    "Movimiento dirigido hacia puntos de conversión con micro-recompensas",
  ],
  "dopamine-cortisol": [
    "Elementos de escasez (contadores, stock limitado) con recompensas visuales",
    "Indicadores de tiempo limitado con revelaciones progresivas",
    "Señales de exclusividad con gratificación por acción rápida",
    "Contraste entre pérdida potencial y ganancia inmediata",
  ],
  // Añadir estrategias para otras combinaciones
}

export function NeurotransmitterCombinationGenerator({
  onApplyCombination,
}: {
  onApplyCombination: (combination: { primary: string; secondary: string; ratio: number }) => void
}) {
  const [selectedGoal, setSelectedGoal] = useState<string>("")
  const [selectedCombination, setSelectedCombination] = useState<{
    primary: string
    secondary: string
    ratio: number
  } | null>(null)

  // Obtener el objetivo seleccionado
  const currentGoal = conversionGoals.find((goal) => goal.value === selectedGoal)

  // Aplicar la combinación seleccionada
  const applyCombination = () => {
    if (selectedCombination) {
      onApplyCombination(selectedCombination)
      toast({
        title: "Combinación aplicada",
        description: "La combinación neuroquímica ha sido aplicada al generador.",
      })
    }
  }

  // Generar una clave para buscar efectos de combinación
  const getCombinationKey = (primary: string, secondary: string) => {
    const key1 = `${primary}-${secondary}`
    const key2 = `${secondary}-${primary}`
    return combinationEffects[key1] ? key1 : key2
  }

  return (
    <Card className="border-0 bg-black/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-purple-400" />
          Combinaciones Neuroquímicas Óptimas
        </CardTitle>
        <CardDescription>
          Selecciona un objetivo de conversión para recibir recomendaciones de combinaciones neuroquímicas optimizadas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Objetivo de Conversión</label>
          <Select
            value={selectedGoal}
            onValueChange={(value) => {
              setSelectedGoal(value)
              setSelectedCombination(null)
            }}
          >
            <SelectTrigger className="bg-black/40">
              <SelectValue placeholder="Selecciona un objetivo" />
            </SelectTrigger>
            <SelectContent>
              {conversionGoals.map((goal) => (
                <SelectItem key={goal.value} value={goal.value}>
                  {goal.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currentGoal && <p className="text-xs text-muted-foreground mt-2">{currentGoal.description}</p>}
        </div>

        {currentGoal && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Combinaciones Recomendadas</h3>
            <div className="grid gap-4">
              {currentGoal.combinations.map((combo, index) => {
                const primaryIcon = neurotransmitterIcons[combo.primary]
                const secondaryIcon = neurotransmitterIcons[combo.secondary]
                const combinationKey = getCombinationKey(combo.primary, combo.secondary)
                const effects = combinationEffects[combinationKey] || []

                return (
                  <Card
                    key={index}
                    className={`border border-white/10 bg-black/30 hover:bg-black/40 transition-colors cursor-pointer ${
                      selectedCombination === combo ? "ring-2 ring-purple-500" : ""
                    }`}
                    onClick={() => setSelectedCombination(combo)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`${primaryIcon.bgColor} ${primaryIcon.color} ${primaryIcon.borderColor}`}
                          >
                            {primaryIcon.icon}
                            <span className="ml-1">{neurotransmitterNames[combo.primary]}</span>
                          </Badge>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <Badge
                            variant="outline"
                            className={`${secondaryIcon.bgColor} ${secondaryIcon.color} ${secondaryIcon.borderColor}`}
                          >
                            {secondaryIcon.icon}
                            <span className="ml-1">{neurotransmitterNames[combo.secondary]}</span>
                          </Badge>
                        </div>
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-200 border-purple-500/30">
                          {combo.ratio}:{100 - combo.ratio}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-muted-foreground">Efectos Principales:</h4>
                        <ul className="text-xs space-y-1">
                          {effects.slice(0, 2).map((effect, i) => (
                            <li key={i} className="flex items-start">
                              <span className="inline-block w-1 h-1 rounded-full bg-purple-400 mt-1.5 mr-2"></span>
                              {effect}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={applyCombination} disabled={!selectedCombination} className="w-full">
          Aplicar Combinación al Generador
        </Button>
      </CardFooter>
    </Card>
  )
}

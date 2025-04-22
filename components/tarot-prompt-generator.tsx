"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  readingType: z.string({
    required_error: "Por favor selecciona un tipo de lectura",
  }),
  numCards: z.number().min(1).max(10).default(3),
  spreadType: z.string().default("linear"),
  focusArea: z.string({
    required_error: "Por favor selecciona un área de enfoque",
  }),
  questionType: z.string().default("open"),
  specificQuestion: z.string().optional(),
  interpretationStyle: z.string({
    required_error: "Por favor selecciona un estilo de interpretación",
  }),
  interpretationDepth: z.string().default("balanced"),
  includeCardImages: z.boolean().default(true),
  includeReversedCards: z.boolean().default(false),
  includeMajorArcana: z.boolean().default(true),
  includeMinorArcana: z.boolean().default(true),
  includeCelticSymbolism: z.boolean().default(false),
  includeAstrologyElements: z.boolean().default(false),
  includeNumerology: z.boolean().default(false),
  includeElementalAssociations: z.boolean().default(false),
  includeColorSymbolism: z.boolean().default(false),
  cardDeck: z.string().default("rider-waite"),
  languageStyle: z.string().default("modern"),
  responseFormat: z.string().default("detailed"),
  includeAdvice: z.boolean().default(true),
  includeFutureOutlook: z.boolean().default(true),
  includeWarnings: z.boolean().default(false),
  includeJournalPrompts: z.boolean().default(false),
  includeAffirmations: z.boolean().default(false),
  includeMeditations: z.boolean().default(false),
  includeChakraConnections: z.boolean().default(false),
  includeHerbalAssociations: z.boolean().default(false),
  includeCrystalAssociations: z.boolean().default(false),
  includeCodeGeneration: z.boolean().default(false),
  codeStyle: z.string().default("modern-esoteric"),
  useFrontendFrameworks: z.boolean().default(false),
  selectedFrameworks: z.array(z.string()).default([]),
  useGoogleFonts: z.boolean().default(true),
  fontStyle: z.string().default("modern"),
  codeLevel: z.string().default("advanced"),
  codeTheme: z.string().default("witchcraft"),
  includeHistoricalContext: z.boolean().default(false),
  includeCardInteractions: z.boolean().default(true),
  includePersonalReflection: z.boolean().default(true),
  includeTimeframe: z.boolean().default(false),
  timeframeType: z.string().default("general"),
  customTimeframe: z.string().optional(),
})

const readingTypes = [
  { value: "single-card", label: "Carta Única" },
  { value: "three-card", label: "Tirada de Tres Cartas" },
  { value: "celtic-cross", label: "Cruz Celta" },
  { value: "horseshoe", label: "Herradura" },
  { value: "relationship", label: "Tirada de Relación" },
  { value: "career-path", label: "Camino Profesional" },
  { value: "spiritual-guidance", label: "Guía Espiritual" },
  { value: "monthly-forecast", label: "Pronóstico Mensual" },
  { value: "yearly-forecast", label: "Pronóstico Anual" },
  { value: "shadow-work", label: "Trabajo con la Sombra" },
  { value: "chakra-reading", label: "Lectura de Chakras" },
  { value: "past-life", label: "Vidas Pasadas" },
  { value: "custom", label: "Tirada Personalizada" },
]

const spreadTypes = [
  { value: "linear", label: "Lineal" },
  { value: "cross", label: "Cruz" },
  { value: "circle", label: "Círculo" },
  { value: "pyramid", label: "Pirámide" },
  { value: "diamond", label: "Diamante" },
  { value: "star", label: "Estrella" },
  { value: "custom", label: "Personalizado" },
]

const focusAreas = [
  { value: "general", label: "General" },
  { value: "love", label: "Amor y Relaciones" },
  { value: "career", label: "Carrera y Trabajo" },
  { value: "finance", label: "Finanzas" },
  { value: "health", label: "Salud y Bienestar" },
  { value: "spiritual", label: "Crecimiento Espiritual" },
  { value: "decisions", label: "Toma de Decisiones" },
  { value: "blocks", label: "Bloqueos y Obstáculos" },
  { value: "creativity", label: "Creatividad" },
  { value: "family", label: "Familia" },
  { value: "travel", label: "Viajes" },
  { value: "education", label: "Educación" },
  { value: "life-purpose", label: "Propósito de Vida" },
  { value: "shadow-self", label: "El Yo Sombra" },
  { value: "past-influences", label: "Influencias del Pasado" },
  { value: "future-potential", label: "Potencial Futuro" },
]

const questionTypes = [
  { value: "open", label: "Pregunta Abierta" },
  { value: "yes-no", label: "Pregunta de Sí/No" },
  { value: "specific", label: "Pregunta Específica" },
]

const interpretationStyles = [
  { value: "traditional", label: "Tradicional" },
  { value: "intuitive", label: "Intuitivo" },
  { value: "psychological", label: "Psicológico" },
  { value: "spiritual", label: "Espiritual" },
  { value: "esoteric", label: "Esotérico" },
  { value: "archetypal", label: "Arquetípico" },
  { value: "hermetic", label: "Hermético" },
  { value: "kabbalistic", label: "Cabalístico" },
  { value: "shamanic", label: "Chamánico" },
  { value: "modern", label: "Moderno" },
  { value: "practical", label: "Práctico" },
  { value: "mystical", label: "Místico" },
]

const interpretationDepths = [
  { value: "brief", label: "Breve" },
  { value: "balanced", label: "Equilibrado" },
  { value: "detailed", label: "Detallado" },
  { value: "comprehensive", label: "Exhaustivo" },
]

const cardDecks = [
  { value: "rider-waite", label: "Rider-Waite-Smith" },
  { value: "thoth", label: "Thoth" },
  { value: "marseille", label: "Marsella" },
  { value: "wild-unknown", label: "The Wild Unknown" },
  { value: "deviant-moon", label: "Deviant Moon" },
  { value: "golden-dawn", label: "Golden Dawn" },
  { value: "shadowscapes", label: "Shadowscapes" },
  { value: "druidcraft", label: "Druidcraft" },
  { value: "cosmic", label: "Tarot Cósmico" },
  { value: "hermetic", label: "Tarot Hermético" },
  { value: "visconti", label: "Visconti-Sforza" },
  { value: "universal", label: "Universal Waite" },
]

const languageStyles = [
  { value: "modern", label: "Moderno" },
  { value: "poetic", label: "Poético" },
  { value: "mystical", label: "Místico" },
  { value: "direct", label: "Directo" },
  { value: "academic", label: "Académico" },
  { value: "conversational", label: "Conversacional" },
  { value: "ancient", label: "Antiguo" },
  { value: "metaphorical", label: "Metafórico" },
]

const responseFormats = [
  { value: "brief", label: "Breve" },
  { value: "detailed", label: "Detallado" },
  { value: "narrative", label: "Narrativo" },
  { value: "analytical", label: "Analítico" },
  { value: "structured", label: "Estructurado" },
  { value: "visual", label: "Visual/Descriptivo" },
]

const timeframeTypes = [
  { value: "general", label: "General" },
  { value: "immediate", label: "Inmediato (1-7 días)" },
  { value: "short", label: "Corto plazo (1-3 meses)" },
  { value: "medium", label: "Medio plazo (3-6 meses)" },
  { value: "long", label: "Largo plazo (6-12 meses)" },
  { value: "extended", label: "Extendido (más de 1 año)" },
  { value: "custom", label: "Personalizado" },
]

const codeStyles = [
  { value: "modern-esoteric", label: "Moderno Esotérico" },
  { value: "dark-mystical", label: "Oscuro Místico" },
  { value: "witchcraft", label: "Brujería" },
  { value: "tarot-themed", label: "Temática Tarot" },
  { value: "astrology", label: "Astrología" },
  { value: "alchemical", label: "Alquímico" },
  { value: "occult", label: "Ocultismo" },
  { value: "spiritual", label: "Espiritual" },
  { value: "magical", label: "Mágico" },
  { value: "crystal-healing", label: "Cristales Curativos" },
]

const frameworks = [
  { value: "tailwind", label: "Tailwind CSS" },
  { value: "bootstrap", label: "Bootstrap" },
  { value: "gsap", label: "GSAP (Animaciones)" },
  { value: "three-js", label: "Three.js (3D)" },
  { value: "anime-js", label: "Anime.js" },
  { value: "aos", label: "AOS (Animate On Scroll)" },
  { value: "particles-js", label: "Particles.js" },
  { value: "typed-js", label: "Typed.js" },
  { value: "chart-js", label: "Chart.js" },
  { value: "d3", label: "D3.js (Visualizaciones)" },
]

const fontStyles = [
  { value: "modern", label: "Modernas" },
  { value: "serif", label: "Serif Elegantes" },
  { value: "handwritten", label: "Manuscritas" },
  { value: "gothic", label: "Góticas" },
  { value: "mystical", label: "Místicas" },
  { value: "vintage", label: "Vintage" },
  { value: "decorative", label: "Decorativas" },
  { value: "minimalist", label: "Minimalistas" },
]

const codeLevels = [
  { value: "basic", label: "Básico" },
  { value: "intermediate", label: "Intermedio" },
  { value: "advanced", label: "Avanzado" },
  { value: "expert", label: "Experto" },
  { value: "cutting-edge", label: "Vanguardista" },
]

const codeThemes = [
  { value: "witchcraft", label: "Brujería" },
  { value: "tarot", label: "Tarot" },
  { value: "astrology", label: "Astrología" },
  { value: "alchemy", label: "Alquimia" },
  { value: "occult", label: "Ocultismo" },
  { value: "mystical", label: "Misticismo" },
  { value: "spiritual", label: "Espiritualidad" },
  { value: "crystal", label: "Cristales" },
  { value: "runes", label: "Runas" },
  { value: "divination", label: "Adivinación" },
]

type TarotPromptGeneratorProps = {
  onGenerate: (data: z.infer<typeof formSchema>) => void
  isGenerating: boolean
}

export function TarotPromptGenerator({ onGenerate, isGenerating }: TarotPromptGeneratorProps) {
  const [showSpecificQuestion, setShowSpecificQuestion] = useState(false)
  const [showCustomTimeframe, setShowCustomTimeframe] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numCards: 3,
      spreadType: "linear",
      questionType: "open",
      interpretationDepth: "balanced",
      includeCardImages: true,
      includeReversedCards: false,
      includeMajorArcana: true,
      includeMinorArcana: true,
      includeCelticSymbolism: false,
      includeAstrologyElements: false,
      includeNumerology: false,
      includeElementalAssociations: false,
      includeColorSymbolism: false,
      cardDeck: "rider-waite",
      languageStyle: "modern",
      responseFormat: "detailed",
      includeAdvice: true,
      includeFutureOutlook: true,
      includeWarnings: false,
      includeJournalPrompts: false,
      includeAffirmations: false,
      includeMeditations: false,
      includeChakraConnections: false,
      includeHerbalAssociations: false,
      includeCrystalAssociations: false,
      includeHistoricalContext: false,
      includeCardInteractions: true,
      includePersonalReflection: true,
      includeTimeframe: false,
      timeframeType: "general",
      includeCodeGeneration: false,
      codeStyle: "modern-esoteric",
      useFrontendFrameworks: false,
      selectedFrameworks: [],
      useGoogleFonts: true,
      fontStyle: "modern",
      codeLevel: "advanced",
      codeTheme: "witchcraft",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onGenerate(values)
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="readingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Lectura</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo de lectura" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {readingTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Elige el tipo de lectura de tarot que deseas realizar</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numCards"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Cartas: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>Selecciona el número de cartas para tu lectura</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spreadType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Disposición</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo de disposición" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {spreadTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Elige cómo se dispondrán las cartas en la lectura</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="focusArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área de Enfoque</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un área de enfoque" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {focusAreas.map((area) => (
                        <SelectItem key={area.value} value={area.value}>
                          {area.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Elige el tema principal de tu consulta</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="questionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Pregunta</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      setShowSpecificQuestion(value === "specific")
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo de pregunta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {questionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Elige el formato de tu pregunta</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showSpecificQuestion && (
              <FormField
                control={form.control}
                name="specificQuestion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tu Pregunta Específica</FormLabel>
                    <FormControl>
                      <Input placeholder="Escribe tu pregunta específica aquí..." {...field} />
                    </FormControl>
                    <FormDescription>Escribe la pregunta exacta que deseas consultar</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="interpretationStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estilo de Interpretación</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estilo de interpretación" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {interpretationStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Elige el enfoque para interpretar las cartas</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interpretationDepth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profundidad de Interpretación</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la profundidad de interpretación" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {interpretationDepths.map((depth) => (
                        <SelectItem key={depth.value} value={depth.value}>
                          {depth.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Elige cuánto detalle deseas en la interpretación</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cardDeck"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mazo de Cartas</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un mazo de cartas" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cardDecks.map((deck) => (
                        <SelectItem key={deck.value} value={deck.value}>
                          {deck.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Elige el mazo de tarot para la lectura</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Opciones de Cartas</h3>

              <FormField
                control={form.control}
                name="includeCardImages"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Incluir Imágenes de Cartas</FormLabel>
                      <FormDescription>Incluir descripciones visuales de las cartas</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="includeReversedCards"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Incluir Cartas Invertidas</FormLabel>
                      <FormDescription>Permitir que las cartas aparezcan invertidas</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="includeMajorArcana"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Arcanos Mayores</FormLabel>
                        <FormDescription>Incluir los 22 Arcanos Mayores</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeMinorArcana"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Arcanos Menores</FormLabel>
                        <FormDescription>Incluir los 56 Arcanos Menores</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Elementos Adicionales</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="includeAstrologyElements"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Astrología</FormLabel>
                        <FormDescription>Incluir conexiones astrológicas</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeNumerology"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Numerología</FormLabel>
                        <FormDescription>Incluir significados numerológicos</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeElementalAssociations"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Elementos</FormLabel>
                        <FormDescription>Incluir asociaciones elementales</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeColorSymbolism"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Simbolismo de Color</FormLabel>
                        <FormDescription>Incluir significados de colores</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeCelticSymbolism"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Simbolismo Celta</FormLabel>
                        <FormDescription>Incluir simbolismo de tradición celta</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeHistoricalContext"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Contexto Histórico</FormLabel>
                        <FormDescription>Incluir orígenes e historia de las cartas</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contenido de la Respuesta</h3>

              <FormField
                control={form.control}
                name="languageStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estilo de Lenguaje</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un estilo de lenguaje" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languageStyles.map((style) => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Elige el tono y estilo del lenguaje</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responseFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Formato de Respuesta</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un formato de respuesta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {responseFormats.map((format) => (
                          <SelectItem key={format.value} value={format.value}>
                            {format.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Elige cómo se estructurará la respuesta</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="includeAdvice"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Consejos</FormLabel>
                        <FormDescription>Incluir consejos prácticos</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeFutureOutlook"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Perspectiva Futura</FormLabel>
                        <FormDescription>Incluir proyecciones hacia el futuro</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeWarnings"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Advertencias</FormLabel>
                        <FormDescription>Incluir posibles advertencias o precauciones</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeJournalPrompts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Prompts para Diario</FormLabel>
                        <FormDescription>Incluir preguntas para reflexión personal</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeAffirmations"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Afirmaciones</FormLabel>
                        <FormDescription>Incluir afirmaciones positivas</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeMeditations"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Meditaciones</FormLabel>
                        <FormDescription>Incluir sugerencias de meditación</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeChakraConnections"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Conexiones con Chakras</FormLabel>
                        <FormDescription>Incluir relaciones con los chakras</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeHerbalAssociations"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Hierbas Asociadas</FormLabel>
                        <FormDescription>Incluir hierbas relacionadas</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeCrystalAssociations"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Cristales Asociados</FormLabel>
                        <FormDescription>Incluir cristales relacionados</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeCardInteractions"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Interacciones entre Cartas</FormLabel>
                        <FormDescription>Incluir cómo las cartas se relacionan entre sí</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includePersonalReflection"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Reflexión Personal</FormLabel>
                        <FormDescription>Incluir preguntas para introspección</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="includeTimeframe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Incluir Marco Temporal</FormLabel>
                    <FormDescription>Especificar un período de tiempo para la lectura</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("includeTimeframe") && (
              <FormField
                control={form.control}
                name="timeframeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Marco Temporal</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setShowCustomTimeframe(value === "custom")
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un marco temporal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeframeTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Elige el período de tiempo para la lectura</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {showCustomTimeframe && (
              <FormField
                control={form.control}
                name="customTimeframe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marco Temporal Personalizado</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Próximos 3 días laborables..." {...field} />
                    </FormControl>
                    <FormDescription>Especifica el marco temporal exacto para tu lectura</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Generación de Código</h3>

            <FormField
              control={form.control}
              name="includeCodeGeneration"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Generar Código</FormLabel>
                    <FormDescription>Incluir instrucciones para generar código relacionado con tarot</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("includeCodeGeneration") && (
              <div className="space-y-4 rounded-lg border p-4">
                <FormField
                  control={form.control}
                  name="codeTheme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temática del Código</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una temática" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {codeThemes.map((theme) => (
                            <SelectItem key={theme.value} value={theme.value}>
                              {theme.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Elige la temática principal del código</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="codeStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estilo de Código</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un estilo de código" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {codeStyles.map((style) => (
                            <SelectItem key={style.value} value={style.value}>
                              {style.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Elige el estilo visual del código</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="codeLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nivel de Complejidad</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un nivel de complejidad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {codeLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Elige qué tan avanzado debe ser el código</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="useGoogleFonts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Usar Google Fonts</FormLabel>
                        <FormDescription>Incluir fuentes modernas de Google Fonts</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("useGoogleFonts") && (
                  <FormField
                    control={form.control}
                    name="fontStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estilo de Fuentes</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un estilo de fuentes" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fontStyles.map((style) => (
                              <SelectItem key={style.value} value={style.value}>
                                {style.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Elige el estilo de las fuentes de Google</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="useFrontendFrameworks"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Usar Frameworks Frontend</FormLabel>
                        <FormDescription>Incluir frameworks y bibliotecas modernas</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("useFrontendFrameworks") && (
                  <FormField
                    control={form.control}
                    name="selectedFrameworks"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Frameworks y Bibliotecas</FormLabel>
                          <FormDescription>Selecciona los frameworks y bibliotecas que deseas utilizar</FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {frameworks.map((framework) => (
                            <FormField
                              key={framework.value}
                              control={form.control}
                              name="selectedFrameworks"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={framework.value}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(framework.value)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, framework.value])
                                            : field.onChange(field.value?.filter((value) => value !== framework.value))
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">{framework.label}</FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              "Generar Prompt de Tarot"
            )}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  )
}

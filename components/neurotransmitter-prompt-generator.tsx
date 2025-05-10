"use client"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CopyIcon,
  DownloadIcon,
  Loader2,
  Brain,
  Zap,
  Heart,
  Smile,
  Users,
  Sparkles,
  DollarSign,
  Leaf,
  Flame,
  Moon,
  Wand2,
  Eye,
  Compass,
  BookOpen,
  Target,
  Layers,
  Gauge,
  Microscope,
  Activity,
  Waves,
  Milestone,
  Orbit,
  Info,
  Lightbulb,
  Settings,
  Workflow,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect, useRef } from "react"

// Existing imports
import { NeurotransmitterCombinationGenerator } from "./neurotransmitter-combination-generator"
import { NeurotransmitterCompetitorAnalyzer } from "./neurotransmitter-competitor-analyzer"
import { PromptOptimizer } from "./prompt-optimizer"
import { PromptValidator } from "./prompt-validator"

// Schema para el generador de prompts de neurotransmisores
const neurotransmitterSchema = z.object({
  // Neurotransmisores y objetivos
  targetNeurotransmitter: z.string({
    required_error: "Por favor selecciona un neurotransmisor objetivo",
  }),
  secondaryNeurotransmitter: z.string().optional(),
  neurotransmitterBalance: z.number().min(0).max(100).default(50),
  targetReaction: z.string().optional(),

  // Elementos de diseño y servicio
  designElement: z.string({
    required_error: "Por favor selecciona un elemento de diseño",
  }),
  serviceType: z.string({
    required_error: "Por favor selecciona un tipo de servicio esotérico",
  }),
  audienceProfile: z.string().optional(),

  // Configuración de intensidad y estrategia
  intensityLevel: z.number().min(1).max(10).default(7),
  stimulationPattern: z.string().optional(),
  stimulationTiming: z.string().optional(),

  // Estrategias y optimizaciones
  includeMarketingStrategy: z.boolean().default(true),
  optimizeForMobile: z.boolean().default(true),
  optimizeForConversion: z.boolean().default(false),
  includeNeuroscienceReferences: z.boolean().default(false),

  // Elementos avanzados
  userJourneyStage: z.string().optional(),
  psychologicalTriggers: z.array(z.string()).optional(),
  colorPsychologyStrategy: z.string().optional(),

  // Instrucciones personalizadas
  customInstructions: z.string().optional(),

  // Configuración de salida
  outputFormat: z.string().default("detailed"),
  includeVisualExamples: z.boolean().default(false),
  includeCodeSnippets: z.boolean().default(false),
  includeResearchBasis: z.boolean().default(false),
})

// Neurotransmisores principales
const primaryNeurotransmitters = [
  {
    value: "dopamine",
    label: "Dopamina (Recompensa y Placer)",
    icon: <Zap className="h-4 w-4 mr-2 text-amber-400" />,
    description:
      "Estimula la sensación de recompensa, motivación y placer. Ideal para crear experiencias adictivas y gratificantes.",
    effects: ["Anticipación", "Motivación", "Satisfacción", "Enganche"],
    designElements: ["Progresión visual", "Revelaciones graduales", "Recompensas visuales", "Contraste estratégico"],
    scientificBasis:
      "La dopamina se libera en anticipación de recompensas y durante experiencias placenteras. Estudios de neuroimagen muestran activación del núcleo accumbens durante interacciones con interfaces que ofrecen recompensas visuales o funcionales.",
    conversionImpact: "Alto - Aumenta la probabilidad de completar acciones y regresar al sitio",
    visualCues: [
      "Elementos que se revelan progresivamente",
      "Animaciones de celebración",
      "Indicadores de progreso",
      "Efectos de brillo y destello",
    ],
  },
  {
    value: "serotonin",
    label: "Serotonina (Bienestar y Calma)",
    icon: <Smile className="h-4 w-4 mr-2 text-blue-400" />,
    description:
      "Promueve sensaciones de paz, bienestar y satisfacción. Perfecta para crear ambientes que transmitan confianza.",
    effects: ["Calma", "Confianza", "Bienestar", "Seguridad"],
    designElements: ["Espacios abiertos", "Ritmo pausado", "Armonía visual", "Transiciones suaves"],
    scientificBasis:
      "La serotonina regula el estado de ánimo y la sensación de bienestar. Estudios demuestran que entornos visuales armoniosos y ordenados pueden promover la liberación de serotonina y reducir el estrés.",
    conversionImpact: "Medio-Alto - Aumenta la confianza y el tiempo de permanencia",
    visualCues: [
      "Espacios negativos amplios",
      "Paletas de colores armoniosas",
      "Tipografía clara y legible",
      "Movimientos fluidos y suaves",
    ],
  },
  {
    value: "noradrenaline",
    label: "Noradrenalina (Alerta y Energía)",
    icon: <Activity className="h-4 w-4 mr-2 text-red-400" />,
    description:
      "Aumenta el estado de alerta, la energía y la concentración. Excelente para crear experiencias intensas.",
    effects: ["Alerta", "Atención", "Energía", "Acción rápida"],
    designElements: ["Alto contraste", "Elementos dinámicos", "Llamadas a la acción prominentes", "Ritmo acelerado"],
    scientificBasis:
      "La noradrenalina aumenta la vigilancia y prepara para la acción. Investigaciones muestran que estímulos visuales de alto contraste y movimiento rápido aumentan los niveles de noradrenalina.",
    conversionImpact: "Alto - Impulsa acciones inmediatas y decisiones rápidas",
    visualCues: [
      "Contrastes cromáticos intensos",
      "Elementos en movimiento",
      "CTAs grandes y destacados",
      "Temporizadores y elementos de urgencia",
    ],
  },
  {
    value: "endorphins",
    label: "Endorfinas (Placer y Alivio)",
    icon: <Heart className="h-4 w-4 mr-2 text-pink-400" />,
    description: "Genera sensaciones de euforia, alivio y bienestar profundo. Ideal para experiencias transformadoras.",
    effects: ["Euforia", "Alivio", "Bienestar", "Transformación"],
    designElements: [
      "Experiencias inmersivas",
      "Narrativas de superación",
      "Estímulos sensoriales ricos",
      "Recompensas emocionales",
    ],
    scientificBasis:
      "Las endorfinas son neurotransmisores opioides endógenos que producen sensaciones de placer y reducen el dolor. Se liberan durante experiencias gratificantes y momentos de 'superación'.",
    conversionImpact: "Medio - Crea conexiones emocionales profundas y lealtad",
    visualCues: [
      "Imágenes inspiradoras",
      "Historias de transformación",
      "Experiencias interactivas satisfactorias",
      "Elementos que evoquen logros",
    ],
  },
  {
    value: "oxytocin",
    label: "Oxitocina (Conexión y Confianza)",
    icon: <Users className="h-4 w-4 mr-2 text-green-400" />,
    description: "Fomenta la conexión social, la confianza y el vínculo emocional. Perfecta para crear comunidades.",
    effects: ["Confianza", "Conexión", "Empatía", "Pertenencia"],
    designElements: ["Elementos sociales", "Testimonios auténticos", "Narrativas personales", "Símbolos de comunidad"],
    scientificBasis:
      "La oxitocina facilita el vínculo social y la confianza interpersonal. Estudios demuestran que las señales sociales positivas y las historias personales aumentan los niveles de oxitocina.",
    conversionImpact: "Medio-Alto - Fortalece la lealtad de marca y recomendaciones",
    visualCues: [
      "Rostros humanos auténticos",
      "Historias personales",
      "Elementos de comunidad",
      "Símbolos de conexión y unidad",
    ],
  },
  {
    value: "gaba",
    label: "GABA (Relajación y Calma)",
    icon: <Waves className="h-4 w-4 mr-2 text-teal-400" />,
    description:
      "Induce estados de relajación profunda y reduce la ansiedad. Ideal para servicios de bienestar y meditación.",
    effects: ["Relajación", "Reducción de ansiedad", "Calma mental", "Desaceleración"],
    designElements: ["Espacios minimalistas", "Ritmo lento", "Simplicidad visual", "Ausencia de elementos estresantes"],
    scientificBasis:
      "El GABA es el principal neurotransmisor inhibitorio del cerebro, reduciendo la actividad neuronal y promoviendo la relajación. Entornos visuales simples y ordenados pueden promover estados mentales similares a los inducidos por el GABA.",
    conversionImpact: "Medio - Ideal para servicios de bienestar y reducción de estrés",
    visualCues: ["Diseño minimalista", "Espacios en blanco abundantes", "Movimientos lentos y fluidos"],
  },
  {
    value: "acetylcholine",
    label: "Acetilcolina (Aprendizaje y Memoria)",
    icon: <BookOpen className="h-4 w-4 mr-2 text-indigo-400" />,
    description:
      "Facilita el aprendizaje, la memoria y la atención sostenida. Perfecta para contenido educativo y transformador.",
    effects: ["Aprendizaje", "Memoria", "Atención", "Comprensión"],
    designElements: ["Organización clara", "Jerarquía visual", "Patrones reconocibles", "Elementos mnemotécnicos"],
    scientificBasis:
      "La acetilcolina es crucial para la formación de memorias y el aprendizaje. Investigaciones muestran que la información presentada con estructura clara y elementos visuales distintivos mejora la retención y comprensión.",
    conversionImpact: "Medio - Aumenta la absorción de información y la credibilidad",
    visualCues: [
      "Infografías claras",
      "Jerarquía visual definida",
      "Elementos visuales memorables",
      "Patrones y repeticiones estratégicas",
    ],
  },
  {
    value: "glutamate",
    label: "Glutamato (Excitación y Cognición)",
    icon: <Zap className="h-4 w-4 mr-2 text-yellow-400" />,
    description:
      "Estimula la actividad cerebral, la cognición y el procesamiento de información. Ideal para experiencias intelectualmente estimulantes.",
    effects: ["Estimulación mental", "Procesamiento rápido", "Conexiones cognitivas", "Insights"],
    designElements: [
      "Complejidad organizada",
      "Patrones intrigantes",
      "Estímulos intelectuales",
      "Desafíos cognitivos",
    ],
    scientificBasis:
      "El glutamato es el principal neurotransmisor excitatorio del cerebro, facilitando la transmisión de señales entre neuronas. Estímulos visuales complejos pero organizados pueden promover la actividad glutamatérgica y la formación de conexiones mentales.",
    conversionImpact: "Medio-Alto - Efectivo para audiencias que valoran el contenido intelectual",
    visualCues: [
      "Patrones visuales complejos",
      "Información densa pero organizada",
      "Elementos que invitan a la exploración",
      "Visualizaciones de datos",
    ],
  },
]

// Neurotransmisores secundarios y moduladores
const secondaryNeurotransmitters = [
  {
    value: "melatonin",
    label: "Melatonina (Ciclos y Ritmos)",
    icon: <Moon className="h-4 w-4 mr-2 text-purple-300" />,
    description:
      "Regula los ciclos circadianos y la sensación de temporalidad. Útil para crear experiencias cíclicas o nocturnas.",
    effects: ["Ritmo", "Ciclos", "Transición", "Calma nocturna"],
    designElements: ["Modos oscuros", "Transiciones día-noche", "Elementos cíclicos", "Ritmos visuales"],
  },
  {
    value: "anandamide",
    label: "Anandamida (Felicidad y Creatividad)",
    icon: <Sparkles className="h-4 w-4 mr-2 text-amber-300" />,
    description:
      "Conocida como la 'molécula de la felicidad', promueve estados de bienestar, creatividad y pensamiento divergente.",
    effects: ["Felicidad", "Creatividad", "Pensamiento divergente", "Exploración"],
    designElements: ["Elementos sorpresa", "Estímulos creativos", "Interacciones no lineales", "Descubrimientos"],
  },
  {
    value: "phenylethylamine",
    label: "Feniletilamina (Atracción y Excitación)",
    icon: <Flame className="h-4 w-4 mr-2 text-red-300" />,
    description:
      "Asociada con la atracción romántica y estados de excitación emocional intensa. Ideal para servicios relacionados con el amor.",
    effects: ["Atracción", "Excitación", "Intensidad emocional", "Deseo"],
    designElements: [
      "Elementos románticos",
      "Estímulos sensoriales intensos",
      "Narrativas de atracción",
      "Simbolismo de unión",
    ],
  },
  {
    value: "cortisol",
    label: "Cortisol (Estrés Controlado)",
    icon: <Activity className="h-4 w-4 mr-2 text-orange-400" />,
    description:
      "Hormona del estrés que, en niveles moderados, puede aumentar la atención y crear urgencia controlada.",
    effects: ["Urgencia", "Atención focalizada", "Preparación", "Acción inmediata"],
    designElements: ["Temporizadores", "Elementos de escasez", "Señales de urgencia", "Contrastes de alerta"],
  },
  {
    value: "vasopressin",
    label: "Vasopresina (Lealtad y Territorialidad)",
    icon: <Target className="h-4 w-4 mr-2 text-blue-300" />,
    description:
      "Promueve sentimientos de lealtad, protección y territorialidad. Útil para crear sentido de pertenencia exclusiva.",
    effects: ["Lealtad", "Protección", "Exclusividad", "Pertenencia"],
    designElements: [
      "Membresías exclusivas",
      "Elementos de estatus",
      "Símbolos de protección",
      "Marcadores territoriales",
    ],
  },
]

// Patrones de estimulación
const stimulationPatterns = [
  {
    value: "gradual",
    label: "Gradual (Incremento Progresivo)",
    description:
      "Aumenta gradualmente la intensidad de la estimulación para crear anticipación y evitar la habituación.",
  },
  {
    value: "pulsed",
    label: "Pulsado (Picos Intermitentes)",
    description: "Alterna entre momentos de alta y baja estimulación para mantener la atención sin saturación.",
  },
  {
    value: "sustained",
    label: "Sostenido (Nivel Constante)",
    description: "Mantiene un nivel constante de estimulación para crear una experiencia inmersiva y consistente.",
  },
  {
    value: "wave",
    label: "Ondulatorio (Ciclos Rítmicos)",
    description: "Crea ciclos de estimulación que siguen patrones ondulatorios para generar ritmo y previsibilidad.",
  },
  {
    value: "crescendo",
    label: "Crescendo (Clímax Final)",
    description: "Construye gradualmente hacia un punto culminante de máxima estimulación al final de la experiencia.",
  },
  {
    value: "contrast",
    label: "Contraste (Alternancias Marcadas)",
    description: "Utiliza contrastes marcados entre diferentes estados para crear impacto y memorabilidad.",
  },
  {
    value: "micro-dosing",
    label: "Micro-dosificación (Estímulos Sutiles)",
    description: "Emplea estímulos pequeños pero frecuentes para mantener la activación sin saturación consciente.",
  },
]

// Timings de estimulación
const stimulationTimings = [
  {
    value: "immediate",
    label: "Inmediato (Primeros 3 segundos)",
    description: "Activa la respuesta neuroquímica inmediatamente para captar la atención inicial.",
  },
  {
    value: "early-engagement",
    label: "Enganche Temprano (Primeros 30 segundos)",
    description: "Centra la estimulación en la fase inicial de exploración para establecer el tono emocional.",
  },
  {
    value: "mid-journey",
    label: "Mitad del Recorrido (Fase de consideración)",
    description: "Intensifica la estimulación durante la fase de evaluación y consideración.",
  },
  {
    value: "pre-conversion",
    label: "Pre-conversión (Momento de decisión)",
    description: "Concentra la estimulación justo antes de los puntos de conversión para impulsar la acción.",
  },
  {
    value: "post-action",
    label: "Post-acción (Refuerzo)",
    description: "Estimula después de cada acción completada para reforzar comportamientos y crear hábitos.",
  },
  {
    value: "distributed",
    label: "Distribuido (A lo largo de toda la experiencia)",
    description: "Distribuye la estimulación de manera uniforme para crear una experiencia consistente.",
  },
  {
    value: "rhythmic",
    label: "Rítmico (Patrones temporales predecibles)",
    description: "Establece un ritmo predecible de estimulación que crea expectativa y satisfacción.",
  },
]

// Perfiles de audiencia
const audienceProfiles = [
  {
    value: "spiritual-seeker",
    label: "Buscador Espiritual",
    description: "Personas en búsqueda activa de crecimiento espiritual y significado profundo.",
  },
  {
    value: "practical-mystic",
    label: "Místico Práctico",
    description: "Individuos que integran prácticas espirituales con objetivos prácticos y tangibles.",
  },
  {
    value: "curious-explorer",
    label: "Explorador Curioso",
    description: "Personas abiertas a nuevas experiencias esotéricas sin compromiso profundo previo.",
  },
  {
    value: "healing-focused",
    label: "Enfocado en Sanación",
    description: "Individuos buscando soluciones a problemas emocionales o físicos específicos.",
  },
  {
    value: "manifestation-oriented",
    label: "Orientado a la Manifestación",
    description: "Personas centradas en la creación de resultados materiales mediante prácticas esotéricas.",
  },
  {
    value: "wisdom-collector",
    label: "Coleccionista de Sabiduría",
    description: "Individuos que valoran el conocimiento esotérico y la comprensión intelectual.",
  },
  {
    value: "community-seeker",
    label: "Buscador de Comunidad",
    description: "Personas que buscan conexión y pertenencia dentro de comunidades espirituales.",
  },
  {
    value: "transformation-driven",
    label: "Impulsado por la Transformación",
    description: "Individuos comprometidos con el cambio personal profundo y la evolución consciente.",
  },
  {
    value: "ritual-practitioner",
    label: "Practicante de Rituales",
    description: "Personas que valoran y practican regularmente rituales y ceremonias esotéricas.",
  },
]

// Etapas del recorrido del usuario
const userJourneyStages = [
  {
    value: "awareness",
    label: "Conciencia (Descubrimiento inicial)",
    description: "Primera toma de contacto con el servicio o concepto esotérico.",
  },
  {
    value: "interest",
    label: "Interés (Exploración activa)",
    description: "Exploración activa de los beneficios y posibilidades del servicio.",
  },
  {
    value: "consideration",
    label: "Consideración (Evaluación profunda)",
    description: "Evaluación seria de la relevancia y valor del servicio para sus necesidades.",
  },
  {
    value: "intent",
    label: "Intención (Preparación para actuar)",
    description: "Formación de la intención de participar o adquirir el servicio.",
  },
  {
    value: "decision",
    label: "Decisión (Momento de conversión)",
    description: "Toma de decisión final para comprometerse con el servicio.",
  },
  {
    value: "action",
    label: "Acción (Participación inicial)",
    description: "Primera participación o compra del servicio esotérico.",
  },
  {
    value: "retention",
    label: "Retención (Compromiso continuo)",
    description: "Participación continuada y desarrollo de lealtad al servicio.",
  },
  {
    value: "advocacy",
    label: "Defensa (Recomendación a otros)",
    description: "Promoción activa del servicio a otros buscadores espirituales.",
  },
  {
    value: "transformation",
    label: "Transformación (Cambio profundo)",
    description: "Experimentación de cambios significativos como resultado del servicio.",
  },
]

// Disparadores psicológicos
const psychologicalTriggers = [
  {
    value: "scarcity",
    label: "Escasez",
    description: "Percepción de limitación o rareza que aumenta el valor percibido.",
  },
  {
    value: "social-proof",
    label: "Prueba Social",
    description: "Demostración de aceptación o validación por parte de otros.",
  },
  { value: "authority", label: "Autoridad", description: "Percepción de experiencia, conocimiento o poder legítimo." },
  { value: "reciprocity", label: "Reciprocidad", description: "Impulso a devolver un favor o regalo recibido." },
  {
    value: "commitment",
    label: "Compromiso y Consistencia",
    description: "Tendencia a mantener coherencia con acciones o declaraciones previas.",
  },
  {
    value: "liking",
    label: "Simpatía",
    description: "Preferencia por personas o entidades que nos resultan agradables.",
  },
  { value: "unity", label: "Unidad", description: "Sentido de identidad compartida y pertenencia a un grupo." },
  {
    value: "curiosity-gap",
    label: "Brecha de Curiosidad",
    description: "Deseo de llenar vacíos en el conocimiento o la experiencia.",
  },
  {
    value: "anticipation",
    label: "Anticipación",
    description: "Placer derivado de la espera de una experiencia positiva.",
  },
  {
    value: "loss-aversion",
    label: "Aversión a la Pérdida",
    description: "Tendencia a evitar pérdidas por encima de adquirir ganancias equivalentes.",
  },
  {
    value: "instant-gratification",
    label: "Gratificación Instantánea",
    description: "Preferencia por recompensas inmediatas sobre beneficios futuros.",
  },
  {
    value: "fear-of-missing-out",
    label: "Miedo a Perderse Algo",
    description: "Ansiedad por quedar excluido de experiencias gratificantes.",
  },
]

// Estrategias de psicología del color
const colorPsychologyStrategies = [
  {
    value: "chakra-alignment",
    label: "Alineación de Chakras",
    description: "Utiliza los colores asociados con los siete chakras para crear resonancia energética.",
  },
  {
    value: "elemental-harmony",
    label: "Armonía Elemental",
    description:
      "Emplea colores asociados con los elementos (tierra, agua, fuego, aire, éter) para evocar sus cualidades.",
  },
  {
    value: "lunar-solar-balance",
    label: "Equilibrio Lunar-Solar",
    description: "Balancea energías receptivas (lunares) y proyectivas (solares) mediante colores fríos y cálidos.",
  },
  {
    value: "alchemical-transformation",
    label: "Transformación Alquímica",
    description: "Utiliza la secuencia de colores alquímicos (negro, blanco, rojo) para simbolizar transformación.",
  },
  {
    value: "aura-enhancement",
    label: "Potenciación Áurica",
    description: "Emplea colores que estimulan y fortalecen campos energéticos específicos.",
  },
  {
    value: "sacred-geometry-color",
    label: "Color y Geometría Sagrada",
    description: "Combina formas geométricas sagradas con sus colores resonantes para amplificar efectos.",
  },
  {
    value: "planetary-correspondence",
    label: "Correspondencia Planetaria",
    description: "Utiliza colores asociados con planetas específicos para invocar sus influencias.",
  },
  {
    value: "emotional-alchemy",
    label: "Alquimia Emocional",
    description: "Transforma estados emocionales mediante secuencias cromáticas estratégicas.",
  },
  {
    value: "vibrational-raising",
    label: "Elevación Vibracional",
    description: "Emplea gradientes ascendentes de color para simbolizar y estimular elevación espiritual.",
  },
]

// Tipos de servicios esotéricos
const serviceTypes = [
  { value: "love", label: "Amor y Relaciones", icon: <Heart className="h-4 w-4 mr-2 text-pink-500" /> },
  { value: "money", label: "Dinero y Abundancia", icon: <DollarSign className="h-4 w-4 mr-2 text-green-500" /> },
  { value: "health", label: "Salud y Bienestar", icon: <Leaf className="h-4 w-4 mr-2 text-emerald-500" /> },
  { value: "spiritual", label: "Crecimiento Espiritual", icon: <Sparkles className="h-4 w-4 mr-2 text-purple-500" /> },
  { value: "fortune", label: "Fortuna y Destino", icon: <Compass className="h-4 w-4 mr-2 text-amber-500" /> },
  { value: "protection", label: "Protección y Limpieza", icon: <Flame className="h-4 w-4 mr-2 text-red-500" /> },
  { value: "wisdom", label: "Sabiduría Ancestral", icon: <Moon className="h-4 w-4 mr-2 text-indigo-500" /> },
  { value: "transformation", label: "Transformación Personal", icon: <Wand2 className="h-4 w-4 mr-2 text-cyan-500" /> },
  { value: "divination", label: "Adivinación y Oráculos", icon: <Eye className="h-4 w-4 mr-2 text-blue-500" /> },
  { value: "astral", label: "Viajes Astrales", icon: <Orbit className="h-4 w-4 mr-2 text-violet-500" /> },
  { value: "energy", label: "Trabajo Energético", icon: <Zap className="h-4 w-4 mr-2 text-yellow-500" /> },
  {
    value: "manifestation",
    label: "Manifestación Consciente",
    icon: <Sparkles className="h-4 w-4 mr-2 text-amber-400" />,
  },
  { value: "past-lives", label: "Vidas Pasadas", icon: <Milestone className="h-4 w-4 mr-2 text-rose-500" /> },
  { value: "shamanic", label: "Chamanismo", icon: <Leaf className="h-4 w-4 mr-2 text-green-600" /> },
]

// Elementos de diseño
const designElements = [
  {
    value: "color-palette",
    label: "Paleta de Colores (Estimulación Visual)",
    description: "Combinaciones cromáticas estratégicas para evocar respuestas emocionales específicas.",
  },
  {
    value: "typography",
    label: "Tipografía (Impacto Textual)",
    description: "Selección y uso de fuentes para comunicar personalidad y facilitar la respuesta deseada.",
  },
  {
    value: "imagery",
    label: "Imágenes (Narrativa Visual)",
    description: "Elementos visuales que cuentan historias y evocan respuestas emocionales profundas.",
  },
  {
    value: "layout",
    label: "Diseño y Layout (Experiencia Espacial)",
    description: "Organización espacial de elementos para guiar la atención y crear ritmo visual.",
  },
  {
    value: "interactive-elements",
    label: "Elementos Interactivos (Engagement)",
    description: "Componentes que invitan a la participación activa y crean experiencias memorables.",
  },
  {
    value: "content-strategy",
    label: "Estrategia de Contenido (Mensajes)",
    description: "Planificación y estructura de mensajes para maximizar su impacto psicológico.",
  },
  {
    value: "user-experience",
    label: "Experiencia de Usuario (Recorrido General)",
    description: "Diseño holístico del viaje del usuario para crear una narrativa coherente.",
  },
  {
    value: "micro-interactions",
    label: "Micro-interacciones (Momentos de Deleite)",
    description: "Pequeñas interacciones que crean momentos de satisfacción y refuerzo positivo.",
  },
  {
    value: "animation",
    label: "Animación (Movimiento y Transición)",
    description: "Elementos en movimiento que captan la atención y comunican cambio o transformación.",
  },
  {
    value: "sound-design",
    label: "Diseño Sonoro (Estímulo Auditivo)",
    description: "Elementos auditivos que complementan la experiencia visual y profundizan la inmersión.",
  },
  {
    value: "haptic-feedback",
    label: "Feedback Háptico (Sensación Táctil)",
    description: "Respuestas táctiles que crean conexión física con la experiencia digital.",
  },
  {
    value: "spatial-design",
    label: "Diseño Espacial (Percepción 3D)",
    description: "Creación de profundidad y espacio para evocar presencia y materialidad.",
  },
  {
    value: "rhythm-pacing",
    label: "Ritmo y Cadencia (Temporalidad)",
    description: "Control del tiempo y ritmo de la experiencia para mantener el engagement óptimo.",
  },
  {
    value: "symbolic-elements",
    label: "Elementos Simbólicos (Significado Profundo)",
    description: "Símbolos y arquetipos que conectan con el inconsciente colectivo.",
  },
]

// Formatos de salida
const outputFormats = [
  {
    value: "concise",
    label: "Conciso (Instrucciones Esenciales)",
    description: "Versión condensada con solo los elementos clave para implementación rápida.",
  },
  {
    value: "detailed",
    label: "Detallado (Guía Completa)",
    description: "Explicación exhaustiva con fundamentos y recomendaciones detalladas.",
  },
  {
    value: "technical",
    label: "Técnico (Especificaciones Precisas)",
    description: "Enfoque en especificaciones técnicas exactas para implementación directa.",
  },
  {
    value: "creative",
    label: "Creativo (Inspiración Conceptual)",
    description: "Énfasis en conceptos creativos y posibilidades de exploración.",
  },
  {
    value: "scientific",
    label: "Científico (Base Neurológica)",
    description: "Centrado en la fundamentación científica y mecanismos neurológicos.",
  },
  {
    value: "strategic",
    label: "Estratégico (Enfoque en Objetivos)",
    description: "Orientado a resultados con énfasis en métricas y conversión.",
  },
]

// Presets de prompts para diferentes combinaciones
const presetPrompts = {
  "love-dopamine": {
    title: "Atracción Amorosa Irresistible",
    description: "Diseño que activa la dopamina para crear deseo y anticipación en servicios de amor",
    prompt: `Crea una paleta de colores para un sitio web de servicios esotéricos de amor y relaciones diseñada para estimular la dopamina y crear una experiencia irresistible de anticipación y deseo:

COLORES PRIMARIOS:
- Rosa intenso (#FF4D8F) - Evoca pasión romántica y deseo inmediato
- Púrpura profundo (#8A2BE2) - Crea misterio y poder esotérico
- Rojo vibrante (#E63946) - Desencadena excitación y urgencia emocional
- Dorado cálido (#FFD700) - Simboliza valor, exclusividad y manifestación

COLORES SECUNDARIOS:
- Lavanda suave (#E6E6FA) - Proporciona descanso visual mientras mantiene la energía romántica
- Coral brillante (#FF7F50) - Crea puntos focales energéticos y llamadas a la acción
- Azul medianoche (#191970) - Añade profundidad cósmica y misterio esotérico
- Blanco perlado (#F5F5F5) - Crea espacio y pureza de intención

ESTRATEGIA DE IMPLEMENTACIÓN:
1. Usar el rosa intenso para botones de llamada a la acción y elementos interactivos principales
2. Implementar el púrpura profundo para fondos de secciones esotéricas y rituales de amor
3. Utilizar el rojo vibrante estratégicamente para destacar testimonios y resultados de amor
4. Aplicar el dorado cálido para símbolos místicos, bordes y elementos de manifestación amorosa

PATRONES DE COLOR PARA ACTIVAR DOPAMINA:
1. Revelaciones progresivas: Comenzar con tonos más suaves que evolucionan hacia colores más intensos
2. Recompensas visuales: Destellos dorados que aparecen tras completar pasos o formularios
3. Anticipación cromática: Gradientes que fluyen hacia el siguiente elemento interactivo
4. Contraste estratégico: Yuxtaposición de colores complementarios para crear tensión visual y resolución`,
  },
  "money-dopamine": {
    title: "Manifestación de Riqueza Adictiva",
    description: "Diseño que activa la dopamina para crear deseo y motivación hacia la abundancia",
    prompt: `Diseña elementos interactivos para un sitio web de servicios esotéricos de dinero y abundancia que activen la dopamina para crear una experiencia adictiva de manifestación, motivación y recompensa:

CARACTERÍSTICAS INTERACTIVAS PRINCIPALES:

1. Visualizador de Manifestación de Riqueza
   - Herramienta interactiva donde los usuarios pueden crear y personalizar su "tablero de visión" digital
   - Elementos arrastrables que representan diferentes aspectos de la abundancia (casa, coche, viajes, etc.)
   - Efectos visuales de "activación" que ocurren cuando se completa una visualización
   - Sistema de guardado que permite revisitar y actualizar visualizaciones con el tiempo

2. Calculadora de Prosperidad Progresiva
   - Herramienta que permite a los usuarios establecer metas financieras y visualizar su progreso
   - Animaciones satisfactorias cuando se ingresan datos o se alcanzan hitos
   - Gráficos dinámicos que muestran crecimiento exponencial con efectos de partículas doradas
   - Revelaciones progresivas de "secretos de abundancia" a medida que se completan secciones

3. Ritual Virtual de Abundancia
   - Experiencia interactiva guiada con pasos secuenciales que crean anticipación
   - Elementos que responden al toque/clic con efectos de energía, luz y sonido
   - Símbolos esotéricos que se activan y brillan cuando se interactúa con ellos
   - Culminación ritual con efectos visuales espectaculares de manifestación`,
  },
  "spiritual-serotonin": {
    title: "Crecimiento Espiritual Sereno",
    description: "Diseño que estimula la serotonina para crear paz y bienestar en la evolución espiritual",
    prompt: `Diseña una experiencia de usuario para un sitio web de servicios esotéricos de crecimiento espiritual que estimule la serotonina para crear una sensación de paz, bienestar y evolución serena:

PRINCIPIOS DE DISEÑO:

1. Ritmo Consciente
   - Progresión gradual y predecible a través del contenido que evita sobrecarga sensorial
   - Transiciones suaves entre secciones que permiten asimilación y reflexión
   - Espaciado generoso que crea sensación de amplitud y respiración
   - Estructura clara que proporciona orientación sin presión

2. Armonía Visual
   - Paleta de colores basada en azules suaves, verdes calmantes y lavandas etéreas
   - Contraste moderado que facilita la lectura sin crear tensión visual
   - Elementos visuales que se complementan en lugar de competir por la atención
   - Consistencia en tratamiento visual que crea familiaridad y comodidad

3. Interacción Contemplativa
   - Elementos interactivos que responden de manera suave y predecible
   - Micro-animaciones sutiles que refuerzan acciones sin distraer
   - Feedback positivo que confirma acciones sin urgencia
   - Opciones para pausar, guardar progreso y retomar cuando el usuario esté listo`,
  },
  "divination-oxytocin": {
    title: "Conexión Oracular Profunda",
    description: "Diseño que estimula la oxitocina para crear confianza y conexión en servicios de adivinación",
    prompt: `Diseña una estrategia de contenido para un sitio web de servicios esotéricos de adivinación y oráculos que estimule la oxitocina para crear una experiencia de confianza, conexión y revelación personal profunda:

ESTRATEGIA DE NARRATIVA:

1. Historias de Transformación Personal
   - Testimonios auténticos con rostros reales y nombres completos
   - Narrativas de "antes y después" que muestran el impacto de las lecturas oraculares
   - Historias presentadas en formato conversacional e íntimo
   - Énfasis en la conexión humana y el entendimiento mutuo logrado

2. Presencia del Practicante
   - Biografía detallada y personal del lector oracular o vidente
   - Fotografías auténticas que muestran expresiones faciales cálidas y mirada directa
   - Videos personales que demuestran empatía y comprensión
   - Revelación estratégica de vulnerabilidades y desafíos superados

3. Comunidad de Buscadores
   - Elementos que muestran a otros consultantes (con permiso)
   - Espacios para compartir experiencias y aprendizajes
   - Rituales colectivos que pueden realizarse simultáneamente
   - Simbolismo visual de conexión, unidad y apoyo mutuo

ELEMENTOS VISUALES PARA ACTIVAR OXITOCINA:

1. Imágenes de contacto visual directo
2. Símbolos universales de conexión y unidad
3. Representaciones de manos entrelazadas o en posición de dar/recibir
4. Colores cálidos en tonos suaves que evocan intimidad y seguridad
5. Formas circulares y envolventes que simbolizan contención y protección`,
  },
  "protection-noradrenaline": {
    title: "Escudo Energético Activado",
    description: "Diseño que estimula la noradrenalina para crear alerta y acción protectora inmediata",
    prompt: `Diseña elementos interactivos para un sitio web de servicios esotéricos de protección y limpieza energética que estimulen la noradrenalina para crear una experiencia de alerta, acción inmediata y seguridad reforzada:

ELEMENTOS INTERACTIVOS CLAVE:

1. Escáner de Vulnerabilidad Energética
   - Cuestionario interactivo con feedback inmediato sobre puntos vulnerables
   - Visualización en tiempo real de áreas de protección necesaria
   - Indicadores de alto contraste que señalan urgencia en áreas específicas
   - Recomendaciones personalizadas que aparecen con animaciones de "revelación"

2. Activador de Escudo Protector
   - Experiencia interactiva donde el usuario "construye" su protección
   - Elementos arrastrables que representan diferentes tipos de protección
   - Efectos visuales de activación con alto contraste y movimiento rápido
   - Feedback auditivo que refuerza la sensación de activación y seguridad

3. Sistema de Alerta y Mantenimiento
   - Notificaciones visuales de alto impacto para recordatorios de protección
   - Temporizadores visibles para renovación de prácticas protectoras
   - Indicadores de "nivel de protección" con códigos de color intuitivos
   - Alertas personalizadas basadas en ciclos astrológicos o energéticos

PRINCIPIOS DE DISEÑO PARA ACTIVAR NORADRENALINA:

1. Alto contraste cromático: Utilizar combinaciones como negro/rojo, blanco/rojo
2. Movimientos rápidos y decisivos en animaciones y transiciones
3. Elementos que aparecen súbitamente para captar atención inmediata
4. Señales visuales que crean sensación de urgencia controlada
5. Feedback inmediato y tangible tras cada acción del usuario
6. Simbolismo de protección con bordes definidos y formas angulares`,
  },
  "transformation-endorphins": {
    title: "Metamorfosis Eufórica",
    description:
      "Diseño que estimula las endorfinas para crear experiencias transformadoras profundamente satisfactorias",
    prompt: `Diseña una experiencia de usuario para un sitio web de servicios esotéricos de transformación personal que estimule las endorfinas para crear una experiencia de superación, liberación y transformación eufórica:

ARQUITECTURA DE LA EXPERIENCIA:

1. Jornada de Superación Progresiva
   - Estructura de contenido que presenta desafíos graduales seguidos de "victorias"
   - Visualización de progreso que celebra cada paso completado
   - Narrativa de "héroe/heroína" donde el usuario es el protagonista
   - Puntos de "liberación" donde se experimentan momentos catárticos

2. Rituales de Liberación Interactivos
   - Experiencias interactivas que simbolizan la liberación de limitaciones
   - Animaciones satisfactorias de "ruptura" o "disolución" de obstáculos
   - Elementos que responden al tacto/clic con efectos liberadores
   - Secuencias que culminan en momentos de expansión visual y sensorial

3. Celebración de la Transformación
   - Recompensas visuales y experienciales tras completar procesos
   - Comparativas "antes y después" personalizadas
   - Certificaciones o símbolos de logro que pueden compartirse
   - Experiencias inmersivas que representan el "nuevo yo" emergente

ELEMENTOS SENSORIALES PARA ACTIVAR ENDORFINAS:

1. Paleta de colores que evoluciona de tonos oscuros a luminosos
2. Movimientos que pasan de restricción a liberación y expansión
3. Elementos visuales que crean sensación de "flujo" y "elevación"
4. Sonidos (opcionales) que evocan liberación y expansión
5. Micro-interacciones que proporcionan satisfacción inmediata
6. Simbolismo de metamorfosis: mariposas, fénix, amanecer, etc.`,
  },
  "astral-acetylcholine": {
    title: "Navegación Astral Consciente",
    description: "Diseño que estimula la acetilcolina para facilitar estados alterados de conciencia y viajes astrales",
    prompt: `Diseña un layout para un sitio web de servicios esotéricos de viajes astrales que estimule la acetilcolina para crear una experiencia de claridad mental, recuerdo vívido y navegación consciente entre dimensiones:

ESTRUCTURA ESPACIAL:

1. Navegación Multi-dimensional
   - Sistema de navegación que simula "capas" o "planos" de realidad
   - Transiciones que sugieren movimiento entre dimensiones
   - Estructura clara pero no lineal que permite exploración intuitiva
   - Puntos de referencia visuales que facilitan la orientación

2. Cartografía Astral
   - Mapas visuales de los "territorios" astrales explorados
   - Sistemas de marcadores para guardar experiencias y descubrimientos
   - Representaciones visuales de diferentes planos o frecuencias
   - Elementos que ayudan a "anclar" y recordar experiencias

3. Espacios de Integración
   - Áreas dedicadas a la reflexión y asimilación de experiencias
   - Herramientas para documentar y dar sentido a los viajes
   - Conexiones visuales entre experiencias relacionadas
   - Elementos que facilitan la transferencia entre estados de conciencia

PRINCIPIOS DE DISEÑO PARA ACTIVAR ACETILCOLINA:

1. Claridad estructural con jerarquías visuales evidentes
2. Patrones geométricos que facilitan la memorización y reconocimiento
3. Elementos mnemotécnicos visuales que actúan como "anclas" de memoria
4. Transiciones suaves pero perceptibles entre secciones
5. Simbolismo que conecta lo abstracto con lo concreto
6. Uso estratégico de la geometría sagrada como sistema organizador`,
  },
  "shamanic-glutamate": {
    title: "Iniciación Chamánica Reveladora",
    description:
      "Diseño que estimula el glutamato para crear conexiones cognitivas y revelaciones en prácticas chamánicas",
    prompt: `Diseña una estrategia de contenido para un sitio web de servicios esotéricos chamánicos que estimule el glutamato para crear una experiencia de conexiones cognitivas, insights profundos y revelaciones transformadoras:

ESTRUCTURA DE CONTENIDO:

1. Patrones de Revelación Progresiva
   - Contenido organizado en capas de profundidad creciente
   - Información presentada en patrones que invitan a establecer conexiones
   - Revelaciones estratégicas que crean momentos de "insight"
   - Estructuras que permiten múltiples niveles de interpretación

2. Cartografía de Conocimiento Chamánico
   - Visualizaciones de las interconexiones entre diferentes prácticas y conceptos
   - Representaciones de sistemas completos que muestran relaciones no evidentes
   - Elementos que invitan a la exploración activa y el descubrimiento
   - Puntos de convergencia que integran diferentes tradiciones y sabidurías

3. Espacios de Integración Cognitiva
   - Herramientas para documentar y conectar aprendizajes personales
   - Preguntas estratégicas que estimulan nuevas conexiones mentales
   - Ejercicios que invitan a aplicar conocimientos en nuevos contextos
   - Visualizaciones que ayudan a integrar experiencias aparentemente dispares

ELEMENTOS PARA ESTIMULAR EL GLUTAMATO:

1. Patrones visuales complejos pero coherentes que invitan al análisis
2. Yuxtaposiciones inesperadas pero significativas de conceptos e imágenes
3. Información presentada en múltiples formatos complementarios
4. Elementos interactivos que recompensan la exploración profunda
5. Simbolismo que opera en múltiples niveles de significado
6. Metáforas visuales que conectan lo abstracto con lo concreto`,
  },
  "energy-gaba": {
    title: "Armonización Energética Profunda",
    description: "Diseño que estimula el GABA para crear estados de calma y receptividad en trabajos energéticos",
    prompt: `Diseña una experiencia de usuario para un sitio web de servicios esotéricos de trabajo energético que estimule el GABA para crear una experiencia de calma profunda, receptividad y armonización:

ARQUITECTURA DE EXPERIENCIA:

1. Entrada Gradual
   - Transición suave desde el mundo exterior al espacio energético
   - Reducción progresiva de elementos distractores
   - Simplificación visual que guía hacia la calma
   - Ritmo deliberadamente lento que induce a la desaceleración

2. Espacios de Resonancia
   - Áreas con mínimos elementos visuales que permiten "respirar"
   - Uso estratégico del espacio vacío como elemento activo
   - Formas orgánicas y fluidas que evitan ángulos agudos
   - Transiciones imperceptibles entre secciones

3. Guía No Intrusiva
   - Navegación intuitiva que requiere mínimo esfuerzo cognitivo
   - Instrucciones simples presentadas en el momento preciso
   - Opciones limitadas que evitan la sobrecarga de decisiones
   - Feedback sutil que confirma sin interrumpir

ELEMENTOS PARA ESTIMULAR EL GABA:

1. Paleta de colores en tonos azules, verdes y lavandas suaves
2. Formas redondeadas y orgánicas que evitan la estimulación excesiva
3. Movimientos lentos y fluidos en transiciones y animaciones
4. Patrones repetitivos y predecibles que inducen a estados meditativos
5. Espacios negativos amplios que permiten "descanso" visual
6. Elementos que sugieren profundidad y expansión sin crear tensión`,
  },
  "past-lives-anandamide": {
    title: "Exploración Feliz de Vidas Pasadas",
    description:
      "Diseño que estimula la anandamida para crear estados de apertura creativa en la exploración de vidas pasadas",
    prompt: `Diseña elementos interactivos para un sitio web de servicios esotéricos de exploración de vidas pasadas que estimulen la anandamida para crear una experiencia de apertura creativa, conexiones sorprendentes y descubrimiento gozoso:

ELEMENTOS INTERACTIVOS:

1. Portal de Exploración Temporal
   - Interfaz interactiva que permite "navegar" por diferentes épocas
   - Descubrimientos inesperados que aparecen durante la exploración
   - Conexiones sorprendentes entre elementos aparentemente no relacionados
   - Experiencia no lineal que permite seguir la intuición y curiosidad

2. Tejedor de Narrativas Pasadas
   - Herramienta para crear y explorar posibles narrativas de vidas anteriores
   - Elementos que se combinan de formas inesperadas y reveladoras
   - Generador de conexiones que sugiere vínculos entre vidas y habilidades
   - Visualizaciones que evolucionan basadas en las exploraciones del usuario

3. Cartografía de Patrones Kármicos
   - Visualización interactiva de patrones recurrentes entre vidas
   - Descubrimiento progresivo de conexiones y significados
   - Elementos que invitan a la interpretación personal y creativa
   - Herramientas para documentar insights y conexiones descubiertas

PRINCIPIOS PARA ESTIMULAR LA ANANDAMIDA:

1. Elementos sorpresa que aparecen en momentos inesperados
2. Combinaciones inusuales pero significativas de colores, formas y conceptos
3. Espacios que invitan a la exploración sin objetivos rígidos
4. Recompensas visuales y conceptuales por seguir la curiosidad
5. Patrones que sugieren orden dentro del aparente caos
6. Elementos lúdicos que fomentan la experimentación sin miedo al error`,
  },
  "manifestation-phenylethylamine": {
    title: "Manifestación Apasionada",
    description:
      "Diseño que estimula la feniletilamina para crear estados de excitación y atracción hacia los objetivos de manifestación",
    prompt: `Diseña una experiencia de usuario para un sitio web de servicios esotéricos de manifestación consciente que estimule la feniletilamina para crear una experiencia de atracción intensa, excitación y deseo ardiente hacia los objetivos de manifestación:

ARQUITECTURA DE EXPERIENCIA:

1. Encuentro Inicial
   - Primera impresión visual impactante que crea "flechazo" con las posibilidades
   - Elementos que capturan la atención y crean deseo inmediato
   - Promesa visual de transformación y satisfacción
   - Ritmo que alterna entre anticipación y satisfacción

2. Cortejo con el Deseo
   - Secuencia que profundiza la conexión con los objetivos de manifestación
   - Visualizaciones que intensifican el deseo por lo manifestado
   - Interacciones que crean "química" entre el usuario y sus metas
   - Elementos que fomentan la proyección emocional hacia los resultados

3. Unión Transformadora
   - Experiencias culminantes que simbolizan la unión con lo deseado
   - Rituales interactivos de compromiso con el proceso manifestador
   - Visualizaciones inmersivas del estado de unión con lo manifestado
   - Celebración de la "relación" establecida con las nuevas realidades

ELEMENTOS PARA ESTIMULAR LA FENILETILAMINA:

1. Paleta de colores intensa con rojos apasionados y púrpuras profundos
2. Ritmo que alterna entre tensión y liberación
3. Elementos visuales que crean sensación de "atracción magnética"
4. Proximidad creciente entre el usuario y sus objetivos visualizados
5. Simbolismo de unión, fusión y conexión íntima
6. Experiencias sensorialmente ricas que activan múltiples sentidos`,
  },
}

// Componente principal
type NeurotransmitterPromptGeneratorProps = {
  onGenerate: (data: z.infer<typeof neurotransmitterSchema>) => void
  isGenerating: boolean
}

export function NeurotransmitterPromptGenerator({ onGenerate, isGenerating }: NeurotransmitterPromptGeneratorProps) {
  const [activeTab, setActiveTab] = useState("generator")
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [selectedPreset, setSelectedPreset] = useState<any>(null)
  const resultTextRef = useRef<HTMLDivElement>(null)
  const [neurotransmitterScore, setNeurotransmitterScore] = useState<number>(0)
  const [conversionScore, setConversionScore] = useState<number>(0)
  const [engagementScore, setEngagementScore] = useState<number>(0)
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])
  const [activeAccordion, setActiveAccordion] = useState<string[]>(["basic"])
  const [showNeuroscienceInfo, setShowNeuroscienceInfo] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  const form = useForm<z.infer<typeof neurotransmitterSchema>>({
    resolver: zodResolver(neurotransmitterSchema),
    defaultValues: {
      targetNeurotransmitter: "dopamine",
      secondaryNeurotransmitter: undefined,
      neurotransmitterBalance: 50,
      designElement: "color-palette",
      serviceType: "love",
      audienceProfile: "spiritual-seeker",
      intensityLevel: 7,
      stimulationPattern: "gradual",
      stimulationTiming: "distributed",
      includeMarketingStrategy: true,
      optimizeForMobile: true,
      optimizeForConversion: false,
      includeNeuroscienceReferences: false,
      userJourneyStage: "interest",
      psychologicalTriggers: [],
      colorPsychologyStrategy: "emotional-alchemy",
      outputFormat: "detailed",
      includeVisualExamples: false,
      includeCodeSnippets: false,
      includeResearchBasis: false,
    },
  })

  // Observar cambios en el formulario para actualizar puntuaciones
  useEffect(() => {
    const subscription = form.watch((value) => {
      calculateScores(value)
    })
    return () => subscription.unsubscribe()
  }, [form.watch])

  // Calcular puntuaciones basadas en la configuración actual
  const calculateScores = (values: any) => {
    // Puntuación de potencia neuroquímica (basada en intensidad, combinación, etc.)
    let neuroScore = values.intensityLevel || 5

    // Bonificaciones por combinaciones efectivas
    if (values.secondaryNeurotransmitter) neuroScore += 2
    if (values.stimulationPattern === "crescendo" || values.stimulationPattern === "contrast") neuroScore += 1
    if (values.stimulationTiming === "pre-conversion") neuroScore += 1

    // Normalizar a escala 0-100
    neuroScore = Math.min(Math.round((neuroScore / 15) * 100), 100)
    setNeurotransmitterScore(neuroScore)

    // Puntuación de potencial de conversión
    let convScore = 50 // Base

    if (values.optimizeForConversion) convScore += 15
    if (values.stimulationTiming === "pre-conversion") convScore += 10
    if (values.userJourneyStage === "decision" || values.userJourneyStage === "intent") convScore += 10
    if (values.psychologicalTriggers && values.psychologicalTriggers.includes("scarcity")) convScore += 5
    if (values.psychologicalTriggers && values.psychologicalTriggers.includes("social-proof")) convScore += 5

    // Normalizar a escala 0-100
    convScore = Math.min(convScore, 100)
    setConversionScore(convScore)

    // Puntuación de engagement
    let engScore = 60 // Base

    if (values.targetNeurotransmitter === "dopamine") engScore += 10
    if (values.intensityLevel > 7) engScore += 5
    if (values.stimulationPattern === "pulsed" || values.stimulationPattern === "wave") engScore += 5
    if (values.includeVisualExamples) engScore += 5
    if (values.psychologicalTriggers && values.psychologicalTriggers.includes("curiosity-gap")) engScore += 5
    if (values.psychologicalTriggers && values.psychologicalTriggers.includes("anticipation")) engScore += 5

    // Normalizar a escala 0-100
    engScore = Math.min(engScore, 100)
    setEngagementScore(engScore)
  }

  // Añade este useEffect después de la declaración de los estados
  useEffect(() => {
    // Si volvemos a la pestaña del generador y el botón sigue en estado de carga,
    // asumimos que la generación ya terminó
    if (activeTab === "generator" && isGenerating) {
      // Notificar al componente padre que la generación ha terminado
      onGenerate(form.getValues())
    }
  }, [activeTab, isGenerating, onGenerate, form])

  // Generar el prompt basado en los valores del formulario
  const generatePromptFromValues = (values: z.infer<typeof neurotransmitterSchema>): string => {
    const primaryNeurotransmitterInfo = primaryNeurotransmitters.find((n) => n.value === values.targetNeurotransmitter)
    const secondaryNeurotransmitterInfo = values.secondaryNeurotransmitter
      ? [...primaryNeurotransmitters, ...secondaryNeurotransmitters].find(
          (n) => n.value === values.secondaryNeurotransmitter,
        )
      : null

    const serviceInfo = serviceTypes.find((s) => s.value === values.serviceType)
    const designElementInfo = designElements.find((d) => d.value === values.designElement)
    const audienceInfo = values.audienceProfile
      ? audienceProfiles.find((a) => a.value === values.audienceProfile)
      : null
    const journeyStageInfo = values.userJourneyStage
      ? userJourneyStages.find((j) => j.value === values.userJourneyStage)
      : null
    const stimulationPatternInfo = values.stimulationPattern
      ? stimulationPatterns.find((p) => p.value === values.stimulationPattern)
      : null
    const stimulationTimingInfo = values.stimulationTiming
      ? stimulationTimings.find((t) => t.value === values.stimulationTiming)
      : null
    const colorStrategyInfo = values.colorPsychologyStrategy
      ? colorPsychologyStrategies.find((c) => c.value === values.colorPsychologyStrategy)
      : null

    // Título del prompt
    let prompt = `PROMPT DE DISEÑO NEUROQUÍMICO: ${designElementInfo?.label.split("(")[0].trim()} para ${serviceInfo?.label} optimizado para ${primaryNeurotransmitterInfo?.label.split("(")[0].trim()}`

    if (secondaryNeurotransmitterInfo) {
      prompt += ` y ${secondaryNeurotransmitterInfo.label.split("(")[0].trim()}`
    }

    prompt += `\n\n`

    // Instrucción principal
    prompt += `Crea un ${designElementInfo?.label.split("(")[0].trim()} para un sitio web de servicios esotéricos de ${serviceInfo?.label.split("(")[0].trim()} diseñado para estimular ${primaryNeurotransmitterInfo?.label.split("(")[0].trim()}`

    if (secondaryNeurotransmitterInfo) {
      const balance = values.neurotransmitterBalance || 50
      if (balance < 40) {
        prompt += ` con toques sutiles de ${secondaryNeurotransmitterInfo.label.split("(")[0].trim()}`
      } else if (balance > 60) {
        prompt += ` con una fuerte presencia de ${secondaryNeurotransmitterInfo.label.split("(")[0].trim()}`
      } else {
        prompt += ` y ${secondaryNeurotransmitterInfo.label.split("(")[0].trim()} en equilibrio`
      }
    }

    prompt += ` con nivel de intensidad ${values.intensityLevel}/10.\n\n`

    // Audiencia objetivo
    if (audienceInfo) {
      prompt += `AUDIENCIA OBJETIVO:\n${audienceInfo.label}: ${audienceInfo.description}\n\n`
    }

    // Etapa del recorrido del usuario
    if (journeyStageInfo) {
      prompt += `ETAPA DEL RECORRIDO DEL USUARIO:\n${journeyStageInfo.label}: ${journeyStageInfo.description}\n\n`
    }

    // Patrón y timing de estimulación
    if (stimulationPatternInfo || stimulationTimingInfo) {
      prompt += `ESTRATEGIA DE ESTIMULACIÓN NEUROQUÍMICA:\n`

      if (stimulationPatternInfo) {
        prompt += `- Patrón: ${stimulationPatternInfo.label} - ${stimulationPatternInfo.description}\n`
      }

      if (stimulationTimingInfo) {
        prompt += `- Timing: ${stimulationTimingInfo.label} - ${stimulationTimingInfo.description}\n`
      }

      prompt += `\n`
    }

    // Estrategia de psicología del color
    if (colorStrategyInfo) {
      prompt += `ESTRATEGIA DE PSICOLOGÍA DEL COLOR:\n${colorStrategyInfo.label}: ${colorStrategyInfo.description}\n\n`
    }

    // Disparadores psicológicos
    if (values.psychologicalTriggers && values.psychologicalTriggers.length > 0) {
      prompt += `DISPARADORES PSICOLÓGICOS A INCORPORAR:\n`

      for (const triggerId of values.psychologicalTriggers) {
        const trigger = psychologicalTriggers.find((t) => t.value === triggerId)
        if (trigger) {
          prompt += `- ${trigger.label}: ${trigger.description}\n`
        }
      }

      prompt += `\n`
    }

    // Consideraciones técnicas
    prompt += `CONSIDERACIONES TÉCNICAS:\n`
    if (values.optimizeForMobile) {
      prompt += `- Optimizar para dispositivos móviles\n`
    }
    if (values.optimizeForConversion) {
      prompt += `- Priorizar elementos que maximicen la conversión\n`
    }
    prompt += `\n`

    // Añadir estrategia de marketing si está seleccionada
    if (values.includeMarketingStrategy) {
      prompt += `ESTRATEGIA DE MARKETING NEUROQUÍMICO:\n`
      prompt += `- Incluir elementos que activen ${primaryNeurotransmitterInfo?.label.split("(")[0].trim()} para aumentar engagement\n`
      prompt += `- Diseñar llamadas a la acción que estimulen la respuesta emocional deseada\n`
      prompt += `- Crear una narrativa que guíe al usuario hacia la conversión\n`

      if (secondaryNeurotransmitterInfo) {
        prompt += `- Incorporar elementos secundarios que estimulen ${secondaryNeurotransmitterInfo.label.split("(")[0].trim()} en momentos estratégicos\n`
      }

      prompt += `\n`
    }

    // Añadir base científica si está seleccionada
    if (values.includeNeuroscienceReferences && primaryNeurotransmitterInfo?.scientificBasis) {
      prompt += `BASE CIENTÍFICA:\n${primaryNeurotransmitterInfo.scientificBasis}\n\n`

      if (secondaryNeurotransmitterInfo && "scientificBasis" in secondaryNeurotransmitterInfo) {
        prompt += `${secondaryNeurotransmitterInfo.scientificBasis}\n\n`
      }
    }

    // Añadir instrucciones personalizadas si existen
    if (values.customInstructions) {
      prompt += `INSTRUCCIONES ADICIONALES:\n${values.customInstructions}\n\n`
    }

    // Instrucciones de formato de salida
    const outputFormatInfo = outputFormats.find((f) => f.value === values.outputFormat)

    prompt += `FORMATO DE SALIDA: ${outputFormatInfo?.label}\n`

    if (values.includeVisualExamples) {
      prompt += `- Incluir ejemplos visuales descriptivos\n`
    }

    if (values.includeCodeSnippets) {
      prompt += `- Incluir fragmentos de código relevantes\n`
    }

    if (values.includeResearchBasis) {
      prompt += `- Incluir referencias a investigaciones que respalden las recomendaciones\n`
    }

    prompt += `\n`

    // Conclusión
    prompt += `El diseño debe crear una experiencia que active ${primaryNeurotransmitterInfo?.label.split("(")[0].trim()} a través de elementos visuales, interactivos y estructurales estratégicamente implementados, específicamente orientados a servicios esotéricos de ${serviceInfo?.label.split("(")[0].trim()}.`

    if (primaryNeurotransmitterInfo?.effects) {
      prompt += ` Los efectos principales a lograr son: ${primaryNeurotransmitterInfo.effects.join(", ")}.`
    }

    if (primaryNeurotransmitterInfo?.visualCues) {
      prompt += ` Incorporar señales visuales como: ${primaryNeurotransmitterInfo.visualCues.join(", ")}.`
    }

    return prompt
  }

  function onSubmit(values: z.infer<typeof neurotransmitterSchema>) {
    // Generar el prompt
    const prompt = generatePromptFromValues(values)
    setGeneratedPrompt(prompt)

    // Cambiar a la pestaña de resultado
    setActiveTab("result")

    // Llamar a la función onGenerate del componente padre
    onGenerate(values)

    // Asegurarnos de que después de un breve retraso, el botón vuelva a su estado normal
    // incluso si el componente padre no actualiza el estado correctamente
    setTimeout(() => {
      if (isGenerating) {
        // Solo notificar al usuario si el estado no cambió después de un tiempo razonable
        toast({
          title: "Prompt generado",
          description: "El prompt ha sido generado correctamente.",
        })
      }
    }, 1500)
  }

  // Aplicar un preset
  const applyPreset = (preset: any) => {
    setSelectedPreset(preset)
    setGeneratedPrompt(preset.prompt)
    setActiveTab("result")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt)
    toast({
      title: "Copiado al portapapeles",
      description: "El prompt ha sido copiado al portapapeles.",
    })
  }

  const downloadPrompt = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedPrompt], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "prompt-neurotransmisor.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Tab indicator animation
  const tabsRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  useEffect(() => {
    if (tabsRef.current) {
      const activeTabElement = tabsRef.current.querySelector('[data-state="active"]')
      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement as HTMLElement
        setIndicatorStyle({
          left: offsetLeft,
          width: offsetWidth,
        })
      }
    }
  }, [activeTab])

  return (
    <Card className="border-0 bg-black/20 backdrop-blur-sm shadow-lg shadow-purple-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Brain className="h-6 w-6 text-purple-400" />
          Generador de Prompts Neuroquímicos Avanzado
        </CardTitle>
        <CardDescription className="text-base">
          Crea diseños web esotéricos que estimulen neurotransmisores específicos para maximizar el impacto emocional y
          la conversión
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Custom tab indicator animation */}
        <style jsx global>{`
          .tabs-with-indicator {
            position: relative;
          }
          
          .tab-indicator {
            position: absolute;
            height: 3px;
            bottom: 0;
            left: 0;
            background: linear-gradient(to right, #9333ea, #6366f1);
            transition: all 0.3s ease;
            border-radius: 3px;
            box-shadow: 0 0 8px rgba(147, 51, 234, 0.5);
          }
          
          @keyframes tabPulse {
            0% {
              box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.7);
            }
            70% {
              box-shadow: 0 0 0 6px rgba(147, 51, 234, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(147, 51, 234, 0);
            }
          }
          
          .tabs-with-indicator [data-state="active"] {
            animation: tabPulse 2s infinite;
          }
        `}</style>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full tabs-with-indicator" ref={tabsRef}>
          <div className="relative">
            <TabsList className="grid w-full grid-cols-5 mb-6 p-1 bg-black/30 backdrop-blur-sm rounded-xl border border-purple-500/20">
              <TabsTrigger
                value="generator"
                className="text-base py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500/30 data-[state=active]:to-indigo-500/30 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 group"
              >
                <Wand2 className="h-4 w-4 mr-2 transition-transform group-hover:rotate-12" />
                Generador
              </TabsTrigger>
              <TabsTrigger
                value="result"
                className="text-base py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500/30 data-[state=active]:to-indigo-500/30 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 group"
              >
                <Sparkles className="h-4 w-4 mr-2 transition-all group-hover:scale-110" />
                Resultado
              </TabsTrigger>
              <TabsTrigger
                value="neuroscience"
                className="text-base py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500/30 data-[state=active]:to-indigo-500/30 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 group"
              >
                <Microscope className="h-4 w-4 mr-2 transition-transform group-hover:translate-y-[-2px]" />
                Neurociencia
              </TabsTrigger>
              <TabsTrigger
                value="examples"
                className="text-base py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500/30 data-[state=active]:to-indigo-500/30 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 group"
              >
                <Eye className="h-4 w-4 mr-2 transition-all group-hover:scale-110" />
                Ejemplos Visual
              </TabsTrigger>
              <TabsTrigger
                value="tools"
                className="text-base py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500/30 data-[state=active]:to-indigo-500/30 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 group"
              >
                <Workflow className="h-4 w-4 mr-2 transition-transform group-hover:rotate-45" />
                Herramientas
              </TabsTrigger>
            </TabsList>
            <div
              className="tab-indicator"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
              }}
            />
          </div>

          <TabsContent value="generator" className="animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <ScrollArea className="h-[600px] pr-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <Accordion
                        type="multiple"
                        defaultValue={["basic"]}
                        value={activeAccordion}
                        onValueChange={setActiveAccordion}
                        className="w-full"
                      >
                        <AccordionItem value="basic">
                          <AccordionTrigger className="text-lg font-medium">
                            <div className="flex items-center">
                              <Brain className="h-5 w-5 mr-2 text-purple-400" />
                              Configuración Neuroquímica Básica
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-6 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="targetNeurotransmitter"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Neurotransmisor Principal</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="bg-black/40">
                                          <SelectValue placeholder="Selecciona un neurotransmisor" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {primaryNeurotransmitters.map((neurotransmitter) => (
                                          <SelectItem key={neurotransmitter.value} value={neurotransmitter.value}>
                                            <div className="flex items-center">
                                              {neurotransmitter.icon}
                                              {neurotransmitter.label}
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      {primaryNeurotransmitters.find((n) => n.value === field.value)?.description}
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="secondaryNeurotransmitter"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Neurotransmisor Secundario (opcional)</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                      <FormControl>
                                        <SelectTrigger className="bg-black/40">
                                          <SelectValue placeholder="Selecciona un neurotransmisor secundario" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="none">Ninguno</SelectItem>
                                        {[...primaryNeurotransmitters, ...secondaryNeurotransmitters]
                                          .filter((n) => n.value !== form.getValues("targetNeurotransmitter"))
                                          .map((neurotransmitter) => (
                                            <SelectItem key={neurotransmitter.value} value={neurotransmitter.value}>
                                              <div className="flex items-center">
                                                {neurotransmitter.icon}
                                                {neurotransmitter.label}
                                              </div>
                                            </SelectItem>
                                          ))}
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      Combina neurotransmisores para efectos más complejos y personalizados
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            {form.watch("secondaryNeurotransmitter") && (
                              <FormField
                                control={form.control}
                                name="neurotransmitterBalance"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Balance Neuroquímico: {field.value}% / {100 - field.value}%
                                    </FormLabel>
                                    <FormControl>
                                      <Slider
                                        min={0}
                                        max={100}
                                        step={5}
                                        defaultValue={[field.value]}
                                        onValueChange={(values) => field.onChange(values[0])}
                                        className="w-full"
                                      />
                                    </FormControl>
                                    <FormDescription className="flex justify-between">
                                      <span>
                                        {
                                          primaryNeurotransmitters
                                            .find((n) => n.value === form.watch("targetNeurotransmitter"))
                                            ?.label.split("(")[0]
                                        }
                                      </span>
                                      <span>
                                        {
                                          [...primaryNeurotransmitters, ...secondaryNeurotransmitters]
                                            .find((n) => n.value === form.watch("secondaryNeurotransmitter"))
                                            ?.label.split("(")[0]
                                        }
                                      </span>
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="designElement"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Elemento de Diseño</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="bg-black/40">
                                          <SelectValue placeholder="Selecciona un elemento de diseño" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {designElements.map((element) => (
                                          <SelectItem key={element.value} value={element.value}>
                                            {element.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      {designElements.find((d) => d.value === field.value)?.description}
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="serviceType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tipo de Servicio Esotérico</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="bg-black/40">
                                          <SelectValue placeholder="Selecciona un tipo de servicio" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {serviceTypes.map((service) => (
                                          <SelectItem key={service.value} value={service.value}>
                                            <div className="flex items-center">
                                              {service.icon}
                                              {service.label}
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      Elige el tipo de servicio esotérico que deseas ofrecer
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="intensityLevel"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nivel de Intensidad Neuroquímica: {field.value}</FormLabel>
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
                                  <FormDescription className="flex justify-between">
                                    <span>Sutil</span>
                                    <span>Moderado</span>
                                    <span>Intenso</span>
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="advanced">
                          <AccordionTrigger className="text-lg font-medium">
                            <div className="flex items-center">
                              <Layers className="h-5 w-5 mr-2 text-purple-400" />
                              Configuración Avanzada
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-6 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="audienceProfile"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Perfil de Audiencia</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                      <FormControl>
                                        <SelectTrigger className="bg-black/40">
                                          <SelectValue placeholder="Selecciona un perfil de audiencia" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {audienceProfiles.map((profile) => (
                                          <SelectItem key={profile.value} value={profile.value}>
                                            {profile.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      {audienceProfiles.find((a) => a.value === field.value)?.description}
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="userJourneyStage"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Etapa del Recorrido del Usuario</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                      <FormControl>
                                        <SelectTrigger className="bg-black/40">
                                          <SelectValue placeholder="Selecciona una etapa" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {userJourneyStages.map((stage) => (
                                          <SelectItem key={stage.value} value={stage.value}>
                                            {stage.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      {userJourneyStages.find((s) => s.value === field.value)?.description}
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="stimulationPattern"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Patrón de Estimulación</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                      <FormControl>
                                        <SelectTrigger className="bg-black/40">
                                          <SelectValue placeholder="Selecciona un patrón" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {stimulationPatterns.map((pattern) => (
                                          <SelectItem key={pattern.value} value={pattern.value}>
                                            {pattern.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      {stimulationPatterns.find((p) => p.value === field.value)?.description}
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="stimulationTiming"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Timing de Estimulación</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                      <FormControl>
                                        <SelectTrigger className="bg-black/40">
                                          <SelectValue placeholder="Selecciona un timing" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {stimulationTimings.map((timing) => (
                                          <SelectItem key={timing.value} value={timing.value}>
                                            {timing.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      {stimulationTimings.find((t) => t.value === field.value)?.description}
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="colorPsychologyStrategy"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Estrategia de Psicología del Color</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                      <SelectTrigger className="bg-black/40">
                                        <SelectValue placeholder="Selecciona una estrategia" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {colorPsychologyStrategies.map((strategy) => (
                                        <SelectItem key={strategy.value} value={strategy.value}>
                                          {strategy.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    {colorPsychologyStrategies.find((s) => s.value === field.value)?.description}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="psychologicalTriggers"
                              render={() => (
                                <FormItem>
                                  <div className="mb-4">
                                    <FormLabel>Disparadores Psicológicos</FormLabel>
                                    <FormDescription>
                                      Selecciona los disparadores psicológicos a incorporar en el diseño
                                    </FormDescription>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {psychologicalTriggers.map((trigger) => (
                                      <FormField
                                        key={trigger.value}
                                        control={form.control}
                                        name="psychologicalTriggers"
                                        render={({ field }) => {
                                          return (
                                            <FormItem
                                              key={trigger.value}
                                              className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2 hover:bg-black/20"
                                            >
                                              <FormControl>
                                                <Checkbox
                                                  checked={field.value?.includes(trigger.value)}
                                                  onCheckedChange={(checked) => {
                                                    const currentValues = field.value || []
                                                    return checked
                                                      ? field.onChange([...currentValues, trigger.value])
                                                      : field.onChange(
                                                          currentValues.filter((value) => value !== trigger.value),
                                                        )
                                                  }}
                                                />
                                              </FormControl>
                                              <div className="space-y-1 leading-none">
                                                <FormLabel className="text-sm font-medium">{trigger.label}</FormLabel>
                                                <FormDescription className="text-xs">
                                                  {trigger.description}
                                                </FormDescription>
                                              </div>
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
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="options">
                          <AccordionTrigger className="text-lg font-medium">
                            <div className="flex items-center">
                              <Settings className="h-5 w-5 mr-2 text-purple-400" />
                              Opciones y Formato
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-6 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="outputFormat"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Formato de Salida</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="bg-black/40">
                                          <SelectValue placeholder="Selecciona un formato" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {outputFormats.map((format) => (
                                          <SelectItem key={format.value} value={format.value}>
                                            {format.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      {outputFormats.find((f) => f.value === field.value)?.description}
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name="includeMarketingStrategy"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">Incluir Estrategia de Marketing</FormLabel>
                                      <FormDescription>
                                        Incluir una estrategia de marketing basada en el neurotransmisor
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="optimizeForMobile"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">Optimizar para Móviles</FormLabel>
                                      <FormDescription>
                                        Priorizar la experiencia en dispositivos móviles
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="optimizeForConversion"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">Optimizar para Conversión</FormLabel>
                                      <FormDescription>Maximizar la probabilidad de acción del usuario</FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="includeNeuroscienceReferences"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">Incluir Referencias Científicas</FormLabel>
                                      <FormDescription>Añadir base científica a las recomendaciones</FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="includeVisualExamples"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">Incluir Ejemplos Visuales</FormLabel>
                                      <FormDescription>Añadir descripciones de ejemplos visuales</FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="includeCodeSnippets"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">Incluir Fragmentos de Código</FormLabel>
                                      <FormDescription>Añadir ejemplos de código relevantes</FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="customInstructions"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Instrucciones Adicionales</FormLabel>
                                  <FormControl>
                                    <textarea
                                      placeholder="Añade cualquier instrucción específica adicional aquí..."
                                      className="min-h-[100px] w-full rounded-md border border-input bg-black/40 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                      value={field.value || ""}
                                      onChange={field.onChange}
                                      onBlur={field.onBlur}
                                      name={field.name}
                                      ref={field.ref}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Incluye detalles específicos o requisitos adicionales para tu diseño
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <Separator />

                      <Button type="submit" className="w-full" disabled={isGenerating}>
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generando...
                          </>
                        ) : (
                          "Generar Prompt Neuroquímico Avanzado"
                        )}
                      </Button>
                    </form>
                  </Form>
                </ScrollArea>
              </div>

              <div className="lg:col-span-1">
                <Card className="bg-black/30 border-purple-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Gauge className="h-5 w-5 mr-2 text-purple-400" />
                      Análisis Neuroquímico
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Potencia Neuroquímica</span>
                        <span className="font-medium">{neurotransmitterScore}%</span>
                      </div>
                      <Progress value={neurotransmitterScore} className="h-2" />
                      <p className="text-xs text-muted-foreground">Intensidad estimada de la respuesta neuroquímica</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Potencial de Conversión</span>
                        <span className="font-medium">{conversionScore}%</span>
                      </div>
                      <Progress value={conversionScore} className="h-2" />
                      <p className="text-xs text-muted-foreground">Probabilidad de impulsar acciones deseadas</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Engagement Estimado</span>
                        <span className="font-medium">{engagementScore}%</span>
                      </div>
                      <Progress value={engagementScore} className="h-2" />
                      <p className="text-xs text-muted-foreground">Nivel de interacción y retención esperado</p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-2">Neurotransmisor Principal</h4>
                      <div className="bg-black/20 rounded-md p-3 text-sm">
                        <div className="flex items-center mb-1">
                          {primaryNeurotransmitters.find((n) => n.value === form.watch("targetNeurotransmitter"))?.icon}
                          <span className="font-medium">
                            {
                              primaryNeurotransmitters.find((n) => n.value === form.watch("targetNeurotransmitter"))
                                ?.label
                            }
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Efectos:{" "}
                          {primaryNeurotransmitters
                            .find((n) => n.value === form.watch("targetNeurotransmitter"))
                            ?.effects?.join(", ")}
                        </p>
                      </div>
                    </div>

                    {form.watch("psychologicalTriggers") && form.watch("psychologicalTriggers").length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Disparadores Activos</h4>
                        <div className="flex flex-wrap gap-1">
                          {form.watch("psychologicalTriggers").map((triggerId) => {
                            const trigger = psychologicalTriggers.find((t) => t.value === triggerId)
                            return trigger ? (
                              <Badge
                                key={triggerId}
                                variant="outline"
                                className="bg-purple-500/10 text-purple-200 border-purple-500/30"
                              >
                                {trigger.label}
                              </Badge>
                            ) : null
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                // Agregar un nuevo componente de visualización cerebral que muestre las áreas activadas
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-400" />
                    Mapa de Activación Cerebral
                  </h3>
                  <div className="relative w-full h-64 bg-black/40 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 opacity-30">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        <path
                          d="M100,20 C120,10 150,10 170,30 C190,50 190,80 170,100 C150,120 120,130 100,130 C80,130 50,120 30,100 C10,80 10,50 30,30 C50,10 80,10 100,20"
                          fill="none"
                          stroke="white"
                          strokeWidth="1"
                        />
                        <path
                          d="M100,40 C110,35 125,35 135,45 C145,55 145,70 135,80 C125,90 110,95 100,95 C90,95 75,90 65,80 C55,70 55,55 65,45 C75,35 90,35 100,40"
                          fill="none"
                          stroke="white"
                          strokeWidth="1"
                        />
                        <line x1="100" y1="20" x2="100" y2="130" stroke="white" strokeWidth="1" />
                        <line x1="30" y1="80" x2="170" y2="80" stroke="white" strokeWidth="1" />
                      </svg>
                    </div>

                    {/* Áreas de activación basadas en neurotransmisores seleccionados */}
                    {form.watch("targetNeurotransmitter") === "dopamine" && (
                      <div className="absolute top-1/4 right-1/4 w-16 h-16 rounded-full bg-amber-400/50 animate-pulse filter blur-md"></div>
                    )}
                    {form.watch("targetNeurotransmitter") === "serotonin" && (
                      <div className="absolute top-1/3 left-1/3 w-16 h-16 rounded-full bg-blue-400/50 animate-pulse filter blur-md"></div>
                    )}
                    {form.watch("targetNeurotransmitter") === "noradrenaline" && (
                      <div className="absolute bottom-1/3 right-1/3 w-16 h-16 rounded-full bg-red-400/50 animate-pulse filter blur-md"></div>
                    )}
                    {form.watch("targetNeurotransmitter") === "oxytocin" && (
                      <div className="absolute bottom-1/4 left-1/4 w-16 h-16 rounded-full bg-green-400/50 animate-pulse filter blur-md"></div>
                    )}

                    {/* Mostrar activación secundaria si hay un neurotransmisor secundario */}
                    {form.watch("secondaryNeurotransmitter") === "dopamine" && (
                      <div className="absolute top-1/4 right-1/4 w-12 h-12 rounded-full bg-amber-400/30 animate-pulse filter blur-md"></div>
                    )}
                    {form.watch("secondaryNeurotransmitter") === "serotonin" && (
                      <div className="absolute top-1/3 left-1/3 w-12 h-12 rounded-full bg-blue-400/30 animate-pulse filter blur-md"></div>
                    )}
                    {/* Añadir más condiciones para otros neurotransmisores secundarios */}

                    <div className="absolute bottom-2 right-2 text-xs text-white/50">
                      Visualización simplificada con fines ilustrativos
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
                    Presets Avanzados
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(presetPrompts).map(([key, preset]) => (
                      <Card
                        key={key}
                        className="bg-black/30 border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer overflow-hidden group"
                        onClick={() => applyPreset(preset)}
                      >
                        <CardContent className="p-3">
                          <h4 className="font-medium text-sm group-hover:text-purple-300 transition-colors">
                            {preset.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">{preset.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="result" className="animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
            <div className="space-y-6">
              {selectedPreset && (
                <div className="mb-4 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
                    {selectedPreset.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{selectedPreset.description}</p>
                </div>
              )}

              <div className="rounded-md border border-white/10 bg-black/20 p-4">
                <div
                  ref={resultTextRef}
                  className="min-h-[500px] w-full font-mono text-sm border-0 resize-none bg-transparent whitespace-pre-wrap overflow-auto"
                >
                  {generatedPrompt}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-200 border-purple-500/30">
                    <Brain className="h-3 w-3 mr-1" />
                    Neuroquímico
                  </Badge>
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-200 border-purple-500/30">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Esotérico
                  </Badge>
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-200 border-purple-500/30">
                    <Target className="h-3 w-3 mr-1" />
                    Conversión
                  </Badge>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={copyToClipboard}
                    disabled={!generatedPrompt}
                    className="bg-background/50 hover:bg-background/80 transition-colors"
                  >
                    <CopyIcon className="h-4 w-4 mr-2" />
                    Copiar Prompt
                  </Button>
                  <Button
                    variant="outline"
                    onClick={downloadPrompt}
                    disabled={!generatedPrompt}
                    className="bg-background/50 hover:bg-background/80 transition-colors"
                  >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Descargar Prompt
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <PromptOptimizer
                  initialPrompt={generatedPrompt}
                  onOptimize={(optimizedPrompt) => setGeneratedPrompt(optimizedPrompt)}
                  isOptimizing={isOptimizing}
                />
                <PromptValidator
                  initialPrompt={generatedPrompt}
                  onValidate={(isValid) => setIsValid(isValid)}
                  isValidating={isValidating}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="neuroscience" className="animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border-0 bg-black/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Microscope className="h-5 w-5 text-purple-400" />
                      Base Científica de la Neuroquímica en Diseño Web
                    </CardTitle>
                    <CardDescription>
                      Fundamentos neurológicos que respaldan el diseño web orientado a neurotransmisores
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="dopamine">
                        <AccordionTrigger className="text-base font-medium">
                          <div className="flex items-center">
                            <Zap className="h-4 w-4 mr-2 text-amber-400" />
                            Dopamina: El Neurotransmisor de la Recompensa
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm space-y-4">
                          <p>
                            La dopamina es un neurotransmisor clave en el sistema de recompensa del cerebro. Cuando se
                            libera, crea sensaciones de placer, satisfaction y motivación para repetir comportamientos.
                          </p>

                          <h4 className="font-medium text-sm">Mecanismo Neurológico:</h4>
                          <p>
                            La dopamina se libera en el núcleo accumbens y el área tegmental ventral (VTA) durante
                            experiencias placenteras o en anticipación de recompensas. Este mecanismo evolucionó para
                            reforzar comportamientos beneficiosos para la supervivencia.
                          </p>

                          <h4 className="font-medium text-sm">Aplicación en Diseño Web:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Revelaciones progresivas de contenido que crean anticipación</li>
                            <li>Sistemas de recompensa visual tras completar acciones</li>
                            <li>Notificaciones y feedback positivo que refuerzan comportamientos</li>
                            <li>Elementos visuales que sugieren progreso hacia objetivos deseados</li>
                            <li>Micro-interacciones satisfactorias que proporcionan gratificación inmediata</li>
                          </ul>

                          <h4 className="font-medium text-sm">Evidencia Científica:</h4>
                          <p>
                            Estudios de neuroimagen han demostrado activación del núcleo accumbens durante interacciones
                            con interfaces que ofrecen recompensas variables e impredecibles, similar a los mecanismos
                            utilizados en juegos de azar y redes sociales.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="serotonin">
                        <AccordionTrigger className="text-base font-medium">
                          <div className="flex items-center">
                            <Smile className="h-4 w-4 mr-2 text-blue-400" />
                            Serotonina: El Neurotransmisor del Bienestar
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm space-y-4">
                          <p>
                            La serotonina regula el estado de ánimo, la sensación de bienestar y la calma. Niveles
                            adecuados de serotonina están asociados con sensaciones de paz, satisfacción y equilibrio
                            emocional.
                          </p>

                          <h4 className="font-medium text-sm">Mecanismo Neurológico:</h4>
                          <p>
                            La serotonina se produce principalmente en el núcleo del rafe en el tronco cerebral y afecta
                            múltiples áreas del cerebro, incluyendo el sistema límbico (emociones) y la corteza
                            prefrontal (toma de decisiones).
                          </p>

                          <h4 className="font-medium text-sm">Aplicación en Diseño Web:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Diseños ordenados y armoniosos que reducen la carga cognitiva</li>
                            <li>Paletas de colores en tonos azules y verdes que evocan calma</li>
                            <li>Navegación predecible que elimina la incertidumbre</li>
                            <li>Espacios visuales amplios que permiten "respirar" al contenido</li>
                            <li>Ritmo pausado que permite asimilación y reflexión</li>
                          </ul>

                          <h4 className="font-medium text-sm">Evidencia Científica:</h4>
                          <p>
                            Investigaciones en psicología ambiental han demostrado que entornos ordenados, predecibles y
                            armoniosos pueden aumentar los niveles de serotonina y reducir el cortisol (hormona del
                            estrés), mejorando la satisfacción y el tiempo de permanencia.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="oxytocin">
                        <AccordionTrigger className="text-base font-medium">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-green-400" />
                            Oxitocina: El Neurotransmisor de la Conexión
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm space-y-4">
                          <p>
                            La oxitocina facilita el vínculo social, la confianza y la empatía. Se conoce como la
                            "hormona del amor" por su papel en las relaciones interpersonales y la formación de
                            vínculos.
                          </p>

                          <h4 className="font-medium text-sm">Mecanismo Neurológico:</h4>
                          <p>
                            La oxitocina se produce en el hipotálamo y se libera a través de la glándula pituitaria.
                            Actúa sobre la amígdala y otras regiones cerebrales para reducir el miedo y aumentar la
                            confianza social.
                          </p>

                          <h4 className="font-medium text-sm">Aplicación en Diseño Web:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Imágenes de rostros humanos que muestran expresiones positivas</li>
                            <li>Testimonios auténticos con historias personales</li>
                            <li>Elementos que sugieren comunidad y pertenencia</li>
                            <li>Comunicación en tono conversacional y personal</li>
                            <li>Símbolos visuales de conexión, unidad y apoyo mutuo</li>
                          </ul>

                          <h4 className="font-medium text-sm">Evidencia Científica:</h4>
                          <p>
                            Estudios han demostrado que la exposición a señales sociales positivas, como rostros
                            sonrientes o historias de cooperación, aumenta los niveles de oxitocina, lo que a su vez
                            incrementa la confianza y la disposición a compartir información personal.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="noradrenaline">
                        <AccordionTrigger className="text-base font-medium">
                          <div className="flex items-center">
                            <Activity className="h-4 w-4 mr-2 text-red-400" />
                            Noradrenalina: El Neurotransmisor de la Alerta
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm space-y-4">
                          <p>
                            La noradrenalina (o norepinefrina) aumenta el estado de alerta, la atención y la preparación
                            para la acción. Es fundamental en la respuesta de "lucha o huida" y en mantener la
                            vigilancia.
                          </p>

                          <h4 className="font-medium text-sm">Mecanismo Neurológico:</h4>
                          <p>
                            La noradrenalina se produce principalmente en el locus coeruleus del tronco cerebral y se
                            distribuye ampliamente por el cerebro, aumentando la excitabilidad neuronal y la respuesta a
                            estímulos.
                          </p>

                          <h4 className="font-medium text-sm">Aplicación en Diseño Web:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Contrastes cromáticos intensos que captan la atención</li>
                            <li>Elementos de movimiento que atraen la mirada</li>
                            <li>Señales de urgencia como temporizadores o indicadores de escasez</li>
                            <li>Llamadas a la acción prominentes con alto contraste</li>
                            <li>Estímulos visuales que crean sensación de dinamismo</li>
                          </ul>

                          <h4 className="font-medium text-sm">Evidencia Científica:</h4>
                          <p>
                            Investigaciones en neurociencia cognitiva han demostrado que estímulos visuales de alto
                            contraste, movimiento y señales de urgencia aumentan la actividad del locus coeruleus y la
                            liberación de noradrenalina, mejorando la atención selectiva y la probabilidad de acción
                            inmediata.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                      <h3 className="text-base font-medium flex items-center mb-2">
                        <Lightbulb className="h-5 w-5 mr-2 text-purple-400" />
                        Consideraciones Éticas
                      </h3>
                      <p className="text-sm">
                        El diseño basado en neurotransmisores es una herramienta poderosa que conlleva responsabilidad
                        ética. Recomendamos:
                      </p>
                      <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                        <li>Usar estas técnicas para mejorar genuinamente la experiencia del usuario</li>
                        <li>Evitar la manipulación excesiva o la creación de patrones adictivos</li>
                        <li>Considerar el bienestar psicológico a largo plazo de los usuarios</li>
                        <li>Ser transparente sobre las técnicas persuasivas utilizadas</li>
                        <li>Equilibrar los objetivos de conversión con el respeto a la autonomía del usuario</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="border-0 bg-black/20 mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Workflow className="h-5 w-5 text-purple-400" />
                      Flujo de Trabajo Neuroquímico
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative py-4">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-500/20"></div>

                      <div className="relative pl-10 pb-6">
                        <div className="absolute left-2 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                        </div>
                        <h3 className="text-sm font-medium">2. Seleccionar Neurotransmisores</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Elegir los neurotransmisores que mejor faciliten esa respuesta
                        </p>
                      </div>

                      <div className="relative pl-10 pb-6">
                        <div className="absolute left-2 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                        </div>
                        <h3 className="text-sm font-medium">3. Diseñar Estímulos</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Crear elementos visuales e interactivos que activen esos neurotransmisores
                        </p>
                      </div>

                      <div className="relative pl-10 pb-6">
                        <div className="absolute left-2 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                        </div>
                        <h3 className="text-sm font-medium">4. Secuenciar Experiencia</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Organizar los estímulos en un recorrido neurológicamente optimizado
                        </p>
                      </div>

                      <div className="relative pl-10">
                        <div className="absolute left-2 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                        </div>
                        <h3 className="text-sm font-medium">5. Medir y Refinar</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Evaluar respuestas y ajustar basándose en datos reales
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-amber-400/20 to-amber-600/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=200&width=300"
                      alt="Ejemplo de diseño dopaminérgico"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-amber-400/20 text-amber-200 border-amber-500/30">
                      <Zap className="h-3 w-3 mr-1" />
                      Dopamina
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-base mb-1">Revelación Progresiva</h3>
                  <p className="text-sm text-muted-foreground">
                    Diseño que utiliza revelación progresiva de contenido para estimular la dopamina y crear
                    anticipación.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-blue-400/20 to-blue-600/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=200&width=300"
                      alt="Ejemplo de diseño serotoninérgico"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-blue-400/20 text-blue-200 border-blue-500/30">
                      <Smile className="h-3 w-3 mr-1" />
                      Serotonina
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-base mb-1">Armonía Visual</h3>
                  <p className="text-sm text-muted-foreground">
                    Diseño que utiliza espacios amplios y armonía visual para estimular la serotonina y crear sensación
                    de bienestar.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-green-400/20 to-green-600/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=200&width=300"
                      alt="Ejemplo de diseño oxitocinérgico"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-green-400/20 text-green-200 border-green-500/30">
                      <Users className="h-3 w-3 mr-1" />
                      Oxitocina
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-base mb-1">Conexión Comunitaria</h3>
                  <p className="text-sm text-muted-foreground">
                    Diseño que utiliza elementos sociales y testimonios para estimular la oxitocina y crear confianza.
                  </p>
                </CardContent>
              </Card>

              {/* Añadir más ejemplos para otros neurotransmisores */}
            </div>
          </TabsContent>
          <TabsContent value="tools" className="animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <NeurotransmitterCombinationGenerator
                  onApplyCombination={(combination) => {
                    form.setValue("targetNeurotransmitter", combination.primary)
                    form.setValue("secondaryNeurotransmitter", combination.secondary)
                    form.setValue("neurotransmitterBalance", combination.ratio)
                  }}
                />
              </div>
              <div>
                <NeurotransmitterCompetitorAnalyzer />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t border-white/10 pt-4">
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="max-w-xs text-xs">
                  Este generador utiliza principios de neurociencia para crear diseños web que estimulen respuestas
                  neuroquímicas específicas, optimizando la experiencia del usuario y las tasas de conversión.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="text-xs text-muted-foreground ml-2">v2.5 Neuroquímica Avanzada</span>
        </div>
        <div>
          <Badge variant="outline" className="bg-purple-500/10 text-purple-200 border-purple-500/30">
            Neurociencia Aplicada
          </Badge>
        </div>
      </CardFooter>
    </Card>
  )
}

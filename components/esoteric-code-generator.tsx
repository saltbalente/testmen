"use client"

import { useState, useCallback, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Loader2, Wand2 } from "lucide-react"

// Esquema de validación expandido con opciones más avanzadas
const formSchema = z.object({
  // Tipo de código y tema
  codeType: z.string().default("component"),
  esotericTheme: z.string().default("tarot"),
  designLevel: z.string().default("ultra-advanced"),

  // Estilo visual
  visualStyle: z.string().default("neo-mysticism"),
  colorScheme: z.array(z.string()).default(["cosmic-gradient", "ethereal-glow"]),
  customColorPalette: z.string().optional(),

  // Contenedores y bordes
  containerStyle: z.string().default("glass-morphism"),
  borderStyle: z.string().default("energy-flow"),
  cornerStyle: z.string().default("crystal-cut"),

  // Fondos
  backgroundType: z.string().default("animated-gradient"),
  useParallaxEffect: z.boolean().default(true),
  useBackgroundVideo: z.boolean().default(false),
  backgroundVideoTheme: z.string().default("cosmic").optional(),
  useBackgroundPatterns: z.boolean().default(true),
  patternStyle: z.string().default("sacred-geometry"),

  // Animaciones
  includeAnimations: z.boolean().default(true),
  animationLevel: z.string().default("immersive"),
  animationTriggers: z.array(z.string()).default(["scroll", "hover", "time-based"]),
  specialEffects: z.array(z.string()).default(["particle-effects", "glow-effects"]),
  useWebGL: z.boolean().default(true),
  use3DElements: z.boolean().default(true),

  // Tecnologías
  useFrameworks: z.boolean().default(true),
  frameworks: z.array(z.string()).default(["tailwind", "gsap", "three-js"]),
  advancedTechniques: z.array(z.string()).default(["css-variables", "custom-properties", "grid-layout"]),
  useCustomWebComponents: z.boolean().default(true),

  // Tipografía
  useGoogleFonts: z.boolean().default(true),
  fontStyles: z.array(z.string()).default(["mystical", "futuristic"]),
  specificFonts: z.string().optional(),
  typographyEffects: z.array(z.string()).default(["glowing-text", "animated-text"]),
  textAnimationStyle: z.string().default("magical-reveal"),

  // Interactividad
  interactivityLevel: z.string().default("immersive"),
  userExperienceFeatures: z.array(z.string()).default(["micro-interactions", "scroll-experiences"]),

  // Optimización
  responsiveDesign: z.boolean().default(true),
  mobilePriority: z.string().default("mobile-first"),
  optimizePerformance: z.boolean().default(true),
  browserCompatibility: z.array(z.string()).default(["modern", "blogger"]),

  // Contenido
  includeComments: z.boolean().default(true),
  commentDetail: z.string().default("extensive"),
  specificFunctionality: z.string().optional(),
  additionalInstructions: z.string().optional(),

  // Configuración del prompt
  actAsExpert: z.boolean().default(true),
  expertiseLevel: z.string().default("visionary"),
  yearReference: z.string().default("2025"),
  includeExampleContent: z.boolean().default(true),
  outputFormat: z.string().default("complete"),
  promptLength: z.string().default("extensive"),
  bloggerCompatible: z.boolean().default(true),
  bloggerOptimizations: z.array(z.string()).default(["widget-ready", "template-compatible"]),
})

// Opciones expandidas para cada categoría
const OPTIONS = {
  codeTypes: [
    { value: "component", label: "Componente UI Vanguardista" },
    { value: "section", label: "Sección de Página Inmersiva" },
    { value: "landing", label: "Landing Page Mística" },
    { value: "cards", label: "Tarjetas de Servicios Animadas" },
    { value: "gallery", label: "Galería Dimensional" },
    { value: "form", label: "Formulario Místico Interactivo" },
    { value: "hero", label: "Hero Section Transcendental" },
    { value: "footer", label: "Footer Esotérico Animado" },
    { value: "navbar", label: "Barra de Navegación Mágica" },
    { value: "tarot-reader", label: "Lector de Tarot Interactivo" },
    { value: "horoscope", label: "Horóscopo Dinámico" },
    { value: "ritual", label: "Ritual Virtual Inmersivo" },
    { value: "portal", label: "Portal Dimensional" },
    { value: "crystal-viewer", label: "Visualizador de Cristales 3D" },
    { value: "astral-map", label: "Mapa Astral Interactivo" },
    { value: "custom", label: "Personalizado Ultra-Avanzado" },
  ],

  esotericThemes: [
    { value: "tarot", label: "Tarot Visionario" },
    { value: "witchcraft", label: "Brujería Moderna" },
    { value: "astrology", label: "Astrología Cósmica" },
    { value: "alchemy", label: "Alquimia Cuántica" },
    { value: "occult", label: "Ocultismo Digital" },
    { value: "mystical", label: "Misticismo Futurista" },
    { value: "pagan", label: "Paganismo Contemporáneo" },
    { value: "crystals", label: "Cristalomancia Dimensional" },
    { value: "runes", label: "Runas Energéticas" },
    { value: "chakras", label: "Chakras Holográficos" },
    { value: "divination", label: "Adivinación Cuántica" },
    { value: "spells", label: "Hechizos Digitales" },
    { value: "rituals", label: "Rituales Inmersivos" },
    { value: "zodiac", label: "Zodiaco Interdimensional" },
    { value: "sacred-geometry", label: "Geometría Sagrada" },
    { value: "shamanic", label: "Chamanismo Digital" },
    { value: "cosmic", label: "Cosmología Mística" },
    { value: "ethereal", label: "Reinos Etéreos" },
    { value: "mixed", label: "Fusión Esotérica Avanzada" },
  ],

  designLevels: [
    { value: "advanced", label: "Avanzado" },
    { value: "expert", label: "Experto" },
    { value: "ultra-advanced", label: "Ultra Avanzado" },
    { value: "cutting-edge", label: "Última Generación" },
    { value: "visionary", label: "Visionario" },
    { value: "revolutionary", label: "Revolucionario" },
    { value: "transcendent", label: "Trascendental" },
  ],

  visualStyles: [
    { value: "neo-mysticism", label: "Neo-Misticismo" },
    { value: "cyber-occult", label: "Ciber-Ocultismo" },
    { value: "quantum-esoteric", label: "Esoterismo Cuántico" },
    { value: "digital-alchemy", label: "Alquimia Digital" },
    { value: "astral-tech", label: "Astral-Tech" },
    { value: "ethereal-minimalism", label: "Minimalismo Etéreo" },
    { value: "cosmic-brutalism", label: "Brutalismo Cósmico" },
    { value: "mystical-futurism", label: "Futurismo Místico" },
    { value: "arcane-modernism", label: "Modernismo Arcano" },
    { value: "shamanic-tech", label: "Chamanismo Tecnológico" },
  ],

  colorSchemes: [
    { value: "cosmic-gradient", label: "Gradiente Cósmico" },
    { value: "ethereal-glow", label: "Resplandor Etéreo" },
    { value: "mystic-aurora", label: "Aurora Mística" },
    { value: "dark-crystal", label: "Cristal Oscuro" },
    { value: "astral-spectrum", label: "Espectro Astral" },
    { value: "alchemical-metals", label: "Metales Alquímicos" },
    { value: "chakra-flow", label: "Flujo de Chakras" },
    { value: "void-luminescence", label: "Luminiscencia del Vacío" },
    { value: "arcane-pulse", label: "Pulso Arcano" },
    { value: "nebula-burst", label: "Explosión de Nebulosa" },
    { value: "witch-flame", label: "Llama de Bruja" },
    { value: "celestial-harmony", label: "Armonía Celestial" },
    { value: "quantum-shift", label: "Cambio Cuántico" },
    { value: "dimensional-rift", label: "Fisura Dimensional" },
  ],

  containerStyles: [
    { value: "glass-morphism", label: "Glassmorfismo Místico" },
    { value: "energy-field", label: "Campo de Energía" },
    { value: "crystal-container", label: "Contenedor Cristalino" },
    { value: "astral-portal", label: "Portal Astral" },
    { value: "ethereal-card", label: "Tarjeta Etérea" },
    { value: "dimensional-box", label: "Caja Dimensional" },
    { value: "arcane-frame", label: "Marco Arcano" },
    { value: "quantum-container", label: "Contenedor Cuántico" },
    { value: "void-vessel", label: "Recipiente del Vacío" },
  ],

  borderStyles: [
    { value: "energy-flow", label: "Flujo de Energía" },
    { value: "arcane-sigil", label: "Sigilo Arcano" },
    { value: "astral-glow", label: "Resplandor Astral" },
    { value: "crystal-edge", label: "Borde Cristalino" },
    { value: "runic-pattern", label: "Patrón Rúnico" },
    { value: "ethereal-mist", label: "Niebla Etérea" },
    { value: "cosmic-thread", label: "Hilo Cósmico" },
    { value: "quantum-pulse", label: "Pulso Cuántico" },
    { value: "void-outline", label: "Contorno del Vacío" },
  ],

  cornerStyles: [
    { value: "crystal-cut", label: "Corte Cristalino" },
    { value: "energy-node", label: "Nodo de Energía" },
    { value: "arcane-point", label: "Punto Arcano" },
    { value: "astral-curve", label: "Curva Astral" },
    { value: "runic-corner", label: "Esquina Rúnica" },
    { value: "ethereal-blend", label: "Fusión Etérea" },
    { value: "cosmic-angle", label: "Ángulo Cósmico" },
    { value: "quantum-corner", label: "Esquina Cuántica" },
  ],

  backgroundTypes: [
    { value: "animated-gradient", label: "Gradiente Animado" },
    { value: "particle-field", label: "Campo de Partículas" },
    { value: "cosmic-nebula", label: "Nebulosa Cósmica" },
    { value: "energy-waves", label: "Ondas de Energía" },
    { value: "astral-projection", label: "Proyección Astral" },
    { value: "ethereal-mist", label: "Niebla Etérea" },
    { value: "dimensional-portal", label: "Portal Dimensional" },
    { value: "sacred-geometry", label: "Geometría Sagrada" },
    { value: "arcane-symbols", label: "Símbolos Arcanos" },
    { value: "quantum-field", label: "Campo Cuántico" },
  ],

  backgroundVideoThemes: [
    { value: "cosmic", label: "Cosmos y Nebulosas" },
    { value: "mystical-nature", label: "Naturaleza Mística" },
    { value: "energy-flow", label: "Flujo de Energía" },
    { value: "astral-journey", label: "Viaje Astral" },
    { value: "ethereal-lights", label: "Luces Etéreas" },
    { value: "sacred-rituals", label: "Rituales Sagrados" },
    { value: "crystal-formations", label: "Formaciones Cristalinas" },
    { value: "alchemical-transformations", label: "Transformaciones Alquímicas" },
  ],

  patternStyles: [
    { value: "sacred-geometry", label: "Geometría Sagrada" },
    { value: "runic-inscriptions", label: "Inscripciones Rúnicas" },
    { value: "astral-constellations", label: "Constelaciones Astrales" },
    { value: "alchemical-symbols", label: "Símbolos Alquímicos" },
    { value: "chakra-mandalas", label: "Mandalas de Chakras" },
    { value: "cosmic-fractals", label: "Fractales Cósmicos" },
    { value: "ethereal-weave", label: "Tejido Etéreo" },
    { value: "quantum-patterns", label: "Patrones Cuánticos" },
  ],

  animationLevels: [
    { value: "moderate", label: "Moderado" },
    { value: "elaborate", label: "Elaborado" },
    { value: "intense", label: "Intenso" },
    { value: "magical", label: "Mágico" },
    { value: "immersive", label: "Inmersivo" },
    { value: "transcendent", label: "Trascendental" },
    { value: "reality-bending", label: "Alterador de Realidad" },
  ],

  animationTriggers: [
    { value: "scroll", label: "Al Desplazarse" },
    { value: "hover", label: "Al Pasar el Cursor" },
    { value: "click", label: "Al Hacer Clic" },
    { value: "time-based", label: "Basado en Tiempo" },
    { value: "load", label: "Al Cargar" },
    { value: "viewport", label: "Al Entrar en Viewport" },
    { value: "interaction", label: "Interacción del Usuario" },
    { value: "sequence", label: "Secuencia Programada" },
  ],

  specialEffects: [
    { value: "particle-effects", label: "Efectos de Partículas" },
    { value: "glow-effects", label: "Efectos de Resplandor" },
    { value: "energy-trails", label: "Estelas de Energía" },
    { value: "dimensional-shifts", label: "Cambios Dimensionales" },
    { value: "liquid-animations", label: "Animaciones Líquidas" },
    { value: "magical-reveals", label: "Revelaciones Mágicas" },
    { value: "astral-projections", label: "Proyecciones Astrales" },
    { value: "time-distortions", label: "Distorsiones Temporales" },
    { value: "reality-glitches", label: "Fallos de Realidad" },
    { value: "ethereal-transitions", label: "Transiciones Etéreas" },
  ],

  frameworks: [
    { value: "tailwind", label: "Tailwind CSS" },
    { value: "bootstrap", label: "Bootstrap" },
    { value: "gsap", label: "GSAP (Animaciones Avanzadas)" },
    { value: "three-js", label: "Three.js (3D Inmersivo)" },
    { value: "anime-js", label: "Anime.js (Animaciones Suaves)" },
    { value: "aos", label: "AOS (Animate On Scroll)" },
    { value: "particles-js", label: "Particles.js (Efectos de Partículas)" },
    { value: "typed-js", label: "Typed.js (Texto Animado)" },
    { value: "lottie", label: "Lottie (Animaciones Vectoriales)" },
    { value: "pixi-js", label: "Pixi.js (Gráficos 2D Avanzados)" },
    { value: "matter-js", label: "Matter.js (Física 2D)" },
    { value: "p5-js", label: "p5.js (Gráficos Creativos)" },
    { value: "vanilla", label: "Vanilla CSS/JS Avanzado" },
  ],

  advancedTechniques: [
    { value: "css-variables", label: "Variables CSS Dinámicas" },
    { value: "custom-properties", label: "Propiedades Personalizadas" },
    { value: "grid-layout", label: "Layouts con CSS Grid Avanzado" },
    { value: "flex-layout", label: "Flexbox Complejo" },
    { value: "css-animations", label: "Animaciones CSS Avanzadas" },
    { value: "css-filters", label: "Filtros CSS Creativos" },
    { value: "blend-modes", label: "Modos de Fusión" },
    { value: "mask-effects", label: "Efectos de Máscara" },
    { value: "clip-path", label: "Recortes con Clip-path" },
    { value: "svg-animations", label: "Animaciones SVG" },
    { value: "canvas-drawing", label: "Dibujo en Canvas" },
    { value: "webgl-shaders", label: "Shaders WebGL" },
    { value: "scroll-effects", label: "Efectos de Desplazamiento" },
    { value: "parallax-depth", label: "Profundidad Parallax" },
  ],

  fontStyles: [
    { value: "mystical", label: "Místicas" },
    { value: "futuristic", label: "Futuristas" },
    { value: "gothic", label: "Góticas" },
    { value: "elegant", label: "Elegantes" },
    { value: "handwritten", label: "Manuscritas" },
    { value: "decorative", label: "Decorativas" },
    { value: "runic", label: "Rúnicas" },
    { value: "celestial", label: "Celestiales" },
    { value: "arcane", label: "Arcanas" },
    { value: "ethereal", label: "Etéreas" },
    { value: "cosmic", label: "Cósmicas" },
    { value: "alchemical", label: "Alquímicas" },
  ],

  typographyEffects: [
    { value: "glowing-text", label: "Texto Resplandeciente" },
    { value: "animated-text", label: "Texto Animado" },
    { value: "gradient-text", label: "Texto con Gradiente" },
    { value: "textured-text", label: "Texto con Textura" },
    { value: "shadow-text", label: "Texto con Sombras Avanzadas" },
    { value: "outlined-text", label: "Texto con Contorno" },
    { value: "distorted-text", label: "Texto Distorsionado" },
    { value: "masked-text", label: "Texto con Máscara" },
    { value: "liquid-text", label: "Texto Líquido" },
    { value: "3d-text", label: "Texto 3D" },
  ],

  textAnimationStyles: [
    { value: "magical-reveal", label: "Revelación Mágica" },
    { value: "energy-pulse", label: "Pulso de Energía" },
    { value: "cosmic-wave", label: "Onda Cósmica" },
    { value: "mystical-transform", label: "Transformación Mística" },
    { value: "ethereal-fade", label: "Desvanecimiento Etéreo" },
    { value: "arcane-glow", label: "Resplandor Arcano" },
    { value: "dimensional-shift", label: "Cambio Dimensional" },
    { value: "quantum-flicker", label: "Parpadeo Cuántico" },
  ],

  interactivityLevels: [
    { value: "basic", label: "Básico" },
    { value: "enhanced", label: "Mejorado" },
    { value: "advanced", label: "Avanzado" },
    { value: "immersive", label: "Inmersivo" },
    { value: "experiential", label: "Experiencial" },
    { value: "transformative", label: "Transformador" },
  ],

  userExperienceFeatures: [
    { value: "micro-interactions", label: "Micro-interacciones" },
    { value: "scroll-experiences", label: "Experiencias de Desplazamiento" },
    { value: "cursor-effects", label: "Efectos de Cursor" },
    { value: "interactive-elements", label: "Elementos Interactivos" },
    { value: "dynamic-content", label: "Contenido Dinámico" },
    { value: "responsive-animations", label: "Animaciones Responsivas" },
    { value: "gesture-controls", label: "Controles por Gestos" },
    { value: "audio-feedback", label: "Retroalimentación de Audio" },
    { value: "haptic-feedback", label: "Retroalimentación Háptica" },
    { value: "immersive-storytelling", label: "Narrativa Inmersiva" },
  ],

  mobilePriorities: [
    { value: "mobile-first", label: "Mobile-First" },
    { value: "mobile-optimized", label: "Optimizado para Móvil" },
    { value: "responsive-plus", label: "Responsive Plus" },
    { value: "adaptive-design", label: "Diseño Adaptativo" },
    { value: "universal-experience", label: "Experiencia Universal" },
  ],

  browserCompatibility: [
    { value: "modern", label: "Navegadores Modernos" },
    { value: "cross-browser", label: "Compatibilidad Cruzada" },
    { value: "blogger", label: "Optimizado para Blogger" },
    { value: "legacy-support", label: "Soporte para Legacy" },
  ],

  commentDetails: [
    { value: "basic", label: "Básico" },
    { value: "detailed", label: "Detallado" },
    { value: "extensive", label: "Extensivo" },
    { value: "educational", label: "Educativo" },
    { value: "comprehensive", label: "Comprensivo" },
  ],

  expertiseLevels: [
    { value: "expert", label: "Experto" },
    { value: "master", label: "Maestro" },
    { value: "visionary", label: "Visionario" },
    { value: "revolutionary", label: "Revolucionario" },
    { value: "transcendent", label: "Trascendental" },
  ],

  yearReferences: [
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
    { value: "future", label: "Tecnología Futura" },
  ],

  outputFormats: [
    { value: "complete", label: "Código Completo (HTML, CSS, JS)" },
    { value: "html-css", label: "Solo HTML y CSS" },
    { value: "component", label: "Componente React/Vue" },
    { value: "blogger-template", label: "Template para Blogger" },
    { value: "widget-code", label: "Widget para Blogger" },
    { value: "full-page", label: "Página Completa" },
  ],

  promptLengths: [
    { value: "concise", label: "Conciso" },
    { value: "detailed", label: "Detallado" },
    { value: "extensive", label: "Extenso" },
    { value: "comprehensive", label: "Comprensivo" },
    { value: "exhaustive", label: "Exhaustivo" },
  ],

  bloggerOptimizations: [
    { value: "widget-ready", label: "Listo para Widget" },
    { value: "template-compatible", label: "Compatible con Plantillas" },
    { value: "custom-theme", label: "Tema Personalizado" },
    { value: "gadget-optimized", label: "Optimizado para Gadgets" },
    { value: "xml-compatible", label: "Compatible con XML" },
    { value: "mobile-template", label: "Plantilla Móvil" },
    { value: "amp-ready", label: "Listo para AMP" },
  ],
}

type EsotericCodeGeneratorProps = {
  onGenerate: (data: z.infer<typeof formSchema>) => void
  isGenerating: boolean
}

export function EsotericCodeGenerator({ onGenerate, isGenerating }: EsotericCodeGeneratorProps) {
  // Estados para controlar la visualización de secciones condicionales
  const [showAnimationOptions, setShowAnimationOptions] = useState(true)
  const [showFrameworkOptions, setShowFrameworkOptions] = useState(true)
  const [showFontOptions, setShowFontOptions] = useState(true)
  const [showBackgroundVideoOptions, setShowBackgroundVideoOptions] = useState(false)
  const [showBackgroundPatternOptions, setShowBackgroundPatternOptions] = useState(true)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  // Inicializar el formulario con valores predeterminados
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codeType: "component",
      esotericTheme: "tarot",
      designLevel: "ultra-advanced",
      visualStyle: "neo-mysticism",
      colorScheme: ["cosmic-gradient", "ethereal-glow"],
      containerStyle: "glass-morphism",
      borderStyle: "energy-flow",
      cornerStyle: "crystal-cut",
      backgroundType: "animated-gradient",
      useParallaxEffect: true,
      useBackgroundVideo: false,
      backgroundVideoTheme: "cosmic",
      useBackgroundPatterns: true,
      patternStyle: "sacred-geometry",
      includeAnimations: true,
      animationLevel: "immersive",
      animationTriggers: ["scroll", "hover", "time-based"],
      specialEffects: ["particle-effects", "glow-effects"],
      useWebGL: true,
      use3DElements: true,
      useFrameworks: true,
      frameworks: ["tailwind", "gsap", "three-js"],
      advancedTechniques: ["css-variables", "custom-properties", "grid-layout"],
      useCustomWebComponents: true,
      useGoogleFonts: true,
      fontStyles: ["mystical", "futuristic"],
      typographyEffects: ["glowing-text", "animated-text"],
      textAnimationStyle: "magical-reveal",
      interactivityLevel: "immersive",
      userExperienceFeatures: ["micro-interactions", "scroll-experiences"],
      responsiveDesign: true,
      mobilePriority: "mobile-first",
      optimizePerformance: true,
      browserCompatibility: ["modern", "blogger"],
      includeComments: true,
      commentDetail: "extensive",
      actAsExpert: true,
      expertiseLevel: "visionary",
      yearReference: "2025",
      includeExampleContent: true,
      outputFormat: "complete",
      promptLength: "extensive",
      bloggerCompatible: true,
      bloggerOptimizations: ["widget-ready", "template-compatible"],
    },
  })

  // Observar cambios en los campos que controlan la visualización condicional
  const includeAnimations = watch("includeAnimations")
  const useFrameworks = watch("useFrameworks")
  const useGoogleFonts = watch("useGoogleFonts")
  const useBackgroundVideo = watch("useBackgroundVideo")
  const useBackgroundPatterns = watch("useBackgroundPatterns")

  // Actualizar estados de visualización cuando cambian los valores observados
  useEffect(() => {
    setShowAnimationOptions(includeAnimations)
    setShowFrameworkOptions(useFrameworks)
    setShowFontOptions(useGoogleFonts)
    setShowBackgroundVideoOptions(useBackgroundVideo)
    setShowBackgroundPatternOptions(useBackgroundPatterns)
  }, [includeAnimations, useFrameworks, useGoogleFonts, useBackgroundVideo, useBackgroundPatterns])

  // Manejar cambios en los checkboxes de arrays
  const handleCheckboxChange = useCallback(
    (field: string, value: string, checked: boolean) => {
      const currentValues = watch(field as any) || []

      if (checked) {
        setValue(field as any, [...currentValues, value])
      } else {
        setValue(
          field as any,
          currentValues.filter((v: string) => v !== value),
        )
      }
    },
    [watch, setValue],
  )

  // Manejar el envío del formulario
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onGenerate(data)
  }

  // Función para renderizar checkboxes para arrays
  const renderCheckboxGroup = (field: string, options: { value: string; label: string }[], columns = 2) => {
    const values = watch(field as any) || []

    return (
      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-2`}>
        {options.map((option) => {
          const isChecked = values.includes(option.value)

          return (
            <div key={option.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`${field}-${option.value}`}
                checked={isChecked}
                onChange={(e) => handleCheckboxChange(field, option.value, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor={`${field}-${option.value}`} className="text-sm">
                {option.label}
              </label>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="p-1">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Sección: Tipo de Código y Estilo Visual */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Tipo de Código y Estilo Visual</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="text-xs"
              >
                {showAdvancedOptions ? "Ocultar opciones avanzadas" : "Mostrar opciones avanzadas"}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="codeType" className="block text-sm font-medium">
                  Tipo de Componente
                </label>
                <select
                  id="codeType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register("codeType")}
                >
                  {OPTIONS.codeTypes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-muted-foreground">Elige el tipo de código vanguardista que deseas generar</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="esotericTheme" className="block text-sm font-medium">
                  Temática Esotérica
                </label>
                <select
                  id="esotericTheme"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register("esotericTheme")}
                >
                  {OPTIONS.esotericThemes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-muted-foreground">Elige la temática esotérica principal para tu diseño</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="designLevel" className="block text-sm font-medium">
                  Nivel de Diseño
                </label>
                <select
                  id="designLevel"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register("designLevel")}
                >
                  {OPTIONS.designLevels.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-muted-foreground">Elige la complejidad y sofisticación del diseño</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="visualStyle" className="block text-sm font-medium">
                  Estilo Visual
                </label>
                <select
                  id="visualStyle"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register("visualStyle")}
                >
                  {OPTIONS.visualStyles.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-muted-foreground">Define el estilo visual vanguardista para tu diseño</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Esquema de Colores</label>
                <p className="text-sm text-muted-foreground mb-2">Selecciona los colores principales para el diseño</p>
                {renderCheckboxGroup("colorScheme", OPTIONS.colorSchemes, 2)}
              </div>

              <div className="space-y-2">
                <label htmlFor="customColorPalette" className="block text-sm font-medium">
                  Paleta de Colores Personalizada (Opcional)
                </label>
                <input
                  type="text"
                  id="customColorPalette"
                  placeholder="Ej: #3a1c71, #d76d77, #ffaf7b, rgba(60,20,110,0.8)..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register("customColorPalette")}
                />
                <p className="text-sm text-muted-foreground">Especifica colores personalizados (HEX, RGB, HSL)</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Sección: Contenedores y Bordes */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Contenedores y Bordes</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="containerStyle" className="block text-sm font-medium">
                  Estilo de Contenedor
                </label>
                <select
                  id="containerStyle"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register("containerStyle")}
                >
                  {OPTIONS.containerStyles.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-muted-foreground">Define el estilo principal para los contenedores</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="borderStyle" className="block text-sm font-medium">
                  Estilo de Borde
                </label>
                <select
                  id="borderStyle"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register("borderStyle")}
                >
                  {OPTIONS.borderStyles.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-muted-foreground">Elige el estilo para los bordes de los elementos</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="cornerStyle" className="block text-sm font-medium">
                  Estilo de Esquinas
                </label>
                <select
                  id="cornerStyle"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register("cornerStyle")}
                >
                  {OPTIONS.cornerStyles.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-muted-foreground">Define el estilo para las esquinas de los elementos</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Sección: Fondos */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Fondos y Efectos de Fondo</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="backgroundType" className="block text-sm font-medium">
                  Tipo de Fondo
                </label>
                <select
                  id="backgroundType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register("backgroundType")}
                >
                  {OPTIONS.backgroundTypes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-muted-foreground">Elige el tipo de fondo principal para tu diseño</p>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <label htmlFor="useParallaxEffect" className="text-sm font-medium">
                    Efecto Parallax
                  </label>
                  <p className="text-sm text-muted-foreground">Añadir efecto de profundidad al desplazarse</p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    id="useParallaxEffect"
                    {...register("useParallaxEffect")}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <label htmlFor="useBackgroundVideo" className="text-sm font-medium">
                    Fondo con Video
                  </label>
                  <p className="text-sm text-muted-foreground">Utilizar video como fondo para mayor impacto visual</p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    id="useBackgroundVideo"
                    {...register("useBackgroundVideo")}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>

              {showBackgroundVideoOptions && (
                <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                  <label htmlFor="backgroundVideoTheme" className="block text-sm font-medium">
                    Temática del Video de Fondo
                  </label>
                  <select
                    id="backgroundVideoTheme"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...register("backgroundVideoTheme")}
                  >
                    {OPTIONS.backgroundVideoThemes.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-muted-foreground">Elige la temática para el video de fondo</p>
                </div>
              )}

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <label htmlFor="useBackgroundPatterns" className="text-sm font-medium">
                    Patrones de Fondo
                  </label>
                  <p className="text-sm text-muted-foreground">Incluir patrones esotéricos en el fondo</p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    id="useBackgroundPatterns"
                    {...register("useBackgroundPatterns")}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>

              {showBackgroundPatternOptions && (
                <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                  <label htmlFor="patternStyle" className="block text-sm font-medium">
                    Estilo de Patrón
                  </label>
                  <select
                    id="patternStyle"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...register("patternStyle")}
                  >
                    {OPTIONS.patternStyles.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-muted-foreground">Elige el estilo de patrón para el fondo</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Sección: Animaciones y Efectos */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Animaciones y Efectos Especiales</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <label htmlFor="includeAnimations" className="text-sm font-medium">
                    Incluir Animaciones Avanzadas
                  </label>
                  <p className="text-sm text-muted-foreground">Añadir efectos y animaciones vanguardistas al diseño</p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    id="includeAnimations"
                    {...register("includeAnimations")}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>

              {showAnimationOptions && (
                <>
                  <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                    <label htmlFor="animationLevel" className="block text-sm font-medium">
                      Nivel de Animación
                    </label>
                    <select
                      id="animationLevel"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      {...register("animationLevel")}
                    >
                      {OPTIONS.animationLevels.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-muted-foreground">
                      Elige la intensidad y complejidad de las animaciones
                    </p>
                  </div>

                  <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                    <label className="block text-sm font-medium">Disparadores de Animación</label>
                    <p className="text-sm text-muted-foreground mb-2">Selecciona cuándo se activarán las animaciones</p>
                    {renderCheckboxGroup("animationTriggers", OPTIONS.animationTriggers, 2)}
                  </div>

                  <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                    <label className="block text-sm font-medium">Efectos Especiales</label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Selecciona efectos visuales avanzados para incluir
                    </p>
                    {renderCheckboxGroup("specialEffects", OPTIONS.specialEffects, 2)}
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4 ml-4">
                    <div>
                      <label htmlFor="useWebGL" className="text-sm font-medium">
                        Usar WebGL
                      </label>
                      <p className="text-sm text-muted-foreground">Incluir efectos avanzados con WebGL</p>
                    </div>
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        id="useWebGL"
                        {...register("useWebGL")}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4 ml-4">
                    <div>
                      <label htmlFor="use3DElements" className="text-sm font-medium">
                        Elementos 3D
                      </label>
                      <p className="text-sm text-muted-foreground">Incluir elementos tridimensionales</p>
                    </div>
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        id="use3DElements"
                        {...register("use3DElements")}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Sección: Tecnologías y Frameworks */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Tecnologías y Frameworks</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <label htmlFor="useFrameworks" className="text-sm font-medium">
                    Usar Frameworks Avanzados
                  </label>
                  <p className="text-sm text-muted-foreground">Utilizar frameworks y bibliotecas modernas</p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    id="useFrameworks"
                    {...register("useFrameworks")}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>

              {showFrameworkOptions && (
                <>
                  <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                    <label className="block text-sm font-medium">Frameworks y Bibliotecas</label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Selecciona los frameworks y bibliotecas que deseas utilizar
                    </p>
                    {renderCheckboxGroup("frameworks", OPTIONS.frameworks, 2)}
                  </div>

                  <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                    <label className="block text-sm font-medium">Técnicas Avanzadas</label>
                    <p className="text-sm text-muted-foreground mb-2">Selecciona técnicas avanzadas de desarrollo</p>
                    {renderCheckboxGroup("advancedTechniques", OPTIONS.advancedTechniques, 2)}
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4 ml-4">
                    <div>
                      <label htmlFor="useCustomWebComponents" className="text-sm font-medium">
                        Web Components Personalizados
                      </label>
                      <p className="text-sm text-muted-foreground">Crear componentes web personalizados</p>
                    </div>
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        id="useCustomWebComponents"
                        {...register("useCustomWebComponents")}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Sección: Tipografía */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Tipografía Avanzada</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <label htmlFor="useGoogleFonts" className="text-sm font-medium">
                    Usar Google Fonts
                  </label>
                  <p className="text-sm text-muted-foreground">Incluir fuentes modernas de Google Fonts</p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    id="useGoogleFonts"
                    {...register("useGoogleFonts")}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>

              {showFontOptions && (
                <>
                  <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                    <label className="block text-sm font-medium">Estilos de Fuentes</label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Selecciona los estilos de fuentes que deseas utilizar
                    </p>
                    {renderCheckboxGroup("fontStyles", OPTIONS.fontStyles, 2)}
                  </div>

                  <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                    <label htmlFor="specificFonts" className="block text-sm font-medium">
                      Fuentes Específicas (Opcional)
                    </label>
                    <input
                      type="text"
                      id="specificFonts"
                      placeholder="Ej: Cinzel, Playfair Display, Poppins..."
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      {...register("specificFonts")}
                    />
                    <p className="text-sm text-muted-foreground">
                      Especifica fuentes de Google que deseas utilizar (separadas por comas)
                    </p>
                  </div>

                  <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                    <label className="block text-sm font-medium">Efectos de Tipografía</label>
                    <p className="text-sm text-muted-foreground mb-2">Selecciona efectos especiales para el texto</p>
                    {renderCheckboxGroup("typographyEffects", OPTIONS.typographyEffects, 2)}
                  </div>

                  <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                    <label htmlFor="textAnimationStyle" className="block text-sm font-medium">
                      Estilo de Animación de Texto
                    </label>
                    <select
                      id="textAnimationStyle"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      {...register("textAnimationStyle")}
                    >
                      {OPTIONS.textAnimationStyles.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-muted-foreground">Elige el estilo de animación para los textos</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Sección: Interactividad y Experiencia de Usuario */}
          {showAdvancedOptions && (
            <>
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Interactividad y Experiencia de Usuario</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="interactivityLevel" className="block text-sm font-medium">
                      Nivel de Interactividad
                    </label>
                    <select
                      id="interactivityLevel"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      {...register("interactivityLevel")}
                    >
                      {OPTIONS.interactivityLevels.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-muted-foreground">Define el nivel de interactividad del diseño</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Características de Experiencia de Usuario</label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Selecciona características para mejorar la experiencia
                    </p>
                    {renderCheckboxGroup("userExperienceFeatures", OPTIONS.userExperienceFeatures, 2)}
                  </div>
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Sección: Optimización */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Optimización y Compatibilidad</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <label htmlFor="responsiveDesign" className="text-sm font-medium">
                    Diseño Responsivo Avanzado
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Optimizado para todos los dispositivos con técnicas avanzadas
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    id="responsiveDesign"
                    {...register("responsiveDesign")}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="mobilePriority" className="block text-sm font-medium">
                  Prioridad Móvil
                </label>
                <select
                  id="mobilePriority"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register("mobilePriority")}
                >
                  {OPTIONS.mobilePriorities.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-muted-foreground">
                  Define la estrategia de optimización para dispositivos móviles
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <label htmlFor="optimizePerformance" className="text-sm font-medium">
                    Optimizar Rendimiento
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Código optimizado para carga rápida y rendimiento fluido
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    id="optimizePerformance"
                    {...register("optimizePerformance")}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Compatibilidad con Navegadores</label>
                <p className="text-sm text-muted-foreground mb-2">Selecciona los niveles de compatibilidad</p>
                {renderCheckboxGroup("browserCompatibility", OPTIONS.browserCompatibility, 2)}
              </div>
            </div>
          </div>

          <Separator />

          {/* Sección: Contenido y Comentarios */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Contenido y Documentación</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <label htmlFor="includeComments" className="text-sm font-medium">
                    Incluir Comentarios Detallados
                  </label>
                  <p className="text-sm text-muted-foreground">Añadir comentarios explicativos en el código</p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    id="includeComments"
                    {...register("includeComments")}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>

              {watch("includeComments") && (
                <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                  <label htmlFor="commentDetail" className="block text-sm font-medium">
                    Nivel de Detalle en Comentarios
                  </label>
                  <select
                    id="commentDetail"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...register("commentDetail")}
                  >
                    {OPTIONS.commentDetails.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-muted-foreground">Define el nivel de detalle para los comentarios</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="specificFunctionality" className="block text-sm font-medium">
                  Funcionalidad Específica (Opcional)
                </label>
                <textarea
                  id="specificFunctionality"
                  placeholder="Ej: Tarjetas de tarot que muestren servicios con animación al pasar el cursor..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register("specificFunctionality")}
                />
                <p className="text-sm text-muted-foreground">Describe la funcionalidad específica que deseas incluir</p>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <label htmlFor="includeExampleContent" className="text-sm font-medium">
                    Incluir Contenido de Ejemplo
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Añadir textos e imágenes de ejemplo relacionados con la temática
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    id="includeExampleContent"
                    {...register("includeExampleContent")}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Sección: Formato del Prompt */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Configuración del Prompt</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <label htmlFor="actAsExpert" className="text-sm font-medium">
                    Actuar como Experto Visionario
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Incluir instrucción para actuar como experto en programación avanzada
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    id="actAsExpert"
                    {...register("actAsExpert")}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>

              {watch("actAsExpert") && (
                <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                  <label htmlFor="expertiseLevel" className="block text-sm font-medium">
                    Nivel de Expertise
                  </label>
                  <select
                    id="expertiseLevel"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...register("expertiseLevel")}
                  >
                    {OPTIONS.expertiseLevels.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-muted-foreground">Define el nivel de expertise para el prompt</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="yearReference" className="block text-sm font-medium">
                  Referencia de Año
                </label>
                <select
                  id="yearReference"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register("yearReference")}
                >
                  {OPTIONS.yearReferences.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-muted-foreground">Año de referencia para las tecnologías</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="outputFormat" className="block text-sm font-medium">
                  Formato de Salida
                </label>
                <select
                  id="outputFormat"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register("outputFormat")}
                >
                  {OPTIONS.outputFormats.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-muted-foreground">Formato del código generado</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="promptLength" className="block text-sm font-medium">
                  Extensión del Prompt
                </label>
                <select
                  id="promptLength"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register("promptLength")}
                >
                  {OPTIONS.promptLengths.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-muted-foreground">Define la extensión y detalle del prompt generado</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="additionalInstructions" className="block text-sm font-medium">
                  Instrucciones Adicionales (Opcional)
                </label>
                <textarea
                  id="additionalInstructions"
                  placeholder="Instrucciones adicionales para la generación del código..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register("additionalInstructions")}
                />
                <p className="text-sm text-muted-foreground">
                  Añade cualquier instrucción adicional para la generación del código
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Sección: Compatibilidad con Blogger */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Compatibilidad con Blogger</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <label htmlFor="bloggerCompatible" className="text-sm font-medium">
                    Compatible con Blogger
                  </label>
                  <p className="text-sm text-muted-foreground">Optimizado para funcionar en Blogger/Blogspot</p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    id="bloggerCompatible"
                    {...register("bloggerCompatible")}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>

              {watch("bloggerCompatible") && (
                <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                  <label className="block text-sm font-medium">Optimizaciones para Blogger</label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Selecciona optimizaciones específicas para Blogger
                  </p>
                  {renderCheckboxGroup("bloggerOptimizations", OPTIONS.bloggerOptimizations, 2)}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando Prompt Vanguardista...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generar Prompt de Código Esotérico Vanguardista
              </>
            )}
          </Button>
        </form>
      </div>
    </ScrollArea>
  )
}

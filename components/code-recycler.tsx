"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyIcon, DownloadIcon, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Esquema para el formulario de reciclaje de código
const recyclerFormSchema = z.object({
  componentType: z.string({
    required_error: "Por favor selecciona un tipo de componente",
  }),
  originalCode: z.string().min(10, {
    message: "Por favor ingresa el código original (mínimo 10 caracteres)",
  }),
  // Opciones generales
  preserveClassNames: z.boolean().default(true),
  preserveAttributes: z.boolean().default(true),
  preserveEventHandlers: z.boolean().default(true),
  // Opciones de estilo
  styleModification: z.string().default("enhance"),
  colorScheme: z.array(z.string()).default([]),
  borderRadius: z.number().default(8),
  shadowIntensity: z.number().default(5),
  // Opciones de animación
  animationType: z.string().default("none"),
  animationDuration: z.number().default(300),
  animationTiming: z.string().default("ease"),
  animationDelay: z.number().default(0),
  // Opciones de interactividad
  addHoverEffects: z.boolean().default(false),
  addClickEffects: z.boolean().default(false),
  addFocusEffects: z.boolean().default(false),
  // Opciones específicas para sliders
  sliderOptions: z
    .object({
      autoplay: z.boolean().default(false),
      autoplaySpeed: z.number().default(3000),
      infinite: z.boolean().default(true),
      dots: z.boolean().default(true),
      arrows: z.boolean().default(true),
      adaptiveHeight: z.boolean().default(false),
      centerMode: z.boolean().default(false),
      slidesToShow: z.number().default(1),
      slidesToScroll: z.number().default(1),
      fade: z.boolean().default(false),
      verticalMode: z.boolean().default(false),
      customPagination: z.boolean().default(false),
      customArrows: z.boolean().default(false),
      progressBar: z.boolean().default(false),
      thumbnailNav: z.boolean().default(false),
      keyboardNavigation: z.boolean().default(false),
      touchSwipe: z.boolean().default(true),
      mouseWheel: z.boolean().default(false),
      pauseOnHover: z.boolean().default(true),
      lazyLoad: z.boolean().default(false),
      transitionEffect: z.string().default("slide"),
    })
    .optional(),
  // Opciones específicas para galerías
  galleryOptions: z
    .object({
      layout: z.string().default("grid"),
      itemsPerRow: z.number().default(3),
      gap: z.number().default(16),
      aspectRatio: z.string().default("1:1"),
      lightbox: z.boolean().default(false),
      masonry: z.boolean().default(false),
      filter: z.boolean().default(false),
      shuffle: z.boolean().default(false),
      infiniteScroll: z.boolean().default(false),
      loadMore: z.boolean().default(false),
      hoverInfo: z.boolean().default(false),
      captionPosition: z.string().default("bottom"),
      zoomEffect: z.boolean().default(false),
      customCursor: z.boolean().default(false),
    })
    .optional(),
  // Opciones específicas para formularios
  formOptions: z
    .object({
      validation: z.boolean().default(false),
      floatingLabels: z.boolean().default(false),
      inlineValidation: z.boolean().default(false),
      successMessage: z.boolean().default(false),
      errorStyling: z.boolean().default(false),
      requiredMarkers: z.boolean().default(false),
      passwordStrength: z.boolean().default(false),
      characterCount: z.boolean().default(false),
      autoComplete: z.boolean().default(true),
      stepByStep: z.boolean().default(false),
      conditionalFields: z.boolean().default(false),
      datePicker: z.boolean().default(false),
      timePicker: z.boolean().default(false),
      colorPicker: z.boolean().default(false),
      fileDragDrop: z.boolean().default(false),
      autoSave: z.boolean().default(false),
    })
    .optional(),
  // Opciones específicas para navegación
  navOptions: z
    .object({
      sticky: z.boolean().default(false),
      transparent: z.boolean().default(false),
      hamburgerMenu: z.boolean().default(false),
      megaMenu: z.boolean().default(false),
      searchBar: z.boolean().default(false),
      dropdownStyle: z.string().default("standard"),
      highlightActive: z.boolean().default(true),
      scrollIndicator: z.boolean().default(false),
      collapsible: z.boolean().default(false),
      socialIcons: z.boolean().default(false),
      languageSwitcher: z.boolean().default(false),
      darkModeToggle: z.boolean().default(false),
      logoAnimation: z.boolean().default(false),
      ctaButton: z.boolean().default(false),
    })
    .optional(),
  // Opciones específicas para tarjetas
  cardOptions: z
    .object({
      hoverEffect: z.string().default("none"),
      imagePosition: z.string().default("top"),
      contentAlignment: z.string().default("left"),
      footerStyle: z.string().default("standard"),
      headerStyle: z.string().default("standard"),
      borderStyle: z.string().default("solid"),
      cornerStyle: z.string().default("rounded"),
      elevationLevel: z.number().default(1),
      horizontalLayout: z.boolean().default(false),
      flipEffect: z.boolean().default(false),
      tagPosition: z.string().default("top-left"),
      iconPlacement: z.string().default("none"),
      gradientOverlay: z.boolean().default(false),
      textOverflow: z.string().default("ellipsis"),
    })
    .optional(),
  // Opciones de accesibilidad
  improveA11y: z.boolean().default(true),
  addAriaLabels: z.boolean().default(true),
  keyboardFriendly: z.boolean().default(true),
  highContrast: z.boolean().default(false),
  // Opciones de rendimiento
  optimizeForPerformance: z.boolean().default(false),
  lazyLoadImages: z.boolean().default(false),
  reduceCSSSize: z.boolean().default(false),
  minifyJS: z.boolean().default(false),
  // Opciones de compatibilidad
  addPrefixes: z.boolean().default(false),
  addFallbacks: z.boolean().default(false),
  ieSupport: z.boolean().default(false),
  // Opciones de framework
  framework: z.string().default("vanilla"),
  // Opciones de código
  addComments: z.boolean().default(true),
  codeStyle: z.string().default("standard"),
  // Opciones de prompt
  promptDetailLevel: z.string().default("detailed"),
  includeExamples: z.boolean().default(true),
  includeReferences: z.boolean().default(false),
})

// Tipos de componentes disponibles
const componentTypes = [
  { value: "slider", label: "Carrusel / Slider" },
  { value: "gallery", label: "Galería" },
  { value: "form", label: "Formulario" },
  { value: "navigation", label: "Navegación / Menú" },
  { value: "card", label: "Tarjeta / Card" },
  { value: "accordion", label: "Acordeón" },
  { value: "tabs", label: "Pestañas" },
  { value: "modal", label: "Modal / Popup" },
  { value: "button", label: "Botón" },
  { value: "table", label: "Tabla" },
  { value: "chart", label: "Gráfico" },
  { value: "timeline", label: "Línea de Tiempo" },
  { value: "pricing", label: "Tabla de Precios" },
  { value: "testimonial", label: "Testimonios" },
  { value: "counter", label: "Contador" },
  { value: "progress", label: "Barra de Progreso" },
  { value: "video", label: "Reproductor de Video" },
  { value: "audio", label: "Reproductor de Audio" },
  { value: "map", label: "Mapa" },
  { value: "calendar", label: "Calendario" },
  { value: "other", label: "Otro Componente" },
]

// Opciones de estilo
const styleModificationOptions = [
  { value: "enhance", label: "Mejorar (mantener estilo base)" },
  { value: "minimal", label: "Minimalista" },
  { value: "glassmorphism", label: "Glassmorfismo" },
  { value: "neomorphism", label: "Neomorfismo" },
  { value: "brutalist", label: "Brutalista" },
  { value: "retro", label: "Retro / Vintage" },
  { value: "cyberpunk", label: "Ciberpunk" },
  { value: "organic", label: "Orgánico" },
  { value: "abstract", label: "Abstracto" },
  { value: "esoteric", label: "Esotérico / Místico" },
  { value: "futuristic", label: "Futurista" },
  { value: "material", label: "Material Design" },
  { value: "neumorphic", label: "Neumórfico" },
  { value: "skeuomorphic", label: "Skeuomórfico" },
  { value: "flat", label: "Flat Design" },
]

// Opciones de animación
const animationTypeOptions = [
  { value: "none", label: "Sin Animación" },
  { value: "fade", label: "Desvanecimiento" },
  { value: "slide", label: "Deslizamiento" },
  { value: "zoom", label: "Zoom" },
  { value: "flip", label: "Volteo" },
  { value: "rotate", label: "Rotación" },
  { value: "bounce", label: "Rebote" },
  { value: "elastic", label: "Elástico" },
  { value: "pulse", label: "Pulso" },
  { value: "shake", label: "Sacudida" },
  { value: "wobble", label: "Bamboleo" },
  { value: "swing", label: "Balanceo" },
  { value: "tada", label: "Tada" },
  { value: "jello", label: "Gelatina" },
  { value: "heartbeat", label: "Latido" },
  { value: "reveal", label: "Revelación" },
  { value: "typewriter", label: "Máquina de Escribir" },
  { value: "glitch", label: "Glitch" },
  { value: "blur", label: "Desenfoque" },
  { value: "custom", label: "Personalizada" },
]

// Opciones de timing de animación
const animationTimingOptions = [
  { value: "ease", label: "Ease" },
  { value: "linear", label: "Linear" },
  { value: "ease-in", label: "Ease In" },
  { value: "ease-out", label: "Ease Out" },
  { value: "ease-in-out", label: "Ease In Out" },
  { value: "cubic-bezier", label: "Cubic Bezier Personalizado" },
  { value: "spring", label: "Spring" },
  { value: "bounce", label: "Bounce" },
]

// Opciones de transición para sliders
const sliderTransitionOptions = [
  { value: "slide", label: "Deslizamiento" },
  { value: "fade", label: "Desvanecimiento" },
  { value: "zoom", label: "Zoom" },
  { value: "flip", label: "Volteo" },
  { value: "cube", label: "Cubo 3D" },
  { value: "coverflow", label: "Coverflow" },
  { value: "creative", label: "Creativo" },
  { value: "cards", label: "Tarjetas" },
  { value: "parallax", label: "Parallax" },
]

// Opciones de layout para galerías
const galleryLayoutOptions = [
  { value: "grid", label: "Cuadrícula" },
  { value: "masonry", label: "Masonería" },
  { value: "justified", label: "Justificado" },
  { value: "carousel", label: "Carrusel" },
  { value: "slider", label: "Slider" },
  { value: "fullscreen", label: "Pantalla Completa" },
  { value: "polaroid", label: "Polaroid" },
  { value: "metro", label: "Metro" },
  { value: "puzzle", label: "Rompecabezas" },
]

// Opciones de relación de aspecto
const aspectRatioOptions = [
  { value: "1:1", label: "Cuadrado (1:1)" },
  { value: "4:3", label: "Estándar (4:3)" },
  { value: "16:9", label: "Panorámico (16:9)" },
  { value: "21:9", label: "Ultra Panorámico (21:9)" },
  { value: "3:2", label: "Fotografía (3:2)" },
  { value: "2:3", label: "Retrato (2:3)" },
  { value: "9:16", label: "Móvil (9:16)" },
  { value: "custom", label: "Personalizado" },
]

// Opciones de estilo de dropdown para navegación
const dropdownStyleOptions = [
  { value: "standard", label: "Estándar" },
  { value: "mega", label: "Mega Menú" },
  { value: "fullwidth", label: "Ancho Completo" },
  { value: "animated", label: "Animado" },
  { value: "multilevel", label: "Multinivel" },
  { value: "hover", label: "Al Pasar el Cursor" },
  { value: "click", label: "Al Hacer Clic" },
  { value: "accordion", label: "Acordeón" },
]

// Opciones de efecto hover para tarjetas
const cardHoverEffectOptions = [
  { value: "none", label: "Ninguno" },
  { value: "lift", label: "Elevación" },
  { value: "scale", label: "Escala" },
  { value: "glow", label: "Resplandor" },
  { value: "shadow", label: "Sombra" },
  { value: "border", label: "Borde" },
  { value: "rotate", label: "Rotación" },
  { value: "tilt", label: "Inclinación 3D" },
  { value: "reveal", label: "Revelación" },
  { value: "overlay", label: "Superposición" },
  { value: "shine", label: "Brillo" },
  { value: "flip", label: "Volteo" },
]

// Opciones de esquemas de color
const colorSchemeOptions = [
  { id: "monochromatic", label: "Monocromático" },
  { id: "analogous", label: "Análogo" },
  { id: "complementary", label: "Complementario" },
  { id: "triadic", label: "Triádico" },
  { id: "pastel", label: "Pastel" },
  { id: "neon", label: "Neón" },
  { id: "earthy", label: "Terroso" },
  { id: "metallic", label: "Metálico" },
  { id: "gradient", label: "Degradado" },
  { id: "mystical-purple", label: "Púrpura Místico" },
  { id: "cosmic-blue", label: "Azul Cósmico" },
  { id: "emerald-magic", label: "Esmeralda Mágica" },
  { id: "blood-red", label: "Rojo Sangre" },
  { id: "midnight-black", label: "Negro Medianoche" },
  { id: "golden-alchemical", label: "Dorado Alquímico" },
  { id: "silver-lunar", label: "Plateado Lunar" },
]

// Opciones de frameworks
const frameworkOptions = [
  { value: "vanilla", label: "JavaScript Vanilla" },
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "jquery", label: "jQuery" },
]

// Opciones de estilo de código
const codeStyleOptions = [
  { value: "standard", label: "Estándar" },
  { value: "detailed", label: "Detallado con Comentarios" },
  { value: "minimal", label: "Minimalista" },
  { value: "professional", label: "Profesional" },
  { value: "educational", label: "Educativo" },
  { value: "optimized", label: "Optimizado para Rendimiento" },
  { value: "compressed", label: "Comprimido" },
  { value: "semantic", label: "Semántico y Accesible" },
]

// Opciones de nivel de detalle del prompt
const promptDetailLevelOptions = [
  { value: "brief", label: "Breve (instrucciones concisas)" },
  { value: "standard", label: "Estándar (equilibrio entre detalle y brevedad)" },
  { value: "detailed", label: "Detallado (instrucciones exhaustivas)" },
  { value: "expert", label: "Experto (instrucciones técnicas avanzadas)" },
]

type CodeRecyclerProps = {
  onRecycle: (originalCode: string, generatedPrompt: string, options: any) => void
  isProcessing: boolean
}

export default function CodeRecycler({ onRecycle, isProcessing }: CodeRecyclerProps) {
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [activeTab, setActiveTab] = useState("general")

  const form = useForm<z.infer<typeof recyclerFormSchema>>({
    resolver: zodResolver(recyclerFormSchema),
    defaultValues: {
      preserveClassNames: true,
      preserveAttributes: true,
      preserveEventHandlers: true,
      styleModification: "enhance",
      colorScheme: [],
      borderRadius: 8,
      shadowIntensity: 5,
      animationType: "none",
      animationDuration: 300,
      animationTiming: "ease",
      animationDelay: 0,
      addHoverEffects: false,
      addClickEffects: false,
      addFocusEffects: false,
      improveA11y: true,
      addAriaLabels: true,
      keyboardFriendly: true,
      highContrast: false,
      optimizeForPerformance: false,
      lazyLoadImages: false,
      reduceCSSSize: false,
      minifyJS: false,
      addPrefixes: false,
      addFallbacks: false,
      ieSupport: false,
      framework: "vanilla",
      addComments: true,
      codeStyle: "standard",
      promptDetailLevel: "detailed",
      includeExamples: true,
      includeReferences: false,
    },
  })

  // Observar cambios en el tipo de componente para mostrar opciones específicas
  const componentType = form.watch("componentType")

  // Función para generar el prompt basado en las opciones seleccionadas
  function onSubmit(values: z.infer<typeof recyclerFormSchema>) {
    // Generar el prompt basado en las opciones seleccionadas
    const prompt = generatePromptFromOptions(values)

    setGeneratedPrompt(prompt)
    onRecycle(values.originalCode, prompt, values)
  }

  // Función para generar el prompt basado en las opciones seleccionadas
  const generatePromptFromOptions = (values: z.infer<typeof recyclerFormSchema>) => {
    let prompt = `Por favor, recicla y mejora el siguiente código de un componente de tipo ${getComponentTypeLabel(values.componentType)}. A continuación se detallan las mejoras y modificaciones que me gustaría implementar:\n\n`

    // Añadir sección de opciones generales
    prompt += `## OPCIONES GENERALES:\n`
    prompt += `- Estilo visual: ${getStyleModificationLabel(values.styleModification)}\n`
    prompt += `- Framework objetivo: ${getFrameworkLabel(values.framework)}\n`

    if (values.preserveClassNames) {
      prompt += `- Mantener las clases CSS originales\n`
    } else {
      prompt += `- Reemplazar las clases CSS con nuevas optimizadas\n`
    }

    if (values.preserveAttributes) {
      prompt += `- Mantener los atributos HTML originales\n`
    } else {
      prompt += `- Optimizar y actualizar los atributos HTML\n`
    }

    if (values.preserveEventHandlers) {
      prompt += `- Mantener los manejadores de eventos originales\n`
    } else {
      prompt += `- Mejorar y optimizar los manejadores de eventos\n`
    }

    // Añadir sección de estilo
    prompt += `\n## ESTILO Y DISEÑO:\n`

    if (values.colorScheme && values.colorScheme.length > 0) {
      prompt += `- Esquema de color: ${values.colorScheme.map((id) => getColorSchemeLabel(id)).join(", ")}\n`
    }

    prompt += `- Radio de bordes: ${values.borderRadius}px\n`
    prompt += `- Intensidad de sombras: ${values.shadowIntensity}/10\n`

    if (values.addHoverEffects) {
      prompt += `- Añadir efectos al pasar el cursor\n`
    }

    if (values.addClickEffects) {
      prompt += `- Añadir efectos al hacer clic\n`
    }

    if (values.addFocusEffects) {
      prompt += `- Añadir efectos al enfocar elementos\n`
    }

    // Añadir sección de animación
    if (values.animationType !== "none") {
      prompt += `\n## ANIMACIONES:\n`
      prompt += `- Tipo de animación: ${getAnimationTypeLabel(values.animationType)}\n`
      prompt += `- Duración: ${values.animationDuration}ms\n`
      prompt += `- Función de temporización: ${getAnimationTimingLabel(values.animationTiming)}\n`
      prompt += `- Retraso: ${values.animationDelay}ms\n`
    }

    // Añadir opciones específicas según el tipo de componente
    if (componentType === "slider" && values.sliderOptions) {
      prompt += `\n## OPCIONES ESPECÍFICAS PARA SLIDER:\n`

      if (values.sliderOptions.autoplay) {
        prompt += `- Reproducción automática (velocidad: ${values.sliderOptions.autoplaySpeed}ms)\n`
      }

      prompt += `- Bucle infinito: ${values.sliderOptions.infinite ? "Sí" : "No"}\n`
      prompt += `- Mostrar puntos de navegación: ${values.sliderOptions.dots ? "Sí" : "No"}\n`
      prompt += `- Mostrar flechas de navegación: ${values.sliderOptions.arrows ? "Sí" : "No"}\n`

      if (values.sliderOptions.adaptiveHeight) {
        prompt += `- Altura adaptativa\n`
      }

      prompt += `- Diapositivas visibles a la vez: ${values.sliderOptions.slidesToShow}\n`
      prompt += `- Diapositivas a desplazar: ${values.sliderOptions.slidesToScroll}\n`

      if (values.sliderOptions.fade) {
        prompt += `- Efecto de desvanecimiento entre diapositivas\n`
      }

      if (values.sliderOptions.verticalMode) {
        prompt += `- Modo de desplazamiento vertical\n`
      }

      if (values.sliderOptions.transitionEffect !== "slide") {
        prompt += `- Efecto de transición: ${getSliderTransitionLabel(values.sliderOptions.transitionEffect)}\n`
      }

      if (values.sliderOptions.customPagination) {
        prompt += `- Paginación personalizada\n`
      }

      if (values.sliderOptions.customArrows) {
        prompt += `- Flechas de navegación personalizadas\n`
      }

      if (values.sliderOptions.progressBar) {
        prompt += `- Barra de progreso\n`
      }

      if (values.sliderOptions.thumbnailNav) {
        prompt += `- Navegación con miniaturas\n`
      }

      if (values.sliderOptions.keyboardNavigation) {
        prompt += `- Navegación por teclado\n`
      }

      prompt += `- Deslizamiento táctil: ${values.sliderOptions.touchSwipe ? "Habilitado" : "Deshabilitado"}\n`

      if (values.sliderOptions.mouseWheel) {
        prompt += `- Navegación con rueda del ratón\n`
      }

      prompt += `- Pausar al pasar el cursor: ${values.sliderOptions.pauseOnHover ? "Sí" : "No"}\n`

      if (values.sliderOptions.lazyLoad) {
        prompt += `- Carga diferida de imágenes\n`
      }
    } else if (componentType === "gallery" && values.galleryOptions) {
      prompt += `\n## OPCIONES ESPECÍFICAS PARA GALERÍA:\n`
      prompt += `- Diseño: ${getGalleryLayoutLabel(values.galleryOptions.layout)}\n`
      prompt += `- Elementos por fila: ${values.galleryOptions.itemsPerRow}\n`
      prompt += `- Espacio entre elementos: ${values.galleryOptions.gap}px\n`
      prompt += `- Relación de aspecto: ${values.galleryOptions.aspectRatio}\n`

      if (values.galleryOptions.lightbox) {
        prompt += `- Lightbox para vista ampliada\n`
      }

      if (values.galleryOptions.masonry) {
        prompt += `- Efecto de masonería\n`
      }

      if (values.galleryOptions.filter) {
        prompt += `- Filtros por categoría\n`
      }

      if (values.galleryOptions.shuffle) {
        prompt += `- Botón para mezclar elementos\n`
      }

      if (values.galleryOptions.infiniteScroll) {
        prompt += `- Desplazamiento infinito\n`
      }

      if (values.galleryOptions.loadMore) {
        prompt += `- Botón "Cargar más"\n`
      }

      if (values.galleryOptions.hoverInfo) {
        prompt += `- Mostrar información al pasar el cursor\n`
      }

      if (values.galleryOptions.zoomEffect) {
        prompt += `- Efecto de zoom al pasar el cursor\n`
      }
    }

    // Añadir sección de accesibilidad
    prompt += `\n## ACCESIBILIDAD:\n`

    if (values.improveA11y) {
      prompt += `- Mejorar la accesibilidad general\n`
    }

    if (values.addAriaLabels) {
      prompt += `- Añadir etiquetas ARIA para lectores de pantalla\n`
    }

    if (values.keyboardFriendly) {
      prompt += `- Mejorar la navegación por teclado\n`
    }

    if (values.highContrast) {
      prompt += `- Optimizar para alto contraste\n`
    }

    // Añadir sección de rendimiento
    if (values.optimizeForPerformance || values.lazyLoadImages || values.reduceCSSSize || values.minifyJS) {
      prompt += `\n## RENDIMIENTO:\n`

      if (values.optimizeForPerformance) {
        prompt += `- Optimizar el código para mejor rendimiento\n`
      }

      if (values.lazyLoadImages) {
        prompt += `- Implementar carga diferida de imágenes\n`
      }

      if (values.reduceCSSSize) {
        prompt += `- Reducir y optimizar el CSS\n`
      }

      if (values.minifyJS) {
        prompt += `- Minificar y optimizar el JavaScript\n`
      }
    }

    // Añadir sección de compatibilidad
    if (values.addPrefixes || values.addFallbacks || values.ieSupport) {
      prompt += `\n## COMPATIBILIDAD:\n`

      if (values.addPrefixes) {
        prompt += `- Añadir prefijos CSS para compatibilidad con navegadores\n`
      }

      if (values.addFallbacks) {
        prompt += `- Implementar fallbacks para características no soportadas\n`
      }

      if (values.ieSupport) {
        prompt += `- Asegurar compatibilidad con Internet Explorer\n`
      }
    }

    // Añadir sección de código
    prompt += `\n## ESTILO DE CÓDIGO:\n`
    prompt += `- Estilo: ${getCodeStyleLabel(values.codeStyle)}\n`

    if (values.addComments) {
      prompt += `- Incluir comentarios explicativos\n`
    }

    // Añadir el código original
    prompt += `\n## CÓDIGO ORIGINAL A RECICLAR:\n\`\`\`\n${values.originalCode}\n\`\`\`\n\n`

    // Añadir instrucciones finales
    prompt += `Por favor, recicla este código aplicando todas las mejoras y modificaciones especificadas. Mantén la funcionalidad principal pero mejora el diseño, rendimiento y accesibilidad según las opciones seleccionadas.`

    if (values.includeExamples) {
      prompt += ` Incluye ejemplos o explicaciones donde sea necesario para entender los cambios realizados.`
    }

    if (values.includeReferences) {
      prompt += ` Proporciona referencias o recursos útiles relacionados con las técnicas implementadas.`
    }

    return prompt
  }

  // Funciones auxiliares para obtener etiquetas
  const getComponentTypeLabel = (value: string) => {
    const option = componentTypes.find((opt) => opt.value === value)
    return option ? option.label : value
  }

  const getStyleModificationLabel = (value: string) => {
    const option = styleModificationOptions.find((opt) => opt.value === value)
    return option ? option.label : value
  }

  const getFrameworkLabel = (value: string) => {
    const option = frameworkOptions.find((opt) => opt.value === value)
    return option ? option.label : value
  }

  const getColorSchemeLabel = (id: string) => {
    const option = colorSchemeOptions.find((opt) => opt.id === id)
    return option ? option.label : id
  }

  const getAnimationTypeLabel = (value: string) => {
    const option = animationTypeOptions.find((opt) => opt.value === value)
    return option ? option.label : value
  }

  const getAnimationTimingLabel = (value: string) => {
    const option = animationTimingOptions.find((opt) => opt.value === value)
    return option ? option.label : value
  }

  const getSliderTransitionLabel = (value: string) => {
    const option = sliderTransitionOptions.find((opt) => opt.value === value)
    return option ? option.label : value
  }

  const getGalleryLayoutLabel = (value: string) => {
    const option = galleryLayoutOptions.find((opt) => opt.value === value)
    return option ? option.label : value
  }

  const getCodeStyleLabel = (value: string) => {
    const option = codeStyleOptions.find((opt) => opt.value === value)
    return option ? option.label : value
  }

  // Función para copiar el prompt generado al portapapeles
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt)
    toast({
      title: "Copiado al portapapeles",
      description: "El prompt ha sido copiado al portapapeles.",
    })
  }

  // Función para descargar el prompt generado
  const downloadPrompt = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedPrompt], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `prompt-reciclaje-${componentType || "componente"}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Renderizado condicional de opciones específicas según el tipo de componente
  const renderComponentSpecificOptions = () => {
    switch (componentType) {
      case "slider":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Opciones de Slider</h3>

            <FormField
              control={form.control}
              name="sliderOptions.autoplay"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Reproducción Automática</FormLabel>
                    <FormDescription>Reproduce automáticamente el slider</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("sliderOptions.autoplay") && (
              <FormField
                control={form.control}
                name="sliderOptions.autoplaySpeed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Velocidad de Reproducción (ms): {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1000}
                        max={10000}
                        step={500}
                        defaultValue={[field.value]}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                    </FormControl>
                    <FormDescription>Tiempo entre diapositivas en milisegundos</FormDescription>
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sliderOptions.infinite"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Bucle Infinito</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sliderOptions.dots"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Mostrar Puntos</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sliderOptions.arrows"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Mostrar Flechas</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sliderOptions.adaptiveHeight"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Altura Adaptativa</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sliderOptions.slidesToShow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diapositivas a Mostrar</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Número de diapositivas visibles a la vez</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sliderOptions.slidesToScroll"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diapositivas a Desplazar</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Número de diapositivas a desplazar por vez</FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sliderOptions.fade"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Efecto Fade</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sliderOptions.verticalMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Modo Vertical</FormLabel>
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
              name="sliderOptions.transitionEffect"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Efecto de Transición</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un efecto de transición" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sliderTransitionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Efecto de transición entre diapositivas</FormDescription>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sliderOptions.customPagination"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Paginación Personalizada</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sliderOptions.customArrows"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Flechas Personalizadas</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sliderOptions.progressBar"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Barra de Progreso</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sliderOptions.thumbnailNav"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Navegación con Miniaturas</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sliderOptions.keyboardNavigation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Navegación por Teclado</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sliderOptions.touchSwipe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Deslizamiento Táctil</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sliderOptions.mouseWheel"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Navegación con Rueda del Ratón</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sliderOptions.pauseOnHover"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Pausar al Pasar el Cursor</FormLabel>
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
              name="sliderOptions.lazyLoad"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Carga Diferida de Imágenes</FormLabel>
                    <FormDescription>Carga las imágenes solo cuando son necesarias</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )

      case "gallery":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Opciones de Galería</h3>

            <FormField
              control={form.control}
              name="galleryOptions.layout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diseño de Galería</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un diseño" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {galleryLayoutOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Tipo de diseño para la galería</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="galleryOptions.itemsPerRow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Elementos por Fila: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={8}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                    />
                  </FormControl>
                  <FormDescription>Número de elementos a mostrar por fila</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="galleryOptions.gap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Espacio entre Elementos: {field.value}px</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={40}
                      step={4}
                      defaultValue={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                    />
                  </FormControl>
                  <FormDescription>Espacio entre elementos de la galería</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="galleryOptions.aspectRatio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relación de Aspecto</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una relación de aspecto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {aspectRatioOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Relación de aspecto para las imágenes</FormDescription>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="galleryOptions.lightbox"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Lightbox</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="galleryOptions.masonry"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Efecto Masonería</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="galleryOptions.filter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Filtros de Categoría</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="galleryOptions.shuffle"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Botón de Mezclar</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="galleryOptions.infiniteScroll"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Desplazamiento Infinito</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="galleryOptions.loadMore"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Botón "Cargar Más"</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="galleryOptions.hoverInfo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Info al Pasar el Cursor</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="galleryOptions.zoomEffect"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Efecto Zoom</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        )

      // Aquí podrían ir más casos para otros tipos de componentes

      default:
        return (
          <div className="p-4 border rounded-md bg-muted/50">
            <p className="text-muted-foreground text-center">
              Selecciona un tipo de componente para ver opciones específicas
            </p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="componentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Componente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo de componente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {componentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Selecciona el tipo de componente que deseas reciclar</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="originalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Original</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Pega aquí el código HTML/CSS/JS que deseas reciclar..."
                        className="min-h-[200px] font-mono text-sm"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>Pega el código original que deseas transformar</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="promptDetailLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel de Detalle del Prompt</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el nivel de detalle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {promptDetailLevelOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Nivel de detalle para el prompt generado</FormDescription>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="includeExamples"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Incluir Ejemplos</FormLabel>
                        <FormDescription>Solicitar ejemplos en el prompt</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeReferences"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Incluir Referencias</FormLabel>
                        <FormDescription>Solicitar referencias técnicas</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6">
              <Tabs defaultValue="general" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="style">Estilo</TabsTrigger>
                  <TabsTrigger value="animation">Animación</TabsTrigger>
                  <TabsTrigger value="advanced">Avanzado</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Opciones Generales</h3>

                    <FormField
                      control={form.control}
                      name="preserveClassNames"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Preservar Clases CSS</FormLabel>
                            <FormDescription>Mantener las clases CSS originales</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preserveAttributes"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Preservar Atributos</FormLabel>
                            <FormDescription>Mantener los atributos HTML originales</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preserveEventHandlers"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Preservar Manejadores de Eventos</FormLabel>
                            <FormDescription>Mantener los eventos JavaScript originales</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="framework"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Framework Objetivo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un framework" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {frameworkOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>Framework para el código reciclado</FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  {componentType && renderComponentSpecificOptions()}
                </TabsContent>

                <TabsContent value="style" className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Opciones de Estilo</h3>

                    <FormField
                      control={form.control}
                      name="styleModification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modificación de Estilo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un estilo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {styleModificationOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>Estilo visual para el componente reciclado</FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="colorScheme"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">Esquema de Color</FormLabel>
                            <FormDescription>Selecciona los esquemas de color a utilizar</FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {colorSchemeOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="colorScheme"
                                render={({ field }) => {
                                  return (
                                    <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, option.id])
                                              : field.onChange(field.value?.filter((value) => value !== option.id))
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{option.label}</FormLabel>
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

                    <FormField
                      control={form.control}
                      name="borderRadius"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Radio de Borde: {field.value}px</FormLabel>
                          <FormControl>
                            <Slider
                              min={0}
                              max={24}
                              step={2}
                              defaultValue={[field.value]}
                              onValueChange={(values) => field.onChange(values[0])}
                            />
                          </FormControl>
                          <FormDescription>Radio de las esquinas redondeadas</FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shadowIntensity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Intensidad de Sombra: {field.value}</FormLabel>
                          <FormControl>
                            <Slider
                              min={0}
                              max={10}
                              step={1}
                              defaultValue={[field.value]}
                              onValueChange={(values) => field.onChange(values[0])}
                            />
                          </FormControl>
                          <FormDescription>Intensidad de las sombras (0 = sin sombra)</FormDescription>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="addHoverEffects"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Efectos al Pasar el Cursor</FormLabel>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="addClickEffects"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Efectos al Hacer Clic</FormLabel>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="animation" className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Opciones de Animación</h3>

                    <FormField
                      control={form.control}
                      name="animationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Animación</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un tipo de animación" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {animationTypeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>Tipo de animación para el componente</FormDescription>
                        </FormItem>
                      )}
                    />

                    {form.watch("animationType") !== "none" && (
                      <>
                        <FormField
                          control={form.control}
                          name="animationDuration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duración de Animación: {field.value}ms</FormLabel>
                              <FormControl>
                                <Slider
                                  min={100}
                                  max={2000}
                                  step={100}
                                  defaultValue={[field.value]}
                                  onValueChange={(values) => field.onChange(values[0])}
                                />
                              </FormControl>
                              <FormDescription>Duración de la animación en milisegundos</FormDescription>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="animationTiming"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Función de Temporización</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una función de temporización" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {animationTimingOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>Función de temporización para la animación</FormDescription>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="animationDelay"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Retraso de Animación: {field.value}ms</FormLabel>
                              <FormControl>
                                <Slider
                                  min={0}
                                  max={1000}
                                  step={50}
                                  defaultValue={[field.value]}
                                  onValueChange={(values) => field.onChange(values[0])}
                                />
                              </FormControl>
                              <FormDescription>Retraso antes de iniciar la animación</FormDescription>
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="accessibility">
                      <AccordionTrigger>Accesibilidad</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="improveA11y"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Mejorar Accesibilidad</FormLabel>
                                  <FormDescription>Mejorar la accesibilidad general del componente</FormDescription>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="addAriaLabels"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Añadir Etiquetas ARIA</FormLabel>
                                  <FormDescription>Añadir atributos ARIA para lectores de pantalla</FormDescription>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="keyboardFriendly"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Navegación por Teclado</FormLabel>
                                  <FormDescription>Mejorar la navegación por teclado</FormDescription>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="highContrast"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Alto Contraste</FormLabel>
                                  <FormDescription>Mejorar el contraste para visibilidad</FormDescription>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="performance">
                      <AccordionTrigger>Rendimiento</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="optimizeForPerformance"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Optimizar para Rendimiento</FormLabel>
                                  <FormDescription>Optimizar el código para mejor rendimiento</FormDescription>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="lazyLoadImages"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Carga Diferida de Imágenes</FormLabel>
                                  <FormDescription>Cargar imágenes solo cuando son visibles</FormDescription>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="reduceCSSSize"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Reducir Tamaño CSS</FormLabel>
                                  <FormDescription>Optimizar y reducir el CSS generado</FormDescription>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="minifyJS"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Minificar JavaScript</FormLabel>
                                  <FormDescription>Reducir el tamaño del código JavaScript</FormDescription>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="compatibility">
                      <AccordionTrigger>Compatibilidad</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="addPrefixes"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Añadir Prefijos CSS</FormLabel>
                                  <FormDescription>Añadir prefijos para compatibilidad con navegadores</FormDescription>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="addFallbacks"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Añadir Fallbacks</FormLabel>
                                  <FormDescription>
                                    Añadir alternativas para características no soportadas
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
                            name="ieSupport"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Soporte para IE</FormLabel>
                                  <FormDescription>Añadir soporte para Internet Explorer</FormDescription>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="code">
                      <AccordionTrigger>Código</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="addComments"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Añadir Comentarios</FormLabel>
                                  <FormDescription>Añadir comentarios explicativos al código</FormDescription>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
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
                                    {codeStyleOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>Estilo de formateo del código generado</FormDescription>
                              </FormItem>
                            )}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando Prompt...
                </>
              ) : (
                "Generar Prompt"
              )}
            </Button>
          </div>
        </form>
      </Form>
      {generatedPrompt && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Prompt Generado</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <CopyIcon className="mr-2 h-4 w-4" />
                Copiar
              </Button>
              <Button variant="outline" size="sm" onClick={downloadPrompt}>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Descargar
              </Button>
            </div>
          </div>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex justify-between items-center">
                <span>Prompt para Reciclaje de Código</span>
                <Badge variant="outline" className="ml-2">
                  {componentType ? getComponentTypeLabel(componentType) : "Componente"}
                </Badge>
              </CardTitle>
              <CardDescription>Usa este prompt para reciclar tu código con las opciones seleccionadas</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border">
                <div className="p-4 whitespace-pre-wrap font-mono text-sm">{generatedPrompt}</div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="pt-2">
              <p className="text-sm text-muted-foreground">
                Copia este prompt y úsalo con tu modelo de lenguaje preferido para reciclar el código
              </p>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

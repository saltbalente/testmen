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
import { Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"

// Actualizar el esquema del formulario para incluir las nuevas categorías opcionales y opciones de video
const formSchema = z.object({
  sectionType: z.string({
    required_error: "Por favor selecciona un tipo de sección",
  }),
  designStyle: z.string({
    required_error: "Por favor selecciona un estilo de diseño",
  }),
  targetPlatform: z.string().default("mobile"),
  includeImages: z.boolean().default(false),
  imageStyle: z.string().optional(),
  includeBackgroundVideo: z.boolean().default(false),
  // Nuevas opciones para video de fondo
  videoPlayback: z.string().default("autoplay"),
  videoLoop: z.boolean().default(true),
  videoMuted: z.boolean().default(true),
  videoLazyLoad: z.boolean().default(true),
  videoEffect: z.string().default("none"),
  videoOpacity: z.number().default(80),
  videoPlaybackSpeed: z.number().default(100),
  videoIntersectionObserver: z.boolean().default(false),
  // Fin de nuevas opciones para video
  fontType: z.string({
    required_error: "Por favor selecciona un tipo de fuente",
  }),
  colorScheme: z.array(z.string()).min(1, {
    message: "Por favor selecciona al menos un color",
  }),
  animationType: z.string({
    required_error: "Por favor selecciona un tipo de animación",
  }),
  contactInfo: z.boolean().default(false),
  borderStyle: z.string({
    required_error: "Por favor selecciona un estilo de borde",
  }),
  // Nuevas categorías opcionales
  performance: z.array(z.string()).optional().default([]),
  seo: z.array(z.string()).optional().default([]),
  browserCompatibility: z.array(z.string()).optional().default([]),
  interactivity: z.array(z.string()).optional().default([]),
  transitions: z.array(z.string()).optional().default([]),
  esotericElements: z.array(z.string()).optional().default([]),
  // Configuración de división de código
  splitCodeOutput: z.boolean().default(true),
  maxPartLength: z.number().default(1500),
  addDetailedComments: z.boolean().default(false),
  codeStyle: z.string().default("standard"),
  // Opciones específicas para botones fijos en móviles
  fixedButtonsPosition: z.string().default("bottom-right"),
  fixedButtonsLayout: z.string().default("stacked"),
  fixedButtonsSpacing: z.number().default(10),
  fixedButtonsSize: z.string().default("medium"),
  fixedButtonsShape: z.string().default("circle"),
  fixedButtonsIconType: z.string().default("svg"),
  fixedButtonsCustomEmoji: z.string().optional(),
  fixedButtonsCustomSvg: z.string().optional(),
  fixedButtonsCustomImage: z.string().optional(),
  fixedButtonsShowLabel: z.boolean().default(false),
  fixedButtonsLabelPosition: z.string().default("right"),
  fixedButtonsAnimation: z.string().default("pulse"),
  fixedButtonsAnimationDuration: z.number().default(2000),
  fixedButtonsAnimationDelay: z.number().default(0),
  fixedButtonsVisibility: z.string().default("always"),
  fixedButtonsScrollBehavior: z.string().default("none"),
  fixedButtonsZIndex: z.number().default(999),
  fixedButtonsWhatsappNumber: z.string().optional(),
  fixedButtonsWhatsappMessage: z.string().optional(),
  fixedButtonsPhoneNumber: z.string().optional(),
  fixedButtonsIncludeWhatsapp: z.boolean().default(true),
  fixedButtonsIncludeCall: z.boolean().default(true),
  fixedButtonsCustomButtons: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        icon: z.string(),
        url: z.string(),
        color: z.string(),
      }),
    )
    .optional()
    .default([]),
  fixedButtonsBackdropFilter: z.boolean().default(false),
  fixedButtonsBackdropBlur: z.number().default(5),
  fixedButtonsDesktopDisplay: z.string().default("show"),
  fixedButtonsTabletDisplay: z.string().default("show"),
  fixedButtonsEntryAnimation: z.string().default("fade"),
  fixedButtonsExitAnimation: z.string().default("fade"),
  fixedButtonsBoxShadow: z.string().default("medium"),
  fixedButtonsGlowEffect: z.boolean().default(false),
  fixedButtonsGlowColor: z.string().default("brand"),
  fixedButtonsClickEffect: z.string().default("ripple"),
  fixedButtonsAccessibility: z.boolean().default(true),
  fixedButtonsCloseOption: z.boolean().default(false),
  fixedButtonsReopenDelay: z.number().default(86400), // 24 horas en segundos
})

// Opciones existentes
const targetPlatforms = [
  { value: "mobile", label: "Móvil (Smartphone)" },
  { value: "tablet", label: "Tablet" },
  { value: "desktop", label: "Computadora de Escritorio" },
  { value: "all", label: "Todas las Plataformas" },
  { value: "mobile-first", label: "Mobile First (Prioridad Móvil)" },
  { value: "desktop-first", label: "Desktop First (Prioridad Escritorio)" },
  { value: "progressive", label: "Mejora Progresiva" },
  { value: "adaptive", label: "Diseño Adaptativo" },
  { value: "foldable", label: "Dispositivos Plegables" },
  { value: "wearable", label: "Dispositivos Vestibles" },
  { value: "tv", label: "Smart TV" },
  { value: "kiosk", label: "Kiosco Interactivo" },
  { value: "portrait", label: "Orientación Vertical" },
  { value: "landscape", label: "Orientación Horizontal" },
  { value: "touch", label: "Optimizado para Pantalla Táctil" },
  { value: "mouse", label: "Optimizado para Mouse" },
  { value: "low-bandwidth", label: "Conexiones de Bajo Ancho de Banda" },
  { value: "high-dpi", label: "Pantallas de Alta Resolución" },
  { value: "dark-mode", label: "Modo Oscuro Optimizado" },
  { value: "light-mode", label: "Modo Claro Optimizado" },
]

const sectionTypes = [
  // Secciones básicas de sitio web
  { value: "header", label: "Encabezado (parte superior del sitio)" },
  { value: "hero", label: "Hero (banner principal con llamada a la acción)" },
  { value: "services", label: "Servicios (listado de lo que ofreces)" },
  { value: "catalog", label: "Catálogo (muestra de productos o servicios)" },
  { value: "pricing", label: "Precios (paquetes y tarifas)" },
  { value: "comparison", label: "Comparativa (tabla de opciones)" },
  { value: "testimonials", label: "Testimonios (opiniones de clientes)" },
  { value: "call-to-action", label: "Llamada a la Acción (motivar al contacto)" },
  { value: "gallery", label: "Galería (colección de imágenes)" },
  { value: "contact", label: "Contacto (formulario para mensajes)" },
  { value: "footer", label: "Pie de Página (cierre del sitio)" },

  // Secciones específicas para temas esotéricos
  { value: "tarot-reading", label: "Lectura de Tarot (servicios de cartas)" },
  { value: "horoscope", label: "Horóscopo (predicciones astrales)" },
  { value: "ritual-guide", label: "Guía de Rituales (instrucciones paso a paso)" },
  { value: "spell-book", label: "Libro de Hechizos (colección de conjuros)" },
  { value: "crystal-showcase", label: "Vitrina de Cristales (propiedades y usos)" },
  { value: "astrology-chart", label: "Carta Astrológica (mapa estelar personal)" },
  { value: "mystical-shop", label: "Tienda Mística (productos esotéricos)" },
  { value: "divination-tools", label: "Herramientas de Adivinación (péndulos, runas, etc.)" },
  { value: "sacred-geometry", label: "Geometría Sagrada (patrones universales)" },
  { value: "magical-herbs", label: "Hierbas Mágicas (propiedades y usos)" },
  { value: "lunar-calendar", label: "Calendario Lunar (fases y rituales)" },
  { value: "meditation-guide", label: "Guía de Meditación (técnicas de concentración)" },
  { value: "spiritual-journey", label: "Viaje Espiritual (camino de autoconocimiento)" },
  { value: "alchemical-process", label: "Proceso Alquímico (transformación interior)" },
  { value: "fixed-mobile-buttons", label: "Botones Fijos para Móviles (WhatsApp/Llamadas)" },

  // Elementos adicionales para ampliar las opciones
  { value: "about-me", label: "Sobre Mí (historia personal o profesional)" },
  { value: "faq", label: "Preguntas Frecuentes (dudas comunes)" },
  { value: "blog-preview", label: "Vista Previa de Blog (últimos artículos)" },
  { value: "video-section", label: "Sección de Video (material audiovisual)" },
  { value: "sacred-spaces", label: "Espacios Sagrados (lugares de poder)" },
  { value: "spirit-guides", label: "Guías Espirituales (entidades de ayuda)" },
  { value: "chakra-system", label: "Sistema de Chakras (centros energéticos)" },
  { value: "dream-analysis", label: "Análisis de Sueños (interpretación onírica)" },
  { value: "numerology", label: "Numerología (significado de los números)" },
  { value: "palm-reading", label: "Quiromancia (lectura de manos)" },
  { value: "aura-reading", label: "Lectura de Aura (campos energéticos)" },
  { value: "rune-casting", label: "Tirada de Runas (símbolos nórdicos)" },
  { value: "i-ching", label: "I Ching (oráculo chino)" },
  { value: "pendulum-charts", label: "Tableros para Péndulo (respuestas guiadas)" },
  { value: "energy-healing", label: "Sanación Energética (reiki, pranic, etc.)" },
  { value: "crystal-grid", label: "Rejilla de Cristales (patrones energéticos)" },
  { value: "angel-communication", label: "Comunicación Angelical (mensajes divinos)" },
  { value: "shamanic-journey", label: "Viaje Chamánico (estados alterados)" },
  { value: "akashic-records", label: "Registros Akáshicos (memoria universal)" },
  { value: "past-lives", label: "Vidas Pasadas (regresiones)" },
  { value: "feng-shui", label: "Feng Shui (armonía del espacio)" },
  { value: "zodiac-profiles", label: "Perfiles Zodiacales (características de signos)" },
  { value: "planetary-hours", label: "Horas Planetarias (momentos propicios)" },
  { value: "magic-spells", label: "Conjuros Mágicos (rituales específicos)" },
  { value: "success-stories", label: "Historias de Éxito (casos reales)" },
  { value: "membership-plans", label: "Planes de Membresía (servicios exclusivos)" },
  { value: "event-calendar", label: "Calendario de Eventos (talleres y sesiones)" },
  { value: "book-recommendations", label: "Recomendaciones de Libros (material de estudio)" },
  { value: "online-courses", label: "Cursos Online (aprendizaje a distancia)" },
  { value: "consultation-booking", label: "Reserva de Consultas (programación de sesiones)" },
]

const designStyles = [
  // Estilos de diseño modernos y comunes
  { value: "minimalist", label: "Minimalista (sencillo y elegante)" },
  { value: "brutalist", label: "Brutalista (crudo y directo)" },
  { value: "neomorphic", label: "Neomórfico (efectos suaves de luz y sombra)" },
  { value: "glassmorphism", label: "Glassmorfismo (efecto de cristal transparente)" },
  { value: "retro", label: "Retro/Vintage (inspirado en décadas pasadas)" },
  { value: "cyberpunk", label: "Ciberpunk (futurista y tecnológico)" },
  { value: "organic", label: "Orgánico (formas naturales y fluidas)" },
  { value: "abstract", label: "Abstracto (formas y patrones no figurativos)" },
  { value: "flat-design", label: "Diseño Plano (sin sombras ni efectos 3D)" },
  { value: "material-design", label: "Material Design (estilo de Google)" },

  // Estilos esotéricos y místicos
  { value: "esoteric", label: "Esotérico (símbolos y elementos místicos)" },
  { value: "occult", label: "Ocultista (conocimiento secreto y misterioso)" },
  { value: "alchemical", label: "Alquímico (símbolos de transformación)" },
  { value: "witchcraft", label: "Brujería (elementos mágicos tradicionales)" },
  { value: "mystical", label: "Místico (espiritualidad y trascendencia)" },
  { value: "celestial", label: "Celestial (estrellas, planetas y cosmos)" },
  { value: "arcane", label: "Arcano (conocimientos antiguos y secretos)" },
  { value: "grimoire", label: "Grimorio (libro de hechizos y conocimiento)" },
  { value: "pagan", label: "Pagano (inspirado en religiones antiguas)" },
  { value: "hermetic", label: "Hermético (filosofía oculta y simbólica)" },
  { value: "shamanic", label: "Chamánico (tradiciones indígenas espirituales)" },
  { value: "kabbalistic", label: "Cabalístico (misticismo judío)" },

  // Estilos históricos y artísticos
  { value: "gothic", label: "Gótico (oscuro y dramático)" },
  { value: "steampunk", label: "Steampunk (victoriano con elementos mecánicos)" },
  { value: "art-nouveau", label: "Art Nouveau (orgánico y ornamental)" },
  { value: "sacred-geometry", label: "Geometría Sagrada (patrones matemáticos divinos)" },
  { value: "ancient-egyptian", label: "Egipcio Antiguo (jeroglíficos y símbolos)" },
  { value: "medieval", label: "Medieval (inspirado en la Edad Media)" },
  { value: "renaissance", label: "Renacentista (equilibrio y proporción)" },
  { value: "baroque", label: "Barroco (ornamentado y dramático)" },
  { value: "art-deco", label: "Art Deco (elegante y geométrico)" },
  { value: "byzantine", label: "Bizantino (iconografía y dorados)" },
  { value: "victorian", label: "Victoriano (elegante y ornamentado)" },
  { value: "nordic", label: "Nórdico (runas y mitología vikinga)" },

  // Estilos culturales y regionales
  { value: "celtic", label: "Celta (nudos entrelazados y símbolos)" },
  { value: "japanese", label: "Japonés (minimalista y equilibrado)" },
  { value: "indian", label: "Indio (mandalas y colores vibrantes)" },
  { value: "arabic", label: "Árabe (caligrafía y patrones geométricos)" },
  { value: "mayan", label: "Maya (calendarios y glifos)" },
  { value: "african", label: "Africano (patrones tribales y orgánicos)" },
  { value: "aztec", label: "Azteca (símbolos y colores terrosos)" },
  { value: "tibetan", label: "Tibetano (mandalas y iconografía budista)" },

  // Otras tendencias y estilos
  { value: "cosmic-horror", label: "Horror Cósmico (inspirado en Lovecraft)" },
  { value: "fairy-tale", label: "Cuento de Hadas (mágico y encantador)" },
  { value: "vaporwave", label: "Vaporwave (estética retro digital)" },
  { value: "psychedelic", label: "Psicodélico (colores vibrantes y formas fluidas)" },
  { value: "dark-mode", label: "Modo Oscuro (fondo negro, alto contraste)" },
  { value: "light-ethereal", label: "Etéreo Luminoso (ligero y celestial)" },
  { value: "bohemian", label: "Bohemio (libre y espiritual)" },
  { value: "wiccan", label: "Wicca (brujería moderna)" },
  { value: "metaphysical", label: "Metafísico (realidades más allá de lo físico)" },
  { value: "shadow-work", label: "Trabajo de Sombra (aspectos inconscientes)" },
]

const fontTypes = [
  // Tipos básicos y comunes
  { value: "sans-serif", label: "Sin Serifas (letras limpias y modernas)" },
  { value: "serif", label: "Con Serifas (letras con remates, más tradicionales)" },
  { value: "monospace", label: "Monoespaciada (letras con mismo ancho, estilo código)" },
  { value: "display", label: "Display (llamativas para títulos grandes)" },
  { value: "handwritten", label: "Manuscrita (simula escritura a mano)" },

  // Estilos estéticos
  { value: "elegant", label: "Elegante (refinada y sofisticada)" },
  { value: "decorative", label: "Decorativa (ornamentada y llamativa)" },
  { value: "romantic", label: "Romántica (suave y delicada)" },
  { value: "futuristic", label: "Futurista (moderna y tecnológica)" },
  { value: "geometric", label: "Geométrica (basada en formas básicas)" },
  { value: "vintage", label: "Vintage (inspirada en épocas pasadas)" },
  { value: "brutalist", label: "Brutalista (cruda y con carácter)" },
  { value: "grunge", label: "Grunge (desgastada y rebelde)" },
  { value: "minimalist", label: "Minimalista (simple y funcional)" },

  // Estilos místicos y esotéricos
  { value: "runic", label: "Rúnica (inspirada en alfabetos nórdicos)" },
  { value: "occult", label: "Ocultista (estilo de textos secretos)" },
  { value: "mystical", label: "Mística (evoca lo sobrenatural)" },
  { value: "alchemical", label: "Alquímica (símbolos de transformación)" },
  { value: "hieroglyphic", label: "Jeroglífica (inspirada en escritura egipcia)" },
  { value: "enochian", label: "Enoquiana (alfabeto angélico)" },
  { value: "theban", label: "Tebana (alfabeto de brujas)" },
  { value: "celestial", label: "Celestial (inspirada en las estrellas)" },
  { value: "gothic", label: "Gótica (medieval y ornamentada)" },
  { value: "calligraphic", label: "Caligráfica (escrita con pluma)" },

  // Estilos específicos esotéricos
  { value: "arcane", label: "Arcana (mística y secreta)" },
  { value: "witchcraft", label: "Brujería (símbolos mágicos)" },
  { value: "medieval", label: "Medieval (estilo de pergaminos antiguos)" },
  { value: "illuminated", label: "Iluminada (como manuscritos decorados)" },
  { value: "grimoire", label: "Grimorio (de libros de hechizos)" },
  { value: "sigil", label: "Sigilos (símbolos mágicos personales)" },
  { value: "hermetic", label: "Hermética (de textos herméticos)" },
  { value: "kabbalistic", label: "Cabalística (letras hebreas místicas)" },
  { value: "druidic", label: "Druídica (celta y natural)" },
  { value: "elder-futhark", label: "Futhark Antiguo (runas vikingas)" },

  // Estilos regionales e históricos
  { value: "uncial", label: "Uncial (escritura latina antigua)" },
  { value: "coptic", label: "Copta (escritura egipcia cristiana)" },
  { value: "sanskrit", label: "Sánscrita (elegante escritura india)" },
  { value: "aramaic", label: "Aramea (antigua escritura semítica)" },
  { value: "ogham", label: "Ogham (antiguo alfabeto irlandés)" },
  { value: "cuneiform", label: "Cuneiforme (escritura mesopotámica)" },
  { value: "phoenician", label: "Fenicia (antigua escritura mediterránea)" },
  { value: "mayan-glyphs", label: "Glifos Mayas (escritura mesoamericana)" },

  // Estilos modernos con toque místico
  { value: "crystal-clear", label: "Cristal Claro (limpia con destellos)" },
  { value: "shadow-script", label: "Escritura Sombría (misteriosa y oscura)" },
  { value: "astral-type", label: "Tipografía Astral (inspirada en estrellas)" },
  { value: "etheric-sans", label: "Sans Etérica (limpia con toque místico)" },
  { value: "magical-script", label: "Escritura Mágica (con detalles brillantes)" },
  { value: "cosmic-serif", label: "Serif Cósmica (elegante con toques estelares)" },
  { value: "psychic-handwriting", label: "Escritura Psíquica (fluida e intuitiva)" },
  { value: "ritual-script", label: "Escritura Ritual (para textos ceremoniales)" },
]

const colorOptions = [
  // ESQUEMAS BÁSICOS DE COLOR
  { id: "monochromatic", label: "Monocromático (variaciones de un solo color)" },
  { id: "analogous", label: "Análogo (colores vecinos en la rueda cromática)" },
  { id: "complementary", label: "Complementario (colores opuestos que contrastan)" },
  { id: "triadic", label: "Triádico (tres colores equidistantes)" },
  { id: "split-complementary", label: "Complementario Dividido (un color y dos adyacentes a su opuesto)" },
  { id: "tetradic", label: "Tetrádico (cuatro colores en rectángulo)" },
  { id: "square", label: "Cuadrado (cuatro colores equidistantes)" },
  { id: "compound", label: "Compuesto (combinación de complementarios y análogos)" },
  { id: "shades", label: "Tonalidades (variaciones de luminosidad de un color)" },
  { id: "custom", label: "Personalizado (combinación única de colores)" },

  // PALETAS DE TONALIDADES
  { id: "pastel", label: "Pastel (colores suaves y claros)" },
  { id: "neon", label: "Neón (colores brillantes e intensos)" },
  { id: "earthy", label: "Terroso (colores de la tierra y naturaleza)" },
  { id: "jewel-tones", label: "Tonos Joya (colores ricos e intensos)" },
  { id: "metallic", label: "Metálico (con efecto de brillo metálico)" },
  { id: "muted", label: "Apagado (colores suavizados con gris)" },
  { id: "vintage", label: "Vintage (colores desaturados con toque retro)" },
  { id: "gradient", label: "Degradado (transición suave entre colores)" },
  { id: "duotone", label: "Duotono (paleta basada en dos colores principales)" },
  { id: "tritone", label: "Tritono (paleta basada en tres colores principales)" },
  { id: "rainbow", label: "Arcoíris (espectro completo de colores)" },
  { id: "iridescent", label: "Iridiscente (colores que cambian según el ángulo)" },
  { id: "holographic", label: "Holográfico (efecto multicolor cambiante)" },

  // COLORES DE GEMAS Y PIEDRAS PRECIOSAS
  { id: "ruby-red", label: "Rubí (rojo intenso con destellos)" },
  { id: "sapphire-blue", label: "Zafiro (azul profundo y brillante)" },
  { id: "emerald-green", label: "Esmeralda (verde intenso y luminoso)" },
  { id: "diamond-white", label: "Diamante (blanco cristalino con destellos)" },
  { id: "amethyst-purple", label: "Amatista (púrpura violáceo cristalino)" },
  { id: "topaz-yellow", label: "Topacio (amarillo dorado brillante)" },
  { id: "aquamarine-blue", label: "Aguamarina (azul verdoso claro)" },
  { id: "opal-multicolor", label: "Ópalo (multicolor con destellos iridiscentes)" },
  { id: "garnet-red", label: "Granate (rojo oscuro profundo)" },
  { id: "peridot-green", label: "Peridoto (verde oliva brillante)" },
  { id: "citrine-yellow", label: "Citrino (amarillo ámbar cálido)" },
  { id: "tanzanite-blue", label: "Tanzanita (azul violáceo profundo)" },
  { id: "turquoise-blue", label: "Turquesa (azul verdoso brillante)" },
  { id: "morganite-pink", label: "Morganita (rosa melocotón suave)" },
  { id: "jade-green", label: "Jade (verde con tonos variables)" },
  { id: "onyx-black", label: "Ónice (negro profundo y brillante)" },
  { id: "moonstone-white", label: "Piedra lunar (blanco azulado con brillo)" },
  { id: "lapis-lazuli", label: "Lapislázuli (azul intenso con destellos dorados)" },
  { id: "rhodochrosite-pink", label: "Rodocrosita (rosa con bandas blancas)" },
  { id: "malachite-green", label: "Malaquita (verde con patrones concéntricos)" },

  // METALES PRECIOSOS
  { id: "gold-yellow", label: "Oro (amarillo dorado brillante)" },
  { id: "silver-gray", label: "Plata (gris plateado brillante)" },
  { id: "platinum-white", label: "Platino (blanco grisáceo metálico)" },
  { id: "copper-orange", label: "Cobre (naranja rojizo metálico)" },
  { id: "bronze-brown", label: "Bronce (marrón dorado metálico)" },
  { id: "rose-gold", label: "Oro rosa (rosa dorado metálico)" },
  { id: "white-gold", label: "Oro blanco (blanco amarillento metálico)" },
  { id: "titanium-gray", label: "Titanio (gris azulado metálico)" },
  { id: "brass-yellow", label: "Latón (amarillo verdoso metálico)" },
  { id: "chrome-silver", label: "Cromo (plateado brillante reflectante)" },

  // PALETAS MÍSTICAS Y ESOTÉRICAS
  { id: "mystical-purple", label: "Púrpura Místico (violetas y lavandas espirituales)" },
  { id: "cosmic-blue", label: "Azul Cósmico (azules profundos del universo)" },
  { id: "emerald-magic", label: "Esmeralda Mágica (verdes de piedras preciosas)" },
  { id: "blood-red", label: "Rojo Sangre (rojos intensos y profundos)" },
  { id: "midnight-black", label: "Negro Medianoche (negros con matices)" },
  { id: "golden-alchemical", label: "Dorado Alquímico (oros y amarillos brillantes)" },
  { id: "silver-lunar", label: "Plateado Lunar (plateados y grises lunares)" },
  { id: "amethyst-spiritual", label: "Amatista Espiritual (púrpuras y violetas cristalinos)" },
  { id: "jade-mystical", label: "Jade Místico (verdes profundos y misteriosos)" },
  { id: "amber-protection", label: "Ámbar Protector (tonos cálidos y dorados)" },
  { id: "obsidian-dark", label: "Obsidiana Oscura (negros profundos con reflejos)" },
  { id: "celestial-blue", label: "Azul Celestial (azules etéreos y luminosos)" },
  { id: "witch-green", label: "Verde Bruja (verdes de bosque mágico)" },
  { id: "tarot-gold", label: "Dorado Tarot (dorados antiguos con patina)" },
  { id: "crystal-clear", label: "Cristal Transparente (blancos y celestes claros)" },
  { id: "smoky-mysterious", label: "Humo Misterioso (grises y negros difuminados)" },
  { id: "rose-quartz", label: "Cuarzo Rosa (rosas suaves y curativos)" },
  { id: "dragons-blood", label: "Sangre de Dragón (rojos intensos con toques ocres)" },
  { id: "moonlight-silver", label: "Plata Lunar (plateados fríos y brillantes)" },
  { id: "ethereal-white", label: "Blanco Etéreo (blancos luminosos y brillantes)" },
  { id: "void-black", label: "Negro Vacío (negro absoluto absorbente)" },
  { id: "astral-projection", label: "Proyección Astral (azules y violetas etéreos)" },
  { id: "third-eye", label: "Tercer Ojo (índigo profundo y violeta)" },

  // PALETAS ELEMENTALES
  { id: "fire-element", label: "Elemento Fuego (rojos, naranjas y amarillos)" },
  { id: "water-element", label: "Elemento Agua (azules, turquesas y cian)" },
  { id: "earth-element", label: "Elemento Tierra (marrones, verdes y ocres)" },
  { id: "air-element", label: "Elemento Aire (blancos, celestes y grises claros)" },
  { id: "spirit-element", label: "Elemento Espíritu (violetas y blancos etéreos)" },
  { id: "wood-element", label: "Elemento Madera (verdes y marrones vegetales)" },
  { id: "metal-element", label: "Elemento Metal (grises, plateados y blancos)" },
  { id: "void-element", label: "Elemento Vacío (negros y azules oscuros)" },
  { id: "lightning-element", label: "Elemento Rayo (amarillos y azules eléctricos)" },
  { id: "ice-element", label: "Elemento Hielo (azules claros y blancos fríos)" },

  // PALETAS ASTROLÓGICAS
  { id: "solar-gold", label: "Oro Solar (dorados y amarillos radiantes)" },
  { id: "lunar-silver", label: "Plata Lunar (plateados y blancos reflejantes)" },
  { id: "mars-red", label: "Rojo Marte (rojos energéticos y dinámicos)" },
  { id: "mercury-quicksilver", label: "Mercurio Cambiante (grises metálicos y variables)" },
  { id: "jupiter-royal", label: "Júpiter Real (púrpuras y azules majestuosos)" },
  { id: "venus-pink", label: "Venus Rosa (rosas y verdes armoniosos)" },
  { id: "saturn-deep", label: "Saturno Profundo (negros y azules oscuros)" },
  { id: "uranus-electric", label: "Urano Eléctrico (azules brillantes y eléctricos)" },
  { id: "neptune-aqua", label: "Neptuno Agua (turquesas y azules fluidos)" },
  { id: "pluto-transformative", label: "Plutón Transformador (burdeos y negros intensos)" },
  { id: "aries-fire", label: "Aries Fuego (rojos intensos y dinámicos)" },
  { id: "taurus-earth", label: "Tauro Tierra (verdes y marrones estables)" },
  { id: "gemini-air", label: "Géminis Aire (amarillos y azules claros)" },
  { id: "cancer-water", label: "Cáncer Agua (plateados y azules pálidos)" },
  { id: "leo-sun", label: "Leo Sol (dorados y naranjas brillantes)" },
  { id: "virgo-earth", label: "Virgo Tierra (marrones y verdes terrosos)" },
  { id: "libra-air", label: "Libra Aire (rosas y azules equilibrados)" },
  { id: "scorpio-water", label: "Escorpio Agua (rojos oscuros y negros)" },
  { id: "sagittarius-fire", label: "Sagitario Fuego (púrpuras y azules aventureros)" },
  { id: "capricorn-earth", label: "Capricornio Tierra (marrones y grises sobrios)" },
  { id: "aquarius-air", label: "Acuario Aire (turquesas y violetas innovadores)" },
  { id: "pisces-water", label: "Piscis Agua (verdes mar y azules profundos)" },

  // COLORES DE LA NATURALEZA
  { id: "forest-green", label: "Verde Bosque (verdes profundos y oscuros)" },
  { id: "ocean-blue", label: "Azul Océano (azules profundos y variables)" },
  { id: "sunset-orange", label: "Naranja Atardecer (naranjas y rojos cálidos)" },
  { id: "dawn-pink", label: "Rosa Amanecer (rosas y lavandas suaves)" },
  { id: "mountain-gray", label: "Gris Montaña (grises rocosos y terrosos)" },
  { id: "desert-sand", label: "Arena Desierto (beiges y ocres cálidos)" },
  { id: "tropical-paradise", label: "Paraíso Tropical (turquesas y verdes vibrantes)" },
  { id: "autumn-leaves", label: "Hojas Otoñales (naranjas, rojos y marrones)" },
  { id: "spring-bloom", label: "Floración Primaveral (verdes frescos y rosas)" },
  { id: "winter-frost", label: "Escarcha Invernal (blancos y azules fríos)" },
  { id: "meadow-green", label: "Verde Pradera (verdes claros y vibrantes)" },
  { id: "volcanic-red", label: "Rojo Volcánico (rojos y negros intensos)" },
  { id: "coral-reef", label: "Arrecife de Coral (naranjas, rosas y turquesas)" },
  { id: "rainforest", label: "Selva Tropical (verdes intensos y variados)" },
  { id: "savanna-gold", label: "Oro Sabana (amarillos y marrones cálidos)" },
  { id: "arctic-blue", label: "Azul Ártico (azules claros y blancos)" },
  { id: "canyon-red", label: "Rojo Cañón (rojos terrosos y ocres)" },
  { id: "jungle-green", label: "Verde Jungla (verdes oscuros y profundos)" },

  // PALETAS TEMÁTICAS ESPECIALES
  { id: "chakra-rainbow", label: "Arcoíris de Chakras (espectro de los 7 chakras)" },
  { id: "twilight-dusk", label: "Crepúsculo (púrpuras, naranjas y azules del atardecer)" },
  { id: "northern-lights", label: "Aurora Boreal (verdes, azules y violetas etéreos)" },
  { id: "forest-magic", label: "Magia del Bosque (verdes, marrones y toques de luz)" },
  { id: "deep-space", label: "Espacio Profundo (azules, violetas y negros cósmicos)" },
  { id: "underwater-world", label: "Mundo Submarino (azules, verdes y turquesas)" },
  { id: "enchanted-garden", label: "Jardín Encantado (verdes, rosas y violetas)" },
  { id: "sacred-geometry", label: "Geometría Sagrada (dorados, azules y violetas)" },
  { id: "alchemy-lab", label: "Laboratorio Alquímico (dorados, rojos y negros)" },
  { id: "fairy-tale", label: "Cuento de Hadas (pasteles mágicos y brillantes)" },
  { id: "steampunk", label: "Steampunk (marrones, cobres y dorados)" },
  { id: "cyberpunk", label: "Cyberpunk (neones sobre negro, azules y magentas)" },
  { id: "gothic-romance", label: "Romance Gótico (rojos, negros y púrpuras)" },
  { id: "art-nouveau", label: "Art Nouveau (verdes, dorados y marrones)" },
  { id: "art-deco", label: "Art Deco (negros, dorados y colores joya)" },
  { id: "minimalist", label: "Minimalista (blancos, negros y un acento)" },
  { id: "maximalist", label: "Maximalista (combinación rica de múltiples colores)" },
  { id: "retro-wave", label: "Retro Wave (neón rosa, azul y púrpura)" },
  { id: "vaporwave", label: "Vaporwave (pasteles retro digitales)" },
  { id: "cottagecore", label: "Cottagecore (pasteles naturales y terrosos)" },
  { id: "dark-academia", label: "Academia Oscura (marrones, beiges y negros)" },
  { id: "light-academia", label: "Academia Clara (beiges, cremas y marrones claros)" },
  { id: "witchcore", label: "Witchcore (verdes bosque, negros y púrpuras)" },
  { id: "goblincore", label: "Goblincore (verdes musgo, marrones y ocres)" },
  { id: "dreamcore", label: "Dreamcore (pasteles oníricos y surrealistas)" },
  { id: "weirdcore", label: "Weirdcore (colores saturados y contrastantes)" },
  { id: "kidcore", label: "Kidcore (primarios brillantes y juguetones)" },
  { id: "royalcore", label: "Royalcore (púrpuras, dorados y azules reales)" },
]

const animationTypes = [
  // Animaciones web modernas
  { value: "parallax", label: "Parallax (capas que se mueven a diferentes velocidades)" },
  { value: "morphing", label: "Transformación de Formas (cambios suaves entre formas)" },
  { value: "particle", label: "Partículas (pequeños elementos animados)" },
  { value: "kinetic", label: "Tipografía Cinética (texto en movimiento)" },
  { value: "liquid", label: "Líquido/Fluido (movimientos orgánicos como agua)" },
  { value: "glitch", label: "Glitch (efecto de error digital)" },
  { value: "3d", label: "3D (rotaciones y perspectiva tridimensional)" },
  { value: "scroll-triggered", label: "Activado por Scroll (aparece al desplazar)" },
  { value: "micro-interactions", label: "Micro-Interacciones (pequeñas respuestas a acciones)" },
  { value: "lottie", label: "Lottie (animaciones vectoriales avanzadas)" },
  { value: "svg-animation", label: "Animación SVG (gráficos vectoriales animados)" },
  { value: "skeleton-loading", label: "Carga Esqueleto (placeholders animados)" },
  { value: "hover-effects", label: "Efectos al Pasar el Cursor (cambios con mouse encima)" },
  { value: "infinite-loop", label: "Bucle Infinito (animación continua)" },

  // Animaciones místicas y esotéricas
  { value: "magical-sparkles", label: "Destellos Mágicos (brillos y chispas)" },
  { value: "smoke-reveal", label: "Revelación con Humo (elementos que aparecen entre humo)" },
  { value: "mystical-glow", label: "Resplandor Místico (auras brillantes)" },
  { value: "crystal-refraction", label: "Refracción de Cristal (efectos de luz a través de cristal)" },
  { value: "tarot-flip", label: "Volteo de Tarot (cartas que se giran)" },
  { value: "astral-projection", label: "Proyección Astral (efectos etéreos saliendo del cuerpo)" },
  { value: "alchemical-transmutation", label: "Transmutación Alquímica (transformación de elementos)" },
  { value: "ritual-circle", label: "Círculo Ritual (patrones circulares activándose)" },
  { value: "spell-casting", label: "Lanzamiento de Hechizos (efectos mágicos en progreso)" },
  { value: "ethereal-mist", label: "Niebla Etérea (neblina mística)" },

  // Más animaciones esotéricas
  { value: "cosmic-journey", label: "Viaje Cósmico (movimiento entre estrellas)" },
  { value: "portal-opening", label: "Apertura de Portal (paso entre dimensiones)" },
  { value: "levitation", label: "Levitación (objetos flotando)" },
  { value: "constellation-forming", label: "Formación de Constelaciones (estrellas conectándose)" },
  { value: "energy-flow", label: "Flujo de Energía (corrientes de poder)" },
  { value: "aura-pulsation", label: "Pulsación de Aura (campos energéticos pulsantes)" },
  { value: "elemental-surge", label: "Oleada Elemental (manifestación de elementos)" },
  { value: "spirit-manifestation", label: "Manifestación Espiritual (aparición gradual)" },

  // Animaciones naturales y elementales
  { value: "flame-dance", label: "Danza de Llamas (movimiento de fuego)" },
  { value: "water-ripple", label: "Ondulación de Agua (círculos expandiéndose)" },
  { value: "earth-tremor", label: "Temblor de Tierra (vibraciones y movimientos)" },
  { value: "wind-swirl", label: "Remolino de Viento (movimientos circulares)" },
  { value: "lightning-strike", label: "Rayo Eléctrico (destellos brillantes)" },
  { value: "shadow-play", label: "Juego de Sombras (sombras en movimiento)" },
  { value: "crystal-growth", label: "Crecimiento Cristalino (formación gradual)" },
  { value: "lunar-phases", label: "Fases Lunares (ciclo de la luna)" },
  { value: "solar-flare", label: "Llamarada Solar (explosiones de luz)" },
  { value: "starry-twinkle", label: "Destello Estelar (estrellas brillantes)" },

  // Otras animaciones
  { value: "runic-inscription", label: "Inscripción Rúnica (símbolos que se dibujan)" },
  { value: "astral-alignment", label: "Alineación Astral (planetas moviéndose)" },
  { value: "dreamcatcher", label: "Atrapasueños (movimiento hipnótico)" },
  { value: "vortex-spiral", label: "Espiral Vórtice (movimiento en espiral hacia centro)" },
  { value: "chakra-activation", label: "Activación de Chakras (centros energéticos iluminándose)" },
  { value: "time-lapse", label: "Tiempo Acelerado (cambios rápidos paulatinos)" },
  { value: "none", label: "Sin Animaciones (diseño estático)" },
]

const borderStyles = [
  // Estilos básicos de bordes
  { value: "rounded", label: "Redondeado (esquinas suaves)" },
  { value: "sharp", label: "Afilado/Angular (esquinas en ángulo recto)" },
  { value: "wavy", label: "Ondulado (línea con ondulaciones)" },
  { value: "gradient", label: "Degradado (transición de colores)" },
  { value: "glowing", label: "Brillante (efecto luminoso)" },
  { value: "dashed", label: "Punteado (línea discontinua)" },
  { value: "double", label: "Doble (dos líneas paralelas)" },
  { value: "ridge", label: "Relieve (efecto 3D saliente)" },
  { value: "inset", label: "Insertado (efecto 3D entrante)" },
  { value: "outset", label: "Saliente (efecto 3D emergente)" },
  { value: "groove", label: "Ranurado (efecto de ranura)" },
  { value: "dotted", label: "Punteado (puntos separados)" },
  { value: "none", label: "Sin Bordes (sin línea visible)" },
  { value: "hidden", label: "Oculto (espacio pero invisible)" },
  { value: "mixed", label: "Mixto (combinación de estilos)" },

  // Estilos especiales
  { value: "asymmetric", label: "Asimétrico (diferente en cada lado)" },
  { value: "organic", label: "Orgánico (formas naturales irregulares)" },
  { value: "animated", label: "Animado (con movimiento)" },
  { value: "image-border", label: "Borde de Imagen (usando imágenes)" },
  { value: "shadow-outline", label: "Contorno con Sombra (sin línea, solo sombra)" },
  { value: "glow-pulse", label: "Pulso Brillante (resplandor que varía)" },
  { value: "neon", label: "Brillante como tubo de luz)" },
  { value: "outlined", label: "Delineado (línea fina pero definida)" },
  { value: "scalloped", label: "Festoneado (semicírculos repetidos)" },

  // Estilos místicos y esotéricos
  { value: "runic", label: "Rúnico (con símbolos nórdicos)" },
  { value: "magical-symbols", label: "Símbolos Mágicos (signos arcanos)" },
  { value: "pentagram", label: "Pentagrama (estrella de cinco puntas)" },
  { value: "alchemical-symbols", label: "Símbolos Alquímicos (notaciones antiguas)" },
  { value: "celestial-patterns", label: "Patrones Celestiales (estrellas y lunas)" },
  { value: "mystical-knots", label: "Nudos Místicos (entrelazados sin fin)" },
  { value: "sacred-geometry", label: "Geometría Sagrada (patrones matemáticos divinos)" },
  { value: "spell-circle", label: "Círculo de Hechizos (con inscripciones)" },
  { value: "grimoire-frame", label: "Marco de Grimorio (como página de libro mágico)" },
  { value: "tarot-inspired", label: "Inspirado en Tarot (símbolos de cartas)" },

  // Más estilos esotéricos
  { value: "crystal-facets", label: "Facetas de Cristal (como gemas cortadas)" },
  { value: "ancient-script", label: "Escritura Antigua (caracteres misteriosos)" },
  { value: "zodiac-symbols", label: "Símbolos Zodiacales (signos astrológicos)" },
  { value: "elemental-borders", label: "Bordes Elementales (fuego, agua, tierra, aire)" },
  { value: "witch-sigils", label: "Sigilos de Bruja (símbolos personales de poder)" },
  { value: "cosmic-waves", label: "Ondas Cósmicas (líneas ondulantes energéticas)" },
  { value: "vine-and-flower", label: "Enredaderas y Flores (elementos naturales)" },
  { value: "dragon-scale", label: "Escamas de Dragón (patrón reptiliano)" },
  { value: "feather-edge", label: "Borde de Plumas (liviano y etéreo)" },
  { value: "stone-carved", label: "Tallado en Piedra (aspecto de relieve en roca)" },

  // Estilos culturales e históricos
  { value: "celtic-knot", label: "Nudo Celta (entrelazado tradicional)" },
  { value: "egyptian-hieroglyphs", label: "Jeroglíficos Egipcios (escritura antigua)" },
  { value: "mesoamerican", label: "Mesoamericano (patrones mayas o aztecas)" },
  { value: "gothic-arch", label: "Arco Gótico (inspirado en arquitectura)" },
  { value: "art-nouveau-curves", label: "Curvas Art Nouveau (líneas orgánicas decorativas)" },
  { value: "medieval-illumination", label: "Iluminación Medieval (como manuscritos)" },
  { value: "renaissance-frame", label: "Marco Renacentista (proporciones clásicas)" },
  { value: "victorian-ornate", label: "Ornamentado Victoriano (muy decorado)" },
  { value: "persian-arabesque", label: "Arabesco Persa (patrones geométricos repetitivos)" },
  { value: "greek-key", label: "Greca Griega (patrón de meandro)" },
]

const interactivityOptions = [
  // Efectos básicos de interacción
  { id: "hover-effects", label: "Efectos al Pasar el Cursor (cambios al acercar el mouse)" },
  { id: "click-animations", label: "Animaciones al Hacer Clic (respuestas visuales al pulsar)" },
  { id: "scroll-effects", label: "Efectos de Desplazamiento (cambios al hacer scroll)" },
  { id: "parallax-scrolling", label: "Desplazamiento Parallax (capas a diferentes velocidades)" },
  { id: "smooth-scroll", label: "Desplazamiento Suave (movimiento fluido entre secciones)" },
  { id: "scroll-snap", label: "Ajuste de Desplazamiento (se detiene en puntos específicos)" },
  { id: "lazy-loading", label: "Carga Perezosa (elementos que cargan al ser visibles)" },
  { id: "infinite-scroll", label: "Desplazamiento Infinito (carga contenido continuamente)" },

  // Interacciones personalizadas
  { id: "cursor-custom", label: "Cursor Personalizado (cambia la apariencia del puntero)" },
  { id: "cursor-trail", label: "Estela de Cursor (deja rastro al mover el mouse)" },
  { id: "magnetic-elements", label: "Elementos Magnéticos (atraen el cursor)" },
  { id: "tilt-effect", label: "Efecto de Inclinación 3D (rota elementos según el cursor)" },
  { id: "follow-cursor", label: "Seguimiento de Cursor (elementos que siguen al mouse)" },
  { id: "cursor-spotlight", label: "Foco de Cursor (ilumina áreas por donde pasa)" },
  { id: "cursor-ripple", label: "Efecto Onda al Clic (ondas que emergen al pulsar)" },

  // Elementos interactivos
  { id: "draggable-elements", label: "Elementos Arrastrables (se pueden mover)" },
  { id: "interactive-cards", label: "Tarjetas Interactivas (reaccionan al usuario)" },
  { id: "flip-cards", label: "Tarjetas Volteables (muestran reverso al interactuar)" },
  { id: "expandable-sections", label: "Secciones Expandibles (amplían su contenido)" },
  { id: "accordion-panels", label: "Paneles Acordeón (abren y cierran verticalmente)" },
  { id: "tabs-navigation", label: "Navegación por Pestañas (contenido organizado)" },
  { id: "modal-popups", label: "Ventanas Emergentes (información adicional)" },
  { id: "tooltips", label: "Globos de Información (textos explicativos breves)" },

  // Efectos de revelación
  { id: "reveal-on-scroll", label: "Revelación al Desplazar (aparecen al hacer scroll)" },
  { id: "fade-in-elements", label: "Elementos que Aparecen (se desvanecen gradualmente)" },
  { id: "slide-in-elements", label: "Elementos Deslizantes (entran desde los bordes)" },
  { id: "staggered-animations", label: "Animaciones Escalonadas (secuencia de elementos)" },
  { id: "text-scramble", label: "Efecto de Texto Revuelto (letras que cambian)" },
  { id: "typewriter-effect", label: "Efecto Máquina de Escribir (texto que aparece letra a letra)" },
  { id: "text-highlight", label: "Resaltado de Texto (enfatiza palabras clave)" },

  // Interacciones visuales
  { id: "image-comparison", label: "Comparación de Imágenes (antes/después deslizable)" },
  { id: "image-zoom", label: "Zoom de Imágenes (amplía al pasar el cursor)" },
  { id: "image-pan", label: "Paneo de Imágenes (desplaza imagen grande)" },
  { id: "lightbox-gallery", label: "Galería Lightbox (imágenes a pantalla completa)" },
  { id: "image-hotspots", label: "Puntos Interactivos en Imágenes (áreas clickeables)" },
  { id: "panorama-viewer", label: "Visor de Panorámicas (360 grados)" },
  { id: "3d-object-viewer", label: "Visor de Objetos 3D (rotación interactiva)" },

  // Narración y secuencias
  { id: "interactive-storytelling", label: "Narración Interactiva (historia con decisiones)" },
  { id: "step-by-step-guide", label: "Guía Paso a Paso (proceso secuencial)" },
  { id: "progress-tracker", label: "Rastreador de Progreso (muestra avance)" },
  { id: "timeline-scrubber", label: "Línea de Tiempo Interactiva (navega por eventos)" },
  { id: "chapter-navigation", label: "Navegación por Capítulos (contenido organizado)" },
  { id: "choose-your-path", label: "Elige tu Camino (opciones que alteran contenido)" },

  // Interacciones avanzadas
  { id: "gesture-controls", label: "Controles por Gestos (deslizar, pellizcar, etc.)" },
  { id: "audio-feedback", label: "Retroalimentación de Audio (sonidos al interactuar)" },
  { id: "haptic-feedback", label: "Retroalimentación Háptica (vibración en dispositivos)" },
  { id: "gyroscope-interaction", label: "Interacción con Giroscopio (usando orientación del dispositivo)" },
  { id: "motion-detection", label: "Detección de Movimiento (reacciona a la cámara)" },
  { id: "voice-commands", label: "Comandos de Voz (control por habla)" },
  { id: "proximity-sensing", label: "Detección de Proximidad (cercanía al dispositivo)" },

  // Interacciones místicas y esotéricas
  { id: "interactive-particles", label: "Partículas Interactivas (responden al usuario)" },
  { id: "energy-field", label: "Campo de Energía (aura que sigue al cursor)" },
  { id: "crystal-resonance", label: "Resonancia de Cristales (vibran con interacción)" },
  { id: "cosmic-alignment", label: "Alineación Cósmica (elementos que se ordenan)" },
  { id: "spirit-guide", label: "Guía Espiritual (asistente que aparece)" },
  { id: "magical-reveal", label: "Revelación Mágica (descubre contenido oculto)" },
  { id: "aura-visualization", label: "Visualización de Aura (colores que cambian)" },

  // Otras interacciones
  { id: "hover-video-play", label: "Reproducción de Video al Pasar el Cursor" },
  { id: "interactive-svg", label: "SVG Interactivo (gráficos vectoriales con respuesta)" },
  { id: "morphing-shapes", label: "Formas Cambiantes (transformación de elementos)" },
  { id: "floating-elements", label: "Elementos Flotantes (movimiento sutil constante)" },
  { id: "liquid-distortion", label: "Distorsión Líquida (efecto ondulante al interactuar)" },
  { id: "particle-explosion", label: "Explosión de Partículas (dispersión al clic)" },
  { id: "magical-cursor", label: "Cursor Mágico (efectos místicos al movimiento)" },
]

const transitionOptions = [
  // Transiciones básicas
  { id: "fade-transition", label: "Desvanecimiento (aparece/desaparece gradualmente)" },
  { id: "slide-transition", label: "Deslizamiento (entra/sale lateralmente)" },
  { id: "zoom-transition", label: "Zoom (aumenta/disminuye tamaño)" },
  { id: "flip-transition", label: "Volteo (gira como página)" },
  { id: "rotate-transition", label: "Rotación (gira sobre un eje)" },
  { id: "scale-transition", label: "Escala (cambia tamaño)" },
  { id: "push-transition", label: "Empuje (un elemento empuja a otro)" },
  { id: "cover-transition", label: "Cubrimiento (un elemento tapa a otro)" },
  { id: "reveal-transition", label: "Revelación (descubre un elemento)" },
  { id: "bounce-transition", label: "Rebote (efecto elástico)" },

  // Transiciones de página y secciones
  { id: "morph-transition", label: "Transformación (cambio de forma)" },
  { id: "page-transition", label: "Transición entre Páginas (navegación fluida)" },
  { id: "scroll-transition", label: "Transición al Desplazar (cambios al hacer scroll)" },
  { id: "stagger-transition", label: "Transición Escalonada (elementos en secuencia)" },
  { id: "sequential-transition", label: "Transición Secuencial (orden predefinido)" },
  { id: "crossfade-transition", label: "Fundido Cruzado (un elemento reemplaza a otro)" },
  { id: "swipe-transition", label: "Barrido (como pasar página)" },
  { id: "slide-up-transition", label: "Deslizamiento Hacia Arriba (entrada desde abajo)" },
  { id: "slide-down-transition", label: "Deslizamiento Hacia Abajo (entrada desde arriba)" },

  // Transiciones creativas
  { id: "liquid-transition", label: "Transición Líquida (efecto de fluido)" },
  { id: "elastic-transition", label: "Transición Elástica (estiramiento y contracción)" },
  { id: "folding-transition", label: "Plegado (como papel que se dobla)" },
  { id: "origami-transition", label: "Transición Tipo Origami (pliegues y dobleces)" },
  { id: "particle-transition", label: "Transición de Partículas (descomposición en puntos)" },
  { id: "glitch-transition", label: "Transición con Efecto Glitch (error digital)" },
  { id: "distortion-transition", label: "Transición con Distorsión (deformación)" },
  { id: "blur-transition", label: "Transición con Desenfoque (difuminado)" },
  { id: "ripple-transition", label: "Transición de Ondas (efecto de agua)" },
  { id: "shatter-transition", label: "Transición de Fragmentación (rompe en pedazos)" },

  // Transiciones de desplazamiento y dirección
  { id: "wipe-transition", label: "Transición de Barrido (borra gradualmente)" },
  { id: "split-transition", label: "Transición de División (separa en partes)" },
  { id: "blinds-transition", label: "Transición de Persianas (bandas horizontales/verticales)" },
  { id: "radial-transition", label: "Transición Radial (desde el centro)" },
  { id: "iris-transition", label: "Transición Iris (círculo que se abre/cierra)" },
  { id: "wind-transition", label: "Transición de Viento (elementos soplados)" },
  { id: "domino-transition", label: "Transición Dominó (efecto en cascada)" },
  { id: "shuffle-transition", label: "Transición de Barajado (elementos cambian posición)" },
  { id: "cube-transition", label: "Transición de Cubo (giro en 3D)" },
  { id: "carousel-transition", label: "Transición Carrusel (rotación circular)" },

  // Transiciones místicas y esotéricas
  { id: "portal-transition", label: "Transición de Portal (entrada a otro mundo)" },
  { id: "smoke-transition", label: "Transición de Humo (difuminado nebuloso)" },
  { id: "magical-transition", label: "Transición Mágica (destellos y brillos)" },
  { id: "elemental-transition", label: "Transición Elemental (fuego, agua, etc.)" },
  { id: "astral-transition", label: "Transición Astral (efecto cósmico)" },
  { id: "dimensional-transition", label: "Transición Dimensional (cambio de realidad)" },
  { id: "alchemical-transition", label: "Transición Alquímica (transformación mística)" },
  { id: "crystal-transition", label: "Transición Cristalina (facetas reflectantes)" },
  { id: "spirit-transition", label: "Transición Espiritual (energía etérea)" },
  { id: "veil-transition", label: "Transición de Velo (cortina que se descorre)" },

  // Más transiciones esotéricas
  { id: "mystical-swirl", label: "Remolino Místico (espiral energética)" },
  { id: "enchanted-dissolve", label: "Disolución Encantada (desvanecimiento mágico)" },
  { id: "celestial-reveal", label: "Revelación Celestial (luz desde arriba)" },
  { id: "arcane-symbols", label: "Símbolos Arcanos (runas que aparecen/desaparecen)" },
  { id: "moon-phase", label: "Fase Lunar (como el ciclo de la luna)" },
  { id: "ancient-scroll", label: "Pergamino Antiguo (desenrollado)" },
  { id: "book-of-shadows", label: "Libro de Sombras (páginas que se pasan)" },
  { id: "crystal-scry", label: "Visión en Cristal (imagen que se forma)" },
  { id: "dreamweaver", label: "Tejedor de Sueños (hilos de realidad)" },
  { id: "shadow-casting", label: "Proyección de Sombras (siluetas en movimiento)" },

  // Animaciones de movimiento
  { id: "scroll-triggered-animation", label: "Animación Activada por Desplazamiento" },
  { id: "entrance-animation", label: "Animación de Entrada (al cargar la página)" },
  { id: "exit-animation", label: "Animación de Salida (al abandonar la página)" },
  { id: "hover-animation", label: "Animación al Pasar el Cursor" },
  { id: "click-animation", label: "Animación al Hacer Clic" },
  { id: "focus-animation", label: "Animación al Enfocar (formularios)" },
  { id: "parallax-scroll", label: "Desplazamiento Parallax (profundidad al scroll)" },
]

const esotericElementsOptions = [
  // Herramientas de adivinación interactivas
  { id: "tarot-interactive", label: "Cartas de Tarot Interactivas (lectura digital)" },
  { id: "crystal-viewer", label: "Visor de Cristales 3D (gira y examina)" },
  { id: "astrology-chart", label: "Carta Astrológica Dinámica (personalizada)" },
  { id: "zodiac-wheel", label: "Rueda del Zodíaco Interactiva (signos y casas)" },
  { id: "rune-caster", label: "Lanzador de Runas (tirada virtual)" },
  { id: "pendulum-divination", label: "Péndulo de Adivinación (oscila con respuestas)" },
  { id: "crystal-ball", label: "Bola de Cristal Interactiva (visiones al tocar)" },
  { id: "oracle-cards", label: "Cartas Oráculo (mensajes intuitivos)" },
  { id: "i-ching", label: "I Ching Interactivo (hexagramas adivinatorios)" },
  { id: "scrying-mirror", label: "Espejo de Visión (superficie reflectante mágica)" },

  // Libros y textos místicos
  { id: "spell-book", label: "Libro de Hechizos Navegable (conjuros y pociones)" },
  { id: "grimoire", label: "Grimorio Digital (conocimiento arcano)" },
  { id: "sacred-text", label: "Texto Sagrado Interactivo (con anotaciones)" },
  { id: "alchemical-manuscript", label: "Manuscrito Alquímico (fórmulas antiguas)" },
  { id: "book-of-shadows", label: "Libro de Sombras (diario mágico personal)" },
  { id: "magical-codex", label: "Códice Mágico (símbolos y correspondencias)" },
  { id: "dream-journal", label: "Diario de Sueños (registro onírico)" },
  { id: "prophecy-scroll", label: "Pergamino de Profecía (predicciones futuras)" },
  { id: "hermetic-text", label: "Texto Hermético (sabiduría oculta)" },
  { id: "kabbalistic-tree", label: "Árbol Cabalístico (sefirots interactivos)" },

  // Elementos místicos y rituales
  { id: "ouija-board", label: "Tablero Ouija Virtual (comunicación espiritual)" },
  { id: "alchemy-lab", label: "Laboratorio de Alquimia (experimenta y transforma)" },
  { id: "sacred-geometry-generator", label: "Generador de Geometría Sagrada (patrones)" },
  { id: "elemental-invoker", label: "Invocador de Elementos (fuego, agua, tierra, aire)" },
  { id: "lunar-phase-tracker", label: "Rastreador de Fases Lunares (calendario lunar)" },
  { id: "chakra-visualizer", label: "Visualizador de Chakras (centros energéticos)" },
  { id: "aura-reader", label: "Lector de Aura (colores energéticos)" },
  { id: "spirit-guide-connector", label: "Conector con Guías Espirituales (mensajes)" },
  { id: "ritual-circle-creator", label: "Creador de Círculos Rituales (protección)" },
  { id: "candle-magic", label: "Magia de Velas (ritual interactivo)" },

  // Herramientas útiles y prácticas
  { id: "mystical-map", label: "Mapa Místico Interactivo (lugares de poder)" },
  { id: "herb-encyclopedia", label: "Enciclopedia de Hierbas Mágicas (propiedades)" },
  { id: "sigil-generator", label: "Generador de Sigilos (símbolos personales)" },
  { id: "dream-interpreter", label: "Intérprete de Sueños (significados simbólicos)" },
  { id: "meditation-guide", label: "Guía de Meditación Interactiva (ejercicios)" },
  { id: "numerology-calculator", label: "Calculadora de Numerología (significados)" },
  { id: "palmistry-reader", label: "Lector de Quiromancia (líneas de la mano)" },
  { id: "natal-chart-generator", label: "Generador de Carta Natal (posición planetaria)" },
  { id: "moon-gardening", label: "Calendario de Jardinería Lunar (ciclos de cultivo)" },
  { id: "crystal-grid-planner", label: "Planificador de Rejillas de Cristales (patrones)" },

  // Calendarios y tiempo sagrado
  { id: "sabbat-calendar", label: "Calendario de Sabbats (festividades paganas)" },
  { id: "astrological-timing", label: "Temporizador Astrológico (momentos propicios)" },
  { id: "retrograde-tracker", label: "Rastreador de Retrogradaciones (planetas)" },
  { id: "celestial-events", label: "Eventos Celestiales (fenómenos astronómicos)" },
  { id: "astronomical-clock", label: "Reloj Astronómico (posiciones planetarias)" },
  { id: "planetary-hours", label: "Horas Planetarias (momentos mágicos)" },
  { id: "eclipse-predictor", label: "Predictor de Eclipses (fechas y significados)" },
  { id: "solstice-equinox", label: "Solsticios y Equinoccios (cambios estacionales)" },
  { id: "cosmic-calendar", label: "Calendario Cósmico (eventos universales)" },
  { id: "merkaba-meditation", label: "Meditación Merkaba (vehículo de luz)" },

  // Consultas y orientación
  { id: "oracle-consultation", label: "Consulta Oracular (preguntas y respuestas)" },
  { id: "ancestor-connection", label: "Conexión Ancestral (mensaje de antepasados)" },
  { id: "akashic-records", label: "Acceso a Registros Akáshicos (memoria universal)" },
  { id: "spiritual-assessment", label: "Evaluación Espiritual (nivel de conciencia)" },
  { id: "energy-balancer", label: "Equilibrador Energético (armonización)" },
  { id: "soul-purpose-finder", label: "Buscador de Propósito del Alma (misión vital)" },
  { id: "karmic-pattern", label: "Patrón Kármico (lecciones vitales)" },
  { id: "past-life-viewer", label: "Visor de Vidas Pasadas (encarnaciones previas)" },
  { id: "animal-spirit-guide", label: "Guía de Espíritu Animal (tótem personal)" },
  { id: "elemental-affinity", label: "Afinidad Elemental (elemento dominante)" },
]

const codeStyleOptions = [
  { value: "standard", label: "Estándar" },
  { value: "detailed", label: "Detallado con Comentarios" },
  { value: "minimal", label: "Minimalista" },
  { value: "esoteric", label: "Esotérico" },
  { value: "mystical", label: "Místico con Símbolos" },
  { value: "professional", label: "Profesional" },
  { value: "educational", label: "Educativo" },
  { value: "arcane", label: "Arcano" },
  { value: "optimized", label: "Código Optimizado para Velocidad" },
  { value: "compressed", label: "Código Resumido/Comprimido" },
  { value: "performance", label: "Optimizado para Rendimiento" },
  { value: "lightweight", label: "Ligero (Mínimo JavaScript)" },
  { value: "semantic", label: "Semántico y Accesible" },
]

const imageStyles = [
  { value: "photo", label: "Fotografía Realista" },
  { value: "illustration", label: "Ilustración Digital" },
  { value: "abstract", label: "Abstracto" },
  { value: "cartoon", label: "Caricatura" },
  { value: "line-art", label: "Dibujo a Línea" },
  { value: "watercolor", label: "Acuarela" },
  { value: "oil-painting", label: "Pintura al Óleo" },
  { value: "pixel-art", label: "Pixel Art" },
  { value: "collage", label: "Collage" },
  { value: "geometric", label: "Geométrico" },
  { value: "3d-render", label: "Renderizado 3D" },
  { value: "vintage", label: "Vintage/Retro" },
  { value: "cyberpunk", label: "Cyberpunk" },
  { value: "steampunk", label: "Steampunk" },
  { value: "fantasy", label: "Fantasía" },
  { value: "sci-fi", label: "Ciencia Ficción" },
  { value: "esoteric", label: "Esotérico" },
  { value: "mystical", label: "Místico" },
  { value: "anime", label: "Anime/Manga" },
  { value: "comic-book", label: "Cómic" },
]

const videoPlaybackOptions = [
  { value: "autoplay", label: "Reproducción Automática" },
  { value: "loop", label: "Bucle Continuo" },
  { value: "muted", label: "Silenciado" },
  { value: "controls", label: "Mostrar Controles" },
  { value: "inline", label: "Reproducción en Línea" },
  { value: "background", label: "Fondo (Sin Controles)" },
  { value: "lazy-load", label: "Carga Diferida" },
  { value: "responsive", label: "Adaptativo" },
  { value: "fullscreen", label: "Pantalla Completa" },
  { value: "pip", label: "Picture-in-Picture" },
]

const videoEffectOptions = [
  { value: "none", label: "Sin Efecto" },
  { value: "grayscale", label: "Escala de Grises" },
  { value: "sepia", label: "Sepia" },
  { value: "blur", label: "Desenfoque" },
  { value: "invert", label: "Invertir Colores" },
  { value: "opacity", label: "Opacidad" },
  { value: "brightness", label: "Brillo" },
  { value: "contrast", label: "Contraste" },
  { value: "saturate", label: "Saturación" },
  { value: "hue-rotate", label: "Rotación de Tono" },
  { value: "pixelate", label: "Pixelado" },
  { value: "vignette", label: "Viñeta" },
]

const performanceOptions = [
  { id: "lazy-loading", label: "Carga Perezosa de Imágenes" },
  { id: "code-splitting", label: "División de Código" },
  { id: "image-optimization", label: "Optimización de Imágenes" },
  { id: "minification", label: "Minificación de CSS/JS" },
  { id: "compression", label: "Compresión de Archivos" },
  { id: "caching", label: "Caché del Navegador" },
  { id: "cdn", label: "Red de Distribución de Contenido (CDN)" },
  { id: "tree-shaking", label: "Eliminación de Código Inutilizado" },
  { id: "http2", label: "HTTP/2" },
  { id: "service-workers", label: "Service Workers" },
  { id: "virtualization", label: "Virtualización de Listas" },
  { id: "debounce-throttle", label: "Debounce y Throttling" },
]

const seoOptions = [
  { id: "meta-tags", label: "Meta Etiquetas (Título, Descripción)" },
  { id: "structured-data", label: "Datos Estructurados (Schema.org)" },
  { id: "sitemap", label: "Mapa del Sitio (Sitemap.xml)" },
  { id: "robots-txt", label: "Archivo Robots.txt" },
  { id: "alt-text", label: "Texto Alternativo en Imágenes" },
  { id: "canonical-urls", label: "URLs Canónicas" },
  { id: "mobile-friendly", label: "Diseño Adaptable a Móviles" },
  { id: "page-speed", label: "Optimización de Velocidad de Carga" },
  { id: "https", label: "HTTPS (Conexión Segura)" },
  { id: "keyword-research", label: "Investigación de Palabras Clave" },
  { id: "internal-linking", label: "Enlazado Interno" },
  { id: "backlinks", label: "Construcción de Enlaces Externos" },
  { id: "social-media", label: "Integración con Redes Sociales" },
  { id: "analytics", label: "Analítica Web (Google Analytics)" },
  { id: "accessibility", label: "Accesibilidad Web (WCAG)" },
]

const browserCompatibilityOptions = [
  { id: "polyfills", label: "polyfills" },
  { id: "vendor-prefixes", label: "Prefijos de Proveedor (Vendor Prefixes)" },
  { id: "css-reset", label: "CSS Reset/Normalize" },
  { id: "cross-browser-testing", label: "Pruebas en Diferentes Navegadores" },
  { id: "progressive-enhancement", label: "Mejora Progresiva" },
  { id: "graceful-degradation", label: "Degradación Grácil" },
  { id: "conditional-css", label: "CSS Condicional" },
  { id: "javascript-fallbacks", label: "Alternativas en JavaScript" },
  { id: "aria-attributes", label: "Atributos ARIA (Accesibilidad)" },
  { id: "viewport-meta-tag", label: "Meta Etiqueta Viewport" },
  { id: "browser-specific-hacks", label: "Trucos Específicos para Navegadores" },
  { id: "css-grid-fallbacks", label: "Alternativas para CSS Grid" },
  { id: "flexbox-fallbacks", label: "Alternativas para Flexbox" },
]

type PromptGeneratorProps = {
  onGenerate: (data: z.infer<typeof formSchema>) => void
  isGenerating: boolean
}

export function PromptGenerator({ onGenerate, isGenerating }: PromptGeneratorProps) {
  const [showImageOptions, setShowImageOptions] = useState(false)
  const [showVideoOptions, setShowVideoOptions] = useState(false)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      includeImages: false,
      includeBackgroundVideo: false,
      videoPlayback: "autoplay",
      videoLoop: true,
      videoMuted: true,
      videoLazyLoad: true,
      videoEffect: "none",
      videoOpacity: 80,
      videoPlaybackSpeed: 100,
      videoIntersectionObserver: false,
      contactInfo: false,
      colorScheme: [],
      targetPlatform: "mobile",
      performance: [],
      seo: [],
      browserCompatibility: [],
      interactivity: [],
      transitions: [],
      esotericElements: [],
      splitCodeOutput: true,
      maxPartLength: 1500,
      addDetailedComments: false,
      codeStyle: "standard",
      fixedButtonsPosition: "bottom-right",
      fixedButtonsLayout: "stacked",
      fixedButtonsSpacing: 10,
      fixedButtonsSize: "medium",
      fixedButtonsShape: "circle",
      fixedButtonsIconType: "svg",
      fixedButtonsShowLabel: false,
      fixedButtonsLabelPosition: "right",
      fixedButtonsAnimation: "pulse",
      fixedButtonsAnimationDuration: 2000,
      fixedButtonsAnimationDelay: 0,
      fixedButtonsVisibility: "always",
      fixedButtonsScrollBehavior: "none",
      fixedButtonsZIndex: 999,
      fixedButtonsIncludeWhatsapp: true,
      fixedButtonsIncludeCall: true,
      fixedButtonsCustomButtons: [],
      fixedButtonsBackdropFilter: false,
      fixedButtonsBackdropBlur: 5,
      fixedButtonsDesktopDisplay: "show",
      fixedButtonsTabletDisplay: "show",
      fixedButtonsEntryAnimation: "fade",
      fixedButtonsExitAnimation: "fade",
      fixedButtonsBoxShadow: "medium",
      fixedButtonsGlowEffect: false,
      fixedButtonsGlowColor: "brand",
      fixedButtonsClickEffect: "ripple",
      fixedButtonsAccessibility: true,
      fixedButtonsCloseOption: false,
      fixedButtonsReopenDelay: 86400,
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
              name="sectionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Sección</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo de sección" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sectionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Elige el tipo de sección de sitio web que deseas crear</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="designStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estilo de Diseño</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estilo de diseño" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {designStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Elige el estilo estético general para tu diseño</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetPlatform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plataforma Objetivo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || "mobile"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una plataforma objetivo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {targetPlatforms.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Elige la plataforma para la que se optimizará el diseño</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="includeImages"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Incluir Imágenes</FormLabel>
                    <FormDescription>¿Debe la sección incluir imágenes?</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        setShowImageOptions(checked)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {showImageOptions && (
              <FormField
                control={form.control}
                name="imageStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estilo de Imagen</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un estilo de imagen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {imageStyles.map((style) => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Elige el estilo de imágenes a incluir</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="includeBackgroundVideo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Video de Fondo</FormLabel>
                    <FormDescription>¿Incluir un video de fondo en la sección?</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        setShowVideoOptions(checked)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {showVideoOptions && (
              <div className="space-y-6 pl-6 border-l-2 border-primary/20">
                <h3 className="text-sm font-medium text-muted-foreground">Configuración de Video</h3>

                <FormField
                  control={form.control}
                  name="videoPlayback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modo de Reproducción</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un modo de reproducción" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {videoPlaybackOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Cómo se iniciará la reproducción del video</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="videoLoop"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Reproducción en Bucle</FormLabel>
                        <FormDescription>El video se reproducirá en bucle infinito</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="videoMuted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Video Silenciado</FormLabel>
                        <FormDescription>El video se reproducirá sin sonido</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="videoLazyLoad"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Carga Diferida</FormLabel>
                        <FormDescription>El video se cargará solo cuando sea necesario</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="videoIntersectionObserver"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Reproducir Solo al Estar Visible</FormLabel>
                        <FormDescription>El video solo se reproducirá cuando esté visible en pantalla</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="videoEffect"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Efecto de Video</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un efecto para el video" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {videoEffectOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Efecto visual aplicado al video de fondo</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="videoOpacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opacidad del Video: {field.value}%</FormLabel>
                      <FormControl>
                        <Slider
                          min={10}
                          max={100}
                          step={5}
                          defaultValue={[field.value]}
                          onValueChange={(values) => field.onChange(values[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Nivel de opacidad del video de fondo</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="videoPlaybackSpeed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Velocidad de Reproducción: {field.value / 100}x</FormLabel>
                      <FormControl>
                        <Slider
                          min={50}
                          max={200}
                          step={10}
                          defaultValue={[field.value]}
                          onValueChange={(values) => field.onChange(values[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Velocidad de reproducción del video (0.5x a 2x)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="fontType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Fuente</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo de fuente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fontTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Elige el estilo tipográfico para tu diseño</FormDescription>
                  <FormMessage />
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
                    <FormDescription>Selecciona los esquemas de color a utilizar en tu diseño</FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {colorOptions.map((option) => (
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
                      {animationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Elige el tipo de animaciones a incluir</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Información de Contacto</FormLabel>
                    <FormDescription>¿Incluir información de contacto en la sección?</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="borderStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estilo de Borde</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estilo de borde" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {borderStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Elige el estilo de bordes para tus elementos de diseño</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            >
              {showAdvancedOptions ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Ocultar Opciones Avanzadas
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Mostrar Opciones Avanzadas
                </>
              )}
            </Button>
          </div>

          {showAdvancedOptions && (
            <div className="space-y-6 pt-4">
              <Separator />
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Opciones Avanzadas</h3>
                <Badge variant="outline" className="text-xs">
                  Opcionales
                </Badge>
              </div>
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="performance">
                  <AccordionTrigger>Opciones de Rendimiento</AccordionTrigger>
                  <AccordionContent>
                    <FormField
                      control={form.control}
                      name="performance"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormDescription>
                              Selecciona las optimizaciones de rendimiento que deseas incluir
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {performanceOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="performance"
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
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="seo">
                  <AccordionTrigger>Opciones de SEO</AccordionTrigger>
                  <AccordionContent>
                    <FormField
                      control={form.control}
                      name="seo"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormDescription>Selecciona las optimizaciones de SEO que deseas incluir</FormDescription>
                          </div>
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {seoOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="seo"
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
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="browserCompatibility">
                  <AccordionTrigger>Compatibilidad con Navegadores</AccordionTrigger>
                  <AccordionContent>
                    <FormField
                      control={form.control}
                      name="browserCompatibility"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormDescription>Selecciona las opciones de compatibilidad con navegadores</FormDescription>
                          </div>
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {browserCompatibilityOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="browserCompatibility"
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
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="interactivity">
                  <AccordionTrigger>Opciones de Interactividad</AccordionTrigger>
                  <AccordionContent>
                    <FormField
                      control={form.control}
                      name="interactivity"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormDescription>Selecciona las opciones de interactividad para tu diseño</FormDescription>
                          </div>
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {interactivityOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="interactivity"
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
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="transitions">
                  <AccordionTrigger>Transiciones entre Secciones</AccordionTrigger>
                  <AccordionContent>
                    <FormField
                      control={form.control}
                      name="transitions"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormDescription>Selecciona las transiciones que deseas incluir</FormDescription>
                          </div>
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {transitionOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="transitions"
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
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="esotericElements">
                  <AccordionTrigger>Elementos Interactivos Esotéricos</AccordionTrigger>
                  <AccordionContent>
                    <FormField
                      control={form.control}
                      name="esotericElements"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormDescription>
                              Selecciona los elementos esotéricos interactivos que deseas incluir
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {esotericElementsOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="esotericElements"
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
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="codeConfig">
                  <AccordionTrigger>Configuración de Código</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="splitCodeOutput"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Dividir Código Largo</FormLabel>
                              <FormDescription>
                                Divide automáticamente el código generado en partes si es demasiado largo
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
                        name="maxPartLength"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Longitud Máxima por Parte</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="range"
                                  min={500}
                                  max={3000}
                                  step={100}
                                  value={field.value}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="w-full"
                                />
                                <span className="w-12 text-center">{field.value}</span>
                              </div>
                            </FormControl>
                            <FormDescription>Caracteres máximos por parte de código (entre 500 y 3000)</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="addDetailedComments"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Comentarios Detallados</FormLabel>
                              <FormDescription>
                                Incluir comentarios detallados explicando el código generado
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
                                {codeStyleOptions.map((style) => (
                                  <SelectItem key={style.value} value={style.value}>
                                    {style.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>Elige el estilo de código a generar</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}

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
                    {codeStyleOptions.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Elige el estilo general del código generado</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Opciones específicas para botones fijos en móviles */}
          {form.watch("sectionType") === "fixed-mobile-buttons" && (
            <div className="space-y-6 border-l-2 border-primary/20 pl-6">
              <h3 className="text-lg font-medium">Configuración de Botones Fijos para Móviles</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fixedButtonsPosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Posición de los Botones</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una posición" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bottom-right">Esquina Inferior Derecha</SelectItem>
                          <SelectItem value="bottom-left">Esquina Inferior Izquierda</SelectItem>
                          <SelectItem value="bottom-center">Centro Inferior</SelectItem>
                          <SelectItem value="mid-right">Centro Derecha</SelectItem>
                          <SelectItem value="mid-left">Centro Izquierda</SelectItem>
                          <SelectItem value="top-right">Esquina Superior Derecha</SelectItem>
                          <SelectItem value="top-left">Esquina Superior Izquierda</SelectItem>
                          <SelectItem value="top-center">Centro Superior</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Posición de los botones en la pantalla</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fixedButtonsLayout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disposición de los Botones</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una disposición" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="stacked">Apilados Verticalmente</SelectItem>
                          <SelectItem value="horizontal">Alineados Horizontalmente</SelectItem>
                          <SelectItem value="grid">Cuadrícula</SelectItem>
                          <SelectItem value="circular">Disposición Circular</SelectItem>
                          <SelectItem value="expandable">Expandibles (Menú Flotante)</SelectItem>
                          <SelectItem value="grouped">Agrupados con Botón Principal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Cómo se organizan los botones</FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fixedButtonsSpacing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Espaciado entre Botones: {field.value}px</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={30}
                          step={2}
                          defaultValue={[field.value]}
                          onValueChange={(values) => field.onChange(values[0])}
                        />
                      </FormControl>
                      <FormDescription>Espacio entre cada botón</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fixedButtonsSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tamaño de los Botones</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tamaño" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="small">Pequeño</SelectItem>
                          <SelectItem value="medium">Mediano</SelectItem>
                          <SelectItem value="large">Grande</SelectItem>
                          <SelectItem value="extra-large">Extra Grande</SelectItem>
                          <SelectItem value="adaptive">Adaptativo (según dispositivo)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Tamaño de los botones fijos</FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fixedButtonsShape"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forma de los Botones</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una forma" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="circle">Círculo</SelectItem>
                          <SelectItem value="square">Cuadrado</SelectItem>
                          <SelectItem value="rounded">Redondeado</SelectItem>
                          <SelectItem value="pill">Píldora</SelectItem>
                          <SelectItem value="custom">Forma Personalizada</SelectItem>
                          <SelectItem value="hexagon">Hexágono</SelectItem>
                          <SelectItem value="diamond">Diamante</SelectItem>
                          <SelectItem value="star">Estrella</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Forma de los botones fijos</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fixedButtonsIconType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Icono</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo de icono" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="svg">SVG (Vectorial)</SelectItem>
                          <SelectItem value="emoji">Emoji</SelectItem>
                          <SelectItem value="image">Imagen</SelectItem>
                          <SelectItem value="font-icon">Icono de Fuente</SelectItem>
                          <SelectItem value="animated-svg">SVG Animado</SelectItem>
                          <SelectItem value="lottie">Animación Lottie</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Tipo de icono para los botones</FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fixedButtonsShowLabel"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Mostrar Etiqueta de Texto</FormLabel>
                        <FormDescription>Mostrar texto junto al icono</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("fixedButtonsShowLabel") && (
                  <FormField
                    control={form.control}
                    name="fixedButtonsLabelPosition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Posición de la Etiqueta</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una posición" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="right">Derecha</SelectItem>
                            <SelectItem value="left">Izquierda</SelectItem>
                            <SelectItem value="top">Arriba</SelectItem>
                            <SelectItem value="bottom">Abajo</SelectItem>
                            <SelectItem value="inside">Dentro del Botón</SelectItem>
                            <SelectItem value="tooltip">Como Tooltip</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Dónde aparece el texto respecto al icono</FormDescription>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fixedButtonsAnimation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Animación de los Botones</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una animación" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Sin Animación</SelectItem>
                          <SelectItem value="pulse">Pulso</SelectItem>
                          <SelectItem value="bounce">Rebote</SelectItem>
                          <SelectItem value="shake">Sacudida</SelectItem>
                          <SelectItem value="rotate">Rotación</SelectItem>
                          <SelectItem value="scale">Escala</SelectItem>
                          <SelectItem value="glow">Resplandor</SelectItem>
                          <SelectItem value="float">Flotación</SelectItem>
                          <SelectItem value="wave">Onda</SelectItem>
                          <SelectItem value="custom">Personalizada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Animación aplicada a los botones</FormDescription>
                    </FormItem>
                  )}
                />

                {form.watch("fixedButtonsAnimation") !== "none" && (
                  <FormField
                    control={form.control}
                    name="fixedButtonsAnimationDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duración de la Animación: {field.value}ms</FormLabel>
                        <FormControl>
                          <Slider
                            min={500}
                            max={5000}
                            step={100}
                            defaultValue={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                          />
                        </FormControl>
                        <FormDescription>Duración de la animación en milisegundos</FormDescription>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fixedButtonsVisibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visibilidad de los Botones</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una opción de visibilidad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="always">Siempre Visible</SelectItem>
                          <SelectItem value="delay">Aparecer con Retraso</SelectItem>
                          <SelectItem value="scroll-down">Aparecer al Hacer Scroll Hacia Abajo</SelectItem>
                          <SelectItem value="scroll-up">Aparecer al Hacer Scroll Hacia Arriba</SelectItem>
                          <SelectItem value="exit-intent">Aparecer al Intentar Salir</SelectItem>
                          <SelectItem value="time-on-page">Aparecer Después de Tiempo en Página</SelectItem>
                          <SelectItem value="scroll-percentage">Aparecer al % de Scroll</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Cuándo se muestran los botones</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fixedButtonsScrollBehavior"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comportamiento al Scroll</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un comportamiento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Sin Cambios</SelectItem>
                          <SelectItem value="hide">Ocultar al Hacer Scroll</SelectItem>
                          <SelectItem value="shrink">Reducir Tamaño al Hacer Scroll</SelectItem>
                          <SelectItem value="fade">Desvanecer al Hacer Scroll</SelectItem>
                          <SelectItem value="slide-out">Deslizar Fuera al Hacer Scroll</SelectItem>
                          <SelectItem value="transform">Transformar al Hacer Scroll</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Cómo se comportan los botones al hacer scroll</FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fixedButtonsIncludeWhatsapp"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Incluir Botón de WhatsApp</FormLabel>
                        <FormDescription>Añadir botón para contacto por WhatsApp</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fixedButtonsIncludeCall"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Incluir Botón de Llamada</FormLabel>
                        <FormDescription>Añadir botón para llamada telefónica</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fixedButtonsBackdropFilter"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Efecto de Fondo Difuminado</FormLabel>
                        <FormDescription>Aplicar efecto de cristal/blur detrás de los botones</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("fixedButtonsBackdropFilter") && (
                  <FormField
                    control={form.control}
                    name="fixedButtonsBackdropBlur"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Intensidad del Difuminado: {field.value}px</FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={20}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                          />
                        </FormControl>
                        <FormDescription>Intensidad del efecto de desenfoque</FormDescription>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fixedButtonsEntryAnimation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Animación de Entrada</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una animación" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fade">Desvanecer</SelectItem>
                          <SelectItem value="slide-up">Deslizar Hacia Arriba</SelectItem>
                          <SelectItem value="slide-down">Deslizar Hacia Abajo</SelectItem>
                          <SelectItem value="slide-left">Deslizar Desde Izquierda</SelectItem>
                          <SelectItem value="slide-right">Deslizar Desde Derecha</SelectItem>
                          <SelectItem value="zoom-in">Zoom In</SelectItem>
                          <SelectItem value="bounce">Rebote</SelectItem>
                          <SelectItem value="flip">Volteo</SelectItem>
                          <SelectItem value="rotate">Rotación</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Animación cuando aparecen los botones</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fixedButtonsBoxShadow"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sombra de los Botones</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo de sombra" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Sin Sombra</SelectItem>
                          <SelectItem value="light">Sombra Ligera</SelectItem>
                          <SelectItem value="medium">Sombra Media</SelectItem>
                          <SelectItem value="heavy">Sombra Intensa</SelectItem>
                          <SelectItem value="inner">Sombra Interior</SelectItem>
                          <SelectItem value="floating">Efecto Flotante</SelectItem>
                          <SelectItem value="neon">Efecto Neón</SelectItem>
                          <SelectItem value="layered">Sombra en Capas</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Tipo de sombra para los botones</FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fixedButtonsGlowEffect"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Efecto de Resplandor</FormLabel>
                        <FormDescription>Añadir efecto de brillo alrededor de los botones</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fixedButtonsClickEffect"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Efecto al Hacer Clic</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un efecto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Sin Efecto</SelectItem>
                          <SelectItem value="ripple">Efecto Onda</SelectItem>
                          <SelectItem value="scale">Escala</SelectItem>
                          <SelectItem value="bounce">Rebote</SelectItem>
                          <SelectItem value="flash">Destello</SelectItem>
                          <SelectItem value="shake">Sacudida</SelectItem>
                          <SelectItem value="pulse">Pulso</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Efecto visual al hacer clic en los botones</FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fixedButtonsAccessibility"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Mejoras de Accesibilidad</FormLabel>
                        <FormDescription>Añadir atributos ARIA y mejoras para lectores de pantalla</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fixedButtonsCloseOption"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Opción para Cerrar</FormLabel>
                        <FormDescription>Permitir al usuario cerrar/ocultar los botones</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("fixedButtonsCloseOption") && (
                <FormField
                  control={form.control}
                  name="fixedButtonsReopenDelay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiempo para Reaparecer (segundos)</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number.parseInt(value))}
                          defaultValue={field.value.toString()}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tiempo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3600">1 hora</SelectItem>
                            <SelectItem value="21600">6 horas</SelectItem>
                            <SelectItem value="43200">12 horas</SelectItem>
                            <SelectItem value="86400">24 horas</SelectItem>
                            <SelectItem value="604800">1 semana</SelectItem>
                            <SelectItem value="0">No reaparecer</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Tiempo después del cual los botones reaparecen tras ser cerrados
                      </FormDescription>
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fixedButtonsDesktopDisplay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mostrar en Escritorio</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una opción" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="show">Mostrar</SelectItem>
                          <SelectItem value="hide">Ocultar</SelectItem>
                          <SelectItem value="different">Mostrar Diferente</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Comportamiento en dispositivos de escritorio</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fixedButtonsTabletDisplay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mostrar en Tablet</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una opción" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="show">Mostrar</SelectItem>
                          <SelectItem value="hide">Ocultar</SelectItem>
                          <SelectItem value="different">Mostrar Diferente</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Comportamiento en tablets</FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              "Generar Prompt"
            )}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  )
}

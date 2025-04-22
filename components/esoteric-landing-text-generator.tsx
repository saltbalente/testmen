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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CopyIcon, DownloadIcon, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Esquema para el generador de texto esotérico
const textGeneratorSchema = z.object({
  // Campos básicos
  textType: z.string({
    required_error: "Por favor selecciona un tipo de texto",
  }),
  textLength: z.number().min(50).max(2000).default(300),
  toneStyle: z.string({
    required_error: "Por favor selecciona un tono de escritura",
  }),
  targetAudience: z.string({
    required_error: "Por favor selecciona una audiencia objetivo",
  }),

  // Campos esotéricos
  esotericTradition: z.string().optional(),
  includeSymbols: z.boolean().default(false),
  symbolTypes: z.array(z.string()).optional().default([]),
  includeMysticalTerms: z.boolean().default(true),
  mysticalTermsLevel: z.number().default(5),

  // Campos de formato
  includeHeadings: z.boolean().default(true),
  includeBulletPoints: z.boolean().default(false),
  includeQuotes: z.boolean().default(false),
  includeCallToAction: z.boolean().default(true),

  // Campos avanzados
  seoKeywords: z.array(z.string()).optional().default([]),
  emotionalTriggers: z.array(z.string()).optional().default([]),
  persuasionTechniques: z.array(z.string()).optional().default([]),

  // Campos de personalización
  customInstructions: z.string().optional(),
})

// Opciones para los diferentes campos
const textTypes = [
  { value: "landing-intro", label: "Introducción de Landing Page (primer impacto)" },
  { value: "service-description", label: "Descripción de Servicio (qué ofreces)" },
  { value: "about-practitioner", label: "Sobre el Practicante (tu historia)" },
  { value: "testimonial-request", label: "Solicitud de Testimonios (pedir opiniones)" },
  { value: "ritual-instructions", label: "Instrucciones de Ritual (pasos a seguir)" },
  { value: "spiritual-teaching", label: "Enseñanza Espiritual (sabiduría y conocimiento)" },
  { value: "product-description", label: "Descripción de Producto (objetos místicos)" },
  { value: "event-announcement", label: "Anuncio de Evento (talleres, ceremonias)" },
  { value: "course-overview", label: "Descripción de Curso (aprendizaje esotérico)" },
  { value: "faq-section", label: "Preguntas Frecuentes (dudas comunes)" },
  { value: "blog-intro", label: "Introducción de Blog (artículos esotéricos)" },
  { value: "meditation-guide", label: "Guía de Meditación (práctica espiritual)" },
  { value: "healing-process", label: "Proceso de Sanación (métodos curativos)" },
  { value: "divination-explanation", label: "Explicación de Adivinación (métodos predictivos)" },
  { value: "magical-properties", label: "Propiedades Mágicas (cristales, hierbas)" },
  { value: "spiritual-journey", label: "Viaje Espiritual (transformación personal)" },
  { value: "energy-work", label: "Trabajo Energético (manipulación de energías)" },
  { value: "astrology-reading", label: "Lectura Astrológica (interpretación de cartas)" },
  { value: "numerology-profile", label: "Perfil Numerológico (significado de números)" },
  { value: "chakra-balancing", label: "Equilibrio de Chakras (centros energéticos)" },
  { value: "past-life", label: "Vidas Pasadas (regresiones y memorias)" },
  { value: "spirit-communication", label: "Comunicación Espiritual (contacto con entidades)" },
  { value: "dream-interpretation", label: "Interpretación de Sueños (significados oníricos)" },
  { value: "sacred-space", label: "Espacio Sagrado (creación y mantenimiento)" },
  { value: "manifestation-technique", label: "Técnica de Manifestación (ley de atracción)" },
  { value: "spell-crafting", label: "Creación de Hechizos (magia práctica)" },
  { value: "aura-reading", label: "Lectura de Aura (campos energéticos)" },
  { value: "crystal-grid", label: "Rejilla de Cristales (patrones energéticos)" },
  { value: "moon-ritual", label: "Ritual Lunar (ceremonias según fases)" },
  { value: "sabbat-celebration", label: "Celebración de Sabbat (festividades paganas)" },
  { value: "ancestor-work", label: "Trabajo con Ancestros (honrar antepasados)" },
  { value: "shamanic-journey", label: "Viaje Chamánico (estados alterados)" },
  { value: "akashic-records", label: "Registros Akáshicos (memoria universal)" },
  { value: "elemental-magic", label: "Magia Elemental (trabajo con elementos)" },
  { value: "sigil-creation", label: "Creación de Sigilos (símbolos de poder)" },
  { value: "herb-magic", label: "Magia con Hierbas (propiedades y usos)" },
  { value: "candle-magic", label: "Magia de Velas (rituales con velas)" },
  { value: "rune-casting", label: "Tirada de Runas (adivinación nórdica)" },
  { value: "tarot-spread", label: "Tirada de Tarot (patrones de cartas)" },
  { value: "pendulum-work", label: "Trabajo con Péndulo (respuestas guiadas)" },
  { value: "scrying-technique", label: "Técnica de Visión (bola de cristal, espejo)" },
  { value: "protection-methods", label: "Métodos de Protección (escudos energéticos)" },
  { value: "cleansing-ritual", label: "Ritual de Limpieza (purificación)" },
  { value: "sacred-geometry", label: "Geometría Sagrada (patrones divinos)" },
  { value: "sound-healing", label: "Sanación con Sonido (frecuencias curativas)" },
  { value: "color-therapy", label: "Terapia de Color (cromoterapia)" },
  { value: "aromatherapy", label: "Aromaterapia (esencias y aceites)" },
  { value: "feng-shui", label: "Feng Shui (armonía del espacio)" },
  { value: "i-ching", label: "I Ching (oráculo chino)" },
  { value: "kabbalah-teaching", label: "Enseñanza Cabalística (misticismo judío)" },
  { value: "hermetic-principle", label: "Principio Hermético (leyes universales)" },
]

const toneStyles = [
  { value: "mystical", label: "Místico (evocador y espiritual)" },
  { value: "authoritative", label: "Autoritativo (experto y seguro)" },
  { value: "conversational", label: "Conversacional (cercano y amigable)" },
  { value: "poetic", label: "Poético (lírico y metafórico)" },
  { value: "academic", label: "Académico (formal y documentado)" },
  { value: "inspirational", label: "Inspirador (motivador y elevador)" },
  { value: "mysterious", label: "Misterioso (enigmático e intrigante)" },
  { value: "reverent", label: "Reverente (respetuoso y devocional)" },
  { value: "ancient-wisdom", label: "Sabiduría Antigua (atemporal y profundo)" },
  { value: "prophetic", label: "Profético (visionario y revelador)" },
  { value: "shamanic", label: "Chamánico (conectado con la naturaleza)" },
  { value: "ceremonial", label: "Ceremonial (ritual y solemne)" },
  { value: "alchemical", label: "Alquímico (transformador y simbólico)" },
  { value: "hermetic", label: "Hermético (filosófico y esotérico)" },
  { value: "gnostic", label: "Gnóstico (conocimiento interior)" },
  { value: "oracular", label: "Oracular (mensajes divinos)" },
  { value: "initiatory", label: "Iniciático (revelación gradual)" },
  { value: "cosmic", label: "Cósmico (universal y expansivo)" },
  { value: "ethereal", label: "Etéreo (ligero y celestial)" },
  { value: "earthy", label: "Terreno (práctico y arraigado)" },
  { value: "occult", label: "Ocultista (secreto y velado)" },
  { value: "magical", label: "Mágico (maravilloso y encantador)" },
  { value: "intuitive", label: "Intuitivo (perceptivo y sensible)" },
  { value: "visionary", label: "Visionario (adelantado y clarividente)" },
  { value: "ancestral", label: "Ancestral (conectado con el pasado)" },
  { value: "elemental", label: "Elemental (fuego, agua, tierra, aire)" },
  { value: "transcendent", label: "Trascendente (más allá de lo físico)" },
  { value: "illuminated", label: "Iluminado (lleno de luz y claridad)" },
  { value: "shadow-work", label: "Trabajo de Sombra (profundo y transformador)" },
  { value: "healing", label: "Sanador (curativo y reconfortante)" },
  { value: "empowering", label: "Empoderador (fortalecedor y capacitador)" },
  { value: "meditative", label: "Meditativo (contemplativo y sereno)" },
  { value: "divinatory", label: "Adivinatorio (predictivo y revelador)" },
  { value: "ritualistic", label: "Ritualístico (ceremonial y estructurado)" },
  { value: "mythological", label: "Mitológico (narrativo y simbólico)" },
  { value: "archetypal", label: "Arquetípico (patrones universales)" },
  { value: "symbolic", label: "Simbólico (representativo y significativo)" },
  { value: "metaphysical", label: "Metafísico (más allá de lo físico)" },
  { value: "quantum", label: "Cuántico (realidades múltiples)" },
  { value: "holistic", label: "Holístico (integrador y completo)" },
  { value: "sacred", label: "Sagrado (divino y venerado)" },
  { value: "esoteric", label: "Esotérico (conocimiento oculto)" },
  { value: "folkloric", label: "Folklórico (tradiciones populares)" },
  { value: "indigenous", label: "Indígena (sabiduría ancestral)" },
  { value: "tantric", label: "Tántrico (energético y transformador)" },
  { value: "vedic", label: "Védico (sabiduría india antigua)" },
  { value: "zen", label: "Zen (simple y directo)" },
  { value: "taoist", label: "Taoísta (fluido y natural)" },
  { value: "kabbalistic", label: "Cabalístico (místico y numérico)" },
  { value: "rosicrucian", label: "Rosacruz (iluminación y conocimiento)" },
]

const targetAudiences = [
  { value: "spiritual-seekers", label: "Buscadores Espirituales (en camino de desarrollo)" },
  { value: "beginners", label: "Principiantes (nuevos en lo esotérico)" },
  { value: "advanced-practitioners", label: "Practicantes Avanzados (con experiencia)" },
  { value: "skeptics", label: "Escépticos (requieren evidencias)" },
  { value: "curious", label: "Curiosos (interesados pero no comprometidos)" },
  { value: "healers", label: "Sanadores (enfocados en ayudar a otros)" },
  { value: "teachers", label: "Maestros (transmiten conocimiento)" },
  { value: "lightworkers", label: "Trabajadores de la Luz (servicio espiritual)" },
  { value: "empaths", label: "Empáticos (sensibles a energías)" },
  { value: "psychics", label: "Psíquicos (con habilidades extrasensoriales)" },
  { value: "witches", label: "Brujas/os (practicantes de magia)" },
  { value: "pagans", label: "Paganos (religiones naturales)" },
  { value: "shamans", label: "Chamanes (mediadores espirituales)" },
  { value: "energy-workers", label: "Trabajadores Energéticos (manipulan energías)" },
  { value: "astrologers", label: "Astrólogos (intérpretes de estrellas)" },
  { value: "tarot-readers", label: "Lectores de Tarot (intérpretes de cartas)" },
  { value: "numerologists", label: "Numerólogos (expertos en números)" },
  { value: "crystal-healers", label: "Sanadores con Cristales (litoterapia)" },
  { value: "reiki-practitioners", label: "Practicantes de Reiki (energía universal)" },
  { value: "yoga-practitioners", label: "Practicantes de Yoga (unión cuerpo-mente)" },
  { value: "meditators", label: "Meditadores (práctica contemplativa)" },
  { value: "alchemists", label: "Alquimistas (transformación interior)" },
  { value: "herbalists", label: "Herbolarios (medicina natural)" },
  { value: "diviners", label: "Adivinos (practicantes de adivinación)" },
  { value: "mystics", label: "Místicos (experiencia directa de lo divino)" },
  { value: "occultists", label: "Ocultistas (estudiosos de lo oculto)" },
  { value: "magicians", label: "Magos (practicantes de alta magia)" },
  { value: "spiritual-coaches", label: "Coaches Espirituales (guías de desarrollo)" },
  { value: "wellness-seekers", label: "Buscadores de Bienestar (salud integral)" },
  { value: "alternative-healers", label: "Sanadores Alternativos (terapias no convencionales)" },
  { value: "consciousness-explorers", label: "Exploradores de Consciencia (estados alterados)" },
  { value: "dream-workers", label: "Trabajadores de Sueños (interpretación onírica)" },
  { value: "past-life-therapists", label: "Terapeutas de Vidas Pasadas (regresiones)" },
  { value: "channelers", label: "Canalizadores (mensajes de otras entidades)" },
  { value: "mediums", label: "Médiums (comunicación con espíritus)" },
  { value: "feng-shui-consultants", label: "Consultores de Feng Shui (armonía espacial)" },
  { value: "sacred-geometry-artists", label: "Artistas de Geometría Sagrada (patrones divinos)" },
  { value: "sound-healers", label: "Sanadores con Sonido (terapia vibracional)" },
  { value: "spiritual-artists", label: "Artistas Espirituales (expresión sagrada)" },
  { value: "metaphysical-shop-owners", label: "Dueños de Tiendas Metafísicas (comercio esotérico)" },
  { value: "retreat-organizers", label: "Organizadores de Retiros (eventos espirituales)" },
  { value: "spiritual-authors", label: "Autores Espirituales (escritores místicos)" },
  { value: "spiritual-entrepreneurs", label: "Emprendedores Espirituales (negocios conscientes)" },
  { value: "holistic-therapists", label: "Terapeutas Holísticos (enfoque integral)" },
  { value: "sacred-space-keepers", label: "Guardianes de Espacios Sagrados (templos, círculos)" },
  { value: "ceremony-facilitators", label: "Facilitadores de Ceremonias (rituales grupales)" },
  { value: "wisdom-keepers", label: "Guardianes de Sabiduría (tradiciones antiguas)" },
  { value: "cosmic-consciousness", label: "Consciencia Cósmica (conexión universal)" },
  { value: "earth-stewards", label: "Guardianes de la Tierra (ecología sagrada)" },
  { value: "starseeds", label: "Semillas Estelares (origen cósmico)" },
  { value: "indigo-crystal-rainbow", label: "Niños Índigo/Cristal/Arcoíris (nuevas generaciones)" },
]

const esotericTraditions = [
  { value: "wicca", label: "Wicca (brujería moderna)" },
  { value: "hermeticism", label: "Hermetismo (filosofía esotérica)" },
  { value: "theosophy", label: "Teosofía (sabiduría divina)" },
  { value: "kabbalah", label: "Cábala (misticismo judío)" },
  { value: "western-mystery", label: "Tradición Mistérica Occidental (ocultismo europeo)" },
  { value: "golden-dawn", label: "Aurora Dorada (orden hermética)" },
  { value: "thelema", label: "Thelema (sistema de Crowley)" },
  { value: "druidry", label: "Druidismo (tradición celta)" },
  { value: "asatru", label: "Ásatrú (paganismo nórdico)" },
  { value: "shamanism", label: "Chamanismo (comunicación con espíritus)" },
  { value: "hoodoo", label: "Hoodoo (magia folclórica americana)" },
  { value: "vodou", label: "Vodou (religión afrocaribeña)" },
  { value: "santeria", label: "Santería (religión afrocubana)" },
  { value: "buddhism", label: "Budismo (camino de iluminación)" },
  { value: "hinduism", label: "Hinduismo (dharma eterno)" },
  { value: "taoism", label: "Taoísmo (camino del Tao)" },
  { value: "sufism", label: "Sufismo (misticismo islámico)" },
  { value: "gnosticism", label: "Gnosticismo (conocimiento interior)" },
  { value: "rosicrucianism", label: "Rosacrucismo (fraternidad mística)" },
  { value: "anthroposophy", label: "Antroposofía (ciencia espiritual)" },
  { value: "new-thought", label: "Nuevo Pensamiento (mente sobre materia)" },
  { value: "new-age", label: "Nueva Era (espiritualidad moderna)" },
  { value: "ceremonial-magic", label: "Magia Ceremonial (rituales formales)" },
  { value: "chaos-magic", label: "Magia del Caos (paradigmas cambiantes)" },
  { value: "folk-magic", label: "Magia Folclórica (tradiciones populares)" },
  { value: "green-witchcraft", label: "Brujería Verde (basada en la naturaleza)" },
  { value: "kitchen-witchery", label: "Brujería de Cocina (magia doméstica)" },
  { value: "hedge-witchcraft", label: "Brujería de Seto (trabajo entre mundos)" },
  { value: "sea-witchcraft", label: "Brujería Marina (magia oceánica)" },
  { value: "eclectic", label: "Ecléctico (mezcla de tradiciones)" },
  { value: "traditional-witchcraft", label: "Brujería Tradicional (pre-wicca)" },
  { value: "feri", label: "Tradición Feri (brujería americana)" },
  { value: "reclaiming", label: "Reclaiming (brujería activista)" },
  { value: "dianic", label: "Diánica (centrada en lo femenino)" },
  { value: "gardnerian", label: "Gardneriana (wicca tradicional)" },
  { value: "alexandrian", label: "Alejandrina (derivada de Gardner)" },
  { value: "faery-faith", label: "Fe Feérica (trabajo con hadas)" },
  { value: "stregheria", label: "Stregheria (brujería italiana)" },
  { value: "hellenic", label: "Helénica (reconstruccionismo griego)" },
  { value: "kemetic", label: "Kemética (reconstruccionismo egipcio)" },
  { value: "slavic", label: "Eslava (paganismo eslavo)" },
  { value: "baltic", label: "Báltica (paganismo báltico)" },
  { value: "celtic", label: "Celta (tradiciones de los celtas)" },
  { value: "roman", label: "Romana (reconstruccionismo romano)" },
  { value: "mesopotamian", label: "Mesopotámica (tradiciones antiguas)" },
  { value: "vedic", label: "Védica (tradiciones indias antiguas)" },
  { value: "tantric", label: "Tántrica (energía y transformación)" },
  { value: "tibetan", label: "Tibetana (budismo vajrayana)" },
  { value: "zen", label: "Zen (budismo meditativo)" },
  { value: "indigenous", label: "Indígena (tradiciones nativas)" },
]

const symbolTypes = [
  { id: "astrological", label: "Astrológicos (signos zodiacales, planetas)" },
  { id: "alchemical", label: "Alquímicos (transformación, elementos)" },
  { id: "elemental", label: "Elementales (tierra, aire, fuego, agua)" },
  { id: "runic", label: "Rúnicos (alfabeto nórdico antiguo)" },
  { id: "sacred-geometry", label: "Geometría Sagrada (patrones matemáticos)" },
  { id: "tarot", label: "Tarot (arcanos mayores y menores)" },
  { id: "kabbalah", label: "Cabalísticos (árbol de la vida, letras hebreas)" },
  { id: "egyptian", label: "Egipcios (jeroglíficos, ankh, ojo de Horus)" },
  { id: "celtic", label: "Celtas (triskel, nudo celta)" },
  { id: "wiccan", label: "Wiccanos (pentáculo, triple diosa)" },
  { id: "chakra", label: "Chakras (centros energéticos)" },
  { id: "hermetic", label: "Herméticos (caduceo, sello de Salomón)" },
  { id: "masonic", label: "Masónicos (compás, escuadra)" },
  { id: "gnostic", label: "Gnósticos (pleroma, demiurgo)" },
  { id: "eastern", label: "Orientales (yin-yang, om)" },
  { id: "norse", label: "Nórdicos (Yggdrasil, martillo de Thor)" },
  { id: "planetary", label: "Planetarios (símbolos de planetas)" },
  { id: "zodiac", label: "Zodiacales (constelaciones, signos)" },
  { id: "lunar", label: "Lunares (fases de la luna)" },
  { id: "solar", label: "Solares (sol, solsticios)" },
  { id: "angelic", label: "Angélicos (sellos, sigilos)" },
  { id: "demonic", label: "Demoníacos (sellos goéticos)" },
  { id: "shamanic", label: "Chamánicos (tambor, animal de poder)" },
  { id: "native", label: "Nativos (tótem, dreamcatcher)" },
  { id: "african", label: "Africanos (adinkra, veve)" },
  { id: "mayan", label: "Mayas (calendario, glifos)" },
  { id: "aztec", label: "Aztecas (calendario, deidades)" },
  { id: "hindu", label: "Hindúes (mandala, yantra)" },
  { id: "buddhist", label: "Budistas (dharma, loto)" },
  { id: "taoist", label: "Taoístas (bagua, trigrama)" },
  { id: "numerological", label: "Numerológicos (números sagrados)" },
  { id: "sigils", label: "Sigilos (símbolos personales de poder)" },
  { id: "magical-alphabets", label: "Alfabetos Mágicos (theban, enoquiano)" },
  { id: "crystal", label: "Cristales (formas, redes)" },
  { id: "plant", label: "Plantas (hierbas, árboles sagrados)" },
  { id: "animal", label: "Animales (tótems, familiares)" },
  { id: "mythological", label: "Mitológicos (criaturas, deidades)" },
  { id: "cosmic", label: "Cósmicos (estrellas, galaxias)" },
  { id: "glyph", label: "Glifos (escritura simbólica)" },
  { id: "seal", label: "Sellos (protección, invocación)" },
  { id: "mandala", label: "Mandalas (círculos sagrados)" },
  { id: "labyrinth", label: "Laberintos (caminos espirales)" },
  { id: "cross", label: "Cruces (variaciones simbólicas)" },
  { id: "spiral", label: "Espirales (evolución, ciclos)" },
  { id: "knot", label: "Nudos (entrelazados infinitos)" },
  { id: "wheel", label: "Ruedas (ciclos, dharma)" },
  { id: "tree", label: "Árboles (vida, conocimiento)" },
  { id: "hand", label: "Manos (hamsa, mudras)" },
  { id: "eye", label: "Ojos (tercer ojo, protección)" },
  { id: "gate", label: "Puertas (umbrales, transiciones)" },
]

const seoKeywords = [
  { id: "spiritual", label: "Espiritual (desarrollo interior)" },
  { id: "mystical", label: "Místico (experiencia trascendental)" },
  { id: "esoteric", label: "Esotérico (conocimiento oculto)" },
  { id: "occult", label: "Oculto (sabiduría secreta)" },
  { id: "magic", label: "Magia (manifestación de voluntad)" },
  { id: "witchcraft", label: "Brujería (práctica mágica)" },
  { id: "healing", label: "Sanación (restauración energética)" },
  { id: "meditation", label: "Meditación (práctica contemplativa)" },
  { id: "divination", label: "Adivinación (ver el futuro)" },
  { id: "tarot", label: "Tarot (lectura de cartas)" },
  { id: "astrology", label: "Astrología (influencia planetaria)" },
  { id: "numerology", label: "Numerología (significado de números)" },
  { id: "crystals", label: "Cristales (propiedades energéticas)" },
  { id: "chakras", label: "Chakras (centros energéticos)" },
  { id: "energy-work", label: "Trabajo Energético (manipulación de energías)" },
  { id: "manifestation", label: "Manifestación (ley de atracción)" },
  { id: "mindfulness", label: "Atención Plena (presencia consciente)" },
  { id: "ritual", label: "Ritual (práctica ceremonial)" },
  { id: "sacred", label: "Sagrado (conexión divina)" },
  { id: "ancient-wisdom", label: "Sabiduría Antigua (conocimiento ancestral)" },
  { id: "transformation", label: "Transformación (cambio profundo)" },
  { id: "consciousness", label: "Consciencia (despertar interior)" },
  { id: "enlightenment", label: "Iluminación (realización espiritual)" },
  { id: "psychic", label: "Psíquico (percepción extrasensorial)" },
  { id: "intuition", label: "Intuición (conocimiento directo)" },
  { id: "soul", label: "Alma (esencia espiritual)" },
  { id: "higher-self", label: "Ser Superior (aspecto elevado)" },
  { id: "awakening", label: "Despertar (revelación espiritual)" },
  { id: "alignment", label: "Alineación (armonía interior)" },
  { id: "balance", label: "Equilibrio (estabilidad energética)" },
  { id: "holistic", label: "Holístico (enfoque integral)" },
  { id: "wellness", label: "Bienestar (salud completa)" },
  { id: "natural", label: "Natural (en armonía con la naturaleza)" },
  { id: "alternative", label: "Alternativo (fuera de lo convencional)" },
  { id: "metaphysical", label: "Metafísico (más allá de lo físico)" },
  { id: "cosmic", label: "Cósmico (conexión universal)" },
  { id: "divine", label: "Divino (naturaleza sagrada)" },
  { id: "authentic", label: "Auténtico (verdadero ser)" },
  { id: "empowerment", label: "Empoderamiento (fuerza interior)" },
  { id: "journey", label: "Viaje (proceso de desarrollo)" },
  { id: "guidance", label: "Guía (dirección espiritual)" },
  { id: "wisdom", label: "Sabiduría (conocimiento profundo)" },
  { id: "purpose", label: "Propósito (misión de vida)" },
  { id: "destiny", label: "Destino (camino predeterminado)" },
  { id: "karma", label: "Karma (ley de causa y efecto)" },
  { id: "abundance", label: "Abundancia (prosperidad energética)" },
  { id: "protection", label: "Protección (escudo energético)" },
  { id: "cleansing", label: "Limpieza (purificación energética)" },
  { id: "grounding", label: "Enraizamiento (conexión con la tierra)" },
  { id: "ascension", label: "Ascensión (elevación espiritual)" },
  { id: "vibration", label: "Vibración (frecuencia energética)" },
  { id: "frequency", label: "Frecuencia (resonancia energética)" },
  { id: "quantum", label: "Cuántico (realidad multidimensional)" },
  { id: "shamanic", label: "Chamánico (sabiduría tribal)" },
  { id: "ancestral", label: "Ancestral (conexión con antepasados)" },
  { id: "elemental", label: "Elemental (fuerzas naturales)" },
  { id: "hermetic", label: "Hermético (principios universales)" },
  { id: "alchemical", label: "Alquímico (transformación interior)" },
  { id: "mysticism", label: "Misticismo (experiencia directa)" },
  { id: "transcendence", label: "Trascendencia (más allá de límites)" },
]

const emotionalTriggers = [
  { id: "wonder", label: "Asombro (maravilla ante lo desconocido)" },
  { id: "curiosity", label: "Curiosidad (deseo de saber más)" },
  { id: "hope", label: "Esperanza (expectativa positiva)" },
  { id: "belonging", label: "Pertenencia (formar parte de algo mayor)" },
  { id: "transformation", label: "Transformación (cambio profundo)" },
  { id: "empowerment", label: "Empoderamiento (control sobre la vida)" },
  { id: "mystery", label: "Misterio (atracción por lo oculto)" },
  { id: "revelation", label: "Revelación (descubrimiento importante)" },
  { id: "transcendence", label: "Trascendencia (ir más allá)" },
  { id: "connection", label: "Conexión (vínculo profundo)" },
  { id: "healing", label: "Sanación (restauración del ser)" },
  { id: "awakening", label: "Despertar (nueva consciencia)" },
  { id: "peace", label: "Paz (tranquilidad interior)" },
  { id: "joy", label: "Alegría (felicidad profunda)" },
  { id: "awe", label: "Sobrecogimiento (admiración profunda)" },
  { id: "enlightenment", label: "Iluminación (comprensión total)" },
  { id: "protection", label: "Protección (seguridad energética)" },
  { id: "wisdom", label: "Sabiduría (conocimiento profundo)" },
  { id: "purpose", label: "Propósito (sentido de vida)" },
  { id: "authenticity", label: "Autenticidad (ser verdadero)" },
  { id: "freedom", label: "Libertad (ausencia de limitaciones)" },
  { id: "harmony", label: "Armonía (equilibrio perfecto)" },
  { id: "abundance", label: "Abundancia (prosperidad en todo)" },
  { id: "love", label: "Amor (conexión universal)" },
  { id: "acceptance", label: "Aceptación (recibimiento total)" },
  { id: "validation", label: "Validación (confirmación de experiencias)" },
  { id: "recognition", label: "Reconocimiento (ser visto realmente)" },
  { id: "security", label: "Seguridad (protección espiritual)" },
  { id: "clarity", label: "Claridad (visión despejada)" },
  { id: "inspiration", label: "Inspiración (motivación divina)" },
  { id: "gratitude", label: "Gratitud (apreciación profunda)" },
  { id: "bliss", label: "Dicha (felicidad trascendental)" },
  { id: "serenity", label: "Serenidad (calma profunda)" },
  { id: "vitality", label: "Vitalidad (energía de vida)" },
  { id: "confidence", label: "Confianza (seguridad interior)" },
  { id: "courage", label: "Valor (fuerza ante lo desconocido)" },
  { id: "compassion", label: "Compasión (empatía profunda)" },
  { id: "unity", label: "Unidad (conexión con todo)" },
  { id: "wholeness", label: "Integridad (completitud del ser)" },
  { id: "divinity", label: "Divinidad (naturaleza sagrada)" },
  { id: "power", label: "Poder (capacidad de manifestar)" },
  { id: "magic", label: "Magia (asombro y posibilidad)" },
  { id: "mystery", label: "Misterio (lo desconocido atractivo)" },
  { id: "enchantment", label: "Encantamiento (fascinación mágica)" },
  { id: "wonder", label: "Maravilla (asombro infantil)" },
  { id: "nostalgia", label: "Nostalgia (conexión con el pasado)" },
  { id: "reverence", label: "Reverencia (respeto profundo)" },
  { id: "devotion", label: "Devoción (entrega espiritual)" },
  { id: "ecstasy", label: "Éxtasis (alegría suprema)" },
  { id: "intrigue", label: "Intriga (fascinación misteriosa)" },
]

const persuasionTechniques = [
  { id: "scarcity", label: "Escasez (oportunidad limitada)" },
  { id: "social-proof", label: "Prueba Social (otros lo confirman)" },
  { id: "authority", label: "Autoridad (experto en el tema)" },
  { id: "reciprocity", label: "Reciprocidad (dar para recibir)" },
  { id: "commitment", label: "Compromiso (coherencia con decisiones)" },
  { id: "liking", label: "Simpatía (conexión personal)" },
  { id: "storytelling", label: "Narración (historias cautivadoras)" },
  { id: "curiosity-gap", label: "Brecha de Curiosidad (intriga por saber más)" },
  { id: "exclusivity", label: "Exclusividad (acceso privilegiado)" },
  { id: "fear-of-missing", label: "Miedo a Perderse (FOMO)" },
  { id: "problem-solution", label: "Problema-Solución (resolver necesidad)" },
  { id: "before-after", label: "Antes-Después (transformación)" },
  { id: "testimonial", label: "Testimonio (experiencia real)" },
  { id: "future-pacing", label: "Proyección Futura (visualizar resultados)" },
  { id: "emotional-appeal", label: "Apelación Emocional (conexión afectiva)" },
  { id: "logical-argument", label: "Argumento Lógico (razonamiento)" },
  { id: "metaphor", label: "Metáfora (comparación simbólica)" },
  { id: "contrast", label: "Contraste (comparación favorable)" },
  { id: "repetition", label: "Repetición (refuerzo de mensaje)" },
  { id: "anchoring", label: "Anclaje (punto de referencia)" },
  { id: "foot-in-door", label: "Pie en la Puerta (pequeño compromiso inicial)" },
  { id: "door-in-face", label: "Puerta en la Cara (solicitud grande seguida de pequeña)" },
  { id: "urgency", label: "Urgencia (actuar ahora)" },
  { id: "simplicity", label: "Simplicidad (fácil de entender)" },
  { id: "bandwagon", label: "Efecto Bandwagon (todos lo hacen)" },
  { id: "identity", label: "Identidad (alineación con el yo)" },
  { id: "loss-aversion", label: "Aversión a la Pérdida (evitar perder)" },
  { id: "curiosity", label: "Curiosidad (deseo de saber)" },
  { id: "mystery", label: "Misterio (intriga por lo desconocido)" },
  { id: "presupposition", label: "Presuposición (asumir aceptación)" },
  { id: "visualization", label: "Visualización (imaginar resultado)" },
  { id: "sensory-language", label: "Lenguaje Sensorial (experiencia vívida)" },
  { id: "specificity", label: "Especificidad (detalles concretos)" },
  { id: "benefit-focus", label: "Enfoque en Beneficios (ventajas)" },
  { id: "pain-avoidance", label: "Evitación del Dolor (solución a problema)" },
  { id: "pleasure-seeking", label: "Búsqueda de Placer (resultados positivos)" },
  { id: "personal-connection", label: "Conexión Personal (relación directa)" },
  { id: "ethical-appeal", label: "Apelación Ética (valores compartidos)" },
  { id: "spiritual-alignment", label: "Alineación Espiritual (propósito superior)" },
  { id: "cosmic-timing", label: "Momento Cósmico (alineación universal)" },
  { id: "divine-guidance", label: "Guía Divina (dirección superior)" },
  { id: "ancestral-wisdom", label: "Sabiduría Ancestral (conocimiento antiguo)" },
  { id: "universal-law", label: "Ley Universal (principio cósmico)" },
  { id: "sacred-knowledge", label: "Conocimiento Sagrado (revelación especial)" },
  { id: "initiation", label: "Iniciación (acceso a círculo interior)" },
  { id: "transformation-promise", label: "Promesa de Transformación (cambio profundo)" },
  { id: "spiritual-evolution", label: "Evolución Espiritual (crecimiento del alma)" },
  { id: "cosmic-connection", label: "Conexión Cósmica (alineación universal)" },
  { id: "destiny-fulfillment", label: "Cumplimiento del Destino (propósito de vida)" },
]

type EsotericLandingTextGeneratorProps = {
  onGenerate: (data: z.infer<typeof textGeneratorSchema>) => void
  isGenerating: boolean
  showTooltips?: boolean
  enableScrollInLists?: boolean
}

// Now let's add a state variable to store the generated prompt at the top of the component
export function EsotericLandingTextGenerator({
  onGenerate,
  isGenerating,
  showTooltips = true,
  enableScrollInLists = true,
}: EsotericLandingTextGeneratorProps) {
  const [showSymbolOptions, setShowSymbolOptions] = useState(false)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [showPromptResult, setShowPromptResult] = useState(false)

  // Update the onSubmit function to generate and store the prompt locally
  const form = useForm<z.infer<typeof textGeneratorSchema>>({
    resolver: zodResolver(textGeneratorSchema),
    defaultValues: {
      textType: "landing-intro",
      textLength: 300,
      toneStyle: "mystical",
      targetAudience: "spiritual-seekers",
      esotericTradition: "",
      includeSymbols: false,
      symbolTypes: [],
      includeMysticalTerms: true,
      mysticalTermsLevel: 5,
      includeHeadings: true,
      includeBulletPoints: false,
      includeQuotes: false,
      includeCallToAction: true,
      seoKeywords: [],
      emotionalTriggers: [],
      persuasionTechniques: [],
      customInstructions: "",
    },
  })

  // Helper function to render Select with tooltips
  const renderSelectWithTooltips = (options: { value: string; label: string }[], field: any, placeholder: string) => (
    <SelectContent>
      {options.map((option) => (
        <TooltipProvider key={option.value}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <SelectItem value={option.value}>{option.label.split("(")[0].trim()}</SelectItem>
            </TooltipTrigger>
            <TooltipContent className="w-80">{option.label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </SelectContent>
  )

  // Helper function to render Checkbox list with tooltips
  const renderCheckboxListWithTooltips = (options: { id: string; label: string }[], name: string) => (
    <div className="grid gap-2">
      {options.map((option) => (
        <TooltipProvider key={option.id}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name={name}
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), option.id])
                                : field.onChange(field.value?.filter((value) => value !== option.id))
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">{option.label.split("(")[0].trim()}</FormLabel>
                      </FormItem>
                    )
                  }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="w-80">{option.label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )

  function onSubmit(values: z.infer<typeof textGeneratorSchema>) {
    // Generate the prompt text
    const prompt = generatePromptFromValues(values)

    // Set the local state
    setGeneratedPrompt(prompt)
    setShowPromptResult(true)

    // Also call the parent handler
    onGenerate(values)
  }

  // Add a function to generate the prompt text from form values
  function generatePromptFromValues(values: z.infer<typeof textGeneratorSchema>): string {
    let prompt = `Crea un texto persuasivo para una landing page esotérica con las siguientes características:\n\n`

    // Basic information
    prompt += `TIPO DE TEXTO: ${getTextTypeLabel(values.textType)}\n`
    prompt += `LONGITUD: Aproximadamente ${values.textLength} palabras\n`
    prompt += `TONO Y ESTILO: ${getToneStyleLabel(values.toneStyle)}\n`
    prompt += `AUDIENCIA OBJETIVO: ${getTargetAudienceLabel(values.targetAudience)}\n`

    // Esoteric tradition if specified
    if (values.esotericTradition) {
      prompt += `TRADICIÓN ESOTÉRICA: ${getEsotericTraditionLabel(values.esotericTradition)}\n`
    }

    // Symbols
    if (values.includeSymbols && values.symbolTypes && values.symbolTypes.length > 0) {
      prompt += `\nINCLUIR SÍMBOLOS ESOTÉRICOS:\n`
      values.symbolTypes.forEach((symbolType) => {
        const label = symbolTypes.find((s) => s.id === symbolType)?.label || symbolType
        prompt += `- ${label}\n`
      })
    }

    // Mystical terms
    if (values.includeMysticalTerms) {
      prompt += `\nINCLUIR TERMINOLOGÍA MÍSTICA: Sí, con nivel de complejidad ${values.mysticalTermsLevel}/10\n`
    } else {
      prompt += `\nINCLUIR TERMINOLOGÍA MÍSTICA: No\n`
    }

    // Format options
    prompt += `\nOPCIONES DE FORMATO:\n`
    prompt += `- Incluir encabezados: ${values.includeHeadings ? "Sí" : "No"}\n`
    prompt += `- Incluir viñetas: ${values.includeBulletPoints ? "Sí" : "No"}\n`
    prompt += `- Incluir citas: ${values.includeQuotes ? "Sí" : "No"}\n`
    prompt += `- Incluir llamada a la acción: ${values.includeCallToAction ? "Sí" : "No"}\n`

    // Advanced options
    if (values.seoKeywords && values.seoKeywords.length > 0) {
      prompt += `\nPALABRAS CLAVE SEO:\n`
      values.seoKeywords.forEach((keyword) => {
        const label = seoKeywords.find((k) => k.id === keyword)?.label || keyword
        prompt += `- ${label}\n`
      })
    }

    if (values.emotionalTriggers && values.emotionalTriggers.length > 0) {
      prompt += `\nDISPARADORES EMOCIONALES:\n`
      values.emotionalTriggers.forEach((trigger) => {
        const label = emotionalTriggers.find((t) => t.id === trigger)?.label || trigger
        prompt += `- ${label}\n`
      })
    }

    if (values.persuasionTechniques && values.persuasionTechniques.length > 0) {
      prompt += `\nTÉCNICAS DE PERSUASIÓN:\n`
      values.persuasionTechniques.forEach((technique) => {
        const label = persuasionTechniques.find((t) => t.id === technique)?.label || technique
        prompt += `- ${label}\n`
      })
    }

    // Custom instructions
    if (values.customInstructions) {
      prompt += `\nINSTRUCCIONES PERSONALIZADAS:\n${values.customInstructions}\n`
    }

    prompt += `\nEl texto debe ser persuasivo, cautivador y alineado con la tradición esotérica especificada. Debe resonar emocionalmente con la audiencia objetivo y motivarles a tomar acción.`

    return prompt
  }

  // Helper functions to get labels from values
  function getTextTypeLabel(value: string): string {
    return textTypes.find((t) => t.value === value)?.label || value
  }

  function getToneStyleLabel(value: string): string {
    return toneStyles.find((t) => t.value === value)?.label || value
  }

  function getTargetAudienceLabel(value: string): string {
    return targetAudiences.find((a) => a.value === value)?.label || value
  }

  function getEsotericTraditionLabel(value: string): string {
    return esotericTraditions.find((t) => t.value === value)?.label || value
  }

  // Add the prompt result section at the end of the form, right before the submit button
  // Find the line with the submit button and add this before it:

  return (
    <Card>
      <CardContent className="pt-6">
        <ScrollArea className="h-[600px] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="textType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Texto</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo de texto" />
                          </SelectTrigger>
                        </FormControl>
                        {enableScrollInLists ? (
                          <SelectContent>
                            <ScrollArea className="h-[300px]">
                              {textTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {showTooltips ? type.label.split("(")[0].trim() : type.label}
                                </SelectItem>
                              ))}
                            </ScrollArea>
                          </SelectContent>
                        ) : (
                          renderSelectWithTooltips(textTypes, field, "Selecciona un tipo de texto")
                        )}
                      </Select>
                      <FormDescription>Elige el tipo de texto que necesitas generar</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="textLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitud del Texto: {field.value} palabras</FormLabel>
                      <FormControl>
                        <Slider
                          min={50}
                          max={2000}
                          step={50}
                          defaultValue={[field.value]}
                          onValueChange={(values) => field.onChange(values[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>Elige la cantidad aproximada de palabras</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="toneStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tono y Estilo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tono de escritura" />
                          </SelectTrigger>
                        </FormControl>
                        {enableScrollInLists ? (
                          <SelectContent>
                            <ScrollArea className="h-[300px]">
                              {toneStyles.map((style) => (
                                <SelectItem key={style.value} value={style.value}>
                                  {showTooltips ? style.label.split("(")[0].trim() : style.label}
                                </SelectItem>
                              ))}
                            </ScrollArea>
                          </SelectContent>
                        ) : (
                          renderSelectWithTooltips(toneStyles, field, "Selecciona un tono de escritura")
                        )}
                      </Select>
                      <FormDescription>Elige el tono y estilo de escritura</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audiencia Objetivo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una audiencia objetivo" />
                          </SelectTrigger>
                        </FormControl>
                        {enableScrollInLists ? (
                          <SelectContent>
                            <ScrollArea className="h-[300px]">
                              {targetAudiences.map((audience) => (
                                <SelectItem key={audience.value} value={audience.value}>
                                  {showTooltips ? audience.label.split("(")[0].trim() : audience.label}
                                </SelectItem>
                              ))}
                            </ScrollArea>
                          </SelectContent>
                        ) : (
                          renderSelectWithTooltips(targetAudiences, field, "Selecciona una audiencia objetivo")
                        )}
                      </Select>
                      <FormDescription>Elige a quién va dirigido el texto</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="esotericTradition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tradición Esotérica (Opcional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una tradición esotérica" />
                          </SelectTrigger>
                        </FormControl>
                        {enableScrollInLists ? (
                          <SelectContent>
                            <ScrollArea className="h-[300px]">
                              {esotericTraditions.map((tradition) => (
                                <SelectItem key={tradition.value} value={tradition.value}>
                                  {showTooltips ? tradition.label.split("(")[0].trim() : tradition.label}
                                </SelectItem>
                              ))}
                            </ScrollArea>
                          </SelectContent>
                        ) : (
                          renderSelectWithTooltips(esotericTraditions, field, "Selecciona una tradición esotérica")
                        )}
                      </Select>
                      <FormDescription>Elige una tradición específica (opcional)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeSymbols"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Incluir Símbolos</FormLabel>
                        <FormDescription>¿Mencionar símbolos esotéricos en el texto?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked)
                            setShowSymbolOptions(checked)
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {showSymbolOptions && (
                  <FormField
                    control={form.control}
                    name="symbolTypes"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Tipos de Símbolos</FormLabel>
                          <FormDescription>Selecciona los tipos de símbolos a mencionar</FormDescription>
                        </div>
                        {renderCheckboxListWithTooltips(symbolTypes, "symbolTypes")}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="includeMysticalTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Incluir Términos Místicos</FormLabel>
                        <FormDescription>¿Usar terminología esotérica especializada?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("includeMysticalTerms") && (
                  <FormField
                    control={form.control}
                    name="mysticalTermsLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nivel de Términos Místicos: {field.value}/10</FormLabel>
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
                        <FormDescription>
                          Nivel de complejidad de la terminología (1: básico, 10: avanzado)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="includeHeadings"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Incluir Encabezados</FormLabel>
                          <FormDescription>¿Organizar el texto con títulos y subtítulos?</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="includeBulletPoints"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Incluir Viñetas</FormLabel>
                          <FormDescription>¿Usar listas con viñetas para puntos clave?</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="includeQuotes"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Incluir Citas</FormLabel>
                          <FormDescription>¿Añadir citas de maestros o textos sagrados?</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="includeCallToAction"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Incluir Llamada a la Acción</FormLabel>
                          <FormDescription>¿Añadir una invitación clara para el siguiente paso?</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
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
                    <AccordionItem value="seo">
                      <AccordionTrigger>Palabras Clave SEO</AccordionTrigger>
                      <AccordionContent>
                        <FormField
                          control={form.control}
                          name="seoKeywords"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormDescription>
                                  Selecciona palabras clave para optimización en buscadores
                                </FormDescription>
                              </div>
                              {renderCheckboxListWithTooltips(seoKeywords, "seoKeywords")}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="emotional">
                      <AccordionTrigger>Disparadores Emocionales</AccordionTrigger>
                      <AccordionContent>
                        <FormField
                          control={form.control}
                          name="emotionalTriggers"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormDescription>
                                  Selecciona las emociones que deseas evocar en el lector
                                </FormDescription>
                              </div>
                              {renderCheckboxListWithTooltips(emotionalTriggers, "emotionalTriggers")}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="persuasion">
                      <AccordionTrigger>Técnicas de Persuasión</AccordionTrigger>
                      <AccordionContent>
                        <FormField
                          control={form.control}
                          name="persuasionTechniques"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormDescription>
                                  Selecciona técnicas persuasivas para incluir en el texto
                                </FormDescription>
                              </div>
                              {renderCheckboxListWithTooltips(persuasionTechniques, "persuasionTechniques")}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="custom">
                      <AccordionTrigger>Instrucciones Personalizadas</AccordionTrigger>
                      <AccordionContent>
                        <FormField
                          control={form.control}
                          name="customInstructions"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Instrucciones Adicionales</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Escribe cualquier instrucción específica adicional aquí..."
                                  className="min-h-[100px]"
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                />
                              </FormControl>
                              <FormDescription>
                                Añade cualquier detalle o requisito específico para el texto
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
              {showPromptResult && (
                <div className="space-y-4 pt-6">
                  <Separator />
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Prompt Generado</h3>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedPrompt)
                          toast({
                            title: "Copiado al portapapeles",
                            description: "El prompt ha sido copiado al portapapeles.",
                          })
                        }}
                      >
                        <CopyIcon className="h-4 w-4 mr-2" />
                        Copiar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const element = document.createElement("a")
                          const file = new Blob([generatedPrompt], { type: "text/plain" })
                          element.href = URL.createObjectURL(file)
                          element.download = "prompt-texto-landing.txt"
                          document.body.appendChild(element)
                          element.click()
                          document.body.removeChild(element)
                          toast({
                            title: "Descarga completa",
                            description: "El prompt ha sido descargado como archivo de texto.",
                          })
                        }}
                      >
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-md border border-white/10 bg-black/20 p-4">
                    <Textarea
                      value={generatedPrompt}
                      readOnly
                      className="min-h-[200px] w-full font-mono text-sm border-0 resize-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando Texto...
                  </>
                ) : (
                  "Generar Texto Esotérico"
                )}
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

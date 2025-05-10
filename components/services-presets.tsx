"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Wand2,
  Heart,
  Moon,
  Stars,
  Flame,
  Scroll,
  Gem,
  Droplets,
  Flower,
  Hourglass,
  Compass,
  CandlestickChartIcon as Candle,
  Skull,
  SnowflakeIcon as Crystal,
} from "lucide-react"

// Definición de tipos para los presets
interface PromptPreset {
  id: string
  title: string
  description: string
  category: "mystical" | "interactive" | "immersive" | "ritual" | "enchanted"
  icon: React.ReactNode
  prompt: string
}

// Lista de 15 presets para secciones de servicios esotéricos
const servicesPresets: PromptPreset[] = [
  {
    id: "mystical-services-gallery",
    title: "Galería Mística de Servicios",
    description: "Presentación elegante de servicios esotéricos con efectos de revelación y simbolismo místico",
    category: "mystical",
    icon: <Sparkles className="h-4 w-4" />,
    prompt: `Crea una sección de servicios para un sitio web esotérico con las siguientes características:

- Estilo: Místico y elegante con toques de glassmorfismo
- Plataforma objetivo: mobile-first
- Esquema de color: Púrpura profundo, azul medianoche, destellos dorados, negro cósmico
- Incluir imágenes: Sí
- Estilo de imagen: Fotografías atmosféricas con superposición de símbolos místicos sutiles
- Tipo de fuente: Serif elegante con ligaduras especiales para títulos, sans-serif limpia para descripciones
- Tipo de animación: Revelación gradual con efecto de "velo que se levanta"
- Estilo de borde: Bordes sutiles con destellos dorados en hover
- Incluir información de contacto: Sí, discreta al final de cada servicio

- Optimizaciones de rendimiento: Lazy loading, imágenes WebP, CSS crítico, código minificado
- Optimizaciones SEO: Estructura semántica, metadatos enriquecidos, microdata para servicios
- Compatibilidad con navegadores: Detección de características con fallbacks elegantes
- Interactividad: Tarjetas que revelan detalles adicionales al hacer hover/tap, Filtrado de servicios por categoría
- Transiciones: Desvanecimiento suave entre estados, Revelaciones graduales al hacer scroll
- Elementos esotéricos interactivos: Símbolos místicos que brillan al pasar el cursor, Iconos temáticos para cada servicio

- Estilo de código: CSS optimizado con variables personalizadas
- Incluir comentarios detallados: Sí

La sección debe presentar servicios esotéricos como hechizos de amor, encantamientos, conjuros y rituales de endulzamiento de manera elegante y misteriosa. Utilizar un diseño de tarjetas con efecto de glassmorfismo sutil que muestre cada servicio con:

1. Título evocador
2. Breve descripción que genere intriga
3. Iconografía mística relacionada con el servicio
4. Precio o rango de precios
5. Indicador de popularidad o potencia
6. Botón de "Solicitar" o "Consultar"

El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, con especial atención a la experiencia móvil, utilizando un enfoque mobile-first. Las animaciones deben ser sutiles y optimizadas para no afectar el rendimiento en dispositivos móviles.

CARACTERÍSTICAS ESPECIALES:
1. Sistema de filtrado por tipo de ritual (amor, prosperidad, protección, etc.)
2. Indicadores visuales de "potencia" o "efectividad" para cada servicio
3. Microinteracciones sutiles que evocan la naturaleza mística de cada servicio
4. Modo de visualización alternativo (lista/grid) para diferentes preferencias
5. Testimonios breves integrados discretamente en algunas tarjetas de servicios

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar todas las animaciones para rendimiento móvil, usando propiedades CSS que no causen reflow.
4. Implementar lazy loading para imágenes y contenido fuera de la vista inicial.
5. Utilizar CSS Grid y Flexbox para layouts responsivos y adaptables.
6. Asegurar que todos los textos sean legibles sobre fondos oscuros o con efectos de transparencia.
7. Implementar transiciones suaves que funcionen bien incluso en dispositivos de gama baja.`,
  },
  {
    id: "ritual-cards-showcase",
    title: "Vitrinas de Rituales",
    description: "Tarjetas interactivas que revelan detalles de rituales con efectos de transformación",
    category: "ritual",
    icon: <Flame className="h-4 w-4" />,
    prompt: `Crea una sección de servicios para un sitio web esotérico con las siguientes características:

- Estilo: Ritual y ceremonial con elementos alquímicos
- Plataforma objetivo: mobile-first
- Esquema de color: Rojo sangre, negro obsidiana, dorado antiguo, toques de verde esmeralda
- Incluir imágenes: Sí
- Estilo de imagen: Fotografías atmosféricas de elementos rituales (velas, hierbas, cristales)
- Tipo de fuente: Caligráfica antigua para títulos, serif con peso medio para descripciones
- Tipo de animación: Transformaciones que emulan transmutación alquímica
- Estilo de borde: Ornamentados con símbolos rituales que se activan en hover
- Incluir información de contacto: Sí, integrada como "solicitud de ritual"

- Optimizaciones de rendimiento: Imágenes optimizadas, CSS eficiente, animaciones throttled
- Optimizaciones SEO: Estructura jerárquica, rich snippets para servicios
- Compatibilidad con navegadores: Progressive enhancement con fallbacks
- Interactividad: Tarjetas que revelan pasos del ritual al interactuar, Selección de intensidad/personalización
- Transiciones: Efectos de "transmutación" entre estados, Revelaciones ceremoniales de información
- Elementos esotéricos interactivos: Círculo ritual interactivo para filtrar servicios, Símbolos alquímicos que transforman al interactuar

- Estilo de código: JavaScript modular con patrones de rendimiento optimizados
- Incluir comentarios detallados: Sí

La sección debe presentar servicios rituales como hechizos de amor, rituales de prosperidad, conjuros de protección y ceremonias de limpieza energética. Cada servicio debe mostrarse como una "vitrina ritual" que contiene:

1. Nombre evocador del ritual
2. Propósito principal y beneficios
3. Elementos utilizados (visuales de hierbas, velas, cristales específicos)
4. Duración o fases lunares requeridas
5. Nivel de complejidad o potencia
6. Opción para personalizar o solicitar

El diseño debe ser COMPLETAMENTE RESPONSIVO con un enfoque mobile-first, asegurando que la experiencia sea óptima en dispositivos móviles primero. Las animaciones deben ser significativas pero optimizadas para no afectar el rendimiento.

CARACTERÍSTICAS ESPECIALES:
1. Selector de "fase lunar" que filtra rituales óptimos para el momento actual
2. Indicadores visuales de "ingredientes" principales de cada ritual
3. Sistema de "intensidad" que permite al usuario seleccionar la potencia deseada
4. Visualización de "compatibilidad" con el signo zodiacal del usuario
5. Modo "ceremonia" que presenta los servicios en un formato inmersivo con efectos visuales intensificados

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar todas las imágenes y efectos visuales para carga rápida en conexiones móviles.
4. Implementar efectos visuales que funcionen bien incluso en dispositivos de gama baja.
5. Utilizar CSS Grid para la disposición principal con fallbacks para navegadores antiguos.
6. Asegurar que todos los elementos interactivos sean accesibles y funcionen tanto con touch como con mouse.
7. Implementar lazy loading para contenido fuera de la vista inicial.`,
  },
  {
    id: "enchanted-services-carousel",
    title: "Carrusel de Encantamientos",
    description: "Presentación dinámica de servicios con efectos de rotación y transformación mágica",
    category: "enchanted",
    icon: <Wand2 className="h-4 w-4" />,
    prompt: `Crea una sección de servicios para un sitio web esotérico con las siguientes características:

- Estilo: Encantado y mágico con efectos de luz y partículas
- Plataforma objetivo: all (optimizado para todas las plataformas)
- Esquema de color: Azul medianoche, púrpura místico, destellos plateados y turquesa brillante
- Incluir imágenes: Sí
- Estilo de imagen: Ilustraciones estilizadas con efectos luminosos y auras mágicas
- Tipo de fuente: Display elegante con trazos fluidos para títulos, sans-serif limpia para texto
- Tipo de animación: Partículas mágicas y efectos de luz que siguen el cursor/toque
- Estilo de borde: Brillantes con efecto de "polvo de hadas" que se activa en hover
- Incluir información de contacto: Sí, como "solicitar encantamiento"

- Optimizaciones de rendimiento: Sistema de partículas optimizado, lazy loading, code splitting
- Optimizaciones SEO: Datos estructurados, metadatos optimizados
- Compatibilidad con navegadores: Feature detection con degradación elegante
- Interactividad: Carrusel 3D que revela servicios con efectos mágicos, Personalización de encantamientos
- Transiciones: Transformaciones con efectos de "encantamiento", Revelaciones con destellos mágicos
- Elementos esotéricos interactivos: Varita mágica como cursor personalizado, Libro de hechizos que muestra detalles

- Estilo de código: JavaScript modular con optimizaciones para animaciones
- Incluir comentarios detallados: Sí

La sección debe presentar servicios de encantamientos y hechizos como amuletos de amor, talismanes de protección, encantamientos de prosperidad y hechizos personalizados. Utilizar un carrusel 3D inmersivo que permita al usuario "navegar" entre los diferentes servicios con efectos mágicos de transición. Cada servicio debe incluir:

1. Nombre evocador del encantamiento
2. Visualización mágica del efecto (mediante ilustración o animación)
3. Descripción de los beneficios y efectos
4. Duración o permanencia del encantamiento
5. Elementos mágicos utilizados
6. Opciones de personalización
7. Llamada a la acción para solicitar

El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, con especial atención a la optimización de efectos visuales para dispositivos móviles.

CARACTERÍSTICAS ESPECIALES:
1. Selector de "afinidad mágica" que recomienda encantamientos según preferencias
2. Sistema de partículas que reacciona al movimiento del cursor/toque
3. Efectos de "resonancia mágica" entre servicios complementarios
4. Visualización de "potencia" mediante efectos visuales dinámicos
5. Modo "grimorio" que presenta los servicios como páginas de un libro mágico

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Implementar el sistema de partículas con Canvas optimizado o CSS para mejor rendimiento.
4. Utilizar IntersectionObserver para activar animaciones solo cuando son visibles.
5. Optimizar todas las animaciones para evitar reflow y jank en dispositivos móviles.
6. Implementar controles accesibles para el carrusel que funcionen con teclado y lectores de pantalla.
7. Asegurar que los efectos visuales tengan alternativas de bajo rendimiento para dispositivos menos potentes.`,
  },
  {
    id: "love-spells-collection",
    title: "Colección de Hechizos de Amor",
    description: "Presentación temática de hechizos de amor con efectos visuales románticos y místicos",
    category: "mystical",
    icon: <Heart className="h-4 w-4" />,
    prompt: `Crea una sección de servicios para un sitio web esotérico con las siguientes características:

- Estilo: Romántico y místico con elementos de magia rosa
- Plataforma objetivo: mobile-first
- Esquema de color: Rosa profundo, rojo pasión, púrpura amor, destellos dorados y toques de negro
- Incluir imágenes: Sí
- Estilo de imagen: Fotografías artísticas con superposición de símbolos de amor y efectos de luz
- Tipo de fuente: Script romántica para títulos, serif elegante para descripciones
- Tipo de animación: Pulsaciones suaves como latidos de corazón y partículas flotantes
- Estilo de borde: Ornamentados con motivos de corazones y símbolos de Venus
- Incluir información de contacto: Sí, como "consulta personalizada de amor"

- Optimizaciones de rendimiento: Imágenes optimizadas, animaciones eficientes, lazy loading
- Optimizaciones SEO: Estructura semántica, rich snippets para servicios
- Compatibilidad con navegadores: Progressive enhancement con fallbacks
- Interactividad: Tarjetas que revelan detalles del hechizo al interactuar, Test de compatibilidad amorosa
- Transiciones: Desvanecimientos suaves con efecto de "aura de amor", Revelaciones con destellos rosados
- Elementos esotéricos interactivos: Péndulo de amor para selección, Cartas de tarot románticas interactivas

- Estilo de código: CSS con variables temáticas y optimizaciones de rendimiento
- Incluir comentarios detallados: Sí

La sección debe presentar una colección especializada de hechizos y servicios relacionados con el amor, como amarres amorosos, rituales de atracción, hechizos de reconciliación y talismanes de pasión. Utilizar un diseño de galería temática que agrupe los servicios por intensidad o propósito. Cada servicio debe incluir:

1. Nombre evocador del hechizo de amor
2. Visualización romántica del efecto
3. Descripción de los beneficios y resultados esperados
4. Ingredientes o elementos místicos utilizados
5. Tiempo estimado para ver resultados
6. Nivel de intensidad o potencia
7. Opciones de personalización
8. Llamada a la acción romántica

El diseño debe ser COMPLETAMENTE RESPONSIVO con enfoque mobile-first, asegurando que la experiencia sea óptima en dispositivos móviles primero, con adaptaciones elegantes para pantallas más grandes.

CARACTERÍSTICAS ESPECIALES:
1. "Medidor de pasión" que indica la intensidad de cada hechizo
2. Filtro de "intención amorosa" (atraer, reconciliar, fortalecer, etc.)
3. Visualización de "compatibilidad zodiacal" para cada servicio
4. Testimonios breves de éxito con efectos visuales románticos
5. Calendario lunar que indica los mejores días para cada ritual de amor

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar todas las animaciones para rendimiento móvil, especialmente los efectos de partículas.
4. Implementar lazy loading para imágenes y contenido fuera de la vista inicial.
5. Utilizar CSS Grid y Flexbox para layouts responsivos y adaptables.
6. Asegurar que todos los textos sean legibles sobre fondos con efectos románticos.
7. Implementar transiciones suaves que funcionen bien incluso en dispositivos de gama baja.`,
  },
  {
    id: "cosmic-divination-services",
    title: "Servicios de Adivinación Cósmica",
    description: "Presentación celestial de servicios de adivinación con efectos astronómicos y cósmicos",
    category: "immersive",
    icon: <Stars className="h-4 w-4" />,
    prompt: `Crea una sección de servicios para un sitio web esotérico con las siguientes características:

- Estilo: Cósmico y celestial con elementos astronómicos
- Plataforma objetivo: all (optimizado para todas las plataformas)
- Esquema de color: Azul noche profundo, púrpura galaxia, destellos plateados estelares, negro cósmico
- Incluir imágenes: Sí
- Estilo de imagen: Visualizaciones cósmicas con elementos astrológicos y constelaciones
- Tipo de fuente: Futurista elegante para títulos, sans-serif limpia para descripciones
- Tipo de animación: Movimiento estelar sutil y revelaciones cósmicas
- Estilo de borde: Constelaciones que conectan puntos luminosos
- Incluir información de contacto: Sí, como "consulta astrológica personalizada"

- Optimizaciones de rendimiento: Canvas optimizado, lazy loading, code splitting
- Optimizaciones SEO: Datos estructurados, metadatos optimizados
- Compatibilidad con navegadores: Feature detection con degradación elegante
- Interactividad: Mapa estelar interactivo para navegar servicios, Personalización de consultas astrológicas
- Transiciones: Efectos de "viaje astral" entre servicios, Revelaciones con destellos estelares
- Elementos esotéricos interactivos: Carta natal interactiva, Zodiaco navegable

- Estilo de código: JavaScript modular con optimizaciones para animaciones cósmicas
- Incluir comentarios detallados: Sí

La sección debe presentar servicios de adivinación y consulta astrológica como lecturas de carta natal, pronósticos astrológicos, compatibilidad zodiacal y consultas de momentos propicios. Utilizar un diseño inmersivo que simule un "mapa estelar" o "planetario" donde cada servicio es representado por una constelación o cuerpo celeste. Cada servicio debe incluir:

1. Nombre evocador del servicio adivinatorio
2. Representación visual cósmica o astrológica
3. Descripción de la consulta y sus beneficios
4. Método de adivinación utilizado
5. Profundidad o extensión de la lectura
6. Formato de entrega (escrito, video, audio)
7. Opciones de personalización
8. Llamada a la acción cósmica

El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, con especial atención a la optimización de efectos visuales para dispositivos móviles.

CARACTERÍSTICAS ESPECIALES:
1. "Navegador cósmico" que permite explorar servicios como constelaciones
2. Visualización del "tránsito planetario actual" con servicios recomendados
3. Mini-demo interactiva de cada tipo de lectura
4. Selector de "profundidad cósmica" para diferentes niveles de consulta
5. Modo "observatorio" que presenta los servicios en un formato inmersivo 3D

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Implementar efectos cósmicos con Canvas optimizado o CSS para mejor rendimiento.
4. Utilizar IntersectionObserver para activar animaciones solo cuando son visibles.
5. Optimizar todas las animaciones para evitar reflow y jank en dispositivos móviles.
6. Implementar controles accesibles para la navegación que funcionen con teclado y lectores de pantalla.
7. Asegurar que los efectos visuales tengan alternativas de bajo rendimiento para dispositivos menos potentes.`,
  },
  {
    id: "crystal-healing-showcase",
    title: "Vitrina de Sanación con Cristales",
    description: "Presentación refractiva de servicios de cristaloterapia con efectos prismáticos y energéticos",
    category: "interactive",
    icon: <Crystal className="h-4 w-4" />,
    prompt: `Crea una sección de servicios para un sitio web esotérico con las siguientes características:

- Estilo: Cristalino y refractivo con efectos prismáticos
- Plataforma objetivo: mobile-first
- Esquema de color: Espectro completo con predominancia de violetas, azules claros, verdes jade y destellos arcoíris
- Incluir imágenes: Sí
- Estilo de imagen: Fotografías de alta calidad de cristales con efectos de luz y auras
- Tipo de fuente: Geométrica clara para títulos, sans-serif limpia para descripciones
- Tipo de animación: Refracciones de luz y brillos que responden al movimiento
- Estilo de borde: Facetados como cristales tallados con efectos prismáticos
- Incluir información de contacto: Sí, como "consulta de cristaloterapia personalizada"

- Optimizaciones de rendimiento: Imágenes WebP, efectos CSS optimizados, lazy loading
- Optimizaciones SEO: Estructura semántica, rich snippets para servicios
- Compatibilidad con navegadores: Progressive enhancement con fallbacks
- Interactividad: Cristales 3D que revelan propiedades al interactuar, Selector de chakras y necesidades
- Transiciones: Efectos de "refracción de luz" entre estados, Brillos y destellos al revelar información
- Elementos esotéricos interactivos: Rejilla de cristales interactiva, Visualizador de auras de cristales

- Estilo de código: CSS con efectos avanzados de refracción y optimizaciones
- Incluir comentarios detallados: Sí

La sección debe presentar servicios de cristaloterapia y sanación energética como limpiezas con cristales, armonización de chakras, programación de cuarzos y rejillas energéticas personalizadas. Utilizar un diseño de "vitrina de cristales" donde cada servicio es representado por un cristal o piedra específica con sus propiedades curativas. Cada servicio debe incluir:

1. Nombre del tratamiento con cristales
2. Visualización del cristal principal utilizado
3. Propiedades energéticas y beneficios
4. Chakras o áreas energéticas afectadas
5. Duración o proceso del tratamiento
6. Efectos esperados tras la sesión
7. Opciones de personalización
8. Llamada a la acción para reservar sesión

El diseño debe ser COMPLETAMENTE RESPONSIVO con enfoque mobile-first, asegurando que la experiencia sea óptima en dispositivos móviles primero, con adaptaciones elegantes para pantallas más grandes.

CARACTERÍSTICAS ESPECIALES:
1. "Selector de chakras" que filtra cristales y tratamientos por centro energético
2. Visualización de "resonancia energética" entre cristales complementarios
3. Modo "espectro" que organiza los servicios por color y vibración
4. Demostración interactiva de cómo funciona cada tratamiento
5. "Analizador de necesidades" que recomienda tratamientos según síntomas o deseos

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar los efectos de refracción y luz para rendimiento móvil.
4. Implementar lazy loading para imágenes de cristales de alta calidad.
5. Utilizar CSS Grid y Flexbox para layouts responsivos y adaptables.
6. Asegurar que todos los textos sean legibles sobre fondos con efectos prismáticos.
7. Implementar transiciones suaves que funcionen bien incluso en dispositivos de gama baja.`,
  },
  {
    id: "lunar-ritual-timeline",
    title: "Línea Temporal de Rituales Lunares",
    description: "Presentación cíclica de rituales organizados según las fases lunares con efectos selenitas",
    category: "ritual",
    icon: <Moon className="h-4 w-4" />,
    prompt: `Crea una sección de servicios para un sitio web esotérico con las siguientes características:

- Estilo: Lunar y cíclico con elementos selenitas
- Plataforma objetivo: all (optimizado para todas las plataformas)
- Esquema de color: Plateado lunar, azul noche, negro cósmico, blanco brillante y gris perla
- Incluir imágenes: Sí
- Estilo de imagen: Fotografías atmosféricas de la luna en diferentes fases con superposiciones místicas
- Tipo de fuente: Elegante y fluida como las mareas para títulos, serif clara para descripciones
- Tipo de animación: Transiciones suaves que emulan las fases lunares
- Estilo de borde: Plateados con efectos de luz lunar y sombras cambiantes
- Incluir información de contacto: Sí, como "consulta ritual personalizada"

- Optimizaciones de rendimiento: Imágenes optimizadas, animaciones eficientes, lazy loading
- Optimizaciones SEO: Estructura semántica, datos estructurados para eventos
- Compatibilidad con navegadores: Feature detection con degradación elegante
- Interactividad: Línea temporal lunar interactiva, Selector de fase lunar actual
- Transiciones: Cambios graduales inspirados en las fases lunares, Efectos de luz y sombra lunar
- Elementos esotéricos interactivos: Calendario lunar interactivo, Visualizador de energía lunar

- Estilo de código: JavaScript con cálculos lunares precisos y optimizaciones
- Incluir comentarios detallados: Sí

La sección debe presentar servicios de rituales lunares organizados según las fases de la luna, como rituales de luna nueva para manifestación, ceremonias de luna llena para potenciación, trabajos de luna menguante para liberación y prácticas de luna creciente para atracción. Utilizar un diseño de "línea temporal lunar" donde los servicios se organizan según el ciclo lunar actual. Cada servicio debe incluir:

1. Nombre del ritual lunar
2. Fase lunar óptima (con visualización)
3. Propósito y beneficios del ritual
4. Elementos utilizados (agua lunar, hierbas, cristales)
5. Duración o proceso del ritual
6. Efectos esperados tras la ceremonia
7. Próxima fecha óptima para realizarlo
8. Llamada a la acción para reservar

El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, con especial atención a la visualización del ciclo lunar en diferentes dispositivos.

CARACTERÍSTICAS ESPECIALES:
1. Calendario lunar en tiempo real que muestra la fase actual y próximas fases
2. Indicador de "potencia lunar" para cada ritual según la fase actual
3. Visualización de "energía lunar" específica para cada tipo de trabajo
4. Recomendaciones personalizadas según la carta natal del usuario
5. Modo "observatorio lunar" que presenta los rituales en un formato inmersivo

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Implementar cálculos lunares precisos o integración con API lunar si es necesario.
4. Optimizar las transiciones de fases lunares para rendimiento móvil.
5. Utilizar CSS Grid y Flexbox para layouts responsivos y adaptables.
6. Asegurar que todos los textos sean legibles sobre fondos con efectos lunares.
7. Implementar transiciones suaves que funcionen bien incluso en dispositivos de gama baja.`,
  },
  {
    id: "elemental-magic-grid",
    title: "Rejilla de Magia Elemental",
    description:
      "Presentación de servicios organizados por elementos (fuego, agua, tierra, aire) con efectos elementales",
    category: "interactive",
    icon: <Droplets className="h-4 w-4" />,
    prompt: `Crea una sección de servicios para un sitio web esotérico con las siguientes características:

- Estilo: Elemental y natural con representaciones de los cuatro elementos
- Plataforma objetivo: mobile-first
- Esquema de color: Rojo fuego, azul agua, verde tierra, blanco aire y dorado como quinto elemento
- Incluir imágenes: Sí
- Estilo de imagen: Visualizaciones artísticas de los elementos con efectos dinámicos
- Tipo de fuente: Orgánica con variaciones según el elemento para títulos, sans-serif para descripciones
- Tipo de animación: Movimientos naturales que emulan cada elemento (ondulación, llamas, brisa, etc.)
- Estilo de borde: Orgánicos que evocan las cualidades de cada elemento
- Incluir información de contacto: Sí, como "consulta elemental personalizada"

- Optimizaciones de rendimiento: Animaciones optimizadas, lazy loading, CSS eficiente
- Optimizaciones SEO: Estructura semántica, rich snippets para servicios
- Compatibilidad con navegadores: Progressive enhancement con fallbacks
- Interactividad: Rejilla elemental interactiva, Selector de afinidad elemental
- Transiciones: Transformaciones basadas en las propiedades de los elementos, Cambios de estado elementales
- Elementos esotéricos interactivos: Pentáculo elemental interactivo, Visualizador de balance elemental

- Estilo de código: CSS con variables que reflejan estados elementales y optimizaciones
- Incluir comentarios detallados: Sí

La sección debe presentar servicios mágicos organizados según los cuatro elementos: rituales de fuego para pasión y transformación, trabajos de agua para emociones y purificación, hechizos de tierra para prosperidad y estabilidad, y encantamientos de aire para comunicación e intelecto. Utilizar un diseño de "rejilla elemental" donde los servicios se agrupan por su elemento correspondiente. Cada servicio debe incluir:

1. Nombre del trabajo mágico elemental
2. Elemento principal y secundario (si aplica)
3. Propósito y beneficios del servicio
4. Visualización del efecto elemental
5. Ingredientes o herramientas utilizadas
6. Duración o proceso del trabajo
7. Efectos esperados tras el ritual
8. Llamada a la acción para solicitar

El diseño debe ser COMPLETAMENTE RESPONSIVO con enfoque mobile-first, asegurando que la experiencia sea óptima en dispositivos móviles primero, con adaptaciones elegantes para pantallas más grandes.

CARACTERÍSTICAS ESPECIALES:
1. "Selector de afinidad elemental" que recomienda servicios según el elemento dominante del usuario
2. Visualización de "balance elemental" para cada servicio
3. Efectos visuales únicos para cada elemento (partículas de fuego, ondulaciones de agua, etc.)
4. Sistema de filtrado por intención y elemento
5. Modo "inmersivo" que intensifica la experiencia visual del elemento seleccionado

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar los efectos elementales para rendimiento móvil, usando CSS cuando sea posible.
4. Implementar lazy loading para imágenes y contenido fuera de la vista inicial.
5. Utilizar CSS Grid y Flexbox para layouts responsivos y adaptables.
6. Asegurar que todos los textos sean legibles sobre fondos con efectos elementales.
7. Implementar transiciones suaves que funcionen bien incluso en dispositivos de gama baja.`,
  },
  {
    id: "tarot-services-deck",
    title: "Baraja de Servicios de Tarot",
    description: "Presentación de servicios de tarot como cartas interactivas con efectos de revelación",
    category: "mystical",
    icon: <Scroll className="h-4 w-4" />,
    prompt: `Crea una sección de servicios para un sitio web esotérico con las siguientes características:

- Estilo: Tarot y arcano con simbolismo tradicional
- Plataforma objetivo: all (optimizado para todas las plataformas)
- Esquema de color: Dorado antiguo, rojo burdeos, azul medianoche, negro y blanco marfil
- Incluir imágenes: Sí
- Estilo de imagen: Ilustraciones estilizadas inspiradas en cartas de tarot con simbolismo arcano
- Tipo de fuente: Serif ornamentada para títulos, serif clásica para descripciones
- Tipo de animación: Volteo de cartas y revelaciones graduales
- Estilo de borde: Ornamentados con motivos de tarot y símbolos arcanos
- Incluir información de contacto: Sí, como "consulta personalizada de tarot"

- Optimizaciones de rendimiento: Imágenes optimizadas, animaciones eficientes, lazy loading
- Optimizaciones SEO: Estructura semántica, rich snippets para servicios
- Compatibilidad con navegadores: Progressive enhancement con fallbacks
- Interactividad: Cartas de tarot interactivas, Tirada simple demostrativa
- Transiciones: Efectos de "volteo de cartas" entre estados, Revelaciones graduales de significados
- Elementos esotéricos interactivos: Mini-tirada de tarot interactiva, Arcanos mayores navegables

- Estilo de código: JavaScript modular con optimizaciones para animaciones de cartas
- Incluir comentarios detallados: Sí

La sección debe presentar servicios de lectura de tarot como tiradas completas, lecturas de arcanos mayores, consultas específicas y enseñanza de tarot. Utilizar un diseño de "baraja de tarot" donde cada servicio es representado por una carta estilizada. Cada servicio debe incluir:

1. Nombre de la lectura o consulta
2. Carta de tarot representativa
3. Tipo de tirada o método utilizado
4. Preguntas o situaciones ideales para esta lectura
5. Profundidad o extensión de la interpretación
6. Formato de entrega (presencial, video, escrito)
7. Tiempo aproximado de la sesión
8. Llamada a la acción para reservar

El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, con especial atención a la experiencia de "volteo de cartas" en dispositivos táctiles.

CARACTERÍSTICAS ESPECIALES:
1. "Carta del día" que cambia diariamente y ofrece una mini-lectura gratuita
2. Demostración interactiva de una tirada simple de 3 cartas
3. Visualización de "conexión" entre diferentes tipos de lecturas
4. Selector de "pregunta guía" que recomienda el tipo de lectura más adecuado
5. Modo "arcanos" que organiza los servicios según su relación con los arcanos mayores

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar las animaciones de volteo de cartas para rendimiento móvil.
4. Implementar lazy loading para imágenes de cartas de alta calidad.
5. Utilizar CSS Grid y Flexbox para layouts responsivos y adaptables.
6. Asegurar que todos los textos sean legibles sobre fondos con diseños de cartas.
7. Implementar transiciones suaves que funcionen bien incluso en dispositivos de gama baja.`,
  },
  {
    id: "herbal-magic-apothecary",
    title: "Boticario de Magia Herbal",
    description: "Presentación de servicios herbales como una botica mágica con efectos orgánicos y naturales",
    category: "ritual",
    icon: <Flower className="h-4 w-4" />,
    prompt: `Crea una sección de servicios para un sitio web esotérico con las siguientes características:

- Estilo: Herbal y botánico con elementos alquímicos
- Plataforma objetivo: mobile-first
- Esquema de color: Verde bosque, marrón tierra, púrpura lavanda, amarillo ámbar y toques de rojo
- Incluir imágenes: Sí
- Estilo de imagen: Fotografías detalladas de hierbas, plantas y preparaciones herbales
- Tipo de fuente: Caligráfica orgánica para títulos, serif con peso medio para descripciones
- Tipo de animación: Crecimientos orgánicos y florecimientos graduales
- Estilo de borde: Ornamentos botánicos con motivos de hojas y flores
- Incluir información de contacto: Sí, como "consulta herbal personalizada"

- Optimizaciones de rendimiento: Imágenes WebP, animaciones eficientes, lazy loading
- Optimizaciones SEO: Estructura semántica, rich snippets para productos
- Compatibilidad con navegadores: Progressive enhancement con fallbacks
- Interactividad: Boticario virtual interactivo, Selector de propiedades herbales
- Transiciones: Efectos de "florecimiento" entre estados, Revelaciones graduales como crecimiento
- Elementos esotéricos interactivos: Grimorio herbal interactivo, Rueda de correspondencias herbales

- Estilo de código: CSS con animaciones orgánicas optimizadas
- Incluir comentarios detallados: Sí

La sección debe presentar servicios de magia herbal como preparaciones personalizadas, saquitos de hierbas, baños rituales, inciensos mágicos y aceites esenciales encantados. Utilizar un diseño de "boticario mágico" donde los servicios se presentan como si estuvieran en estantes de una botica herbal. Cada servicio debe incluir:

1. Nombre de la preparación herbal
2. Hierbas principales utilizadas (con visualización)
3. Propósito mágico y beneficios
4. Método de preparación o uso
5. Duración o potencia del efecto
6. Correspondencias planetarias o elementales
7. Opciones de personalización
8. Llamada a la acción para solicitar

El diseño debe ser COMPLETAMENTE RESPONSIVO con enfoque mobile-first, asegurando que la experiencia sea óptima en dispositivos móviles primero, con adaptaciones elegantes para pantallas más grandes.

CARACTERÍSTICAS ESPECIALES:
1. "Herbario virtual" que muestra información detallada de cada hierba al seleccionarla
2. Selector de "intención mágica" que filtra preparaciones según el objetivo
3. Visualización de "correspondencias" entre hierbas y planetas/elementos
4. Sistema de "receta personalizada" que permite combinar efectos
5. Calendario de "cosecha óptima" que indica la mejor temporada para cada preparación

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar las imágenes de hierbas para carga rápida manteniendo el detalle necesario.
4. Implementar lazy loading para imágenes y contenido fuera de la vista inicial.
5. Utilizar CSS Grid y Flexbox para layouts responsivos y adaptables.
6. Asegurar que todos los textos sean legibles sobre fondos con texturas herbales.
7. Implementar transiciones suaves que funcionen bien incluso en dispositivos de gama baja.`,
  },
  {
    id: "protection-spells-shield",
    title: "Escudo de Hechizos de Protección",
    description: "Presentación de servicios de protección con efectos de escudos energéticos y barreras místicas",
    category: "enchanted",
    icon: <Skull className="h-4 w-4" />,
    prompt: `Crea una sección de servicios para un sitio web esotérico con las siguientes características:

- Estilo: Protección y defensa con elementos de escudos energéticos
- Plataforma objetivo: all (optimizado para todas las plataformas)
- Esquema de color: Negro obsidiana, plata protectora, azul zafiro, rojo rubí y destellos de blanco
- Incluir imágenes: Sí
- Estilo de imagen: Visualizaciones de escudos energéticos, símbolos de protección y barreras místicas
- Tipo de fuente: Rúnica estilizada para títulos, sans-serif sólida para descripciones
- Tipo de animación: Pulsos de energía protectora y formación de escudos
- Estilo de borde: Símbolos de protección y runas de defensa
- Incluir información de contacto: Sí, como "consulta de protección personalizada"

- Optimizaciones de rendimiento: Efectos CSS optimizados, lazy loading, code splitting
- Optimizaciones SEO: Estructura semántica, rich snippets para servicios
- Compatibilidad con navegadores: Progressive enhancement con fallbacks
- Interactividad: Escudos interactivos que revelan capas de protección, Analizador de vulnerabilidades
- Transiciones: Efectos de "activación de escudo" entre estados, Revelaciones con pulsos de energía
- Elementos esotéricos interactivos: Círculo de protección interactivo, Runas de defensa activables

- Estilo de código: JavaScript modular con optimizaciones para efectos de energía
- Incluir comentarios detallados: Sí

La sección debe presentar servicios de protección mágica como limpieza energética, escudos personales, protección de espacios, amuletos defensivos y rituales de destierro. Utilizar un diseño de "escudo de protección" donde los servicios se organizan en capas de defensa, desde la protección básica hasta la más avanzada. Cada servicio debe incluir:

1. Nombre del hechizo o ritual de protección
2. Nivel de potencia o intensidad
3. Tipo de amenazas que contrarresta
4. Visualización del efecto protector
5. Duración o mantenimiento necesario
6. Elementos o símbolos utilizados
7. Opciones de personalización
8. Llamada a la acción para solicitar

El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, con especial atención a los efectos visuales de protección en diferentes dispositivos.

CARACTERÍSTICAS ESPECIALES:
1. "Analizador de vulnerabilidades" que recomienda protecciones según las necesidades
2. Visualización de "capas de defensa" para cada servicio
3. Demostración interactiva de cómo funciona cada tipo de protección
4. Sistema de "intensidad" que permite seleccionar el nivel de protección deseado
5. Modo "escáner" que presenta los servicios con efectos de detección energética

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar los efectos de energía y escudos para rendimiento móvil.
4. Implementar lazy loading para imágenes y contenido fuera de la vista inicial.
5. Utilizar CSS Grid y Flexbox para layouts responsivos y adaptables.
6. Asegurar que todos los textos sean legibles sobre fondos con efectos de protección.
7. Implementar transiciones suaves que funcionen bien incluso en dispositivos de gama baja.`,
  },
  {
    id: "prosperity-rituals-vault",
    title: "Bóveda de Rituales de Prosperidad",
    description: "Presentación de servicios de abundancia con efectos de oro y riqueza visual",
    category: "immersive",
    icon: <Gem className="h-4 w-4" />,
    prompt: `Crea una sección de servicios para un sitio web esotérico con las siguientes características:

- Estilo: Prosperidad y abundancia con elementos de riqueza y opulencia
- Plataforma objetivo: mobile-first
- Esquema de color: Dorado abundancia, verde esmeralda, marrón tierra, negro y toques de rojo
- Incluir imágenes: Sí
- Estilo de imagen: Visualizaciones de símbolos de prosperidad, monedas, cristales y elementos de abundancia
- Tipo de fuente: Elegante y opulenta para títulos, serif refinada para descripciones
- Tipo de animación: Destellos dorados y efectos de "lluvia de abundancia"
- Estilo de borde: Ornamentos de prosperidad con motivos de monedas y símbolos de riqueza
- Incluir información de contacto: Sí, como "consulta de prosperidad personalizada"

- Optimizaciones de rendimiento: Efectos CSS optimizados, lazy loading, code splitting
- Optimizaciones SEO: Estructura semántica, rich snippets para servicios
- Compatibilidad con navegadores: Progressive enhancement con fallbacks
- Interactividad: Bóveda interactiva que revela tesoros de prosperidad, Selector de objetivos financieros
- Transiciones: Efectos de "manifestación de abundancia" entre estados, Revelaciones con destellos dorados
- Elementos esotéricos interactivos: Rueda de la fortuna interactiva, Símbolos de prosperidad activables

- Estilo de código: CSS con efectos de oro y riqueza optimizados
- Incluir comentarios detallados: Sí

La sección debe presentar servicios de prosperidad y abundancia como rituales de atracción de dinero, hechizos de éxito financiero, talismanes de abundancia, limpiezas de bloqueos económicos y activaciones de prosperidad. Utilizar un diseño de "bóveda del tesoro" donde los servicios se presentan como valiosos tesoros de prosperidad. Cada servicio debe incluir:

1. Nombre del ritual o hechizo de prosperidad
2. Visualización del efecto de abundancia
3. Áreas de la vida que beneficia (negocios, carrera, finanzas personales)
4. Elementos o símbolos utilizados
5. Tiempo estimado para ver resultados
6. Nivel de potencia o efectividad
7. Opciones de personalización
8. Llamada a la acción para solicitar

El diseño debe ser COMPLETAMENTE RESPONSIVO con enfoque mobile-first, asegurando que la experiencia sea óptima en dispositivos móviles primero, con adaptaciones elegantes para pantallas más grandes.

CARACTERÍSTICAS ESPECIALES:
1. "Calculadora de prosperidad" que estima el potencial de abundancia de cada servicio
2. Visualización de "flujo de riqueza" para cada tipo de ritual
3. Testimonios de éxito con efectos visuales de abundancia
4. Selector de "objetivo financiero" que recomienda servicios específicos
5. Modo "cofre del tesoro" que presenta los servicios con efectos de descubrimiento

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar los efectos dorados y de abundancia para rendimiento móvil.
4. Implementar lazy loading para imágenes y contenido fuera de la vista inicial.
5. Utilizar CSS Grid y Flexbox para layouts responsivos y adaptables.
6. Asegurar que todos los textos sean legibles sobre fondos con efectos de riqueza.
7. Implementar transiciones suaves que funcionen bien incluso en dispositivos de gama baja.`,
  },
  {
    id: "spiritual-cleansing-cascade",
    title: "Cascada de Limpiezas Espirituales",
    description: "Presentación fluida de servicios de limpieza energética con efectos de agua y purificación",
    category: "immersive",
    icon: <Droplets className="h-4 w-4" />,
    prompt: `Crea una sección de servicios para un sitio web esotérico con las siguientes características:

- Estilo: Purificación y limpieza con elementos acuáticos y fluidos
- Plataforma objetivo: all (optimizado para todas las plataformas)
- Esquema de color: Azul agua, blanco pureza, turquesa limpieza, plateado y toques de violeta
- Incluir imágenes: Sí
- Estilo de imagen: Visualizaciones de agua, cascadas, elementos de purificación y auras limpias
- Tipo de fuente: Fluida y clara para títulos, sans-serif limpia para descripciones
- Tipo de animación: Ondulaciones acuáticas y flujos de energía purificadora
- Estilo de borde: Ondulados como agua con efectos de fluidez
- Incluir información de contacto: Sí, como "consulta de limpieza personalizada"

- Optimizaciones de rendimiento: Efectos CSS optimizados, lazy loading, code splitting
- Optimizaciones SEO: Estructura semántica, rich snippets para servicios
- Compatibilidad con navegadores: Progressive enhancement con fallbacks
- Interactividad: Cascada interactiva que revela niveles de limpieza, Analizador de bloqueos energéticos
- Transiciones: Efectos de "flujo purificador" entre estados, Revelaciones con ondas de energía
- Elementos esotéricos interactivos: Visualizador de aura interactivo, Elementos de purificación activables

- Estilo de código: CSS con efectos fluidos optimizados
- Incluir comentarios detallados: Sí

La sección debe presentar servicios de limpieza y purificación espiritual como limpiezas energéticas, baños rituales, despeje de chakras, eliminación de bloqueos y purificación de espacios. Utilizar un diseño de "cascada purificadora" donde los servicios fluyen como agua cristalina desde los más básicos hasta los más profundos. Cada servicio debe incluir:

1. Nombre del ritual o proceso de limpieza
2. Nivel de profundidad o intensidad
3. Áreas energéticas que purifica
4. Elementos o métodos utilizados
5. Duración del proceso y efectos
6. Frecuencia recomendada
7. Opciones de personalización
8. Llamada a la acción para solicitar

El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, con especial atención a los efectos fluidos en diferentes dispositivos.

CARACTERÍSTICAS ESPECIALES:
1. "Escáner energético" que recomienda limpiezas según las necesidades
2. Visualización de "niveles de purificación" para cada servicio
3. Demostración interactiva del proceso de limpieza
4. Selector de "bloqueos específicos" que filtra servicios adecuados
5. Modo "inmersión" que presenta los servicios con efectos acuáticos intensificados

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar los efectos acuáticos y fluidos para rendimiento móvil.
4. Implementar lazy loading para imágenes y contenido fuera de la vista inicial.
5. Utilizar CSS Grid y Flexbox para layouts responsivos y adaptables.
6. Asegurar que todos los textos sean legibles sobre fondos con efectos acuáticos.
7. Implementar transiciones suaves que funcionen bien incluso en dispositivos de gama baja.`,
  },
  {
    id: "ancestral-wisdom-timeline",
    title: "Línea Temporal de Sabiduría Ancestral",
    description: "Presentación cronológica de servicios basados en tradiciones ancestrales con efectos de antigüedad",
    category: "interactive",
    icon: <Hourglass className="h-4 w-4" />,
    prompt: `Crea una sección de servicios para un sitio web esotérico con las siguientes características:

- Estilo: Ancestral y tradicional con elementos de sabiduría antigua
- Plataforma objetivo: mobile-first
- Esquema de color: Marrón pergamino, negro tinta, dorado envejecido, rojo sangre y verde bosque
- Incluir imágenes: Sí
- Estilo de imagen: Ilustraciones estilizadas de tradiciones ancestrales y símbolos antiguos
- Tipo de fuente: Caligráfica antigua para títulos, serif con peso medio para descripciones
- Tipo de animación: Revelaciones graduales como descubrimientos arqueológicos
- Estilo de borde: Ornamentos tradicionales con motivos culturales específicos
- Incluir información de contacto: Sí, como "consulta de sabiduría ancestral"

- Optimizaciones de rendimiento: Imágenes optimizadas, animaciones eficientes, lazy loading
- Optimizaciones SEO: Estructura semántica, rich snippets para servicios
- Compatibilidad con navegadores: Progressive enhancement con fallbacks
- Interactividad: Línea temporal interactiva, Explorador de tradiciones ancestrales
- Transiciones: Efectos de "revelación de conocimiento antiguo", Despliegues como pergaminos
- Elementos esotéricos interactivos: Grimorio ancestral interactivo, Símbolos tradicionales navegables

- Estilo de código: CSS con efectos de antigüedad optimizados
- Incluir comentarios detallados: Sí

La sección debe presentar servicios basados en tradiciones ancestrales como rituales indígenas, prácticas chamánicas, ceremonias tradicionales, sanación ancestral y conexión con antepasados. Utilizar un diseño de "línea temporal ancestral" donde los servicios se organizan según su tradición o antigüedad. Cada servicio debe incluir:

1. Nombre del ritual o práctica ancestral
2. Origen cultural o tradicional
3. Propósito y beneficios espirituales
4. Elementos o herramientas tradicionales utilizadas
5. Proceso o ceremonia
6. Conexión con la sabiduría antigua
7. Adaptación moderna (si aplica)
8. Llamada a la acción para solicitar

El diseño debe ser COMPLETAMENTE RESPONSIVO con enfoque mobile-first, asegurando que la experiencia sea óptima en dispositivos móviles primero, con adaptaciones elegantes para pantallas más grandes.

CARACTERÍSTICAS ESPECIALES:
1. "Mapa de tradiciones" que muestra el origen geográfico de cada práctica
2. Visualización de "linaje espiritual" para cada servicio
3. Comparativa de prácticas similares en diferentes culturas
4. Selector de "afinidad ancestral" que recomienda tradiciones según resonancia personal
5. Modo "códice antiguo" que presenta los servicios como páginas de un libro ancestral

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar las imágenes de tradiciones ancestrales para carga rápida.
4. Implementar lazy loading para imágenes y contenido fuera de la vista inicial.
5. Utilizar CSS Grid y Flexbox para layouts responsivos y adaptables.
6. Asegurar que todos los textos sean legibles sobre fondos con texturas antiguas.
7. Implementar transiciones suaves que funcionen bien incluso en dispositivos de gama baja.`,
  },
  {
    id: "astral-journey-portal",
    title: "Portal de Viajes Astrales",
    description: "Presentación inmersiva de servicios de viaje astral y experiencias fuera del cuerpo",
    category: "immersive",
    icon: <Compass className="h-4 w-4" />,
    prompt: `Crea una sección de servicios para un sitio web esotérico con las siguientes características:

- Estilo: Astral y etéreo con elementos de planos dimensionales
- Plataforma objetivo: all (optimizado para todas las plataformas)
- Esquema de color: Azul cósmico, violeta astral, plateado etéreo, negro espacial y destellos blancos
- Incluir imágenes: Sí
- Estilo de imagen: Visualizaciones de planos astrales, viajes dimensionales y experiencias extracorporales
- Tipo de fuente: Etérea y ligera para títulos, sans-serif clara para descripciones
- Tipo de animación: Transiciones dimensionales y efectos de "salida del cuerpo"
- Estilo de borde: Difuminados que sugieren los límites entre dimensiones
- Incluir información de contacto: Sí, como "consulta de viaje astral personalizada"

- Optimizaciones de rendimiento: Efectos CSS optimizados, lazy loading, code splitting
- Optimizaciones SEO: Estructura semántica, rich snippets para servicios
- Compatibilidad con navegadores: Progressive enhancement con fallbacks
- Interactividad: Portal dimensional interactivo, Explorador de planos astrales
- Transiciones: Efectos de "viaje astral" entre estados, Desplazamientos entre capas dimensionales
- Elementos esotéricos interactivos: Mapa astral interactivo, Visualizador de planos dimensionales

- Estilo de código: JavaScript modular con optimizaciones para efectos dimensionales
- Incluir comentarios detallados: Sí

La sección debe presentar servicios relacionados con experiencias astrales como guías de viaje astral, entrenamiento para proyección astral, exploración de planos sutiles, conexión con guías espirituales y recuperación de fragmentos del alma. Utilizar un diseño de "portal dimensional" donde los servicios se presentan como destinos o experiencias astrales. Cada servicio debe incluir:

1. Nombre de la experiencia o viaje astral
2. Plano o dimensión explorada
3. Beneficios y propósito espiritual
4. Método o técnica utilizada
5. Nivel de experiencia recomendado
6. Duración o intensidad de la experiencia
7. Posibles descubrimientos o revelaciones
8. Llamada a la acción para solicitar

El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, con especial atención a los efectos dimensionales en diferentes dispositivos.

CARACTERÍSTICAS ESPECIALES:
1. "Navegador astral" que permite explorar visualmente los diferentes planos
2. Visualización de "cordón plateado" que conecta los diferentes servicios
3. Demostración interactiva de la sensación de proyección astral
4. Selector de "afinidad dimensional" que recomienda experiencias según resonancia personal
5. Modo "inmersión astral" que presenta los servicios con efectos dimensionales intensificados

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar los efectos dimensionales y astrales para rendimiento móvil.
4. Implementar lazy loading para imágenes y contenido fuera de la vista inicial.
5. Utilizar CSS Grid y Flexbox para layouts responsivos y adaptables.
6. Asegurar que todos los textos sean legibles sobre fondos con efectos dimensionales.
7. Implementar transiciones suaves que funcionen bien incluso en dispositivos de gama baja.`,
  },
  {
    id: "candle-magic-altar",
    title: "Altar de Magia con Velas",
    description: "Presentación atmosférica de servicios de magia con velas con efectos de luz y fuego",
    category: "ritual",
    icon: <Candle className="h-4 w-4" />,
    prompt: `Crea una sección de servicios para un sitio web esotérico con las siguientes características:

- Estilo: Magia con velas y elementos de fuego ceremonial
- Plataforma objetivo: mobile-first
- Esquema de color: Naranja llama, rojo fuego, amarillo cálido, negro noche y dorado
- Incluir imágenes: Sí
- Estilo de imagen: Fotografías atmosféricas de velas, llamas y altares ceremoniales
- Tipo de fuente: Elegante con trazos que evocan llamas para títulos, serif clara para descripciones
- Tipo de animación: Efectos de llama parpadeante y luz de vela
- Estilo de borde: Ornamentos con motivos de cera derretida y símbolos grabados
- Incluir información de contacto: Sí, como "consulta de ritual personalizado"

- Optimizaciones de rendimiento: Efectos de llama optimizados, lazy loading, code splitting
- Optimizaciones SEO: Estructura semántica, rich snippets para servicios
- Compatibilidad con navegadores: Progressive enhancement con fallbacks
- Interactividad: Altar virtual interactivo, Selector de colores e intenciones de velas
- Transiciones: Efectos de "encendido de vela" entre estados, Iluminaciones graduales
- Elementos esotéricos interactivos: Velas virtuales interactivas, Símbolos de cera activables

- Estilo de código: CSS con efectos de llama y luz optimizados
- Incluir comentarios detallados: Sí

La sección debe presentar servicios de magia con velas como rituales de velas de colores, trabajos con velas de siete días, ceremonias de velas talladas, consagraciones de velas y hechizos con velas específicas. Utilizar un diseño de "altar ceremonial" donde los servicios se presentan como diferentes tipos de velas y rituales. Cada servicio debe incluir:

1. Nombre del ritual o trabajo con velas
2. Color y tipo de vela utilizada
3. Propósito e intención mágica
4. Proceso o ceremonia
5. Duración del ritual
6. Símbolos o grabados utilizados
7. Opciones de personalización
8. Llamada a la acción para solicitar

El diseño debe ser COMPLETAMENTE RESPONSIVO con enfoque mobile-first, asegurando que la experiencia sea óptima en dispositivos móviles primero, con adaptaciones elegantes para pantallas más grandes.

CARACTERÍSTICAS ESPECIALES:
1. "Selector de intenciones" que recomienda colores y tipos de velas según el objetivo
2. Visualización de "llama virtual" que cambia según el tipo de ritual
3. Demostración interactiva de cómo se realiza cada ritual
4. Calendario de "momentos propicios" para diferentes trabajos con velas
5. Modo "santuario" que presenta los servicios con efectos de luz de vela intensificados

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar los efectos de llama y luz para rendimiento móvil.
4. Implementar lazy loading para imágenes atmosféricas de alta calidad.
5. Utilizar CSS Grid y Flexbox para layouts responsivos y adaptables.
6. Asegurar que todos los textos sean legibles sobre fondos oscuros con efectos de luz.
7. Implementar transiciones suaves que funcionen bien incluso en dispositivos de gama baja.`,
  },
]

export function ServicesPresets({ onSelectPreset }: { onSelectPreset: (prompt: string) => void }) {
  const [activeCategory, setActiveCategory] = useState<string>("all")

  // Filtrar presets por categoría
  const filteredPresets =
    activeCategory === "all" ? servicesPresets : servicesPresets.filter((preset) => preset.category === activeCategory)

  return (
    <Card className="border border-purple-500/20 bg-black/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-400" />
          Presets de Prompts para Secciones de Servicios Esotéricos
        </CardTitle>
        <CardDescription>
          Selecciona uno de estos presets predefinidos para generar un prompt completo para secciones de servicios
          esotéricos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="all" onClick={() => setActiveCategory("all")}>
              Todos
            </TabsTrigger>
            <TabsTrigger value="mystical" onClick={() => setActiveCategory("mystical")}>
              Místicos
            </TabsTrigger>
            <TabsTrigger value="interactive" onClick={() => setActiveCategory("interactive")}>
              Interactivos
            </TabsTrigger>
            <TabsTrigger value="immersive" onClick={() => setActiveCategory("immersive")}>
              Inmersivos
            </TabsTrigger>
            <TabsTrigger value="ritual" onClick={() => setActiveCategory("ritual")}>
              Rituales
            </TabsTrigger>
            <TabsTrigger value="enchanted" onClick={() => setActiveCategory("enchanted")}>
              Encantados
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[320px] rounded-md border border-purple-500/20 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="border border-purple-500/30 rounded-lg p-4 bg-black/30 hover:bg-purple-900/20 transition-colors cursor-pointer"
                  onClick={() => onSelectPreset(preset.prompt)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-full bg-purple-500/20">{preset.icon}</div>
                    <h3 className="font-medium text-white">{preset.title}</h3>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{preset.description}</p>
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-200 border-purple-500/30">
                    {preset.category === "mystical" && "Místico"}
                    {preset.category === "interactive" && "Interactivo"}
                    {preset.category === "immersive" && "Inmersivo"}
                    {preset.category === "ritual" && "Ritual"}
                    {preset.category === "enchanted" && "Encantado"}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  )
}

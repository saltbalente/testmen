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
  Palette,
  Layout,
  Layers,
  Compass,
  Moon,
  Sun,
  Zap,
  Feather,
  Eye,
  Cloud,
  Gem,
  Infinity,
  Hexagon,
} from "lucide-react"

// Definición de tipos para los presets
interface PromptPreset {
  id: string
  title: string
  description: string
  category: "mystical" | "cosmic" | "alchemical" | "sacred" | "occult"
  icon: React.ReactNode
  prompt: string
}

// Lista de 15 presets para headers esotéricos
const headerPresets: PromptPreset[] = [
  {
    id: "mystical-portal",
    title: "Portal Místico",
    description: "Header con efecto de portal dimensional y símbolos arcanos animados",
    category: "mystical",
    icon: <Sparkles className="h-4 w-4" />,
    prompt: `Crea una sección de header para un sitio web con las siguientes características:

- Estilo: Místico y etéreo
- Plataforma objetivo: mobile-first
- Esquema de color: Púrpura profundo, azul cósmico, destellos dorados
- Incluir imágenes: Sí
- Estilo de imagen: Símbolos arcanos sutiles que flotan y rotan lentamente
- Tipo de fuente: Serif elegante con ligaduras especiales
- Tipo de animación: Partículas flotantes que responden al movimiento del cursor
- Estilo de borde: Bordes luminosos sutiles con efecto de resplandor
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Lazy loading, CSS optimizado, compresión de imágenes
- Optimizaciones SEO: Estructura semántica, metadatos optimizados
- Compatibilidad con navegadores: Chrome, Firefox, Safari, Edge
- Interactividad: Hover revela símbolos ocultos, Menú desplegable con transición fluida
- Transiciones: Desvanecimiento suave entre estados, Transformación de elementos al hacer scroll
- Elementos esotéricos interactivos: Símbolos que brillan al pasar el cursor, Runas que cambian de forma

- Estilo de código: Tailwind CSS con clases personalizadas
- Incluir comentarios detallados: Sí

La sección debe tener una estética Místico y etéreo con animaciones Partículas flotantes que responden al movimiento del cursor. Utilizar tipografía Serif elegante con ligaduras especiales y bordes Bordes luminosos sutiles con efecto de resplandor. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CARACTERÍSTICAS ESPECIALES:
1. Logo SVG animado que pulsa suavemente como si respirara
2. Menú hamburguesa para móvil que se transforma en un símbolo místico al abrirse
3. Barra de navegación que cambia de opacidad al hacer scroll
4. Efecto de "portal dimensional" que revela contenido al hacer hover en elementos clave
5. Microinteracciones en cada elemento del menú con efectos de partículas personalizados

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Implementar con enfoque mobile-first, asegurando que la experiencia sea óptima en dispositivos móviles primero.
4. Utilizar CSS Grid y Flexbox para layouts complejos y responsivos.
5. Implementar animaciones optimizadas que no afecten el rendimiento.`,
  },
  {
    id: "cosmic-navigator",
    title: "Navegador Cósmico",
    description: "Header inspirado en la navegación celestial con mapa estelar interactivo",
    category: "cosmic",
    icon: <Compass className="h-4 w-4" />,
    prompt: `Crea una sección de header para un sitio web con las siguientes características:

- Estilo: Cósmico y astronómico
- Plataforma objetivo: all
- Esquema de color: Azul noche profundo, púrpura nebulosa, destellos plateados como estrellas
- Incluir imágenes: Sí
- Estilo de imagen: Mapa estelar sutil con constelaciones que conectan elementos del menú
- Tipo de fuente: Sans-serif futurista con espaciado amplio
- Tipo de animación: Parallax suave con estrellas que se mueven a diferentes velocidades
- Estilo de borde: Bordes finos con efecto de polvo estelar
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Imágenes WebP, CSS crítico, código minificado
- Optimizaciones SEO: Estructura de encabezados lógica, alt text descriptivo
- Compatibilidad con navegadores: Todos los navegadores modernos con fallbacks
- Interactividad: Menú que revela constelaciones, Búsqueda con animación de expansión cósmica
- Transiciones: Efecto de distorsión espacial entre páginas, Elementos que se materializan al cargar
- Elementos esotéricos interactivos: Constelaciones que cambian según la navegación, Fases lunares que indican secciones del sitio

- Estilo de código: CSS moderno con variables personalizadas
- Incluir comentarios detallados: Sí

La sección debe tener una estética Cósmico y astronómico con animaciones Parallax suave con estrellas que se mueven a diferentes velocidades. Utilizar tipografía Sans-serif futurista con espaciado amplio y bordes Bordes finos con efecto de polvo estelar. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CARACTERÍSTICAS ESPECIALES:
1. Logo SVG animado que representa una constelación que se forma y conecta
2. Indicador de navegación que simula un astrolabio o brújula cósmica
3. Menú principal que se expande como una nebulosa al activarse
4. Efecto de "viaje estelar" al hacer hover en los elementos de navegación
5. Modo oscuro/claro que simula día y noche cósmica con transición de eclipse

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Utilizar IntersectionObserver para animaciones al entrar en viewport.
4. Implementar transiciones suaves con CSS transitions y animations.
5. Asegurar que todas las animaciones respeten la preferencia 'prefers-reduced-motion'.`,
  },
  {
    id: "alchemical-transmutation",
    title: "Transmutación Alquímica",
    description: "Header que evoluciona y se transforma con elementos alquímicos interactivos",
    category: "alchemical",
    icon: <Layers className="h-4 w-4" />,
    prompt: `Crea una sección de header para un sitio web con las siguientes características:

- Estilo: Alquímico y transformativo
- Plataforma objetivo: all
- Esquema de color: Dorado antiguo, rojo rubí, verde esmeralda, negro azabache
- Incluir imágenes: Sí
- Estilo de imagen: Símbolos alquímicos clásicos con efectos de transmutación
- Tipo de fuente: Caligráfica antigua con detalles ornamentados
- Tipo de animación: Transformaciones fluidas entre estados y elementos
- Estilo de borde: Ornamentos alquímicos con patrones geométricos sagrados
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Sprites CSS, código modular, carga diferida
- Optimizaciones SEO: Microdata schema.org, estructura semántica
- Compatibilidad con navegadores: Detección de capacidades con fallbacks elegantes
- Interactividad: Elementos que se transforman al interactuar, Menú que evoluciona según la sección
- Transiciones: Transmutación de elementos entre estados, Cambios de fase como en la alquimia
- Elementos esotéricos interactivos: Círculo alquímico interactivo, Símbolos elementales que responden a interacciones

- Estilo de código: SCSS con mixins y funciones avanzadas
- Incluir comentarios detallados: Sí

La sección debe tener una estética Alquímico y transformativo con animaciones Transformaciones fluidas entre estados y elementos. Utilizar tipografía Caligráfica antigua con detalles ornamentados y bordes Ornamentos alquímicos con patrones geométricos sagrados. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CARACTERÍSTICAS ESPECIALES:
1. Logo SVG que se transforma entre los cuatro elementos alquímicos (tierra, agua, aire, fuego)
2. Menú de navegación que utiliza símbolos alquímicos que se transforman en texto al hacer hover
3. Barra de progreso de navegación inspirada en el proceso de transmutación alquímica
4. Efecto de "destilación" visual cuando se carga una nueva sección
5. Círculo alquímico interactivo que sirve como selector de temas o secciones

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Utilizar CSS custom properties para facilitar cambios de tema y estados.
4. Implementar animaciones con requestAnimationFrame para mejor rendimiento.
5. Asegurar accesibilidad completa con ARIA roles y estados apropiados.`,
  },
  {
    id: "sacred-geometry",
    title: "Geometría Sagrada",
    description: "Header basado en patrones de geometría sagrada con proporciones áureas",
    category: "sacred",
    icon: <Hexagon className="h-4 w-4" />,
    prompt: `Crea una sección de header para un sitio web con las siguientes características:

- Estilo: Geometría sagrada y matemática divina
- Plataforma objetivo: all
- Esquema de color: Blanco puro, dorado, azul índigo profundo
- Incluir imágenes: Sí
- Estilo de imagen: Patrones geométricos sagrados como la Flor de la Vida y Metatrón
- Tipo de fuente: Geométrica minimalista con proporciones áureas
- Tipo de animación: Expansión y contracción siguiendo secuencias de Fibonacci
- Estilo de borde: Líneas precisas que forman patrones geométricos perfectos
- Incluir información de contacto: No

- Optimizaciones de rendimiento: SVG optimizados, animaciones GPU-accelerated
- Optimizaciones SEO: Estructura jerárquica clara, metadatos completos
- Compatibilidad con navegadores: Enfoque progressive enhancement
- Interactividad: Patrones que responden a scroll, Elementos que siguen proporciones áureas dinámicamente
- Transiciones: Transformaciones basadas en espirales áureas, Expansiones desde el centro siguiendo patrones sagrados
- Elementos esotéricos interactivos: Mandala interactivo central, Patrones que evolucionan según la navegación

- Estilo de código: CSS Grid con proporciones áureas matemáticamente precisas
- Incluir comentarios detallados: Sí

La sección debe tener una estética Geometría sagrada y matemática divina con animaciones Expansión y contracción siguiendo secuencias de Fibonacci. Utilizar tipografía Geométrica minimalista con proporciones áureas y bordes Líneas precisas que forman patrones geométricos perfectos. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CARACTERÍSTICAS ESPECIALES:
1. Logo SVG construido con proporciones áureas perfectas que se anima siguiendo la espiral de Fibonacci
2. Menú de navegación dispuesto en un patrón de Flor de la Vida que se expande al interactuar
3. Elementos de UI posicionados siguiendo estrictamente puntos de la proporción áurea
4. Animaciones de carga que siguen secuencias matemáticas (Fibonacci, Pi, Phi)
5. Patrones de fondo que evolucionan sutilmente basados en la posición de scroll

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Utilizar cálculos matemáticos precisos para todas las proporciones (basados en phi: 1.618...).
4. Implementar SVG para todos los elementos gráficos para máxima precisión y escalabilidad.
5. Asegurar que los patrones geométricos se mantengan precisos en todos los tamaños de pantalla.`,
  },
  {
    id: "hermetic-wisdom",
    title: "Sabiduría Hermética",
    description: "Header inspirado en los principios herméticos con simbolismo oculto",
    category: "occult",
    icon: <Eye className="h-4 w-4" />,
    prompt: `Crea una sección de header para un sitio web con las siguientes características:

- Estilo: Hermético y cabalístico
- Plataforma objetivo: all
- Esquema de color: Negro profundo, dorado antiguo, rojo carmesí, verde esmeralda
- Incluir imágenes: Sí
- Estilo de imagen: Símbolos herméticos y sellos que revelan significados ocultos
- Tipo de fuente: Antigua con influencias de manuscritos esotéricos
- Tipo de animación: Revelaciones graduales de símbolos ocultos
- Estilo de borde: Intrincados con símbolos herméticos entrelazados
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Carga progresiva, optimización de assets
- Optimizaciones SEO: Estructura jerárquica, datos estructurados
- Compatibilidad con navegadores: Detección de características con polyfills
- Interactividad: Símbolos que revelan significados ocultos, Menú que sigue principios herméticos
- Transiciones: Transformaciones basadas en los 7 principios herméticos, Revelaciones graduales de contenido oculto
- Elementos esotéricos interactivos: Tabla esmeralda interactiva, Árbol de la vida cabalístico navegable

- Estilo de código: JavaScript modular con patrones de diseño esotéricos
- Incluir comentarios detallados: Sí

La sección debe tener una estética Hermético y cabalístico con animaciones Revelaciones graduales de símbolos ocultos. Utilizar tipografía Antigua con influencias de manuscritos esotéricos y bordes Intrincados con símbolos herméticos entrelazados. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CARACTERÍSTICAS ESPECIALES:
1. Logo SVG que incorpora el principio "Como es arriba, es abajo" con animación de espejo
2. Navegación inspirada en los 7 principios herméticos, cada elemento revelando su significado
3. Efecto de "velo que se levanta" al interactuar con elementos clave
4. Sistema de navegación que sigue la estructura del Árbol de la Vida cabalístico
5. Microinteracciones que revelan capas de significado oculto en cada elemento

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Implementar animaciones sutiles que no distraigan del contenido esotérico.
4. Utilizar técnicas de codificación que reflejen los principios herméticos (modularidad, encapsulación).
5. Asegurar que los símbolos esotéricos mantengan sus proporciones correctas en todos los dispositivos.`,
  },
  {
    id: "astral-projection",
    title: "Proyección Astral",
    description: "Header con efecto de planos superpuestos y transiciones entre dimensiones",
    category: "mystical",
    icon: <Cloud className="h-4 w-4" />,
    prompt: `Crea una sección de header para un sitio web con las siguientes características:

- Estilo: Astral y etéreo
- Plataforma objetivo: all
- Esquema de color: Azul etéreo, violeta astral, destellos plateados, blanco luminoso
- Incluir imágenes: Sí
- Estilo de imagen: Nebulosas sutiles y formas etéreas que sugieren planos astrales
- Tipo de fuente: Etérea y ligera con trazos finos que parecen flotar
- Tipo de animación: Ondulaciones suaves como velos entre dimensiones
- Estilo de borde: Difuminados que sugieren los límites entre planos de existencia
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Animaciones optimizadas, carga estratégica
- Optimizaciones SEO: Estructura semántica clara, metadatos enriquecidos
- Compatibilidad con navegadores: Enfoque graceful degradation
- Interactividad: Elementos que se desplazan entre "planos", Navegación que simula viaje astral
- Transiciones: Desplazamientos entre capas dimensionales, Efectos de "salida del cuerpo" entre páginas
- Elementos esotéricos interactivos: Chakras interactivos como navegación, Cordón plateado que conecta secciones

- Estilo de código: CSS con efectos avanzados de filtros y mezclas
- Incluir comentarios detallados: Sí

La sección debe tener una estética Astral y etéreo con animaciones Ondulaciones suaves como velos entre dimensiones. Utilizar tipografía Etérea y ligera con trazos finos que parecen flotar y bordes Difuminados que sugieren los límites entre planos de existencia. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CARACTERÍSTICAS ESPECIALES:
1. Logo SVG que simula una forma astral que se separa de su contraparte física
2. Efecto de "capas dimensionales" con parallax avanzado entre elementos
3. Menú de navegación que simula los chakras principales, cada uno con su color correspondiente
4. Transiciones entre páginas que emulan una experiencia de proyección astral
5. Elementos que parecen existir en múltiples planos simultáneamente mediante efectos de superposición

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Utilizar CSS backdrop-filter y efectos de mezcla para crear sensación de planos superpuestos.
4. Implementar parallax sutil que responda tanto al scroll como al movimiento del cursor.
5. Asegurar que las animaciones sean suaves incluso en dispositivos de gama media.`,
  },
  {
    id: "elemental-harmony",
    title: "Armonía Elemental",
    description: "Header que integra los cuatro elementos con transiciones armoniosas entre ellos",
    category: "alchemical",
    icon: <Zap className="h-4 w-4" />,
    prompt: `Crea una sección de header para un sitio web con las siguientes características:

- Estilo: Elemental y natural
- Plataforma objetivo: all
- Esquema de color: Rojo fuego, azul agua, verde tierra, blanco aire
- Incluir imágenes: Sí
- Estilo de imagen: Representaciones sutiles de los cuatro elementos en armonía
- Tipo de fuente: Orgánica con variaciones según el elemento predominante
- Tipo de animación: Transiciones fluidas entre estados elementales
- Estilo de borde: Orgánicos que evocan las cualidades de cada elemento
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Recursos compartidos, código eficiente
- Optimizaciones SEO: Estructura lógica, alt text descriptivo
- Compatibilidad con navegadores: Feature detection con alternativas
- Interactividad: Elementos que responden según su naturaleza elemental, Menú que cambia entre estados elementales
- Transiciones: Transformaciones basadas en las propiedades de los elementos, Cambios de estado que reflejan transmutaciones elementales
- Elementos esotéricos interactivos: Pentáculo elemental interactivo, Círculo de invocación que cambia según el elemento

- Estilo de código: CSS con variables que reflejan estados elementales
- Incluir comentarios detallados: Sí

La sección debe tener una estética Elemental y natural con animaciones Transiciones fluidas entre estados elementales. Utilizar tipografía Orgánica con variaciones según el elemento predominante y bordes Orgánicos que evocan las cualidades de cada elemento. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CARACTERÍSTICAS ESPECIALES:
1. Logo SVG que incorpora los cuatro elementos y se transforma sutilmente entre ellos
2. Navegación principal que cambia su apariencia según el elemento seleccionado
3. Efectos de partículas específicos para cada elemento (llamas, gotas, hojas, brisa)
4. Sistema de color dinámico que se adapta al elemento predominante en cada sección
5. Animaciones de carga inspiradas en los movimientos naturales de cada elemento

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Utilizar CSS custom properties para facilitar las transiciones entre estados elementales.
4. Implementar efectos de partículas ligeros que no afecten el rendimiento.
5. Asegurar que las transiciones entre elementos sean suaves y naturales.`,
  },
  {
    id: "lunar-phases",
    title: "Fases Lunares",
    description: "Header que evoluciona según las fases de la luna con simbolismo lunar",
    category: "cosmic",
    icon: <Moon className="h-4 w-4" />,
    prompt: `Crea una sección de header para un sitio web con las siguientes características:

- Estilo: Lunar y cíclico
- Plataforma objetivo: all
- Esquema de color: Negro noche, plata lunar, azul medianoche, blanco brillante
- Incluir imágenes: Sí
- Estilo de imagen: Fases lunares detalladas con texturas realistas
- Tipo de fuente: Elegante y cambiante como las mareas
- Tipo de animación: Transiciones suaves que emulan los ciclos lunares
- Estilo de borde: Plateados con efectos de luz lunar y sombras
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Preloading estratégico, código eficiente
- Optimizaciones SEO: Estructura jerárquica, datos estructurados
- Compatibilidad con navegadores: Enfoque progressive enhancement
- Interactividad: Elementos que responden al ciclo lunar actual, Navegación que sigue las fases lunares
- Transiciones: Cambios graduales inspirados en las fases de la luna, Efectos de luz y sombra que emulan la iluminación lunar
- Elementos esotéricos interactivos: Calendario lunar interactivo, Símbolos selenitas que cambian con las fases

- Estilo de código: JavaScript que calcula y refleja las fases lunares reales
- Incluir comentarios detallados: Sí

La sección debe tener una estética Lunar y cíclico con animaciones Transiciones suaves que emulan los ciclos lunares. Utilizar tipografía Elegante y cambiante como las mareas y bordes Plateados con efectos de luz lunar y sombras. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CARACTERÍSTICAS ESPECIALES:
1. Logo SVG que cambia sutilmente según la fase lunar actual (usando API de fecha o predefinido)
2. Indicador de fase lunar actual con visualización precisa y nombre de la fase
3. Sistema de navegación que refleja el ciclo lunar completo, con la sección actual destacada
4. Efectos de iluminación que emulan la luz lunar según la fase actual
5. Transiciones entre páginas inspiradas en los eclipses lunares

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Opcionalmente, incluir JavaScript para calcular la fase lunar actual y adaptar la UI.
4. Implementar efectos de luz y sombra que emulen la iluminación lunar natural.
5. Asegurar que los elementos lunares sean astronómicamente precisos en su representación.`,
  },
  {
    id: "solar-alchemy",
    title: "Alquimia Solar",
    description: "Header inspirado en la simbología solar y el oro alquímico",
    category: "alchemical",
    icon: <Sun className="h-4 w-4" />,
    prompt: `Crea una sección de header para un sitio web con las siguientes características:

- Estilo: Solar y radiante
- Plataforma objetivo: all
- Esquema de color: Dorado solar, naranja amanecer, amarillo brillante, blanco resplandeciente
- Incluir imágenes: Sí
- Estilo de imagen: Símbolos solares y alquímicos relacionados con el oro y la luz
- Tipo de fuente: Radiante con trazos que evocan rayos solares
- Tipo de animación: Pulsaciones y destellos que emulan la energía solar
- Estilo de borde: Radiantes con efectos de luz dorada emanando
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Optimización de assets, código eficiente
- Optimizaciones SEO: Estructura semántica, metadatos completos
- Compatibilidad con navegadores: Feature detection con fallbacks
- Interactividad: Elementos que brillan con intensidad variable, Menú que emana energía solar
- Transiciones: Destellos y resplandores entre estados, Transformaciones que emulan la transmutación al oro
- Elementos esotéricos interactivos: Sol alquímico interactivo, Símbolos solares que responden a interacciones

- Estilo de código: CSS con gradientes y efectos de luz avanzados
- Incluir comentarios detallados: Sí

La sección debe tener una estética Solar y radiante con animaciones Pulsaciones y destellos que emulan la energía solar. Utilizar tipografía Radiante con trazos que evocan rayos solares y bordes Radiantes con efectos de luz dorada emanando. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CARACTERÍSTICAS ESPECIALES:
1. Logo SVG que emana luz solar con animación de pulsación dorada
2. Sistema de navegación inspirado en el disco solar con rayos que se extienden
3. Efectos de "transmutación dorada" al interactuar con elementos clave
4. Transiciones entre secciones que emulan el amanecer y atardecer
5. Microinteracciones que generan destellos y resplandores solares

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Utilizar CSS para crear efectos de luz y resplandor que emulen la radiación solar.
4. Implementar animaciones optimizadas que evoquen la energía constante del sol.
5. Asegurar que los efectos luminosos no comprometan la legibilidad del contenido.`,
  },
  {
    id: "akashic-records",
    title: "Registros Akáshicos",
    description: "Header inspirado en la biblioteca universal del conocimiento",
    category: "mystical",
    icon: <Feather className="h-4 w-4" />,
    prompt: `Crea una sección de header para un sitio web con las siguientes características:

- Estilo: Akáshico y etéreo
- Plataforma objetivo: all
- Esquema de color: Violeta profundo, azul índigo, dorado antiguo, blanco etéreo
- Incluir imágenes: Sí
- Estilo de imagen: Pergaminos antiguos y símbolos de conocimiento universal
- Tipo de fuente: Caligráfica con aspecto de escritura antigua
- Tipo de animación: Revelaciones graduales como páginas de un libro cósmico
- Estilo de borde: Ornamentados con símbolos de sabiduría universal
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Carga progresiva, optimización de recursos
- Optimizaciones SEO: Estructura jerárquica, metadatos enriquecidos
- Compatibilidad con navegadores: Enfoque graceful degradation
- Interactividad: Elementos que revelan conocimiento oculto, Navegación que simula búsqueda en los registros
- Transiciones: Efectos de "páginas que se pasan" entre secciones, Revelaciones graduales de información
- Elementos esotéricos interactivos: Libro akáshico interactivo, Símbolos de conocimiento que revelan información

- Estilo de código: JavaScript con patrones de diseño elegantes
- Incluir comentarios detallados: Sí

La sección debe tener una estética Akáshico y etéreo con animaciones Revelaciones graduales como páginas de un libro cósmico. Utilizar tipografía Caligráfica con aspecto de escritura antigua y bordes Ornamentados con símbolos de sabiduría universal. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CARACTERÍSTICAS ESPECIALES:
1. Logo SVG que simula un sello akáshico que se revela gradualmente
2. Navegación principal que emula un índice de conocimiento universal
3. Efecto de "velo que se levanta" al acceder a diferentes secciones
4. Animaciones de texto que simulan escritura antigua manifestándose
5. Sistema de búsqueda que emula la consulta a los registros akáshicos

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Implementar efectos de texto que simulen escritura antigua manifestándose.
4. Utilizar transiciones que evoquen el paso de páginas en un libro antiguo.
5. Asegurar que todos los efectos de revelación sean accesibles y no dependan solo de efectos visuales.`,
  },
  {
    id: "quantum-entanglement",
    title: "Entrelazamiento Cuántico",
    description: "Header con elementos que reaccionan simultáneamente a la interacción",
    category: "cosmic",
    icon: <Infinity className="h-4 w-4" />,
    prompt: `Crea una sección de header para un sitio web con las siguientes características:

- Estilo: Cuántico y multidimensional
- Plataforma objetivo: all
- Esquema de color: Azul cuántico, verde fosforescente, negro espacial, destellos de colores vibrantes
- Incluir imágenes: Sí
- Estilo de imagen: Visualizaciones de partículas y ondas cuánticas
- Tipo de fuente: Futurista con elementos que sugieren superposición cuántica
- Tipo de animación: Partículas entrelazadas que reaccionan simultáneamente
- Estilo de borde: Difusos que sugieren la incertidumbre cuántica
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Código eficiente, optimización de recursos
- Optimizaciones SEO: Estructura semántica, metadatos completos
- Compatibilidad con navegadores: Feature detection con alternativas
- Interactividad: Elementos entrelazados que reaccionan simultáneamente, Navegación que sugiere saltos cuánticos
- Transiciones: Efectos de superposición y colapso de onda, Teletransportaciones entre estados
- Elementos esotéricos interactivos: Visualizador de entrelazamiento cuántico, Símbolos que existen en superposición

- Estilo de código: JavaScript con algoritmos inspirados en computación cuántica
- Incluir comentarios detallados: Sí

La sección debe tener una estética Cuántico y multidimensional con animaciones Partículas entrelazadas que reaccionan simultáneamente. Utilizar tipografía Futurista con elementos que sugieren superposición cuántica y bordes Difusos que sugieren la incertidumbre cuántica. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CARACTERÍSTICAS ESPECIALES:
1. Logo SVG que existe en estado de superposición hasta que se interactúa con él
2. Elementos de navegación entrelazados que reaccionan simultáneamente cuando uno es activado
3. Efecto de "colapso de función de onda" cuando se selecciona una opción
4. Partículas que se mueven de forma aparentemente aleatoria pero siguiendo patrones cuánticos
5. Transiciones entre páginas que emulan teletransportación cuántica

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Implementar sistema de partículas ligero para efectos cuánticos visuales.
4. Utilizar CSS para crear efectos de superposición y entrelazamiento.
5. Asegurar que las animaciones complejas no afecten el rendimiento en dispositivos móviles.`,
  },
  {
    id: "crystal-resonance",
    title: "Resonancia Cristalina",
    description: "Header con efectos prismáticos y refractivos inspirados en cristales",
    category: "sacred",
    icon: <Gem className="h-4 w-4" />,
    prompt: `Crea una sección de header para un sitio web con las siguientes características:

- Estilo: Cristalino y refractivo
- Plataforma objetivo: all
- Esquema de color: Espectro completo con predominancia de violetas, azules claros y destellos arcoíris
- Incluir imágenes: Sí
- Estilo de imagen: Cristales facetados con efectos de luz y refracción
- Tipo de fuente: Clara y precisa con bordes ligeramente facetados
- Tipo de animación: Destellos y refracciones que responden a interacciones
- Estilo de borde: Facetados como cristales tallados con precisión
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Optimización de efectos visuales, carga eficiente
- Optimizaciones SEO: Estructura jerárquica, metadatos completos
- Compatibilidad con navegadores: Enfoque progressive enhancement
- Interactividad: Elementos que refractan la luz al interactuar, Navegación que resuena con frecuencias cristalinas
- Transiciones: Efectos prismáticos entre estados, Refracciones de luz que revelan nuevo contenido
- Elementos esotéricos interactivos: Rejilla de cristales interactiva, Geometría cristalina que responde a energías

- Estilo de código: CSS con efectos avanzados de refracción y prisma
- Incluir comentarios detallados: Sí

La sección debe tener una estética Cristalino y refractivo con animaciones Destellos y refracciones que responden a interacciones. Utilizar tipografía Clara y precisa con bordes ligeramente facetados y bordes Facetados como cristales tallados con precisión. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CARACTERÍSTICAS ESPECIALES:
1. Logo SVG que simula un cristal multifacetado con efectos de refracción de luz
2. Menú de navegación inspirado en una rejilla cristalina con cada elemento como una faceta
3. Efectos prismáticos que descomponen la luz en colores del espectro al interactuar
4. Transiciones entre secciones que emulan la luz atravesando diferentes densidades cristalinas
5. Microinteracciones que generan "resonancias" visuales como ondas en los elementos

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Utilizar CSS para crear efectos de refracción y prisma con gradientes y blend modes.
4. Implementar efectos de luz que simulen cómo los cristales interactúan con la iluminación.
5. Asegurar que los efectos visuales complejos tengan alternativas más simples para dispositivos de bajo rendimiento.`,
  },
  {
    id: "divine-proportion",
    title: "Proporción Divina",
    description: "Header basado estrictamente en la proporción áurea y secuencia de Fibonacci",
    category: "sacred",
    icon: <Layout className="h-4 w-4" />,
    prompt: `Crea una sección de header para un sitio web con las siguientes características:

- Estilo: Proporción áurea y armonía matemática
- Plataforma objetivo: all
- Esquema de color: Dorado, blanco marfil, negro profundo, toques de azul índigo
- Incluir imágenes: Sí
- Estilo de imagen: Espirales de Fibonacci y rectángulos áureos
- Tipo de fuente: Geométrica con proporciones basadas en phi (1.618...)
- Tipo de animación: Expansiones y contracciones siguiendo la secuencia de Fibonacci
- Estilo de borde: Precisos con proporciones áureas exactas
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Código matemáticamente optimizado
- Optimizaciones SEO: Estructura jerárquica, metadatos completos
- Compatibilidad con navegadores: Enfoque progressive enhancement
- Interactividad: Elementos que se expanden según la secuencia de Fibonacci, Navegación dispuesta en espiral áurea
- Transiciones: Transformaciones basadas en la proporción divina, Expansiones que siguen la secuencia de Fibonacci
- Elementos esotéricos interactivos: Espiral áurea interactiva, Rectángulos áureos que revelan contenido

- Estilo de código: CSS Grid con cálculos precisos basados en phi
- Incluir comentarios detallados: Sí

La sección debe tener una estética Proporción áurea y armonía matemática con animaciones Expansiones y contracciones siguiendo la secuencia de Fibonacci. Utilizar tipografía Geométrica con proporciones basadas en phi (1.618...) y bordes Precisos con proporciones áureas exactas. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CARACTERÍSTICAS ESPECIALES:
1. Logo SVG construido estrictamente siguiendo la proporción áurea en cada elemento
2. Layout completo basado en la rejilla de Fibonacci con cada elemento posicionado matemáticamente
3. Animaciones que siguen exactamente la secuencia de Fibonacci en tiempo y espacio
4. Sistema de navegación dispuesto en espiral áurea o rectángulos áureos anidados
5. Microinteracciones que revelan la estructura matemática subyacente del diseño

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Utilizar cálculos matemáticos precisos basados en phi (1.618...) para todas las proporciones.
4. Implementar CSS Grid con fracciones basadas en la secuencia de Fibonacci.
5. Asegurar que las proporciones áureas se mantengan en todos los tamaños de pantalla mediante cálculos relativos.`,
  },
  {
    id: "occult-grimoire",
    title: "Grimorio Oculto",
    description: "Header inspirado en antiguos libros de magia con símbolos arcanos",
    category: "occult",
    icon: <Wand2 className="h-4 w-4" />,
    prompt: `Crea una sección de header para un sitio web con las siguientes características:

- Estilo: Grimorio antiguo y arcano
- Plataforma objetivo: all
- Esquema de color: Pergamino envejecido, tinta negra antigua, rojo sangre, dorado envejecido
- Incluir imágenes: Sí
- Estilo de imagen: Símbolos arcanos, sellos mágicos y sigilos de protección
- Tipo de fuente: Manuscrita antigua con ligaduras y florituras
- Tipo de animación: Revelaciones graduales como tinta que aparece en pergamino
- Estilo de borde: Ornamentados con símbolos de protección y poder
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Carga progresiva, optimización de recursos
- Optimizaciones SEO: Estructura jerárquica, metadatos enriquecidos
- Compatibilidad con navegadores: Enfoque graceful degradation
- Interactividad: Símbolos que revelan su significado, Navegación que simula páginas de un grimorio
- Transiciones: Efectos de "páginas que se pasan" entre secciones, Tinta que se materializa para revelar contenido
- Elementos esotéricos interactivos: Círculo de invocación interactivo, Sigilos que activan funciones

- Estilo de código: JavaScript que emula rituales mágicos en su estructura
- Incluir comentarios detallados: Sí

La sección debe tener una estética Grimorio antiguo y arcano con animaciones Revelaciones graduales como tinta que aparece en pergamino. Utilizar tipografía Manuscrita antigua con ligaduras y florituras y bordes Ornamentados con símbolos de protección y poder. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CARACTERÍSTICAS ESPECIALES:
1. Logo SVG que simula un sello mágico que se dibuja gradualmente como con tinta
2. Navegación principal que emula el índice de un grimorio antiguo con marcadores de pergamino
3. Efecto de "tinta que se expande" en textos y elementos al cargar o interactuar
4. Transiciones entre páginas que emulan el paso de hojas de un libro antiguo
5. Elementos interactivos que revelan "conocimiento oculto" al activarse

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Implementar efectos de texto que simulen tinta antigua manifestándose en pergamino.
4. Utilizar texturas sutiles que evoquen pergamino envejecido sin comprometer la legibilidad.
5. Asegurar que los símbolos arcanos mantengan su integridad visual en todos los tamaños de pantalla.`,
  },
  {
    id: "chromatic-alchemy",
    title: "Alquimia Cromática",
    description: "Header con transmutaciones de color y efectos de mezcla alquímica",
    category: "alchemical",
    icon: <Palette className="h-4 w-4" />,
    prompt: `Crea una sección de header para un sitio web con las siguientes características:

- Estilo: Alquimia cromática y transmutación de colores
- Plataforma objetivo: all
- Esquema de color: Toda la rueda cromática con énfasis en transmutaciones entre colores primarios y secundarios
- Incluir imágenes: Sí
- Estilo de imagen: Frascos alquímicos con líquidos de colores vibrantes que se mezclan
- Tipo de fuente: Fluida que parece cambiar sutilmente de color
- Tipo de animación: Transiciones fluidas entre colores como mezclas alquímicas
- Estilo de borde: Líquidos que fluyen y se transforman entre estados cromáticos
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Animaciones optimizadas, carga eficiente
- Optimizaciones SEO: Estructura semántica, metadatos completos
- Compatibilidad con navegadores: Feature detection con alternativas
- Interactividad: Elementos que cambian de color al interactuar, Navegación que transmuta entre estados cromáticos
- Transiciones: Mezclas de colores entre estados, Transformaciones cromáticas que revelan nuevo contenido
- Elementos esotéricos interactivos: Círculo cromático alquímico, Frascos interactivos que mezclan colores

- Estilo de código: CSS con variables de color y transiciones avanzadas
- Incluir comentarios detallados: Sí

La sección debe tener una estética Alquimia cromática y transmutación de colores con animaciones Transiciones fluidas entre colores como mezclas alquímicas. Utilizar tipografía Fluida que parece cambiar sutilmente de color y bordes Líquidos que fluyen y se transforman entre estados cromáticos. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CARACTERÍSTICAS ESPECIALES:
1. Logo SVG que transmuta entre colores primarios y secundarios como en un proceso alquímico
2. Sistema de navegación que utiliza un círculo cromático alquímico como base
3. Efectos de "mezcla de colores" cuando elementos interactúan entre sí
4. Transiciones entre secciones que emulan la transmutación alquímica de sustancias
5. Microinteracciones que generan "reacciones cromáticas" visibles

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Utilizar CSS custom properties y transiciones para crear efectos de mezcla de colores.
4. Implementar gradientes y blend modes para simular reacciones alquímicas cromáticas.
5. Asegurar suficiente contraste en todos los estados de color para mantener la accesibilidad.`,
  },
]

export function PromptPresets({ onSelectPreset }: { onSelectPreset: (prompt: string) => void }) {
  const [activeCategory, setActiveCategory] = useState<string>("all")

  // Filtrar presets por categoría
  const filteredPresets =
    activeCategory === "all" ? headerPresets : headerPresets.filter((preset) => preset.category === activeCategory)

  return (
    <Card className="border border-purple-500/20 bg-black/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-400" />
          Presets de Prompts para Headers Esotéricos
        </CardTitle>
        <CardDescription>
          Selecciona uno de estos presets predefinidos para generar un prompt completo para headers esotéricos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all" onClick={() => setActiveCategory("all")}>
              Todos
            </TabsTrigger>
            <TabsTrigger value="mystical" onClick={() => setActiveCategory("mystical")}>
              Místicos
            </TabsTrigger>
            <TabsTrigger value="cosmic" onClick={() => setActiveCategory("cosmic")}>
              Cósmicos
            </TabsTrigger>
            <TabsTrigger value="alchemical" onClick={() => setActiveCategory("alchemical")}>
              Alquímicos
            </TabsTrigger>
            <TabsTrigger value="sacred" onClick={() => setActiveCategory("sacred")}>
              Sagrados
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
                    {preset.category === "cosmic" && "Cósmico"}
                    {preset.category === "alchemical" && "Alquímico"}
                    {preset.category === "sacred" && "Sagrado"}
                    {preset.category === "occult" && "Oculto"}
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

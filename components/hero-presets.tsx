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
  Zap,
  Feather,
  Eye,
  Cloud,
  Gem,
  Infinity,
  Hexagon,
} from "lucide-react"

// Definición de tipos para los presets
interface HeroPreset {
  id: string
  title: string
  description: string
  category: "futurista" | "místico" | "minimalista" | "inmersivo" | "experimental"
  icon: React.ReactNode
  prompt: string
}

// Lista de 15 presets para secciones Hero vanguardistas
const heroPresets: HeroPreset[] = [
  {
    id: "neon-portal",
    title: "Portal Neón",
    description: "Hero con efecto de portal dimensional y gradientes neón vibrantes",
    category: "futurista",
    icon: <Sparkles className="h-4 w-4" />,
    prompt: `Crea una sección Hero para un sitio web con las siguientes características:

- Estilo: Futurista con estética neón cyberpunk
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Negro profundo como base, con neones vibrantes en magenta, cian y violeta
- Incluir imágenes: Sí
- Estilo de imagen: Formas geométricas fragmentadas con efecto de glitch y distorsión digital
- Tipo de fuente: Sans-serif futurista con efectos de neón y distorsión sutil
- Tipo de animación: Pulsaciones de luz neón, glitches controlados, ondas de energía
- Estilo de borde: Bordes luminosos con efecto de resplandor neón que cambia de color
- Incluir CTA: Sí, botón principal con efecto de pulsación neón

- Optimizaciones de rendimiento: 
  * Animaciones basadas en CSS con propiedades optimizadas (transform, opacity)
  * Lazy loading para imágenes
  * Uso de will-change solo donde sea necesario
  * Compresión de CSS y minificación de JS
  * Uso de SVG para elementos gráficos cuando sea posible

- Optimizaciones SEO: Estructura semántica, metadatos optimizados
- Compatibilidad con navegadores: Chrome, Firefox, Safari, Edge
- Interactividad: 
  * Elementos que reaccionan al hover con efectos de energía neón
  * Parallax sutil controlado por giroscopio en móviles
  * Efectos de distorsión al hacer scroll

- Transiciones: Desvanecimiento con ondas de energía neón, transiciones con efecto de glitch controlado
- Elementos interactivos: Partículas de luz que siguen el cursor o el toque en móviles

- Estilo de código: Tailwind CSS con clases personalizadas para efectos especiales
- Incluir comentarios detallados: Sí

La sección debe tener una estética Futurista con estética neón cyberpunk con animaciones Pulsaciones de luz neón, glitches controlados, ondas de energía. Utilizar tipografía Sans-serif futurista con efectos de neón y distorsión sutil y bordes Bordes luminosos con efecto de resplandor neón que cambia de color. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Título principal con efecto de "energía neón" que pulsa y cambia sutilmente de color
2. Subtítulo con efecto de glitch controlado que revela palabras clave
3. Fondo con gradiente animado que simula un portal dimensional
4. CTA principal con efecto de "energía contenida" que se libera al hacer hover
5. Partículas de luz neón que flotan y responden sutilmente al movimiento

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección Hero (divs, sections, articles, etc.).
3. Implementar con enfoque mobile-first, asegurando que la experiencia sea óptima en dispositivos móviles primero.
4. Utilizar CSS Grid y Flexbox para layouts complejos y responsivos.
5. Implementar animaciones optimizadas que no afecten el rendimiento en dispositivos de gama baja.
6. Utilizar prefers-reduced-motion para usuarios que prefieren menos animaciones.
7. Asegurar que todos los textos sean legibles incluso con los efectos aplicados.`,
  },
  {
    id: "cosmic-gradient",
    title: "Gradiente Cósmico",
    description: "Hero con gradientes fluidos inspirados en nebulosas y fenómenos cósmicos",
    category: "inmersivo",
    icon: <Infinity className="h-4 w-4" />,
    prompt: `Crea una sección Hero para un sitio web con las siguientes características:

- Estilo: Cósmico con gradientes fluidos inspirados en nebulosas
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Azul profundo, púrpura cósmico, rosa nebulosa, destellos dorados como estrellas
- Incluir imágenes: Sí
- Estilo de imagen: Formas abstractas fluidas que emulan nebulosas y fenómenos cósmicos
- Tipo de fuente: Serif elegante para títulos con espaciado amplio, sans-serif limpia para texto
- Tipo de animación: Gradientes fluidos que se mueven lentamente, partículas estelares flotantes
- Estilo de borde: Difuminados que se funden con el fondo como límites de nebulosas
- Incluir CTA: Sí, botón principal con efecto de "polvo estelar" al hover

- Optimizaciones de rendimiento: 
  * Animaciones CSS con propiedades que no causan reflow (transform, opacity)
  * Imágenes WebP con fallbacks
  * Lazy loading para recursos pesados
  * CSS crítico inline, resto diferido
  * Uso de will-change estratégicamente

- Optimizaciones SEO: Estructura de encabezados lógica, alt text descriptivo
- Compatibilidad con navegadores: Todos los navegadores modernos con fallbacks
- Interactividad: 
  * Parallax sutil en elementos cósmicos
  * Partículas que responden sutilmente al movimiento
  * Efectos de "polvo estelar" al interactuar con elementos

- Transiciones: Desvanecimientos suaves entre estados, transformaciones fluidas
- Elementos interactivos: Estrellas que brillan al pasar el cursor, constelaciones que se conectan

- Estilo de código: CSS moderno con variables personalizadas
- Incluir comentarios detallados: Sí

La sección debe tener una estética Cósmico con gradientes fluidos inspirados en nebulosas con animaciones Gradientes fluidos que se mueven lentamente, partículas estelares flotantes. Utilizar tipografía Serif elegante para títulos con espaciado amplio, sans-serif limpia para texto y bordes Difuminados que se funden con el fondo como límites de nebulosas. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Fondo con gradiente animado que emula el movimiento de una nebulosa cósmica
2. Título principal con efecto de "polvo estelar" que se materializa gradualmente
3. Partículas estelares que flotan y brillan a diferentes intensidades
4. CTA principal con efecto de "expansión cósmica" al hacer hover
5. Elementos de UI que parecen flotar en diferentes planos con sutil parallax

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección Hero (divs, sections, articles, etc.).
3. Utilizar CSS para crear gradientes animados fluidos sin causar problemas de rendimiento.
4. Implementar sistema de partículas ligero que funcione bien en dispositivos móviles.
5. Asegurar que los textos mantengan alto contraste con los fondos para garantizar legibilidad.
6. Implementar fallbacks para navegadores que no soporten todas las características.
7. Optimizar todas las animaciones para dispositivos de gama baja.`,
  },
  {
    id: "mystic-minimalism",
    title: "Minimalismo Místico",
    description: "Hero con diseño minimalista pero con elementos místicos sutiles y poderosos",
    category: "minimalista",
    icon: <Moon className="h-4 w-4" />,
    prompt: `Crea una sección Hero para un sitio web con las siguientes características:

- Estilo: Minimalismo místico con elegancia sutil
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Negro profundo, blanco puro, dorado antiguo como acento, toques de violeta profundo
- Incluir imágenes: Sí, pero minimalistas
- Estilo de imagen: Símbolos místicos minimalistas con líneas finas y precisas
- Tipo de fuente: Serif ultra-fina y elegante para títulos, sans-serif minimalista para texto
- Tipo de animación: Apariciones sutiles, movimientos minimalistas, transiciones elegantes
- Estilo de borde: Líneas finas y precisas, ocasionalmente con detalles dorados
- Incluir CTA: Sí, botón minimalista con transición elegante al hover

- Optimizaciones de rendimiento: 
  * Animaciones mínimas y altamente optimizadas
  * SVG para todos los gráficos
  * CSS mínimo y específico
  * JavaScript limitado a lo esencial
  * Carga diferida para recursos no críticos

- Optimizaciones SEO: Estructura semántica limpia, metadatos precisos
- Compatibilidad con navegadores: Enfoque progressive enhancement
- Interactividad: 
  * Hover states elegantes y sutiles
  * Revelaciones graduales de elementos místicos
  * Microinteracciones refinadas

- Transiciones: Apariciones y desapariciones elegantes, movimientos precisos y controlados
- Elementos interactivos: Símbolos místicos que revelan significado al interactuar

- Estilo de código: CSS minimalista con clases específicas
- Incluir comentarios detallados: Sí

La sección debe tener una estética Minimalismo místico con elegancia sutil con animaciones Apariciones sutiles, movimientos minimalistas, transiciones elegantes. Utilizar tipografía Serif ultra-fina y elegante para títulos, sans-serif minimalista para texto y bordes Líneas finas y precisas, ocasionalmente con detalles dorados. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Título principal con aparición gradual y espaciado meticulosamente calculado
2. Símbolo místico central minimalista que rota o se transforma sutilmente
3. Uso estratégico del espacio negativo para crear tensión visual
4. CTA con borde que se dibuja al hacer hover
5. Elementos que aparecen secuencialmente con timing preciso

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección Hero (divs, sections, articles, etc.).
3. Utilizar CSS Grid para layouts precisos con proporciones calculadas.
4. Implementar animaciones sutiles que no distraigan de la elegancia minimalista.
5. Asegurar alto contraste para accesibilidad a pesar del minimalismo.
6. Optimizar para velocidad con CSS y JS mínimos.
7. Mantener coherencia visual absoluta en todos los tamaños de pantalla.`,
  },
  {
    id: "liquid-morphism",
    title: "Morfismo Líquido",
    description: "Hero con formas fluidas que se transforman y evolucionan orgánicamente",
    category: "experimental",
    icon: <Layers className="h-4 w-4" />,
    prompt: `Crea una sección Hero para un sitio web con las siguientes características:

- Estilo: Morfismo líquido con transformaciones orgánicas
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Azul profundo, turquesa vibrante, púrpura eléctrico, negro como base
- Incluir imágenes: Sí
- Estilo de imagen: Formas orgánicas fluidas que se transforman y evolucionan
- Tipo de fuente: Sans-serif moderna con variaciones de peso que sugieren fluidez
- Tipo de animación: Transformaciones morfológicas fluidas, ondulaciones orgánicas
- Estilo de borde: Bordes fluidos que parecen líquidos en movimiento
- Incluir CTA: Sí, botón con efecto de "inmersión líquida" al hover

- Optimizaciones de rendimiento: 
  * Uso de CSS para animaciones en lugar de JavaScript cuando sea posible
  * SVG optimizados para formas fluidas
  * Preloading estratégico de recursos críticos
  * Animaciones basadas en propiedades eficientes (transform, opacity)
  * Compresión de recursos

- Optimizaciones SEO: Estructura semántica, metadatos completos
- Compatibilidad con navegadores: Feature detection con fallbacks elegantes
- Interactividad: 
  * Elementos que responden al cursor como si fueran líquidos
  * Transformaciones fluidas al interactuar
  * Efectos de "ondas" al hacer click

- Transiciones: Transformaciones morfológicas entre estados, ondulaciones orgánicas
- Elementos interactivos: Formas líquidas que responden al movimiento y al toque

- Estilo de código: CSS avanzado con animaciones y transiciones personalizadas
- Incluir comentarios detallados: Sí

La sección debe tener una estética Morfismo líquido con transformaciones orgánicas con animaciones Transformaciones morfológicas fluidas, ondulaciones orgánicas. Utilizar tipografía Sans-serif moderna con variaciones de peso que sugieren fluidez y bordes Bordes fluidos que parecen líquidos en movimiento. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Fondo con formas líquidas que se mueven y transforman orgánicamente
2. Título principal que emerge de una "transformación líquida"
3. Elementos de UI que parecen flotar en un medio líquido
4. CTA que crea un efecto de "ondas" al interactuar
5. Transiciones entre elementos que emulan comportamiento de fluidos

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección Hero (divs, sections, articles, etc.).
3. Utilizar SVG y CSS para crear formas fluidas y animaciones orgánicas.
4. Implementar optimizaciones para que las animaciones fluidas funcionen bien en dispositivos móviles.
5. Asegurar que el texto se mantenga legible a pesar de los elementos fluidos en movimiento.
6. Proporcionar alternativas más simples para dispositivos de bajo rendimiento.
7. Utilizar prefers-reduced-motion para respetar preferencias de usuario.`,
  },
  {
    id: "sacred-geometry",
    title: "Geometría Sagrada",
    description: "Hero basado en patrones de geometría sagrada con proporciones áureas",
    category: "místico",
    icon: <Hexagon className="h-4 w-4" />,
    prompt: `Crea una sección Hero para un sitio web con las siguientes características:

- Estilo: Geometría sagrada con proporciones áureas
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Negro profundo, dorado brillante, blanco puro, toques de azul índigo
- Incluir imágenes: Sí
- Estilo de imagen: Patrones geométricos sagrados precisos (Flor de la Vida, Metatrón, etc.)
- Tipo de fuente: Geométrica precisa para títulos, sans-serif limpia para texto
- Tipo de animación: Expansiones y contracciones siguiendo secuencias matemáticas precisas
- Estilo de borde: Líneas geométricas precisas que forman patrones sagrados
- Incluir CTA: Sí, botón con transformación geométrica al hover

- Optimizaciones de rendimiento: 
  * SVG optimizados para todos los patrones geométricos
  * Animaciones CSS eficientes
  * Preloading de recursos críticos
  * Código modular y reutilizable
  * Optimización de assets

- Optimizaciones SEO: Estructura jerárquica clara, metadatos completos
- Compatibilidad con navegadores: Enfoque progressive enhancement
- Interactividad: 
  * Patrones que responden al scroll
  * Elementos que siguen proporciones áureas dinámicamente
  * Microinteracciones basadas en secuencias matemáticas

- Transiciones: Transformaciones basadas en espirales áureas, expansiones desde el centro
- Elementos interactivos: Mandala interactivo, patrones que evolucionan según interacción

- Estilo de código: CSS Grid con proporciones áureas matemáticamente precisas
- Incluir comentarios detallados: Sí

La sección debe tener una estética Geometría sagrada con proporciones áureas con animaciones Expansiones y contracciones siguiendo secuencias matemáticas precisas. Utilizar tipografía Geométrica precisa para títulos, sans-serif limpia para texto y bordes Líneas geométricas precisas que forman patrones sagrados. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Patrón central de la Flor de la Vida que se expande siguiendo la secuencia de Fibonacci
2. Título principal posicionado exactamente según proporciones áureas
3. Elementos de UI dispuestos siguiendo una rejilla basada en geometría sagrada
4. CTA que se transforma siguiendo un patrón geométrico al hacer hover
5. Animación inicial que construye el patrón geométrico principal elemento por elemento

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección Hero (divs, sections, articles, etc.).
3. Utilizar cálculos matemáticos precisos para todas las proporciones (basados en phi: 1.618...).
4. Implementar SVG para todos los patrones geométricos para máxima precisión.
5. Asegurar que los patrones geométricos se mantengan precisos en todos los tamaños de pantalla.
6. Optimizar las animaciones para que funcionen bien en dispositivos móviles.
7. Mantener la accesibilidad a pesar de la complejidad visual.`,
  },
  {
    id: "digital-glitch",
    title: "Glitch Digital",
    description: "Hero con efectos de glitch y distorsión digital controlada",
    category: "experimental",
    icon: <Zap className="h-4 w-4" />,
    prompt: `Crea una sección Hero para un sitio web con las siguientes características:

- Estilo: Glitch digital con distorsiones controladas
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Negro, rojo neón, azul digital, verde matriz, distorsiones cromáticas
- Incluir imágenes: Sí
- Estilo de imagen: Fotografías o gráficos con efectos de glitch y distorsión digital
- Tipo de fuente: Monoespaciada tecnológica con efectos de glitch
- Tipo de animación: Glitches controlados, distorsiones momentáneas, fragmentaciones
- Estilo de borde: Bordes que ocasionalmente se distorsionan o desplazan
- Incluir CTA: Sí, botón con efecto de glitch al hover

- Optimizaciones de rendimiento: 
  * Efectos de glitch basados en CSS cuando sea posible
  * JavaScript optimizado para efectos más complejos
  * Preloading de recursos críticos
  * Limitación de efectos en dispositivos de bajo rendimiento
  * Compresión de recursos

- Optimizaciones SEO: Estructura semántica, metadatos completos
- Compatibilidad con navegadores: Feature detection con alternativas
- Interactividad: 
  * Elementos que se distorsionan al interactuar
  * Efectos de glitch que revelan contenido oculto
  * Microinteracciones con distorsiones digitales

- Transiciones: Glitches entre estados, fragmentaciones y recomposiciones
- Elementos interactivos: Textos que se distorsionan, imágenes que se fragmentan

- Estilo de código: CSS con animaciones y filtros avanzados, JS para efectos complejos
- Incluir comentarios detallados: Sí

La sección debe tener una estética Glitch digital con distorsiones controladas con animaciones Glitches controlados, distorsiones momentáneas, fragmentaciones. Utilizar tipografía Monoespaciada tecnológica con efectos de glitch y bordes Bordes que ocasionalmente se distorsionan o desplazan. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Título principal con efecto de glitch que revela palabras clave
2. Elementos visuales que ocasionalmente se fragmentan y recomponen
3. Efectos de "corrupción de datos" que revelan mensajes o imágenes ocultas
4. CTA con distorsión digital al hover que se estabiliza al hacer click
5. Fondo con ruido digital y distorsiones cromáticas sutiles

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección Hero (divs, sections, articles, etc.).
3. Implementar efectos de glitch principalmente con CSS para mejor rendimiento.
4. Utilizar JavaScript estratégicamente solo para efectos que no se pueden lograr con CSS.
5. Asegurar que el texto siga siendo legible incluso durante los efectos de glitch.
6. Proporcionar alternativas más simples para dispositivos de bajo rendimiento.
7. Limitar la frecuencia e intensidad de los glitches para no afectar la usabilidad.`,
  },
  {
    id: "astral-projection",
    title: "Proyección Astral",
    description: "Hero con efecto de planos superpuestos y transiciones entre dimensiones",
    category: "místico",
    icon: <Cloud className="h-4 w-4" />,
    prompt: `Crea una sección Hero para un sitio web con las siguientes características:

- Estilo: Proyección astral con planos dimensionales superpuestos
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Azul etéreo, violeta astral, rosa nebulosa, blanco luminoso
- Incluir imágenes: Sí
- Estilo de imagen: Formas etéreas y nebulosas que sugieren planos astrales
- Tipo de fuente: Etérea y ligera con trazos finos que parecen flotar
- Tipo de animación: Ondulaciones suaves como velos entre dimensiones, desplazamientos entre planos
- Estilo de borde: Difuminados que sugieren los límites entre planos de existencia
- Incluir CTA: Sí, botón con efecto de "transición dimensional" al hover

- Optimizaciones de rendimiento: 
  * Uso de CSS backdrop-filter para efectos de superposición
  * Animaciones basadas en propiedades eficientes
  * Lazy loading para recursos pesados
  * Optimización de filtros y efectos visuales
  * Compresión de recursos

- Optimizaciones SEO: Estructura semántica clara, metadatos enriquecidos
- Compatibilidad con navegadores: Enfoque graceful degradation
- Interactividad: 
  * Elementos que se desplazan entre "planos"
  * Parallax avanzado que simula profundidad dimensional
  * Efectos de "velo" que revelan contenido

- Transiciones: Desplazamientos entre capas dimensionales, efectos de "salida del cuerpo"
- Elementos interactivos: Elementos que existen en múltiples planos simultáneamente

- Estilo de código: CSS con efectos avanzados de filtros y mezclas
- Incluir comentarios detallados: Sí

La sección debe tener una estética Proyección astral con planos dimensionales superpuestos con animaciones Ondulaciones suaves como velos entre dimensiones, desplazamientos entre planos. Utilizar tipografía Etérea y ligera con trazos finos que parecen flotar y bordes Difuminados que sugieren los límites entre planos de existencia. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Efecto de "capas dimensionales" con parallax avanzado entre elementos
2. Título principal que parece existir en múltiples planos simultáneamente
3. Elementos visuales que se desplazan a diferentes velocidades creando sensación de profundidad
4. CTA que parece "atravesar" un velo dimensional al hacer hover
5. Transiciones entre elementos que emulan el movimiento entre planos astrales

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección Hero (divs, sections, articles, etc.).
3. Utilizar CSS backdrop-filter y efectos de mezcla para crear sensación de planos superpuestos.
4. Implementar parallax optimizado que funcione bien en dispositivos móviles.
5. Asegurar que los textos mantengan legibilidad a pesar de los efectos de superposición.
6. Proporcionar alternativas más simples para navegadores que no soporten efectos avanzados.
7. Optimizar todas las animaciones para dispositivos de gama baja.`,
  },
  {
    id: "dark-elegance",
    title: "Elegancia Oscura",
    description: "Hero con diseño elegante y sofisticado sobre fondo oscuro con detalles dorados",
    category: "minimalista",
    icon: <Feather className="h-4 w-4" />,
    prompt: `Crea una sección Hero para un sitio web con las siguientes características:

- Estilo: Elegancia oscura con sofisticación minimalista
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Negro profundo, dorado antiguo, toques de borgoña oscuro, blanco para contraste
- Incluir imágenes: Sí, pero minimalistas y elegantes
- Estilo de imagen: Fotografías de alto contraste o ilustraciones lineales elegantes
- Tipo de fuente: Serif clásica y refinada para títulos, sans-serif elegante para texto
- Tipo de animación: Apariciones sutiles, movimientos elegantes y controlados
- Estilo de borde: Líneas finas doradas, ocasionalmente con detalles ornamentados
- Incluir CTA: Sí, botón elegante con transición refinada al hover

- Optimizaciones de rendimiento: 
  * Animaciones mínimas y altamente optimizadas
  * Recursos visuales optimizados
  * CSS mínimo y específico
  * Carga diferida para recursos no críticos
  * Compresión de assets

- Optimizaciones SEO: Estructura semántica limpia, metadatos precisos
- Compatibilidad con navegadores: Enfoque progressive enhancement
- Interactividad: 
  * Hover states refinados con transiciones suaves
  * Revelaciones elegantes de elementos ocultos
  * Microinteracciones sutiles que añaden sofisticación

- Transiciones: Apariciones y desapariciones elegantes, movimientos precisos y controlados
- Elementos interactivos: Detalles dorados que brillan sutilmente al interactuar

- Estilo de código: CSS minimalista con clases específicas
- Incluir comentarios detallados: Sí

La sección debe tener una estética Elegancia oscura con sofisticación minimalista con animaciones Apariciones sutiles, movimientos elegantes y controlados. Utilizar tipografía Serif clásica y refinada para títulos, sans-serif elegante para texto y bordes Líneas finas doradas, ocasionalmente con detalles ornamentados. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Título principal con aparición elegante y tipografía refinada con espaciado preciso
2. Elementos dorados que brillan sutilmente con movimiento controlado
3. Uso estratégico del espacio negativo para crear elegancia visual
4. CTA con borde dorado que se ilumina sutilmente al hover
5. Transiciones refinadas entre elementos que sugieren exclusividad

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección Hero (divs, sections, articles, etc.).
3. Utilizar CSS Grid y Flexbox para layouts precisos y elegantes.
4. Implementar animaciones sutiles que añadan sofisticación sin distraer.
5. Asegurar alto contraste para accesibilidad a pesar del fondo oscuro.
6. Optimizar para velocidad con CSS y JS mínimos.
7. Mantener coherencia visual absoluta en todos los tamaños de pantalla.`,
  },
  {
    id: "holographic-future",
    title: "Futuro Holográfico",
    description: "Hero con efectos holográficos iridiscentes y elementos futuristas",
    category: "futurista",
    icon: <Eye className="h-4 w-4" />,
    prompt: `Crea una sección Hero para un sitio web con las siguientes características:

- Estilo: Holográfico futurista con efectos iridiscentes
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Base oscura con efectos holográficos iridiscentes (azul, violeta, rosa, turquesa)
- Incluir imágenes: Sí
- Estilo de imagen: Elementos 3D o formas geométricas con efectos holográficos
- Tipo de fuente: Futurista con efectos de distorsión holográfica sutil
- Tipo de animación: Efectos holográficos que cambian con el ángulo/scroll, brillos iridiscentes
- Estilo de borde: Bordes con efecto holográfico que cambia de color según el ángulo
- Incluir CTA: Sí, botón con efecto holográfico al hover

- Optimizaciones de rendimiento: 
  * Uso de CSS para efectos holográficos en lugar de imágenes pesadas
  * Animaciones optimizadas con propiedades eficientes
  * Preloading de recursos críticos
  * Limitación de efectos en dispositivos de bajo rendimiento
  * Compresión de recursos

- Optimizaciones SEO: Estructura semántica, metadatos completos
- Compatibilidad con navegadores: Feature detection con alternativas
- Interactividad: 
  * Elementos que responden al movimiento del dispositivo (giroscopio)
  * Efectos holográficos que cambian según el ángulo de visión
  * Microinteracciones con brillos iridiscentes

- Transiciones: Cambios de color holográficos entre estados, brillos que se desplazan
- Elementos interactivos: Elementos UI con efectos holográficos que responden a interacciones

- Estilo de código: CSS con variables y filtros avanzados
- Incluir comentarios detallados: Sí

La sección debe tener una estética Holográfico futurista con efectos iridiscentes con animaciones Efectos holográficos que cambian con el ángulo/scroll, brillos iridiscentes. Utilizar tipografía Futurista con efectos de distorsión holográfica sutil y bordes Bordes con efecto holográfico que cambia de color según el ángulo. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Título principal con efecto holográfico que cambia de color al hacer scroll
2. Elementos UI con bordes iridiscentes que brillan y cambian de color
3. Efecto de "lente holográfica" que distorsiona sutilmente elementos al pasar el cursor
4. CTA con efecto holográfico completo que cambia según el ángulo de visión
5. Fondo con gradiente holográfico que se mueve sutilmente con el giroscopio en móviles

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección Hero (divs, sections, articles, etc.).
3. Utilizar CSS para crear efectos holográficos e iridiscentes sin imágenes pesadas.
4. Implementar detección de capacidades para ofrecer alternativas en navegadores antiguos.
5. Asegurar que el texto siga siendo legible a pesar de los efectos holográficos.
6. Optimizar efectos basados en giroscopio para dispositivos móviles.
7. Proporcionar alternativas para dispositivos sin giroscopio o de bajo rendimiento.`,
  },
  {
    id: "crystal-morphism",
    title: "Cristal Morfismo",
    description: "Hero con efectos de cristal translúcido y refracción de luz",
    category: "inmersivo",
    icon: <Gem className="h-4 w-4" />,
    prompt: `Crea una sección Hero para un sitio web con las siguientes características:

- Estilo: Cristal morfismo con efectos de translucidez y refracción
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Base de colores vibrantes (azul profundo, púrpura, rosa) con efectos de cristal translúcido
- Incluir imágenes: Sí
- Estilo de imagen: Formas geométricas cristalinas con efectos de refracción y transparencia
- Tipo de fuente: Sans-serif moderna y limpia que contraste con los efectos cristalinos
- Tipo de animación: Brillos y refracciones de luz, movimientos suaves como a través de un medio cristalino
- Estilo de borde: Bordes con efecto de cristal pulido con reflejos y refracciones
- Incluir CTA: Sí, botón con efecto de cristal tridimensional al hover

- Optimizaciones de rendimiento: 
  * Uso de CSS backdrop-filter para efectos de cristal
  * Animaciones optimizadas con propiedades eficientes
  * Preloading de recursos críticos
  * Optimización de efectos visuales para diferentes dispositivos
  * Compresión de recursos

- Optimizaciones SEO: Estructura semántica, metadatos completos
- Compatibilidad con navegadores: Feature detection con alternativas
- Interactividad: 
  * Elementos cristalinos que refractan la luz al interactuar
  * Efectos de profundidad que responden al movimiento
  * Microinteracciones con brillos y destellos

- Transiciones: Efectos de refracción entre estados, brillos que se desplazan como luz a través de cristal
- Elementos interactivos: UI con efectos de cristal que responden a interacciones

- Estilo de código: CSS con backdrop-filter y efectos avanzados
- Incluir comentarios detallados: Sí

La sección debe tener una estética Cristal morfismo con efectos de translucidez y refracción con animaciones Brillos y refracciones de luz, movimientos suaves como a través de un medio cristalino. Utilizar tipografía Sans-serif moderna y limpia que contraste con los efectos cristalinos y bordes Bordes con efecto de cristal pulido con reflejos y refracciones. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Elementos UI con efecto de cristal translúcido que permite ver el fondo difuminado
2. Título principal con efecto de refracción de luz que cambia sutilmente
3. Capas superpuestas de elementos cristalinos con diferentes niveles de transparencia
4. CTA con efecto de cristal tridimensional que parece elevarse al hover
5. Efectos de luz que se refractan a través de los elementos cristalinos

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección Hero (divs, sections, articles, etc.).
3. Utilizar CSS backdrop-filter para efectos de cristal (con fallbacks para navegadores no compatibles).
4. Implementar efectos de profundidad y refracción principalmente con CSS.
5. Asegurar que el texto mantenga alto contraste y legibilidad a pesar de los efectos cristalinos.
6. Optimizar efectos visuales para diferentes capacidades de dispositivos.
7. Proporcionar alternativas más simples para navegadores antiguos.`,
  },
  {
    id: "neon-brutalism",
    title: "Brutalismo Neón",
    description: "Hero con estética brutalista pero con acentos de neón vibrante",
    category: "experimental",
    icon: <Layout className="h-4 w-4" />,
    prompt: `Crea una sección Hero para un sitio web con las siguientes características:

- Estilo: Brutalismo neón con contraste extremo
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Grises brutales, negro sólido y blanco crudo con acentos de neón vibrante (rosa, verde, azul)
- Incluir imágenes: Sí
- Estilo de imagen: Fotografías de alto contraste o elementos gráficos crudos con bordes duros
- Tipo de fuente: Sans-serif ultra-bold para títulos, monoespaciada para textos
- Tipo de animación: Transiciones abruptas, apariciones bruscas, destellos de neón
- Estilo de borde: Bordes gruesos y definidos, ocasionalmente con resplandor neón
- Incluir CTA: Sí, botón con diseño brutalista y acento neón al hover

- Optimizaciones de rendimiento: 
  * CSS simple y directo
  * Animaciones limitadas pero impactantes
  * Recursos visuales optimizados
  * JavaScript mínimo
  * Compresión de assets

- Optimizaciones SEO: Estructura semántica directa, metadatos precisos
- Compatibilidad con navegadores: Enfoque progressive enhancement
- Interactividad: 
  * Hover states con cambios abruptos y contrastantes
  * Elementos que aparecen y desaparecen bruscamente
  * Microinteracciones con destellos neón

- Transiciones: Cambios abruptos entre estados, destellos neón como acentos
- Elementos interactivos: UI con cambios dramáticos al interactuar

- Estilo de código: CSS directo y sin complicaciones
- Incluir comentarios detallados: Sí

La sección debe tener una estética Brutalismo neón con contraste extremo con animaciones Transiciones abruptas, apariciones bruscas, destellos de neón. Utilizar tipografía Sans-serif ultra-bold para títulos, monoespaciada para textos y bordes Bordes gruesos y definidos, ocasionalmente con resplandor neón. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Layout con grid visible y elementos que rompen intencionalmente la cuadrícula
2. Título principal con tipografía extremadamente bold y acento neón
3. Elementos UI con bordes gruesos y definidos que contrastan fuertemente con el fondo
4. CTA con diseño brutalista que se transforma abruptamente al hover con acento neón
5. Uso estratégico de espacios negativos amplios y contrastes extremos

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección Hero (divs, sections, articles, etc.).
3. Utilizar CSS Grid con líneas de grid visibles para enfatizar la estética brutalista.
4. Implementar contrastes extremos asegurando que se mantenga la accesibilidad.
5. Utilizar animaciones abruptas pero sin afectar la usabilidad básica.
6. Optimizar los acentos neón para que destaquen sin sobrecargar visualmente.
7. Mantener la coherencia del diseño brutalista en todos los tamaños de pantalla.`,
  },
  {
    id: "mystic-particles",
    title: "Partículas Místicas",
    description: "Hero con sistema de partículas que forman símbolos y patrones místicos",
    category: "místico",
    icon: <Sparkles className="h-4 w-4" />,
    prompt: `Crea una sección Hero para un sitio web con las siguientes características:

- Estilo: Partículas místicas que forman símbolos y patrones
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Fondo oscuro (negro, azul muy oscuro) con partículas en tonos violeta, azul, dorado y blanco
- Incluir imágenes: Sí, pero principalmente generadas con partículas
- Estilo de imagen: Símbolos místicos y patrones formados por sistemas de partículas
- Tipo de fuente: Serif elegante con detalles místicos para títulos, sans-serif limpia para texto
- Tipo de animación: Partículas que fluyen, se agrupan y dispersan formando patrones
- Estilo de borde: Formados por agrupaciones de partículas, difusos y etéreos
- Incluir CTA: Sí, botón con efecto de partículas que se agrupan al hover

- Optimizaciones de rendimiento: 
  * Sistema de partículas optimizado con canvas
  * Limitación de partículas según capacidad del dispositivo
  * Preloading de recursos críticos
  * Optimización de animaciones
  * Compresión de recursos

- Optimizaciones SEO: Estructura semántica, metadatos completos
- Compatibilidad con navegadores: Feature detection con alternativas
- Interactividad: 
  * Partículas que responden al movimiento del cursor o toque
  * Símbolos que se forman y transforman con interacciones
  * Microinteracciones con efectos de partículas

- Transiciones: Transformaciones de partículas entre estados, flujos y agrupaciones
- Elementos interactivos: Elementos UI que interactúan con el sistema de partículas

- Estilo de código: JavaScript optimizado para sistema de partículas, CSS para efectos complementarios
- Incluir comentarios detallados: Sí

La sección debe tener una estética Partículas místicas que forman símbolos y patrones con animaciones Partículas que fluyen, se agrupan y dispersan formando patrones. Utilizar tipografía Serif elegante con detalles místicos para títulos, sans-serif limpia para texto y bordes Formados por agrupaciones de partículas, difusos y etéreos. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Sistema de partículas que forma y transforma símbolos místicos
2. Título principal que se materializa a partir de partículas dispersas
3. Partículas que responden sutilmente al movimiento del cursor o al scroll
4. CTA que atrae partículas al hacer hover, formando un halo o aura
5. Símbolos místicos que se forman momentáneamente y se dispersan

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección Hero (divs, sections, articles, etc.).
3. Implementar sistema de partículas con canvas para mejor rendimiento.
4. Ajustar automáticamente la densidad de partículas según la capacidad del dispositivo.
5. Asegurar que el texto se mantenga legible a pesar de los efectos de partículas.
6. Proporcionar alternativas estáticas para dispositivos de muy bajo rendimiento.
7. Optimizar todas las animaciones para dispositivos móviles.`,
  },
  {
    id: "aurora-waves",
    title: "Ondas Aurora",
    description: "Hero con ondas de color fluidas inspiradas en auroras boreales",
    category: "inmersivo",
    icon: <Palette className="h-4 w-4" />,
    prompt: `Crea una sección Hero para un sitio web con las siguientes características:

- Estilo: Ondas aurora con colores fluidos inspirados en auroras boreales
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Fondo oscuro (negro, azul noche) con ondas de color verde aurora, azul eléctrico, violeta y rosa
- Incluir imágenes: Sí, pero principalmente generadas con gradientes y ondas
- Estilo de imagen: Ondas de color fluidas que emulan auroras boreales
- Tipo de fuente: Sans-serif elegante y ligera que contraste con las ondas de color
- Tipo de animación: Ondulaciones suaves y fluidas de color que se mueven lentamente
- Estilo de borde: Difuminados que se integran con las ondas de color
- Incluir CTA: Sí, botón con efecto de "onda de luz" al hover

- Optimizaciones de rendimiento: 
  * Uso de CSS para ondas y gradientes en lugar de videos o imágenes pesadas
  * Animaciones optimizadas con propiedades eficientes
  * Preloading de recursos críticos
  * Optimización de efectos visuales
  * Compresión de recursos

- Optimizaciones SEO: Estructura semántica, metadatos completos
- Compatibilidad con navegadores: Feature detection con alternativas
- Interactividad: 
  * Ondas que responden sutilmente al movimiento o scroll
  * Elementos que brillan con la intensidad de las ondas
  * Microinteracciones con efectos de luz aurora

- Transiciones: Flujos de color entre estados, ondulaciones que revelan contenido
- Elementos interactivos: UI que interactúa con las ondas de color

- Estilo de código: CSS con animaciones y gradientes avanzados
- Incluir comentarios detallados: Sí

La sección debe tener una estética Ondas aurora con colores fluidos inspirados en auroras boreales con animaciones Ondulaciones suaves y fluidas de color que se mueven lentamente. Utilizar tipografía Sans-serif elegante y ligera que contraste con las ondas de color y bordes Difuminados que se integran con las ondas de color. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Fondo con ondas de color aurora que se mueven lentamente en patrones orgánicos
2. Título principal con efecto de "iluminación aurora" que cambia sutilmente con las ondas
3. Capas de ondas con diferentes velocidades y opacidades para crear profundidad
4. CTA con efecto de "onda de luz aurora" que se expande al hover
5. Elementos de UI que parecen iluminados por la luz de las ondas aurora

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección Hero (divs, sections, articles, etc.).
3. Utilizar CSS para crear ondas aurora con gradientes animados y filtros.
4. Implementar animaciones suaves que no afecten el rendimiento en dispositivos móviles.
5. Asegurar alto contraste entre texto y fondo para mantener legibilidad.
6. Proporcionar alternativas más simples para navegadores antiguos.
7. Optimizar todas las animaciones para dispositivos de gama baja.`,
  },
  {
    id: "dimensional-portal",
    title: "Portal Dimensional",
    description: "Hero con efecto de portal a otra dimensión con profundidad y perspectiva",
    category: "inmersivo",
    icon: <Compass className="h-4 w-4" />,
    prompt: `Crea una sección Hero para un sitio web con las siguientes características:

- Estilo: Portal dimensional con efecto de profundidad y perspectiva
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Degradado de colores intensos (púrpura profundo, azul cósmico, turquesa brillante) con negro hacia los bordes
- Incluir imágenes: Sí
- Estilo de imagen: Elementos visuales que crean sensación de túnel o portal con perspectiva
- Tipo de fuente: Futurista para títulos, sans-serif limpia para texto
- Tipo de animación: Efecto de movimiento hacia el interior del portal, elementos que flotan a diferentes profundidades
- Estilo de borde: Efectos de luz que emanan del centro del portal
- Incluir CTA: Sí, botón que parece flotar en el espacio del portal

- Optimizaciones de rendimiento: 
  * Uso de CSS 3D transforms para efectos de profundidad
  * Animaciones optimizadas con propiedades eficientes
  * Preloading de recursos críticos
  * Optimización de efectos visuales
  * Compresión de recursos

- Optimizaciones SEO: Estructura semántica, metadatos completos
- Compatibilidad con navegadores: Feature detection con alternativas
- Interactividad: 
  * Elementos que responden al movimiento creando efecto parallax
  * Sensación de profundidad que cambia con el scroll
  * Microinteracciones con efectos de perspectiva

- Transiciones: Efectos de "viaje a través del portal" entre estados, elementos que emergen de la profundidad
- Elementos interactivos: UI que parece existir a diferentes profundidades en el portal

- Estilo de código: CSS con transforms 3D y perspectiva
- Incluir comentarios detallados: Sí

La sección debe tener una estética Portal dimensional con efecto de profundidad y perspectiva con animaciones Efecto de movimiento hacia el interior del portal, elementos que flotan a diferentes profundidades. Utilizar tipografía Futurista para títulos, sans-serif limpia para texto y bordes Efectos de luz que emanan del centro del portal. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Efecto visual de túnel o portal con sensación de profundidad infinita
2. Título principal que parece flotar en el espacio 3D del portal
3. Elementos que se mueven a diferentes velocidades creando parallax al scroll
4. CTA que parece estar suspendido en el espacio del portal y brilla al hover
5. Transición de entrada que simula "viaje a través del portal"

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección Hero (divs, sections, articles, etc.).
3. Utilizar CSS transforms 3D y perspective para crear efecto de profundidad.
4. Implementar parallax optimizado que funcione bien en dispositivos móviles.
5. Asegurar que el texto se mantenga legible a pesar de los efectos de profundidad.
6. Proporcionar alternativas más planas para navegadores que no soporten 3D transforms.
7. Optimizar todas las animaciones para dispositivos de gama baja.`,
  },
  {
    id: "ethereal-mist",
    title: "Niebla Etérea",
    description: "Hero con efecto de niebla etérea y elementos que emergen de la bruma",
    category: "místico",
    icon: <Cloud className="h-4 w-4" />,
    prompt: `Crea una sección Hero para un sitio web con las siguientes características:

- Estilo: Niebla etérea con elementos que emergen de la bruma
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Tonos etéreos (blanco, azul pálido, lavanda suave) con base oscura para contraste
- Incluir imágenes: Sí
- Estilo de imagen: Elementos visuales parcialmente ocultos por niebla o bruma
- Tipo de fuente: Serif elegante y etérea para títulos, sans-serif ligera para texto
- Tipo de animación: Movimientos suaves de niebla, elementos que aparecen y desaparecen en la bruma
- Estilo de borde: Difuminados que se funden con la niebla circundante
- Incluir CTA: Sí, botón que emerge claramente de la niebla al hover

- Optimizaciones de rendimiento: 
  * Uso de CSS para efectos de niebla en lugar de videos o imágenes pesadas
  * Animaciones optimizadas con propiedades eficientes
  * Preloading de recursos críticos
  * Optimización de filtros y efectos visuales
  * Compresión de recursos

- Optimizaciones SEO: Estructura semántica, metadatos completos
- Compatibilidad con navegadores: Feature detection con alternativas
- Interactividad: 
  * Niebla que responde sutilmente al movimiento
  * Elementos que se revelan al acercarse o interactuar
  * Microinteracciones con efectos de claridad/opacidad

- Transiciones: Elementos que emergen o se desvanecen en la niebla, revelaciones graduales
- Elementos interactivos: UI que interactúa con la niebla, revelando claridad al interactuar

- Estilo de código: CSS con filtros y efectos de opacidad avanzados
- Incluir comentarios detallados: Sí

La sección debe tener una estética Niebla etérea con elementos que emergen de la bruma con animaciones Movimientos suaves de niebla, elementos que aparecen y desaparecen en la bruma. Utilizar tipografía Serif elegante y etérea para títulos, sans-serif ligera para texto y bordes Difuminados que se funden con la niebla circundante. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Efecto de niebla en movimiento que crea profundidad y misterio
2. Título principal que emerge gradualmente de la niebla con mayor claridad
3. Elementos visuales que aparecen y desaparecen parcialmente en la bruma
4. CTA que se revela con mayor claridad al hacer hover, dispersando la niebla a su alrededor
5. Capas de niebla con diferentes densidades y velocidades para crear profundidad

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección Hero (divs, sections, articles, etc.).
3. Utilizar CSS para crear efectos de niebla con filtros, gradientes y opacidades.
4. Implementar animaciones suaves que no afecten el rendimiento en dispositivos móviles.
5. Asegurar suficiente contraste para mantener la legibilidad del texto a pesar de la niebla.
6. Proporcionar alternativas más simples para navegadores antiguos.
7. Optimizar todas las animaciones para dispositivos de gama baja.`,
  },
  {
    id: "quantum-grid",
    title: "Rejilla Cuántica",
    description: "Hero con rejilla de partículas cuánticas que forman patrones y conexiones",
    category: "futurista",
    icon: <Hexagon className="h-4 w-4" />,
    prompt: `Crea una sección Hero para un sitio web con las siguientes características:

- Estilo: Rejilla cuántica con partículas que forman conexiones
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Negro profundo o azul muy oscuro como base, con partículas en azul brillante, cian, violeta eléctrico
- Incluir imágenes: Sí, pero principalmente generadas con partículas y líneas
- Estilo de imagen: Rejilla de partículas que forman conexiones y patrones cuánticos
- Tipo de fuente: Futurista tecnológica para títulos, sans-serif limpia para texto
- Tipo de animación: Partículas que pulsan y se conectan formando redes, ondas de energía que recorren las conexiones
- Estilo de borde: Formados por líneas de energía que conectan partículas
- Incluir CTA: Sí, botón que atrae partículas y energía al hover

- Optimizaciones de rendimiento: 
  * Sistema de partículas optimizado con canvas o WebGL
  * Limitación de partículas según capacidad del dispositivo
  * Preloading de recursos críticos
  * Optimización de animaciones
  * Compresión de recursos

- Optimizaciones SEO: Estructura semántica, metadatos completos
- Compatibilidad con navegadores: Feature detection con alternativas
- Interactividad: 
  * Partículas que responden al movimiento del cursor o toque
  * Conexiones que se forman en la dirección del movimiento
  * Microinteracciones con ondas de energía cuántica

- Transiciones: Formación y disolución de conexiones entre estados, ondas de energía que fluyen
- Elementos interactivos: UI que interactúa con la rejilla de partículas

- Estilo de código: JavaScript optimizado para sistema de partículas, CSS para efectos complementarios
- Incluir comentarios detallados: Sí

La sección debe tener una estética Rejilla cuántica con partículas que forman conexiones con animaciones Partículas que pulsan y se conectan formando redes, ondas de energía que recorren las conexiones. Utilizar tipografía Futurista tecnológica para títulos, sans-serif limpia para texto y bordes Formados por líneas de energía que conectan partículas. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Rejilla de partículas que forma patrones y conexiones dinámicas
2. Título principal que se materializa a partir de partículas que se atraen
3. Ondas de energía que recorren las conexiones entre partículas
4. CTA que crea un campo de atracción para partículas cercanas al hover
5. Efectos de "computación cuántica" visualizados con patrones de partículas

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección Hero (divs, sections, articles, etc.).
3. Implementar sistema de partículas con canvas o WebGL para mejor rendimiento.
4. Ajustar automáticamente la densidad de partículas según la capacidad del dispositivo.
5. Asegurar que el texto se mantenga legible a pesar de los efectos de partículas.
6. Proporcionar alternativas estáticas para dispositivos de muy bajo rendimiento.
7. Optimizar todas las animaciones para dispositivos móviles.`,
  },
]

export function HeroPresets({ onSelectPreset }: { onSelectPreset: (prompt: string) => void }) {
  const [activeCategory, setActiveCategory] = useState<string>("all")

  // Filtrar presets por categoría
  const filteredPresets =
    activeCategory === "all" ? heroPresets : heroPresets.filter((preset) => preset.category === activeCategory)

  return (
    <Card className="border border-purple-500/20 bg-black/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-400" />
          Presets de Prompts para Secciones Hero
        </CardTitle>
        <CardDescription>
          Selecciona uno de estos presets predefinidos para generar un prompt completo para secciones Hero vanguardistas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all" onClick={() => setActiveCategory("all")}>
              Todos
            </TabsTrigger>
            <TabsTrigger value="futurista" onClick={() => setActiveCategory("futurista")}>
              Futurista
            </TabsTrigger>
            <TabsTrigger value="místico" onClick={() => setActiveCategory("místico")}>
              Místico
            </TabsTrigger>
            <TabsTrigger value="minimalista" onClick={() => setActiveCategory("minimalista")}>
              Minimalista
            </TabsTrigger>
            <TabsTrigger value="inmersivo" onClick={() => setActiveCategory("inmersivo")}>
              Inmersivo
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
                    {preset.category === "futurista" && "Futurista"}
                    {preset.category === "místico" && "Místico"}
                    {preset.category === "minimalista" && "Minimalista"}
                    {preset.category === "inmersivo" && "Inmersivo"}
                    {preset.category === "experimental" && "Experimental"}
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

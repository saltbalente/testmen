"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Palette,
  Layers,
  Compass,
  Shield,
  Lightbulb,
  Zap,
  Award,
  Star,
  Gem,
  CheckCircle,
  TrendingUp,
  Gift,
} from "lucide-react"

// Definición de tipos para los presets
interface BenefitPreset {
  id: string
  title: string
  description: string
  category: "interactivo" | "místico" | "minimalista" | "inmersivo" | "futurista"
  icon: React.ReactNode
  prompt: string
}

// Lista de 15 presets para secciones de Beneficios vanguardistas
const benefitPresets: BenefitPreset[] = [
  {
    id: "floating-cards",
    title: "Tarjetas Flotantes",
    description: "Beneficios presentados en tarjetas que flotan en un espacio tridimensional",
    category: "inmersivo",
    icon: <Layers className="h-4 w-4" />,
    prompt: `Crea una sección de Beneficios para un sitio web con las siguientes características:

- Estilo: Tarjetas flotantes en espacio tridimensional
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Negro profundo como base, con acentos en púrpura eléctrico, azul cósmico y destellos turquesa
- Incluir imágenes: Sí
- Estilo de imagen: Iconos minimalistas con efectos de neón o ilustraciones lineales luminosas
- Tipo de fuente: Sans-serif futurista para títulos, sans-serif ligera para descripciones
- Tipo de animación: Tarjetas que flotan en el espacio 3D, rotando suavemente y reaccionando al scroll
- Estilo de borde: Bordes luminosos con efecto de resplandor que cambia sutilmente de color
- Incluir CTA: Sí, botón principal con efecto de pulsación energética

- Optimizaciones de rendimiento: 
  * Animaciones basadas en CSS con propiedades optimizadas (transform, opacity)
  * Lazy loading para imágenes e iconos
  * Uso de will-change solo donde sea necesario
  * Compresión de CSS y minificación de JS
  * Uso de SVG para elementos gráficos

- Optimizaciones SEO: Estructura semántica, metadatos optimizados
- Compatibilidad con navegadores: Chrome, Firefox, Safari, Edge
- Interactividad: 
  * Tarjetas que reaccionan al hover con efectos de profundidad
  * Rotación sutil al mover el cursor o inclinar el dispositivo móvil
  * Efectos de "enfoque" al seleccionar una tarjeta

- Transiciones: Desplazamientos suaves en el espacio 3D, cambios de opacidad y escala
- Elementos interactivos: Tarjetas que se destacan y amplían al interactuar

- Estilo de código: Tailwind CSS con clases personalizadas para efectos especiales
- Incluir comentarios detallados: Sí

La sección debe tener una estética Tarjetas flotantes en espacio tridimensional con animaciones Tarjetas que flotan en el espacio 3D, rotando suavemente y reaccionando al scroll. Utilizar tipografía Sans-serif futurista para títulos, sans-serif ligera para descripciones y bordes Bordes luminosos con efecto de resplandor que cambia sutilmente de color. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Entre 4-6 tarjetas de beneficios que flotan en un espacio tridimensional
2. Cada tarjeta debe contener un icono distintivo, un título breve y una descripción concisa
3. Efecto de "profundidad" con tarjetas en diferentes planos que se mueven a velocidades distintas
4. Indicador visual que muestra qué beneficio está actualmente en foco
5. Transición suave entre estados de tarjetas (normal, hover, activo)

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de Beneficios (divs, sections, articles, etc.).
3. Implementar con enfoque mobile-first, asegurando que la experiencia sea óptima en dispositivos móviles primero.
4. Utilizar CSS transforms 3D de manera optimizada para crear el efecto de espacio tridimensional.
5. Implementar animaciones optimizadas que no afecten el rendimiento en dispositivos de gama baja.
6. Utilizar prefers-reduced-motion para usuarios que prefieren menos animaciones.
7. Asegurar que todos los textos sean legibles incluso con los efectos aplicados.`,
  },
  {
    id: "mystic-scrolls",
    title: "Pergaminos Místicos",
    description: "Beneficios que se revelan como antiguos pergaminos con sabiduría oculta",
    category: "místico",
    icon: <Sparkles className="h-4 w-4" />,
    prompt: `Crea una sección de Beneficios para un sitio web con las siguientes características:

- Estilo: Pergaminos místicos con sabiduría antigua
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Tonos de pergamino antiguo (sepia, marrón claro), con acentos en dorado antiguo, púrpura profundo y detalles en rojo oscuro
- Incluir imágenes: Sí
- Estilo de imagen: Símbolos místicos, sellos arcanos y elementos caligráficos antiguos
- Tipo de fuente: Caligráfica antigua para títulos, serif elegante para descripciones
- Tipo de animación: Pergaminos que se desenrollan al hacer scroll, tinta que aparece gradualmente
- Estilo de borde: Bordes desgastados como pergaminos antiguos, con sellos y símbolos de protección
- Incluir CTA: Sí, botón estilizado como sello místico que brilla al hover

- Optimizaciones de rendimiento: 
  * Animaciones CSS optimizadas
  * Lazy loading para recursos
  * Sprites SVG para símbolos
  * Compresión de recursos
  * JavaScript mínimo y eficiente

- Optimizaciones SEO: Estructura semántica, metadatos optimizados
- Compatibilidad con navegadores: Chrome, Firefox, Safari, Edge
- Interactividad: 
  * Pergaminos que se desenrollan completamente al interactuar
  * Símbolos que brillan y revelan significados ocultos
  * Efectos de "tinta mágica" que aparece al hacer hover

- Transiciones: Efectos de "desenrollado" de pergaminos, tinta que se materializa
- Elementos interactivos: Símbolos místicos que revelan información adicional

- Estilo de código: CSS con efectos de textura y animaciones personalizadas
- Incluir comentarios detallados: Sí

La sección debe tener una estética Pergaminos místicos con sabiduría antigua con animaciones Pergaminos que se desenrollan al hacer scroll, tinta que aparece gradualmente. Utilizar tipografía Caligráfica antigua para títulos, serif elegante para descripciones y bordes Bordes desgastados como pergaminos antiguos, con sellos y símbolos de protección. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Entre 4-6 pergaminos que contienen cada uno un beneficio clave
2. Cada pergamino debe tener un sello o símbolo místico distintivo, un título evocador y una descripción persuasiva
3. Efecto de "desenrollado" de pergamino al hacer scroll o interactuar
4. Tinta que aparece gradualmente como si se estuviera escribiendo mágicamente
5. Sellos místicos que brillan y revelan información adicional al interactuar

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de Beneficios (divs, sections, articles, etc.).
3. Implementar con enfoque mobile-first, asegurando que la experiencia sea óptima en dispositivos móviles primero.
4. Utilizar texturas sutiles para simular pergamino antiguo sin afectar la legibilidad.
5. Implementar animaciones de "escritura" y "desenrollado" optimizadas para dispositivos móviles.
6. Asegurar que los efectos visuales no comprometan la legibilidad del contenido.
7. Proporcionar alternativas para navegadores que no soporten todas las características.`,
  },
  {
    id: "neon-grid",
    title: "Rejilla Neón",
    description: "Beneficios presentados en una rejilla con efectos de neón cyberpunk",
    category: "futurista",
    icon: <Zap className="h-4 w-4" />,
    prompt: `Crea una sección de Beneficios para un sitio web con las siguientes características:

- Estilo: Rejilla neón con estética cyberpunk
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Negro profundo como base, con neones vibrantes en magenta, cian, amarillo eléctrico y verde tóxico
- Incluir imágenes: Sí
- Estilo de imagen: Iconos con efecto de neón o ilustraciones lineales con resplandor
- Tipo de fuente: Futurista tecnológica para títulos, monoespaciada para descripciones
- Tipo de animación: Pulsaciones de luz neón, efectos de electricidad estática, parpadeos controlados
- Estilo de borde: Bordes luminosos con efecto de resplandor neón que parpadea sutilmente
- Incluir CTA: Sí, botón con efecto de circuito eléctrico neón al hover

- Optimizaciones de rendimiento: 
  * Animaciones CSS optimizadas
  * SVG para elementos gráficos
  * Preloading de recursos críticos
  * Limitación de efectos en dispositivos de bajo rendimiento
  * Compresión de recursos

- Optimizaciones SEO: Estructura semántica, metadatos optimizados
- Compatibilidad con navegadores: Chrome, Firefox, Safari, Edge
- Interactividad: 
  * Elementos que intensifican su brillo al interactuar
  * Efectos de "sobrecarga eléctrica" al hacer hover
  * Microinteracciones con efectos de electricidad

- Transiciones: Efectos de "encendido" y "apagado" de neón, pulsos eléctricos entre estados
- Elementos interactivos: Circuitos neón que se activan al interactuar

- Estilo de código: CSS con variables y efectos de resplandor optimizados
- Incluir comentarios detallados: Sí

La sección debe tener una estética Rejilla neón con estética cyberpunk con animaciones Pulsaciones de luz neón, efectos de electricidad estática, parpadeos controlados. Utilizar tipografía Futurista tecnológica para títulos, monoespaciada para descripciones y bordes Bordes luminosos con efecto de resplandor neón que parpadea sutilmente. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Rejilla de 4-6 beneficios con efecto de "terminal futurista"
2. Cada elemento debe tener un icono neón distintivo, un título impactante y una descripción concisa
3. Líneas de "circuito" neón que conectan los diferentes elementos
4. Efectos de "energía" que fluye a través de los circuitos al hacer scroll o interactuar
5. Indicadores de "estado" que muestran qué beneficio está actualmente en foco

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de Beneficios (divs, sections, articles, etc.).
3. Implementar con enfoque mobile-first, asegurando que la experiencia sea óptima en dispositivos móviles primero.
4. Utilizar CSS para efectos de neón en lugar de imágenes pesadas.
5. Implementar animaciones optimizadas que no afecten el rendimiento en dispositivos de gama baja.
6. Proporcionar alternativas más simples para dispositivos de muy bajo rendimiento.
7. Asegurar suficiente contraste para mantener la legibilidad del texto a pesar de los efectos neón.`,
  },
  {
    id: "crystal-showcase",
    title: "Vitrinas de Cristal",
    description: "Beneficios presentados en elegantes vitrinas de cristal con efectos de refracción",
    category: "minimalista",
    icon: <Gem className="h-4 w-4" />,
    prompt: `Crea una sección de Beneficios para un sitio web con las siguientes características:

- Estilo: Vitrinas de cristal con efectos de refracción y transparencia
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Base oscura (negro, azul muy oscuro) con acentos en azul cristalino, violeta suave y destellos blancos
- Incluir imágenes: Sí
- Estilo de imagen: Iconos minimalistas o ilustraciones lineales con efecto de cristal
- Tipo de fuente: Sans-serif elegante y ligera para títulos, sans-serif ultra-fina para descripciones
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
  * Vitrinas que refractan la luz al interactuar
  * Efectos de profundidad que responden al movimiento
  * Microinteracciones con brillos y destellos

- Transiciones: Efectos de refracción entre estados, brillos que se desplazan como luz a través de cristal
- Elementos interactivos: Vitrinas con efectos de cristal que responden a interacciones

- Estilo de código: CSS con backdrop-filter y efectos avanzados
- Incluir comentarios detallados: Sí

La sección debe tener una estética Vitrinas de cristal con efectos de refracción y transparencia con animaciones Brillos y refracciones de luz, movimientos suaves como a través de un medio cristalino. Utilizar tipografía Sans-serif elegante y ligera para títulos, sans-serif ultra-fina para descripciones y bordes Bordes con efecto de cristal pulido con reflejos y refracciones. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Entre 4-6 vitrinas de cristal que contienen cada una un beneficio clave
2. Cada vitrina debe tener un icono distintivo, un título claro y una descripción concisa
3. Efectos de luz que se refractan a través de las vitrinas de cristal
4. Profundidad visual con diferentes capas de transparencia
5. Microinteracciones elegantes al interactuar con cada vitrina

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de Beneficios (divs, sections, articles, etc.).
3. Utilizar CSS backdrop-filter para efectos de cristal (con fallbacks para navegadores no compatibles).
4. Implementar efectos de profundidad y refracción principalmente con CSS.
5. Asegurar que el texto mantenga alto contraste y legibilidad a pesar de los efectos cristalinos.
6. Optimizar efectos visuales para diferentes capacidades de dispositivos.
7. Proporcionar alternativas más simples para navegadores antiguos.`,
  },
  {
    id: "cosmic-orbit",
    title: "Órbita Cósmica",
    description: "Beneficios que orbitan como planetas alrededor de un punto central",
    category: "inmersivo",
    icon: <Compass className="h-4 w-4" />,
    prompt: `Crea una sección de Beneficios para un sitio web con las siguientes características:

- Estilo: Órbita cósmica con elementos planetarios
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Negro espacial como base, con planetas en tonos de azul profundo, púrpura cósmico, turquesa brillante y destellos dorados
- Incluir imágenes: Sí
- Estilo de imagen: Planetas, estrellas y elementos cósmicos estilizados
- Tipo de fuente: Futurista elegante para títulos, sans-serif limpia para descripciones
- Tipo de animación: Movimientos orbitales suaves, rotaciones planetarias, destellos estelares
- Estilo de borde: Halos luminosos alrededor de los planetas, estelas cósmicas
- Incluir CTA: Sí, botón central con efecto de "núcleo energético" al hover

- Optimizaciones de rendimiento: 
  * Animaciones CSS optimizadas con propiedades eficientes
  * SVG para elementos gráficos
  * Preloading de recursos críticos
  * requestAnimationFrame para animaciones complejas
  * Compresión de recursos

- Optimizaciones SEO: Estructura semántica, metadatos optimizados
- Compatibilidad con navegadores: Feature detection con alternativas
- Interactividad: 
  * Planetas que se destacan y amplían al interactuar
  * Sistema orbital que responde al scroll o al movimiento
  * Información detallada que se revela al seleccionar un planeta

- Transiciones: Movimientos orbitales fluidos, zoom suave hacia planetas seleccionados
- Elementos interactivos: Planetas que revelan información detallada al interactuar

- Estilo de código: CSS con animaciones complejas optimizadas, JS mínimo para interactividad
- Incluir comentarios detallados: Sí

La sección debe tener una estética Órbita cósmica con elementos planetarios con animaciones Movimientos orbitales suaves, rotaciones planetarias, destellos estelares. Utilizar tipografía Futurista elegante para títulos, sans-serif limpia para descripciones y bordes Halos luminosos alrededor de los planetas, estelas cósmicas. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Sistema orbital con 4-6 "planetas" que representan cada beneficio clave
2. Elemento central que actúa como "sol" o punto focal del sistema
3. Cada planeta debe tener un diseño único, un título distintivo y una descripción concisa
4. Movimiento orbital continuo pero sutil que no distrae
5. Efecto de "zoom" o "enfoque" en el planeta seleccionado que revela más información

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de Beneficios (divs, sections, articles, etc.).
3. Implementar con enfoque mobile-first, adaptando el sistema orbital para diferentes tamaños de pantalla.
4. Utilizar CSS para animaciones orbitales con optimizaciones para rendimiento.
5. Implementar alternativas para el sistema orbital en dispositivos de bajo rendimiento.
6. Asegurar que el contenido sea accesible incluso sin las animaciones.
7. Utilizar prefers-reduced-motion para respetar preferencias de usuario.`,
  },
  {
    id: "elemental-cards",
    title: "Tarjetas Elementales",
    description: "Beneficios representados por los elementos clásicos (fuego, agua, tierra, aire)",
    category: "místico",
    icon: <Layers className="h-4 w-4" />,
    prompt: `Crea una sección de Beneficios para un sitio web con las siguientes características:

- Estilo: Tarjetas elementales basadas en los elementos clásicos
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Base oscura con colores elementales: rojo fuego, azul agua, verde tierra, blanco/celeste aire, más un quinto elemento en púrpura/dorado
- Incluir imágenes: Sí
- Estilo de imagen: Símbolos elementales estilizados y patrones que evocan cada elemento
- Tipo de fuente: Serif elegante con variaciones sutiles según el elemento para títulos, sans-serif para descripciones
- Tipo de animación: Movimientos fluidos inspirados en cada elemento (ondulaciones de agua, llamas danzantes, etc.)
- Estilo de borde: Bordes que evocan la naturaleza de cada elemento (ondulados para agua, flameantes para fuego, etc.)
- Incluir CTA: Sí, botón central que combina todos los elementos con efecto de "quintaesencia" al hover

- Optimizaciones de rendimiento: 
  * Animaciones CSS optimizadas específicas para cada elemento
  * SVG para símbolos y patrones elementales
  * Preloading de recursos críticos
  * Optimización de efectos visuales
  * Compresión de recursos

- Optimizaciones SEO: Estructura semántica, metadatos optimizados
- Compatibilidad con navegadores: Feature detection con alternativas
- Interactividad: 
  * Tarjetas que intensifican su efecto elemental al interactuar
  * Transiciones entre estados inspiradas en transformaciones elementales
  * Microinteracciones específicas para cada elemento

- Transiciones: Transformaciones basadas en la naturaleza de cada elemento
- Elementos interactivos: Símbolos elementales que responden a interacciones

- Estilo de código: CSS con animaciones personalizadas para cada elemento
- Incluir comentarios detallados: Sí

La sección debe tener una estética Tarjetas elementales basadas en los elementos clásicos con animaciones Movimientos fluidos inspirados en cada elemento (ondulaciones de agua, llamas danzantes, etc.). Utilizar tipografía Serif elegante con variaciones sutiles según el elemento para títulos, sans-serif para descripciones y bordes Bordes que evocan la naturaleza de cada elemento (ondulados para agua, flameantes para fuego, etc.). El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. 4-5 tarjetas elementales (fuego, agua, tierra, aire, y opcionalmente "éter" o "quintaesencia")
2. Cada tarjeta debe tener un símbolo elemental, un título relacionado con el elemento y una descripción que vincule el beneficio con las cualidades del elemento
3. Animaciones específicas para cada elemento: llamas para fuego, ondulaciones para agua, partículas flotantes para aire, crecimiento orgánico para tierra
4. Efectos visuales que intensifican la presencia del elemento al interactuar
5. Posible elemento central que combine todos los elementos como punto focal o CTA principal

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de Beneficios (divs, sections, articles, etc.).
3. Implementar con enfoque mobile-first, adaptando la disposición de las tarjetas elementales para diferentes tamaños de pantalla.
4. Utilizar CSS para animaciones elementales con optimizaciones para rendimiento.
5. Asegurar que las animaciones elementales no afecten negativamente el rendimiento en dispositivos móviles.
6. Proporcionar alternativas más simples para navegadores antiguos.
7. Mantener la legibilidad del texto a pesar de los efectos elementales.`,
  },
  {
    id: "dark-elegance",
    title: "Elegancia Oscura",
    description: "Beneficios presentados con diseño minimalista elegante sobre fondo oscuro",
    category: "minimalista",
    icon: <Star className="h-4 w-4" />,
    prompt: `Crea una sección de Beneficios para un sitio web con las siguientes características:

- Estilo: Elegancia oscura con minimalismo sofisticado
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Negro profundo, gris oscuro, dorado antiguo, toques de borgoña oscuro
- Incluir imágenes: Sí, pero minimalistas y elegantes
- Estilo de imagen: Iconos lineales dorados o ilustraciones minimalistas con detalles precisos
- Tipo de fuente: Serif refinada para títulos, sans-serif elegante y ligera para descripciones
- Tipo de animación: Apariciones sutiles, movimientos elegantes y controlados, transiciones refinadas
- Estilo de borde: Líneas finas doradas, ocasionalmente con detalles ornamentados
- Incluir CTA: Sí, botón elegante con transición refinada al hover

- Optimizaciones de rendimiento: 
  * Animaciones mínimas y altamente optimizadas
  * SVG para elementos gráficos
  * CSS mínimo y específico
  * JavaScript limitado a lo esencial
  * Compresión de recursos

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

La sección debe tener una estética Elegancia oscura con minimalismo sofisticado con animaciones Apariciones sutiles, movimientos elegantes y controlados, transiciones refinadas. Utilizar tipografía Serif refinada para títulos, sans-serif elegante y ligera para descripciones y bordes Líneas finas doradas, ocasionalmente con detalles ornamentados. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Disposición minimalista de 4-6 beneficios con amplio espacio negativo
2. Cada beneficio debe tener un icono elegante, un título conciso y una descripción refinada
3. Numeración sutil o separadores elegantes entre beneficios
4. Uso estratégico de acentos dorados para destacar elementos clave
5. Transiciones refinadas entre estados que sugieren exclusividad y sofisticación

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de Beneficios (divs, sections, articles, etc.).
3. Implementar con enfoque mobile-first, asegurando que la experiencia sea óptima en dispositivos móviles primero.
4. Utilizar CSS Grid y Flexbox para layouts precisos y elegantes.
5. Implementar animaciones sutiles que añadan sofisticación sin distraer.
6. Asegurar alto contraste para accesibilidad a pesar del fondo oscuro.
7. Optimizar para velocidad con CSS y JS mínimos.`,
  },
  {
    id: "glitch-benefits",
    title: "Beneficios Glitch",
    description: "Beneficios con efectos de glitch y distorsión digital controlada",
    category: "futurista",
    icon: <Zap className="h-4 w-4" />,
    prompt: `Crea una sección de Beneficios para un sitio web con las siguientes características:

- Estilo: Glitch digital con distorsiones controladas
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Negro, rojo neón, azul digital, verde matriz, distorsiones cromáticas
- Incluir imágenes: Sí
- Estilo de imagen: Iconos o ilustraciones con efectos de glitch y distorsión digital
- Tipo de fuente: Monoespaciada tecnológica con efectos de glitch para títulos, sans-serif para descripciones
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

La sección debe tener una estética Glitch digital con distorsiones controladas con animaciones Glitches controlados, distorsiones momentáneas, fragmentaciones. Utilizar tipografía Monoespaciada tecnológica con efectos de glitch para títulos, sans-serif para descripciones y bordes Bordes que ocasionalmente se distorsionan o desplazan. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Entre 4-6 beneficios con efectos de glitch que no comprometan la legibilidad
2. Cada beneficio debe tener un icono o ilustración con efecto de glitch, un título impactante y una descripción clara
3. Efectos de "corrupción de datos" que revelan información adicional
4. Transiciones con distorsiones digitales entre estados (normal, hover, activo)
5. Indicadores visuales tipo "terminal" o "interfaz digital" para la navegación

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de Beneficios (divs, sections, articles, etc.).
3. Implementar efectos de glitch principalmente con CSS para mejor rendimiento.
4. Utilizar JavaScript estratégicamente solo para efectos que no se pueden lograr con CSS.
5. Asegurar que el texto siga siendo legible incluso durante los efectos de glitch.
6. Proporcionar alternativas más simples para dispositivos de bajo rendimiento.
7. Limitar la frecuencia e intensidad de los glitches para no afectar la usabilidad.`,
  },
  {
    id: "sacred-geometry",
    title: "Geometría Sagrada",
    description: "Beneficios presentados en patrones de geometría sagrada con proporciones áureas",
    category: "místico",
    icon: <Compass className="h-4 w-4" />,
    prompt: `Crea una sección de Beneficios para un sitio web con las siguientes características:

- Estilo: Geometría sagrada con proporciones áureas
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Negro profundo, dorado brillante, blanco puro, toques de azul índigo
- Incluir imágenes: Sí
- Estilo de imagen: Patrones geométricos sagrados precisos (Flor de la Vida, Metatrón, etc.)
- Tipo de fuente: Geométrica precisa para títulos, sans-serif limpia para descripciones
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

La sección debe tener una estética Geometría sagrada con proporciones áureas con animaciones Expansiones y contracciones siguiendo secuencias matemáticas precisas. Utilizar tipografía Geométrica precisa para títulos, sans-serif limpia para descripciones y bordes Líneas geométricas precisas que forman patrones sagrados. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Disposición de 4-6 beneficios siguiendo un patrón de geometría sagrada (como la Flor de la Vida)
2. Cada beneficio debe tener un símbolo geométrico sagrado, un título conciso y una descripción clara
3. Proporciones áureas aplicadas a todos los elementos (tamaños, espaciados, márgenes)
4. Animaciones que siguen secuencias matemáticas (Fibonacci, espiral áurea)
5. Patrón geométrico central que actúa como punto focal o navegación

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de Beneficios (divs, sections, articles, etc.).
3. Utilizar cálculos matemáticos precisos para todas las proporciones (basados en phi: 1.618...).
4. Implementar SVG para todos los patrones geométricos para máxima precisión.
5. Asegurar que los patrones geométricos se mantengan precisos en todos los tamaños de pantalla.
6. Optimizar las animaciones para que funcionen bien en dispositivos móviles.
7. Mantener la accesibilidad a pesar de la complejidad visual.`,
  },
  {
    id: "holographic-cards",
    title: "Tarjetas Holográficas",
    description: "Beneficios en tarjetas con efectos holográficos iridiscentes",
    category: "futurista",
    icon: <Sparkles className="h-4 w-4" />,
    prompt: `Crea una sección de Beneficios para un sitio web con las siguientes características:

- Estilo: Tarjetas holográficas con efectos iridiscentes
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Base oscura con efectos holográficos iridiscentes (azul, violeta, rosa, turquesa)
- Incluir imágenes: Sí
- Estilo de imagen: Iconos o ilustraciones con efectos holográficos
- Tipo de fuente: Futurista con efectos de distorsión holográfica sutil para títulos, sans-serif limpia para descripciones
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
  * Tarjetas que responden al movimiento del dispositivo (giroscopio)
  * Efectos holográficos que cambian según el ángulo de visión
  * Microinteracciones con brillos iridiscentes

- Transiciones: Cambios de color holográficos entre estados, brillos que se desplazan
- Elementos interactivos: Tarjetas con efectos holográficos que responden a interacciones

- Estilo de código: CSS con variables y filtros avanzados
- Incluir comentarios detallados: Sí

La sección debe tener una estética Tarjetas holográficas con efectos iridiscentes con animaciones Efectos holográficos que cambian con el ángulo/scroll, brillos iridiscentes. Utilizar tipografía Futurista con efectos de distorsión holográfica sutil para títulos, sans-serif limpia para descripciones y bordes Bordes con efecto holográfico que cambia de color según el ángulo. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Conjunto de 4-6 tarjetas holográficas, cada una representando un beneficio clave
2. Cada tarjeta debe tener un icono distintivo, un título impactante y una descripción concisa
3. Efecto holográfico que cambia de color al mover el dispositivo o al hacer scroll
4. Brillos iridiscentes que se desplazan por las tarjetas
5. Efecto de "elevación" o "destacado" en la tarjeta seleccionada

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de Beneficios (divs, sections, articles, etc.).
3. Utilizar CSS para crear efectos holográficos e iridiscentes sin imágenes pesadas.
4. Implementar detección de capacidades para ofrecer alternativas en navegadores antiguos.
5. Asegurar que el texto siga siendo legible a pesar de los efectos holográficos.
6. Optimizar efectos basados en giroscopio para dispositivos móviles.
7. Proporcionar alternativas para dispositivos sin giroscopio o de bajo rendimiento.`,
  },
  {
    id: "mystic-scrolls",
    title: "Portales Dimensionales",
    description: "Beneficios que se revelan a través de portales a otras dimensiones",
    category: "inmersivo",
    icon: <Layers className="h-4 w-4" />,
    prompt: `Crea una sección de Beneficios para un sitio web con las siguientes características:

- Estilo: Portales dimensionales con efecto de profundidad y perspectiva
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Negro profundo como base, con portales en púrpura cósmico, azul dimensional, turquesa brillante y destellos dorados
- Incluir imágenes: Sí
- Estilo de imagen: Elementos visuales que crean sensación de portal con perspectiva
- Tipo de fuente: Futurista para títulos, sans-serif limpia para descripciones
- Tipo de animación: Efecto de movimiento hacia el interior del portal, elementos que flotan a diferentes profundidades
- Estilo de borde: Efectos de luz que emanan del borde del portal
- Incluir CTA: Sí, botón central que parece ser la entrada a un portal principal

- Optimizaciones de rendimiento: 
  * Uso de CSS 3D transforms para efectos de profundidad
  * Animaciones optimizadas con propiedades eficientes
  * Preloading de recursos críticos
  * Optimización de efectos visuales
  * Compresión de recursos

- Optimizaciones SEO: Estructura semántica, metadatos completos
- Compatibilidad con navegadores: Feature detection con alternativas
- Interactividad: 
  * Portales que se expanden al interactuar
  * Sensación de profundidad que cambia con el scroll
  * Microinteracciones con efectos de perspectiva

- Transiciones: Efectos de "viaje a través del portal" entre estados, elementos que emergen de la profundidad
- Elementos interactivos: Portales que revelan más información al interactuar

- Estilo de código: CSS con transforms 3D y perspectiva
- Incluir comentarios detallados: Sí

La sección debe tener una estética Portales dimensionales con efecto de profundidad y perspectiva con animaciones Efecto de movimiento hacia el interior del portal, elementos que flotan a diferentes profundidades. Utilizar tipografía Futurista para títulos, sans-serif limpia para descripciones y bordes Efectos de luz que emanan del borde del portal. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Entre 4-6 portales dimensionales, cada uno revelando un beneficio clave
2. Cada portal debe tener un diseño único, un título impactante y una descripción concisa
3. Efecto visual de profundidad que da la sensación de mirar a través de un portal
4. Elementos que flotan a diferentes profundidades dentro de cada portal
5. Transición de "viaje a través del portal" al interactuar para revelar más información

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de Beneficios (divs, sections, articles, etc.).
3. Utilizar CSS transforms 3D y perspective para crear efecto de profundidad.
4. Implementar parallax optimizado que funcione bien en dispositivos móviles.
5. Asegurar que el texto se mantenga legible a pesar de los efectos de profundidad.
6. Proporcionar alternativas más planas para navegadores que no soporten 3D transforms.
7. Optimizar todas las animaciones para dispositivos de gama baja.`,
  },
  {
    id: "aurora-waves",
    title: "Ondas Aurora",
    description: "Beneficios presentados con ondas de color fluidas inspiradas en auroras boreales",
    category: "inmersivo",
    icon: <Palette className="h-4 w-4" />,
    prompt: `Crea una sección de Beneficios para un sitio web con las siguientes características:

- Estilo: Ondas aurora con colores fluidos inspirados en auroras boreales
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Fondo oscuro (negro, azul noche) con ondas de color verde aurora, azul eléctrico, violeta y rosa
- Incluir imágenes: Sí, pero principalmente generadas con gradientes y ondas
- Estilo de imagen: Iconos o ilustraciones que parecen iluminados por las ondas aurora
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
1. Entre 4-6 beneficios presentados en tarjetas o secciones con ondas aurora como fondo o elemento decorativo
2. Cada beneficio debe tener un icono distintivo, un título claro y una descripción concisa
3. Ondas de color aurora que fluyen a través de toda la sección, creando un efecto inmersivo
4. Elementos que parecen iluminados por la luz de las ondas aurora
5. Transiciones suaves entre beneficios con efectos de ondulación

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de Beneficios (divs, sections, articles, etc.).
3. Utilizar CSS para crear ondas aurora con gradientes animados y filtros.
4. Implementar animaciones suaves que no afecten el rendimiento en dispositivos móviles.
5. Asegurar alto contraste entre texto y fondo para mantener legibilidad.
6. Proporcionar alternativas más simples para navegadores antiguos.
7. Optimizar todas las animaciones para dispositivos de gama baja.`,
  },
  {
    id: "mystic-shields",
    title: "Escudos Místicos",
    description: "Beneficios representados como escudos de protección con símbolos místicos",
    category: "místico",
    icon: <Shield className="h-4 w-4" />,
    prompt: `Crea una sección de Beneficios para un sitio web con las siguientes características:

- Estilo: Escudos místicos con símbolos de protección
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Base oscura (negro, azul muy oscuro) con escudos en plata brillante, dorado antiguo, azul zafiro y detalles en rojo rubí
- Incluir imágenes: Sí
- Estilo de imagen: Escudos con símbolos místicos de protección y runas antiguas
- Tipo de fuente: Serif antigua con detalles ornamentados para títulos, sans-serif para descripciones
- Tipo de animación: Brillos y resplandores que emanan de los símbolos, escudos que se activan al interactuar
- Estilo de borde: Ornamentados con símbolos de protección y runas
- Incluir CTA: Sí, botón central con símbolo de protección suprema que brilla al hover

- Optimizaciones de rendimiento: 
  * SVG para todos los símbolos y escudos
  * Animaciones CSS optimizadas
  * Preloading de recursos críticos
  * Optimización de efectos visuales
  * Compresión de recursos

- Optimizaciones SEO: Estructura semántica, metadatos completos
- Compatibilidad con navegadores: Feature detection con alternativas
- Interactividad: 
  * Escudos que se activan y brillan al interactuar
  * Símbolos que revelan su significado y poder
  * Microinteracciones con efectos de energía mística

- Transiciones: Activaciones de escudos entre estados, resplandores que revelan contenido
- Elementos interactivos: Símbolos místicos que responden a interacciones

- Estilo de código: CSS con efectos de luz y resplandor optimizados
- Incluir comentarios detallados: Sí

La sección debe tener una estética Escudos místicos con símbolos de protección con animaciones Brillos y resplandores que emanan de los símbolos, escudos que se activan al interactuar. Utilizar tipografía Serif antigua con detalles ornamentados para títulos, sans-serif para descripciones y bordes Ornamentados con símbolos de protección y runas. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Entre 4-6 escudos místicos, cada uno representando un beneficio o protección clave
2. Cada escudo debe tener un símbolo místico distintivo, un título evocador y una descripción que enfatice la protección o beneficio
3. Efectos de "activación" de escudo cuando el usuario interactúa con ellos
4. Resplandores y brillos que emanan de los símbolos místicos
5. Posible disposición circular o en formación protectora de los escudos

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de Beneficios (divs, sections, articles, etc.).
3. Utilizar SVG para todos los símbolos y escudos para máxima calidad y rendimiento.
4. Implementar efectos de luz y resplandor principalmente con CSS.
5. Asegurar que el texto se mantenga legible a pesar de los efectos visuales.
6. Proporcionar alternativas más simples para navegadores antiguos.
7. Optimizar todas las animaciones para dispositivos de gama baja.`,
  },
  {
    id: "quantum-particles",
    title: "Partículas Cuánticas",
    description: "Beneficios visualizados con sistemas de partículas que forman patrones cuánticos",
    category: "futurista",
    icon: <Lightbulb className="h-4 w-4" />,
    prompt: `Crea una sección de Beneficios para un sitio web con las siguientes características:

- Estilo: Partículas cuánticas que forman patrones y conexiones
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Negro profundo o azul muy oscuro como base, con partículas en azul brillante, cian, violeta eléctrico
- Incluir imágenes: Sí, pero principalmente generadas con partículas y líneas
- Estilo de imagen: Patrones de partículas que forman iconos o símbolos relacionados con cada beneficio
- Tipo de fuente: Futurista tecnológica para títulos, sans-serif limpia para descripciones
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

La sección debe tener una estética Partículas cuánticas que forman patrones y conexiones con animaciones Partículas que pulsan y se conectan formando redes, ondas de energía que recorren las conexiones. Utilizar tipografía Futurista tecnológica para títulos, sans-serif limpia para descripciones y bordes Formados por líneas de energía que conectan partículas. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Entre 4-6 beneficios representados por formaciones de partículas cuánticas
2. Cada beneficio debe tener un patrón de partículas distintivo, un título impactante y una descripción clara
3. Partículas que se mueven y conectan formando redes dinámicas
4. Ondas de energía que fluyen a través de las conexiones entre partículas
5. Interacción donde las partículas responden al movimiento del cursor o al toque en móviles

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de Beneficios (divs, sections, articles, etc.).
3. Implementar sistema de partículas con canvas o WebGL para mejor rendimiento.
4. Ajustar automáticamente la densidad de partículas según la capacidad del dispositivo.
5. Asegurar que el texto se mantenga legible a pesar de los efectos de partículas.
6. Proporcionar alternativas estáticas para dispositivos de muy bajo rendimiento.
7. Optimizar todas las animaciones para dispositivos móviles.`,
  },
  {
    id: "achievement-trophies",
    title: "Trofeos de Logros",
    description: "Beneficios presentados como trofeos o medallas de logros desbloqueados",
    category: "interactivo",
    icon: <Award className="h-4 w-4" />,
    prompt: `Crea una sección de Beneficios para un sitio web con las siguientes características:

- Estilo: Trofeos y medallas de logros con estética premium
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Negro elegante, dorado brillante, plata pulida, detalles en azul real y rojo rubí
- Incluir imágenes: Sí
- Estilo de imagen: Trofeos, medallas y emblemas detallados con acabado metálico
- Tipo de fuente: Serif elegante para títulos, sans-serif limpia para descripciones
- Tipo de animación: Brillos que recorren las superficies metálicas, efectos de "desbloqueo" de logros
- Estilo de borde: Ornamentados con detalles metálicos y grabados
- Incluir CTA: Sí, botón premium con efecto metálico dorado al hover

- Optimizaciones de rendimiento: 
  * SVG para todos los trofeos y medallas
  * Animaciones CSS optimizadas
  * Preloading de recursos críticos
  * Optimización de efectos visuales
  * Compresión de recursos

- Optimizaciones SEO: Estructura semántica, metadatos completos
- Compatibilidad con navegadores: Feature detection con alternativas
- Interactividad: 
  * Trofeos que se "desbloquean" y brillan al interactuar
  * Efectos de "logro conseguido" al hacer scroll o interactuar
  * Microinteracciones con efectos de brillo metálico

- Transiciones: Desbloqueos de logros entre estados, brillos que recorren superficies
- Elementos interactivos: Trofeos y medallas que responden  brillos que recorren superficies
- Elementos interactivos: Trofeos y medallas que responden a interacciones

- Estilo de código: CSS con efectos metálicos y brillos optimizados
- Incluir comentarios detallados: Sí

La sección debe tener una estética Trofeos y medallas de logros con estética premium con animaciones Brillos que recorren las superficies metálicas, efectos de "desbloqueo" de logros. Utilizar tipografía Serif elegante para títulos, sans-serif limpia para descripciones y bordes Ornamentados con detalles metálicos y grabados. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Entre 4-6 trofeos o medallas, cada uno representando un beneficio o logro clave
2. Cada trofeo debe tener un diseño único, un título evocador y una descripción que enfatice el beneficio
3. Efectos de "desbloqueo" o "logro conseguido" cuando el usuario llega a cada trofeo
4. Brillos metálicos que recorren las superficies de los trofeos
5. Posible sistema de "niveles" o "rangos" que agrupe los beneficios

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de Beneficios (divs, sections, articles, etc.).
3. Utilizar SVG para todos los trofeos y medallas para máxima calidad y rendimiento.
4. Implementar efectos de brillo metálico principalmente con CSS.
5. Asegurar que el texto se mantenga legible a pesar de los efectos visuales.
6. Proporcionar alternativas más simples para navegadores antiguos.
7. Optimizar todas las animaciones para dispositivos de gama baja.`,
  },
  {
    id: "growth-steps",
    title: "Pasos de Crecimiento",
    description: "Beneficios presentados como etapas de crecimiento con efectos orgánicos",
    category: "interactivo",
    icon: <TrendingUp className="h-4 w-4" />,
    prompt: `Crea una sección de Beneficios para un sitio web con las siguientes características:

- Estilo: Pasos de crecimiento con efectos orgánicos y evolutivos
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Base oscura con tonos de verde vibrante, azul profundo, púrpura místico y destellos dorados
- Incluir imágenes: Sí
- Estilo de imagen: Elementos que representan crecimiento (plantas, árboles, cristales) en diferentes etapas
- Tipo de fuente: Orgánica y fluida para títulos, sans-serif limpia para descripciones
- Tipo de animación: Crecimiento orgánico, evolución gradual, florecimiento
- Estilo de borde: Orgánicos que emulan formas naturales en crecimiento
- Incluir CTA: Sí, botón que "florece" o "evoluciona" al hover

- Optimizaciones de rendimiento: 
  * SVG para elementos gráficos
  * Animaciones CSS optimizadas
  * Preloading de recursos críticos
  * Optimización de efectos visuales
  * Compresión de recursos

- Optimizaciones SEO: Estructura semántica, metadatos completos
- Compatibilidad con navegadores: Feature detection con alternativas
- Interactividad: 
  * Elementos que crecen o evolucionan al interactuar
  * Transiciones entre etapas de crecimiento al hacer scroll
  * Microinteracciones con efectos orgánicos

- Transiciones: Evoluciones y crecimientos entre estados, florecimientos que revelan contenido
- Elementos interactivos: Etapas de crecimiento que responden a interacciones

- Estilo de código: CSS con animaciones orgánicas optimizadas
- Incluir comentarios detallados: Sí

La sección debe tener una estética Pasos de crecimiento con efectos orgánicos y evolutivos con animaciones Crecimiento orgánico, evolución gradual, florecimiento. Utilizar tipografía Orgánica y fluida para títulos, sans-serif limpia para descripciones y bordes Orgánicos que emulan formas naturales en crecimiento. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Entre 4-6 etapas de crecimiento, cada una representando un beneficio clave
2. Cada etapa debe tener un elemento visual que represente crecimiento, un título evocador y una descripción persuasiva
3. Animación de crecimiento o evolución entre etapas al hacer scroll
4. Efectos de "florecimiento" o "culminación" al llegar a la etapa final
5. Posible línea de tiempo o camino que conecte todas las etapas

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de Beneficios (divs, sections, articles, etc.).
3. Utilizar SVG para elementos gráficos de crecimiento para máxima calidad y rendimiento.
4. Implementar animaciones de crecimiento optimizadas para dispositivos móviles.
5. Asegurar que el texto se mantenga legible a pesar de los efectos visuales.
6. Proporcionar alternativas más simples para navegadores antiguos.
7. Optimizar todas las animaciones para dispositivos de gama baja.`,
  },
  {
    id: "gift-boxes",
    title: "Cajas de Regalo",
    description: "Beneficios presentados como cajas de regalo que se abren para revelar sorpresas",
    category: "interactivo",
    icon: <Gift className="h-4 w-4" />,
    prompt: `Crea una sección de Beneficios para un sitio web con las siguientes características:

- Estilo: Cajas de regalo que se abren para revelar beneficios
- Plataforma objetivo: mobile-first, completamente responsiva
- Esquema de color: Base oscura con cajas en colores vibrantes (púrpura real, azul eléctrico, verde esmeralda, rojo rubí) y destellos dorados
- Incluir imágenes: Sí
- Estilo de imagen: Cajas de regalo elegantes y su contenido revelado
- Tipo de fuente: Juguetona pero elegante para títulos, sans-serif limpia para descripciones
- Tipo de animación: Cajas que se abren, efectos de "revelación", partículas de celebración
- Estilo de borde: Decorativos como cintas y envoltorios de regalo
- Incluir CTA: Sí, botón con efecto de "regalo especial" al hover

- Optimizaciones de rendimiento: 
  * SVG para elementos gráficos
  * Animaciones CSS optimizadas
  * Preloading de recursos críticos
  * Sistema de partículas ligero
  * Compresión de recursos

- Optimizaciones SEO: Estructura semántica, metadatos completos
- Compatibilidad con navegadores: Feature detection con alternativas
- Interactividad: 
  * Cajas que se abren al interactuar o hacer scroll
  * Efectos de "sorpresa" al revelar el contenido
  * Microinteracciones con partículas y brillos

- Transiciones: Aperturas de cajas entre estados, revelaciones que muestran contenido
- Elementos interactivos: Cajas de regalo que responden a interacciones

- Estilo de código: CSS con animaciones y efectos de partículas optimizados
- Incluir comentarios detallados: Sí

La sección debe tener una estética Cajas de regalo que se abren para revelar beneficios con animaciones Cajas que se abren, efectos de "revelación", partículas de celebración. Utilizar tipografía Juguetona pero elegante para títulos, sans-serif limpia para descripciones y bordes Decorativos como cintas y envoltorios de regalo. El diseño debe ser COMPLETAMENTE RESPONSIVO para todas las plataformas, adaptándose fluidamente desde móviles hasta pantallas de escritorio, utilizando media queries estratégicas y un enfoque de diseño fluido.

CARACTERÍSTICAS ESPECIALES:
1. Entre 4-6 cajas de regalo, cada una representando un beneficio clave
2. Cada caja debe tener un diseño único, un título intrigante y una descripción que enfatice el beneficio
3. Animación de "apertura" de caja al interactuar o hacer scroll
4. Efectos de partículas o brillos que emergen al abrirse la caja
5. Posible efecto de "desenvuelto" con cintas que se desatan

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de Beneficios (divs, sections, articles, etc.).
3. Utilizar SVG para cajas de regalo y elementos decorativos para máxima calidad y rendimiento.
4. Implementar animaciones de apertura optimizadas para dispositivos móviles.
5. Utilizar un sistema de partículas ligero que funcione bien en dispositivos de gama baja.
6. Proporcionar alternativas más simples para navegadores antiguos.
7. Asegurar que el texto se mantenga legible a pesar de los efectos visuales.`,
  },
]

export function BenefitsPresets({ onSelectPreset }: { onSelectPreset: (prompt: string) => void }) {
  const [activeCategory, setActiveCategory] = useState<string>("all")

  // Filtrar presets por categoría
  const filteredPresets =
    activeCategory === "all" ? benefitPresets : benefitPresets.filter((preset) => preset.category === activeCategory)

  return (
    <Card className="border border-purple-500/20 bg-black/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-purple-400" />
          Presets de Prompts para Secciones de Beneficios
        </CardTitle>
        <CardDescription>
          Selecciona uno de estos presets predefinidos para generar un prompt completo para secciones de Beneficios
          vanguardistas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all" onClick={() => setActiveCategory("all")}>
              Todos
            </TabsTrigger>
            <TabsTrigger value="interactivo" onClick={() => setActiveCategory("interactivo")}>
              Interactivo
            </TabsTrigger>
            <TabsTrigger value="místico" onClick={() => setActiveCategory("místico")}>
              Místico
            </TabsTrigger>
            <TabsTrigger value="minimalista" onClick={() => setActiveCategory("minimalista")}>
              Minimalista
            </TabsTrigger>
            <TabsTrigger value="futurista" onClick={() => setActiveCategory("futurista")}>
              Futurista
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
                    {preset.category === "interactivo" && "Interactivo"}
                    {preset.category === "místico" && "Místico"}
                    {preset.category === "minimalista" && "Minimalista"}
                    {preset.category === "inmersivo" && "Inmersivo"}
                    {preset.category === "futurista" && "Futurista"}
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

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sparkles,
  Star,
  MessageCircle,
  Quote,
  Users,
  Heart,
  Gem,
  Moon,
  Compass,
  Feather,
  Scroll,
  Zap,
  Flame,
  CloudMoon,
  Orbit,
  Hourglass,
  Wand2,
  Glasses,
  Lightbulb,
  Bookmark,
} from "lucide-react"

interface TestimonialsPresetsProps {
  onSelectPreset: (prompt: string) => void
}

export function TestimonialsPresets({ onSelectPreset }: TestimonialsPresetsProps) {
  const [activeTab, setActiveTab] = useState("mystical")

  // Presets for Mystical Testimonials
  const mysticalPresets = [
    {
      id: "mystical-cards",
      title: "Mystical Testimonial Cards",
      icon: <Sparkles className="h-4 w-4 mr-2" />,
      description: "Tarjetas de testimonios con efectos de cristal y auras personalizadas",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Místico con tarjetas de cristal translúcido
- Plataforma objetivo: mobile-first
- Esquema de color: Púrpura profundo, azul medianoche, destellos dorados, acentos de turquesa
- Incluir imágenes: Sí
- Estilo de imagen: Retratos circulares con auras personalizadas según el tipo de testimonio
- Tipo de fuente: Etérea con serif para citas, sans-serif ligera para nombres
- Tipo de animación: Aparición suave con efecto de brillo al hacer hover
- Estilo de borde: Bordes difuminados con efecto de luz interna

La sección debe mostrar testimonios de clientes que han experimentado servicios esotéricos. Cada tarjeta debe incluir:
1. Foto del cliente con un aura personalizada según el tipo de servicio recibido
2. Cita testimonial en una tipografía etérea
3. Nombre del cliente y servicio recibido
4. Calificación con estrellas o símbolos místicos (lunas, cristales, etc.)
5. Fecha del testimonio

Características especiales:
- Las tarjetas deben tener un efecto de cristal translúcido con profundidad
- Al hacer hover sobre una tarjeta, debe aparecer un suave brillo que emana desde el centro
- Implementar un carrusel táctil para móviles que muestre 1 testimonio a la vez
- En tablets y desktop, mostrar 2-3 testimonios simultáneamente
- Añadir un sutil efecto parallax al desplazarse por la página
- Incluir un botón para enviar un nuevo testimonio con un icono de pluma o estrella

Optimizaciones de rendimiento:
- Utilizar CSS para los efectos de brillo en lugar de imágenes pesadas
- Cargar imágenes de forma progresiva y optimizada
- Implementar lazy loading para testimonios fuera de la vista
- Minimizar el uso de JavaScript para las animaciones, preferir CSS cuando sea posible
- Asegurar que las animaciones no causen layout shifts

El diseño debe ser completamente responsivo, con especial atención a la experiencia móvil. Los testimonios deben ser fácilmente legibles y transmitir confianza mientras mantienen la estética mística del sitio.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
    {
      id: "ethereal-scrolls",
      title: "Pergaminos Etéreos",
      icon: <Scroll className="h-4 w-4 mr-2" />,
      description: "Testimonios en pergaminos antiguos con efectos de desvanecimiento",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Pergaminos antiguos con efectos de desvanecimiento
- Plataforma objetivo: mobile-first
- Esquema de color: Sepia, marrón antiguo, dorado envejecido, toques de rojo oscuro
- Incluir imágenes: Sí
- Estilo de imagen: Medallones vintage con bordes ornamentados
- Tipo de fuente: Caligráfica para citas, serif antigua para nombres
- Tipo de animación: Desenrollado de pergamino al entrar en viewport
- Estilo de borde: Bordes desgastados con efecto de papel antiguo

La sección debe presentar testimonios como si fueran antiguos pergaminos o manuscritos descubiertos. Cada testimonio debe incluir:
1. Un medallón con la imagen del cliente en estilo vintage
2. La cita testimonial escrita en una elegante caligrafía
3. Firma del cliente con fecha en formato antiguo
4. Pequeños símbolos esotéricos (sellos, runas, símbolos alquímicos) que decoran los bordes

Características especiales:
- Efecto de desenrollado de pergamino cuando el testimonio entra en el viewport
- Textura de papel antiguo con bordes desgastados
- Sutil efecto de luz de vela que ilumina cada pergamino
- Navegación entre testimonios mediante botones con símbolos antiguos
- Efecto de desvanecimiento entre testimonios como si se estuvieran cambiando páginas de un libro antiguo
- Pequeñas manchas de tinta y marcas de agua personalizadas en cada pergamino

Optimizaciones de rendimiento:
- Utilizar texturas SVG ligeras para los efectos de papel
- Precargar solo los testimonios visibles inicialmente
- Implementar lazy loading para testimonios adicionales
- Optimizar las animaciones para evitar reflow
- Utilizar will-change para mejorar el rendimiento de las animaciones

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla mientras mantiene la estética de pergamino antiguo. En móviles, mostrar un pergamino a la vez con navegación táctil. En pantallas más grandes, mostrar 2-3 pergaminos simultáneamente.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
    {
      id: "astral-voices",
      title: "Voces Astrales",
      icon: <CloudMoon className="h-4 w-4 mr-2" />,
      description: "Testimonios flotantes con efectos de cielo nocturno y constelaciones",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Cielo nocturno con constelaciones y nebulosas
- Plataforma objetivo: mobile-first
- Esquema de color: Azul noche profundo, púrpura cósmico, destellos plateados, acentos turquesa
- Incluir imágenes: Sí
- Estilo de imagen: Retratos circulares rodeados de constelaciones personalizadas
- Tipo de fuente: Futurista etérea para citas, sans-serif ligera para nombres
- Tipo de animación: Aparición con efecto de partículas estelares
- Estilo de borde: Bordes difuminados con efecto de luz estelar

La sección debe presentar testimonios como si fueran voces o mensajes provenientes del cosmos. Cada testimonio debe incluir:
1. Foto del cliente rodeada por una constelación personalizada
2. Cita testimonial que parece flotar en el espacio
3. Nombre del cliente y fecha con efecto de brillo estelar
4. Calificación representada por estrellas que realmente brillan
5. Un símbolo astrológico o planetario relacionado con el servicio recibido

Características especiales:
- Fondo animado de cielo nocturno con estrellas que parpadean suavemente
- Efecto parallax donde las estrellas se mueven ligeramente al desplazarse
- Testimonios que aparecen como si emergieran del espacio profundo
- Transiciones entre testimonios con efecto de viaje estelar
- Pequeñas partículas de luz que flotan alrededor de cada testimonio
- Constelaciones personalizadas que conectan elementos clave de cada testimonio

Optimizaciones de rendimiento:
- Utilizar CSS para los efectos de estrellas y partículas
- Implementar el fondo de cielo nocturno con gradientes y SVG ligeros
- Cargar imágenes de forma progresiva y optimizada
- Reducir la densidad de partículas en dispositivos móviles
- Pausar animaciones cuando no están en viewport

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, mostrar un testimonio a la vez con navegación táctil intuitiva. En pantallas más grandes, crear una experiencia inmersiva con múltiples testimonios visibles como una sección del cielo nocturno.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
    {
      id: "crystal-reflections",
      title: "Reflexiones Cristalinas",
      icon: <Gem className="h-4 w-4 mr-2" />,
      description: "Testimonios en facetas de cristales con efectos de refracción",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Cristales facetados con efectos de refracción de luz
- Plataforma objetivo: mobile-first
- Esquema de color: Transparencias cristalinas, azul hielo, violeta amatista, destellos arcoíris
- Incluir imágenes: Sí
- Estilo de imagen: Retratos dentro de cristales facetados
- Tipo de fuente: Geométrica moderna para citas, sans-serif cristalina para nombres
- Tipo de animación: Rotación suave de cristales con efectos de refracción
- Estilo de borde: Facetas geométricas con brillos en las aristas

La sección debe presentar testimonios como si estuvieran contenidos dentro de preciosos cristales. Cada testimonio debe incluir:
1. Foto del cliente visible a través de una faceta del cristal
2. Cita testimonial que parece refractarse a través del cristal
3. Nombre del cliente y tipo de servicio recibido
4. Calificación representada por pequeños cristales de colores
5. Un símbolo o glifo relacionado con el tipo de servicio esotérico

Características especiales:
- Cristales tridimensionales que rotan suavemente al hacer hover
- Efectos de refracción de luz que cambian según el ángulo de visión
- Destellos de luz que recorren las aristas de los cristales
- Transiciones entre testimonios con efecto de prisma
- Fondo con gradiente sutil que interactúa con los cristales
- Cada cristal tiene un color ligeramente distinto según el tipo de servicio

Optimizaciones de rendimiento:
- Utilizar CSS para los efectos de refracción y brillos
- Implementar las rotaciones 3D con transformaciones CSS optimizadas
- Reducir la complejidad de las animaciones en dispositivos de bajo rendimiento
- Cargar imágenes de forma progresiva y optimizada
- Limitar efectos de luz en dispositivos móviles

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, mostrar un cristal a la vez con navegación táctil intuitiva. En pantallas más grandes, crear una disposición de cristales que forme un patrón geométrico armonioso.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
  ]

  // Presets for Ethereal Testimonials
  const etherealPresets = [
    {
      id: "cosmic-whispers",
      title: "Susurros Cósmicos",
      icon: <Orbit className="h-4 w-4 mr-2" />,
      description: "Testimonios que orbitan como planetas con efectos de gravedad",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Sistema planetario con órbitas y gravitación
- Plataforma objetivo: mobile-first
- Esquema de color: Negro espacial, azules profundos, dorados cósmicos, acentos de nebulosa
- Incluir imágenes: Sí
- Estilo de imagen: Retratos circulares como planetas con anillos personalizados
- Tipo de fuente: Futurista elegante para citas, geométrica para nombres
- Tipo de animación: Órbitas planetarias con velocidades variables
- Estilo de borde: Halos luminosos con efectos de atmósfera

La sección debe presentar testimonios como si fueran planetas orbitando alrededor de un sol central (que representa el servicio o la marca). Cada testimonio debe incluir:
1. Foto del cliente como un planeta con características únicas
2. Cita testimonial que aparece al seleccionar el planeta
3. Nombre del cliente y servicio recibido
4. Pequeños "satélites" que representan aspectos destacados del testimonio
5. Un "anillo planetario" cuyo color y densidad refleja la satisfacción del cliente

Características especiales:
- Sistema interactivo donde los planetas-testimonios orbitan a diferentes velocidades
- Al seleccionar un planeta, este se acerca y revela su testimonio completo
- Efecto de gravedad donde el cursor "atrae" ligeramente los planetas cercanos
- Fondo de espacio profundo con nebulosas y estrellas distantes
- Transiciones suaves entre testimonios con efecto de viaje espacial
- Indicador de "sistema solar" que muestra la posición relativa de todos los testimonios

Optimizaciones de rendimiento:
- Utilizar CSS para las órbitas y efectos de gravedad
- Implementar las animaciones con requestAnimationFrame para mejor rendimiento
- Reducir la complejidad del fondo espacial en dispositivos móviles
- Pausar animaciones de planetas no visibles
- Cargar imágenes de forma progresiva y optimizada

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, simplificar el sistema a una órbita principal con navegación táctil. En pantallas más grandes, mostrar el sistema completo con múltiples órbitas y planetas.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
    {
      id: "ethereal-echoes",
      title: "Ecos Etéreos",
      icon: <Feather className="h-4 w-4 mr-2" />,
      description: "Testimonios que flotan como plumas con efectos de viento",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Plumas etéreas flotando en corrientes de aire místico
- Plataforma objetivo: mobile-first
- Esquema de color: Blancos etéreos, azules pálidos, lavanda suave, acentos plateados
- Incluir imágenes: Sí
- Estilo de imagen: Siluetas sutiles dentro de medallones ovalados
- Tipo de fuente: Caligráfica ligera para citas, serif delicada para nombres
- Tipo de animación: Flotación suave con movimientos orgánicos
- Estilo de borde: Bordes difuminados que se desvanecen como niebla

La sección debe presentar testimonios como si fueran ecos o susurros que flotan en el aire. Cada testimonio debe incluir:
1. Una silueta sutil o imagen etérea del cliente
2. Cita testimonial que parece flotar y ondular suavemente
3. Firma estilizada del cliente con fecha en formato elegante
4. Pequeños símbolos etéreos que flotan alrededor del testimonio
5. Un halo o aura sutil que refleja la naturaleza del servicio recibido

Características especiales:
- Testimonios que flotan y se mueven como si estuvieran en corrientes de aire
- Efecto de profundidad donde algunos testimonios parecen más cercanos y otros más lejanos
- Partículas de luz que ocasionalmente atraviesan la escena
- Transiciones entre testimonios con efecto de desvanecimiento etéreo
- Fondo con gradiente sutil que cambia lentamente de color
- Interacción donde al tocar/hacer clic en un testimonio, este se acerca y se vuelve más nítido

Optimizaciones de rendimiento:
- Utilizar CSS para los efectos de flotación y movimiento
- Limitar el número de partículas en dispositivos de bajo rendimiento
- Implementar las animaciones con transformaciones CSS para mejor rendimiento
- Cargar imágenes de forma progresiva y optimizada
- Reducir la complejidad de los efectos en dispositivos móviles

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, mostrar un testimonio principal con indicadores de los demás. En pantallas más grandes, crear una composición etérea con múltiples testimonios visibles a diferentes profundidades.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
    {
      id: "dream-mirrors",
      title: "Espejos de Sueños",
      icon: <Glasses className="h-4 w-4 mr-2" />,
      description: "Testimonios en espejos mágicos con efectos de ondulación",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Espejos mágicos con efectos de ondulación y reflejos
- Plataforma objetivo: mobile-first
- Esquema de color: Plateados mercuriales, azules profundos, púrpuras oníricos, destellos iridiscentes
- Incluir imágenes: Sí
- Estilo de imagen: Retratos que parecen reflejados en espejos antiguos
- Tipo de fuente: Elegante con serif para citas, cursiva estilizada para nombres
- Tipo de animación: Ondulaciones como agua al activar cada espejo
- Estilo de borde: Marcos ornamentados de espejos antiguos con detalles místicos

La sección debe presentar testimonios como si estuvieran contenidos dentro de espejos mágicos que revelan verdades y experiencias. Cada testimonio debe incluir:
1. Imagen del cliente que parece un reflejo en un espejo antiguo
2. Cita testimonial que emerge del espejo con efecto de ondulación
3. Nombre del cliente y servicio recibido grabados en el marco del espejo
4. Pequeños símbolos místicos incrustados en el marco del espejo
5. Un efecto de "profundidad infinita" como si el espejo contuviera un mundo entero

Características especiales:
- Espejos que reaccionan al hover/toque con ondulaciones como agua
- Efecto donde el texto del testimonio parece emerger desde la profundidad del espejo
- Reflejos y destellos de luz que se mueven por la superficie de los espejos
- Marcos de espejos únicos para cada testimonio, con detalles que reflejan el servicio recibido
- Transiciones entre testimonios con efecto de "atravesar el espejo"
- Niebla sutil que ocasionalmente cruza por la superficie de los espejos

Optimizaciones de rendimiento:
- Utilizar CSS para los efectos de ondulación y reflejos
- Implementar los marcos de espejos con SVG para mejor rendimiento
- Cargar imágenes de forma progresiva y optimizada
- Reducir la complejidad de las animaciones en dispositivos de bajo rendimiento
- Limitar efectos de luz y niebla en dispositivos móviles

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, mostrar un espejo a la vez con navegación táctil intuitiva. En pantallas más grandes, crear una galería de espejos mágicos con diferentes tamaños y orientaciones.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
    {
      id: "astral-projections",
      title: "Proyecciones Astrales",
      icon: <Zap className="h-4 w-4 mr-2" />,
      description: "Testimonios como proyecciones holográficas con efectos de distorsión",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Proyecciones holográficas con efectos de distorsión digital
- Plataforma objetivo: mobile-first
- Esquema de color: Azul eléctrico, cian brillante, violeta neón, destellos blancos
- Incluir imágenes: Sí
- Estilo de imagen: Retratos con efecto de proyección holográfica
- Tipo de fuente: Futurista tecnológica para citas, monoespaciada para nombres
- Tipo de animación: Aparición con efecto de escaneo y distorsiones digitales
- Estilo de borde: Marcos luminosos con líneas de energía pulsantes

La sección debe presentar testimonios como si fueran proyecciones astrales o hologramas del futuro. Cada testimonio debe incluir:
1. Imagen del cliente con efecto de proyección holográfica
2. Cita testimonial que aparece como si se estuviera escribiendo en tiempo real
3. Nombre del cliente y fecha con efecto de código digital
4. Líneas de energía o datos que conectan elementos del testimonio
5. Pequeñas "fallas" o "glitches" ocasionales que añaden autenticidad

Características especiales:
- Efecto de proyección holográfica con líneas de escaneo y distorsiones
- Testimonios que aparecen como si se estuvieran materializando desde otra dimensión
- Partículas de energía que fluyen alrededor de cada proyección
- Transiciones entre testimonios con efecto de "cambio de canal" o "sintonización"
- Fondo con grid digital sutil que reacciona a la presencia de los testimonios
- Interacción donde al tocar/hacer clic en un testimonio, este se expande con más detalles

Optimizaciones de rendimiento:
- Utilizar CSS para los efectos de proyección y distorsión
- Implementar las animaciones con transformaciones CSS para mejor rendimiento
- Reducir la frecuencia de "glitches" en dispositivos de bajo rendimiento
- Cargar imágenes de forma progresiva y optimizada
- Simplificar efectos de partículas en dispositivos móviles

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, mostrar una proyección a la vez con controles inspirados en tecnología futurista. En pantallas más grandes, crear un "centro de comunicaciones" con múltiples proyecciones activas.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
  ]

  // Presets for Cosmic Testimonials
  const cosmicPresets = [
    {
      id: "tarot-testimonials",
      title: "Testimonios del Tarot",
      icon: <Bookmark className="h-4 w-4 mr-2" />,
      description: "Testimonios en cartas de tarot interactivas",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Cartas de tarot personalizadas con simbolismo místico
- Plataforma objetivo: mobile-first
- Esquema de color: Dorado antiguo, rojo profundo, azul medianoche, acentos de negro y blanco
- Incluir imágenes: Sí
- Estilo de imagen: Retratos estilizados como ilustraciones de cartas de tarot
- Tipo de fuente: Serif ornamentada para citas, caligráfica para nombres
- Tipo de animación: Volteo de cartas con revelación gradual
- Estilo de borde: Bordes ornamentados con símbolos del tarot y elementos místicos

La sección debe presentar testimonios como si fueran cartas de tarot personalizadas. Cada testimonio debe incluir:
1. Imagen del cliente estilizada como una figura de carta de tarot
2. Cita testimonial que se revela al voltear la carta
3. Nombre del cliente y "arcano" (tipo de servicio) recibido
4. Símbolos del tarot relevantes al testimonio o servicio
5. Fecha del testimonio en formato místico (fases lunares, etc.)

Características especiales:
- Cartas que se voltean con una animación suave al hacer clic/tocar
- Efecto de "adivinación" donde las cartas se barajan antes de mostrar un nuevo testimonio
- Detalles dorados que brillan sutilmente en las cartas
- Fondo con textura de tela de mesa de lectura de tarot
- Transiciones entre testimonios con efecto de "lectura de cartas"
- Pequeños elementos interactivos en cada carta que revelan detalles adicionales

Optimizaciones de rendimiento:
- Utilizar CSS para los efectos de volteo y brillo
- Implementar las texturas con patrones SVG ligeros
- Precargar solo las cartas visibles inicialmente
- Optimizar las imágenes de las cartas para carga rápida
- Reducir la complejidad de las animaciones en dispositivos de bajo rendimiento

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, mostrar una carta a la vez con navegación intuitiva. En pantallas más grandes, crear una "lectura" con múltiples cartas visibles en una disposición significativa.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
    {
      id: "alchemical-reviews",
      title: "Reseñas Alquímicas",
      icon: <Flame className="h-4 w-4 mr-2" />,
      description: "Testimonios en frascos alquímicos con efectos de transformación",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Laboratorio alquímico con frascos y elementos místicos
- Plataforma objetivo: mobile-first
- Esquema de color: Ámbar, verde esmeralda, púrpura alquímico, destellos dorados
- Incluir imágenes: Sí
- Estilo de imagen: Retratos dentro de frascos alquímicos burbujeantes
- Tipo de fuente: Manuscrita antigua para citas, rúnica estilizada para nombres
- Tipo de animación: Burbujeo y transformación de líquidos místicos
- Estilo de borde: Frascos de vidrio con detalles metálicos y runas grabadas

La sección debe presentar testimonios como si fueran experimentos alquímicos o elixires embotellados. Cada testimonio debe incluir:
1. Imagen del cliente dentro de un frasco alquímico personalizado
2. Cita testimonial que aparece como si estuviera escrita en un pergamino antiguo
3. Nombre del cliente y "elixir" (servicio) recibido
4. Símbolos alquímicos relevantes al testimonio o servicio
5. Fecha del testimonio representada con símbolos planetarios

Características especiales:
- Frascos con líquidos que burbujean y cambian de color sutilmente
- Efecto de "transformación" donde un testimonio se convierte en otro
- Pequeñas partículas brillantes que flotan dentro de los frascos
- Fondo con mesa de laboratorio alquímico y elementos decorativos
- Transiciones entre testimonios con efecto de "mezcla de pociones"
- Interacción donde al tocar un frasco, este reacciona con más burbujeo o cambio de color

Optimizaciones de rendimiento:
- Utilizar CSS para los efectos de burbujeo y transformación
- Implementar las texturas con patrones SVG ligeros
- Cargar imágenes de forma progresiva y optimizada
- Reducir la complejidad de las animaciones en dispositivos de bajo rendimiento
- Limitar el número de partículas en dispositivos móviles

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, mostrar un frasco a la vez con navegación intuitiva. En pantallas más grandes, crear un "laboratorio" con múltiples frascos y elementos alquímicos decorativos.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
    {
      id: "time-echoes",
      title: "Ecos del Tiempo",
      icon: <Hourglass className="h-4 w-4 mr-2" />,
      description: "Testimonios en relojes de arena con efectos temporales",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Relojes de arena y elementos temporales místicos
- Plataforma objetivo: mobile-first
- Esquema de color: Dorado antiguo, azul temporal, púrpura crepuscular, arena brillante
- Incluir imágenes: Sí
- Estilo de imagen: Retratos enmarcados en medallones temporales
- Tipo de fuente: Serif antigua para citas, caligráfica fluida para nombres
- Tipo de animación: Flujo de arena y distorsiones temporales
- Estilo de borde: Marcos ornamentados con símbolos de tiempo y eternidad

La sección debe presentar testimonios como si fueran momentos capturados en el tiempo. Cada testimonio debe incluir:
1. Imagen del cliente dentro de un medallón temporal
2. Cita testimonial que aparece como si estuviera escrita en diferentes épocas
3. Nombre del cliente y "momento" (servicio) experimentado
4. Símbolos temporales (relojes, fases lunares, ciclos) relevantes al testimonio
5. Fecha del testimonio representada como coordenadas temporales místicas

Características especiales:
- Relojes de arena que fluyen continuamente, representando el paso del tiempo
- Efecto de "distorsión temporal" donde los testimonios parecen envejecer o rejuvenecer
- Partículas de arena brillante que fluyen entre los diferentes testimonios
- Fondo con nebulosas temporales y constelaciones de relojes
- Transiciones entre testimonios con efecto de "salto temporal"
- Pequeños elementos interactivos que revelan "visiones del pasado o futuro"

Optimizaciones de rendimiento:
- Utilizar CSS para los efectos de flujo de arena y distorsión
- Implementar las texturas con patrones SVG ligeros
- Cargar imágenes de forma progresiva y optimizada
- Reducir la complejidad de las animaciones en dispositivos de bajo rendimiento
- Limitar efectos de partículas en dispositivos móviles

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, mostrar un reloj de arena a la vez con navegación intuitiva. En pantallas más grandes, crear una "galería temporal" con múltiples testimonios de diferentes épocas.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
    {
      id: "elemental-voices",
      title: "Voces Elementales",
      icon: <Flame className="h-4 w-4 mr-2" />,
      description: "Testimonios representados por los cuatro elementos",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Los cuatro elementos (fuego, agua, tierra, aire) con efectos elementales
- Plataforma objetivo: mobile-first
- Esquema de color: Rojo fuego, azul agua, verde tierra, blanco aire con transiciones entre ellos
- Incluir imágenes: Sí
- Estilo de imagen: Retratos rodeados por el elemento correspondiente al servicio
- Tipo de fuente: Orgánica y fluida para citas, rúnica elemental para nombres
- Tipo de animación: Movimientos inspirados en cada elemento (llamas, ondas, crecimiento, brisa)
- Estilo de borde: Marcos que representan cada elemento con símbolos correspondientes

La sección debe presentar testimonios como si fueran manifestaciones de los cuatro elementos. Cada testimonio debe incluir:
1. Imagen del cliente rodeada por efectos del elemento correspondiente
2. Cita testimonial que parece estar escrita o manifestada por ese elemento
3. Nombre del cliente y "elemento" (tipo de servicio) experimentado
4. Símbolos elementales y runas correspondientes al testimonio
5. Una pequeña animación que representa la esencia del elemento

Características especiales:
- Testimonios de fuego con efectos de llamas y chispas
- Testimonios de agua con ondulaciones y flujos líquidos
- Testimonios de tierra con crecimiento de cristales o plantas
- Testimonios de aire con movimientos etéreos y partículas flotantes
- Transiciones entre testimonios con transformaciones elementales
- Fondo que cambia sutilmente según el elemento activo
- Interacción donde al tocar un testimonio, su elemento se intensifica

Optimizaciones de rendimiento:
- Utilizar CSS para los efectos elementales
- Implementar animaciones con CSS optimizado
- Cargar imágenes de forma progresiva y optimizada
- Reducir la complejidad de las animaciones en dispositivos de bajo rendimiento
- Limitar efectos de partículas en dispositivos móviles

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, mostrar un testimonio elemental a la vez. En pantallas más grandes, crear una "rueda elemental" donde los cuatro elementos están representados simultáneamente.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
  ]

  // Presets for Enchanted Testimonials
  const enchantedPresets = [
    {
      id: "grimoire-pages",
      title: "Páginas de Grimorio",
      icon: <Scroll className="h-4 w-4 mr-2" />,
      description: "Testimonios en páginas de libro mágico con efectos de tinta animada",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Páginas de grimorio antiguo con tinta animada
- Plataforma objetivo: mobile-first
- Esquema de color: Sepia envejecido, tinta negra profunda, detalles en rojo sangre, acentos dorados
- Incluir imágenes: Sí
- Estilo de imagen: Retratos como ilustraciones de grimorio con tinta que parece moverse
- Tipo de fuente: Caligráfica antigua para citas, rúnica para nombres
- Tipo de animación: Tinta que se mueve y forma patrones, páginas que se voltean
- Estilo de borde: Bordes de página desgastados con manchas y marcas de uso

La sección debe presentar testimonios como si estuvieran escritos en las páginas de un antiguo libro de hechizos. Cada testimonio debe incluir:
1. Ilustración del cliente en estilo de grimorio con tinta que parece viva
2. Cita testimonial escrita con caligrafía que parece dibujarse sola
3. Firma o sello del cliente con símbolos personalizados
4. Pequeños dibujos y anotaciones mágicas en los márgenes
5. Manchas de tinta, marcas de quemaduras o sellos de cera que añaden autenticidad

Características especiales:
- Efecto de "tinta viva" donde las letras y dibujos parecen moverse sutilmente
- Transición entre testimonios con efecto de página que se voltea
- Textura de papel antiguo con detalles de fibras y manchas
- Pequeños elementos interactivos como notas al margen que se expanden
- Efecto donde la tinta parece secarse gradualmente
- Marcadores de página que permiten navegar entre testimonios

Optimizaciones de rendimiento:
- Utilizar CSS para los efectos de tinta y papel
- Implementar las texturas con patrones SVG ligeros
- Optimizar las animaciones de tinta para dispositivos de bajo rendimiento
- Cargar imágenes de forma progresiva y optimizada
- Reducir la complejidad de las animaciones en dispositivos móviles

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, mostrar una página a la vez con efecto de volteo. En pantallas más grandes, mostrar el grimorio abierto con dos páginas visibles simultáneamente.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
    {
      id: "enchanted-mirrors",
      title: "Espejos Encantados",
      icon: <Wand2 className="h-4 w-4 mr-2" />,
      description: "Testimonios en espejos mágicos con efectos de reflejo y niebla",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Espejos encantados con efectos de reflejo y niebla mística
- Plataforma objetivo: mobile-first
- Esquema de color: Plateado mercurial, azul profundo, púrpura místico, destellos iridiscentes
- Incluir imágenes: Sí
- Estilo de imagen: Retratos que parecen reflejos en espejos mágicos
- Tipo de fuente: Elegante con serif para citas, caligráfica para nombres
- Tipo de animación: Aparición con efecto de niebla que se disipa
- Estilo de borde: Marcos de espejos antiguos con símbolos y glifos tallados

La sección debe presentar testimonios como si aparecieran en espejos mágicos que revelan verdades ocultas. Cada testimonio debe incluir:
1. Imagen del cliente como un reflejo en un espejo encantado
2. Cita testimonial que aparece como si se materializara desde la niebla
3. Nombre del cliente y "visión" (servicio) experimentada
4. Símbolos místicos tallados en el marco del espejo
5. Efectos de luz y niebla que dan profundidad al reflejo

Características especiales:
- Efecto de "niebla mística" que se disipa para revelar cada testimonio
- Reflejos sutiles que cambian ligeramente al mover el cursor/tocar
- Destellos de luz que recorren la superficie de los espejos
- Marcos únicos para cada espejo con detalles que cuentan una historia
- Transiciones entre testimonios con efecto de "desvanecimiento en niebla"
- Pequeños elementos interactivos que revelan "visiones alternativas"

Optimizaciones de rendimiento:
- Utilizar CSS para los efectos de niebla y reflejos
- Implementar los marcos con SVG para mejor rendimiento
- Cargar imágenes de forma progresiva y optimizada
- Reducir la complejidad de las animaciones en dispositivos de bajo rendimiento
- Limitar efectos de luz y niebla en dispositivos móviles

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, mostrar un espejo a la vez con navegación intuitiva. En pantallas más grandes, crear una "galería de espejos" con diferentes tamaños y orientaciones.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
    {
      id: "celestial-spheres",
      title: "Esferas Celestiales",
      icon: <Orbit className="h-4 w-4 mr-2" />,
      description: "Testimonios en esferas celestiales con efectos de constelaciones",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Esferas celestiales con constelaciones y mapas astrales
- Plataforma objetivo: mobile-first
- Esquema de color: Azul noche profundo, dorado celestial, plateado estelar, púrpura cósmico
- Incluir imágenes: Sí
- Estilo de imagen: Retratos dentro de medallones celestiales con estrellas
- Tipo de fuente: Elegante con serif para citas, geométrica para nombres
- Tipo de animación: Rotación suave de esferas con estrellas titilantes
- Estilo de borde: Anillos celestiales con símbolos zodiacales y astronómicos

La sección debe presentar testimonios como si estuvieran inscritos en esferas celestiales o mapas astrales. Cada testimonio debe incluir:
1. Imagen del cliente dentro de un medallón celestial
2. Cita testimonial que parece estar escrita entre las estrellas
3. Nombre del cliente y "constelación" (servicio) experimentada
4. Símbolos astrológicos y celestiales relevantes al testimonio
5. Pequeñas constelaciones que conectan elementos clave del testimonio

Características especiales:
- Esferas celestiales que rotan suavemente revelando diferentes testimonios
- Estrellas que titilan sutilmente en el fondo y alrededor de los testimonios
- Líneas doradas que conectan estrellas formando constelaciones personalizadas
- Efecto de "zoom cósmico" al seleccionar un testimonio específico
- Transiciones entre testimonios con efecto de "viaje estelar"
- Pequeños planetas o cuerpos celestes que orbitan alrededor de cada esfera

Optimizaciones de rendimiento:
- Utilizar CSS para los efectos de rotación y estrellas
- Implementar las constelaciones con SVG ligeros
- Cargar imágenes de forma progresiva y optimizada
- Reducir la complejidad de las animaciones en dispositivos de bajo rendimiento
- Limitar el número de estrellas y efectos en dispositivos móviles

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, mostrar una esfera celestial a la vez con navegación intuitiva. En pantallas más grandes, crear un "mapa celestial" con múltiples esferas y constelaciones visibles.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
    {
      id: "arcane-scrolls",
      title: "Pergaminos Arcanos",
      icon: <Scroll className="h-4 w-4 mr-2" />,
      description: "Testimonios en pergaminos mágicos con sellos y runas",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Pergaminos arcanos con sellos mágicos y runas brillantes
- Plataforma objetivo: mobile-first
- Esquema de color: Pergamino envejecido, tinta roja y negra, sellos dorados, brillos arcanos
- Incluir imágenes: Sí
- Estilo de imagen: Retratos como sellos o emblemas arcanos
- Tipo de fuente: Rúnica estilizada para citas, caligráfica antigua para nombres
- Tipo de animación: Desenrollado de pergaminos con runas que brillan
- Estilo de borde: Bordes desgastados con sellos de cera y cintas

La sección debe presentar testimonios como si estuvieran escritos en antiguos pergaminos mágicos. Cada testimonio debe incluir:
1. Imagen del cliente como un sello o emblema arcano
2. Cita testimonial escrita con tinta que parece cambiar de color
3. Firma del cliente con un sello personal
4. Runas y símbolos arcanos que brillan sutilmente alrededor del texto
5. Sellos de cera que "certifican" la autenticidad del testimonio

Características especiales:
- Efecto de "desenrollado" cuando un pergamino entra en el viewport
- Runas que brillan sutilmente en secuencias específicas
- Textura de pergamino antiguo con detalles de desgaste y manchas
- Sellos de cera que parecen tridimensionales con detalles intrincados
- Transiciones entre testimonios con efecto de "cambio de pergamino"
- Pequeños elementos interactivos como notas al margen o símbolos que revelan significados ocultos

Optimizaciones de rendimiento:
- Utilizar CSS para los efectos de desenrollado y brillo
- Implementar las texturas con patrones SVG ligeros
- Cargar imágenes de forma progresiva y optimizada
- Reducir la complejidad de las animaciones en dispositivos de bajo rendimiento
- Limitar efectos de brillo en dispositivos móviles

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, mostrar un pergamino a la vez con navegación intuitiva. En pantallas más grandes, crear una "biblioteca arcana" con múltiples pergaminos parcialmente visibles.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
  ]

  // Presets for Interactive Testimonials
  const interactivePresets = [
    {
      id: "crystal-ball-reviews",
      title: "Reseñas en Bola de Cristal",
      icon: <Lightbulb className="h-4 w-4 mr-2" />,
      description: "Testimonios en bolas de cristal interactivas",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Bolas de cristal con efectos de niebla y visiones
- Plataforma objetivo: mobile-first
- Esquema de color: Cristal transparente, niebla púrpura y azul, destellos blancos, base negra
- Incluir imágenes: Sí
- Estilo de imagen: Retratos que aparecen como visiones dentro de las bolas de cristal
- Tipo de fuente: Mística elegante para citas, serif ligera para nombres
- Tipo de animación: Aparición con efecto de niebla que se arremolina
- Estilo de borde: Bases ornamentadas para las bolas de cristal con símbolos místicos

La sección debe presentar testimonios como si fueran visiones que aparecen dentro de bolas de cristal. Cada testimonio debe incluir:
1. Imagen del cliente que aparece como una visión dentro de la bola
2. Cita testimonial que se materializa gradualmente desde la niebla
3. Nombre del cliente y "visión" (servicio) experimentada
4. Pequeños símbolos místicos que flotan dentro de la bola
5. Base ornamentada única para cada bola de cristal

Características especiales:
- Efecto de "niebla mística" que se arremolina dentro de las bolas de cristal
- Visiones que aparecen y desaparecen como si fueran predicciones
- Destellos de luz que ocasionalmente cruzan la superficie de las bolas
- Bases ornamentadas con detalles únicos para cada testimonio
- Interacción donde al tocar/hacer hover sobre una bola, la niebla se disipa revelando el testimonio completo
- Transiciones entre testimonios con efecto de "cambio de visión"

Optimizaciones de rendimiento:
- Utilizar CSS para los efectos de niebla y destellos
- Implementar las bases con SVG para mejor rendimiento
- Cargar imágenes de forma progresiva y optimizada
- Reducir la complejidad de las animaciones en dispositivos de bajo rendimiento
- Limitar efectos de niebla en dispositivos móviles

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, mostrar una bola de cristal a la vez con navegación intuitiva. En pantallas más grandes, crear una "mesa de adivinación" con múltiples bolas de cristal de diferentes tamaños.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
    {
      id: "spirit-messages",
      title: "Mensajes Espirituales",
      icon: <MessageCircle className="h-4 w-4 mr-2" />,
      description: "Testimonios como mensajes canalizados del más allá",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Mensajes canalizados del más allá con efectos etéreos
- Plataforma objetivo: mobile-first
- Esquema de color: Blanco etéreo, azul espectral, violeta astral, destellos plateados
- Incluir imágenes: Sí
- Estilo de imagen: Siluetas o retratos con efecto espectral
- Tipo de fuente: Etérea y ligera para citas, caligráfica para firmas
- Tipo de animación: Aparición gradual con efecto de materialización
- Estilo de borde: Bordes difuminados que parecen desvanecerse en el éter

La sección debe presentar testimonios como si fueran mensajes canalizados de espíritus o entidades superiores. Cada testimonio debe incluir:
1. Silueta o imagen del cliente con efecto espectral
2. Cita testimonial que aparece como si estuviera siendo canalizada en tiempo real
3. Firma etérea del cliente con fecha en formato espiritual
4. Símbolos o glifos espirituales que flotan alrededor del mensaje
5. Indicación del "plano" o "dimensión" de donde proviene el mensaje

Características especiales:
- Efecto de "canalización" donde las letras aparecen una a una como si estuvieran siendo dictadas
- Partículas de luz etérea que flotan alrededor de los mensajes
- Suave ondulación o pulsación que da vida a los testimonios
- Transiciones entre testimonios con efecto de "cambio de frecuencia"
- Fondo con sutil niebla espiritual que reacciona al movimiento
- Interacción donde al tocar un mensaje, se revela información adicional "del más allá"

Optimizaciones de rendimiento:
- Utilizar CSS para los efectos etéreos y partículas
- Implementar las animaciones de texto con JavaScript optimizado
- Cargar imágenes de forma progresiva y optimizada
- Reducir la complejidad de las animaciones en dispositivos de bajo rendimiento
- Limitar el número de partículas en dispositivos móviles

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, mostrar un mensaje a la vez con transiciones suaves. En pantallas más grandes, crear una "sesión de canalización" con múltiples mensajes que aparecen en diferentes áreas.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
    {
      id: "oracle-cards",
      title: "Cartas Oraculares",
      icon: <Bookmark className="h-4 w-4 mr-2" />,
      description: "Testimonios en cartas de oráculo interactivas",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Cartas de oráculo con ilustraciones místicas y símbolos
- Plataforma objetivo: mobile-first
- Esquema de color: Índigo profundo, dorado celestial, turquesa místico, acentos de coral
- Incluir imágenes: Sí
- Estilo de imagen: Retratos estilizados como ilustraciones de cartas oraculares
- Tipo de fuente: Serif elegante para citas, caligráfica para nombres
- Tipo de animación: Selección y volteo de cartas con revelación gradual
- Estilo de borde: Bordes ornamentados con símbolos oraculares y detalles dorados

La sección debe presentar testimonios como si fueran cartas de un oráculo místico. Cada testimonio debe incluir:
1. Imagen del cliente estilizada como una ilustración de carta oracular
2. Cita testimonial que se revela al voltear la carta
3. Nombre del cliente y "mensaje" (servicio) recibido
4. Símbolos oraculares y elementos místicos que decoran los bordes de la carta
5. Un "título" o "arcano" único para cada carta que representa la esencia del testimonio

Características especiales:
- Cartas que se voltean con una animación suave al hacer clic/tocar
- Efecto de "selección oracular" donde las cartas se barajan antes de mostrar un nuevo testimonio
- Detalles dorados que brillan sutilmente en las cartas
- Fondo con textura de tela de mesa de lectura oracular
- Transiciones entre testimonios con efecto de "nueva tirada de cartas"
- Pequeños elementos interactivos en cada carta que revelan interpretaciones adicionales

Optimizaciones de rendimiento:
- Utilizar CSS para los efectos de volteo y brillo
- Implementar las texturas con patrones SVG ligeros
- Precargar solo las cartas visibles inicialmente
- Optimizar las imágenes de las cartas para carga rápida
- Reducir la complejidad de las animaciones en dispositivos de bajo rendimiento

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, mostrar una carta a la vez con navegación intuitiva. En pantallas más grandes, crear una "lectura oracular" con múltiples cartas visibles en una disposición significativa.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
    {
      id: "astral-projections",
      title: "Proyecciones Astrales",
      icon: <Zap className="h-4 w-4 mr-2" />,
      description: "Testimonios como proyecciones del plano astral",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Proyecciones astrales con efectos de luz y energía
- Plataforma objetivo: mobile-first
- Esquema de color: Azul astral, violeta espiritual, dorado cósmico, destellos blancos etéreos
- Incluir imágenes: Sí
- Estilo de imagen: Retratos con efecto de proyección astral y aura visible
- Tipo de fuente: Etérea y ligera para citas, geométrica para nombres
- Tipo de animación: Aparición con efecto de materialización desde el plano astral
- Estilo de borde: Auras luminosas con patrones energéticos únicos

La sección debe presentar testimonios como si fueran proyecciones astrales o mensajes desde otros planos de existencia. Cada testimonio debe incluir:
1. Imagen del cliente con efecto de proyección astral y aura visible
2. Cita testimonial que parece flotar y vibrar con energía cósmica
3. Nombre del cliente y "viaje" (servicio) experimentado
4. Símbolos astrales y patrones energéticos que rodean el testimonio
5. Indicación del "plano astral" o "nivel vibracional" del testimonio

Características especiales:
- Efecto de "materialización" donde los testimonios aparecen como si se proyectaran desde otro plano
- Auras de colores que pulsan suavemente alrededor de cada testimonio
- Partículas de energía que fluyen entre los diferentes elementos
- Fondo con sutil representación del plano astral y corrientes energéticas
- Transiciones entre testimonios con efecto de "cambio de frecuencia vibratoria"
- Interacción donde al tocar un testimonio, su energía se intensifica revelando más detalles

Optimizaciones de rendimiento:
- Utilizar CSS para los efectos de aura y energía
- Implementar las partículas con canvas optimizado
- Cargar imágenes de forma progresiva y optimizada
- Reducir la complejidad de las animaciones en dispositivos de bajo rendimiento
- Limitar el número de partículas en dispositivos móviles

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, mostrar una proyección a la vez con navegación intuitiva. En pantallas más grandes, crear un "mapa astral" con múltiples proyecciones visibles a diferentes niveles.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
  ]

  // Additional presets to reach 20 total
  const additionalPresets = [
    {
      id: "sacred-geometry",
      title: "Geometría Sagrada",
      icon: <Compass className="h-4 w-4 mr-2" />,
      description: "Testimonios en patrones de geometría sagrada",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Patrones de geometría sagrada con formas matemáticas perfectas
- Plataforma objetivo: mobile-first
- Esquema de color: Dorado sagrado, azul índigo, blanco puro, acentos de verde esmeralda
- Incluir imágenes: Sí
- Estilo de imagen: Retratos dentro de mandalas o formas geométricas sagradas
- Tipo de fuente: Geométrica precisa para citas, minimalista para nombres
- Tipo de animación: Rotación y transformación de patrones geométricos
- Estilo de borde: Líneas precisas que forman patrones de geometría sagrada

La sección debe presentar testimonios integrados en patrones de geometría sagrada. Cada testimonio debe incluir:
1. Imagen del cliente dentro de un mandala o forma geométrica sagrada personalizada
2. Cita testimonial que sigue el flujo de las líneas geométricas
3. Nombre del cliente y "patrón" (servicio) experimentado
4. Símbolos matemáticos y geométricos relevantes (flor de la vida, merkaba, etc.)
5. Líneas de energía que conectan los diferentes elementos del testimonio

Características especiales:
- Patrones geométricos que rotan suavemente o se transforman al interactuar
- Líneas doradas que brillan y pulsan siguiendo secuencias matemáticas (proporción áurea, secuencia de Fibonacci)
- Efecto donde los patrones parecen existir en múltiples dimensiones
- Transiciones entre testimonios con transformaciones geométricas perfectas
- Fondo con sutil grid de geometría sagrada que reacciona al movimiento
- Interacción donde al tocar un patrón, este se expande revelando capas adicionales

Optimizaciones de rendimiento:
- Utilizar SVG para los patrones geométricos
- Implementar las animaciones con CSS optimizado
- Cargar imágenes de forma progresiva y optimizada
- Reducir la complejidad de las transformaciones en dispositivos de bajo rendimiento
- Limitar efectos de brillo en dispositivos móviles

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, mostrar un patrón a la vez con navegación intuitiva. En pantallas más grandes, crear una "matriz geométrica" donde múltiples patrones interactúan armónicamente.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
    {
      id: "cosmic-whispers",
      title: "Susurros Cósmicos",
      icon: <Quote className="h-4 w-4 mr-2" />,
      description: "Testimonios como mensajes del cosmos",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Mensajes cósmicos con efectos de nebulosas y estrellas
- Plataforma objetivo: mobile-first
- Esquema de color: Negro espacial, azules y púrpuras de nebulosa, destellos estelares
- Incluir imágenes: Sí
- Estilo de imagen: Retratos integrados en constelaciones personalizadas
- Tipo de fuente: Futurista elegante para citas, geométrica para nombres
- Tipo de animación: Aparición con efecto de formación estelar
- Estilo de borde: Nebulosas difuminadas que enmarcan cada testimonio

La sección debe presentar testimonios como si fueran mensajes o susurros provenientes del cosmos. Cada testimonio debe incluir:
1. Imagen del cliente integrada en una constelación personalizada
2. Cita testimonial que parece formarse a partir de estrellas y polvo cósmico
3. Nombre del cliente y "mensaje cósmico" (servicio) recibido
4. Pequeños cuerpos celestes (planetas, cometas) que orbitan alrededor del testimonio
5. Una nebulosa única que enmarca y da carácter a cada testimonio

Características especiales:
- Efecto de "formación estelar" donde las palabras se materializan a partir de polvo cósmico
- Estrellas que titilan sutilmente en el fondo y alrededor de los testimonios
- Pequeños cometas que ocasionalmente cruzan el espacio
- Nebulosas que cambian sutilmente de color y forma
- Transiciones entre testimonios con efecto de "viaje interestelar"
- Interacción donde al tocar una constelación, esta brilla revelando conexiones ocultas

Optimizaciones de rendimiento:
- Utilizar CSS para los efectos de nebulosa y estrellas
- Implementar las constelaciones con SVG ligeros
- Cargar imágenes de forma progresiva y optimizada
- Reducir la complejidad de las animaciones en dispositivos de bajo rendimiento
- Limitar el número de estrellas y efectos en dispositivos móviles

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, mostrar un mensaje cósmico a la vez con navegación intuitiva. En pantallas más grandes, crear un "mapa cósmico" con múltiples testimonios visibles como una sección del universo.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
    {
      id: "soul-echoes",
      title: "Ecos del Alma",
      icon: <Heart className="h-4 w-4 mr-2" />,
      description: "Testimonios como manifestaciones del alma",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Manifestaciones del alma con efectos de luz interior
- Plataforma objetivo: mobile-first
- Esquema de color: Blanco puro, dorado espiritual, azul alma, rosa corazón
- Incluir imágenes: Sí
- Estilo de imagen: Retratos con aura del alma visible
- Tipo de fuente: Caligráfica fluida para citas, serif ligera para nombres
- Tipo de animación: Pulsaciones suaves como latidos del alma
- Estilo de borde: Auras luminosas con patrones únicos para cada alma

La sección debe presentar testimonios como si fueran manifestaciones directas del alma de cada cliente. Cada testimonio debe incluir:
1. Imagen del cliente con un aura única que representa su esencia
2. Cita testimonial que parece emanar directamente desde el corazón
3. Nombre del cliente y "despertar" (servicio) experimentado
4. Símbolos espirituales que representan el camino del alma
5. Patrones de luz que conectan el corazón con la mente en cada testimonio

Características especiales:
- Efecto de "latido del alma" donde cada testimonio pulsa suavemente como un corazón
- Auras de luz que fluyen y cambian sutilmente reflejando emociones
- Pequeñas partículas de luz que emanan desde el centro de cada testimonio
- Transiciones entre testimonios con efecto de "transformación espiritual"
- Fondo con sutil energía que reacciona a la presencia de cada alma
- Interacción donde al tocar un testimonio, su luz interior se intensifica revelando más profundidad

Optimizaciones de rendimiento:
- Utilizar CSS para los efectos de aura y pulsaciones
- Implementar las partículas con canvas optimizado
- Cargar imágenes de forma progresiva y optimizada
- Reducir la complejidad de las animaciones en dispositivos de bajo rendimiento
- Limitar efectos de luz en dispositivos móviles

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, mostrar un eco del alma a la vez con navegación intuitiva. En pantallas más grandes, crear un "coro de almas" donde múltiples testimonios pulsan en armonía.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
    {
      id: "starlight-voices",
      title: "Voces de Luz Estelar",
      icon: <Star className="h-4 w-4 mr-2" />,
      description: "Testimonios como mensajes de luz estelar",
      prompt: `Crea una sección de testimonios para un sitio web esotérico con las siguientes características:

- Estilo: Mensajes de luz estelar con efectos de rayos y destellos
- Plataforma objetivo: mobile-first
- Esquema de color: Azul noche, dorado estelar, blanco brillante, acentos plateados
- Incluir imágenes: Sí
- Estilo de imagen: Retratos iluminados por rayos de luz estelar
- Tipo de fuente: Elegante y ligera para citas, geométrica para nombres
- Tipo de animación: Rayos de luz que revelan gradualmente el contenido
- Estilo de borde: Halos de luz con destellos en las esquinas

La sección debe presentar testimonios como si fueran mensajes transmitidos a través de la luz de las estrellas. Cada testimonio debe incluir:
1. Imagen del cliente iluminada por rayos de luz personalizados
2. Cita testimonial que parece brillar con luz propia
3. Nombre del cliente y "iluminación" (servicio) recibida
4. Pequeños destellos de luz que enfatizan palabras clave
5. Un patrón único de rayos de luz que enmarca cada testimonio

Características especiales:
- Efecto de "revelación lumínica" donde los testimonios se revelan a través de rayos de luz
- Destellos que ocasionalmente intensifican ciertas partes del testimonio
- Rayos de luz que se mueven sutilmente como si respondieran a una energía cósmica
- Transiciones entre testimonios con efecto de "destello estelar"
- Fondo con sutil campo de estrellas que parece tener profundidad
- Interacción donde al tocar un testimonio, su luz se intensifica revelando detalles ocultos

Optimizaciones de rendimiento:
- Utilizar CSS para los efectos de luz y destellos
- Implementar los rayos con gradientes y máscaras para mejor rendimiento
- Cargar imágenes de forma progresiva y optimizada
- Reducir la complejidad de las animaciones en dispositivos de bajo rendimiento
- Limitar efectos de luz en dispositivos móviles

El diseño debe ser completamente responsivo, adaptándose a diferentes tamaños de pantalla. En móviles, mostrar una voz estelar a la vez con navegación intuitiva. En pantallas más grandes, crear una "sinfonía de luz" donde múltiples testimonios brillan con diferentes intensidades.

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección de testimonios.
3. Asegurar que el código sea semánticamente correcto y accesible.
4. Incluir comentarios claros para facilitar futuras modificaciones.
5. Optimizar todas las animaciones para evitar problemas de rendimiento en dispositivos móviles.`,
    },
  ]

  return (
    <Card className="border-purple-500/20 bg-black/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-center">Presets de Testimonios Místicos</CardTitle>
        <CardDescription className="text-center">
          Selecciona un preset para generar un prompt de diseño para secciones de testimonios con estética esotérica
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="mystical" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Místicos</span>
            </TabsTrigger>
            <TabsTrigger value="ethereal" className="text-xs">
              <Feather className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Etéreos</span>
            </TabsTrigger>
            <TabsTrigger value="cosmic" className="text-xs">
              <Moon className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Cósmicos</span>
            </TabsTrigger>
            <TabsTrigger value="enchanted" className="text-xs">
              <Wand2 className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Encantados</span>
            </TabsTrigger>
            <TabsTrigger value="interactive" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Interactivos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mystical">
            <ScrollArea className="h-[320px] pr-4">
              <div className="grid grid-cols-1 gap-3">
                {mysticalPresets.map((preset) => (
                  <div key={preset.id} className="flex flex-col">
                    <Button
                      variant="outline"
                      className="justify-start h-auto py-3 px-4 bg-purple-950/30 hover:bg-purple-900/50 border-purple-500/30 text-left"
                      onClick={() => onSelectPreset(preset.prompt)}
                    >
                      <div className="flex items-center">
                        {preset.icon}
                        <div>
                          <div className="font-medium">{preset.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{preset.description}</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="ethereal">
            <ScrollArea className="h-[320px] pr-4">
              <div className="grid grid-cols-1 gap-3">
                {etherealPresets.map((preset) => (
                  <div key={preset.id} className="flex flex-col">
                    <Button
                      variant="outline"
                      className="justify-start h-auto py-3 px-4 bg-blue-950/30 hover:bg-blue-900/50 border-blue-500/30 text-left"
                      onClick={() => onSelectPreset(preset.prompt)}
                    >
                      <div className="flex items-center">
                        {preset.icon}
                        <div>
                          <div className="font-medium">{preset.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{preset.description}</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="cosmic">
            <ScrollArea className="h-[320px] pr-4">
              <div className="grid grid-cols-1 gap-3">
                {cosmicPresets.map((preset) => (
                  <div key={preset.id} className="flex flex-col">
                    <Button
                      variant="outline"
                      className="justify-start h-auto py-3 px-4 bg-indigo-950/30 hover:bg-indigo-900/50 border-indigo-500/30 text-left"
                      onClick={() => onSelectPreset(preset.prompt)}
                    >
                      <div className="flex items-center">
                        {preset.icon}
                        <div>
                          <div className="font-medium">{preset.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{preset.description}</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="enchanted">
            <ScrollArea className="h-[320px] pr-4">
              <div className="grid grid-cols-1 gap-3">
                {enchantedPresets.map((preset) => (
                  <div key={preset.id} className="flex flex-col">
                    <Button
                      variant="outline"
                      className="justify-start h-auto py-3 px-4 bg-violet-950/30 hover:bg-violet-900/50 border-violet-500/30 text-left"
                      onClick={() => onSelectPreset(preset.prompt)}
                    >
                      <div className="flex items-center">
                        {preset.icon}
                        <div>
                          <div className="font-medium">{preset.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{preset.description}</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="interactive">
            <ScrollArea className="h-[320px] pr-4">
              <div className="grid grid-cols-1 gap-3">
                {[...interactivePresets, ...additionalPresets].map((preset) => (
                  <div key={preset.id} className="flex flex-col">
                    <Button
                      variant="outline"
                      className="justify-start h-auto py-3 px-4 bg-cyan-950/30 hover:bg-cyan-900/50 border-cyan-500/30 text-left"
                      onClick={() => onSelectPreset(preset.prompt)}
                    >
                      <div className="flex items-center">
                        {preset.icon}
                        <div>
                          <div className="font-medium">{preset.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{preset.description}</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-purple-500/20 pt-4">
        <div className="flex items-center">
          <Badge variant="outline" className="bg-purple-500/10 text-purple-200 border-purple-500/30">
            <Users className="h-3 w-3 mr-1" />
            20 Presets
          </Badge>
        </div>
        <Button
          size="sm"
          onClick={() => {
            const randomCategory = ["mystical", "ethereal", "cosmic", "enchanted", "interactive"][
              Math.floor(Math.random() * 5)
            ]
            setActiveTab(randomCategory)

            let presets
            switch (randomCategory) {
              case "mystical":
                presets = mysticalPresets
                break
              case "ethereal":
                presets = etherealPresets
                break
              case "cosmic":
                presets = cosmicPresets
                break
              case "enchanted":
                presets = enchantedPresets
                break
              case "interactive":
                presets = [...interactivePresets, ...additionalPresets]
                break
              default:
                presets = mysticalPresets
            }

            const randomPreset = presets[Math.floor(Math.random() * presets.length)]
            onSelectPreset(randomPreset.prompt)
          }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          Preset Aleatorio
        </Button>
      </CardFooter>
    </Card>
  )
}

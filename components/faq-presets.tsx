"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  HelpCircle,
  Sparkles,
  Moon,
  Sun,
  Star,
  Heart,
  Compass,
  Zap,
  CloudLightning,
  Feather,
  Flower,
} from "lucide-react"

// Definición de tipos para los presets
interface FaqPreset {
  id: string
  title: string
  description: string
  category:
    | "auras"
    | "tarot"
    | "dreams"
    | "meditation"
    | "spirits"
    | "astrology"
    | "pastlives"
    | "psychic"
    | "peace"
    | "general"
  icon: React.ReactNode
  prompt: string
}

// Lista de 10 presets para FAQs esotéricas
const faqPresets: FaqPreset[] = [
  {
    id: "aura-faq",
    title: "Preguntas sobre Auras",
    description: "FAQ con diseño etéreo sobre la interpretación y visualización de auras",
    category: "auras",
    icon: <Sparkles className="h-4 w-4" />,
    prompt: `Crea una sección de FAQ para un sitio web con las siguientes características:

- Estilo: Etéreo y luminoso
- Plataforma objetivo: mobile-first
- Esquema de color: Violetas translúcidos, azules etéreos, blancos luminosos
- Incluir imágenes: Sí
- Estilo de imagen: Ilustraciones minimalistas de auras alrededor de siluetas humanas
- Tipo de fuente: Sans-serif etérea con trazos finos y luminosos
- Tipo de animación: Resplandores suaves que pulsan al expandir cada pregunta
- Estilo de borde: Gradientes sutiles que emulan campos energéticos
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Lazy loading, CSS optimizado, compresión de imágenes
- Optimizaciones SEO: Estructura semántica, microdata para FAQs
- Compatibilidad con navegadores: Todos los dispositivos móviles modernos
- Interactividad: Preguntas que se expanden suavemente, Efectos de resplandor al tocar
- Transiciones: Expansiones fluidas con efecto de "campo energético"
- Elementos esotéricos interactivos: Indicadores de color de aura que cambian según la pregunta seleccionada

- Estilo de código: Tailwind CSS con clases personalizadas
- Incluir comentarios detallados: Sí

La sección debe tener una estética Etéreo y luminoso con animaciones Resplandores suaves que pulsan al expandir cada pregunta. Utilizar tipografía Sans-serif etérea con trazos finos y luminosos y bordes Gradientes sutiles que emulan campos energéticos. El diseño debe estar OPTIMIZADO PARA DISPOSITIVOS MÓVILES, asegurando que todos los elementos sean fácilmente accesibles con el pulgar, con botones de tamaño adecuado para interacción táctil, y una disposición vertical que aproveche el desplazamiento natural en smartphones. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CONTENIDO ESPECÍFICO:
Incluir las siguientes preguntas y respuestas sobre auras:
1. "¿Qué es un aura y cómo puedo verla?" 
2. "¿Qué significan los diferentes colores del aura?"
3. "¿Cómo puedo limpiar o fortalecer mi aura?"
4. "¿Pueden las auras cambiar con el tiempo?"
5. "¿Cómo afectan las emociones a mi aura?"
6. "¿Qué relación existe entre el aura y los chakras?"

CARACTERÍSTICAS ESPECIALES:
1. Cada pregunta debe tener un borde sutil del color relacionado con el tema (ej: violeta para espiritualidad)
2. Al expandir una pregunta, un suave resplandor del color correspondiente debe emanar
3. Incluir un pequeño indicador visual junto a cada pregunta que represente el color de aura relacionado
4. Diseñar un encabezado con efecto de "campo energético" animado
5. Implementar un modo de "visualización de aura" que puede activarse con un botón especial

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar todas las animaciones para dispositivos móviles de gama media y baja.
4. Implementar el componente con el patrón de acordeón para las preguntas y respuestas.
5. Asegurar que todos los textos sean legibles incluso con los efectos visuales aplicados.`,
  },
  {
    id: "tarot-faq",
    title: "Consultas de Tarot",
    description: "FAQ con diseño místico sobre interpretación y lecturas de tarot",
    category: "tarot",
    icon: <Moon className="h-4 w-4" />,
    prompt: `Crea una sección de FAQ para un sitio web con las siguientes características:

- Estilo: Místico y arcano
- Plataforma objetivo: mobile-first
- Esquema de color: Púrpura profundo, dorado antiguo, negro cósmico, detalles en rojo carmesí
- Incluir imágenes: Sí
- Estilo de imagen: Ilustraciones minimalistas de cartas de tarot con líneas doradas
- Tipo de fuente: Serif elegante con toques caligráficos para títulos
- Tipo de animación: Revelaciones graduales con efecto de "voltear carta"
- Estilo de borde: Ornamentos inspirados en cartas de tarot tradicionales
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Imágenes optimizadas, CSS minificado
- Optimizaciones SEO: Schema.org para FAQs, estructura semántica
- Compatibilidad con navegadores: Todos los dispositivos móviles modernos
- Interactividad: Preguntas que se revelan como cartas de tarot, Efectos de "lectura" al expandir
- Transiciones: Efecto de "voltear carta" al revelar respuestas
- Elementos esotéricos interactivos: Símbolos arcanos que aparecen sutilmente al interactuar

- Estilo de código: CSS moderno con variables personalizadas
- Incluir comentarios detallados: Sí

La sección debe tener una estética Místico y arcano con animaciones Revelaciones graduales con efecto de "voltear carta". Utilizar tipografía Serif elegante con toques caligráficos para títulos y bordes Ornamentos inspirados en cartas de tarot tradicionales. El diseño debe estar OPTIMIZADO PARA DISPOSITIVOS MÓVILES, asegurando que todos los elementos sean fácilmente accesibles con el pulgar, con botones de tamaño adecuado para interacción táctil, y una disposición vertical que aproveche el desplazamiento natural en smartphones. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CONTENIDO ESPECÍFICO:
Incluir las siguientes preguntas y respuestas sobre tarot:
1. "¿Cómo debo preparar mi espacio para una lectura de tarot?"
2. "¿Qué significa cuando aparecen muchas cartas invertidas?"
3. "¿Con qué frecuencia puedo hacerme una lectura de tarot?"
4. "¿Cómo puedo conectar mejor con mi baraja de tarot?"
5. "¿Qué diferencia hay entre el Tarot de Marsella, Rider-Waite y Thoth?"
6. "¿Cómo interpreto una tirada de tres cartas?"

CARACTERÍSTICAS ESPECIALES:
1. Cada pregunta debe parecer una carta de tarot cerrada que se "voltea" al seleccionarla
2. Incluir sutiles símbolos arcanos que aparecen y desaparecen en el fondo
3. Diseñar un encabezado con una ilustración minimalista de una mano sosteniendo una carta
4. Implementar un efecto de "adivinación" cuando el usuario mantiene presionada una pregunta
5. Añadir un sutil brillo dorado que recorre los bordes ornamentados

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar las animaciones para que funcionen suavemente en dispositivos móviles.
4. Implementar el componente con el patrón de acordeón para las preguntas y respuestas.
5. Asegurar que los efectos visuales no comprometan la legibilidad del texto.`,
  },
  {
    id: "dream-faq",
    title: "Interpretación de Sueños",
    description: "FAQ con diseño onírico sobre simbolismo y significado de los sueños",
    category: "dreams",
    icon: <CloudLightning className="h-4 w-4" />,
    prompt: `Crea una sección de FAQ para un sitio web con las siguientes características:

- Estilo: Onírico y surrealista
- Plataforma objetivo: mobile-first
- Esquema de color: Azul noche profundo, violeta crepuscular, plateado lunar, detalles en turquesa
- Incluir imágenes: Sí
- Estilo de imagen: Ilustraciones surrealistas minimalistas de símbolos oníricos
- Tipo de fuente: Sans-serif fluida con trazos que parecen desvanecerse
- Tipo de animación: Transiciones nebulosas como entre estados de consciencia
- Estilo de borde: Difuminados que sugieren los límites entre sueño y realidad
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Lazy loading, animaciones optimizadas
- Optimizaciones SEO: Estructura semántica, microdata para FAQs
- Compatibilidad con navegadores: Todos los dispositivos móviles modernos
- Interactividad: Preguntas que se expanden con efecto de "despertar", Elementos que flotan sutilmente
- Transiciones: Desvanecimientos que emulan el paso entre sueño y vigilia
- Elementos esotéricos interactivos: Símbolos oníricos que aparecen y se transforman

- Estilo de código: Tailwind CSS con efectos personalizados
- Incluir comentarios detallados: Sí

La sección debe tener una estética Onírico y surrealista con animaciones Transiciones nebulosas como entre estados de consciencia. Utilizar tipografía Sans-serif fluida con trazos que parecen desvanecerse y bordes Difuminados que sugieren los límites entre sueño y realidad. El diseño debe estar OPTIMIZADO PARA DISPOSITIVOS MÓVILES, asegurando que todos los elementos sean fácilmente accesibles con el pulgar, con botones de tamaño adecuado para interacción táctil, y una disposición vertical que aproveche el desplazamiento natural en smartphones. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CONTENIDO ESPECÍFICO:
Incluir las siguientes preguntas y respuestas sobre interpretación de sueños:
1. "¿Por qué sueño repetidamente con caer al vacío?"
2. "¿Qué significa soñar con agua en diferentes estados?"
3. "¿Cómo puedo recordar mejor mis sueños?"
4. "¿Qué son los sueños lúcidos y cómo puedo experimentarlos?"
5. "¿Tienen significado universal los símbolos en los sueños?"
6. "¿Cómo distinguir entre un sueño profético y uno ordinario?"

CARACTERÍSTICAS ESPECIALES:
1. Fondo con sutil efecto de "niebla onírica" que se mueve muy lentamente
2. Cada pregunta debe tener un símbolo onírico relacionado que flota suavemente
3. Al expandir una respuesta, elementos visuales relacionados aparecen sutilmente
4. Implementar un efecto de "velo que se levanta" cuando se interactúa con las preguntas
5. Añadir un modo "nocturno" especial con colores más profundos y efectos más pronunciados

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar todas las animaciones para dispositivos móviles de gama media y baja.
4. Implementar el componente con el patrón de acordeón para las preguntas y respuestas.
5. Asegurar que los efectos visuales no comprometan la legibilidad del texto.`,
  },
  {
    id: "meditation-faq",
    title: "Técnicas de Meditación",
    description: "FAQ con diseño sereno sobre prácticas y beneficios de la meditación",
    category: "meditation",
    icon: <Feather className="h-4 w-4" />,
    prompt: `Crea una sección de FAQ para un sitio web con las siguientes características:

- Estilo: Sereno y minimalista
- Plataforma objetivo: mobile-first
- Esquema de color: Azul claro zen, verde jade suave, blanco puro, acentos en dorado suave
- Incluir imágenes: Sí
- Estilo de imagen: Ilustraciones minimalistas de posturas de meditación y símbolos de paz
- Tipo de fuente: Sans-serif ligera y espaciada que transmite calma
- Tipo de animación: Transiciones suaves que emulan respiración profunda
- Estilo de borde: Líneas finas y limpias con esquinas redondeadas
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Código limpio y eficiente, animaciones ligeras
- Optimizaciones SEO: Estructura semántica, microdata para FAQs
- Compatibilidad con navegadores: Todos los dispositivos móviles modernos
- Interactividad: Expansión suave y armoniosa, Efectos sutiles de respiración en elementos
- Transiciones: Movimientos fluidos inspirados en técnicas de respiración
- Elementos esotéricos interactivos: Mandalas minimalistas que se completan al expandir respuestas

- Estilo de código: CSS minimalista con variables para temas
- Incluir comentarios detallados: Sí

La sección debe tener una estética Sereno y minimalista con animaciones Transiciones suaves que emulan respiración profunda. Utilizar tipografía Sans-serif ligera y espaciada que transmite calma y bordes Líneas finas y limpias con esquinas redondeadas. El diseño debe estar OPTIMIZADO PARA DISPOSITIVOS MÓVILES, asegurando que todos los elementos sean fácilmente accesibles con el pulgar, con botones de tamaño adecuado para interacción táctil, y una disposición vertical que aproveche el desplazamiento natural en smartphones. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CONTENIDO ESPECÍFICO:
Incluir las siguientes preguntas y respuestas sobre meditación:
1. "¿Cuál es la mejor postura para meditar si tengo problemas de espalda?"
2. "¿Cómo puedo calmar mi mente cuando está llena de pensamientos?"
3. "¿Cuánto tiempo debo meditar cada día para ver beneficios?"
4. "¿Cuál es la diferencia entre meditación de atención plena y meditación trascendental?"
5. "¿Cómo puedo incorporar la meditación en mi rutina diaria?"
6. "¿Qué hacer cuando me quedo dormido durante la meditación?"

CARACTERÍSTICAS ESPECIALES:
1. Implementar un sutil efecto de "respiración" en el contenedor principal (expandirse y contraerse muy suavemente)
2. Cada pregunta debe tener un pequeño ícono zen relacionado con su contenido
3. Incluir un temporizador de respiración minimalista que el usuario puede activar
4. Diseñar un encabezado con un mandala simple que rota muy lentamente
5. Añadir un modo "meditación" que simplifica aún más la interfaz y reduce distracciones

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar todas las animaciones para que sean extremadamente suaves y no distraigan.
4. Implementar el componente con el patrón de acordeón para las preguntas y respuestas.
5. Asegurar que la experiencia transmita calma y serenidad en cada interacción.`,
  },
  {
    id: "spirit-guides-faq",
    title: "Guías Espirituales",
    description: "FAQ con diseño etéreo sobre conexión con guías y entidades espirituales",
    category: "spirits",
    icon: <Star className="h-4 w-4" />,
    prompt: `Crea una sección de FAQ para un sitio web con las siguientes características:

- Estilo: Etéreo y celestial
- Plataforma objetivo: mobile-first
- Esquema de color: Azul celeste, blanco luminoso, dorado suave, toques de violeta espiritual
- Incluir imágenes: Sí
- Estilo de imagen: Siluetas etéreas de figuras angélicas y símbolos de protección
- Tipo de fuente: Serif ligera con trazos que parecen desvanecerse hacia los bordes
- Tipo de animación: Apariciones graduales como manifestaciones etéreas
- Estilo de borde: Brillos sutiles que sugieren presencias espirituales
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Imágenes optimizadas, código eficiente
- Optimizaciones SEO: Estructura semántica, microdata para FAQs
- Compatibilidad con navegadores: Todos los dispositivos móviles modernos
- Interactividad: Elementos que aparecen como manifestaciones, Respuestas que se revelan gradualmente
- Transiciones: Desvanecimientos que sugieren el paso entre dimensiones
- Elementos esotéricos interactivos: Símbolos de protección que brillan al activarse

- Estilo de código: CSS con efectos de luz y transparencia
- Incluir comentarios detallados: Sí

La sección debe tener una estética Etéreo y celestial con animaciones Apariciones graduales como manifestaciones etéreas. Utilizar tipografía Serif ligera con trazos que parecen desvanecerse hacia los bordes y bordes Brillos sutiles que sugieren presencias espirituales. El diseño debe estar OPTIMIZADO PARA DISPOSITIVOS MÓVILES, asegurando que todos los elementos sean fácilmente accesibles con el pulgar, con botones de tamaño adecuado para interacción táctil, y una disposición vertical que aproveche el desplazamiento natural en smartphones. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CONTENIDO ESPECÍFICO:
Incluir las siguientes preguntas y respuestas sobre guías espirituales:
1. "¿Cómo puedo identificar a mis guías espirituales?"
2. "¿Cuál es la diferencia entre un guía espiritual y un ángel guardián?"
3. "¿Cómo puedo fortalecer mi conexión con mis guías?"
4. "¿Por qué a veces siento una presencia protectora a mi alrededor?"
5. "¿Pueden cambiar mis guías espirituales a lo largo de mi vida?"
6. "¿Cómo puedo pedir ayuda específica a mis guías espirituales?"

CARACTERÍSTICAS ESPECIALES:
1. Fondo con sutil efecto de "luz celestial" que se mueve muy lentamente
2. Cada pregunta debe tener un símbolo de protección que brilla suavemente al expandirse
3. Implementar un efecto de "velo que se levanta" entre dimensiones al revelar respuestas
4. Diseñar un encabezado con siluetas etéreas que aparecen y desaparecen sutilmente
5. Añadir un modo "conexión" que intensifica los efectos visuales para una experiencia más inmersiva

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar todas las animaciones para dispositivos móviles de gama media y baja.
4. Implementar el componente con el patrón de acordeón para las preguntas y respuestas.
5. Asegurar que los efectos visuales no comprometan la legibilidad del texto.`,
  },
  {
    id: "astrology-faq",
    title: "Astrología Práctica",
    description: "FAQ con diseño cósmico sobre interpretación astrológica y cartas natales",
    category: "astrology",
    icon: <Sun className="h-4 w-4" />,
    prompt: `Crea una sección de FAQ para un sitio web con las siguientes características:

- Estilo: Cósmico y astronómico
- Plataforma objetivo: mobile-first
- Esquema de color: Azul noche profundo, dorado estelar, púrpura cósmico, detalles en plateado lunar
- Incluir imágenes: Sí
- Estilo de imagen: Ilustraciones minimalistas de constelaciones y símbolos zodiacales
- Tipo de fuente: Geométrica moderna para títulos, serif elegante para contenido
- Tipo de animación: Movimientos orbitales sutiles y destellos estelares
- Estilo de borde: Líneas finas que emulan órbitas planetarias
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Imágenes vectoriales optimizadas, código eficiente
- Optimizaciones SEO: Estructura semántica, microdata para FAQs
- Compatibilidad con navegadores: Todos los dispositivos móviles modernos
- Interactividad: Elementos que siguen movimientos planetarios, Respuestas que se revelan con efectos cósmicos
- Transiciones: Expansiones que emulan el movimiento de cuerpos celestes
- Elementos esotéricos interactivos: Símbolos zodiacales que brillan según su elemento

- Estilo de código: CSS con animaciones inspiradas en movimientos celestes
- Incluir comentarios detallados: Sí

La sección debe tener una estética Cósmico y astronómico con animaciones Movimientos orbitales sutiles y destellos estelares. Utilizar tipografía Geométrica moderna para títulos, serif elegante para contenido y bordes Líneas finas que emulan órbitas planetarias. El diseño debe estar OPTIMIZADO PARA DISPOSITIVOS MÓVILES, asegurando que todos los elementos sean fácilmente accesibles con el pulgar, con botones de tamaño adecuado para interacción táctil, y una disposición vertical que aproveche el desplazamiento natural en smartphones. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CONTENIDO ESPECÍFICO:
Incluir las siguientes preguntas y respuestas sobre astrología:
1. "¿Cómo afectan los tránsitos planetarios a mi carta natal?"
2. "¿Qué significa tener varios planetas en una misma casa?"
3. "¿Cómo interpretar correctamente mi ascendente?"
4. "¿Qué impacto tienen los nodos lunares en mi destino?"
5. "¿Cómo me afectan los períodos de Mercurio retrógrado?"
6. "¿Cuál es la diferencia entre astrología tropical y sideral?"

CARACTERÍSTICAS ESPECIALES:
1. Fondo con sutil efecto de "cielo estrellado" con micro-animaciones de estrellas titilantes
2. Cada pregunta debe tener el símbolo zodiacal relacionado que orbita suavemente
3. Implementar un efecto de "expansión cósmica" al revelar las respuestas
4. Diseñar un encabezado con un sistema solar minimalista en movimiento orbital lento
5. Añadir un selector de "elemento zodiacal" (fuego, tierra, aire, agua) que filtra las preguntas

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar todas las animaciones para dispositivos móviles de gama media y baja.
4. Implementar el componente con el patrón de acordeón para las preguntas y respuestas.
5. Asegurar que los símbolos astrológicos sean precisos y culturalmente correctos.`,
  },
  {
    id: "pastlives-faq",
    title: "Vidas Pasadas",
    description: "FAQ con diseño antiguo sobre regresiones y memorias de vidas anteriores",
    category: "pastlives",
    icon: <Compass className="h-4 w-4" />,
    prompt: `Crea una sección de FAQ para un sitio web con las siguientes características:

- Estilo: Antiguo y reminiscente
- Plataforma objetivo: mobile-first
- Esquema de color: Sepia envejecido, marrón pergamino, dorado antiguo, toques de verde jade
- Incluir imágenes: Sí
- Estilo de imagen: Ilustraciones estilo grabado antiguo de símbolos de reencarnación
- Tipo de fuente: Serif antigua con apariencia de texto manuscrito para títulos
- Tipo de animación: Transiciones que emulan el paso de páginas de un libro antiguo
- Estilo de borde: Ornamentos que recuerdan a manuscritos antiguos
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Imágenes optimizadas, código eficiente
- Optimizaciones SEO: Estructura semántica, microdata para FAQs
- Compatibilidad con navegadores: Todos los dispositivos móviles modernos
- Interactividad: Elementos que revelan "memorias pasadas", Respuestas que se despliegan como pergaminos
- Transiciones: Efectos de "desvanecimiento temporal" entre estados
- Elementos esotéricos interactivos: Símbolos de reencarnación que se transforman al activarse

- Estilo de código: CSS con efectos de envejecido y texturas
- Incluir comentarios detallados: Sí

La sección debe tener una estética Antiguo y reminiscente con animaciones Transiciones que emulan el paso de páginas de un libro antiguo. Utilizar tipografía Serif antigua con apariencia de texto manuscrito para títulos y bordes Ornamentos que recuerdan a manuscritos antiguos. El diseño debe estar OPTIMIZADO PARA DISPOSITIVOS MÓVILES, asegurando que todos los elementos sean fácilmente accesibles con el pulgar, con botones de tamaño adecuado para interacción táctil, y una disposición vertical que aproveche el desplazamiento natural en smartphones. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CONTENIDO ESPECÍFICO:
Incluir las siguientes preguntas y respuestas sobre vidas pasadas:
1. "¿Cómo puedo saber si he vivido antes?"
2. "¿Qué son las marcas de nacimiento y su relación con vidas pasadas?"
3. "¿Cómo funciona una sesión de regresión a vidas pasadas?"
4. "¿Por qué tengo fobias inexplicables o atracciones a ciertos lugares?"
5. "¿Cómo influyen mis vidas pasadas en mis relaciones actuales?"
6. "¿Qué significa encontrar 'almas gemelas' de vidas anteriores?"

CARACTERÍSTICAS ESPECIALES:
1. Fondo con sutil textura de pergamino antiguo con bordes desgastados
2. Cada pregunta debe parecer una entrada en un diario o libro de memorias antiguo
3. Implementar un efecto de "desvanecimiento temporal" al revelar las respuestas
4. Diseñar un encabezado con un reloj antiguo cuyas manecillas giran lentamente hacia atrás
5. Añadir un "timeline" vertical con marcas de diferentes épocas históricas

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar todas las animaciones para dispositivos móviles de gama media y baja.
4. Implementar el componente con el patrón de acordeón para las preguntas y respuestas.
5. Utilizar texturas y efectos de envejecido que no comprometan la legibilidad del texto.`,
  },
  {
    id: "psychic-faq",
    title: "Habilidades Psíquicas",
    description: "FAQ con diseño energético sobre desarrollo de capacidades psíquicas",
    category: "psychic",
    icon: <Zap className="h-4 w-4" />,
    prompt: `Crea una sección de FAQ para un sitio web con las siguientes características:

- Estilo: Energético y vibrante
- Plataforma objetivo: mobile-first
- Esquema de color: Púrpura eléctrico, azul intenso, destellos dorados, negro profundo
- Incluir imágenes: Sí
- Estilo de imagen: Ilustraciones de ondas energéticas y símbolos de percepción extrasensorial
- Tipo de fuente: Sans-serif futurista con trazos dinámicos
- Tipo de animación: Pulsos energéticos y ondas que emanan de los elementos
- Estilo de borde: Líneas energéticas que parecen vibrar con poder psíquico
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Animaciones optimizadas, código eficiente
- Optimizaciones SEO: Estructura semántica, microdata para FAQs
- Compatibilidad con navegadores: Todos los dispositivos móviles modernos
- Interactividad: Elementos que emiten "ondas psíquicas", Respuestas que se revelan con efectos de energía
- Transiciones: Pulsos y ondas que sugieren transmisión de energía psíquica
- Elementos esotéricos interactivos: Símbolos de percepción extrasensorial que se activan

- Estilo de código: CSS con animaciones de energía y vibración
- Incluir comentarios detallados: Sí

La sección debe tener una estética Energético y vibrante con animaciones Pulsos energéticos y ondas que emanan de los elementos. Utilizar tipografía Sans-serif futurista con trazos dinámicos y bordes Líneas energéticas que parecen vibrar con poder psíquico. El diseño debe estar OPTIMIZADO PARA DISPOSITIVOS MÓVILES, asegurando que todos los elementos sean fácilmente accesibles con el pulgar, con botones de tamaño adecuado para interacción táctil, y una disposición vertical que aproveche el desplazamiento natural en smartphones. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CONTENIDO ESPECÍFICO:
Incluir las siguientes preguntas y respuestas sobre habilidades psíquicas:
1. "¿Cómo puedo saber si tengo habilidades psíquicas latentes?"
2. "¿Cuál es la diferencia entre clarividencia, clariaudiencia y clarisentiencia?"
3. "¿Qué ejercicios puedo practicar para desarrollar mi intuición?"
4. "¿Por qué a veces siento la energía de otras personas como si fuera mía?"
5. "¿Cómo puedo protegerme energéticamente cuando desarrollo mis habilidades?"
6. "¿Es normal sentir agotamiento después de experiencias psíquicas intensas?"

CARACTERÍSTICAS ESPECIALES:
1. Fondo con sutil efecto de "ondas energéticas" que pulsan ocasionalmente
2. Cada pregunta debe tener un símbolo de percepción extrasensorial que emite pulsos de energía
3. Implementar un efecto de "expansión energética" al revelar las respuestas
4. Diseñar un encabezado con un "tercer ojo" minimalista que parpadea sutilmente
5. Añadir un medidor de "frecuencia psíquica" que responde a la interacción del usuario

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar todas las animaciones para dispositivos móviles de gama media y baja.
4. Implementar el componente con el patrón de acordeón para las preguntas y respuestas.
5. Asegurar que los efectos energéticos no distraigan demasiado de la lectura del contenido.`,
  },
  {
    id: "inner-peace-faq",
    title: "Paz Interior",
    description: "FAQ con diseño sereno sobre prácticas para encontrar equilibrio espiritual",
    category: "peace",
    icon: <Heart className="h-4 w-4" />,
    prompt: `Crea una sección de FAQ para un sitio web con las siguientes características:

- Estilo: Sereno y equilibrado
- Plataforma objetivo: mobile-first
- Esquema de color: Verde salvia suave, azul cielo claro, blanco puro, toques de rosa cuarzo
- Incluir imágenes: Sí
- Estilo de imagen: Ilustraciones minimalistas de símbolos de equilibrio y armonía
- Tipo de fuente: Sans-serif redondeada y amable que transmite calma
- Tipo de animación: Movimientos suaves como agua tranquila
- Estilo de borde: Líneas suaves con esquinas completamente redondeadas
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Código limpio, animaciones ligeras
- Optimizaciones SEO: Estructura semántica, microdata para FAQs
- Compatibilidad con navegadores: Todos los dispositivos móviles modernos
- Interactividad: Elementos que se mueven con fluidez armónica, Respuestas que se revelan con calma
- Transiciones: Ondulaciones suaves como agua en calma
- Elementos esotéricos interactivos: Símbolos de equilibrio que se balancean suavemente

- Estilo de código: CSS con transiciones fluidas y armónicas
- Incluir comentarios detallados: Sí

La sección debe tener una estética Sereno y equilibrado con animaciones Movimientos suaves como agua tranquila. Utilizar tipografía Sans-serif redondeada y amable que transmite calma y bordes Líneas suaves con esquinas completamente redondeadas. El diseño debe estar OPTIMIZADO PARA DISPOSITIVOS MÓVILES, asegurando que todos los elementos sean fácilmente accesibles con el pulgar, con botones de tamaño adecuado para interacción táctil, y una disposición vertical que aproveche el desplazamiento natural en smartphones. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CONTENIDO ESPECÍFICO:
Incluir las siguientes preguntas y respuestas sobre paz interior:
1. "¿Cómo puedo encontrar calma en medio del caos diario?"
2. "¿Qué prácticas espirituales son más efectivas para cultivar paz interior?"
3. "¿Cómo puedo liberar emociones negativas que perturban mi equilibrio?"
4. "¿Cuál es la relación entre el perdón y la paz interior?"
5. "¿Cómo puedo mantener mi centro en situaciones de conflicto?"
6. "¿Qué papel juega la gratitud en encontrar paz espiritual?"

CARACTERÍSTICAS ESPECIALES:
1. Fondo con sutil degradado que cambia muy lentamente entre tonos serenos
2. Cada pregunta debe tener un pequeño símbolo de equilibrio que se balancea suavemente
3. Implementar un efecto de "ondas concéntricas" que emanan suavemente al expandir respuestas
4. Diseñar un encabezado con un símbolo yin-yang minimalista que rota muy lentamente
5. Añadir un pequeño medidor de "nivel de serenidad" que el usuario puede ajustar como preferencia visual

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar todas las animaciones para que sean extremadamente suaves y no distraigan.
4. Implementar el componente con el patrón de acordeón para las preguntas y respuestas.
5. Asegurar que la experiencia transmita calma y serenidad en cada interacción.`,
  },
  {
    id: "chakra-faq",
    title: "Sistema de Chakras",
    description: "FAQ con diseño energético sobre los centros de energía y su equilibrio",
    category: "general",
    icon: <Flower className="h-4 w-4" />,
    prompt: `Crea una sección de FAQ para un sitio web con las siguientes características:

- Estilo: Energético y vibracional
- Plataforma objetivo: mobile-first
- Esquema de color: Los siete colores de los chakras (rojo, naranja, amarillo, verde, azul, índigo, violeta)
- Incluir imágenes: Sí
- Estilo de imagen: Ilustraciones minimalistas de los chakras y sus símbolos
- Tipo de fuente: Sans-serif clara con equilibrio entre fuerza y fluidez
- Tipo de animación: Rotaciones suaves como energía girando en los centros de chakras
- Estilo de borde: Gradientes sutiles que representan los colores de los chakras
- Incluir información de contacto: No

- Optimizaciones de rendimiento: Imágenes SVG optimizadas, código eficiente
- Optimizaciones SEO: Estructura semántica, microdata para FAQs
- Compatibilidad con navegadores: Todos los dispositivos móviles modernos
- Interactividad: Elementos que rotan como chakras, Respuestas que se revelan con expansión energética
- Transiciones: Flujos de energía entre elementos que emulan kundalini
- Elementos esotéricos interactivos: Símbolos de chakras que brillan según su frecuencia

- Estilo de código: CSS con animaciones de rotación y flujo energético
- Incluir comentarios detallados: Sí

La sección debe tener una estética Energético y vibracional con animaciones Rotaciones suaves como energía girando en los centros de chakras. Utilizar tipografía Sans-serif clara con equilibrio entre fuerza y fluidez y bordes Gradientes sutiles que representan los colores de los chakras. El diseño debe estar OPTIMIZADO PARA DISPOSITIVOS MÓVILES, asegurando que todos los elementos sean fácilmente accesibles con el pulgar, con botones de tamaño adecuado para interacción táctil, y una disposición vertical que aproveche el desplazamiento natural en smartphones. El diseño debe ser responsivo, moderno y visualmente impactante, con elementos que evoquen misterio y lo esotérico.

CONTENIDO ESPECÍFICO:
Incluir las siguientes preguntas y respuestas sobre chakras:
1. "¿Cómo puedo saber si tengo algún chakra bloqueado?"
2. "¿Cuál es la relación entre los chakras y la salud física?"
3. "¿Qué prácticas son más efectivas para equilibrar cada chakra?"
4. "¿Cómo afectan las emociones negativas a nuestros chakras?"
5. "¿Qué alimentos y cristales corresponden a cada chakra?"
6. "¿Cómo se relacionan los chakras con la kundalini?"

CARACTERÍSTICAS ESPECIALES:
1. Cada pregunta debe estar asociada visualmente con el color del chakra relacionado
2. Implementar un sistema donde cada respuesta expandida muestra el símbolo del chakra correspondiente
3. Diseñar un encabezado con los siete chakras alineados verticalmente que brillan secuencialmente
4. Añadir un selector de chakra que permite filtrar las preguntas por centro energético
5. Incluir un sutil efecto de "energía fluyendo" entre las preguntas cuando se expanden

REQUISITOS TÉCNICOS IMPORTANTES:
1. NO INCLUIR etiquetas básicas de HTML como <!DOCTYPE>, <html>, <head>, <meta>, <title> o <body>. Estas ya existen en mi web.
2. SOLO GENERAR el contenido específico de la sección solicitada (divs, sections, articles, etc.).
3. Optimizar todas las animaciones para dispositivos móviles de gama media y baja.
4. Implementar el componente con el patrón de acordeón para las preguntas y respuestas.
5. Asegurar que los colores de los chakras sean precisos según la tradición yóguica.`,
  },
]

export function FaqPresets({ onSelectPreset }: { onSelectPreset: (prompt: string) => void }) {
  const [activeCategory, setActiveCategory] = useState<string>("all")

  // Filtrar presets por categoría
  const filteredPresets =
    activeCategory === "all" ? faqPresets : faqPresets.filter((preset) => preset.category === activeCategory)

  return (
    <Card className="border border-purple-500/20 bg-black/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-purple-400" />
          Presets de Prompts para FAQs Esotéricas
        </CardTitle>
        <CardDescription>
          Selecciona uno de estos presets predefinidos para generar un prompt completo para secciones de preguntas
          frecuentes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all" onClick={() => setActiveCategory("all")}>
              Todos
            </TabsTrigger>
            <TabsTrigger value="auras" onClick={() => setActiveCategory("auras")}>
              Auras
            </TabsTrigger>
            <TabsTrigger value="tarot" onClick={() => setActiveCategory("tarot")}>
              Tarot
            </TabsTrigger>
            <TabsTrigger value="dreams" onClick={() => setActiveCategory("dreams")}>
              Sueños
            </TabsTrigger>
            <TabsTrigger value="meditation" onClick={() => setActiveCategory("meditation")}>
              Meditación
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
                    {preset.category === "auras" && "Auras"}
                    {preset.category === "tarot" && "Tarot"}
                    {preset.category === "dreams" && "Sueños"}
                    {preset.category === "meditation" && "Meditación"}
                    {preset.category === "spirits" && "Guías Espirituales"}
                    {preset.category === "astrology" && "Astrología"}
                    {preset.category === "pastlives" && "Vidas Pasadas"}
                    {preset.category === "psychic" && "Habilidades Psíquicas"}
                    {preset.category === "peace" && "Paz Interior"}
                    {preset.category === "general" && "General"}
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

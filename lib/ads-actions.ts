"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface Ad {
  titles: string[]
  descriptions: string[]
  keywords: string[]
  finalUrl: string
  campaignName?: string
  adGroupName?: string
}

// Conjunto global para rastrear todos los títulos y descripciones usados
const globalUsedTitles = new Set<string>()
const globalUsedDescriptions = new Set<string>()

// Modificar la función generateSingleAd para mejorar el aprovechamiento de caracteres y garantizar unicidad
async function generateSingleAd(
  keywordsString: string,
  primaryKeyword: string,
  keywords: string[],
  usedTitles: Set<string>,
  usedDescriptions: Set<string>,
  adIndex: number,
  adObjective = "aumentar_ctr",
  writingStyle = "persuasivo",
): Promise<{ titles: string[]; descriptions: string[] }> {
  // Seleccionar estilos de escritura diferentes para cada anuncio
  const selectedStyles = selectRandomElements(writingStyles, 3, adIndex)
  const styleNames = selectedStyles.map((style) => style.name).join(", ")
  const styleExamples = selectedStyles.flatMap((style) => style.examples).join(", ")

  // Seleccionar estructuras de títulos diferentes para cada anuncio
  const selectedTitleStructures = selectRandomElements(titleStructures, 5, adIndex)

  // Seleccionar estructuras de descripciones diferentes para cada anuncio
  const selectedDescStructures = selectRandomElements(descriptionStructures, 3, adIndex)

  // Generar títulos con un prompt mejorado y más diverso
  const titles: string[] = []

  try {
    const titlesPrompt = `
Genera 25 títulos persuasivos y COMPLETAMENTE DIFERENTES para anuncios de Google Ads sobre: "${keywordsString}".

INSTRUCCIONES DETALLADAS:
1. CADA TÍTULO DEBE INCLUIR LA TEMÁTICA DE LAS PALABRAS CLAVE proporcionadas
2. La palabra clave principal "${primaryKeyword}" debe aparecer en la mayoría de los títulos, ADAPTÁNDOLA GRAMATICALMENTE para que tenga sentido
3. Si la palabra clave es un verbo en primera persona (como "quitarme una brujería"), TRANSFÓRMALA a una forma gramatical correcta:
   - "quitarme una brujería" → "quitar una brujería", "quitamos brujería", "quita brujería ahora"
4. APROVECHA AL MÁXIMO EL ESPACIO: Cada título debe tener entre 27-30 caracteres (¡IMPORTANTE!)
5. NO uses signos de puntuación
6. EVITA REPETIR ESTRUCTURAS - cada título debe ser único en su enfoque
7. Usa los siguientes estilos de escritura: ${styleNames}
8. Incorpora palabras de acción como: ${styleExamples}
9. Utiliza estas estructuras variadas para los títulos:
   ${selectedTitleStructures.join("\n   ")}
10. IMPORTANTE: Cada título DEBE SER UNA FRASE COMPLETA Y GRAMATICALMENTE CORRECTA, no solo palabras clave unidas
11. USA PALABRAS SENCILLAS Y COMUNES, evita tecnicismos o sinónimos raros (el público objetivo es de nivel educativo básico)
12. NO DEJES PALABRAS O LETRAS SUELTAS AL FINAL de los títulos, corta la frase antes si es necesario
13. OBJETIVO DEL ANUNCIO: ${getAdObjectiveDescription(adObjective)}

EJEMPLOS DE TÍTULOS CORRECTOS (no uses estos exactamente):
- "Haga su Amarre de Amor Efectivo" (27 caracteres)
- "Amarres Efectivos 100% Garantía" (29 caracteres)
- "Endulzamientos que Funcionan Ya" (29 caracteres)
- "Recupere a su Pareja Rápidamente" (30 caracteres)
- "Rituales de Amor Poderosos Aquí" (30 caracteres)

EJEMPLOS DE TÍTULOS INCORRECTOS (NO GENERAR ASÍ):
- "Cómo amarre amor fácil" ❌ (Incompleto gramaticalmente)
- "Ritual trabajo urgente" ❌ (Falta estructura gramatical)
- "Oración San Marcos amor" ❌ (No es una frase completa)
- "Amarres" ❌ (Demasiado corto, no aprovecha caracteres)
- "Amarres de amor garantizados e" ❌ (Palabra suelta al final)

IMPORTANTE: Genera títulos COMPLETAMENTE DIFERENTES entre sí en estructura y enfoque, y asegúrate de que cada uno tenga SENTIDO COMPLETO como una frase.

Formato: array JSON de strings.
`

    const titlesResponse = await generateText({
      model: openai("gpt-4o"),
      prompt: titlesPrompt,
      temperature: 0.9, // Alta temperatura para más creatividad y variedad
      maxTokens: 1000,
    })

    // Procesar los títulos generados
    const cleanedTitlesText = cleanJsonResponse(titlesResponse.text)
    const parsedTitles = JSON.parse(cleanedTitlesText)

    // Filtrar y añadir títulos únicos
    for (const title of parsedTitles) {
      const cleanTitle = removePunctuation(title)
      const trimmedTitle = removeTrailingWords(cleanTitle)

      // Verificar que el título incluya al menos una de las palabras clave
      const includesAnyKeyword = keywords.some(
        (keyword) =>
          trimmedTitle.toLowerCase().includes(keyword.toLowerCase()) ||
          trimmedTitle.toLowerCase().includes(getSingular(keyword).toLowerCase()),
      )

      // Verificar que no esté en el conjunto global de títulos usados
      const isUnique = !globalUsedTitles.has(trimmedTitle.toLowerCase())

      if (trimmedTitle.length >= 25 && trimmedTitle.length <= 30 && isUnique && includesAnyKeyword) {
        titles.push(trimmedTitle)
        usedTitles.add(trimmedTitle.toLowerCase())
        globalUsedTitles.add(trimmedTitle.toLowerCase())

        if (titles.length >= 15) break // Detenerse cuando tengamos 15 títulos
      }
    }
  } catch (error) {
    console.error("Error generando títulos con la API:", error)
    // Continuar con los respaldos si hay un error
  }

  // Si no tenemos suficientes títulos, hacer un segundo intento con un prompt diferente
  if (titles.length < 15) {
    try {
      const secondTitlesPrompt = `
Genera ${25} títulos ÚNICOS y CREATIVOS para anuncios de Google Ads sobre: "${keywordsString}".

INSTRUCCIONES:
1. Cada título debe incluir al menos una palabra clave de: ${keywordsString}
2. APROVECHA EL ESPACIO: Cada título debe tener entre 27-30 caracteres
3. Sin signos de puntuación
4. EVITA estas estructuras ya utilizadas: ${titles.join(", ")}
5. Usa enfoques completamente diferentes a los anteriores
6. Usa palabras sencillas y comunes, evita tecnicismos
7. NO DEJES PALABRAS O LETRAS SUELTAS AL FINAL
8. OBJETIVO DEL ANUNCIO: ${getAdObjectiveDescription(adObjective)}

Formato: array JSON de strings.
`

      const secondTitlesResponse = await generateText({
        model: openai("gpt-4o"),
        prompt: secondTitlesPrompt,
        temperature: 0.95,
        maxTokens: 1000,
      })

      const cleanedText = cleanJsonResponse(secondTitlesResponse.text)
      const parsedTitles = JSON.parse(cleanedText)

      for (const title of parsedTitles) {
        const cleanTitle = removePunctuation(title)
        const trimmedTitle = removeTrailingWords(cleanTitle)

        // Verificar que no esté en el conjunto global de títulos usados
        const isUnique = !globalUsedTitles.has(trimmedTitle.toLowerCase())

        if (trimmedTitle.length >= 25 && trimmedTitle.length <= 30 && isUnique) {
          titles.push(trimmedTitle)
          usedTitles.add(trimmedTitle.toLowerCase())
          globalUsedTitles.add(trimmedTitle.toLowerCase())

          if (titles.length >= 15) break
        }
      }
    } catch (error) {
      console.error("Error en segundo intento de títulos:", error)
    }
  }

  // Completar con títulos de respaldo si es necesario
  while (titles.length < 15) {
    const backupTitle = generateBackupTitleFn(primaryKeyword, titles.length + adIndex)
    const trimmedTitle = removeTrailingWords(backupTitle)
    const isUnique = !globalUsedTitles.has(trimmedTitle.toLowerCase())

    if (isUnique) {
      titles.push(trimmedTitle)
      usedTitles.add(trimmedTitle.toLowerCase())
      globalUsedTitles.add(trimmedTitle.toLowerCase())
    } else {
      // Si el título generado no es único, intentamos con una variación
      for (let i = 0; i < 10; i++) {
        const variantTitle = generateBackupTitleFn(primaryKeyword, titles.length + adIndex + i * 100)
        const trimmedVariant = removeTrailingWords(variantTitle)
        if (!globalUsedTitles.has(trimmedVariant.toLowerCase())) {
          titles.push(trimmedVariant)
          usedTitles.add(trimmedVariant.toLowerCase())
          globalUsedTitles.add(trimmedVariant.toLowerCase())
          break
        }
      }
    }
  }

  // Generar descripciones con un prompt mejorado y más diverso
  const descriptions: string[] = []

  try {
    const descriptionsPrompt = `
Genera 10 descripciones persuasivas y COMPLETAMENTE DIFERENTES para anuncios de Google Ads sobre: "${keywordsString}".

INSTRUCCIONES DETALLADAS:
1. CADA DESCRIPCIÓN DEBE INCLUIR LA TEMÁTICA DE LAS PALABRAS CLAVE proporcionadas
2. La palabra clave principal "${primaryKeyword}" debe aparecer en la mayoría, ADAPTÁNDOLA GRAMATICALMENTE para que tenga sentido
3. Si la palabra clave es un verbo en primera persona (como "quitarme una brujería"), TRANSFÓRMALA a una forma gramatical correcta:
   - "quitarme una brujería" → "te quitamos la brujería", "quitamos brujería", "quitar brujería"
4. APROVECHA AL MÁXIMO EL ESPACIO: Cada descripción debe tener entre 85-90 caracteres (¡IMPORTANTE!)
5. NO uses signos de puntuación
6. EVITA REPETIR ESTRUCTURAS - cada descripción debe ser única en su enfoque
7. IMPORTANTE: TODAS LAS DESCRIPCIONES DEBEN SER UNA ÚNICA LÍNEA CONTINUA, SIN SALTOS DE LÍNEA.
8. USA PALABRAS SENCILLAS Y COMUNES, evita tecnicismos o sinónimos raros (el público objetivo es de nivel educativo básico)
9. NO DEJES PALABRAS O LETRAS SUELTAS AL FINAL de las descripciones, corta la frase antes si es necesario
10. IMPORTANTE: NO INCLUYAS LISTAS DE PALABRAS CLAVE AL FINAL DE LA DESCRIPCIÓN
11. OBJETIVO DEL ANUNCIO: ${getAdObjectiveDescription(adObjective)}

EJEMPLOS DE DESCRIPCIONES CORRECTAS (no uses estas exactamente):
- "Aumenta tus ventas online con estrategias de marketing digital personalizadas para tu negocio Contáctanos" (89 caracteres)
- "¿Buscas destacar en internet? Nuestro diseño web profesional te hará sobresalir entre la competencia" (90 caracteres)
- "Para empresas que quieren crecer Servicios SEO que generan resultados medibles y aumentan conversiones" (90 caracteres)

EJEMPLOS DE DESCRIPCIONES INCORRECTAS (NO GENERAR ASÍ):
- "Marketing digital" ❌ (Demasiado corto)
- "Servicios web para empresas" ❌ (No aprovecha el espacio disponible)
- "Servicios de marketing digital para empresas que quieren crecer y" ❌ (Palabra suelta al final)
- "Servicio de amarres de amor\\nconjuros\\nrituales" ❌ (Con saltos de línea o listas de palabras clave)

IMPORTANTE: Genera descripciones COMPLETAMENTE DIFERENTES entre sí en estructura y enfoque.

Formato: array JSON de strings.
`

    const descriptionsResponse = await generateText({
      model: openai("gpt-4o"),
      prompt: descriptionsPrompt,
      temperature: 0.9, // Alta temperatura para más creatividad
      maxTokens: 1000,
    })

    // Procesar las descripciones generadas
    const cleanedDescriptionsText = cleanJsonResponse(descriptionsResponse.text)
    const parsedDescriptions = JSON.parse(cleanedDescriptionsText)

    // Filtrar y añadir descripciones únicas
    for (const desc of parsedDescriptions) {
      const cleanDesc = removePunctuation(desc)
      const trimmedDesc = removeTrailingWords(cleanDesc)

      // Verificar que la descripción incluya al menos una de las palabras clave
      const includesAnyKeyword = keywords.some(
        (keyword) =>
          trimmedDesc.toLowerCase().includes(keyword.toLowerCase()) ||
          trimmedDesc.toLowerCase().includes(getSingular(keyword).toLowerCase()),
      )

      // Verificar que no esté en el conjunto global de descripciones usadas
      const isUnique = !globalUsedDescriptions.has(trimmedDesc.toLowerCase())

      if (trimmedDesc.length >= 80 && trimmedDesc.length <= 90 && isUnique && includesAnyKeyword) {
        descriptions.push(trimmedDesc)
        usedDescriptions.add(trimmedDesc.toLowerCase())
        globalUsedDescriptions.add(trimmedDesc.toLowerCase())

        if (descriptions.length >= 4) break // Detenerse cuando tengamos 4 descripciones
      }
    }
  } catch (error) {
    console.error("Error generando descripciones con la API:", error)
    // Continuar con los respaldos si hay un error
  }

  // Si no tenemos suficientes descripciones, hacer un segundo intento con un prompt diferente
  if (descriptions.length < 4) {
    try {
      const secondDescPrompt = `
Genera ${10} descripciones ÚNICAS y CREATIVAS para anuncios de Google Ads sobre: "${keywordsString}".

INSTRUCCIONES:
1. Cada descripción debe incluir al menos una palabra clave de: ${keywordsString}
2. APROVECHA EL ESPACIO: Cada descripción debe tener entre 85-90 caracteres
3. Sin signos de puntuación
4. EVITA estas estructuras ya utilizadas: ${descriptions.join(", ")}
5. Usa enfoques completamente diferentes a los anteriores
6. Usa palabras sencillas y comunes, evita tecnicismos
7. NO DEJES PALABRAS O LETRAS SUELTAS AL FINAL
8. OBJETIVO DEL ANUNCIO: ${getAdObjectiveDescription(adObjective)}

Formato: array JSON de strings.
`

      const secondDescResponse = await generateText({
        model: openai("gpt-4o"),
        prompt: secondDescPrompt,
        temperature: 0.95,
        maxTokens: 1000,
      })

      const cleanedText = cleanJsonResponse(secondDescResponse.text)
      const parsedDescs = JSON.parse(cleanedText)

      for (const desc of parsedDescs) {
        const cleanDesc = removePunctuation(desc)
        const trimmedDesc = removeTrailingWords(cleanDesc)

        // Verificar que no esté en el conjunto global de descripciones usadas
        const isUnique = !globalUsedDescriptions.has(trimmedDesc.toLowerCase())

        if (trimmedDesc.length >= 80 && trimmedDesc.length <= 90 && isUnique) {
          descriptions.push(trimmedDesc)
          usedDescriptions.add(trimmedDesc.toLowerCase())
          globalUsedDescriptions.add(trimmedDesc.toLowerCase())

          if (descriptions.length >= 4) break
        }
      }
    } catch (error) {
      console.error("Error en segundo intento de descripciones:", error)
    }
  }

  // Completar con descripciones de respaldo si es necesario
  while (descriptions.length < 4) {
    const backupDesc = generateBackupDescriptionFn(primaryKeyword, descriptions.length + adIndex)
    const trimmedDesc = removeTrailingWords(backupDesc)
    const isUnique = !globalUsedDescriptions.has(trimmedDesc.toLowerCase())

    if (isUnique) {
      descriptions.push(trimmedDesc)
      usedDescriptions.add(trimmedDesc.toLowerCase())
      globalUsedDescriptions.add(trimmedDesc.toLowerCase())
    } else {
      // Si la descripción generada no es única, intentamos con una variación
      for (let i = 0; i < 10; i++) {
        const variantDesc = generateBackupDescriptionFn(primaryKeyword, descriptions.length + adIndex + i * 100)
        const trimmedVariant = removeTrailingWords(variantDesc)
        if (!globalUsedDescriptions.has(trimmedVariant.toLowerCase())) {
          descriptions.push(trimmedVariant)
          usedDescriptions.add(trimmedVariant.toLowerCase())
          globalUsedDescriptions.add(trimmedVariant.toLowerCase())
          break
        }
      }
    }
  }

  return { titles, descriptions }
}

// Función para obtener el singular de una palabra (simplificada)
function getSingular(word: string): string {
  if (word.endsWith("s") && word.length > 3) {
    return word.slice(0, -1)
  }
  return word
}

// Función para eliminar palabras o letras sueltas al final
function removeTrailingWords(text: string): string {
  // Eliminar palabras cortas (1-2 letras) al final
  const trimmed = text.replace(/\s+[a-zñáéíóúü]{1,2}$/i, "")

  // Eliminar artículos y preposiciones comunes al final
  return trimmed.replace(/\s+(el|la|los|las|un|una|unos|unas|de|del|al|a|en|con|por|para|y|e|o|u)$/i, "")
}

// Modificar la función generateBackupTitle para aprovechar mejor el espacio
function generateBackupTitleFn(keyword: string, index: number): string {
  // Detectar si la palabra clave es un verbo en primera persona
  const firstPersonVerbs = ["quitarme", "ayudarme", "liberarme", "sanarme", "curarme", "protegerme"]

  // Comprobar si la palabra clave comienza con alguno de estos verbos
  const startsWithFirstPerson = firstPersonVerbs.some((verb) => keyword.toLowerCase().startsWith(verb.toLowerCase()))

  // Si es un verbo en primera persona, adaptarlo
  if (startsWithFirstPerson) {
    keyword = keyword.replace(/^quitar(me|te|le|nos|les)/, "quitar")
  }

  // Estructuras gramaticales mejoradas para títulos que aprovechan el espacio
  const titleTemplates = [
    // Imperativo + keyword + beneficio (para aprovechar más espacio)
    `Haga su ${keyword} hoy mismo`,
    `Consiga ${keyword} efectivo ahora`,
    `Obtenga ${keyword} garantizado ya`,
    `Realice ${keyword} poderoso rápido`,
    `Descubra ${keyword} efectivo ahora`,

    // Keyword + beneficio + llamada a acción
    `${keyword} que funciona siempre`,
    `${keyword} resultados rápidos ahora`,
    `${keyword} 100% garantizado`,
    `${keyword} profesional y seguro`,
    `${keyword} método comprobado aquí`,

    // Pregunta + keyword + beneficio
    `¿Necesita ${keyword} urgente?`,
    `¿Busca ${keyword} efectivo rápido?`,
    `¿Quiere ${keyword} garantizado?`,

    // Adjetivo + keyword + beneficio
    `Poderoso ${keyword} efectivo`,
    `Efectivo ${keyword} rápido y seguro`,
    `Auténtico ${keyword} garantizado`,
    `Profesional ${keyword} seguro aquí`,

    // Keyword + para + audiencia + beneficio
    `${keyword} para enamorados ahora`,
    `${keyword} para recuperar amor hoy`,
    `${keyword} para casos difíciles`,

    // Beneficio + con + keyword + adjetivo
    `Resultados con ${keyword} efectivo`,
    `Éxito con ${keyword} probado ahora`,
    `Solución con ${keyword} rápido`,

    // Keyword + característica + beneficio
    `${keyword} sin fallos garantizado`,
    `${keyword} en 24 horas efectivo`,
    `${keyword} a distancia resultados`,
    `${keyword} permanente y duradero`,
  ]

  // Seleccionar una plantilla basada en el índice
  const templateIndex = (index * 13) % titleTemplates.length
  let title = titleTemplates[templateIndex]

  // Asegurarse de que el título no exceda los 30 caracteres
  if (title.length > 30) {
    title = title.substring(0, 30)
  }

  return title
}

// Modificar la función generateBackupDescriptionFn para aprovechar mejor el espacio
function generateBackupDescriptionFn(keyword: string, index: number): string {
  // Detectar si la palabra clave es un verbo en primera persona
  const firstPersonVerbs = ["quitarme", "ayudarme", "liberarme", "sanarme", "curarme", "protegerme"]

  // Comprobar si la palabra clave comienza con alguno de estos verbos
  const startsWithFirstPerson = firstPersonVerbs.some((verb) => keyword.toLowerCase().startsWith(verb.toLowerCase()))

  // Si es un verbo en primera persona, adaptarlo
  if (startsWithFirstPerson) {
    keyword = keyword.replace(/^quitar(me|te|le|nos|les)/, "quitar")
  }

  // Plantillas de descripciones mejoradas - todas como una sola línea continua
  const templates = [
    `Ofrecemos los mejores servicios profesionales para ${keyword} con expertos certificados. Contáctanos ahora.`,
    `Soluciones personalizadas y efectivas para ${keyword} para tu bienestar completo. Resultados garantizados.`,
    `Especialistas con más de 10 años de experiencia en ${keyword} con métodos probados. Consulta sin compromiso.`,
    `Servicios premium y exclusivos para ${keyword} adaptados específicamente a tus necesidades. Pide información.`,
    `Mejora tu vida y recupera tu felicidad con nuestros servicios profesionales para ${keyword}. Llámanos hoy.`,
    `Métodos efectivos y comprobados para ${keyword} para recuperar tu tranquilidad y bienestar. Infórmate ahora.`,
    `Recupera tu paz interior y armonía con nuestro servicio profesional de ${keyword} certificado. Empieza hoy.`,
    `Expertos altamente calificados en ${keyword} comprometidos totalmente con tu bienestar. Consulta ahora.`,
    `Servicios exclusivos de ${keyword} que marcan la diferencia en resultados y satisfacción. Descubre cómo.`,
    `Soluciones rápidas y efectivas para ${keyword} a tu alcance las 24 horas todos los días. Contacta ya.`,
    `Resultados visibles y garantizados para ${keyword} desde la primera sesión personalizada. Pide consulta.`,
    `Transforma completamente tu vida con nuestras soluciones avanzadas para ${keyword} efectivo. Infórmate.`,
  ]

  // Seleccionar una plantilla y asegurarse de que no exceda los 90 caracteres
  let description = templates[index % templates.length]

  // Asegurarnos de que no haya saltos de línea
  description = description.replace(/[\r\n]+/g, " ").trim()

  // Limitar a 90 caracteres
  if (description.length > 90) {
    description = description.substring(0, 90)
  }

  return description
}

// Modificar la función removeDuplicatesBetweenAds para usar el conjunto global
const removeDuplicatesBetweenAdsFn = (ads: Ad[]): Ad[] => {
  // Recorrer cada anuncio y eliminar duplicados
  return ads.map((ad, adIndex) => {
    // Filtrar títulos duplicados
    const uniqueTitles = ad.titles.filter((title) => {
      const lowerTitle = title.toLowerCase()

      // Si es el primer anuncio, verificamos solo contra el conjunto global
      if (adIndex === 0) {
        if (globalUsedTitles.has(lowerTitle) && !ad.titles.some((t) => t.toLowerCase() === lowerTitle)) {
          return false // Es un duplicado global pero no de este anuncio, eliminar
        }
        globalUsedTitles.add(lowerTitle)
        return true
      }

      // Para los demás anuncios, verificamos si ya existe en el conjunto global
      if (globalUsedTitles.has(lowerTitle) && !ad.titles.some((t) => t.toLowerCase() === lowerTitle)) {
        return false // Es un duplicado, eliminar
      }
      globalUsedTitles.add(lowerTitle)
      return true
    })

    // Filtrar descripciones duplicadas
    const uniqueDescriptions = ad.descriptions.filter((desc) => {
      const lowerDesc = desc.toLowerCase()

      // Si es el primer anuncio, verificamos solo contra el conjunto global
      if (adIndex === 0) {
        if (globalUsedDescriptions.has(lowerDesc) && !ad.descriptions.some((d) => d.toLowerCase() === lowerDesc)) {
          return false // Es un duplicado global pero no de este anuncio, eliminar
        }
        globalUsedDescriptions.add(lowerDesc)
        return true
      }

      // Para los demás anuncios, verificamos si ya existe en el conjunto global
      if (globalUsedDescriptions.has(lowerDesc) && !ad.descriptions.some((d) => d.toLowerCase() === lowerDesc)) {
        return false // Es un duplicado, eliminar
      }
      globalUsedDescriptions.add(lowerDesc)
      return true
    })

    // Generar títulos adicionales si es necesario para asegurar siempre 15 títulos
    while (uniqueTitles.length < 15) {
      const newTitle = generateBackupTitleFn(ad.keywords[0], uniqueTitles.length + adIndex * 100)
      const trimmedTitle = removeTrailingWords(newTitle)
      const lowerNewTitle = trimmedTitle.toLowerCase()

      if (!globalUsedTitles.has(lowerNewTitle)) {
        uniqueTitles.push(trimmedTitle)
        globalUsedTitles.add(lowerNewTitle)
      }
    }

    // Generar descripciones adicionales si es necesario para asegurar siempre 4 descripciones
    while (uniqueDescriptions.length < 4) {
      const newDesc = generateBackupDescriptionFn(ad.keywords[0], uniqueDescriptions.length + adIndex * 100)
      const trimmedDesc = removeTrailingWords(newDesc)
      const lowerNewDesc = trimmedDesc.toLowerCase()

      if (!globalUsedDescriptions.has(lowerNewDesc)) {
        uniqueDescriptions.push(trimmedDesc)
        globalUsedDescriptions.add(lowerNewDesc)
      }
    }

    return {
      ...ad,
      titles: uniqueTitles,
      descriptions: uniqueDescriptions,
    }
  })
}

// Función para generar un título único (reemplazar con tu lógica)
function generateUniqueTitle(): string {
  return "Título de respaldo único"
}

// Función para generar una descripción de respaldo (reemplazar con tu lógica)
function generateBackupDescription(): string {
  return "Descripción de respaldo única"
}

// Modificar la función regenerateTitle para usar OpenAI
export async function regenerateTitle(adIndex: number, formData: FormData) {
  const keywords = formData.get("keywords") as string
  const objective = formData.get("objective") as string
  const tone = formData.get("tone") as string
  const language = formData.get("language") as string
  const adsData = formData.get("adsData") as string

  const parsedAdsData = JSON.parse(adsData)

  try {
    const prompt = `
    Genera un título único y atractivo para un anuncio de Google Ads.
    
    Palabras clave: ${keywords}
    Objetivo: ${objective}
    Tono: ${tone}
    Idioma: ${language}
    
    El título debe ser conciso, atractivo y optimizado para SEO.
    Debe tener menos de 30 caracteres.
    No uses comillas ni caracteres especiales.
    
    Genera solo un título, sin explicaciones adicionales.
    `

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Eres un experto en marketing digital especializado en crear anuncios efectivos para Google Ads.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 50,
    })

    const newTitle = response.choices[0].message.content?.trim() || generateUniqueTitle()

    // Actualizar el título en el anuncio específico
    parsedAdsData[adIndex].title = newTitle

    return parsedAdsData
  } catch (error) {
    console.error("Error regenerando el título:", error)
    // Fallback a la función local en caso de error
    parsedAdsData[adIndex].title = generateUniqueTitle()
    return parsedAdsData
  }
}

// Modificar la función regenerateDescription para usar OpenAI
export async function regenerateDescription(adIndex: number, formData: FormData) {
  const keywords = formData.get("keywords") as string
  const objective = formData.get("objective") as string
  const tone = formData.get("tone") as string
  const language = formData.get("language") as string
  const adsData = formData.get("adsData") as string

  const parsedAdsData = JSON.parse(adsData)

  try {
    const prompt = `
    Genera una descripción única y persuasiva para un anuncio de Google Ads.
    
    Palabras clave: ${keywords}
    Objetivo: ${objective}
    Tono: ${tone}
    Idioma: ${language}
    
    La descripción debe ser concisa, persuasiva y optimizada para SEO.
    Debe tener entre 80 y 90 caracteres.
    No uses comillas ni caracteres especiales.
    Incluye un llamado a la acción claro.
    
    Genera solo una descripción, sin explicaciones adicionales.
    `

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Eres un experto en marketing digital especializado en crear anuncios efectivos para Google Ads.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 100,
    })

    const newDescription = response.choices[0].message.content?.trim() || generateBackupDescription()

    // Actualizar la descripción en el anuncio específico
    parsedAdsData[adIndex].description = newDescription

    return parsedAdsData
  } catch (error) {
    console.error("Error regenerando la descripción:", error)
    // Fallback a la función local en caso de error
    parsedAdsData[adIndex].description = generateBackupDescription()
    return parsedAdsData
  }
}

// Función para regenerar solo las descripciones de un anuncio
export async function regenerateDescriptions(
  keywords: string[],
  finalUrl: string,
  adObjective = "aumentar_ctr",
  writingStyle = "persuasivo",
): Promise<string[]> {
  const keywordsString = keywords.join(", ")
  const primaryKeyword = keywords[0]
  const descriptions: string[] = []

  try {
    const descriptionsPrompt = `
Genera 10 descripciones persuasivas y COMPLETAMENTE DIFERENTES para anuncios de Google Ads sobre: "${keywordsString}".

INSTRUCCIONES DETALLADAS:
1. CADA DESCRIPCIÓN DEBE INCLUIR LA TEMÁTICA DE LAS PALABRAS CLAVE proporcionadas
2. La palabra clave principal "${primaryKeyword}" debe aparecer en la mayoría, ADAPTÁNDOLA GRAMATICALMENTE para que tenga sentido
3. APROVECHA AL MÁXIMO EL ESPACIO: Cada descripción debe tener entre 85-90 caracteres (¡IMPORTANTE!)
4. NO uses signos de puntuación
5. EVITA REPETIR ESTRUCTURAS - cada descripción debe ser única en su enfoque
6. USA PALABRAS SENCILLAS Y COMUNES, evita tecnicismos o sinónimos raros (el público objetivo es de nivel educativo básico)
7. NO DEJES PALABRAS O LETRAS SUELTAS AL FINAL de las descripciones, corta la frase antes si es necesario
8. OBJETIVO DEL ANUNCIO: ${getAdObjectiveDescription(adObjective)}

IMPORTANTE: Genera descripciones COMPLETAMENTE DIFERENTES entre sí en estructura y enfoque.

Formato: array JSON de strings.
`

    const descriptionsResponse = await generateText({
      model: openai("gpt-4o"),
      prompt: descriptionsPrompt,
      temperature: 0.95, // Alta temperatura para más creatividad
      maxTokens: 1000,
    })

    // Procesar las descripciones generadas
    const cleanedDescriptionsText = cleanJsonResponse(descriptionsResponse.text)
    const parsedDescriptions = JSON.parse(cleanedDescriptionsText)

    // Filtrar y añadir descripciones únicas
    for (const desc of parsedDescriptions) {
      const cleanDesc = removePunctuation(desc)
      // Asegurarnos de eliminar saltos de línea
      const processedDesc = cleanDesc.replace(/[\r\n]+/g, " ").trim()
      const trimmedDesc = removeTrailingWords(processedDesc)

      // Verificar que no esté en el conjunto global de descripciones usadas
      const isUnique = !globalUsedDescriptions.has(trimmedDesc.toLowerCase())

      if (trimmedDesc.length >= 80 && trimmedDesc.length <= 90 && isUnique) {
        descriptions.push(trimmedDesc)
        globalUsedDescriptions.add(trimmedDesc.toLowerCase())

        if (descriptions.length >= 4) break // Detenerse cuando tengamos 4 descripciones
      }
    }
  } catch (error) {
    console.error("Error regenerando descripciones:", error)
  }

  // Completar con descripciones de respaldo si es necesario
  let backupIndex = 0
  while (descriptions.length < 4) {
    const backupDesc = generateBackupDescriptionFn(primaryKeyword, backupIndex)
    const trimmedDesc = removeTrailingWords(backupDesc)
    const isUnique = !globalUsedDescriptions.has(trimmedDesc.toLowerCase())

    if (isUnique) {
      descriptions.push(trimmedDesc)
      globalUsedDescriptions.add(trimmedDesc.toLowerCase())
    }
    backupIndex++
  }

  return descriptions
}

// Modificar la función generateAds para incluir los parámetros de estilo y call to action
export async function generateAds(
  keywords: string[],
  finalUrl: string,
  numAds: number,
  writingStyle = "persuasivo",
  callToActions: string[] = [],
  adObjective = "aumentar_ctr",
): Promise<Ad[]> {
  // Limitar el número máximo de anuncios a generar a la vez
  const safeNumAds = Math.min(numAds, 3)

  // Mantener registro de todos los títulos y descripciones ya generados
  const usedTitles = new Set<string>()
  const usedDescriptions = new Set<string>()

  // Crear una cadena con todas las palabras clave para el prompt
  const keywordsString = keywords.join(", ")

  // Determinar la palabra clave principal (la primera) y las secundarias
  const primaryKeyword = keywords[0]
  const secondaryKeywords = keywords.slice(1)

  // Generar anuncios en paralelo en lugar de secuencialmente
  const adPromises = Array(safeNumAds)
    .fill(null)
    .map(async (_, index) => {
      try {
        // Generar títulos y descripciones para este anuncio con diferentes estilos
        const adData = await generateSingleAd(
          keywordsString,
          primaryKeyword,
          keywords,
          usedTitles,
          usedDescriptions,
          index,
          adObjective,
          writingStyle,
        )

        return {
          titles: adData.titles,
          descriptions: adData.descriptions,
          keywords,
          finalUrl,
        }
      } catch (error) {
        console.error(`Error generating ad ${index}:`, error)
        // Crear un anuncio de respaldo en caso de error
        return createBackupAd(keywords, finalUrl, index)
      }
    })

  // Esperar a que todos los anuncios se generen y filtrar los fallidos
  const results = await Promise.allSettled(adPromises)
  const ads = results
    .filter((result): result is PromiseFulfilledResult<Ad> => result.status === "fulfilled")
    .map((result) => result.value)

  const dedupedAds = removeDuplicatesBetweenAdsFn(ads)

  return dedupedAds
}

// Estilos de escritura para diversificar los anuncios
const writingStyles = [
  {
    name: "Directo y Activo",
    description: "Usa verbos de acción y frases directas que invitan a la acción inmediata",
    examples: ["Consigue", "Descubre", "Mejora", "Transforma", "Comienza"],
  },
  {
    name: "Interrogativo",
    description: "Usa preguntas para generar curiosidad e interés",
    examples: ["¿Buscas", "¿Necesitas", "¿Quieres", "¿Te interesa"],
  },
  {
    name: "Beneficio Claro",
    description: "Enfatiza los beneficios específicos que obtendrá el cliente",
    examples: ["Ahorra", "Aumenta", "Mejora", "Simplifica", "Potencia"],
  },
  {
    name: "Exclusividad",
    description: "Enfatiza lo único y especial del producto o servicio",
    examples: ["Exclusivo", "Único", "Especial", "Premium", "Selecto"],
  },
  {
    name: "Urgencia",
    description: "Crea sensación de urgencia o escasez",
    examples: ["Ahora", "Limitado", "Últimos", "No esperes", "Hoy"],
  },
  {
    name: "Testimonial",
    description: "Simula recomendaciones o experiencias de clientes",
    examples: ["Clientes satisfechos", "Recomendado", "Preferido", "Confiable"],
  },
  {
    name: "Comparativo",
    description: "Establece comparaciones implícitas con la competencia",
    examples: ["Mejor", "Superior", "Más efectivo", "Líder", "Número uno"],
  },
  {
    name: "Solución a Problema",
    description: "Identifica un problema y ofrece la solución",
    examples: ["Soluciona", "Elimina", "Olvídate de", "Acaba con", "Resuelve"],
  },
]

// Estructuras de títulos para diversificar
const titleStructures = [
  "Verbo + Keyword + Beneficio", // Ej: "Mejora tu Marketing Digital Hoy"
  "Keyword + Adjetivo + Valor", // Ej: "Marketing Digital Efectivo y Rentable"
  "Pregunta + Keyword", // Ej: "¿Necesitas Marketing Digital Profesional?"
  "Número + Keyword + Beneficio", // Ej: "5 Estrategias de Marketing Digital"
  "Keyword + para + Audiencia", // Ej: "Marketing Digital para Emprendedores"
  "Adjetivo + Keyword + Llamada a la acción", // Ej: "Potente Marketing Digital Aquí"
  "Beneficio + con + Keyword", // Ej: "Más Ventas con Marketing Digital"
  "Keyword + que + Resultado", // Ej: "Marketing Digital que Convierte"
  "Imperativo + tu + Keyword", // Ej: "Potencia tu Marketing Digital"
  "Keyword + Ubicación/Sector", // Ej: "Marketing Digital en Madrid"
]

// Estructuras de descripciones para diversificar
const descriptionStructures = [
  "Beneficio principal + Keyword + Llamada a la acción", // Ej: "Aumenta tus ventas con nuestro marketing digital profesional Contáctanos ahora"
  "Pregunta + Keyword + Solución", // Ej: "¿Buscas mejorar tu presencia online? Nuestro marketing digital es la solución ideal"
  "Keyword + Característica + Ventaja + Acción", // Ej: "Marketing digital con estrategias personalizadas para tu negocio Consulta hoy"
  "Problema + Keyword + Solución", // Ej: "¿Pocas ventas online? Nuestro marketing digital aumentará tu conversión Infórmate"
  "Audiencia + Keyword + Beneficio", // Ej: "Para empresas que quieren crecer Marketing digital que genera resultados reales"
  "Comparación + Keyword + Diferenciador", // Ej: "El mejor marketing digital del mercado Estrategias probadas y efectivas"
  "Estadística/Hecho + Keyword + Propuesta", // Ej: "90% más de visitas con nuestras estrategias de marketing digital Empieza ya"
  "Testimonial + Keyword + Invitación", // Ej: "Clientes satisfechos con nuestro marketing digital Únete a ellos ahora"
]

// Función para obtener la descripción del objetivo del anuncio
function getAdObjectiveDescription(objective: string): string {
  switch (objective) {
    case "aumentar_ctr":
      return "Aumentar el CTR (tasa de clics) con títulos y descripciones atractivos que generen más clics"
    case "aumentar_visitas":
      return "Aumentar las visitas al sitio web con mensajes que despierten interés y curiosidad"
    case "aumentar_ventas":
      return "Aumentar las ventas destacando beneficios, ofertas y llamadas a la acción de compra"
    case "generar_leads":
      return "Generar leads cualificados con mensajes que atraigan a clientes potenciales interesados"
    case "obtener_consultas":
      return "Obtener consultas y contactos directos con mensajes que inviten a comunicarse"
    default:
      return "Optimizar el rendimiento general del anuncio para mejores resultados"
  }
}

/**
 * Cleans a response from OpenAI to extract just the JSON array
 * Handles cases where the model returns markdown formatting or explanations
 */
function cleanJsonResponse(text: string): string {
  try {
    // Remove markdown code blocks if present
    let cleaned = text.replace(/```(json|javascript|js)?\n?/g, "").replace(/```$/g, "")

    // Eliminar posibles saltos de línea en las descripciones
    cleaned = cleaned.replace(/\n/g, " ")

    // Try to find the first [ and last ] to extract just the JSON array
    const startIndex = cleaned.indexOf("[")
    const endIndex = cleaned.lastIndexOf("]")

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      cleaned = cleaned.substring(startIndex, endIndex + 1)
      return cleaned
    }

    // Si no encontramos corchetes, intentar reparar el JSON
    if (cleaned.includes('"') && !cleaned.includes("[")) {
      return "[" + cleaned + "]"
    }

    return cleaned
  } catch (error) {
    console.error("Error cleaning JSON response:", error)
    return "[]" // Devolver array vacío en caso de error
  }
}

// Add a new function to remove punctuation
function removePunctuation(text: string): string {
  return text.replace(/[.,/#!¡?¿$%^&*;:{}=\-_`~()]/g, "")
}

function adaptKeywordGrammatically(keyword: string, structure: string): string {
  // Detectar si la palabra clave es un verbo en primera persona
  const firstPersonVerbs = ["quitarme", "ayudarme", "liberarme", "sanarme", "curarme", "protegerme"]

  // Comprobar si la palabra clave comienza con alguno de estos verbos
  const startsWithFirstPerson = firstPersonVerbs.some((verb) => keyword.toLowerCase().startsWith(verb.toLowerCase()))

  if (startsWithFirstPerson) {
    // Convertir "quitarme una brujería" a formas gramaticalmente correctas según la estructura
    if (structure.includes("Pregunta")) {
      // Para preguntas: "¿Necesitas quitar una brujería?"
      return keyword.replace(/^quitar(me|te|le|nos|les)/, "quitar")
    } else if (structure.includes("Imperativo")) {
      // Para imperativos: "Quita una brujería ahora"
      return keyword.replace(/^quitar(me|te|le|nos|les)/, "quita")
    } else if (structure.includes("Verbo")) {
      // Para verbos: "Quitamos una brujería rápido"
      return keyword.replace(/^quitar(me|te|le|nos|les)/, "quitamos")
    } else {
      // Para otros casos: "Quitar una brujería"
      return keyword.replace(/^quitar(me|te|le|nos|les)/, "quitar")
    }
  }

  return keyword
}

// Function to select random elements from an array
function selectRandomElements<T>(arr: T[], numElements: number, seed: number): T[] {
  const shuffled = [...arr]
  // Implement a simple PRNG for seeding
  let m = arr.length,
    i

  while (m) {
    // Use the seed to generate a pseudo-random index
    seed = (seed * 9301 + 49297) % 233280
    i = Math.floor((seed / 233280) * m--)

    // And swap it with the current element
    ;[shuffled[m], shuffled[i]] = [shuffled[i], shuffled[m]]
  }

  return shuffled.slice(0, numElements)
}

// Function to create a backup ad in case of an error
function createBackupAd(keywords: string[], finalUrl: string, index: number): Ad {
  const primaryKeyword = keywords[0]
  const backupTitles = Array(15)
    .fill(null)
    .map((_, i) => generateBackupTitleFn(primaryKeyword, i + index * 100))

  const backupDescriptions = Array(4)
    .fill(null)
    .map((_, i) => generateBackupDescriptionFn(primaryKeyword, i + index * 100))

  return {
    titles: backupTitles,
    descriptions: backupDescriptions,
    keywords,
    finalUrl,
  }
}

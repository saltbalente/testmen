import { type NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"

// Función para convertir URL de HLS a MP4
function convertHlsToMp4(hlsUrl: string): string {
  // Si ya es una URL MP4, devolverla tal cual
  if (hlsUrl.endsWith(".mp4")) {
    return hlsUrl
  }

  // Convertir de HLS a MP4
  if (hlsUrl.includes("/videos/iht/hls/") && hlsUrl.endsWith(".m3u8")) {
    return hlsUrl.replace("/videos/iht/hls/", "/videos/mc/720p/").replace(".m3u8", ".mp4")
  }

  // Si no podemos convertirla, devolver la original
  return hlsUrl
}

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "Se requiere una URL de Pinterest" }, { status: 400 })
    }

    // Validar que la URL sea de Pinterest
    const pinterestRegex = /^https?:\/\/(?:www\.|[a-z]{2}\.)?pinterest\.com\/pin\/[0-9]+\/?/i
    if (!pinterestRegex.test(url)) {
      return NextResponse.json({ error: "La URL no parece ser un pin válido de Pinterest" }, { status: 400 })
    }

    // Hacer la solicitud a Pinterest
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Error al acceder al pin: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const html = await response.text()

    // Analizar el HTML con cheerio
    const $ = cheerio.load(html)

    // Extraer metadatos
    const title = $('meta[property="og:title"]').attr("content") || ""
    const description = $('meta[property="og:description"]').attr("content") || ""
    const siteName = $('meta[property="og:site_name"]').attr("content") || "Pinterest"

    // Buscar la URL del video (prioridad principal)
    let videoUrl =
      $('meta[property="og:video"]').attr("content") || $('meta[property="og:video:secure_url"]').attr("content")

    if (videoUrl) {
      // Convertir de HLS a MP4 si es necesario
      videoUrl = convertHlsToMp4(videoUrl)

      // Extraer dimensiones del video si están disponibles
      const videoWidth = $('meta[property="og:video:width"]').attr("content")
      const videoHeight = $('meta[property="og:video:height"]').attr("content")
      const dimensions = videoWidth && videoHeight ? `${videoWidth}x${videoHeight}` : "720p"

      return NextResponse.json({
        type: "video",
        url: videoUrl,
        title,
        description,
        author: siteName,
        dimensions,
        originalUrl: url,
      })
    }

    // Buscar en el HTML directamente patrones de URL de video
    const htmlString = $.html()

    // Buscar patrones de URL de video en el HTML
    const mp4Regex = /https:\/\/v1\.pinimg\.com\/videos\/mc\/[^"'\s]+\.mp4/g
    const mp4Matches = htmlString.match(mp4Regex)

    if (mp4Matches && mp4Matches.length > 0) {
      return NextResponse.json({
        type: "video",
        url: mp4Matches[0], // Usar la primera URL MP4 encontrada
        title,
        description,
        author: siteName,
        dimensions: "720p",
        originalUrl: url,
      })
    }

    // Buscar patrones de URL de HLS y convertirlos
    const hlsRegex = /https:\/\/v1\.pinimg\.com\/videos\/iht\/hls\/[^"'\s]+\.m3u8/g
    const hlsMatches = htmlString.match(hlsRegex)

    if (hlsMatches && hlsMatches.length > 0) {
      const mp4Url = convertHlsToMp4(hlsMatches[0])

      return NextResponse.json({
        type: "video",
        url: mp4Url,
        title,
        description,
        author: siteName,
        dimensions: "720p",
        originalUrl: url,
      })
    }

    // Intentar extraer datos del JSON incrustado
    try {
      // Buscar datos JSON incrustados en la página
      const scriptTags = $("script").filter(function () {
        return (
          $(this).text().includes('{"props":') ||
          $(this).text().includes('"initialReduxState"') ||
          $(this).text().includes('"videoList"') ||
          $(this).text().includes('"videos"')
        )
      })

      for (let i = 0; i < scriptTags.length; i++) {
        const scriptContent = $(scriptTags[i]).html() || ""

        // Buscar patrones de URL de video en el script
        const mp4Matches = scriptContent.match(mp4Regex)
        if (mp4Matches && mp4Matches.length > 0) {
          return NextResponse.json({
            type: "video",
            url: mp4Matches[0], // Usar la primera URL MP4 encontrada
            title,
            description,
            author: siteName,
            dimensions: "720p",
            originalUrl: url,
          })
        }

        // Buscar patrones de URL de HLS y convertirlos
        const hlsMatches = scriptContent.match(hlsRegex)
        if (hlsMatches && hlsMatches.length > 0) {
          const mp4Url = convertHlsToMp4(hlsMatches[0])

          return NextResponse.json({
            type: "video",
            url: mp4Url,
            title,
            description,
            author: siteName,
            dimensions: "720p",
            originalUrl: url,
          })
        }

        // Buscar patrones comunes de datos JSON en Pinterest
        const jsonMatches = [
          scriptContent.match(/\{.*"pin".*\}/),
          scriptContent.match(/\{.*"videos".*\}/),
          scriptContent.match(/window\.__INITIAL_STATE__ = (.+?);<\/script>/),
          scriptContent.match(/\{.*"videoList".*\}/),
        ].filter(Boolean)

        for (const jsonMatch of jsonMatches) {
          if (!jsonMatch) continue

          try {
            // Extraer y parsear el JSON
            const jsonText = jsonMatch[0].includes("__INITIAL_STATE__") ? jsonMatch[1] : jsonMatch[0]

            const jsonData = JSON.parse(jsonText)

            // Función para buscar URLs de video en el objeto JSON
            const findVideoUrls = (obj: any): string[] => {
              const urls: string[] = []

              const search = (o: any, path = "") => {
                if (!o || typeof o !== "object") return

                // Buscar propiedades que parezcan URLs de video
                if (
                  typeof o === "string" &&
                  (o.includes(".mp4") || o.includes(".m3u8")) &&
                  o.includes("pinimg.com/videos")
                ) {
                  urls.push(o)
                  return
                }

                // Buscar en propiedades específicas primero
                if (
                  o.url &&
                  typeof o.url === "string" &&
                  (o.url.includes(".mp4") || o.url.includes(".m3u8")) &&
                  o.url.includes("pinimg.com/videos")
                ) {
                  urls.push(o.url)
                }

                // Buscar en propiedades anidadas
                for (const key in o) {
                  search(o[key], `${path}.${key}`)
                }
              }

              search(obj)
              return urls
            }

            const videoUrls = findVideoUrls(jsonData)

            // Filtrar y priorizar URLs MP4
            const mp4Urls = videoUrls.filter((url) => url.endsWith(".mp4"))
            if (mp4Urls.length > 0) {
              return NextResponse.json({
                type: "video",
                url: mp4Urls[0], // Usar la primera URL MP4 encontrada
                title: title,
                description: description,
                author: siteName,
                dimensions: "720p",
                originalUrl: url,
              })
            }

            // Si no hay MP4, convertir HLS a MP4
            const hlsUrls = videoUrls.filter((url) => url.endsWith(".m3u8"))
            if (hlsUrls.length > 0) {
              const mp4Url = convertHlsToMp4(hlsUrls[0])

              return NextResponse.json({
                type: "video",
                url: mp4Url,
                title: title,
                description: description,
                author: siteName,
                dimensions: "720p",
                originalUrl: url,
              })
            }
          } catch (jsonError) {
            console.error("Error al analizar JSON:", jsonError)
            // Continuar con el siguiente match
          }
        }
      }
    } catch (jsonExtractionError) {
      console.error("Error al extraer JSON:", jsonExtractionError)
    }

    // Último intento: extraer el ID del video del HTML y construir la URL MP4
    try {
      // Buscar patrones como "e479440c79fe3e48dd53462eb3276a5e" en el HTML
      const videoIdRegex = /videos\/[^/]+\/[^/]+\/([a-f0-9]{32})/i
      const videoIdMatch = htmlString.match(videoIdRegex)

      if (videoIdMatch && videoIdMatch[1]) {
        const videoId = videoIdMatch[1]
        // Construir la URL MP4 con el formato correcto
        const mp4Url = `https://v1.pinimg.com/videos/mc/720p/${videoId.substring(0, 2)}/${videoId.substring(2, 4)}/${videoId}.mp4`

        return NextResponse.json({
          type: "video",
          url: mp4Url,
          title: title,
          description: description,
          author: siteName,
          dimensions: "720p",
          originalUrl: url,
        })
      }
    } catch (idExtractionError) {
      console.error("Error al extraer ID del video:", idExtractionError)
    }

    // Si llegamos aquí, no se encontró ningún video
    return NextResponse.json(
      { error: "No se encontró ningún video en este pin. Asegúrate de que el pin contenga un video." },
      { status: 404 },
    )
  } catch (error) {
    console.error("Error en el servidor:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}

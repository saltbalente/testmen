import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Directorio donde se guardarán los archivos
const DATA_DIR = path.join(process.cwd(), "data")
const KEYWORDS_FILE = path.join(DATA_DIR, "keywords.json")

export async function GET(request: NextRequest) {
  try {
    // Verificar si el archivo existe
    if (!fs.existsSync(KEYWORDS_FILE)) {
      return NextResponse.json({ error: "No hay datos para exportar" }, { status: 404 })
    }

    // Obtener el formato de exportación de los parámetros de consulta
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "json"

    // Leer el archivo JSON
    const fileContent = fs.readFileSync(KEYWORDS_FILE, "utf-8")
    const keywords = JSON.parse(fileContent)

    if (format === "csv") {
      // Convertir a CSV
      const headers = [
        "keyword",
        "searchVolume",
        "difficulty",
        "cpc",
        "competition",
        "seasonality",
        "intent",
        "tags",
        "source",
      ]

      const csvContent = [
        headers.join(","),
        ...keywords.map((kw: any) => {
          return [
            `"${kw.keyword}"`,
            kw.searchVolume !== undefined ? kw.searchVolume : "",
            kw.difficulty !== undefined ? kw.difficulty : "",
            kw.cpc !== undefined ? kw.cpc : "",
            kw.competition !== undefined ? kw.competition : "",
            kw.seasonality ? `"${kw.seasonality}"` : "",
            kw.intent ? `"${kw.intent}"` : "",
            kw.tags ? `"${kw.tags.join(", ")}"` : "",
            kw.source ? `"${kw.source}"` : "",
          ].join(",")
        }),
      ].join("\n")

      // Configurar la respuesta como CSV
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=keywords_export.csv",
        },
      })
    } else {
      // Devolver como JSON
      return new NextResponse(JSON.stringify(keywords, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": "attachment; filename=keywords_export.json",
        },
      })
    }
  } catch (error) {
    console.error("Error al exportar keywords:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Directorio donde se guardarán los archivos
const DATA_DIR = path.join(process.cwd(), "data")
const KEYWORDS_FILE = path.join(DATA_DIR, "keywords.json")

export async function GET() {
  try {
    // Verificar si el archivo existe
    if (!fs.existsSync(KEYWORDS_FILE)) {
      return NextResponse.json({
        keywords: [],
        message: "No hay datos guardados en el servidor",
      })
    }

    // Leer el archivo
    const fileContent = fs.readFileSync(KEYWORDS_FILE, "utf-8")
    const keywords = JSON.parse(fileContent)

    return NextResponse.json({
      keywords,
      count: keywords.length,
      message: `Se han cargado ${keywords.length} keywords desde el servidor`,
    })
  } catch (error) {
    console.error("Error al cargar keywords:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}

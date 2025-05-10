import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Directorio donde se guardarán los archivos
const DATA_DIR = path.join(process.cwd(), "data")
const KEYWORDS_FILE = path.join(DATA_DIR, "keywords.json")

// Asegurarse de que el directorio exista
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

export async function POST(request: NextRequest) {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const body = await request.json()
    const { keywords } = body

    if (!keywords || !Array.isArray(keywords)) {
      return NextResponse.json({ error: "Se requiere un array de keywords" }, { status: 400 })
    }

    // Cargar datos existentes si el archivo existe
    let existingKeywords = []
    if (fs.existsSync(KEYWORDS_FILE)) {
      const fileContent = fs.readFileSync(KEYWORDS_FILE, "utf-8")
      try {
        existingKeywords = JSON.parse(fileContent)
      } catch (e) {
        console.error("Error al parsear el archivo JSON existente:", e)
      }
    }

    // Combinar keywords existentes con nuevas, evitando duplicados
    const existingKeywordsMap = new Map(existingKeywords.map((kw: any) => [kw.keyword.toLowerCase(), kw]))

    // Actualizar keywords existentes y añadir nuevas
    keywords.forEach((kw: any) => {
      existingKeywordsMap.set(kw.keyword.toLowerCase(), kw)
    })

    // Convertir el mapa de vuelta a un array
    const mergedKeywords = Array.from(existingKeywordsMap.values())

    // Guardar en el archivo
    fs.writeFileSync(KEYWORDS_FILE, JSON.stringify(mergedKeywords, null, 2))

    return NextResponse.json({
      success: true,
      message: `Se han guardado ${mergedKeywords.length} keywords en el servidor`,
      count: mergedKeywords.length,
    })
  } catch (error) {
    console.error("Error al guardar keywords:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}

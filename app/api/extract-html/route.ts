import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Intentamos obtener el HTML de la URL
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const html = await response.text()

    return NextResponse.json({ html })
  } catch (error) {
    console.error("Error extracting HTML:", error)
    return NextResponse.json({ error: error.message || "Failed to extract HTML" }, { status: 500 })
  }
}

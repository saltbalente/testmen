import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Simplemente permitir todas las solicitudes sin redirecciones
  return NextResponse.next()
}

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Página no encontrada</h2>
        <p className="mb-6">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
        <Link href="/" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

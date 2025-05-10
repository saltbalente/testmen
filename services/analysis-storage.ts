import { v4 as uuidv4 } from "uuid"

interface SavedAnalysis {
  id: string
  type: "intent" | "cluster"
  name: string
  primaryKeyword: string
  data: any[]
  date: string
}

interface AnalysisToSave {
  type: "intent" | "cluster"
  name: string
  primaryKeyword: string
  data: any[]
}

export const AnalysisStorageService = {
  // Guardar un análisis
  saveAnalysis(analysis: AnalysisToSave): void {
    try {
      const analyses = this.getAnalyses()

      const newAnalysis: SavedAnalysis = {
        id: uuidv4(),
        ...analysis,
        date: new Date().toISOString(),
      }

      analyses.push(newAnalysis)
      localStorage.setItem("saved_analyses", JSON.stringify(analyses))
    } catch (error) {
      console.error("Error al guardar el análisis:", error)
      throw new Error("No se pudo guardar el análisis")
    }
  },

  // Obtener todos los análisis guardados
  getAnalyses(): SavedAnalysis[] {
    try {
      const analysesJson = localStorage.getItem("saved_analyses")
      return analysesJson ? JSON.parse(analysesJson) : []
    } catch (error) {
      console.error("Error al obtener los análisis:", error)
      return []
    }
  },

  // Obtener análisis por tipo
  getAnalysesByType(type: "intent" | "cluster"): SavedAnalysis[] {
    try {
      const analyses = this.getAnalyses()
      return analyses.filter((analysis) => analysis.type === type)
    } catch (error) {
      console.error(`Error al obtener los análisis de tipo ${type}:`, error)
      return []
    }
  },

  // Eliminar un análisis
  deleteAnalysis(id: string): void {
    try {
      const analyses = this.getAnalyses()
      const updatedAnalyses = analyses.filter((analysis) => analysis.id !== id)
      localStorage.setItem("saved_analyses", JSON.stringify(updatedAnalyses))
    } catch (error) {
      console.error("Error al eliminar el análisis:", error)
      throw new Error("No se pudo eliminar el análisis")
    }
  },
}
export type { SavedAnalysis }

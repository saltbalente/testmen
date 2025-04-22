"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface AnalysisSaveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  analysisType: "intent" | "cluster" | null
  analysisName: string
  onAnalysisNameChange: (name: string) => void
  onSave: () => void
}

export function AnalysisSaveDialog({
  open,
  onOpenChange,
  analysisType,
  analysisName,
  onAnalysisNameChange,
  onSave,
}: AnalysisSaveDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Guardar Análisis de {analysisType === "intent" ? "Intención" : "Clusters"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="analysis-name" className="text-sm font-medium">
              Nombre del análisis
            </label>
            <Input
              id="analysis-name"
              value={analysisName}
              onChange={(e) => onAnalysisNameChange(e.target.value)}
              placeholder="Ej: Análisis SEO Proyecto X"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={onSave}>Guardar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

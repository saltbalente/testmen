"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SavedAnalysis {
  id: string
  name: string
  type: "intent" | "cluster"
  primaryKeyword: string
  date: string
  data: any[]
}

interface SavedAnalysesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  analyses: SavedAnalysis[]
  onLoadAnalysis: (analysis: SavedAnalysis) => void
  onDeleteAnalysis: (id: string, e: React.MouseEvent) => void
}

export function SavedAnalysesDialog({
  open,
  onOpenChange,
  analyses,
  onLoadAnalysis,
  onDeleteAnalysis,
}: SavedAnalysesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Análisis Guardados</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {analyses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No hay análisis guardados</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => onLoadAnalysis(analysis)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{analysis.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {analysis.type === "intent" ? "Análisis de Intención" : "Análisis de Clusters"}
                      </p>
                      <p className="text-sm text-muted-foreground">Keyword: {analysis.primaryKeyword}</p>
                      <p className="text-xs text-muted-foreground">{new Date(analysis.date).toLocaleString()}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={(e) => onDeleteAnalysis(analysis.id, e)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-trash-2"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CopyIcon, CheckCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PromptOptimizerProps {
  initialPrompt: string
  onOptimize: (optimizedPrompt: string) => void
  isOptimizing: boolean
}

export function PromptOptimizer({
  initialPrompt,
  onOptimize,
  isOptimizing: initialIsOptimizing,
}: PromptOptimizerProps) {
  const [optimizedPrompt, setOptimizedPrompt] = useState(initialPrompt)
  const [isOptimizing, setIsOptimizing] = useState(initialIsOptimizing)
  const { toast } = useToast()

  const handleOptimize = async () => {
    // Simulate optimization process
    setIsOptimizing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Placeholder for actual optimization logic
    const optimized = `Optimized: ${initialPrompt} (This is a simulation)`
    setOptimizedPrompt(optimized)
    onOptimize(optimized)
    setIsOptimizing(false)

    toast({
      title: "Prompt optimizado",
      description: "El prompt ha sido optimizado exitosamente.",
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(optimizedPrompt)
    toast({
      title: "Copiado al portapapeles",
      description: "El prompt optimizado ha sido copiado al portapapeles.",
    })
  }

  return (
    <Card className="border-0 bg-black/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-400" />
          Optimizador de Prompts
        </CardTitle>
        <CardDescription>Mejora automáticamente la calidad y efectividad de tus prompts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={optimizedPrompt}
          readOnly
          className="min-h-[150px] w-full font-mono text-sm resize-none bg-black/40 border-white/10"
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!optimizedPrompt}
            className="bg-background/50 hover:bg-background/80 transition-colors"
          >
            <CopyIcon className="h-4 w-4 mr-2" />
            Copiar
          </Button>
          <Button
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="bg-primary/80 hover:bg-primary transition-colors"
          >
            {isOptimizing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Optimizando...
              </>
            ) : (
              "Optimizar Prompt"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

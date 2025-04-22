"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PromptValidatorProps {
  initialPrompt: string
  onValidate: (isValid: boolean) => void
  isValidating: boolean
}

export function PromptValidator({ initialPrompt, onValidate, isValidating }: PromptValidatorProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const { toast } = useToast()
  const [isValidatingState, setIsValidating] = useState(false)

  const handleValidate = async () => {
    setIsValidating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Placeholder for actual validation logic
    const valid = initialPrompt.length > 50
    setIsValid(valid)
    onValidate(valid)
    setIsValidating(false)

    toast({
      title: valid ? "Prompt válido" : "Prompt inválido",
      description: valid ? "El prompt ha pasado la validación." : "El prompt no cumple con los requisitos mínimos.",
    })
  }

  return (
    <Card className="border-0 bg-black/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isValid === true && <CheckCircle className="h-5 w-5 text-green-400" />}
          {isValid === false && <XCircle className="h-5 w-5 text-red-400" />}
          Validador de Prompts
        </CardTitle>
        <CardDescription>Verifica que tu prompt cumpla con los requisitos mínimos de calidad</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={initialPrompt}
          readOnly
          className="min-h-[150px] w-full font-mono text-sm resize-none bg-black/40 border-white/10"
        />
        {isValid !== null && (
          <div className="flex items-center gap-2">
            {isValid ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : (
              <XCircle className="h-4 w-4 text-red-400" />
            )}
            <p className="text-sm">
              {isValid ? "El prompt es válido." : "El prompt no cumple con los requisitos mínimos."}
            </p>
          </div>
        )}
        <Button
          onClick={handleValidate}
          disabled={isValidating}
          className="w-full bg-primary/80 hover:bg-primary transition-colors"
        >
          {isValidating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Validando...
            </>
          ) : (
            "Validar Prompt"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

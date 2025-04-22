"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface GeneratorTabProps {
  onGenerate: (prompt: string) => void
}

const GeneratorTab: React.FC<GeneratorTabProps> = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState<string>("")

  const handlePresetSelect = (preset: string) => {
    setPrompt(preset)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
  }

  return (
    <div className="p-4">
      <Textarea
        placeholder="Escribe tu idea aquí..."
        className="w-full h-32 mb-4"
        value={prompt}
        onChange={handleInputChange}
      />
      <Button onClick={() => onGenerate(prompt)}>Generar</Button>

      <h3 className="text-lg font-semibold">Presets de Ocultismo Realista</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Altar de Bruja", "Ritual Nocturno", "Preparación de Pociones"].map((preset) => (
          <Button
            key={preset}
            variant="outline"
            className="h-auto py-2 px-4 justify-start"
            onClick={() => handlePresetSelect(preset)}
          >
            {preset}
          </Button>
        ))}
      </div>

      <h3 className="text-lg font-semibold mt-6">Presets de Magia Ceremonial</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Círculo de Protección", "Mesa de Adivinación", "Laboratorio Alquímico"].map((preset) => (
          <Button
            key={preset}
            variant="outline"
            className="h-auto py-2 px-4 justify-start"
            onClick={() => handlePresetSelect(preset)}
          >
            {preset}
          </Button>
        ))}
      </div>

      <h3 className="text-lg font-semibold mt-6">Presets de Esoterismo Natural</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Bosque Encantado", "Cueva Ceremonial", "Celebración de Solsticio"].map((preset) => (
          <Button
            key={preset}
            variant="outline"
            className="h-auto py-2 px-4 justify-start"
            onClick={() => handlePresetSelect(preset)}
          >
            {preset}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default GeneratorTab

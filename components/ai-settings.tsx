"use client"

import type React from "react"
import { Slider, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export interface PromptHistoryItem {
  prompt: string
  response: string
  timestamp: Date
}

export interface AISettingsState {
  apiKey: string
  apiUrl: string
  model: string
  temperature: number
  maxTokens: number
  savePromptHistory: boolean
  promptHistory: PromptHistoryItem[]
}

const initialAISettings: AISettingsState = {
  apiKey: "",
  apiUrl: "https://api.deepseek.com/v1/chat/completions",
  model: "deepseek-chat",
  temperature: 0.7,
  maxTokens: 1000,
  savePromptHistory: true,
  promptHistory: [],
}

interface AISettingsProps {
  settings: AISettingsState
  updateSettings: (newSettings: AISettingsState) => void
}

const AISettings: React.FC<AISettingsProps> = ({ settings, updateSettings }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key de DeepSeek</Label>
          <Input
            id="apiKey"
            value={settings.apiKey}
            onChange={(e) => updateSettings({ ...settings, apiKey: e.target.value })}
            placeholder="Ingresa tu API key de DeepSeek"
          />
          {!settings.apiKey && (
            <p className="text-sm text-red-500">Se requiere una API key para conectarse a DeepSeek</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="apiUrl">URL de la API</Label>
          <Input
            id="apiUrl"
            value={settings.apiUrl}
            onChange={(e) => updateSettings({ ...settings, apiUrl: e.target.value })}
            placeholder="URL de la API de DeepSeek"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Modelo</Label>
          <Select value={settings.model} onValueChange={(value) => updateSettings({ ...settings, model: value })}>
            <SelectTrigger id="model">
              <SelectValue placeholder="Selecciona un modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deepseek-chat">DeepSeek Chat</SelectItem>
              <SelectItem value="deepseek-coder">DeepSeek Coder</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="temperature">Temperatura: {settings.temperature}</Label>
          <Slider
            id="temperature"
            min={0}
            max={1}
            step={0.1}
            value={[settings.temperature]}
            onValueChange={(value) => updateSettings({ ...settings, temperature: value[0] })}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Preciso</span>
            <span>Creativo</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxTokens">Máximo de tokens: {settings.maxTokens}</Label>
          <Slider
            id="maxTokens"
            min={100}
            max={4000}
            step={100}
            value={[settings.maxTokens]}
            onValueChange={(value) => updateSettings({ ...settings, maxTokens: value[0] })}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="savePromptHistory"
            checked={settings.savePromptHistory}
            onCheckedChange={(checked) =>
              updateSettings({
                ...settings,
                savePromptHistory: checked === true,
              })
            }
          />
          <Label htmlFor="savePromptHistory">Guardar historial de prompts</Label>
        </div>
      </div>
    </div>
  )
}

export default AISettings
export { initialAISettings }

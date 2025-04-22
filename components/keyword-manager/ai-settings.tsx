"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { type AIProvider, type AIServiceConfig, testApiConnection } from "@/services/ai-service"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function AISettings() {
  const { toast } = useToast()
  const [provider, setProvider] = useState<AIProvider>("openai")
  const [openaiKey, setOpenaiKey] = useState("")
  const [deepseekKey, setDeepseekKey] = useState("")
  const [deepseekUrl, setDeepseekUrl] = useState("https://api.deepseek.com")
  const [model, setModel] = useState("gpt-3.5-turbo")
  const [temperature, setTemperature] = useState(0.7)
  const [useCache, setUseCache] = useState(true)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"none" | "success" | "error">("none")
  const [connectionMessage, setConnectionMessage] = useState("")

  // Cargar configuración guardada
  useEffect(() => {
    const savedProvider = localStorage.getItem("ai_provider")
    if (savedProvider) {
      setProvider(savedProvider as AIProvider)
    }

    const savedOpenaiKey = localStorage.getItem("openai_api_key")
    if (savedOpenaiKey) {
      setOpenaiKey(savedOpenaiKey)
    }

    const savedDeepseekKey = localStorage.getItem("deepseek_api_key")
    if (savedDeepseekKey) {
      setDeepseekKey(savedDeepseekKey)
    }

    const savedDeepseekUrl = localStorage.getItem("deepseek_api_url")
    if (savedDeepseekUrl) {
      setDeepseekUrl(savedDeepseekUrl)
    }

    const savedModel = localStorage.getItem("ai_model")
    if (savedModel) {
      setModel(savedModel)
    } else {
      // Establecer modelo predeterminado según el proveedor
      setModel(provider === "openai" ? "gpt-3.5-turbo" : "deepseek-chat")
    }

    const savedTemperature = localStorage.getItem("ai_temperature")
    if (savedTemperature) {
      setTemperature(Number.parseFloat(savedTemperature))
    }

    const savedUseCache = localStorage.getItem("ai_use_cache")
    if (savedUseCache !== null) {
      setUseCache(savedUseCache === "true")
    }
  }, [])

  // Actualizar modelo cuando cambia el proveedor
  useEffect(() => {
    if (provider === "openai") {
      setModel("gpt-3.5-turbo")
    } else {
      setModel("deepseek-chat")
    }
  }, [provider])

  const handleSaveSettings = async () => {
    // Verificar que la clave API está configurada
    const apiKey = provider === "openai" ? openaiKey : deepseekKey
    if (!apiKey) {
      toast({
        title: "Error",
        description: `Por favor, introduce una clave API para ${provider === "openai" ? "OpenAI" : "Deepseek"}.`,
        variant: "destructive",
      })
      return
    }

    // Probar la conexión antes de guardar
    setIsTestingConnection(true)
    setConnectionStatus("none")
    setConnectionMessage("")

    try {
      const config: AIServiceConfig = {
        provider,
        apiKey,
        model,
        temperature,
      }

      const result = await testApiConnection(config)

      if (result.success) {
        setConnectionStatus("success")
        setConnectionMessage(result.message)

        // Guardar configuración
        localStorage.setItem("ai_provider", provider)
        localStorage.setItem("openai_api_key", openaiKey)
        localStorage.setItem("deepseek_api_key", deepseekKey)
        localStorage.setItem("deepseek_api_url", deepseekUrl)
        localStorage.setItem("ai_model", model)
        localStorage.setItem("ai_temperature", temperature.toString())
        localStorage.setItem("ai_use_cache", useCache.toString())

        toast({
          title: "Configuración guardada",
          description: "La configuración de IA se ha guardado correctamente.",
        })
      } else {
        setConnectionStatus("error")
        setConnectionMessage(result.message)

        toast({
          title: "Error de conexión",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      setConnectionStatus("error")
      setConnectionMessage(error.message || "Error desconocido al probar la conexión.")

      toast({
        title: "Error",
        description: error.message || "Error desconocido al probar la conexión.",
        variant: "destructive",
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configuración de IA</CardTitle>
        <CardDescription>Configura los parámetros para la generación de contenido con IA.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="provider" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="provider">Proveedor</TabsTrigger>
            <TabsTrigger value="model">Modelo</TabsTrigger>
            <TabsTrigger value="advanced">Avanzado</TabsTrigger>
          </TabsList>

          <TabsContent value="provider" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="provider">Proveedor de IA</Label>
                <Select value={provider} onValueChange={(value) => setProvider(value as AIProvider)}>
                  <SelectTrigger id="provider">
                    <SelectValue placeholder="Selecciona un proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="deepseek">Deepseek</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {provider === "openai" ? (
                <div>
                  <Label htmlFor="openai-key">Clave API de OpenAI</Label>
                  <Input
                    id="openai-key"
                    type="password"
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    placeholder="sk-..."
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Obtén tu clave API en{" "}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      platform.openai.com
                    </a>
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="deepseek-key">Clave API de Deepseek</Label>
                    <Input
                      id="deepseek-key"
                      type="password"
                      value={deepseekKey}
                      onChange={(e) => setDeepseekKey(e.target.value)}
                      placeholder="sk-..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="deepseek-url">URL de la API de Deepseek</Label>
                    <Input
                      id="deepseek-url"
                      type="text"
                      value={deepseekUrl}
                      onChange={(e) => setDeepseekUrl(e.target.value)}
                      placeholder="https://api.deepseek.com"
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="model" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="model">Modelo</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Selecciona un modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {provider === "openai" ? (
                      <>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="deepseek-chat">Deepseek Chat</SelectItem>
                        <SelectItem value="deepseek-coder">Deepseek Coder</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="temperature">Temperatura: {temperature.toFixed(1)}</Label>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Preciso</span>
                  <span>Creativo</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Switch id="use-cache" checked={useCache} onCheckedChange={setUseCache} />
              <Label htmlFor="use-cache">Usar caché para respuestas</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Almacena las respuestas de la IA para ahorrar tokens y acelerar las respuestas repetidas.
            </p>
          </TabsContent>
        </Tabs>

        {connectionStatus !== "none" && (
          <div
            className={`mt-4 p-3 rounded-md flex items-center space-x-2 ${
              connectionStatus === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {connectionStatus === "success" ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            <span>{connectionMessage}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveSettings} disabled={isTestingConnection} className="w-full">
          {isTestingConnection ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Probando conexión...
            </>
          ) : (
            "Guardar configuración"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

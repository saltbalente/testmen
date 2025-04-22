"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Check, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { DomainManager } from "./domain-manager"

export default function HerramientaIA() {
  const [apiKey, setApiKey] = useState("")
  const [isApiKeyValid, setIsApiKeyValid] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Estados para las diferentes herramientas
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("separar-palabras")

  // Estados para la herramienta de sinónimos
  const [tematica, setTematica] = useState("general")
  const [tipoLenguaje, setTipoLenguaje] = useState("formal")
  const [edadPublico, setEdadPublico] = useState("adulto")
  const [mejorarRedaccion, setMejorarRedaccion] = useState(true)

  // Función para validar la API key de OpenAI
  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      setErrorMessage("Por favor, ingresa una API key")
      return
    }

    setIsValidating(true)
    setErrorMessage("")

    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })

      if (response.ok) {
        setIsApiKeyValid(true)
        localStorage.setItem("openai_api_key", apiKey)
      } else {
        setIsApiKeyValid(false)
        setErrorMessage("API key inválida. Por favor, verifica e intenta nuevamente.")
      }
    } catch (error) {
      setIsApiKeyValid(false)
      setErrorMessage("Error al validar la API key. Por favor, intenta nuevamente.")
    } finally {
      setIsValidating(false)
    }
  }

  // Cargar API key guardada al iniciar
  useEffect(() => {
    const savedApiKey = localStorage.getItem("openai_api_key")
    if (savedApiKey) {
      setApiKey(savedApiKey)
      setIsApiKeyValid(true)
    }
  }, [])

  // Función para separar palabras con coma
  const separarPalabras = () => {
    if (!inputText.trim()) return

    setIsProcessing(true)
    const palabras = inputText.split(/\s+/).filter((word) => word.trim() !== "")
    setOutputText(palabras.join(", "))
    setIsProcessing(false)
  }

  // Función para separar líneas con coma
  const separarLineas = () => {
    if (!inputText.trim()) return

    setIsProcessing(true)
    const lineas = inputText.split("\n").filter((line) => line.trim() !== "")
    setOutputText(lineas.join(", "))
    setIsProcessing(false)
  }

  // Función para crear texto con sinónimos
  const crearSinonimos = async () => {
    if (!inputText.trim() || !isApiKeyValid) return

    setIsProcessing(true)

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `Eres un asistente especializado en reescribir textos usando sinónimos.
              Temática: ${tematica}
              Tipo de lenguaje: ${tipoLenguaje}
              Edad del público: ${edadPublico}
              ${mejorarRedaccion ? "Debes mejorar la redacción del texto." : "Mantén la estructura del texto original."}`,
            },
            {
              role: "user",
              content: `Reescribe el siguiente texto usando sinónimos diferentes pero manteniendo el significado original:\n\n${inputText}`,
            },
          ],
          temperature: 0.7,
        }),
      })

      const data = await response.json()
      if (data.choices && data.choices[0] && data.choices[0].message) {
        setOutputText(data.choices[0].message.content)
      } else {
        setErrorMessage("Error al procesar la solicitud")
      }
    } catch (error) {
      setErrorMessage("Error al comunicarse con la API de OpenAI")
    } finally {
      setIsProcessing(false)
    }
  }

  // Función para contar palabras
  const contarPalabras = () => {
    if (!inputText.trim()) return

    setIsProcessing(true)
    const palabras = inputText.split(/\s+/).filter((word) => word.trim() !== "")
    setOutputText(`El texto contiene ${palabras.length} palabras.`)
    setIsProcessing(false)
  }

  // Función para enumerar palabras y frases repetidas
  const enumerarRepetidas = async () => {
    if (!inputText.trim() || !isApiKeyValid) return

    setIsProcessing(true)

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `Eres un asistente especializado en análisis de texto. Debes identificar y enumerar las palabras y frases (de 2, 3 y 4 palabras) que más se repiten en un texto. Ignora artículos, preposiciones y palabras comunes como "el", "la", "de", "en", "y", "a", "que", "con", "por", "para", "un", "una", etc. Presenta los resultados en formato de lista ordenada por frecuencia, indicando el número de repeticiones.`,
            },
            {
              role: "user",
              content: `Analiza el siguiente texto e identifica las palabras y frases (long tail de 2, 3 y 4 palabras) que más se repiten:\n\n${inputText}`,
            },
          ],
          temperature: 0.3,
        }),
      })

      const data = await response.json()
      if (data.choices && data.choices[0] && data.choices[0].message) {
        setOutputText(data.choices[0].message.content)
      } else {
        setErrorMessage("Error al procesar la solicitud")
      }
    } catch (error) {
      setErrorMessage("Error al comunicarse con la API de OpenAI")
    } finally {
      setIsProcessing(false)
    }
  }

  // Función para quitar tildes
  const quitarTildes = (texto: string) => {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ñ/g, "n")
      .replace(/Ñ/g, "N")
  }

  // Función para eliminar caracteres especiales
  const eliminarCaracteres = () => {
    if (!inputText.trim()) return

    setIsProcessing(true)
    // Elimina todos los caracteres que no sean letras, números o espacios
    const textoLimpio = inputText.replace(/[^\w\s]/gi, "").replace(/_/g, "")
    setOutputText(textoLimpio)
    setIsProcessing(false)
  }

  // Función para quitar stop words
  const quitarStopWords = async () => {
    if (!inputText.trim() || !isApiKeyValid) return

    setIsProcessing(true)

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `Eres un asistente especializado en procesamiento de lenguaje natural. Tu tarea es eliminar todas las "stop words" (palabras vacías) de un texto en español. Estas incluyen artículos (el, la, los, las), preposiciones (de, por, para, con, en), conjunciones (y, o, pero), pronombres comunes (yo, tú, él), y otras palabras de alta frecuencia que no aportan significado semántico relevante. Devuelve ÚNICAMENTE el texto procesado sin stop words, manteniendo las palabras significativas separadas por espacios.`,
            },
            {
              role: "user",
              content: `Elimina todas las stop words del siguiente texto:\n\n${inputText}`,
            },
          ],
          temperature: 0.3,
        }),
      })

      const data = await response.json()
      if (data.choices && data.choices[0] && data.choices[0].message) {
        setOutputText(data.choices[0].message.content)
      } else {
        setErrorMessage("Error al procesar la solicitud")
      }
    } catch (error) {
      setErrorMessage("Error al comunicarse con la API de OpenAI")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="w-full overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800 rounded-xl">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 pb-6">
          <CardTitle className="flex items-center text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            <Sparkles className="h-6 w-6 mr-3 text-primary animate-pulse" />
            Herramienta Multiusos IA
          </CardTitle>
          <CardDescription>
            Utiliza la IA de OpenAI para procesar y transformar texto de diferentes maneras
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-6 space-y-6 shadow-md">
          {/* Configuración de API Key */}
          <div className="mb-6 p-4 border rounded-lg bg-muted/50">
            <h3 className="text-lg font-medium mb-2">Configuración de OpenAI</h3>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Ingresa tu API key de OpenAI"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary dark:bg-gray-700 dark:text-white transition-all duration-200"
              />
              <Button onClick={validateApiKey} disabled={isValidating} variant="outline">
                {isValidating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : isApiKeyValid ? (
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <span>Validar</span>
                )}
                {isApiKeyValid && "Conectado"}
              </Button>
            </div>

            {errorMessage && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {isApiKeyValid && (
              <div className="mt-2 flex items-center">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Check className="h-3 w-3 mr-1" /> API conectada correctamente
                </Badge>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          {/* Herramientas */}
          <Tabs defaultValue="separar-palabras" className="w-full" onValueChange={(value) => setActiveTab(value)}>
            <div className="mb-6">
              <h3 className="text-base font-medium mb-3">Herramientas disponibles:</h3>
              <div className="space-y-3">
                <div className="border rounded-lg p-3 bg-muted/20">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Procesamiento de texto:</h4>
                  <TabsList className="flex flex-wrap gap-2 bg-transparent">
                    <TabsTrigger value="separar-palabras" className="data-[state=active]:bg-primary">
                      Separar Palabras
                    </TabsTrigger>
                    <TabsTrigger value="separar-lineas" className="data-[state=active]:bg-primary">
                      Separar Líneas
                    </TabsTrigger>
                    <TabsTrigger value="eliminar-duplicados" className="data-[state=active]:bg-primary">
                      Eliminar Duplicados
                    </TabsTrigger>
                    <TabsTrigger value="ordenar-alfabeticamente" className="data-[state=active]:bg-primary">
                      Ordenar Alfabéticamente
                    </TabsTrigger>
                    <TabsTrigger value="quitar-tildes" className="data-[state=active]:bg-primary">
                      Quitar Tildes
                    </TabsTrigger>
                    <TabsTrigger value="eliminar-caracteres" className="data-[state=active]:bg-primary">
                      Eliminar Caracteres
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="border rounded-lg p-3 bg-muted/20">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Herramientas IA:</h4>
                  <TabsList className="flex flex-wrap gap-2 bg-transparent">
                    <TabsTrigger value="sinonimos" className="data-[state=active]:bg-primary">
                      Crear Sinónimos
                    </TabsTrigger>
                    <TabsTrigger value="domain-manager" className="data-[state=active]:bg-primary">
                      Gestión de Dominios
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
            </div>

            {/* Entrada y salida de texto (común para todas las pestañas) */}
            {activeTab !== "domain-manager" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="inputText">Texto de entrada</Label>
                  <Textarea
                    id="inputText"
                    placeholder="Ingresa el texto que deseas procesar..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary dark:bg-gray-700 dark:text-white transition-all duration-200 min-h-[200px]"
                  />
                </div>

                <div>
                  <Label htmlFor="outputText">Resultado</Label>
                  <Textarea
                    id="outputText"
                    placeholder="Aquí aparecerá el resultado..."
                    value={outputText}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary dark:bg-gray-700 dark:text-white transition-all duration-200 min-h-[200px]"
                  />
                </div>
              </div>
            )}

            {/* Configuración específica para cada herramienta */}
            <TabsContent value="separar-palabras">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Esta herramienta separa todas las palabras del texto y las une con comas.
                </p>
                <Button
                  onClick={separarPalabras}
                  disabled={!inputText.trim() || isProcessing}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow focus:ring-2 focus:ring-primary/30 focus:outline-none"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Separar palabras con coma
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="separar-lineas">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Esta herramienta toma cada línea del texto y las une con comas.
                </p>
                <Button
                  onClick={separarLineas}
                  disabled={!inputText.trim() || isProcessing}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow focus:ring-2 focus:ring-primary/30 focus:outline-none"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Separar líneas con coma
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="sinonimos">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Esta herramienta crea un nuevo texto reemplazando palabras con sinónimos.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label htmlFor="tematica">Temática</Label>
                    <Select value={tematica} onValueChange={setTematica}>
                      <SelectTrigger id="tematica">
                        <SelectValue placeholder="Selecciona temática" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="tecnologia">Tecnología</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="salud">Salud</SelectItem>
                        <SelectItem value="educacion">Educación</SelectItem>
                        <SelectItem value="negocios">Negocios</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tipoLenguaje">Tipo de lenguaje</Label>
                    <Select value={tipoLenguaje} onValueChange={setTipoLenguaje}>
                      <SelectTrigger id="tipoLenguaje">
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="informal">Informal</SelectItem>
                        <SelectItem value="tecnico">Técnico</SelectItem>
                        <SelectItem value="coloquial">Coloquial</SelectItem>
                        <SelectItem value="academico">Académico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="edadPublico">Edad del público</Label>
                    <Select value={edadPublico} onValueChange={setEdadPublico}>
                      <SelectTrigger id="edadPublico">
                        <SelectValue placeholder="Selecciona edad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="niños">Niños</SelectItem>
                        <SelectItem value="adolescentes">Adolescentes</SelectItem>
                        <SelectItem value="jovenes">Jóvenes</SelectItem>
                        <SelectItem value="adulto">Adultos</SelectItem>
                        <SelectItem value="mayores">Adultos mayores</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-8">
                    <input
                      type="checkbox"
                      id="mejorarRedaccion"
                      checked={mejorarRedaccion}
                      onChange={(e) => setMejorarRedaccion(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="mejorarRedaccion">Mejorar redacción</Label>
                  </div>
                </div>

                <Button
                  onClick={crearSinonimos}
                  disabled={!inputText.trim() || !isApiKeyValid || isProcessing}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow focus:ring-2 focus:ring-primary/30 focus:outline-none"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Crear texto con sinónimos
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="contar-palabras">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Esta herramienta cuenta el número total de palabras en el texto.
                </p>
                <Button
                  onClick={contarPalabras}
                  disabled={!inputText.trim() || isProcessing}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow focus:ring-2 focus:ring-primary/30 focus:outline-none"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Contar palabras
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="palabras-repetidas">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Esta herramienta identifica las palabras y frases (long tail) que más se repiten en el texto,
                  excluyendo artículos y preposiciones.
                </p>
                <Button
                  onClick={enumerarRepetidas}
                  disabled={!inputText.trim() || !isApiKeyValid || isProcessing}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow focus:ring-2 focus:ring-primary/30 focus:outline-none"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Analizar palabras repetidas
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="quitar-tildes" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quitarTildesInput">Texto con tildes</Label>
                  <Textarea
                    id="quitarTildesInput"
                    placeholder="Ingresa el texto con tildes aquí..."
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary dark:bg-gray-700 dark:text-white transition-all duration-200 min-h-[200px]"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="quitarTildesOutput">Texto sin tildes</Label>
                  <Textarea
                    id="quitarTildesOutput"
                    placeholder="El texto sin tildes aparecerá aquí..."
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary dark:bg-gray-700 dark:text-white transition-all duration-200 min-h-[200px]"
                    value={quitarTildes(inputText)}
                    readOnly
                  />
                  <Button
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow focus:ring-2 focus:ring-primary/30 focus:outline-none mt-2"
                    onClick={() => {
                      navigator.clipboard.writeText(quitarTildes(inputText))
                      toast({
                        title: "Copiado al portapapeles",
                        description: "El texto sin tildes ha sido copiado al portapapeles.",
                      })
                    }}
                  >
                    Copiar resultado
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="eliminar-caracteres">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Esta herramienta elimina todos los caracteres especiales, signos de puntuación y símbolos del texto,
                  dejando solo letras, números y espacios.
                </p>
                <Button
                  onClick={eliminarCaracteres}
                  disabled={!inputText.trim() || isProcessing}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow focus:ring-2 focus:ring-primary/30 focus:outline-none"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Eliminar caracteres especiales
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="quitar-stopwords">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Esta herramienta elimina todas las palabras vacías (stop words) como artículos, preposiciones y
                  conjunciones del texto.
                </p>
                <Button
                  onClick={quitarStopWords}
                  disabled={!inputText.trim() || !isApiKeyValid || isProcessing}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow focus:ring-2 focus:ring-primary/30 focus:outline-none"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Quitar Stop Words
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="domain-manager">
              <DomainManager />
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setInputText("")}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            Limpiar entrada
          </Button>
          <Button
            variant="outline"
            onClick={() => setOutputText("")}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            Limpiar resultado
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

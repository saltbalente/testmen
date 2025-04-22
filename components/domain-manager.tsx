"use client"

import { useState } from "react"
import { generateDomainNames } from "@/app/actions/generate-domains"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Copy, Check, AlertCircle, Sparkles } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function DomainManager() {
  // Estado para los parámetros de generación
  const [keyword, setKeyword] = useState("")
  const [count, setCount] = useState(5)
  const [keepAllWords, setKeepAllWords] = useState(true)
  const [useHyphens, setUseHyphens] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(false)
  const [rootDomain, setRootDomain] = useState("dominio.com")

  // Estado para los resultados y la UI
  const [domains, setDomains] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Función para generar dominios
  const handleGenerateDomains = async () => {
    if (!keyword.trim()) {
      setError("Por favor, ingresa una palabra clave")
      return
    }

    setIsLoading(true)
    setError(null)
    setDomains([])

    try {
      const result = await generateDomainNames({
        keyword: keyword.trim(),
        count,
        keepAllWords,
        useHyphens,
        includeNumbers,
        rootDomain: rootDomain.trim(),
      })

      if (result.success && result.domains) {
        setDomains(result.domains)
        if (result.domains.length === 0) {
          setError("No se pudieron generar subdominios. Intenta con otra palabra clave.")
        }
      } else {
        setError(result.error || "Error al generar subdominios")
      }
    } catch (err) {
      setError("Error de conexión con el servidor")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Función para formatear el dominio completo con el punto
  const formatFullDomain = (subdomain: string) => {
    // Asegurarse de que el rootDomain no comience con un punto
    const formattedRootDomain = rootDomain.startsWith(".") ? rootDomain : `.${rootDomain}`
    return `${subdomain}${formattedRootDomain}`
  }

  // Función para copiar un dominio al portapapeles
  const copyDomain = (domain: string, index: number) => {
    const fullDomain = formatFullDomain(domain)
    navigator.clipboard.writeText(fullDomain)
    setCopiedIndex(index)
    toast({
      title: "Copiado al portapapeles",
      description: `${fullDomain} ha sido copiado al portapapeles.`,
    })
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // Función para copiar todos los dominios
  const copyAllDomains = () => {
    const allDomains = domains.map((domain) => formatFullDomain(domain)).join("\n")
    navigator.clipboard.writeText(allDomains)
    toast({
      title: "Copiado al portapapeles",
      description: "Todos los dominios han sido copiados al portapapeles.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="keyword">Palabra clave o término de búsqueda</Label>
          <Input
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Ej: marketing digital, tecnología, salud..."
            className="mt-1"
          />
        </div>

        <div>
          <div className="flex justify-between items-center">
            <Label htmlFor="count">Número de subdominios a generar: {count}</Label>
          </div>
          <Slider
            id="count"
            min={1}
            max={20}
            step={1}
            value={[count]}
            onValueChange={(value) => setCount(value[0])}
            className="mt-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="keepAllWords"
              checked={keepAllWords}
              onCheckedChange={(checked) => setKeepAllWords(checked === true)}
            />
            <Label htmlFor="keepAllWords">Mantener todas las palabras</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="useHyphens"
              checked={useHyphens}
              onCheckedChange={(checked) => setUseHyphens(checked === true)}
            />
            <Label htmlFor="useHyphens">Usar guiones</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeNumbers"
              checked={includeNumbers}
              onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
            />
            <Label htmlFor="includeNumbers">Incluir números</Label>
          </div>
        </div>

        <div>
          <Label htmlFor="rootDomain">Dominio raíz (para previsualización)</Label>
          <Input
            id="rootDomain"
            value={rootDomain}
            onChange={(e) => setRootDomain(e.target.value)}
            placeholder="dominio.com"
            className="mt-1"
          />
        </div>

        <Button onClick={handleGenerateDomains} disabled={isLoading || !keyword.trim()} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generando subdominios...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generar subdominios
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {domains.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Subdominios generados</h3>
            <Button variant="outline" size="sm" onClick={copyAllDomains}>
              <Copy className="mr-2 h-4 w-4" />
              Copiar todos
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.map((domain, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <p className="font-medium truncate">
                      {domain}
                      <span className="text-muted-foreground">
                        {rootDomain.startsWith(".") ? rootDomain : `.${rootDomain}`}
                      </span>
                    </p>
                    <Button variant="ghost" size="sm" onClick={() => copyDomain(domain, index)}>
                      {copiedIndex === index ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

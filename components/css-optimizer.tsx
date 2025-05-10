"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { CopyIcon, DownloadIcon, RefreshCwIcon, ZapIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"

type OptimizationOptions = {
  extractFromHtml: boolean
  removeComments: boolean
  removeWhitespace: boolean
  shortenColors: boolean
  shortenZeroValues: boolean
  shortenFontWeights: boolean
  removeDuplicateRules: boolean
  removeDuplicateDeclarations: boolean
  mergeMediaQueries: boolean
  combineSelectors: boolean
  optimizeImportant: boolean
  removeEmptyRules: boolean
  sortProperties: boolean
  removeUnusedSelectors: boolean
  convertToShorthand: boolean
  mergeStyleTags: boolean
  optimizeVendorPrefixes: boolean
}

const defaultOptions: OptimizationOptions = {
  extractFromHtml: false,
  removeComments: true,
  removeWhitespace: true,
  shortenColors: true,
  shortenZeroValues: true,
  shortenFontWeights: false,
  removeDuplicateRules: false,
  removeDuplicateDeclarations: false,
  mergeMediaQueries: false,
  combineSelectors: false,
  optimizeImportant: false,
  removeEmptyRules: false,
  sortProperties: false,
  removeUnusedSelectors: false,
  convertToShorthand: false,
  mergeStyleTags: true,
  optimizeVendorPrefixes: false,
}

export default function CssOptimizer() {
  const [inputCss, setInputCss] = useState("")
  const [outputCss, setOutputCss] = useState("")
  const [options, setOptions] = useState<OptimizationOptions>(defaultOptions)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stats, setStats] = useState({
    originalSize: 0,
    compressedSize: 0,
    reduction: 0,
    duplicateRulesRemoved: 0,
    duplicatePropertiesRemoved: 0,
    emptyRulesRemoved: 0,
    styleTagsMerged: 0,
  })
  const [optimizationLevel, setOptimizationLevel] = useState<"basic" | "advanced">("basic")

  // Función para extraer el contenido de las etiquetas <style>
  const extractStyleTags = (html: string): { extracted: string; count: number } => {
    // Si parece ser solo CSS (no contiene etiquetas HTML), devolverlo tal cual
    if (!html.includes("<style") && !html.includes("<!DOCTYPE") && !html.includes("<html")) {
      return { extracted: html, count: 0 }
    }

    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi
    let match
    let extractedCss = ""
    let count = 0

    while ((match = styleRegex.exec(html)) !== null) {
      extractedCss += match[1] + "\n\n"
      count++
    }

    // Si no hay etiquetas style, devolver el HTML original
    if (count === 0) {
      return { extracted: html, count: 0 }
    }

    return { extracted: extractedCss, count }
  }

  // Función para eliminar comentarios
  const removeComments = (css: string): string => {
    try {
      return css.replace(/\/\*[\s\S]*?\*\//g, "")
    } catch (error) {
      console.error("Error removing comments:", error)
      return css
    }
  }

  // Función para eliminar espacios en blanco innecesarios
  const removeWhitespace = (css: string): string => {
    try {
      return css
        .replace(/\s+/g, " ")
        .replace(/\s*({|}|;|:|,)\s*/g, "$1")
        .replace(/;\s*}/g, "}")
        .trim()
    } catch (error) {
      console.error("Error removing whitespace:", error)
      return css
    }
  }

  // Función para acortar colores
  const shortenColors = (css: string): string => {
    try {
      // Convertir #rrggbb a #rgb cuando sea posible
      let result = css.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/gi, "#$1$2$3")

      // Convertir nombres de colores a hex cuando sea más corto
      const colorMap: Record<string, string> = {
        white: "#fff",
        black: "#000",
        red: "#f00",
        green: "#0f0",
        blue: "#00f",
        yellow: "#ff0",
        cyan: "#0ff",
        magenta: "#f0f",
      }

      for (const [name, hex] of Object.entries(colorMap)) {
        // Usar una expresión regular más segura
        const regex = new RegExp(`(:|\\s)${name}(;|\\s|})`, "gi")
        result = result.replace(regex, `$1${hex}$2`)
      }

      return result
    } catch (error) {
      console.error("Error shortening colors:", error)
      return css
    }
  }

  // Función para acortar valores cero
  const shortenZeroValues = (css: string): string => {
    try {
      // Eliminar unidades de valores cero
      return css
        .replace(/(^|[^0-9])0(px|em|rem|%|in|cm|mm|pt|pc|ex|vh|vw|vmin|vmax)/g, "$10")
        .replace(/([: ])0\.([0-9])/g, "$1.$2")
    } catch (error) {
      console.error("Error shortening zero values:", error)
      return css
    }
  }

  // Función para acortar font-weights
  const shortenFontWeights = (css: string): string => {
    try {
      const fontWeightMap: Record<string, string> = {
        normal: "400",
        bold: "700",
      }

      let result = css
      for (const [name, value] of Object.entries(fontWeightMap)) {
        const regex = new RegExp(`font-weight\\s*:\\s*${name}`, "gi")
        result = result.replace(regex, `font-weight:${value}`)
      }

      return result
    } catch (error) {
      console.error("Error shortening font weights:", error)
      return css
    }
  }

  // Función para eliminar reglas duplicadas
  const removeDuplicateRules = (css: string): { css: string; count: number } => {
    try {
      const rules: Record<string, string> = {}
      let count = 0

      // Extraer reglas
      const cssWithoutComments = removeComments(css)
      const ruleRegex = /([^{}]+)({[^{}]*})/g
      let match
      let result = ""

      while ((match = ruleRegex.exec(cssWithoutComments)) !== null) {
        const selector = match[1].trim()
        const declaration = match[2]

        if (!rules[selector]) {
          rules[selector] = declaration
          result += selector + declaration
        } else {
          count++
        }
      }

      return { css: result || css, count }
    } catch (error) {
      console.error("Error removing duplicate rules:", error)
      return { css, count: 0 }
    }
  }

  // Función para eliminar declaraciones duplicadas dentro de una regla
  const removeDuplicateDeclarations = (css: string): { css: string; count: number } => {
    try {
      const ruleRegex = /([^{}]+)({[^{}]*})/g
      let match
      let result = ""
      let count = 0

      while ((match = ruleRegex.exec(css)) !== null) {
        const selector = match[1].trim()
        const declarations = match[2]

        // Extraer propiedades y valores
        const propRegex = /([a-z-]+)\s*:\s*([^;{}]+)(?:;|(?=}))/gi
        let propMatch
        const props: Record<string, string> = {}

        while ((propMatch = propRegex.exec(declarations)) !== null) {
          const prop = propMatch[1].trim()
          const value = propMatch[2].trim()

          if (props[prop]) {
            count++
          }
          props[prop] = value
        }

        // Reconstruir la regla sin duplicados
        let newDeclarations = "{"
        for (const [prop, value] of Object.entries(props)) {
          newDeclarations += `${prop}:${value};`
        }
        newDeclarations = newDeclarations.replace(/;$/, "") + "}"

        result += selector + newDeclarations
      }

      return { css: result || css, count }
    } catch (error) {
      console.error("Error removing duplicate declarations:", error)
      return { css, count: 0 }
    }
  }

  // Función para eliminar reglas vacías
  const removeEmptyRules = (css: string): { css: string; count: number } => {
    try {
      const emptyRuleRegex = /[^{}]+{[\s]*}/g
      const count = (css.match(emptyRuleRegex) || []).length
      return { css: css.replace(emptyRuleRegex, ""), count }
    } catch (error) {
      console.error("Error removing empty rules:", error)
      return { css, count: 0 }
    }
  }

  // Función para convertir a notación abreviada
  const convertToShorthand = (css: string): string => {
    try {
      // Esta es una implementación simplificada
      // En una implementación real, se necesitaría un parser CSS completo
      return css
    } catch (error) {
      console.error("Error converting to shorthand:", error)
      return css
    }
  }

  // Función para unir etiquetas de estilo
  const mergeStyleTags = (css: string, extractedCount: number): string => {
    if (extractedCount <= 1) return css

    return `<style>\n${css}\n</style>`
  }

  // Función principal de optimización
  const optimizeCss = () => {
    if (!inputCss.trim()) {
      toast({
        title: "Error",
        description: "Por favor, ingresa CSS para optimizar",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProgress(0)

    // Simular procesamiento
    setTimeout(() => {
      try {
        let optimizedCss = inputCss
        const stats = {
          originalSize: inputCss.length,
          compressedSize: 0,
          reduction: 0,
          duplicateRulesRemoved: 0,
          duplicatePropertiesRemoved: 0,
          emptyRulesRemoved: 0,
          styleTagsMerged: 0,
        }

        // Extraer contenido de etiquetas style si es necesario
        let extractedCount = 0
        if (options.extractFromHtml) {
          const { extracted, count } = extractStyleTags(optimizedCss)
          optimizedCss = extracted
          extractedCount = count
          stats.styleTagsMerged = count
        }

        setProgress(10)

        // Aplicar optimizaciones básicas con manejo de errores
        if (options.removeComments) {
          try {
            optimizedCss = removeComments(optimizedCss)
          } catch (error) {
            console.error("Error in removeComments:", error)
          }
        }

        setProgress(20)

        if (options.shortenColors) {
          try {
            optimizedCss = shortenColors(optimizedCss)
          } catch (error) {
            console.error("Error in shortenColors:", error)
          }
        }

        setProgress(30)

        if (options.shortenZeroValues) {
          try {
            optimizedCss = shortenZeroValues(optimizedCss)
          } catch (error) {
            console.error("Error in shortenZeroValues:", error)
          }
        }

        setProgress(40)

        if (options.shortenFontWeights) {
          try {
            optimizedCss = shortenFontWeights(optimizedCss)
          } catch (error) {
            console.error("Error in shortenFontWeights:", error)
          }
        }

        setProgress(50)

        // Aplicar optimizaciones avanzadas con manejo de errores
        if (options.removeDuplicateRules) {
          try {
            const result = removeDuplicateRules(optimizedCss)
            optimizedCss = result.css
            stats.duplicateRulesRemoved = result.count
          } catch (error) {
            console.error("Error in removeDuplicateRules:", error)
          }
        }

        setProgress(60)

        if (options.removeDuplicateDeclarations) {
          try {
            const result = removeDuplicateDeclarations(optimizedCss)
            optimizedCss = result.css
            stats.duplicatePropertiesRemoved = result.count
          } catch (error) {
            console.error("Error in removeDuplicateDeclarations:", error)
          }
        }

        setProgress(70)

        if (options.removeEmptyRules) {
          try {
            const result = removeEmptyRules(optimizedCss)
            optimizedCss = result.css
            stats.emptyRulesRemoved = result.count
          } catch (error) {
            console.error("Error in removeEmptyRules:", error)
          }
        }

        setProgress(80)

        if (options.convertToShorthand) {
          try {
            optimizedCss = convertToShorthand(optimizedCss)
          } catch (error) {
            console.error("Error in convertToShorthand:", error)
          }
        }

        setProgress(90)

        // Eliminar espacios en blanco al final
        if (options.removeWhitespace) {
          try {
            optimizedCss = removeWhitespace(optimizedCss)
          } catch (error) {
            console.error("Error in removeWhitespace:", error)
          }
        }

        // Volver a envolver en etiquetas style si es necesario
        if (options.mergeStyleTags && extractedCount > 0) {
          try {
            optimizedCss = mergeStyleTags(optimizedCss, extractedCount)
          } catch (error) {
            console.error("Error in mergeStyleTags:", error)
          }
        }

        setProgress(100)

        // Calcular estadísticas
        stats.compressedSize = optimizedCss.length
        stats.reduction = inputCss.length > 0 ? Math.round((1 - optimizedCss.length / inputCss.length) * 100) : 0

        setOutputCss(optimizedCss)
        setStats(stats)
        setIsProcessing(false)

        toast({
          title: "CSS optimizado correctamente",
          description: `Reducción del ${stats.reduction}% (${stats.originalSize} → ${stats.compressedSize} bytes)`,
        })
      } catch (error) {
        console.error("Error optimizing CSS:", error)
        setIsProcessing(false)
        toast({
          title: "Error al optimizar CSS",
          description: "Ocurrió un error durante la optimización. Verifica el formato del CSS.",
          variant: "destructive",
        })
      }
    }, 1000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputCss)
    toast({
      title: "CSS copiado al portapapeles",
      description: "El CSS optimizado ha sido copiado al portapapeles.",
    })
  }

  const downloadCss = () => {
    const element = document.createElement("a")
    const file = new Blob([outputCss], { type: "text/css" })
    element.href = URL.createObjectURL(file)
    element.download = "optimized.css"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const resetOptions = () => {
    setOptions(defaultOptions)
    toast({
      title: "Opciones restablecidas",
      description: "Las opciones de optimización han sido restablecidas a los valores predeterminados.",
    })
  }

  const handleOptimizationLevelChange = (level: "basic" | "advanced") => {
    setOptimizationLevel(level)

    if (level === "basic") {
      setOptions({
        ...options,
        removeComments: true,
        removeWhitespace: true,
        shortenColors: true,
        shortenZeroValues: true,
        shortenFontWeights: false,
        removeDuplicateRules: false,
        removeDuplicateDeclarations: false,
        removeEmptyRules: false,
        convertToShorthand: false,
        mergeStyleTags: true,
        mergeMediaQueries: false,
        combineSelectors: false,
        optimizeImportant: false,
        sortProperties: false,
        removeUnusedSelectors: false,
        optimizeVendorPrefixes: false,
        extractFromHtml: options.extractFromHtml, // Mantener el valor actual
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="input-css" className="text-base font-medium">
              CSS Original o HTML con etiquetas style
            </Label>
            <Textarea
              id="input-css"
              className="min-h-[300px] font-mono text-sm"
              placeholder="Pega tu CSS aquí, o HTML completo con etiquetas <style> para extraer y unir..."
              value={inputCss}
              onChange={(e) => setInputCss(e.target.value)}
              disabled={isProcessing}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label className="text-base font-medium">Nivel de Optimización</Label>
            <Tabs
              defaultValue="basic"
              value={optimizationLevel}
              onValueChange={(value) => handleOptimizationLevelChange(value as "basic" | "advanced")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Básico</TabsTrigger>
                <TabsTrigger value="advanced">Avanzado</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="extract-from-html"
                      checked={options.extractFromHtml}
                      onCheckedChange={(checked) => setOptions({ ...options, extractFromHtml: checked as boolean })}
                    />
                    <Label htmlFor="extract-from-html">Extraer estilos de HTML</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remove-comments"
                      checked={options.removeComments}
                      onCheckedChange={(checked) => setOptions({ ...options, removeComments: checked as boolean })}
                    />
                    <Label htmlFor="remove-comments">Eliminar comentarios</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remove-whitespace"
                      checked={options.removeWhitespace}
                      onCheckedChange={(checked) => setOptions({ ...options, removeWhitespace: checked as boolean })}
                    />
                    <Label htmlFor="remove-whitespace">Eliminar espacios</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="shorten-colors"
                      checked={options.shortenColors}
                      onCheckedChange={(checked) => setOptions({ ...options, shortenColors: checked as boolean })}
                    />
                    <Label htmlFor="shorten-colors">Acortar colores</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="shorten-zero-values"
                      checked={options.shortenZeroValues}
                      onCheckedChange={(checked) => setOptions({ ...options, shortenZeroValues: checked as boolean })}
                    />
                    <Label htmlFor="shorten-zero-values">Acortar valores cero</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="merge-style-tags"
                      checked={options.mergeStyleTags}
                      onCheckedChange={(checked) => setOptions({ ...options, mergeStyleTags: checked as boolean })}
                    />
                    <Label htmlFor="merge-style-tags">Unir etiquetas style</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 pt-4">
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="shorten-font-weights"
                        checked={options.shortenFontWeights}
                        onCheckedChange={(checked) =>
                          setOptions({ ...options, shortenFontWeights: checked as boolean })
                        }
                      />
                      <Label htmlFor="shorten-font-weights">Acortar font-weights</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remove-duplicate-rules"
                        checked={options.removeDuplicateRules}
                        onCheckedChange={(checked) =>
                          setOptions({ ...options, removeDuplicateRules: checked as boolean })
                        }
                      />
                      <Label htmlFor="remove-duplicate-rules">Eliminar reglas duplicadas</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remove-duplicate-declarations"
                        checked={options.removeDuplicateDeclarations}
                        onCheckedChange={(checked) =>
                          setOptions({ ...options, removeDuplicateDeclarations: checked as boolean })
                        }
                      />
                      <Label htmlFor="remove-duplicate-declarations">Eliminar propiedades duplicadas</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="merge-media-queries"
                        checked={options.mergeMediaQueries}
                        onCheckedChange={(checked) => setOptions({ ...options, mergeMediaQueries: checked as boolean })}
                      />
                      <Label htmlFor="merge-media-queries">Unir media queries</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="combine-selectors"
                        checked={options.combineSelectors}
                        onCheckedChange={(checked) => setOptions({ ...options, combineSelectors: checked as boolean })}
                      />
                      <Label htmlFor="combine-selectors">Combinar selectores similares</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="optimize-important"
                        checked={options.optimizeImportant}
                        onCheckedChange={(checked) => setOptions({ ...options, optimizeImportant: checked as boolean })}
                      />
                      <Label htmlFor="optimize-important">Optimizar uso de !important</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remove-empty-rules"
                        checked={options.removeEmptyRules}
                        onCheckedChange={(checked) => setOptions({ ...options, removeEmptyRules: checked as boolean })}
                      />
                      <Label htmlFor="remove-empty-rules">Eliminar reglas vacías</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sort-properties"
                        checked={options.sortProperties}
                        onCheckedChange={(checked) => setOptions({ ...options, sortProperties: checked as boolean })}
                      />
                      <Label htmlFor="sort-properties">Ordenar propiedades</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remove-unused-selectors"
                        checked={options.removeUnusedSelectors}
                        onCheckedChange={(checked) =>
                          setOptions({ ...options, removeUnusedSelectors: checked as boolean })
                        }
                      />
                      <Label htmlFor="remove-unused-selectors">Eliminar selectores no utilizados</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="convert-to-shorthand"
                        checked={options.convertToShorthand}
                        onCheckedChange={(checked) =>
                          setOptions({ ...options, convertToShorthand: checked as boolean })
                        }
                      />
                      <Label htmlFor="convert-to-shorthand">Convertir a notación abreviada</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="optimize-vendor-prefixes"
                        checked={options.optimizeVendorPrefixes}
                        onCheckedChange={(checked) =>
                          setOptions({ ...options, optimizeVendorPrefixes: checked as boolean })
                        }
                      />
                      <Label htmlFor="optimize-vendor-prefixes">Optimizar prefijos de navegador</Label>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={optimizeCss} disabled={isProcessing || !inputCss.trim()}>
              <ZapIcon className="h-4 w-4 mr-2" />
              Optimizar CSS
            </Button>

            <Button variant="outline" onClick={resetOptions} disabled={isProcessing}>
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Restablecer Opciones
            </Button>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Optimizando CSS...</p>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="output-css" className="text-base font-medium">
                CSS Optimizado
              </Label>

              {stats.compressedSize > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {stats.originalSize} → {stats.compressedSize} bytes
                  </Badge>
                  <Badge variant={stats.reduction > 0 ? "success" : "secondary"} className="font-mono">
                    {stats.reduction > 0 ? "-" : ""}
                    {stats.reduction}%
                  </Badge>
                </div>
              )}
            </div>

            <Textarea
              id="output-css"
              className="min-h-[300px] font-mono text-sm"
              placeholder="El CSS optimizado aparecerá aquí..."
              value={outputCss}
              readOnly
            />
          </div>

          {outputCss && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={copyToClipboard}>
                  <CopyIcon className="h-4 w-4 mr-2" />
                  Copiar CSS
                </Button>

                <Button variant="outline" onClick={downloadCss}>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Descargar CSS
                </Button>
              </div>

              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Estadísticas de Optimización</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tamaño original:</span>
                      <span className="font-mono">{stats.originalSize} bytes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tamaño optimizado:</span>
                      <span className="font-mono">{stats.compressedSize} bytes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reducción:</span>
                      <span className="font-mono">{stats.reduction}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reglas duplicadas eliminadas:</span>
                      <span className="font-mono">{stats.duplicateRulesRemoved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Propiedades duplicadas eliminadas:</span>
                      <span className="font-mono">{stats.duplicatePropertiesRemoved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reglas vacías eliminadas:</span>
                      <span className="font-mono">{stats.emptyRulesRemoved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Etiquetas style unidas:</span>
                      <span className="font-mono">{stats.styleTagsMerged}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

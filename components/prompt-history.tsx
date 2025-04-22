"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HistoryIcon, SearchIcon, TrashIcon, ClockIcon, ChevronDownIcon, ChevronUpIcon, CopyIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { toast } from "@/hooks/use-toast"

type HistoryItem = {
  id: string
  date: string
  prompt: string
  title: string
  type: string
}

interface PromptHistoryProps {
  history: HistoryItem[]
  onLoadPrompt: (item: HistoryItem) => void
  onRemovePrompt: (id: string, e: React.MouseEvent) => void
}

export function PromptHistory({ history, onLoadPrompt, onRemovePrompt }: PromptHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  // Filtrar el historial basado en la búsqueda y el filtro activo
  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.prompt.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeFilter === "all") return matchesSearch
    return matchesSearch && item.type === activeFilter
  })

  // Obtener tipos únicos para los filtros
  const uniqueTypes = Array.from(new Set(history.map((item) => item.type)))

  // Función para alternar la expansión de un elemento
  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Función para copiar el contenido del prompt
  const copyPromptContent = (content: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(content)
    toast({
      title: "Copiado al portapapeles",
      description: "El contenido del prompt ha sido copiado",
    })
  }

  return (
    <Card className="border border-purple-500/30 bg-black/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HistoryIcon className="h-5 w-5 text-purple-400" />
          Historial de Prompts
        </CardTitle>
        <CardDescription>Accede a tus prompts generados anteriormente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en el historial..."
              className="pl-8 bg-black/20 border-white/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all" onValueChange={setActiveFilter}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              {uniqueTypes.slice(0, 3).map((type) => (
                <TabsTrigger key={type} value={type} className="capitalize">
                  {type}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {filteredHistory.length > 0 ? (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {filteredHistory.map((item) => (
                  <Collapsible
                    key={item.id}
                    open={expandedItems[item.id]}
                    onOpenChange={() => toggleExpand(item.id)}
                    className="p-3 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div
                        className="font-medium truncate mr-2 cursor-pointer flex-1"
                        onClick={() => onLoadPrompt(item)}
                      >
                        {item.title}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-blue-400"
                          onClick={(e) => copyPromptContent(item.prompt, e)}
                          title="Copiar contenido"
                        >
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={(e) => onRemovePrompt(item.id, e)}
                          title="Eliminar prompt"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground"
                            title={expandedItems[item.id] ? "Contraer" : "Expandir"}
                          >
                            {expandedItems[item.id] ? (
                              <ChevronUpIcon className="h-4 w-4" />
                            ) : (
                              <ChevronDownIcon className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="outline"
                        className="capitalize bg-purple-500/10 text-purple-200 border-purple-500/30"
                      >
                        {item.type}
                      </Badge>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {item.date}
                      </div>
                    </div>
                    <CollapsibleContent>
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="text-xs text-muted-foreground mb-2">Contenido del prompt:</div>
                        <Textarea
                          value={item.prompt}
                          readOnly
                          className="min-h-[150px] w-full font-mono text-xs border-0 resize-none bg-black/20 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30"
                          onClick={() => onLoadPrompt(item)}
                        >
                          Cargar este prompt
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              {searchTerm ? "No se encontraron resultados" : "No hay prompts en el historial"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

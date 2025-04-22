"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import {
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  FolderIcon,
  ImportIcon,
  ImportIcon as ExportIcon,
  XIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Tipos para el baúl de diseños
type DesignItem = {
  id: string
  title: string
  code: string
  category: string
  createdAt: Date
  updatedAt: Date
}

type DesignVault = {
  categories: string[]
  designs: DesignItem[]
}

// Función segura para acceder a localStorage
const getLocalStorage = (key: string, defaultValue: any = "{}") => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key)
    return stored ? stored : defaultValue
  }
  return defaultValue
}

// Función segura para guardar en localStorage
const setLocalStorage = (key: string, value: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value)
  }
}

export default function DesignVault() {
  // Estado para el baúl de diseños
  const [vault, setVault] = useState<DesignVault>({
    categories: ["Headers", "Sliders", "Call to Action", "Footers", "Cards"],
    designs: [],
  })

  // Estado para el diseño actual que se está editando
  const [currentDesign, setCurrentDesign] = useState<DesignItem | null>(null)
  const [newDesignTitle, setNewDesignTitle] = useState("")
  const [newDesignCode, setNewDesignCode] = useState("")
  const [newDesignCategory, setNewDesignCategory] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [previewDesign, setPreviewDesign] = useState<DesignItem | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    try {
      const storedVault = JSON.parse(
        getLocalStorage(
          "designVault",
          JSON.stringify({
            categories: ["Headers", "Sliders", "Call to Action", "Footers", "Cards"],
            designs: [],
          }),
        ),
      )
      setVault(storedVault)

      // Establecer la primera categoría como activa si hay categorías
      if (storedVault.categories.length > 0 && !activeCategory) {
        setActiveCategory(storedVault.categories[0])
      }
    } catch (error) {
      console.error("Error loading design vault:", error)
      // Si hay un error, inicializar con valores predeterminados
      setVault({
        categories: ["Headers", "Sliders", "Call to Action", "Footers", "Cards"],
        designs: [],
      })
    }
  }, [])

  // Guardar en localStorage cuando cambie el baúl
  useEffect(() => {
    setLocalStorage("designVault", JSON.stringify(vault))
  }, [vault])

  // Función para añadir un nuevo diseño
  const addDesign = () => {
    if (!newDesignTitle.trim() || !newDesignCode.trim() || !newDesignCategory) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    const newDesign: DesignItem = {
      id: Date.now().toString(),
      title: newDesignTitle,
      code: newDesignCode,
      category: newDesignCategory,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setVault((prev) => ({
      ...prev,
      designs: [...prev.designs, newDesign],
    }))

    // Limpiar el formulario
    setNewDesignTitle("")
    setNewDesignCode("")
    setNewDesignCategory("")

    toast({
      title: "Diseño guardado",
      description: `El diseño "${newDesignTitle}" ha sido guardado en la categoría "${newDesignCategory}"`,
    })
  }

  // Función para actualizar un diseño existente
  const updateDesign = () => {
    if (!currentDesign || !newDesignTitle.trim() || !newDesignCode.trim() || !newDesignCategory) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    setVault((prev) => ({
      ...prev,
      designs: prev.designs.map((design) =>
        design.id === currentDesign.id
          ? {
              ...design,
              title: newDesignTitle,
              code: newDesignCode,
              category: newDesignCategory,
              updatedAt: new Date(),
            }
          : design,
      ),
    }))

    // Limpiar el formulario y salir del modo edición
    setNewDesignTitle("")
    setNewDesignCode("")
    setNewDesignCategory("")
    setCurrentDesign(null)
    setIsEditing(false)

    toast({
      title: "Diseño actualizado",
      description: `El diseño "${newDesignTitle}" ha sido actualizado`,
    })
  }

  // Función para eliminar un diseño
  const deleteDesign = (id: string) => {
    setVault((prev) => ({
      ...prev,
      designs: prev.designs.filter((design) => design.id !== id),
    }))

    toast({
      title: "Diseño eliminado",
      description: "El diseño ha sido eliminado correctamente",
    })
  }

  // Función para editar un diseño
  const editDesign = (design: DesignItem) => {
    setCurrentDesign(design)
    setNewDesignTitle(design.title)
    setNewDesignCode(design.code)
    setNewDesignCategory(design.category)
    setIsEditing(true)
  }

  // Función para añadir una nueva categoría
  const addCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un nombre para la categoría",
        variant: "destructive",
      })
      return
    }

    if (vault.categories.includes(newCategoryName)) {
      toast({
        title: "Error",
        description: "Esta categoría ya existe",
        variant: "destructive",
      })
      return
    }

    setVault((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategoryName],
    }))

    setNewCategoryName("")
    setActiveCategory(newCategoryName)

    toast({
      title: "Categoría añadida",
      description: `La categoría "${newCategoryName}" ha sido añadida`,
    })
  }

  // Función para eliminar una categoría
  const deleteCategory = (category: string) => {
    // Verificar si hay diseños en esta categoría
    const designsInCategory = vault.designs.filter((design) => design.category === category)

    if (designsInCategory.length > 0) {
      toast({
        title: "Error",
        description: `No se puede eliminar la categoría "${category}" porque contiene diseños. Elimina o mueve los diseños primero.`,
        variant: "destructive",
      })
      return
    }

    setVault((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat !== category),
    }))

    // Si la categoría activa es la que se está eliminando, cambiar a otra
    if (activeCategory === category) {
      setActiveCategory(vault.categories.filter((cat) => cat !== category)[0] || null)
    }

    toast({
      title: "Categoría eliminada",
      description: `La categoría "${category}" ha sido eliminada`,
    })
  }

  // Función para mostrar la vista previa de un diseño
  const showDesignPreview = (design: DesignItem) => {
    setPreviewDesign(design)
    setShowPreview(true)
  }

  // Función para copiar el código de un diseño
  const copyDesignCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Código copiado",
      description: "El código ha sido copiado al portapapeles",
    })
  }

  // Función para descargar el código de un diseño
  const downloadDesignCode = (design: DesignItem) => {
    const element = document.createElement("a")
    const file = new Blob([design.code], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${design.title.replace(/\s+/g, "-").toLowerCase()}.html`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Función para exportar todo el baúl
  const exportVault = () => {
    const element = document.createElement("a")
    const file = new Blob([JSON.stringify(vault, null, 2)], { type: "application/json" })
    element.href = URL.createObjectURL(file)
    element.download = "design-vault-export.json"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "Baúl exportado",
      description: "El baúl de diseños ha sido exportado correctamente",
    })
  }

  // Función para importar un baúl
  const importVault = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedVault = JSON.parse(e.target?.result as string)

        // Validar la estructura del archivo importado
        if (!importedVault.categories || !importedVault.designs) {
          throw new Error("Formato de archivo inválido")
        }

        setVault(importedVault)

        toast({
          title: "Baúl importado",
          description: "El baúl de diseños ha sido importado correctamente",
        })
      } catch (error) {
        console.error("Error importing vault:", error)
        toast({
          title: "Error",
          description: "El archivo seleccionado no es válido",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)

    // Limpiar el input de archivo
    event.target.value = ""
  }

  // Renderizar la vista previa del diseño
  const renderPreview = (code: string) => {
    return (
      <div className="w-full h-[300px] border rounded-md overflow-hidden bg-white">
        <iframe srcDoc={code} className="w-full h-full" title="Vista previa" sandbox="allow-scripts" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Baúl de Diseños</h2>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                Nueva Categoría
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir Nueva Categoría</DialogTitle>
                <DialogDescription>Crea una nueva categoría para organizar tus diseños</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="category-name">Nombre de la Categoría</Label>
                <Input
                  id="category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Ej: Headers, Footers, etc."
                  className="mt-2"
                />
              </div>
              <DialogFooter>
                <Button onClick={addCategory}>Añadir Categoría</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" onClick={exportVault}>
            <ExportIcon className="h-4 w-4 mr-2" />
            Exportar Baúl
          </Button>

          <div className="relative">
            <Input
              type="file"
              accept=".json"
              onChange={importVault}
              className="absolute inset-0 opacity-0 w-full cursor-pointer"
            />
            <Button variant="outline" size="sm">
              <ImportIcon className="h-4 w-4 mr-2" />
              Importar Baúl
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de categorías */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Categorías</CardTitle>
              <CardDescription>Selecciona una categoría para ver sus diseños</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {vault.categories.map((category) => (
                    <div
                      key={category}
                      className="flex justify-between items-center p-2 rounded-md hover:bg-accent/50 cursor-pointer"
                    >
                      <div
                        className={`flex-1 ${activeCategory === category ? "font-bold" : ""}`}
                        onClick={() => setActiveCategory(category)}
                      >
                        <FolderIcon className="h-4 w-4 inline-block mr-2" />
                        {category}
                        <Badge className="ml-2" variant="outline">
                          {vault.designs.filter((design) => design.category === category).length}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteCategory(category)} className="h-8 w-8">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Panel de diseños */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{activeCategory ? `Baúl de ${activeCategory}` : "Selecciona una categoría"}</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Nuevo Diseño
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{isEditing ? "Editar Diseño" : "Añadir Nuevo Diseño"}</DialogTitle>
                      <DialogDescription>
                        {isEditing
                          ? "Actualiza los detalles del diseño seleccionado"
                          : "Añade un nuevo diseño a tu baúl"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div>
                        <Label htmlFor="design-title">Título del Diseño</Label>
                        <Input
                          id="design-title"
                          value={newDesignTitle}
                          onChange={(e) => setNewDesignTitle(e.target.value)}
                          placeholder="Ej: Header con colores dorados y dibujo arcano"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="design-category">Categoría</Label>
                        <Select value={newDesignCategory} onValueChange={setNewDesignCategory}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Selecciona una categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            {vault.categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="design-code">Código HTML</Label>
                        <Textarea
                          id="design-code"
                          value={newDesignCode}
                          onChange={(e) => setNewDesignCode(e.target.value)}
                          placeholder="Pega aquí el código HTML del diseño"
                          className="mt-2 min-h-[200px] font-mono text-sm"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      {isEditing ? (
                        <Button onClick={updateDesign}>Actualizar Diseño</Button>
                      ) : (
                        <Button onClick={addDesign}>Guardar Diseño</Button>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardTitle>
              <CardDescription>
                {activeCategory
                  ? `Gestiona tus diseños de ${activeCategory}`
                  : "Selecciona una categoría para ver sus diseños"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeCategory ? (
                <ScrollArea className="h-[400px]">
                  <Accordion type="multiple" className="w-full">
                    {vault.designs
                      .filter((design) => design.category === activeCategory)
                      .map((design) => (
                        <AccordionItem key={design.id} value={design.id}>
                          <AccordionTrigger className="hover:bg-accent/20 px-4 rounded-md">
                            <div className="flex-1 text-left">{design.title}</div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <div className="text-sm text-muted-foreground">
                                  Actualizado: {new Date(design.updatedAt).toLocaleString()}
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" onClick={() => copyDesignCode(design.code)}>
                                    <CopyIcon className="h-4 w-4 mr-2" />
                                    Copiar
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => downloadDesignCode(design)}>
                                    <DownloadIcon className="h-4 w-4 mr-2" />
                                    Descargar
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => showDesignPreview(design)}>
                                    <EyeIcon className="h-4 w-4 mr-2" />
                                    Vista Previa
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => editDesign(design)}>
                                    <PencilIcon className="h-4 w-4 mr-2" />
                                    Editar
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => deleteDesign(design.id)}>
                                    <TrashIcon className="h-4 w-4 mr-2" />
                                    Eliminar
                                  </Button>
                                </div>
                              </div>
                              <div className="border rounded-md p-4 bg-muted/50">
                                <pre className="text-xs overflow-auto max-h-[200px]">{design.code}</pre>
                              </div>
                              {previewDesign?.id === design.id && showPreview && (
                                <div className="border rounded-md p-4 bg-white">
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium">Vista Previa</h4>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setShowPreview(false)}
                                      className="h-6 w-6"
                                    >
                                      <XIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  {renderPreview(design.code)}
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    {vault.designs.filter((design) => design.category === activeCategory).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No hay diseños en esta categoría. ¡Añade uno nuevo!
                      </div>
                    )}
                  </Accordion>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Selecciona una categoría para ver sus diseños
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

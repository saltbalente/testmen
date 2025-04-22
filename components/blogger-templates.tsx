"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  LinkIcon,
  StickyNoteIcon,
  ListTodoIcon,
  SmartphoneIcon,
  MonitorIcon,
  Code,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

// Tipos para los templates de Blogger
type TodoItem = {
  id: string
  text: string
  completed: boolean
}

type WebsiteItem = {
  id: string
  url: string
  name: string
}

type BloggerTemplate = {
  id: string
  title: string
  description: string
  code: string
  category: string
  tags: string[]
  notes: string
  todos: TodoItem[]
  websites: WebsiteItem[]
  createdAt: Date
  updatedAt: Date
}

type BloggerTemplatesState = {
  categories: string[]
  templates: BloggerTemplate[]
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

export default function BloggerTemplates() {
  // Estado para los templates
  const [state, setState] = useState<BloggerTemplatesState>({
    categories: ["Plantillas Completas", "Widgets", "Gadgets", "Secciones", "Personalizados"],
    templates: [],
  })

  // Estado para el template actual
  const [currentTemplate, setCurrentTemplate] = useState<BloggerTemplate | null>(null)
  const [newTemplateTitle, setNewTemplateTitle] = useState("")
  const [newTemplateDescription, setNewTemplateDescription] = useState("")
  const [newTemplateCode, setNewTemplateCode] = useState("")
  const [newTemplateCategory, setNewTemplateCategory] = useState("")
  const [newTemplateTags, setNewTemplateTags] = useState("")
  const [newTemplateNotes, setNewTemplateNotes] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<BloggerTemplate | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("desktop")
  const [isEditing, setIsEditing] = useState(false)
  const [newTodoText, setNewTodoText] = useState("")
  const [newWebsiteName, setNewWebsiteName] = useState("")
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterTag, setFilterTag] = useState<string | null>(null)

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    try {
      const storedState = JSON.parse(
        getLocalStorage(
          "bloggerTemplates",
          JSON.stringify({
            categories: ["Plantillas Completas", "Widgets", "Gadgets", "Secciones", "Personalizados"],
            templates: [],
          }),
        ),
      )

      // Convertir las fechas de string a Date
      const templatesWithDates = storedState.templates.map((template: any) => ({
        ...template,
        createdAt: new Date(template.createdAt),
        updatedAt: new Date(template.updatedAt),
      }))

      setState({
        ...storedState,
        templates: templatesWithDates,
      })

      // Establecer la primera categoría como activa si hay categorías
      if (storedState.categories.length > 0 && !activeCategory) {
        setActiveCategory(storedState.categories[0])
      }
    } catch (error) {
      console.error("Error loading blogger templates:", error)
      // Si hay un error, inicializar con valores predeterminados
      setState({
        categories: ["Plantillas Completas", "Widgets", "Gadgets", "Secciones", "Personalizados"],
        templates: [],
      })
    }
  }, [])

  // Guardar en localStorage cuando cambie el estado
  useEffect(() => {
    setLocalStorage("bloggerTemplates", JSON.stringify(state))
  }, [state])

  // Función para añadir un nuevo template
  const addTemplate = () => {
    if (!newTemplateTitle.trim() || !newTemplateCode.trim() || !newTemplateCategory) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios: título, código y categoría",
        variant: "destructive",
      })
      return
    }

    const tags = newTemplateTags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "")

    const newTemplate: BloggerTemplate = {
      id: Date.now().toString(),
      title: newTemplateTitle,
      description: newTemplateDescription,
      code: newTemplateCode,
      category: newTemplateCategory,
      tags,
      notes: newTemplateNotes,
      todos: [],
      websites: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setState((prev) => ({
      ...prev,
      templates: [...prev.templates, newTemplate],
    }))

    // Limpiar el formulario
    resetForm()

    toast({
      title: "Template guardado",
      description: `El template "${newTemplateTitle}" ha sido guardado correctamente.`,
    })
  }

  // Función para actualizar un template existente
  const updateTemplate = () => {
    if (!currentTemplate || !newTemplateTitle.trim() || !newTemplateCode.trim() || !newTemplateCategory) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios: título, código y categoría",
        variant: "destructive",
      })
      return
    }

    const tags = newTemplateTags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "")

    setState((prev) => ({
      ...prev,
      templates: prev.templates.map((template) =>
        template.id === currentTemplate.id
          ? {
              ...template,
              title: newTemplateTitle,
              description: newTemplateDescription,
              code: newTemplateCode,
              category: newTemplateCategory,
              tags,
              notes: newTemplateNotes,
              updatedAt: new Date(),
            }
          : template,
      ),
    }))

    // Limpiar el formulario y salir del modo edición
    resetForm()
    setIsEditing(false)

    toast({
      title: "Template actualizado",
      description: `El template "${newTemplateTitle}" ha sido actualizado correctamente.`,
    })
  }

  // Función para eliminar un template
  const deleteTemplate = (id: string) => {
    setState((prev) => ({
      ...prev,
      templates: prev.templates.filter((template) => template.id !== id),
    }))

    toast({
      title: "Template eliminado",
      description: "El template ha sido eliminado correctamente.",
    })
  }

  // Función para editar un template
  const editTemplate = (template: BloggerTemplate) => {
    setCurrentTemplate(template)
    setNewTemplateTitle(template.title)
    setNewTemplateDescription(template.description)
    setNewTemplateCode(template.code)
    setNewTemplateCategory(template.category)
    setNewTemplateTags(template.tags.join(", "))
    setNewTemplateNotes(template.notes)
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

    if (state.categories.includes(newCategoryName)) {
      toast({
        title: "Error",
        description: "Esta categoría ya existe",
        variant: "destructive",
      })
      return
    }

    setState((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategoryName],
    }))

    setNewCategoryName("")
    setActiveCategory(newCategoryName)

    toast({
      title: "Categoría añadida",
      description: `La categoría "${newCategoryName}" ha sido añadida correctamente.`,
    })
  }

  // Función para eliminar una categoría
  const deleteCategory = (category: string) => {
    // Verificar si hay templates en esta categoría
    const templatesInCategory = state.templates.filter((template) => template.category === category)

    if (templatesInCategory.length > 0) {
      toast({
        title: "Error",
        description: `No se puede eliminar la categoría "${category}" porque contiene templates. Elimina o mueve los templates primero.`,
        variant: "destructive",
      })
      return
    }

    setState((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat !== category),
    }))

    // Si la categoría activa es la que se está eliminando, cambiar a otra
    if (activeCategory === category) {
      setActiveCategory(state.categories.filter((cat) => cat !== category)[0] || null)
    }

    toast({
      title: "Categoría eliminada",
      description: `La categoría "${category}" ha sido eliminada correctamente.`,
    })
  }

  // Función para mostrar la vista previa de un template
  const showTemplatePreview = (template: BloggerTemplate) => {
    setPreviewTemplate(template)
    setShowPreview(true)
  }

  // Función para copiar el código de un template
  const copyTemplateCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Código copiado",
      description: "El código ha sido copiado al portapapeles.",
    })
  }

  // Función para descargar el código de un template
  const downloadTemplateCode = (template: BloggerTemplate) => {
    const element = document.createElement("a")
    const file = new Blob([template.code], { type: "text/xml" })
    element.href = URL.createObjectURL(file)
    element.download = `${template.title.replace(/\s+/g, "-").toLowerCase()}.xml`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Función para exportar todos los templates
  const exportTemplates = () => {
    const element = document.createElement("a")
    const file = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" })
    element.href = URL.createObjectURL(file)
    element.download = "blogger-templates-export.json"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "Templates exportados",
      description: "Todos los templates han sido exportados correctamente.",
    })
  }

  // Función para importar templates
  const importTemplates = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedState = JSON.parse(e.target?.result as string)

        // Validar la estructura del archivo importado
        if (!importedState.categories || !importedState.templates) {
          throw new Error("Formato de archivo inválido")
        }

        // Convertir las fechas de string a Date
        const templatesWithDates = importedState.templates.map((template: any) => ({
          ...template,
          createdAt: new Date(template.createdAt),
          updatedAt: new Date(template.updatedAt),
        }))

        setState({
          ...importedState,
          templates: templatesWithDates,
        })

        toast({
          title: "Templates importados",
          description: "Los templates han sido importados correctamente.",
        })
      } catch (error) {
        console.error("Error importing templates:", error)
        toast({
          title: "Error",
          description: "El archivo seleccionado no es válido.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)

    // Limpiar el input de archivo
    event.target.value = ""
  }

  // Función para añadir una tarea a un template
  const addTodo = (templateId: string) => {
    if (!newTodoText.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa una tarea.",
        variant: "destructive",
      })
      return
    }

    setState((prev) => ({
      ...prev,
      templates: prev.templates.map((template) =>
        template.id === templateId
          ? {
              ...template,
              todos: [
                ...template.todos,
                {
                  id: Date.now().toString(),
                  text: newTodoText,
                  completed: false,
                },
              ],
              updatedAt: new Date(),
            }
          : template,
      ),
    }))

    setNewTodoText("")

    toast({
      title: "Tarea añadida",
      description: "La tarea ha sido añadida correctamente.",
    })
  }

  // Función para marcar una tarea como completada o pendiente
  const toggleTodo = (templateId: string, todoId: string) => {
    setState((prev) => ({
      ...prev,
      templates: prev.templates.map((template) =>
        template.id === templateId
          ? {
              ...template,
              todos: template.todos.map((todo) =>
                todo.id === todoId
                  ? {
                      ...todo,
                      completed: !todo.completed,
                    }
                  : todo,
              ),
              updatedAt: new Date(),
            }
          : template,
      ),
    }))
  }

  // Función para eliminar una tarea
  const deleteTodo = (templateId: string, todoId: string) => {
    setState((prev) => ({
      ...prev,
      templates: prev.templates.map((template) =>
        template.id === templateId
          ? {
              ...template,
              todos: template.todos.filter((todo) => todo.id !== todoId),
              updatedAt: new Date(),
            }
          : template,
      ),
    }))

    toast({
      title: "Tarea eliminada",
      description: "La tarea ha sido eliminada correctamente.",
    })
  }

  // Función para añadir un sitio web a un template
  const addWebsite = (templateId: string) => {
    if (!newWebsiteName.trim() || !newWebsiteUrl.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa el nombre y la URL del sitio web.",
        variant: "destructive",
      })
      return
    }

    // Validar URL
    try {
      new URL(newWebsiteUrl)
    } catch (error) {
      toast({
        title: "Error",
        description: "Por favor ingresa una URL válida.",
        variant: "destructive",
      })
      return
    }

    setState((prev) => ({
      ...prev,
      templates: prev.templates.map((template) =>
        template.id === templateId
          ? {
              ...template,
              websites: [
                ...template.websites,
                {
                  id: Date.now().toString(),
                  name: newWebsiteName,
                  url: newWebsiteUrl,
                },
              ],
              updatedAt: new Date(),
            }
          : template,
      ),
    }))

    setNewWebsiteName("")
    setNewWebsiteUrl("")

    toast({
      title: "Sitio web añadido",
      description: "El sitio web ha sido añadido correctamente.",
    })
  }

  // Función para eliminar un sitio web
  const deleteWebsite = (templateId: string, websiteId: string) => {
    setState((prev) => ({
      ...prev,
      templates: prev.templates.map((template) =>
        template.id === templateId
          ? {
              ...template,
              websites: template.websites.filter((website) => website.id !== websiteId),
              updatedAt: new Date(),
            }
          : template,
      ),
    }))

    toast({
      title: "Sitio web eliminado",
      description: "El sitio web ha sido eliminado correctamente.",
    })
  }

  // Función para limpiar el formulario
  const resetForm = () => {
    setCurrentTemplate(null)
    setNewTemplateTitle("")
    setNewTemplateDescription("")
    setNewTemplateCode("")
    setNewTemplateCategory("")
    setNewTemplateTags("")
    setNewTemplateNotes("")
    setNewTodoText("")
    setNewWebsiteName("")
    setNewWebsiteUrl("")
  }

  // Renderizar la vista previa del template
  const renderPreview = (code: string) => {
    return (
      <div
        className={`w-full border rounded-md overflow-hidden bg-white ${previewMode === "mobile" ? "max-w-[375px] h-[667px] mx-auto" : "h-[600px]"}`}
      >
        <iframe srcDoc={code} className="w-full h-full" title="Vista previa" sandbox="allow-scripts" />
      </div>
    )
  }

  // Filtrar templates por búsqueda y etiqueta
  const filteredTemplates = state.templates.filter((template) => {
    const matchesSearch = searchQuery
      ? template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true

    const matchesTag = filterTag ? template.tags.includes(filterTag) : true

    return matchesSearch && matchesTag
  })

  // Obtener todas las etiquetas únicas
  const allTags = Array.from(new Set(state.templates.flatMap((template) => template.tags))).sort()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Templates de Blogger</h2>
        <div className="flex flex-wrap gap-2">
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
                <DialogDescription>Crea una nueva categoría para organizar tus templates</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="category-name">Nombre de la Categoría</Label>
                <Input
                  id="category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Ej: Plantillas, Widgets, etc."
                  className="mt-2"
                />
              </div>
              <DialogFooter>
                <Button onClick={addCategory}>Añadir Categoría</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" onClick={exportTemplates}>
            <ExportIcon className="h-4 w-4 mr-2" />
            Exportar Templates
          </Button>

          <div className="relative">
            <Input
              type="file"
              accept=".json"
              onChange={importTemplates}
              className="absolute inset-0 opacity-0 w-full cursor-pointer"
            />
            <Button variant="outline" size="sm">
              <ImportIcon className="h-4 w-4 mr-2" />
              Importar Templates
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Buscar templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />

          {allTags.length > 0 && (
            <ScrollArea className="whitespace-nowrap mb-4 pb-2">
              <div className="flex gap-2">
                <Badge
                  variant={filterTag === null ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilterTag(null)}
                >
                  Todos
                </Badge>
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={filterTag === tag ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilterTag(tag === filterTag ? null : tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <div className="w-full md:w-2/3 flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Nuevo Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Editar Template" : "Añadir Nuevo Template"}</DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Actualiza los detalles del template seleccionado"
                    : "Añade un nuevo template de Blogger a tu colección"}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="template-title" className="text-sm font-medium">
                      Título <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="template-title"
                      value={newTemplateTitle}
                      onChange={(e) => setNewTemplateTitle(e.target.value)}
                      placeholder="Ej: Template Minimalista para Blog de Viajes"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="template-category" className="text-sm font-medium">
                      Categoría <span className="text-red-500">*</span>
                    </Label>
                    <Select value={newTemplateCategory} onValueChange={setNewTemplateCategory}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {state.categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="template-description" className="text-sm font-medium">
                    Descripción
                  </Label>
                  <Textarea
                    id="template-description"
                    value={newTemplateDescription}
                    onChange={(e) => setNewTemplateDescription(e.target.value)}
                    placeholder="Describe brevemente el template y su propósito..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="template-tags" className="text-sm font-medium">
                    Etiquetas (separadas por comas)
                  </Label>
                  <Input
                    id="template-tags"
                    value={newTemplateTags}
                    onChange={(e) => setNewTemplateTags(e.target.value)}
                    placeholder="Ej: responsive, minimalista, blog, viajes"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="template-code" className="text-sm font-medium">
                    Código XML/HTML <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="template-code"
                    value={newTemplateCode}
                    onChange={(e) => setNewTemplateCode(e.target.value)}
                    placeholder="Pega aquí el código XML/HTML del template..."
                    className="mt-1 min-h-[200px] font-mono text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="template-notes" className="text-sm font-medium">
                    Notas
                  </Label>
                  <Textarea
                    id="template-notes"
                    value={newTemplateNotes}
                    onChange={(e) => setNewTemplateNotes(e.target.value)}
                    placeholder="Añade notas o comentarios sobre este template..."
                    className="mt-1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                {isEditing ? (
                  <Button onClick={updateTemplate}>Actualizar Template</Button>
                ) : (
                  <Button onClick={addTemplate}>Guardar Template</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de categorías */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Categorías</CardTitle>
              <CardDescription>Selecciona una categoría para ver sus templates</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  <div
                    className={`flex justify-between items-center p-2 rounded-md hover:bg-accent/50 cursor-pointer ${
                      activeCategory === null ? "bg-accent/30" : ""
                    }`}
                    onClick={() => setActiveCategory(null)}
                  >
                    <div className={`flex-1 ${activeCategory === null ? "font-bold" : ""}`}>
                      <FolderIcon className="h-4 w-4 inline-block mr-2" />
                      Todos los Templates
                      <Badge className="ml-2" variant="outline">
                        {state.templates.length}
                      </Badge>
                    </div>
                  </div>

                  {state.categories.map((category) => (
                    <div
                      key={category}
                      className={`flex justify-between items-center p-2 rounded-md hover:bg-accent/50 cursor-pointer ${
                        activeCategory === category ? "bg-accent/30" : ""
                      }`}
                    >
                      <div
                        className={`flex-1 ${activeCategory === category ? "font-bold" : ""}`}
                        onClick={() => setActiveCategory(category)}
                      >
                        <FolderIcon className="h-4 w-4 inline-block mr-2" />
                        {category}
                        <Badge className="ml-2" variant="outline">
                          {state.templates.filter((template) => template.category === category).length}
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

        {/* Panel de templates */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{activeCategory ? `Templates de ${activeCategory}` : "Todos los Templates"}</CardTitle>
              <CardDescription>{filteredTemplates.length} templates encontrados</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Accordion type="multiple" className="w-full">
                  {filteredTemplates
                    .filter((template) => (activeCategory ? template.category === activeCategory : true))
                    .map((template) => (
                      <AccordionItem key={template.id} value={template.id}>
                        <AccordionTrigger className="hover:bg-accent/20 px-4 rounded-md">
                          <div className="flex-1 text-left flex items-center">
                            <span className="mr-2">{template.title}</span>
                            {template.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="mr-1 text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-6">
                            <div className="flex justify-between items-center">
                              <div className="text-sm text-muted-foreground">
                                Actualizado: {new Date(template.updatedAt).toLocaleString()}
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => copyTemplateCode(template.code)}>
                                  <CopyIcon className="h-4 w-4 mr-2" />
                                  Copiar
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => downloadTemplateCode(template)}>
                                  <DownloadIcon className="h-4 w-4 mr-2" />
                                  Descargar
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => showTemplatePreview(template)}>
                                  <EyeIcon className="h-4 w-4 mr-2" />
                                  Vista Previa
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => editTemplate(template)}>
                                  <PencilIcon className="h-4 w-4 mr-2" />
                                  Editar
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => deleteTemplate(template.id)}>
                                  <TrashIcon className="h-4 w-4 mr-2" />
                                  Eliminar
                                </Button>
                              </div>
                            </div>

                            {template.description && (
                              <div>
                                <h4 className="text-sm font-medium mb-1">Descripción:</h4>
                                <p className="text-sm text-muted-foreground">{template.description}</p>
                              </div>
                            )}

                            <Tabs defaultValue="code">
                              <TabsList>
                                <TabsTrigger value="code">
                                  <Code className="h-4 w-4 mr-2" />
                                  Código
                                </TabsTrigger>
                                <TabsTrigger value="notes">
                                  <StickyNoteIcon className="h-4 w-4 mr-2" />
                                  Notas
                                </TabsTrigger>
                                <TabsTrigger value="todos">
                                  <ListTodoIcon className="h-4 w-4 mr-2" />
                                  Tareas
                                </TabsTrigger>
                                <TabsTrigger value="websites">
                                  <LinkIcon className="h-4 w-4 mr-2" />
                                  Sitios Web
                                </TabsTrigger>
                              </TabsList>

                              <TabsContent value="code">
                                <div className="border rounded-md p-4 bg-muted/50">
                                  <pre className="text-xs overflow-auto max-h-[200px] font-mono">{template.code}</pre>
                                </div>
                              </TabsContent>

                              <TabsContent value="notes">
                                <div className="border rounded-md p-4 bg-muted/50">
                                  {template.notes ? (
                                    <div className="whitespace-pre-wrap text-sm">{template.notes}</div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                      No hay notas para este template.
                                    </p>
                                  )}
                                </div>
                              </TabsContent>

                              <TabsContent value="todos">
                                <div className="border rounded-md p-4 bg-muted/50">
                                  <div className="flex items-center space-x-2 mb-4">
                                    <Input
                                      placeholder="Añadir nueva tarea..."
                                      value={newTodoText}
                                      onChange={(e) => setNewTodoText(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          addTodo(template.id)
                                        }
                                      }}
                                    />
                                    <Button size="sm" onClick={() => addTodo(template.id)}>
                                      Añadir
                                    </Button>
                                  </div>

                                  {template.todos.length > 0 ? (
                                    <ul className="space-y-2">
                                      {template.todos.map((todo) => (
                                        <li key={todo.id} className="flex items-center justify-between">
                                          <div className="flex items-center">
                                            <Checkbox
                                              checked={todo.completed}
                                              onCheckedChange={() => toggleTodo(template.id, todo.id)}
                                              className="mr-2"
                                            />
                                            <span
                                              className={todo.completed ? "line-through text-muted-foreground" : ""}
                                            >
                                              {todo.text}
                                            </span>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteTodo(template.id, todo.id)}
                                            className="h-6 w-6"
                                          >
                                            <TrashIcon className="h-3 w-3" />
                                          </Button>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                      No hay tareas para este template.
                                    </p>
                                  )}
                                </div>
                              </TabsContent>

                              <TabsContent value="websites">
                                <div className="border rounded-md p-4 bg-muted/50">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <Input
                                      placeholder="Nombre del sitio web"
                                      value={newWebsiteName}
                                      onChange={(e) => setNewWebsiteName(e.target.value)}
                                    />
                                    <Input
                                      placeholder="URL (https://...)"
                                      value={newWebsiteUrl}
                                      onChange={(e) => setNewWebsiteUrl(e.target.value)}
                                    />
                                  </div>
                                  <Button size="sm" onClick={() => addWebsite(template.id)} className="mb-4">
                                    Añadir Sitio Web
                                  </Button>

                                  {template.websites.length > 0 ? (
                                    <ul className="space-y-2">
                                      {template.websites.map((website) => (
                                        <li key={website.id} className="flex items-center justify-between">
                                          <a
                                            href={website.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center text-blue-500 hover:underline"
                                          >
                                            <LinkIcon className="h-4 w-4 mr-2" />
                                            {website.name}
                                          </a>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteWebsite(template.id, website.id)}
                                            className="h-6 w-6"
                                          >
                                            <TrashIcon className="h-3 w-3" />
                                          </Button>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                      No hay sitios web registrados para este template.
                                    </p>
                                  )}
                                </div>
                              </TabsContent>
                            </Tabs>

                            {previewTemplate?.id === template.id && showPreview && (
                              <div className="border rounded-md p-4 bg-white">
                                <div className="flex justify-between items-center mb-4">
                                  <h4 className="font-medium">Vista Previa</h4>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant={previewMode === "desktop" ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => setPreviewMode("desktop")}
                                      className="h-8"
                                    >
                                      <MonitorIcon className="h-4 w-4 mr-2" />
                                      Escritorio
                                    </Button>
                                    <Button
                                      variant={previewMode === "mobile" ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => setPreviewMode("mobile")}
                                      className="h-8"
                                    >
                                      <SmartphoneIcon className="h-4 w-4 mr-2" />
                                      Móvil
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setShowPreview(false)}
                                      className="h-8 w-8"
                                    >
                                      <XIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                {renderPreview(template.code)}
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}

                  {filteredTemplates.filter((template) =>
                    activeCategory ? template.category === activeCategory : true,
                  ).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay templates en esta categoría. ¡Añade uno nuevo!
                    </div>
                  )}
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

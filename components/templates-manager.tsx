"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/ui/pagination"
import { Loader2, Plus, Trash2, Save, Copy, Download, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { checkDeepSeekAvailability, optimizeTemplate } from "@/app/actions/deepseek-actions"

// Tipos para los templates
type TodoItem = {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

type WebsiteItem = {
  id: string
  url: string
  name: string
  description?: string
  addedAt: Date
}

type TemplateVersion = {
  id: string
  code: string
  description: string
  createdAt: Date
}

type Template = {
  id: string
  title: string
  description: string
  code: string
  platform: "blogger" | "html"
  category: string
  tags: string[]
  notes: string
  todos: TodoItem[]
  websites: WebsiteItem[]
  url?: string
  starred: boolean
  versions: TemplateVersion[]
  createdAt: Date
  updatedAt: Date
  lastUsedAt?: Date
  useCount: number
}

type TemplatesState = {
  categories: string[]
  templates: Template[]
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

export default function TemplatesManager() {
  const { toast } = useToast()
  const [templates, setTemplates] = useState<Template[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDeepSeekAvailable, setIsDeepSeekAvailable] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [newTemplate, setNewTemplate] = useState<Template>({
    id: "",
    name: "",
    description: "",
    code: "",
    platform: "blogger",
    category: "general",
    tags: [],
    notes: "",
    todos: [],
    websites: [],
    starred: false,
    versions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    useCount: 0,
  })
  const [activeTab, setActiveTab] = useState("browse")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isImporting, setIsImporting] = useState(false)
  const [importData, setImportData] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const itemsPerPage = 6

  useEffect(() => {
    loadTemplates()
    checkDeepSeekStatus()
  }, [currentPage, searchTerm, selectedCategory])

  const checkDeepSeekStatus = async () => {
    const isAvailable = await checkDeepSeekAvailability()
    setIsDeepSeekAvailable(isAvailable)
  }

  const loadTemplates = () => {
    // Load templates from localStorage
    const savedTemplates = localStorage.getItem("vanguardista-templates")
    let parsedTemplates: Template[] = savedTemplates ? JSON.parse(savedTemplates) : []

    // Filter by search term if provided
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      parsedTemplates = parsedTemplates.filter(
        (template) =>
          template.name.toLowerCase().includes(term) ||
          template.description.toLowerCase().includes(term) ||
          template.code.toLowerCase().includes(term) ||
          (template.tags && template.tags.some((tag) => tag.toLowerCase().includes(term))),
      )
    }

    // Filter by category if not 'all'
    if (selectedCategory !== "all") {
      parsedTemplates = parsedTemplates.filter((template) => template.category === selectedCategory)
    }

    // Calculate total pages
    const total = Math.ceil(parsedTemplates.length / itemsPerPage)
    setTotalPages(total || 1)

    // Adjust current page if it's out of bounds after filtering
    if (currentPage > total && total > 0) {
      setCurrentPage(1)
    }

    // Paginate
    const start = (currentPage - 1) * itemsPerPage
    const paginatedTemplates = parsedTemplates.slice(start, start + itemsPerPage)

    setTemplates(paginatedTemplates)
  }

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.code) {
      toast({
        title: "Missing information",
        description: "Please provide at least a name and code for your template.",
        variant: "destructive",
      })
      return
    }

    const savedTemplates = localStorage.getItem("vanguardista-templates")
    const parsedTemplates: Template[] = savedTemplates ? JSON.parse(savedTemplates) : []

    const templateToSave = {
      ...newTemplate,
      id: Date.now().toString(),
      createdAt: new Date(),
    }

    const updatedTemplates = [...parsedTemplates, templateToSave]
    localStorage.setItem("vanguardista-templates", JSON.stringify(updatedTemplates))

    setNewTemplate({
      id: "",
      name: "",
      description: "",
      code: "",
      platform: "blogger",
      category: "general",
      tags: [],
      notes: "",
      todos: [],
      websites: [],
      starred: false,
      versions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      useCount: 0,
    })

    toast({
      title: "Template created",
      description: "Your template has been saved successfully.",
    })

    // Switch to browse tab and reload templates
    setActiveTab("browse")
    loadTemplates()
  }

  const handleEditTemplate = () => {
    if (!editingTemplate || !editingTemplate.name || !editingTemplate.code) {
      toast({
        title: "Missing information",
        description: "Please provide at least a name and code for your template.",
        variant: "destructive",
      })
      return
    }

    const savedTemplates = localStorage.getItem("vanguardista-templates")
    const parsedTemplates: Template[] = savedTemplates ? JSON.parse(savedTemplates) : []

    const updatedTemplates = parsedTemplates.map((template) =>
      template.id === editingTemplate.id ? editingTemplate : template,
    )

    localStorage.setItem("vanguardista-templates", JSON.stringify(updatedTemplates))

    setIsEditing(false)
    setEditingTemplate(null)

    toast({
      title: "Template updated",
      description: "Your template has been updated successfully.",
    })

    loadTemplates()
  }

  const handleDeleteTemplate = (id: string) => {
    const savedTemplates = localStorage.getItem("vanguardista-templates")
    const parsedTemplates: Template[] = savedTemplates ? JSON.parse(savedTemplates) : []

    const updatedTemplates = parsedTemplates.filter((template) => template.id !== id)
    localStorage.setItem("vanguardista-templates", JSON.stringify(updatedTemplates))

    toast({
      title: "Template deleted",
      description: "Your template has been deleted.",
    })

    loadTemplates()
  }

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template)
  }

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard.",
    })
  }

  const handleEditClick = (template: Template) => {
    setEditingTemplate({ ...template })
    setIsEditing(true)
  }

  const handleOptimizePrompt = async () => {
    if (!editingTemplate) return

    setIsOptimizing(true)

    try {
      const result = await optimizeTemplate(editingTemplate.prompt)

      if (result.error) {
        toast({
          title: "Optimization failed",
          description: result.error,
          variant: "destructive",
        })
      } else if (result.optimizedPrompt) {
        setEditingTemplate({
          ...editingTemplate,
          prompt: result.optimizedPrompt,
        })

        toast({
          title: "Prompt optimized",
          description: "Your prompt has been optimized.",
        })
      }
    } catch (error) {
      toast({
        title: "Optimization failed",
        description: "An error occurred while optimizing your prompt.",
        variant: "destructive",
      })
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleExportTemplates = () => {
    const savedTemplates = localStorage.getItem("vanguardista-templates")
    if (!savedTemplates) {
      toast({
        title: "No templates to export",
        description: "You don't have any templates to export.",
        variant: "destructive",
      })
      return
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(savedTemplates)
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "vanguardista-templates.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()

    toast({
      title: "Templates exported",
      description: "Your templates have been exported successfully.",
    })
  }

  const handleImportClick = () => {
    setIsImporting(true)
    setImportData("")
  }

  const handleImportTemplates = () => {
    try {
      const importedTemplates = JSON.parse(importData)

      if (!Array.isArray(importedTemplates)) {
        throw new Error("Invalid format")
      }

      // Validate each template has required fields
      importedTemplates.forEach((template) => {
        if (!template.id || !template.name || !template.prompt) {
          throw new Error("Invalid template format")
        }
      })

      const savedTemplates = localStorage.getItem("vanguardista-templates")
      const existingTemplates: Template[] = savedTemplates ? JSON.parse(savedTemplates) : []

      // Merge templates, avoiding duplicates by ID
      const existingIds = new Set(existingTemplates.map((t) => t.id))
      const newTemplates = importedTemplates.filter((t) => !existingIds.has(t.id))
      const mergedTemplates = [...existingTemplates, ...newTemplates]

      localStorage.setItem("vanguardista-templates", JSON.stringify(mergedTemplates))

      setIsImporting(false)
      loadTemplates()

      toast({
        title: "Templates imported",
        description: `Successfully imported ${newTemplates.length} new templates.`,
      })
    } catch (error) {
      toast({
        title: "Import failed",
        description: "The imported data is not in the correct format.",
        variant: "destructive",
      })
    }
  }

  const categories = [
    { label: "All Categories", value: "all" },
    { label: "General", value: "general" },
    { label: "Creative", value: "creative" },
    { label: "Technical", value: "technical" },
    { label: "Business", value: "business" },
    { label: "Academic", value: "academic" },
    { label: "Personal", value: "personal" },
  ]

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Templates</TabsTrigger>
          <TabsTrigger value="create">Create Template</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value || "uncategorized"}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportTemplates}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={handleImportClick}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>

          {isImporting && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Import Templates</CardTitle>
                <CardDescription>Paste your exported templates JSON below</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste JSON here..."
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  rows={10}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setIsImporting(false)}>
                  Cancel
                </Button>
                <Button onClick={handleImportTemplates}>Import</Button>
              </CardFooter>
            </Card>
          )}

          {templates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No templates found</p>
              <Button onClick={() => setActiveTab("create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first template
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="flex flex-col">
                    <CardHeader className="pb-2">
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription>
                        {template.category && (
                          <span className="inline-block bg-secondary text-secondary-foreground rounded-full px-2 py-1 text-xs mr-2">
                            {template.category}
                          </span>
                        )}
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground line-clamp-3">{template.prompt}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(template)}>
                        Edit
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleCopyPrompt(template.prompt)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create a new template</CardTitle>
              <CardDescription>
                Design your prompt template with a clear structure for consistent results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  placeholder="E.g., Product Description Generator"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="A brief description of what this template does"
                  value={newTemplate.description || ""}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newTemplate.category || "general"}
                  onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt Template</Label>
                <Textarea
                  id="prompt"
                  placeholder="Write your prompt template here..."
                  value={newTemplate.prompt}
                  onChange={(e) => setNewTemplate({ ...newTemplate, prompt: e.target.value })}
                  rows={10}
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground">
                  Use variables like {"{input}"} that can be replaced when using the template
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreateTemplate}>
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {isEditing && editingTemplate && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Edit Template</CardTitle>
              <CardDescription>Update your prompt template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Template Name</Label>
                <Input
                  id="edit-name"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Input
                  id="edit-description"
                  value={editingTemplate.description || ""}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editingTemplate.category || "general"}
                  onValueChange={(value) => setEditingTemplate({ ...editingTemplate, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="edit-prompt">Prompt Template</Label>
                  {isDeepSeekAvailable && (
                    <Button variant="outline" size="sm" onClick={handleOptimizePrompt} disabled={isOptimizing}>
                      {isOptimizing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Optimizing...
                        </>
                      ) : (
                        <>Optimize with AI</>
                      )}
                    </Button>
                  )}
                </div>
                <Textarea
                  id="edit-prompt"
                  value={editingTemplate.prompt}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, prompt: e.target.value })}
                  rows={12}
                  className="font-mono"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditTemplate}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

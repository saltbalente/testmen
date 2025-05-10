"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { FolderPlus, Edit, Trash2, Copy, Save, FolderOpen } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import type { Keyword, KeywordProject } from "@/types/keyword"

interface ProjectManagerProps {
  keywords: Keyword[]
  onLoadProject: (keywords: Keyword[]) => void
}

export default function ProjectManager({ keywords, onLoadProject }: ProjectManagerProps) {
  const [projects, setProjects] = useState<KeywordProject[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")
  const [editingProject, setEditingProject] = useState<KeywordProject | null>(null)

  // Cargar proyectos guardados
  useEffect(() => {
    const savedProjects = localStorage.getItem("keywordProjects")
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects))
      } catch (e) {
        console.error("Error loading saved projects:", e)
      }
    }
  }, [])

  // Guardar proyectos cuando cambien
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem("keywordProjects", JSON.stringify(projects))
    }
  }, [projects])

  // Crear nuevo proyecto
  const handleCreateProject = useCallback(() => {
    if (!newProjectName.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Por favor ingresa un nombre para el proyecto",
        variant: "destructive",
      })
      return
    }

    const newProject: KeywordProject = {
      id: uuidv4(),
      name: newProjectName.trim(),
      description: newProjectDescription.trim(),
      keywords: [...keywords],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setProjects((prev) => [...prev, newProject])

    setNewProjectName("")
    setNewProjectDescription("")
    setIsCreateOpen(false)

    toast({
      title: "Proyecto creado",
      description: `Se creó el proyecto "${newProject.name}" con ${keywords.length} keywords`,
    })
  }, [newProjectName, newProjectDescription, keywords])

  // Actualizar proyecto existente
  const handleUpdateProject = useCallback(() => {
    if (!editingProject) return

    if (!editingProject.name.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Por favor ingresa un nombre para el proyecto",
        variant: "destructive",
      })
      return
    }

    setProjects((prev) =>
      prev.map((p) =>
        p.id === editingProject.id
          ? {
              ...editingProject,
              updatedAt: new Date().toISOString(),
            }
          : p,
      ),
    )

    setEditingProject(null)

    toast({
      title: "Proyecto actualizado",
      description: `Se actualizó el proyecto "${editingProject.name}"`,
    })
  }, [editingProject])

  // Eliminar proyecto
  const handleDeleteProject = useCallback(
    (projectId: string) => {
      const projectToDelete = projects.find((p) => p.id === projectId)

      if (!projectToDelete) return

      setProjects((prev) => prev.filter((p) => p.id !== projectId))

      toast({
        title: "Proyecto eliminado",
        description: `Se eliminó el proyecto "${projectToDelete.name}"`,
      })
    },
    [projects],
  )

  // Cargar proyecto
  const handleLoadProject = useCallback(
    (project: KeywordProject) => {
      onLoadProject(project.keywords)

      toast({
        title: "Proyecto cargado",
        description: `Se cargaron ${project.keywords.length} keywords del proyecto "${project.name}"`,
      })
    },
    [onLoadProject],
  )

  // Actualizar proyecto con keywords actuales
  const handleUpdateProjectKeywords = useCallback(
    (projectId: string) => {
      const projectToUpdate = projects.find((p) => p.id === projectId)

      if (!projectToUpdate) return

      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                keywords: [...keywords],
                updatedAt: new Date().toISOString(),
              }
            : p,
        ),
      )

      toast({
        title: "Proyecto actualizado",
        description: `Se actualizaron las keywords del proyecto "${projectToUpdate.name}"`,
      })
    },
    [projects, keywords],
  )

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Proyectos</CardTitle>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <FolderPlus className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="project-name" className="text-sm font-medium">
                  Nombre del Proyecto
                </label>
                <Input
                  id="project-name"
                  placeholder="Mi Proyecto"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="project-description" className="text-sm font-medium">
                  Descripción (opcional)
                </label>
                <Input
                  id="project-description"
                  placeholder="Descripción del proyecto..."
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Se guardarán {keywords.length} keywords en este proyecto.
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateProject}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Proyecto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">No hay proyectos guardados</div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Keywords</TableHead>
                  <TableHead>Actualizado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      {project.name}
                      {project.description && (
                        <div className="text-xs text-muted-foreground mt-1">{project.description}</div>
                      )}
                    </TableCell>
                    <TableCell>{project.keywords.length}</TableCell>
                    <TableCell>{formatDate(project.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleLoadProject(project)}>
                          <FolderOpen className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleUpdateProjectKeywords(project.id)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setEditingProject(project)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(project.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Diálogo de edición */}
        {editingProject && (
          <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Proyecto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="edit-project-name" className="text-sm font-medium">
                    Nombre del Proyecto
                  </label>
                  <Input
                    id="edit-project-name"
                    value={editingProject.name}
                    onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-project-description" className="text-sm font-medium">
                    Descripción (opcional)
                  </label>
                  <Input
                    id="edit-project-description"
                    value={editingProject.description || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Este proyecto contiene {editingProject.keywords.length} keywords.
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingProject(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateProject}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}

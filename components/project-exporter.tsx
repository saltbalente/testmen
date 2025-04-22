"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Download, Upload, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { exportProject, importProject, validateProjectFile } from "@/lib/project-actions"

export function ProjectExporter() {
  const [exportProgress, setExportProgress] = useState(0)
  const [importProgress, setImportProgress] = useState(0)
  const [exportStatus, setExportStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [importStatus, setImportStatus] = useState<"idle" | "validating" | "processing" | "success" | "error">("idle")
  const [exportError, setExportError] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importValidation, setImportValidation] = useState<{
    valid: boolean
    components: number
    configurations: number
    dependencies: number
    version: string
  } | null>(null)

  const handleExport = async () => {
    try {
      setExportStatus("processing")
      setExportProgress(0)
      setExportError(null)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 5
        })
      }, 200)

      // Llamar a la función de exportación
      const projectData = await exportProject((progress) => {
        setExportProgress(progress)
      })

      clearInterval(progressInterval)
      setExportProgress(100)

      // Crear y descargar el archivo
      const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "vanguardista-project.vgp"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setExportStatus("success")
    } catch (error) {
      setExportStatus("error")
      setExportError(error instanceof Error ? error.message : "Unknown error occurred")
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportFile(file)
    setImportStatus("validating")
    setImportProgress(0)
    setImportError(null)

    try {
      const validation = await validateProjectFile(file)
      setImportValidation(validation)

      if (!validation.valid) {
        setImportStatus("error")
        setImportError("Invalid project file format")
      } else {
        setImportStatus("idle")
      }
    } catch (error) {
      setImportStatus("error")
      setImportError(error instanceof Error ? error.message : "Failed to validate file")
      setImportValidation(null)
    }
  }

  const handleImport = async () => {
    if (!importFile || !importValidation?.valid) return

    try {
      setImportStatus("processing")
      setImportProgress(0)
      setImportError(null)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setImportProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 3
        })
      }, 200)

      await importProject(importFile, (progress) => {
        setImportProgress(progress)
      })

      clearInterval(progressInterval)
      setImportProgress(100)
      setImportStatus("success")
    } catch (error) {
      setImportStatus("error")
      setImportError(error instanceof Error ? error.message : "Import failed")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Project Export & Import System
        </CardTitle>
        <CardDescription>
          Transfer your entire project including all components, configurations, and dependencies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Export Project</TabsTrigger>
            <TabsTrigger value="import">Import Project</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Export Current Project</h3>
                  <p className="text-sm text-muted-foreground">Save your entire project as a portable file</p>
                </div>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                  Vanguardista Format
                </Badge>
              </div>

              <div className="space-y-2 p-4 rounded-md bg-black/20 border border-purple-500/20">
                <p className="text-sm mb-3 text-purple-300">
                  <span className="font-semibold">Importante:</span> Se exportará toda la configuración y los datos
                  agregados en la aplicación, incluyendo prompts, plantillas, diseños guardados y preferencias
                  personalizadas.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-muted-foreground">Components</span>
                    <span className="font-medium">All UI Components</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-muted-foreground">Configurations</span>
                    <span className="font-medium">Tailwind & Project Settings</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-muted-foreground">Dependencies</span>
                    <span className="font-medium">All Required Libraries</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-muted-foreground">User Data</span>
                    <span className="font-medium">Saved Presets & Settings</span>
                  </div>
                </div>
              </div>

              {exportStatus === "processing" && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Exporting project...</span>
                    <span className="text-sm font-medium">{exportProgress}%</span>
                  </div>
                  <Progress value={exportProgress} className="h-2" />
                </div>
              )}

              {exportStatus === "success" && (
                <Alert variant="default" className="bg-green-500/10 border-green-500/20 text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Export Complete</AlertTitle>
                  <AlertDescription>Your project has been successfully exported</AlertDescription>
                </Alert>
              )}

              {exportStatus === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Export Failed</AlertTitle>
                  <AlertDescription>{exportError || "An unknown error occurred during export"}</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Import Project</h3>
                <p className="text-sm text-muted-foreground">Restore a previously exported project</p>
              </div>

              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="project-file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-purple-500/20 bg-black/20 hover:bg-black/30"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-purple-500" />
                    <p className="mb-2 text-sm text-center">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">Vanguardista Project File (.vgp)</p>
                  </div>
                  <input
                    id="project-file"
                    type="file"
                    className="hidden"
                    accept=".vgp,.json"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {importValidation && (
                <div className="p-4 rounded-md bg-black/20 border border-purple-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Project File Details</h4>
                    {importValidation.valid ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Valid
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                        Invalid
                      </Badge>
                    )}
                  </div>

                  <Separator className="bg-purple-500/20" />

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Components:</span>
                      <span>{importValidation.components}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Configurations:</span>
                      <span>{importValidation.configurations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dependencies:</span>
                      <span>{importValidation.dependencies}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Version:</span>
                      <span>{importValidation.version}</span>
                    </div>
                  </div>
                </div>
              )}

              {importStatus === "processing" && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Importing project...</span>
                    <span className="text-sm font-medium">{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} className="h-2" />
                </div>
              )}

              {importStatus === "success" && (
                <Alert variant="default" className="bg-green-500/10 border-green-500/20 text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Import Complete</AlertTitle>
                  <AlertDescription>Project has been successfully imported and restored</AlertDescription>
                </Alert>
              )}

              {importStatus === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Import Failed</AlertTitle>
                  <AlertDescription>{importError || "An unknown error occurred during import"}</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          {/* Mostrar el mensaje solo cuando hay un archivo importado */}
          {importFile ? `Selected: ${importFile.name}` : ""}
        </div>
        <div className="flex space-x-2">
          {exportStatus !== "processing" && (
            <Button
              onClick={handleExport}
              disabled={exportStatus === "processing"}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Project
            </Button>
          )}

          {importValidation?.valid && importStatus !== "processing" && (
            <Button
              onClick={handleImport}
              disabled={importStatus === "processing" || !importValidation?.valid}
              variant="outline"
              className="border-purple-500/20 hover:bg-purple-500/10"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import Project
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

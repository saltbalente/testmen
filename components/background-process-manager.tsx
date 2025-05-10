/**
 * Componente para gestionar procesos en segundo plano
 *
 * Este componente proporciona una interfaz de usuario para ver, iniciar, detener
 * y eliminar procesos en segundo plano.
 */

"use client"

import { useState, useEffect } from "react"
import { getServiceWorkerManager } from "../lib/service-worker"
import type { BackgroundProcess } from "../lib/indexed-db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, Clock, Play, Square, Trash2, RefreshCw } from "lucide-react"

export default function BackgroundProcessManager() {
  const [processes, setProcesses] = useState<BackgroundProcess[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("running")
  const [refreshKey, setRefreshKey] = useState(0)

  const swManager = getServiceWorkerManager()

  // Cargar procesos
  useEffect(() => {
    let isMounted = true

    const loadProcesses = async () => {
      setIsLoading(true)

      try {
        const allProcesses = await swManager.getAllProcesses()

        if (isMounted) {
          setProcesses(allProcesses)
        }
      } catch (error) {
        console.error("Error al cargar procesos:", error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadProcesses()

    return () => {
      isMounted = false
    }
  }, [refreshKey])

  // Configurar listener para actualizaciones de procesos
  useEffect(() => {
    const handleProcessUpdate = () => {
      setRefreshKey((prev) => prev + 1)
    }

    // Registrar listeners
    swManager.addMessageListener("UPDATE_PROCESS_STATUS", handleProcessUpdate)
    swManager.addMessageListener("PROCESS_STOPPED", handleProcessUpdate)
    swManager.addMessageListener("API_POLLING_RESULT", handleProcessUpdate)
    swManager.addMessageListener("DATA_PROCESSING_RESULT", handleProcessUpdate)
    swManager.addMessageListener("CONTENT_GENERATION_RESULT", handleProcessUpdate)

    return () => {
      // Eliminar listeners
      swManager.removeMessageListener("UPDATE_PROCESS_STATUS", handleProcessUpdate)
      swManager.removeMessageListener("PROCESS_STOPPED", handleProcessUpdate)
      swManager.removeMessageListener("API_POLLING_RESULT", handleProcessUpdate)
      swManager.removeMessageListener("DATA_PROCESSING_RESULT", handleProcessUpdate)
      swManager.removeMessageListener("CONTENT_GENERATION_RESULT", handleProcessUpdate)
    }
  }, [])

  // Filtrar procesos según la pestaña activa
  const filteredProcesses = processes.filter((process) => {
    switch (activeTab) {
      case "running":
        return process.status === "running"
      case "completed":
        return process.status === "completed"
      case "error":
        return process.status === "error"
      case "all":
        return true
      default:
        return false
    }
  })

  // Iniciar un proceso
  const handleStartProcess = async (processId: string) => {
    try {
      const process = processes.find((p) => p.id === processId)

      if (process) {
        await swManager.startBackgroundProcess({
          id: process.id,
          data: process.data,
          startTime: Date.now(),
          type: process.type,
        })

        setRefreshKey((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Error al iniciar proceso:", error)
    }
  }

  // Detener un proceso
  const handleStopProcess = async (processId: string) => {
    try {
      await swManager.stopBackgroundProcess(processId)
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      console.error("Error al detener proceso:", error)
    }
  }

  // Eliminar un proceso
  const handleDeleteProcess = async (processId: string) => {
    try {
      await swManager.deleteProcess(processId)
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      console.error("Error al eliminar proceso:", error)
    }
  }

  // Limpiar todos los procesos
  const handleClearAll = async () => {
    try {
      await swManager.clearAllData()
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      console.error("Error al limpiar datos:", error)
    }
  }

  // Renderizar icono según el estado del proceso
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "stopped":
        return <Square className="h-5 w-5 text-yellow-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  // Renderizar badge según el estado del proceso
  const renderStatusBadge = (status: string) => {
    let variant = "default"

    switch (status) {
      case "running":
        variant = "default"
        break
      case "completed":
        variant = "success"
        break
      case "error":
        variant = "destructive"
        break
      case "stopped":
        variant = "warning"
        break
      default:
        variant = "secondary"
    }

    return <Badge variant={variant as any}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Procesos en segundo plano</span>
          <Button variant="outline" size="sm" onClick={() => setRefreshKey((prev) => prev + 1)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </CardTitle>
        <CardDescription>Gestiona los procesos que se ejecutan en segundo plano</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="running">En ejecución</TabsTrigger>
            <TabsTrigger value="completed">Completados</TabsTrigger>
            <TabsTrigger value="error">Con errores</TabsTrigger>
            <TabsTrigger value="all">Todos</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="py-8 text-center">
                <Progress value={80} className="w-full mb-4" />
                <p className="text-sm text-gray-500">Cargando procesos...</p>
              </div>
            ) : filteredProcesses.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-500">No hay procesos {activeTab === "all" ? "" : `${activeTab}`}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProcesses.map((process) => (
                  <Card key={process.id}>
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {renderStatusIcon(process.status)}
                          <CardTitle className="text-base ml-2">
                            {process.data.name || `Proceso ${process.id.slice(0, 8)}`}
                          </CardTitle>
                        </div>
                        {renderStatusBadge(process.status)}
                      </div>
                      <CardDescription className="text-xs">
                        ID: {process.id}
                        <br />
                        Tipo: {process.type}
                        <br />
                        Iniciado: {new Date(process.startTime).toLocaleString()}
                        <br />
                        Última actualización: {new Date(process.lastUpdated).toLocaleString()}
                      </CardDescription>
                    </CardHeader>

                    {process.errorMessage && (
                      <CardContent className="py-0">
                        <div className="bg-red-50 p-3 rounded-md text-sm text-red-800">
                          Error: {process.errorMessage}
                        </div>
                      </CardContent>
                    )}

                    <CardFooter className="py-3 flex justify-end space-x-2">
                      {process.status === "running" ? (
                        <Button variant="outline" size="sm" onClick={() => handleStopProcess(process.id)}>
                          <Square className="h-4 w-4 mr-2" />
                          Detener
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartProcess(process.id)}
                          disabled={process.status === "completed"}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Iniciar
                        </Button>
                      )}

                      <Button variant="destructive" size="sm" onClick={() => handleDeleteProcess(process.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="destructive" onClick={handleClearAll} disabled={processes.length === 0}>
          Limpiar todos los procesos
        </Button>
      </CardFooter>
    </Card>
  )
}

"use client"

/**
 * Hook para manejar procesos en segundo plano
 *
 * Este hook proporciona una interfaz para interactuar con procesos en segundo plano
 * a través del Service Worker y IndexedDB.
 */

import { useState, useEffect, useCallback } from "react"
import { getServiceWorkerManager } from "../lib/service-worker"
import type { BackgroundProcess } from "../lib/indexed-db"

export interface UseBackgroundProcessOptions {
  autoFetchResults?: boolean
  resultsLimit?: number
  pollInterval?: number
}

export function useBackgroundProcess(processId: string, options: UseBackgroundProcessOptions = {}) {
  const [process, setProcess] = useState<BackgroundProcess | null>(null)
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const swManager = getServiceWorkerManager()

  // Opciones con valores por defecto
  const { autoFetchResults = true, resultsLimit = 10, pollInterval = 2000 } = options

  // Cargar proceso
  const fetchProcess = useCallback(async () => {
    try {
      const processData = await swManager.getProcess(processId)
      setProcess(processData)
      return processData
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return null
    } finally {
      setIsLoading(false)
    }
  }, [processId, swManager])

  // Cargar resultados
  const fetchResults = useCallback(async () => {
    if (!processId) return

    try {
      const resultsData = await swManager.getProcessResults(processId, resultsLimit)
      setResults(resultsData)
    } catch (err) {
      console.error("Error al cargar resultados:", err)
    }
  }, [processId, resultsLimit, swManager])

  // Iniciar proceso
  const startProcess = useCallback(
    async (data: any) => {
      try {
        setIsLoading(true)

        await swManager.startBackgroundProcess({
          id: processId,
          data,
          startTime: Date.now(),
          type: data.type || "API_POLLING",
        })

        await fetchProcess()

        if (autoFetchResults) {
          await fetchResults()
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setIsLoading(false)
      }
    },
    [processId, swManager, fetchProcess, fetchResults, autoFetchResults],
  )

  // Detener proceso
  const stopProcess = useCallback(async () => {
    try {
      setIsLoading(true)
      await swManager.stopBackgroundProcess(processId)
      await fetchProcess()
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsLoading(false)
    }
  }, [processId, swManager, fetchProcess])

  // Eliminar proceso
  const deleteProcess = useCallback(async () => {
    try {
      setIsLoading(true)
      await swManager.deleteProcess(processId)
      setProcess(null)
      setResults([])
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsLoading(false)
    }
  }, [processId, swManager])

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (!processId) return

    let isMounted = true

    const loadInitialData = async () => {
      setIsLoading(true)

      try {
        const processData = await fetchProcess()

        if (isMounted && processData && autoFetchResults) {
          await fetchResults()
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadInitialData()

    return () => {
      isMounted = false
    }
  }, [processId, fetchProcess, fetchResults, autoFetchResults])

  // Efecto para sondeo periódico
  useEffect(() => {
    if (!processId || !autoFetchResults || pollInterval <= 0) return

    let isMounted = true

    const intervalId = setInterval(async () => {
      if (isMounted) {
        await fetchProcess()
        await fetchResults()
      }
    }, pollInterval)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [processId, autoFetchResults, pollInterval, fetchProcess, fetchResults])

  // Configurar listeners para mensajes del Service Worker
  useEffect(() => {
    if (!processId) return

    const handleProcessUpdate = async (message: any) => {
      if (message.processId === processId) {
        await fetchProcess()

        if (autoFetchResults) {
          await fetchResults()
        }
      }
    }

    // Registrar listeners
    swManager.addMessageListener("UPDATE_PROCESS_STATUS", handleProcessUpdate)
    swManager.addMessageListener("API_POLLING_RESULT", handleProcessUpdate)
    swManager.addMessageListener("DATA_PROCESSING_RESULT", handleProcessUpdate)
    swManager.addMessageListener("CONTENT_GENERATION_RESULT", handleProcessUpdate)

    return () => {
      // Eliminar listeners
      swManager.removeMessageListener("UPDATE_PROCESS_STATUS", handleProcessUpdate)
      swManager.removeMessageListener("API_POLLING_RESULT", handleProcessUpdate)
      swManager.removeMessageListener("DATA_PROCESSING_RESULT", handleProcessUpdate)
      swManager.removeMessageListener("CONTENT_GENERATION_RESULT", handleProcessUpdate)
    }
  }, [processId, swManager, fetchProcess, fetchResults, autoFetchResults])

  return {
    process,
    results,
    isLoading,
    error,
    startProcess,
    stopProcess,
    deleteProcess,
    refreshProcess: fetchProcess,
    refreshResults: fetchResults,
  }
}

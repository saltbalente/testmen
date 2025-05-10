// Service Worker para la aplicación Vanguardista
const CACHE_NAME = "vanguardista-cache-v1"
const BACKGROUND_SYNC_QUEUE = "vanguardista-background-sync"

// Lista de recursos para pre-cachear
const urlsToCache = ["/", "/index.html", "/static/css/main.css", "/static/js/main.js"]

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker: Instalando...")

  // Forzar al Service Worker a activarse inmediatamente
  self.skipWaiting()

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Cacheando archivos")
      return cache.addAll(urlsToCache)
    }),
  )
})

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activado")

  // Reclamar el control inmediatamente
  event.waitUntil(clients.claim())

  // Limpiar caches antiguas
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Eliminando cache antigua", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// Interceptar solicitudes de red
self.addEventListener("fetch", (event) => {
  // Solo interceptar solicitudes GET
  if (event.request.method !== "GET") return

  // Estrategia: Network first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clonar la respuesta para almacenarla en cache
        const responseToCache = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
      .catch(() => {
        // Si la red falla, intentar desde cache
        return caches.match(event.request)
      }),
  )
})

// Manejar mensajes desde la aplicación
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "INIT_BACKGROUND_PROCESS") {
    const { processId, processData } = event.data
    console.log(`Service Worker: Iniciando proceso en segundo plano ${processId}`)

    // Iniciar proceso en segundo plano
    startBackgroundProcess(processId, processData)

    // Responder a la aplicación
    event.source.postMessage({
      type: "BACKGROUND_PROCESS_STARTED",
      processId,
    })
  }

  if (event.data && event.data.type === "STOP_BACKGROUND_PROCESS") {
    const { processId } = event.data
    console.log(`Service Worker: Deteniendo proceso en segundo plano ${processId}`)

    // Detener proceso en segundo plano
    stopBackgroundProcess(processId)

    // Responder a la aplicación
    event.source.postMessage({
      type: "BACKGROUND_PROCESS_STOPPED",
      processId,
    })
  }
})

// Manejar sincronización en segundo plano
self.addEventListener("sync", (event) => {
  if (event.tag === BACKGROUND_SYNC_QUEUE) {
    event.waitUntil(syncBackgroundProcesses())
  }
})

// Manejar notificaciones push
self.addEventListener("push", (event) => {
  const data = event.data.json()

  const options = {
    body: data.body,
    icon: "/logo.png",
    badge: "/badge.png",
    data: {
      url: data.url,
    },
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// Manejar clic en notificaciones
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.matchAll({ type: "window" }).then((clientList) => {
        // Si ya hay una ventana abierta, enfocarla
        for (const client of clientList) {
          if (client.url === event.notification.data.url && "focus" in client) {
            return client.focus()
          }
        }

        // Si no hay ventana abierta, abrir una nueva
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url)
        }
      }),
    )
  }
})

// Funciones auxiliares para procesos en segundo plano
const activeProcesses = new Map()

function startBackgroundProcess(processId, processData) {
  // Detener el proceso si ya existe
  if (activeProcesses.has(processId)) {
    stopBackgroundProcess(processId)
  }

  // Crear un nuevo proceso
  const process = {
    id: processId,
    data: processData,
    startTime: Date.now(),
    intervalId: setInterval(() => {
      // Ejecutar el proceso
      executeBackgroundProcess(processId, processData)
    }, processData.interval || 60000), // Por defecto, cada minuto
  }

  // Ejecutar inmediatamente la primera vez
  executeBackgroundProcess(processId, processData)

  // Guardar el proceso
  activeProcesses.set(processId, process)

  // Guardar en IndexedDB a través de un mensaje a la aplicación
  self.clients.matchAll().then((clients) => {
    if (clients && clients.length) {
      clients[0].postMessage({
        type: "SAVE_PROCESS_TO_INDEXEDDB",
        process: {
          id: processId,
          data: processData,
          startTime: process.startTime,
        },
      })
    }
  })
}

function stopBackgroundProcess(processId) {
  if (activeProcesses.has(processId)) {
    const process = activeProcesses.get(processId)
    clearInterval(process.intervalId)
    activeProcesses.delete(processId)

    // Notificar a la aplicación
    self.clients.matchAll().then((clients) => {
      if (clients && clients.length) {
        clients[0].postMessage({
          type: "PROCESS_STOPPED",
          processId,
        })
      }
    })
  }
}

async function executeBackgroundProcess(processId, processData) {
  console.log(`Ejecutando proceso ${processId} en segundo plano`)

  try {
    // Obtener datos actualizados de IndexedDB
    const updatedData = await getProcessDataFromIndexedDB(processId)
    if (updatedData) {
      processData = updatedData
    }

    // Ejecutar la acción según el tipo de proceso
    switch (processData.type) {
      case "API_POLLING":
        await handleApiPolling(processId, processData)
        break
      case "DATA_PROCESSING":
        await handleDataProcessing(processId, processData)
        break
      case "CONTENT_GENERATION":
        await handleContentGeneration(processId, processData)
        break
      default:
        console.log(`Tipo de proceso desconocido: ${processData.type}`)
    }

    // Actualizar el estado del proceso
    updateProcessStatus(processId, "running", null)
  } catch (error) {
    console.error(`Error en proceso ${processId}:`, error)
    updateProcessStatus(processId, "error", error.message)
  }
}

async function getProcessDataFromIndexedDB(processId) {
  // Solicitar datos a la aplicación
  return new Promise((resolve) => {
    const messageChannel = new MessageChannel()

    messageChannel.port1.onmessage = (event) => {
      if (event.data && event.data.processData) {
        resolve(event.data.processData)
      } else {
        resolve(null)
      }
    }

    self.clients.matchAll().then((clients) => {
      if (clients && clients.length) {
        clients[0].postMessage(
          {
            type: "GET_PROCESS_DATA",
            processId,
          },
          [messageChannel.port2],
        )
      } else {
        resolve(null)
      }
    })
  })
}

function updateProcessStatus(processId, status, errorMessage = null) {
  self.clients.matchAll().then((clients) => {
    if (clients && clients.length) {
      clients[0].postMessage({
        type: "UPDATE_PROCESS_STATUS",
        processId,
        status,
        errorMessage,
        timestamp: Date.now(),
      })
    }
  })
}

// Implementación de tipos específicos de procesos
async function handleApiPolling(processId, processData) {
  const { endpoint, headers, method = "GET", body } = processData

  const response = await fetch(endpoint, {
    method,
    headers,
    body: method !== "GET" ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
  })

  if (!response.ok) {
    throw new Error(`Error en API: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  // Enviar resultados a la aplicación
  self.clients.matchAll().then((clients) => {
    if (clients && clients.length) {
      clients[0].postMessage({
        type: "API_POLLING_RESULT",
        processId,
        data,
        timestamp: Date.now(),
      })
    }
  })
}

async function handleDataProcessing(processId, processData) {
  const { dataToProcess, processingSteps } = processData

  // Solicitar datos actualizados a la aplicación
  let currentData = dataToProcess

  // Aplicar pasos de procesamiento
  for (const step of processingSteps) {
    switch (step.type) {
      case "FILTER":
        currentData = currentData.filter((item) => {
          try {
            return new Function("item", `return ${step.condition}`)(item)
          } catch (error) {
            console.error("Error en filtro:", error)
            return true
          }
        })
        break
      case "MAP":
        currentData = currentData.map((item) => {
          try {
            return new Function("item", `return ${step.transformation}`)(item)
          } catch (error) {
            console.error("Error en transformación:", error)
            return item
          }
        })
        break
      case "SORT":
        currentData = currentData.sort((a, b) => {
          try {
            return new Function("a", "b", `return ${step.comparator}`)(a, b)
          } catch (error) {
            console.error("Error en ordenamiento:", error)
            return 0
          }
        })
        break
      default:
        console.log(`Paso de procesamiento desconocido: ${step.type}`)
    }
  }

  // Enviar resultados procesados a la aplicación
  self.clients.matchAll().then((clients) => {
    if (clients && clients.length) {
      clients[0].postMessage({
        type: "DATA_PROCESSING_RESULT",
        processId,
        data: currentData,
        timestamp: Date.now(),
      })
    }
  })
}

async function handleContentGeneration(processId, processData) {
  const { template, variables, count } = processData

  // Generar contenido basado en la plantilla y variables
  const generatedContent = []

  for (let i = 0; i < count; i++) {
    try {
      let content = template

      // Reemplazar variables
      for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, "g")

        // Si el valor es un array, seleccionar un elemento aleatorio
        const replacement = Array.isArray(value) ? value[Math.floor(Math.random() * value.length)] : value

        content = content.replace(regex, replacement)
      }

      generatedContent.push(content)
    } catch (error) {
      console.error("Error generando contenido:", error)
    }
  }

  // Enviar contenido generado a la aplicación
  self.clients.matchAll().then((clients) => {
    if (clients && clients.length) {
      clients[0].postMessage({
        type: "CONTENT_GENERATION_RESULT",
        processId,
        content: generatedContent,
        timestamp: Date.now(),
      })
    }
  })
}

async function syncBackgroundProcesses() {
  console.log("Sincronizando procesos en segundo plano")

  // Solicitar lista de procesos a la aplicación
  const processes = await getProcessesFromIndexedDB()

  if (!processes || !processes.length) {
    console.log("No hay procesos para sincronizar")
    return
  }

  // Reiniciar procesos activos
  for (const process of processes) {
    if (process.status === "running") {
      startBackgroundProcess(process.id, process.data)
    }
  }
}

async function getProcessesFromIndexedDB() {
  // Solicitar procesos a la aplicación
  return new Promise((resolve) => {
    const messageChannel = new MessageChannel()

    messageChannel.port1.onmessage = (event) => {
      if (event.data && event.data.processes) {
        resolve(event.data.processes)
      } else {
        resolve([])
      }
    }

    self.clients.matchAll().then((clients) => {
      if (clients && clients.length) {
        clients[0].postMessage(
          {
            type: "GET_ALL_PROCESSES",
          },
          [messageChannel.port2],
        )
      } else {
        resolve([])
      }
    })
  })
}

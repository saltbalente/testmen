/**
 * Servicio para manejar el Service Worker
 *
 * Este servicio proporciona funciones para registrar, comunicarse y controlar
 * el Service Worker de la aplicación.
 */

import { getIndexedDBManager, type BackgroundProcess } from "./indexed-db"

// Tipos de mensajes para comunicación con el Service Worker
export type ServiceWorkerMessage =
  | { type: "INIT_BACKGROUND_PROCESS"; processId: string; processData: any }
  | { type: "STOP_BACKGROUND_PROCESS"; processId: string }
  | { type: "GET_PROCESS_DATA"; processId: string }
  | { type: "GET_ALL_PROCESSES" }
  | { type: "SAVE_PROCESS_TO_INDEXEDDB"; process: any }
  | { type: "PROCESS_STOPPED"; processId: string }
  | { type: "UPDATE_PROCESS_STATUS"; processId: string; status: string; errorMessage?: string; timestamp: number }
  | { type: "API_POLLING_RESULT"; processId: string; data: any; timestamp: number }
  | { type: "DATA_PROCESSING_RESULT"; processId: string; data: any; timestamp: number }
  | { type: "CONTENT_GENERATION_RESULT"; processId: string; content: string[]; timestamp: number }

// Clase principal para manejar el Service Worker
export class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null
  private messageListeners: Map<string, ((message: any) => void)[]> = new Map()
  private dbManager = getIndexedDBManager()

  /**
   * Registra el Service Worker
   */
  async register(): Promise<boolean> {
    if (!("serviceWorker" in navigator)) {
      console.error("Service Worker no está soportado en este navegador")
      return false
    }

    try {
      this.registration = await navigator.serviceWorker.register("/sw.js")
      console.log("Service Worker registrado correctamente:", this.registration)

      // Configurar listener para mensajes del Service Worker
      navigator.serviceWorker.addEventListener("message", this.handleServiceWorkerMessage.bind(this))

      return true
    } catch (error) {
      console.error("Error al registrar el Service Worker:", error)
      return false
    }
  }

  /**
   * Verifica si el Service Worker está activo
   */
  isActive(): boolean {
    return !!this.registration && !!navigator.serviceWorker.controller
  }

  /**
   * Envía un mensaje al Service Worker
   * @param message Mensaje a enviar
   */
  async sendMessage(message: ServiceWorkerMessage): Promise<void> {
    if (!this.isActive()) {
      throw new Error("El Service Worker no está activo")
    }

    navigator.serviceWorker.controller!.postMessage(message)
  }

  /**
   * Maneja los mensajes recibidos del Service Worker
   * @param event Evento de mensaje
   */
  private handleServiceWorkerMessage(event: MessageEvent): void {
    const message = event.data

    if (!message || !message.type) {
      return
    }

    console.log("Mensaje recibido del Service Worker:", message)

    // Procesar mensajes específicos
    this.processServiceWorkerMessage(message)

    // Notificar a los listeners registrados
    this.notifyMessageListeners(message.type, message)
  }

  /**
   * Procesa mensajes específicos del Service Worker
   * @param message Mensaje a procesar
   */
  private async processServiceWorkerMessage(message: any): Promise<void> {
    switch (message.type) {
      case "SAVE_PROCESS_TO_INDEXEDDB":
        if (message.process) {
          await this.dbManager.saveProcess({
            ...message.process,
            status: "running",
            lastUpdated: Date.now(),
          })
        }
        break

      case "PROCESS_STOPPED":
        if (message.processId) {
          await this.dbManager.updateProcessStatus(message.processId, "stopped")
        }
        break

      case "UPDATE_PROCESS_STATUS":
        if (message.processId) {
          await this.dbManager.updateProcessStatus(message.processId, message.status as any, message.errorMessage)
        }
        break

      case "API_POLLING_RESULT":
      case "DATA_PROCESSING_RESULT":
      case "CONTENT_GENERATION_RESULT":
        if (message.processId) {
          // Guardar resultado en IndexedDB
          await this.dbManager.saveResult({
            processId: message.processId,
            data: message.data || message.content,
            timestamp: message.timestamp,
          })

          // Actualizar estado del proceso
          await this.dbManager.updateProcessStatus(message.processId, "running")
        }
        break

      case "GET_PROCESS_DATA":
        if (message.processId && event.ports && event.ports[0]) {
          const processData = await this.dbManager.getProcess(message.processId)
          event.ports[0].postMessage({ processData: processData?.data })
        }
        break

      case "GET_ALL_PROCESSES":
        if (event.ports && event.ports[0]) {
          const processes = await this.dbManager.getAllProcesses()
          event.ports[0].postMessage({ processes })
        }
        break
    }
  }

  /**
   * Registra un listener para un tipo de mensaje específico
   * @param messageType Tipo de mensaje
   * @param callback Función a llamar cuando se reciba el mensaje
   */
  addMessageListener(messageType: string, callback: (message: any) => void): void {
    if (!this.messageListeners.has(messageType)) {
      this.messageListeners.set(messageType, [])
    }

    this.messageListeners.get(messageType)!.push(callback)
  }

  /**
   * Elimina un listener para un tipo de mensaje específico
   * @param messageType Tipo de mensaje
   * @param callback Función a eliminar
   */
  removeMessageListener(messageType: string, callback: (message: any) => void): void {
    if (!this.messageListeners.has(messageType)) {
      return
    }

    const listeners = this.messageListeners.get(messageType)!
    const index = listeners.indexOf(callback)

    if (index !== -1) {
      listeners.splice(index, 1)
    }
  }

  /**
   * Notifica a los listeners registrados para un tipo de mensaje
   * @param messageType Tipo de mensaje
   * @param message Mensaje completo
   */
  private notifyMessageListeners(messageType: string, message: any): void {
    if (!this.messageListeners.has(messageType)) {
      return
    }

    for (const listener of this.messageListeners.get(messageType)!) {
      try {
        listener(message)
      } catch (error) {
        console.error("Error en listener de mensaje:", error)
      }
    }
  }

  /**
   * Inicia un proceso en segundo plano
   * @param process Proceso a iniciar
   */
  async startBackgroundProcess(process: Omit<BackgroundProcess, "status" | "lastUpdated">): Promise<void> {
    // Guardar proceso en IndexedDB
    await this.dbManager.saveProcess({
      ...process,
      status: "pending",
      lastUpdated: Date.now(),
    })

    // Enviar mensaje al Service Worker
    await this.sendMessage({
      type: "INIT_BACKGROUND_PROCESS",
      processId: process.id,
      processData: process.data,
    })
  }

  /**
   * Detiene un proceso en segundo plano
   * @param processId ID del proceso
   */
  async stopBackgroundProcess(processId: string): Promise<void> {
    // Enviar mensaje al Service Worker
    await this.sendMessage({
      type: "STOP_BACKGROUND_PROCESS",
      processId,
    })
  }

  /**
   * Elimina un proceso
   * @param processId ID del proceso
   */
  async deleteProcess(processId: string): Promise<void> {
    // Detener proceso si está en ejecución
    try {
      await this.stopBackgroundProcess(processId)
    } catch (error) {
      console.error("Error al detener proceso:", error)
    }

    // Eliminar de IndexedDB
    await this.dbManager.deleteProcess(processId)
  }

  /**
   * Obtiene todos los procesos
   */
  async getAllProcesses(): Promise<BackgroundProcess[]> {
    return this.dbManager.getAllProcesses()
  }

  /**
   * Obtiene un proceso por su ID
   * @param processId ID del proceso
   */
  async getProcess(processId: string): Promise<BackgroundProcess | null> {
    return this.dbManager.getProcess(processId)
  }

  /**
   * Obtiene resultados de un proceso
   * @param processId ID del proceso
   * @param limit Límite de resultados
   */
  async getProcessResults(processId: string, limit?: number): Promise<any[]> {
    const results = await this.dbManager.getResultsByProcessId(processId, limit)
    return results.map((r) => r.data)
  }

  /**
   * Limpia todos los procesos y datos
   */
  async clearAllData(): Promise<void> {
    // Detener todos los procesos en ejecución
    const processes = await this.dbManager.getAllProcesses({ status: "running" })

    for (const process of processes) {
      try {
        await this.stopBackgroundProcess(process.id)
      } catch (error) {
        console.error(`Error al detener proceso ${process.id}:`, error)
      }
    }

    // Limpiar IndexedDB
    await this.dbManager.clearAllData()
  }
}

// Instancia singleton
let swManagerInstance: ServiceWorkerManager | null = null

/**
 * Obtiene la instancia de ServiceWorkerManager
 */
export function getServiceWorkerManager(): ServiceWorkerManager {
  if (!swManagerInstance) {
    swManagerInstance = new ServiceWorkerManager()
  }
  return swManagerInstance
}

/**
 * Biblioteca para manejar IndexedDB en la aplicación Vanguardista
 *
 * Esta biblioteca proporciona una API simplificada para interactuar con IndexedDB,
 * permitiendo almacenar y recuperar datos de procesos en segundo plano.
 */

// Configuración de la base de datos
const DB_NAME = "VanguardistaDB"
const DB_VERSION = 1
const STORES = {
  PROCESSES: "processes",
  RESULTS: "results",
  SETTINGS: "settings",
}

// Interfaz para procesos
export interface BackgroundProcess {
  id: string
  type: "API_POLLING" | "DATA_PROCESSING" | "CONTENT_GENERATION"
  status: "pending" | "running" | "completed" | "error" | "stopped"
  data: any
  startTime: number
  lastUpdated: number
  errorMessage?: string
}

// Interfaz para resultados
export interface ProcessResult {
  id: string
  processId: string
  data: any
  timestamp: number
}

// Clase principal para manejar IndexedDB
export class IndexedDBManager {
  private db: IDBDatabase | null = null
  private dbReady: Promise<boolean>
  private dbReadyResolver!: (value: boolean) => void

  constructor() {
    // Crear una promesa que se resolverá cuando la base de datos esté lista
    this.dbReady = new Promise<boolean>((resolve) => {
      this.dbReadyResolver = resolve
    })

    // Inicializar la base de datos
    this.initDB()
  }

  /**
   * Inicializa la conexión con IndexedDB
   */
  private initDB(): void {
    if (!window.indexedDB) {
      console.error("IndexedDB no está soportado en este navegador")
      this.dbReadyResolver(false)
      return
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = (event) => {
      console.error("Error al abrir IndexedDB:", (event.target as IDBRequest).error)
      this.dbReadyResolver(false)
    }

    request.onsuccess = (event) => {
      this.db = (event.target as IDBRequest).result
      console.log("IndexedDB conectado correctamente")
      this.dbReadyResolver(true)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBRequest).result

      // Crear almacenes de objetos si no existen
      if (!db.objectStoreNames.contains(STORES.PROCESSES)) {
        const processesStore = db.createObjectStore(STORES.PROCESSES, { keyPath: "id" })
        processesStore.createIndex("status", "status", { unique: false })
        processesStore.createIndex("type", "type", { unique: false })
      }

      if (!db.objectStoreNames.contains(STORES.RESULTS)) {
        const resultsStore = db.createObjectStore(STORES.RESULTS, { keyPath: "id", autoIncrement: true })
        resultsStore.createIndex("processId", "processId", { unique: false })
        resultsStore.createIndex("timestamp", "timestamp", { unique: false })
      }

      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: "key" })
      }
    }
  }

  /**
   * Espera a que la base de datos esté lista
   */
  async waitForDB(): Promise<boolean> {
    return this.dbReady
  }

  /**
   * Ejecuta una transacción en la base de datos
   * @param storeName Nombre del almacén
   * @param mode Modo de la transacción (readonly o readwrite)
   * @param callback Función a ejecutar con el almacén
   */
  private async runTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    callback: (store: IDBObjectStore) => IDBRequest<T>,
  ): Promise<T> {
    await this.waitForDB()

    if (!this.db) {
      throw new Error("La base de datos no está disponible")
    }

    return new Promise<T>((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, mode)
      const store = transaction.objectStore(storeName)
      const request = callback(store)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Guarda un proceso en la base de datos
   * @param process Proceso a guardar
   */
  async saveProcess(process: BackgroundProcess): Promise<void> {
    // Asegurarse de que el proceso tenga todos los campos necesarios
    const processToSave: BackgroundProcess = {
      ...process,
      lastUpdated: Date.now(),
      status: process.status || "pending",
    }

    await this.runTransaction<IDBValidKey>(STORES.PROCESSES, "readwrite", (store) => store.put(processToSave))
  }

  /**
   * Obtiene un proceso por su ID
   * @param processId ID del proceso
   */
  async getProcess(processId: string): Promise<BackgroundProcess | null> {
    try {
      return await this.runTransaction<BackgroundProcess>(STORES.PROCESSES, "readonly", (store) => store.get(processId))
    } catch (error) {
      console.error("Error al obtener proceso:", error)
      return null
    }
  }

  /**
   * Obtiene todos los procesos
   * @param filter Filtro opcional para los procesos
   */
  async getAllProcesses(filter?: {
    status?: BackgroundProcess["status"]
    type?: BackgroundProcess["type"]
  }): Promise<BackgroundProcess[]> {
    await this.waitForDB()

    if (!this.db) {
      return []
    }

    return new Promise<BackgroundProcess[]>((resolve, reject) => {
      const transaction = this.db!.transaction(STORES.PROCESSES, "readonly")
      const store = transaction.objectStore(STORES.PROCESSES)
      const request = store.getAll()

      request.onsuccess = () => {
        let processes = request.result

        // Aplicar filtros si existen
        if (filter) {
          if (filter.status) {
            processes = processes.filter((p) => p.status === filter.status)
          }
          if (filter.type) {
            processes = processes.filter((p) => p.type === filter.type)
          }
        }

        resolve(processes)
      }

      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Actualiza el estado de un proceso
   * @param processId ID del proceso
   * @param status Nuevo estado
   * @param errorMessage Mensaje de error opcional
   */
  async updateProcessStatus(
    processId: string,
    status: BackgroundProcess["status"],
    errorMessage?: string,
  ): Promise<void> {
    const process = await this.getProcess(processId)

    if (!process) {
      throw new Error(`Proceso no encontrado: ${processId}`)
    }

    const updatedProcess: BackgroundProcess = {
      ...process,
      status,
      lastUpdated: Date.now(),
      errorMessage: errorMessage || process.errorMessage,
    }

    await this.saveProcess(updatedProcess)
  }

  /**
   * Elimina un proceso
   * @param processId ID del proceso
   */
  async deleteProcess(processId: string): Promise<void> {
    await this.runTransaction<undefined>(STORES.PROCESSES, "readwrite", (store) => store.delete(processId))

    // También eliminar todos los resultados asociados
    await this.deleteResultsByProcessId(processId)
  }

  /**
   * Guarda un resultado de proceso
   * @param result Resultado a guardar
   */
  async saveResult(result: Omit<ProcessResult, "id">): Promise<string> {
    const resultToSave: any = {
      ...result,
      timestamp: result.timestamp || Date.now(),
    }

    const id = await this.runTransaction<IDBValidKey>(STORES.RESULTS, "readwrite", (store) => store.add(resultToSave))

    return id.toString()
  }

  /**
   * Obtiene resultados por ID de proceso
   * @param processId ID del proceso
   * @param limit Límite de resultados
   */
  async getResultsByProcessId(processId: string, limit?: number): Promise<ProcessResult[]> {
    await this.waitForDB()

    if (!this.db) {
      return []
    }

    return new Promise<ProcessResult[]>((resolve, reject) => {
      const transaction = this.db!.transaction(STORES.RESULTS, "readonly")
      const store = transaction.objectStore(STORES.RESULTS)
      const index = store.index("processId")
      const request = index.getAll(processId)

      request.onsuccess = () => {
        let results = request.result

        // Ordenar por timestamp descendente
        results.sort((a, b) => b.timestamp - a.timestamp)

        // Aplicar límite si existe
        if (limit && limit > 0) {
          results = results.slice(0, limit)
        }

        resolve(results)
      }

      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Elimina resultados por ID de proceso
   * @param processId ID del proceso
   */
  async deleteResultsByProcessId(processId: string): Promise<void> {
    await this.waitForDB()

    if (!this.db) {
      return
    }

    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction(STORES.RESULTS, "readwrite")
      const store = transaction.objectStore(STORES.RESULTS)
      const index = store.index("processId")
      const request = index.openCursor(IDBKeyRange.only(processId))

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        } else {
          resolve()
        }
      }

      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Guarda una configuración
   * @param key Clave de la configuración
   * @param value Valor de la configuración
   */
  async saveSetting(key: string, value: any): Promise<void> {
    await this.runTransaction<IDBValidKey>(STORES.SETTINGS, "readwrite", (store) => store.put({ key, value }))
  }

  /**
   * Obtiene una configuración
   * @param key Clave de la configuración
   */
  async getSetting(key: string): Promise<any> {
    try {
      const result = await this.runTransaction<{ key: string; value: any }>(STORES.SETTINGS, "readonly", (store) =>
        store.get(key),
      )
      return result ? result.value : null
    } catch (error) {
      console.error("Error al obtener configuración:", error)
      return null
    }
  }

  /**
   * Elimina una configuración
   * @param key Clave de la configuración
   */
  async deleteSetting(key: string): Promise<void> {
    await this.runTransaction<undefined>(STORES.SETTINGS, "readwrite", (store) => store.delete(key))
  }

  /**
   * Limpia todos los datos de la base de datos
   */
  async clearAllData(): Promise<void> {
    await this.waitForDB()

    if (!this.db) {
      return
    }

    const storeNames = Object.values(STORES)

    for (const storeName of storeNames) {
      await this.runTransaction<undefined>(storeName, "readwrite", (store) => store.clear())
    }
  }
}

// Instancia singleton
let dbInstance: IndexedDBManager | null = null

/**
 * Obtiene la instancia de IndexedDBManager
 */
export function getIndexedDBManager(): IndexedDBManager {
  if (!dbInstance) {
    dbInstance = new IndexedDBManager()
  }
  return dbInstance
}

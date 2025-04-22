"use server"

import { revalidatePath } from "next/cache"
import fs from "fs"
import path from "path"
import JSZip from "jszip"

// Define the project structure type
type ProjectStructure = {
  version: string
  metadata: {
    name: string
    description: string
    createdAt: string
    exportedAt: string
  }
  components: Record<string, any>
  configurations: Record<string, any>
  dependencies: Record<string, string>
  assets: Record<string, string> // Base64 encoded assets
  userSettings: Record<string, any>
}

/**
 * Export the entire project as a compressed file
 */
export async function exportProject(
  progressCallback?: (progress: number) => void,
): Promise<{ success: boolean; filePath: string }> {
  try {
    // Initialize progress
    if (progressCallback) progressCallback(0)

    // 1. Collect all project components
    const components = await collectComponents()
    if (progressCallback) progressCallback(20)

    // 2. Collect configurations
    const configurations = await collectConfigurations()
    if (progressCallback) progressCallback(40)

    // 3. Collect dependencies
    const dependencies = await collectDependencies()
    if (progressCallback) progressCallback(60)

    // 4. Collect user settings and presets
    const userSettings = await collectUserSettings()
    if (progressCallback) progressCallback(70)

    // 5. Collect assets (images, etc.)
    const assets = await collectAssets()
    if (progressCallback) progressCallback(80)

    // 6. Create the project structure
    const projectStructure: ProjectStructure = {
      version: "1.0.0",
      metadata: {
        name: "Vanguardista Design Generator",
        description: "Exported project from Vanguardista Design Generator",
        createdAt: new Date().toISOString(),
        exportedAt: new Date().toISOString(),
      },
      components,
      configurations,
      dependencies,
      assets,
      userSettings,
    }

    // 7. Create a zip file
    const zip = new JSZip()

    // Add project.json with the main structure
    zip.file("project.json", JSON.stringify(projectStructure, null, 2))

    // Add components folder with individual files
    const componentsFolder = zip.folder("components")
    Object.entries(components).forEach(([name, content]) => {
      componentsFolder?.file(`${name}.tsx`, content)
    })

    // Add configurations folder
    const configFolder = zip.folder("configurations")
    Object.entries(configurations).forEach(([name, content]) => {
      configFolder?.file(`${name}`, JSON.stringify(content, null, 2))
    })

    // Add assets folder with binary files
    const assetsFolder = zip.folder("assets")
    Object.entries(assets).forEach(([name, base64Content]) => {
      // Convert base64 to binary
      const binaryContent = Buffer.from(base64Content, "base64")
      assetsFolder?.file(name, binaryContent)
    })

    if (progressCallback) progressCallback(90)

    // 8. Generate the zip file
    const zipContent = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 9 },
    })

    // 9. Save the zip file
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filePath = path.join(process.cwd(), "public", "exports", `vanguardista-project-${timestamp}.vgp`)

    // Ensure the directory exists
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Write the file
    fs.writeFileSync(filePath, zipContent)

    if (progressCallback) progressCallback(100)

    return {
      success: true,
      filePath,
    }
  } catch (error) {
    console.error("Export failed:", error)
    throw new Error(`Export failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Validate a project file before importing
 */
export async function validateProjectFile(file: File): Promise<{
  valid: boolean
  components: number
  configurations: number
  dependencies: number
  version: string
}> {
  try {
    // Read the file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Load the zip file
    const zip = await JSZip.loadAsync(buffer)

    // Check if project.json exists
    const projectJson = zip.file("project.json")
    if (!projectJson) {
      throw new Error("Invalid project file: missing project.json")
    }

    // Read and parse project.json
    const projectJsonContent = await projectJson.async("string")
    const projectStructure = JSON.parse(projectJsonContent) as ProjectStructure

    // Validate the structure
    if (!projectStructure.version || !projectStructure.components || !projectStructure.configurations) {
      throw new Error("Invalid project structure")
    }

    return {
      valid: true,
      components: Object.keys(projectStructure.components).length,
      configurations: Object.keys(projectStructure.configurations).length,
      dependencies: Object.keys(projectStructure.dependencies).length,
      version: projectStructure.version,
    }
  } catch (error) {
    console.error("Validation failed:", error)
    throw new Error(`Validation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Import a project from a file
 */
export async function importProject(
  file: File,
  progressCallback?: (progress: number) => void,
): Promise<{ success: boolean }> {
  try {
    // Initialize progress
    if (progressCallback) progressCallback(0)

    // 1. Read the file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    if (progressCallback) progressCallback(10)

    // 2. Load the zip file
    const zip = await JSZip.loadAsync(buffer)
    if (progressCallback) progressCallback(20)

    // 3. Read and parse project.json
    const projectJson = zip.file("project.json")
    if (!projectJson) {
      throw new Error("Invalid project file: missing project.json")
    }

    const projectJsonContent = await projectJson.async("string")
    const projectStructure = JSON.parse(projectJsonContent) as ProjectStructure
    if (progressCallback) progressCallback(30)

    // 4. Backup current project (optional)
    await backupCurrentProject()
    if (progressCallback) progressCallback(40)

    // 5. Import components
    await importComponents(projectStructure.components, zip)
    if (progressCallback) progressCallback(60)

    // 6. Import configurations
    await importConfigurations(projectStructure.configurations, zip)
    if (progressCallback) progressCallback(70)

    // 7. Import assets
    await importAssets(projectStructure.assets, zip)
    if (progressCallback) progressCallback(80)

    // 8. Import user settings
    await importUserSettings(projectStructure.userSettings)
    if (progressCallback) progressCallback(90)

    // 9. Update dependencies if needed
    await updateDependencies(projectStructure.dependencies)
    if (progressCallback) progressCallback(100)

    // 10. Revalidate all paths to refresh the UI
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Import failed:", error)
    throw new Error(`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Helper functions for collecting project data
async function collectComponents(): Promise<Record<string, any>> {
  // This would scan the components directory and collect all component files
  // For the demo, we'll return a mock structure
  return {
    "project-exporter": "/* Component code here */",
    "mystical-header": "/* Component code here */",
    "glass-card": "/* Component code here */",
    // ... other components
  }
}

async function collectConfigurations(): Promise<Record<string, any>> {
  // Collect tailwind config, next config, etc.
  return {
    "tailwind.config.ts": {
      /* config object */
    },
    "next.config.js": {
      /* config object */
    },
    // ... other configs
  }
}

async function collectDependencies(): Promise<Record<string, string>> {
  // Read package.json and extract dependencies
  return {
    next: "^13.4.0",
    react: "^18.2.0",
    "react-dom": "^18.2.0",
    tailwindcss: "^3.3.0",
    // ... other dependencies
  }
}

async function collectUserSettings(): Promise<Record<string, any>> {
  // Collect user settings, presets, etc.
  return {
    theme: "dark",
    presets: {
      /* presets data */
    },
    // ... other settings
  }
}

async function collectAssets(): Promise<Record<string, string>> {
  // Collect and encode assets as base64
  return {
    "logo.png": "/* base64 encoded content */",
    "background.jpg": "/* base64 encoded content */",
    // ... other assets
  }
}

// Helper functions for importing project data
async function backupCurrentProject(): Promise<void> {
  // Create a backup of the current project before importing
  // Implementation depends on the project structure
}

async function importComponents(components: Record<string, any>, zip: JSZip): Promise<void> {
  // Import components from the zip file
  // Implementation depends on the project structure
}

async function importConfigurations(configurations: Record<string, any>, zip: JSZip): Promise<void> {
  // Import configurations from the zip file
  // Implementation depends on the project structure
}

async function importAssets(assets: Record<string, string>, zip: JSZip): Promise<void> {
  // Import assets from the zip file
  // Implementation depends on the project structure
}

async function importUserSettings(userSettings: Record<string, any>): Promise<void> {
  // Import user settings
  // Implementation depends on the project structure
}

async function updateDependencies(dependencies: Record<string, string>): Promise<void> {
  // Update dependencies if needed
  // This might involve updating package.json
}

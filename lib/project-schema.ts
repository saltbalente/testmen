// Project file schema definition

export interface ProjectMetadata {
  name: string
  description: string
  createdAt: string
  exportedAt: string
  author?: string
  version?: string
}

export interface ComponentDefinition {
  path: string
  content: string
  dependencies: string[]
}

export interface ConfigurationDefinition {
  path: string
  content: Record<string, any>
}

export interface AssetDefinition {
  path: string
  mimeType: string
  content: string // Base64 encoded
}

export interface UserSettingDefinition {
  key: string
  value: any
}

export interface ProjectStructure {
  version: string
  metadata: ProjectMetadata
  components: Record<string, ComponentDefinition>
  configurations: Record<string, ConfigurationDefinition>
  dependencies: Record<string, string>
  assets: Record<string, AssetDefinition>
  userSettings: Record<string, UserSettingDefinition>
}

// Validation functions
export function validateProjectStructure(project: any): project is ProjectStructure {
  // Basic validation to ensure the project has the required structure
  if (!project || typeof project !== "object") return false
  if (typeof project.version !== "string") return false
  if (!project.metadata || typeof project.metadata !== "object") return false
  if (!project.components || typeof project.components !== "object") return false
  if (!project.configurations || typeof project.configurations !== "object") return false

  return true
}

export function getProjectSummary(project: ProjectStructure) {
  return {
    name: project.metadata.name,
    description: project.metadata.description,
    componentCount: Object.keys(project.components).length,
    configCount: Object.keys(project.configurations).length,
    assetCount: Object.keys(project.assets).length,
    exportDate: new Date(project.metadata.exportedAt).toLocaleDateString(),
    version: project.version,
  }
}

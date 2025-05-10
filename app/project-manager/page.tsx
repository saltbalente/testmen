import { ProjectExporter } from "@/components/project-exporter"
import { ProjectExportDocs } from "@/components/project-export-docs"

export default function ProjectManagerPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Project Manager
        </h1>
        <p className="text-muted-foreground">Export, import, and manage your Vanguardista Design Generator projects</p>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
        <ProjectExporter />
        <ProjectExportDocs />
      </div>
    </div>
  )
}

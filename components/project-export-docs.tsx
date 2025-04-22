import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileJson, Archive, AlertTriangle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ProjectExportDocs() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Project Export/Import Documentation</CardTitle>
        <CardDescription>Learn how to use the project export and import system</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Project Export/Import System</h3>
              <p className="text-sm">
                The Project Export/Import System allows you to save your entire Vanguardista Design Generator project as
                a portable file and restore it later or on another device. This system ensures all components,
                configurations, and dependencies are correctly preserved and integrated.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-md bg-black/20 border border-purple-500/20 space-y-2">
                  <div className="flex items-center">
                    <FileJson className="h-5 w-5 mr-2 text-purple-500" />
                    <h4 className="font-medium">What Gets Exported</h4>
                  </div>
                  <ul className="text-sm space-y-1 pl-7 list-disc">
                    <li>All UI Components</li>
                    <li>Project Configurations</li>
                    <li>Tailwind Settings</li>
                    <li>Dependencies</li>
                    <li>User Presets & Settings</li>
                    <li>Assets & Resources</li>
                  </ul>
                </div>

                <div className="p-4 rounded-md bg-black/20 border border-purple-500/20 space-y-2">
                  <div className="flex items-center">
                    <Archive className="h-5 w-5 mr-2 text-purple-500" />
                    <h4 className="font-medium">File Format</h4>
                  </div>
                  <p className="text-sm">
                    Projects are exported as <code>.vgp</code> files (Vanguardista Project). These are compressed
                    archives containing a structured representation of your entire project, optimized for portability
                    and integrity.
                  </p>
                </div>
              </div>

              <Alert variant="default" className="bg-blue-500/10 border-blue-500/20 mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Version Compatibility</AlertTitle>
                <AlertDescription>
                  Project files are compatible across versions, but some newer features may not be available when
                  importing into older versions of the application.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Exporting Your Project</h3>
              <p className="text-sm">
                Exporting your project creates a complete snapshot of your current work, including all components,
                configurations, and user settings.
              </p>

              <div className="space-y-4 mt-4">
                <div className="p-4 rounded-md bg-black/20 border border-purple-500/20">
                  <h4 className="font-medium mb-2">Export Process</h4>
                  <ol className="text-sm space-y-2 pl-5 list-decimal">
                    <li>
                      <span className="font-medium">Navigate to the Export Tab</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Open the Project Export/Import panel and select the "Export Project" tab.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Review Export Contents</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Verify the components and configurations that will be included in the export.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Click "Export Project"</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        The system will package your project into a .vgp file. This may take a few moments depending on
                        project size.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Save the File</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Once the export is complete, your browser will download the .vgp file. Store this file securely.
                      </p>
                    </li>
                  </ol>
                </div>

                <Alert variant="default" className="bg-amber-500/10 border-amber-500/20">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important Note</AlertTitle>
                  <AlertDescription>
                    Exported projects contain all your custom components and configurations. Keep your export files
                    secure as they may contain sensitive information.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Importing a Project</h3>
              <p className="text-sm">
                Importing a project restores all components, configurations, and settings from a previously exported
                file.
              </p>

              <div className="space-y-4 mt-4">
                <div className="p-4 rounded-md bg-black/20 border border-purple-500/20">
                  <h4 className="font-medium mb-2">Import Process</h4>
                  <ol className="text-sm space-y-2 pl-5 list-decimal">
                    <li>
                      <span className="font-medium">Navigate to the Import Tab</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Open the Project Export/Import panel and select the "Import Project" tab.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Select Your Project File</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Click the upload area to browse for your .vgp file or drag and drop it directly.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Review Project Details</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        The system will validate the file and show you details about the project, including component
                        count and version.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Click "Import Project"</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Confirm the import to begin the restoration process. This will replace your current project
                        state.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Wait for Completion</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        The system will restore all components and configurations. The page will refresh when complete.
                      </p>
                    </li>
                  </ol>
                </div>

                <Alert variant="destructive" className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    Importing a project will overwrite your current project state. Consider exporting your current
                    project as a backup before importing a new one.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="troubleshooting" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Troubleshooting</h3>
              <p className="text-sm">Common issues and solutions for the Project Export/Import System.</p>

              <div className="space-y-4 mt-4">
                <div className="border border-purple-500/20 rounded-md overflow-hidden">
                  <div className="bg-black/30 p-3">
                    <h4 className="font-medium">Common Issues</h4>
                  </div>
                  <div className="divide-y divide-purple-500/10">
                    <div className="p-3">
                      <h5 className="font-medium text-sm">Invalid Project File</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        If your file is reported as invalid, ensure it's a proper .vgp file exported from Vanguardista
                        Design Generator. Files from other sources or manually modified files may not work.
                      </p>
                    </div>
                    <div className="p-3">
                      <h5 className="font-medium text-sm">Import Fails at Specific Percentage</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        This usually indicates a compatibility issue. Check that you're using a compatible version of
                        the application for the project file you're importing.
                      </p>
                    </div>
                    <div className="p-3">
                      <h5 className="font-medium text-sm">Missing Components After Import</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        If some components are missing after import, try refreshing the page. If the issue persists, the
                        project file may be corrupted or incomplete.
                      </p>
                    </div>
                    <div className="p-3">
                      <h5 className="font-medium text-sm">Export Process Takes Too Long</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        For large projects with many components and assets, the export process may take longer. If it
                        seems stuck, try refreshing and exporting again.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-md bg-black/20 border border-purple-500/20">
                  <h4 className="font-medium mb-2">Contact Support</h4>
                  <p className="text-sm">
                    If you continue to experience issues with the Project Export/Import System, please contact our
                    support team with details about the problem and any error messages you received.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

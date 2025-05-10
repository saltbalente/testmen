"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PromptGenerator } from "./prompt-generator"
import { PromptComparison } from "./prompt-comparison"
import { DesignGallery } from "./design-gallery"
import { DesignTemplates } from "./design-templates"

export function DesignVault() {
  const [activeTab, setActiveTab] = useState("generator")

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Design Vault</h1>
        <p className="text-muted-foreground">Herramientas para generar y gestionar diseños web con IA</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="generator">Generador de Prompts</TabsTrigger>
          <TabsTrigger value="comparison">Comparador de IA</TabsTrigger>
          <TabsTrigger value="gallery">Galería de Diseños</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-6">
          <PromptGenerator />
        </TabsContent>

        <TabsContent value="comparison" className="mt-6">
          <PromptComparison />
        </TabsContent>

        <TabsContent value="gallery" className="mt-6">
          <DesignGallery />
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <DesignTemplates />
        </TabsContent>
      </Tabs>
    </div>
  )
}

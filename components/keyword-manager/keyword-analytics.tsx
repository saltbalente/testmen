"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { BarChart3, PieChartIcon, TrendingUp } from "lucide-react"
import type { Keyword, KeywordCategory } from "@/types/keyword"

interface KeywordAnalyticsProps {
  keywords: Keyword[]
  categories: KeywordCategory[]
}

export default function KeywordAnalytics({ keywords, categories }: KeywordAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<"volume" | "competition" | "categories">("volume")
  const [volumeGrouping, setVolumeGrouping] = useState<"ranges" | "top10">("ranges")
  const [competitionGrouping, setCompetitionGrouping] = useState<"ranges" | "top10">("ranges")

  // Datos para el gráfico de volumen
  const volumeData = useMemo(() => {
    if (volumeGrouping === "ranges") {
      // Agrupar por rangos de volumen
      const ranges = [
        { name: "0-100", min: 0, max: 100, count: 0 },
        { name: "101-500", min: 101, max: 500, count: 0 },
        { name: "501-1K", min: 501, max: 1000, count: 0 },
        { name: "1K-5K", min: 1001, max: 5000, count: 0 },
        { name: "5K-10K", min: 5001, max: 10000, count: 0 },
        { name: "10K+", min: 10001, max: Number.POSITIVE_INFINITY, count: 0 },
      ]

      keywords.forEach((kw) => {
        const range = ranges.find((r) => kw.volume >= r.min && kw.volume <= r.max)
        if (range) range.count++
      })

      return ranges
    } else {
      // Top 10 keywords por volumen
      return [...keywords]
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 10)
        .map((kw) => ({
          name: kw.keyword.length > 15 ? kw.keyword.substring(0, 15) + "..." : kw.keyword,
          volume: kw.volume,
        }))
    }
  }, [keywords, volumeGrouping])

  // Datos para el gráfico de competencia
  const competitionData = useMemo(() => {
    if (competitionGrouping === "ranges") {
      // Agrupar por rangos de competencia
      const ranges = [
        { name: "0-10%", min: 0, max: 0.1, count: 0 },
        { name: "11-30%", min: 0.11, max: 0.3, count: 0 },
        { name: "31-50%", min: 0.31, max: 0.5, count: 0 },
        { name: "51-70%", min: 0.51, max: 0.7, count: 0 },
        { name: "71-90%", min: 0.71, max: 0.9, count: 0 },
        { name: "91-100%", min: 0.91, max: 1, count: 0 },
      ]

      keywords.forEach((kw) => {
        const range = ranges.find((r) => kw.competition >= r.min && kw.competition <= r.max)
        if (range) range.count++
      })

      return ranges
    } else {
      // Top 10 keywords por competencia
      return [...keywords]
        .sort((a, b) => b.competition - a.competition)
        .slice(0, 10)
        .map((kw) => ({
          name: kw.keyword.length > 15 ? kw.keyword.substring(0, 15) + "..." : kw.keyword,
          competition: Math.round(kw.competition * 100),
        }))
    }
  }, [keywords, competitionGrouping])

  // Datos para el gráfico de categorías
  const categoryData = useMemo(() => {
    const catCounts: Record<string, number> = {}

    // Contar keywords por categoría
    keywords.forEach((kw) => {
      const catName = kw.category || "Sin categoría"
      catCounts[catName] = (catCounts[catName] || 0) + 1
    })

    // Convertir a array para el gráfico
    return Object.entries(catCounts).map(([name, value]) => ({ name, value }))
  }, [keywords])

  // Colores para el gráfico de categorías
  const categoryColors = useMemo(() => {
    const colorMap: Record<string, string> = {}

    // Asignar colores de las categorías definidas
    categories.forEach((cat) => {
      colorMap[cat.name] = cat.color
    })

    // Color por defecto para "Sin categoría"
    colorMap["Sin categoría"] = "#A0A0A0"

    return colorMap
  }, [categories])

  // Colores para los gráficos de barras
  const VOLUME_COLOR = "#3b82f6"
  const COMPETITION_COLOR = "#ef4444"

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          Análisis de Keywords
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "volume" | "competition" | "categories")}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="volume" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Volumen
            </TabsTrigger>
            <TabsTrigger value="competition" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Competencia
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center">
              <PieChartIcon className="mr-2 h-4 w-4" />
              Categorías
            </TabsTrigger>
          </TabsList>

          <TabsContent value="volume">
            <div className="mb-4">
              <Select value={volumeGrouping} onValueChange={(value) => setVolumeGrouping(value as "ranges" | "top10")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de visualización" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ranges">Por rangos de volumen</SelectItem>
                  <SelectItem value="top10">Top 10 keywords</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "volume") return [value.toLocaleString(), "Volumen"]
                      return [value, "Cantidad"]
                    }}
                  />
                  <Bar
                    dataKey={volumeGrouping === "ranges" ? "count" : "volume"}
                    fill={VOLUME_COLOR}
                    name={volumeGrouping === "ranges" ? "Cantidad" : "Volumen"}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="competition">
            <div className="mb-4">
              <Select
                value={competitionGrouping}
                onValueChange={(value) => setCompetitionGrouping(value as "ranges" | "top10")}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de visualización" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ranges">Por rangos de competencia</SelectItem>
                  <SelectItem value="top10">Top 10 keywords</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={competitionData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "competition") return [`${value}%`, "Competencia"]
                      return [value, "Cantidad"]
                    }}
                  />
                  <Bar
                    dataKey={competitionGrouping === "ranges" ? "count" : "competition"}
                    fill={COMPETITION_COLOR}
                    name={competitionGrouping === "ranges" ? "Cantidad" : "Competencia (%)"}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={categoryColors[entry.name] || "#A0A0A0"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Keywords"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

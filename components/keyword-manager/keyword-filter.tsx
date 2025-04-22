"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { KeywordCategory, KeywordFilter } from "@/types/keyword"
import { Search, X } from "lucide-react"

interface KeywordFilterProps {
  filter: KeywordFilter
  setFilter: (filter: KeywordFilter) => void
  categories: KeywordCategory[]
  keywordCount: number
}

export default function KeywordFilter({ filter, setFilter, categories, keywordCount }: KeywordFilterProps) {
  const [searchInput, setSearchInput] = useState(filter.search)

  // Actualizar el input cuando cambie el filtro externo
  useEffect(() => {
    setSearchInput(filter.search)
  }, [filter.search])

  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  // Aplicar búsqueda al presionar Enter
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setFilter({ ...filter, search: searchInput })
    }
  }

  // Aplicar búsqueda al hacer clic en el botón
  const handleSearchClick = () => {
    setFilter({ ...filter, search: searchInput })
  }

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchInput("")
    setFilter({ ...filter, search: "" })
  }

  // Alternar categoría en el filtro
  const handleToggleCategory = (categoryName: string) => {
    setFilter({
      ...filter,
      categories: filter.categories.includes(categoryName)
        ? filter.categories.filter((c) => c !== categoryName)
        : [...filter.categories, categoryName],
    })
  }

  // Limpiar todos los filtros
  const handleClearAllFilters = () => {
    setSearchInput("")
    setFilter({ search: "", categories: [] })
  }

  // Verificar si hay filtros activos
  const hasActiveFilters = filter.search || filter.categories.length > 0

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                placeholder="Buscar keywords..."
                value={searchInput}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                className="pr-8"
              />
              {searchInput && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button variant="secondary" size="sm" onClick={handleSearchClick}>
              <Search className="h-4 w-4 mr-1" />
              Buscar
            </Button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Filtrar por categoría</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={handleClearAllFilters}>
                  Limpiar filtros
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={filter.categories.includes(category.name) ? "default" : "outline"}
                  style={{
                    backgroundColor: filter.categories.includes(category.name) ? category.color : "transparent",
                    borderColor: category.color,
                    color: filter.categories.includes(category.name) ? "white" : "inherit",
                  }}
                  className="cursor-pointer"
                  onClick={() => handleToggleCategory(category.name)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-500">
            {hasActiveFilters ? "Mostrando resultados filtrados" : `Mostrando todas las keywords (${keywordCount})`}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

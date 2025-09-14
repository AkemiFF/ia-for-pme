"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Bookmark, Plus, X } from "lucide-react"
import type { FilterOptions } from "./AdvancedFilters"

interface SavedFilter {
  id: string
  name: string
  filters: FilterOptions
  createdAt: Date
  useCount: number
}

interface SavedFiltersProps {
  currentFilters: FilterOptions
  onLoadFilter: (filters: FilterOptions) => void
  onSaveFilter: (name: string, filters: FilterOptions) => void
}

export default function SavedFilters({ currentFilters, onLoadFilter, onSaveFilter }: SavedFiltersProps) {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [filterName, setFilterName] = useState("")

  useEffect(() => {
    // Load saved filters from localStorage
    const saved = localStorage.getItem("savedFilters")
    if (saved) {
      setSavedFilters(JSON.parse(saved))
    }
  }, [])

  const saveFilter = () => {
    if (!filterName.trim()) return

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName.trim(),
      filters: currentFilters,
      createdAt: new Date(),
      useCount: 0,
    }

    const updated = [...savedFilters, newFilter]
    setSavedFilters(updated)
    localStorage.setItem("savedFilters", JSON.stringify(updated))

    onSaveFilter(filterName, currentFilters)
    setFilterName("")
    setShowSaveDialog(false)
  }

  const loadFilter = (filter: SavedFilter) => {
    // Increment use count
    const updated = savedFilters.map((f) => (f.id === filter.id ? { ...f, useCount: f.useCount + 1 } : f))
    setSavedFilters(updated)
    localStorage.setItem("savedFilters", JSON.stringify(updated))

    onLoadFilter(filter.filters)
  }

  const deleteFilter = (filterId: string) => {
    const updated = savedFilters.filter((f) => f.id !== filterId)
    setSavedFilters(updated)
    localStorage.setItem("savedFilters", JSON.stringify(updated))
  }

  const hasActiveFilters = () => {
    return (
      currentFilters.sectors.length > 0 ||
      currentFilters.budgets.length > 0 ||
      currentFilters.levels.length > 0 ||
      currentFilters.tags.length > 0 ||
      currentFilters.searchQuery.length > 0
    )
  }

  const getFilterSummary = (filters: FilterOptions) => {
    const parts = []
    if (filters.sectors.length > 0) parts.push(`${filters.sectors.length} secteur(s)`)
    if (filters.budgets.length > 0) parts.push(`${filters.budgets.length} budget(s)`)
    if (filters.levels.length > 0) parts.push(`${filters.levels.length} niveau(x)`)
    if (filters.tags.length > 0) parts.push(`${filters.tags.length} tag(s)`)
    if (filters.searchQuery) parts.push("recherche")

    return parts.join(", ") || "Aucun filtre"
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bookmark className="h-5 w-5 text-blue-600" />
            Filtres sauvegardés
          </CardTitle>
          {hasActiveFilters() && (
            <Button size="sm" onClick={() => setShowSaveDialog(true)} className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Sauvegarder
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium mb-2">Sauvegarder ces filtres</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Nom du filtre (ex: Articles freelance débutant)"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && saveFilter()}
                className="flex-1"
              />
              <Button onClick={saveFilter} disabled={!filterName.trim()}>
                Sauvegarder
              </Button>
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Annuler
              </Button>
            </div>
          </div>
        )}

        {/* Saved Filters List */}
        {savedFilters.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Bookmark className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Aucun filtre sauvegardé</p>
            <p className="text-xs mt-1">Configurez des filtres et sauvegardez-les pour un accès rapide</p>
          </div>
        ) : (
          <div className="space-y-2">
            {savedFilters
              .sort((a, b) => b.useCount - a.useCount)
              .map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 cursor-pointer" onClick={() => loadFilter(filter)}>
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium text-gray-900">{filter.name}</h5>
                      {filter.useCount > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {filter.useCount} utilisations
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{getFilterSummary(filter.filters)}</p>
                    <p className="text-xs text-gray-400">Créé le {filter.createdAt.toLocaleDateString("fr-FR")}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteFilter(filter.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
          </div>
        )}

        {/* Quick Filters */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Filtres rapides</h5>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onLoadFilter({
                  sectors: ["freelance"],
                  budgets: ["gratuit"],
                  levels: ["debutant"],
                  readTime: [1, 10],
                  tags: ["outils-gratuits"],
                  searchQuery: "",
                })
              }
              className="text-xs justify-start"
            >
              Freelance débutant
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onLoadFilter({
                  sectors: ["pme"],
                  budgets: ["moyen"],
                  levels: ["intermediaire"],
                  readTime: [5, 15],
                  tags: ["automatisation"],
                  searchQuery: "",
                })
              }
              className="text-xs justify-start"
            >
              PME automatisation
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onLoadFilter({
                  sectors: [],
                  budgets: ["gratuit"],
                  levels: [],
                  readTime: [1, 60],
                  tags: ["outils-gratuits"],
                  searchQuery: "",
                })
              }
              className="text-xs justify-start"
            >
              Outils gratuits
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onLoadFilter({
                  sectors: [],
                  budgets: [],
                  levels: [],
                  readTime: [1, 5],
                  tags: [],
                  searchQuery: "",
                })
              }
              className="text-xs justify-start"
            >
              Lecture rapide
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

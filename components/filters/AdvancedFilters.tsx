"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Filter, X, Search, Users, DollarSign, Clock, TrendingUp } from "lucide-react"
import SmartRecommendations from "./SmartRecommendations"
import SavedFilters from "./SavedFilters"

export interface FilterOptions {
  sectors: string[]
  budgets: string[]
  levels: string[]
  readTime: number[]
  tags: string[]
  searchQuery: string
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void
  totalArticles: number
  filteredCount: number
}

const SECTORS = [
  { id: "freelance", label: "Freelance", icon: <Users className="h-4 w-4" /> },
  { id: "pme", label: "PME", icon: <TrendingUp className="h-4 w-4" /> },
  { id: "ecommerce", label: "E-commerce", icon: <DollarSign className="h-4 w-4" /> },
  { id: "marketing", label: "Marketing", icon: <TrendingUp className="h-4 w-4" /> },
  { id: "developpement", label: "Développement", icon: <Users className="h-4 w-4" /> },
  { id: "design", label: "Design", icon: <Users className="h-4 w-4" /> },
  { id: "conseil", label: "Conseil", icon: <Users className="h-4 w-4" /> },
]

const BUDGETS = [
  { id: "gratuit", label: "Gratuit (0€)", range: "0€" },
  { id: "petit", label: "Petit budget (1-50€/mois)", range: "1-50€/mois" },
  { id: "moyen", label: "Budget moyen (51-200€/mois)", range: "51-200€/mois" },
  { id: "eleve", label: "Budget élevé (200€+/mois)", range: "200€+/mois" },
]

const LEVELS = [
  { id: "debutant", label: "Débutant", description: "Aucune expérience requise" },
  { id: "intermediaire", label: "Intermédiaire", description: "Quelques bases nécessaires" },
  { id: "expert", label: "Expert", description: "Connaissances avancées" },
]

const POPULAR_TAGS = [
  "automatisation",
  "productivité",
  "chatbot",
  "marketing",
  "ventes",
  "service-client",
  "analyse-donnees",
  "formation",
  "roi",
  "strategie",
  "outils-gratuits",
  "integration",
  "securite",
  "rgpd",
  "workflow",
]

export default function AdvancedFilters({ onFiltersChange, totalArticles, filteredCount }: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    sectors: [],
    budgets: [],
    levels: [],
    readTime: [5, 30],
    tags: [],
    searchQuery: "",
  })
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularTags] = useState(["automatisation", "productivité", "chatbot", "roi", "gratuit"])

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFiltersChange(updated)

    if (newFilters.searchQuery && newFilters.searchQuery.length > 2) {
      const searches = [...recentSearches]
      if (!searches.includes(newFilters.searchQuery)) {
        searches.unshift(newFilters.searchQuery)
        setRecentSearches(searches.slice(0, 5)) // Keep only last 5 searches
      }
    }
  }

  const toggleArrayFilter = (array: string[], value: string, key: keyof FilterOptions) => {
    const newArray = array.includes(value) ? array.filter((item) => item !== value) : [...array, value]
    updateFilters({ [key]: newArray })
  }

  const clearAllFilters = () => {
    const clearedFilters: FilterOptions = {
      sectors: [],
      budgets: [],
      levels: [],
      readTime: [5, 30],
      tags: [],
      searchQuery: "",
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters =
    filters.sectors.length > 0 ||
    filters.budgets.length > 0 ||
    filters.levels.length > 0 ||
    filters.tags.length > 0 ||
    filters.searchQuery.length > 0

  const handleSmartRecommendation = (recommendation: any) => {
    // Apply filters based on recommendation type
    let recommendedFilters: Partial<FilterOptions> = {}

    switch (recommendation.id) {
      case "trending":
        recommendedFilters = { tags: ["tendance"] }
        break
      case "quick-reads":
        recommendedFilters = { readTime: [1, 5] }
        break
      case "freelance-focus":
        recommendedFilters = { sectors: ["freelance"] }
        break
      case "beginner-friendly":
        recommendedFilters = { levels: ["debutant"] }
        break
      case "free-tools":
        recommendedFilters = { budgets: ["gratuit"], tags: ["outils-gratuits"] }
        break
    }

    updateFilters(recommendedFilters)
  }

  const handleSaveFilter = (name: string, filterOptions: FilterOptions) => {
    // Optional: Show success message
    console.log(`Filter "${name}" saved successfully`)
  }

  return (
    <div className="space-y-4">
      <SmartRecommendations
        onRecommendationClick={handleSmartRecommendation}
        recentSearches={recentSearches}
        popularTags={popularTags}
      />

      <SavedFilters
        currentFilters={filters}
        onLoadFilter={(newFilters) => {
          setFilters(newFilters)
          onFiltersChange(newFilters)
        }}
        onSaveFilter={handleSaveFilter}
      />

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Rechercher par titre, contenu ou auteur..."
          value={filters.searchQuery}
          onChange={(e) => updateFilters({ searchQuery: e.target.value })}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={isExpanded ? "default" : "outline"}
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtres avancés
        </Button>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-transparent"
          >
            <X className="h-4 w-4" />
            Effacer tout
          </Button>
        )}

        <div className="text-sm text-gray-500 flex items-center">
          {filteredCount} / {totalArticles} articles
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.sectors.map((sector) => (
            <Badge key={sector} variant="secondary" className="flex items-center gap-1">
              {SECTORS.find((s) => s.id === sector)?.label}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => toggleArrayFilter(filters.sectors, sector, "sectors")}
              />
            </Badge>
          ))}
          {filters.budgets.map((budget) => (
            <Badge key={budget} variant="secondary" className="flex items-center gap-1">
              {BUDGETS.find((b) => b.id === budget)?.label}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => toggleArrayFilter(filters.budgets, budget, "budgets")}
              />
            </Badge>
          ))}
          {filters.levels.map((level) => (
            <Badge key={level} variant="secondary" className="flex items-center gap-1">
              {LEVELS.find((l) => l.id === level)?.label}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => toggleArrayFilter(filters.levels, level, "levels")}
              />
            </Badge>
          ))}
          {filters.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="flex items-center gap-1">
              #{tag}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => toggleArrayFilter(filters.tags, tag, "tags")}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Expanded Filters */}
      {isExpanded && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtres avancés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sectors */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Secteur d'activité
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {SECTORS.map((sector) => (
                  <div key={sector.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={sector.id}
                      checked={filters.sectors.includes(sector.id)}
                      onCheckedChange={() => toggleArrayFilter(filters.sectors, sector.id, "sectors")}
                    />
                    <label
                      htmlFor={sector.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
                    >
                      {sector.icon}
                      {sector.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Budget mensuel
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {BUDGETS.map((budget) => (
                  <div key={budget.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={budget.id}
                      checked={filters.budgets.includes(budget.id)}
                      onCheckedChange={() => toggleArrayFilter(filters.budgets, budget.id, "budgets")}
                    />
                    <label
                      htmlFor={budget.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {budget.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Level */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Niveau technique
              </h4>
              <div className="space-y-2">
                {LEVELS.map((level) => (
                  <div key={level.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={level.id}
                      checked={filters.levels.includes(level.id)}
                      onCheckedChange={() => toggleArrayFilter(filters.levels, level.id, "levels")}
                    />
                    <label
                      htmlFor={level.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {level.label}
                      <span className="text-gray-500 ml-2">({level.description})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Read Time */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Temps de lecture: {filters.readTime[0]}-{filters.readTime[1]} min
              </h4>
              <Slider
                value={filters.readTime}
                onValueChange={(value) => updateFilters({ readTime: value })}
                max={60}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 min</span>
                <span>60 min</span>
              </div>
            </div>

            {/* Popular Tags */}
            <div>
              <h4 className="font-medium mb-3">Tags populaires</h4>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => toggleArrayFilter(filters.tags, tag, "tags")}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Custom Tag Input */}
            <div>
              <h4 className="font-medium mb-3">Ajouter un tag personnalisé</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tapez un tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      const value = (e.target as HTMLInputElement).value.trim().toLowerCase()
                      if (value && !filters.tags.includes(value)) {
                        updateFilters({ tags: [...filters.tags, value] })
                        ;(e.target as HTMLInputElement).value = ""
                      }
                    }
                  }}
                />
                <Button size="sm" variant="outline">
                  Ajouter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

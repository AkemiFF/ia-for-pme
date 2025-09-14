"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, TrendingUp, Clock, Users, Star, Zap } from "lucide-react"

interface UserProfile {
  sector: string
  level: string
  budget: string
  interests: string[]
  readingTime: number
}

interface SmartRecommendation {
  id: string
  title: string
  reason: string
  confidence: number
  type: "trending" | "personalized" | "quick-read" | "popular"
  articleIds: number[]
}

interface SmartRecommendationsProps {
  userProfile?: UserProfile
  onRecommendationClick: (recommendation: SmartRecommendation) => void
  recentSearches: string[]
  popularTags: string[]
}

export default function SmartRecommendations({
  userProfile,
  onRecommendationClick,
  recentSearches,
  popularTags,
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([])

  useEffect(() => {
    generateRecommendations()
  }, [userProfile, recentSearches, popularTags])

  const generateRecommendations = () => {
    const recs: SmartRecommendation[] = []

    // Trending articles
    recs.push({
      id: "trending",
      title: "Articles tendance cette semaine",
      reason: "Les plus lus par la communauté",
      confidence: 85,
      type: "trending",
      articleIds: [1, 2, 6],
    })

    // Quick reads for busy professionals
    recs.push({
      id: "quick-reads",
      title: "Lectures rapides (< 5 min)",
      reason: "Pour les professionnels pressés",
      confidence: 90,
      type: "quick-read",
      articleIds: [2, 5],
    })

    // Personalized based on user profile
    if (userProfile) {
      if (userProfile.sector === "freelance") {
        recs.push({
          id: "freelance-focus",
          title: "Spécial Freelances",
          reason: "Adapté à votre profil freelance",
          confidence: 95,
          type: "personalized",
          articleIds: [2, 5],
        })
      }

      if (userProfile.level === "debutant") {
        recs.push({
          id: "beginner-friendly",
          title: "Parfait pour débuter",
          reason: "Articles accessibles aux débutants",
          confidence: 88,
          type: "personalized",
          articleIds: [2, 5],
        })
      }

      if (userProfile.budget === "gratuit") {
        recs.push({
          id: "free-tools",
          title: "Outils gratuits uniquement",
          reason: "Solutions sans budget",
          confidence: 92,
          type: "personalized",
          articleIds: [2],
        })
      }
    }

    // Based on recent searches
    if (recentSearches.length > 0) {
      const searchTerms = recentSearches.join(", ")
      recs.push({
        id: "search-based",
        title: `En lien avec "${searchTerms}"`,
        reason: "Basé sur vos recherches récentes",
        confidence: 80,
        type: "personalized",
        articleIds: [1, 3, 4],
      })
    }

    // Popular this month
    recs.push({
      id: "popular-month",
      title: "Populaires ce mois-ci",
      reason: "Les articles les plus appréciés",
      confidence: 75,
      type: "popular",
      articleIds: [1, 3, 6],
    })

    setRecommendations(recs)
  }

  const getRecommendationIcon = (type: SmartRecommendation["type"]) => {
    switch (type) {
      case "trending":
        return <TrendingUp className="h-4 w-4" />
      case "personalized":
        return <Users className="h-4 w-4" />
      case "quick-read":
        return <Clock className="h-4 w-4" />
      case "popular":
        return <Star className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  const getRecommendationColor = (type: SmartRecommendation["type"]) => {
    switch (type) {
      case "trending":
        return "bg-orange-100 text-orange-800"
      case "personalized":
        return "bg-blue-100 text-blue-800"
      case "quick-read":
        return "bg-green-100 text-green-800"
      case "popular":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600"
    if (confidence >= 80) return "text-yellow-600"
    return "text-gray-600"
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          Recommandations intelligentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => onRecommendationClick(rec)}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`p-2 rounded-full ${getRecommendationColor(rec.type)}`}>
                  {getRecommendationIcon(rec.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{rec.title}</h4>
                  <p className="text-sm text-gray-600">{rec.reason}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {rec.articleIds.length} articles
                </Badge>
                <div className={`text-xs font-medium ${getConfidenceColor(rec.confidence)}`}>{rec.confidence}%</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Actions rapides</h5>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="text-xs bg-transparent">
              Articles de moins de 5 min
            </Button>
            <Button size="sm" variant="outline" className="text-xs bg-transparent">
              Outils gratuits uniquement
            </Button>
            <Button size="sm" variant="outline" className="text-xs bg-transparent">
              Guides pour débutants
            </Button>
            <Button size="sm" variant="outline" className="text-xs bg-transparent">
              Tendances de la semaine
            </Button>
          </div>
        </div>

        {/* Popular Tags Cloud */}
        {popularTags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Tags populaires</h5>
            <div className="flex flex-wrap gap-1">
              {popularTags.slice(0, 8).map((tag, index) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={`text-xs cursor-pointer hover:bg-blue-50 ${index < 3 ? "bg-blue-50 text-blue-700" : ""}`}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { useAuth } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, FileText, Mail, PlusCircle, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface DashboardStats {
  articles: number
  subscribers: number
  leads: number
  views: number
}

export default function DashboardClient() {
  const { fetchWithAuth, isAuthenticated } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    articles: 0,
    subscribers: 0,
    leads: 0,
    views: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      loadStats()
    }
  }, [isAuthenticated])

  const loadStats = async () => {
    try {
      setLoading(true)
      const [articlesRes, subscribersRes, leadsRes] = await Promise.all([
        fetchWithAuth("/api/articles"),
        fetchWithAuth("/api/newsletter/subscribers"),
        fetchWithAuth("/api/leads"),
      ])

      const articles = await articlesRes.json().catch(() => ({ data: [] }))
      const subscribers = await subscribersRes.json().catch(() => ({ data: [] }))
      const leads = await leadsRes.json().catch(() => ({ data: [] }))

      setStats({
        articles: articles.data?.length || 0,
        subscribers: subscribers.data?.length || 0,
        leads: leads.data?.length || 0,
        views: Math.floor(Math.random() * 10000), // Mock data for now
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Gérez votre contenu et suivez vos performances</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Articles</CardTitle>
              <FileText className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{loading ? "..." : stats.articles}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Articles publiés
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Abonnés</CardTitle>
              <Users className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{loading ? "..." : stats.subscribers}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Newsletter
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Leads</CardTitle>
              <Mail className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{loading ? "..." : stats.leads}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Lead magnet
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Vues</CardTitle>
              <BarChart3 className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{loading ? "..." : stats.views.toLocaleString()}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Ce mois
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-blue-600" />
                Gestion des Articles
              </CardTitle>
              <CardDescription>
                Gérez vos articles existants, modifiez le contenu et suivez les performances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/articles">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Voir les articles</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <PlusCircle className="h-5 w-5 text-green-600" />
                Créer un Article
              </CardTitle>
              <CardDescription>
                Rédigez un nouvel article avec l'aide de l'IA pour générer du contenu optimisé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/create-article">
                <Button className="w-full bg-green-600 hover:bg-green-700">Créer un article</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5 text-orange-600" />
                Newsletter & Leads
              </CardTitle>
              <CardDescription>Consultez vos abonnés newsletter et les leads générés par votre contenu</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/subscribers">
                <Button
                  variant="outline"
                  className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 bg-transparent"
                >
                  Voir les abonnés
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

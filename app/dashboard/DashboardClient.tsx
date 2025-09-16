"use client"

import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { isAuthenticated } from "@/hooks/use-auth"
import { BarChart3, FileText, LogOut, Mail, PlusCircle, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface DashboardStats {
  articles: number
  subscribers: number
  leads: number
  views: number
}

export default function DashboardClient() {
  const [isConnected, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    articles: 0,
    subscribers: 0,
    leads: 0,
    views: 0,
  })
  const router = useRouter()


  useEffect(() => {
    const runAuth = async () => {
      await checkAuth()
      if (isConnected) {
        await loadStats()
      }
    }
    runAuth()
  }, [isConnected])

  const checkAuth = async () => {
    const token = await isAuthenticated()

    if (!token) {
      router.push("/dashboard/login")
      return
    }
    setIsAuthenticated(true)
    setLoading(false)
  }

  const loadStats = async () => {
    try {
      const [articlesRes, subscribersRes, leadsRes] = await Promise.all([
        fetch("/api/articles"),
        fetch("/api/newsletter/subscribers"),
        fetch("/api/leads"),
      ])

      const articles = await articlesRes.json()
      const subscribers = await subscribersRes.json()
      const leads = await leadsRes.json()

      setStats({
        articles: articles.data?.length || 0,
        subscribers: subscribers.data?.length || 0,
        leads: leads.data?.length || 0,
        views: Math.floor(Math.random() * 10000), // Mock data for now
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      localStorage.removeItem("authToken")
      router.push("/dashboard/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Gérez votre contenu et suivez vos performances</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Articles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.articles}</div>
              <p className="text-xs text-muted-foreground">Articles publiés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Abonnés</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.subscribers}</div>
              <p className="text-xs text-muted-foreground">Newsletter</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.leads}</div>
              <p className="text-xs text-muted-foreground">Lead magnet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vues</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.views}</div>
              <p className="text-xs text-muted-foreground">Ce mois</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Gestion des Articles
              </CardTitle>
              <CardDescription>
                Gérez vos articles existants, modifiez le contenu et suivez les performances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/articles">
                <Button className="w-full">Voir les articles</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Créer un Article
              </CardTitle>
              <CardDescription>
                Rédigez un nouvel article avec l'aide de l'IA pour générer du contenu optimisé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/create-article">
                <Button className="w-full">Créer un article</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Newsletter & Leads
              </CardTitle>
              <CardDescription>Consultez vos abonnés newsletter et les leads générés par votre contenu</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/subscribers">
                <Button className="w-full bg-transparent" variant="outline">
                  Voir les abonnés
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

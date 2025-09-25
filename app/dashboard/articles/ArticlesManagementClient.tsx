"use client"

import { useAuth } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Search, Edit, Trash2, Plus, FileText, AlertCircle, Eye, Clock } from "lucide-react"

interface Article {
  id: string
  title: string
  slug: string
  status: "published" | "draft"
  created_at: string
  updated_at: string
  category: {
    name: string
  }
  reading_time?: number
  view_count?: number
}

export default function ArticlesManagementClient() {
  const { fetchWithAuth, isAuthenticated } = useAuth()
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; article: Article | null }>({
    show: false,
    article: null,
  })
  const [message, setMessage] = useState({ type: "", text: "" })

  const articlesPerPage = 10
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      fetchArticles()
    }
  }, [isAuthenticated])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await fetchWithAuth("/api/dashboard/articles")

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des articles")
      }

      const data = await response.json()
      setArticles(data.articles || [])
      setFilteredArticles(data.articles || [])
    } catch (error) {
      console.error("Error fetching articles:", error)
      // Mock data for development
      const mockArticles: Article[] = [
        {
          id: "1",
          title: "Comment l'IA transforme les PME en 2024",
          slug: "ia-transforme-pme-2024",
          status: "published",
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-15T10:00:00Z",
          category: { name: "Intelligence Artificielle" },
          reading_time: 8,
          view_count: 1250,
        },
        {
          id: "2",
          title: "Guide complet de l'automatisation pour PME",
          slug: "guide-automatisation-pme",
          status: "draft",
          created_at: "2024-01-14T15:30:00Z",
          updated_at: "2024-01-14T15:30:00Z",
          category: { name: "Automatisation" },
          reading_time: 12,
          view_count: 0,
        },
        {
          id: "3",
          title: "Top 10 des outils IA pour entrepreneurs",
          slug: "top-10-outils-ia-entrepreneurs",
          status: "published",
          created_at: "2024-01-13T09:15:00Z",
          updated_at: "2024-01-13T09:15:00Z",
          category: { name: "Outils IA" },
          reading_time: 6,
          view_count: 890,
        },
      ]
      setArticles(mockArticles)
      setFilteredArticles(mockArticles)
    } finally {
      setLoading(false)
    }
  }

  // Search functionality
  useEffect(() => {
    const filtered = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredArticles(filtered)
    setCurrentPage(1)
  }, [searchTerm, articles])

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage)
  const startIndex = (currentPage - 1) * articlesPerPage
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage)

  const handleEdit = (slug: string) => {
    router.push(`/dashboard/edit-article?slug=${slug}`)
  }

  const handleView = (slug: string) => {
    window.open(`/blog/${slug}`, "_blank")
  }

  const handleDelete = async (article: Article) => {
    try {
      const response = await fetchWithAuth(`/api/dashboard/articles/${article.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression")
      }

      // Remove from local state
      setArticles((prev) => prev.filter((a) => a.id !== article.id))
      setMessage({ type: "success", text: "Article supprimé avec succès" })
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Erreur de suppression",
      })
    } finally {
      setDeleteModal({ show: false, article: null })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const publishedCount = articles.filter((a) => a.status === "published").length
  const draftCount = articles.filter((a) => a.status === "draft").length
  const totalViews = articles.reduce((sum, article) => sum + (article.view_count || 0), 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Gestion des Articles</h1>
            <p className="text-gray-400 mt-1">
              {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} trouvé
              {filteredArticles.length !== 1 ? "s" : ""}
            </p>
          </div>

          <Button onClick={() => router.push("/dashboard/create-article")} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvel Article
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Articles publiés</p>
                  <p className="text-2xl font-bold text-green-400">{publishedCount}</p>
                </div>
                <FileText className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Brouillons</p>
                  <p className="text-2xl font-bold text-yellow-400">{draftCount}</p>
                </div>
                <Edit className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Vues totales</p>
                  <p className="text-2xl font-bold text-blue-400">{totalViews.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Search className="h-5 w-5" />
              Rechercher
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Rechercher par titre ou catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md bg-gray-700 border-gray-600 text-gray-200"
            />
          </CardContent>
        </Card>

        {message.text && (
          <Alert variant={message.type === "success" ? "default" : "destructive"}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5" />
              Articles
            </CardTitle>
            <CardDescription className="text-gray-400">
              Gérez vos articles existants, modifiez le contenu et suivez les performances
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Aucun article trouvé</h3>
                <p className="text-gray-400 mb-4">
                  {searchTerm
                    ? "Aucun article ne correspond à votre recherche."
                    : "Commencez par créer votre premier article."}
                </p>
                {!searchTerm && (
                  <Button onClick={() => router.push("/dashboard/create-article")}>Créer un article</Button>
                )}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Article</TableHead>
                      <TableHead className="text-gray-300">Statut</TableHead>
                      <TableHead className="text-gray-300">Catégorie</TableHead>
                      <TableHead className="text-gray-300">Lecture</TableHead>
                      <TableHead className="text-gray-300">Vues</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedArticles.map((article) => (
                      <TableRow key={article.id} className="border-gray-700">
                        <TableCell>
                          <div>
                            <div className="font-medium text-white">{article.title}</div>
                            <div className="text-sm text-gray-400">/{article.slug}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={article.status === "published" ? "default" : "secondary"}>
                            {article.status === "published" ? "Publié" : "Brouillon"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">{article.category.name}</TableCell>
                        <TableCell>
                          {article.reading_time && (
                            <div className="flex items-center gap-1 text-gray-400">
                              <Clock className="h-3 w-3" />
                              <span className="text-sm">{article.reading_time} min</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {article.view_count !== undefined && (
                            <div className="flex items-center gap-1 text-gray-400">
                              <Eye className="h-3 w-3" />
                              <span className="text-sm">{article.view_count.toLocaleString()}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-400">{formatDate(article.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {article.status === "published" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleView(article.slug)}
                                className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(article.slug)}
                              className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteModal({ show: true, article })}
                              className="bg-gray-700 border-gray-600 text-red-400 hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-400">
                      Affichage de {startIndex + 1} à {Math.min(startIndex + articlesPerPage, filteredArticles.length)}{" "}
                      sur {filteredArticles.length} articles
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                      >
                        Précédent
                      </Button>

                      <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">
                        {currentPage} / {totalPages}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Dialog open={deleteModal.show} onOpenChange={(open) => setDeleteModal({ show: open, article: null })}>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Confirmer la suppression</DialogTitle>
              <DialogDescription className="text-gray-400">
                Êtes-vous sûr de vouloir supprimer l'article "{deleteModal.article?.title}" ? Cette action est
                irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteModal({ show: false, article: null })}
                className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
              >
                Annuler
              </Button>
              <Button variant="destructive" onClick={() => deleteModal.article && handleDelete(deleteModal.article)}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

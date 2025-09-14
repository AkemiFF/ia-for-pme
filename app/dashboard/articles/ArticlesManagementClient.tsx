"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"

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
}

export default function ArticlesManagementClient() {
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

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/dashboard/login")
      return
    }

    fetchArticles(token)
  }, [router])

  const fetchArticles = async (token: string) => {
    try {
      const response = await fetch(`/api/dashboard/articles`, {
        headers: {
          Authorization: `Bearer ${token}`,
          // TODO: Add rate limiting headers for production
        },
      })

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
        },
        {
          id: "2",
          title: "Guide complet de l'automatisation pour PME",
          slug: "guide-automatisation-pme",
          status: "draft",
          created_at: "2024-01-14T15:30:00Z",
          updated_at: "2024-01-14T15:30:00Z",
          category: { name: "Automatisation" },
        },
        {
          id: "3",
          title: "Top 10 des outils IA pour entrepreneurs",
          slug: "top-10-outils-ia-entrepreneurs",
          status: "published",
          created_at: "2024-01-13T09:15:00Z",
          updated_at: "2024-01-13T09:15:00Z",
          category: { name: "Outils IA" },
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

  const handleDelete = async (article: Article) => {
    const token = localStorage.getItem("authToken")
    if (!token) return

    try {
      const response = await fetch(`/api/dashboard/articles/${article.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          // TODO: Add CSRF token for production security
        },
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto pt-20 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des articles...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto pt-20 px-4 pb-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Articles</h1>
                <p className="text-gray-600 mt-1">
                  {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} trouvé
                  {filteredArticles.length !== 1 ? "s" : ""}
                </p>
              </div>

              <button
                onClick={() => router.push("/dashboard/create-article")}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-colors"
              >
                Nouvel Article
              </button>
            </div>

            {/* Search */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Rechercher par titre ou catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {message.text && (
            <div
              className={`mx-6 mt-4 p-4 rounded-md ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{article.title}</div>
                        <div className="text-sm text-gray-500">/{article.slug}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          article.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {article.status === "published" ? "Publié" : "Brouillon"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{article.category.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(article.created_at)}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(article.slug)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => setDeleteModal({ show: true, article })}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "Aucun article ne correspond à votre recherche."
                  : "Commencez par créer votre premier article."}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => router.push("/dashboard/create-article")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Créer un article
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Affichage de {startIndex + 1} à {Math.min(startIndex + articlesPerPage, filteredArticles.length)} sur{" "}
                  {filteredArticles.length} articles
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Précédent
                  </button>

                  <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && deleteModal.article && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer l'article "{deleteModal.article.title}" ? Cette action est
              irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal({ show: false, article: null })}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteModal.article!)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

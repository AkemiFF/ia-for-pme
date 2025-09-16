"use client"

import MarkdownEditor from "@/components/dashboard/MarkdownEditor"
import Header from "@/components/Header"
import { isAuthenticated } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useState } from "react"

interface Category {
  id: string
  name: string
  slug: string
}

interface ArticleForm {
  title: string
  slug: string
  excerpt: string
  content: string
  category_id: string
  tags: string
  cover_image_url: string
  published: boolean
  affiliate_links: string
}

export default function CreateArticleClient() {
  const [form, setForm] = useState<ArticleForm>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category_id: "",
    tags: "",
    cover_image_url: "",
    published: false,
    affiliate_links: "",
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [aiKeywords, setAiKeywords] = useState("")
  const router = useRouter()

  // Auth guard


  useEffect(() => {
    const runAuth = async () => {
      await checkAuth()
    }
    runAuth()
  }, [])

  const checkAuth = async () => {
    const token = await isAuthenticated()

    if (!token) {
      router.push("/dashboard/login")
      return
    }
    fetchCategories("token")
    setLoading(false)
  }

  const fetchCategories = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        headers: {
          // Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      // Fallback categories for development
      setCategories([
        { id: "1", name: "Intelligence Artificielle", slug: "ia" },
        { id: "2", name: "Automatisation", slug: "automatisation" },
        { id: "3", name: "Outils IA", slug: "outils-ia" },
        { id: "4", name: "Stratégie", slug: "strategie" },
      ])
    }
  }

  // Auto-generate slug from title
  useEffect(() => {
    if (form.title) {
      const slug = form.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()

      setForm((prev) => ({ ...prev, slug }))
    }
  }, [form.title])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setForm((prev) => ({ ...prev, [name]: checked }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const generateWithAI = async () => {
    if (!form.title || !aiKeywords) {
      setMessage({ type: "error", text: "Veuillez remplir le titre et les mots-clés" })
      return
    }

    setAiLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/generate-article`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          keywords: aiKeywords,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la génération IA")
      }

      const data = await response.json()

      // Fill form with AI-generated content
      setForm((prev) => ({
        ...prev,
        excerpt: data.excerpt || "",
        content: data.content || "",
        tags: data.tags || aiKeywords,
        cover_image_url: data.cover_image_url || "",
      }))

      setMessage({ type: "success", text: "Contenu généré avec succès !" })
    } catch (error) {
      // Mock AI response for development
      setForm((prev) => ({
        ...prev,
        excerpt: `Découvrez comment ${form.title.toLowerCase()} peut transformer votre PME grâce à l'intelligence artificielle.`,
        content: `# ${form.title}\n\nL'intelligence artificielle révolutionne la façon dont les PME opèrent. Dans cet article, nous explorons les opportunités et défis.\n\n## Les avantages clés\n\n- Automatisation des tâches répétitives\n- Amélioration de la prise de décision\n- Optimisation des processus\n\n## Mise en œuvre pratique\n\nPour commencer votre transformation IA, suivez ces étapes essentielles...\n\n*Contenu généré par IA - À réviser et personnaliser*`,
        tags: aiKeywords,
        cover_image_url: "/ai-business-article.jpg",
      }))

      setMessage({ type: "success", text: "Contenu généré avec succès ! (Mode développement)" })
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    // Basic validation
    if (!form.title || !form.content || !form.category_id) {
      setMessage({ type: "error", text: "Veuillez remplir tous les champs obligatoires" })
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/dashboard/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          // TODO: Add CSRF token header for production
        },
        body: JSON.stringify({
          ...form,
          // SECURITY: Content should be sanitized on server-side
          // Consider using DOMPurify or similar for client-side preview
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'article")
      }

      const data = await response.json()
      setMessage({
        type: "success",
        text: `Article créé avec succès ! Slug: ${data.slug || form.slug}`,
      })

      // Reset form
      setForm({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category_id: "",
        tags: "",
        cover_image_url: "",
        published: false,
        affiliate_links: "",
      })
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Erreur inconnue",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto pt-20 px-4 pb-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer un Article</h1>
            <p className="text-gray-600">Rédigez et publiez un nouvel article pour votre blog IA PME & Freelances</p>
          </div>

          {/* AI Generation Section */}
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">🤖 Génération IA</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">Titre (requis pour IA)</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Ex: Comment l'IA transforme les freelances"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">Mots-clés</label>
                <input
                  type="text"
                  value={aiKeywords}
                  onChange={(e) => setAiKeywords(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="IA, freelance, PME, automatisation, productivité"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={generateWithAI}
              disabled={aiLoading || !form.title || !aiKeywords}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {aiLoading ? "Génération en cours..." : "Générer via IA"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={form.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (auto-généré)
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={form.slug}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Extrait
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                value={form.excerpt}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Résumé de l'article (150-160 caractères pour SEO)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contenu (Markdown) *</label>
              <MarkdownEditor
                value={form.content}
                onChange={(content) => setForm((prev) => ({ ...prev, content }))}
                placeholder="# Titre de l'article

Votre contenu en Markdown...

## Section principale

Utilisez les outils de la barre d'outils pour formater votre contenu :
- **Gras** et *italique*
- [Liens](https://example.com)
- ![Images](https://example.com/image.jpg)
- `Code` et blocs de code
- > Citations
- Listes et tableaux

> 💡 **Conseil** : Utilisez les raccourcis clavier pour une édition plus rapide !"
              />
              <p className="text-xs text-gray-500 mt-2">
                Utilisez l'éditeur avancé avec aperçu en temps réel. Le contenu sera sanitisé côté serveur.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  required
                  value={form.category_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={form.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="IA, PME, automatisation"
                />
              </div>
            </div>

            <div>
              <label htmlFor="cover_image_url" className="block text-sm font-medium text-gray-700 mb-2">
                URL de l'image de couverture
              </label>
              <input
                type="url"
                id="cover_image_url"
                name="cover_image_url"
                value={form.cover_image_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label htmlFor="affiliate_links" className="block text-sm font-medium text-gray-700 mb-2">
                Liens d'affiliation (JSON)
              </label>
              <textarea
                id="affiliate_links"
                name="affiliate_links"
                rows={4}
                value={form.affiliate_links}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-sm"
                placeholder='[{"name": "Outil IA", "url": "https://...", "description": "..."}]'
              />
              <p className="text-xs text-gray-500 mt-1">Format JSON pour les outils recommandés dans l'article</p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={form.published}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                Publier immédiatement
              </label>
            </div>

            {message.text && (
              <div
                className={`p-4 rounded-md ${message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
                  }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Création..." : "Créer l'article"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard/articles")}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition-colors"
              >
                Retour à la liste
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

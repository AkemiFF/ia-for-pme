"use client"

import type React from "react"
import SectionEditor from "@/components/dashboard/SectionEditor"
import type { ArticleSection } from "@/types/sections"

import { useAuth } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import MarkdownEditor from "@/components/dashboard/MarkdownEditor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Bot, FileText, Save, ArrowLeft, AlertCircle, Sparkles } from "lucide-react"

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
  sections: ArticleSection[]
}

export default function CreateArticleClient() {
  const { fetchWithAuth, isAuthenticated } = useAuth()
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
    sections: [],
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [aiKeywords, setAiKeywords] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories()
    }
  }, [isAuthenticated])

  const fetchCategories = async () => {
    try {
      const response = await fetchWithAuth("/api/categories")

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

  const handleInputChange = (name: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const generateWithAI = async () => {
    if (!form.title || !aiKeywords) {
      setMessage({ type: "error", text: "Veuillez remplir le titre et les mots-clés" })
      return
    }

    setAiLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const response = await fetchWithAuth("/api/ai/generate-article", {
        method: "POST",
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
    if (!form.title || (!form.content && form.sections.length === 0) || !form.category_id) {
      setMessage({ type: "error", text: "Veuillez remplir tous les champs obligatoires" })
      setLoading(false)
      return
    }

    try {
      const response = await fetchWithAuth("/api/dashboard/articles", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          sections: form.sections,
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
        sections: [],
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
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Créer un Article</h1>
          <p className="text-gray-600 mt-2">Rédigez et publiez un nouvel article pour votre blog IA PME & Freelances</p>
        </div>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Bot className="h-5 w-5" />
              Génération IA
            </CardTitle>
            <CardDescription className="text-blue-700">
              Utilisez l'IA pour générer automatiquement le contenu de votre article
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ai-title" className="text-blue-800">
                  Titre (requis pour IA)
                </Label>
                <Input
                  id="ai-title"
                  value={form.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Ex: Comment l'IA transforme les freelances"
                  className="border-blue-300 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ai-keywords" className="text-blue-800">
                  Mots-clés
                </Label>
                <Input
                  id="ai-keywords"
                  value={aiKeywords}
                  onChange={(e) => setAiKeywords(e.target.value)}
                  placeholder="IA, freelance, PME, automatisation, productivité"
                  className="border-blue-300 focus:border-blue-500"
                />
              </div>
            </div>
            <Button
              type="button"
              onClick={generateWithAI}
              disabled={aiLoading || !form.title || !aiKeywords}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {aiLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Générer via IA
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Détails de l'article
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    required
                    value={form.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (auto-généré)</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Extrait</Label>
                <Textarea
                  id="excerpt"
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) => handleInputChange("excerpt", e.target.value)}
                  placeholder="Résumé de l'article (150-160 caractères pour SEO)"
                />
              </div>

              <div className="space-y-2">
                <Label>Sections de l'article</Label>
                <SectionEditor
                  sections={form.sections}
                  onSectionsChange={(sections) => setForm((prev) => ({ ...prev, sections }))}
                />
                <p className="text-xs text-gray-500">
                  Organisez votre contenu en sections structurées. Le contenu Markdown classique reste disponible en
                  complément.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Contenu (Markdown) - Optionnel si sections utilisées</Label>
                <MarkdownEditor
                  value={form.content}
                  onChange={(content) => handleInputChange("content", content)}
                  placeholder="# Titre de l'article\n\nVotre contenu en Markdown..."
                />
                <p className="text-xs text-gray-500">
                  Utilisez l'éditeur avancé avec aperçu en temps réel. Le contenu sera sanitisé côté serveur.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select value={form.category_id} onValueChange={(value) => handleInputChange("category_id", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                  <Input
                    id="tags"
                    value={form.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    placeholder="IA, PME, automatisation"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover_image_url">URL de l'image de couverture</Label>
                <Input
                  id="cover_image_url"
                  type="url"
                  value={form.cover_image_url}
                  onChange={(e) => handleInputChange("cover_image_url", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="affiliate_links">Liens d'affiliation (JSON)</Label>
                <Textarea
                  id="affiliate_links"
                  rows={4}
                  value={form.affiliate_links}
                  onChange={(e) => handleInputChange("affiliate_links", e.target.value)}
                  className="font-mono text-sm"
                  placeholder='[{"name": "Outil IA", "url": "https://...", "description": "..."}]'
                />
                <p className="text-xs text-gray-500">Format JSON pour les outils recommandés dans l'article</p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={form.published}
                  onCheckedChange={(checked) => handleInputChange("published", !!checked)}
                />
                <Label htmlFor="published">Publier immédiatement</Label>
              </div>

              {message.text && (
                <Alert variant={message.type === "success" ? "default" : "destructive"}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex items-center gap-2">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Création...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Créer l'article
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/articles")}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour à la liste
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

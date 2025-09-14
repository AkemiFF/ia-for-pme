"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { fetchArticles } from "@/lib/api/articles"

async function LatestArticles() {
  try {
    const { articles } = await fetchArticles({ limit: 6, page: 1 })

    // Fonction pour estimer le temps de lecture (approximation basée sur le nombre de mots)
    const estimateReadTime = (excerpt: string) => {
      const wordsPerMinute = 200
      const wordCount = excerpt.split(" ").length * 4 // Estimation basée sur l'excerpt
      return Math.ceil(wordCount / wordsPerMinute)
    }

    // Fonction pour formater la date
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }

    return (
      <section className="mb-16">
        <div className="text-center mb-12">
          <div className="inline-block">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Derniers Articles
            </h2>
            <div className="h-1 w-24 article-gradient rounded-full mx-auto"></div>
          </div>
          <p className="text-muted text-lg mt-4 max-w-2xl mx-auto">
            Découvrez nos derniers conseils et stratégies pour transformer votre PME avec l'intelligence artificielle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles && articles.length > 0 ? (
            articles.map((article, index) => (
              <div key={article.id}>
                {/* Inline Ad après le 3ème article */}
                {index === 3 && (
                  <div className="ad-slot ad-inline mb-8 col-span-full" id="ad-inline-1">
                    <div className="bg-card p-6 text-center text-muted rounded-xl border border-border">
                      [Espace publicitaire Inline - 728x90]
                    </div>
                  </div>
                )}

                <Card className="article-card group h-full bg-white border-border hover:border-primary/20 overflow-hidden">
                  <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="article-category-badge text-white text-xs font-semibold px-3 py-1 rounded-full">
                        IA & Business
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm text-primary text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {article.read_time || estimateReadTime(article.excerpt)} min
                      </div>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      <Link href={`/articles/${article.slug}`} className="text-balance">
                        {article.title}
                      </Link>
                    </CardTitle>

                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {(article.author?.name || "IA").charAt(0)}
                      </div>
                      <div className="text-sm text-muted">
                        <div className="font-medium">{article.author?.name || "IA pour PME"}</div>
                        <div className="text-xs">{formatDate(article.published_at)}</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <CardDescription className="text-card-foreground leading-relaxed line-clamp-3 mb-4">
                      {article.excerpt}
                    </CardDescription>

                    <Link
                      href={`/articles/${article.slug}`}
                      className="inline-flex items-center gap-2 text-primary hover:text-secondary font-semibold text-sm group-hover:gap-3 transition-all duration-300"
                    >
                      Lire l'article
                      <svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-muted text-lg">Aucun article disponible pour le moment.</p>
              <p className="text-muted text-sm mt-2">Revenez bientôt pour découvrir nos derniers conseils IA !</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link href="/articles">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-0 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Découvrir tous nos articles
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
          </Link>
        </div>
      </section>
    )
  } catch (error) {
    console.error("Erreur lors du chargement des articles:", error)
    return (
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Derniers Articles
          </h2>
          <div className="h-1 w-24 article-gradient rounded-full mx-auto"></div>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-muted text-lg">Erreur lors du chargement des articles.</p>
          <p className="text-muted text-sm mt-2">Veuillez réessayer plus tard ou contactez notre support.</p>
        </div>
      </section>
    )
  }
}

function NewsletterForm() {
  const [email, setEmail] = useState("")

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Intégrer MailerLite API ici
    console.log("Email soumis:", email)
    alert("Merci pour votre inscription ! (TODO: intégrer MailerLite)")
    setEmail("")
  }

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="text-gray-800">Newsletter IA PME & Freelances</CardTitle>
        <CardDescription className="text-gray-600">
          Recevez chaque semaine nos meilleurs conseils pour automatiser votre activité freelance ou PME.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleNewsletterSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
          />
          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0">
            S'abonner gratuitement
          </Button>
        </form>
        <p className="text-xs text-gray-500 mt-2">Pas de spam. Désabonnement en 1 clic.</p>
      </CardContent>
    </Card>
  )
}

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Hero Section */}
            <section className="mb-12">
              {/* TODO: Remplacer par une vraie image hero optimisée */}
              <div className="ad-slot mb-6" data-ad="ad-hero">
                <div className="bg-gray-50 p-4 text-center text-gray-500 rounded-lg border border-gray-200">
                  [Espace publicitaire Hero Banner - 728x90]
                </div>
              </div>

              <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                {/* TODO: Ajouter une vraie image d'arrière-plan optimisée pour le SEO */}
                <div className="absolute inset-0 bg-black/20"></div>
                <img
                  src="/modern-office-with-ai-technology--business-people-.jpg"
                  alt="Intelligence artificielle pour PME et freelances - Transformation digitale"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                />
                <div className="relative px-8 py-16 text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4">
                    Transformez votre PME ou activité freelance avec l'IA
                  </h1>
                  <p className="text-xl text-blue-100 text-pretty max-w-3xl mx-auto mb-8">
                    Découvrez comment automatiser vos processus, optimiser votre productivité et faire croître votre
                    business grâce aux outils d'IA accessibles et pratiques pour PME et freelances.
                  </p>
                  <Link href="/lead-magnet">
                    <Button size="lg" className="text-lg px-8 py-3 bg-green-600 hover:bg-green-700 text-white border-0">
                      Télécharger le Guide Gratuit
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Avantages Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <span className="text-2xl">⚡</span>
                      Automatisation Simple
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      Automatisez vos tâches répétitives sans compétences techniques. Gagnez 10h par semaine dès le
                      premier mois, que vous soyez freelance ou PME.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <span className="text-2xl">📈</span>
                      Croissance Accélérée
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      Optimisez votre prospection et votre marketing avec des outils d'IA qui s'adaptent à votre budget
                      freelance ou PME.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <span className="text-2xl">💰</span>
                      ROI Immédiat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      Solutions rentables dès le premier mois. Réduisez vos coûts opérationnels et augmentez votre
                      productivité de 30% en moyenne.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </section>

            <LatestArticles />

            {/* Comment ça marche */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Comment ça marche</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Évaluez vos besoins</h3>
                  <p className="text-gray-600">
                    Identifiez les processus de votre activité freelance ou PME qui peuvent être automatisés pour un
                    impact maximum.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Choisissez vos outils</h3>
                  <p className="text-gray-600">
                    Sélectionnez les solutions d'IA adaptées à votre budget freelance ou PME et vos objectifs business.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Implémentez et optimisez</h3>
                  <p className="text-gray-600">
                    Déployez progressivement et mesurez les résultats pour maximiser votre retour sur investissement.
                  </p>
                </div>
              </div>
            </section>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <NewsletterForm />

              {/* TODO: Ajouter d'autres widgets sidebar si nécessaire */}
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-gray-800">Ressources Populaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link
                    href="/lead-magnet"
                    className="block text-sm hover:text-blue-600 transition-colors text-gray-600"
                  >
                    → Guide gratuit IA pour PME & Freelances
                  </Link>
                  <Link
                    href="/categories/automatisation"
                    className="block text-sm hover:text-blue-600 transition-colors text-gray-600"
                  >
                    → Outils d'automatisation
                  </Link>
                  <Link
                    href="/categories/marketing-ia"
                    className="block text-sm hover:text-blue-600 transition-colors text-gray-600"
                  >
                    → Marketing avec l'IA
                  </Link>
                  <Link
                    href="/categories/freelance-ia"
                    className="block text-sm hover:text-blue-600 transition-colors text-gray-600"
                  >
                    → IA pour freelances
                  </Link>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

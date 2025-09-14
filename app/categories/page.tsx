import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "Catégories IA pour PME | Guides et Ressources",
  description:
    "Découvrez nos catégories d'articles sur l'IA pour PME : automatisation, outils, stratégies et conseils pratiques pour transformer votre entreprise.",
  openGraph: {
    title: "Catégories IA pour PME | Guides et Ressources",
    description:
      "Découvrez nos catégories d'articles sur l'IA pour PME : automatisation, outils, stratégies et conseils pratiques pour transformer votre entreprise.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/categories`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/categories`,
  },
}

// Mock data - TODO: Replace with real API call
const mockCategories = [
  {
    id: 1,
    name: "Automatisation des Processus",
    slug: "automatisation-processus",
    description: "Découvrez comment automatiser vos tâches répétitives et gagner en productivité avec l'IA.",
    articleCount: 12,
    color: "bg-blue-100 text-blue-800",
    icon: "🤖",
  },
  {
    id: 2,
    name: "Outils IA pour PME",
    slug: "outils-ia-pme",
    description: "Les meilleurs outils d'intelligence artificielle adaptés aux petites et moyennes entreprises.",
    articleCount: 8,
    color: "bg-green-100 text-green-800",
    icon: "🛠️",
  },
  {
    id: 3,
    name: "Stratégie Digitale",
    slug: "strategie-digitale",
    description: "Élaborez votre stratégie de transformation digitale avec l'IA comme levier de croissance.",
    articleCount: 15,
    color: "bg-purple-100 text-purple-800",
    icon: "📈",
  },
  {
    id: 4,
    name: "Marketing IA",
    slug: "marketing-ia",
    description: "Révolutionnez votre marketing avec les outils d'IA : personnalisation, analyse prédictive et plus.",
    articleCount: 10,
    color: "bg-orange-100 text-orange-800",
    icon: "🎯",
  },
  {
    id: 5,
    name: "Gestion des Données",
    slug: "gestion-donnees",
    description: "Optimisez la collecte, l'analyse et l'utilisation de vos données d'entreprise avec l'IA.",
    articleCount: 6,
    color: "bg-indigo-100 text-indigo-800",
    icon: "📊",
  },
  {
    id: 6,
    name: "Formation & Adoption",
    slug: "formation-adoption",
    description: "Guides pour former vos équipes et réussir l'adoption de l'IA dans votre organisation.",
    articleCount: 9,
    color: "bg-teal-100 text-teal-800",
    icon: "🎓",
  },
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Header */}
      <header className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Catégories d'Articles IA</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explorez nos guides spécialisés pour intégrer l'intelligence artificielle dans votre PME et transformer
              votre façon de travailler.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Ad Placeholder */}
        <div className="mb-12">
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500 font-medium">[AD PLACEHOLDER - 728x90 Leaderboard]</p>
            <p className="text-sm text-gray-400 mt-2">TODO: Intégrer bannière publicitaire responsive</p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{category.icon}</div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                    {category.articleCount} articles
                  </span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">{category.description}</p>

                <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                  <span>Voir les articles</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Besoin d'aide pour choisir ?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Notre équipe d'experts peut vous aider à identifier les meilleures opportunités d'IA pour votre entreprise.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Demander un audit gratuit
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

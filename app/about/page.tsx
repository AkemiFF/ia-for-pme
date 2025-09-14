import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/Header"

// Métadonnées SEO pour la page À propos
export const metadata: Metadata = {
  title: "À propos - IA pour PME | Notre mission et expertise",
  description:
    "Découvrez notre mission : démocratiser l'intelligence artificielle pour les PME françaises. Expertise, valeurs et partenaires de confiance.",
  openGraph: {
    title: "À propos - IA pour PME | Notre mission et expertise",
    description:
      "Découvrez notre mission : démocratiser l'intelligence artificielle pour les PME françaises. Expertise, valeurs et partenaires de confiance.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
    siteName: "IA pour PME",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "À propos - IA pour PME | Notre mission et expertise",
    description:
      "Découvrez notre mission : démocratiser l'intelligence artificielle pour les PME françaises. Expertise, valeurs et partenaires de confiance.",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 text-balance">À propos d'IA pour PME</h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Notre mission est de démocratiser l'intelligence artificielle pour les petites et moyennes entreprises
                françaises. Nous croyons que chaque PME mérite d'accéder aux outils IA les plus performants pour
                optimiser sa croissance, automatiser ses processus et rester compétitive dans un monde en constante
                évolution technologique.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Histoire de l'entreprise */}
        <section className="mb-16" aria-labelledby="histoire-heading">
          <h2 id="histoire-heading" className="text-2xl font-bold text-gray-900 mb-8">
            Notre histoire
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
            <p>
              Fondée en 2023 par une équipe d'experts en intelligence artificielle et en transformation digitale, IA
              pour PME est née d'un constat simple : les grandes entreprises monopolisent les bénéfices de l'IA tandis
              que les PME restent à la traîne, souvent par manque de ressources ou de connaissances techniques.
            </p>
            <p>
              Après avoir accompagné des dizaines d'entreprises dans leur transformation numérique, nous avons décidé de
              créer une plateforme dédiée aux PME. Notre objectif : rendre l'IA accessible, compréhensible et rentable
              pour tous les entrepreneurs, quel que soit leur niveau technique.
            </p>
            <p>
              Aujourd'hui, nous accompagnons plus de 500 PME françaises dans leur adoption de l'intelligence
              artificielle, avec des résultats concrets : +35% de productivité moyenne, -50% de temps passé sur les
              tâches répétitives, et +25% de chiffre d'affaires en moyenne après 6 mois d'implémentation.
            </p>
          </div>
        </section>

        {/* Nos valeurs */}
        <section className="mb-16" aria-labelledby="valeurs-heading">
          <h2 id="valeurs-heading" className="text-2xl font-bold text-gray-900 mb-8">
            Nos valeurs
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">Accessibilité</h3>
              </div>
              <p className="text-gray-600">
                Rendre l'IA compréhensible et utilisable par tous, sans jargon technique ni barrières financières.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🤝</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">Transparence</h3>
              </div>
              <p className="text-gray-600">
                Partager nos connaissances ouvertement et recommander uniquement les outils que nous utilisons
                nous-mêmes.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">Pragmatisme</h3>
              </div>
              <p className="text-gray-600">
                Privilégier les solutions concrètes et mesurables plutôt que les effets de mode technologiques.
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🚀</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">Innovation</h3>
              </div>
              <p className="text-gray-600">
                Rester à la pointe des dernières avancées IA pour offrir les meilleures opportunités à nos clients.
              </p>
            </div>
          </div>
        </section>

        {/* Section Partenaires */}
        <section className="mb-16" aria-labelledby="partenaires-heading">
          <h2 id="partenaires-heading" className="text-2xl font-bold text-gray-900 mb-8">
            Nos partenaires de confiance
          </h2>
          <div className="bg-gray-50 rounded-lg p-8">
            <p className="text-gray-600 mb-8 text-center">
              Nous collaborons avec les leaders mondiaux de l'intelligence artificielle pour vous offrir les meilleures
              solutions du marché.
            </p>

            {/* Grille de logos partenaires */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
              {/* TODO: Remplacer par les vrais logos des partenaires */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full h-20 flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=40&width=120"
                  alt="OpenAI - Partenaire IA"
                  width={120}
                  height={40}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full h-20 flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=40&width=120"
                  alt="Microsoft - Partenaire technologique"
                  width={120}
                  height={40}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full h-20 flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=40&width=120"
                  alt="Google Cloud - Infrastructure IA"
                  width={120}
                  height={40}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full h-20 flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=40&width=120"
                  alt="Anthropic - IA conversationnelle"
                  width={120}
                  height={40}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                {/* TODO: Lier cette section à l'admin pour gérer dynamiquement les partenaires */}* Logos et
                partenariats mis à jour régulièrement selon nos collaborations actives
              </p>
            </div>
          </div>
        </section>

        {/* Section Témoignages (placeholder) */}
        <section className="mb-16" aria-labelledby="temoignages-heading">
          <h2 id="temoignages-heading" className="text-2xl font-bold text-gray-900 mb-8">
            Ce que disent nos clients
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">📝 Section témoignages à venir</p>
            <p className="text-sm text-gray-500">
              {/* TODO: Intégrer système de témoignages dans l'admin */}
              Cette section affichera les retours clients une fois le système de témoignages configuré dans
              l'administration. Prévoir : nom, entreprise, photo, citation, note/5 étoiles.
            </p>
          </div>
        </section>

        {/* CTA Audit gratuit */}
        <section className="text-center" aria-labelledby="cta-heading">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
            <h2 id="cta-heading" className="text-2xl font-bold mb-4">
              Prêt à transformer votre PME avec l'IA ?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Obtenez un audit personnalisé de vos processus et découvrez comment l'IA peut optimiser votre entreprise.
              Consultation gratuite de 30 minutes avec nos experts.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors"
              aria-label="Demander un audit IA gratuit - Redirection vers la page contact"
            >
              <span>Demander un audit IA gratuit</span>
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

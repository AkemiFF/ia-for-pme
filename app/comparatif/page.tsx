import type { Metadata } from "next"
import Header from "@/components/Header"
import { AdSlots } from "@/components/AdSlots"
import { ExternalLink, Check } from "lucide-react"

export const metadata: Metadata = {
  title: "Comparatif des Meilleurs Outils IA pour PME 2024 | IA pour PME",
  description:
    "Découvrez notre comparatif détaillé des outils d'intelligence artificielle les plus performants pour les PME. Prix, fonctionnalités et recommandations d'experts.",
  keywords:
    "comparatif outils IA, intelligence artificielle PME, logiciels IA entreprise, ChatGPT business, outils automatisation",
  openGraph: {
    title: "Comparatif des Meilleurs Outils IA pour PME 2024",
    description: "Guide complet pour choisir les bons outils IA pour votre entreprise",
    type: "article",
  },
}

// Mock data - Replace with getStaticProps() fetch from ${process.env.NEXT_PUBLIC_API_URL}/affiliates
const aiTools = [
  {
    id: 1,
    name: "ChatGPT Business",
    price_range: "20€/mois",
    features: ["Génération de contenu", "Support client automatisé", "Analyse de données"],
    advantage: "Interface intuitive et polyvalente",
    affiliate_link: "https://openai.com/chatgpt/pricing",
    rating: 4.8,
    best_for: "Polyvalence et facilité d'usage",
  },
  {
    id: 2,
    name: "Jasper AI",
    price_range: "49€/mois",
    features: ["Marketing content", "SEO optimization", "Brand voice"],
    advantage: "Spécialisé dans le marketing",
    affiliate_link: "https://jasper.ai/pricing",
    rating: 4.6,
    best_for: "Marketing et création de contenu",
  },
  {
    id: 3,
    name: "Copy.ai",
    price_range: "36€/mois",
    features: ["Copywriting", "Email campaigns", "Social media"],
    advantage: "Templates prêts à l'emploi",
    affiliate_link: "https://copy.ai/pricing",
    rating: 4.4,
    best_for: "Copywriting et campagnes",
  },
  {
    id: 4,
    name: "Notion AI",
    price_range: "8€/mois",
    features: ["Organisation", "Rédaction", "Résumés automatiques"],
    advantage: "Intégration workspace complète",
    affiliate_link: "https://notion.so/pricing",
    rating: 4.5,
    best_for: "Organisation et productivité",
  },
  {
    id: 5,
    name: "Zapier AI",
    price_range: "19€/mois",
    features: ["Automatisation", "Intégrations", "Workflows"],
    advantage: "Connecte tous vos outils",
    affiliate_link: "https://zapier.com/pricing",
    rating: 4.7,
    best_for: "Automatisation des processus",
  },
]

export default function ComparatifPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-balance">
            Comparatif des Meilleurs Outils IA pour PME
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Découvrez les solutions d'intelligence artificielle les plus performantes pour transformer votre entreprise.
            Comparaison détaillée, prix transparents et recommandations d'experts.
          </p>
        </div>

        {/* Ad Placeholder */}
        <div className="flex justify-center mb-12">
          <AdSlots type="hero" id="comparatif-hero" />
        </div>

        {/* Buying Guide */}
        <div className="bg-blue-50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Guide d'Achat : Comment Choisir le Bon Outil IA</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">🎯 Définissez vos besoins</h3>
              <p className="text-sm">
                Identifiez les tâches à automatiser : rédaction, service client, analyse de données, ou marketing.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">💰 Évaluez le ROI</h3>
              <p className="text-sm">
                Calculez le temps économisé et la valeur générée par rapport au coût de l'abonnement.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🔗 Vérifiez les intégrations</h3>
              <p className="text-sm">
                Assurez-vous que l'outil se connecte à vos logiciels existants (CRM, email, etc.).
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">📈 Testez avant d'acheter</h3>
              <p className="text-sm">Profitez des essais gratuits pour valider l'adéquation avec vos processus.</p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Outil</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Prix</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fonctionnalités Clés</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Avantage Principal</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Idéal Pour</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {aiTools.map((tool, index) => (
                  <tr key={tool.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{tool.name}</div>
                          <div className="flex items-center mt-1">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={i < Math.floor(tool.rating) ? "text-yellow-400" : "text-gray-300"}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="ml-2 text-xs text-gray-500">{tool.rating}/5</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-blue-600">{tool.price_range}</span>
                    </td>
                    <td className="px-6 py-4">
                      <ul className="text-sm text-gray-600 space-y-1">
                        {tool.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{tool.advantage}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{tool.best_for}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <a
                        href={tool.affiliate_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Essayer
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inline Ad */}
        <div className="flex justify-center mb-12">
          <AdSlots type="inline" id="comparatif-inline" />
        </div>

        {/* Affiliate Disclosure */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">Transparence sur l'Affiliation</h3>
          <p className="text-sm text-yellow-700">
            Cette page contient des liens d'affiliation. Si vous achetez un produit via ces liens, nous pouvons recevoir
            une commission sans coût supplémentaire pour vous. Cela nous aide à maintenir ce contenu gratuit et à jour.
            Nos recommandations restent objectives et basées sur nos tests approfondis.
          </p>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Besoin d'Aide pour Choisir ?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Notre équipe d'experts peut vous accompagner dans le choix et l'implémentation des outils IA les plus
            adaptés à votre entreprise.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Consultation Gratuite
          </a>
        </div>
      </main>
    </div>
  )
}

/* 
TODO: Implementation Notes
- Replace mock data with getStaticProps() fetch from ${process.env.NEXT_PUBLIC_API_URL}/affiliates
- Add proper affiliate tracking parameters to links
- Implement click tracking for affiliate conversions
- Add structured data markup for better SEO
- Consider adding filtering/sorting functionality
- Add loading states for dynamic content
*/

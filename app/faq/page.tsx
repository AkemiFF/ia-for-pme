import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { AdSlots } from "@/components/AdSlots"
import { MessageCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "FAQ - Questions Fréquentes sur l'IA pour PME | IA pour PME",
  description:
    "Trouvez les réponses à toutes vos questions sur l'intelligence artificielle pour les PME. Guide complet technique, légal et commercial.",
  keywords:
    "FAQ IA PME, questions intelligence artificielle, aide IA entreprise, support technique IA, guide IA business",
  openGraph: {
    title: "FAQ - Questions Fréquentes sur l'IA pour PME",
    description: "Toutes les réponses à vos questions sur l'IA pour les entreprises",
    type: "article",
  },
}

const faqData = [
  // Questions Techniques
  {
    category: "Technique",
    priority: "high",
    question: "Comment intégrer l'IA dans mon système informatique existant ?",
    answer:
      "L'intégration de l'IA peut se faire progressivement via des APIs, des plugins ou des solutions SaaS. Nous recommandons de commencer par des outils cloud comme ChatGPT Business ou Zapier AI qui s'intègrent facilement via des connecteurs. Pour des besoins spécifiques, des solutions sur mesure peuvent être développées avec des APIs REST standard.",
  },
  {
    category: "Technique",
    priority: "medium",
    question: "Mes données sont-elles sécurisées avec les outils IA ?",
    answer:
      "La sécurité dépend du fournisseur choisi. Les solutions enterprise comme ChatGPT Business, Claude Pro ou Azure OpenAI offrent des garanties de confidentialité avec chiffrement end-to-end et conformité RGPD. Évitez les versions gratuites pour des données sensibles et privilégiez les solutions avec hébergement européen.",
  },
  {
    category: "Technique",
    priority: "medium",
    question: "Quelle bande passante est nécessaire pour utiliser l'IA ?",
    answer:
      "La plupart des outils IA cloud nécessitent une connexion internet stable de 10 Mbps minimum. Pour des usages intensifs (génération d'images, vidéos), 50 Mbps sont recommandés. Les solutions on-premise nécessitent des serveurs dédiés avec GPU pour les modèles avancés.",
  },

  // Questions Légales
  {
    category: "Légal",
    priority: "high",
    question: "L'IA est-elle conforme au RGPD ?",
    answer:
      "L'utilisation d'IA doit respecter le RGPD. Choisissez des fournisseurs conformes (hébergement UE, DPA signés), informez vos clients de l'usage d'IA, obtenez les consentements nécessaires et documentez vos traitements. Les outils comme Notion AI ou Jasper AI offrent des garanties RGPD.",
  },
  {
    category: "Légal",
    priority: "high",
    question: "Qui est responsable des erreurs de l'IA ?",
    answer:
      "La responsabilité incombe généralement à l'entreprise utilisatrice. Il est crucial de valider les outputs IA, surtout pour des décisions importantes. Souscrivez une assurance cyber adaptée et établissez des processus de contrôle qualité. Documentez vos procédures de validation.",
  },
  {
    category: "Légal",
    priority: "medium",
    question: "Puis-je utiliser du contenu généré par IA commercialement ?",
    answer:
      "Généralement oui, mais vérifiez les conditions d'utilisation de chaque outil. ChatGPT Business, Jasper AI et Copy.ai accordent des droits commerciaux. Attention aux contenus basés sur des œuvres protégées. Ajoutez toujours une révision humaine et mentionnez l'usage d'IA si requis.",
  },

  // Questions Commerciales
  {
    category: "Commercial",
    priority: "high",
    question: "Quel est le ROI moyen de l'IA pour une PME ?",
    answer:
      "Les études montrent un ROI de 200-400% en moyenne sur 12-18 mois. Les gains principaux : réduction du temps de rédaction (60-80%), amélioration du service client (40% de tickets en moins), automatisation des tâches répétitives (50% de temps économisé). L'investissement initial se rentabilise généralement en 3-6 mois.",
  },
  {
    category: "Commercial",
    priority: "high",
    question: "Combien coûte l'implémentation de l'IA dans une PME ?",
    answer:
      "Pour débuter : 50-200€/mois pour des outils SaaS (ChatGPT Business, Jasper AI). Pour une implémentation complète : 2000-10000€ incluant formation, intégration et personnalisation. Les solutions sur mesure démarrent à 15000€. Nous recommandons de commencer petit et d'évoluer progressivement.",
  },
  {
    category: "Commercial",
    priority: "medium",
    question: "Quels sont les premiers outils IA à adopter ?",
    answer:
      "Commencez par : 1) ChatGPT Business pour la rédaction et l'assistance, 2) Zapier AI pour l'automatisation, 3) Notion AI pour l'organisation, 4) Un outil de service client IA comme Intercom. Ces outils couvrent 80% des besoins avec un apprentissage rapide et un impact immédiat.",
  },
  {
    category: "Commercial",
    priority: "medium",
    question: "Comment former mes équipes à l'IA ?",
    answer:
      'Adoptez une approche progressive : 1) Sensibilisation générale (2h), 2) Formation pratique sur les outils choisis (1 jour), 3) Accompagnement personnalisé (1 mois), 4) Suivi et optimisation. Désignez des "champions IA" dans chaque service. Nous proposons des formations sur mesure adaptées à votre secteur.',
  },
]

// Group FAQs by category and priority
const groupedFAQs = faqData.reduce(
  (acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = { high: [], medium: [], low: [] }
    }
    acc[faq.category][faq.priority as keyof (typeof acc)[string]].push(faq)
    return acc
  },
  {} as Record<string, Record<string, typeof faqData>>,
)

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-balance">
            Questions Fréquentes sur l'IA pour PME
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Trouvez rapidement les réponses à toutes vos questions sur l'intelligence artificielle pour les entreprises.
            Guide complet technique, légal et commercial.
          </p>
        </div>

        {/* Ad Placeholder */}
        <div className="flex justify-center mb-12">
          <AdSlots type="hero" id="faq-hero" />
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {Object.entries(groupedFAQs).map(([category, faqs]) => (
            <section key={category} className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <span
                  className={`w-3 h-3 rounded-full mr-3 ${
                    category === "Technique" ? "bg-blue-500" : category === "Légal" ? "bg-red-500" : "bg-green-500"
                  }`}
                ></span>
                Questions {category}s
              </h2>

              <div className="space-y-4">
                {/* High Priority Questions First */}
                {[...faqs.high, ...faqs.medium, ...faqs.low].map((faq, index) => (
                  <details
                    key={index}
                    className="group border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                      <div className="flex items-center space-x-2">
                        {faq.priority === "high" && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            Priorité
                          </span>
                        )}
                        <svg
                          className="w-5 h-5 text-gray-500 transform group-open:rotate-180 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </summary>
                    <div className="p-6 bg-white border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Inline Ad */}
        <div className="flex justify-center my-12">
          <AdSlots type="inline" id="faq-inline" />
        </div>

        {/* Contact Support CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white mt-12">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-blue-200" />
          <h2 className="text-2xl font-bold mb-4">Vous ne trouvez pas votre réponse ?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Notre équipe d'experts est là pour répondre à toutes vos questions spécifiques sur l'implémentation de l'IA
            dans votre entreprise.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Contacter le Support
          </a>
        </div>

        {/* Quick Navigation */}
        <div className="mt-12 bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation Rapide</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="#technique"
              className="flex items-center p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors"
            >
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
              <span className="text-gray-700">Questions Techniques</span>
            </a>
            <a href="#legal" className="flex items-center p-3 bg-white rounded-lg hover:bg-red-50 transition-colors">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
              <span className="text-gray-700">Questions Légales</span>
            </a>
            <a
              href="#commercial"
              className="flex items-center p-3 bg-white rounded-lg hover:bg-green-50 transition-colors"
            >
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              <span className="text-gray-700">Questions Commerciales</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

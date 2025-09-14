import NewsletterSignup from "@/components/newsletter/NewsletterSignup"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Newsletter IA pour PME & Freelances | Conseils Personnalisés",
  description:
    "Inscrivez-vous à notre newsletter IA personnalisée. Recevez des conseils adaptés à votre profil, outils gratuits et guides exclusifs pour optimiser votre activité avec l'intelligence artificielle.",
  keywords: "newsletter IA, conseils PME freelance, outils intelligence artificielle, guides IA gratuits",
}

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Newsletter IA Personnalisée</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Rejoignez plus de 2,800 professionnels qui reçoivent chaque semaine nos meilleurs conseils IA adaptés à leur
            activité.
          </p>
        </div>

        <NewsletterSignup showSegmentation={true} />

        {/* Testimonials */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Ce que disent nos abonnés</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                "Grâce à cette newsletter, j'ai découvert des outils IA qui m'ont fait gagner 5h par semaine sur mes
                projets clients."
              </p>
              <div className="flex items-center gap-3">
                <img src="/placeholder.svg?height=40&width=40" alt="Marie L." className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-medium">Marie L.</p>
                  <p className="text-sm text-gray-500">Graphiste freelance</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                "Les conseils sont toujours pratiques et directement applicables. J'ai automatisé 80% de mon service
                client."
              </p>
              <div className="flex items-center gap-3">
                <img src="/placeholder.svg?height=40&width=40" alt="Thomas R." className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-medium">Thomas R.</p>
                  <p className="text-sm text-gray-500">Dirigeant PME</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                "La segmentation par profil est parfaite. Je ne reçois que du contenu pertinent pour mon e-commerce."
              </p>
              <div className="flex items-center gap-3">
                <img src="/placeholder.svg?height=40&width=40" alt="Sophie M." className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-medium">Sophie M.</p>
                  <p className="text-sm text-gray-500">E-commerçante</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Questions fréquentes</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">À quelle fréquence recevrai-je des emails ?</h3>
              <p className="text-gray-600">
                Vous recevrez un email par semaine, généralement le mardi matin. Nous respectons votre boîte mail et ne
                spammons jamais.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Le contenu est-il vraiment personnalisé ?</h3>
              <p className="text-gray-600">
                Oui ! En fonction de votre profil (freelance, PME, e-commerce) et de vos centres d'intérêt, vous
                recevrez du contenu spécifiquement adapté à vos besoins.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Puis-je me désabonner facilement ?</h3>
              <p className="text-gray-600">
                Absolument. Chaque email contient un lien de désabonnement en un clic. Vous pouvez aussi modifier vos
                préférences à tout moment.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Mes données sont-elles protégées ?</h3>
              <p className="text-gray-600">
                Nous respectons strictement le RGPD. Vos données ne sont jamais vendues et sont uniquement utilisées
                pour vous envoyer du contenu pertinent.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

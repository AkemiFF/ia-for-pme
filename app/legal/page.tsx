import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentions Légales - IA pour PME & Freelances",
  description: "Mentions légales et informations sur l'éditeur du site",
}

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Mentions Légales</h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Éditeur du site</h2>
            <div className="text-gray-700 space-y-2">
              <p>
                <strong>Nom :</strong> IA pour PME & Freelances
              </p>
              <p>
                <strong>Email :</strong> contact@votre-domaine.com
              </p>
              <p>
                <strong>Siège social :</strong> [À compléter]
              </p>
              <p>
                <strong>SIRET :</strong> [À compléter]
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Hébergement</h2>
            <div className="text-gray-700 space-y-2">
              <p>
                <strong>Hébergeur :</strong> Vercel Inc.
              </p>
              <p>
                <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Propriété intellectuelle</h2>
            <p className="text-gray-700">
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la
              propriété intellectuelle. Tous les droits de reproduction sont réservés.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Données personnelles</h2>
            <p className="text-gray-700">
              Pour toute information concernant le traitement de vos données personnelles, consultez notre{" "}
              <a href="/privacy" className="text-blue-600 hover:underline">
                politique de confidentialité
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibent text-gray-900 mb-4">Publicité</h2>
            <p className="text-gray-700">
              Ce site utilise Google AdSense pour afficher des publicités. Ces publicités peuvent utiliser des cookies
              pour personnaliser le contenu publicitaire.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

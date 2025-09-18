import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Conditions d'Utilisation - IA pour PME & Freelances",
  description: "Conditions générales d'utilisation du site",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Conditions d'Utilisation</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptation des conditions</h2>
            <p className="text-gray-700">
              En accédant et en utilisant ce site web, vous acceptez d'être lié par ces conditions d'utilisation et
              toutes les lois et réglementations applicables.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Utilisation du site</h2>
            <p className="text-gray-700 mb-4">
              Ce site est destiné à fournir des informations sur l'intelligence artificielle pour les PME et freelances.
              Vous vous engagez à :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Utiliser le site de manière légale et appropriée</li>
              <li>Ne pas reproduire le contenu sans autorisation</li>
              <li>Respecter les droits de propriété intellectuelle</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Contenu et propriété intellectuelle</h2>
            <p className="text-gray-700">
              Tout le contenu de ce site, y compris les textes, images, logos et designs, est protégé par les droits
              d'auteur et appartient à IA pour PME & Freelances.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Limitation de responsabilité</h2>
            <p className="text-gray-700">
              Les informations sur ce site sont fournies à titre informatif uniquement. Nous ne garantissons pas
              l'exactitude, la complétude ou l'actualité des informations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Modifications</h2>
            <p className="text-gray-700">
              Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. Les modifications
              prendront effet dès leur publication sur le site.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

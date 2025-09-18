import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Politique de Confidentialité - IA pour PME & Freelances",
  description: "Politique de confidentialité et protection des données personnelles",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Politique de Confidentialité</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Collecte des données</h2>
            <p className="text-gray-700 mb-4">Nous collectons les informations suivantes :</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Adresse email lors de l'inscription à la newsletter</li>
              <li>Données de navigation via Google Analytics</li>
              <li>Cookies publicitaires via Google AdSense</li>
              <li>Informations de contact via les formulaires</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Utilisation des données</h2>
            <p className="text-gray-700 mb-4">Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Envoi de la newsletter et contenus personnalisés</li>
              <li>Amélioration de l'expérience utilisateur</li>
              <li>Analyse du trafic et des performances du site</li>
              <li>Affichage de publicités pertinentes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Cookies et publicités</h2>
            <p className="text-gray-700 mb-4">
              Notre site utilise Google AdSense qui peut placer des cookies pour personnaliser les publicités. Vous
              pouvez gérer vos préférences publicitaires via les paramètres de votre navigateur.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Vos droits</h2>
            <p className="text-gray-700 mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Droit d'accès à vos données personnelles</li>
              <li>Droit de rectification et de suppression</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit de vous opposer au traitement</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Contact</h2>
            <p className="text-gray-700">
              Pour toute question concernant cette politique de confidentialité, contactez-nous à :
              <a href="mailto:contact@votre-domaine.com" className="text-blue-600 hover:underline ml-1">
                contact@votre-domaine.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

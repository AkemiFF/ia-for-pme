import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-xl font-bold text-blue-600 mb-4">IA pour PME</div>
            <p className="text-gray-600 text-sm">
              Votre guide pour intégrer l'intelligence artificielle dans votre PME.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
            <div className="space-y-2">
              <Link href="/articles" className="block text-gray-600 hover:text-blue-600 text-sm transition-colors">
                Articles
              </Link>
              <Link href="/categories" className="block text-gray-600 hover:text-blue-600 text-sm transition-colors">
                Catégories
              </Link>
              <Link href="/comparatif" className="block text-gray-600 hover:text-blue-600 text-sm transition-colors">
                Comparatif Outils
              </Link>
              <Link href="/lead-magnet" className="block text-gray-600 hover:text-blue-600 text-sm transition-colors">
                Checklist Gratuite
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <div className="space-y-2">
              <Link href="/contact" className="block text-gray-600 hover:text-blue-600 text-sm transition-colors">
                Contact
              </Link>
              <Link href="/faq" className="block text-gray-600 hover:text-blue-600 text-sm transition-colors">
                FAQ
              </Link>
              <Link href="/about" className="block text-gray-600 hover:text-blue-600 text-sm transition-colors">
                À propos
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Légal</h3>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-gray-600 hover:text-blue-600 text-sm transition-colors">
                Confidentialité
              </Link>
              <Link href="/terms" className="block text-gray-600 hover:text-blue-600 text-sm transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="/legal" className="block text-gray-600 hover:text-blue-600 text-sm transition-colors">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2024 IA pour PME. Tous droits réservés.</p>
            <p className="text-gray-400 text-xs">
              Ce site utilise Google AdSense et des cookies pour améliorer votre expérience.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

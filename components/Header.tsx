import Link from "next/link"

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">
            <Link href="/">IA pour PME</Link>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link href="/articles" className="text-gray-600 hover:text-blue-600 transition-colors">
              Articles
            </Link>
            <Link href="/categories" className="text-gray-600 hover:text-blue-600 transition-colors">
              Catégories
            </Link>
            <Link href="/comparatif" className="text-gray-600 hover:text-blue-600 transition-colors">
              Comparatif
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </div>
          <button
            className="md:hidden text-gray-600 hover:text-blue-600"
            aria-label="Ouvrir le menu de navigation"
            aria-expanded="false"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  )
}

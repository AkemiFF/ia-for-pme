import AdminLoginClient from "./AdminLoginClient"

export const metadata = {
  title: "Connexion Admin - IA pour PME",
  description: "Interface d'administration pour la gestion du contenu",
  robots: "noindex, nofollow",
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Connexion Admin</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Accédez à l'interface d'administration</p>
        </div>
        <AdminLoginClient />
      </div>
    </div>
  )
}

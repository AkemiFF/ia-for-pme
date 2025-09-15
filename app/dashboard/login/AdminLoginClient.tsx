"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"

export default function AdminLoginClient() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/custom-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Erreur de connexion")
        return
      }

      if (data.success) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Erreur de connexion inconnue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-md mx-auto pt-20 px-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Connexion Admin</h1>
            <p className="text-gray-600">Accédez à l'interface d'administration</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-md text-sm text-gray-700">
            <p className="font-medium mb-2">Compte de test :</p>
            <p>Email: admin@example.com</p>
            <p>Mot de passe: admin123</p>
          </div>
        </div>
      </main>
    </div>
  )
}

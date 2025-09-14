"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Mail, Check, X, Users, TrendingUp, Zap, Gift } from "lucide-react"

interface NewsletterSignupProps {
  variant?: "default" | "compact" | "popup"
  showSegmentation?: boolean
}

export default function NewsletterSignup({ variant = "default", showSegmentation = true }: NewsletterSignupProps) {
  const [email, setEmail] = useState("")
  const [selectedSegments, setSelectedSegments] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const segments = [
    {
      id: "freelance",
      label: "Freelance",
      icon: <Users className="h-4 w-4" />,
      description: "Conseils pour indépendants",
    },
    { id: "pme", label: "PME", icon: <TrendingUp className="h-4 w-4" />, description: "Stratégies pour entreprises" },
    { id: "ecommerce", label: "E-commerce", icon: <Zap className="h-4 w-4" />, description: "Optimisation des ventes" },
  ]

  const interestTopics = [
    "Automatisation",
    "Outils gratuits",
    "Marketing IA",
    "Productivité",
    "Formation équipes",
    "ROI & Stratégie",
    "Sécurité & RGPD",
    "Tendances IA",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          segments: selectedSegments,
          interests,
          source: "website_signup",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erreur lors de l'inscription")
      }

      const result = await response.json()
      console.log("[v0] Newsletter subscription successful:", result)

      setIsSuccess(true)
      setEmail("")
      setSelectedSegments([])
      setInterests([])
    } catch (err) {
      console.error("[v0] Newsletter subscription error:", err)
      setError(err instanceof Error ? err.message : "Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleSegment = (segmentId: string) => {
    setSelectedSegments((prev) =>
      prev.includes(segmentId) ? prev.filter((id) => id !== segmentId) : [...prev, segmentId],
    )
  }

  const toggleInterest = (interest: string) => {
    setInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  if (isSuccess) {
    return (
      <Card className={variant === "compact" ? "p-4" : ""}>
        <CardContent className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Inscription confirmée !</h3>
          <p className="text-gray-600 mb-4">
            Merci de vous être inscrit à notre newsletter. Vous recevrez bientôt nos meilleurs conseils IA.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Gift className="h-4 w-4" />
            <span>Bonus : Guide "10 outils IA gratuits" envoyé dans votre boîte mail</span>
          </div>
          <Button variant="outline" size="sm" className="mt-4 bg-transparent" onClick={() => setIsSuccess(false)}>
            S'inscrire à nouveau
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (variant === "compact") {
    return (
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold">Newsletter IA</h4>
            </div>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={isSubmitting} size="sm">
                {isSubmitting ? "Envoi..." : "OK"}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <X className="h-4 w-4" />
                {error}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Newsletter IA Personnalisée</CardTitle>
        <p className="text-gray-600 mt-2">Recevez du contenu adapté à votre profil et vos besoins spécifiques</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Adresse email *
            </label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>

          {/* Segmentation */}
          {showSegmentation && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Votre profil (optionnel)</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {segments.map((segment) => (
                  <div
                    key={segment.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedSegments.includes(segment.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => toggleSegment(segment.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {segment.icon}
                      <span className="font-medium">{segment.label}</span>
                      {selectedSegments.includes(segment.id) && <Check className="h-4 w-4 text-blue-600 ml-auto" />}
                    </div>
                    <p className="text-sm text-gray-600">{segment.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Centres d'intérêt (optionnel)</label>
            <div className="flex flex-wrap gap-2">
              {interestTopics.map((topic) => (
                <Badge
                  key={topic}
                  variant={interests.includes(topic) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => toggleInterest(topic)}
                >
                  {topic}
                  {interests.includes(topic) && <Check className="h-3 w-3 ml-1" />}
                </Badge>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Gift className="h-5 w-5 text-orange-600" />
              Ce que vous recevrez
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Articles exclusifs adaptés à votre profil
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Outils et ressources gratuits chaque semaine
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Accès prioritaire aux nouveaux guides
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Bonus : Guide "10 outils IA gratuits" immédiatement
              </li>
            </ul>
          </div>

          {/* Privacy */}
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <Checkbox id="privacy" required />
            <label htmlFor="privacy" className="leading-relaxed">
              J'accepte de recevoir la newsletter et confirme avoir lu la{" "}
              <a href="/privacy" className="text-blue-600 hover:underline">
                politique de confidentialité
              </a>
              . Désabonnement possible à tout moment.
            </label>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Inscription en cours...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                S'inscrire gratuitement
              </>
            )}
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <X className="h-4 w-4" />
                {error}
              </p>
            </div>
          )}
        </form>

        {/* Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>2,847 abonnés</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>95% de satisfaction</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              <span>1 email/semaine</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

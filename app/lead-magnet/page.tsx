import type { Metadata } from "next"
import Header from "@/components/Header"
import LeadMagnetClient from "./LeadMagnetClient"

export const metadata: Metadata = {
  title: "Checklist IA pour PME - Guide Gratuit | Transformez votre entreprise",
  description:
    "Téléchargez gratuitement notre checklist complète pour intégrer l'IA dans votre PME. 25 points essentiels pour réussir votre transformation digitale.",
  openGraph: {
    title: "Checklist IA pour PME - Guide Gratuit | Transformez votre entreprise",
    description:
      "Téléchargez gratuitement notre checklist complète pour intégrer l'IA dans votre PME. 25 points essentiels pour réussir votre transformation digitale.",
    type: "website",
  },
}

export default function LeadMagnetPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <LeadMagnetClient />
    </div>
  )
}

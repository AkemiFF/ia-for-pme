import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ContactPageClient from "./ContactPageClient"

export const metadata: Metadata = {
  title: "Contact - IA pour PME | Demandez votre audit gratuit",
  description:
    "Contactez nos experts en IA pour PME. Demandez votre audit gratuit et découvrez comment l'intelligence artificielle peut transformer votre entreprise.",
  openGraph: {
    title: "Contact - IA pour PME | Demandez votre audit gratuit",
    description:
      "Contactez nos experts en IA pour PME. Demandez votre audit gratuit et découvrez comment l'intelligence artificielle peut transformer votre entreprise.",
    type: "website",
  },
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <ContactPageClient />
      <Footer />
    </>
  )
}

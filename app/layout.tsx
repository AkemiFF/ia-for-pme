import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import Script from "next/script"
import "./globals.css"

export const metadata: Metadata = {
  title: "IA pour PME & Freelances : Automatisez votre activité facilement",
  description:
    "Découvrez comment l'IA transforme les PME et freelances. Guides pratiques, outils et stratégies pour automatiser votre business et booster votre productivité.",
  keywords:
    "IA PME, intelligence artificielle freelance, automatisation, petites entreprises, freelance productivité, outils IA",
  authors: [{ name: "IA pour PME & Freelances" }],
  creator: "IA pour PME & Freelances",
  publisher: "IA pour PME & Freelances",
  robots: "index, follow",
  other: {
    "google-adsense-account": "ca-pub-9041353625362383",
  },
  openGraph: {
    title: "IA pour PME & Freelances : Automatisez votre activité facilement",
    description:
      "Découvrez comment l'IA transforme les PME et freelances. Guides pratiques, outils et stratégies pour automatiser votre business et booster votre productivité.",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://votre-domaine.com",
    siteName: "IA pour PME & Freelances",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://votre-domaine.com"}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "IA pour PME & Freelances - Automatisez votre activité",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IA pour PME & Freelances : Automatisez votre activité facilement",
    description:
      "Découvrez comment l'IA transforme les PME et freelances. Guides pratiques, outils et stratégies pour automatiser votre business.",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || "https://votre-domaine.com"}/twitter-image.jpg`],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://votre-domaine.com",
  },
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9041353625362383"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
        {/* TODO: Ajouter Google Analytics / Google Tag Manager ici */}
        {/* TODO: Ajouter Facebook Pixel ici */}
      </body>
    </html>
  )
}

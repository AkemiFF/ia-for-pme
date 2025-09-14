import type { Metadata } from "next"
import ArticlesPageClient from "./ArticlesPageClient"

export const metadata: Metadata = {
  title: "Articles IA pour PME & Freelances | Guides et Conseils Pratiques",
  description:
    "Découvrez nos derniers articles sur l'IA pour PME et Freelances : guides pratiques, études de cas, outils recommandés et stratégies pour transformer votre activité professionnelle.",
  openGraph: {
    title: "Articles IA pour PME & Freelances | Guides et Conseils Pratiques",
    description:
      "Découvrez nos derniers articles sur l'IA pour PME et Freelances : guides pratiques, études de cas, outils recommandés et stratégies pour transformer votre activité professionnelle.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/articles`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/articles`,
  },
}

export default function ArticlesPage() {
  return <ArticlesPageClient />
}

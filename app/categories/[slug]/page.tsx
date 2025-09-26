import type { Metadata } from "next"
import { notFound } from "next/navigation"
import CategoryContent from "./CategoryContent"
import { fetchCategories, fetchCategoryArticles } from "@/lib/api/articles"
import type { AffiliateResource } from "@/types"

// Génération des chemins statiques
export async function generateStaticParams() {
  try {
    const categories = await fetchCategories()

    return categories.map((category) => ({
      slug: category.slug,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    // Fallback data for development
    return [
      { slug: "automatisation-processus" },
      { slug: "outils-ia-pme" },
      { slug: "strategie-digitale" },
      { slug: "gestion-donnees" },
      { slug: "formation-adoption" },
      { slug: "marketing-ia" },
    ]
  }
}

// Génération des métadonnées dynamiques
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const data = await fetchCategoryArticles(params.slug)
    const { category } = data

    const title = category.seo_title || `${category.name} - Articles IA pour PME`
    const description =
      category.seo_description ||
      `Découvrez nos articles sur ${category.name.toLowerCase()} pour optimiser votre PME avec l'intelligence artificielle. Conseils pratiques et outils recommandés.`

    return {
      title: title.length > 60 ? title.substring(0, 57) + "..." : title,
      description: description.length > 155 ? description.substring(0, 152) + "..." : description,
      openGraph: {
        title,
        description,
        type: "website",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/categories/${params.slug}`,
        siteName: "IA pour PME",
        locale: "fr_FR",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/categories/${params.slug}`,
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Catégorie non trouvée - IA pour PME",
      description: "Cette catégorie n'existe pas ou n'est plus disponible.",
    }
  }
}

// Composant serveur principal
export default async function CategoryPage({ params }: { params: { slug: string } }) {
  try {
    const categoryData = await fetchCategoryArticles(params.slug)

    // Mock affiliate resources for now - TODO: Create affiliate API
    const affiliateResources: AffiliateResource[] = [
      {
        id: 1,
        name: "ChatGPT Pro",
        description: "IA conversationnelle avancée",
        url: "#",
        logo: "/placeholder-logo.png",
      },
      { id: 2, name: "Notion AI", description: "Productivité augmentée", url: "#", logo: "/placeholder-logo.png" },
      { id: 3, name: "Canva AI", description: "Design automatisé", url: "#", logo: "/placeholder-logo.png" },
      { id: 4, name: "Zapier", description: "Automatisation workflow", url: "#", logo: "/placeholder-logo.png" },
      { id: 5, name: "HubSpot AI", description: "CRM intelligent", url: "#", logo: "/placeholder-logo.png" },
    ]

    return (
      <CategoryContent
        category={categoryData.category}
        articles={categoryData.articles}
        totalArticles={categoryData.total}
        affiliateResources={affiliateResources}
      />
    )
  } catch (error) {
    console.error("Error loading category page:", error)
    notFound()
  }
}

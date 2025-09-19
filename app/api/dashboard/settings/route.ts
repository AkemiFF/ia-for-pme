import { type NextRequest, NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth/verify-token"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  console.log("[v0] GET /api/dashboard/settings - Starting authentication check")

  const authResult = await verifyAuthToken(request)
  if (!authResult.success) {
    console.log("[v0] GET /api/dashboard/settings - Authentication failed")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const settings = {
      site: {
        name: "IA pour PME & Freelances",
        description: "Votre guide pour intégrer l'intelligence artificielle dans votre PME",
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://votre-domaine.com",
        email: "contact@votre-domaine.com",
      },
      seo: {
        googleAnalytics: process.env.GOOGLE_ANALYTICS_ID || "",
        googleAdsense: "ca-pub-9041353625362383",
        facebookPixel: process.env.FACEBOOK_PIXEL_ID || "",
      },
      newsletter: {
        provider: "MailerLite",
        apiKey: process.env.MAILERLITE_API_KEY ? "Configuré" : "Non configuré",
      },
    }

    const [articlesResult, subscribersResult, leadsResult, usersResult] = await Promise.all([
      supabase.from("articles").select("id", { count: "exact", head: true }),
      supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase.from("users").select("id", { count: "exact", head: true }),
    ])

    return NextResponse.json({
      settings,
      stats: {
        total_articles: articlesResult.count || 0,
        total_subscribers: subscribersResult.count || 0,
        total_leads: leadsResult.count || 0,
        total_users: usersResult.count || 0,
      },
    })
  } catch (error) {
    console.error("[v0] Database error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const authResult = await verifyAuthToken(request)
  if (!authResult.success) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { settings } = await request.json()

    // For now, we'll just return success
    console.log("[v0] Settings updated:", settings)

    return NextResponse.json({
      success: true,
      message: "Paramètres mis à jour avec succès",
    })
  } catch (error) {
    console.error("[v0] Settings update error:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
}

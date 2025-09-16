import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { name, email, source = "checklist-ia-pme" } = body

    // Validate required fields
    if (!name || !email || !email.includes("@")) {
      return NextResponse.json({ error: "Nom et email valide requis" }, { status: 400 })
    }

    // Insert lead magnet record
    const { data: leadData, error: leadError } = await supabase
      .from("lead_magnets")
      .insert({
        name,
        email,
        source,
        download_url: "/downloads/checklist-ia-pme.pdf", // TODO: Generate actual download URL
      })
      .select()
      .single()

    if (leadError) {
      console.error("Database error:", leadError)
      return NextResponse.json({ error: "Erreur lors de l'enregistrement" }, { status: 500 })
    }

    // Also add to newsletter if not already subscribed
    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email)
      .single()

    if (!existingSubscriber) {
      await supabase.from("newsletter_subscribers").insert({
        email,
        name,
        segments: ["pme"], // Default segment for lead magnet
        interests: ["checklist", "guides"],
        source: `lead-magnet-${source}`,
      })
    }

    // TODO: Send email with download link
    // TODO: Integrate with MailerLite automation

    // Track analytics
    await supabase.from("analytics_events").insert({
      event_type: "lead_magnet_download",
      event_data: {
        name,
        email,
        source,
        lead_id: leadData.id,
      },
      user_agent: request.headers.get("user-agent"),
      referrer: request.headers.get("referer"),
    })

    return NextResponse.json({
      success: true,
      message: "Merci ! Votre téléchargement va commencer.",
      downloadUrl: leadData.download_url,
      leadId: leadData.id,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Verify authentication
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // TODO: Add proper JWT token validation here

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "10"), 50)
    const search = searchParams.get("search")
    const offset = (page - 1) * limit

    let query = supabase.from("lead_magnets").select("*").order("created_at", { ascending: false })

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data: leads, error } = await query.range(offset, offset + limit - 1)
    const { count } = await supabase.from("lead_magnets").select("*", { count: "exact", head: true })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
    }

    return NextResponse.json({
      leads: leads || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

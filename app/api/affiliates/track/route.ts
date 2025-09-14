import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { affiliateId, url } = body

    if (!affiliateId || !url) {
      return NextResponse.json({ error: "Affiliate ID and URL required" }, { status: 400 })
    }

    // Increment click count
    const { error: updateError } = await supabase
      .from("affiliate_resources")
      .update({
        click_count: supabase.raw("click_count + 1"),
      })
      .eq("id", affiliateId)

    if (updateError) {
      console.error("Database error:", updateError)
    }

    // Track analytics
    await supabase.from("analytics_events").insert({
      event_type: "affiliate_click",
      event_data: {
        affiliate_id: affiliateId,
        destination_url: url,
      },
      user_agent: request.headers.get("user-agent"),
      referrer: request.headers.get("referer"),
    })

    return NextResponse.json({
      success: true,
      redirectUrl: url,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

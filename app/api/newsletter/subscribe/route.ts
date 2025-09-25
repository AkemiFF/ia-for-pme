import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { email, name, segments = [], interests = [], source = "website" } = body

    // Validate required fields
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email valide requis" }, { status: 400 })
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, is_active")
      .eq("email", email)
      .single()

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json({ error: "Cet email est déjà inscrit à notre newsletter" }, { status: 409 })
      } else {
        // Reactivate subscription
        const { error: updateError } = await supabase
          .from("newsletter_subscribers")
          .update({
            is_active: true,
            name,
            segments,
            interests,
            source,
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null,
          })
          .eq("id", existing.id)

        if (updateError) {
          console.error("Database error:", updateError)
          return NextResponse.json({ error: "Erreur lors de la réactivation" }, { status: 500 })
        }
      }
    } else {
      // Create new subscription
      const { error: insertError } = await supabase.from("newsletter_subscribers").insert({
        email,
        name,
        segments,
        interests,
        source,
      })

      if (insertError) {
        console.error("Database error:", insertError)
        return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 })
      }
    }

    // TODO: Integrate with MailerLite
    // Example MailerLite integration:
    /*
    if (process.env.MAILERLITE_API_KEY) {
      try {
        const mailerliteResponse = await fetch('https://api.mailerlite.com/api/v2/subscribers', {
          method: 'POST',
          headers: {
            'X-MailerLite-ApiKey': process.env.MAILERLITE_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            name,
            fields: {
              segments: segments.join(','),
              interests: interests.join(','),
              source
            }
          }),
        });
        
        if (mailerliteResponse.ok) {
          const mailerliteData = await mailerliteResponse.json();
          // Update subscriber with MailerLite ID
          await supabase
            .from('newsletter_subscribers')
            .update({ mailerlite_id: mailerliteData.id })
            .eq('email', email);
        }
      } catch (mailerliteError) {
        console.error('MailerLite error:', mailerliteError);
        // Continue even if MailerLite fails
      }
    }
    */

    // Track analytics
    await supabase.from("analytics_events").insert({
      event_type: "newsletter_signup",
      event_data: {
        email,
        segments,
        interests,
        source,
      },
      user_agent: request.headers.get("user-agent"),
      referrer: request.headers.get("referer"),
    })

    return NextResponse.json({
      success: true,
      message: "Inscription réussie ! Vous recevrez bientôt nos conseils IA.",
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

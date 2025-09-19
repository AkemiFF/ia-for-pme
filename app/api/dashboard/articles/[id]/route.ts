import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { verifyAuthToken } from "@/lib/auth/verify-token"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const user = await verifyAuthToken(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = params

    // Verify article exists before deletion
    const { data: existingArticle, error: fetchError } = await supabase
      .from("articles")
      .select("id, title")
      .eq("id", id)
      .single()

    if (fetchError || !existingArticle) {
      return NextResponse.json({ error: "Article non trouvé" }, { status: 404 })
    }

    const { error } = await supabase.from("articles").delete().eq("id", id)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Échec de la suppression de l'article" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Article "${existingArticle.title}" supprimé avec succès`,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const user = await verifyAuthToken(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        {
          error: "Titre et contenu requis",
        },
        { status: 400 },
      )
    }

    // Verify article exists before update
    const { data: existingArticle, error: fetchError } = await supabase
      .from("articles")
      .select("id")
      .eq("id", id)
      .single()

    if (fetchError || !existingArticle) {
      return NextResponse.json({ error: "Article non trouvé" }, { status: 404 })
    }

    const { data: article, error } = await supabase
      .from("articles")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Échec de la mise à jour de l'article" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      article,
      message: "Article mis à jour avec succès",
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 })
  }
}

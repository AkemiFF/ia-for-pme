import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * Server-side Supabase client
 * Creates a new client for each request to avoid sharing state
 */
export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server-side operations

  if (!supabaseUrl || !supabaseKey) {
    console.error("[v0] Missing Supabase environment variables:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
    })
    throw new Error("Missing Supabase environment variables")
  }

  console.log("[v0] Creating Supabase client with URL:", supabaseUrl.substring(0, 30) + "...")

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

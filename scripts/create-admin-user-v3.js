const { createClient } = require("@supabase/supabase-js")

async function createAdminUser() {
  console.log("[v0] Starting admin user creation...")

  // Use service role key for admin operations
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  try {
    console.log("[v0] Creating admin user...")

    // Create user with admin privileges
    const { data: user, error: createError } = await supabase.auth.admin.createUser({
      email: "admin@example.com",
      password: "password123",
      email_confirm: true, // Skip email confirmation
      user_metadata: {
        role: "admin",
        name: "Administrator",
      },
    })

    if (createError) {
      console.error("[v0] Error creating user:", createError.message)
      return
    }

    console.log("[v0] Admin user created successfully!")
    console.log("[v0] Email: admin@example.com")
    console.log("[v0] Password: password123")
    console.log("[v0] User ID:", user.user?.id)
  } catch (error) {
    console.error("[v0] Script error:", error.message)
  }
}

createAdminUser()

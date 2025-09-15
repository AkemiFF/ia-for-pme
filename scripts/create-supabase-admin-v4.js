import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createAdminUser() {
  try {
    console.log("Creating admin user in Supabase Auth...")

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: "admin@example.com",
      password: "password123",
      email_confirm: true,
    })

    if (authError) {
      console.error("Error creating auth user:", authError.message)
      return
    }

    console.log("✅ Admin user created successfully!")
    console.log("Email: admin@example.com")
    console.log("Password: password123")
    console.log("User ID:", authData.user.id)
  } catch (error) {
    console.error("Script error:", error.message)
  }
}

createAdminUser()

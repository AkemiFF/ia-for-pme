// Node.js script to create admin user using Supabase client
// Run this with: node scripts/create-admin-user.js

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
    console.log("Creating admin user...")

    const { data, error } = await supabase.auth.admin.createUser({
      email: "admin@example.com",
      password: "password123",
      email_confirm: true,
    })

    if (error) {
      console.error("Error creating admin user:", error)
      return
    }

    console.log("Admin user created successfully:", data.user.email)
    console.log("User ID:", data.user.id)
  } catch (error) {
    console.error("Unexpected error:", error)
  }
}

createAdminUser()

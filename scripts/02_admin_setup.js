// IA PME Admin Setup - Create administrative user
// This script creates an admin user in Supabase Auth
// Run this after the database setup to create your admin account

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Configuration - Update these values as needed
const ADMIN_CONFIG = {
  email: process.env.DEMO_USER_EMAIL || "admin@ia-pme.com",
  password: process.env.DEMO_USER_PASSWORD || "AdminIA2024!",
  name: "Admin IA PME",
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase environment variables")
  console.error("Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY")
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
    console.log("🚀 Creating admin user in Supabase Auth...")
    console.log(`📧 Email: ${ADMIN_CONFIG.email}`)

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: ADMIN_CONFIG.email,
      password: ADMIN_CONFIG.password,
      email_confirm: true,
      user_metadata: {
        name: ADMIN_CONFIG.name,
        role: "admin",
      },
    })

    if (authError) {
      if (authError.message.includes("already registered")) {
        console.log("⚠️  Admin user already exists")
        console.log(`📧 Email: ${ADMIN_CONFIG.email}`)
        console.log(`🔑 Password: ${ADMIN_CONFIG.password}`)
        return
      }
      console.error("❌ Error creating auth user:", authError.message)
      return
    }

    console.log("✅ Admin user created successfully!")
    console.log(`📧 Email: ${ADMIN_CONFIG.email}`)
    console.log(`🔑 Password: ${ADMIN_CONFIG.password}`)
    console.log(`👤 User ID: ${authData.user.id}`)
    console.log("\n🎉 You can now log in to your admin panel!")
  } catch (error) {
    console.error("❌ Script error:", error.message)
    process.exit(1)
  }
}

// Run the script
createAdminUser()

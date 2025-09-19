import { validateEnvironmentVariables, EnvValidationError } from "./env-validation"
import { logger } from "../errors/logger"

export async function performStartupChecks(): Promise<void> {
  logger.info("🚀 Starting application startup checks...")

  try {
    // 1. Validate environment variables
    logger.info("📋 Validating environment variables...")
    validateEnvironmentVariables()
    logger.info("✅ Environment variables validated successfully")

    // 2. Test database connection
    logger.info("🗄️  Testing database connection...")
    await testDatabaseConnection()
    logger.info("✅ Database connection successful")

    // 3. Test Supabase connection
    logger.info("🔐 Testing Supabase connection...")
    await testSupabaseConnection()
    logger.info("✅ Supabase connection successful")

    // 4. Test optional services
    await testOptionalServices()

    logger.info("🎉 All startup checks passed successfully!")
  } catch (error) {
    if (error instanceof EnvValidationError) {
      logger.error("❌ Environment validation failed", error, {
        missingVars: error.missingVars,
      })
      process.exit(1)
    } else {
      logger.error("❌ Startup check failed", error as Error)
      // Don't exit for non-critical errors, just warn
    }
  }
}

async function testDatabaseConnection(): Promise<void> {
  try {
    // Test basic database connectivity
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()

    // Simple query to test connection
    const { error } = await supabase.from("categories").select("count").limit(1)

    if (error) {
      throw new Error(`Database connection failed: ${error.message}`)
    }
  } catch (error) {
    throw new Error(`Database test failed: ${(error as Error).message}`)
  }
}

async function testSupabaseConnection(): Promise<void> {
  try {
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()

    // Test Supabase service role access
    const { error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 })

    if (error && error.message !== "Invalid API key") {
      throw new Error(`Supabase connection failed: ${error.message}`)
    }
  } catch (error) {
    throw new Error(`Supabase test failed: ${(error as Error).message}`)
  }
}

async function testOptionalServices(): Promise<void> {
  const { envConfig, isFeatureEnabled } = await import("./env-validation")

  // Test MailerLite if configured
  if (isFeatureEnabled("MAILERLITE_API_KEY")) {
    try {
      const response = await fetch("https://connect.mailerlite.com/api/me", {
        headers: {
          Authorization: `Bearer ${envConfig.MAILERLITE_API_KEY}`,
        },
      })

      if (response.ok) {
        logger.info("✅ MailerLite API connection successful")
      } else {
        logger.warn("⚠️  MailerLite API connection failed - check API key")
      }
    } catch (error) {
      logger.warn("⚠️  MailerLite API test failed", { error: (error as Error).message })
    }
  } else {
    logger.info("ℹ️  MailerLite integration disabled (no API key)")
  }

  // Log other optional service status
  if (!isFeatureEnabled("GOOGLE_ANALYTICS_ID")) {
    logger.info("ℹ️  Google Analytics disabled (no tracking ID)")
  }

  if (!isFeatureEnabled("FACEBOOK_PIXEL_ID")) {
    logger.info("ℹ️  Facebook Pixel disabled (no pixel ID)")
  }
}

// Auto-run startup checks in development
if (process.env.NODE_ENV === "development") {
  performStartupChecks().catch(console.error)
}

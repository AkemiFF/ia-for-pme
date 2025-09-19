export interface EnvConfig {
  // Supabase (Required)
  NEXT_PUBLIC_SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string
  SUPABASE_JWT_SECRET: string

  SUPABASE_URL: string

  // Site Configuration (Required)
  NEXT_PUBLIC_SITE_URL: string
  NEXT_PUBLIC_API_URL: string

  // Demo User (Required for development)
  DEMO_USER_EMAIL: string
  DEMO_USER_PASSWORD: string

  // Optional Services
  MAILERLITE_API_KEY?: string
  NEXT_PUBLIC_AFFILIATE_DEFAULT?: string
  GOOGLE_ANALYTICS_ID?: string
  FACEBOOK_PIXEL_ID?: string
}

export class EnvValidationError extends Error {
  constructor(
    message: string,
    public missingVars: string[],
  ) {
    super(message)
    this.name = "EnvValidationError"
  }
}

export function validateEnvironmentVariables(): EnvConfig {
  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_JWT_SECRET",
    "SUPABASE_URL",
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_API_URL",
    "DEMO_USER_EMAIL",
    "DEMO_USER_PASSWORD",
  ]

  const optionalVars = [
    "MAILERLITE_API_KEY",
    "NEXT_PUBLIC_AFFILIATE_DEFAULT",
    "GOOGLE_ANALYTICS_ID",
    "FACEBOOK_PIXEL_ID",
  ]

  const missing: string[] = []
  const warnings: string[] = []

  // Check required variables
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName)
    }
  }

  // Check optional variables and warn if missing
  for (const varName of optionalVars) {
    if (!process.env[varName]) {
      warnings.push(varName)
    }
  }

  // Validate URL formats
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !isValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL (invalid URL format)")
  }

  if (process.env.SUPABASE_URL && !isValidUrl(process.env.SUPABASE_URL)) {
    missing.push("SUPABASE_URL (invalid URL format)")
  }

  if (process.env.NEXT_PUBLIC_SITE_URL && !isValidUrl(process.env.NEXT_PUBLIC_SITE_URL)) {
    missing.push("NEXT_PUBLIC_SITE_URL (invalid URL format)")
  }

  if (process.env.NEXT_PUBLIC_API_URL && !isValidUrl(process.env.NEXT_PUBLIC_API_URL)) {
    missing.push("NEXT_PUBLIC_API_URL (invalid URL format)")
  }

  // Validate email format
  if (process.env.DEMO_USER_EMAIL && !isValidEmail(process.env.DEMO_USER_EMAIL)) {
    missing.push("DEMO_USER_EMAIL (invalid email format)")
  }

  if (missing.length > 0) {
    throw new EnvValidationError(`Missing or invalid required environment variables: ${missing.join(", ")}`, missing)
  }

  // Log warnings for optional variables
  if (warnings.length > 0) {
    console.warn(`⚠️  Optional environment variables not set: ${warnings.join(", ")}`)
    console.warn("   Some features may not work as expected.")
  }

  // Log success
  console.log("✅ Environment variables validation passed")
  if (warnings.length === 0) {
    console.log("✅ All optional variables are configured")
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET!,
    SUPABASE_URL: process.env.SUPABASE_URL!,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL!,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
    DEMO_USER_EMAIL: process.env.DEMO_USER_EMAIL!,
    DEMO_USER_PASSWORD: process.env.DEMO_USER_PASSWORD!,
    MAILERLITE_API_KEY: process.env.MAILERLITE_API_KEY,
    NEXT_PUBLIC_AFFILIATE_DEFAULT: process.env.NEXT_PUBLIC_AFFILIATE_DEFAULT,
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
    FACEBOOK_PIXEL_ID: process.env.FACEBOOK_PIXEL_ID,
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Export validated config
export const envConfig = validateEnvironmentVariables()

// Helper function to check if a feature is enabled
export function isFeatureEnabled(
  feature: keyof Pick<EnvConfig, "MAILERLITE_API_KEY" | "GOOGLE_ANALYTICS_ID" | "FACEBOOK_PIXEL_ID">,
): boolean {
  return !!envConfig[feature]
}

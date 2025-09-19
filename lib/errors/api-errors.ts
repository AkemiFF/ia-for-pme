export class APIError extends Error {
  public statusCode: number
  public code: string
  public details?: any

  constructor(message: string, statusCode = 500, code?: string, details?: any) {
    super(message)
    this.name = "APIError"
    this.statusCode = statusCode
    this.code = code || this.getDefaultCode(statusCode)
    this.details = details
  }

  private getDefaultCode(statusCode: number): string {
    switch (statusCode) {
      case 400:
        return "BAD_REQUEST"
      case 401:
        return "UNAUTHORIZED"
      case 403:
        return "FORBIDDEN"
      case 404:
        return "NOT_FOUND"
      case 409:
        return "CONFLICT"
      case 422:
        return "VALIDATION_ERROR"
      case 429:
        return "RATE_LIMIT"
      case 500:
        return "INTERNAL_ERROR"
      default:
        return "UNKNOWN_ERROR"
    }
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
      statusCode: this.statusCode,
      ...(this.details && { details: this.details }),
    }
  }
}

// Predefined error types
export class ValidationError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 422, "VALIDATION_ERROR", details)
  }
}

export class AuthenticationError extends APIError {
  constructor(message = "Non authentifié") {
    super(message, 401, "UNAUTHORIZED")
  }
}

export class AuthorizationError extends APIError {
  constructor(message = "Accès refusé") {
    super(message, 403, "FORBIDDEN")
  }
}

export class NotFoundError extends APIError {
  constructor(resource = "Ressource") {
    super(`${resource} non trouvé(e)`, 404, "NOT_FOUND")
  }
}

export class DatabaseError extends APIError {
  constructor(message = "Erreur de base de données", details?: any) {
    super(message, 500, "DATABASE_ERROR", details)
  }
}

export class ExternalServiceError extends APIError {
  constructor(service: string, message?: string) {
    super(message || `Erreur du service ${service}`, 503, "EXTERNAL_SERVICE_ERROR", { service })
  }
}

// Error handler middleware
export function handleAPIError(error: unknown): Response {
  console.error("API Error:", error)

  if (error instanceof APIError) {
    return new Response(JSON.stringify(error.toJSON()), {
      status: error.statusCode,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Handle Supabase errors
  if (error && typeof error === "object" && "code" in error) {
    const supabaseError = error as any
    if (supabaseError.code === "PGRST116") {
      return new Response(
        JSON.stringify({
          error: "Ressource non trouvée",
          code: "NOT_FOUND",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      )
    }
  }

  // Generic error fallback
  const genericError = new APIError("Erreur interne du serveur")
  return new Response(JSON.stringify(genericError.toJSON()), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  })
}

// Validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateRequired(fields: Record<string, any>, requiredFields: string[]): void {
  const missing = requiredFields.filter((field) => !fields[field])
  if (missing.length > 0) {
    throw new ValidationError(`Champs requis manquants: ${missing.join(", ")}`, { missing })
  }
}

export function validateStringLength(value: string, field: string, min?: number, max?: number): void {
  if (min && value.length < min) {
    throw new ValidationError(`${field} doit contenir au moins ${min} caractères`)
  }
  if (max && value.length > max) {
    throw new ValidationError(`${field} ne peut pas dépasser ${max} caractères`)
  }
}

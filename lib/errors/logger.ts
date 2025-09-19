export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
}

export interface LogContext {
  userId?: string
  requestId?: string
  endpoint?: string
  userAgent?: string
  ip?: string
  [key: string]: any
}

export class Logger {
  private static instance: Logger
  private isDevelopment = process.env.NODE_ENV === "development"

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : ""
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const errorDetails = error
      ? {
          name: error.name,
          message: error.message,
          stack: this.isDevelopment ? error.stack : undefined,
        }
      : undefined

    const fullContext = { ...context, error: errorDetails }
    console.error(this.formatMessage(LogLevel.ERROR, message, fullContext))

    // In production, you might want to send to external logging service
    if (!this.isDevelopment) {
      // TODO: Send to external logging service (Sentry, LogRocket, etc.)
    }
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, context))
  }

  info(message: string, context?: LogContext): void {
    console.info(this.formatMessage(LogLevel.INFO, message, context))
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, context))
    }
  }

  // Helper method to create request context
  createRequestContext(request: Request): LogContext {
    return {
      endpoint: new URL(request.url).pathname,
      userAgent: request.headers.get("user-agent") || undefined,
      requestId: crypto.randomUUID(),
    }
  }
}

export const logger = Logger.getInstance()

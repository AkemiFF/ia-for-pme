import { verifyAuthToken } from "@/hooks/use-auth"
import type { NextRequest } from "next/server"

export async function withAuth(
  handler: (req: NextRequest, context: { user: any }) => Promise<Response>,
  req: NextRequest,
): Promise<Response> {
  try {
    const { valid, user } = await verifyAuthToken(req)

    if (!valid) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    return handler(req, { user })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Authentication failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth/verify-token"

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuthToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 50MB" }, { status: 400 })
    }

    // Validate file type for security
    const allowedTypes = [
      // Images
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      // Documents
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      // Archives
      "application/zip",
      "application/x-rar-compressed",
      // Other
      "application/json",
      "text/csv",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: `File type not allowed: ${file.type}. Allowed types: images, PDF, documents, archives`,
        },
        { status: 400 },
      )
    }

    // Generate unique filename to avoid conflicts
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split(".").pop()
    const uniqueFilename = `${timestamp}-${randomString}.${fileExtension}`

    // Upload to Vercel Blob with unique filename
    const blob = await put(uniqueFilename, file, {
      access: "public",
      addRandomSuffix: false, // We already added our own suffix
    })

    return NextResponse.json({
      url: blob.url,
      filename: file.name, // Return original filename for display
      uniqueFilename: uniqueFilename, // Return unique filename for reference
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 },
    )
  }
}

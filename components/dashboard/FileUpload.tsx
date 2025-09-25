"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, File, ImageIcon, Upload, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FileUploadProps {
  onFileUploaded: (fileData: { url: string; filename: string; size: number; type: string }) => void
  accept?: string
  maxSize?: number // in MB
  type: "image" | "file"
  currentUrl?: string
  className?: string
}

export default function FileUpload({
  onFileUploaded,
  accept,
  maxSize = 10,
  type,
  currentUrl,
  className = "",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    setError(null)
    setSuccess(false)

    if (file.size > maxSize * 1024 * 1024) {
      setError(`Le fichier est trop volumineux. Taille maximale: ${maxSize}MB`)
      return
    }

    // Validate file type for images
    if (type === "image" && !file.type.startsWith("image/")) {
      setError("Veuillez sélectionner un fichier image valide")
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 100)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const result = await response.json()
      onFileUploaded(result)
      setSuccess(true)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("Upload error:", error)
      setError(error instanceof Error ? error.message : "Erreur lors de l'upload du fichier")
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const getAcceptString = () => {
    if (accept) return accept
    return type === "image" ? "image/*" : "*/*"
  }

  const getIcon = () => {
    if (success) return <CheckCircle className="h-8 w-8 text-green-500" />
    if (error) return <AlertCircle className="h-8 w-8 text-red-500" />
    if (uploading) return <Upload className="h-8 w-8 animate-pulse" />
    return type === "image" ? <ImageIcon className="h-8 w-8" /> : <File className="h-8 w-8" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${dragOver ? "border-blue-500 bg-blue-500/10 scale-105" : "border-gray-600 hover:border-gray-500"}
          ${uploading ? "opacity-50 pointer-events-none" : "cursor-pointer hover:bg-gray-800/50"}
          ${success ? "border-green-500 bg-green-500/10" : ""}
          ${error ? "border-red-500 bg-red-500/10" : ""}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptString()}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          {getIcon()}

          <div className="text-sm text-gray-300">
            {uploading ? (
              <div className="space-y-2">
                <div>Upload en cours... {uploadProgress}%</div>
                <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : success ? (
              <span className="text-green-400 font-medium">✓ Fichier uploadé avec succès!</span>
            ) : error ? (
              <span className="text-red-400">Erreur d'upload</span>
            ) : (
              <>
                <span className="font-medium">Cliquez pour sélectionner</span> ou glissez-déposez
                <br />
                <span className="text-xs text-gray-400">
                  {type === "image" ? "Images" : "Tous fichiers"} jusqu'à {maxSize}MB
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {currentUrl && (
        <div className="flex items-center gap-3 p-3 bg-gray-800 rounded border border-gray-600">
          {type === "image" && currentUrl ? (
            <div className="flex-shrink-0">
              <img
                src={currentUrl || "/placeholder.svg"}
                alt="Preview"
                className="w-12 h-12 object-cover rounded border border-gray-600"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            </div>
          ) : (
            <div className="flex-shrink-0">
              {type === "image" ? (
                <ImageIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <File className="h-5 w-5 text-gray-400" />
              )}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-300 truncate">{currentUrl.split("/").pop() || "Fichier uploadé"}</div>
            <div className="text-xs text-gray-500">Fichier disponible</div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onFileUploaded({ url: "", filename: "", size: 0, type: "" })
              setSuccess(false)
              setError(null)
            }}
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

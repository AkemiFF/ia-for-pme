"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
}

export default function ImageUploader({ value, onChange, label = "Image", placeholder }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner un fichier image valide")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5MB")
      return
    }

    setUploading(true)
    setError("")

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("file", file)

      // Upload to your API endpoint
      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Erreur lors du téléchargement")
      }

      const data = await response.json()
      onChange(data.url)
    } catch (err) {
      // Fallback: create a local URL for development
      const localUrl = URL.createObjectURL(file)
      onChange(localUrl)
      setError("Mode développement: image chargée localement")
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <Label className="text-gray-200">{label}</Label>

      {value ? (
        <div className="relative">
          <img
            src={value || "/placeholder.svg"}
            alt="Preview"
            className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-600"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Téléchargement...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Choisir une image
                </>
              )}
            </Button>
            <p className="text-sm text-gray-400">ou glissez-déposez votre image ici</p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 5MB</p>
          </div>
        </div>
      )}

      <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

      <div className="space-y-2">
        <Label className="text-gray-200">Ou saisir une URL</Label>
        <Input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "https://example.com/image.jpg"}
          className="bg-gray-700 border-gray-600 text-gray-200"
        />
      </div>

      {error && (
        <Alert variant={error.includes("développement") ? "default" : "destructive"}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

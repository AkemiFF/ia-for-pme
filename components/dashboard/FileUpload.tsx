"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, File, ImageIcon } from "lucide-react"

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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`Le fichier est trop volumineux. Taille maximale: ${maxSize}MB`)
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()
      onFileUploaded(result)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Erreur lors de l'upload du fichier")
    } finally {
      setUploading(false)
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
    return type === "image" ? <ImageIcon className="h-8 w-8" /> : <File className="h-8 w-8" />
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragOver ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-gray-500"}
          ${uploading ? "opacity-50 pointer-events-none" : "cursor-pointer"}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptString()}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          {getIcon()}
          <div className="text-sm text-gray-300">
            {uploading ? (
              "Upload en cours..."
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

      {currentUrl && (
        <div className="flex items-center gap-2 p-2 bg-gray-800 rounded border border-gray-600">
          {type === "image" ? <ImageIcon className="h-4 w-4" /> : <File className="h-4 w-4" />}
          <span className="text-sm text-gray-300 flex-1 truncate">
            {currentUrl.split("/").pop() || "Fichier uploadé"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onFileUploaded({ url: "", filename: "", size: 0, type: "" })
            }}
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

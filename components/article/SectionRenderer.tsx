"use client"

import { useState } from "react"
import DOMPurify from "dompurify"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import type { ArticleSection } from "@/types/sections"

interface SectionRendererProps {
  sections: ArticleSection[]
}

export default function SectionRenderer({ sections }: SectionRendererProps) {
  if (!sections || sections.length === 0) return null

  // Sort sections by order_index
  const sortedSections = [...sections].sort((a, b) => a.order_index - b.order_index)

  return (
    <div className="space-y-8">
      {sortedSections.map((section) => (
        <SectionComponent key={section.id} section={section} />
      ))}
    </div>
  )
}

function SectionComponent({ section }: { section: ArticleSection }) {
  const getAlignmentClasses = (alignment: string, hasMedia = false) => {
    if (!hasMedia) return "text-center"

    switch (alignment) {
      case "left":
        return "md:flex md:items-start md:gap-6"
      case "right":
        return "md:flex md:flex-row-reverse md:items-start md:gap-6"
      case "center":
      default:
        return "text-center"
    }
  }

  const getMediaClasses = (alignment: string) => {
    switch (alignment) {
      case "left":
      case "right":
        return "md:w-1/2 flex-shrink-0"
      case "center":
      default:
        return "w-full"
    }
  }

  const getTextClasses = (alignment: string) => {
    switch (alignment) {
      case "left":
      case "right":
        return "md:w-1/2 flex-grow"
      case "center":
      default:
        return "w-full mt-4"
    }
  }

  switch (section.section_type) {
    case "texte_markdown":
      return (
        <div className="prose prose-lg max-w-none">
          {section.title && <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>}
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(renderMarkdown(section.content.markdown || "")),
            }}
          />
        </div>
      )

    case "image":
      return (
        <div className={`section-image ${getAlignmentClasses(section.alignment, true)}`}>
          <div className={getMediaClasses(section.alignment)}>
            <img
              src={section.content.url || "/placeholder.svg"}
              alt={section.content.alt_text}
              className="w-full h-auto rounded-lg shadow-md"
              loading="lazy"
            />
          </div>
          {(section.title || section.content.caption) && (
            <div className={getTextClasses(section.alignment)}>
              {section.title && <h3 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h3>}
              {section.content.caption && <p className="text-gray-600 italic">{section.content.caption}</p>}
            </div>
          )}
        </div>
      )

    case "video":
      return (
        <div className={`section-video ${getAlignmentClasses(section.alignment, true)}`}>
          <div className={getMediaClasses(section.alignment)}>
            <VideoPlayer url={section.content.url} />
          </div>
          {(section.title || section.content.caption) && (
            <div className={getTextClasses(section.alignment)}>
              {section.title && <h3 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h3>}
              {section.content.caption && <p className="text-gray-600">{section.content.caption}</p>}
            </div>
          )}
        </div>
      )

    case "produit_affilie":
      return (
        <Card className={`section-affiliate ${getAlignmentClasses(section.alignment, !!section.content.image_url)}`}>
          <CardContent className="p-6">
            {section.content.image_url && (
              <div className={getMediaClasses(section.alignment)}>
                <img
                  src={section.content.image_url || "/placeholder.svg"}
                  alt={section.content.product_name}
                  className="w-full h-48 object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            )}
            <div className={section.content.image_url ? getTextClasses(section.alignment) : "w-full"}>
              {section.title && <h3 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h3>}
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{section.content.product_name}</h4>
              {section.content.price && (
                <Badge variant="secondary" className="mb-3">
                  {section.content.price}
                </Badge>
              )}
              {section.content.description && <p className="text-gray-600 mb-4">{section.content.description}</p>}
              <div className="flex gap-3">
                <Button asChild>
                  <a
                    href={section.content.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Découvrir l'offre
                  </a>
                </Button>
                {section.content.product_url !== section.content.affiliate_url && (
                  <Button variant="outline" asChild>
                    <a
                      href={section.content.product_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      En savoir plus
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )

    case "fichier":
      return (
        <Card className="section-file">
          <CardContent className="p-6">
            {section.title && <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Download className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{section.content.file_name}</div>
                  <div className="text-sm text-gray-500">
                    {section.content.file_type} • {formatFileSize(section.content.file_size)}
                  </div>
                </div>
              </div>
              <Button asChild>
                <a
                  href={section.content.file_url}
                  download={section.content.file_name}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Télécharger
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )

    case "galerie":
      return (
        <div className="section-gallery">
          {section.title && <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>}
          <ImageGallery images={section.content.images || []} />
        </div>
      )

    case "citation":
      return (
        <Card className="section-quote border-l-4 border-l-blue-500 bg-blue-50">
          <CardContent className="p-6">
            {section.title && <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>}
            <blockquote className="text-lg italic text-gray-700 mb-4">"{section.content.quote}"</blockquote>
            {(section.content.author || section.content.source) && (
              <div className="text-sm text-gray-600">
                {section.content.author && <span>— {section.content.author}</span>}
                {section.content.source && <span className="ml-2">({section.content.source})</span>}
              </div>
            )}
          </CardContent>
        </Card>
      )

    case "code":
      return (
        <div className="section-code">
          {section.title && <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>}
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            {(section.content.language || section.content.filename) && (
              <div className="bg-gray-800 px-4 py-2 text-sm text-gray-300 flex items-center justify-between">
                <span>
                  {section.content.filename && <span className="mr-2">{section.content.filename}</span>}
                  {section.content.language && (
                    <Badge variant="outline" className="text-xs">
                      {section.content.language}
                    </Badge>
                  )}
                </span>
              </div>
            )}
            <pre className="p-4 text-sm text-gray-100 overflow-x-auto">
              <code>{section.content.code}</code>
            </pre>
          </div>
        </div>
      )

    default:
      return null
  }
}

function VideoPlayer({ url }: { url: string }) {
  const [isPlaying, setIsPlaying] = useState(false)

  // Extract video ID for YouTube/Vimeo embeds
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
      return `https://www.youtube.com/embed/${videoId}`
    }
    if (url.includes("vimeo.com")) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1]
      return `https://player.vimeo.com/video/${videoId}`
    }
    return url
  }

  return (
    <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
      <iframe src={getEmbedUrl(url)} className="w-full h-full" allowFullScreen loading="lazy" />
    </div>
  )
}

function ImageGallery({ images }: { images: Array<{ url: string; alt_text: string; caption?: string }> }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) return null

  if (images.length === 1) {
    return (
      <div className="w-full">
        <img
          src={images[0].url || "/placeholder.svg"}
          alt={images[0].alt_text}
          className="w-full h-auto rounded-lg shadow-md"
          loading="lazy"
        />
        {images[0].caption && <p className="text-center text-gray-600 italic mt-2">{images[0].caption}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative">
        <img
          src={images[currentIndex].url || "/placeholder.svg"}
          alt={images[currentIndex].alt_text}
          className="w-full h-auto rounded-lg shadow-md"
          loading="lazy"
        />
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Caption */}
      {images[currentIndex].caption && (
        <p className="text-center text-gray-600 italic">{images[currentIndex].caption}</p>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 justify-center overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                index === currentIndex ? "border-blue-500" : "border-gray-200"
              }`}
            >
              <img src={image.url || "/placeholder.svg"} alt={image.alt_text} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function renderMarkdown(markdown: string): string {
  if (!markdown) return ""

  // Basic markdown to HTML conversion
  return (
    markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-900 mt-8 mb-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-6">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mt-12 mb-8">$1</h1>')

      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

      // Links
      .replace(
        /\[([^\]]+)\]$$([^)]+)$$/g,
        '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>',
      )

      // Lists
      .replace(/^[*-] (.*$)/gim, '<li class="mb-2">$1</li>')

      // Paragraphs
      .split("\n\n")
      .map((paragraph) => {
        paragraph = paragraph.trim()
        if (!paragraph) return ""

        // Don't wrap headers, lists in paragraphs
        if (
          paragraph.startsWith("<h") ||
          paragraph.startsWith("<li") ||
          paragraph.startsWith("<ul") ||
          paragraph.startsWith("<ol")
        ) {
          return paragraph
        }

        // Wrap lists
        if (paragraph.includes("<li")) {
          return `<ul class="list-disc list-inside space-y-2 mb-6">${paragraph}</ul>`
        }

        return `<p class="mb-6 text-gray-700 leading-relaxed">${paragraph}</p>`
      })
      .join("\n")
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

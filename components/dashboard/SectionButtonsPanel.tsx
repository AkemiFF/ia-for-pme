"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ImageIcon, Video, ExternalLink, Paperclip, Images, Quote, Code } from "lucide-react"
import type { ArticleSection } from "@/types/sections"

interface SectionButtonsPanelProps {
  onAddSection: (type: ArticleSection["type"]) => void
}

export default function SectionButtonsPanel({ onAddSection }: SectionButtonsPanelProps) {
  const sectionTypes = [
    {
      type: "texte_markdown" as const,
      label: "Texte Markdown",
      icon: FileText,
      description: "Ajouter du contenu texte avec formatage Markdown",
    },
    {
      type: "image" as const,
      label: "Image",
      icon: ImageIcon,
      description: "Insérer une image avec légende",
    },
    {
      type: "video" as const,
      label: "Vidéo",
      icon: Video,
      description: "Intégrer une vidéo YouTube ou Vimeo",
    },
    {
      type: "produit_affilie" as const,
      label: "Produit Affilié",
      icon: ExternalLink,
      description: "Recommander un outil ou service",
    },
    {
      type: "fichier" as const,
      label: "Fichier",
      icon: Paperclip,
      description: "Joindre un fichier téléchargeable",
    },
    {
      type: "galerie" as const,
      label: "Galerie",
      icon: Images,
      description: "Créer une galerie d'images",
    },
    {
      type: "citations" as const,
      label: "Citation",
      icon: Quote,
      description: "Ajouter une citation mise en valeur",
    },
    {
      type: "code" as const,
      label: "Code",
      icon: Code,
      description: "Insérer un bloc de code avec coloration syntaxique",
    },
  ]

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Ajouter une section</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {sectionTypes.map((section) => (
            <Button
              key={section.type}
              variant="outline"
              onClick={() => onAddSection(section.type)}
              className="h-auto p-4 flex flex-col items-center gap-2 bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-200 hover:text-white"
            >
              <section.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{section.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  GripVertical,
  Edit,
  Trash2,
  Plus,
  FileText,
  ImageIcon,
  Video,
  Package,
  File,
  Images,
  Quote,
  Code,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import type { ArticleSection, SectionType, SectionAlignment, SectionFormData } from "@/types/sections"

interface SectionEditorProps {
  sections: ArticleSection[]
  onSectionsChange: (sections: ArticleSection[]) => void
}

const SECTION_TYPES: { value: SectionType; label: string; icon: any }[] = [
  { value: "texte_markdown", label: "Texte Markdown", icon: FileText },
  { value: "image", label: "Image", icon: ImageIcon },
  { value: "video", label: "Vidéo", icon: Video },
  { value: "produit_affilie", label: "Produit Affilié", icon: Package },
  { value: "fichier", label: "Fichier", icon: File },
  { value: "galerie", label: "Galerie", icon: Images },
  { value: "citation", label: "Citation", icon: Quote },
  { value: "code", label: "Code", icon: Code },
]

const ALIGNMENT_OPTIONS: { value: SectionAlignment; label: string }[] = [
  { value: "left", label: "Gauche" },
  { value: "center", label: "Centre" },
  { value: "right", label: "Droite" },
]

export default function SectionEditor({ sections, onSectionsChange }: SectionEditorProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [showAddSection, setShowAddSection] = useState(false)

  const addSection = (sectionData: SectionFormData) => {
    const newSection: ArticleSection = {
      id: `temp-${Date.now()}`,
      article_id: "",
      section_type: sectionData.section_type,
      order_index: sections.length,
      title: sectionData.title,
      alignment: sectionData.alignment,
      content: sectionData.content,
      metadata: sectionData.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as ArticleSection

    onSectionsChange([...sections, newSection])
    setShowAddSection(false)
  }

  const updateSection = (sectionId: string, updates: Partial<ArticleSection>) => {
    const updatedSections = sections.map((section) =>
      section.id === sectionId ? { ...section, ...updates, updated_at: new Date().toISOString() } : section,
    )
    onSectionsChange(updatedSections)
    setEditingSection(null)
  }

  const deleteSection = (sectionId: string) => {
    const filteredSections = sections
      .filter((section) => section.id !== sectionId)
      .map((section, index) => ({ ...section, order_index: index }))
    onSectionsChange(filteredSections)
  }

  const moveSection = (sectionId: string, direction: "up" | "down") => {
    const currentIndex = sections.findIndex((s) => s.id === sectionId)
    if (currentIndex === -1) return

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= sections.length) return

    const newSections = [...sections]
    const [movedSection] = newSections.splice(currentIndex, 1)
    newSections.splice(newIndex, 0, movedSection)

    // Update order_index for all sections
    const reorderedSections = newSections.map((section, index) => ({
      ...section,
      order_index: index,
    }))

    onSectionsChange(reorderedSections)
  }

  const getSectionIcon = (type: SectionType) => {
    const sectionType = SECTION_TYPES.find((t) => t.value === type)
    const Icon = sectionType?.icon || FileText
    return <Icon className="h-4 w-4" />
  }

  const getSectionPreview = (section: ArticleSection) => {
    switch (section.section_type) {
      case "texte_markdown":
        return section.content.markdown?.substring(0, 100) + "..." || "Contenu markdown"
      case "image":
        return section.content.alt_text || "Image"
      case "video":
        return section.content.caption || "Vidéo"
      case "produit_affilie":
        return section.content.product_name || "Produit affilié"
      case "fichier":
        return section.content.file_name || "Fichier"
      case "galerie":
        return `${section.content.images?.length || 0} images`
      case "citation":
        return section.content.quote?.substring(0, 50) + "..." || "Citation"
      case "code":
        return `Code ${section.content.language || ""}`
      default:
        return "Section"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sections de l'article</h3>
        <Button onClick={() => setShowAddSection(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une section
        </Button>
      </div>

      {/* Existing sections */}
      <div className="space-y-3">
        {sections.map((section, index) => (
          <Card key={section.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                  {getSectionIcon(section.section_type)}
                  <div>
                    <div className="font-medium">
                      {section.title || SECTION_TYPES.find((t) => t.value === section.section_type)?.label}
                    </div>
                    <div className="text-sm text-gray-500">{getSectionPreview(section)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{section.alignment}</Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSection(section.id, "up")}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSection(section.id, "down")}
                      disabled={index === sections.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditingSection(section.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteSection(section.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Add section form */}
      {showAddSection && <AddSectionForm onAdd={addSection} onCancel={() => setShowAddSection(false)} />}

      {/* Edit section form */}
      {editingSection && (
        <EditSectionForm
          section={sections.find((s) => s.id === editingSection)!}
          onUpdate={updateSection}
          onCancel={() => setEditingSection(null)}
        />
      )}
    </div>
  )
}

function AddSectionForm({
  onAdd,
  onCancel,
}: {
  onAdd: (data: SectionFormData) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<SectionFormData>({
    section_type: "texte_markdown",
    alignment: "center",
    content: {},
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(formData)
  }

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle>Ajouter une section</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type de section</Label>
              <Select
                value={formData.section_type}
                onValueChange={(value: SectionType) =>
                  setFormData((prev) => ({ ...prev, section_type: value, content: {} }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Alignement</Label>
              <Select
                value={formData.alignment}
                onValueChange={(value: SectionAlignment) => setFormData((prev) => ({ ...prev, alignment: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALIGNMENT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Titre (optionnel)</Label>
            <Input
              value={formData.title || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Titre de la section"
            />
          </div>

          <SectionContentForm
            sectionType={formData.section_type}
            content={formData.content}
            onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
          />

          <div className="flex gap-2">
            <Button type="submit">Ajouter</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function EditSectionForm({
  section,
  onUpdate,
  onCancel,
}: {
  section: ArticleSection
  onUpdate: (sectionId: string, updates: Partial<ArticleSection>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: section.title || "",
    alignment: section.alignment,
    content: section.content,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(section.id, formData)
  }

  return (
    <Card className="border-green-200">
      <CardHeader>
        <CardTitle>Modifier la section</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Titre (optionnel)</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Titre de la section"
              />
            </div>
            <div>
              <Label>Alignement</Label>
              <Select
                value={formData.alignment}
                onValueChange={(value: SectionAlignment) => setFormData((prev) => ({ ...prev, alignment: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALIGNMENT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <SectionContentForm
            sectionType={section.section_type}
            content={formData.content}
            onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
          />

          <div className="flex gap-2">
            <Button type="submit">Mettre à jour</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function SectionContentForm({
  sectionType,
  content,
  onChange,
}: {
  sectionType: SectionType
  content: Record<string, any>
  onChange: (content: Record<string, any>) => void
}) {
  switch (sectionType) {
    case "texte_markdown":
      return (
        <div>
          <Label>Contenu Markdown</Label>
          <Textarea
            rows={6}
            value={content.markdown || ""}
            onChange={(e) => onChange({ ...content, markdown: e.target.value })}
            placeholder="# Titre\n\nVotre contenu en Markdown..."
          />
        </div>
      )

    case "image":
      return (
        <div className="space-y-3">
          <div>
            <Label>URL de l'image</Label>
            <Input
              value={content.url || ""}
              onChange={(e) => onChange({ ...content, url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <Label>Texte alternatif</Label>
            <Input
              value={content.alt_text || ""}
              onChange={(e) => onChange({ ...content, alt_text: e.target.value })}
              placeholder="Description de l'image"
            />
          </div>
          <div>
            <Label>Légende (optionnel)</Label>
            <Input
              value={content.caption || ""}
              onChange={(e) => onChange({ ...content, caption: e.target.value })}
              placeholder="Légende de l'image"
            />
          </div>
        </div>
      )

    case "video":
      return (
        <div className="space-y-3">
          <div>
            <Label>URL de la vidéo</Label>
            <Input
              value={content.url || ""}
              onChange={(e) => onChange({ ...content, url: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
          <div>
            <Label>Légende (optionnel)</Label>
            <Input
              value={content.caption || ""}
              onChange={(e) => onChange({ ...content, caption: e.target.value })}
              placeholder="Description de la vidéo"
            />
          </div>
        </div>
      )

    case "produit_affilie":
      return (
        <div className="space-y-3">
          <div>
            <Label>Nom du produit</Label>
            <Input
              value={content.product_name || ""}
              onChange={(e) => onChange({ ...content, product_name: e.target.value })}
              placeholder="Nom du produit"
            />
          </div>
          <div>
            <Label>URL du produit</Label>
            <Input
              value={content.product_url || ""}
              onChange={(e) => onChange({ ...content, product_url: e.target.value })}
              placeholder="https://example.com/product"
            />
          </div>
          <div>
            <Label>Lien d'affiliation</Label>
            <Input
              value={content.affiliate_url || ""}
              onChange={(e) => onChange({ ...content, affiliate_url: e.target.value })}
              placeholder="https://affiliate.com/..."
            />
          </div>
          <div>
            <Label>Image du produit (optionnel)</Label>
            <Input
              value={content.image_url || ""}
              onChange={(e) => onChange({ ...content, image_url: e.target.value })}
              placeholder="https://example.com/product-image.jpg"
            />
          </div>
          <div>
            <Label>Prix (optionnel)</Label>
            <Input
              value={content.price || ""}
              onChange={(e) => onChange({ ...content, price: e.target.value })}
              placeholder="29€/mois"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content.description || ""}
              onChange={(e) => onChange({ ...content, description: e.target.value })}
              placeholder="Description du produit"
            />
          </div>
        </div>
      )

    case "citation":
      return (
        <div className="space-y-3">
          <div>
            <Label>Citation</Label>
            <Textarea
              value={content.quote || ""}
              onChange={(e) => onChange({ ...content, quote: e.target.value })}
              placeholder="Votre citation..."
            />
          </div>
          <div>
            <Label>Auteur (optionnel)</Label>
            <Input
              value={content.author || ""}
              onChange={(e) => onChange({ ...content, author: e.target.value })}
              placeholder="Nom de l'auteur"
            />
          </div>
          <div>
            <Label>Source (optionnel)</Label>
            <Input
              value={content.source || ""}
              onChange={(e) => onChange({ ...content, source: e.target.value })}
              placeholder="Source de la citation"
            />
          </div>
        </div>
      )

    case "code":
      return (
        <div className="space-y-3">
          <div>
            <Label>Code</Label>
            <Textarea
              rows={8}
              value={content.code || ""}
              onChange={(e) => onChange({ ...content, code: e.target.value })}
              placeholder="Votre code..."
              className="font-mono"
            />
          </div>
          <div>
            <Label>Langage (optionnel)</Label>
            <Input
              value={content.language || ""}
              onChange={(e) => onChange({ ...content, language: e.target.value })}
              placeholder="javascript, python, css..."
            />
          </div>
          <div>
            <Label>Nom du fichier (optionnel)</Label>
            <Input
              value={content.filename || ""}
              onChange={(e) => onChange({ ...content, filename: e.target.value })}
              placeholder="example.js"
            />
          </div>
        </div>
      )

    default:
      return (
        <div>
          <Label>Contenu</Label>
          <Textarea
            value={JSON.stringify(content, null, 2)}
            onChange={(e) => {
              try {
                onChange(JSON.parse(e.target.value))
              } catch {
                // Invalid JSON, ignore
              }
            }}
            placeholder="Contenu JSON"
          />
        </div>
      )
  }
}

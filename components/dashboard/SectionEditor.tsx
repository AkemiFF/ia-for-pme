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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  GripVertical,
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
import FileUpload from "./FileUpload"

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

  const getSectionIcon = (section: ArticleSection) => {
    const type = section.section_type || (section as any).type // Handle both structures
    const sectionType = SECTION_TYPES.find((t) => t.value === type)
    const Icon = sectionType?.icon || FileText
    return <Icon className="h-4 w-4" />
  }

  const getSectionPreview = (section: ArticleSection) => {
    const type = section.section_type || (section as any).type // Handle both structures
    switch (type) {
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
      case "citations":
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
        <div>
          <h3 className="text-lg font-semibold text-white">Sections de l'article</h3>
          <p className="text-sm text-gray-400">Organisez votre contenu en sections structurées</p>
        </div>
        <Button onClick={() => setShowAddSection(true)} size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une section
        </Button>
      </div>

      {/* Existing sections */}
      <div className="space-y-3">
        {sections.map((section, index) => (
          <Card key={section.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                  {getSectionIcon(section)}
                  <div>
                    <div className="font-medium text-white">
                      Section {index + 1}:{" "}
                      {SECTION_TYPES.find((t) => t.value === (section.section_type || (section as any).type))?.label}
                    </div>
                    {section.title && <div className="text-sm text-gray-400">{section.title}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {section.alignment}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSection(section.id, "up")}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSection(section.id, "down")}
                      disabled={index === sections.length - 1}
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSection(section.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Titre (optionnel)</Label>
                    <Input
                      value={section.title || ""}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      placeholder="Titre de la section"
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Alignement</Label>
                    <Select
                      value={section.alignment}
                      onValueChange={(value: SectionAlignment) => updateSection(section.id, { alignment: value })}
                    >
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {ALIGNMENT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Handle both structures */}
                <SectionContentForm
                  sectionType={section.section_type || (section as any).type}
                  content={section.content}
                  onChange={(content) => updateSection(section.id, { content })}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add section form */}
      {showAddSection && <AddSectionForm onAdd={addSection} onCancel={() => setShowAddSection(false)} />}
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
    <Card className="bg-gray-800 border-blue-500">
      <CardHeader>
        <CardTitle className="text-white">Ajouter une section</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Type de section</Label>
              <Select
                value={formData.section_type}
                onValueChange={(value: SectionType) =>
                  setFormData((prev) => ({ ...prev, section_type: value, content: {} }))
                }
              >
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {SECTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-white hover:bg-gray-700">
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
              <Label className="text-gray-300">Alignement</Label>
              <Select
                value={formData.alignment}
                onValueChange={(value: SectionAlignment) => setFormData((prev) => ({ ...prev, alignment: value }))}
              >
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {ALIGNMENT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-gray-300">Titre (optionnel)</Label>
            <Input
              value={formData.title || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Titre de la section"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>

          <SectionContentForm
            sectionType={formData.section_type}
            content={formData.content}
            onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
          />

          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Ajouter
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
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
  console.log("[v0] SectionContentForm rendering:", { sectionType, content })

  switch (sectionType) {
    case "texte_markdown":
      return (
        <div>
          <Label className="text-gray-300">Contenu Markdown</Label>
          <Textarea
            rows={6}
            value={content.markdown || ""}
            onChange={(e) => onChange({ ...content, markdown: e.target.value })}
            placeholder="# Titre&#10;&#10;Votre contenu en Markdown..."
            className="bg-gray-900 border-gray-700 text-white"
          />
        </div>
      )

    case "image":
      return (
        <div className="space-y-4">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="upload" className="data-[state=active]:bg-gray-700">
                Upload
              </TabsTrigger>
              <TabsTrigger value="url" className="data-[state=active]:bg-gray-700">
                URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-3">
              <div>
                <Label className="text-gray-300">Importer une image</Label>
                <FileUpload
                  type="image"
                  accept="image/*"
                  maxSize={5}
                  currentUrl={content.url}
                  onFileUploaded={(fileData) => {
                    onChange({
                      ...content,
                      url: fileData.url,
                      alt_text: content.alt_text || fileData.filename.split(".")[0],
                    })
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-3">
              <div>
                <Label className="text-gray-300">URL de l'image</Label>
                <Input
                  value={content.url || ""}
                  onChange={(e) => onChange({ ...content, url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div>
            <Label className="text-gray-300">Texte alternatif</Label>
            <Input
              value={content.alt_text || ""}
              onChange={(e) => onChange({ ...content, alt_text: e.target.value })}
              placeholder="Description de l'image"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Légende (optionnel)</Label>
            <Input
              value={content.caption || ""}
              onChange={(e) => onChange({ ...content, caption: e.target.value })}
              placeholder="Légende de l'image"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
        </div>
      )

    case "video":
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-gray-300">URL de la vidéo</Label>
            <Input
              value={content.url || ""}
              onChange={(e) => onChange({ ...content, url: e.target.value })}
              placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Miniature (optionnel)</Label>
            <Input
              value={content.thumbnail || ""}
              onChange={(e) => onChange({ ...content, thumbnail: e.target.value })}
              placeholder="https://example.com/thumbnail.jpg"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Durée en secondes (optionnel)</Label>
            <Input
              type="number"
              value={content.duration || ""}
              onChange={(e) => onChange({ ...content, duration: Number.parseInt(e.target.value) || undefined })}
              placeholder="120"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Légende (optionnel)</Label>
            <Input
              value={content.caption || ""}
              onChange={(e) => onChange({ ...content, caption: e.target.value })}
              placeholder="Description de la vidéo"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
        </div>
      )

    case "produit_affilie":
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-gray-300">Nom du produit</Label>
            <Input
              value={content.product_name || ""}
              onChange={(e) => onChange({ ...content, product_name: e.target.value })}
              placeholder="Nom du produit"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">URL du produit</Label>
            <Input
              value={content.product_url || ""}
              onChange={(e) => onChange({ ...content, product_url: e.target.value })}
              placeholder="https://example.com/product"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Lien d'affiliation</Label>
            <Input
              value={content.affiliate_url || ""}
              onChange={(e) => onChange({ ...content, affiliate_url: e.target.value })}
              placeholder="https://affiliate.com/..."
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Image du produit (optionnel)</Label>
            <Input
              value={content.image_url || ""}
              onChange={(e) => onChange({ ...content, image_url: e.target.value })}
              placeholder="https://example.com/product-image.jpg"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Prix (optionnel)</Label>
            <Input
              value={content.price || ""}
              onChange={(e) => onChange({ ...content, price: e.target.value })}
              placeholder="29€/mois"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Description</Label>
            <Textarea
              value={content.description || ""}
              onChange={(e) => onChange({ ...content, description: e.target.value })}
              placeholder="Description du produit"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
        </div>
      )

    case "fichier":
      return (
        <div className="space-y-4">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="upload" className="data-[state=active]:bg-gray-700">
                Upload
              </TabsTrigger>
              <TabsTrigger value="url" className="data-[state=active]:bg-gray-700">
                URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-3">
              <div>
                <Label className="text-gray-300">Importer un fichier</Label>
                <FileUpload
                  type="file"
                  maxSize={50}
                  currentUrl={content.file_url}
                  onFileUploaded={(fileData) => {
                    onChange({
                      ...content,
                      file_url: fileData.url,
                      file_name: fileData.filename,
                      file_size: fileData.size,
                      file_type: fileData.type,
                    })
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-3">
              <div>
                <Label className="text-gray-300">URL du fichier</Label>
                <Input
                  value={content.file_url || ""}
                  onChange={(e) => onChange({ ...content, file_url: e.target.value })}
                  placeholder="https://example.com/document.pdf"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Nom du fichier</Label>
                <Input
                  value={content.file_name || ""}
                  onChange={(e) => onChange({ ...content, file_name: e.target.value })}
                  placeholder="document.pdf"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-gray-300">Taille du fichier en octets (optionnel)</Label>
              <Input
                type="number"
                value={content.file_size || ""}
                onChange={(e) => onChange({ ...content, file_size: Number.parseInt(e.target.value) || undefined })}
                placeholder="2500000"
                className="bg-gray-900 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Type de fichier</Label>
              <Input
                value={content.file_type || ""}
                onChange={(e) => onChange({ ...content, file_type: e.target.value })}
                placeholder="application/pdf"
                className="bg-gray-900 border-gray-700 text-white"
              />
            </div>
          </div>
        </div>
      )

    case "galerie":
      const images = content.images || []
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-gray-300">Images de la galerie</Label>
            <div className="space-y-3">
              {images.map((image: any, index: number) => (
                <div key={index} className="p-4 bg-gray-800 rounded border border-gray-600">
                  <div className="space-y-3">
                    <Tabs defaultValue="upload" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                        <TabsTrigger value="upload" className="data-[state=active]:bg-gray-600">
                          Upload
                        </TabsTrigger>
                        <TabsTrigger value="url" className="data-[state=active]:bg-gray-600">
                          URL
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="upload">
                        <FileUpload
                          type="image"
                          accept="image/*"
                          maxSize={5}
                          currentUrl={image.url}
                          onFileUploaded={(fileData) => {
                            const newImages = [...images]
                            newImages[index] = {
                              ...image,
                              url: fileData.url,
                              alt_text: image.alt_text || fileData.filename.split(".")[0],
                            }
                            onChange({ ...content, images: newImages })
                          }}
                        />
                      </TabsContent>

                      <TabsContent value="url">
                        <Input
                          value={image.url || ""}
                          onChange={(e) => {
                            const newImages = [...images]
                            newImages[index] = { ...image, url: e.target.value }
                            onChange({ ...content, images: newImages })
                          }}
                          placeholder="https://example.com/image.jpg"
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </TabsContent>
                    </Tabs>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm text-gray-400">Texte alternatif</Label>
                        <Input
                          value={image.alt_text || ""}
                          onChange={(e) => {
                            const newImages = [...images]
                            newImages[index] = { ...image, alt_text: e.target.value }
                            onChange({ ...content, images: newImages })
                          }}
                          placeholder="Description"
                          className="bg-gray-900 border-gray-700 text-white text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-gray-400">Légende</Label>
                        <Input
                          value={image.caption || ""}
                          onChange={(e) => {
                            const newImages = [...images]
                            newImages[index] = { ...image, caption: e.target.value }
                            onChange({ ...content, images: newImages })
                          }}
                          placeholder="Légende (optionnel)"
                          className="bg-gray-900 border-gray-700 text-white text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newImages = images.filter((_: any, i: number) => i !== index)
                          onChange({ ...content, images: newImages })
                        }}
                        className="border-red-600 text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const newImages = [...images, { url: "", alt_text: "", caption: "" }]
                  onChange({ ...content, images: newImages })
                }}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une image
              </Button>
            </div>
          </div>
        </div>
      )

    case "citation":
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-gray-300">Citation</Label>
            <Textarea
              value={content.quote || ""}
              onChange={(e) => onChange({ ...content, quote: e.target.value })}
              placeholder="Votre citation..."
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Auteur (optionnel)</Label>
            <Input
              value={content.author || ""}
              onChange={(e) => onChange({ ...content, author: e.target.value })}
              placeholder="Nom de l'auteur"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Source (optionnel)</Label>
            <Input
              value={content.source || ""}
              onChange={(e) => onChange({ ...content, source: e.target.value })}
              placeholder="Source de la citation"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
        </div>
      )

    case "code":
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-gray-300">Code</Label>
            <Textarea
              rows={8}
              value={content.code || ""}
              onChange={(e) => onChange({ ...content, code: e.target.value })}
              placeholder="Votre code..."
              className="font-mono bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-gray-300">Langage (optionnel)</Label>
              <Input
                value={content.language || ""}
                onChange={(e) => onChange({ ...content, language: e.target.value })}
                placeholder="javascript, python, css..."
                className="bg-gray-900 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Nom du fichier (optionnel)</Label>
              <Input
                value={content.filename || ""}
                onChange={(e) => onChange({ ...content, filename: e.target.value })}
                placeholder="example.js"
                className="bg-gray-900 border-gray-700 text-white"
              />
            </div>
          </div>
        </div>
      )

    default:
      console.log("[v0] Unknown section type:", sectionType)
      return (
        <div>
          <Label className="text-gray-300">Configuration personnalisée</Label>
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
            className="bg-gray-900 border-gray-700 text-white font-mono"
          />
        </div>
      )
  }
}

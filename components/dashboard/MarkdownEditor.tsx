"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

interface ToolbarButton {
  icon: string
  label: string
  action: () => void
  shortcut?: string
}

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Insert text at cursor position
  const insertText = useCallback(
    (before: string, after = "", placeholder = "") => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = value.substring(start, end)
      const textToInsert = selectedText || placeholder

      const newValue = value.substring(0, start) + before + textToInsert + after + value.substring(end)
      onChange(newValue)

      // Restore cursor position
      setTimeout(() => {
        textarea.focus()
        const newCursorPos = start + before.length + textToInsert.length
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }, 0)
    },
    [value, onChange],
  )

  // Toolbar actions
  const toolbarButtons: ToolbarButton[] = [
    {
      icon: "H1",
      label: "Titre 1",
      action: () => insertText("# ", "", "Titre principal"),
      shortcut: "Ctrl+1",
    },
    {
      icon: "H2",
      label: "Titre 2",
      action: () => insertText("## ", "", "Sous-titre"),
      shortcut: "Ctrl+2",
    },
    {
      icon: "H3",
      label: "Titre 3",
      action: () => insertText("### ", "", "Titre de section"),
      shortcut: "Ctrl+3",
    },
    {
      icon: "B",
      label: "Gras",
      action: () => insertText("**", "**", "texte en gras"),
      shortcut: "Ctrl+B",
    },
    {
      icon: "I",
      label: "Italique",
      action: () => insertText("*", "*", "texte en italique"),
      shortcut: "Ctrl+I",
    },
    {
      icon: "🔗",
      label: "Lien",
      action: () => insertText("[", "](https://)", "texte du lien"),
      shortcut: "Ctrl+K",
    },
    {
      icon: "📷",
      label: "Image",
      action: () => insertText("![", "](https://)", "alt text"),
      shortcut: "Ctrl+Shift+I",
    },
    {
      icon: "📹",
      label: "Vidéo",
      action: () =>
        insertText('\n<video controls>\n  <source src="', '" type="video/mp4">\n</video>\n', "url-video.mp4"),
    },
    {
      icon: "📋",
      label: "Code",
      action: () => insertText("`", "`", "code"),
      shortcut: "Ctrl+`",
    },
    {
      icon: "📝",
      label: "Bloc de code",
      action: () => insertText("```\n", "\n```", "votre code ici"),
      shortcut: "Ctrl+Shift+`",
    },
    {
      icon: "📄",
      label: "Citation",
      action: () => insertText("> ", "", "Citation importante"),
    },
    {
      icon: "📊",
      label: "Liste",
      action: () => insertText("- ", "", "Élément de liste"),
    },
    {
      icon: "🔢",
      label: "Liste numérotée",
      action: () => insertText("1. ", "", "Premier élément"),
    },
    {
      icon: "📋",
      label: "Tableau",
      action: () =>
        insertText(
          "\n| Colonne 1 | Colonne 2 | Colonne 3 |\n|-----------|-----------|----------|\n| ",
          " | Données | Données |\n",
          "Données",
        ),
    },
    {
      icon: "⚠️",
      label: "Alerte",
      action: () => insertText("\n> ⚠️ **Important** : ", "\n", "Votre message d'alerte"),
    },
    {
      icon: "💡",
      label: "Conseil",
      action: () => insertText("\n> 💡 **Conseil** : ", "\n", "Votre conseil pratique"),
    },
  ]

  // Simple markdown to HTML converter for preview
  const markdownToHtml = (markdown: string) => {
    return markdown
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/!\[([^\]]*)\]$$([^$$]*)\)/gim, '<img alt="$1" src="$2" />')
      .replace(/\[([^\]]*)\]$$([^$$]*)\)/gim, '<a href="$2">$1</a>')
      .replace(/`([^`]*)`/gim, "<code>$1</code>")
      .replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
      .replace(/\n/gim, "<br>")
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "1":
          e.preventDefault()
          insertText("# ", "", "Titre principal")
          break
        case "2":
          e.preventDefault()
          insertText("## ", "", "Sous-titre")
          break
        case "3":
          e.preventDefault()
          insertText("### ", "", "Titre de section")
          break
        case "b":
          e.preventDefault()
          insertText("**", "**", "texte en gras")
          break
        case "i":
          e.preventDefault()
          insertText("*", "*", "texte en italique")
          break
        case "k":
          e.preventDefault()
          insertText("[", "](https://)", "texte du lien")
          break
        case "`":
          e.preventDefault()
          if (e.shiftKey) {
            insertText("```\n", "\n```", "votre code ici")
          } else {
            insertText("`", "`", "code")
          }
          break
      }
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Éditeur Markdown Avancé</CardTitle>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={showPreview ? "outline" : "default"}
              size="sm"
              onClick={() => setShowPreview(false)}
            >
              Édition
            </Button>
            <Button
              type="button"
              variant={showPreview ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPreview(true)}
            >
              Aperçu
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 p-2 bg-gray-50 rounded-md border">
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              onClick={button.action}
              title={`${button.label}${button.shortcut ? ` (${button.shortcut})` : ""}`}
              className="h-8 px-2 text-xs hover:bg-gray-200"
            >
              {button.icon}
            </Button>
          ))}
        </div>

        {/* Editor/Preview */}
        <div className="min-h-[400px]">
          {showPreview ? (
            <div
              className="prose prose-sm max-w-none p-4 border rounded-md bg-white min-h-[400px]"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
            />
          ) : (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || "Écrivez votre contenu en Markdown..."}
              className="w-full min-h-[400px] p-4 border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          )}
        </div>

        {/* Help text */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>Raccourcis clavier :</strong> Ctrl+B (gras), Ctrl+I (italique), Ctrl+K (lien), Ctrl+1/2/3 (titres)
          </p>
          <p>
            <strong>Formats supportés :</strong> Markdown, HTML, images, vidéos, tableaux, listes, citations
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Code, Palette, ShoppingCart, Clock } from "lucide-react"

interface Template {
  id: string
  title: string
  description: string
  sector: string
  icon: React.ReactNode
  difficulty: "Débutant" | "Intermédiaire" | "Expert"
  estimatedTime: string
  content: string
  tags: string[]
}

const templates: Template[] = [
  {
    id: "freelance-graphiste",
    title: "Guide IA pour Graphistes Freelances",
    description: "Comment intégrer l'IA dans votre workflow créatif pour gagner 40% de temps",
    sector: "Graphisme",
    icon: <Palette className="h-5 w-5" />,
    difficulty: "Intermédiaire",
    estimatedTime: "15 min",
    tags: ["design", "créativité", "productivité"],
    content: `# Guide IA pour Graphistes Freelances

## Introduction
L'intelligence artificielle révolutionne le monde du design graphique...

## Outils IA essentiels pour graphistes

### 1. Génération d'images
- **Midjourney** : Pour créer des concepts visuels rapidement
- **DALL-E 3** : Intégré dans ChatGPT Plus
- **Stable Diffusion** : Solution open-source

### 2. Amélioration d'images
- **Topaz Gigapixel AI** : Upscaling professionnel
- **Remove.bg** : Suppression d'arrière-plan automatique

## Workflow optimisé

1. **Brainstorming** avec ChatGPT pour les concepts
2. **Génération** de moodboards avec Midjourney
3. **Création** dans vos outils habituels (Photoshop, Illustrator)
4. **Finalisation** avec les outils d'amélioration IA

## ROI attendu
- Gain de temps : 40%
- Augmentation de la créativité : 60%
- Satisfaction client : +25%

## Conclusion
L'IA ne remplace pas votre créativité, elle la démultiplie...`,
  },
  {
    id: "pme-ecommerce",
    title: "IA pour E-commerce PME",
    description: "Automatiser votre boutique en ligne : chatbots, recommandations, gestion stock",
    sector: "E-commerce",
    icon: <ShoppingCart className="h-5 w-5" />,
    difficulty: "Débutant",
    estimatedTime: "20 min",
    tags: ["e-commerce", "automatisation", "ventes"],
    content: `# IA pour E-commerce PME

## Pourquoi l'IA est cruciale pour votre e-commerce

Les PME e-commerce qui utilisent l'IA voient leurs ventes augmenter de 30% en moyenne...

## Solutions IA par domaine

### 1. Service Client
- **Chatbots intelligents** : Tidio, Intercom, Zendesk
- **Support multilingue** automatique
- **Résolution** de 80% des demandes sans intervention

### 2. Recommandations Produits
- **Algorithmes** de recommandation personnalisée
- **Cross-selling** et up-selling automatiques
- **Augmentation** du panier moyen de 25%

### 3. Gestion des Stocks
- **Prédiction** de la demande
- **Optimisation** des commandes fournisseurs
- **Réduction** des ruptures de stock de 40%

## Outils recommandés par budget

### Budget < 100€/mois
- Tidio (chatbot)
- Google Analytics Intelligence
- Mailchimp (email automation)

### Budget 100-500€/mois
- Klaviyo (email marketing avancé)
- Dynamic Yield (personnalisation)
- Yotpo (avis clients automatisés)

### Budget > 500€/mois
- Salesforce Einstein
- Adobe Target
- Solutions custom avec API OpenAI

## Mise en œuvre étape par étape

1. **Audit** de votre site actuel
2. **Priorisation** des quick wins
3. **Implémentation** progressive
4. **Mesure** des résultats

## ROI typique
- Augmentation des ventes : 20-40%
- Réduction des coûts support : 50%
- Amélioration satisfaction client : 35%`,
  },
  {
    id: "developpeur-freelance",
    title: "IA pour Développeurs Freelances",
    description: "Boostez votre productivité avec les outils de code IA et automatisation",
    sector: "Développement",
    icon: <Code className="h-5 w-5" />,
    difficulty: "Expert",
    estimatedTime: "25 min",
    tags: ["développement", "code", "automatisation"],
    content: `# IA pour Développeurs Freelances

## L'IA change la donne pour les développeurs

En 2024, 87% des développeurs utilisent des outils IA quotidiennement...

## Stack IA pour développeurs

### 1. Assistants de Code
- **GitHub Copilot** : L'incontournable (10$/mois)
- **Cursor** : IDE avec IA intégrée
- **Codeium** : Alternative gratuite à Copilot

### 2. Génération de Code
- **ChatGPT-4** : Pour l'architecture et la logique
- **Claude** : Excellent pour le refactoring
- **Phind** : Spécialisé développement

### 3. Tests et Debug
- **Testim** : Tests automatisés avec IA
- **DeepCode** : Analyse statique intelligente
- **Sentry** : Monitoring avec IA

## Workflows optimisés

### Développement Frontend
1. **Maquette** → Code avec v0.dev
2. **Composants** générés avec Copilot
3. **Tests** automatisés avec Playwright + IA

### Développement Backend
1. **Architecture** planifiée avec ChatGPT
2. **APIs** générées avec Copilot
3. **Documentation** auto avec IA

## Tarification avec IA

Grâce à l'IA, vous pouvez :
- Livrer 2x plus vite
- Augmenter vos tarifs de 30-50%
- Prendre plus de projets simultanément

## Outils par spécialité

### React/Next.js
- v0.dev (Vercel)
- Cursor avec règles React
- Framer Motion + IA

### Python/Django
- GitHub Copilot
- Tabnine
- Kite (deprecated mais alternatives)

### Mobile
- FlutterFlow + IA
- Copilot pour React Native
- Firebase ML Kit

## ROI développeur freelance
- Productivité : +150%
- Qualité code : +40%
- Revenus : +60%
- Stress : -50%`,
  },
  {
    id: "consultant-pme",
    title: "IA pour Consultants PME",
    description: "Automatiser vos analyses, rapports et recommandations clients",
    sector: "Conseil",
    icon: <Users className="h-5 w-5" />,
    difficulty: "Intermédiaire",
    estimatedTime: "18 min",
    tags: ["conseil", "analyse", "rapports"],
    content: `# IA pour Consultants PME

## L'IA transforme le conseil

Les consultants utilisant l'IA réduisent de 60% le temps de préparation...

## Domaines d'application

### 1. Analyse de Données
- **Tableau** avec Einstein Analytics
- **Power BI** avec IA intégrée
- **Python** + pandas + IA pour analyses custom

### 2. Génération de Rapports
- **ChatGPT** pour la rédaction
- **Gamma** pour les présentations
- **Notion AI** pour la documentation

### 3. Veille Concurrentielle
- **Perplexity** pour la recherche
- **Feedly** avec IA
- **Google Alerts** optimisés

## Outils par type de conseil

### Conseil Stratégique
- McKinsey Lilli (si accès)
- ChatGPT-4 pour frameworks
- Miro avec IA pour mapping

### Conseil Marketing
- HubSpot avec IA
- Semrush avec insights IA
- Canva Magic Design

### Conseil RH
- Workday avec IA
- BambooHR insights
- LinkedIn Talent Insights

## Templates de prompts

### Analyse SWOT
\`\`\`
Analyse SWOT pour [ENTREPRISE] dans le secteur [SECTEUR]:
- Contexte: [CONTEXTE]
- Données: [DONNÉES]
- Objectifs: [OBJECTIFS]
\`\`\`

### Recommandations
\`\`\`
Génère 5 recommandations stratégiques pour:
- Problématique: [PROBLÈME]
- Budget: [BUDGET]
- Délai: [DÉLAI]
- Contraintes: [CONTRAINTES]
\`\`\`

## Facturation avec IA

### Nouveaux modèles
- Facturation à la valeur créée
- Abonnements insights IA
- Formation IA pour clients

### Tarifs recommandés
- Audit IA : 2000-5000€
- Implémentation : 500-1500€/jour
- Formation équipes : 1000€/jour

## ROI consultant
- Temps préparation : -60%
- Qualité livrables : +45%
- Satisfaction client : +30%
- Revenus : +40%`,
  },
]

interface ArticleTemplatesProps {
  onSelectTemplate: (template: Template) => void
}

export default function ArticleTemplates({ onSelectTemplate }: ArticleTemplatesProps) {
  const [selectedSector, setSelectedSector] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")

  const sectors = ["all", "Graphisme", "E-commerce", "Développement", "Conseil"]
  const difficulties = ["all", "Débutant", "Intermédiaire", "Expert"]

  const filteredTemplates = templates.filter((template) => {
    const sectorMatch = selectedSector === "all" || template.sector === selectedSector
    const difficultyMatch = selectedDifficulty === "all" || template.difficulty === selectedDifficulty
    return sectorMatch && difficultyMatch
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Débutant":
        return "bg-green-100 text-green-800"
      case "Intermédiaire":
        return "bg-yellow-100 text-yellow-800"
      case "Expert":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700">Secteur:</span>
          {sectors.map((sector) => (
            <Button
              key={sector}
              variant={selectedSector === sector ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSector(sector)}
            >
              {sector === "all" ? "Tous" : sector}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700">Niveau:</span>
          {difficulties.map((difficulty) => (
            <Button
              key={difficulty}
              variant={selectedDifficulty === difficulty ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDifficulty(difficulty)}
            >
              {difficulty === "all" ? "Tous" : difficulty}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {template.icon}
                  <div>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <CardDescription className="mt-1">{template.description}</CardDescription>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary">{template.sector}</Badge>
                <Badge className={getDifficultyColor(template.difficulty)}>{template.difficulty}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {template.estimatedTime}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <Button onClick={() => onSelectTemplate(template)} className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Utiliser ce template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun template trouvé</h3>
          <p className="text-gray-500">Essayez de modifier vos filtres pour voir plus de templates.</p>
        </div>
      )}
    </div>
  )
}

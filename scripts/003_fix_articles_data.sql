-- Fix any missing articles and ensure they are published
-- This script ensures the sample articles are properly inserted and published

-- Update existing articles to ensure they are published
UPDATE articles 
SET published = true 
WHERE slug IN (
  'automatiser-service-client-ia-2024',
  '10-outils-ia-gratuits-productivite'
);

-- Insert the article if it doesn't exist (fallback)
INSERT INTO articles (
  title, 
  slug, 
  excerpt, 
  content, 
  category_id, 
  author_name, 
  published_at, 
  reading_time, 
  tags, 
  featured, 
  sector, 
  budget, 
  level, 
  published
) VALUES (
  '10 outils IA gratuits pour booster votre productivité',
  '10-outils-ia-gratuits-productivite',
  'Une sélection d''outils d''intelligence artificielle gratuits et faciles à utiliser pour optimiser votre travail quotidien.',
  '# 10 outils IA gratuits pour booster votre productivité

Découvrez notre sélection des meilleurs outils IA gratuits qui peuvent transformer votre façon de travailler dès aujourd''hui.

## 1. ChatGPT (OpenAI)
**Usage** : Rédaction, brainstorming, support client
**Avantages** : Interface intuitive, polyvalent
**Limite gratuite** : 20 messages/3h avec GPT-4

## 2. Grammarly
**Usage** : Correction et amélioration de textes
**Avantages** : Intégration navigateur, suggestions contextuelles
**Limite gratuite** : Corrections de base

## 3. Canva AI
**Usage** : Création graphique automatisée
**Avantages** : Templates IA, génération d''images
**Limite gratuite** : 25 générations/mois

## 4. Notion AI
**Usage** : Prise de notes intelligente, résumés
**Avantages** : Intégré à Notion, templates automatiques
**Limite gratuite** : 20 réponses IA/mois

## 5. Loom AI
**Usage** : Résumés automatiques de vidéos
**Avantages** : Transcription, points clés
**Limite gratuite** : 25 vidéos/mois

## Conclusion

Ces outils gratuits peuvent considérablement améliorer votre productivité. Commencez par tester 2-3 outils qui correspondent à vos besoins prioritaires.',
  (SELECT id FROM categories WHERE slug = 'outils-ia-pme' LIMIT 1),
  'Pierre Martin',
  NOW() - INTERVAL '3 days',
  6,
  ARRAY['outils-gratuits', 'productivité', 'workflow'],
  true,
  'freelance',
  'gratuit',
  'debutant',
  true
) ON CONFLICT (slug) DO UPDATE SET
  published = true,
  updated_at = NOW();

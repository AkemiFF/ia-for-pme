-- Seed initial data for the IA PME website
-- This script populates the database with sample content

-- Insert categories
INSERT INTO categories (name, slug, description, seo_title, seo_description) VALUES
('Intelligence Artificielle', 'intelligence-artificielle', 'Découvrez les dernières innovations en IA pour les PME et freelances', 'IA pour PME - Intelligence Artificielle', 'Guides et conseils sur l''intelligence artificielle adaptés aux PME et freelances. Découvrez comment intégrer l''IA dans votre activité.'),
('Automatisation', 'automatisation-processus', 'Automatisez vos processus métier avec les outils IA', 'Automatisation IA - Processus PME', 'Automatisez vos tâches répétitives et optimisez vos processus avec les outils d''intelligence artificielle pour PME.'),
('Outils IA', 'outils-ia-pme', 'Les meilleurs outils IA pour optimiser votre productivité', 'Outils IA PME - Sélection 2024', 'Découvrez notre sélection des meilleurs outils d''intelligence artificielle pour PME et freelances en 2024.'),
('Stratégie Digitale', 'strategie-digitale', 'Développez votre stratégie IA et digitale', 'Stratégie IA - Transformation Digitale', 'Conseils stratégiques pour intégrer l''IA dans votre transformation digitale et développer votre activité.'),
('Marketing IA', 'marketing-ia', 'Révolutionnez votre marketing avec l''intelligence artificielle', 'Marketing IA - Stratégies PME', 'Optimisez vos campagnes marketing et boostez vos ventes avec les outils d''intelligence artificielle.'),
('Formation & Adoption', 'formation-adoption', 'Formez vos équipes à l''utilisation de l''IA', 'Formation IA - Adoption PME', 'Guides et ressources pour former vos équipes et réussir l''adoption de l''IA dans votre entreprise.'),
('Gestion des Données', 'gestion-donnees', 'Gérez et exploitez vos données avec l''IA', 'Gestion Données IA - RGPD PME', 'Apprenez à gérer, sécuriser et exploiter vos données avec l''IA tout en respectant le RGPD.')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample articles
INSERT INTO articles (title, slug, excerpt, content, category_id, author_name, published_at, reading_time, tags, featured, sector, budget, level, published) VALUES
(
  'Comment automatiser votre service client avec l''IA en 2024',
  'automatiser-service-client-ia-2024',
  'Découvrez les meilleures pratiques pour implémenter des chatbots IA et améliorer l''expérience client tout en réduisant vos coûts.',
  '# Comment automatiser votre service client avec l''IA en 2024

L''automatisation du service client représente l''une des applications les plus rentables de l''intelligence artificielle pour les PME. Dans cet article, nous explorons les stratégies éprouvées pour transformer votre support client.

## Les avantages de l''automatisation IA

### Réduction des coûts opérationnels
- **Économies de 40-60%** sur les coûts de support
- Traitement simultané de centaines de demandes
- Disponibilité 24h/24, 7j/7

### Amélioration de l''expérience client
- Temps de réponse instantané
- Cohérence dans les réponses
- Escalade intelligente vers les humains

## Outils recommandés

### 1. Chatbots conversationnels
- **Intercom** : Solution complète avec IA intégrée
- **Zendesk Answer Bot** : Intégration native avec votre helpdesk
- **ChatGPT API** : Pour créer des solutions sur mesure

### 2. Analyse de sentiment
- **MonkeyLearn** : Analyse automatique des émotions
- **Lexalytics** : Traitement avancé du langage naturel

## Mise en œuvre étape par étape

### Phase 1 : Analyse des besoins (Semaine 1-2)
1. Auditez vos tickets de support existants
2. Identifiez les questions récurrentes (80/20)
3. Définissez vos KPIs de succès

### Phase 2 : Configuration (Semaine 3-4)
1. Choisissez votre plateforme
2. Créez votre base de connaissances
3. Configurez les scénarios de conversation

### Phase 3 : Test et optimisation (Semaine 5-6)
1. Tests en interne
2. Déploiement progressif
3. Ajustements basés sur les retours

## ROI attendu

Pour une PME de 50 employés :
- **Investissement initial** : 2 000-5 000€
- **Économies annuelles** : 15 000-30 000€
- **ROI** : 300-600% la première année

## Erreurs à éviter

❌ **Ne pas former les équipes**
✅ Organisez des sessions de formation

❌ **Automatiser sans stratégie**
✅ Définissez clairement les cas d''usage

❌ **Ignorer l''aspect humain**
✅ Gardez toujours une option d''escalade

## Conclusion

L''automatisation du service client avec l''IA n''est plus un luxe mais une nécessité concurrentielle. Commencez petit, mesurez les résultats, et étendez progressivement.

> 💡 **Conseil d''expert** : Commencez par automatiser 20% de vos demandes les plus fréquentes pour obtenir 80% des bénéfices.',
  (SELECT id FROM categories WHERE slug = 'automatisation-processus'),
  'Marie Dubois',
  NOW() - INTERVAL '5 days',
  8,
  ARRAY['automatisation', 'chatbot', 'service-client', 'roi'],
  true,
  'pme',
  'moyen',
  'intermediaire',
  true
),
(
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

## 6. Otter.ai
**Usage** : Transcription de réunions
**Avantages** : Temps réel, identification des intervenants
**Limite gratuite** : 300 min/mois

## 7. Zapier AI
**Usage** : Automatisation de workflows
**Avantages** : Connexion entre apps, triggers intelligents
**Limite gratuite** : 100 tâches/mois

## 8. Perplexity AI
**Usage** : Recherche et synthèse d''informations
**Avantages** : Sources citées, réponses précises
**Limite gratuite** : 5 recherches Pro/jour

## 9. Gamma
**Usage** : Création de présentations IA
**Avantages** : Design automatique, contenu généré
**Limite gratuite** : 400 crédits IA

## 10. Speechify
**Usage** : Synthèse vocale de textes
**Avantages** : Voix naturelles, vitesse ajustable
**Limite gratuite** : 10 min/jour

## Comment maximiser ces outils

### 1. Créez des workflows
Combinez plusieurs outils pour des processus complets :
- ChatGPT → Grammarly → Notion
- Loom → Otter.ai → Notion

### 2. Utilisez des prompts efficaces
- Soyez spécifique dans vos demandes
- Donnez du contexte
- Demandez des formats précis

### 3. Automatisez avec Zapier
Connectez vos outils favoris pour gagner encore plus de temps.

## ROI estimé

Pour un freelance :
- **Temps économisé** : 5-10h/semaine
- **Valeur horaire** : 50€/h
- **Économies annuelles** : 13 000-26 000€

## Prochaines étapes

1. **Testez 2-3 outils** cette semaine
2. **Mesurez le temps économisé**
3. **Intégrez progressivement** dans vos workflows
4. **Formez votre équipe** aux outils adoptés

> 🚀 **Astuce Pro** : Commencez par les outils qui adressent vos plus gros points de friction quotidiens.',
  (SELECT id FROM categories WHERE slug = 'outils-ia-pme'),
  'Pierre Martin',
  NOW() - INTERVAL '3 days',
  6,
  ARRAY['outils-gratuits', 'productivité', 'workflow'],
  true,
  'freelance',
  'gratuit',
  'debutant',
  true
);

-- Insert affiliate resources
INSERT INTO affiliate_resources (name, description, url, affiliate_link, category, pricing, featured) VALUES
('ChatGPT Plus', 'IA conversationnelle avancée pour la rédaction et l''analyse', 'https://openai.com/chatgpt', 'https://openai.com/chatgpt?ref=iapme', 'IA Générative', '20€/mois', true),
('Notion AI', 'Workspace intelligent avec IA intégrée', 'https://notion.so', 'https://notion.so?ref=iapme', 'Productivité', '10€/mois', true),
('Canva Pro', 'Design graphique avec génération IA', 'https://canva.com', 'https://canva.com/pro?ref=iapme', 'Design', '12€/mois', true),
('Zapier', 'Automatisation de workflows entre applications', 'https://zapier.com', 'https://zapier.com?ref=iapme', 'Automatisation', '20€/mois', true),
('Grammarly Premium', 'Correction avancée et amélioration de textes', 'https://grammarly.com', 'https://grammarly.com/premium?ref=iapme', 'Rédaction', '12€/mois', false);

-- Insert sample newsletter subscribers (for testing)
INSERT INTO newsletter_subscribers (email, name, segments, interests, source) VALUES
('test@example.com', 'Test User', ARRAY['pme'], ARRAY['automatisation', 'outils-gratuits'], 'website'),
('demo@freelance.com', 'Demo Freelance', ARRAY['freelance'], ARRAY['productivité', 'marketing'], 'checklist-ia-pme');

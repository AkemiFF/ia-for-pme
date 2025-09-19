-- Improved seed data script with better formatting and error handling
-- Seed initial data for the IA PME website - Version 2
-- This script populates the database with sample content using better practices

-- Insert categories with proper error handling
INSERT INTO categories (name, slug, description, seo_title, seo_description) VALUES
('Intelligence Artificielle', 'intelligence-artificielle', 'Découvrez les dernières innovations en IA pour les PME et freelances', 'IA pour PME - Intelligence Artificielle', 'Guides et conseils sur l''intelligence artificielle adaptés aux PME et freelances. Découvrez comment intégrer l''IA dans votre activité.'),
('Automatisation', 'automatisation-processus', 'Automatisez vos processus métier avec les outils IA', 'Automatisation IA - Processus PME', 'Automatisez vos tâches répétitives et optimisez vos processus avec les outils d''intelligence artificielle pour PME.'),
('Outils IA', 'outils-ia-pme', 'Les meilleurs outils IA pour optimiser votre productivité', 'Outils IA PME - Sélection 2024', 'Découvrez notre sélection des meilleurs outils d''intelligence artificielle pour PME et freelances en 2024.'),
('Stratégie Digitale', 'strategie-digitale', 'Développez votre stratégie IA et digitale', 'Stratégie IA - Transformation Digitale', 'Conseils stratégiques pour intégrer l''IA dans votre transformation digitale et développer votre activité.'),
('Marketing IA', 'marketing-ia', 'Révolutionnez votre marketing avec l''intelligence artificielle', 'Marketing IA - Stratégies PME', 'Optimisez vos campagnes marketing et boostez vos ventes avec les outils d''intelligence artificielle.'),
('Formation & Adoption', 'formation-adoption', 'Formez vos équipes à l''utilisation de l''IA', 'Formation IA - Adoption PME', 'Guides et ressources pour former vos équipes et réussir l''adoption de l''IA dans votre entreprise.'),
('Gestion des Données', 'gestion-donnees', 'Gérez et exploitez vos données avec l''IA', 'Gestion Données IA - RGPD PME', 'Apprenez à gérer, sécuriser et exploiter vos données avec l''IA tout en respectant le RGPD.')
ON CONFLICT (slug) DO NOTHING;

-- Function to insert article with proper content handling
CREATE OR REPLACE FUNCTION insert_article_with_content(
  p_title TEXT,
  p_slug TEXT,
  p_excerpt TEXT,
  p_content_file TEXT, -- Reference to content file instead of inline content
  p_category_slug TEXT,
  p_author_name TEXT DEFAULT 'IA pour PME',
  p_reading_time INTEGER DEFAULT 5,
  p_tags TEXT[] DEFAULT '{}',
  p_featured BOOLEAN DEFAULT FALSE,
  p_sector TEXT DEFAULT 'pme',
  p_budget TEXT DEFAULT 'moyen',
  p_level TEXT DEFAULT 'intermediaire'
) RETURNS VOID AS $$
DECLARE
  category_uuid UUID;
  article_content TEXT;
BEGIN
  -- Get category ID
  SELECT id INTO category_uuid FROM categories WHERE slug = p_category_slug;
  
  IF category_uuid IS NULL THEN
    RAISE EXCEPTION 'Category with slug % not found', p_category_slug;
  END IF;
  
  -- For now, use a placeholder content. In production, this would read from a file
  article_content := '# ' || p_title || E'\n\n' || p_excerpt || E'\n\n[Contenu complet à charger depuis: ' || p_content_file || ']';
  
  -- Insert article
  INSERT INTO articles (
    title, slug, excerpt, content, category_id, author_name, 
    published_at, reading_time, tags, featured, sector, budget, level, published
  ) VALUES (
    p_title, p_slug, p_excerpt, article_content, category_uuid, p_author_name,
    NOW() - INTERVAL '5 days', p_reading_time, p_tags, p_featured, p_sector, p_budget, p_level, TRUE
  ) ON CONFLICT (slug) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Insert sample articles using the function
SELECT insert_article_with_content(
  'Comment automatiser votre service client avec l''IA en 2024',
  'automatiser-service-client-ia-2024',
  'Découvrez les meilleures pratiques pour implémenter des chatbots IA et améliorer l''expérience client tout en réduisant vos coûts.',
  'articles/automatiser-service-client-ia-2024.md',
  'automatisation-processus',
  'Marie Dubois',
  8,
  ARRAY['automatisation', 'chatbot', 'service-client', 'roi'],
  TRUE,
  'pme',
  'moyen',
  'intermediaire'
);

SELECT insert_article_with_content(
  '10 outils IA gratuits pour booster votre productivité',
  '10-outils-ia-gratuits-productivite',
  'Une sélection d''outils d''intelligence artificielle gratuits et faciles à utiliser pour optimiser votre travail quotidien.',
  'articles/10-outils-ia-gratuits-productivite.md',
  'outils-ia-pme',
  'Pierre Martin',
  6,
  ARRAY['outils-gratuits', 'productivité', 'workflow'],
  TRUE,
  'freelance',
  'gratuit',
  'debutant'
);

-- Insert affiliate resources with validation
INSERT INTO affiliate_resources (name, description, url, affiliate_link, category, pricing, featured) 
SELECT * FROM (VALUES
  ('ChatGPT Plus', 'IA conversationnelle avancée pour la rédaction et l''analyse', 'https://openai.com/chatgpt', 'https://openai.com/chatgpt?ref=iapme', 'IA Générative', '20€/mois', TRUE),
  ('Notion AI', 'Workspace intelligent avec IA intégrée', 'https://notion.so', 'https://notion.so?ref=iapme', 'Productivité', '10€/mois', TRUE),
  ('Canva Pro', 'Design graphique avec génération IA', 'https://canva.com', 'https://canva.com/pro?ref=iapme', 'Design', '12€/mois', TRUE),
  ('Zapier', 'Automatisation de workflows entre applications', 'https://zapier.com', 'https://zapier.com?ref=iapme', 'Automatisation', '20€/mois', TRUE),
  ('Grammarly Premium', 'Correction avancée et amélioration de textes', 'https://grammarly.com', 'https://grammarly.com/premium?ref=iapme', 'Rédaction', '12€/mois', FALSE)
) AS t(name, description, url, affiliate_link, category, pricing, featured)
WHERE NOT EXISTS (SELECT 1 FROM affiliate_resources WHERE affiliate_resources.name = t.name);

-- Insert sample newsletter subscribers for testing
INSERT INTO newsletter_subscribers (email, name, segments, interests, source) 
SELECT * FROM (VALUES
  ('test@example.com', 'Test User', ARRAY['pme'], ARRAY['automatisation', 'outils-gratuits'], 'website'),
  ('demo@freelance.com', 'Demo Freelance', ARRAY['freelance'], ARRAY['productivité', 'marketing'], 'checklist-ia-pme')
) AS t(email, name, segments, interests, source)
WHERE NOT EXISTS (SELECT 1 FROM newsletter_subscribers WHERE newsletter_subscribers.email = t.email);

-- Clean up function after use
DROP FUNCTION IF EXISTS insert_article_with_content;

-- Verify data insertion
DO $$
DECLARE
  category_count INTEGER;
  article_count INTEGER;
  resource_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO category_count FROM categories;
  SELECT COUNT(*) INTO article_count FROM articles WHERE published = TRUE;
  SELECT COUNT(*) INTO resource_count FROM affiliate_resources;
  
  RAISE NOTICE 'Data insertion completed:';
  RAISE NOTICE '- Categories: %', category_count;
  RAISE NOTICE '- Published articles: %', article_count;
  RAISE NOTICE '- Affiliate resources: %', resource_count;
END $$;

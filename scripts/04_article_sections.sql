-- Article Sections System
-- This script adds support for structured article sections

-- Create article_sections table
CREATE TABLE IF NOT EXISTS article_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL CHECK (section_type IN ('texte_markdown', 'image', 'video', 'produit_affilie', 'fichier', 'galerie', 'citation', 'code')),
  order_index INTEGER NOT NULL,
  title TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  alignment TEXT CHECK (alignment IN ('left', 'right', 'center')) DEFAULT 'center',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_article_sections_article_id ON article_sections(article_id);
CREATE INDEX IF NOT EXISTS idx_article_sections_order ON article_sections(article_id, order_index);

-- Enable RLS
ALTER TABLE article_sections ENABLE ROW LEVEL SECURITY;

-- Public read access for published articles
CREATE POLICY "Public can read sections of published articles" ON article_sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM articles 
      WHERE articles.id = article_sections.article_id 
      AND articles.published = true
    )
  );

-- Update trigger
CREATE TRIGGER update_article_sections_updated_at BEFORE UPDATE ON article_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

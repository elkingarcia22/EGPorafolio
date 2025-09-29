-- Crear tabla cv_documents
CREATE TABLE IF NOT EXISTS cv_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(50) DEFAULT 'application/pdf',
  is_active BOOLEAN DEFAULT true,
  language VARCHAR(10) DEFAULT 'es',
  version VARCHAR(20) DEFAULT '1.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_cv_documents_active ON cv_documents(is_active);
CREATE INDEX IF NOT EXISTS idx_cv_documents_language ON cv_documents(language);
CREATE INDEX IF NOT EXISTS idx_cv_documents_created_at ON cv_documents(created_at DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE cv_documents ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública de CVs activos
CREATE POLICY "Allow public read access to active CV documents" ON cv_documents
FOR SELECT USING (is_active = true);

-- Política para permitir acceso completo a administradores
CREATE POLICY "Allow admin full access to CV documents" ON cv_documents
FOR ALL USING (true);

-- Insertar CV de ejemplo
INSERT INTO cv_documents (
  title,
  description,
  file_url,
  file_name,
  file_size,
  file_type,
  is_active,
  language,
  version,
  metadata
) VALUES (
  'CV Elkin Garcia - Diseñador UX/UI',
  'Hoja de vida profesional de Elkin Garcia, especialista en diseño UX/UI con más de 5 años de experiencia.',
  '/cv-elkin-garcia.pdf',
  'cv-elkin-garcia.pdf',
  1024000,
  'application/pdf',
  true,
  'es',
  '1.0',
  jsonb_build_object(
    'pages', 2,
    'last_updated', NOW()::text,
    'skills', ARRAY['UX Design', 'UI Design', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
    'experience_years', 5
  )
);

-- =====================================================
-- AGREGAR SOPORTE MULTIIDIOMA A PROYECTOS
-- =====================================================

-- Agregar columnas para multiidioma a la tabla projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS title_es VARCHAR(255),
ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_es TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'es' CHECK (language IN ('es', 'en'));

-- Actualizar los datos existentes para que usen los campos de español
UPDATE projects 
SET 
    title_es = title,
    description_es = description,
    language = 'es'
WHERE title_es IS NULL;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_projects_language ON projects(language);
CREATE INDEX IF NOT EXISTS idx_projects_status_language ON projects(status, language);
CREATE INDEX IF NOT EXISTS idx_projects_featured_language ON projects(featured, language);

-- Comentarios para documentar las nuevas columnas
COMMENT ON COLUMN projects.title_es IS 'Título del proyecto en español';
COMMENT ON COLUMN projects.title_en IS 'Título del proyecto en inglés';
COMMENT ON COLUMN projects.description_es IS 'Descripción del proyecto en español';
COMMENT ON COLUMN projects.description_en IS 'Descripción del proyecto en inglés';
COMMENT ON COLUMN projects.language IS 'Idioma del proyecto (es/en)';

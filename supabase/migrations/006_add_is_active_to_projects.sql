-- =====================================================
-- AGREGAR COLUMNA is_active A PROYECTOS SI NO EXISTE
-- =====================================================

-- Agregar columna is_active a la tabla projects si no existe
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Crear índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_projects_is_active ON projects(is_active);

-- Comentario para documentar la columna
COMMENT ON COLUMN projects.is_active IS 'Indica si el proyecto está activo y visible en el sitio';

-- Actualizar todos los proyectos existentes para que estén activos por defecto
UPDATE projects 
SET is_active = true 
WHERE is_active IS NULL;

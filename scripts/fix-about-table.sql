-- Agregar columnas faltantes a la tabla about_info
ALTER TABLE about_info ADD COLUMN IF NOT EXISTS section VARCHAR(50);
ALTER TABLE about_info ADD COLUMN IF NOT EXISTS order_index INTEGER;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_about_info_section ON about_info(section);
CREATE INDEX IF NOT EXISTS idx_about_info_language ON about_info(language);
CREATE INDEX IF NOT EXISTS idx_about_info_order ON about_info(order_index);

-- Actualizar registros existentes con valores por defecto
UPDATE about_info 
SET section = 'main', order_index = 1 
WHERE section IS NULL;

-- Hacer que las columnas sean NOT NULL después de actualizar
ALTER TABLE about_info ALTER COLUMN section SET NOT NULL;
ALTER TABLE about_info ALTER COLUMN order_index SET NOT NULL;

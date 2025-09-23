-- Agregar columna url a la tabla contact_info
ALTER TABLE contact_info ADD COLUMN IF NOT EXISTS url VARCHAR(255);

-- Crear índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_contact_info_url ON contact_info(url);

-- Actualizar registros existentes con valores por defecto
UPDATE contact_info 
SET url = '' 
WHERE url IS NULL;

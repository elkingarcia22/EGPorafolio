-- Script para corregir la estructura de la tabla colors
-- Ejecuta este script en Supabase Dashboard → SQL Editor

-- 1. Agregar columna is_default si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'colors' AND column_name = 'is_default') THEN
    ALTER TABLE colors ADD COLUMN is_default BOOLEAN DEFAULT FALSE;
    RAISE NOTICE 'Columna is_default agregada';
  ELSE
    RAISE NOTICE 'Columna is_default ya existe';
  END IF;
END $$;

-- 2. Agregar columna is_active si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'colors' AND column_name = 'is_active') THEN
    ALTER TABLE colors ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    RAISE NOTICE 'Columna is_active agregada';
  ELSE
    RAISE NOTICE 'Columna is_active ya existe';
  END IF;
END $$;

-- 3. Agregar columna created_at si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'colors' AND column_name = 'created_at') THEN
    ALTER TABLE colors ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    RAISE NOTICE 'Columna created_at agregada';
  ELSE
    RAISE NOTICE 'Columna created_at ya existe';
  END IF;
END $$;

-- 4. Agregar columna updated_at si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'colors' AND column_name = 'updated_at') THEN
    ALTER TABLE colors ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    RAISE NOTICE 'Columna updated_at agregada';
  ELSE
    RAISE NOTICE 'Columna updated_at ya existe';
  END IF;
END $$;

-- 5. Actualizar registros existentes para establecer valores por defecto
UPDATE colors 
SET 
  is_default = CASE WHEN name = 'Gradiente Original' THEN TRUE ELSE FALSE END,
  is_active = TRUE,
  created_at = COALESCE(created_at, NOW()),
  updated_at = COALESCE(updated_at, NOW())
WHERE is_default IS NULL OR is_active IS NULL;

-- 6. Verificar estructura final
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'colors' 
ORDER BY ordinal_position;

-- 7. Verificar datos
SELECT 
  id,
  name,
  is_default,
  is_active,
  created_at,
  updated_at
FROM colors 
ORDER BY is_default DESC, name;

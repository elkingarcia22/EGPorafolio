-- Script para deshabilitar RLS en la tabla colors
-- Ejecuta este script en Supabase Dashboard → SQL Editor

-- 1. Deshabilitar RLS completamente
ALTER TABLE colors DISABLE ROW LEVEL SECURITY;

-- 2. Verificar que RLS está deshabilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'colors';

-- 3. Probar inserción directa
INSERT INTO colors (name, gradient_css, is_active, is_default) 
VALUES ('Test Direct SQL', 'linear-gradient(135deg, #ff0000 0%, #00ff00 100%)', true, false);

-- 4. Verificar inserción
SELECT * FROM colors WHERE name = 'Test Direct SQL';

-- 5. Limpiar prueba
DELETE FROM colors WHERE name = 'Test Direct SQL';

-- 6. Verificar estado final
SELECT 
  schemaname, 
  tablename, 
  rowsecurity,
  CASE 
    WHEN rowsecurity = false THEN 'RLS DESHABILITADO ✅'
    ELSE 'RLS HABILITADO ❌'
  END as estado
FROM pg_tables 
WHERE tablename = 'colors';

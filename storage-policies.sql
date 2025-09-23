-- Políticas RLS para el bucket "images" en Supabase Storage
-- Ejecuta este SQL en el SQL Editor de Supabase Dashboard

-- 1. Política para lectura pública de imágenes
CREATE POLICY "Public Access for Images" ON storage.objects 
FOR SELECT USING (bucket_id = 'images');

-- 2. Política para subida pública de imágenes
CREATE POLICY "Public Upload for Images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'images');

-- 3. Política para actualización pública de imágenes
CREATE POLICY "Public Update for Images" ON storage.objects 
FOR UPDATE USING (bucket_id = 'images');

-- 4. Política para eliminación pública de imágenes
CREATE POLICY "Public Delete for Images" ON storage.objects 
FOR DELETE USING (bucket_id = 'images');

-- Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

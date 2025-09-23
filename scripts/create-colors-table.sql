-- Crear tabla colors para gestionar gradientes personalizados
CREATE TABLE IF NOT EXISTS colors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  gradient_css TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_colors_active ON colors(is_active);
CREATE INDEX IF NOT EXISTS idx_colors_default ON colors(is_default);

-- Insertar gradiente por defecto
INSERT INTO colors (name, gradient_css, is_active, is_default) 
VALUES (
  'Gradiente Original',
  'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)',
  true,
  true
) ON CONFLICT DO NOTHING;

-- Habilitar RLS (Row Level Security)
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a todos
CREATE POLICY "Allow read access to colors" ON colors
  FOR SELECT USING (true);

-- Política para permitir inserción, actualización y eliminación solo a usuarios autenticados
CREATE POLICY "Allow authenticated users to manage colors" ON colors
  FOR ALL USING (auth.role() = 'authenticated');

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_colors_updated_at 
  BEFORE UPDATE ON colors 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

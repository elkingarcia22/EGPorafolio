-- Crear tabla para almacenar imágenes del logo EG
CREATE TABLE IF NOT EXISTS eg_logo_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  image_alt VARCHAR(255),
  position VARCHAR(50) DEFAULT 'left', -- 'left', 'right', 'center', 'background'
  size VARCHAR(50) DEFAULT 'large', -- 'small', 'medium', 'large', 'fullscreen'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_eg_logo_images_position ON eg_logo_images(position);
CREATE INDEX IF NOT EXISTS idx_eg_logo_images_active ON eg_logo_images(is_active);
CREATE INDEX IF NOT EXISTS idx_eg_logo_images_created_at ON eg_logo_images(created_at);

-- Insertar imagen por defecto del logo EG
INSERT INTO eg_logo_images (name, description, image_url, image_alt, position, size, is_active)
VALUES (
  'EG Logo Neumórfico',
  'Logo EG con efecto neumórfico hundido, gradiente azul-turquesa-verde',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop&crop=center',
  'Logo EG con efecto neumórfico',
  'left',
  'large',
  true
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_eg_logo_images_updated_at 
    BEFORE UPDATE ON eg_logo_images 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios en la tabla
COMMENT ON TABLE eg_logo_images IS 'Tabla para almacenar imágenes del logo EG con diferentes posiciones y tamaños';
COMMENT ON COLUMN eg_logo_images.position IS 'Posición de la imagen: left, right, center, background';
COMMENT ON COLUMN eg_logo_images.size IS 'Tamaño de la imagen: small, medium, large, fullscreen';
COMMENT ON COLUMN eg_logo_images.is_active IS 'Indica si la imagen está activa y debe mostrarse';

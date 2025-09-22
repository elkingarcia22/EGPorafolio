-- =====================================================
-- SISTEMA DE ADMINISTRACIÓN DE CONTENIDO
-- =====================================================

-- Tabla para configuraciones generales del sitio
CREATE TABLE IF NOT EXISTS site_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para textos del typewriter (texto auto-escribible)
CREATE TABLE IF NOT EXISTS typewriter_texts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text_content TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para proyectos
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  cover_image_alt TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para información personal (Acerca de mí)
CREATE TABLE IF NOT EXISTS about_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  profile_image_url TEXT,
  profile_image_alt TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para información de contacto
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_type VARCHAR(50) NOT NULL, -- 'whatsapp', 'linkedin', 'location', etc.
  label VARCHAR(100) NOT NULL,
  value TEXT NOT NULL,
  icon_name VARCHAR(50), -- nombre del icono SVG
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para imágenes del sitio
CREATE TABLE IF NOT EXISTS site_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_name VARCHAR(200) NOT NULL,
  image_url TEXT NOT NULL,
  image_alt TEXT,
  section VARCHAR(50) NOT NULL, -- 'home', 'projects', 'about', 'contact'
  usage_context VARCHAR(100), -- 'cover', 'profile', 'background', etc.
  file_size INTEGER, -- en bytes
  mime_type VARCHAR(100),
  width INTEGER,
  height INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para logs de administración
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
  table_name VARCHAR(50),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  admin_session_id VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar textos del typewriter por defecto
INSERT INTO typewriter_texts (text_content, order_index) VALUES
  ('Diseñador UX/UI senior specialist', 1),
  ('Diseño de interacciones', 2),
  ('Diseño de estrategias', 3),
  ('Diseño inteligente IA', 4);

-- Insertar proyectos por defecto
INSERT INTO projects (title, description, order_index) VALUES
  ('UX Research', 'Investigación profunda de usuarios para crear experiencias excepcionales y centradas en el ser humano', 1),
  ('UI Design', 'Diseño de interfaces modernas, funcionales y visualmente impactantes que conectan con los usuarios', 2),
  ('Estrategia Digital', 'Desarrollo de estrategias digitales integrales que transforman marcas y productos', 3),
  ('Diseño con IA', 'Proyectos innovadores que combinan inteligencia artificial con diseño creativo', 4);

-- Insertar información personal por defecto
INSERT INTO about_info (title, description) VALUES
  ('Acerca de mí', 'Soy un diseñador UX/UI con más de 5 años de experiencia creando experiencias digitales excepcionales.');

-- Insertar información de contacto por defecto
INSERT INTO contact_info (contact_type, label, value, icon_name, order_index) VALUES
  ('whatsapp', 'WhatsApp', '+54 11 1234-5678', 'whatsapp', 1),
  ('linkedin', 'LinkedIn', 'Conectar', 'linkedin', 2),
  ('location', 'Ubicación', 'Buenos Aires, Argentina', 'location', 3);

-- Insertar configuraciones del sitio
INSERT INTO site_config (key, value, description) VALUES
  ('admin_password', 'Lineadesangre22', 'Contraseña de administrador'),
  ('site_title', 'Elkin García - Portfolio', 'Título del sitio'),
  ('site_description', 'Portfolio de Elkin García - Diseñador UX/UI', 'Descripción del sitio'),
  ('theme_default', 'light', 'Tema por defecto del sitio');

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_typewriter_texts_order ON typewriter_texts(order_index);
CREATE INDEX IF NOT EXISTS idx_typewriter_texts_active ON typewriter_texts(is_active);

CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(order_index);
CREATE INDEX IF NOT EXISTS idx_projects_active ON projects(is_active);

CREATE INDEX IF NOT EXISTS idx_contact_info_type ON contact_info(contact_type);
CREATE INDEX IF NOT EXISTS idx_contact_info_order ON contact_info(order_index);
CREATE INDEX IF NOT EXISTS idx_contact_info_active ON contact_info(is_active);

CREATE INDEX IF NOT EXISTS idx_site_images_section ON site_images(section);
CREATE INDEX IF NOT EXISTS idx_site_images_usage ON site_images(usage_context);
CREATE INDEX IF NOT EXISTS idx_site_images_active ON site_images(is_active);

CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_table ON admin_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON admin_logs(created_at);

-- =====================================================
-- FUNCIONES DE ACTUALIZACIÓN AUTOMÁTICA
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON site_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_typewriter_texts_updated_at BEFORE UPDATE ON typewriter_texts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_info_updated_at BEFORE UPDATE ON about_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON contact_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_images_updated_at BEFORE UPDATE ON site_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE typewriter_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para lectura pública (solo datos activos)
CREATE POLICY "Public read access for active typewriter texts" ON typewriter_texts FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for active projects" ON projects FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for active about info" ON about_info FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for active contact info" ON contact_info FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for active site images" ON site_images FOR SELECT USING (is_active = true);

-- Políticas para administración (requiere autenticación)
-- Nota: Estas políticas necesitarán ser ajustadas según tu sistema de autenticación
CREATE POLICY "Admin full access to site_config" ON site_config FOR ALL USING (true);
CREATE POLICY "Admin full access to typewriter_texts" ON typewriter_texts FOR ALL USING (true);
CREATE POLICY "Admin full access to projects" ON projects FOR ALL USING (true);
CREATE POLICY "Admin full access to about_info" ON about_info FOR ALL USING (true);
CREATE POLICY "Admin full access to contact_info" ON contact_info FOR ALL USING (true);
CREATE POLICY "Admin full access to site_images" ON site_images FOR ALL USING (true);
CREATE POLICY "Admin full access to admin_logs" ON admin_logs FOR ALL USING (true);

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista para obtener todos los textos del typewriter ordenados
CREATE OR REPLACE VIEW v_typewriter_texts AS
SELECT text_content, order_index
FROM typewriter_texts
WHERE is_active = true
ORDER BY order_index;

-- Vista para obtener todos los proyectos ordenados
CREATE OR REPLACE VIEW v_projects AS
SELECT id, title, description, cover_image_url, cover_image_alt, order_index
FROM projects
WHERE is_active = true
ORDER BY order_index;

-- Vista para obtener información de contacto ordenada
CREATE OR REPLACE VIEW v_contact_info AS
SELECT contact_type, label, value, icon_name, order_index
FROM contact_info
WHERE is_active = true
ORDER BY order_index;

-- Vista para obtener información personal
CREATE OR REPLACE VIEW v_about_info AS
SELECT title, description, profile_image_url, profile_image_alt
FROM about_info
WHERE is_active = true
LIMIT 1;

-- =====================================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE site_config IS 'Configuraciones generales del sitio web';
COMMENT ON TABLE typewriter_texts IS 'Textos que aparecen en el efecto typewriter del home';
COMMENT ON TABLE projects IS 'Proyectos mostrados en la sección Mi trabajo';
COMMENT ON TABLE about_info IS 'Información personal en la sección Acerca de mí';
COMMENT ON TABLE contact_info IS 'Información de contacto en la sección Contacto';
COMMENT ON TABLE site_images IS 'Imágenes utilizadas en el sitio web';
COMMENT ON TABLE admin_logs IS 'Logs de actividades de administración';

COMMENT ON COLUMN site_config.key IS 'Clave única de configuración';
COMMENT ON COLUMN site_config.value IS 'Valor de la configuración';
COMMENT ON COLUMN typewriter_texts.order_index IS 'Orden de aparición en el typewriter';
COMMENT ON COLUMN projects.order_index IS 'Orden de aparición en la grilla de proyectos';
COMMENT ON COLUMN contact_info.contact_type IS 'Tipo de contacto (whatsapp, linkedin, location, etc.)';
COMMENT ON COLUMN site_images.section IS 'Sección donde se usa la imagen (home, projects, about, contact)';
COMMENT ON COLUMN site_images.usage_context IS 'Contexto específico de uso (cover, profile, background, etc.)';

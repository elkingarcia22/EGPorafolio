-- =====================================================
-- SISTEMA DE PÁGINAS DE PROYECTOS ESTILO BEHANCE (FIXED)
-- =====================================================

-- Verificar si la tabla projects ya existe y crear una nueva si es necesario
DO $$ 
BEGIN
    -- Si ya existe una tabla projects, la renombramos
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'projects') THEN
        -- Verificar si es la tabla de proyectos del portafolio o la nueva
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'slug') THEN
            -- Ya es la tabla correcta, no hacer nada
            RAISE NOTICE 'Tabla projects ya existe con la estructura correcta';
        ELSE
            -- Es la tabla antigua, la renombramos
            ALTER TABLE projects RENAME TO projects_old;
            RAISE NOTICE 'Tabla projects antigua renombrada a projects_old';
        END IF;
    END IF;
END $$;

-- Tabla principal de proyectos
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadatos del proyecto
    client_name VARCHAR(255),
    project_type VARCHAR(100),
    duration VARCHAR(100),
    team_size INTEGER,
    technologies TEXT[], -- Array de tecnologías
    project_url TEXT,
    github_url TEXT,
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT[]
);

-- Tabla de secciones de proyecto (flexibles como Behance)
CREATE TABLE IF NOT EXISTS project_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    section_type VARCHAR(50) NOT NULL CHECK (section_type IN (
        'hero', 'text', 'image', 'video', 'gallery', 'quote', 
        'stats', 'process', 'testimonial', 'cta', 'spacer'
    )),
    title VARCHAR(255),
    order_index INTEGER NOT NULL DEFAULT 0,
    width VARCHAR(20) DEFAULT 'full' CHECK (width IN ('full', 'half', 'third', 'two-thirds')),
    alignment VARCHAR(20) DEFAULT 'center' CHECK (alignment IN ('left', 'center', 'right')),
    background_color VARCHAR(7), -- Hex color
    text_color VARCHAR(7), -- Hex color
    padding_top INTEGER DEFAULT 0,
    padding_bottom INTEGER DEFAULT 0,
    margin_top INTEGER DEFAULT 0,
    margin_bottom INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de elementos dentro de las secciones (muy flexible)
CREATE TABLE IF NOT EXISTS project_elements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_id UUID NOT NULL REFERENCES project_sections(id) ON DELETE CASCADE,
    element_type VARCHAR(50) NOT NULL CHECK (element_type IN (
        'heading', 'paragraph', 'image', 'video', 'link', 'button', 
        'quote', 'list', 'divider', 'spacer', 'embed', 'code'
    )),
    content JSONB NOT NULL, -- Contenido flexible en JSON
    order_index INTEGER NOT NULL DEFAULT 0,
    width VARCHAR(20) DEFAULT 'full' CHECK (width IN ('full', 'half', 'third', 'two-thirds', 'quarter')),
    alignment VARCHAR(20) DEFAULT 'left' CHECK (alignment IN ('left', 'center', 'right')),
    styling JSONB, -- Estilos personalizados
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de imágenes de proyecto
CREATE TABLE IF NOT EXISTS project_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    element_id UUID REFERENCES project_elements(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    caption TEXT,
    width INTEGER,
    height INTEGER,
    file_size INTEGER,
    order_index INTEGER DEFAULT 0,
    is_cover BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de videos de proyecto
CREATE TABLE IF NOT EXISTS project_videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    element_id UUID REFERENCES project_elements(id) ON DELETE CASCADE,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    title TEXT,
    description TEXT,
    duration INTEGER, -- en segundos
    platform VARCHAR(50) CHECK (platform IN ('youtube', 'vimeo', 'direct', 'embed')),
    embed_code TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de categorías de proyecto
CREATE TABLE IF NOT EXISTS project_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7), -- Hex color
    icon VARCHAR(50),
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de relación proyecto-categoría
CREATE TABLE IF NOT EXISTS project_category_relations (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES project_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- Tabla de tags de proyecto
CREATE TABLE IF NOT EXISTS project_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(7), -- Hex color
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de relación proyecto-tag
CREATE TABLE IF NOT EXISTS project_tag_relations (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES project_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, tag_id)
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(order_index);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published_at);

CREATE INDEX IF NOT EXISTS idx_project_sections_project_id ON project_sections(project_id);
CREATE INDEX IF NOT EXISTS idx_project_sections_order ON project_sections(order_index);
CREATE INDEX IF NOT EXISTS idx_project_sections_type ON project_sections(section_type);

CREATE INDEX IF NOT EXISTS idx_project_elements_section_id ON project_elements(section_id);
CREATE INDEX IF NOT EXISTS idx_project_elements_order ON project_elements(order_index);
CREATE INDEX IF NOT EXISTS idx_project_elements_type ON project_elements(element_type);

CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_element_id ON project_images(element_id);

CREATE INDEX IF NOT EXISTS idx_project_videos_project_id ON project_videos(project_id);
CREATE INDEX IF NOT EXISTS idx_project_videos_element_id ON project_videos(element_id);

-- =====================================================
-- TRIGGERS PARA ACTUALIZAR TIMESTAMPS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers solo si no existen
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_projects_updated_at') THEN
        CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_project_sections_updated_at') THEN
        CREATE TRIGGER update_project_sections_updated_at BEFORE UPDATE ON project_sections
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_project_elements_updated_at') THEN
        CREATE TRIGGER update_project_elements_updated_at BEFORE UPDATE ON project_elements
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- =====================================================
-- RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_category_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tag_relations ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Proyectos públicos son visibles para todos" ON projects;
DROP POLICY IF EXISTS "Admins pueden hacer todo con proyectos" ON projects;
DROP POLICY IF EXISTS "Secciones de proyectos públicos son visibles" ON project_sections;
DROP POLICY IF EXISTS "Admins pueden hacer todo con secciones" ON project_sections;
DROP POLICY IF EXISTS "Elementos de proyectos públicos son visibles" ON project_elements;
DROP POLICY IF EXISTS "Admins pueden hacer todo con elementos" ON project_elements;
DROP POLICY IF EXISTS "Imágenes de proyectos públicos son visibles" ON project_images;
DROP POLICY IF EXISTS "Admins pueden hacer todo con imágenes" ON project_images;
DROP POLICY IF EXISTS "Videos de proyectos públicos son visibles" ON project_videos;
DROP POLICY IF EXISTS "Admins pueden hacer todo con videos" ON project_videos;
DROP POLICY IF EXISTS "Categorías activas son visibles" ON project_categories;
DROP POLICY IF EXISTS "Admins pueden hacer todo con categorías" ON project_categories;
DROP POLICY IF EXISTS "Tags son visibles para todos" ON project_tags;
DROP POLICY IF EXISTS "Admins pueden hacer todo con tags" ON project_tags;
DROP POLICY IF EXISTS "Relaciones de categorías son visibles" ON project_category_relations;
DROP POLICY IF EXISTS "Admins pueden hacer todo con relaciones de categorías" ON project_category_relations;
DROP POLICY IF EXISTS "Relaciones de tags son visibles" ON project_tag_relations;
DROP POLICY IF EXISTS "Admins pueden hacer todo con relaciones de tags" ON project_tag_relations;

-- Políticas para proyectos (lectura pública, escritura solo admin)
CREATE POLICY "Proyectos públicos son visibles para todos" ON projects
    FOR SELECT USING (status = 'published');

CREATE POLICY "Admins pueden hacer todo con proyectos" ON projects
    FOR ALL USING (auth.role() = 'service_role');

-- Políticas para secciones
CREATE POLICY "Secciones de proyectos públicos son visibles" ON project_sections
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_sections.project_id 
            AND projects.status = 'published'
        )
    );

CREATE POLICY "Admins pueden hacer todo con secciones" ON project_sections
    FOR ALL USING (auth.role() = 'service_role');

-- Políticas para elementos
CREATE POLICY "Elementos de proyectos públicos son visibles" ON project_elements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM project_sections ps
            JOIN projects p ON p.id = ps.project_id
            WHERE ps.id = project_elements.section_id 
            AND p.status = 'published'
        )
    );

CREATE POLICY "Admins pueden hacer todo con elementos" ON project_elements
    FOR ALL USING (auth.role() = 'service_role');

-- Políticas para imágenes
CREATE POLICY "Imágenes de proyectos públicos son visibles" ON project_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_images.project_id 
            AND projects.status = 'published'
        )
    );

CREATE POLICY "Admins pueden hacer todo con imágenes" ON project_images
    FOR ALL USING (auth.role() = 'service_role');

-- Políticas para videos
CREATE POLICY "Videos de proyectos públicos son visibles" ON project_videos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_videos.project_id 
            AND projects.status = 'published'
        )
    );

CREATE POLICY "Admins pueden hacer todo con videos" ON project_videos
    FOR ALL USING (auth.role() = 'service_role');

-- Políticas para categorías y tags (públicas)
CREATE POLICY "Categorías activas son visibles" ON project_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins pueden hacer todo con categorías" ON project_categories
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Tags son visibles para todos" ON project_tags
    FOR SELECT USING (true);

CREATE POLICY "Admins pueden hacer todo con tags" ON project_tags
    FOR ALL USING (auth.role() = 'service_role');

-- Políticas para relaciones
CREATE POLICY "Relaciones de categorías son visibles" ON project_category_relations
    FOR SELECT USING (true);

CREATE POLICY "Admins pueden hacer todo con relaciones de categorías" ON project_category_relations
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Relaciones de tags son visibles" ON project_tag_relations
    FOR SELECT USING (true);

CREATE POLICY "Admins pueden hacer todo con relaciones de tags" ON project_tag_relations
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar categorías iniciales
INSERT INTO project_categories (name, slug, description, color, icon, order_index) VALUES
('UX/UI Design', 'ux-ui-design', 'Diseño de experiencia de usuario e interfaz', '#6366f1', 'palette', 1),
('Web Development', 'web-development', 'Desarrollo de aplicaciones web', '#10b981', 'code', 2),
('Mobile App', 'mobile-app', 'Aplicaciones móviles', '#f59e0b', 'smartphone', 3),
('Branding', 'branding', 'Identidad visual y marca', '#ef4444', 'star', 4),
('E-commerce', 'e-commerce', 'Tiendas online y comercio electrónico', '#8b5cf6', 'shopping-cart', 5),
('Dashboard', 'dashboard', 'Paneles de control y analytics', '#06b6d4', 'bar-chart', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insertar tags iniciales
INSERT INTO project_tags (name, slug, color) VALUES
('React', 'react', '#61dafb'),
('Next.js', 'nextjs', '#000000'),
('TypeScript', 'typescript', '#3178c6'),
('Tailwind CSS', 'tailwind-css', '#06b6d4'),
('Figma', 'figma', '#f24e1e'),
('Adobe XD', 'adobe-xd', '#ff61f6'),
('Node.js', 'nodejs', '#339933'),
('MongoDB', 'mongodb', '#47a248'),
('PostgreSQL', 'postgresql', '#336791'),
('Supabase', 'supabase', '#3ecf8e')
ON CONFLICT (slug) DO NOTHING;

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createProjectTables() {
  try {
    console.log('🔧 Creando tablas de proyectos con estructura correcta...');

    // SQL para crear las tablas
    const createTablesSQL = `
      -- Eliminar tablas existentes si existen
      DROP TABLE IF EXISTS project_elements CASCADE;
      DROP TABLE IF EXISTS project_sections CASCADE;
      
      -- Crear tabla project_sections
      CREATE TABLE project_sections (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('hero', 'text', 'image', 'gallery', 'video', 'quote', 'spacer', 'divider')),
        content JSONB DEFAULT '{}',
        order_index INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Crear tabla project_elements
      CREATE TABLE project_elements (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        section_id UUID NOT NULL REFERENCES project_sections(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL CHECK (type IN ('heading', 'paragraph', 'image', 'video', 'button', 'quote', 'spacer', 'divider')),
        content JSONB DEFAULT '{}',
        order_index INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Crear índices
      CREATE INDEX idx_project_sections_project_id ON project_sections(project_id);
      CREATE INDEX idx_project_sections_order ON project_sections(order_index);
      CREATE INDEX idx_project_elements_section_id ON project_elements(section_id);
      CREATE INDEX idx_project_elements_order ON project_elements(order_index);
      
      -- Habilitar RLS
      ALTER TABLE project_sections ENABLE ROW LEVEL SECURITY;
      ALTER TABLE project_elements ENABLE ROW LEVEL SECURITY;
      
      -- Crear políticas RLS (permitir todo para desarrollo)
      CREATE POLICY "Enable all operations for project_sections" ON project_sections FOR ALL USING (true);
      CREATE POLICY "Enable all operations for project_elements" ON project_elements FOR ALL USING (true);
    `;

    // Ejecutar SQL usando una función personalizada
    const { data, error } = await supabase
      .rpc('exec_sql', { sql: createTablesSQL });

    if (error) {
      console.error('❌ Error creando tablas:', error);
      
      // Intentar método alternativo - crear las tablas una por una
      console.log('🔄 Intentando método alternativo...');
      
      // Verificar si las tablas ya existen
      const { data: existingSections, error: sectionsError } = await supabase
        .from('project_sections')
        .select('id')
        .limit(1);

      if (sectionsError && sectionsError.code === 'PGRST116') {
        console.log('📋 Tabla project_sections no existe, creando...');
        // La tabla no existe, necesitamos crearla manualmente en Supabase
        console.log('⚠️  Necesitas ejecutar el SQL manualmente en Supabase:');
        console.log(createTablesSQL);
      } else {
        console.log('✅ Tabla project_sections ya existe');
      }

    } else {
      console.log('✅ Tablas creadas exitosamente');
    }

    // Verificar que las tablas se crearon correctamente
    const { data: sections, error: sectionsCheckError } = await supabase
      .from('project_sections')
      .select('*')
      .limit(1);

    if (sectionsCheckError) {
      console.error('❌ Error verificando project_sections:', sectionsCheckError);
    } else {
      console.log('✅ Tabla project_sections verificada');
    }

    const { data: elements, error: elementsCheckError } = await supabase
      .from('project_elements')
      .select('*')
      .limit(1);

    if (elementsCheckError) {
      console.error('❌ Error verificando project_elements:', elementsCheckError);
    } else {
      console.log('✅ Tabla project_elements verificada');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

createProjectTables();

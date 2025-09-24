const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProjectTables() {
  try {
    console.log('🔍 Verificando estructura de tablas de proyectos...');

    // Verificar tabla projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(1);

    if (projectsError) {
      console.error('❌ Error en tabla projects:', projectsError);
    } else {
      console.log('✅ Tabla projects existe');
      if (projects && projects.length > 0) {
        console.log('📋 Columnas de projects:', Object.keys(projects[0]));
      }
    }

    // Verificar tabla project_sections
    const { data: sections, error: sectionsError } = await supabase
      .from('project_sections')
      .select('*')
      .limit(1);

    if (sectionsError) {
      console.error('❌ Error en tabla project_sections:', sectionsError);
    } else {
      console.log('✅ Tabla project_sections existe');
      if (sections && sections.length > 0) {
        console.log('📋 Columnas de project_sections:', Object.keys(sections[0]));
      }
    }

    // Verificar tabla project_elements
    const { data: elements, error: elementsError } = await supabase
      .from('project_elements')
      .select('*')
      .limit(1);

    if (elementsError) {
      console.error('❌ Error en tabla project_elements:', elementsError);
    } else {
      console.log('✅ Tabla project_elements existe');
      if (elements && elements.length > 0) {
        console.log('📋 Columnas de project_elements:', Object.keys(elements[0]));
      }
    }

    // Verificar estructura completa de project_sections
    const { data: sectionStructure, error: structureError } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = 'project_sections' 
          ORDER BY ordinal_position;
        `
      });

    if (structureError) {
      console.error('❌ Error obteniendo estructura:', structureError);
    } else {
      console.log('📋 Estructura de project_sections:');
      sectionStructure?.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkProjectTables();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('🔍 Verificando tablas existentes...');

  try {
    // Verificar si existe la tabla projects
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(1);

    if (projectsError) {
      console.log('❌ Tabla projects no existe o hay error:', projectsError.message);
    } else {
      console.log('✅ Tabla projects existe');
      console.log('📋 Columnas de projects:', Object.keys(projectsData[0] || {}));
    }

    // Verificar otras tablas
    const tables = ['project_sections', 'project_elements', 'project_categories', 'project_tags'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (error) {
          console.log(`❌ Tabla ${table} no existe:`, error.message);
        } else {
          console.log(`✅ Tabla ${table} existe`);
        }
      } catch (err) {
        console.log(`❌ Error verificando ${table}:`, err.message);
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkTables();

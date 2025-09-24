const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupProjectPages() {
  console.log('🚀 Configurando sistema de páginas de proyectos...');

  try {
    // Leer el archivo SQL
    const fs = require('fs');
    const path = require('path');
    const sqlFile = path.join(__dirname, '../supabase/migrations/004_project_pages_system.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Ejecutar la migración
    console.log('📝 Ejecutando migración de base de datos...');
    const { data, error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      console.error('❌ Error ejecutando migración:', error);
      return;
    }

    console.log('✅ Migración ejecutada exitosamente');

    // Verificar que las tablas se crearon
    console.log('🔍 Verificando tablas creadas...');
    
    const tables = [
      'projects',
      'project_sections', 
      'project_elements',
      'project_images',
      'project_videos',
      'project_categories',
      'project_tags'
    ];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ Error verificando tabla ${table}:`, error.message);
      } else {
        console.log(`✅ Tabla ${table} creada correctamente`);
      }
    }

    console.log('🎉 Sistema de páginas de proyectos configurado exitosamente!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Crear componentes de elementos');
    console.log('2. Desarrollar página dinámica de proyecto');
    console.log('3. Crear panel de administración');
    console.log('4. Implementar editor drag & drop');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

setupProjectPages();

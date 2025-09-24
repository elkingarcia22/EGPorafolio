const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createProjectTables() {
  console.log('🚀 Creando tablas del sistema de proyectos...');

  try {
    // Leer el archivo SQL corregido
    const fs = require('fs');
    const path = require('path');
    const sqlFile = path.join(__dirname, '../supabase/migrations/004_project_pages_system_fixed.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Dividir el SQL en comandos individuales
    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    console.log(`📝 Ejecutando ${commands.length} comandos SQL...`);

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        try {
          console.log(`⏳ Ejecutando comando ${i + 1}/${commands.length}...`);
          const { data, error } = await supabase.rpc('exec', { sql: command + ';' });
          
          if (error) {
            console.log(`⚠️  Advertencia en comando ${i + 1}:`, error.message);
            // Continuar con el siguiente comando
          } else {
            console.log(`✅ Comando ${i + 1} ejecutado exitosamente`);
          }
        } catch (err) {
          console.log(`⚠️  Error en comando ${i + 1}:`, err.message);
          // Continuar con el siguiente comando
        }
      }
    }

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
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (error) {
          console.log(`❌ Error verificando tabla ${table}:`, error.message);
        } else {
          console.log(`✅ Tabla ${table} creada correctamente`);
        }
      } catch (err) {
        console.log(`❌ Error verificando tabla ${table}:`, err.message);
      }
    }

    console.log('🎉 Sistema de páginas de proyectos configurado!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Crear componentes de elementos');
    console.log('2. Desarrollar página dinámica de proyecto');
    console.log('3. Crear panel de administración');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createProjectTables();

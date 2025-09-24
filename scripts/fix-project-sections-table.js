const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixProjectSectionsTable() {
  try {
    console.log('🔧 Corrigiendo tabla project_sections...');

    // Intentar agregar la columna content si no existe
    const { data, error } = await supabase
      .rpc('exec_sql', {
        sql: `
          ALTER TABLE project_sections 
          ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '{}';
        `
      });

    if (error) {
      console.error('❌ Error agregando columna content:', error);
      
      // Intentar método alternativo
      console.log('🔄 Intentando método alternativo...');
      
      // Verificar si la tabla existe y tiene las columnas correctas
      const { data: testData, error: testError } = await supabase
        .from('project_sections')
        .select('id, title, type, order_index, project_id')
        .limit(1);

      if (testError) {
        console.error('❌ Error verificando tabla:', testError);
        return;
      }

      console.log('✅ Tabla project_sections verificada');
      console.log('📋 Columnas disponibles:', testData ? Object.keys(testData[0] || {}) : 'Sin datos');

      // Crear una sección de prueba sin content
      const { data: testSection, error: testSectionError } = await supabase
        .from('project_sections')
        .insert({
          title: 'Test Section',
          type: 'text',
          order_index: 1,
          project_id: 'd450052f-1524-4d22-ac83-762c69d51308' // ID del proyecto creado
        })
        .select()
        .single();

      if (testSectionError) {
        console.error('❌ Error creando sección de prueba:', testSectionError);
      } else {
        console.log('✅ Sección de prueba creada:', testSection);
      }

    } else {
      console.log('✅ Columna content agregada exitosamente');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

fixProjectSectionsTable();

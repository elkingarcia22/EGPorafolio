const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSectionsStructure() {
  try {
    console.log('🔍 Verificando estructura de project_sections...');

    // Intentar obtener una sección existente
    const { data: sections, error: sectionsError } = await supabase
      .from('project_sections')
      .select('*')
      .limit(1);

    if (sectionsError) {
      console.error('❌ Error obteniendo secciones:', sectionsError);
      
      // Intentar crear una sección simple
      console.log('🔄 Intentando crear una sección simple...');
      
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', 'diseno-ux-ui-plataforma-ecommerce')
        .single();

      if (projectError) {
        console.error('❌ Error obteniendo proyecto:', projectError);
        return;
      }

      // Intentar crear con solo los campos básicos
      const { data: newSection, error: newSectionError } = await supabase
        .from('project_sections')
        .insert({
          project_id: project.id,
          title: 'Sección de Prueba',
          order_index: 1
        })
        .select()
        .single();

      if (newSectionError) {
        console.error('❌ Error creando sección simple:', newSectionError);
        console.log('📋 Posibles columnas disponibles:');
        console.log('   - id, project_id, title, order_index, is_active, created_at, updated_at');
      } else {
        console.log('✅ Sección simple creada:', newSection);
      }
      
    } else {
      console.log('✅ Secciones encontradas:', sections?.length || 0);
      if (sections && sections.length > 0) {
        console.log('📋 Columnas disponibles:', Object.keys(sections[0]));
        console.log('📋 Ejemplo de sección:', sections[0]);
      }
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkSectionsStructure();

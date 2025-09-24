const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkElementsStructure() {
  try {
    console.log('🔍 Verificando estructura de project_elements...');

    // Intentar obtener un elemento existente
    const { data: elements, error: elementsError } = await supabase
      .from('project_elements')
      .select('*')
      .limit(1);

    if (elementsError) {
      console.error('❌ Error obteniendo elementos:', elementsError);
      
      // Intentar crear un elemento simple
      console.log('🔄 Intentando crear un elemento simple...');
      
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', 'diseno-ux-ui-plataforma-ecommerce')
        .single();

      if (projectError) {
        console.error('❌ Error obteniendo proyecto:', projectError);
        return;
      }

      const { data: sections, error: sectionsError } = await supabase
        .from('project_sections')
        .select('*')
        .eq('project_id', project.id)
        .limit(1);

      if (sectionsError) {
        console.error('❌ Error obteniendo secciones:', sectionsError);
        return;
      }

      if (sections && sections.length > 0) {
        // Intentar crear con solo los campos básicos
        const { data: newElement, error: newElementError } = await supabase
          .from('project_elements')
          .insert({
            section_id: sections[0].id,
            order_index: 1,
            content: {
              text: 'Elemento de prueba',
              type: 'heading'
            }
          })
          .select()
          .single();

        if (newElementError) {
          console.error('❌ Error creando elemento simple:', newElementError);
          console.log('📋 Posibles columnas disponibles:');
          console.log('   - id, section_id, order_index, content, is_active, created_at, updated_at');
        } else {
          console.log('✅ Elemento simple creado:', newElement);
        }
      }
      
    } else {
      console.log('✅ Elementos encontrados:', elements?.length || 0);
      if (elements && elements.length > 0) {
        console.log('📋 Columnas disponibles:', Object.keys(elements[0]));
        console.log('📋 Ejemplo de elemento:', elements[0]);
      }
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkElementsStructure();

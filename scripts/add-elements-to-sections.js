const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addElementsToSections() {
  try {
    console.log('🔄 Agregando elementos a las secciones...');

    // Obtener el proyecto existente
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', 'diseno-ux-ui-plataforma-ecommerce')
      .single();

    if (projectError) {
      console.error('❌ Error obteniendo proyecto:', projectError);
      return;
    }

    console.log('✅ Proyecto encontrado:', project.title);

    // Obtener las secciones del proyecto
    const { data: sections, error: sectionsError } = await supabase
      .from('project_sections')
      .select('*')
      .eq('project_id', project.id)
      .order('order_index');

    if (sectionsError) {
      console.error('❌ Error obteniendo secciones:', sectionsError);
      return;
    }

    console.log(`✅ Secciones encontradas: ${sections?.length || 0}`);

    // Crear elementos para cada sección
    for (const section of sections || []) {
      console.log(`📝 Procesando sección: ${section.title}`);

      // Verificar si ya tiene elementos
      const { data: existingElements, error: elementsError } = await supabase
        .from('project_elements')
        .select('*')
        .eq('section_id', section.id);

      if (elementsError) {
        console.error('❌ Error verificando elementos existentes:', elementsError);
        continue;
      }

      if (existingElements && existingElements.length > 0) {
        console.log(`   ⏭️  Sección ya tiene ${existingElements.length} elementos, saltando...`);
        continue;
      }

      // Crear elementos para la sección
      const elements = [
        {
          type: 'heading',
          order_index: 1,
          section_id: section.id,
          content: {
            text: section.title,
            level: 2,
            style: 'default',
            alignment: 'left'
          }
        },
        {
          type: 'paragraph',
          order_index: 2,
          section_id: section.id,
          content: {
            text: `Contenido detallado de la sección "${section.title}". Este es un texto de ejemplo que demuestra cómo se ve el contenido en la página del proyecto. El diseño estilo Behance permite mostrar información de manera clara y atractiva, con un enfoque en la legibilidad y la experiencia del usuario.`,
            size: 'lg',
            alignment: 'left',
            color: 'default'
          }
        }
      ];

      for (const element of elements) {
        const { error: elementError } = await supabase
          .from('project_elements')
          .insert(element);

        if (elementError) {
          console.error('❌ Error creando elemento:', elementError);
        } else {
          console.log(`   ✅ Elemento creado: ${element.type}`);
        }
      }
    }

    console.log('🎉 Elementos agregados exitosamente!');
    console.log('📋 Ahora puedes acceder al proyecto en:');
    console.log('   http://localhost:3000/proyecto/diseno-ux-ui-plataforma-ecommerce');

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

addElementsToSections();

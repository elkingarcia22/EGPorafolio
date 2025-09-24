const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createSectionsComplete() {
  try {
    console.log('🔄 Creando secciones completas...');

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

    // Crear secciones con todos los campos requeridos
    const sections = [
      {
        title: 'El Desafío',
        section_type: 'text',
        project_id: project.id,
        order_index: 1
      },
      {
        title: 'Proceso de Diseño',
        section_type: 'text',
        project_id: project.id,
        order_index: 2
      },
      {
        title: 'Resultados',
        section_type: 'text',
        project_id: project.id,
        order_index: 3
      }
    ];

    // Crear secciones
    for (const section of sections) {
      const { data: sectionData, error: sectionError } = await supabase
        .from('project_sections')
        .insert(section)
        .select()
        .single();

      if (sectionError) {
        console.error('❌ Error creando sección:', sectionError);
        continue;
      }

      console.log('✅ Sección creada:', sectionData.title);

      // Crear elementos para cada sección
      const elements = [
        {
          type: 'heading',
          order_index: 1,
          section_id: sectionData.id,
          content: {
            text: section.title,
            level: 2
          }
        },
        {
          type: 'paragraph',
          order_index: 2,
          section_id: sectionData.id,
          content: {
            text: `Contenido de la sección "${section.title}". Este es un texto de ejemplo que demuestra cómo se ve el contenido en la página del proyecto. El diseño estilo Behance permite mostrar información de manera clara y atractiva.`,
            size: 'lg'
          }
        }
      ];

      for (const element of elements) {
        const { error: elementError } = await supabase
          .from('project_elements')
          .insert(element);

        if (elementError) {
          console.error('❌ Error creando elemento:', elementError);
        }
      }
    }

    console.log('🎉 Secciones creadas exitosamente!');
    console.log('📋 Ahora puedes acceder al proyecto en:');
    console.log('   http://localhost:3000/proyecto/diseno-ux-ui-plataforma-ecommerce');
    console.log('   O haz clic en la primera card del home');

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

createSectionsComplete();

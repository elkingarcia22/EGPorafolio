const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addSectionsToProject() {
  try {
    console.log('🔄 Agregando secciones al proyecto...');

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

    // Crear secciones
    const sections = [
      {
        title: 'El Desafío',
        type: 'text',
        order_index: 1,
        project_id: project.id,
        content: {
          title: 'El Desafío',
          text: 'Crear una plataforma de e-commerce que combine funcionalidad avanzada con una experiencia de usuario intuitiva y accesible. El objetivo era aumentar las conversiones en un 40% mientras se mantenía la simplicidad de uso.'
        }
      },
      {
        title: 'Proceso de Diseño',
        type: 'text',
        order_index: 2,
        project_id: project.id,
        content: {
          title: 'Nuestro Proceso',
          text: 'Utilizamos un enfoque centrado en el usuario, comenzando con investigación exhaustiva, creación de wireframes, prototipado interactivo y testing continuo con usuarios reales.'
        }
      },
      {
        title: 'Resultados',
        type: 'text',
        order_index: 3,
        project_id: project.id,
        content: {
          title: 'Resultados Obtenidos',
          text: 'El nuevo diseño resultó en un aumento del 45% en las conversiones, una reducción del 30% en el tiempo de carga percibido y una mejora significativa en la satisfacción del usuario.'
        }
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
            text: section.content.title,
            level: 2
          }
        },
        {
          type: 'paragraph',
          order_index: 2,
          section_id: sectionData.id,
          content: {
            text: section.content.text,
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

    console.log('🎉 Secciones agregadas exitosamente!');
    console.log('📋 Ahora puedes acceder al proyecto en:');
    console.log('   http://localhost:3000/proyecto/diseno-ux-ui-plataforma-ecommerce');

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

addSectionsToProject();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createSampleProject() {
  try {
    console.log('🔄 Creando proyecto de muestra...');

    // 1. Crear el proyecto principal
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        title: 'Diseño UX/UI - Plataforma de E-commerce',
        slug: 'diseno-ux-ui-plataforma-ecommerce',
        description: 'Diseño completo de experiencia de usuario e interfaz para una plataforma de comercio electrónico moderna y accesible.',
        cover_image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
        status: 'published',
        featured: true,
        order_index: 1,
        client_name: 'TechCorp Solutions',
        project_type: 'UX/UI Design',
        duration: '3 meses',
        team_size: 4,
        technologies: ['Figma', 'Adobe XD', 'Sketch', 'Principle', 'InVision'],
        project_url: 'https://techcorp-ecommerce.com',
        github_url: 'https://github.com/techcorp/ecommerce-ui',
        meta_title: 'Diseño UX/UI - Plataforma E-commerce | Elkin García',
        meta_description: 'Diseño completo de experiencia de usuario para plataforma de comercio electrónico moderna.',
        meta_keywords: ['UX Design', 'UI Design', 'E-commerce', 'Figma', 'User Experience']
      })
      .select()
      .single();

    if (projectError) {
      console.error('❌ Error creando proyecto:', projectError);
      return;
    }

    console.log('✅ Proyecto creado:', project.title);
    console.log('🔗 URL del proyecto: /proyecto/diseno-ux-ui-plataforma-ecommerce');

    // 2. Crear secciones básicas
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

      // 3. Crear elementos para cada sección
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

    console.log('🎉 Proyecto de muestra creado exitosamente!');
    console.log('📋 Para acceder al proyecto:');
    console.log('   1. Ve a: http://localhost:3000/proyecto/diseno-ux-ui-plataforma-ecommerce');
    console.log('   2. O haz clic en la primera card del home');

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

createSampleProject();

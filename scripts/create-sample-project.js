const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createSampleProject() {
  console.log('🚀 Creando proyecto de ejemplo...');

  try {
    // Crear proyecto
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        title: 'Portafolio Personal - Diseño UX/UI',
        slug: 'portafolio-personal-ux-ui',
        description: 'Diseño completo de un portafolio personal moderno con enfoque en UX/UI, incluyendo sistema de diseño, componentes reutilizables y experiencia de usuario optimizada.',
        cover_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
        status: 'published',
        featured: true,
        client_name: 'Proyecto Personal',
        project_type: 'UX/UI Design',
        duration: '3 meses',
        team_size: 1,
        technologies: ['Figma', 'React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
        project_url: 'https://github.com/elkinmac/portafolio',
        github_url: 'https://github.com/elkinmac/portafolio',
        meta_title: 'Portafolio Personal - Diseño UX/UI | Elkin García',
        meta_description: 'Diseño completo de un portafolio personal moderno con enfoque en UX/UI',
        meta_keywords: ['UX', 'UI', 'Diseño', 'Portafolio', 'React', 'Next.js']
      })
      .select()
      .single();

    if (projectError) {
      throw new Error(`Error creando proyecto: ${projectError.message}`);
    }

    console.log('✅ Proyecto creado:', project.title);

    // Crear sección Hero
    const { data: heroSection, error: heroError } = await supabase
      .from('project_sections')
      .insert({
        project_id: project.id,
        section_type: 'hero',
        title: 'El Desafío',
        order_index: 1,
        width: 'full',
        alignment: 'center'
      })
      .select()
      .single();

    if (heroError) {
      throw new Error(`Error creando sección hero: ${heroError.message}`);
    }

    // Crear elementos para la sección Hero
    const heroElements = [
      {
        section_id: heroSection.id,
        element_type: 'heading',
        content: { level: 2, text: 'Crear una experiencia digital excepcional' },
        order_index: 1,
        width: 'full',
        alignment: 'center',
        styling: { fontSize: '2.5rem', fontWeight: 'bold' }
      },
      {
        section_id: heroSection.id,
        element_type: 'paragraph',
        content: { 
          text: 'El objetivo era diseñar y desarrollar un portafolio personal que no solo mostrara mi trabajo, sino que también demostrara mis habilidades en diseño UX/UI y desarrollo frontend. La meta era crear una experiencia fluida, moderna y memorable que conectara con los visitantes desde el primer momento.' 
        },
        order_index: 2,
        width: 'full',
        alignment: 'center',
        styling: { fontSize: '1.125rem', lineHeight: '1.75' }
      }
    ];

    for (const element of heroElements) {
      const { error: elementError } = await supabase
        .from('project_elements')
        .insert(element);

      if (elementError) {
        console.error(`Error creando elemento: ${elementError.message}`);
      }
    }

    // Crear sección de Proceso
    const { data: processSection, error: processError } = await supabase
      .from('project_sections')
      .insert({
        project_id: project.id,
        section_type: 'process',
        title: 'El Proceso',
        order_index: 2,
        width: 'full',
        alignment: 'center'
      })
      .select()
      .single();

    if (processError) {
      throw new Error(`Error creando sección proceso: ${processError.message}`);
    }

    // Crear elementos para la sección Proceso
    const processElements = [
      {
        section_id: processSection.id,
        element_type: 'heading',
        content: { level: 3, text: '1. Investigación y Análisis' },
        order_index: 1,
        width: 'full',
        alignment: 'left'
      },
      {
        section_id: processSection.id,
        element_type: 'paragraph',
        content: { 
          text: 'Comencé analizando portafolios de diseñadores y desarrolladores destacados, identificando patrones de éxito y oportunidades de mejora. Realicé entrevistas con profesionales del sector para entender qué buscan en un portafolio.' 
        },
        order_index: 2,
        width: 'full',
        alignment: 'left'
      },
      {
        section_id: processSection.id,
        element_type: 'spacer',
        content: { height: 40 },
        order_index: 3,
        width: 'full',
        alignment: 'center'
      },
      {
        section_id: processSection.id,
        element_type: 'heading',
        content: { level: 3, text: '2. Wireframing y Prototipado' },
        order_index: 4,
        width: 'full',
        alignment: 'left'
      },
      {
        section_id: processSection.id,
        element_type: 'paragraph',
        content: { 
          text: 'Desarrollé wireframes detallados en Figma, enfocándome en la jerarquía visual y la experiencia de usuario. Creé prototipos interactivos para validar la navegación y el flujo de información.' 
        },
        order_index: 5,
        width: 'full',
        alignment: 'left'
      }
    ];

    for (const element of processElements) {
      const { error: elementError } = await supabase
        .from('project_elements')
        .insert(element);

      if (elementError) {
        console.error(`Error creando elemento: ${elementError.message}`);
      }
    }

    // Crear sección de Resultados
    const { data: resultsSection, error: resultsError } = await supabase
      .from('project_sections')
      .insert({
        project_id: project.id,
        section_type: 'stats',
        title: 'Resultados',
        order_index: 3,
        width: 'full',
        alignment: 'center'
      })
      .select()
      .single();

    if (resultsError) {
      throw new Error(`Error creando sección resultados: ${resultsError.message}`);
    }

    // Crear elementos para la sección Resultados
    const resultsElements = [
      {
        section_id: resultsSection.id,
        element_type: 'quote',
        content: { 
          text: 'El resultado final superó todas las expectativas. Logramos crear una experiencia digital que no solo muestra el trabajo, sino que también cuenta una historia coherente y memorable.',
          author: 'Elkin García, Diseñador UX/UI'
        },
        order_index: 1,
        width: 'full',
        alignment: 'center'
      },
      {
        section_id: resultsSection.id,
        element_type: 'spacer',
        content: { height: 60 },
        order_index: 2,
        width: 'full',
        alignment: 'center'
      },
      {
        section_id: resultsSection.id,
        element_type: 'button',
        content: { 
          text: 'Ver Proyecto Completo',
          href: 'https://github.com/elkinmac/portafolio',
          variant: 'primary',
          size: 'lg'
        },
        order_index: 3,
        width: 'full',
        alignment: 'center'
      }
    ];

    for (const element of resultsElements) {
      const { error: elementError } = await supabase
        .from('project_elements')
        .insert(element);

      if (elementError) {
        console.error(`Error creando elemento: ${elementError.message}`);
      }
    }

    console.log('🎉 Proyecto de ejemplo creado exitosamente!');
    console.log(`📄 URL: /proyecto/${project.slug}`);
    console.log(`🔗 Título: ${project.title}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createSampleProject();

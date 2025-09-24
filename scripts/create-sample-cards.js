const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createSampleCards() {
  try {
    console.log('🔄 Creando cards de proyectos de ejemplo...');

    // Verificar si ya existen proyectos
    const { data: existingProjects, error: checkError } = await supabase
      .from('projects')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('❌ Error verificando proyectos existentes:', checkError);
      return;
    }

    if (existingProjects && existingProjects.length > 0) {
      console.log('✅ Ya existen proyectos en la base de datos');
      return;
    }

    // Crear proyectos de ejemplo
    const sampleProjects = [
      {
        title: 'Diseño UX/UI',
        title_es: 'Diseño UX/UI',
        title_en: 'UX/UI Design',
        description: 'Creación de experiencias digitales intuitivas y atractivas que conectan con los usuarios.',
        description_es: 'Creación de experiencias digitales intuitivas y atractivas que conectan con los usuarios.',
        description_en: 'Creating intuitive and attractive digital experiences that connect with users.',
        cover_image_url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
        status: 'published',
        featured: true,
        order_index: 1,
        slug: 'diseno-ux-ui',
        project_type: 'UX/UI Design',
        technologies: ['Figma', 'Adobe XD', 'Sketch']
      },
      {
        title: 'Desarrollo Frontend',
        title_es: 'Desarrollo Frontend',
        title_en: 'Frontend Development',
        description: 'Implementación de interfaces modernas con las últimas tecnologías web.',
        description_es: 'Implementación de interfaces modernas con las últimas tecnologías web.',
        description_en: 'Implementation of modern interfaces with the latest web technologies.',
        cover_image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
        status: 'published',
        featured: true,
        order_index: 2,
        slug: 'desarrollo-frontend',
        project_type: 'Frontend Development',
        technologies: ['React', 'Next.js', 'TypeScript']
      },
      {
        title: 'Estrategia Digital',
        title_es: 'Estrategia Digital',
        title_en: 'Digital Strategy',
        description: 'Desarrollo de estrategias integrales para maximizar el impacto digital de las marcas.',
        description_es: 'Desarrollo de estrategias integrales para maximizar el impacto digital de las marcas.',
        description_en: 'Development of comprehensive strategies to maximize brands\' digital impact.',
        cover_image_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
        status: 'published',
        featured: true,
        order_index: 3,
        slug: 'estrategia-digital',
        project_type: 'Digital Strategy',
        technologies: ['Analytics', 'SEO', 'Marketing']
      },
      {
        title: 'Diseño con IA',
        title_es: 'Diseño con IA',
        title_en: 'AI-Powered Design',
        description: 'Integración de inteligencia artificial en procesos creativos para optimizar resultados.',
        description_es: 'Integración de inteligencia artificial en procesos creativos para optimizar resultados.',
        description_en: 'Integration of artificial intelligence in creative processes to optimize results.',
        cover_image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
        status: 'published',
        featured: true,
        order_index: 4,
        slug: 'diseno-con-ia',
        project_type: 'AI Design',
        technologies: ['Midjourney', 'ChatGPT', 'Automation']
      }
    ];

    const { data, error } = await supabase
      .from('projects')
      .insert(sampleProjects);

    if (error) {
      console.error('❌ Error creando proyectos:', error);
      return;
    }

    console.log('✅ Proyectos de ejemplo creados exitosamente');
    console.log('📊 Proyectos creados:', data?.length || sampleProjects.length);

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

createSampleCards();

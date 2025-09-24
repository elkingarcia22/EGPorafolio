const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminProjects() {
  try {
    console.log('🔄 Creando proyectos para el administrador...');

    // Primero, eliminar el proyecto existente si es necesario
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Eliminar todos

    if (deleteError) {
      console.log('⚠️ No se pudieron eliminar proyectos existentes:', deleteError.message);
    } else {
      console.log('🗑️ Proyectos existentes eliminados');
    }

    // Crear proyectos de ejemplo para el administrador
    const sampleProjects = [
      {
        title: 'Diseño UX/UI',
        slug: 'diseno-ux-ui',
        description: 'Creación de experiencias digitales intuitivas y atractivas que conectan con los usuarios.',
        cover_image_url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
        status: 'published',
        featured: true,
        order_index: 1,
        project_type: 'UX/UI Design',
        technologies: ['Figma', 'Adobe XD', 'Sketch']
      },
      {
        title: 'Desarrollo Frontend',
        slug: 'desarrollo-frontend',
        description: 'Implementación de interfaces modernas con las últimas tecnologías web.',
        cover_image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
        status: 'published',
        featured: true,
        order_index: 2,
        project_type: 'Frontend Development',
        technologies: ['React', 'Next.js', 'TypeScript']
      },
      {
        title: 'Estrategia Digital',
        slug: 'estrategia-digital',
        description: 'Desarrollo de estrategias integrales para maximizar el impacto digital de las marcas.',
        cover_image_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
        status: 'published',
        featured: true,
        order_index: 3,
        project_type: 'Digital Strategy',
        technologies: ['Analytics', 'SEO', 'Marketing']
      },
      {
        title: 'Diseño con IA',
        slug: 'diseno-con-ia',
        description: 'Integración de inteligencia artificial en procesos creativos para optimizar resultados.',
        cover_image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
        status: 'published',
        featured: true,
        order_index: 4,
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

    console.log('✅ Proyectos creados exitosamente');
    console.log('📊 Proyectos creados:', data?.length || sampleProjects.length);

    // Verificar que se crearon correctamente
    const { data: verifyData, error: verifyError } = await supabase
      .from('projects')
      .select('*')
      .order('order_index');

    if (verifyError) {
      console.error('❌ Error verificando proyectos:', verifyError);
      return;
    }

    console.log('🔍 Verificación - Proyectos en la base de datos:', verifyData?.length || 0);
    verifyData?.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (Orden: ${project.order_index})`);
    });

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

createAdminProjects();

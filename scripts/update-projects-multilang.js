const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProjectsMultilang() {
  try {
    console.log('🔄 Actualizando proyectos con contenido multiidioma...');

    // Obtener todos los proyectos
    const { data: projects, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .order('order_index');

    if (fetchError) {
      console.error('❌ Error obteniendo proyectos:', fetchError);
      return;
    }

    console.log('📊 Proyectos encontrados:', projects?.length || 0);

    // Traducciones en inglés
    const translations = {
      'Diseño UX/UI': 'UX/UI Design',
      'Desarrollo Frontend': 'Frontend Development',
      'Estrategia Digital': 'Digital Strategy',
      'Diseño con IA': 'AI-Powered Design',
      'Creación de experiencias digitales intuitivas y atractivas que conectan con los usuarios.': 'Creating intuitive and attractive digital experiences that connect with users.',
      'Implementación de interfaces modernas con las últimas tecnologías web.': 'Implementation of modern interfaces with the latest web technologies.',
      'Desarrollo de estrategias integrales para maximizar el impacto digital de las marcas.': 'Development of comprehensive strategies to maximize brands\' digital impact.',
      'Integración de inteligencia artificial en procesos creativos para optimizar resultados.': 'Integration of artificial intelligence in creative processes to optimize results.'
    };

    // Actualizar cada proyecto
    for (const project of projects || []) {
      const titleEn = translations[project.title] || project.title;
      const descriptionEn = translations[project.description] || project.description;

      const { error: updateError } = await supabase
        .from('projects')
        .update({
          title_es: project.title,
          title_en: titleEn,
          description_es: project.description,
          description_en: descriptionEn,
          language: 'es'
        })
        .eq('id', project.id);

      if (updateError) {
        console.error(`❌ Error actualizando proyecto ${project.title}:`, updateError);
      } else {
        console.log(`✅ Proyecto actualizado: ${project.title}`);
      }
    }

    console.log('🎉 Actualización completada');

    // Verificar los resultados
    const { data: verifyData, error: verifyError } = await supabase
      .from('projects')
      .select('title, title_es, title_en, description_es, description_en, language')
      .order('order_index');

    if (verifyError) {
      console.error('❌ Error verificando resultados:', verifyError);
      return;
    }

    console.log('\n📋 Resultados:');
    verifyData?.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title_es || project.title}`);
      console.log(`   ES: ${project.title_es || project.title}`);
      console.log(`   EN: ${project.title_en || 'Sin traducir'}`);
      console.log(`   Idioma: ${project.language}`);
      console.log('');
    });

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

updateProjectsMultilang();

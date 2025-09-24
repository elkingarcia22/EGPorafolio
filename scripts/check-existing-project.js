const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkExistingProject() {
  try {
    console.log('🔍 Verificando proyecto existente...');

    // Verificar si el proyecto existe
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
    console.log('📋 Detalles del proyecto:');
    console.log(`   - ID: ${project.id}`);
    console.log(`   - Título: ${project.title}`);
    console.log(`   - Slug: ${project.slug}`);
    console.log(`   - Estado: ${project.status}`);
    console.log(`   - Cliente: ${project.client_name}`);
    console.log(`   - Tipo: ${project.project_type}`);

    // Verificar secciones
    const { data: sections, error: sectionsError } = await supabase
      .from('project_sections')
      .select('*')
      .eq('project_id', project.id)
      .order('order_index');

    if (sectionsError) {
      console.error('❌ Error obteniendo secciones:', sectionsError);
    } else {
      console.log(`   - Secciones: ${sections?.length || 0}`);
      sections?.forEach((section, index) => {
        console.log(`     ${index + 1}. ${section.title} (${section.type})`);
      });
    }

    // Verificar elementos
    if (sections && sections.length > 0) {
      const sectionIds = sections.map(s => s.id);
      const { data: elements, error: elementsError } = await supabase
        .from('project_elements')
        .select('*')
        .in('section_id', sectionIds)
        .order('order_index');

      if (elementsError) {
        console.error('❌ Error obteniendo elementos:', elementsError);
      } else {
        console.log(`   - Elementos: ${elements?.length || 0}`);
      }
    }

    console.log('\n🎯 Para acceder al proyecto:');
    console.log('   1. Ve a: http://localhost:3000/proyecto/diseno-ux-ui-plataforma-ecommerce');
    console.log('   2. O haz clic en la primera card del home');
    console.log('   3. Asegúrate de que el servidor esté corriendo: npm run dev');

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkExistingProject();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProjects() {
  try {
    console.log('🔄 Verificando proyectos en la base de datos...');

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_index');

    if (error) {
      console.error('❌ Error obteniendo proyectos:', error);
      return;
    }

    console.log('📊 Proyectos encontrados:', projects?.length || 0);
    
    if (projects && projects.length > 0) {
      console.log('\n📋 Lista de proyectos:');
      projects.forEach((project, index) => {
        console.log(`${index + 1}. ${project.title || 'Sin título'}`);
        console.log(`   - ID: ${project.id}`);
        console.log(`   - Slug: ${project.slug || 'Sin slug'}`);
        console.log(`   - Status: ${project.status || 'Sin status'}`);
        console.log(`   - Orden: ${project.order_index || 0}`);
        console.log(`   - Título ES: ${project.title_es || 'Sin título ES'}`);
        console.log(`   - Título EN: ${project.title_en || 'Sin título EN'}`);
        console.log('');
      });
    } else {
      console.log('❌ No se encontraron proyectos en la base de datos');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkProjects();

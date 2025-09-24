const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugProjects() {
  try {
    console.log('🔍 Debugging proyectos...');
    console.log('🔗 Supabase URL:', supabaseUrl);
    console.log('🔑 Supabase Key (primeros 10 chars):', supabaseKey.substring(0, 10) + '...');

    // Verificar conexión
    const { data: testData, error: testError } = await supabase
      .from('projects')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Error de conexión a Supabase:', testError);
      return;
    }

    console.log('✅ Conexión a Supabase exitosa');

    // Obtener todos los proyectos
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
      console.log('\n📋 Detalles de proyectos:');
      projects.forEach((project, index) => {
        console.log(`\n${index + 1}. Proyecto ID: ${project.id}`);
        console.log(`   - Título: ${project.title}`);
        console.log(`   - Slug: ${project.slug}`);
        console.log(`   - Status: ${project.status}`);
        console.log(`   - Orden: ${project.order_index}`);
        console.log(`   - Featured: ${project.featured}`);
        console.log(`   - Descripción: ${project.description?.substring(0, 50)}...`);
        console.log(`   - Imagen: ${project.cover_image_url ? 'Sí' : 'No'}`);
      });
    } else {
      console.log('❌ No se encontraron proyectos en la base de datos');
    }

    // Simular la consulta que hace el admin-context
    console.log('\n🔍 Simulando consulta del admin-context...');
    const { data: adminProjects, error: adminError } = await supabase
      .from('projects')
      .select('*')
      .order('order_index');

    if (adminError) {
      console.error('❌ Error en consulta del admin:', adminError);
      return;
    }

    console.log('✅ Consulta del admin exitosa');
    console.log('📊 Proyectos para admin:', adminProjects?.length || 0);

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

debugProjects();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateExistingProject() {
  try {
    console.log('🔄 Actualizando proyecto existente con campos multiidioma...');

    // Obtener el proyecto existente
    const { data: existingProject, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .limit(1)
      .single();

    if (fetchError) {
      console.error('❌ Error obteniendo proyecto existente:', fetchError);
      return;
    }

    if (!existingProject) {
      console.log('❌ No se encontró ningún proyecto existente');
      return;
    }

    console.log('📋 Proyecto encontrado:', existingProject.title);

    // Actualizar con campos multiidioma
    const { data, error } = await supabase
      .from('projects')
      .update({
        title_es: existingProject.title,
        title_en: 'Personal Portfolio - UX/UI Design',
        description_es: existingProject.description,
        description_en: 'Complete redesign of a personal portfolio with modern UX/UI design principles, focusing on user experience and visual appeal.',
        order_index: 1
      })
      .eq('id', existingProject.id);

    if (error) {
      console.error('❌ Error actualizando proyecto:', error);
      return;
    }

    console.log('✅ Proyecto actualizado exitosamente');
    console.log('📊 Datos actualizados:', data);

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

updateExistingProject();

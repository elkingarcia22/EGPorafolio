const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addMultilangColumns() {
  try {
    console.log('🔄 Agregando columnas multiidioma a la tabla projects...');

    // SQL para agregar las columnas
    const sql = `
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS title_es VARCHAR(255),
      ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
      ADD COLUMN IF NOT EXISTS description_es TEXT,
      ADD COLUMN IF NOT EXISTS description_en TEXT,
      ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'es' CHECK (language IN ('es', 'en'));
    `;

    const { data, error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      console.error('❌ Error ejecutando SQL:', error);
      return;
    }

    console.log('✅ Columnas multiidioma agregadas exitosamente');

    // Actualizar el proyecto existente
    console.log('🔄 Actualizando proyecto existente...');
    
    const { data: updateData, error: updateError } = await supabase
      .from('projects')
      .update({
        title_es: 'Portafolio Personal - Diseño UX/UI',
        title_en: 'Personal Portfolio - UX/UI Design',
        description_es: 'Rediseño completo de un portafolio personal con principios modernos de diseño UX/UI, enfocándose en la experiencia del usuario y el atractivo visual.',
        description_en: 'Complete redesign of a personal portfolio with modern UX/UI design principles, focusing on user experience and visual appeal.',
        order_index: 1
      })
      .eq('id', '41077f11-f80d-4133-a8dc-8d47c581a2e8');

    if (updateError) {
      console.error('❌ Error actualizando proyecto:', updateError);
      return;
    }

    console.log('✅ Proyecto actualizado exitosamente');

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

addMultilangColumns();

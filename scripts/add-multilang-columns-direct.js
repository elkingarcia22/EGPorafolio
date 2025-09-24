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

    // Primero, verificar la estructura actual de la tabla
    const { data: tableInfo, error: tableError } = await supabase
      .from('projects')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Error obteniendo información de la tabla:', tableError);
      return;
    }

    console.log('📋 Estructura actual de la tabla projects:');
    if (tableInfo && tableInfo.length > 0) {
      const columns = Object.keys(tableInfo[0]);
      console.log('Columnas existentes:', columns);
    }

    // Intentar agregar las columnas usando una consulta directa
    const alterQueries = [
      'ALTER TABLE projects ADD COLUMN IF NOT EXISTS title_es VARCHAR(255);',
      'ALTER TABLE projects ADD COLUMN IF NOT EXISTS title_en VARCHAR(255);',
      'ALTER TABLE projects ADD COLUMN IF NOT EXISTS description_es TEXT;',
      'ALTER TABLE projects ADD COLUMN IF NOT EXISTS description_en TEXT;',
      'ALTER TABLE projects ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT \'es\';'
    ];

    for (const query of alterQueries) {
      try {
        console.log(`🔄 Ejecutando: ${query}`);
        const { data, error } = await supabase.rpc('exec_sql', { sql: query });
        
        if (error) {
          console.log(`⚠️ Error con exec_sql, intentando método alternativo: ${error.message}`);
          // Si exec_sql no funciona, intentar con una consulta directa
          const { data: altData, error: altError } = await supabase
            .from('projects')
            .select('*')
            .limit(0);
          
          if (altError) {
            console.error(`❌ Error alternativo: ${altError.message}`);
          } else {
            console.log('✅ Consulta alternativa exitosa');
          }
        } else {
          console.log('✅ Columna agregada exitosamente');
        }
      } catch (err) {
        console.log(`⚠️ Error ejecutando query: ${err.message}`);
      }
    }

    // Verificar si las columnas se agregaron correctamente
    console.log('🔍 Verificando columnas agregadas...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('projects')
      .select('*')
      .limit(1);

    if (verifyError) {
      console.error('❌ Error verificando columnas:', verifyError);
      return;
    }

    if (verifyData && verifyData.length > 0) {
      const newColumns = Object.keys(verifyData[0]);
      console.log('📋 Nuevas columnas disponibles:', newColumns);
      
      const multilangColumns = ['title_es', 'title_en', 'description_es', 'description_en', 'language'];
      const missingColumns = multilangColumns.filter(col => !newColumns.includes(col));
      
      if (missingColumns.length === 0) {
        console.log('✅ Todas las columnas multiidioma están disponibles');
      } else {
        console.log('⚠️ Columnas faltantes:', missingColumns);
      }
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

addMultilangColumns();

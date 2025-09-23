const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  console.log('💡 Asegúrate de tener:')
  console.log('   - NEXT_PUBLIC_SUPABASE_URL')
  console.log('   - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupColorsComplete() {
  try {
    console.log('🎨 Configurando sistema de colores completo...')
    
    // 1. Verificar si la tabla existe
    console.log('🔍 Verificando si la tabla colors existe...')
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_table_names')
      .catch(() => {
        // Si la función no existe, intentar una consulta directa
        return supabase
          .from('colors')
          .select('id')
          .limit(1)
      })
    
    if (tablesError && tablesError.message.includes('relation "colors" does not exist')) {
      console.log('📋 La tabla colors no existe. Creándola...')
      
      // Crear la tabla usando SQL directo
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS colors (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          gradient_css TEXT NOT NULL,
          is_active BOOLEAN DEFAULT true,
          is_default BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_colors_active ON colors(is_active);
        CREATE INDEX IF NOT EXISTS idx_colors_default ON colors(is_default);
        
        ALTER TABLE colors ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY IF NOT EXISTS "Allow read access to colors" ON colors
          FOR SELECT USING (true);
        
        CREATE POLICY IF NOT EXISTS "Allow authenticated users to manage colors" ON colors
          FOR ALL USING (auth.role() = 'authenticated');
      `
      
      const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL })
      
      if (createError) {
        console.error('❌ Error creando tabla:', createError)
        console.log('💡 Ejecuta manualmente el SQL en Supabase Dashboard:')
        console.log('   - Ve a SQL Editor')
        console.log('   - Copia el contenido de scripts/create-colors-table.sql')
        console.log('   - Ejecuta el SQL')
        return
      }
      
      console.log('✅ Tabla colors creada exitosamente')
    } else {
      console.log('✅ La tabla colors ya existe')
    }
    
    // 2. Insertar datos iniciales
    console.log('📝 Insertando datos iniciales...')
    
    const colorsData = [
      {
        name: 'Gradiente Original',
        gradient_css: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)',
        is_active: true,
        is_default: true
      },
      {
        name: 'Gradiente Alternativo 1',
        gradient_css: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        is_active: true,
        is_default: false
      },
      {
        name: 'Gradiente Alternativo 2',
        gradient_css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        is_active: true,
        is_default: false
      },
      {
        name: 'Gradiente Alternativo 3',
        gradient_css: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        is_active: true,
        is_default: false
      }
    ]
    
    // Primero, desactivar todos los registros existentes
    const { error: deactivateError } = await supabase
      .from('colors')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (deactivateError) {
      console.warn('⚠️ No se pudieron desactivar registros existentes:', deactivateError.message)
    }
    
    // Insertar nuevos datos
    const { data, error } = await supabase
      .from('colors')
      .insert(colorsData)
    
    if (error) {
      console.error('❌ Error insertando datos:', error)
      throw error
    }
    
    console.log('✅ Datos de colores insertados exitosamente')
    console.log(`📊 Total de registros insertados: ${colorsData.length}`)
    
    // 3. Verificar la instalación
    console.log('🔍 Verificando instalación...')
    const { data: verifyData, error: verifyError } = await supabase
      .from('colors')
      .select('*')
      .eq('is_active', true)
      .order('is_default DESC, name')
    
    if (verifyError) {
      console.error('❌ Error verificando datos:', verifyError)
    } else {
      console.log('✅ Verificación exitosa:')
      console.log(`📋 Registros activos: ${verifyData.length}`)
      
      verifyData.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} ${item.is_default ? '(DEFAULT)' : ''}`)
      })
    }
    
    console.log('🎉 ¡Sistema de colores configurado completamente!')
    console.log('💡 Ahora puedes usar la sección Colores en el administrador')
    
  } catch (error) {
    console.error('❌ Error en el proceso:', error)
    console.log('💡 Soluciones posibles:')
    console.log('   1. Verifica que las variables de entorno estén configuradas')
    console.log('   2. Ejecuta manualmente el SQL en Supabase Dashboard')
    console.log('   3. Verifica los permisos de la service role key')
    process.exit(1)
  }
}

setupColorsComplete()

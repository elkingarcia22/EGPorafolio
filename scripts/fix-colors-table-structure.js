const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixColorsTableStructure() {
  try {
    console.log('🔧 Corrigiendo estructura de la tabla colors...')
    
    // 1. Verificar columnas existentes
    console.log('📋 Verificando columnas existentes...')
    const { data: columnsData, error: columnsError } = await supabase
      .from('colors')
      .select('*')
      .limit(1)
    
    if (columnsError) {
      console.error('❌ Error verificando columnas:', columnsError)
      return
    }
    
    console.log('✅ Tabla accesible')
    
    // 2. Intentar agregar columnas faltantes
    console.log('📝 Agregando columnas faltantes...')
    
    const alterTableSQL = `
      -- Agregar columna is_default si no existe
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'colors' AND column_name = 'is_default') THEN
          ALTER TABLE colors ADD COLUMN is_default BOOLEAN DEFAULT FALSE;
        END IF;
      END $$;
      
      -- Agregar columna is_active si no existe
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'colors' AND column_name = 'is_active') THEN
          ALTER TABLE colors ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
        END IF;
      END $$;
      
      -- Agregar columna created_at si no existe
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'colors' AND column_name = 'created_at') THEN
          ALTER TABLE colors ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        END IF;
      END $$;
      
      -- Agregar columna updated_at si no existe
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'colors' AND column_name = 'updated_at') THEN
          ALTER TABLE colors ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        END IF;
      END $$;
    `
    
    const { error: alterError } = await supabase.rpc('exec_sql', { sql: alterTableSQL })
    
    if (alterError) {
      console.error('❌ Error alterando tabla:', alterError)
      console.log('💡 Intentando agregar columnas una por una...')
      
      // Intentar agregar columnas una por una
      const columns = [
        { name: 'is_default', type: 'BOOLEAN DEFAULT FALSE' },
        { name: 'is_active', type: 'BOOLEAN DEFAULT TRUE' },
        { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()' },
        { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()' }
      ]
      
      for (const column of columns) {
        try {
          const { error: columnError } = await supabase.rpc('exec_sql', { 
            sql: `ALTER TABLE colors ADD COLUMN IF NOT EXISTS ${column.name} ${column.type};` 
          })
          
          if (columnError) {
            console.error(`❌ Error agregando columna ${column.name}:`, columnError)
          } else {
            console.log(`✅ Columna ${column.name} agregada`)
          }
        } catch (error) {
          console.error(`❌ Error con columna ${column.name}:`, error.message)
        }
      }
    } else {
      console.log('✅ Estructura de tabla corregida')
    }
    
    // 3. Verificar estructura final
    console.log('🔍 Verificando estructura final...')
    const { data: finalData, error: finalError } = await supabase
      .from('colors')
      .select('*')
      .limit(1)
    
    if (finalError) {
      console.error('❌ Error verificando estructura final:', finalError)
      return
    }
    
    console.log('✅ Estructura verificada')
    
    // 4. Insertar datos de prueba si no existen
    console.log('📝 Verificando datos iniciales...')
    const { data: existingData } = await supabase
      .from('colors')
      .select('id')
      .limit(1)
    
    if (!existingData || existingData.length === 0) {
      console.log('📝 Insertando datos iniciales...')
      const colorsData = [
        {
          name: 'Gradiente Original',
          gradient_css: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)',
          is_active: true,
          is_default: true
        }
      ]
      
      const { data, error } = await supabase
        .from('colors')
        .insert(colorsData)
      
      if (error) {
        console.error('❌ Error insertando datos:', error)
      } else {
        console.log('✅ Datos iniciales insertados')
      }
    } else {
      console.log('✅ Datos ya existen')
    }
    
    console.log('🎉 ¡Estructura de tabla corregida exitosamente!')
    
  } catch (error) {
    console.error('❌ Error en el proceso:', error)
  }
}

fixColorsTableStructure()

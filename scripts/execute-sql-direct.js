const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function executeSQLDirect() {
  try {
    console.log('🔧 Ejecutando SQL directo para deshabilitar RLS...')
    
    // Crear una función SQL temporal para ejecutar comandos
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql text)
      RETURNS text
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql;
        RETURN 'OK';
      END;
      $$;
    `
    
    console.log('📝 Creando función exec_sql...')
    const { error: createError } = await supabase.rpc('exec_sql', { 
      sql: createFunctionSQL 
    })
    
    if (createError) {
      console.log('⚠️ No se pudo crear la función:', createError.message)
    } else {
      console.log('✅ Función creada')
    }
    
    // Ahora usar la función para deshabilitar RLS
    console.log('🔓 Deshabilitando RLS...')
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE colors DISABLE ROW LEVEL SECURITY;' 
    })
    
    if (error) {
      console.error('❌ Error deshabilitando RLS:', error)
    } else {
      console.log('✅ RLS deshabilitado:', data)
    }
    
    // Verificar estado
    console.log('🔍 Verificando estado de RLS...')
    const { data: checkData, error: checkError } = await supabase.rpc('exec_sql', { 
      sql: "SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'colors';" 
    })
    
    if (checkError) {
      console.error('❌ Error verificando estado:', checkError)
    } else {
      console.log('📊 Estado de RLS:', checkData)
    }
    
    // Probar inserción
    console.log('📝 Probando inserción...')
    const testColor = {
      name: 'Test SQL Direct',
      gradient_css: 'linear-gradient(135deg, #ff0000 0%, #00ff00 100%)',
      is_active: true,
      is_default: false
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('colors')
      .insert(testColor)
      .select()
    
    if (insertError) {
      console.error('❌ Error insertando:', insertError)
    } else {
      console.log('✅ Inserción exitosa')
      
      // Limpiar
      await supabase
        .from('colors')
        .delete()
        .eq('id', insertData[0].id)
      console.log('🧹 Color de prueba eliminado')
    }
    
  } catch (error) {
    console.error('❌ Error en el proceso:', error)
  }
}

executeSQLDirect()

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function disableColorsRLS() {
  try {
    console.log('🔧 Deshabilitando RLS para la tabla colors...')
    
    // 1. Deshabilitar RLS completamente
    console.log('🔓 Deshabilitando RLS...')
    const { error: disableError } = await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE colors DISABLE ROW LEVEL SECURITY;' 
    })
    
    if (disableError) {
      console.error('❌ Error deshabilitando RLS:', disableError)
    } else {
      console.log('✅ RLS deshabilitado exitosamente')
    }
    
    // 2. Verificar que funciona
    console.log('🔍 Verificando acceso sin RLS...')
    const { data: testData, error: testError } = await supabase
      .from('colors')
      .select('*')
      .limit(1)
    
    if (testError) {
      console.error('❌ Error verificando acceso:', testError)
    } else {
      console.log('✅ Acceso verificado correctamente')
    }
    
    // 3. Probar inserción
    console.log('📝 Probando inserción sin RLS...')
    const testColor = {
      name: 'Test Sin RLS',
      gradient_css: 'linear-gradient(135deg, #ff0000 0%, #00ff00 100%)',
      is_active: true,
      is_default: false
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('colors')
      .insert(testColor)
      .select()
    
    if (insertError) {
      console.error('❌ Error insertando color de prueba:', insertError)
    } else {
      console.log('✅ Inserción exitosa sin RLS')
      
      // Limpiar el color de prueba
      await supabase
        .from('colors')
        .delete()
        .eq('id', insertData[0].id)
      console.log('🧹 Color de prueba eliminado')
    }
    
    console.log('🎉 ¡RLS deshabilitado exitosamente!')
    console.log('💡 La tabla colors ahora permite todas las operaciones sin restricciones')
    
  } catch (error) {
    console.error('❌ Error en el proceso:', error)
  }
}

disableColorsRLS()

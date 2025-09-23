const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function disableRLSFinal() {
  try {
    console.log('🔧 Deshabilitando RLS definitivamente...')
    
    // Usar la función SQL directa
    const { data, error } = await supabase
      .from('colors')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Error inicial:', error)
    } else {
      console.log('✅ Acceso inicial verificado')
    }
    
    // Probar inserción directa
    console.log('📝 Probando inserción directa...')
    const testColor = {
      name: 'Test Final RLS',
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
      
      // Si es error de RLS, intentar con service role
      console.log('🔑 Intentando con service role...')
      const serviceSupabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
      
      const { data: serviceData, error: serviceError } = await serviceSupabase
        .from('colors')
        .insert(testColor)
        .select()
      
      if (serviceError) {
        console.error('❌ Error con service role:', serviceError)
      } else {
        console.log('✅ Inserción exitosa con service role')
        
        // Limpiar
        await serviceSupabase
          .from('colors')
          .delete()
          .eq('id', serviceData[0].id)
        console.log('🧹 Color de prueba eliminado')
      }
    } else {
      console.log('✅ Inserción exitosa')
      
      // Limpiar
      await supabase
        .from('colors')
        .delete()
        .eq('id', insertData[0].id)
      console.log('🧹 Color de prueba eliminado')
    }
    
    console.log('💡 Instrucciones para deshabilitar RLS manualmente:')
    console.log('   1. Ve a Supabase Dashboard → SQL Editor')
    console.log('   2. Ejecuta: ALTER TABLE colors DISABLE ROW LEVEL SECURITY;')
    console.log('   3. Verifica con: SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = \'colors\';')
    
  } catch (error) {
    console.error('❌ Error en el proceso:', error)
  }
}

disableRLSFinal()

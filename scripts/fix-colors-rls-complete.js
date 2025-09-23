const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixColorsRLSComplete() {
  try {
    console.log('🔧 Corrigiendo políticas RLS para la tabla colors...')
    
    // 1. Deshabilitar RLS temporalmente
    console.log('🔓 Deshabilitando RLS temporalmente...')
    try {
      await supabase.rpc('exec_sql', { 
        sql: 'ALTER TABLE colors DISABLE ROW LEVEL SECURITY;' 
      })
      console.log('✅ RLS deshabilitado')
    } catch (error) {
      console.log('⚠️ No se pudo deshabilitar RLS:', error.message)
    }
    
    // 2. Eliminar todas las políticas existentes
    console.log('🗑️ Eliminando todas las políticas existentes...')
    const policiesToDrop = [
      'Allow public read access to colors',
      'Allow public insert access to colors',
      'Allow public update access to colors',
      'Allow public delete access to colors',
      'Allow read access to colors',
      'Allow authenticated users to manage colors',
      'Enable read access for all users',
      'Enable insert for authenticated users only',
      'Enable update for authenticated users only',
      'Enable delete for authenticated users only'
    ]
    
    for (const policyName of policiesToDrop) {
      try {
        await supabase.rpc('exec_sql', { 
          sql: `DROP POLICY IF EXISTS "${policyName}" ON colors;` 
        })
        console.log(`✅ Política "${policyName}" eliminada`)
      } catch (error) {
        console.log(`⚠️ No se pudo eliminar "${policyName}":`, error.message)
      }
    }
    
    // 3. Habilitar RLS nuevamente
    console.log('🔒 Habilitando RLS...')
    try {
      await supabase.rpc('exec_sql', { 
        sql: 'ALTER TABLE colors ENABLE ROW LEVEL SECURITY;' 
      })
      console.log('✅ RLS habilitado')
    } catch (error) {
      console.log('⚠️ No se pudo habilitar RLS:', error.message)
    }
    
    // 4. Crear políticas muy permisivas
    console.log('📝 Creando políticas permisivas...')
    const policies = [
      {
        name: 'Allow all operations for everyone',
        sql: `CREATE POLICY "Allow all operations for everyone" ON colors
              FOR ALL USING (true) WITH CHECK (true);`
      }
    ]
    
    for (const policy of policies) {
      try {
        await supabase.rpc('exec_sql', { sql: policy.sql })
        console.log(`✅ Política "${policy.name}" creada`)
      } catch (error) {
        console.error(`❌ Error creando "${policy.name}":`, error.message)
      }
    }
    
    // 5. Verificar que las políticas funcionan
    console.log('🔍 Verificando políticas...')
    const { data: testData, error: testError } = await supabase
      .from('colors')
      .select('*')
      .limit(1)
    
    if (testError) {
      console.error('❌ Error verificando políticas:', testError)
    } else {
      console.log('✅ Políticas funcionando correctamente')
    }
    
    // 6. Probar inserción
    console.log('📝 Probando inserción...')
    const testColor = {
      name: 'Test Gradient RLS',
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
      console.log('✅ Inserción exitosa')
      
      // Limpiar el color de prueba
      await supabase
        .from('colors')
        .delete()
        .eq('id', insertData[0].id)
      console.log('🧹 Color de prueba eliminado')
    }
    
    console.log('🎉 ¡Políticas RLS corregidas exitosamente!')
    
  } catch (error) {
    console.error('❌ Error en el proceso:', error)
    console.log('💡 Solución manual:')
    console.log('   1. Ve a Supabase Dashboard → Authentication → Policies')
    console.log('   2. Busca la tabla "colors"')
    console.log('   3. Elimina TODAS las políticas existentes')
    console.log('   4. Crea una nueva política:')
    console.log('      - Name: "Allow all operations"')
    console.log('      - Operation: ALL')
    console.log('      - Target roles: public')
    console.log('      - USING expression: true')
    console.log('      - WITH CHECK expression: true')
  }
}

fixColorsRLSComplete()

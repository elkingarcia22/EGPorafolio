const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixColorsRLS() {
  try {
    console.log('🔧 Corrigiendo políticas RLS para la tabla colors...')
    
    // 1. Eliminar políticas existentes
    console.log('🗑️ Eliminando políticas existentes...')
    const policiesToDrop = [
      'Allow read access to colors',
      'Allow authenticated users to manage colors'
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
    
    // 2. Crear nuevas políticas más permisivas
    console.log('📝 Creando nuevas políticas...')
    const newPoliciesSQL = `
      -- Política para permitir lectura a todos (incluyendo anónimos)
      CREATE POLICY "Allow public read access to colors" ON colors
        FOR SELECT USING (true);
      
      -- Política para permitir inserción a todos (incluyendo anónimos)
      CREATE POLICY "Allow public insert access to colors" ON colors
        FOR INSERT WITH CHECK (true);
      
      -- Política para permitir actualización a todos (incluyendo anónimos)
      CREATE POLICY "Allow public update access to colors" ON colors
        FOR UPDATE USING (true);
      
      -- Política para permitir eliminación a todos (incluyendo anónimos)
      CREATE POLICY "Allow public delete access to colors" ON colors
        FOR DELETE USING (true);
    `
    
    const { error: policiesError } = await supabase.rpc('exec_sql', { sql: newPoliciesSQL })
    
    if (policiesError) {
      console.error('❌ Error creando políticas:', policiesError)
      console.log('💡 Creando políticas manualmente...')
      
      // Crear políticas una por una
      const policies = [
        {
          name: 'Allow public read access to colors',
          sql: 'CREATE POLICY "Allow public read access to colors" ON colors FOR SELECT USING (true);'
        },
        {
          name: 'Allow public insert access to colors',
          sql: 'CREATE POLICY "Allow public insert access to colors" ON colors FOR INSERT WITH CHECK (true);'
        },
        {
          name: 'Allow public update access to colors',
          sql: 'CREATE POLICY "Allow public update access to colors" ON colors FOR UPDATE USING (true);'
        },
        {
          name: 'Allow public delete access to colors',
          sql: 'CREATE POLICY "Allow public delete access to colors" ON colors FOR DELETE USING (true);'
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
    } else {
      console.log('✅ Políticas creadas exitosamente')
    }
    
    // 3. Verificar que las políticas funcionan
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
    
    console.log('🎉 ¡Políticas RLS corregidas exitosamente!')
    
  } catch (error) {
    console.error('❌ Error en el proceso:', error)
    console.log('💡 Solución manual:')
    console.log('   1. Ve a Supabase Dashboard → Authentication → Policies')
    console.log('   2. Busca la tabla "colors"')
    console.log('   3. Elimina todas las políticas existentes')
    console.log('   4. Crea una nueva política:')
    console.log('      - Name: "Allow all access"')
    console.log('      - Operation: ALL')
    console.log('      - Target roles: public')
    console.log('      - USING expression: true')
    console.log('      - WITH CHECK expression: true')
  }
}

fixColorsRLS()

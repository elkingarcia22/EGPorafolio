const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

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

async function insertColorsData() {
  try {
    console.log('🎨 Insertando datos de colores...')
    
    // Primero, desactivar todos los registros existentes
    console.log('🔄 Desactivando registros existentes...')
    const { error: deactivateError } = await supabase
      .from('colors')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000') // Actualizar todos
    
    if (deactivateError) {
      console.warn('⚠️ No se pudieron desactivar registros existentes:', deactivateError.message)
    } else {
      console.log('✅ Registros existentes desactivados')
    }
    
    // Insertar nuevos datos
    console.log('📝 Insertando nuevos datos...')
    const { data, error } = await supabase
      .from('colors')
      .insert(colorsData)
    
    if (error) {
      console.error('❌ Error insertando datos:', error)
      throw error
    }
    
    console.log('✅ Datos de colores insertados exitosamente')
    console.log(`📊 Total de registros insertados: ${colorsData.length}`)
    
    // Verificar que se insertaron correctamente
    const { data: verifyData, error: verifyError } = await supabase
      .from('colors')
      .select('*')
      .eq('is_active', true)
      .order('is_default DESC, name')
    
    if (verifyError) {
      console.error('❌ Error verificando datos:', verifyError)
    } else {
      console.log('🔍 Verificación exitosa:')
      console.log(`📋 Registros activos: ${verifyData.length}`)
      
      // Mostrar resumen
      verifyData.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} ${item.is_default ? '(DEFAULT)' : ''}`)
        console.log(`   CSS: ${item.gradient_css}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error en el proceso:', error)
    process.exit(1)
  }
}

insertColorsData()

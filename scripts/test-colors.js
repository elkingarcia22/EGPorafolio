const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testColors() {
  try {
    console.log('🧪 Probando sistema de colores...')
    
    // 1. Verificar que podemos leer
    console.log('📖 Probando lectura...')
    const { data: readData, error: readError } = await supabase
      .from('colors')
      .select('*')
      .eq('is_active', true)
      .order('is_default DESC, name')
    
    if (readError) {
      console.error('❌ Error leyendo colores:', readError)
      return
    }
    
    console.log('✅ Lectura exitosa')
    console.log(`📊 Colores encontrados: ${readData.length}`)
    readData.forEach((color, index) => {
      console.log(`  ${index + 1}. ${color.name} ${color.is_default ? '(DEFAULT)' : ''}`)
    })
    
    // 2. Verificar que podemos insertar
    console.log('📝 Probando inserción...')
    const testColor = {
      name: 'Test Gradient',
      gradient_css: 'linear-gradient(135deg, #ff0000 0%, #00ff00 100%)',
      is_active: true,
      is_default: false
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('colors')
      .insert(testColor)
      .select()
    
    if (insertError) {
      console.error('❌ Error insertando color:', insertError)
      return
    }
    
    console.log('✅ Inserción exitosa')
    console.log('📊 Color insertado:', insertData[0].name)
    
    // 3. Verificar que podemos actualizar
    console.log('🔄 Probando actualización...')
    const { error: updateError } = await supabase
      .from('colors')
      .update({ name: 'Test Gradient Updated' })
      .eq('id', insertData[0].id)
    
    if (updateError) {
      console.error('❌ Error actualizando color:', updateError)
      return
    }
    
    console.log('✅ Actualización exitosa')
    
    // 4. Verificar que podemos eliminar
    console.log('🗑️ Probando eliminación...')
    const { error: deleteError } = await supabase
      .from('colors')
      .update({ is_active: false })
      .eq('id', insertData[0].id)
    
    if (deleteError) {
      console.error('❌ Error eliminando color:', deleteError)
      return
    }
    
    console.log('✅ Eliminación exitosa')
    
    console.log('🎉 ¡Sistema de colores funcionando perfectamente!')
    console.log('💡 Ahora puedes usar la sección Colores en el administrador')
    
  } catch (error) {
    console.error('❌ Error en el test:', error)
  }
}

testColors()

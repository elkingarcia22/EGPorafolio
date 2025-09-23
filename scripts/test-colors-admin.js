const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testColorsAdmin() {
  try {
    console.log('🧪 Probando funcionalidad completa del sistema de colores...')
    
    // 1. Leer colores existentes
    console.log('📖 Leyendo colores existentes...')
    const { data: existingColors, error: readError } = await supabase
      .from('colors')
      .select('*')
      .order('name')
    
    if (readError) {
      console.error('❌ Error leyendo colores:', readError)
      return
    }
    
    console.log(`✅ ${existingColors.length} colores encontrados`)
    
    // 2. Crear un nuevo gradiente
    console.log('📝 Creando nuevo gradiente...')
    const newGradient = {
      name: 'Gradiente de Prueba',
      gradient_css: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
      is_active: true,
      is_default: false
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('colors')
      .insert(newGradient)
      .select()
    
    if (insertError) {
      console.error('❌ Error creando gradiente:', insertError)
      return
    }
    
    console.log('✅ Gradiente creado:', insertData[0].name)
    
    // 3. Actualizar el gradiente
    console.log('🔄 Actualizando gradiente...')
    const { error: updateError } = await supabase
      .from('colors')
      .update({ 
        name: 'Gradiente de Prueba Actualizado',
        gradient_css: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      })
      .eq('id', insertData[0].id)
    
    if (updateError) {
      console.error('❌ Error actualizando gradiente:', updateError)
      return
    }
    
    console.log('✅ Gradiente actualizado')
    
    // 4. Establecer como gradiente por defecto
    console.log('⭐ Estableciendo como gradiente por defecto...')
    
    // Primero quitar el default de todos
    await supabase
      .from('colors')
      .update({ is_default: false })
      .eq('is_default', true)
    
    // Luego establecer el nuevo como default
    const { error: defaultError } = await supabase
      .from('colors')
      .update({ is_default: true })
      .eq('id', insertData[0].id)
    
    if (defaultError) {
      console.error('❌ Error estableciendo como default:', defaultError)
      return
    }
    
    console.log('✅ Gradiente establecido como por defecto')
    
    // 5. Verificar el gradiente por defecto
    console.log('🔍 Verificando gradiente por defecto...')
    const { data: defaultColor, error: defaultReadError } = await supabase
      .from('colors')
      .select('*')
      .eq('is_default', true)
      .single()
    
    if (defaultReadError) {
      console.error('❌ Error leyendo gradiente por defecto:', defaultReadError)
      return
    }
    
    console.log('✅ Gradiente por defecto:', defaultColor.name)
    
    // 6. Restaurar el gradiente original como default
    console.log('🔄 Restaurando gradiente original...')
    
    // Quitar default del actual
    await supabase
      .from('colors')
      .update({ is_default: false })
      .eq('id', insertData[0].id)
    
    // Establecer el original como default
    const originalColor = existingColors.find(c => c.name === 'Gradiente Original')
    if (originalColor) {
      await supabase
        .from('colors')
        .update({ is_default: true })
        .eq('id', originalColor.id)
      console.log('✅ Gradiente original restaurado como por defecto')
    }
    
    // 7. Eliminar el gradiente de prueba
    console.log('🗑️ Eliminando gradiente de prueba...')
    const { error: deleteError } = await supabase
      .from('colors')
      .delete()
      .eq('id', insertData[0].id)
    
    if (deleteError) {
      console.error('❌ Error eliminando gradiente:', deleteError)
      return
    }
    
    console.log('✅ Gradiente de prueba eliminado')
    
    // 8. Verificación final
    console.log('🔍 Verificación final...')
    const { data: finalColors, error: finalError } = await supabase
      .from('colors')
      .select('*')
      .order('name')
    
    if (finalError) {
      console.error('❌ Error en verificación final:', finalError)
      return
    }
    
    console.log(`✅ ${finalColors.length} colores en la tabla`)
    
    const finalDefault = finalColors.find(c => c.is_default === true)
    if (finalDefault) {
      console.log('✅ Gradiente por defecto:', finalDefault.name)
    }
    
    console.log('🎉 ¡Sistema de colores funcionando perfectamente!')
    console.log('💡 Ahora puedes usar la sección Colores en el administrador sin problemas')
    
  } catch (error) {
    console.error('❌ Error en el test:', error)
  }
}

testColorsAdmin()

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkColorsTable() {
  try {
    console.log('🔍 Verificando tabla colors...')
    
    // 1. Verificar si la tabla existe
    console.log('📋 Verificando existencia de la tabla...')
    const { data: tableData, error: tableError } = await supabase
      .from('colors')
      .select('*')
      .limit(1)
    
    if (tableError) {
      console.error('❌ Error accediendo a la tabla colors:', tableError)
      console.error('📊 Detalles:', {
        message: tableError.message,
        details: tableError.details,
        hint: tableError.hint,
        code: tableError.code
      })
      
      if (tableError.message?.includes('relation "colors" does not exist')) {
        console.log('💡 La tabla colors no existe. Ejecuta: npm run setup-colors')
        return
      }
      
      if (tableError.message?.includes('permission denied')) {
        console.log('💡 Sin permisos para acceder a la tabla. Ejecuta: npm run fix-colors-rls')
        return
      }
      
      return
    }
    
    console.log('✅ Tabla colors existe y es accesible')
    
    // 2. Verificar datos
    console.log('📊 Verificando datos...')
    const { data: allData, error: allError } = await supabase
      .from('colors')
      .select('*')
      .order('name')
    
    if (allError) {
      console.error('❌ Error obteniendo datos:', allError)
      return
    }
    
    console.log(`📈 Total de colores: ${allData.length}`)
    
    if (allData.length === 0) {
      console.log('⚠️ No hay colores en la tabla')
      console.log('💡 Ejecuta: npm run insert-colors-data')
      return
    }
    
    // 3. Mostrar datos
    console.log('🎨 Colores disponibles:')
    allData.forEach((color, index) => {
      console.log(`  ${index + 1}. ${color.name}`)
      console.log(`     - ID: ${color.id}`)
      console.log(`     - Activo: ${color.is_active !== undefined ? (color.is_active ? 'Sí' : 'No') : 'N/A'}`)
      console.log(`     - Por defecto: ${color.is_default !== undefined ? (color.is_default ? 'Sí' : 'No') : 'N/A'}`)
      console.log(`     - CSS: ${color.gradient_css ? color.gradient_css.substring(0, 50) + '...' : 'N/A'}`)
      console.log('')
    })
    
    // 4. Verificar gradiente por defecto
    const defaultColor = allData.find(c => c.is_default === true)
    if (defaultColor) {
      console.log('✅ Gradiente por defecto encontrado:', defaultColor.name)
    } else {
      console.log('⚠️ No hay gradiente por defecto')
    }
    
    // 5. Verificar colores activos
    const activeColors = allData.filter(c => c.is_active === true)
    console.log(`✅ Colores activos: ${activeColors.length}`)
    
    console.log('🎉 Verificación completada exitosamente')
    
  } catch (error) {
    console.error('❌ Error en la verificación:', error)
  }
}

checkColorsTable()

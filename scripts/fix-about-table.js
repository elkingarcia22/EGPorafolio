const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixAboutTable() {
  try {
    console.log('🔧 Verificando estructura de la tabla about_info...')
    
    // Primero, verificar qué columnas existen
    const { data: columns, error: columnsError } = await supabase
      .from('about_info')
      .select('*')
      .limit(1)
    
    if (columnsError) {
      console.error('❌ Error verificando tabla:', columnsError)
      return
    }
    
    console.log('✅ Tabla about_info existe')
    
    // Verificar si la columna order_index existe
    if (columns && columns.length > 0) {
      const firstRow = columns[0]
      console.log('📋 Columnas existentes:', Object.keys(firstRow))
      
      if (!firstRow.hasOwnProperty('order_index')) {
        console.log('⚠️ La columna order_index no existe. Necesitas agregarla manualmente en Supabase.')
        console.log('📝 SQL para agregar la columna:')
        console.log('ALTER TABLE about_info ADD COLUMN order_index INTEGER;')
        return
      }
    }
    
    // Si llegamos aquí, la tabla está bien estructurada
    console.log('✅ La tabla about_info tiene la estructura correcta')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

fixAboutTable()

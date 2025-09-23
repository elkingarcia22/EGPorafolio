const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const contactData = [
  {
    contact_type: 'whatsapp',
    label: 'WhatsApp',
    value: '+54 11 1234-5678',
    url: '',
    icon_name: 'whatsapp',
    language: 'es',
    order_index: 1,
    is_active: true
  },
  {
    contact_type: 'whatsapp',
    label: 'WhatsApp',
    value: '+54 11 1234-5678',
    url: '',
    icon_name: 'whatsapp',
    language: 'en',
    order_index: 1,
    is_active: true
  },
  {
    contact_type: 'linkedin',
    label: 'LinkedIn',
    value: 'Conectar',
    url: 'https://linkedin.com/in/elkingarcia',
    icon_name: 'linkedin',
    language: 'es',
    order_index: 2,
    is_active: true
  },
  {
    contact_type: 'linkedin',
    label: 'LinkedIn',
    value: 'Connect',
    url: 'https://linkedin.com/in/elkingarcia',
    icon_name: 'linkedin',
    language: 'en',
    order_index: 2,
    is_active: true
  },
  {
    contact_type: 'location',
    label: 'Ubicación',
    value: 'Buenos Aires, Argentina',
    url: '',
    icon_name: 'location',
    language: 'es',
    order_index: 3,
    is_active: true
  },
  {
    contact_type: 'location',
    label: 'Location',
    value: 'Buenos Aires, Argentina',
    url: '',
    icon_name: 'location',
    language: 'en',
    order_index: 3,
    is_active: true
  }
]

async function insertContactData() {
  try {
    console.log('🚀 Insertando datos de contacto...')
    
    // Primero, desactivar todos los registros existentes
    console.log('🔄 Desactivando registros existentes...')
    const { error: deactivateError } = await supabase
      .from('contact_info')
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
      .from('contact_info')
      .insert(contactData)
    
    if (error) {
      console.error('❌ Error insertando datos:', error)
      throw error
    }
    
    console.log('✅ Datos de contacto insertados exitosamente')
    console.log(`📊 Total de registros insertados: ${contactData.length}`)
    
    // Verificar que se insertaron correctamente
    const { data: verifyData, error: verifyError } = await supabase
      .from('contact_info')
      .select('*')
      .eq('is_active', true)
      .order('language, order_index')
    
    if (verifyError) {
      console.error('❌ Error verificando datos:', verifyError)
    } else {
      console.log('🔍 Verificación exitosa:')
      console.log(`📋 Registros activos: ${verifyData.length}`)
      
      // Mostrar resumen por tipo
      const types = ['whatsapp', 'linkedin', 'location']
      types.forEach(type => {
        const typeData = verifyData.filter(item => item.contact_type === type)
        console.log(`  - ${type}: ${typeData.length} registros`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error en el proceso:', error)
    process.exit(1)
  }
}

insertContactData()

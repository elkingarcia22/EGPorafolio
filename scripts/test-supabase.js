// Script para probar la conexión con Supabase
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan las variables de entorno de Supabase')
  console.log('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en tu archivo .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('🔄 Probando conexión con Supabase...')
    
    // Probar conexión básica
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Error de conexión:', error.message)
      return false
    }
    
    console.log('✅ Conexión exitosa con Supabase!')
    console.log('📊 Datos encontrados:', data?.length || 0, 'registros')
    return true
    
  } catch (err) {
    console.error('❌ Error inesperado:', err.message)
    return false
  }
}

testConnection()

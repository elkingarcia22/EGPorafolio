// Script para configurar la base de datos
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan las variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('🔄 Configurando base de datos...')
    
    // Leer el archivo de migración
    const migrationPath = path.join(__dirname, '../supabase/migrations/001_initial_schema.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Dividir en comandos individuales
    const commands = migrationSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))
    
    console.log(`📝 Ejecutando ${commands.length} comandos SQL...`)
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i] + ';'
      console.log(`🔄 Ejecutando comando ${i + 1}/${commands.length}...`)
      
      const { error } = await supabase.rpc('exec_sql', { sql: command })
      
      if (error) {
        console.error(`❌ Error en comando ${i + 1}:`, error.message)
        console.log('Comando:', command.substring(0, 100) + '...')
      } else {
        console.log(`✅ Comando ${i + 1} ejecutado exitosamente`)
      }
    }
    
    console.log('🎉 Base de datos configurada exitosamente!')
    
  } catch (err) {
    console.error('❌ Error inesperado:', err.message)
  }
}

setupDatabase()

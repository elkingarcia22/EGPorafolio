const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno necesarias')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixProjectsTable() {
  try {
    console.log('🔧 Verificando y corrigiendo la tabla projects...')

    // 1. Verificar si la columna is_active existe
    console.log('🔍 Verificando estructura de la tabla projects...')
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'projects')
      .order('ordinal_position')

    if (columnsError) {
      console.error('❌ Error verificando columnas:', columnsError)
      return
    }

    console.log('📋 Columnas actuales de la tabla projects:')
    columns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable}, default: ${col.column_default})`)
    })

    const hasIsActive = columns.some(col => col.column_name === 'is_active')
    console.log(`🔍 ¿Tiene columna is_active? ${hasIsActive}`)

    if (!hasIsActive) {
      console.log('⚠️ La columna is_active no existe. Agregándola...')
      
      // Ejecutar la migración SQL
      const { error: alterError } = await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE projects 
          ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
          
          CREATE INDEX IF NOT EXISTS idx_projects_is_active ON projects(is_active);
          
          UPDATE projects 
          SET is_active = true 
          WHERE is_active IS NULL;
        `
      })

      if (alterError) {
        console.error('❌ Error ejecutando migración:', alterError)
        return
      }

      console.log('✅ Columna is_active agregada exitosamente')
    } else {
      console.log('✅ La columna is_active ya existe')
    }

    // 2. Verificar datos existentes
    console.log('🔍 Verificando datos existentes...')
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, title, is_active')
      .limit(5)

    if (projectsError) {
      console.error('❌ Error obteniendo proyectos:', projectsError)
      return
    }

    console.log('📊 Proyectos encontrados:')
    projects.forEach(project => {
      console.log(`  - ${project.title} (ID: ${project.id}, Activo: ${project.is_active})`)
    })

    // 3. Verificar que todos los proyectos tengan is_active definido
    const { data: nullProjects, error: nullError } = await supabase
      .from('projects')
      .select('id, title')
      .is('is_active', null)

    if (nullError) {
      console.error('❌ Error verificando proyectos con is_active null:', nullError)
      return
    }

    if (nullProjects && nullProjects.length > 0) {
      console.log(`⚠️ Encontrados ${nullProjects.length} proyectos con is_active null. Actualizando...`)
      
      const { error: updateError } = await supabase
        .from('projects')
        .update({ is_active: true })
        .is('is_active', null)

      if (updateError) {
        console.error('❌ Error actualizando proyectos:', updateError)
        return
      }

      console.log('✅ Proyectos actualizados exitosamente')
    } else {
      console.log('✅ Todos los proyectos tienen is_active definido')
    }

    console.log('🎉 Verificación y corrección completada exitosamente')

  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar la función
fixProjectsTable()

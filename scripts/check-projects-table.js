// Script simple para verificar la tabla projects
// Este script se ejecuta en el navegador desde la consola del admin

console.log('🔧 Verificando tabla projects...')

// Función para verificar la estructura de la tabla
async function checkProjectsTable() {
  try {
    // Verificar si tenemos acceso a supabase
    if (typeof window !== 'undefined' && window.supabase) {
      console.log('✅ Cliente Supabase disponible')
      
      // Verificar columnas de la tabla
      const { data: columns, error: columnsError } = await window.supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_name', 'projects')
        .order('ordinal_position')

      if (columnsError) {
        console.error('❌ Error verificando columnas:', columnsError)
        return
      }

      console.log('📋 Columnas de la tabla projects:')
      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable}, default: ${col.column_default})`)
      })

      const hasIsActive = columns.some(col => col.column_name === 'is_active')
      console.log(`🔍 ¿Tiene columna is_active? ${hasIsActive}`)

      if (!hasIsActive) {
        console.log('⚠️ La columna is_active no existe')
        console.log('💡 Solución: Ejecuta este SQL en Supabase:')
        console.log(`
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_projects_is_active ON projects(is_active);

UPDATE projects 
SET is_active = true 
WHERE is_active IS NULL;
        `)
      } else {
        console.log('✅ La columna is_active existe')
      }

      // Verificar datos existentes
      const { data: projects, error: projectsError } = await window.supabase
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

    } else {
      console.log('❌ Cliente Supabase no disponible')
      console.log('💡 Ejecuta este script desde la consola del navegador en la página de admin')
    }

  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar la función
checkProjectsTable()

// Exportar para uso manual
window.checkProjectsTable = checkProjectsTable

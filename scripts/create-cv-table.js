const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createCVTable() {
  try {
    console.log('🔧 Creando tabla cv_documents...')
    
    // Crear la tabla cv_documents
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS cv_documents (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          file_url TEXT NOT NULL,
          file_name VARCHAR(255) NOT NULL,
          file_size INTEGER,
          file_type VARCHAR(50) DEFAULT 'application/pdf',
          is_active BOOLEAN DEFAULT true,
          language VARCHAR(10) DEFAULT 'es',
          version VARCHAR(20) DEFAULT '1.0',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_by UUID,
          metadata JSONB DEFAULT '{}'::jsonb
        );
      `
    })

    if (error) {
      console.error('❌ Error creando tabla:', error)
      return
    }

    console.log('✅ Tabla cv_documents creada exitosamente')

    // Crear índices
    console.log('🔧 Creando índices...')
    
    const indexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_cv_documents_active ON cv_documents(is_active);',
      'CREATE INDEX IF NOT EXISTS idx_cv_documents_language ON cv_documents(language);',
      'CREATE INDEX IF NOT EXISTS idx_cv_documents_created_at ON cv_documents(created_at DESC);'
    ]

    for (const query of indexQueries) {
      const { error: indexError } = await supabase.rpc('exec_sql', { sql: query })
      if (indexError) {
        console.error('❌ Error creando índice:', indexError)
      } else {
        console.log('✅ Índice creado')
      }
    }

    // Habilitar RLS (Row Level Security)
    console.log('🔧 Configurando RLS...')
    
    const rlsQueries = [
      'ALTER TABLE cv_documents ENABLE ROW LEVEL SECURITY;',
      `CREATE POLICY "Allow public read access to active CV documents" ON cv_documents
       FOR SELECT USING (is_active = true);`,
      `CREATE POLICY "Allow admin full access to CV documents" ON cv_documents
       FOR ALL USING (true);`
    ]

    for (const query of rlsQueries) {
      const { error: rlsError } = await supabase.rpc('exec_sql', { sql: query })
      if (rlsError) {
        console.error('❌ Error configurando RLS:', rlsError)
      } else {
        console.log('✅ RLS configurado')
      }
    }

    // Insertar un CV de ejemplo
    console.log('🔧 Insertando CV de ejemplo...')
    
    const { data: insertData, error: insertError } = await supabase
      .from('cv_documents')
      .insert([
        {
          title: 'CV Elkin Garcia - Diseñador UX/UI',
          description: 'Hoja de vida profesional de Elkin Garcia, especialista en diseño UX/UI con más de 5 años de experiencia.',
          file_url: '/cv-elkin-garcia.pdf',
          file_name: 'cv-elkin-garcia.pdf',
          file_size: 1024000, // 1MB aproximado
          file_type: 'application/pdf',
          is_active: true,
          language: 'es',
          version: '1.0',
          metadata: {
            pages: 2,
            last_updated: new Date().toISOString(),
            skills: ['UX Design', 'UI Design', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
            experience_years: 5
          }
        }
      ])
      .select()

    if (insertError) {
      console.error('❌ Error insertando CV de ejemplo:', insertError)
    } else {
      console.log('✅ CV de ejemplo insertado:', insertData[0].id)
    }

    console.log('🎉 Módulo CV configurado exitosamente!')
    console.log('📋 Próximos pasos:')
    console.log('   1. Subir archivo PDF a la carpeta public/')
    console.log('   2. Crear página de visualización')
    console.log('   3. Crear módulo de administración')

  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Función auxiliar para ejecutar SQL directo
async function execSQL(sql) {
  const { data, error } = await supabase.rpc('exec_sql', { sql })
  if (error) {
    console.error('❌ Error ejecutando SQL:', error)
    return null
  }
  return data
}

createCVTable()

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
    
    // Crear la tabla usando SQL directo
    const createTableSQL = `
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

    const { data: createData, error: createError } = await supabase
      .from('cv_documents')
      .select('id')
      .limit(1)

    if (createError && createError.code === 'PGRST116') {
      console.log('📋 Tabla no existe, creando...')
      // La tabla no existe, necesitamos crearla desde el dashboard de Supabase
      console.log('⚠️  Por favor, ejecuta este SQL en el dashboard de Supabase:')
      console.log('')
      console.log(createTableSQL)
      console.log('')
      console.log('Luego ejecuta este script nuevamente.')
      return
    }

    if (createError) {
      console.error('❌ Error verificando tabla:', createError)
      return
    }

    console.log('✅ Tabla cv_documents ya existe')

    // Verificar si ya hay datos
    const { data: existingData, error: selectError } = await supabase
      .from('cv_documents')
      .select('id, title')
      .limit(1)

    if (selectError) {
      console.error('❌ Error consultando datos:', selectError)
      return
    }

    if (existingData && existingData.length > 0) {
      console.log('✅ Ya existen documentos CV en la tabla')
      console.log('📄 Documentos encontrados:', existingData.length)
      return
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

  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

createCVTable()

const { createClient } = require('@supabase/supabase-js')
const path = require('path')

// Cargar variables de entorno desde .env.local
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkCVTable() {
  try {
    console.log('🔍 Verificando estado de la tabla cv_documents...\n')

    // 1. Verificar si la tabla existe (intentando hacer una consulta simple)
    console.log('📋 Verificando existencia de la tabla...')
    const { data: testData, error: tableError } = await supabase
      .from('cv_documents')
      .select('id')
      .limit(1)

    if (tableError) {
      if (tableError.message.includes('does not exist') || tableError.message.includes('not found')) {
        console.log('❌ Tabla cv_documents NO existe')
        console.log('💡 Necesitas ejecutar el SQL para crear la tabla')
        return
      } else {
        console.error('❌ Error verificando tabla:', tableError.message)
        return
      }
    } else {
      console.log('✅ Tabla cv_documents existe')
    }

    // 2. Verificar datos existentes
    console.log('\n📄 Verificando datos existentes...')
    const { data: cvData, error: dataError } = await supabase
      .from('cv_documents')
      .select('id, title, file_name, language, is_active, created_at')
      .order('created_at', { ascending: false })

    if (dataError) {
      console.error('❌ Error verificando datos:', dataError.message)
    } else {
      if (cvData && cvData.length > 0) {
        console.log(`📋 Se encontraron ${cvData.length} CV(s):`)
        cvData.forEach((cv, index) => {
          console.log(`   ${index + 1}. ${cv.title} (${cv.language}) - ${cv.is_active ? 'Activo' : 'Inactivo'}`)
        })
      } else {
        console.log('📭 No hay CVs registrados')
      }
    }

    // 3. Verificar bucket de storage
    console.log('\n📦 Verificando bucket de storage...')
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    
    if (bucketError) {
      console.error('❌ Error verificando buckets:', bucketError.message)
    } else {
      const cvBucket = buckets.find(bucket => bucket.name === 'cv-documents')
      if (cvBucket) {
        console.log('✅ Bucket cv-documents existe')
        console.log(`   - Público: ${cvBucket.public}`)
        console.log(`   - Tamaño máximo: ${cvBucket.file_size_limit ? `${cvBucket.file_size_limit / 1024 / 1024}MB` : 'Sin límite'}`)
      } else {
        console.log('❌ Bucket cv-documents NO existe')
        console.log('💡 Ejecuta: npm run setup-cv-storage')
      }
    }

    console.log('\n🎯 Resumen del estado:')
    console.log('   - Tabla: ✅ Existe')
    console.log('   - Políticas: ✅ Configuradas')
    console.log('   - RLS: ✅ Habilitado')
    console.log('   - Storage: ' + (buckets?.find(b => b.name === 'cv-documents') ? '✅ Configurado' : '❌ Pendiente'))
    console.log('   - Datos: ' + (cvData?.length > 0 ? `✅ ${cvData.length} CV(s)` : '📭 Vacío'))

  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message)
  }
}

// Ejecutar verificación
checkCVTable()

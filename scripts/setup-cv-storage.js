const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno de Supabase')
  console.log('Asegúrate de tener:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL')
  console.log('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupCVStorage() {
  try {
    console.log('🚀 Configurando almacenamiento para CVs...')

    // 1. Crear bucket para CVs
    console.log('📦 Creando bucket cv-documents...')
    const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('cv-documents', {
      public: true,
      allowedMimeTypes: ['application/pdf'],
      fileSizeLimit: 10485760, // 10MB
    })

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('✅ Bucket cv-documents ya existe')
      } else {
        console.error('❌ Error creando bucket:', bucketError.message)
        return
      }
    } else {
      console.log('✅ Bucket cv-documents creado exitosamente')
    }

    // 2. Configurar políticas RLS para el bucket
    console.log('🔒 Configurando políticas de seguridad...')
    
    // Política para lectura pública
    const { error: selectPolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Permitir lectura pública de CVs" ON storage.objects
        FOR SELECT USING (bucket_id = 'cv-documents');
      `
    })

    if (selectPolicyError) {
      console.log('⚠️  Política de lectura ya existe o no se pudo crear:', selectPolicyError.message)
    } else {
      console.log('✅ Política de lectura pública configurada')
    }

    // Política para inserción (solo para usuarios autenticados)
    const { error: insertPolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Permitir inserción de CVs para usuarios autenticados" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'cv-documents' AND auth.role() = 'authenticated');
      `
    })

    if (insertPolicyError) {
      console.log('⚠️  Política de inserción ya existe o no se pudo crear:', insertPolicyError.message)
    } else {
      console.log('✅ Política de inserción configurada')
    }

    // Política para actualización (solo para usuarios autenticados)
    const { error: updatePolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Permitir actualización de CVs para usuarios autenticados" ON storage.objects
        FOR UPDATE USING (bucket_id = 'cv-documents' AND auth.role() = 'authenticated');
      `
    })

    if (updatePolicyError) {
      console.log('⚠️  Política de actualización ya existe o no se pudo crear:', updatePolicyError.message)
    } else {
      console.log('✅ Política de actualización configurada')
    }

    // Política para eliminación (solo para usuarios autenticados)
    const { error: deletePolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Permitir eliminación de CVs para usuarios autenticados" ON storage.objects
        FOR DELETE USING (bucket_id = 'cv-documents' AND auth.role() = 'authenticated');
      `
    })

    if (deletePolicyError) {
      console.log('⚠️  Política de eliminación ya existe o no se pudo crear:', deletePolicyError.message)
    } else {
      console.log('✅ Política de eliminación configurada')
    }

    // 3. Verificar configuración
    console.log('🔍 Verificando configuración...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listando buckets:', listError.message)
      return
    }

    const cvBucket = buckets.find(bucket => bucket.name === 'cv-documents')
    if (cvBucket) {
      console.log('✅ Bucket cv-documents configurado correctamente')
      console.log('   - Público:', cvBucket.public)
      console.log('   - Tamaño máximo:', cvBucket.file_size_limit ? `${cvBucket.file_size_limit / 1024 / 1024}MB` : 'Sin límite')
      console.log('   - Tipos permitidos:', cvBucket.allowed_mime_types?.join(', ') || 'Todos')
    }

    console.log('\n🎉 ¡Configuración de almacenamiento completada!')
    console.log('📋 Resumen:')
    console.log('   - Bucket: cv-documents')
    console.log('   - Acceso: Público para lectura')
    console.log('   - Límite: 10MB por archivo')
    console.log('   - Tipos: Solo PDF')
    console.log('   - Políticas RLS: Configuradas')

  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message)
  }
}

// Ejecutar configuración
setupCVStorage()

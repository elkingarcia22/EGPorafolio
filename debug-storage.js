#!/usr/bin/env node

/**
 * Script de diagnóstico para Supabase Storage
 * Verifica la configuración y permisos del bucket
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Diagnóstico de Supabase Storage')
console.log('=====================================')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno no encontradas')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✅' : '❌')
  process.exit(1)
}

console.log('✅ Variables de entorno encontradas')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, supabaseKey)

async function diagnoseStorage() {
  try {
    console.log('\n🔍 Verificando conexión a Supabase...')
    
    // 1. Verificar conexión básica
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) {
      console.log('⚠️ No hay usuario autenticado (normal para anon key):', authError.message)
    } else {
      console.log('👤 Usuario:', user ? user.email : 'Anónimo')
    }

    // 2. Listar buckets
    console.log('\n📋 Listando buckets...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listando buckets:', listError)
      return
    }

    console.log('📦 Buckets encontrados:', buckets.length)
    buckets.forEach(bucket => {
      console.log(`  - ${bucket.name} (público: ${bucket.public})`)
    })

    // 3. Verificar bucket 'images'
    const imagesBucket = buckets.find(b => b.name === 'images')
    if (!imagesBucket) {
      console.log('\n❌ Bucket "images" no encontrado')
      return
    }

    console.log('\n🪣 Información del bucket "images":')
    console.log('  - Nombre:', imagesBucket.name)
    console.log('  - Público:', imagesBucket.public)
    console.log('  - Creado:', imagesBucket.created_at)
    console.log('  - ID:', imagesBucket.id)

    // 4. Verificar permisos del bucket
    console.log('\n🔐 Verificando permisos del bucket...')
    const { data: bucketInfo, error: bucketError } = await supabase.storage.getBucket('images')
    
    if (bucketError) {
      console.error('❌ Error obteniendo info del bucket:', bucketError)
    } else {
      console.log('✅ Información del bucket obtenida:', bucketInfo)
    }

    // 5. Listar archivos en el bucket
    console.log('\n📁 Listando archivos en el bucket...')
    const { data: files, error: filesError } = await supabase.storage
      .from('images')
      .list('project-images', { limit: 10 })

    if (filesError) {
      console.error('❌ Error listando archivos:', filesError)
    } else {
      console.log('📄 Archivos encontrados:', files.length)
      files.forEach(file => {
        console.log(`  - ${file.name} (${file.metadata?.size || 'N/A'} bytes)`)
      })
    }

    // 6. Probar subida de un archivo de prueba
    console.log('\n🧪 Probando subida de archivo...')
    const testContent = 'test content'
    const testFileName = `test-${Date.now()}.txt`
    const testPath = `project-images/${testFileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(testPath, testContent)

    if (uploadError) {
      console.error('❌ Error en subida de prueba:', uploadError)
      console.error('Detalles:', {
        message: uploadError.message,
        statusCode: uploadError.statusCode,
        error: uploadError.error
      })
    } else {
      console.log('✅ Subida de prueba exitosa:', uploadData)
      
      // Limpiar archivo de prueba
      const { error: deleteError } = await supabase.storage
        .from('images')
        .remove([testPath])
      
      if (deleteError) {
        console.warn('⚠️ No se pudo eliminar archivo de prueba:', deleteError)
      } else {
        console.log('🧹 Archivo de prueba eliminado')
      }
    }

    // 7. Verificar políticas RLS
    console.log('\n🛡️ Verificando políticas RLS...')
    const { data: policies, error: policiesError } = await supabase
      .from('storage.policies')
      .select('*')
      .eq('table_name', 'objects')

    if (policiesError) {
      console.log('⚠️ No se pudieron obtener políticas (normal para anon key):', policiesError.message)
    } else {
      console.log('📋 Políticas encontradas:', policies.length)
      policies.forEach(policy => {
        console.log(`  - ${policy.name}: ${policy.cmd}`)
      })
    }

    console.log('\n✅ Diagnóstico completado')

  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

diagnoseStorage()

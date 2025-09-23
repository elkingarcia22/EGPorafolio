#!/usr/bin/env node

/**
 * Script para configurar Supabase Storage automáticamente
 * Ejecuta este script después de configurar las variables de entorno
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas')
  console.error('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupStorage() {
  try {
    console.log('🚀 Configurando Supabase Storage...')
    
    // 1. Verificar si el bucket ya existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listando buckets:', listError)
      return
    }

    const bucketExists = buckets?.some(bucket => bucket.name === 'images')
    
    if (bucketExists) {
      console.log('✅ Bucket "images" ya existe')
      return
    }

    // 2. Crear el bucket
    console.log('🪣 Creando bucket "images"...')
    const { data: bucketData, error: createError } = await supabase.storage.createBucket('images', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      fileSizeLimit: 5242880 // 5MB
    })
    
    if (createError) {
      console.error('❌ Error creando bucket:', createError)
      console.log('\n📋 Instrucciones manuales:')
      console.log('1. Ve a tu proyecto de Supabase en https://supabase.com')
      console.log('2. Navega a Storage en el menú lateral')
      console.log('3. Haz clic en "New bucket"')
      console.log('4. Configura:')
      console.log('   - Nombre: images')
      console.log('   - Public bucket: ✅')
      console.log('   - File size limit: 5MB')
      console.log('   - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp, image/svg+xml')
      return
    }

    console.log('✅ Bucket "images" creado exitosamente')
    console.log('🎉 Configuración completada!')
    
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

setupStorage()

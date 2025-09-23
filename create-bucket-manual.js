#!/usr/bin/env node

/**
 * Script para crear el bucket manualmente usando Service Role Key
 * Este script necesita SUPABASE_SERVICE_ROLE_KEY en .env.local
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔧 Creando bucket "images" con Service Role Key')
console.log('================================================')

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno no encontradas')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
  console.error('\n📝 Para obtener la Service Role Key:')
  console.error('1. Ve a Supabase Dashboard → Settings → API')
  console.error('2. Copia la "service_role" key')
  console.error('3. Agrega SUPABASE_SERVICE_ROLE_KEY=tu_key_aqui a .env.local')
  process.exit(1)
}

// Usar Service Role Key para bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createBucket() {
  try {
    console.log('🔍 Verificando buckets existentes...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listando buckets:', listError)
      return
    }

    console.log('📦 Buckets encontrados:', buckets.length)
    const bucketExists = buckets.some(bucket => bucket.name === 'images')
    
    if (bucketExists) {
      console.log('✅ Bucket "images" ya existe')
      return
    }

    console.log('🪣 Creando bucket "images"...')
    const { data: bucketData, error: createError } = await supabase.storage.createBucket('images', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      fileSizeLimit: 5242880 // 5MB
    })
    
    if (createError) {
      console.error('❌ Error creating bucket:', createError)
      return
    }

    console.log('✅ Bucket "images" creado exitosamente:', bucketData)

    // Crear políticas RLS
    console.log('🔒 Creando políticas RLS...')
    
    const policies = [
      {
        name: 'Public Access',
        sql: `CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');`
      },
      {
        name: 'Authenticated Upload',
        sql: `CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');`
      },
      {
        name: 'Authenticated Update',
        sql: `CREATE POLICY "Authenticated users can update images" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');`
      },
      {
        name: 'Authenticated Delete',
        sql: `CREATE POLICY "Authenticated users can delete images" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');`
      }
    ]

    for (const policy of policies) {
      try {
        const { error: policyError } = await supabase.rpc('exec_sql', { sql: policy.sql })
        if (policyError) {
          if (policyError.message.includes('already exists')) {
            console.log(`⚠️ Política "${policy.name}" ya existe`)
          } else {
            console.error(`❌ Error creando política "${policy.name}":`, policyError)
          }
        } else {
          console.log(`✅ Política "${policy.name}" creada`)
        }
      } catch (sqlError) {
        console.warn(`⚠️ No se pudo crear política "${policy.name}":`, sqlError.message)
        console.log('💡 Puedes crear las políticas manualmente en el SQL Editor de Supabase')
      }
    }

    console.log('\n🎉 ¡Bucket "images" configurado exitosamente!')
    console.log('📝 Ahora puedes probar la subida de imágenes en el admin panel')

  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

createBucket()

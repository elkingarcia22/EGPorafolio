require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no están configuradas en .env.local');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

async function setupStoragePolicies() {
  console.log('🚀 Configurando políticas RLS para Supabase Storage...');

  try {
    // 1. Verificar que el bucket existe
    console.log('🔍 Verificando bucket "images"...');
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    if (listError) throw listError;

    const bucketExists = buckets.some(bucket => bucket.name === 'images');
    if (!bucketExists) {
      console.error('❌ El bucket "images" no existe. Créalo primero desde el Dashboard de Supabase.');
      return;
    }
    console.log('✅ Bucket "images" encontrado');

    // 2. Configurar políticas RLS para permitir subida pública
    console.log('🔒 Configurando políticas RLS...');

    const policies = [
      {
        name: 'Public Access for Images',
        sql: `CREATE POLICY "Public Access for Images" ON storage.objects FOR SELECT USING (bucket_id = 'images');`
      },
      {
        name: 'Public Upload for Images',
        sql: `CREATE POLICY "Public Upload for Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');`
      },
      {
        name: 'Public Update for Images',
        sql: `CREATE POLICY "Public Update for Images" ON storage.objects FOR UPDATE USING (bucket_id = 'images');`
      },
      {
        name: 'Public Delete for Images',
        sql: `CREATE POLICY "Public Delete for Images" ON storage.objects FOR DELETE USING (bucket_id = 'images');`
      }
    ];

    for (const policy of policies) {
      try {
        console.log(`📝 Aplicando política: ${policy.name}...`);
        
        // Usar rpc para ejecutar SQL directamente
        const { error: policyError } = await supabaseAdmin.rpc('exec_sql', { 
          sql: policy.sql 
        });

        if (policyError) {
          // Si la política ya existe, continuar
          if (policyError.message.includes('already exists')) {
            console.log(`⚠️ Política "${policy.name}" ya existe, omitiendo...`);
          } else {
            console.error(`❌ Error aplicando política "${policy.name}":`, policyError.message);
          }
        } else {
          console.log(`✅ Política "${policy.name}" aplicada exitosamente`);
        }
      } catch (error) {
        console.error(`❌ Error ejecutando política "${policy.name}":`, error.message);
      }
    }

    console.log('🎉 Configuración de políticas RLS completada');
    console.log('📋 Las políticas configuradas permiten:');
    console.log('   - Lectura pública de imágenes');
    console.log('   - Subida pública de imágenes');
    console.log('   - Actualización pública de imágenes');
    console.log('   - Eliminación pública de imágenes');

  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
    process.exit(1);
  }
}

setupStoragePolicies();

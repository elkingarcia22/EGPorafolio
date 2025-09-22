#!/usr/bin/env node

/**
 * Script para configurar la base de datos de administración en Supabase
 * 
 * Uso:
 * node scripts/setup-admin-database.js
 * 
 * Requisitos:
 * - Archivo .env.local con las variables de Supabase
 * - Supabase CLI instalado
 */

const fs = require('fs');
const path = require('path');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkRequirements() {
  log('\n🔍 Verificando requisitos...', 'cyan');
  
  // Verificar archivo .env.local
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    log('❌ No se encontró el archivo .env.local', 'red');
    log('   Crea un archivo .env.local con las variables de Supabase:', 'yellow');
    log('   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase', 'yellow');
    log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima', 'yellow');
    return false;
  }
  
  // Verificar archivo de migración
  const migrationPath = path.join(process.cwd(), 'supabase/migrations/003_admin_content_system.sql');
  if (!fs.existsSync(migrationPath)) {
    log('❌ No se encontró el archivo de migración', 'red');
    log('   Asegúrate de que existe: supabase/migrations/003_admin_content_system.sql', 'yellow');
    return false;
  }
  
  log('✅ Requisitos verificados', 'green');
  return true;
}

function showInstructions() {
  log('\n📋 INSTRUCCIONES PARA CONFIGURAR SUPABASE:', 'bright');
  log('', 'reset');
  
  log('1. 🗄️  Ejecuta la migración SQL en tu proyecto de Supabase:', 'blue');
  log('   - Ve a tu dashboard de Supabase', 'yellow');
  log('   - Navega a SQL Editor', 'yellow');
  log('   - Copia y pega el contenido de: supabase/migrations/003_admin_content_system.sql', 'yellow');
  log('   - Ejecuta la consulta', 'yellow');
  log('', 'reset');
  
  log('2. 🔐 Configura las políticas de seguridad (RLS):', 'blue');
  log('   - Las políticas están incluidas en la migración', 'yellow');
  log('   - Ajusta las políticas según tu sistema de autenticación', 'yellow');
  log('', 'reset');
  
  log('3. 🚀 Accede al panel de administración:', 'blue');
  log('   - Ve a: http://localhost:3000/admin', 'yellow');
  log('   - Usa la contraseña: Lineadesangre22', 'yellow');
  log('', 'reset');
  
  log('4. 📊 Funcionalidades disponibles:', 'blue');
  log('   - ✅ Gestión de textos typewriter', 'green');
  log('   - ✅ Gestión de proyectos', 'green');
  log('   - ✅ Gestión de información personal', 'green');
  log('   - ✅ Gestión de información de contacto', 'green');
  log('   - ✅ Gestión de imágenes', 'green');
  log('   - ✅ Logs de administración', 'green');
  log('', 'reset');
}

function showTableStructure() {
  log('\n🗂️  ESTRUCTURA DE TABLAS CREADAS:', 'bright');
  log('', 'reset');
  
  const tables = [
    {
      name: 'site_config',
      description: 'Configuraciones generales del sitio',
      fields: ['key', 'value', 'description']
    },
    {
      name: 'typewriter_texts',
      description: 'Textos del efecto typewriter',
      fields: ['text_content', 'order_index', 'is_active']
    },
    {
      name: 'projects',
      description: 'Proyectos de la sección Mi trabajo',
      fields: ['title', 'description', 'cover_image_url', 'order_index', 'is_active']
    },
    {
      name: 'about_info',
      description: 'Información personal',
      fields: ['title', 'description', 'profile_image_url', 'is_active']
    },
    {
      name: 'contact_info',
      description: 'Información de contacto',
      fields: ['contact_type', 'label', 'value', 'icon_name', 'order_index', 'is_active']
    },
    {
      name: 'site_images',
      description: 'Imágenes del sitio',
      fields: ['image_name', 'image_url', 'section', 'usage_context', 'is_active']
    },
    {
      name: 'admin_logs',
      description: 'Logs de actividades de administración',
      fields: ['action', 'table_name', 'record_id', 'old_values', 'new_values']
    }
  ];
  
  tables.forEach(table => {
    log(`📋 ${table.name}`, 'cyan');
    log(`   ${table.description}`, 'yellow');
    log(`   Campos: ${table.fields.join(', ')}`, 'magenta');
    log('', 'reset');
  });
}

function showDataExamples() {
  log('\n💾 DATOS INICIALES INCLUIDOS:', 'bright');
  log('', 'reset');
  
  log('📝 Textos Typewriter:', 'blue');
  log('   - "Diseñador UX/UI senior specialist"', 'green');
  log('   - "Diseño de interacciones"', 'green');
  log('   - "Diseño de estrategias"', 'green');
  log('   - "Diseño inteligente IA"', 'green');
  log('', 'reset');
  
  log('💼 Proyectos:', 'blue');
  log('   - UX Research', 'green');
  log('   - UI Design', 'green');
  log('   - Estrategia Digital', 'green');
  log('   - Diseño con IA', 'green');
  log('', 'reset');
  
  log('📞 Información de Contacto:', 'blue');
  log('   - WhatsApp: +54 11 1234-5678', 'green');
  log('   - LinkedIn: Conectar', 'green');
  log('   - Ubicación: Buenos Aires, Argentina', 'green');
  log('', 'reset');
}

function main() {
  log('🚀 CONFIGURACIÓN DEL SISTEMA DE ADMINISTRACIÓN', 'bright');
  log('================================================', 'bright');
  
  if (!checkRequirements()) {
    process.exit(1);
  }
  
  showInstructions();
  showTableStructure();
  showDataExamples();
  
  log('🎉 ¡Configuración completada!', 'green');
  log('   Ahora puedes ejecutar la migración SQL en Supabase', 'yellow');
  log('   y acceder al panel de administración en /admin', 'yellow');
  log('', 'reset');
}

// Ejecutar el script
if (require.main === module) {
  main();
}

module.exports = { checkRequirements, showInstructions };

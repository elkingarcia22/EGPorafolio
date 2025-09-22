#!/usr/bin/env node

/**
 * Script para configurar Supabase paso a paso
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

function showInstructions() {
  log('\n🚀 CONFIGURACIÓN DE SUPABASE', 'bright');
  log('============================', 'bright');
  
  log('\n📋 PASOS PARA CONFIGURAR SUPABASE:', 'cyan');
  log('', 'reset');
  
  log('1. 🗄️ Ejecutar migración SQL:', 'blue');
  log('   - Ve a tu dashboard de Supabase', 'yellow');
  log('   - Navega a SQL Editor', 'yellow');
  log('   - Copia TODO el contenido del archivo SQL que se muestra abajo', 'yellow');
  log('   - Pégalo en el editor y ejecuta', 'yellow');
  log('', 'reset');
  
  log('2. ✅ Verificar configuración:', 'blue');
  log('   - Asegúrate de que tu .env.local tenga las credenciales correctas', 'yellow');
  log('   - Reinicia el servidor: npm run dev', 'yellow');
  log('', 'reset');
  
  log('3. 🎯 Probar el sistema:', 'blue');
  log('   - Ve a: http://localhost:3000/admin', 'yellow');
  log('   - Usa la contraseña: Lineadesangre22', 'yellow');
  log('   - Verifica que no aparezca el banner amarillo', 'yellow');
  log('', 'reset');
}

function showSQLContent() {
  log('\n📄 CONTENIDO DEL SQL PARA SUPABASE:', 'bright');
  log('====================================', 'bright');
  log('', 'reset');
  
  const sqlPath = path.join(process.cwd(), 'supabase/migrations/003_admin_content_system.sql');
  
  if (fs.existsSync(sqlPath)) {
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    log(sqlContent, 'cyan');
  } else {
    log('❌ No se encontró el archivo SQL', 'red');
  }
}

function checkEnvFile() {
  log('\n🔍 VERIFICANDO CONFIGURACIÓN:', 'bright');
  log('', 'reset');
  
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    if (envContent.includes('placeholder.supabase.co')) {
      log('⚠️  Tu .env.local aún tiene valores placeholder', 'yellow');
      log('   Necesitas reemplazar con tus credenciales reales de Supabase', 'yellow');
    } else {
      log('✅ Tu .env.local parece estar configurado correctamente', 'green');
    }
    
    log('', 'reset');
    log('📋 Contenido actual de .env.local:', 'blue');
    log(envContent, 'cyan');
  } else {
    log('❌ No se encontró el archivo .env.local', 'red');
    log('   Ejecuta: node scripts/setup-env.js', 'yellow');
  }
}

function main() {
  showInstructions();
  checkEnvFile();
  showSQLContent();
  
  log('\n🎉 ¡Después de ejecutar el SQL en Supabase, tu sistema estará listo!', 'green');
  log('', 'reset');
}

// Ejecutar el script
if (require.main === module) {
  main();
}

module.exports = { showInstructions, showSQLContent, checkEnvFile };

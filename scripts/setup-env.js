#!/usr/bin/env node

/**
 * Script para configurar las variables de entorno
 * 
 * Uso:
 * node scripts/setup-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

function createEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  log('\n🔧 CONFIGURACIÓN DE VARIABLES DE ENTORNO', 'bright');
  log('==========================================', 'bright');
  
  log('\n📋 Para configurar Supabase necesitas:', 'cyan');
  log('1. Crear un proyecto en https://supabase.com', 'yellow');
  log('2. Obtener tu URL y clave anónima desde Settings > API', 'yellow');
  log('', 'reset');
  
  const envContent = `# Supabase Configuration
# Reemplaza estos valores con tus credenciales reales de Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_aqui

# Admin Configuration
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Lineadesangre22

# Email Configuration (for CV sharing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
`;

  try {
    fs.writeFileSync(envPath, envContent);
    log('✅ Archivo .env.local creado exitosamente', 'green');
    log('', 'reset');
    
    log('📝 INSTRUCCIONES:', 'bright');
    log('1. Abre el archivo .env.local', 'blue');
    log('2. Reemplaza los valores placeholder con tus credenciales reales:', 'blue');
    log('   - NEXT_PUBLIC_SUPABASE_URL: Tu URL de Supabase', 'yellow');
    log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY: Tu clave anónima de Supabase', 'yellow');
    log('', 'reset');
    
    log('🔗 Obtén tus credenciales en:', 'cyan');
    log('   https://supabase.com/dashboard/project/[tu-proyecto]/settings/api', 'yellow');
    log('', 'reset');
    
    log('⚡ Después de configurar las variables:', 'bright');
    log('1. Ejecuta la migración SQL en Supabase', 'blue');
    log('2. Reinicia el servidor de desarrollo: npm run dev', 'blue');
    log('3. Accede al panel de administración en /admin', 'blue');
    
  } catch (error) {
    log('❌ Error creando el archivo .env.local:', 'red');
    log(error.message, 'red');
  }
}

function showSupabaseInstructions() {
  log('\n🗄️ INSTRUCCIONES PARA SUPABASE:', 'bright');
  log('', 'reset');
  
  log('1. 📝 Crear proyecto en Supabase:', 'blue');
  log('   - Ve a https://supabase.com', 'yellow');
  log('   - Crea una cuenta o inicia sesión', 'yellow');
  log('   - Crea un nuevo proyecto', 'yellow');
  log('', 'reset');
  
  log('2. 🔑 Obtener credenciales:', 'blue');
  log('   - Ve a Settings > API', 'yellow');
  log('   - Copia la "Project URL"', 'yellow');
  log('   - Copia la "anon public" key', 'yellow');
  log('', 'reset');
  
  log('3. 🗃️ Ejecutar migración SQL:', 'blue');
  log('   - Ve a SQL Editor en tu dashboard de Supabase', 'yellow');
  log('   - Copia el contenido de: supabase/migrations/003_admin_content_system.sql', 'yellow');
  log('   - Pega y ejecuta la consulta', 'yellow');
  log('', 'reset');
  
  log('4. ⚙️ Configurar variables de entorno:', 'blue');
  log('   - Edita el archivo .env.local', 'yellow');
  log('   - Reemplaza los valores placeholder', 'yellow');
  log('   - Reinicia el servidor', 'yellow');
}

function main() {
  log('🚀 CONFIGURADOR DE VARIABLES DE ENTORNO', 'bright');
  log('========================================', 'bright');
  
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (fs.existsSync(envPath)) {
    log('⚠️  El archivo .env.local ya existe', 'yellow');
    log('   ¿Quieres sobrescribirlo? (y/N)', 'yellow');
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        createEnvFile();
        showSupabaseInstructions();
      } else {
        log('✅ Manteniendo archivo existente', 'green');
        showSupabaseInstructions();
      }
      rl.close();
    });
  } else {
    createEnvFile();
    showSupabaseInstructions();
  }
}

// Ejecutar el script
if (require.main === module) {
  main();
}

module.exports = { createEnvFile, showSupabaseInstructions };

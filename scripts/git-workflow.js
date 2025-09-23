#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

function exec(command, options = {}) {
  try {
    return execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    log(`❌ Error ejecutando: ${command}`, 'red');
    process.exit(1);
  }
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  log('🚀 GitHub Workflow Helper - Portafolio EG', 'cyan');
  log('==========================================', 'cyan');
  
  const action = await question('\n¿Qué quieres hacer?\n1. Crear nueva feature\n2. Hacer merge a develop\n3. Crear release\n4. Ver estado\n5. Sincronizar\n\nOpción (1-5): ');
  
  switch (action) {
    case '1':
      await createFeature();
      break;
    case '2':
      await mergeToDevelop();
      break;
    case '3':
      await createRelease();
      break;
    case '4':
      await showStatus();
      break;
    case '5':
      await sync();
      break;
    default:
      log('❌ Opción inválida', 'red');
  }
  
  rl.close();
}

async function createFeature() {
  log('\n🆕 Creando nueva feature...', 'green');
  
  const featureName = await question('Nombre de la feature (sin espacios): ');
  if (!featureName) {
    log('❌ Nombre de feature requerido', 'red');
    return;
  }
  
  log('📥 Sincronizando develop...', 'yellow');
  exec('git checkout develop');
  exec('git pull origin develop');
  
  log(`🌿 Creando rama feature/${featureName}...`, 'yellow');
  exec(`git checkout -b feature/${featureName}`);
  
  log(`✅ Rama feature/${featureName} creada`, 'green');
  log('💡 Ahora puedes trabajar en tu feature y hacer commits', 'cyan');
  log(`📤 Para hacer push: git push origin feature/${featureName}`, 'blue');
}

async function mergeToDevelop() {
  log('\n🔄 Haciendo merge a develop...', 'green');
  
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  
  if (!currentBranch.startsWith('feature/')) {
    log('❌ Debes estar en una rama feature para hacer merge', 'red');
    return;
  }
  
  log('📥 Sincronizando develop...', 'yellow');
  exec('git checkout develop');
  exec('git pull origin develop');
  
  log(`🔀 Haciendo merge de ${currentBranch}...`, 'yellow');
  exec(`git merge ${currentBranch}`);
  
  log('📤 Haciendo push a develop...', 'yellow');
  exec('git push origin develop');
  
  const deleteBranch = await question(`¿Eliminar rama local ${currentBranch}? (y/n): `);
  if (deleteBranch.toLowerCase() === 'y') {
    exec(`git branch -d ${currentBranch}`);
    log(`✅ Rama ${currentBranch} eliminada`, 'green');
  }
  
  log('✅ Merge completado', 'green');
}

async function createRelease() {
  log('\n🏷️ Creando release...', 'green');
  
  const version = await question('Versión (ej: v1.1.0): ');
  if (!version) {
    log('❌ Versión requerida', 'red');
    return;
  }
  
  log('📥 Sincronizando develop...', 'yellow');
  exec('git checkout develop');
  exec('git pull origin develop');
  
  log('📥 Sincronizando main...', 'yellow');
  exec('git checkout main');
  exec('git pull origin main');
  
  log('🔀 Haciendo merge de develop a main...', 'yellow');
  exec('git merge develop');
  
  log(`🏷️ Creando tag ${version}...`, 'yellow');
  exec(`git tag -a ${version} -m "Release ${version}"`);
  
  log('📤 Haciendo push a main y tags...', 'yellow');
  exec('git push origin main');
  exec(`git push origin ${version}`);
  
  log(`✅ Release ${version} creado`, 'green');
  log('🚀 GitHub Actions ejecutará el deploy automáticamente', 'cyan');
}

async function showStatus() {
  log('\n📊 Estado del repositorio:', 'green');
  exec('git status');
  
  log('\n📋 Últimos commits:', 'green');
  exec('git log --oneline -5');
  
  log('\n🌿 Ramas:', 'green');
  exec('git branch -a');
}

async function sync() {
  log('\n🔄 Sincronizando repositorio...', 'green');
  
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  
  log('📥 Haciendo fetch...', 'yellow');
  exec('git fetch origin');
  
  log('📥 Haciendo pull...', 'yellow');
  exec('git pull origin ' + currentBranch);
  
  log('✅ Sincronización completada', 'green');
}

// Manejo de errores
process.on('uncaughtException', (error) => {
  log(`❌ Error inesperado: ${error.message}`, 'red');
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  log(`❌ Error de promesa: ${error.message}`, 'red');
  process.exit(1);
});

main().catch(error => {
  log(`❌ Error: ${error.message}`, 'red');
  process.exit(1);
});

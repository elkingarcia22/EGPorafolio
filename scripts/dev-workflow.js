#!/usr/bin/env node

/**
 * Script de utilidad para el flujo de desarrollo
 * Uso: node scripts/dev-workflow.js [comando]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const commands = {
  'new-feature': (name) => {
    if (!name) {
      console.error('❌ Error: Debes proporcionar un nombre para la feature');
      console.log('Uso: node scripts/dev-workflow.js new-feature nombre-feature');
      process.exit(1);
    }
    
    const branchName = `feature/${name}`;
    console.log(`🚀 Creando nueva feature: ${branchName}`);
    
    try {
      execSync('git checkout develop', { stdio: 'inherit' });
      execSync('git pull origin develop', { stdio: 'inherit' });
      execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
      console.log(`✅ Feature branch '${branchName}' creada exitosamente`);
    } catch (error) {
      console.error('❌ Error creando la feature branch:', error.message);
      process.exit(1);
    }
  },

  'check-status': () => {
    console.log('📊 Estado del proyecto:');
    console.log('====================');
    
    try {
      // Git status
      console.log('\n🌳 Git Status:');
      execSync('git status --porcelain', { stdio: 'inherit' });
      
      // Branch info
      const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      console.log(`\n📍 Rama actual: ${currentBranch}`);
      
      // Dependencies
      console.log('\n📦 Dependencias:');
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      console.log(`   - Node modules: ${fs.existsSync('node_modules') ? '✅' : '❌'}`);
      console.log(`   - Next.js: ${packageJson.dependencies.next || 'No encontrado'}`);
      console.log(`   - Storybook: ${packageJson.devDependencies.storybook || 'No encontrado'}`);
      
    } catch (error) {
      console.error('❌ Error obteniendo el estado:', error.message);
    }
  },

  'pre-commit': () => {
    console.log('🔍 Ejecutando checks pre-commit...');
    
    const checks = [
      { name: 'Lint', command: 'npm run lint' },
      { name: 'Build', command: 'npm run build' },
      { name: 'Storybook Build', command: 'npm run build-storybook' }
    ];
    
    let allPassed = true;
    
    for (const check of checks) {
      try {
        console.log(`\n⏳ Ejecutando: ${check.name}`);
        execSync(check.command, { stdio: 'pipe' });
        console.log(`✅ ${check.name}: OK`);
      } catch (error) {
        console.log(`❌ ${check.name}: FALLÓ`);
        allPassed = false;
      }
    }
    
    if (allPassed) {
      console.log('\n🎉 Todos los checks pasaron. Listo para commit!');
    } else {
      console.log('\n⚠️  Algunos checks fallaron. Revisa los errores antes de hacer commit.');
      process.exit(1);
    }
  },

  'storybook-dev': () => {
    console.log('📚 Iniciando Storybook en modo desarrollo...');
    try {
      execSync('npm run storybook', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Error iniciando Storybook:', error.message);
    }
  },

  'help': () => {
    console.log(`
🛠️  Script de Flujo de Desarrollo - Portafolio EG

Comandos disponibles:
  new-feature <nombre>    Crear nueva feature branch
  check-status           Verificar estado del proyecto
  pre-commit            Ejecutar checks antes de commit
  storybook-dev         Iniciar Storybook en desarrollo
  help                  Mostrar esta ayuda

Ejemplos:
  node scripts/dev-workflow.js new-feature nueva-seccion
  node scripts/dev-workflow.js check-status
  node scripts/dev-workflow.js pre-commit
    `);
  }
};

// Main execution
const command = process.argv[2];
const args = process.argv.slice(3);

if (!command || !commands[command]) {
  console.log('❌ Comando no reconocido');
  commands.help();
  process.exit(1);
}

commands[command](...args);

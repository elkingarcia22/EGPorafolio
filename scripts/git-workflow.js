#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function execCommand(command) {
  try {
    console.log(`\n🔄 Ejecutando: ${command}`);
    const output = execSync(command, { encoding: 'utf8', stdio: 'inherit' });
    return output;
  } catch (error) {
    console.error(`❌ Error ejecutando: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('🚀 Git Workflow Helper para EG Portafolio\n');
  
  const action = await askQuestion('¿Qué quieres hacer?\n1. Crear nueva feature\n2. Hacer commit de cambios\n3. Hacer push a GitHub\n4. Ver estado actual\n5. Cambiar de rama\nOpción (1-5): ');
  
  switch (action) {
    case '1':
      await createFeature();
      break;
    case '2':
      await commitChanges();
      break;
    case '3':
      await pushToGitHub();
      break;
    case '4':
      await showStatus();
      break;
    case '5':
      await switchBranch();
      break;
    default:
      console.log('❌ Opción no válida');
  }
  
  rl.close();
}

async function createFeature() {
  const featureName = await askQuestion('Nombre de la nueva feature (sin espacios): ');
  const branchName = `feature/${featureName}`;
  
  console.log(`\n🌿 Creando nueva feature: ${branchName}`);
  execCommand(`git checkout -b ${branchName}`);
  console.log(`✅ Feature branch creada: ${branchName}`);
}

async function commitChanges() {
  console.log('\n📋 Estado actual:');
  execCommand('git status');
  
  const addAll = await askQuestion('\n¿Agregar todos los archivos? (y/n): ');
  
  if (addAll.toLowerCase() === 'y') {
    execCommand('git add .');
  } else {
    const files = await askQuestion('Archivos específicos (separados por espacio): ');
    execCommand(`git add ${files}`);
  }
  
  const message = await askQuestion('Mensaje del commit: ');
  const type = await askQuestion('Tipo de commit (feat/fix/docs/style/refactor/test/chore): ');
  
  execCommand(`git commit -m "${type}: ${message}"`);
  console.log('✅ Commit realizado exitosamente');
}

async function pushToGitHub() {
  const currentBranch = execCommand('git branch --show-current').trim();
  console.log(`\n🚀 Haciendo push de la rama: ${currentBranch}`);
  
  const pushType = await askQuestion('¿Es la primera vez que haces push de esta rama? (y/n): ');
  
  if (pushType.toLowerCase() === 'y') {
    execCommand(`git push -u origin ${currentBranch}`);
  } else {
    execCommand(`git push origin ${currentBranch}`);
  }
  
  console.log('✅ Push realizado exitosamente');
}

async function showStatus() {
  console.log('\n📊 Estado del repositorio:');
  execCommand('git status');
  
  console.log('\n🌿 Ramas disponibles:');
  execCommand('git branch -a');
  
  console.log('\n📈 Últimos commits:');
  execCommand('git log --oneline -5');
}

async function switchBranch() {
  console.log('\n🌿 Ramas disponibles:');
  execCommand('git branch');
  
  const branchName = await askQuestion('\nNombre de la rama a la que quieres cambiar: ');
  execCommand(`git checkout ${branchName}`);
  console.log(`✅ Cambiado a la rama: ${branchName}`);
}

// Ejecutar el script
main().catch(console.error);
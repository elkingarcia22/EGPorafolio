# 🚀 Flujo de Trabajo GitHub - Portafolio EG

## 📋 Estructura de Ramas

### 🌿 Ramas Principales
- **`main`**: Código de producción estable
- **`develop`**: Rama de desarrollo principal
- **`feature/*`**: Nuevas funcionalidades
- **`hotfix/*`**: Correcciones urgentes

## 🔄 Flujo de Desarrollo

### 1. 🆕 Crear Nueva Feature
```bash
# Cambiar a develop
git checkout develop
git pull origin develop

# Crear nueva rama feature
git checkout -b feature/nombre-de-la-feature

# Trabajar en la feature...
# Hacer commits descriptivos
git add .
git commit -m "feat: descripción de la funcionalidad"

# Push de la feature
git push origin feature/nombre-de-la-feature
```

### 2. 🔀 Merge a Develop
```bash
# Cambiar a develop
git checkout develop
git pull origin develop

# Merge de la feature
git merge feature/nombre-de-la-feature

# Push a develop
git push origin develop

# Eliminar rama feature local
git branch -d feature/nombre-de-la-feature
```

### 3. 🚀 Deploy a Producción
```bash
# Cambiar a main
git checkout main
git pull origin main

# Merge de develop
git merge develop

# Push a main
git push origin main

# Crear tag de versión
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## 📝 Convenciones de Commits

### 🎯 Tipos de Commits
- **`feat:`**: Nueva funcionalidad
- **`fix:`**: Corrección de bugs
- **`docs:`**: Documentación
- **`style:`**: Formato, espacios, etc.
- **`refactor:`**: Refactorización de código
- **`test:`**: Agregar o modificar tests
- **`chore:`**: Tareas de mantenimiento

### 📋 Ejemplos
```bash
git commit -m "feat: agregar sistema de autenticación"
git commit -m "fix: corregir error en navbar responsive"
git commit -m "docs: actualizar README con nuevas instrucciones"
git commit -m "style: aplicar prettier a componentes"
git commit -m "refactor: optimizar carga de imágenes"
```

## 🏷️ Versionado

### 📊 Semántica de Versiones (SemVer)
- **MAJOR**: Cambios incompatibles (1.0.0 → 2.0.0)
- **MINOR**: Nuevas funcionalidades compatibles (1.0.0 → 1.1.0)
- **PATCH**: Correcciones compatibles (1.0.0 → 1.0.1)

### 🏷️ Crear Tags
```bash
# Versión menor
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin v1.1.0

# Hotfix
git tag -a v1.0.1 -m "Hotfix: corrección crítica"
git push origin v1.0.1
```

## 🔧 Configuración de GitHub

### 🛡️ Protección de Ramas
- **main**: Requiere PR, revisión, y tests
- **develop**: Requiere PR y revisión

### 🔍 Pull Requests
1. Crear PR desde `feature/*` → `develop`
2. Revisar código
3. Aprobar y merge
4. Eliminar rama feature

### 🚨 Issues y Milestones
- Usar issues para bugs y features
- Asignar milestones para releases
- Etiquetar con `bug`, `enhancement`, `documentation`

## 📊 Estado Actual del Proyecto

### ✅ Última Actualización
- **Rama**: `develop`
- **Commit**: `0b1110e`
- **Fecha**: $(date)
- **Cambios**: Rediseño completo con nueva versión 3 de "Acerca de mí"

### 🎯 Próximos Pasos
1. Crear PR para merge a `main`
2. Configurar CI/CD
3. Establecer tests automatizados
4. Documentar APIs

## 🛠️ Comandos Útiles

### 📋 Ver Estado
```bash
git status
git log --oneline -10
git branch -a
```

### 🔄 Sincronizar
```bash
git fetch origin
git pull origin develop
git push origin develop
```

### 🧹 Limpiar
```bash
git branch -d feature/nombre-eliminada
git remote prune origin
```

## 📚 Recursos

- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Git Best Practices](https://github.com/git/git/blob/master/Documentation/SubmittingPatches)

---

**🎯 Objetivo**: Mantener un flujo de desarrollo organizado, controlado y colaborativo para el portafolio EG.

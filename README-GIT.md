# 🚀 Git Workflow - EG Portafolio

## 📋 Resumen del Proyecto

Este es el repositorio del portafolio de Elkin García, desarrollado con Next.js, TypeScript, Tailwind CSS y Supabase.

## 🌿 Estructura de Ramas

- **`main`** - Rama principal de producción
- **`develop`** - Rama de desarrollo principal
- **`release/v1.0.0`** - Rama de release estable
- **`feature/*`** - Ramas para nuevas funcionalidades

## 🛠️ Comandos Útiles

### Script de Workflow Interactivo
```bash
node scripts/git-workflow.js
```

Este script te permite:
1. **Crear nueva feature** - Crea una nueva rama feature
2. **Hacer commit** - Agrega archivos y hace commit con mensaje
3. **Hacer push** - Sube cambios a GitHub
4. **Ver estado** - Muestra el estado actual del repositorio
5. **Cambiar rama** - Cambia entre ramas existentes

### Comandos Git Básicos

#### Crear nueva feature
```bash
git checkout -b feature/nombre-de-la-feature
```

#### Hacer commit
```bash
git add .
git commit -m "feat: descripción del cambio"
```

#### Hacer push
```bash
git push origin nombre-de-la-rama
```

#### Ver estado
```bash
git status
git log --oneline -5
```

## 📝 Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- **`feat:`** - Nueva funcionalidad
- **`fix:`** - Corrección de bugs
- **`docs:`** - Cambios en documentación
- **`style:`** - Cambios de formato/estilo
- **`refactor:`** - Refactorización de código
- **`test:`** - Agregar o modificar tests
- **`chore:`** - Tareas de mantenimiento

### Ejemplos:
```bash
git commit -m "feat: agregar sistema de tooltips"
git commit -m "fix: corregir error en TypewriterText"
git commit -m "docs: actualizar README"
```

## 🔄 Flujo de Trabajo Recomendado

1. **Crear feature branch**
   ```bash
   git checkout develop
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Desarrollar y hacer commits**
   ```bash
   git add .
   git commit -m "feat: implementar nueva funcionalidad"
   ```

3. **Hacer push de la feature**
   ```bash
   git push -u origin feature/nueva-funcionalidad
   ```

4. **Crear Pull Request** en GitHub hacia `develop`

5. **Después de aprobación, mergear** y eliminar la rama feature

## 📁 Estructura del Proyecto

```
EG portafolio/
├── app/                    # Páginas de Next.js
├── components/             # Componentes React
├── contexts/              # Contextos de React
├── hooks/                 # Custom hooks
├── lib/                   # Utilidades y configuraciones
├── scripts/               # Scripts de automatización
└── public/                # Archivos estáticos
```

## 🚨 Archivos Importantes

- **`.gitignore`** - Archivos ignorados por Git
- **`package.json`** - Dependencias del proyecto
- **`.env.local`** - Variables de entorno (NO committear)

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
```

## 📞 Soporte

Para dudas sobre el workflow de Git, consulta este README o usa el script interactivo:
```bash
node scripts/git-workflow.js
```

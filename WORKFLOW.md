# 🚀 Flujo de Trabajo - Portafolio EG

## 📋 Resumen del Proyecto
Este portafolio utiliza **Next.js 15**, **Storybook**, **Supabase** y **GitHub** para un desarrollo controlado y profesional.

## 🌳 Estrategia de Branching

### Ramas Principales
- **`main`**: Código de producción estable
- **`develop`**: Rama de desarrollo donde se integran features
- **`feature/*`**: Ramas para nuevas funcionalidades

### Flujo de Trabajo
```
main ← develop ← feature/nueva-funcionalidad
```

## 🛠️ Comandos Esenciales

### Desarrollo Local
```bash
# Instalar dependencias
npm install

# Desarrollo Next.js
npm run dev

# Storybook
npm run storybook

# Build y test
npm run build
npm run lint
```

### Git Workflow
```bash
# Crear nueva feature
git checkout develop
git pull origin develop
git checkout -b feature/nombre-feature

# Trabajar en la feature
git add .
git commit -m "feat: descripción del cambio"

# Push y crear PR
git push origin feature/nombre-feature
```

## 📚 Storybook

### Configuración Actual
- **Framework**: Next.js con Vite
- **Addons**: Docs, A11y
- **Temas**: Light/Dark mode
- **Puerto**: 6006

### Comandos
```bash
# Desarrollo
npm run storybook

# Build para producción
npm run build-storybook
```

### Estructura de Stories
```
stories/
├── components/          # Stories de componentes
├── pages/              # Stories de páginas
└── assets/             # Assets para stories
```

## 🔄 CI/CD Pipeline

### GitHub Actions
- **Trigger**: Push a `main` o `develop`, PRs
- **Jobs**:
  - Test y Lint
  - Build de aplicación
  - Build de Storybook
  - Deploy a Chromatic (en PRs)

### Checklist Pre-PR
- [ ] `npm run lint` sin errores
- [ ] `npm run build` exitoso
- [ ] `npm run storybook` funciona
- [ ] Tests pasan (si existen)
- [ ] Documentación actualizada

## 🎨 Convenciones de Código

### Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: formato, espacios
refactor: refactorización
test: tests
chore: tareas de mantenimiento
```

### Naming
- **Componentes**: PascalCase (`HeroSection.tsx`)
- **Hooks**: camelCase con `use` (`useTheme.ts`)
- **Stories**: PascalCase con `.stories.tsx`
- **Ramas**: kebab-case (`feature/nueva-funcionalidad`)

## 🚀 Deploy

### Vercel (Producción)
- **Rama**: `main`
- **Build**: Automático en push
- **URL**: Configurada en `vercel.json`

### Storybook (Chromatic)
- **Trigger**: Pull Requests
- **Build**: Automático
- **Review**: Visual testing

## 📁 Estructura del Proyecto

```
EG portafolio/
├── app/                 # Next.js App Router
├── components/          # Componentes reutilizables
├── stories/            # Storybook stories
├── hooks/              # Custom hooks
├── lib/                # Utilidades y configuraciones
├── .github/            # GitHub Actions y templates
├── .storybook/         # Configuración de Storybook
└── supabase/           # Configuración de Supabase
```

## 🔧 Herramientas de Desarrollo

### Principales
- **Next.js 15**: Framework React
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos
- **Framer Motion**: Animaciones
- **Supabase**: Backend y base de datos

### Testing y Calidad
- **ESLint**: Linting
- **Storybook**: Component testing
- **Chromatic**: Visual testing
- **Vitest**: Unit testing (configurado)

## 📝 Próximos Pasos

1. **Completar stories** para todos los componentes
2. **Configurar tests** unitarios con Vitest
3. **Optimizar CI/CD** con más validaciones
4. **Documentar componentes** en Storybook
5. **Configurar monitoreo** de performance

---

*Última actualización: $(date)*

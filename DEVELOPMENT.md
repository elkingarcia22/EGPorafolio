# 🚀 Guía de Desarrollo - Portafolio EG

## 📋 Flujo de Trabajo con Git

### 🌿 Estrategia de Ramas

- **`main`**: Rama principal con código estable y desplegado
- **`develop`**: Rama de desarrollo donde se integran las features
- **`feature/*`**: Ramas para nuevas funcionalidades
- **`hotfix/*`**: Ramas para correcciones urgentes
- **`release/*`**: Ramas para preparar releases

### 🔄 Proceso de Desarrollo

1. **Crear rama de feature**:
   ```bash
   git checkout -b feature/nombre-de-la-feature
   ```

2. **Desarrollar con Storybook**:
   ```bash
   npm run storybook
   ```

3. **Hacer commits descriptivos**:
   ```bash
   git add .
   git commit -m "feat: descripción del cambio"
   ```

4. **Push y crear Pull Request**:
   ```bash
   git push origin feature/nombre-de-la-feature
   ```

### 🎨 Desarrollo con Storybook

Storybook está configurado para desarrollo de componentes:

- **Puerto**: http://localhost:6006
- **Comando**: `npm run storybook`
- **Build**: `npm run build-storybook`

### 📝 Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `style:` Cambios de formato
- `refactor:` Refactorización de código
- `test:` Añadir o corregir tests
- `chore:` Cambios en herramientas o configuración

### 🧪 Testing y Calidad

Antes de hacer push:

```bash
npm run lint          # Verificar código
npm run build         # Verificar build
npm run build-storybook # Verificar Storybook
```

### 🚀 Deployment

- **Desarrollo**: Automático desde rama `develop`
- **Producción**: Manual desde rama `main`
- **Storybook**: Automático en PRs via Chromatic

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run storybook        # Storybook
npm run build            # Build de producción
npm run build-storybook  # Build de Storybook

# Git
git checkout -b feature/nueva-feature
git add .
git commit -m "feat: descripción"
git push origin feature/nueva-feature
```

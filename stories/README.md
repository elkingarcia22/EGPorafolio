# Storybook - Portfolio UX/UI Designer

Este Storybook contiene todos los componentes del sistema de diseño neomorfismo para el portafolio.

## Componentes Disponibles

### 🏠 Páginas
- **HomePage**: Página principal completa con diseño neuromórfico
- Incluye letras EG gigantes, texto typewriter y sección de proyectos
- Soporte para modo claro y oscuro

### 🧭 Navigation
- **Navbar**: Barra de navegación fija con menú expandible
- **MinimalMenu**: Menú minimalista con animación horizontal y efectos hover
- **LanguageToggle**: Toggle para cambiar idiomas (ES/EN) con persistencia

### 🎨 Componentes Principales
- **NeuromorphicEG**: Letras EG gigantes con efecto neuromórfico y gradiente
- **TypewriterText**: Texto con efecto typewriter animado
- Incluye controles para velocidad de escritura y pausas

### 🎨 UI Components

#### NeoButton
- Variantes: `default`, `primary`, `secondary`, `outline`, `ghost`
- Tamaños: `sm`, `md`, `lg`
- Estados: normal, disabled, con iconos

#### NeoCard
- Componente de tarjeta con efectos neomorfismo
- Incluye: Header, Content, Footer
- Ejemplos: Project Card, Profile Card

#### NeoInput
- Campo de entrada con estilo neomorfismo
- Tipos: text, email, password, number, tel, url
- Estados: normal, disabled, con validación

#### NeoTextarea
- Área de texto con estilo neomorfismo
- Redimensionable
- Integrado con formularios

#### NeoSelect
- Selector desplegable con estilo neomorfismo
- Opciones personalizables
- Integrado con formularios

## 🎨 Design System

### Colores
- **Background**: `#f0f0f3` - Color base neomorfismo
- **Primary**: `#3b82f6` - Azul principal
- **Secondary**: `#6b7280` - Gris secundario

### Efectos Neomorfismo
- **Sombra exterior**: `4px 4px 8px #d1d9e6`
- **Sombra interior**: `-4px -4px 8px #ffffff`
- **Border radius**: `20px` para elementos grandes, `10px` para pequeños

## 🚀 Cómo usar

1. **Iniciar Storybook**:
   ```bash
   npm run storybook
   ```

2. **Construir Storybook**:
   ```bash
   npm run build-storybook
   ```

3. **Ver en el navegador**: http://localhost:6006

## 📝 Agregar nuevos componentes

1. Crear el componente en `components/ui/`
2. Crear el archivo de story en `stories/`
3. Seguir el patrón de naming: `ComponentName.stories.ts`
4. Incluir todas las variantes y estados del componente

## 🎯 Mejores prácticas

- Usar el fondo neomorfismo por defecto
- Incluir controles para todas las props importantes
- Documentar cada variante del componente
- Probar accesibilidad con el addon a11y
- Mantener consistencia en el naming

# EGPorafolio - Portfolio UX/UI Designer

Portfolio profesional de **Elkin Garcia** con estilo neomorfismo, panel de administración completo y funcionalidades avanzadas para diseñadores UX/UI.

🌐 **Demo**: [https://egporafolio.vercel.app](https://egporafolio.vercel.app)  
📚 **Storybook**: [https://egporafolio-storybook.vercel.app](https://egporafolio-storybook.vercel.app)  
🔗 **GitHub**: [https://github.com/elkingarcia22/EGPorafolio](https://github.com/elkingarcia22/EGPorafolio)

## ✨ Características

- 🎨 **Diseño Neomorfismo**: Estilo visual moderno y elegante
- 🌙 **Modo Dark/Light**: Tema oscuro y claro con transiciones suaves
- 📱 **Responsive**: Diseño adaptativo para todos los dispositivos
- 🛠️ **Panel de Administración**: Gestión completa del contenido
- 📄 **CV Dinámico**: Visualización, descarga PDF y compartir
- 🗄️ **Base de Datos**: Integración con Supabase
- ⚡ **Performance**: Optimizado con Next.js 14
- 🎭 **Animaciones**: Transiciones fluidas con Framer Motion

## 🚀 Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Custom Properties
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **PDF Generation**: jsPDF, html2canvas
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast

## 📋 Secciones del Portafolio

1. **Home**: Presentación principal con información destacada
2. **Proyectos**: Galería de proyectos con filtros y modal de detalles
3. **Experiencia**: Historial laboral y educativo
4. **Habilidades**: Skills organizadas por categorías
5. **Contacto**: Formulario de contacto y información
6. **CV**: Visualización y descarga del currículum
7. **Admin**: Panel de administración completo

## 🛠️ Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd portfolio-ux-ui
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp env.example .env.local
```

Edita `.env.local` con tus credenciales:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key

# Admin Configuration
ADMIN_EMAIL=admin@ejemplo.com
ADMIN_PASSWORD=tu_contraseña_admin

# Email Configuration (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password
```

### 4. Configurar Supabase

1. Crea un nuevo proyecto en [Supabase](https://supabase.com)
2. Ve a SQL Editor y ejecuta el archivo `supabase/migrations/001_initial_schema.sql`
3. Esto creará todas las tablas necesarias y datos de ejemplo

### 5. Ejecutar el proyecto

```bash
npm run dev
# o
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🎨 Personalización

### Colores y Tema

Los colores se pueden personalizar en `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Tus colores primarios
  },
  dark: {
    // Colores para modo oscuro
  }
}
```

### Componentes Neomorfismo

Los estilos neomorfismo están definidos en `app/globals.css`:

```css
.neo-card {
  @apply bg-background rounded-2xl shadow-neomorphic;
}

.neo-button {
  @apply bg-background rounded-xl shadow-neomorphic;
}
```

### Contenido

Todo el contenido se puede editar desde el panel de administración en `/admin` o directamente en la base de datos.

## 📊 Estructura de la Base de Datos

### Tablas Principales

- **profiles**: Información personal del diseñador
- **projects**: Proyectos del portafolio
- **experience**: Experiencia laboral
- **education**: Formación académica
- **skills**: Habilidades organizadas por categorías
- **contact_messages**: Mensajes del formulario de contacto
- **admin_users**: Usuarios administradores

## 🔐 Panel de Administración

Accede al panel de administración en `/admin` con las credenciales configuradas.

### Funcionalidades del Admin

- ✅ Gestión de perfil personal
- ✅ CRUD de proyectos
- ✅ Gestión de experiencia laboral
- ✅ Administración de habilidades
- ✅ Configuración de contacto
- ✅ Gestión del CV
- ✅ Configuración general del sitio

## 📱 Funcionalidades del CV

- **Visualización**: CV completo y responsive
- **Descarga PDF**: Generación automática de PDF
- **Compartir**: Enlaces y redes sociales
- **Email**: Envío directo por correo
- **Impresión**: Función de impresión nativa

## 🎯 SEO y Performance

- Meta tags optimizados
- Open Graph para redes sociales
- Sitemap automático
- Imágenes optimizadas
- Lazy loading
- Code splitting

## 🚀 Despliegue

### Vercel (Recomendado)

1. **Conectar repositorio**:
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu cuenta de GitHub
   - Importa el repositorio `elkingarcia22/EGPorafolio`

2. **Configurar variables de entorno**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key
   ADMIN_EMAIL=admin@ejemplo.com
   ADMIN_PASSWORD=tu_contraseña_admin
   ```

3. **Despliegue automático**:
   - Vercel detectará automáticamente que es un proyecto Next.js
   - Se desplegará en cada push a la rama `main`
   - URL automática: `https://egporafolio.vercel.app`

### Despliegue de Storybook

Para desplegar Storybook en Vercel:

1. Crea un nuevo proyecto en Vercel
2. Configura el build command: `npm run build-storybook`
3. Configura el output directory: `storybook-static`
4. Despliega

### Netlify

1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno
3. Despliega

### Docker

```bash
# Construir imagen
docker build -t portfolio-ux-ui .

# Ejecutar contenedor
docker run -p 3000:3000 portfolio-ux-ui
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Construcción para producción
npm run start        # Servidor de producción
npm run lint         # Linter
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Supabase](https://supabase.com/) - Backend as a Service
- [Framer Motion](https://www.framer.com/motion/) - Animaciones
- [Lucide](https://lucide.dev/) - Iconos

---

**¡Diseñado con ❤️ para la comunidad UX/UI!**

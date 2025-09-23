# 📧 Configuración de EmailJS - Solución Universal

## 🎯 ¿Por qué EmailJS?

- ✅ **Gratuito** hasta 200 emails/mes
- ✅ **Funciona para todos** los usuarios sin configuración
- ✅ **No requiere backend** - funciona desde el frontend
- ✅ **Compatible** con local y web
- ✅ **Fácil configuración** - 5 minutos

## 🚀 Configuración Paso a Paso

### Paso 1: Crear cuenta en EmailJS
1. Ve a [EmailJS.com](https://www.emailjs.com/)
2. **Regístrate** con tu email
3. **Confirma** tu cuenta

### Paso 2: Configurar servicio de email
1. En el dashboard, ve a **"Email Services"**
2. **"Add New Service"**
3. Selecciona **"Gmail"**
4. **Conecta tu Gmail** `garcia.elkin.salazar@gmail.com`
5. **Autoriza** el acceso
6. **Copia el Service ID** (ej: `service_abc123`)

### Paso 3: Crear template de email
1. Ve a **"Email Templates"**
2. **"Create New Template"**
3. **Configura el template**:

```html
Subject: {{subject}}

Hola Elkin,

Nuevo mensaje desde tu portafolio:

Nombre: {{from_name}}
Email: {{from_email}}
Asunto: {{subject}}

Mensaje:
{{message}}

---
Enviado desde el portafolio de Elkin García
```

4. **Guarda** y copia el **Template ID** (ej: `template_xyz789`)

### Paso 4: Obtener Public Key
1. Ve a **"Account"** → **"General"**
2. **Copia tu Public Key** (ej: `user_abc123def456`)

### Paso 5: Configurar en el proyecto
1. **Actualiza** el archivo `components/ui/email-modal.tsx`
2. **Reemplaza** las variables:

```typescript
const serviceId = 'service_abc123' // Tu Service ID
const templateId = 'template_xyz789' // Tu Template ID  
const publicKey = 'user_abc123def456' // Tu Public Key
```

## 🔧 Configuración Rápida

### Opción 1: Variables de entorno (Recomendado)
1. **Agregar al `.env.local`**:
```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_abc123
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xyz789
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=user_abc123def456
```

2. **Actualizar el modal** para usar las variables:
```typescript
const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
```

### Opción 2: Configuración directa
1. **Editar** `components/ui/email-modal.tsx`
2. **Reemplazar** las variables con tus valores reales

## ✅ Ventajas de EmailJS

- **Sin configuración del usuario** - Funciona para todos
- **Sin variables de entorno** - Configuración simple
- **Sin backend** - Todo desde el frontend
- **Gratuito** - 200 emails/mes
- **Confiable** - Servicio establecido
- **Fácil mantenimiento** - Una sola configuración

## 🎯 Resultado Final

Una vez configurado:
- ✅ **"Enviar directamente"** - Funciona para todos los usuarios
- ✅ **"Abrir mi cliente de email"** - Fallback siempre disponible
- ✅ **Sin errores** - Solución robusta
- ✅ **Universal** - Funciona en local y web

## 📞 Soporte

Si tienes problemas:
1. **Verifica** que el Service ID, Template ID y Public Key sean correctos
2. **Revisa** que el template tenga las variables correctas
3. **Confirma** que Gmail esté conectado correctamente
4. **Prueba** con un email de prueba

¡Con EmailJS tendrás una solución que funciona para todos los usuarios sin configuración adicional! 🚀

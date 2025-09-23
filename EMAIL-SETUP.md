# 📧 Configuración de Email para el Portafolio

## 🎯 Opciones Disponibles

El modal de email tiene **dos opciones**:

1. **"Enviar directamente"** - Envía el email automáticamente a `garcia.elkin.salazar@gmail.com`
2. **"Abrir mi cliente de email"** - Abre el cliente de email del usuario con el mensaje pre-llenado

## ⚙️ Configuración para Envío Directo

### Opción 1: Gmail SMTP (Recomendado)

1. **Habilitar 2FA en Gmail**
2. **Generar App Password**:
   - Ve a Google Account → Security → 2-Step Verification → App passwords
   - Genera una contraseña para "Mail"
3. **Agregar variables al `.env.local`**:
   ```env
   EMAIL_USER=garcia.elkin.salazar@gmail.com
   EMAIL_PASS=tu_app_password_de_16_caracteres
   ```

### Opción 2: EmailJS (Más Simple)

1. **Crear cuenta en [EmailJS](https://www.emailjs.com/)**
2. **Configurar servicio de email** (Gmail, Outlook, etc.)
3. **Crear template de email**
4. **Agregar variables al `.env.local`**:
   ```env
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=tu_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=tu_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=tu_public_key
   ```

### Opción 3: SendGrid (Para Producción)

1. **Crear cuenta en [SendGrid](https://sendgrid.com/)**
2. **Generar API Key**
3. **Agregar variable al `.env.local`**:
   ```env
   SENDGRID_API_KEY=tu_sendgrid_api_key
   ```

## 🚀 Estado Actual

- ✅ **Modal funcional** con ambas opciones
- ✅ **Email actualizado** a `garcia.elkin.salazar@gmail.com`
- ✅ **API route** configurado para envío directo
- ✅ **Validaciones** y manejo de errores
- ⚠️ **Requiere configuración** de variables de entorno para envío directo

## 📝 Cómo Funciona

### Opción 1: Envío Directo
1. Usuario completa el formulario
2. Se envía POST a `/api/send-email`
3. El servidor procesa y envía el email
4. Usuario recibe confirmación

### Opción 2: Cliente de Email
1. Usuario completa el formulario
2. Se abre el cliente de email con mailto:
3. Usuario envía manualmente desde su cliente

## 🔧 Próximos Pasos

1. **Configurar variables de entorno** según la opción elegida
2. **Probar el envío directo** en desarrollo
3. **Configurar en producción** (Vercel, Netlify, etc.)

## 📞 Soporte

Si tienes problemas con la configuración, revisa:
- Variables de entorno correctas
- Permisos de App Password (Gmail)
- Configuración del servicio (EmailJS)
- Logs del servidor para errores

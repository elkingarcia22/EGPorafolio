// Configuración para servicios de email
export const emailConfig = {
  // EmailJS (recomendado para proyectos simples)
  emailjs: {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
  },
  
  // Gmail SMTP (requiere configuración de app password)
  gmail: {
    user: process.env.EMAIL_USER || 'garcia.elkin.salazar@gmail.com',
    pass: process.env.EMAIL_PASS || '', // App password de Gmail
  },
  
  // SendGrid (para producción)
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
  },
  
  // Resend (alternativa moderna)
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
  }
}

// Función para enviar email usando EmailJS (cliente)
export const sendEmailWithEmailJS = async (formData: {
  name: string
  email: string
  subject: string
  message: string
}) => {
  if (typeof window === 'undefined') return { success: false, error: 'No disponible en servidor' }
  
  try {
    // Importar EmailJS dinámicamente
    const emailjs = await import('@emailjs/browser')
    
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject || 'Contacto desde portafolio',
      message: formData.message,
      to_email: 'garcia.elkin.salazar@gmail.com'
    }
    
    const result = await emailjs.send(
      emailConfig.emailjs.serviceId,
      emailConfig.emailjs.templateId,
      templateParams,
      emailConfig.emailjs.publicKey
    )
    
    return { success: true, result }
  } catch (error) {
    console.error('Error enviando email con EmailJS:', error)
    return { success: false, error: error.message }
  }
}

// Función para enviar email usando Nodemailer (servidor)
export const sendEmailWithNodemailer = async (formData: {
  name: string
  email: string
  subject: string
  message: string
}) => {
  try {
    const nodemailer = await import('nodemailer')
    
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: emailConfig.gmail.user,
        pass: emailConfig.gmail.pass
      }
    })
    
    const mailOptions = {
      from: formData.email,
      to: 'garcia.elkin.salazar@gmail.com',
      subject: formData.subject || `Contacto desde portafolio - ${formData.name}`,
      text: `
Nuevo mensaje desde el portafolio:

Nombre: ${formData.name}
Email: ${formData.email}
Asunto: ${formData.subject || 'Sin asunto'}

Mensaje:
${formData.message}

---
Enviado desde el portafolio de Elkin García
      `.trim(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #16A2FF; padding-bottom: 10px;">
            Nuevo mensaje desde el portafolio
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nombre:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Asunto:</strong> ${formData.subject || 'Sin asunto'}</p>
          </div>
          
          <div style="background: white; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Mensaje:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${formData.message}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">
          <p style="color: #6c757d; font-size: 14px; text-align: center;">
            Enviado desde el portafolio de Elkin García
          </p>
        </div>
      `
    }
    
    const result = await transporter.sendMail(mailOptions)
    return { success: true, result }
  } catch (error) {
    console.error('Error enviando email con Nodemailer:', error)
    return { success: false, error: error.message }
  }
}

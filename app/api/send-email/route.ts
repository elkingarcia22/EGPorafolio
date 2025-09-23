import { NextRequest, NextResponse } from 'next/server'
import { sendEmailWithNodemailer } from '@/lib/email-config'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validar que todos los campos requeridos estén presentes
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      )
    }

    // Crear el contenido del email
    const emailContent = {
      to: 'garcia.elkin.salazar@gmail.com',
      from: email,
      subject: subject || `Contacto desde portafolio - ${name}`,
      text: `
Nuevo mensaje desde el portafolio:

Nombre: ${name}
Email: ${email}
Asunto: ${subject || 'Sin asunto'}

Mensaje:
${message}

---
Enviado desde el portafolio de Elkin García
      `.trim(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #16A2FF; padding-bottom: 10px;">
            Nuevo mensaje desde el portafolio
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Asunto:</strong> ${subject || 'Sin asunto'}</p>
          </div>
          
          <div style="background: white; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Mensaje:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">
          <p style="color: #6c757d; font-size: 14px; text-align: center;">
            Enviado desde el portafolio de Elkin García
          </p>
        </div>
      `
    }

    // Intentar enviar el email usando Nodemailer
    const emailResult = await sendEmailWithNodemailer({
      name,
      email,
      subject: subject || 'Contacto desde portafolio',
      message
    })
    
    if (!emailResult.success) {
      console.error('Error enviando email:', emailResult.error)
      return NextResponse.json(
        { error: 'Error enviando el email. Intenta usar la opción de cliente de email.' },
        { status: 500 }
      )
    }
    
    console.log('📧 Email enviado exitosamente:', emailResult.result)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email enviado exitosamente',
        emailContent // Solo para desarrollo, remover en producción
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error enviando email:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

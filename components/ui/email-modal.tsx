'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesignTokens } from '@/hooks/useDesignTokens'
import { useLanguage } from '@/contexts/language-context'

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
}

export const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  const designTokens = useDesignTokens()
  const { t } = useLanguage()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Crear el mailto link con los datos del formulario
      const subject = encodeURIComponent(formData.subject || 'Contacto desde portafolio')
      const body = encodeURIComponent(
        `Hola Elkin,\n\n` +
        `Mi nombre es: ${formData.name}\n` +
        `Mi email es: ${formData.email}\n\n` +
        `Mensaje:\n${formData.message}\n\n` +
        `Saludos cordiales.`
      )
      
      const mailtoLink = `mailto:garcia.elkin.salazar@gmail.com?subject=${subject}&body=${body}`
      
      // Abrir el cliente de email
      window.location.href = mailtoLink
      
      setSubmitStatus('success')
      
      // Limpiar el formulario después de un momento
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' })
        setSubmitStatus('idle')
        onClose()
      }, 2000)
      
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Usar EmailJS para envío directo
      const emailjs = await import('@emailjs/browser')
      
      // Configuración de EmailJS (gratuita y funciona para todos)
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_elkin_portfolio'
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_contact'
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_EMAILJS_PUBLIC_KEY'
      
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject || 'Contacto desde portafolio',
        message: formData.message,
        to_email: 'garcia.elkin.salazar@gmail.com'
      }
      
      const result = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      )
      
      console.log('📧 Email enviado exitosamente:', result)
      setSubmitStatus('success')
      
      // Limpiar el formulario después de un momento
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' })
        setSubmitStatus('idle')
        onClose()
      }, 2000)
      
    } catch (error) {
      console.error('Error enviando email con EmailJS:', error)
      
      // Fallback: intentar con API route
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        const result = await response.json()

        if (response.ok) {
          // Si es un fallback, abrir mailto
          if (result.fallback && result.mailto) {
            window.location.href = result.mailto
          }
          
          setSubmitStatus('success')
          setTimeout(() => {
            setFormData({ name: '', email: '', subject: '', message: '' })
            setSubmitStatus('idle')
            onClose()
          }, 2000)
        } else {
          setSubmitStatus('error')
        }
      } catch (apiError) {
        console.error('Error con API route:', apiError)
        setSubmitStatus('error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleOverlayClick}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('contact.sendEmail')}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('contact.yourName')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder={t('contact.namePlaceholder')}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('contact.yourEmail')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder={t('contact.emailPlaceholder')}
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('contact.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder={t('contact.subjectPlaceholder')}
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('contact.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  placeholder={t('contact.messagePlaceholder')}
                />
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    {t('contact.emailSuccess')}
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    Error al enviar. Usa la opción "Abrir mi cliente de email" o configura las variables de entorno.
                  </p>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleDirectSubmit}
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: designTokens.colors.primary.gradient }}
                >
                  {isSubmitting ? t('contact.sending') : 'Enviar directamente'}
                </button>
                
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Abrir mi cliente de email
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

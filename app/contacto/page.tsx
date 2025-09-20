'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Linkedin, MessageCircle, MapPin, Clock, CheckCircle } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { NeoCard } from '@/components/ui/neo-card'
import { NeoButton } from '@/components/ui/neo-button'
import { NeoInput } from '@/components/ui/neo-input'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success('¡Mensaje enviado correctamente!')
    setFormData({ name: '', email: '', subject: '', message: '' })
    setIsSubmitting(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
      <Navigation />
      
      <section className="pt-24 pb-16 section-padding">
        <div className="container-max">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Let's Work Together
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Estoy siempre interesado en nuevos desafíos y oportunidades para crear 
              experiencias extraordinarias. ¡Conversemos!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Methods */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Contact Cards */}
              <div className="grid gap-6">
                {/* Email Card */}
                <NeoCard>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg text-foreground">Email</h3>
                      <p className="text-muted-foreground">Response within 24 hours</p>
                      <a 
                        href="mailto:hello@ejemplo.com" 
                        className="text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        hello@ejemplo.com
                      </a>
                    </div>
                  </div>
                </NeoCard>

                {/* LinkedIn Card */}
                <NeoCard>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Linkedin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg text-foreground">LinkedIn</h3>
                      <p className="text-muted-foreground">Professional network</p>
                      <a 
                        href="#" 
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Let's Connect
                      </a>
                    </div>
                  </div>
                </NeoCard>

                {/* WhatsApp Card */}
                <NeoCard>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg text-foreground">WhatsApp</h3>
                      <p className="text-muted-foreground">Direct chat</p>
                      <a 
                        href="https://wa.me/541112345678" 
                        className="text-green-600 hover:text-green-700 transition-colors"
                      >
                        +54 11 1234-5678
                      </a>
                    </div>
                  </div>
                </NeoCard>
              </div>

              {/* Availability Card */}
              <NeoCard>
                <h3 className="font-semibold text-lg text-foreground mb-4">Work Availability</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-foreground">Available for new opportunities</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary-500" />
                    <span className="text-foreground">Response within 24 hours</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary-500" />
                    <span className="text-foreground">Buenos Aires, Argentina</span>
                  </div>
                </div>
              </NeoCard>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <NeoCard>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      Do you have an opportunity?
                    </h3>
                    <p className="text-muted-foreground">
                      Send me the position details and let's talk about how I can contribute to your team.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <NeoInput
                        label="Nombre"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Tu nombre completo"
                      />
                      <NeoInput
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="tu@email.com"
                      />
                    </div>

                    <NeoInput
                      label="Asunto"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="¿En qué puedo ayudarte?"
                    />

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        Mensaje
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="neo-input w-full resize-none"
                        placeholder="Cuéntame sobre tu proyecto o oportunidad..."
                      />
                    </div>

                    <NeoButton
                      type="submit"
                      size="lg"
                      fullWidth
                      loading={isSubmitting}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Contact now
                    </NeoButton>
                  </form>
                </div>
              </NeoCard>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

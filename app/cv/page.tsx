'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Download, Share2, Mail, Printer, FileText, User, MapPin, Phone, Mail as MailIcon, Linkedin, Github, Calendar, Briefcase, GraduationCap, Award } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { NeoCard } from '@/components/ui/neo-card'
import { NeoButton } from '@/components/ui/neo-button'
import { formatDateRange } from '@/lib/utils'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import toast from 'react-hot-toast'

// Mock data - esto vendrá de Supabase
const profileData = {
  name: 'Elkin Mac',
  title: 'Senior UX/UI Designer',
  email: 'hello@ejemplo.com',
  phone: '+54 11 1234-5678',
  location: 'Buenos Aires, Argentina',
  linkedin: 'linkedin.com/in/elkinmac',
  github: 'github.com/elkinmac',
  summary: 'Diseñador UX/UI Senior con más de 5 años de experiencia creando experiencias digitales excepcionales. Especializado en diseño centrado en el usuario, investigación UX y desarrollo de productos digitales innovadores.',
  experience: [
    {
      company: 'TechCorp Solutions',
      position: 'Senior UX/UI Designer',
      startDate: '2022-01-01',
      endDate: null,
      current: true,
      location: 'Buenos Aires, Argentina',
      description: 'Lideré el diseño de productos digitales para más de 50 clientes empresariales, mejorando la experiencia de usuario en un 40% y aumentando la conversión en un 25%.',
      achievements: [
        'Diseñé y lanzé 3 productos digitales principales',
        'Mentoré a 5 diseñadores junior',
        'Implementé sistema de design system',
        'Aumenté satisfacción del usuario en 40%'
      ]
    },
    {
      company: 'Digital Agency Pro',
      position: 'UX/UI Designer',
      startDate: '2020-03-01',
      endDate: '2021-12-31',
      current: false,
      location: 'Buenos Aires, Argentina',
      description: 'Desarrollé interfaces de usuario para aplicaciones móviles y web, trabajando con equipos multidisciplinarios en proyectos de alto impacto.',
      achievements: [
        'Diseñé 20+ aplicaciones móviles',
        'Colaboré con 15+ desarrolladores',
        'Mejoré tiempo de desarrollo en 30%',
        'Gané premio de diseño 2021'
      ]
    }
  ],
  education: [
    {
      institution: 'Universidad de Buenos Aires',
      degree: 'Licenciatura en Diseño Gráfico',
      field: 'Diseño Visual',
      startDate: '2015-03-01',
      endDate: '2019-12-15',
      current: false,
      location: 'Buenos Aires, Argentina'
    },
    {
      institution: 'Google UX Design Certificate',
      degree: 'Google UX Design Professional Certificate',
      field: 'UX/UI Design',
      startDate: '2021-01-01',
      endDate: '2021-08-31',
      current: false,
      location: 'Online'
    }
  ],
  skills: {
    design: ['Figma', 'Adobe XD', 'Sketch', 'Adobe Creative Suite', 'Principle', 'Framer'],
    development: ['HTML/CSS', 'JavaScript', 'React', 'TypeScript', 'Vue.js', 'React Native'],
    tools: ['Git', 'Notion', 'Slack', 'Jira', 'Zeplin', 'InVision'],
    soft: ['Liderazgo', 'Comunicación', 'Trabajo en Equipo', 'Pensamiento Crítico', 'Adaptabilidad', 'Creatividad']
  },
  certifications: [
    'Google UX Design Professional Certificate',
    'Interaction Design Foundation - UX Design',
    'Adobe Certified Expert - Photoshop',
    'Figma Certified Professional'
  ]
}

export default function CVPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const cvRef = useRef<HTMLDivElement>(null)

  const handleDownloadPDF = async () => {
    if (!cvRef.current) return
    
    setIsGenerating(true)
    try {
      const canvas = await html2canvas(cvRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      
      let position = 0
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      pdf.save('CV_Elkin_Mac.pdf')
      toast.success('CV descargado exitosamente')
    } catch (error) {
      toast.error('Error al generar el PDF')
      console.error('Error generating PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CV - Elkin Mac',
          text: 'Diseñador UX/UI Senior',
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Enlace copiado al portapapeles')
    }
  }

  const handleEmailCV = () => {
    const subject = 'CV - Elkin Mac - Diseñador UX/UI Senior'
    const body = `Hola,

Te comparto mi CV como Diseñador UX/UI Senior. Estoy interesado en oportunidades de trabajo y colaboración.

Puedes ver mi CV completo en: ${window.location.href}

Saludos,
Elkin Mac`
    
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
      <Navigation />
      
      <section className="pt-24 pb-16 section-padding">
        <div className="container-max">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Mi <span className="text-gradient">Currículum</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Descarga, comparte o envía mi CV por correo
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <NeoButton
                onClick={handleDownloadPDF}
                loading={isGenerating}
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Descargar PDF
              </NeoButton>
              
              <NeoButton
                variant="outline"
                onClick={handleShare}
                size="lg"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Compartir
              </NeoButton>
              
              <NeoButton
                variant="outline"
                onClick={handleEmailCV}
                size="lg"
              >
                <Mail className="w-5 h-5 mr-2" />
                Enviar por Email
              </NeoButton>
              
              <NeoButton
                variant="ghost"
                onClick={() => window.print()}
                size="lg"
              >
                <Printer className="w-5 h-5 mr-2" />
                Imprimir
              </NeoButton>
            </div>
          </motion.div>

          {/* CV Content */}
          <motion.div
            ref={cvRef}
            className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-neomorphic dark:shadow-neomorphic-dark overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold">
                  EM
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">{profileData.name}</h1>
                  <p className="text-xl text-primary-100 mb-4">{profileData.title}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MailIcon className="w-4 h-4" />
                      {profileData.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {profileData.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {profileData.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Summary */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <User className="w-6 h-6 text-primary-600" />
                  Resumen Profesional
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {profileData.summary}
                </p>
              </section>

              {/* Experience */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-primary-600" />
                  Experiencia Laboral
                </h2>
                <div className="space-y-6">
                  {profileData.experience.map((job, index) => (
                    <div key={index} className="border-l-4 border-primary-200 pl-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">{job.position}</h3>
                          <p className="text-primary-600 font-medium">{job.company}</p>
                        </div>
                        <div className="text-sm text-muted-foreground mt-2 md:mt-0">
                          {formatDateRange(job.startDate, job.endDate)}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">{job.description}</p>
                      <ul className="space-y-1">
                        {job.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-primary-500 mt-1">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-primary-600" />
                  Educación
                </h2>
                <div className="space-y-4">
                  {profileData.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-green-200 pl-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{edu.degree}</h3>
                          <p className="text-green-600 font-medium">{edu.institution}</p>
                          <p className="text-muted-foreground text-sm">{edu.field}</p>
                        </div>
                        <div className="text-sm text-muted-foreground mt-2 md:mt-0">
                          {formatDateRange(edu.startDate, edu.endDate)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Skills */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Award className="w-6 h-6 text-primary-600" />
                  Habilidades
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(profileData.skills).map(([category, skills]) => (
                    <div key={category}>
                      <h3 className="font-semibold text-foreground mb-3 capitalize">
                        {category === 'design' ? 'Diseño' : 
                         category === 'development' ? 'Desarrollo' :
                         category === 'tools' ? 'Herramientas' : 'Habilidades Blandas'}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm rounded-lg"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Certifications */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-primary-600" />
                  Certificaciones
                </h2>
                <ul className="space-y-2">
                  {profileData.certifications.map((cert, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary-500 mt-1">•</span>
                      {cert}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

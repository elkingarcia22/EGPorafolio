'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, MapPin, Calendar, ExternalLink } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { NeoCard } from '@/components/ui/neo-card'
import { NeoButton } from '@/components/ui/neo-button'
import { formatDateRange } from '@/lib/utils'

// Mock data - esto vendrá de Supabase
const experience = [
  {
    id: 1,
    company: 'TechCorp Solutions',
    position: 'Senior UX/UI Designer',
    description: 'Lideré el diseño de productos digitales para más de 50 clientes empresariales, mejorando la experiencia de usuario en un 40% y aumentando la conversión en un 25%.',
    startDate: '2022-01-01',
    endDate: null,
    current: true,
    location: 'Buenos Aires, Argentina',
    achievements: [
      'Diseñé y lanzé 3 productos digitales principales',
      'Mentoré a 5 diseñadores junior',
      'Implementé sistema de design system',
      'Aumenté satisfacción del usuario en 40%'
    ],
    technologies: ['Figma', 'Adobe Creative Suite', 'React', 'Framer']
  },
  {
    id: 2,
    company: 'Digital Agency Pro',
    position: 'UX/UI Designer',
    description: 'Desarrollé interfaces de usuario para aplicaciones móviles y web, trabajando con equipos multidisciplinarios en proyectos de alto impacto.',
    startDate: '2020-03-01',
    endDate: '2021-12-31',
    current: false,
    location: 'Buenos Aires, Argentina',
    achievements: [
      'Diseñé 20+ aplicaciones móviles',
      'Colaboré con 15+ desarrolladores',
      'Mejoré tiempo de desarrollo en 30%',
      'Gané premio de diseño 2021'
    ],
    technologies: ['Sketch', 'Principle', 'InVision', 'Zeplin']
  },
  {
    id: 3,
    company: 'StartupXYZ',
    position: 'Product Designer',
    description: 'Diseñé la experiencia completa del producto desde cero, desde la investigación de usuarios hasta la implementación final.',
    startDate: '2019-06-01',
    endDate: '2020-02-29',
    current: false,
    location: 'Remote',
    achievements: [
      'Lanzé producto desde 0 a 10k usuarios',
      'Conduje investigación de usuarios',
      'Diseñé MVP y iteraciones',
      'Establecí procesos de diseño'
    ],
    technologies: ['Figma', 'Maze', 'Hotjar', 'Notion']
  }
]

const education = [
  {
    id: 1,
    institution: 'Universidad de Buenos Aires',
    degree: 'Licenciatura en Diseño Gráfico',
    field: 'Diseño Visual',
    startDate: '2015-03-01',
    endDate: '2019-12-15',
    current: false,
    location: 'Buenos Aires, Argentina',
    achievements: [
      'Graduado con honores (9.2/10)',
      'Proyecto final destacado',
      'Participación en concursos de diseño'
    ]
  },
  {
    id: 2,
    institution: 'Interaction Design Foundation',
    degree: 'Certificación en UX Design',
    field: 'User Experience Design',
    startDate: '2020-01-01',
    endDate: '2020-06-30',
    current: false,
    location: 'Online',
    achievements: [
      'Certificación con distinción',
      'Especialización en investigación UX',
      'Proyectos prácticos completados'
    ]
  },
  {
    id: 3,
    institution: 'Google UX Design Certificate',
    degree: 'Google UX Design Professional Certificate',
    field: 'UX/UI Design',
    startDate: '2021-01-01',
    endDate: '2021-08-31',
    current: false,
    location: 'Online',
    achievements: [
      'Certificación profesional de Google',
      'Portfolio de 3 proyectos completos',
      'Mentoría de diseñadores senior'
    ]
  }
]

export default function ExperiencePage() {
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
      <Navbar />
      
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
              Experiencia & <span className="text-gradient">Educación</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Mi trayectoria profesional y formación académica que me han llevado 
              a ser el diseñador que soy hoy
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            className="flex justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex bg-muted/50 rounded-2xl p-2">
              <NeoButton
                variant={activeTab === 'experience' ? 'primary' : 'ghost'}
                onClick={() => setActiveTab('experience')}
                className="px-8"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Experiencia
              </NeoButton>
              <NeoButton
                variant={activeTab === 'education' ? 'primary' : 'ghost'}
                onClick={() => setActiveTab('education')}
                className="px-8"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Educación
              </NeoButton>
            </div>
          </motion.div>

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {experience.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <NeoCard className="relative">
                    {/* Timeline indicator */}
                    <div className="absolute left-8 top-8 w-4 h-4 bg-primary-500 rounded-full border-4 border-background shadow-neomorphic dark:shadow-neomorphic-dark" />
                    {index < experience.length - 1 && (
                      <div className="absolute left-10 top-12 w-0.5 h-full bg-primary-200 dark:bg-primary-800" />
                    )}
                    
                    <div className="pl-16">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold text-foreground">
                            {job.position}
                          </h3>
                          <div className="flex items-center gap-2 text-primary-600 font-semibold">
                            <Briefcase className="w-4 h-4" />
                            {job.company}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 mt-4 lg:mt-0">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {formatDateRange(job.startDate, job.endDate)}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {job.description}
                      </p>
                      
                      {/* Achievements */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-foreground mb-3">Logros Principales</h4>
                        <ul className="space-y-2">
                          {job.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-muted-foreground">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Technologies */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Tecnologías</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm rounded-lg"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </NeoCard>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <NeoCard className="relative">
                    {/* Timeline indicator */}
                    <div className="absolute left-8 top-8 w-4 h-4 bg-green-500 rounded-full border-4 border-background shadow-neomorphic dark:shadow-neomorphic-dark" />
                    {index < education.length - 1 && (
                      <div className="absolute left-10 top-12 w-0.5 h-full bg-green-200 dark:bg-green-800" />
                    )}
                    
                    <div className="pl-16">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold text-foreground">
                            {edu.degree}
                          </h3>
                          <div className="flex items-center gap-2 text-green-600 font-semibold">
                            <GraduationCap className="w-4 h-4" />
                            {edu.institution}
                          </div>
                          <p className="text-muted-foreground">{edu.field}</p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 mt-4 lg:mt-0">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {formatDateRange(edu.startDate, edu.endDate)}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {edu.location}
                          </div>
                        </div>
                      </div>
                      
                      {/* Achievements */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Logros</h4>
                        <ul className="space-y-2">
                          {edu.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-muted-foreground">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </NeoCard>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <NeoCard className="max-w-2xl mx-auto">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground">
                  ¿Interesado en trabajar juntos?
                </h3>
                <p className="text-muted-foreground">
                  Estoy siempre abierto a nuevas oportunidades y desafíos. 
                  ¡Hablemos sobre cómo puedo contribuir a tu equipo!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <NeoButton size="lg">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver CV Completo
                  </NeoButton>
                  <NeoButton variant="outline" size="lg">
                    Contactar Ahora
                  </NeoButton>
                </div>
              </div>
            </NeoCard>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

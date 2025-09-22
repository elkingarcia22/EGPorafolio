'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Code, Palette, Wrench, Users, Star, TrendingUp } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { NeoCard } from '@/components/ui/neo-card'
import { NeoButton } from '@/components/ui/neo-button'

// Mock data - esto vendrá de Supabase
const skills = {
  design: [
    { name: 'Figma', level: 95, icon: '🎨' },
    { name: 'Adobe XD', level: 90, icon: '🎯' },
    { name: 'Sketch', level: 85, icon: '✏️' },
    { name: 'Adobe Creative Suite', level: 80, icon: '🎭' },
    { name: 'Principle', level: 75, icon: '⚡' },
    { name: 'Framer', level: 70, icon: '🚀' }
  ],
  development: [
    { name: 'HTML/CSS', level: 90, icon: '🌐' },
    { name: 'JavaScript', level: 85, icon: '⚡' },
    { name: 'React', level: 80, icon: '⚛️' },
    { name: 'TypeScript', level: 75, icon: '📘' },
    { name: 'Vue.js', level: 70, icon: '💚' },
    { name: 'React Native', level: 65, icon: '📱' }
  ],
  tools: [
    { name: 'Git', level: 85, icon: '🌿' },
    { name: 'Notion', level: 90, icon: '📝' },
    { name: 'Slack', level: 95, icon: '💬' },
    { name: 'Jira', level: 80, icon: '🎫' },
    { name: 'Zeplin', level: 85, icon: '🎨' },
    { name: 'InVision', level: 75, icon: '👁️' }
  ],
  soft: [
    { name: 'Liderazgo', level: 90, icon: '👑' },
    { name: 'Comunicación', level: 95, icon: '💬' },
    { name: 'Trabajo en Equipo', level: 90, icon: '🤝' },
    { name: 'Pensamiento Crítico', level: 85, icon: '🧠' },
    { name: 'Adaptabilidad', level: 90, icon: '🔄' },
    { name: 'Creatividad', level: 95, icon: '✨' }
  ]
}

const categories = [
  { id: 'design', name: 'Diseño', icon: Palette, color: 'from-pink-500 to-rose-500' },
  { id: 'development', name: 'Desarrollo', icon: Code, color: 'from-blue-500 to-cyan-500' },
  { id: 'tools', name: 'Herramientas', icon: Wrench, color: 'from-green-500 to-emerald-500' },
  { id: 'soft', name: 'Habilidades Blandas', icon: Users, color: 'from-purple-500 to-violet-500' }
]

const achievements = [
  {
    title: '5+ Años de Experiencia',
    description: 'Más de 5 años diseñando experiencias digitales',
    icon: Star,
    color: 'text-yellow-500'
  },
  {
    title: '50+ Proyectos Completados',
    description: 'Proyectos exitosos para clientes de todo el mundo',
    icon: TrendingUp,
    color: 'text-green-500'
  },
  {
    title: '100% Satisfacción del Cliente',
    description: 'Todos mis clientes han quedado satisfechos',
    icon: Star,
    color: 'blue-gradient-static'
  },
  {
    title: 'Certificaciones Profesionales',
    description: 'Google UX Design, IDF, y más certificaciones',
    icon: Star,
    color: 'text-purple-500'
  }
]

export default function SkillsPage() {
  const [activeCategory, setActiveCategory] = useState('design')

  const getSkillLevel = (level: number) => {
    if (level >= 90) return { label: 'Experto', color: 'bg-green-500' }
    if (level >= 75) return { label: 'Avanzado', color: 'blue-gradient-bg' }
    if (level >= 60) return { label: 'Intermedio', color: 'bg-yellow-500' }
    return { label: 'Básico', color: 'bg-gray-500' }
  }

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
              Mis <span className="text-gradient">Habilidades</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Un conjunto diverso de habilidades técnicas y blandas que me permiten 
              crear experiencias digitales excepcionales
            </p>
          </motion.div>

          {/* Achievements */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <NeoCard className="text-center">
                  <div className="space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${categories[0].color} flex items-center justify-center`}>
                      <achievement.icon className={`w-8 h-8 ${achievement.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-2">
                        {achievement.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </NeoCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Skills Categories */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {categories.map((category) => (
                <NeoButton
                  key={category.id}
                  variant={activeCategory === category.id ? 'primary' : 'ghost'}
                  onClick={() => setActiveCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <category.icon className="w-4 h-4" />
                  {category.name}
                </NeoButton>
              ))}
            </div>

            {/* Skills Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills[activeCategory as keyof typeof skills].map((skill, index) => {
                const levelInfo = getSkillLevel(skill.level)
                return (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <NeoCard className="group hover:scale-105 transition-transform duration-300">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{skill.icon}</span>
                            <h3 className="font-semibold text-foreground">
                              {skill.name}
                            </h3>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-lg text-white ${levelInfo.color}`}>
                            {levelInfo.label}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Nivel</span>
                            <span className="font-medium text-foreground">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <motion.div
                              className={`h-2 rounded-full ${levelInfo.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                        </div>
                      </div>
                    </NeoCard>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Process Section */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Mi Proceso de Trabajo
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Investigación',
                  description: 'Entiendo las necesidades del usuario y los objetivos del negocio',
                  icon: '🔍'
                },
                {
                  step: '02',
                  title: 'Ideación',
                  description: 'Genero ideas creativas y soluciones innovadoras',
                  icon: '💡'
                },
                {
                  step: '03',
                  title: 'Diseño',
                  description: 'Creo prototipos y diseños centrados en el usuario',
                  icon: '🎨'
                },
                {
                  step: '04',
                  title: 'Validación',
                  description: 'Pruebo y refino las soluciones con usuarios reales',
                  icon: '✅'
                }
              ].map((process, index) => (
                <motion.div
                  key={process.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                >
                  <NeoCard className="text-center h-full">
                    <div className="space-y-4">
                      <div className="text-4xl">{process.icon}</div>
                      <div className="text-2xl font-bold text-primary-600">
                        {process.step}
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">
                        {process.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {process.description}
                      </p>
                    </div>
                  </NeoCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <NeoCard className="max-w-2xl mx-auto">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">
                  ¿Listo para crear algo increíble juntos?
                </h3>
                <p className="text-muted-foreground">
                  Con mi experiencia en diseño UX/UI y desarrollo, puedo ayudarte a 
                  crear productos digitales que tus usuarios van a amar.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <NeoButton size="lg">
                    Ver Mis Proyectos
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

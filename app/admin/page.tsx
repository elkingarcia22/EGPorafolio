'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, User, Briefcase, GraduationCap, Code, Mail, FileText, Save, Eye, LogOut } from 'lucide-react'
import { NeoCard } from '@/components/ui/neo-card'
import { NeoButton } from '@/components/ui/neo-button'
import { NeoInput } from '@/components/ui/neo-input'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import toast from 'react-hot-toast'

const adminSections = [
  { id: 'profile', name: 'Perfil', icon: User },
  { id: 'projects', name: 'Proyectos', icon: Briefcase },
  { id: 'experience', name: 'Experiencia', icon: GraduationCap },
  { id: 'skills', name: 'Habilidades', icon: Code },
  { id: 'contact', name: 'Contacto', icon: Mail },
  { id: 'cv', name: 'CV', icon: FileText },
  { id: 'settings', name: 'Configuración', icon: Settings }
]

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('profile')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mock authentication - en producción esto vendrá de Supabase Auth
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsAuthenticated(true)
    setIsLoading(false)
    toast.success('Inicio de sesión exitoso')
  }

  const handleSave = () => {
    toast.success('Cambios guardados exitosamente')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    toast.success('Sesión cerrada')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <NeoCard className="max-w-md w-full mx-4">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Panel de Administración
              </h1>
              <p className="text-muted-foreground">
                Inicia sesión para gestionar tu portafolio
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <NeoInput
                label="Email"
                type="email"
                placeholder="admin@ejemplo.com"
                required
              />
              <NeoInput
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                required
              />
              <NeoButton
                type="submit"
                fullWidth
                loading={isLoading}
                size="lg"
              >
                Iniciar Sesión
              </NeoButton>
            </form>
          </NeoCard>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md shadow-neomorphic dark:shadow-neomorphic-dark sticky top-0 z-50">
        <div className="container-max section-padding">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">
                Panel de Administración
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <NeoButton
                variant="outline"
                size="sm"
                onClick={() => window.open('/', '_blank')}
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Sitio
              </NeoButton>
              <ThemeToggle />
              <NeoButton
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </NeoButton>
            </div>
          </div>
        </div>
      </header>

      <div className="container-max section-padding py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <NeoCard className="p-4">
              <nav className="space-y-2">
                {adminSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-primary-500 text-white shadow-neomorphic-inset dark:shadow-neomorphic-inset-dark'
                        : 'text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    {section.name}
                  </button>
                ))}
              </nav>
            </NeoCard>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <NeoCard className="p-8">
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Información del Perfil
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <NeoInput
                      label="Nombre Completo"
                      defaultValue="Elkin Mac"
                      placeholder="Tu nombre completo"
                    />
                    <NeoInput
                      label="Título Profesional"
                      defaultValue="Senior UX/UI Designer"
                      placeholder="Tu título profesional"
                    />
                    <NeoInput
                      label="Email"
                      type="email"
                      defaultValue="hello@ejemplo.com"
                      placeholder="tu@email.com"
                    />
                    <NeoInput
                      label="Teléfono"
                      defaultValue="+54 11 1234-5678"
                      placeholder="+54 11 1234-5678"
                    />
                    <NeoInput
                      label="Ubicación"
                      defaultValue="Buenos Aires, Argentina"
                      placeholder="Tu ubicación"
                    />
                    <NeoInput
                      label="LinkedIn"
                      defaultValue="linkedin.com/in/elkinmac"
                      placeholder="Tu perfil de LinkedIn"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Biografía
                    </label>
                    <textarea
                      className="neo-input w-full h-32 resize-none"
                      placeholder="Cuéntanos sobre ti..."
                      defaultValue="Diseñador UX/UI Senior con más de 5 años de experiencia creando experiencias digitales excepcionales. Especializado en diseño centrado en el usuario, investigación UX y desarrollo de productos digitales innovadores."
                    />
                  </div>
                </div>
              )}

              {/* Projects Section */}
              {activeSection === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground">
                      Gestión de Proyectos
                    </h2>
                    <NeoButton>
                      Agregar Proyecto
                    </NeoButton>
                  </div>
                  
                  <div className="space-y-4">
                    {[1, 2, 3].map((project) => (
                      <NeoCard key={project} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-foreground">
                            Proyecto {project}
                          </h3>
                          <div className="flex gap-2">
                            <NeoButton variant="outline" size="sm">
                              Editar
                            </NeoButton>
                            <NeoButton variant="ghost" size="sm">
                              Eliminar
                            </NeoButton>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <NeoInput
                            label="Título"
                            defaultValue={`Proyecto ${project}`}
                          />
                          <NeoInput
                            label="Categoría"
                            defaultValue="Web"
                          />
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Descripción
                          </label>
                          <textarea
                            className="neo-input w-full h-20 resize-none"
                            defaultValue="Descripción del proyecto..."
                          />
                        </div>
                      </NeoCard>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Section */}
              {activeSection === 'experience' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground">
                      Experiencia Laboral
                    </h2>
                    <NeoButton>
                      Agregar Experiencia
                    </NeoButton>
                  </div>
                  
                  <div className="space-y-4">
                    {[1, 2].map((exp) => (
                      <NeoCard key={exp} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-foreground">
                            Experiencia {exp}
                          </h3>
                          <div className="flex gap-2">
                            <NeoButton variant="outline" size="sm">
                              Editar
                            </NeoButton>
                            <NeoButton variant="ghost" size="sm">
                              Eliminar
                            </NeoButton>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <NeoInput
                            label="Empresa"
                            defaultValue="TechCorp Solutions"
                          />
                          <NeoInput
                            label="Posición"
                            defaultValue="Senior UX/UI Designer"
                          />
                          <NeoInput
                            label="Fecha de Inicio"
                            type="date"
                            defaultValue="2022-01-01"
                          />
                          <NeoInput
                            label="Fecha de Fin"
                            type="date"
                          />
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Descripción
                          </label>
                          <textarea
                            className="neo-input w-full h-24 resize-none"
                            defaultValue="Descripción de la experiencia laboral..."
                          />
                        </div>
                      </NeoCard>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Section */}
              {activeSection === 'skills' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    Gestión de Habilidades
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {['Diseño', 'Desarrollo', 'Herramientas', 'Habilidades Blandas'].map((category) => (
                      <NeoCard key={category} className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          {category}
                        </h3>
                        <div className="space-y-3">
                          {['Habilidad 1', 'Habilidad 2', 'Habilidad 3'].map((skill, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <NeoInput
                                defaultValue={skill}
                                className="flex-1"
                              />
                              <NeoButton variant="ghost" size="sm">
                                ×
                              </NeoButton>
                            </div>
                          ))}
                          <NeoButton variant="outline" size="sm" fullWidth>
                            Agregar Habilidad
                          </NeoButton>
                        </div>
                      </NeoCard>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Section */}
              {activeSection === 'contact' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    Configuración de Contacto
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <NeoInput
                      label="Email de Contacto"
                      defaultValue="hello@ejemplo.com"
                    />
                    <NeoInput
                      label="WhatsApp"
                      defaultValue="+54 11 1234-5678"
                    />
                    <NeoInput
                      label="LinkedIn"
                      defaultValue="linkedin.com/in/elkinmac"
                    />
                    <NeoInput
                      label="GitHub"
                      defaultValue="github.com/elkinmac"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Mensaje de Disponibilidad
                    </label>
                    <textarea
                      className="neo-input w-full h-24 resize-none"
                      defaultValue="Estoy siempre interesado en nuevos desafíos y oportunidades para crear experiencias extraordinarias. ¡Conversemos!"
                    />
                  </div>
                </div>
              )}

              {/* CV Section */}
              {activeSection === 'cv' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    Configuración del CV
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <NeoInput
                      label="URL del CV (PDF)"
                      defaultValue="/cv.pdf"
                    />
                    <NeoInput
                      label="Título del CV"
                      defaultValue="CV - Elkin Mac"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Resumen Profesional
                    </label>
                    <textarea
                      className="neo-input w-full h-32 resize-none"
                      defaultValue="Diseñador UX/UI Senior con más de 5 años de experiencia creando experiencias digitales excepcionales..."
                    />
                  </div>
                </div>
              )}

              {/* Settings Section */}
              {activeSection === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    Configuración General
                  </h2>
                  
                  <div className="space-y-4">
                    <NeoCard className="p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Configuración del Sitio
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <NeoInput
                          label="Título del Sitio"
                          defaultValue="Portfolio UX/UI Designer"
                        />
                        <NeoInput
                          label="Descripción"
                          defaultValue="Portfolio profesional de diseñador UX/UI"
                        />
                      </div>
                    </NeoCard>
                    
                    <NeoCard className="p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Configuración de SEO
                      </h3>
                      <div className="space-y-4">
                        <NeoInput
                          label="Meta Keywords"
                          defaultValue="UX, UI, Design, Portfolio, Neomorphism"
                        />
                        <NeoInput
                          label="Meta Description"
                          defaultValue="Portfolio profesional de diseñador UX/UI con estilo neomorfismo"
                        />
                      </div>
                    </NeoCard>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t border-border">
                <NeoButton onClick={handleSave} size="lg">
                  <Save className="w-5 h-5 mr-2" />
                  Guardar Cambios
                </NeoButton>
              </div>
            </NeoCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

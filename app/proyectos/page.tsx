'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, Eye, Filter, Search } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { NeoCard } from '@/components/ui/neo-card'
import { NeoButton } from '@/components/ui/neo-button'
import { NeoInput } from '@/components/ui/neo-input'
// import { useAdmin } from '@/contexts/admin-context'
import Image from 'next/image'


const categories = ['all', 'web', 'mobile', 'design']

export default function ProjectsPage() {
  // const { content } = useAdmin()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProject, setSelectedProject] = useState<any>(null)
  
  // Usar datos mock por ahora
  const projects = [
    {
      id: 1,
      title: 'E-commerce Mobile App',
      description: 'Aplicación móvil completa para e-commerce con diseño centrado en el usuario',
      longDescription: 'Desarrollé una aplicación móvil completa para e-commerce que incluye catálogo de productos, carrito de compras, sistema de pagos y seguimiento de pedidos. El diseño se enfoca en la experiencia del usuario con navegación intuitiva y procesos optimizados.',
      cover_image_url: '/api/placeholder/600/400',
      technologies: ['Figma', 'Adobe XD', 'React Native', 'Node.js'],
      project_url: '#',
      github_url: '#',
      behance_url: '#',
      featured: true,
      category: 'mobile'
    },
    {
      id: 2,
      title: 'Dashboard Analytics',
      description: 'Dashboard interactivo para análisis de datos empresariales',
      longDescription: 'Creé un dashboard completo para análisis de datos empresariales con visualizaciones interactivas, reportes en tiempo real y sistema de alertas. La interfaz permite a los usuarios explorar datos de manera intuitiva.',
      cover_image_url: '/api/placeholder/600/400',
      technologies: ['Figma', 'D3.js', 'React', 'TypeScript'],
      project_url: '#',
      github_url: '#',
      behance_url: '#',
      featured: true,
      category: 'web'
    }
  ]

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredProjects = projects.filter(project => project.featured)

  const handleAdminClick = () => {
    window.location.href = '/admin'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
      <Navbar onAdminClick={handleAdminClick} />
      
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
              Mis <span className="text-gradient">Proyectos</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Una selección de proyectos donde he aplicado diseño centrado en el usuario 
              y las mejores prácticas de UX/UI
            </p>
          </motion.div>

          {/* Featured Projects */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Proyectos Destacados
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <NeoCard 
                    className="group cursor-pointer overflow-hidden"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-xl mb-4 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <Eye className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map((tech: string) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-lg"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-lg">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </NeoCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* All Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              {/* Search */}
              <div className="flex-1">
                <NeoInput
                  placeholder="Buscar proyectos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex gap-2">
                {categories.map((category) => (
                  <NeoButton
                    key={category}
                    variant={selectedCategory === category ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {category === 'all' ? 'Todos' : category}
                  </NeoButton>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <NeoCard 
                      className="group cursor-pointer overflow-hidden"
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="relative h-40 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-xl mb-4 overflow-hidden">
                        {project.cover_image_url ? (
                          <Image
                            src={project.cover_image_url}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                              <Eye className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary-600 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {project.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 2).map((tech: string) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-lg"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-lg">
                              +{project.technologies.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </NeoCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            />
            
            <motion.div
              className="relative bg-background rounded-2xl shadow-neomorphic dark:shadow-neomorphic-dark max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl font-bold text-foreground">
                    {selectedProject.title}
                  </h2>
                  <NeoButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProject(null)}
                  >
                    ×
                  </NeoButton>
                </div>
                
                <div className="relative h-64 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-xl mb-6 overflow-hidden">
                  {selectedProject.cover_image_url ? (
                    <Image
                      src={selectedProject.cover_image_url}
                      alt={selectedProject.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 80vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Eye className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                
                <div className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedProject.longDescription}
                  </p>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-3">Tecnologías</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm rounded-lg"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    {selectedProject.project_url && selectedProject.project_url !== '#' && (
                      <NeoButton variant="primary" onClick={() => window.open(selectedProject.project_url, '_blank')}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver Proyecto
                      </NeoButton>
                    )}
                    {selectedProject.github_url && selectedProject.github_url !== '#' && (
                      <NeoButton variant="outline" onClick={() => window.open(selectedProject.github_url, '_blank')}>
                        <Github className="w-4 h-4 mr-2" />
                        Código
                      </NeoButton>
                    )}
                    {selectedProject.behance_url && selectedProject.behance_url !== '#' && (
                      <NeoButton variant="outline" onClick={() => window.open(selectedProject.behance_url, '_blank')}>
                        <Eye className="w-4 h-4 mr-2" />
                        Behance
                      </NeoButton>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

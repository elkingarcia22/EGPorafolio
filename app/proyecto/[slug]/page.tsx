'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import { useDesignTokens } from '@/hooks/useDesignTokens'
import { Navbar } from '@/components/navbar'
import { ProjectElementRenderer } from '@/components/project-elements/ProjectElementRenderer'

interface Project {
  id: string
  title: string
  slug: string
  description: string
  cover_image_url: string
  status: string
  featured: boolean
  client_name?: string
  project_type?: string
  duration?: string
  team_size?: number
  technologies?: string[]
  project_url?: string
  github_url?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string[]
  created_at: string
  updated_at: string
  published_at?: string
}

interface ProjectSection {
  id: string
  project_id: string
  title: string
  type: string
  content: any
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface ProjectElement {
  id: string
  section_id: string
  type: string
  content: any
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function ProjectPage() {
  const params = useParams()
  const slug = params.slug as string
  const designTokens = useDesignTokens()
  
  const [project, setProject] = useState<Project | null>(null)
  const [sections, setSections] = useState<ProjectSection[]>([])
  const [elements, setElements] = useState<ProjectElement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProject()
  }, [slug])

  const loadProject = async () => {
    try {
      setLoading(true)
      setError(null)

      // 1. Cargar el proyecto
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (projectError) {
        console.error('Error cargando proyecto:', projectError)
        setError('Proyecto no encontrado')
        return
      }

      setProject(projectData)

      // 2. Cargar las secciones del proyecto
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('project_sections')
        .select('*')
        .eq('project_id', projectData.id)
        .eq('is_active', true)
        .order('order_index')

      if (sectionsError) {
        console.error('Error cargando secciones:', sectionsError)
        setError('Error cargando secciones del proyecto')
        return
      }

      setSections(sectionsData || [])

      // 3. Cargar los elementos de todas las secciones
      if (sectionsData && sectionsData.length > 0) {
        const sectionIds = sectionsData.map(s => s.id)
        
        const { data: elementsData, error: elementsError } = await supabase
          .from('project_elements')
          .select('*')
          .in('section_id', sectionIds)
          .eq('is_active', true)
          .order('order_index')

        if (elementsError) {
          console.error('Error cargando elementos:', elementsError)
          setError('Error cargando elementos del proyecto')
          return
        }

        setElements(elementsData || [])
      }

    } catch (err) {
      console.error('Error general:', err)
      setError('Error cargando el proyecto')
    } finally {
      setLoading(false)
    }
  }

  const getElementsForSection = (sectionId: string) => {
    return elements.filter(element => element.section_id === sectionId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: designTokens.colors.primary.gradient}}></div>
            <p className="text-gray-600 dark:text-white">Cargando proyecto...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Proyecto no encontrado</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{error || 'El proyecto que buscas no existe o no está disponible.'}</p>
            <a 
              href="/" 
              className="inline-block px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg"
              style={{background: designTokens.colors.primary.gradient}}
            >
              Volver al inicio
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <Navbar />
      
      {/* Hero Section - Estilo Behance */}
      <section className="pt-24 pb-0 relative overflow-hidden">
        {/* Background con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-[#0a0a0a] dark:to-gray-800"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <a href="/" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Inicio</a>
              <span>/</span>
              <span className="text-gray-700 dark:text-gray-300">Proyectos</span>
              <span>/</span>
              <span className="font-medium" style={{color: designTokens.colors.primary.gradient}}>{project.title}</span>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Texto del Hero */}
            <div className="space-y-8">
              {/* Badge del tipo de proyecto */}
              {project.project_type && (
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white" style={{background: designTokens.colors.primary.gradient}}>
                  {project.project_type}
                </div>
              )}
              
              {/* Título principal */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-gray-900 dark:text-white">{project.title}</span>
              </h1>
              
              {/* Descripción */}
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
                {project.description}
              </p>
              
              {/* Metadatos en grid */}
              <div className="grid grid-cols-2 gap-6">
                {project.client_name && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Cliente</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{project.client_name}</p>
                  </div>
                )}
                {project.duration && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Duración</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{project.duration}</p>
                  </div>
                )}
                {project.team_size && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Equipo</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{project.team_size} personas</p>
                  </div>
                )}
                {project.project_type && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Categoría</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{project.project_type}</p>
                  </div>
                )}
              </div>
              
              {/* Botones de acción */}
              <div className="flex flex-wrap gap-4">
                {project.project_url && (
                  <a 
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105"
                    style={{background: designTokens.colors.primary.gradient}}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Ver Proyecto
                  </a>
                )}
                {project.github_url && (
                  <a 
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Ver Código
                  </a>
                )}
              </div>
            </div>
            
            {/* Imagen del Hero */}
            {project.cover_image_url && (
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img 
                    src={project.cover_image_url} 
                    alt={project.title}
                    className="w-full h-[500px] md:h-[600px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                {/* Elementos decorativos */}
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20" style={{background: designTokens.colors.primary.gradient}}></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-30" style={{background: designTokens.colors.primary.gradient}}></div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contenido del proyecto - Estilo Behance */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {sections.map((section, index) => {
            const sectionElements = getElementsForSection(section.id)
            const isEven = index % 2 === 0
            
            return (
              <div key={section.id} className={`mb-32 ${isEven ? '' : 'bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-12'}`}>
                {/* Título de la sección con estilo */}
                {section.title && (
                  <div className="mb-16">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-1 rounded-full mr-4" style={{background: designTokens.colors.primary.gradient}}></div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                      {section.title}
                    </h2>
                  </div>
                )}

                {/* Elementos de la sección con layout mejorado */}
                <div className="space-y-12">
                  {sectionElements.map((element, elementIndex) => (
                    <div key={element.id} className="relative">
                      {/* Número de elemento (opcional) */}
                      {elementIndex > 0 && (
                        <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                          {elementIndex}
                        </div>
                      )}
                      
                      <ProjectElementRenderer 
                        element={element} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Footer del proyecto - Estilo Behance */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tecnologías */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <div className="w-12 h-1 rounded-full mr-4" style={{background: designTokens.colors.primary.gradient}}></div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Tecnologías utilizadas
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {project.technologies.map((tech, index) => (
                  <div 
                    key={index}
                    className="group relative p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{background: designTokens.colors.primary.gradient}}>
                        {tech.charAt(0)}
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{tech}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              ¿Te gustó este proyecto?
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Si te interesa trabajar juntos o tienes alguna pregunta sobre este proyecto, no dudes en contactarme.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/#contacto"
                className="inline-flex items-center px-8 py-4 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105"
                style={{background: designTokens.colors.primary.gradient}}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contactar
              </a>
              
              <a 
                href="/"
                className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Ver más proyectos
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
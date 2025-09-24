'use client'

import { useState, useEffect, useCallback } from 'react'
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

  const loadProject = useCallback(async () => {
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
        .order('order_index')

      if (sectionsError) {
        console.error('Error cargando secciones:', sectionsError)
        setError('Error cargando secciones del proyecto')
        return
      }

      setSections(sectionsData || [])

      // 3. Cargar los elementos de todas las secciones (opcional)
      if (sectionsData && sectionsData.length > 0) {
        const sectionIds = sectionsData.map(s => s.id)
        
        const { data: elementsData, error: elementsError } = await supabase
          .from('project_elements')
          .select('*')
          .in('section_id', sectionIds)
          .order('order_index')

        if (elementsError) {
          console.log('⚠️ No se pudieron cargar elementos (opcional):', elementsError.message)
          // No es crítico, continuar sin elementos
        }

        setElements(elementsData || [])
      }

    } catch (err) {
      console.error('Error general:', err)
      setError('Error cargando el proyecto')
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    loadProject()
  }, [slug, loadProject])

  const getElementsForSection = (sectionId: string) => {
    return elements.filter(element => element.section_id === sectionId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
        <Navbar onAdminClick={() => {}} />
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
        <Navbar onAdminClick={() => {}} />
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
      <Navbar onAdminClick={() => {}} />
      
      {/* Hero Section - Estilo Behance Impactante */}
      <section className="pt-24 pb-0 relative overflow-hidden min-h-screen flex items-center">
        {/* Background dinámico con múltiples capas */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-[#0a0a0a] dark:to-gray-800"></div>
          <div className="absolute inset-0 opacity-30" style={{background: `radial-gradient(circle at 20% 80%, #16A2FF 0%, transparent 50%)`}}></div>
          <div className="absolute inset-0 opacity-20" style={{background: `radial-gradient(circle at 80% 20%, #35D07F 0%, transparent 50%)`}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Breadcrumb mejorado */}
          <nav className="mb-12">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <a href="/" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Inicio</a>
              <span>/</span>
              <span className="text-gray-700 dark:text-gray-300">Proyectos</span>
              <span>/</span>
              <span className="font-medium" style={{background: designTokens.colors.primary.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{project.title}</span>
            </div>
          </nav>

          {/* Hero Content - Layout de lado a lado impactante */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content - Lado izquierdo */}
            <div className="space-y-10">
              {/* Project Type Badge mejorado */}
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium shadow-lg" style={{background: designTokens.colors.primary.gradient, color: 'white'}}>
                <span className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></span>
                {project.project_type || 'Proyecto'}
              </div>

              {/* Main Title con efecto visual */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight text-gray-900 dark:text-white">
                <span className="block">{project.title}</span>
                <span className="block text-4xl md:text-5xl lg:text-6xl mt-4 opacity-60" style={{background: designTokens.colors.primary.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                  {project.project_type || 'UX/UI Design'}
                </span>
              </h1>

              {/* Description mejorada */}
              <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                {project.description}
              </p>
              
              {/* Project Metadata en grid mejorado */}
              <div className="grid grid-cols-2 gap-8 pt-12">
                <div className="group">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Cliente</h3>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white group-hover:scale-105 transition-transform">{project.client_name || 'Confidencial'}</p>
                </div>
                <div className="group">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Duración</h3>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white group-hover:scale-105 transition-transform">{project.duration || '3 meses'}</p>
                </div>
                <div className="group">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Equipo</h3>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white group-hover:scale-105 transition-transform">{project.team_size || '4 personas'}</p>
                </div>
                <div className="group">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Categoría</h3>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white group-hover:scale-105 transition-transform">{project.project_type || 'UX/UI Design'}</p>
                </div>
              </div>
              
              {/* Action Buttons mejorados */}
              <div className="flex flex-wrap gap-6 pt-12">
                <button className="px-10 py-5 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl text-lg" style={{background: designTokens.colors.primary.gradient}}>
                  Ver Proyecto Completo
                </button>
                <button className="px-10 py-5 rounded-2xl font-semibold border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 hover:scale-105 text-lg">
                  Ver Código
                </button>
              </div>
            </div>

            {/* Hero Image - Lado derecho con múltiples imágenes */}
            <div className="relative">
              {/* Imagen principal */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700">
                <img 
                  src={project.cover_image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'} 
                  alt={project.title}
                  className="w-full h-[600px] md:h-[700px] object-cover"
                />
                {/* Gradient Overlay mejorado */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20"></div>
              </div>
              
              {/* Imágenes secundarias flotantes */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-2xl overflow-hidden shadow-xl transform rotate-12 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop" 
                  alt="Wireframes"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-2xl overflow-hidden shadow-xl transform -rotate-12 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop" 
                  alt="Prototipo"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Elementos decorativos mejorados */}
              <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full opacity-20 animate-pulse" style={{background: designTokens.colors.primary.gradient}}></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full opacity-30 animate-pulse" style={{background: designTokens.colors.primary.gradient}}></div>
              <div className="absolute top-1/2 -right-12 w-16 h-16 rounded-full opacity-25 animate-bounce" style={{background: designTokens.colors.primary.gradient}}></div>
            </div>
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
                  {sectionElements.length > 0 ? (
                    sectionElements.map((element, elementIndex) => (
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
                    ))
                  ) : (
                    /* Contenido por defecto cuando no hay elementos - Con imágenes dinámicas */
                    <div className="space-y-12">
                      {/* Texto principal */}
                      <div className="prose prose-lg max-w-none dark:prose-invert">
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                          Contenido de la sección <strong>{section.title}</strong>. Este es un texto de ejemplo que demuestra cómo se ve el contenido en la página del proyecto. El diseño estilo Behance permite mostrar información de manera clara y atractiva.
                        </p>
                        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                          Aquí se puede agregar más información detallada sobre esta sección del proyecto, incluyendo descripciones, resultados, procesos, o cualquier otro contenido relevante.
                        </p>
                      </div>

                      {/* Galería de imágenes dinámica */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Imagen principal de la sección */}
                        <div className="md:col-span-2 lg:col-span-2">
                          <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                            <img 
                              src={`https://images.unsplash.com/photo-${1556742049 + index * 100}?w=800&h=500&fit=crop`}
                              alt={`${section.title} - Imagen principal`}
                              className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        </div>

                        {/* Imagen secundaria */}
                        <div className="md:col-span-1 lg:col-span-1">
                          <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                            <img 
                              src={`https://images.unsplash.com/photo-${1460925895 + index * 50}?w=400&h=400&fit=crop`}
                              alt={`${section.title} - Detalle`}
                              className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        </div>

                        {/* Imagen adicional */}
                        <div className="md:col-span-1 lg:col-span-1">
                          <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                            <img 
                              src={`https://images.unsplash.com/photo-${1551650975 + index * 75}?w=400&h=400&fit=crop`}
                              alt={`${section.title} - Proceso`}
                              className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        </div>

                        {/* Imagen de proceso */}
                        <div className="md:col-span-2 lg:col-span-1">
                          <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                            <img 
                              src={`https://images.unsplash.com/photo-${1551650975 + index * 25}?w=400&h=300&fit=crop`}
                              alt={`${section.title} - Resultado`}
                              className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        </div>
                      </div>

                      {/* Estadísticas o métricas */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                        <div className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                          <div className="text-3xl font-bold mb-2" style={{background: designTokens.colors.primary.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                            {85 + index * 5}%
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Satisfacción</div>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                          <div className="text-3xl font-bold mb-2" style={{background: designTokens.colors.primary.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                            {index + 1}5
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Días</div>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                          <div className="text-3xl font-bold mb-2" style={{background: designTokens.colors.primary.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                            {3 + index}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Iteraciones</div>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                          <div className="text-3xl font-bold mb-2" style={{background: designTokens.colors.primary.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                            {index + 1}00%
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Éxito</div>
                        </div>
                      </div>
                    </div>
                  )}
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
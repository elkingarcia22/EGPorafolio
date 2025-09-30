'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import { useDesignTokens } from '@/hooks/useDesignTokens'
import { MinimalVisibleNavbar } from '@/components/minimal-visible-navbar'
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
      <div className="min-h-screen bg-white dark:bg-dark-surface-variant transition-colors duration-300">
        <MinimalVisibleNavbar onAdminClick={() => {}} />
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
      <div className="min-h-screen bg-white dark:bg-dark-surface-variant transition-colors duration-300">
        <MinimalVisibleNavbar onAdminClick={() => {}} />
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
    <div className="min-h-screen bg-white dark:bg-dark-surface transition-colors duration-300">
      <MinimalVisibleNavbar onAdminClick={() => {}} />
      
      {/* Hero Section - Solo Banner de Imagen */}
      <section className="pt-24 pb-0 relative overflow-hidden">
        {/* Background con imagen de banner */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1920&h=1080&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-white/80">
              <a href="/" className="hover:text-white transition-colors">Inicio</a>
              <span>/</span>
              <span className="text-white/60">Proyectos</span>
              <span>/</span>
              <span className="font-medium text-white">{project.title}</span>
            </div>
          </nav>

          {/* Solo el título del proyecto en el banner */}
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight text-white mb-8">
              {project.title}
            </h1>
            <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium shadow-lg bg-white/20 backdrop-blur-sm border border-white/30">
              <span className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></span>
              <span className="text-white">{project.project_type || 'Proyecto'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Información del Proyecto */}
      <section className="py-24 bg-white dark:bg-dark-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Información del proyecto */}
            <div className="space-y-8">
              {/* Descripción */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Sobre el Proyecto
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  {project.description}
                </p>
              </div>
              
              {/* Metadatos del proyecto */}
              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Cliente</h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white group-hover:scale-105 transition-transform">{project.client_name || 'Confidencial'}</p>
                </div>
                <div className="group">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Duración</h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white group-hover:scale-105 transition-transform">{project.duration || '3 meses'}</p>
                </div>
                <div className="group">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Equipo</h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white group-hover:scale-105 transition-transform">{project.team_size || '4 personas'}</p>
                </div>
                <div className="group">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Categoría</h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white group-hover:scale-105 transition-transform">{project.project_type || 'UX/UI Design'}</p>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="flex flex-wrap gap-6 pt-8">
                <button className="px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl" style={{background: designTokens.colors.primary.gradient}}>
                  Ver Proyecto Completo
                </button>
                <button className="px-8 py-4 rounded-xl font-semibold border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 hover:scale-105">
                  Ver Código
                </button>
              </div>
            </div>

            {/* Imagen del proyecto */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={project.cover_image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'} 
                  alt={project.title}
                  className="w-full h-[500px] md:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Elementos decorativos */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 animate-pulse" style={{background: designTokens.colors.primary.gradient}}></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-30 animate-pulse" style={{background: designTokens.colors.primary.gradient}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido del proyecto - Estilo Behance */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {sections.map((section, index) => {
            const sectionElements = getElementsForSection(section.id)
            
            // Diferentes layouts para cada sección
            const getSectionLayout = (index: number) => {
              switch (index % 4) {
                case 0: return 'hero' // Layout hero con imagen grande
                case 1: return 'split' // Layout dividido en dos columnas
                case 2: return 'masonry' // Layout tipo masonry
                case 3: return 'centered' // Layout centrado
                default: return 'hero'
              }
            }
            
            const layout = getSectionLayout(index)
            
            return (
              <div key={section.id} className={`mb-32 ${index % 2 === 1 ? 'bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-12' : ''}`}>
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

                {/* Contenido con diferentes layouts */}
                {sectionElements.length > 0 ? (
                  <div className="space-y-12">
                    {sectionElements.map((element, elementIndex) => (
                      <div key={element.id} className="relative">
                        <ProjectElementRenderer element={element} />
                      </div>
                    ))}
                  </div>
                ) : (
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

                    {/* Layouts diferentes según el índice */}
                    {layout === 'hero' && (
                      /* Layout Hero - Imagen grande centrada */
                      <div className="space-y-8">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                          <img 
                            src={`https://images.unsplash.com/photo-${1556742049 + index * 100}?w=1200&h=600&fit=crop`}
                            alt={`${section.title} - Hero`}
                            className="w-full h-[500px] object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          {[1,2,3,4].map((i) => (
                            <div key={i} className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                              <div className="text-2xl font-bold mb-2" style={{background: designTokens.colors.primary.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                                {85 + i * 5}%
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Métrica {i}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {layout === 'split' && (
                      /* Layout Split - Dos columnas */
                      <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                          <div className="relative rounded-2xl overflow-hidden shadow-xl">
                            <img 
                              src={`https://images.unsplash.com/photo-${1460925895 + index * 50}?w=600&h=400&fit=crop`}
                              alt={`${section.title} - Split 1`}
                              className="w-full h-[300px] object-cover"
                            />
                          </div>
                          <div className="relative rounded-2xl overflow-hidden shadow-xl">
                            <img 
                              src={`https://images.unsplash.com/photo-${1551650975 + index * 75}?w=600&h=300&fit=crop`}
                              alt={`${section.title} - Split 2`}
                              className="w-full h-[250px] object-cover"
                            />
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div className="relative rounded-2xl overflow-hidden shadow-xl">
                            <img 
                              src={`https://images.unsplash.com/photo-${1551650975 + index * 25}?w=600&h=400&fit=crop`}
                              alt={`${section.title} - Split 3`}
                              className="w-full h-[400px] object-cover"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                              <div className="text-xl font-bold" style={{background: designTokens.colors.primary.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                                {90 + index * 2}%
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Éxito</div>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                              <div className="text-xl font-bold" style={{background: designTokens.colors.primary.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                                {index + 1}5
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Días</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {layout === 'masonry' && (
                      /* Layout Masonry - Grid irregular */
                      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        <div className="break-inside-avoid">
                          <div className="relative rounded-2xl overflow-hidden shadow-xl mb-8">
                            <img 
                              src={`https://images.unsplash.com/photo-${1556742049 + index * 100}?w=400&h=600&fit=crop`}
                              alt={`${section.title} - Masonry 1`}
                              className="w-full h-[400px] object-cover"
                            />
                          </div>
                        </div>
                        <div className="break-inside-avoid">
                          <div className="relative rounded-2xl overflow-hidden shadow-xl mb-8">
                            <img 
                              src={`https://images.unsplash.com/photo-${1460925895 + index * 50}?w=400&h=300&fit=crop`}
                              alt={`${section.title} - Masonry 2`}
                              className="w-full h-[250px] object-cover"
                            />
                          </div>
                        </div>
                        <div className="break-inside-avoid">
                          <div className="relative rounded-2xl overflow-hidden shadow-xl mb-8">
                            <img 
                              src={`https://images.unsplash.com/photo-${1551650975 + index * 75}?w=400&h=500&fit=crop`}
                              alt={`${section.title} - Masonry 3`}
                              className="w-full h-[350px] object-cover"
                            />
                          </div>
                        </div>
                        <div className="break-inside-avoid">
                          <div className="relative rounded-2xl overflow-hidden shadow-xl mb-8">
                            <img 
                              src={`https://images.unsplash.com/photo-${1551650975 + index * 25}?w=400&h=400&fit=crop`}
                              alt={`${section.title} - Masonry 4`}
                              className="w-full h-[300px] object-cover"
                            />
                          </div>
                        </div>
                        <div className="break-inside-avoid">
                          <div className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 mb-8">
                            <div className="text-3xl font-bold mb-2" style={{background: designTokens.colors.primary.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                              {95 + index}%
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Satisfacción</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {layout === 'centered' && (
                      /* Layout Centered - Contenido centrado */
                      <div className="max-w-4xl mx-auto text-center space-y-12">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl mx-auto max-w-2xl">
                          <img 
                            src={`https://images.unsplash.com/photo-${1556742049 + index * 100}?w=800&h=500&fit=crop`}
                            alt={`${section.title} - Centered`}
                            className="w-full h-[400px] object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-8">
                          <div className="text-center">
                            <div className="text-4xl font-bold mb-2" style={{background: designTokens.colors.primary.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                              {85 + index * 5}%
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Satisfacción</div>
                          </div>
                          <div className="text-center">
                            <div className="text-4xl font-bold mb-2" style={{background: designTokens.colors.primary.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                              {index + 1}5
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Días</div>
                          </div>
                          <div className="text-center">
                            <div className="text-4xl font-bold mb-2" style={{background: designTokens.colors.primary.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                              {3 + index}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Iteraciones</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Proceso de Desarrollo */}
      <section className="py-24 bg-white dark:bg-dark-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-1 rounded-full mr-4" style={{background: designTokens.colors.primary.gradient}}></div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Proceso de Desarrollo
              </h3>
              <div className="w-12 h-1 rounded-full ml-4" style={{background: designTokens.colors.primary.gradient}}></div>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Un vistazo al flujo de trabajo y metodología utilizada para crear este proyecto
            </p>
          </div>

          {/* Flujo de Proceso */}
          <div className="relative">
            {/* Línea conectora */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 transform -translate-y-1/2 hidden lg:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Paso 1: Investigación */}
              <div className="relative">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl" style={{background: designTokens.colors.primary.gradient}}>
                    1
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full" style={{background: designTokens.colors.primary.gradient}}></div>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Investigación</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Análisis del mercado, usuarios y competencia para definir la estrategia del proyecto
                  </p>
                </div>
              </div>

              {/* Paso 2: Diseño */}
              <div className="relative">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl" style={{background: designTokens.colors.primary.gradient}}>
                    2
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full" style={{background: designTokens.colors.primary.gradient}}></div>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Diseño</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Creación de wireframes, prototipos y diseño visual basado en los hallazgos de la investigación
                  </p>
                </div>
              </div>

              {/* Paso 3: Desarrollo */}
              <div className="relative">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl" style={{background: designTokens.colors.primary.gradient}}>
                    3
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full" style={{background: designTokens.colors.primary.gradient}}></div>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Desarrollo</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Implementación del diseño con las mejores prácticas y tecnologías modernas
                  </p>
                </div>
              </div>

              {/* Paso 4: Testing */}
              <div className="relative">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl" style={{background: designTokens.colors.primary.gradient}}>
                    4
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full" style={{background: designTokens.colors.primary.gradient}}></div>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Testing</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Pruebas de usabilidad, rendimiento y calidad para asegurar la mejor experiencia
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Métricas del Proceso */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
              <div className="text-3xl font-bold mb-2" style={{background: designTokens.colors.primary.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                15
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Días de investigación</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
              <div className="text-3xl font-bold mb-2" style={{background: designTokens.colors.primary.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                8
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Iteraciones de diseño</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
              <div className="text-3xl font-bold mb-2" style={{background: designTokens.colors.primary.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                30
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Días de desarrollo</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
              <div className="text-3xl font-bold mb-2" style={{background: designTokens.colors.primary.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                95%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Satisfacción del cliente</div>
            </div>
          </div>
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
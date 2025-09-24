'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import { useDesignTokens } from '@/hooks/useDesignTokens'
import { useLanguage } from '@/contexts/language-context'
import { ProjectElementRenderer } from '@/components/project-elements/ProjectElementRenderer'
import { Navbar } from '@/components/navbar'
import { MinimalMenu } from '@/components/minimal-menu'
import { LanguageToggle } from '@/components/language-toggle'
import { AccessibilityToolbar } from '@/components/accessibility-toolbar'
import { ThemeProvider } from '@/components/theme-provider'
import { NotificationProvider } from '@/components/ui/notification-system'
import Image from 'next/image'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  slug: string
  description: string
  cover_image_url: string
  status: string
  featured: boolean
  client_name: string
  project_type: string
  duration: string
  team_size: number
  technologies: string[]
  project_url: string
  github_url: string
  meta_title: string
  meta_description: string
  meta_keywords: string[]
  created_at: string
  updated_at: string
  published_at: string
}

interface ProjectSection {
  id: string
  project_id: string
  section_type: string
  title: string
  order_index: number
  width: string
  alignment: string
  background_color: string
  text_color: string
  padding_top: number
  padding_bottom: number
  margin_top: number
  margin_bottom: number
  is_visible: boolean
  elements: ProjectElement[]
}

interface ProjectElement {
  id: string
  section_id: string
  element_type: string
  content: any
  order_index: number
  width: string
  alignment: string
  styling: any
  is_visible: boolean
}

export default function ProjectPage() {
  const params = useParams()
  const slug = params.slug as string
  const [project, setProject] = useState<Project | null>(null)
  const [sections, setSections] = useState<ProjectSection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const designTokens = useDesignTokens()
  const { t } = useLanguage()

  useEffect(() => {
    loadProject()
  }, [slug])

  const loadProject = async () => {
    try {
      setLoading(true)
      setError(null)

      // Cargar proyecto
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (projectError) {
        throw new Error('Proyecto no encontrado')
      }

      setProject(projectData)

      // Cargar secciones del proyecto
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('project_sections')
        .select(`
          *,
          elements:project_elements(*)
        `)
        .eq('project_id', projectData.id)
        .eq('is_visible', true)
        .order('order_index')

      if (sectionsError) {
        throw new Error('Error cargando secciones')
      }

      // Ordenar elementos dentro de cada sección
      const sectionsWithOrderedElements = sectionsData.map(section => ({
        ...section,
        elements: section.elements
          .filter((element: ProjectElement) => element.is_visible)
          .sort((a: ProjectElement, b: ProjectElement) => a.order_index - b.order_index)
      }))

      setSections(sectionsWithOrderedElements)

    } catch (err) {
      console.error('Error cargando proyecto:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ThemeProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Cargando proyecto...</p>
              </div>
            </div>
          </div>
        </NotificationProvider>
      </ThemeProvider>
    )
  }

  if (error || !project) {
    return (
      <ThemeProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Proyecto no encontrado
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  {error || 'El proyecto que buscas no existe o no está disponible.'}
                </p>
                <Link 
                  href="/"
                  className="inline-flex items-center px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105"
                  style={{ background: designTokens.colors.primary.gradient }}
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </NotificationProvider>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          {/* Navbar */}
          <Navbar />
          
          {/* Menu lateral */}
          <MinimalMenu />
          
          {/* Controles */}
          <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            <LanguageToggle />
            <AccessibilityToolbar />
          </div>

          {/* Hero Section */}
          <section className="relative pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                  style={{
                    background: designTokens.colors.primary.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {project.title}
                </h1>
                
                {project.description && (
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                    {project.description}
                  </p>
                )}

                {/* Metadatos del proyecto */}
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  {project.client_name && (
                    <div className="flex items-center">
                      <span className="font-medium">Cliente:</span>
                      <span className="ml-1">{project.client_name}</span>
                    </div>
                  )}
                  {project.project_type && (
                    <div className="flex items-center">
                      <span className="font-medium">Tipo:</span>
                      <span className="ml-1">{project.project_type}</span>
                    </div>
                  )}
                  {project.duration && (
                    <div className="flex items-center">
                      <span className="font-medium">Duración:</span>
                      <span className="ml-1">{project.duration}</span>
                    </div>
                  )}
                  {project.team_size && (
                    <div className="flex items-center">
                      <span className="font-medium">Equipo:</span>
                      <span className="ml-1">{project.team_size} personas</span>
                    </div>
                  )}
                </div>

                {/* Tecnologías */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Enlaces del proyecto */}
                <div className="flex justify-center gap-4 mt-8">
                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105"
                      style={{ background: designTokens.colors.primary.gradient }}
                    >
                      Ver proyecto
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                    >
                      Ver código
                    </a>
                  )}
                </div>
              </div>

              {/* Imagen de portada */}
              {project.cover_image_url && (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={project.cover_image_url}
                    alt={project.title}
                    width={1200}
                    height={600}
                    className="w-full h-auto"
                    priority
                  />
                  <div 
                    className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-300"
                    style={{ background: designTokens.colors.primary.gradient }}
                  />
                </div>
              )}
            </div>
          </section>

          {/* Secciones del proyecto */}
          {sections.map((section) => (
            <section
              key={section.id}
              className="py-16"
              style={{
                backgroundColor: section.background_color || 'transparent',
                color: section.text_color || 'inherit',
                paddingTop: `${section.padding_top}px`,
                paddingBottom: `${section.padding_bottom}px`,
                marginTop: `${section.margin_top}px`,
                marginBottom: `${section.margin_bottom}px`
              }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Título de la sección */}
                {section.title && (
                  <div className="text-center mb-12">
                    <h2 
                      className="text-3xl md:text-4xl font-bold"
                      style={{
                        background: designTokens.colors.primary.gradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                    >
                      {section.title}
                    </h2>
                  </div>
                )}

                {/* Elementos de la sección */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {section.elements.map((element) => (
                    <ProjectElementRenderer
                      key={element.id}
                      element={element}
                    />
                  ))}
                </div>
              </div>
            </section>
          ))}

          {/* Footer */}
          <footer className="py-12 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Link 
                href="/"
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al portafolio
              </Link>
            </div>
          </footer>
        </div>
      </NotificationProvider>
    </ThemeProvider>
  )
}

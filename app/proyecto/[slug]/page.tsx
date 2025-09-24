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
      
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {project.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              {project.description}
            </p>
            
            {/* Metadatos del proyecto */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              {project.client_name && (
                <div>
                  <span className="font-medium">Cliente:</span> {project.client_name}
                </div>
              )}
              {project.project_type && (
                <div>
                  <span className="font-medium">Tipo:</span> {project.project_type}
                </div>
              )}
              {project.duration && (
                <div>
                  <span className="font-medium">Duración:</span> {project.duration}
                </div>
              )}
              {project.team_size && (
                <div>
                  <span className="font-medium">Equipo:</span> {project.team_size} personas
                </div>
              )}
            </div>
          </div>

          {/* Imagen de portada */}
          {project.cover_image_url && (
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={project.cover_image_url} 
                alt={project.title}
                className="w-full h-[400px] md:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          )}
        </div>
      </section>

      {/* Contenido del proyecto */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {sections.map((section) => {
            const sectionElements = getElementsForSection(section.id)
            
            return (
              <div key={section.id} className="mb-16">
                {/* Título de la sección */}
                {section.title && (
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    {section.title}
                  </h2>
                )}

                {/* Elementos de la sección */}
                <div className="space-y-8">
                  {sectionElements.map((element) => (
                    <ProjectElementRenderer 
                      key={element.id} 
                      element={element} 
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Footer del proyecto */}
      <section className="py-16 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Tecnologías */}
            {project.technologies && project.technologies.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Tecnologías utilizadas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{background: designTokens.colors.primary.gradient}}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Enlaces del proyecto */}
            <div className="flex gap-4">
              {project.project_url && (
                <a 
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg"
                  style={{background: designTokens.colors.primary.gradient}}
                >
                  Ver proyecto
                </a>
              )}
              {project.github_url && (
                <a 
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Ver código
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
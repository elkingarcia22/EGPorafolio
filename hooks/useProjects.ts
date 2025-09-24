'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase-client'
import { useLanguage } from '@/contexts/language-context'

interface Project {
  id: string
  title: string
  title_es?: string
  title_en?: string
  slug: string
  description: string
  description_es?: string
  description_en?: string
  cover_image_url: string
  status: string
  featured: boolean
  order_index: number
  language?: string
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { language } = useLanguage()

  useEffect(() => {
    loadProjects()
  }, [language])

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('order_index')
        .limit(4) // Solo los primeros 4 para las cards del home

      if (projectsError) {
        throw new Error(projectsError.message)
      }

      // Procesar los datos para usar el idioma correcto
      const processedProjects = (data || []).map(project => ({
        ...project,
        title: language === 'en' && project.title_en ? project.title_en : (project.title_es || project.title),
        description: language === 'en' && project.description_en ? project.description_en : (project.description_es || project.description)
      }))

      setProjects(processedProjects)
    } catch (err) {
      console.error('Error cargando proyectos:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return {
    projects,
    loading,
    error,
    refreshProjects: loadProjects
  }
}

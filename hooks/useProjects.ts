'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase-client'

interface Project {
  id: string
  title: string
  slug: string
  description: string
  cover_image_url: string
  status: string
  featured: boolean
  order_index: number
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProjects()
  }, [])

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

      setProjects(data || [])
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

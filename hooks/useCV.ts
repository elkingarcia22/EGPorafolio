import { useState, useEffect } from 'react'
import { useSupabase } from './useSupabase'

export interface CVDocument {
  id: string
  title: string
  description: string | null
  file_url: string
  file_name: string
  file_size: number | null
  file_type: string
  is_active: boolean
  language: string
  version: string
  created_at: string
  updated_at: string
  created_by: string | null
  metadata: Record<string, any>
}

export const useCV = () => {
  const [cvDocuments, setCvDocuments] = useState<CVDocument[]>([])
  const [activeCV, setActiveCV] = useState<CVDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = useSupabase()

  // Cargar todos los CVs activos
  const fetchCVDocuments = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('cv_documents')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      setCvDocuments(data || [])
      
      // Establecer el primer CV como activo por defecto
      if (data && data.length > 0) {
        setActiveCV(data[0])
      }
    } catch (err) {
      console.error('Error cargando CVs:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  // Cargar CV por ID
  const fetchCVById = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('cv_documents')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (fetchError) {
        throw fetchError
      }

      setActiveCV(data)
      return data
    } catch (err) {
      console.error('Error cargando CV:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Crear nuevo CV (solo admin)
  const createCV = async (cvData: Omit<CVDocument, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null)

      const { data, error: insertError } = await supabase
        .from('cv_documents')
        .insert([cvData])
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      // Actualizar la lista de CVs
      await fetchCVDocuments()
      return data
    } catch (err) {
      console.error('Error creando CV:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return null
    }
  }

  // Actualizar CV (solo admin)
  const updateCV = async (id: string, updates: Partial<CVDocument>) => {
    try {
      setError(null)

      const { data, error: updateError } = await supabase
        .from('cv_documents')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      // Actualizar la lista de CVs
      await fetchCVDocuments()
      return data
    } catch (err) {
      console.error('Error actualizando CV:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return null
    }
  }

  // Eliminar CV (solo admin)
  const deleteCV = async (id: string) => {
    try {
      setError(null)

      const { error: deleteError } = await supabase
        .from('cv_documents')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

      // Actualizar la lista de CVs
      await fetchCVDocuments()
      return true
    } catch (err) {
      console.error('Error eliminando CV:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return false
    }
  }

  // Descargar CV
  const downloadCV = async (cv: CVDocument) => {
    try {
      const link = document.createElement('a')
      link.href = cv.file_url
      link.download = cv.file_name
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Error descargando CV:', err)
      setError('Error al descargar el archivo')
    }
  }

  // Compartir CV
  const shareCV = async (cv: CVDocument) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: cv.title,
          text: cv.description || '',
          url: window.location.origin + '/cv'
        })
      } else {
        // Fallback: copiar URL al portapapeles
        await navigator.clipboard.writeText(window.location.origin + '/cv')
        alert('URL copiada al portapapeles')
      }
    } catch (err) {
      console.error('Error compartiendo CV:', err)
      setError('Error al compartir el CV')
    }
  }

  // Cargar CVs al montar el componente
  useEffect(() => {
    fetchCVDocuments()
  }, [])

  return {
    cvDocuments,
    activeCV,
    loading,
    error,
    fetchCVDocuments,
    fetchCVById,
    createCV,
    updateCV,
    deleteCV,
    downloadCV,
    shareCV,
    setActiveCV
  }
}

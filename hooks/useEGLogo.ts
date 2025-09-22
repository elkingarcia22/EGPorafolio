'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface EGLogoImage {
  id: string
  name: string
  description: string | null
  image_url: string
  image_alt: string | null
  position: string
  size: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export const useEGLogo = (position: string = 'left') => {
  const [image, setImage] = useState<EGLogoImage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchEGLogo = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('eg_logo_images')
          .select('*')
          .eq('position', position)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (fetchError) {
          throw fetchError
        }

        setImage(data)
      } catch (err) {
        console.error('Error fetching EG logo:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchEGLogo()
  }, [position, supabase])

  return { image, loading, error }
}

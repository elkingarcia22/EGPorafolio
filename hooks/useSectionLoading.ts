'use client'

import { useState, useEffect } from 'react'

interface SectionLoadingState {
  home: boolean
  about: boolean
  contact: boolean
}

export const useSectionLoading = () => {
  const [loading, setLoading] = useState<SectionLoadingState>({
    home: true,
    about: true,
    contact: true
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Simular tiempos de carga diferentes para cada sección
    const timeouts = {
      home: setTimeout(() => {
        setLoading(prev => ({ ...prev, home: false }))
      }, 500), // Home carga rápido
      
      about: setTimeout(() => {
        setLoading(prev => ({ ...prev, about: false }))
      }, 800), // About tarda un poco más
      
      contact: setTimeout(() => {
        setLoading(prev => ({ ...prev, contact: false }))
      }, 600) // Contact carga rápido
    }

    return () => {
      Object.values(timeouts).forEach(clearTimeout)
    }
  }, [])

  const markSectionLoaded = (section: keyof SectionLoadingState) => {
    setLoading(prev => ({ ...prev, [section]: false }))
  }

  const isAnySectionLoading = Object.values(loading).some(Boolean)

  return {
    loading,
    mounted,
    markSectionLoaded,
    isAnySectionLoading
  }
}

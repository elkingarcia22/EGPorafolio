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
    
    // Verificar si las secciones ya se cargaron previamente en esta sesión
    const loadedSections = sessionStorage.getItem('loadedSections')
    if (loadedSections) {
      try {
        const parsed = JSON.parse(loadedSections)
        setLoading(parsed)
        return // Si ya están cargadas, no ejecutar los timeouts
      } catch (error) {
        console.warn('Error parsing loadedSections from sessionStorage:', error)
      }
    }
    
    // Simular tiempos de carga diferentes para cada sección solo si no se han cargado antes
    const timeouts = {
      home: setTimeout(() => {
        setLoading(prev => {
          const newState = { ...prev, home: false }
          // Guardar en sessionStorage que home ya se cargó
          const currentLoaded = sessionStorage.getItem('loadedSections')
          const loaded = currentLoaded ? JSON.parse(currentLoaded) : { home: true, about: true, contact: true }
          loaded.home = false
          sessionStorage.setItem('loadedSections', JSON.stringify(loaded))
          return newState
        })
      }, 500), // Home carga rápido
      
      about: setTimeout(() => {
        setLoading(prev => {
          const newState = { ...prev, about: false }
          // Guardar en sessionStorage que about ya se cargó
          const currentLoaded = sessionStorage.getItem('loadedSections')
          const loaded = currentLoaded ? JSON.parse(currentLoaded) : { home: true, about: true, contact: true }
          loaded.about = false
          sessionStorage.setItem('loadedSections', JSON.stringify(loaded))
          return newState
        })
      }, 800), // About tarda un poco más
      
      contact: setTimeout(() => {
        setLoading(prev => {
          const newState = { ...prev, contact: false }
          // Guardar en sessionStorage que contact ya se cargó
          const currentLoaded = sessionStorage.getItem('loadedSections')
          const loaded = currentLoaded ? JSON.parse(currentLoaded) : { home: true, about: true, contact: true }
          loaded.contact = false
          sessionStorage.setItem('loadedSections', JSON.stringify(loaded))
          return newState
        })
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

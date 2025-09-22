'use client'

import { useState, useEffect } from 'react'

export interface AccessibilitySettings {
  fontSize: number
  highContrast: boolean
  reducedMotion: boolean
  screenReader: boolean
  language: string
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 16,
  highContrast: false,
  reducedMotion: false,
  screenReader: false,
  language: 'es'
}

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const [mounted, setMounted] = useState(false)

  // Cargar configuraciones desde localStorage al montar
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error('Error parsing accessibility settings:', error)
      }
    }
    setMounted(true)
  }, [])

  // Aplicar configuraciones cuando cambien
  useEffect(() => {
    if (!mounted) return

    // Guardar en localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings))

    // Aplicar cambios al DOM
    document.documentElement.style.fontSize = `${settings.fontSize}px`
    
    // Aplicar clases de accesibilidad
    document.body.classList.toggle('high-contrast', settings.highContrast)
    document.body.classList.toggle('reduced-motion', settings.reducedMotion)
    
    // Configurar preferencias de movimiento reducido
    if (settings.reducedMotion) {
      document.documentElement.style.setProperty('--motion-duration', '0.01ms')
    } else {
      document.documentElement.style.removeProperty('--motion-duration')
    }

    // Configurar idioma
    document.documentElement.lang = settings.language

  }, [settings, mounted])

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return {
    settings,
    updateSetting,
    resetSettings,
    mounted
  }
}

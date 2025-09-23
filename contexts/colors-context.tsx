'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'

// Tipos
interface Color {
  id: string
  name: string
  gradient_css: string
  is_active: boolean
  is_default: boolean
}

interface ColorsContextType {
  colors: Color[]
  currentGradient: string
  isLoading: boolean
  setCurrentGradient: (gradient: string) => void
  refreshColors: () => Promise<void>
  getDefaultGradient: () => string
}

// Contexto
const ColorsContext = createContext<ColorsContextType | undefined>(undefined)

// Hook personalizado
export const useColors = () => {
  const context = useContext(ColorsContext)
  if (context === undefined) {
    throw new Error('useColors must be used within a ColorsProvider')
  }
  return context
}

// Función para verificar si Supabase está configurado
const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// Función para crear cliente de Supabase
const createSupabaseClient = () => {
  if (!isSupabaseConfigured()) return null
  
  const isDevelopment = process.env.NODE_ENV === 'development'
  const useServiceKey = isDevelopment && process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
  const key = useServiceKey 
    ? process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  console.log('🔑 ColorsContext - Supabase configurado con:', {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    keyType: useServiceKey ? 'SERVICE_ROLE_KEY' : 'ANON_KEY',
    isDevelopment
  })
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    isDevelopment ? {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    } : undefined
  )
}

// Gradiente por defecto
const DEFAULT_GRADIENT = 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)'

// Provider
export const ColorsProvider = ({ children }: { children: ReactNode }) => {
  console.log('🎨 ColorsProvider inicializando...')
  const [colors, setColors] = useState<Color[]>([])
  const [currentGradient, setCurrentGradient] = useState<string>(DEFAULT_GRADIENT)
  const [isLoading, setIsLoading] = useState(true)

  // Crear cliente de Supabase de forma estable
  const supabase = useMemo(() => createSupabaseClient(), [])

  // Cargar colores desde Supabase
  const loadColors = useCallback(async () => {
    if (!supabase) {
      console.log('🎨 Supabase no configurado, usando gradiente por defecto')
      const fallbackColors = [{
        id: 'default',
        name: 'Gradiente Original',
        gradient_css: DEFAULT_GRADIENT,
        is_active: true,
        is_default: true
      }]
      setColors(fallbackColors)
      setCurrentGradient(DEFAULT_GRADIENT)
      setIsLoading(false)
      return
    }

    try {
      console.log('🎨 Cargando colores desde Supabase...')
      console.log('🔍 URL de Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('🔍 Service Role Key configurado:', !!process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)
      console.log('🔍 Anon Key configurado:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      
      const { data, error } = await supabase
        .from('colors')
        .select('*')
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('name', { ascending: true })

      if (error) {
        console.error('❌ Error cargando colores:', error)
        console.error('📊 Detalles del error:', {
          message: error.message || 'Sin mensaje',
          details: error.details || 'Sin detalles',
          hint: error.hint || 'Sin pista',
          code: error.code || 'Sin código'
        })
        
        // Si es un error de tabla no encontrada, usar fallback
        if (error.message?.includes('relation "colors" does not exist') || 
            error.message?.includes('permission denied')) {
          console.log('💡 Tabla colors no existe o sin permisos, usando fallback')
          throw new Error('TABLE_NOT_FOUND')
        }
        
        throw error
      }

      console.log('✅ Colores cargados:', data)
      const colorsData = data || []
      setColors(colorsData)

      // Establecer el gradiente por defecto como actual
      console.log('🔍 Buscando gradiente por defecto en:', colorsData.length, 'colores')
      colorsData.forEach((color, index) => {
        console.log(`  ${index + 1}. ${color.name} - is_default: ${color.is_default}`)
      })
      
      const defaultColor = colorsData.find(color => color.is_default === true)
      if (defaultColor) {
        console.log('✅ Gradiente por defecto encontrado:', defaultColor.name)
        console.log('🎨 Estableciendo gradiente por defecto:', defaultColor.gradient_css)
        setCurrentGradient(defaultColor.gradient_css)
        console.log('🎨 Gradiente establecido en el estado')
      } else if (colorsData.length > 0) {
        // Si no hay por defecto, usar el primero
        console.log('⚠️ No se encontró gradiente por defecto, usando el primero')
        console.log('🎨 Usando primer gradiente disponible:', colorsData[0].gradient_css)
        setCurrentGradient(colorsData[0].gradient_css)
      } else {
        // Fallback al gradiente por defecto
        console.log('❌ No hay colores disponibles, usando fallback')
        console.log('🎨 Usando gradiente por defecto como fallback')
        setCurrentGradient(DEFAULT_GRADIENT)
      }

    } catch (error) {
      console.error('❌ Error en loadColors:', error)
      
      // Si es un error de tabla no encontrada, usar fallback silenciosamente
      if (error.message === 'TABLE_NOT_FOUND') {
        console.log('💡 Usando gradiente por defecto (tabla no encontrada)')
      } else {
        console.error('📊 Error completo:', {
          message: error.message || 'Sin mensaje',
          stack: error.stack || 'Sin stack',
          name: error.name || 'Sin nombre'
        })
      }
      
      // Fallback al gradiente por defecto
      const fallbackColors = [{
        id: 'default',
        name: 'Gradiente Original',
        gradient_css: DEFAULT_GRADIENT,
        is_active: true,
        is_default: true
      }]
      setColors(fallbackColors)
      setCurrentGradient(DEFAULT_GRADIENT)
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  // Función para refrescar colores
  const refreshColors = async () => {
    setIsLoading(true)
    await loadColors()
  }

  // Función para obtener el gradiente por defecto
  const getDefaultGradient = () => {
    const defaultColor = colors.find(color => color.is_default)
    return defaultColor?.gradient_css || DEFAULT_GRADIENT
  }

  // Cargar colores al montar el componente
  useEffect(() => {
    console.log('🎨 useEffect ejecutándose - cargando colores...')
    loadColors()
  }, [loadColors])

  // Recargar colores cuando la página se vuelve visible (al regresar del admin)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🎨 Página visible - recargando colores...')
        loadColors()
      }
    }

    const handleFocus = () => {
      console.log('🎨 Ventana enfocada - recargando colores...')
      loadColors()
    }

    const handleStorageChange = (e: StorageEvent) => {
      // Recargar cuando se detecten cambios en el storage (desde el admin)
      if (e.key === 'admin-gradient-updated') {
        console.log('🎨 Cambio detectado desde admin - recargando colores...')
        loadColors()
        // Limpiar el flag
        localStorage.removeItem('admin-gradient-updated')
      }
    }

    // Escuchar cambios de visibilidad de la página
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [loadColors])

  // Escuchar cambios en tiempo real
  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel('colors-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'colors'
        },
        (payload) => {
          console.log('🔄 Cambio detectado en colores:', payload)
          loadColors()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const value: ColorsContextType = {
    colors,
    currentGradient,
    isLoading,
    setCurrentGradient,
    refreshColors,
    getDefaultGradient
  }
  

  return (
    <ColorsContext.Provider value={value}>
      {children}
    </ColorsContext.Provider>
  )
}

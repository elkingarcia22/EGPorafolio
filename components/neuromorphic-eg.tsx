'use client'

import { TypewriterText } from './typewriter-text'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useAdmin } from '@/contexts/admin-context'
import { useLanguage } from '@/contexts/language-context'
import { useDesignTokens } from '@/hooks/useDesignTokens'

export const NeuromorphicEG = () => {
  const { theme } = useTheme()
  const { content } = useAdmin()
  const { t, language } = useLanguage()
  const designTokens = useDesignTokens()
  const [mounted, setMounted] = useState(false)


  // Función para procesar el gradiente para efectos de texto
  const getTextGradient = () => {
    const gradient = designTokens.colors.primary.gradient
    
    // Si el gradiente tiene múltiples declaraciones, extraer solo la linear-gradient
    if (gradient.includes(';')) {
      const parts = gradient.split(';')
      const linearGradient = parts.find(part => part.includes('linear-gradient'))
      if (linearGradient) {
        return linearGradient.trim()
      }
    }
    
    // Si no tiene múltiples declaraciones, usar tal como está
    return gradient
  }

  // Función para generar overlay dinámico basado en el gradiente actual
  const getDynamicOverlay = () => {
    // Gradación de gris: más oscuro abajo, más claro arriba
    return 'linear-gradient(to top, rgba(0,0,0,0.99) 0%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0.6) 100%)'
  }

  // Debug logs
  console.log('🔍 NeuromorphicEG - content:', content)
  console.log('🔍 NeuromorphicEG - content.projects:', content?.projects)
  console.log('🔍 NeuromorphicEG - content.projects length:', content?.projects?.length)

  useEffect(() => {
    setMounted(true)
    console.log('NeuromorphicEG montado - verificando posicionamiento de línea')
    
    // Debug: verificar dimensiones del viewport
    const checkViewport = () => {
      console.log('Viewport height:', window.innerHeight)
      console.log('Viewport width:', window.innerWidth)
      console.log('Scroll position:', window.scrollY)
    }
    
    checkViewport()
    window.addEventListener('resize', checkViewport)
    
    return () => window.removeEventListener('resize', checkViewport)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'
  return (
    <section id="home" className="relative flex items-center justify-center h-[70vh] w-full overflow-hidden px-4 sm:px-6 xl:px-8 2xl:px-12 pt-2">
      {/* Layout: EG arriba, typewriter abajo, grid de proyectos en el centro */}
      <div className="flex flex-col items-center w-full max-w-7xl mx-auto">
        
        {/* Sección superior: EG + Typewriter */}
        <div className="flex flex-col items-center mb-12 md:mb-16 xl:mb-20 2xl:mb-24">

          {/* Contenedor para las letras EG */}
          <div className="flex items-center gap-4 md:gap-6 xl:gap-8 2xl:gap-12 mb-8">
            {/* Letra E */}
            <div className="relative">
              <span 
                className="font-black select-none text-[14rem] md:text-[18rem] xl:text-[24rem] 2xl:text-[38rem]"
                style={{
                  lineHeight: '0.8',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  backgroundImage: getTextGradient(),
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                  WebkitTextStroke: '0.5px transparent',
                  filter: isDark 
                    ? 'drop-shadow(-12px -12px 24px rgba(0, 0, 0, 0.8)) drop-shadow(12px 12px 24px rgba(255, 255, 255, 0.1)) drop-shadow(-6px -6px 12px rgba(0, 0, 0, 0.6)) drop-shadow(6px 6px 12px rgba(255, 255, 255, 0.05))'
                    : 'drop-shadow(8px 8px 16px rgba(0, 0, 0, 0.15)) drop-shadow(-8px -8px 16px rgba(255, 255, 255, 0.7)) drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.1)) drop-shadow(-4px -4px 8px rgba(255, 255, 255, 0.5))',
                  opacity: 0.9
                }}
              >
                E
              </span>
            </div>

            {/* Letra G */}
            <div className="relative">
              <span 
                className="font-black select-none text-[14rem] md:text-[18rem] xl:text-[24rem] 2xl:text-[38rem]"
                style={{
                  lineHeight: '0.8',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  backgroundImage: getTextGradient(),
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                  WebkitTextStroke: '0.5px transparent',
                  filter: isDark 
                    ? 'drop-shadow(-12px -12px 24px rgba(0, 0, 0, 0.8)) drop-shadow(12px 12px 24px rgba(255, 255, 255, 0.1)) drop-shadow(-6px -6px 12px rgba(0, 0, 0, 0.6)) drop-shadow(6px 6px 12px rgba(255, 255, 255, 0.05))'
                    : 'drop-shadow(8px 8px 16px rgba(0, 0, 0, 0.15)) drop-shadow(-8px -8px 16px rgba(255, 255, 255, 0.7)) drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.1)) drop-shadow(-4px -4px 8px rgba(255, 255, 255, 0.5))',
                  opacity: 0.9
                }}
              >
                G
              </span>
              
              {/* Texto typewriter dentro del espacio de la G - Solo visible en desktop */}
              <div 
                className="hidden md:block absolute w-full max-w-none left-[calc(100%-172px)] sm:left-[calc(100%-192px)] md:left-[calc(100%-212px)] top-[calc(33.333%+14px)] sm:top-[calc(33.333%+24px)] md:top-[calc(33.333%+29px)]"
              >
                <TypewriterText 
                  words={content.typewriterTexts}
                  className="text-xl md:text-2xl xl:text-2xl 2xl:text-3xl font-light text-gray-700 dark:text-gray-300"
                  typingSpeed={80}
                  deletingSpeed={40}
                  pauseTime={2500}
                />
              </div>
            </div>
          </div>

          {/* Typewriter en mobile */}
          <div className="md:hidden text-center">
            <TypewriterText 
              words={content.typewriterTexts}
              className="text-sm font-light text-gray-700 dark:text-gray-300"
              typingSpeed={80}
              deletingSpeed={40}
              pauseTime={2500}
            />
          </div>
        </div>

      </div>
    </section>
  )
}

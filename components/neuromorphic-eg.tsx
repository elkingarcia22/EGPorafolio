'use client'

import { TypewriterText } from './typewriter-text'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useAdmin } from '@/contexts/admin-context'
import { useLanguage } from '@/contexts/language-context'
import { useDesignTokens } from '@/hooks/useDesignTokens'
import { useProjects } from '@/hooks/useProjects'

export const NeuromorphicEG = () => {
  const { theme } = useTheme()
  const { content } = useAdmin()
  const { t } = useLanguage()
  const designTokens = useDesignTokens()
  const { projects, loading: projectsLoading } = useProjects()
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
    <div className="flex flex-col items-center justify-start min-h-screen px-8 pt-8">
      {/* Layout Mobile: Nombre arriba, EG más pequeño, texto typewriter abajo */}
      <div className="flex flex-col items-center w-full">
        {/* Nombre - Solo visible en mobile */}
        <div className="md:hidden text-center mb-4">
          <h1 className="text-2xl font-normal text-gray-600 dark:text-white">
            {t('home.name')}
          </h1>
        </div>

        {/* Contenedor para las letras EG - Más pequeño en mobile */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Letra E */}
        <div className="relative">
          <span 
              className="font-black select-none text-[16rem] md:text-[25rem] lg:text-[50rem]"
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
              className="font-black select-none text-[16rem] md:text-[25rem] lg:text-[50rem]"
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
              className="hidden md:block absolute w-full max-w-none left-[calc(100%-200px)] sm:left-[calc(100%-240px)] md:left-[calc(100%-280px)] top-[calc(33.333%+29px)] sm:top-[calc(33.333%+39px)] md:top-[calc(33.333%+44px)]"
          >
            <TypewriterText 
              words={content.typewriterTexts}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal text-gray-600 dark:text-white whitespace-nowrap"
              typingSpeed={80}
              deletingSpeed={40}
              pauseTime={2500}
            />
          </div>
        </div>
      </div>

        {/* Texto typewriter - Abajo del EG en mobile */}
        <div className="md:hidden text-center mt-4">
          <TypewriterText 
            words={content.typewriterTexts}
            className="text-2xl font-normal text-gray-600 dark:text-white"
            typingSpeed={80}
            deletingSpeed={40}
            pauseTime={2500}
          />
        </div>

        {/* "ELKIN GARCIA" - Solo visible en desktop */}
        <div className="hidden md:block absolute top-0 left-0 w-full">
          <div className="relative">
            {/* Línea degradada que baja desde el inicio de la página hasta el nombre */}
            <div 
              className="absolute w-1 h-48 lg:h-56" 
              style={{
                left: 'calc(22% - 13px)', 
                top: '-95px', 
                background: getTextGradient(),
                zIndex: 10
              }}
            ></div>
            
            {/* "ELKIN GARCIA" en posición más alta */}
            <div className="absolute top-20 lg:top-24" style={{left: '22%'}}>
              <span className="text-2xl lg:text-3xl font-normal text-gray-600 dark:text-white">
                {t('home.name')}
              </span>
            </div>
          </div>
        </div>

        {/* "Mi trabajo" - Solo visible en desktop */}
        <div className="hidden md:block mt-16 lg:mt-20 w-full">
        <div className="relative">
          {/* "Mi trabajo" más a la derecha y más arriba */}
            <div className="absolute right-1/4 -top-8" style={{right: '22%'}}>
              <span className="text-2xl lg:text-3xl font-normal text-gray-600 dark:text-white">
              {t('home.myWork')}
            </span>
            {/* Línea degradada al lado derecho del texto "Mi trabajo" */}
              <div className="absolute w-1 h-80 lg:h-96" style={{right: '-13px', top: '8px', background: designTokens.colors.primary.gradient}}></div>
            </div>
          </div>
        </div>
        
        {/* Título "Mi trabajo" - Solo visible en mobile */}
        <div className="md:hidden text-center mt-12 mb-4">
          <h2 className="text-2xl font-normal text-gray-600 dark:text-white">
            {t('home.myWork')}
          </h2>
        </div>
        
        {/* Sección de proyectos - Grid responsivo */}
        <div id="proyectos" className="mt-4 md:mt-16 lg:mt-48 grid grid-cols-1 sm:grid-cols-2 h-auto sm:h-screen w-screen -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-16 xl:-mx-24">
          {/* Proyecto 1 - UX Research */}
          <div className="group cursor-pointer relative overflow-hidden w-full h-full transition-all duration-300 hover:brightness-110 hover:shadow-2xl">
            {/* Imagen de portada */}
            <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700">
              {projects && projects[0]?.cover_image_url ? (
                <img 
                  src={projects[0].cover_image_url} 
                  alt={projects[0].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 transition-transform duration-500 group-hover:scale-110"></div>
              )}
            </div>
            {/* Overlay oscuro para contraste */}
            <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-80" style={{background: getDynamicOverlay()}}></div>
            {/* Gradación encima del overlay oscuro */}
            <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-50" style={{background: designTokens.colors.primary.gradient, opacity: 0.3}}></div>
            {/* Contenido de texto */}
            <div className="relative z-10 p-6 sm:p-8 md:p-12 h-full flex flex-col justify-end min-h-[300px] sm:min-h-[400px] md:min-h-[500px] w-full transition-transform duration-300 group-hover:-translate-y-2">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 break-words">
                {projects && projects[0] ? projects[0].title : 'Proyecto UX/UI'}
              </h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 break-words">
                {projects && projects[0] ? projects[0].description : 'Diseño de experiencia de usuario e interfaz para aplicaciones web modernas.'}
              </p>
            </div>
          </div>
          
          {/* Proyecto 2 - UI Design */}
          <div className="group cursor-pointer relative overflow-hidden w-full h-full transition-all duration-300 hover:brightness-110 hover:shadow-2xl">
            {/* Imagen de portada */}
            <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700">
              {projects && projects[1]?.cover_image_url ? (
                <img 
                  src={projects[1].cover_image_url} 
                  alt={projects[1].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 transition-transform duration-500 group-hover:scale-110"></div>
              )}
            </div>
            {/* Overlay oscuro para contraste */}
            <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-80" style={{background: getDynamicOverlay()}}></div>
            {/* Gradación encima del overlay oscuro */}
            <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-50" style={{background: designTokens.colors.primary.gradient, opacity: 0.3}}></div>
            {/* Contenido de texto */}
            <div className="relative z-10 p-6 sm:p-8 md:p-12 h-full flex flex-col justify-end min-h-[300px] sm:min-h-[400px] md:min-h-[500px] w-full transition-transform duration-300 group-hover:-translate-y-2">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 break-words">
                {projects && projects[1] ? projects[1].title : 'Diseño de Interfaz'}
              </h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 break-words">
                {projects && projects[1] ? projects[1].description : 'Creación de interfaces intuitivas y atractivas que mejoran la experiencia del usuario.'}
              </p>
            </div>
          </div>
          
          {/* Proyecto 3 - Estrategia Digital */}
          <div className="group cursor-pointer relative overflow-hidden w-full h-full transition-all duration-300 hover:brightness-110 hover:shadow-2xl">
            {/* Imagen de portada */}
            <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700">
              {projects && projects[2]?.cover_image_url ? (
                <img 
                  src={projects[2].cover_image_url} 
                  alt={projects[2].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 transition-transform duration-500 group-hover:scale-110"></div>
              )}
            </div>
            {/* Overlay oscuro para contraste */}
            <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-80" style={{background: getDynamicOverlay()}}></div>
            {/* Gradación encima del overlay oscuro */}
            <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-50" style={{background: designTokens.colors.primary.gradient, opacity: 0.3}}></div>
            {/* Contenido de texto */}
            <div className="relative z-10 p-6 sm:p-8 md:p-12 h-full flex flex-col justify-end min-h-[300px] sm:min-h-[400px] md:min-h-[500px] w-full transition-transform duration-300 group-hover:-translate-y-2">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 break-words">
                {projects && projects[2] ? projects[2].title : 'Estrategia Digital'}
              </h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 break-words">
                {projects && projects[2] ? projects[2].description : 'Desarrollo de estrategias digitales integrales para maximizar el impacto online.'}
              </p>
            </div>
          </div>
          
          {/* Proyecto 4 - Diseño con IA */}
          <div className="group cursor-pointer relative overflow-hidden w-full h-full transition-all duration-300 hover:brightness-110 hover:shadow-2xl">
            {/* Imagen de portada */}
            <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700">
              {projects && projects[3]?.cover_image_url ? (
                <img 
                  src={projects[3].cover_image_url} 
                  alt={projects[3].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 transition-transform duration-500 group-hover:scale-110"></div>
              )}
            </div>
            {/* Overlay oscuro para contraste */}
            <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-80" style={{background: getDynamicOverlay()}}></div>
            {/* Gradación encima del overlay oscuro */}
            <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-50" style={{background: designTokens.colors.primary.gradient, opacity: 0.3}}></div>
            {/* Contenido de texto */}
            <div className="relative z-10 p-6 sm:p-8 md:p-12 h-full flex flex-col justify-end min-h-[300px] sm:min-h-[400px] md:min-h-[500px] w-full transition-transform duration-300 group-hover:-translate-y-2">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 break-words">
                {projects && projects[3] ? projects[3].title : 'Diseño con IA'}
              </h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 break-words">
                {projects && projects[3] ? projects[3].description : 'Integración de inteligencia artificial en procesos de diseño para optimizar resultados.'}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

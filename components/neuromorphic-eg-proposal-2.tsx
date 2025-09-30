'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/contexts/language-context'
import { useDesignTokens } from '@/hooks/useDesignTokens'
import { TypewriterText } from './typewriter-text'
import { useAdmin } from '@/contexts/admin-context'

export const NeuromorphicEGProposal2 = () => {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const designTokens = useDesignTokens()
  const { content } = useAdmin()
  const [mounted, setMounted] = useState(false)
  const [currentProject, setCurrentProject] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-rotación del carrusel
  useEffect(() => {
    if (content.projects.length > 1) {
      const interval = setInterval(() => {
        setCurrentProject((prev) => (prev + 1) % content.projects.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [content.projects.length])

  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'

  const getTextGradient = () => {
    return isDark
      ? designTokens.colors.primary.gradientDark
      : designTokens.colors.primary.gradient
  }

  const nextProject = () => {
    setCurrentProject((prev) => (prev + 1) % content.projects.length)
  }

  const prevProject = () => {
    setCurrentProject((prev) => (prev - 1 + content.projects.length) % content.projects.length)
  }

  return (
    <section id="home" className="relative flex items-center justify-center min-h-screen w-full overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Layout: EG arriba, carrusel de proyectos abajo */}
      <div className="flex flex-col items-center w-full max-w-7xl mx-auto">
        
        {/* Sección superior: EG + Typewriter */}
        <div className="flex flex-col items-center mb-12">
          {/* Nombre - Solo visible en mobile */}
          <div className="md:hidden text-center mb-4">
            <h1 className="text-2xl font-normal text-gray-600 dark:text-white">
              {t('home.name')}
            </h1>
          </div>

          {/* Contenedor para las letras EG */}
          <div className="flex items-center gap-4 md:gap-8 mb-8">
            {/* Letra E */}
            <div className="relative">
              <span 
                className="font-black select-none text-[10rem] md:text-[16rem] lg:text-[32rem]"
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
                className="font-black select-none text-[10rem] md:text-[16rem] lg:text-[32rem]"
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
                className="hidden md:block absolute w-full max-w-none left-[calc(100%-180px)] sm:left-[calc(100%-220px)] md:left-[calc(100%-260px)] top-[calc(33.333%+25px)] sm:top-[calc(33.333%+35px)] md:top-[calc(33.333%+40px)]"
              >
                <TypewriterText 
                  words={content.typewriterTexts}
                  className="text-sm md:text-base lg:text-lg font-light text-gray-500 dark:text-gray-500"
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
              className="text-sm font-light text-gray-500 dark:text-gray-500"
              typingSpeed={80}
              deletingSpeed={40}
              pauseTime={2500}
            />
          </div>
        </div>

        {/* Sección central: Carrusel de proyectos */}
        <div className="w-full max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            Proyectos Destacados
          </h2>
          
          {/* Carrusel de proyectos */}
          <div className="relative">
            {/* Proyecto principal */}
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Imagen del proyecto */}
                <div className="aspect-video lg:aspect-square bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden">
                  {content.projects[currentProject]?.cover_image_url ? (
                    <img 
                      src={content.projects[currentProject].cover_image_url} 
                      alt={content.projects[currentProject].title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay con gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>
                
                {/* Contenido del proyecto */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30">
                      Proyecto {currentProject + 1} de {content.projects.length}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                    {content.projects[currentProject]?.title || 'Proyecto Destacado'}
                  </h3>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {content.projects[currentProject]?.description || 'Descripción del proyecto destacado.'}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href={`/proyecto/${content.projects[currentProject]?.slug}`}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      style={{background: designTokens.colors.primary.gradient}}
                    >
                      Ver proyecto completo
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    
                    <a 
                      href="/#proyectos"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300"
                    >
                      Ver todos
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Controles del carrusel */}
            {content.projects.length > 1 && (
              <>
                {/* Botón anterior */}
                <button
                  onClick={prevProject}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 flex items-center justify-center group"
                >
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Botón siguiente */}
                <button
                  onClick={nextProject}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 flex items-center justify-center group"
                >
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Indicadores */}
                <div className="flex justify-center mt-6 space-x-2">
                  {content.projects.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentProject(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentProject 
                          ? 'bg-blue-600 dark:bg-blue-400' 
                          : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

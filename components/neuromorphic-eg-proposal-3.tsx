'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/contexts/language-context'
import { useDesignTokens } from '@/hooks/useDesignTokens'
import { TypewriterText } from './typewriter-text'
import { useAdmin } from '@/contexts/admin-context'

export const NeuromorphicEGProposal3 = () => {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const designTokens = useDesignTokens()
  const { content } = useAdmin()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'

  const getTextGradient = () => {
    return isDark
      ? designTokens.colors.primary.gradientDark
      : designTokens.colors.primary.gradient
  }

  return (
    <section id="home" className="relative flex items-center justify-center min-h-screen w-full overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Layout asimétrico: EG a la izquierda, proyectos a la derecha */}
      <div className="flex flex-col lg:flex-row items-center w-full max-w-7xl mx-auto gap-12 lg:gap-16">
        
        {/* Columna izquierda: EG + Typewriter */}
        <div className="flex flex-col items-center lg:items-start w-full lg:w-2/3">
          {/* Nombre - Solo visible en mobile */}
          <div className="lg:hidden text-center mb-4">
            <h1 className="text-2xl font-normal text-gray-600 dark:text-white">
              {t('home.name')}
            </h1>
          </div>

          {/* Contenedor para las letras EG */}
          <div className="flex items-center gap-4 md:gap-8 mb-8">
            {/* Letra E */}
            <div className="relative">
              <span 
                className="font-black select-none text-[14rem] md:text-[22rem] lg:text-[44rem]"
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
                className="font-black select-none text-[14rem] md:text-[22rem] lg:text-[44rem]"
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

        {/* Columna derecha: Preview de proyectos */}
        <div className="w-full lg:w-1/3 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center lg:text-left">
            Trabajos Recientes
          </h2>
          
          {/* Lista vertical de proyectos */}
          <div className="space-y-4">
            {content.projects.slice(0, 4).map((project: any, index: number) => (
              <div key={project.id} className="group">
                <div className="flex items-center space-x-4 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  {/* Número del proyecto */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  {/* Imagen pequeña */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                    {project.cover_image_url ? (
                      <img 
                        src={project.cover_image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {project.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                      {project.description}
                    </p>
                  </div>
                  
                  {/* Flecha */}
                  <div className="flex-shrink-0">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                
                {/* Enlace invisible para hacer clickeable toda la tarjeta */}
                <a 
                  href={`/proyecto/${project.slug}`}
                  className="absolute inset-0 z-10"
                  aria-label={`Ver proyecto ${project.title}`}
                />
              </div>
            ))}
          </div>

          {/* Botón para ver todos */}
          <div className="mt-6">
            <a 
              href="/#proyectos"
              className="block w-full text-center px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{background: designTokens.colors.primary.gradient}}
            >
              Ver todos los proyectos
            </a>
          </div>

          {/* Estadísticas rápidas */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {content.projects.length}+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Proyectos
              </div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                5+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Años Exp.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

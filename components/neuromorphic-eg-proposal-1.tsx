'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/contexts/language-context'
import { useDesignTokens } from '@/hooks/useDesignTokens'
import { TypewriterText } from './typewriter-text'
import { ProjectPreview } from './project-preview'
import { useAdmin } from '@/contexts/admin-context'

export const NeuromorphicEGProposal1 = () => {
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
      {/* Layout: EG arriba, typewriter abajo, grid de proyectos en el centro */}
      <div className="flex flex-col items-center w-full max-w-7xl mx-auto">
        
        {/* Sección superior: EG + Typewriter */}
        <div className="flex flex-col items-center mb-16">
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
                className="font-black select-none text-[12rem] md:text-[18rem] lg:text-[36rem]"
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
                className="font-black select-none text-[12rem] md:text-[18rem] lg:text-[36rem]"
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

        {/* Sección central: Grid de proyectos destacados */}
        <div className="w-full max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            Proyectos Destacados
          </h2>
          
          {/* Grid responsivo de proyectos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.projects.slice(0, 6).map((project: any) => (
              <div key={project.id} className="group">
                <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Imagen del proyecto */}
                  <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden">
                    {project.cover_image_url ? (
                      <img 
                        src={project.cover_image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay con gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Contenido del proyecto */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {project.description}
                    </p>
                    
                    {/* Botón de ver más */}
                    <div className="mt-4">
                      <a 
                        href={`/proyecto/${project.slug}`}
                        className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        Ver proyecto
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botón para ver todos los proyectos */}
          <div className="text-center mt-8">
            <a 
              href="/#proyectos"
              className="inline-flex items-center px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{background: designTokens.colors.primary.gradient}}
            >
              Ver todos los proyectos
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

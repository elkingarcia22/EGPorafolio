'use client'

import { TypewriterText } from './typewriter-text'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useAdmin } from '@/contexts/admin-context'
import { useLanguage } from '@/contexts/language-context'
import { designTokens } from '@/lib/design-tokens'

export const NeuromorphicEG = () => {
  const { theme } = useTheme()
  const { content } = useAdmin()
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'
  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 md:px-8 pt-8 sm:pt-12 md:pt-16">
      {/* Contenedor para las letras EG gigantes */}
      <div className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
        {/* Letra E gigante */}
        <div className="relative">
          <span 
            className="font-black select-none"
            style={{
              fontSize: 'clamp(8rem, 25vw, 25rem)',
              lineHeight: '0.8',
              fontFamily: designTokens.typography.fontFamily.sans,
              background: designTokens.colors.primary.gradient,
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

        {/* Letra G gigante */}
        <div className="relative">
          <span 
            className="font-black select-none"
            style={{
              fontSize: 'clamp(8rem, 25vw, 25rem)',
              lineHeight: '0.8',
              fontFamily: designTokens.typography.fontFamily.sans,
              background: designTokens.colors.primary.gradient,
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
          
          {/* Texto typewriter dentro del espacio de la G */}
          <div 
            className="absolute w-full max-w-none left-[calc(100%-200px)] sm:left-[calc(100%-240px)] md:left-[calc(100%-280px)] top-[calc(33.333%+20px)] sm:top-[calc(33.333%+30px)] md:top-[calc(33.333%+35px)]"
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

      {/* Diseño dramático con "Mi trabajo" alineado con G y secciones tipo foto impactantes */}
      <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 w-full">
        {/* "Mi trabajo" con misma tipografía que texto typewriter */}
        <div className="relative">
          {/* "Mi trabajo" más a la derecha y más arriba */}
          <div className="absolute right-1/4 -top-4 sm:-top-6 md:-top-8" style={{right: '22%'}}>
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal text-gray-600 dark:text-white">
              {t('home.myWork')}
            </span>
            {/* Línea degradada al lado derecho del texto "Mi trabajo" */}
            <div className="absolute w-1 h-48 sm:h-64 md:h-80 lg:h-96" style={{right: '-13px', top: '8px', background: designTokens.colors.primary.gradient}}></div>
          </div>
        </div>
        
        {/* Sección de proyectos - Grid responsivo */}
        <div id="proyectos" className="mt-16 sm:mt-24 md:mt-32 lg:mt-48 grid grid-cols-1 sm:grid-cols-2 h-auto sm:h-screen -mx-4 sm:-mx-6 md:-mx-8">
          {/* Proyecto 1 - UX Research */}
          <div className="group cursor-pointer relative overflow-hidden">
            {/* Imagen de portada */}
            <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700">
              <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600"></div>
            </div>
            {/* Gradación de negro a verde-azul sobre la imagen */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(22,162,255,0.3) 50%, rgba(53,208,127,0.4) 100%)'}}></div>
            <div className="relative z-10 p-6 sm:p-8 md:p-12 h-full flex flex-col justify-end min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 group-hover:scale-105 transition-transform duration-500">{content.projectTitles[0]}</h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-md">{content.projectDescriptions[0]}</p>
              <div className="w-12 sm:w-16 h-1 bg-white/60 group-hover:w-16 sm:group-hover:w-24 transition-all duration-500"></div>
            </div>
          </div>
          
          {/* Proyecto 2 - UI Design */}
          <div className="group cursor-pointer relative overflow-hidden">
            {/* Imagen de portada */}
            <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700">
              <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600"></div>
            </div>
            {/* Gradación de negro a verde-azul sobre la imagen */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(22,162,255,0.3) 50%, rgba(53,208,127,0.4) 100%)'}}></div>
            <div className="relative z-10 p-6 sm:p-8 md:p-12 h-full flex flex-col justify-end min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 group-hover:scale-105 transition-transform duration-500">{content.projectTitles[1]}</h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-md">{content.projectDescriptions[1]}</p>
              <div className="w-12 sm:w-16 h-1 bg-white/60 group-hover:w-16 sm:group-hover:w-24 transition-all duration-500"></div>
            </div>
          </div>
          
          {/* Proyecto 3 - Estrategia Digital */}
          <div className="group cursor-pointer relative overflow-hidden">
            {/* Imagen de portada */}
            <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700">
              <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600"></div>
            </div>
            {/* Gradación de negro a verde-azul sobre la imagen */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(22,162,255,0.3) 50%, rgba(53,208,127,0.4) 100%)'}}></div>
            <div className="relative z-10 p-6 sm:p-8 md:p-12 h-full flex flex-col justify-end min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 group-hover:scale-105 transition-transform duration-500">{content.projectTitles[2]}</h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-md">{content.projectDescriptions[2]}</p>
              <div className="w-12 sm:w-16 h-1 bg-white/60 group-hover:w-16 sm:group-hover:w-24 transition-all duration-500"></div>
            </div>
          </div>
          
          {/* Proyecto 4 - Diseño con IA */}
          <div className="group cursor-pointer relative overflow-hidden">
            {/* Imagen de portada */}
            <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700">
              <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600"></div>
            </div>
            {/* Gradación de negro a verde-azul sobre la imagen */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(22,162,255,0.3) 50%, rgba(53,208,127,0.4) 100%)'}}></div>
            <div className="relative z-10 p-6 sm:p-8 md:p-12 h-full flex flex-col justify-end min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 group-hover:scale-105 transition-transform duration-500">{content.projectTitles[3]}</h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-md">{content.projectDescriptions[3]}</p>
              <div className="w-12 sm:w-16 h-1 bg-white/60 group-hover:w-16 sm:group-hover:w-24 transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

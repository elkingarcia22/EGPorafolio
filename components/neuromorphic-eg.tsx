'use client'

import { TypewriterText } from './typewriter-text'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export const NeuromorphicEG = () => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'
  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-8 pt-16">
      {/* Contenedor para las letras EG gigantes */}
      <div className="flex items-center gap-8">
        {/* Letra E gigante */}
        <div className="relative">
          <span 
            className="font-black select-none"
            style={{
              fontSize: 'clamp(25rem, 60vw, 50rem)',
              lineHeight: '0.8',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              background: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)',
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
              fontSize: 'clamp(25rem, 60vw, 50rem)',
              lineHeight: '0.8',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              background: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)',
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
                      <div className="absolute top-1/3 left-full transform -translate-x-1/2 -translate-y-1/2 translate-y-8 -translate-x-72 translate-y-4 w-full max-w-none">
                        <TypewriterText 
                          words={[
                            "Diseñador UX/UI senior specialist",
                            "Diseño de interacciones", 
                            "Diseño de estrategias",
                            "Diseño inteligente IA"
                          ]}
                          className="text-2xl md:text-3xl font-thin text-black dark:text-white whitespace-nowrap"
                          typingSpeed={80}
                          deletingSpeed={40}
                          pauseTime={2500}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Diseño dramático con "Mi trabajo" alineado con G y secciones tipo foto impactantes */}
                  <div className="mt-20 w-full">
                    {/* "Mi trabajo" con misma tipografía que texto typewriter */}
                    <div className="relative">
                      {/* "Mi trabajo" más a la derecha y más arriba */}
                      <div className="absolute right-1/4 -top-8" style={{right: '22%'}}>
                        <span className="text-2xl md:text-3xl font-thin text-black dark:text-white">
                          Mi trabajo
                        </span>
                        {/* Línea degradada al lado derecho del texto "Mi trabajo" */}
                        <div className="absolute w-1 h-96" style={{right: '-8px', top: '8px', background: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)'}}></div>
                      </div>
                    </div>
                    
                    {/* Sección de proyectos - Grid 2x2 full screen sin márgenes */}
                    <div id="proyectos" className="mt-48 grid grid-cols-2 h-screen">
                      {/* Proyecto 1 - UX Research */}
                      <div className="group cursor-pointer relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500"></div>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500"></div>
                        <div className="relative z-10 p-12 h-full flex flex-col justify-end">
                          <h3 className="text-5xl font-bold text-white mb-6 group-hover:scale-105 transition-transform duration-500">UX Research</h3>
                          <p className="text-xl text-white/90 mb-8 max-w-md">Investigación profunda de usuarios para crear experiencias excepcionales y centradas en el ser humano</p>
                          <div className="w-16 h-1 bg-white/60 group-hover:w-24 transition-all duration-500"></div>
                        </div>
                      </div>
                      
                      {/* Proyecto 2 - UI Design */}
                      <div className="group cursor-pointer relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500"></div>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500"></div>
                        <div className="relative z-10 p-12 h-full flex flex-col justify-end">
                          <h3 className="text-5xl font-bold text-white mb-6 group-hover:scale-105 transition-transform duration-500">UI Design</h3>
                          <p className="text-xl text-white/90 mb-8 max-w-md">Diseño de interfaces modernas, funcionales y visualmente impactantes que conectan con los usuarios</p>
                          <div className="w-16 h-1 bg-white/60 group-hover:w-24 transition-all duration-500"></div>
                        </div>
                      </div>
                      
                      {/* Proyecto 3 - Estrategia Digital */}
                      <div className="group cursor-pointer relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-500 to-pink-500"></div>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500"></div>
                        <div className="relative z-10 p-12 h-full flex flex-col justify-end">
                          <h3 className="text-5xl font-bold text-white mb-6 group-hover:scale-105 transition-transform duration-500">Estrategia Digital</h3>
                          <p className="text-xl text-white/90 mb-8 max-w-md">Desarrollo de estrategias digitales integrales que transforman marcas y productos</p>
                          <div className="w-16 h-1 bg-white/60 group-hover:w-24 transition-all duration-500"></div>
                        </div>
                      </div>
                      
                      {/* Proyecto 4 - Diseño con IA */}
                      <div className="group cursor-pointer relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-500 to-cyan-500"></div>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500"></div>
                        <div className="relative z-10 p-12 h-full flex flex-col justify-end">
                          <h3 className="text-5xl font-bold text-white mb-6 group-hover:scale-105 transition-transform duration-500">Diseño con IA</h3>
                          <p className="text-xl text-white/90 mb-8 max-w-md">Proyectos innovadores que combinan inteligencia artificial con diseño creativo</p>
                          <div className="w-16 h-1 bg-white/60 group-hover:w-24 transition-all duration-500"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
  )
}

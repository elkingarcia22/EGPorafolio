'use client'

import { TypewriterText } from './typewriter-text'

export const NeuromorphicEG = () => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-8 pt-24">
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
              filter: 'drop-shadow(8px 8px 16px rgba(0, 0, 0, 0.15)) drop-shadow(-8px -8px 16px rgba(255, 255, 255, 0.8)) drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.1)) drop-shadow(-4px -4px 8px rgba(255, 255, 255, 0.6))',
              opacity: 0.7
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
              filter: 'drop-shadow(8px 8px 16px rgba(0, 0, 0, 0.15)) drop-shadow(-8px -8px 16px rgba(255, 255, 255, 0.8)) drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.1)) drop-shadow(-4px -4px 8px rgba(255, 255, 255, 0.6))',
              opacity: 0.7
            }}
          >
            G
          </span>
          
                      {/* Texto typewriter dentro del espacio de la G */}
                      <div className="absolute top-1/3 left-full transform -translate-x-1/2 -translate-y-1/2 translate-y-8 -translate-x-72 translate-x-1.5 w-full max-w-none">
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
                </div>
  )
}

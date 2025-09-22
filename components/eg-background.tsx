'use client'

import { TypewriterText } from './typewriter-text'

export const EGElement = () => {
  return (
    <div className="flex flex-col items-start justify-center min-h-screen pl-8">
      {/* Letras EG como elemento principal */}
      <div className="relative">
        <span className="neo-eg-text">EG</span>
        
        {/* Texto typewriter posicionado debajo de la G */}
        <div className="absolute top-1/2 left-1/2 transform translate-x-20 translate-y-24">
          <TypewriterText 
            words={[
              "Diseñador UX/UI senior specialist",
              "Diseño de interacciones", 
              "Diseño de estrategias",
              "Diseño con IA"
            ]}
            className="text-sm md:text-base lg:text-lg font-light text-gray-500 dark:text-gray-500"
            typingSpeed={80}
            deletingSpeed={40}
            pauseTime={2500}
          />
        </div>
      </div>
    </div>
  )
}

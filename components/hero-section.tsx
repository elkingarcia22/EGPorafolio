'use client'

import React from 'react'
import { TypewriterText } from './typewriter-text'

export const HeroSection: React.FC = () => {
  const typewriterWords = [
    'Diseño UX/UI',
    'Diseño de Producto',
    'Estrategia IA',
    'Desarrollo Full Stack',
    'Innovación Digital'
  ]

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-start px-4">
      <div className="max-w-6xl mx-auto text-left">
        {/* Saludo */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl text-gray-400 dark:text-gray-500 font-poppins font-light tracking-wider">
            HOLA, SOY
          </h2>
        </div>

        {/* Nombre con efecto de relleno unificado */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] typography-hero-name leading-tight tracking-tight hover-gradient-fill whitespace-nowrap">
            Elkin Garcia
          </h1>
        </div>

        {/* Título con animación de escritura */}
        <div className="mb-8">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-gray-500 dark:text-gray-400 tracking-wide">
            <TypewriterText
              words={typewriterWords}
              className="text-gray-500 dark:text-gray-400"
              typingSpeed={150}
              deletingSpeed={75}
              pauseTime={2500}
            />
          </h3>
        </div>

        {/* Eslogan */}
        <div className="mb-12">
          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-poppins font-medium">
            Creando experiencias digitales excepcionales
          </p>
        </div>

        {/* Descripción */}
        <div className="mb-12 max-w-4xl mx-auto">
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 leading-relaxed font-poppins font-normal">
            Senior Developer con más de 5 años de experiencia transformando ideas en productos digitales innovadores. 
            Me especializo en crear aplicaciones web modernas que combinan diseño intuitivo con tecnología de vanguardia.
          </p>
        </div>

        {/* Botón de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-start items-start">
          <button className="neo-button-primary px-8 py-4 text-lg font-semibold text-white rounded-2xl hover:scale-105 transition-transform duration-300">
            Ver Proyectos
          </button>
          <button className="neo-button px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 rounded-2xl hover:scale-105 transition-transform duration-300">
            Descargar CV
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import React from 'react'

export const NeumorphicEGLogo: React.FC = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Fondo con textura de papel/mate */}
      <div 
        className="absolute inset-0"
        style={{
          background: '#f8f8f8',
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 1px, transparent 0),
            radial-gradient(circle at 2px 2px, rgba(0,0,0,0.01) 1px, transparent 0)
          `,
          backgroundSize: '20px 20px, 40px 40px'
        }}
      />
      
      {/* Contenedor de las letras EG */}
      <div className="relative z-10 flex items-center justify-center gap-16">
        {/* Letra E */}
        <div 
          className="relative"
          style={{
            width: '200px',
            height: '280px',
            background: '#f8f8f8',
            borderRadius: '20px',
            boxShadow: `
              inset 8px 8px 16px rgba(209, 217, 230, 0.6),
              inset -8px -8px 16px rgba(255, 255, 255, 0.7)
            `,
            position: 'relative'
          }}
        >
          {/* Gradiente interno para la letra E - usando clip-path para crear el efecto de "corte" */}
          <div 
            className="absolute inset-0 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #4FC3F7 0%, #26C6DA 50%, #66BB6A 100%)',
              clipPath: 'polygon(10% 10%, 90% 10%, 90% 20%, 30% 20%, 30% 45%, 70% 45%, 70% 55%, 30% 55%, 30% 80%, 90% 80%, 90% 90%, 10% 90%)',
              borderRadius: '16px'
            }}
          />
        </div>

        {/* Letra G */}
        <div 
          className="relative"
          style={{
            width: '200px',
            height: '280px',
            background: '#f8f8f8',
            borderRadius: '20px',
            boxShadow: `
              inset 8px 8px 16px rgba(209, 217, 230, 0.6),
              inset -8px -8px 16px rgba(255, 255, 255, 0.7)
            `,
            position: 'relative'
          }}
        >
          {/* Gradiente interno para la letra G - usando clip-path para crear el efecto de "corte" */}
          <div 
            className="absolute inset-0 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #26C6DA 0%, #66BB6A 50%, #4CAF50 100%)',
              clipPath: 'polygon(10% 10%, 90% 10%, 90% 20%, 30% 20%, 30% 45%, 60% 45%, 60% 55%, 30% 55%, 30% 80%, 90% 80%, 90% 90%, 10% 90%)',
              borderRadius: '16px'
            }}
          />
        </div>
      </div>
    </div>
  )
}

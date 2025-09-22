'use client'

import React from 'react'

export const EGFullScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Letra E - Pantalla completa */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '50rem',
          fontWeight: '900',
          color: '#f0f0f3',
          textShadow: `
            40px 40px 80px #d1d9e6,
            -40px -40px 80px #ffffff,
            80px 80px 160px #d1d9e6,
            -80px -80px 160px #ffffff,
            120px 120px 240px #d1d9e6,
            -120px -120px 240px #ffffff
          `,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.1em',
          animation: 'floatE 25s ease-in-out infinite',
          zIndex: 1
        }}
      >
        E
      </div>
      
      {/* Letra G - Pantalla completa */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '50rem',
          fontWeight: '900',
          color: '#f0f0f3',
          textShadow: `
            40px 40px 80px #d1d9e6,
            -40px -40px 80px #ffffff,
            80px 80px 160px #d1d9e6,
            -80px -80px 160px #ffffff,
            120px 120px 240px #d1d9e6,
            -120px -120px 240px #ffffff
          `,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.1em',
          animation: 'floatG 28s ease-in-out infinite reverse',
          zIndex: 1,
          marginLeft: '15rem'
        }}
      >
        G
      </div>
      
      {/* Efectos de profundidad para la E */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '50rem',
          fontWeight: '900',
          color: 'transparent',
          background: 'linear-gradient(135deg, #f0f0f3 0%, #e8e8eb 50%, #f0f0f3 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'blur(2px)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.1em',
          animation: 'floatE 25s ease-in-out infinite',
          zIndex: 0,
          marginTop: '3px',
          marginLeft: '3px'
        }}
      >
        E
      </div>
      
      {/* Efectos de profundidad para la G */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '50rem',
          fontWeight: '900',
          color: 'transparent',
          background: 'linear-gradient(45deg, #f0f0f3 0%, #e8e8eb 50%, #f0f0f3 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'blur(2px)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.1em',
          animation: 'floatG 28s ease-in-out infinite reverse',
          zIndex: 0,
          marginTop: '3px',
          marginLeft: '18rem'
        }}
      >
        G
      </div>
      
      {/* Sombras de fondo para mayor profundidad */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '50rem',
          fontWeight: '900',
          color: 'transparent',
          background: 'radial-gradient(circle, rgba(209, 217, 230, 0.2) 0%, transparent 70%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.1em',
          animation: 'floatE 25s ease-in-out infinite',
          zIndex: -1,
          marginTop: '20px',
          marginLeft: '20px'
        }}
      >
        E
      </div>
      
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '50rem',
          fontWeight: '900',
          color: 'transparent',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.1em',
          animation: 'floatG 28s ease-in-out infinite reverse',
          zIndex: -1,
          marginTop: '20px',
          marginLeft: '35rem'
        }}
      >
        G
      </div>
    </div>
  )
}

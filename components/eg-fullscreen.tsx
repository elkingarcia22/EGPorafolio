'use client'

import React from 'react'

export const EGFullScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Letra E - Pantalla completa - Efecto saliente */}
      <div
        className="absolute top-16 left-1/4 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '35rem',
          fontWeight: '900',
          color: '#f0f0f3',
          textShadow: `
            30px 30px 60px #d1d9e6,
            -30px -30px 60px #ffffff,
            60px 60px 120px #d1d9e6,
            -60px -60px 120px #ffffff,
            90px 90px 180px #d1d9e6,
            -90px -90px 180px #ffffff
          `,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.05em',
          animation: 'floatE 25s ease-in-out infinite',
          zIndex: 1
        }}
      >
        E
      </div>
      
      {/* Letra G - Pantalla completa - Efecto hundido */}
      <div
        className="absolute top-16 right-1/4 transform translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '45rem',
          fontWeight: '900',
          color: '#f0f0f3',
          textShadow: `
            inset 20px 20px 40px #d1d9e6,
            inset -20px -20px 40px #ffffff,
            inset 40px 40px 80px #d1d9e6,
            inset -40px -40px 80px #ffffff
          `,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.05em',
          animation: 'floatG 28s ease-in-out infinite reverse',
          zIndex: 1
        }}
      >
        G
      </div>
      
      {/* Efectos de profundidad para la E - Saliente */}
      <div
        className="absolute top-16 left-1/4 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '35rem',
          fontWeight: '900',
          color: 'transparent',
          background: 'linear-gradient(135deg, #f0f0f3 0%, #e8e8eb 50%, #f0f0f3 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'blur(2px)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.05em',
          animation: 'floatE 25s ease-in-out infinite',
          zIndex: 0,
          marginTop: '3px',
          marginLeft: '3px'
        }}
      >
        E
      </div>
      
      {/* Efectos de profundidad para la G - Hundido */}
      <div
        className="absolute top-16 right-1/4 transform translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '45rem',
          fontWeight: '900',
          color: 'transparent',
          background: 'linear-gradient(45deg, #e8e8eb 0%, #f0f0f3 50%, #e8e8eb 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'blur(2px)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.05em',
          animation: 'floatG 28s ease-in-out infinite reverse',
          zIndex: 0,
          marginTop: '3px',
          marginLeft: '3px'
        }}
      >
        G
      </div>
      
      {/* Sombras de fondo para mayor profundidad - E */}
      <div
        className="absolute top-16 left-1/4 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '35rem',
          fontWeight: '900',
          color: 'transparent',
          background: 'radial-gradient(circle, rgba(209, 217, 230, 0.2) 0%, transparent 70%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.05em',
          animation: 'floatE 25s ease-in-out infinite',
          zIndex: -1,
          marginTop: '15px',
          marginLeft: '15px'
        }}
      >
        E
      </div>
      
      {/* Sombras de fondo para mayor profundidad - G */}
      <div
        className="absolute top-16 right-1/4 transform translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '45rem',
          fontWeight: '900',
          color: 'transparent',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.05em',
          animation: 'floatG 28s ease-in-out infinite reverse',
          zIndex: -1,
          marginTop: '15px',
          marginLeft: '15px'
        }}
      >
        G
      </div>
    </div>
  )
}

'use client'

import React from 'react'

export const EGBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Letra E - Hundida (inset) */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '40rem',
          fontWeight: '900',
          color: '#f0f0f3',
          textShadow: `
            inset 30px 30px 60px #d1d9e6,
            inset -30px -30px 60px #ffffff,
            inset 60px 60px 120px #d1d9e6,
            inset -60px -60px 120px #ffffff,
            inset 90px 90px 180px #d1d9e6,
            inset -90px -90px 180px #ffffff
          `,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.1em',
          animation: 'floatE 15s ease-in-out infinite',
          zIndex: 1
        }}
      >
        E
      </div>
      
      {/* Letra G - Saliente (extruded) */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '40rem',
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
          letterSpacing: '-0.1em',
          animation: 'floatG 18s ease-in-out infinite reverse',
          zIndex: 1,
          marginLeft: '12rem'
        }}
      >
        G
      </div>
      
      {/* Efectos de profundidad adicionales para la E */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '40rem',
          fontWeight: '900',
          color: 'transparent',
          background: 'linear-gradient(135deg, #d1d9e6 0%, #f0f0f3 50%, #d1d9e6 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'blur(2px)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.1em',
          animation: 'floatE 15s ease-in-out infinite',
          zIndex: 0,
          marginTop: '3px',
          marginLeft: '3px'
        }}
      >
        E
      </div>
      
      {/* Efectos de profundidad adicionales para la G */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '40rem',
          fontWeight: '900',
          color: 'transparent',
          background: 'linear-gradient(45deg, #f0f0f3 0%, #e8e8eb 50%, #f0f0f3 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'blur(2px)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.1em',
          animation: 'floatG 18s ease-in-out infinite reverse',
          zIndex: 0,
          marginTop: '3px',
          marginLeft: '15rem'
        }}
      >
        G
      </div>
      
      {/* Sombras de fondo para mayor profundidad */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '40rem',
          fontWeight: '900',
          color: 'transparent',
          background: 'radial-gradient(circle, rgba(209, 217, 230, 0.15) 0%, transparent 70%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.1em',
          animation: 'floatE 15s ease-in-out infinite',
          zIndex: -1,
          marginTop: '15px',
          marginLeft: '15px'
        }}
      >
        E
      </div>
      
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '40rem',
          fontWeight: '900',
          color: 'transparent',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.1em',
          animation: 'floatG 18s ease-in-out infinite reverse',
          zIndex: -1,
          marginTop: '15px',
          marginLeft: '27rem'
        }}
      >
        G
      </div>
    </div>
  )
}

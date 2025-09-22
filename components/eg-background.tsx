'use client'

import React from 'react'

export const EGBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Letra E - Saliente (extruded) */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '28rem',
          fontWeight: '900',
          color: '#f0f0f3',
          textShadow: `
            20px 20px 40px #d1d9e6,
            -20px -20px 40px #ffffff,
            40px 40px 80px #d1d9e6,
            -40px -40px 80px #ffffff,
            60px 60px 120px #d1d9e6,
            -60px -60px 120px #ffffff
          `,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.1em',
          animation: 'floatE 15s ease-in-out infinite',
          zIndex: 1
        }}
      >
        E
      </div>
      
      {/* Letra G - Hundida (inset) */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '28rem',
          fontWeight: '900',
          color: '#f0f0f3',
          textShadow: `
            inset 20px 20px 40px #d1d9e6,
            inset -20px -20px 40px #ffffff,
            inset 40px 40px 80px #d1d9e6,
            inset -40px -40px 80px #ffffff,
            inset 60px 60px 120px #d1d9e6,
            inset -60px -60px 120px #ffffff
          `,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.1em',
          animation: 'floatG 18s ease-in-out infinite reverse',
          zIndex: 1,
          marginLeft: '8rem'
        }}
      >
        G
      </div>
      
      {/* Efectos de profundidad adicionales para la E */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '28rem',
          fontWeight: '900',
          color: 'transparent',
          background: 'linear-gradient(135deg, #f0f0f3 0%, #e8e8eb 50%, #f0f0f3 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'blur(1px)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.1em',
          animation: 'floatE 15s ease-in-out infinite',
          zIndex: 0,
          marginTop: '2px',
          marginLeft: '2px'
        }}
      >
        E
      </div>
      
      {/* Efectos de profundidad adicionales para la G */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '28rem',
          fontWeight: '900',
          color: 'transparent',
          background: 'linear-gradient(45deg, #d1d9e6 0%, #f0f0f3 50%, #d1d9e6 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'blur(1px)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.1em',
          animation: 'floatG 18s ease-in-out infinite reverse',
          zIndex: 0,
          marginTop: '2px',
          marginLeft: '10rem'
        }}
      >
        G
      </div>
      
      {/* Sombras de fondo para mayor profundidad */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '28rem',
          fontWeight: '900',
          color: 'transparent',
          background: 'radial-gradient(circle, rgba(209, 217, 230, 0.1) 0%, transparent 70%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.1em',
          animation: 'floatE 15s ease-in-out infinite',
          zIndex: -1,
          marginTop: '10px',
          marginLeft: '10px'
        }}
      >
        E
      </div>
      
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '28rem',
          fontWeight: '900',
          color: 'transparent',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.1em',
          animation: 'floatG 18s ease-in-out infinite reverse',
          zIndex: -1,
          marginTop: '10px',
          marginLeft: '18rem'
        }}
      >
        G
      </div>
    </div>
  )
}

'use client'

import React from 'react'

export const EGBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Letra E - Neumórfico */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '35rem',
          fontWeight: '900',
          color: '#f0f0f3',
          textShadow: `
            25px 25px 50px #d1d9e6,
            -25px -25px 50px #ffffff,
            50px 50px 100px #d1d9e6,
            -50px -50px 100px #ffffff
          `,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.05em',
          animation: 'floatE 20s ease-in-out infinite',
          zIndex: 1
        }}
      >
        E
      </div>
      
      {/* Letra G - Neumórfico */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '35rem',
          fontWeight: '900',
          color: '#f0f0f3',
          textShadow: `
            25px 25px 50px #d1d9e6,
            -25px -25px 50px #ffffff,
            50px 50px 100px #d1d9e6,
            -50px -50px 100px #ffffff
          `,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.05em',
          animation: 'floatG 22s ease-in-out infinite reverse',
          zIndex: 1,
          marginLeft: '10rem'
        }}
      >
        G
      </div>
      
      {/* Efectos de profundidad para la E */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '35rem',
          fontWeight: '900',
          color: 'transparent',
          background: 'linear-gradient(135deg, #f0f0f3 0%, #e8e8eb 50%, #f0f0f3 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'blur(1px)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.05em',
          animation: 'floatE 20s ease-in-out infinite',
          zIndex: 0,
          marginTop: '2px',
          marginLeft: '2px'
        }}
      >
        E
      </div>
      
      {/* Efectos de profundidad para la G */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: '35rem',
          fontWeight: '900',
          color: 'transparent',
          background: 'linear-gradient(45deg, #f0f0f3 0%, #e8e8eb 50%, #f0f0f3 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'blur(1px)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.05em',
          animation: 'floatG 22s ease-in-out infinite reverse',
          zIndex: 0,
          marginTop: '2px',
          marginLeft: '12rem'
        }}
      >
        G
      </div>
    </div>
  )
}

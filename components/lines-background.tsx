'use client'

import React from 'react'

export const LinesBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Líneas horizontales */}
      <div
        className="absolute w-full h-1 top-1/4 left-0"
        style={{
          background: 'linear-gradient(90deg, transparent, #f0f0f3, transparent)',
          boxShadow: '0 2px 4px rgba(209, 217, 230, 0.3)',
          animation: 'floatHorizontal 20s ease-in-out infinite'
        }}
      />
      
      <div
        className="absolute w-full h-1 top-1/2 left-0"
        style={{
          background: 'linear-gradient(90deg, transparent, #f0f0f3, transparent)',
          boxShadow: '0 2px 4px rgba(209, 217, 230, 0.3)',
          animation: 'floatHorizontal 25s ease-in-out infinite reverse'
        }}
      />
      
      <div
        className="absolute w-full h-1 top-3/4 left-0"
        style={{
          background: 'linear-gradient(90deg, transparent, #f0f0f3, transparent)',
          boxShadow: '0 2px 4px rgba(209, 217, 230, 0.3)',
          animation: 'floatHorizontal 18s ease-in-out infinite'
        }}
      />
      
      {/* Líneas verticales */}
      <div
        className="absolute w-1 h-full top-0 left-1/4"
        style={{
          background: 'linear-gradient(180deg, transparent, #f0f0f3, transparent)',
          boxShadow: '2px 0 4px rgba(209, 217, 230, 0.3)',
          animation: 'floatVertical 22s ease-in-out infinite'
        }}
      />
      
      <div
        className="absolute w-1 h-full top-0 left-1/2"
        style={{
          background: 'linear-gradient(180deg, transparent, #f0f0f3, transparent)',
          boxShadow: '2px 0 4px rgba(209, 217, 230, 0.3)',
          animation: 'floatVertical 28s ease-in-out infinite reverse'
        }}
      />
      
      <div
        className="absolute w-1 h-full top-0 left-3/4"
        style={{
          background: 'linear-gradient(180deg, transparent, #f0f0f3, transparent)',
          boxShadow: '2px 0 4px rgba(209, 217, 230, 0.3)',
          animation: 'floatVertical 24s ease-in-out infinite'
        }}
      />
      
      {/* Líneas diagonales */}
      <div
        className="absolute w-96 h-1 top-1/3 left-1/4"
        style={{
          background: 'linear-gradient(45deg, transparent, #f0f0f3, transparent)',
          transform: 'rotate(45deg)',
          boxShadow: '0 2px 4px rgba(209, 217, 230, 0.3)',
          animation: 'floatDiagonal 26s ease-in-out infinite'
        }}
      />
      
      <div
        className="absolute w-80 h-1 top-2/3 right-1/4"
        style={{
          background: 'linear-gradient(-45deg, transparent, #f0f0f3, transparent)',
          transform: 'rotate(-45deg)',
          boxShadow: '0 2px 4px rgba(209, 217, 230, 0.3)',
          animation: 'floatDiagonal 30s ease-in-out infinite reverse'
        }}
      />
      
      {/* Líneas curvas suaves */}
      <div
        className="absolute w-64 h-1 top-1/6 left-1/6"
        style={{
          background: 'linear-gradient(90deg, transparent, #f0f0f3, transparent)',
          borderRadius: '50px',
          boxShadow: '0 2px 4px rgba(209, 217, 230, 0.3)',
          animation: 'floatCurve 16s ease-in-out infinite'
        }}
      />
      
      <div
        className="absolute w-48 h-1 bottom-1/4 right-1/6"
        style={{
          background: 'linear-gradient(90deg, transparent, #f0f0f3, transparent)',
          borderRadius: '50px',
          boxShadow: '0 2px 4px rgba(209, 217, 230, 0.3)',
          animation: 'floatCurve 20s ease-in-out infinite reverse'
        }}
      />
      
      {/* Líneas de acento */}
      <div
        className="absolute w-32 h-1 top-1/2 left-1/6"
        style={{
          background: 'linear-gradient(90deg, transparent, #f0f0f3, transparent)',
          boxShadow: '0 3px 6px rgba(209, 217, 230, 0.4)',
          animation: 'floatAccent 14s ease-in-out infinite'
        }}
      />
      
      <div
        className="absolute w-24 h-1 top-1/3 right-1/6"
        style={{
          background: 'linear-gradient(90deg, transparent, #f0f0f3, transparent)',
          boxShadow: '0 3px 6px rgba(209, 217, 230, 0.4)',
          animation: 'floatAccent 12s ease-in-out infinite reverse'
        }}
      />
      
      {/* Líneas verticales de acento */}
      <div
        className="absolute w-1 h-32 top-1/6 left-1/3"
        style={{
          background: 'linear-gradient(180deg, transparent, #f0f0f3, transparent)',
          boxShadow: '3px 0 6px rgba(209, 217, 230, 0.4)',
          animation: 'floatVerticalAccent 18s ease-in-out infinite'
        }}
      />
      
      <div
        className="absolute w-1 h-24 bottom-1/6 right-1/3"
        style={{
          background: 'linear-gradient(180deg, transparent, #f0f0f3, transparent)',
          boxShadow: '3px 0 6px rgba(209, 217, 230, 0.4)',
          animation: 'floatVerticalAccent 15s ease-in-out infinite reverse'
        }}
      />
    </div>
  )
}

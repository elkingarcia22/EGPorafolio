'use client'

import React from 'react'

interface GeometricShapeProps {
  className?: string
  style?: React.CSSProperties
}

const Circle: React.FC<GeometricShapeProps> = ({ className = '', style }) => (
  <div
    className={`absolute rounded-full ${className}`}
    style={{
      background: '#f5f5f0',
      boxShadow: '20px 20px 40px #d1d9e6, -20px -20px 40px #ffffff',
      ...style
    }}
  />
)

const Rectangle: React.FC<GeometricShapeProps> = ({ className = '', style }) => (
  <div
    className={`absolute ${className}`}
    style={{
      background: '#f5f5f0',
      boxShadow: '20px 20px 40px #d1d9e6, -20px -20px 40px #ffffff',
      ...style
    }}
  />
)

const Triangle: React.FC<GeometricShapeProps> = ({ className = '', style }) => (
  <div
    className={`absolute ${className}`}
    style={{
      width: 0,
      height: 0,
      background: 'transparent',
      boxShadow: '20px 20px 40px #d1d9e6, -20px -20px 40px #ffffff',
      ...style
    }}
  />
)

export const GeometricBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* LADO IZQUIERDO - Elementos del Home más concentrados */}
      
      {/* Card grande superior izquierdo */}
      <div
        className="w-[280px] h-[180px] -top-28 -left-36 rounded-3xl"
        style={{
          background: '#f5f5f0',
          boxShadow: '18px 18px 50px #d1d1c7, -18px -18px 50px #ffffff',
          animation: 'floatSlow 15s ease-in-out infinite'
        }}
      />
      
      {/* Botón circular pequeño */}
      <div
        className="w-[50px] h-[50px] top-16 -left-6 rounded-full"
        style={{
          background: '#f5f5f0',
          boxShadow: '6px 6px 12px #d1d1c7, -6px -6px 12px #ffffff',
          animation: 'float 5s ease-in-out infinite reverse'
        }}
      />
      
      {/* Card mediana centro izquierdo */}
      <div
        className="w-[160px] h-[100px] top-1/2 -left-20 rounded-2xl"
        style={{
          background: '#f5f5f0',
          boxShadow: '10px 10px 20px #d1d1c7, -10px -10px 20px #ffffff',
          animation: 'floatReverse 9s ease-in-out infinite'
        }}
      />
      
      {/* Input field pequeño */}
      <div
        className="w-[120px] h-[35px] top-2/3 -left-14 rounded-xl"
        style={{
          background: '#f5f5f0',
          boxShadow: 'inset 3px 3px 6px #d1d1c7, inset -3px -3px 6px #ffffff',
          animation: 'floatSlow 7s ease-in-out infinite'
        }}
      />
      
      {/* Card grande inferior izquierdo */}
      <div
        className="w-[220px] h-[140px] -bottom-16 -left-28 rounded-3xl"
        style={{
          background: '#f5f5f0',
          boxShadow: '16px 16px 32px #d1d1c7, -16px -16px 32px #ffffff',
          animation: 'float 12s ease-in-out infinite'
        }}
      />
      
      {/* LADO DERECHO - Interfaz Gráfica Neomórfica Completa */}
      
      {/* Header/Barra superior */}
      <div
        className="w-[400px] h-[60px] -top-16 -right-48 rounded-2xl"
        style={{
          background: '#f5f5f0',
          boxShadow: '20px 20px 40px #d1d1c7, -20px -20px 40px #ffffff',
          animation: 'floatReverse 18s ease-in-out infinite'
        }}
      />
      
      {/* Botón de cerrar */}
      <div
        className="w-[20px] h-[20px] -top-12 right-8 rounded-full"
        style={{
          background: '#f5f5f0',
          boxShadow: '4px 4px 8px #d1d1c7, -4px -4px 8px #ffffff',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      
      {/* Botón minimizar */}
      <div
        className="w-[20px] h-[20px] -top-12 right-12 rounded-full"
        style={{
          background: '#f5f5f0',
          boxShadow: '4px 4px 8px #d1d1c7, -4px -4px 8px #ffffff',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      
      {/* Botón maximizar */}
      <div
        className="w-[20px] h-[20px] -top-12 right-16 rounded-full"
        style={{
          background: '#f5f5f0',
          boxShadow: '4px 4px 8px #d1d1c7, -4px -4px 8px #ffffff',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      
      {/* Panel principal */}
      <div
        className="w-[380px] h-[300px] top-8 -right-46 rounded-3xl"
        style={{
          background: '#f5f5f0',
          boxShadow: '25px 25px 50px #d1d1c7, -25px -25px 50px #ffffff',
          animation: 'floatSlow 16s ease-in-out infinite'
        }}
      />
      
      {/* Sidebar izquierdo */}
      <div
        className="w-[80px] h-[250px] top-16 right-8 rounded-2xl"
        style={{
          background: '#f5f5f0',
          boxShadow: 'inset 8px 8px 16px #d1d1c7, inset -8px -8px 16px #ffffff',
          animation: 'floatReverse 12s ease-in-out infinite'
        }}
      />
      
      {/* Botones de navegación sidebar */}
      <div
        className="w-[50px] h-[50px] top-20 right-12 rounded-xl"
        style={{
          background: '#f5f5f0',
          boxShadow: '6px 6px 12px #d1d1c7, -6px -6px 12px #ffffff',
          animation: 'float 8s ease-in-out infinite'
        }}
      />
      
      <div
        className="w-[50px] h-[50px] top-32 right-12 rounded-xl"
        style={{
          background: '#f5f5f0',
          boxShadow: '6px 6px 12px #d1d1c7, -6px -6px 12px #ffffff',
          animation: 'float 8s ease-in-out infinite'
        }}
      />
      
      <div
        className="w-[50px] h-[50px] top-44 right-12 rounded-xl"
        style={{
          background: '#f5f5f0',
          boxShadow: '6px 6px 12px #d1d1c7, -6px -6px 12px #ffffff',
          animation: 'float 8s ease-in-out infinite'
        }}
      />
      
      {/* Área de contenido principal */}
      <div
        className="w-[280px] h-[200px] top-20 right-16 rounded-2xl"
        style={{
          background: '#f5f5f0',
          boxShadow: 'inset 10px 10px 20px #d1d1c7, inset -10px -10px 20px #ffffff',
          animation: 'floatSlow 14s ease-in-out infinite'
        }}
      />
      
      {/* Input field de búsqueda */}
      <div
        className="w-[200px] h-[40px] top-24 right-20 rounded-xl"
        style={{
          background: '#f5f5f0',
          boxShadow: 'inset 5px 5px 10px #d1d1c7, inset -5px -5px 10px #ffffff',
          animation: 'floatReverse 10s ease-in-out infinite'
        }}
      />
      
      {/* Botón de búsqueda */}
      <div
        className="w-[40px] h-[40px] top-24 right-32 rounded-xl"
        style={{
          background: '#f5f5f0',
          boxShadow: '6px 6px 12px #d1d1c7, -6px -6px 12px #ffffff',
          animation: 'float 7s ease-in-out infinite'
        }}
      />
      
      {/* Cards de contenido */}
      <div
        className="w-[120px] h-[80px] top-36 right-20 rounded-xl"
        style={{
          background: '#f5f5f0',
          boxShadow: '8px 8px 16px #d1d1c7, -8px -8px 16px #ffffff',
          animation: 'float 9s ease-in-out infinite'
        }}
      />
      
      <div
        className="w-[120px] h-[80px] top-36 right-48 rounded-xl"
        style={{
          background: '#f5f5f0',
          boxShadow: '8px 8px 16px #d1d1c7, -8px -8px 16px #ffffff',
          animation: 'float 9s ease-in-out infinite'
        }}
      />
      
      {/* Barra de herramientas inferior */}
      <div
        className="w-[360px] h-[50px] top-80 -right-44 rounded-2xl"
        style={{
          background: '#f5f5f0',
          boxShadow: '15px 15px 30px #d1d1c7, -15px -15px 30px #ffffff',
          animation: 'floatReverse 13s ease-in-out infinite'
        }}
      />
      
      {/* Botones de la barra de herramientas */}
      <div
        className="w-[30px] h-[30px] top-82 right-8 rounded-lg"
        style={{
          background: '#f5f5f0',
          boxShadow: '4px 4px 8px #d1d1c7, -4px -4px 8px #ffffff',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      
      <div
        className="w-[30px] h-[30px] top-82 right-16 rounded-lg"
        style={{
          background: '#f5f5f0',
          boxShadow: '4px 4px 8px #d1d1c7, -4px -4px 8px #ffffff',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      
      <div
        className="w-[30px] h-[30px] top-82 right-24 rounded-lg"
        style={{
          background: '#f5f5f0',
          boxShadow: '4px 4px 8px #d1d1c7, -4px -4px 8px #ffffff',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      
      {/* Slider/Control deslizante */}
      <div
        className="w-[100px] h-[20px] top-86 right-40 rounded-full"
        style={{
          background: '#f5f5f0',
          boxShadow: 'inset 3px 3px 6px #d1d1c7, inset -3px -3px 6px #ffffff',
          animation: 'floatSlow 11s ease-in-out infinite'
        }}
      />
      
      {/* Switch/Toggle */}
      <div
        className="w-[60px] h-[30px] top-88 right-56 rounded-full"
        style={{
          background: '#f5f5f0',
          boxShadow: 'inset 4px 4px 8px #d1d1c7, inset -4px -4px 8px #ffffff',
          animation: 'float 8s ease-in-out infinite'
        }}
      />
    </div>
  )
}


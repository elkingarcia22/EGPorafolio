'use client'

import React from 'react'

interface GeometricShapeProps {
  className?: string
  style?: React.CSSProperties
}

const Circle: React.FC<GeometricShapeProps> = ({ className = '', style }) => (
  <div
    className={`absolute rounded-full geometric-shape ${className}`}
    style={{
      background: '#f0f0f3',
      boxShadow: '20px 20px 40px #d1d9e6, -20px -20px 40px #ffffff',
      ...style
    }}
  />
)

const Rectangle: React.FC<GeometricShapeProps> = ({ className = '', style }) => (
  <div
    className={`absolute geometric-shape ${className}`}
    style={{
      background: '#f0f0f3',
      boxShadow: '20px 20px 40px #d1d9e6, -20px -20px 40px #ffffff',
      ...style
    }}
  />
)

const Triangle: React.FC<GeometricShapeProps> = ({ className = '', style }) => (
  <div
    className={`absolute geometric-triangle ${className}`}
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
      {/* Círculo grande superior izquierdo */}
      <Circle
        className="w-96 h-96 -top-48 -left-48"
        style={{
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      
      {/* Círculo mediano superior derecho */}
      <Circle
        className="w-64 h-64 -top-32 right-20"
        style={{
          animation: 'float 8s ease-in-out infinite reverse'
        }}
      />
      
      {/* Rectángulo grande inferior izquierdo */}
      <Rectangle
        className="w-80 h-80 -bottom-40 -left-40"
        style={{
          borderRadius: '30px',
          animation: 'float 10s ease-in-out infinite'
        }}
      />
      
      {/* Rectángulo mediano centro derecha */}
      <Rectangle
        className="w-48 h-48 top-1/2 right-10"
        style={{
          borderRadius: '20px',
          animation: 'float 7s ease-in-out infinite reverse'
        }}
      />
      
      {/* Triángulo grande inferior derecha */}
      <Triangle
        className="bottom-20 right-20"
        style={{
          borderLeft: '100px solid transparent',
          borderRight: '100px solid transparent',
          borderBottom: '173px solid #f0f0f3',
          animation: 'float 9s ease-in-out infinite'
        }}
      />
      
      {/* Círculo pequeño centro izquierda */}
      <Circle
        className="w-32 h-32 top-1/3 left-10"
        style={{
          animation: 'float 5s ease-in-out infinite reverse'
        }}
      />
      
      {/* Rectángulo pequeño superior centro */}
      <Rectangle
        className="w-24 h-24 top-20 left-1/2"
        style={{
          borderRadius: '15px',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      
      {/* Círculo mediano inferior centro */}
      <Circle
        className="w-40 h-40 bottom-32 left-1/3"
        style={{
          animation: 'float 8s ease-in-out infinite reverse'
        }}
      />
    </div>
  )
}

// Estilos CSS para las animaciones
const styles = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(5deg);
    }
  }
`

// Inyectar estilos
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}

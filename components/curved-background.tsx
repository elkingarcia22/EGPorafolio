'use client'

import React from 'react'

export const CurvedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Líneas curvas neumórficas */}
      
      {/* Curva principal superior */}
      <div
        className="absolute w-[800px] h-[400px] -top-32 -left-32"
        style={{
          background: 'transparent',
          border: '3px solid #f0f0f3',
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          boxShadow: 'inset 8px 8px 16px #d1d9e6, inset -8px -8px 16px #ffffff',
          animation: 'float 20s ease-in-out infinite'
        }}
      />
      
      {/* Curva secundaria */}
      <div
        className="absolute w-[600px] h-[300px] top-1/4 -right-40"
        style={{
          background: 'transparent',
          border: '2px solid #f0f0f3',
          borderRadius: '40% 60% 50% 50% / 50% 50% 60% 40%',
          boxShadow: 'inset 6px 6px 12px #d1d9e6, inset -6px -6px 12px #ffffff',
          animation: 'floatReverse 18s ease-in-out infinite'
        }}
      />
      
      {/* Curva inferior izquierda */}
      <div
        className="absolute w-[700px] h-[350px] -bottom-40 -left-20"
        style={{
          background: 'transparent',
          border: '2.5px solid #f0f0f3',
          borderRadius: '60% 40% 50% 50% / 40% 60% 50% 50%',
          boxShadow: 'inset 7px 7px 14px #d1d9e6, inset -7px -7px 14px #ffffff',
          animation: 'float 22s ease-in-out infinite'
        }}
      />
      
      {/* Curva central derecha */}
      <div
        className="absolute w-[500px] h-[250px] top-1/2 right-8"
        style={{
          background: 'transparent',
          border: '2px solid #f0f0f3',
          borderRadius: '50% 50% 60% 40% / 50% 50% 40% 60%',
          boxShadow: 'inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff',
          animation: 'floatReverse 16s ease-in-out infinite'
        }}
      />
      
      {/* Curva pequeña superior derecha */}
      <div
        className="absolute w-[300px] h-[150px] top-8 right-16"
        style={{
          background: 'transparent',
          border: '1.5px solid #f0f0f3',
          borderRadius: '70% 30% 50% 50% / 30% 70% 50% 50%',
          boxShadow: 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
          animation: 'float 14s ease-in-out infinite'
        }}
      />
      
      {/* Curva pequeña inferior derecha */}
      <div
        className="absolute w-[400px] h-[200px] bottom-16 right-24"
        style={{
          background: 'transparent',
          border: '2px solid #f0f0f3',
          borderRadius: '30% 70% 50% 50% / 70% 30% 50% 50%',
          boxShadow: 'inset 6px 6px 12px #d1d9e6, inset -6px -6px 12px #ffffff',
          animation: 'floatReverse 19s ease-in-out infinite'
        }}
      />
      
      {/* Curva central izquierda */}
      <div
        className="absolute w-[450px] h-[225px] top-1/3 left-8"
        style={{
          background: 'transparent',
          border: '2px solid #f0f0f3',
          borderRadius: '50% 50% 30% 70% / 50% 50% 70% 30%',
          boxShadow: 'inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff',
          animation: 'float 17s ease-in-out infinite'
        }}
      />
      
      {/* Curva pequeña central */}
      <div
        className="absolute w-[200px] h-[100px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'transparent',
          border: '1.5px solid #f0f0f3',
          borderRadius: '60% 40% 70% 30% / 40% 60% 30% 70%',
          boxShadow: 'inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff',
          animation: 'floatReverse 12s ease-in-out infinite'
        }}
      />
      
      {/* Curva superior izquierda */}
      <div
        className="absolute w-[350px] h-[175px] top-16 left-16"
        style={{
          background: 'transparent',
          border: '2px solid #f0f0f3',
          borderRadius: '40% 60% 70% 30% / 60% 40% 30% 70%',
          boxShadow: 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
          animation: 'float 15s ease-in-out infinite'
        }}
      />
      
      {/* Curva inferior central */}
      <div
        className="absolute w-[550px] h-[275px] bottom-8 left-1/2 transform -translate-x-1/2"
        style={{
          background: 'transparent',
          border: '2.5px solid #f0f0f3',
          borderRadius: '70% 30% 40% 60% / 30% 70% 60% 40%',
          boxShadow: 'inset 7px 7px 14px #d1d9e6, inset -7px -7px 14px #ffffff',
          animation: 'floatReverse 21s ease-in-out infinite'
        }}
      />
    </div>
  )
}

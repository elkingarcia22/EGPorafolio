'use client'

import React from 'react'

export const GeometricBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* LADO DERECHO - Interfaz Neumórfica de Aplicación */}
      
      {/* Ventana principal de la aplicación */}
      <div
        className="w-[420px] h-[500px] top-1/2 -right-52 transform -translate-y-1/2 rounded-3xl"
        style={{
          background: '#f0f0f3',
          boxShadow: '30px 30px 60px #d1d9e6, -30px -30px 60px #ffffff',
          animation: 'floatSlow 20s ease-in-out infinite'
        }}
      />
      
      {/* Barra de título de la ventana */}
      <div
        className="w-[400px] h-[50px] top-1/2 -right-50 transform -translate-y-1/2 -translate-y-225px rounded-t-3xl"
        style={{
          background: '#f0f0f3',
          boxShadow: 'inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff',
          animation: 'floatSlow 20s ease-in-out infinite'
        }}
      />
      
      {/* Botones de control de ventana */}
      <div
        className="w-[12px] h-[12px] top-1/2 -right-48 transform -translate-y-1/2 -translate-y-225px rounded-full"
        style={{
          background: '#ff5f57',
          boxShadow: '2px 2px 4px #d1d9e6, -2px -2px 4px #ffffff',
          animation: 'floatSlow 20s ease-in-out infinite'
        }}
      />
      
      <div
        className="w-[12px] h-[12px] top-1/2 -right-45 transform -translate-y-1/2 -translate-y-225px rounded-full"
        style={{
          background: '#ffbd2e',
          boxShadow: '2px 2px 4px #d1d9e6, -2px -2px 4px #ffffff',
          animation: 'floatSlow 20s ease-in-out infinite'
        }}
      />
      
      <div
        className="w-[12px] h-[12px] top-1/2 -right-42 transform -translate-y-1/2 -translate-y-225px rounded-full"
        style={{
          background: '#28ca42',
          boxShadow: '2px 2px 4px #d1d9e6, -2px -2px 4px #ffffff',
          animation: 'floatSlow 20s ease-in-out infinite'
        }}
      />
      
      {/* Sidebar de navegación */}
      <div
        className="w-[80px] h-[400px] top-1/2 -right-48 transform -translate-y-1/2 translate-y-25px rounded-2xl"
        style={{
          background: '#f0f0f3',
          boxShadow: 'inset 8px 8px 16px #d1d9e6, inset -8px -8px 16px #ffffff',
          animation: 'floatSlow 20s ease-in-out infinite'
        }}
      />
      
      {/* Botones de navegación del sidebar */}
      <div
        className="w-[50px] h-[50px] top-1/2 -right-46 transform -translate-y-1/2 translate-y-25px translate-y-120px rounded-xl"
        style={{
          background: '#f0f0f3',
          boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      
      <div
        className="w-[50px] h-[50px] top-1/2 -right-46 transform -translate-y-1/2 translate-y-25px translate-y-60px rounded-xl"
        style={{
          background: '#f0f0f3',
          boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      
      <div
        className="w-[50px] h-[50px] top-1/2 -right-46 transform -translate-y-1/2 translate-y-25px rounded-xl"
        style={{
          background: '#f0f0f3',
          boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      
      <div
        className="w-[50px] h-[50px] top-1/2 -right-46 transform -translate-y-1/2 translate-y-25px -translate-y-60px rounded-xl"
        style={{
          background: '#f0f0f3',
          boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      
      {/* Área de contenido principal */}
      <div
        className="w-[300px] h-[350px] top-1/2 -right-50 transform -translate-y-1/2 translate-y-25px translate-x-50px rounded-2xl"
        style={{
          background: '#f0f0f3',
          boxShadow: 'inset 10px 10px 20px #d1d9e6, inset -10px -10px 20px #ffffff',
          animation: 'floatSlow 20s ease-in-out infinite'
        }}
      />
      
      {/* Barra de búsqueda */}
      <div
        className="w-[250px] h-[40px] top-1/2 -right-50 transform -translate-y-1/2 translate-y-25px translate-x-50px translate-y-140px rounded-xl"
        style={{
          background: '#f0f0f3',
          boxShadow: 'inset 6px 6px 12px #d1d9e6, inset -6px -6px 12px #ffffff',
          animation: 'floatSlow 20s ease-in-out infinite'
        }}
      />
      
      {/* Botón de búsqueda */}
      <div
        className="w-[40px] h-[40px] top-1/2 -right-50 transform -translate-y-1/2 translate-y-25px translate-x-50px translate-y-140px translate-x-105px rounded-xl"
        style={{
          background: '#f0f0f3',
          boxShadow: '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff',
          animation: 'float 4s ease-in-out infinite'
        }}
      />
      
      {/* Cards de contenido */}
      <div
        className="w-[120px] h-[80px] top-1/2 -right-50 transform -translate-y-1/2 translate-y-25px translate-x-50px translate-y-80px rounded-xl"
        style={{
          background: '#f0f0f3',
          boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
          animation: 'float 8s ease-in-out infinite'
        }}
      />
      
      <div
        className="w-[120px] h-[80px] top-1/2 -right-50 transform -translate-y-1/2 translate-y-25px translate-x-50px translate-y-80px translate-x-65px rounded-xl"
        style={{
          background: '#f0f0f3',
          boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
          animation: 'float 8s ease-in-out infinite'
        }}
      />
      
      <div
        className="w-[120px] h-[80px] top-1/2 -right-50 transform -translate-y-1/2 translate-y-25px translate-x-50px translate-y-20px rounded-xl"
        style={{
          background: '#f0f0f3',
          boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
          animation: 'float 8s ease-in-out infinite'
        }}
      />
      
      <div
        className="w-[120px] h-[80px] top-1/2 -right-50 transform -translate-y-1/2 translate-y-25px translate-x-50px translate-y-20px translate-x-65px rounded-xl"
        style={{
          background: '#f0f0f3',
          boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
          animation: 'float 8s ease-in-out infinite'
        }}
      />
      
      {/* Barra de herramientas inferior */}
      <div
        className="w-[300px] h-[50px] top-1/2 -right-50 transform -translate-y-1/2 translate-y-25px translate-x-50px -translate-y-140px rounded-2xl"
        style={{
          background: '#f0f0f3',
          boxShadow: '12px 12px 24px #d1d9e6, -12px -12px 24px #ffffff',
          animation: 'floatSlow 20s ease-in-out infinite'
        }}
      />
      
      {/* Botones de la barra de herramientas */}
      <div
        className="w-[30px] h-[30px] top-1/2 -right-50 transform -translate-y-1/2 translate-y-25px translate-x-50px -translate-y-140px translate-x-120px rounded-lg"
        style={{
          background: '#f0f0f3',
          boxShadow: '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
          animation: 'float 5s ease-in-out infinite'
        }}
      />
      
      <div
        className="w-[30px] h-[30px] top-1/2 -right-50 transform -translate-y-1/2 translate-y-25px translate-x-50px -translate-y-140px translate-x-80px rounded-lg"
        style={{
          background: '#f0f0f3',
          boxShadow: '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
          animation: 'float 5s ease-in-out infinite'
        }}
      />
      
      <div
        className="w-[30px] h-[30px] top-1/2 -right-50 transform -translate-y-1/2 translate-y-25px translate-x-50px -translate-y-140px translate-x-40px rounded-lg"
        style={{
          background: '#f0f0f3',
          boxShadow: '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
          animation: 'float 5s ease-in-out infinite'
        }}
      />
      
      {/* Slider de volumen */}
      <div
        className="w-[80px] h-[20px] top-1/2 -right-50 transform -translate-y-1/2 translate-y-25px translate-x-50px -translate-y-140px translate-x-160px rounded-full"
        style={{
          background: '#f0f0f3',
          boxShadow: 'inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff',
          animation: 'floatSlow 15s ease-in-out infinite'
        }}
      />
      
      {/* Switch de configuración */}
      <div
        className="w-[50px] h-[25px] top-1/2 -right-50 transform -translate-y-1/2 translate-y-25px translate-x-50px -translate-y-140px translate-x-200px rounded-full"
        style={{
          background: '#f0f0f3',
          boxShadow: 'inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff',
          animation: 'float 7s ease-in-out infinite'
        }}
      />
      
      {/* Elementos flotantes adicionales */}
      <div
        className="w-[60px] h-[60px] top-1/4 -right-32 rounded-full"
        style={{
          background: '#f0f0f3',
          boxShadow: '12px 12px 24px #d1d9e6, -12px -12px 24px #ffffff',
          animation: 'float 10s ease-in-out infinite'
        }}
      />
      
      <div
        className="w-[40px] h-[40px] top-3/4 -right-40 rounded-xl"
        style={{
          background: '#f0f0f3',
          boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
          animation: 'floatReverse 12s ease-in-out infinite'
        }}
      />
      
      <div
        className="w-[80px] h-[30px] top-1/2 -right-20 transform -translate-y-1/2 rounded-xl"
        style={{
          background: '#f0f0f3',
          boxShadow: '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff',
          animation: 'float 9s ease-in-out infinite'
        }}
      />
    </div>
  )
}


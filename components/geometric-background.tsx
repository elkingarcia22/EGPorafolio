'use client'

import React from 'react'

export const GeometricBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* LADO DERECHO - Formas Neumórficas Simples y Elegantes */}
      
      {/* Círculo grande principal */}
      <div
        className="absolute w-80 h-80 top-20 right-8 rounded-full"
        style={{
          background: '#f0f0f3',
          boxShadow: '25px 25px 50px #d1d9e6, -25px -25px 50px #ffffff',
          animation: 'float 15s ease-in-out infinite'
        }}
      />
      
      {/* Rectángulo mediano */}
      <div
        className="absolute w-64 h-40 top-1/2 right-16 rounded-2xl"
        style={{
          background: '#f0f0f3',
          boxShadow: '20px 20px 40px #d1d9e6, -20px -20px 40px #ffffff',
          animation: 'floatReverse 12s ease-in-out infinite'
        }}
      />
      
      {/* Círculo pequeño flotante */}
      <div
        className="absolute w-32 h-32 top-1/3 right-32 rounded-full"
        style={{
          background: '#f0f0f3',
          boxShadow: '15px 15px 30px #d1d9e6, -15px -15px 30px #ffffff',
          animation: 'float 8s ease-in-out infinite'
        }}
      />
      
      {/* Rectángulo pequeño */}
      <div
        className="absolute w-48 h-24 top-3/4 right-12 rounded-xl"
        style={{
          background: '#f0f0f3',
          boxShadow: '12px 12px 24px #d1d9e6, -12px -12px 24px #ffffff',
          animation: 'floatReverse 10s ease-in-out infinite'
        }}
      />
      
      {/* Círculo mediano */}
      <div
        className="absolute w-40 h-40 top-16 right-40 rounded-full"
        style={{
          background: '#f0f0f3',
          boxShadow: '18px 18px 36px #d1d9e6, -18px -18px 36px #ffffff',
          animation: 'float 14s ease-in-out infinite'
        }}
      />
      
      {/* Rectángulo largo */}
      <div
        className="absolute w-56 h-20 top-2/3 right-48 rounded-xl"
        style={{
          background: '#f0f0f3',
          boxShadow: '16px 16px 32px #d1d9e6, -16px -16px 32px #ffffff',
          animation: 'float 11s ease-in-out infinite'
        }}
      />
      
      {/* Círculo pequeño superior */}
      <div
        className="absolute w-24 h-24 top-8 right-24 rounded-full"
        style={{
          background: '#f0f0f3',
          boxShadow: '10px 10px 20px #d1d9e6, -10px -10px 20px #ffffff',
          animation: 'floatReverse 9s ease-in-out infinite'
        }}
      />
      
      {/* Rectángulo vertical */}
      <div
        className="absolute w-20 h-48 top-1/4 right-56 rounded-xl"
        style={{
          background: '#f0f0f3',
          boxShadow: '14px 14px 28px #d1d9e6, -14px -14px 28px #ffffff',
          animation: 'float 13s ease-in-out infinite'
        }}
      />
      
      {/* Elementos flotantes adicionales */}
      <div
        className="absolute w-16 h-16 top-1/2 right-4 rounded-full"
        style={{
          background: '#f0f0f3',
          boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
          animation: 'float 7s ease-in-out infinite'
        }}
      />
      
      <div
        className="absolute w-28 h-14 top-5/6 right-36 rounded-lg"
        style={{
          background: '#f0f0f3',
          boxShadow: '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff',
          animation: 'floatReverse 6s ease-in-out infinite'
        }}
      />
    </div>
  )
}


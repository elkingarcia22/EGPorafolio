'use client'

import React from 'react'

export const CirclesBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Círculo gigante principal */}
      <div
        className="absolute w-[600px] h-[600px] top-1/2 right-[-200px] transform -translate-y-1/2 rounded-full"
        style={{
          background: '#f0f0f3',
          boxShadow: '40px 40px 80px #d1d9e6, -40px -40px 80px #ffffff',
          animation: 'floatGiant 25s ease-in-out infinite'
        }}
      />
      
      {/* Círculo grande superior */}
      <div
        className="absolute w-[400px] h-[400px] top-20 right-[-100px] rounded-full"
        style={{
          background: '#f0f0f3',
          boxShadow: '30px 30px 60px #d1d9e6, -30px -30px 60px #ffffff',
          animation: 'floatBig 20s ease-in-out infinite reverse'
        }}
      />
      
      {/* Círculo mediano central */}
      <div
        className="absolute w-[300px] h-[300px] top-1/2 right-[-50px] transform -translate-y-1/2 rounded-full"
        style={{
          background: '#f0f0f3',
          boxShadow: '25px 25px 50px #d1d9e6, -25px -25px 50px #ffffff',
          animation: 'floatMedium 18s ease-in-out infinite'
        }}
      />
      
      {/* Círculo grande inferior */}
      <div
        className="absolute w-[450px] h-[450px] bottom-20 right-[-150px] rounded-full"
        style={{
          background: '#f0f0f3',
          boxShadow: '35px 35px 70px #d1d9e6, -35px -35px 70px #ffffff',
          animation: 'floatBig 22s ease-in-out infinite reverse'
        }}
      />
      
      {/* Círculo mediano superior derecho */}
      <div
        className="absolute w-[250px] h-[250px] top-32 right-16 rounded-full"
        style={{
          background: '#f0f0f3',
          boxShadow: '20px 20px 40px #d1d9e6, -20px -20px 40px #ffffff',
          animation: 'floatMedium 16s ease-in-out infinite'
        }}
      />
      
      {/* Círculo pequeño flotante */}
      <div
        className="absolute w-[150px] h-[150px] top-1/3 right-32 rounded-full"
        style={{
          background: '#f0f0f3',
          boxShadow: '15px 15px 30px #d1d9e6, -15px -15px 30px #ffffff',
          animation: 'floatSmall 14s ease-in-out infinite reverse'
        }}
      />
      
      {/* Círculo mediano inferior derecho */}
      <div
        className="absolute w-[200px] h-[200px] bottom-32 right-24 rounded-full"
        style={{
          background: '#f0f0f3',
          boxShadow: '18px 18px 36px #d1d9e6, -18px -18px 36px #ffffff',
          animation: 'floatMedium 19s ease-in-out infinite'
        }}
      />
      
      {/* Círculo pequeño central derecho */}
      <div
        className="absolute w-[120px] h-[120px] top-1/2 right-40 transform -translate-y-1/2 rounded-full"
        style={{
          background: '#f0f0f3',
          boxShadow: '12px 12px 24px #d1d9e6, -12px -12px 24px #ffffff',
          animation: 'floatSmall 12s ease-in-out infinite reverse'
        }}
      />
      
      {/* Círculo extra grande superior */}
      <div
        className="absolute w-[500px] h-[500px] top-[-100px] right-[-100px] rounded-full"
        style={{
          background: '#f0f0f3',
          boxShadow: '38px 38px 76px #d1d9e6, -38px -38px 76px #ffffff',
          animation: 'floatExtraBig 24s ease-in-out infinite'
        }}
      />
      
      {/* Círculo extra grande inferior */}
      <div
        className="absolute w-[550px] h-[550px] bottom-[-150px] right-[-200px] rounded-full"
        style={{
          background: '#f0f0f3',
          boxShadow: '42px 42px 84px #d1d9e6, -42px -42px 84px #ffffff',
          animation: 'floatExtraBig 26s ease-in-out infinite reverse'
        }}
      />
      
      {/* Círculo mediano flotante */}
      <div
        className="absolute w-[180px] h-[180px] top-2/3 right-48 rounded-full"
        style={{
          background: '#f0f0f3',
          boxShadow: '16px 16px 32px #d1d9e6, -16px -16px 32px #ffffff',
          animation: 'floatMedium 17s ease-in-out infinite'
        }}
      />
      
      {/* Círculo pequeño superior */}
      <div
        className="absolute w-[100px] h-[100px] top-16 right-56 rounded-full"
        style={{
          background: '#f0f0f3',
          boxShadow: '10px 10px 20px #d1d9e6, -10px -10px 20px #ffffff',
          animation: 'floatSmall 11s ease-in-out infinite reverse'
        }}
      />
    </div>
  )
}

'use client'

import React from 'react'

export const Floating3DBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Cubo 3D principal */}
      <div
        className="absolute w-32 h-32 top-20 right-16"
        style={{
          background: '#f0f0f3',
          transform: 'rotateX(45deg) rotateY(45deg)',
          boxShadow: `
            20px 20px 40px #d1d9e6, 
            -20px -20px 40px #ffffff,
            inset 10px 10px 20px #d1d9e6,
            inset -10px -10px 20px #ffffff
          `,
          animation: 'float3D 15s ease-in-out infinite'
        }}
      />
      
      {/* Esfera flotante */}
      <div
        className="absolute w-24 h-24 top-1/3 left-12 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #ffffff, #f0f0f3)',
          boxShadow: `
            15px 15px 30px #d1d9e6, 
            -15px -15px 30px #ffffff,
            inset 5px 5px 10px #d1d9e6,
            inset -5px -5px 10px #ffffff
          `,
          animation: 'floatSphere 12s ease-in-out infinite'
        }}
      />
      
      {/* Pirámide 3D */}
      <div
        className="absolute w-0 h-0 top-1/2 right-1/3"
        style={{
          borderLeft: '30px solid transparent',
          borderRight: '30px solid transparent',
          borderBottom: '50px solid #f0f0f3',
          filter: 'drop-shadow(10px 10px 20px #d1d9e6) drop-shadow(-10px -10px 20px #ffffff)',
          animation: 'floatPyramid 18s ease-in-out infinite'
        }}
      />
      
      {/* Cilindro horizontal */}
      <div
        className="absolute w-40 h-20 top-3/4 left-1/4 rounded-full"
        style={{
          background: 'linear-gradient(90deg, #f0f0f3, #e8e8eb)',
          boxShadow: `
            12px 12px 24px #d1d9e6, 
            -12px -12px 24px #ffffff,
            inset 6px 6px 12px #d1d9e6,
            inset -6px -6px 12px #ffffff
          `,
          animation: 'floatCylinder 14s ease-in-out infinite'
        }}
      />
      
      {/* Cubo pequeño flotante */}
      <div
        className="absolute w-16 h-16 top-1/4 right-1/2"
        style={{
          background: '#f0f0f3',
          transform: 'rotateX(30deg) rotateY(60deg)',
          boxShadow: `
            8px 8px 16px #d1d9e6, 
            -8px -8px 16px #ffffff,
            inset 4px 4px 8px #d1d9e6,
            inset -4px -4px 8px #ffffff
          `,
          animation: 'floatSmallCube 10s ease-in-out infinite'
        }}
      />
      
      {/* Esfera grande inferior */}
      <div
        className="absolute w-36 h-36 bottom-20 left-16 rounded-full"
        style={{
          background: 'radial-gradient(circle at 40% 40%, #ffffff, #f0f0f3)',
          boxShadow: `
            18px 18px 36px #d1d9e6, 
            -18px -18px 36px #ffffff,
            inset 8px 8px 16px #d1d9e6,
            inset -8px -8px 16px #ffffff
          `,
          animation: 'floatBigSphere 20s ease-in-out infinite'
        }}
      />
      
      {/* Cubo medio superior izquierda */}
      <div
        className="absolute w-20 h-20 top-16 left-1/3"
        style={{
          background: '#f0f0f3',
          transform: 'rotateX(60deg) rotateY(30deg)',
          boxShadow: `
            10px 10px 20px #d1d9e6, 
            -10px -10px 20px #ffffff,
            inset 5px 5px 10px #d1d9e6,
            inset -5px -5px 10px #ffffff
          `,
          animation: 'floatMediumCube 16s ease-in-out infinite'
        }}
      />
      
      {/* Cilindro vertical */}
      <div
        className="absolute w-16 h-32 top-1/2 right-8 rounded-full"
        style={{
          background: 'linear-gradient(180deg, #f0f0f3, #e8e8eb)',
          boxShadow: `
            10px 10px 20px #d1d9e6, 
            -10px -10px 20px #ffffff,
            inset 5px 5px 10px #d1d9e6,
            inset -5px -5px 10px #ffffff
          `,
          animation: 'floatVerticalCylinder 13s ease-in-out infinite'
        }}
      />
      
      {/* Esfera pequeña flotante */}
      <div
        className="absolute w-12 h-12 top-2/3 left-2/3 rounded-full"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #ffffff, #f0f0f3)',
          boxShadow: `
            6px 6px 12px #d1d9e6, 
            -6px -6px 12px #ffffff,
            inset 3px 3px 6px #d1d9e6,
            inset -3px -3px 6px #ffffff
          `,
          animation: 'floatTinySphere 8s ease-in-out infinite'
        }}
      />
      
      {/* Cubo grande central */}
      <div
        className="absolute w-28 h-28 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          background: '#f0f0f3',
          transform: 'translate(-50%, -50%) rotateX(45deg) rotateY(45deg)',
          boxShadow: `
            15px 15px 30px #d1d9e6, 
            -15px -15px 30px #ffffff,
            inset 8px 8px 16px #d1d9e6,
            inset -8px -8px 16px #ffffff
          `,
          animation: 'floatCentralCube 17s ease-in-out infinite'
        }}
      />
      
      {/* Pirámide pequeña */}
      <div
        className="absolute w-0 h-0 top-1/4 left-1/4"
        style={{
          borderLeft: '20px solid transparent',
          borderRight: '20px solid transparent',
          borderBottom: '35px solid #f0f0f3',
          filter: 'drop-shadow(8px 8px 16px #d1d9e6) drop-shadow(-8px -8px 16px #ffffff)',
          animation: 'floatSmallPyramid 11s ease-in-out infinite'
        }}
      />
      
      {/* Cilindro diagonal */}
      <div
        className="absolute w-24 h-12 top-3/4 right-1/4 rounded-full"
        style={{
          background: 'linear-gradient(45deg, #f0f0f3, #e8e8eb)',
          transform: 'rotate(45deg)',
          boxShadow: `
            8px 8px 16px #d1d9e6, 
            -8px -8px 16px #ffffff,
            inset 4px 4px 8px #d1d9e6,
            inset -4px -4px 8px #ffffff
          `,
          animation: 'floatDiagonalCylinder 19s ease-in-out infinite'
        }}
      />
    </div>
  )
}

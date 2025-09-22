'use client'

import React from 'react'
import { useEGLogo } from '@/hooks/useEGLogo'

interface EGLogoDisplayProps {
  position?: 'left' | 'right' | 'center' | 'background'
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  className?: string
}

export const EGLogoDisplay: React.FC<EGLogoDisplayProps> = ({ 
  position = 'left', 
  size = 'large',
  className = ''
}) => {
  const { image, loading, error } = useEGLogo(position)

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="animate-pulse bg-gray-300 rounded-lg w-96 h-96"></div>
      </div>
    )
  }

  if (error || !image) {
    // Fallback: mostrar imagen por defecto
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div 
          className="relative"
          style={{
            width: '600px',
            height: '800px',
            background: 'linear-gradient(135deg, #4FC3F7 0%, #26C6DA 50%, #66BB6A 100%)',
            borderRadius: '30px',
            boxShadow: `
              inset 25px 25px 50px rgba(0, 0, 0, 0.3),
              inset -25px -25px 50px rgba(255, 255, 255, 0.8),
              0 0 0 2px rgba(0, 0, 0, 0.1)
            `,
            position: 'relative'
          }}
        >
          {/* Letras EG dentro de la imagen */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto',
              fontWeight: 900,
              fontSize: '300px',
              letterSpacing: '20px',
              color: 'white',
              textShadow: `
                inset 15px 15px 30px rgba(0, 0, 0, 0.4),
                inset -15px -15px 30px rgba(255, 255, 255, 0.6)
              `,
              filter: 'drop-shadow(0 0 0 transparent)'
            }}
          >
            EG
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src={image.image_url}
        alt={image.image_alt || 'Logo EG'}
        className="max-w-full max-h-full object-contain"
        style={{
          width: size === 'large' ? '600px' : size === 'medium' ? '400px' : size === 'small' ? '200px' : '100%',
          height: size === 'large' ? '800px' : size === 'medium' ? '600px' : size === 'small' ? '300px' : '100vh',
          borderRadius: '30px',
          boxShadow: `
            inset 25px 25px 50px rgba(0, 0, 0, 0.3),
            inset -25px -25px 50px rgba(255, 255, 255, 0.8),
            0 0 0 2px rgba(0, 0, 0, 0.1)
          `
        }}
      />
    </div>
  )
}

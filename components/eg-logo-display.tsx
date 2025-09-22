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
    // Fallback: mostrar imagen por defecto desde URL externa
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop&crop=center"
          alt="Logo EG con efecto neumórfico"
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

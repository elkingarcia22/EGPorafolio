'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useDesignTokens } from '@/hooks/useDesignTokens'

interface ProjectImageProps {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
  alignment?: 'left' | 'center' | 'right'
  styling?: {
    borderRadius?: string
    boxShadow?: string
    marginTop?: string
    marginBottom?: string
    maxWidth?: string
  }
  className?: string
  priority?: boolean
}

export function ProjectImage({ 
  src, 
  alt, 
  caption,
  width,
  height,
  alignment = 'center', 
  styling = {},
  className = '',
  priority = false
}: ProjectImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const designTokens = useDesignTokens()
  
  const alignmentClasses = {
    left: 'mx-0 mr-auto',
    center: 'mx-auto',
    right: 'mx-0 ml-auto'
  }
  
  const customStyles = {
    ...(styling.borderRadius && { borderRadius: styling.borderRadius }),
    ...(styling.boxShadow && { boxShadow: styling.boxShadow }),
    ...(styling.marginTop && { marginTop: styling.marginTop }),
    ...(styling.marginBottom && { marginBottom: styling.marginBottom }),
    ...(styling.maxWidth && { maxWidth: styling.maxWidth })
  }
  
  return (
    <div className={`${alignmentClasses[alignment]} ${className}`} style={customStyles}>
      <div className="relative group">
        {isLoading && (
          <div 
            className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"
            style={{ 
              width: width || '100%', 
              height: height || '400px' 
            }}
          />
        )}
        
        {hasError ? (
          <div 
            className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
            style={{ 
              width: width || '100%', 
              height: height || '400px' 
            }}
          >
            <div className="text-center text-gray-500 dark:text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Error al cargar imagen</p>
            </div>
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width || 800}
            height={height || 600}
            className={`
              transition-all duration-300 ease-in-out
              ${isLoading ? 'opacity-0' : 'opacity-100'}
              rounded-lg
              group-hover:scale-[1.02]
              group-hover:shadow-xl
            `}
            style={{
              background: designTokens.colors.primary.gradient,
              opacity: 0.1
            }}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setHasError(true)
            }}
            priority={priority}
          />
        )}
        
        {/* Overlay con gradiente al hover */}
        <div 
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          style={{ background: designTokens.colors.primary.gradient }}
        />
      </div>
      
      {caption && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">
          {caption}
        </p>
      )}
    </div>
  )
}

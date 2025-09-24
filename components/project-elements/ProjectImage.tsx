'use client'

import { useState } from 'react'

interface ProjectImageProps {
  content: {
    src: string
    alt: string
    caption?: string
    width?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    alignment?: 'left' | 'center' | 'right'
    rounded?: boolean
    shadow?: boolean
  }
}

export function ProjectImage({ content }: ProjectImageProps) {
  const [imageError, setImageError] = useState(false)
  const { 
    src, 
    alt, 
    caption, 
    width = 'full', 
    alignment = 'center', 
    rounded = true, 
    shadow = true 
  } = content

  const getWidthClasses = () => {
    const widthClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'w-full'
    }
    return widthClasses[width]
  }

  const getAlignmentClasses = () => {
    const alignmentClasses = {
      left: 'mx-0',
      center: 'mx-auto',
      right: 'ml-auto mr-0'
    }
    return alignmentClasses[alignment]
  }

  const getImageClasses = () => {
    let classes = 'block object-cover'
    
    if (rounded) {
      classes += ' rounded-lg'
    }
    
    if (shadow) {
      classes += ' shadow-lg'
    }
    
    return classes
  }

  if (imageError) {
    return (
      <div className={`${getWidthClasses()} ${getAlignmentClasses()}`}>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">Error al cargar la imagen</p>
        </div>
        {caption && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
            {caption}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={`${getWidthClasses()} ${getAlignmentClasses()}`}>
      <img 
        src={src} 
        alt={alt}
        className={getImageClasses()}
        onError={() => setImageError(true)}
        loading="lazy"
      />
      {caption && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
          {caption}
        </p>
      )}
    </div>
  )
}
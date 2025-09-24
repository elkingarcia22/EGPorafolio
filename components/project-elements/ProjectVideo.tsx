'use client'

import { useState } from 'react'

interface ProjectVideoProps {
  content: {
    src: string
    poster?: string
    caption?: string
    width?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    alignment?: 'left' | 'center' | 'right'
    autoplay?: boolean
    controls?: boolean
    loop?: boolean
    muted?: boolean
  }
}

export function ProjectVideo({ content }: ProjectVideoProps) {
  const [videoError, setVideoError] = useState(false)
  const { 
    src, 
    poster, 
    caption, 
    width = 'full', 
    alignment = 'center',
    autoplay = false,
    controls = true,
    loop = false,
    muted = true
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

  if (videoError) {
    return (
      <div className={`${getWidthClasses()} ${getAlignmentClasses()}`}>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">Error al cargar el video</p>
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
      <video 
        src={src}
        poster={poster}
        className="w-full rounded-lg shadow-lg"
        controls={controls}
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        onError={() => setVideoError(true)}
      >
        Tu navegador no soporta el elemento de video.
      </video>
      {caption && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
          {caption}
        </p>
      )}
    </div>
  )
}
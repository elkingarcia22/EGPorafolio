'use client'

import { useState } from 'react'
import { useDesignTokens } from '@/hooks/useDesignTokens'

interface ProjectVideoProps {
  src: string
  thumbnail?: string
  title?: string
  platform?: 'youtube' | 'vimeo' | 'direct' | 'embed'
  embedCode?: string
  alignment?: 'left' | 'center' | 'right'
  styling?: {
    borderRadius?: string
    boxShadow?: string
    marginTop?: string
    marginBottom?: string
    maxWidth?: string
  }
  className?: string
}

export function ProjectVideo({ 
  src, 
  thumbnail,
  title,
  platform = 'direct',
  embedCode,
  alignment = 'center', 
  styling = {},
  className = ''
}: ProjectVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)
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
  
  const handlePlay = () => {
    setIsPlaying(true)
  }
  
  const renderVideo = () => {
    if (platform === 'embed' && embedCode) {
      return (
        <div 
          className="w-full"
          dangerouslySetInnerHTML={{ __html: embedCode }}
        />
      )
    }
    
    if (platform === 'youtube') {
      const videoId = src.includes('youtube.com/watch?v=') 
        ? src.split('v=')[1]?.split('&')[0]
        : src.includes('youtu.be/')
        ? src.split('youtu.be/')[1]?.split('?')[0]
        : null
        
      if (videoId) {
        return (
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title || 'Video'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        )
      }
    }
    
    if (platform === 'vimeo') {
      const videoId = src.includes('vimeo.com/')
        ? src.split('vimeo.com/')[1]?.split('?')[0]
        : null
        
      if (videoId) {
        return (
          <iframe
            width="100%"
            height="400"
            src={`https://player.vimeo.com/video/${videoId}`}
            title={title || 'Video'}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        )
      }
    }
    
    // Video directo
    return (
      <div className="relative group">
        {!isPlaying && thumbnail && (
          <div 
            className="relative cursor-pointer"
            onClick={handlePlay}
          >
            <img
              src={thumbnail}
              alt={title || 'Video thumbnail'}
              className="w-full h-auto rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{ background: designTokens.colors.primary.gradient }}
              >
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            <div 
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"
              style={{ background: designTokens.colors.primary.gradient }}
            />
          </div>
        )}
        
        {isPlaying && (
          <video
            controls
            autoPlay
            className="w-full h-auto rounded-lg"
            onEnded={() => setIsPlaying(false)}
          >
            <source src={src} type="video/mp4" />
            Tu navegador no soporta el elemento video.
          </video>
        )}
      </div>
    )
  }
  
  return (
    <div className={`${alignmentClasses[alignment]} ${className}`} style={customStyles}>
      {renderVideo()}
      {title && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">
          {title}
        </p>
      )}
    </div>
  )
}

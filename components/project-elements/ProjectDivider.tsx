'use client'

import { useDesignTokens } from '@/hooks/useDesignTokens'

interface ProjectDividerProps {
  alignment?: 'left' | 'center' | 'right'
  styling?: {
    height?: string
    width?: string
    color?: string
    marginTop?: string
    marginBottom?: string
  }
  className?: string
}

export function ProjectDivider({ 
  alignment = 'center', 
  styling = {},
  className = ''
}: ProjectDividerProps) {
  const designTokens = useDesignTokens()
  
  const alignmentClasses = {
    left: 'mx-0 mr-auto',
    center: 'mx-auto',
    right: 'mx-0 ml-auto'
  }
  
  const customStyles = {
    height: styling.height || '2px',
    width: styling.width || '100px',
    ...(styling.color && { backgroundColor: styling.color }),
    ...(styling.marginTop && { marginTop: styling.marginTop }),
    ...(styling.marginBottom && { marginBottom: styling.marginBottom })
  }
  
  return (
    <div 
      className={`${alignmentClasses[alignment]} ${className}`}
      style={{
        ...customStyles,
        ...(styling.color ? {} : { 
          background: designTokens.colors.primary.gradient 
        })
      }}
    />
  )
}

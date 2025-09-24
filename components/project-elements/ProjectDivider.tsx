'use client'

import { useDesignTokens } from '@/hooks/useDesignTokens'

interface ProjectDividerProps {
  content: {
    style?: 'line' | 'gradient' | 'dotted' | 'dashed'
    thickness?: 'thin' | 'medium' | 'thick'
    width?: 'sm' | 'md' | 'lg' | 'full'
    alignment?: 'left' | 'center' | 'right'
  }
}

export function ProjectDivider({ content }: ProjectDividerProps) {
  const designTokens = useDesignTokens()
  const { 
    style = 'line', 
    thickness = 'medium', 
    width = 'md', 
    alignment = 'center' 
  } = content

  const getThicknessClasses = () => {
    const thicknessClasses = {
      thin: 'h-px',
      medium: 'h-0.5',
      thick: 'h-1'
    }
    return thicknessClasses[thickness]
  }

  const getWidthClasses = () => {
    const widthClasses = {
      sm: 'w-16',
      md: 'w-32',
      lg: 'w-48',
      full: 'w-full'
    }
    return widthClasses[width]
  }

  const getAlignmentClasses = () => {
    const alignmentClasses = {
      left: 'mr-auto',
      center: 'mx-auto',
      right: 'ml-auto'
    }
    return alignmentClasses[alignment]
  }

  const getStyleClasses = () => {
    const styleClasses = {
      line: 'bg-gray-300 dark:bg-gray-600',
      gradient: '',
      dotted: 'border-dotted border-t-2 border-gray-300 dark:border-gray-600',
      dashed: 'border-dashed border-t-2 border-gray-300 dark:border-gray-600'
    }
    return styleClasses[style]
  }

  const getStyleProperties = () => {
    if (style === 'gradient') {
      return {
        background: designTokens.colors.primary.gradient
      }
    }
    return {}
  }

  return (
    <div 
      className={`${getThicknessClasses()} ${getWidthClasses()} ${getAlignmentClasses()} ${getStyleClasses()}`}
      style={getStyleProperties()}
    />
  )
}
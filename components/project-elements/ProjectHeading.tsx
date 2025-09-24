'use client'

import { useDesignTokens } from '@/hooks/useDesignTokens'

interface ProjectHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  text: string
  alignment?: 'left' | 'center' | 'right'
  styling?: {
    fontSize?: string
    fontWeight?: string
    color?: string
    marginTop?: string
    marginBottom?: string
  }
  className?: string
}

export function ProjectHeading({ 
  level, 
  text, 
  alignment = 'left', 
  styling = {},
  className = ''
}: ProjectHeadingProps) {
  const designTokens = useDesignTokens()
  
  const Tag = `h${level}` as keyof JSX.IntrinsicElements
  
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }
  
  const sizeClasses = {
    1: 'text-4xl md:text-5xl lg:text-6xl',
    2: 'text-3xl md:text-4xl lg:text-5xl',
    3: 'text-2xl md:text-3xl lg:text-4xl',
    4: 'text-xl md:text-2xl lg:text-3xl',
    5: 'text-lg md:text-xl lg:text-2xl',
    6: 'text-base md:text-lg lg:text-xl'
  }
  
  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }
  
  const customStyles = {
    ...(styling.fontSize && { fontSize: styling.fontSize }),
    ...(styling.color && { color: styling.color }),
    ...(styling.marginTop && { marginTop: styling.marginTop }),
    ...(styling.marginBottom && { marginBottom: styling.marginBottom })
  }
  
  const fontWeightClass = styling.fontWeight 
    ? weightClasses[styling.fontWeight as keyof typeof weightClasses] || 'font-normal'
    : 'font-normal'
  
  return (
    <Tag 
      className={`
        ${sizeClasses[level]}
        ${fontWeightClass}
        ${alignmentClasses[alignment]}
        text-gray-900 dark:text-white
        leading-tight
        ${className}
      `}
      style={{
        ...customStyles,
        ...(styling.color ? {} : { 
          background: designTokens.colors.primary.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        })
      }}
    >
      {text}
    </Tag>
  )
}

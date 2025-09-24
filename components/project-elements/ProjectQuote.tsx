'use client'

import { useDesignTokens } from '@/hooks/useDesignTokens'

interface ProjectQuoteProps {
  text: string
  author?: string
  alignment?: 'left' | 'center' | 'right'
  styling?: {
    fontSize?: string
    fontWeight?: string
    color?: string
    backgroundColor?: string
    borderColor?: string
    padding?: string
    marginTop?: string
    marginBottom?: string
  }
  className?: string
}

export function ProjectQuote({ 
  text, 
  author,
  alignment = 'center', 
  styling = {},
  className = ''
}: ProjectQuoteProps) {
  const designTokens = useDesignTokens()
  
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
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
    ...(styling.backgroundColor && { backgroundColor: styling.backgroundColor }),
    ...(styling.borderColor && { borderColor: styling.borderColor }),
    ...(styling.padding && { padding: styling.padding }),
    ...(styling.marginTop && { marginTop: styling.marginTop }),
    ...(styling.marginBottom && { marginBottom: styling.marginBottom })
  }
  
  const fontWeightClass = styling.fontWeight 
    ? weightClasses[styling.fontWeight as keyof typeof weightClasses] || 'font-normal'
    : 'font-normal'
  
  return (
    <blockquote 
      className={`
        ${alignmentClasses[alignment]}
        ${fontWeightClass}
        relative
        p-6
        rounded-lg
        border-l-4
        bg-gray-50 dark:bg-gray-800
        border-gray-200 dark:border-gray-700
        ${className}
      `}
      style={{
        ...customStyles,
        ...(styling.borderColor ? {} : { 
          borderLeftColor: 'transparent',
          borderImage: `linear-gradient(135deg, ${designTokens.colors.primary.gradient}) 1`
        })
      }}
    >
      <div className="relative">
        {/* Icono de comillas */}
        <div 
          className="absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: designTokens.colors.primary.gradient }}
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
          </svg>
        </div>
        
        <p 
          className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed pl-6"
          style={customStyles.color ? { color: customStyles.color } : {}}
        >
          {text}
        </p>
        
        {author && (
          <footer className="mt-4 pl-6">
            <cite className="text-sm text-gray-600 dark:text-gray-400 not-italic">
              — {author}
            </cite>
          </footer>
        )}
      </div>
    </blockquote>
  )
}

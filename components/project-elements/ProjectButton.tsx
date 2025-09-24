'use client'

import { useDesignTokens } from '@/hooks/useDesignTokens'

interface ProjectButtonProps {
  content: {
    text: string
    url?: string
    variant?: 'primary' | 'secondary' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    alignment?: 'left' | 'center' | 'right'
    target?: '_blank' | '_self'
  }
}

export function ProjectButton({ content }: ProjectButtonProps) {
  const designTokens = useDesignTokens()
  const { 
    text, 
    url, 
    variant = 'primary', 
    size = 'md', 
    alignment = 'center',
    target = '_self'
  } = content

  const getSizeClasses = () => {
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    }
    return sizeClasses[size]
  }

  const getAlignmentClasses = () => {
    const alignmentClasses = {
      left: 'mr-auto',
      center: 'mx-auto',
      right: 'ml-auto'
    }
    return alignmentClasses[alignment]
  }

  const getVariantClasses = () => {
    const variantClasses = {
      primary: 'text-white font-medium transition-all duration-300 hover:shadow-lg',
      secondary: 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 font-medium transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700',
      outline: 'text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 font-medium transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800'
    }
    return variantClasses[variant]
  }

  const getVariantStyle = () => {
    if (variant === 'primary') {
      return {
        background: designTokens.colors.primary.gradient
      }
    }
    return {}
  }

  const buttonClasses = `inline-block rounded-lg ${getSizeClasses()} ${getAlignmentClasses()} ${getVariantClasses()}`

  if (url) {
    return (
      <div className="flex justify-center">
        <a 
          href={url}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className={buttonClasses}
          style={getVariantStyle()}
        >
          {text}
        </a>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <button 
        className={buttonClasses}
        style={getVariantStyle()}
      >
        {text}
      </button>
    </div>
  )
}
'use client'

import { useDesignTokens } from '@/hooks/useDesignTokens'

interface ProjectButtonProps {
  text: string
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  alignment?: 'left' | 'center' | 'right'
  styling?: {
    backgroundColor?: string
    textColor?: string
    borderRadius?: string
    padding?: string
    marginTop?: string
    marginBottom?: string
  }
  className?: string
  disabled?: boolean
}

export function ProjectButton({ 
  text, 
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  alignment = 'center', 
  styling = {},
  className = '',
  disabled = false
}: ProjectButtonProps) {
  const designTokens = useDesignTokens()
  
  const alignmentClasses = {
    left: 'mx-0 mr-auto',
    center: 'mx-auto',
    right: 'mx-0 ml-auto'
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  const variantClasses = {
    primary: 'text-white border-0',
    secondary: 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border-0',
    outline: 'text-gray-700 dark:text-gray-300 bg-transparent border-2 border-gray-300 dark:border-gray-600',
    ghost: 'text-gray-700 dark:text-gray-300 bg-transparent border-0'
  }
  
  const customStyles = {
    ...(styling.backgroundColor && { backgroundColor: styling.backgroundColor }),
    ...(styling.textColor && { color: styling.textColor }),
    ...(styling.borderRadius && { borderRadius: styling.borderRadius }),
    ...(styling.padding && { padding: styling.padding }),
    ...(styling.marginTop && { marginTop: styling.marginTop }),
    ...(styling.marginBottom && { marginBottom: styling.marginBottom }),
    ...(variant === 'primary' && !styling.backgroundColor && { 
      background: designTokens.colors.primary.gradient 
    })
  }
  
  const buttonClasses = `
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${alignmentClasses[alignment]}
    font-medium
    rounded-lg
    transition-all duration-300 ease-in-out
    hover:scale-105
    hover:shadow-lg
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    ${className}
  `
  
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
        style={customStyles}
      >
        {text}
      </a>
    )
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      style={customStyles}
    >
      {text}
    </button>
  )
}

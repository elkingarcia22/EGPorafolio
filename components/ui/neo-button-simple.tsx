'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  disabled = false,
  ...props
}) => {
  const baseClasses = 'neo-button relative overflow-hidden font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-full'
  
  const variantClasses = {
    default: 'neo-button-default',
    primary: 'neo-button-primary',
    secondary: 'neo-button-secondary',
    outline: 'neo-button-outline',
    ghost: 'neo-button-ghost'
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

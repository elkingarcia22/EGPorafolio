'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NeoCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  variant?: 'default' | 'inset' | 'outset'
  size?: 'sm' | 'md' | 'lg'
}

export const NeoCard: React.FC<NeoCardProps> = ({
  children,
  className,
  hover = true,
  onClick,
  variant = 'default',
  size = 'md',
}) => {
  const baseClasses = 'neo-card cursor-pointer transition-all duration-300'
  
  const variantClasses = {
    default: 'shadow-neomorphic dark:shadow-neomorphic-dark',
    inset: 'shadow-neomorphic-inset dark:shadow-neomorphic-inset-dark',
    outset: 'shadow-neomorphic dark:shadow-neomorphic-dark'
  }
  
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const hoverClasses = hover 
    ? 'hover:shadow-neomorphic-inset dark:hover:shadow-neomorphic-inset-dark hover:-translate-y-1' 
    : ''

  return (
    <motion.div
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        hoverClasses,
        className
      )}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : {}}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NeoCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  style?: React.CSSProperties
  variant?: 'default' | 'inset' | 'outset'
  size?: 'sm' | 'md' | 'lg'
}

export const NeoCard: React.FC<NeoCardProps> = ({
  children,
  className,
  hover = true,
  onClick,
  style,
  variant = 'default',
  size = 'md',
}) => {
  const baseClasses = 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer transition-all duration-300'
  
  const variantClasses = {
    default: 'shadow-sm hover:shadow-md',
    inset: 'shadow-inner',
    outset: 'shadow-md'
  }
  
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const hoverClasses = hover 
    ? 'hover:shadow-lg hover:-translate-y-1' 
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
      style={style}
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

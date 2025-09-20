'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NeoTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  variant?: 'default' | 'inset'
}

export const NeoTextarea: React.FC<NeoTextareaProps> = ({
  label,
  error,
  variant = 'default',
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false)

  const baseClasses = 'neo-input w-full transition-all duration-300 resize-none'
  
  const variantClasses = {
    default: 'shadow-neomorphic-inset dark:shadow-neomorphic-inset-dark focus:shadow-neomorphic dark:focus:shadow-neomorphic-dark',
    inset: 'shadow-neomorphic-inset dark:shadow-neomorphic-inset-dark'
  }

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      
      <textarea
        className={cn(
          baseClasses,
          variantClasses[variant],
          error && 'border-red-500 focus:border-red-500',
          className
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      
      {error && (
        <motion.p
          className="text-sm text-red-500"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  )
}

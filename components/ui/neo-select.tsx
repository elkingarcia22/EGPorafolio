'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NeoSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const NeoSelect: React.FC<NeoSelectProps> = ({
  label,
  error,
  options,
  placeholder,
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false)

  const baseClasses = 'neo-input w-full transition-all duration-300 appearance-none cursor-pointer'
  
  const variantClasses = 'shadow-neomorphic-inset dark:shadow-neomorphic-inset-dark focus:shadow-neomorphic dark:focus:shadow-neomorphic-dark'

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
      
      <div className="relative">
        <select
          className={cn(
            baseClasses,
            variantClasses,
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      
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

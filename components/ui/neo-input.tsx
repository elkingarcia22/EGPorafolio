'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'

interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  variant?: 'default' | 'inset'
}

export const NeoInput: React.FC<NeoInputProps> = ({
  label,
  error,
  icon,
  variant = 'default',
  className,
  type = 'text',
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  const baseClasses = 'neo-input w-full transition-all duration-300'
  
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
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        
        <input
          type={inputType}
          className={cn(
            baseClasses,
            variantClasses[variant],
            icon && 'pl-10',
            isPassword && 'pr-10',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
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

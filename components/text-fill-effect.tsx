'use client'

import React, { useState, useEffect } from 'react'

interface TextFillEffectProps {
  text: string
  className?: string
  delay?: number
  fillDuration?: number
  outlineColor?: string
  fillColor?: string
  gradientColors?: string
}

export const TextFillEffect: React.FC<TextFillEffectProps> = ({
  text,
  className = '',
  delay = 1000,
  fillDuration = 2000,
  outlineColor = 'transparent',
  fillColor = '#6b7280',
  gradientColors = 'from-blue-600 via-blue-500 to-blue-400'
}) => {
  const [isFilling, setIsFilling] = useState(false)
  const [isGradient, setIsGradient] = useState(false)

  useEffect(() => {
    // Iniciar el efecto después del delay
    const fillTimer = setTimeout(() => {
      setIsFilling(true)
    }, delay)

    // Cambiar a degradado después de la mitad del tiempo de relleno
    const gradientTimer = setTimeout(() => {
      setIsGradient(true)
    }, delay + fillDuration / 2)

    return () => {
      clearTimeout(fillTimer)
      clearTimeout(gradientTimer)
    }
  }, [delay, fillDuration])

  return (
    <span
      className={`relative inline-block ${className}`}
      style={{
        WebkitTextStroke: isFilling ? 'none' : '2px currentColor',
        color: isFilling ? (isGradient ? 'transparent' : fillColor) : outlineColor,
        background: isGradient ? `linear-gradient(to right, var(--tw-gradient-stops))` : 'none',
        backgroundClip: isGradient ? 'text' : 'initial',
        WebkitBackgroundClip: isGradient ? 'text' : 'initial',
        transition: `all ${fillDuration}ms ease-in-out`,
      }}
    >
      {text}
    </span>
  )
}

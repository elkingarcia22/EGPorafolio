'use client'

import React, { useState, useEffect } from 'react'
import { useAdmin } from '@/contexts/admin-context'

interface TypewriterTextProps {
  words?: string[]
  className?: string
  typingSpeed?: number
  deletingSpeed?: number
  pauseTime?: number
}

// Hook personalizado para manejar el contexto de manera segura
const useAdminSafe = () => {
  try {
    return useAdmin()
  } catch (error) {
    // Fallback para Storybook cuando AdminContext no está disponible
    return {
      content: {
        typewriterTexts: ['Diseñador UX/UI', 'Desarrollador Frontend', 'Estratega Digital']
      }
    }
  }
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  words,
  className = '',
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000
}) => {
  const { content } = useAdminSafe()
  const displayWords = words || content.typewriterTexts
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = displayWords[currentWordIndex]
    
    // Verificar que currentWord existe antes de continuar
    if (!currentWord) {
      return
    }
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1))
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), pauseTime)
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1))
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % displayWords.length)
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentWordIndex, displayWords, typingSpeed, deletingSpeed, pauseTime])

  return (
    <span 
      className={className}
      style={{
        letterSpacing: '0.02em',
        minHeight: '4rem'
      }}
    >
      {currentText}
      <span 
        className="typewriter-cursor"
        style={{
          color: '#2563eb',
          animation: 'cursor-blink 0.8s infinite reverse'
        }}
      >
        |
      </span>
    </span>
  )
}

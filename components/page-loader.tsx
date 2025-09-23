'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesignTokens } from '@/hooks/useDesignTokens'

interface PageLoaderProps {
  onComplete?: () => void
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const designTokens = useDesignTokens()

  useEffect(() => {
    // Simular progreso de carga
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          // Esperar un poco antes de ocultar el loader
          setTimeout(() => {
            setIsVisible(false)
            onComplete?.()
          }, 500)
          return 100
        }
        return prev + Math.random() * 15 + 5 // Incremento variable entre 5-20
      })
    }, 100)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900"
        >
          <div className="w-full max-w-md px-8">
            {/* Logo o título */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                Elkin García
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Portfolio UX/UI Designer
              </p>
            </div>

            {/* Barra de progreso */}
            <div className="relative">
              {/* Fondo de la barra */}
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                {/* Barra de progreso con gradiente */}
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: designTokens.colors.primary.gradient
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
              
              {/* Porcentaje */}
              <div className="text-center mt-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            {/* Texto de estado */}
            <div className="text-center mt-4">
              <motion.p
                key={Math.floor(progress / 25)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                {progress < 25 && "Cargando contenido..."}
                {progress >= 25 && progress < 50 && "Preparando experiencia..."}
                {progress >= 50 && progress < 75 && "Optimizando interfaz..."}
                {progress >= 75 && progress < 100 && "Finalizando..."}
                {progress >= 100 && "¡Listo!"}
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

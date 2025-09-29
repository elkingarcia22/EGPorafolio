'use client'

import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export default function TestThemePage() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
            Cargando...
          </h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-surface p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Test de Tema - Debug
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                theme === 'light' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 dark:bg-dark-surface-container text-gray-700 dark:text-gray-300'
              }`}
            >
              Claro
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                theme === 'dark' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 dark:bg-dark-surface-container text-gray-700 dark:text-gray-300'
              }`}
            >
              Oscuro
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                theme === 'system' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 dark:bg-dark-surface-container text-gray-700 dark:text-gray-300'
              }`}
            >
              Sistema
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Información del tema */}
          <div className="bg-gray-100 dark:bg-dark-surface-variant p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Información del Tema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Tema seleccionado:</strong> {theme}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Tema resuelto:</strong> {resolvedTheme}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Clase en HTML:</strong> {typeof window !== 'undefined' ? document.documentElement.className : 'SSR'}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Color scheme:</strong> {typeof window !== 'undefined' ? document.documentElement.style.colorScheme : 'SSR'}
                </p>
              </div>
            </div>
          </div>

          {/* Test de colores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-dark-surface-container p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Fondo: bg-white dark:bg-dark-surface-container
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Este es un contenedor con fondo personalizado.
              </p>
              <div className="bg-gray-100 dark:bg-dark-surface-container-high p-4 rounded">
                <p className="text-gray-800 dark:text-gray-200 text-sm">
                  Fondo interno: bg-gray-100 dark:bg-dark-surface-container-high
                </p>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-dark-surface-variant p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Fondo: bg-gray-100 dark:bg-dark-surface-variant
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Este es un contenedor con fondo variante.
              </p>
              <div className="bg-white dark:bg-dark-surface p-4 rounded">
                <p className="text-gray-800 dark:text-gray-200 text-sm">
                  Fondo interno: bg-white dark:bg-dark-surface
                </p>
              </div>
            </div>
          </div>

          {/* Test de botones */}
          <div className="bg-gray-100 dark:bg-dark-surface-variant p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Test de Botones
            </h3>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-gray-200 dark:bg-dark-surface-container text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-dark-surface-container-high transition-colors">
                Botón Gris
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Botón Azul
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface-container transition-colors">
                Botón Outline
              </button>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="bg-yellow-100 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-300 dark:border-yellow-700">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
              Instrucciones
            </h3>
            <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>1. <strong>Cambia entre los temas</strong> usando los botones superiores</p>
              <p>2. <strong>Verifica que los fondos cambien</strong> correctamente</p>
              <p>3. <strong>Observa la diferencia</strong> entre los contenedores</p>
              <p>4. <strong>Los colores deberían ser grises puros</strong> sin tinte azul</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


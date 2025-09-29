'use client'

import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export default function TestStylesPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Logs detallados para debug
    console.log('🎨 TestStyles - Verificando estilos:')
    console.log('🎨 TestStyles - Tema actual:', theme)
    console.log('🎨 TestStyles - Clase en HTML:', document.documentElement.className)
    console.log('🎨 TestStyles - Color scheme:', document.documentElement.style.colorScheme)
    
    // Verificar si las clases CSS están disponibles
    const testElement = document.createElement('div')
    testElement.className = 'bg-dark-surface'
    document.body.appendChild(testElement)
    const computedStyle = window.getComputedStyle(testElement)
    console.log('🎨 TestStyles - bg-dark-surface computed:', computedStyle.backgroundColor)
    console.log('🎨 TestStyles - bg-dark-surface important:', computedStyle.getPropertyPriority('background-color'))
    document.body.removeChild(testElement)
    
    // Verificar clase por defecto de Tailwind
    const testElement2 = document.createElement('div')
    testElement2.className = 'bg-gray-800'
    document.body.appendChild(testElement2)
    const computedStyle2 = window.getComputedStyle(testElement2)
    console.log('🎨 TestStyles - bg-gray-800 computed:', computedStyle2.backgroundColor)
    document.body.removeChild(testElement2)
    
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

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
            Test de Estilos - Debug
          </h1>
          <button
            onClick={toggleTheme}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Cambiar a {theme === 'dark' ? 'Claro' : 'Oscuro'}
          </button>
        </div>

        <div className="space-y-8">
          {/* Test 1: Comparación directa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tailwind por defecto: dark:bg-gray-800
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Esta es la clase por defecto de Tailwind que puede tener tinte azul.
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
                <p className="text-gray-800 dark:text-gray-200 text-sm">
                  Fondo: rgb(31 41 55) - Debería tener tinte azul
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Clase personalizada: dark:bg-dark-surface
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Esta es nuestra clase personalizada sin tinte azul.
              </p>
              <div className="bg-gray-100 dark:bg-dark-surface-container p-4 rounded">
                <p className="text-gray-800 dark:text-gray-200 text-sm">
                  Fondo: #121212 - Debería ser gris puro
                </p>
              </div>
            </div>
          </div>

          {/* Test 2: Información del tema */}
          <div className="bg-gray-100 dark:bg-dark-surface-variant p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Información del Tema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Tema actual:</strong> {theme}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Clase en HTML:</strong> {typeof window !== 'undefined' ? document.documentElement.className : 'SSR'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Color scheme:</strong> {typeof window !== 'undefined' ? document.documentElement.style.colorScheme : 'SSR'}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Mounted:</strong> {mounted ? 'Sí' : 'No'}
                </p>
              </div>
            </div>
          </div>

          {/* Test 3: Instrucciones */}
          <div className="bg-yellow-100 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-300 dark:border-yellow-700">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
              Instrucciones para Verificar
            </h3>
            <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>1. <strong>Abre la consola del navegador</strong> (F12) para ver los logs</p>
              <p>2. <strong>Cambia a modo oscuro</strong> usando el botón superior</p>
              <p>3. <strong>Compara los colores</strong> entre las dos columnas de arriba</p>
              <p>4. <strong>Verifica en la consola</strong> los valores de background-color</p>
              <p>5. <strong>Los fondos deberían ser diferentes</strong> - uno con tinte azul, otro gris puro</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

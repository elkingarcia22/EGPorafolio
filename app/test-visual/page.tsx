'use client'

import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export default function TestVisualPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
            Test Visual - Modo Oscuro
          </h1>
          <button
            onClick={toggleTheme}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Cambiar a {theme === 'dark' ? 'Claro' : 'Oscuro'}
          </button>
        </div>

        <div className="space-y-8">
          {/* Test 1: Comparación de fondos */}
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

          {/* Test 2: Comparación de colores directos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-6 rounded-lg text-white text-center">
              <h4 className="font-semibold mb-2">Tailwind gray-800</h4>
              <p className="text-sm opacity-75">rgb(31 41 55)</p>
              <p className="text-xs mt-2 opacity-60">Puede tener tinte azul</p>
            </div>
            <div className="bg-dark-surface p-6 rounded-lg text-white text-center" style={{backgroundColor: '#121212'}}>
              <h4 className="font-semibold mb-2">Material Design</h4>
              <p className="text-sm opacity-75">#121212</p>
              <p className="text-xs mt-2 opacity-60">Gris puro</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg text-white text-center">
              <h4 className="font-semibold mb-2">Tailwind gray-900</h4>
              <p className="text-sm opacity-75">rgb(17 24 39)</p>
              <p className="text-xs mt-2 opacity-60">Más oscuro</p>
            </div>
          </div>

          {/* Test 3: Botones */}
          <div className="bg-white dark:bg-dark-surface-container p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Test de Botones
            </h3>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-gray-200 dark:bg-dark-surface-container-high text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-dark-surface-container transition-colors">
                Botón Gris
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Botón Azul
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface-container-high transition-colors">
                Botón Outline
              </button>
            </div>
          </div>

          {/* Test 4: Información del tema */}
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
                  <strong>Clase en body:</strong> {theme === 'dark' ? 'dark' : 'light'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Timestamp:</strong> {new Date().toLocaleTimeString()}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Mounted:</strong> {mounted ? 'Sí' : 'No'}
                </p>
              </div>
            </div>
          </div>

          {/* Test 5: Instrucciones */}
          <div className="bg-yellow-100 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-300 dark:border-yellow-700">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
              Instrucciones para Verificar
            </h3>
            <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>1. <strong>Cambia a modo oscuro</strong> usando el botón superior</p>
              <p>2. <strong>Compara los colores</strong> entre las dos columnas de arriba</p>
              <p>3. <strong>Verifica que no haya tinte azul</strong> en los fondos oscuros</p>
              <p>4. <strong>Inspecciona los elementos</strong> con F12 para ver los colores exactos</p>
              <p>5. <strong>Los fondos deberían ser grises puros</strong> sin tinte azul</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

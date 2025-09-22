'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'

export default function TestLanguagePage() {
  const { language, setLanguage, t } = useLanguage()
  const [clickCount, setClickCount] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `[${timestamp}] ${message}`
    console.log(logMessage)
    setLogs(prev => [...prev.slice(-9), logMessage]) // Mantener solo los últimos 10 logs
  }

  useEffect(() => {
    addLog(`🌍 Página de prueba montada, idioma actual: ${language}`)
  }, [])

  useEffect(() => {
    addLog(`🔄 Idioma cambió a: ${language}`)
  }, [language])

  const handleToggleLanguage = () => {
    const newLanguage = language === 'es' ? 'en' : 'es'
    setClickCount(prev => prev + 1)
    addLog(`🔄 Intentando cambiar idioma de ${language} a ${newLanguage}`)
    setLanguage(newLanguage)
  }

  const testTranslations = [
    'nav.home',
    'nav.about', 
    'nav.contact',
    'home.myWork',
    'about.title',
    'contact.title'
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          🧪 Página de Prueba - Sistema de Idiomas
        </h1>

        {/* Estado actual */}
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            📊 Estado Actual
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Idioma actual:</p>
              <p className="text-lg font-mono text-gray-800 dark:text-white">{language}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Clicks realizados:</p>
              <p className="text-lg font-mono text-gray-800 dark:text-white">{clickCount}</p>
            </div>
          </div>
        </div>

        {/* Botón de prueba */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            🔘 Botón de Prueba
          </h2>
          <button
            onClick={handleToggleLanguage}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Cambiar a {language === 'es' ? 'English' : 'Español'}
          </button>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Haz clic para cambiar el idioma y ver los logs
          </p>
        </div>

        {/* Traducciones de prueba */}
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            🔤 Traducciones de Prueba
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {testTranslations.map((key) => (
              <div key={key} className="p-3 bg-white dark:bg-gray-800 rounded border">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{key}</p>
                <p className="text-sm text-gray-800 dark:text-white font-medium">
                  {t(key)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Logs */}
        <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm">
          <h2 className="text-xl font-semibold text-white mb-4">
            📝 Logs de Debug
          </h2>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">No hay logs aún...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-green-400">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
            ℹ️ Información de Debug
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Idioma en localStorage: {typeof window !== 'undefined' ? localStorage.getItem('language') || 'null' : 'N/A'}</li>
            <li>• Timestamp: {new Date().toLocaleString()}</li>
            <li>• User Agent: {typeof window !== 'undefined' ? navigator.userAgent.slice(0, 50) + '...' : 'N/A'}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

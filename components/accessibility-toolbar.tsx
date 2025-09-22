'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Accessibility, 
  Type, 
  Volume2, 
  VolumeX, 
  Languages, 
  Eye, 
  EyeOff,
  Minus,
  Plus,
  RotateCcw
} from 'lucide-react'
import { NeoButton } from './ui/neo-button'
import { useAccessibility } from '@/hooks/useAccessibility'

export const AccessibilityToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { settings, updateSetting, resetSettings, mounted } = useAccessibility()

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' }
  ]

  if (!mounted) {
    return null
  }

  return (
    <div className="relative">
      {/* Botón principal de accesibilidad */}
      <NeoButton
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative overflow-hidden"
        title="Herramientas de accesibilidad"
      >
        <motion.div
          className="flex items-center justify-center"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Accessibility className="h-4 w-4" />
        </motion.div>
      </NeoButton>

      {/* Panel de herramientas */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50"
          >
            <div className="space-y-4">
              {/* Título */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Accesibilidad
                </h3>
                <NeoButton
                  variant="ghost"
                  size="sm"
                  onClick={resetSettings}
                  title="Restablecer configuración"
                >
                  <RotateCcw className="h-4 w-4" />
                </NeoButton>
              </div>

              {/* Tamaño de fuente */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Type className="h-4 w-4" />
                  Tamaño de fuente
                </label>
                <div className="flex items-center gap-2">
                  <NeoButton
                    variant="ghost"
                    size="sm"
                    onClick={() => updateSetting('fontSize', Math.max(12, settings.fontSize - 2))}
                    disabled={settings.fontSize <= 12}
                  >
                    <Minus className="h-3 w-3" />
                  </NeoButton>
                  <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem] text-center">
                    {settings.fontSize}px
                  </span>
                  <NeoButton
                    variant="ghost"
                    size="sm"
                    onClick={() => updateSetting('fontSize', Math.min(24, settings.fontSize + 2))}
                    disabled={settings.fontSize >= 24}
                  >
                    <Plus className="h-3 w-3" />
                  </NeoButton>
                </div>
              </div>

              {/* Contraste alto */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Eye className="h-4 w-4" />
                  Contraste alto
                </label>
                <NeoButton
                  variant={settings.highContrast ? "default" : "ghost"}
                  size="sm"
                  onClick={() => updateSetting('highContrast', !settings.highContrast)}
                >
                  {settings.highContrast ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </NeoButton>
              </div>

              {/* Movimiento reducido */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <VolumeX className="h-4 w-4" />
                  Movimiento reducido
                </label>
                <NeoButton
                  variant={settings.reducedMotion ? "default" : "ghost"}
                  size="sm"
                  onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                >
                  {settings.reducedMotion ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </NeoButton>
              </div>

              {/* Lector de pantalla */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Volume2 className="h-4 w-4" />
                  Lector de pantalla
                </label>
                <NeoButton
                  variant={settings.screenReader ? "default" : "ghost"}
                  size="sm"
                  onClick={() => updateSetting('screenReader', !settings.screenReader)}
                >
                  {settings.screenReader ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </NeoButton>
              </div>

              {/* Selector de idioma */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Languages className="h-4 w-4" />
                  Idioma
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map((lang) => (
                    <NeoButton
                      key={lang.code}
                      variant={settings.language === lang.code ? "default" : "ghost"}
                      size="sm"
                      onClick={() => updateSetting('language', lang.code)}
                      className="flex flex-col items-center gap-1 p-2"
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-xs">{lang.name}</span>
                    </NeoButton>
                  ))}
                </div>
              </div>

              {/* Información adicional */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Estas configuraciones se aplican inmediatamente y se guardan en tu navegador.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

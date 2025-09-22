'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Accessibility, 
  Type, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff,
  Minus,
  Plus,
  RotateCcw
} from 'lucide-react'
import { useAccessibility } from '@/hooks/useAccessibility'
import { useLanguage } from '@/contexts/language-context'

export const AccessibilityToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { settings, updateSetting, resetSettings, mounted } = useAccessibility()
  const { t } = useLanguage()


  if (!mounted) {
    return null
  }

  return (
    <div className="relative">
      {/* Botón principal de accesibilidad */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
        title={t('accessibility.tools')}
      >
        <motion.div
          className="flex items-center justify-center"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Accessibility className="h-6 w-6" />
        </motion.div>
      </button>

      {/* Panel de herramientas */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-4 z-50"
          >
            <div className="space-y-4">
              {/* Título */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-normal text-gray-600 dark:text-white">
                  {t('accessibility.title')}
                </h3>
                <button
                  onClick={resetSettings}
                  className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                  title={t('accessibility.reset')}
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              {/* Tamaño de fuente */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-normal text-gray-600 dark:text-gray-300">
                  <Type className="h-4 w-4" />
                  {t('accessibility.fontSize')}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateSetting('fontSize', Math.max(12, settings.fontSize - 2))}
                    disabled={settings.fontSize <= 12}
                    className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem] text-center">
                    {settings.fontSize}px
                  </span>
                  <button
                    onClick={() => updateSetting('fontSize', Math.min(24, settings.fontSize + 2))}
                    disabled={settings.fontSize >= 24}
                    className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Contraste alto */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-normal text-gray-600 dark:text-gray-300">
                  <Eye className="h-4 w-4" />
                  {t('accessibility.highContrast')}
                </label>
                <button
                  onClick={() => updateSetting('highContrast', !settings.highContrast)}
                  className={`p-1 transition-colors duration-200 ${
                    settings.highContrast 
                      ? 'text-gray-800 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {settings.highContrast ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>

              {/* Movimiento reducido */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-normal text-gray-600 dark:text-gray-300">
                  <VolumeX className="h-4 w-4" />
                  {t('accessibility.reducedMotion')}
                </label>
                <button
                  onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                  className={`p-1 transition-colors duration-200 ${
                    settings.reducedMotion 
                      ? 'text-gray-800 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {settings.reducedMotion ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>

              {/* Lector de pantalla */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-normal text-gray-600 dark:text-gray-300">
                  <Volume2 className="h-4 w-4" />
                  {t('accessibility.screenReader')}
                </label>
                <button
                  onClick={() => updateSetting('screenReader', !settings.screenReader)}
                  className={`p-1 transition-colors duration-200 ${
                    settings.screenReader 
                      ? 'text-gray-800 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {settings.screenReader ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>
              </div>


              {/* Información adicional */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {t('accessibility.info')}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

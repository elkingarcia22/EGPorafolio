'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { useCV } from '@/hooks/useCV'
import { useDesignTokens } from '@/hooks/useDesignTokens'
import { useLanguage } from '@/contexts/language-context'
import { useTheme } from 'next-themes'
import { Download, Share2, Mail, FileText, Calendar, User, Globe, ArrowLeft, Home } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CVPage() {
  const { activeCV, loading, error, downloadCV, shareCV } = useCV()
  const designTokens = useDesignTokens()
  const { t } = useLanguage()
  const { theme } = useTheme()

  // Log para debug
  useEffect(() => {
    console.log('🎨 CV Page - Tema actual:', theme)
    console.log('🎨 CV Page - Clases aplicadas:', {
      'bg-white': 'bg-white',
      'dark:bg-dark-surface': 'dark:bg-dark-surface',
      'bg-white dark:bg-dark-surface-variant': 'bg-white dark:bg-dark-surface-variant'
    })
  }, [theme])

  // Función para enviar CV por correo
  const sendCVByEmail = () => {
    const subject = encodeURIComponent(`CV - ${activeCV?.title || 'Elkin Garcia'}`)
    const body = encodeURIComponent(`
Hola,

Te comparto mi CV para tu consideración.

${activeCV?.description || ''}

Puedes verlo completo en: ${window.location.origin}/cv

Saludos,
Elkin Garcia
    `)
    
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-surface-variant">
        <Navbar onAdminClick={() => {}} />
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
                 style={{borderColor: designTokens.colors.primary.blue}}></div>
            <p className="text-gray-600-pure dark:text-gray-300">{t('cv.loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !activeCV) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-surface-variant">
        <Navbar onAdminClick={() => {}} />
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto p-8">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800-pure dark:text-white mb-2">
              {t('cv.notAvailable')}
            </h2>
            <p className="text-gray-600-pure dark:text-gray-300 mb-6">
              {error || t('cv.notFound')}
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{background: designTokens.colors.primary.gradient}}
            >
              {t('cv.backToHome')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-surface-variant">
      {/* Navbar superior */}
      <Navbar onAdminClick={() => {}} />

      {/* Header con información del CV */}
      <div className="bg-white dark:bg-dark-surface-container shadow-lg border-b border-gray-200 border-gray-800-pure pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Información del CV */}
            <div className="flex-1">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-gray-800-pure dark:text-gray-200 mb-2"
              >
                {activeCV.title}
              </motion.h1>
              
              {activeCV.description && (
                <p className="text-gray-600-pure dark:text-gray-300 mb-4">
                  {activeCV.description}
                </p>
              )}

              {/* Metadatos */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500-pure dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{t('cv.lastUpdated')}: {new Date(activeCV.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>{t('cv.language')}: {activeCV.language.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-wrap justify-between items-center gap-3">
              {/* Botones secundarios */}
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareCV(activeCV)}
                  className="flex items-center gap-2 px-4 py-2 dark:bg-dark-surface-container dark:border dark:border-gray-800-pure rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  {t('cv.share')}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendCVByEmail}
                  className="flex items-center gap-2 px-4 py-2 dark:bg-dark-surface-container dark:border dark:border-gray-800-pure rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {t('cv.email')}
                </motion.button>

              </div>

              {/* Botón principal - Descargar */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => downloadCV(activeCV)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all duration-300 hover:shadow-lg"
                style={{background: designTokens.colors.primary.gradient}}
              >
                <Download className="h-4 w-4" />
                {t('cv.download')}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Visor de PDF */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-surface-container-high rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="aspect-[3/4] w-full bg-white dark:bg-dark-surface-container-high">
            <iframe
              src={`${activeCV.file_url}#toolbar=1&navpanes=0&scrollbar=1&page=1&view=FitH&theme=dark`}
              className="w-full h-full border-0 bg-white dark:bg-dark-surface-container-high"
              title={activeCV.title}
              loading="lazy"
              style={{ 
                backgroundColor: 'transparent',
                filter: 'invert(0)'
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Información adicional */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeCV.metadata && Object.keys(activeCV.metadata).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white dark:bg-dark-surface-container rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900-pure dark:text-white mb-4">
              {t('cv.additionalInfo')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCV.metadata.skills && (
                <div>
                  <h4 className="font-medium text-gray-700-pure dark:text-gray-300 mb-2">{t('cv.skills')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeCV.metadata.skills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-dark-surface-container-high text-gray-700-pure dark:text-gray-300 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {activeCV.metadata.experience_years && (
                <div>
                  <h4 className="font-medium text-gray-700-pure dark:text-gray-300 mb-2">{t('cv.experience')}</h4>
                  <p className="text-gray-600-pure dark:text-gray-400">
                    {activeCV.metadata.experience_years} {t('cv.yearsExperience')}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

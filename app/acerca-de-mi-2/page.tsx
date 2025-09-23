'use client'

import { useLanguage } from '@/contexts/language-context'
import { useAdmin } from '@/contexts/admin-context'
import { designTokens } from '@/lib/design-tokens'
import Link from 'next/link'

export default function AcercaDeMi2Page() {
  const { t } = useLanguage()
  const { content } = useAdmin()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors mb-8">
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al inicio
        </Link>

        {/* Card principal con diseño de tarjeta */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header con gradiente */}
          <div className="relative px-8 py-12 text-center" style={{background: designTokens.colors.primary.gradient}}>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden shadow-lg bg-white/20 backdrop-blur-sm">
                <div className="w-full h-full bg-white/30 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {t('about.name')}
              </h1>
              <p className="text-white/90 text-sm">
                {t('about.professionalTitle')}
              </p>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="px-8 py-8">
            <h2 className="text-xl font-bold text-center mb-6" style={{color: designTokens.colors.primary.DEFAULT}}>
              {t('about.mainTitle')}
            </h2>
            
            <p className="text-center text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              {content.aboutDescription}
            </p>

            {/* Grid de información */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Experiencia */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center" style={{background: designTokens.colors.primary.gradient}}>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t('about.experience')}
                  </h3>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="border-l-2 border-blue-200 dark:border-blue-800 pl-3">
                      <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{t(`about.experience${num}`)}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{t(`about.experience${num}Desc`)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Especialidades */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center" style={{background: designTokens.colors.primary.gradient}}>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t('about.specialties')}
                  </h3>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="border-l-2 border-green-200 dark:border-green-800 pl-3">
                      <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{t(`about.specialty${num}`)}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{t(`about.specialty${num}Desc`)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
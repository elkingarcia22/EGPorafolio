'use client'

import { useLanguage } from '@/contexts/language-context'
import { useAdmin } from '@/contexts/admin-context'
import { useDesignTokens } from '@/hooks/useDesignTokens'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AcercaDeMi3Page() {
  const { t } = useLanguage()
  const designTokens = useDesignTokens()
  const { content } = useAdmin()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors mb-8">
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al inicio
        </Link>

        {/* Layout: Foto + Grid de 2x2 */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Columna 1: Perfil - Solo Foto */}
          <motion.div
            className="relative group"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Foto placeholder sin card */}
            <div className="w-full h-full min-h-[450px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center shadow-lg">
                  <svg className="w-20 h-20 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">{t('about.photoPlaceholder')}</p>
              </div>
            </div>
            
            {/* Overlay con gradiente al hover */}
            <div className="absolute inset-0" style={{background: designTokens.colors.primary.gradient, opacity: 0.2}}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.div>

          {/* Columna 2-3: Grid de 2x2 (Descripción + Experiencia + Especialidades) */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Descripción - Sin card, texto alineado a la izquierda */}
            <motion.div
              className="md:col-span-2 mb-4"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-bold mb-3 text-left" style={{color: designTokens.colors.primary.DEFAULT}}>
                Del output al outcome: diseño que entrega resultados reales.
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm text-left">
                Senior Product & UX/UI Designer con más de 10 años de experiencia liderando proyectos digitales de principio a fin. Trabajo de manera estratégica y planificada, combinando investigación, diseño visual y sistemas de diseño para asegurar consistencia, escalabilidad y eficiencia. Complemento mi trabajo con herramientas de IA que me permiten acelerar la ideación y validación, logrando productos más robustos y efectivos.
              </p>
            </motion.div>

            {/* Experiencia */}
            <motion.div
              className="bg-transparent rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center" style={{background: designTokens.colors.primary.gradient}}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  {t('about.experience')}
                </h2>
              </div>
              
              <div className="flex-1 flex flex-col justify-center space-y-4">
                {[
                  {
                    title: "10+ years in UX/UI & Product Design",
                    description: "Specialization in digital products"
                  },
                  {
                    title: "15+ completed projects",
                    description: "From startups to enterprises"
                  },
                  {
                    title: "Strategic Systems",
                    description: "Scalable & consistent"
                  }
                ].map((experience, index) => (
                  <motion.div
                    key={index}
                    className="relative pl-4 py-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  >
                    <div className="absolute left-0 top-3 w-2 h-2 rounded-full" style={{background: designTokens.colors.primary.gradient}}></div>
                    <div className="absolute left-1 top-5 w-0.5 h-8 bg-gray-200 dark:bg-gray-600"></div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{experience.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{experience.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Especialidades */}
            <motion.div
              className="bg-transparent rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center" style={{background: designTokens.colors.primary.gradient}}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  {t('about.specialties')}
                </h2>
              </div>
              
              <div className="flex-1 flex flex-col justify-center space-y-3">
                {[
                  {
                    title: "Research & Strategy",
                    description: "Insights, outcomes"
                  },
                  {
                    title: "Interaction Design", 
                    description: "Micro-experiences, usability"
                  },
                  {
                    title: "AI-Enhanced Design",
                    description: "Optimization, agility"
                  }
                ].map((specialty, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{background: designTokens.colors.primary.gradient}}>
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{specialty.title}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{specialty.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  )
}
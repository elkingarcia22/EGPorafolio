'use client'

import { useTheme } from 'next-themes'
import { designTokens } from '@/lib/design-tokens'

interface SectionSkeletonProps {
  type: 'home' | 'about' | 'contact'
}

export const SectionSkeleton = ({ type }: SectionSkeletonProps) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (type === 'home') {
    return (
      <div className="flex flex-col items-center justify-start min-h-screen px-8 pt-16">
        {/* Skeleton para las letras EG */}
        <div className="flex items-center gap-8">
          <div className="w-96 h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="w-96 h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        
        {/* Skeleton para "Mi trabajo" */}
        <div className="mt-20 w-full">
          <div className="relative">
            <div className="absolute right-1/4 -top-8 w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          
          {/* Skeleton para proyectos */}
          <div className="mt-48 grid grid-cols-2 h-screen -mx-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (type === 'about') {
    return (
      <section className="py-20">
        <div className="px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12 items-start">
              {/* Skeleton para foto */}
              <div className="lg:col-span-1">
                <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
                <div className="text-center mt-6">
                  <div className="w-48 h-8 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2 animate-pulse"></div>
                  <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
                </div>
              </div>

              {/* Skeleton para descripción */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <div className="w-3/4 h-12 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse"></div>
                  <div className="space-y-4">
                    <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-2/3 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Skeleton para experiencia y especialidades */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 animate-pulse"></div>
                          <div className="flex-1">
                            <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1 animate-pulse"></div>
                            <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="w-28 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 animate-pulse"></div>
                          <div className="flex-1">
                            <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1 animate-pulse"></div>
                            <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (type === 'contact') {
    return (
      <section className="py-20" style={{background: designTokens.colors.primary.gradient}}>
        <div className="px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-transparent border-2 border-white/30 rounded-2xl p-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-6 animate-pulse"></div>
                    <div className="w-24 h-6 bg-white/20 rounded mx-auto mb-3 animate-pulse"></div>
                    <div className="w-32 h-5 bg-white/20 rounded mx-auto mb-4 animate-pulse"></div>
                    <div className="w-28 h-4 bg-white/20 rounded mx-auto mb-6 animate-pulse"></div>
                    <div className="w-16 h-0.5 bg-white/20 mx-auto animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Skeleton para información adicional */}
          <div className="text-center mt-20">
            <div className="max-w-2xl mx-auto">
              <div className="w-3/4 h-6 bg-white/20 rounded mx-auto mb-4 animate-pulse"></div>
              <div className="w-1/2 h-5 bg-white/20 rounded mx-auto mb-8 animate-pulse"></div>
              <div className="w-24 h-0.5 bg-white/20 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return null
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDesignTokens } from '@/hooks/useDesignTokens'
import { useColors } from '@/contexts/colors-context'
import { supabase } from '@/lib/supabase-client'
import { Navbar } from '@/components/navbar'
import { NeoButton } from '@/components/ui/neo-button'
import { NeoCard } from '@/components/ui/neo-card'
import { NeuromorphicEG } from '@/components/neuromorphic-eg'
import { SectionSkeleton } from '@/components/section-skeleton'
import { AdminProvider, useAdmin } from '@/contexts/admin-context'
import { useLanguage } from '@/contexts/language-context'
import { useSectionLoading } from '@/hooks/useSectionLoading'


interface Gradient {
  id: string
  name: string
  gradient_css: string
  is_active: boolean
  is_default: boolean
}

// Componente de vista previa del home - exactamente igual al home actual
const HomePreview = () => {
  const { content, refreshContent } = useAdmin()
  const { t, language } = useLanguage()
  const { loading, mounted, markSectionLoaded } = useSectionLoading()
  const designTokens = useDesignTokens()
  
  // Función para generar overlay dinámico basado en el gradiente actual
  const getDynamicOverlay = () => {
    const gradient = designTokens.colors.primary.gradient
    if (gradient.includes('#405758') && gradient.includes('#5e787b')) {
      // Gradiente verde gris - más visible
      return 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(64,87,88,0.4) 30%, rgba(94,120,123,0.5) 70%, rgba(0,0,0,0.3) 100%)'
    } else if (gradient.includes('#16A2FF') && gradient.includes('#35D07F')) {
      // Gradiente azul verde original - más visible
      return 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(22,162,255,0.3) 30%, rgba(53,208,127,0.4) 70%, rgba(0,0,0,0.3) 100%)'
    } else {
      // Fallback genérico - más visible
      return 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.3) 100%)'
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      {/* Sección Home - EG neuromórfico */}
      <section id="home" className="pt-24">
        <NeuromorphicEG />
      </section>

      {/* Título de sección Acerca de mí */}
      <div className="py-32">
        <div className="px-8">
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              <div className="absolute -left-20">
                <span className="text-2xl md:text-3xl font-normal text-gray-600 dark:text-white">
                  {t('about.title')}
                </span>
                {/* Línea degradada que baja hacia la sección */}
                <div className="absolute w-1 h-96" style={{right: '-13px', top: '8px', background: designTokens.colors.primary.gradient}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Acerca de mí - Nueva Versión 3 */}
      {loading.about ? (
        <SectionSkeleton type="about" />
      ) : (
        <section id="acerca" className="py-20">
        <div className="px-8">
          <div className="max-w-6xl mx-auto">
            {/* Layout: Foto + Grid de 2x2 */}
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Columna 1: Perfil - Solo Foto */}
              <div className="relative group">
                {/* Foto real o placeholder */}
                <div className="w-full h-full min-h-[450px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                  {(() => {
                    const profilePhoto = content.aboutInfo?.find(item => 
                      item.section === 'photo' && item.language === language
                    );
                    
                    if (profilePhoto?.profile_image_url) {
                      return (
                        <>
                          <img 
                            src={profilePhoto.profile_image_url} 
                            alt="Foto de perfil"
                            className="w-full h-full object-cover grayscale contrast-150"
                          />
                          {/* Mismo degradado que las cards de proyectos */}
                          <div className="absolute inset-0" style={{background: getDynamicOverlay()}}></div>
                        </>
                      );
                    } else {
                      return (
                        <div className="text-center">
                          <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center shadow-lg">
                            <svg className="w-24 h-24 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                          </div>
                          <p 
                            className="text-gray-500 dark:text-gray-400"
                            style={{
                              fontSize: designTokens.typography.fontSize['3xl'],
                              fontWeight: designTokens.typography.fontWeight.medium,
                              fontFamily: designTokens.typography.fontFamily.sans,
                              lineHeight: designTokens.typography.lineHeight.snug
                            }}
                          >
                            {t('about.photoPlaceholder')}
                          </p>
                        </div>
                      );
                    }
                  })()}
                </div>
                
                {/* Overlay con gradiente al hover */}
                <div className="absolute inset-0" style={{background: designTokens.colors.primary.gradient, opacity: 0.2}}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Columna 2-3: Grid de 2x2 (Descripción + Experiencia + Especialidades) */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Descripción - Sin card, texto alineado a la izquierda */}
                <div className="md:col-span-2 mb-4">
                  {(() => {
                    const mainInfo = content.aboutInfo?.find(item => 
                      item.section === 'main' && item.language === language
                    );
                    
                    return (
                      <>
                        <h3 
                          className="mb-3 text-left text-gray-700 dark:text-white"
                          style={{
                            fontSize: designTokens.typography.fontSize['2xl'],
                            fontWeight: designTokens.typography.fontWeight.bold,
                            fontFamily: designTokens.typography.fontFamily.sans,
                            lineHeight: designTokens.typography.lineHeight.snug
                          }}
                        >
                          {mainInfo?.title || t('about.newTitle')}
                        </h3>
                        <p 
                          className="text-left leading-relaxed text-gray-700 dark:text-white"
                          style={{
                            fontSize: designTokens.typography.fontSize.lg,
                            fontWeight: designTokens.typography.fontWeight.normal,
                            fontFamily: designTokens.typography.fontFamily.sans,
                            lineHeight: designTokens.typography.lineHeight.relaxed
                          }}
                        >
                          {mainInfo?.description || t('about.newDescription')}
                        </p>
                      </>
                    );
                  })()}
                </div>

                {/* Experiencia */}
                <div className="bg-transparent rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center" style={{background: designTokens.colors.primary.gradient}}>
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <h2 
                      className="text-gray-700 dark:text-white"
                      style={{
                        fontSize: designTokens.typography.fontSize.xl,
                        fontWeight: designTokens.typography.fontWeight.bold,
                        fontFamily: designTokens.typography.fontFamily.sans,
                        lineHeight: designTokens.typography.lineHeight.snug
                      }}
                    >
                      {t('about.experience')}
                    </h2>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center space-y-4">
                    {(() => {
                      const experienceItems = content.aboutInfo?.filter(item => 
                        item.section === 'experience' && item.language === language
                      ).sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) || [];
                      
                      // Fallback a datos estáticos si no hay datos en la BD
                      const fallbackData = [
                        {
                          title: t('about.experience1New'),
                          description: t('about.experience1NewDesc')
                        },
                        {
                          title: t('about.experience2New'),
                          description: t('about.experience2NewDesc')
                        },
                        {
                          title: t('about.experience3New'),
                          description: t('about.experience3NewDesc')
                        }
                      ];
                      
                      const dataToUse = experienceItems.length > 0 ? experienceItems : fallbackData;
                      
                      return dataToUse.map((experience, index) => (
                      <div key={index} className="relative pl-4 py-2">
                        <div className="absolute left-0 top-3 w-2 h-2 rounded-full" style={{background: designTokens.colors.primary.gradient}}></div>
                        <div className="absolute left-1 top-5 w-0.5 h-8 bg-gray-200 dark:bg-gray-600"></div>
                        <div>
                          <p 
                            className="text-gray-700 dark:text-white mt-1"
                            style={{
                              fontSize: designTokens.typography.fontSize.lg,
                              fontWeight: designTokens.typography.fontWeight.semibold,
                              fontFamily: designTokens.typography.fontFamily.sans,
                              lineHeight: designTokens.typography.lineHeight.snug
                            }}
                          >
                            {experience.title || experience.title}
                          </p>
                          <p 
                            className="text-gray-700 dark:text-white mt-1"
                            style={{
                              fontSize: designTokens.typography.fontSize.base,
                              fontWeight: designTokens.typography.fontWeight.normal,
                              fontFamily: designTokens.typography.fontFamily.sans,
                              lineHeight: designTokens.typography.lineHeight.normal
                            }}
                          >
                            {experience.description || experience.description}
                          </p>
                        </div>
                      </div>
                    ));
                    })()}
                  </div>
                </div>

                {/* Especialidades */}
                <div className="bg-transparent rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center" style={{background: designTokens.colors.primary.gradient}}>
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <h2 
                      className="text-gray-700 dark:text-white"
                      style={{
                        fontSize: designTokens.typography.fontSize.xl,
                        fontWeight: designTokens.typography.fontWeight.bold,
                        fontFamily: designTokens.typography.fontFamily.sans,
                        lineHeight: designTokens.typography.lineHeight.snug
                      }}
                    >
                      {t('about.specialties')}
                    </h2>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center space-y-3">
                    {(() => {
                      const specialtyItems = content.aboutInfo?.filter(item => 
                        item.section === 'specialties' && item.language === language
                      ).sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) || [];
                      
                      // Fallback a datos estáticos si no hay datos en la BD
                      const fallbackData = [
                        {
                          title: t('about.specialty1New'),
                          description: t('about.specialty1NewDesc')
                        },
                        {
                          title: t('about.specialty2New'), 
                          description: t('about.specialty2NewDesc')
                        },
                        {
                          title: t('about.specialty3New'),
                          description: t('about.specialty3NewDesc')
                        }
                      ];
                      
                      const dataToUse = specialtyItems.length > 0 ? specialtyItems : fallbackData;
                      
                      return dataToUse.map((specialty, index) => (
                      <div key={index} className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{background: designTokens.colors.primary.gradient}}>
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 
                              className="text-gray-700 dark:text-white"
                              style={{
                                fontSize: designTokens.typography.fontSize.lg,
                                fontWeight: designTokens.typography.fontWeight.semibold,
                                fontFamily: designTokens.typography.fontFamily.sans,
                                lineHeight: designTokens.typography.lineHeight.snug
                              }}
                            >
                              {specialty.title}
                            </h3>
                            <p 
                              className="text-gray-700 dark:text-white mt-1"
                              style={{
                                fontSize: designTokens.typography.fontSize.base,
                                fontWeight: designTokens.typography.fontWeight.normal,
                                fontFamily: designTokens.typography.fontFamily.sans,
                                lineHeight: designTokens.typography.lineHeight.normal
                              }}
                            >
                              {specialty.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}
    </div>
  )
}

function TestGradientsContent() {
  const router = useRouter()
  const { currentGradient, setCurrentGradient } = useColors()
  const designTokens = useDesignTokens()
  const [gradients, setGradients] = useState<Gradient[]>([])
  const [selectedGradient, setSelectedGradient] = useState<string>(currentGradient)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar gradientes desde Supabase
  useEffect(() => {
    const loadGradients = async () => {
      try {
        console.log('🎨 Cargando gradientes para página de prueba...')
        const { data, error } = await supabase
          .from('colors')
          .select('*')
          .eq('is_active', true)
          .order('is_default', { ascending: false })
          .order('name', { ascending: true })

        if (error) {
          console.error('❌ Error cargando gradientes:', error)
          return
        }

        console.log('✅ Gradientes cargados:', data)
        setGradients(data || [])
        
        // Establecer el gradiente por defecto como seleccionado
        const defaultGradient = data?.find(g => g.is_default)
        if (defaultGradient) {
          setSelectedGradient(defaultGradient.gradient_css)
        }
      } catch (error) {
        console.error('❌ Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadGradients()
  }, [])

  // Aplicar gradiente seleccionado en tiempo real
  useEffect(() => {
    if (selectedGradient) {
      setCurrentGradient(selectedGradient)
    }
  }, [selectedGradient, setCurrentGradient])

  const handleGradientSelect = (gradient: Gradient) => {
    console.log('🎨 Gradiente seleccionado:', gradient.name)
    setSelectedGradient(gradient.gradient_css)
  }

  const handleApplyGradient = async (gradient: Gradient) => {
    try {
      console.log('🎨 Aplicando gradiente:', gradient.name)
      
      // Quitar is_default de todos los gradientes
      await supabase
        .from('colors')
        .update({ is_default: false })
        .eq('is_active', true)

      // Establecer el gradiente seleccionado como por defecto
      const { error } = await supabase
        .from('colors')
        .update({ is_default: true })
        .eq('id', gradient.id)

      if (error) {
        console.error('❌ Error aplicando gradiente:', error)
        return
      }

      console.log('✅ Gradiente aplicado exitosamente:', gradient.name)
      alert(`¡Gradiente "${gradient.name}" aplicado exitosamente al sitio!`)
      
    } catch (error) {
      console.error('❌ Error:', error)
      alert('Error al aplicar el gradiente. Por favor, inténtalo de nuevo.')
    }
  }

  const handleGoToAdmin = () => {
    router.push('/admin')
  }

  const handleGoToSite = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando gradientes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header de la página de prueba */}
      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                🎨 Prueba de Gradientes
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Selecciona un gradiente para verlo en tiempo real
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <NeoButton
                variant="outline"
                onClick={handleGoToAdmin}
                className="flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Admin</span>
              </NeoButton>
              <NeoButton
                variant="primary"
                onClick={handleGoToSite}
                className="flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>Ver Sitio</span>
              </NeoButton>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selector de gradientes - Arriba horizontal */}
        <div className="mb-8">
          <NeoCard className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Seleccionar Gradiente
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
              {/* Dropdown simple */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gradiente:
                </label>
                <select
                  value={selectedGradient}
                  onChange={(e) => setSelectedGradient(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {gradients.map((gradient) => (
                    <option key={gradient.id} value={gradient.gradient_css}>
                      {gradient.name} {gradient.is_default && '(Default)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vista previa del gradiente seleccionado */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vista Previa:
                </label>
                <div
                  className="w-full h-16 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: selectedGradient }}
                >
                  {gradients.find(g => g.gradient_css === selectedGradient)?.name || 'Gradiente'}
                </div>
              </div>

              {/* Botón para aplicar */}
              <div className="md:w-auto w-full">
                <NeoButton
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    const gradient = gradients.find(g => g.gradient_css === selectedGradient)
                    if (gradient) {
                      handleApplyGradient(gradient)
                    }
                  }}
                >
                  Aplicar al Sitio
                </NeoButton>
              </div>
            </div>
          </NeoCard>
        </div>

        {/* Vista previa del home - Abajo ocupando todo el ancho */}
        <div>
          <NeoCard className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Vista Previa del Home
            </h2>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* Home completo con el gradiente seleccionado */}
              <div className="min-h-[800px] bg-gray-50 dark:bg-gray-900">
                <HomePreview />
              </div>
            </div>
          </NeoCard>
        </div>
      </div>
    </div>
  )
}

export default function TestGradientsPage() {
  return (
    <AdminProvider>
      <TestGradientsContent />
    </AdminProvider>
  )
}
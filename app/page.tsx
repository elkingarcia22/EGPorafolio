'use client'

import { useState, useEffect, useLayoutEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { NeuromorphicEG } from '@/components/neuromorphic-eg'
import { SectionSkeleton } from '@/components/section-skeleton'
import { EmailModal } from '@/components/ui/email-modal'
import { PageLoader } from '@/components/page-loader'
import { AdminProvider, useAdmin } from '@/contexts/admin-context'
import { useLanguage } from '@/contexts/language-context'
import { useSectionLoading } from '@/hooks/useSectionLoading'
import { useDesignTokens } from '@/hooks/useDesignTokens'

function HomePageContent() {
  const { content, refreshContent } = useAdmin()
  const { t, language } = useLanguage()
  const { loading, mounted, markSectionLoaded } = useSectionLoading()
  const designTokens = useDesignTokens()
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [showPageLoader, setShowPageLoader] = useState(true)
  
  console.log('🏠 HomePageContent renderizado - mounted:', mounted, 'loading:', loading)
  
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
  
  const handleAdminClick = () => {
    console.log('Admin click detected - redirecting to admin page')
    window.location.href = '/admin'
  }

  // Comportamiento de carga: iniciar siempre en el Home
  useLayoutEffect(() => {
    console.log('🔄 useLayoutEffect ejecutado - mounted:', mounted)
    
    if (mounted) {
      console.log('🎯 Asegurando que la página inicie en el Home...')
      console.log('📍 Posición actual del scroll:', window.scrollY)
      
      // Limpiar cualquier hash de la URL que pueda causar scroll automático
      if (window.location.hash) {
        console.log('🧹 Limpiando hash de la URL:', window.location.hash)
        window.history.replaceState(null, '', window.location.pathname)
      }
      
      // Forzar scroll inmediato al Home sin animación
      window.scrollTo({ top: 0, behavior: 'auto' })
      console.log('✅ Scroll al Home ejecutado (sin animación)')
      console.log('📍 Posición después del scroll:', window.scrollY)
    } else {
      console.log('⏳ Componente no montado aún, esperando...')
    }
  }, [mounted])

  console.log('🏠 HomePage renderizado')
  
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
        <Navbar onAdminClick={handleAdminClick} />

      
      {/* Sección Home - EG neuromórfico */}
      <section id="home" className="pt-24">
        <NeuromorphicEG />
      </section>

           {/* Título de sección Acerca de mí */}
           {!loading.home && (
             <div className="py-32">
               <div className="px-8">
                 <div className="max-w-6xl mx-auto">
                 </div>
               </div>
             </div>
           )}

           {/* Sección Acerca de mí - Nueva Versión 3 */}
           {loading.about ? (
             <SectionSkeleton type="about" />
           ) : (
        <section id="acerca" className="py-24">
        {console.log('📄 Renderizando sección Acerca de mí')}
        
        {/* Título "Acerca de mí" - Solo visible en mobile */}
        <div className="md:hidden text-center mb-8">
          <h2 className="text-2xl font-normal text-gray-600 dark:text-white">
            {t('about.title')}
          </h2>
        </div>
        
        <div className="px-8">
          <div className="max-w-7xl mx-auto">
            {/* Layout: Foto + Grid de 2x2 */}
            <div className="grid lg:grid-cols-3 gap-12">
              
              {/* Columna 1: Perfil - Solo Foto */}
              <div className="relative group">
                {/* Foto real o placeholder */}
                <div className="w-full h-full min-h-[550px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center rounded-xl overflow-hidden">
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
                          <div className="absolute inset-0 rounded-xl" style={{background: getDynamicOverlay()}}></div>
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
                <div className="absolute inset-0 rounded-xl" style={{background: designTokens.colors.primary.gradient, opacity: 0.2}}></div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Columna 2-3: Grid de 2x2 (Descripción + Experiencia + Especialidades) */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Descripción - Sin card, texto alineado a la izquierda */}
                <div className="md:col-span-2 mb-8">
                  {(() => {
                    const mainInfo = content.aboutInfo?.find(item => 
                      item.section === 'main' && item.language === language
                    );
                    
                    return (
                      <>
                        <h3 
                          className="mb-6 text-left text-gray-700 dark:text-white"
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
                <div className="bg-transparent rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
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
                  
                  <div className="flex-1 flex flex-col justify-center space-y-6">
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
                      <div key={index} className="relative pl-6 py-3">
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
                <div className="bg-transparent rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
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
                  
                  <div className="flex-1 flex flex-col justify-center space-y-5">
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
                      <div key={index} className="p-4">
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


           {/* Título de sección Contacto */}
           {!loading.home && (
             <div className="py-40">
               <div className="px-8">
                 <div className="max-w-6xl mx-auto">
                 </div>
               </div>
             </div>
           )}

           {/* Sección Contacto */}
           {loading.contact ? (
             <SectionSkeleton type="contact" />
           ) : (
        <section id="contacto" className="py-20" style={{background: designTokens.colors.primary.gradient}}>
        
        {/* Título "Contacto" - Solo visible en mobile */}
        <div className="md:hidden text-center mb-8">
          <h2 className="text-2xl font-normal text-white">
            {t('contact.title')}
          </h2>
        </div>
        
        <div className="px-8">

          {/* Cards horizontales limpias */}
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* WhatsApp Card */}
              <a 
                href={`https://wa.me/${content.contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group cursor-pointer block"
              >
                <div className="bg-transparent border-2 border-white rounded-2xl p-8 hover:border-white/80 transition-all duration-300 group-hover:scale-105">
                  <div className="text-center">
                    {/* Icono */}
                    <div className="flex justify-center mb-6">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                    </div>
                    
                    {/* Contenido */}
                    <h3 className="text-2xl font-normal text-white mb-3">{t('contact.whatsapp')}</h3>
                    <p className="text-lg font-normal text-white/90 mb-4">{content.contactInfo.whatsapp}</p>
                    <p className="text-sm text-white/80 mb-6">{t('contact.immediateResponse')}</p>
                    
                    {/* Línea blanca suave */}
                    <div className="w-16 h-0.5 mx-auto group-hover:w-24 transition-all duration-300 bg-white/60"></div>
                  </div>
                </div>
              </a>

              {/* LinkedIn Card */}
              <a 
                href={content.contactInfo.linkedinUrl ? 
                  (content.contactInfo.linkedinUrl.startsWith('http') ? 
                    content.contactInfo.linkedinUrl : 
                    `https://${content.contactInfo.linkedinUrl}`) : 
                  '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group cursor-pointer block"
              >
                <div className="bg-transparent border-2 border-white rounded-2xl p-8 hover:border-white/80 transition-all duration-300 group-hover:scale-105">
                  <div className="text-center">
                    {/* Icono */}
                    <div className="flex justify-center mb-6">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    
                    {/* Contenido */}
                    <h3 className="text-2xl font-normal text-white mb-3">{t('contact.linkedin')}</h3>
                    <p className="text-lg font-normal text-white/90 mb-4">{content.contactInfo.linkedin}</p>
                    <p className="text-sm text-white/80 mb-6">{t('contact.professionalNetwork')}</p>
                    
                    {/* Línea blanca suave */}
                    <div className="w-16 h-0.5 mx-auto group-hover:w-24 transition-all duration-300 bg-white/60"></div>
                  </div>
                </div>
              </a>

              {/* Email Card */}
              <div 
                className="group cursor-pointer"
                onClick={() => setIsEmailModalOpen(true)}
              >
                <div className="bg-transparent border-2 border-white rounded-2xl p-8 hover:border-white/80 transition-all duration-300 group-hover:scale-105">
                  <div className="text-center">
                    {/* Icono */}
                    <div className="flex justify-center mb-6">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    
                    {/* Contenido */}
                    <h3 className="text-2xl font-normal text-white mb-3">{t('contact.email')}</h3>
                    <p className="text-lg font-normal text-white/90 mb-4">garcia.elkin.salazar@gmail.com</p>
                    <p className="text-sm text-white/80 mb-6">{t('contact.sendEmail')}</p>
                    
                    {/* Línea blanca suave */}
                    <div className="w-16 h-0.5 mx-auto group-hover:w-24 transition-all duration-300 bg-white/60"></div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Información adicional */}
          <div className="text-center mt-20">
            <div className="max-w-2xl mx-auto">
              <p className="text-xl font-normal text-white/90 mb-4">
                {t('contact.locationText')}
              </p>
              <p className="text-xl font-normal text-white/90 mb-8">
                {t('contact.availableForProjects')}
              </p>
              <div className="w-24 h-0.5 mx-auto bg-white/60"></div>
            </div>
          </div>
        </div>
        </section>
      )}

      {/* Modal de Email */}
      <EmailModal 
        isOpen={isEmailModalOpen} 
        onClose={() => setIsEmailModalOpen(false)} 
      />
      
      {/* Page Loader */}
      <PageLoader 
        onComplete={() => setShowPageLoader(false)}
      />
    </div>
  )
}

export default function HomePage() {
  return (
    <AdminProvider>
      <HomePageContent />
    </AdminProvider>
  )
}

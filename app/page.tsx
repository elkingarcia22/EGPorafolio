'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { NeuromorphicEG } from '@/components/neuromorphic-eg'
import AdminModal from '@/components/admin-modal'
import AdminPanel from '@/components/admin-panel'
import { AdminProvider, useAdmin } from '@/contexts/admin-context'
import { useLanguage } from '@/contexts/language-context'

function HomePageContent() {
  const { content, refreshContent } = useAdmin()
  const { t } = useLanguage()
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const handleAdminClick = () => {
    console.log('Admin click detected')
    setIsAdminModalOpen(true)
  }

  const handleAdminAuthenticate = () => {
    setIsAdmin(true)
  }

  const handleAdminLogout = () => {
    setIsAdmin(false)
  }

  // Asegurar que la página cargue en el home
  useEffect(() => {
    // Scroll al inicio cuando se monta el componente
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
        <Navbar onAdminClick={handleAdminClick} />
        
        {/* Panel de administración */}
        <AdminPanel isAdmin={isAdmin} onLogout={handleAdminLogout} />
        
        {/* Modal de autenticación */}
        <AdminModal 
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          onAuthenticate={handleAdminAuthenticate}
        />

      
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
                <div className="absolute w-1 h-96" style={{right: '-13px', top: '8px', background: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Acerca de mí */}
      <section id="acerca" className="py-20">
        <div className="px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12 items-start">
              
              {/* Foto y nombre */}
              <div className="lg:col-span-1">
                <div className="relative group">
                  {/* Foto placeholder con gradiente */}
                  <div className="w-full h-96 rounded-2xl overflow-hidden shadow-lg">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Foto profesional</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Overlay con gradiente al hover */}
                  <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)', opacity: 0.2}}></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </div>
                
                {/* Nombre y título */}
                <div className="text-center mt-6">
                  <h3 className="text-2xl font-normal text-gray-600 dark:text-white mb-2">Elin Garcia</h3>
                  <p className="text-lg font-normal text-gray-600 dark:text-gray-400">Diseñador UX/UI Senior</p>
                  <div className="w-16 h-0.5 mx-auto mt-4" style={{background: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)'}}></div>
                </div>
              </div>

              {/* Descripción y experiencia */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h4 className="text-3xl font-normal text-gray-600 dark:text-white mb-6">
                    Creando experiencias digitales que conectan con las personas
                  </h4>
                  <p className="text-lg font-normal text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                    Soy un diseñador UX/UI apasionado por crear soluciones digitales que no solo se ven bien, 
                    sino que realmente funcionan para las personas. Con más de 5 años de experiencia, 
                    me especializo en transformar ideas complejas en interfaces intuitivas y accesibles.
                  </p>
                  <p className="text-lg font-normal text-gray-600 dark:text-gray-400 leading-relaxed">
                    Mi enfoque se centra en la investigación profunda del usuario, el diseño iterativo 
                    y la colaboración estrecha con equipos multidisciplinarios para lograr resultados 
                    excepcionales que impactan positivamente en el negocio y la experiencia del usuario.
                  </p>
                </div>

                {/* Experiencia y habilidades */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="text-xl font-normal text-gray-600 dark:text-white mb-4">Experiencia</h5>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{background: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)'}}></div>
                        <div>
                          <p className="text-base font-normal text-gray-600 dark:text-gray-400">5+ años en diseño UX/UI</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">Especialización en productos digitales</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{background: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)'}}></div>
                        <div>
                          <p className="text-base font-normal text-gray-600 dark:text-gray-400">50+ proyectos completados</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">Desde startups hasta empresas</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{background: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)'}}></div>
                        <div>
                          <p className="text-base font-normal text-gray-600 dark:text-gray-400">Liderazgo de equipos</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">Mentoría y dirección creativa</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xl font-normal text-gray-600 dark:text-white mb-4">Especialidades</h5>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{background: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)'}}></div>
                        <div>
                          <p className="text-base font-normal text-gray-600 dark:text-gray-400">Research & Testing</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">Investigación de usuarios</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{background: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)'}}></div>
                        <div>
                          <p className="text-base font-normal text-gray-600 dark:text-gray-400">Design Systems</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">Sistemas de diseño escalables</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{background: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)'}}></div>
                        <div>
                          <p className="text-base font-normal text-gray-600 dark:text-gray-400">Prototipado</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">Figma, Framer, Principle</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Título de sección Contacto */}
      <div className="py-40">
        <div className="px-8">
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              <div className="absolute right-0">
                <span className="text-2xl md:text-3xl font-normal text-gray-600 dark:text-white">
                  {t('contact.title')}
                </span>
                  {/* Línea degradada que baja hacia la sección */}
                  <div className="absolute w-1 h-40" style={{left: '-13px', top: '2px', background: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Contacto */}
      <section id="contacto" className="py-20" style={{background: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)'}}>
        <div className="px-8">

          {/* Cards horizontales limpias */}
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* WhatsApp Card */}
              <div className="group cursor-pointer">
                <div className="bg-transparent border-2 border-white rounded-2xl p-8 hover:border-white/80 transition-all duration-300 group-hover:scale-105">
                  <div className="text-center">
                    {/* Icono */}
                    <div className="flex justify-center mb-6">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                    </div>
                    
                    {/* Contenido */}
                    <h3 className="text-2xl font-normal text-white mb-3">WhatsApp</h3>
                    <p className="text-lg font-normal text-white/90 mb-4">{content.contactInfo.whatsapp}</p>
                    <p className="text-sm text-white/80 mb-6">Respuesta inmediata</p>
                    
                    {/* Línea blanca suave */}
                    <div className="w-16 h-0.5 mx-auto group-hover:w-24 transition-all duration-300 bg-white/60"></div>
                  </div>
                </div>
              </div>

              {/* LinkedIn Card */}
              <div className="group cursor-pointer">
                <div className="bg-transparent border-2 border-white rounded-2xl p-8 hover:border-white/80 transition-all duration-300 group-hover:scale-105">
                  <div className="text-center">
                    {/* Icono */}
                    <div className="flex justify-center mb-6">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    
                    {/* Contenido */}
                    <h3 className="text-2xl font-normal text-white mb-3">LinkedIn</h3>
                    <p className="text-lg font-normal text-white/90 mb-4">{content.contactInfo.linkedin}</p>
                    <p className="text-sm text-white/80 mb-6">Red profesional</p>
                    
                    {/* Línea blanca suave */}
                    <div className="w-16 h-0.5 mx-auto group-hover:w-24 transition-all duration-300 bg-white/60"></div>
                  </div>
                </div>
              </div>

              {/* Ubicación Card */}
              <div className="group cursor-pointer">
                <div className="bg-transparent border-2 border-white rounded-2xl p-8 hover:border-white/80 transition-all duration-300 group-hover:scale-105">
                  <div className="text-center">
                    {/* Icono */}
                    <div className="flex justify-center mb-6">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    
                    {/* Contenido */}
                    <h3 className="text-2xl font-normal text-white mb-3">Ubicación</h3>
                    <p className="text-lg font-normal text-white/90 mb-4">{content.contactInfo.location}</p>
                    <p className="text-sm text-white/80 mb-6">Trabajo remoto</p>
                    
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
                Disponible para nuevos proyectos y oportunidades
              </p>
              <p className="text-lg text-white/80 mb-8">
                Respuesta en menos de 24 horas
              </p>
              <div className="w-24 h-0.5 mx-auto bg-white/60"></div>
            </div>
          </div>
        </div>
      </section>
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

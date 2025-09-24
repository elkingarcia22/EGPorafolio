'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { mockData, isSupabaseConfigured } from '@/lib/mock-data'
import { supabase } from '@/lib/supabase-client'
import { useLanguage } from './language-context'

interface AdminContent {
  typewriterTexts: string[]
  projects: any[] // Array de objetos completos de proyectos
  projectTitles: string[]
  projectDescriptions: string[]
  aboutTitle: string
  aboutDescription: string
  aboutInfo: any[] // Array de objetos de información personal
  contactInfo: {
    whatsapp: string
    linkedin: string
    linkedinUrl: string
    location: string
  }
}

interface AdminContextType {
  content: AdminContent
  updateTypewriterTexts: (texts: string[]) => void
  updateProjectContent: (index: number, title: string, description: string) => void
  updateAboutContent: (title: string, description: string) => void
  updateContactInfo: (info: Partial<AdminContent['contactInfo']>) => void
  resetToDefault: () => void
  refreshContent: () => Promise<void>
}

const defaultContent: AdminContent = {
  typewriterTexts: mockData.typewriterTexts.map(item => item.text_content),
  projects: [], // Inicializar vacío, se cargará desde Supabase
  projectTitles: [],
  projectDescriptions: [],
  aboutTitle: mockData.aboutInfo[0]?.title || 'Acerca de mí',
  aboutDescription: mockData.aboutInfo[0]?.description || 'Soy un diseñador UX/UI con más de 5 años de experiencia creando experiencias digitales excepcionales.',
  aboutInfo: mockData.aboutInfo, // Incluir los objetos completos de aboutInfo
  contactInfo: {
    whatsapp: mockData.contactInfo.find(item => item.contact_type === 'whatsapp')?.value || '+54 11 1234-5678',
    linkedin: mockData.contactInfo.find(item => item.contact_type === 'linkedin')?.value || 'Conectar',
    linkedinUrl: 'https://linkedin.com/in/elkingarcia',
    location: mockData.contactInfo.find(item => item.contact_type === 'location')?.value || 'Buenos Aires, Argentina'
  }
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<AdminContent>(defaultContent)
  const { language } = useLanguage()

  // Cargar contenido desde Supabase si está configurado
  useEffect(() => {
    console.log('🚀 AdminProvider montado, idioma:', language)
    console.log('🔧 isSupabaseConfigured():', isSupabaseConfigured())
    
    if (!isSupabaseConfigured()) {
      console.log('⚠️ Supabase no configurado, usando datos mock')
      return
    }

    console.log('🔄 Cargando contenido desde Supabase para idioma:', language)

    const fetchContent = async () => {
      try {
        console.log('📡 Fetching data from Supabase...')
        
        // Fetch typewriter texts
        const { data: typewriterData, error: typewriterError } = await supabase
          .from('typewriter_texts')
          .select('*')
          .eq('is_active', true)
          .eq('language', language)
          .order('order_index')
        
        if (typewriterError) {
          console.error('❌ Error typewriter:', typewriterError)
        } else {
          console.log('✅ Typewriter data:', typewriterData)
        }

        // Fetch projects (nueva estructura) - En admin mostramos todos los proyectos
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('order_index')
        
        if (projectsError) {
          console.error('❌ Error projects:', projectsError)
        } else {
          console.log('✅ Projects data:', projectsData)
          console.log('📊 Cantidad de proyectos cargados:', projectsData?.length || 0)
          // Actualizar el estado con los proyectos cargados
          setContent(prev => {
            const newContent = {
              ...prev,
              projects: projectsData || [],
              projectTitles: (projectsData || []).map(project => project.title),
              projectDescriptions: (projectsData || []).map(project => project.description)
            }
            console.log('🔄 Estado actualizado con proyectos:', projectsData?.length || 0)
            console.log('📊 Nuevo estado projects:', newContent.projects)
            return newContent
          })
        }

        // Fetch about info
        const { data: aboutData, error: aboutError } = await supabase
          .from('about_info')
          .select('*')
          .eq('is_active', true)
        
        if (aboutError) {
          console.error('❌ Error about:', aboutError)
        } else {
          console.log('✅ About data:', aboutData)
        }

        // Fetch contact info
        const { data: contactData, error: contactError } = await supabase
          .from('contact_info')
          .select('*')
          .eq('is_active', true)
          .eq('language', language)
          .order('order_index')
        
        if (contactError) {
          console.error('❌ Error contact:', contactError)
        } else {
          console.log('✅ Contact data:', contactData)
        }

        const typewriter = typewriterData ?? []
        const projects = projectsData ?? []
        const about = aboutData ?? []
        const contact = contactData ?? []

        console.log('📊 Datos recibidos:', {
          typewriter: typewriter.length,
          projects: projects.length,
          about: about.length,
          contact: contact.length
        })

        const newContent = {
          typewriterTexts: typewriter.map((t: any) => t.text_content),
          projects: projects.slice(0, 4), // Incluir los objetos completos de proyectos
          projectTitles: projects.map((p: any) => p.title).slice(0, 4),
          projectDescriptions: projects.map((p: any) => p.description).slice(0, 4),
          aboutTitle: about[0]?.title ?? 'Acerca de mí',
          aboutDescription: about[0]?.description ?? 'Soy un diseñador UX/UI con más de 5 años de experiencia creando experiencias digitales excepcionales.',
          aboutInfo: about, // Incluir los objetos completos de aboutInfo
          contactInfo: {
            whatsapp: contact.find((c: any) => c.contact_type === 'whatsapp')?.value ?? '+54 11 1234-5678',
            linkedin: contact.find((c: any) => c.contact_type === 'linkedin')?.value ?? 'Conectar',
            linkedinUrl: contact.find((c: any) => c.contact_type === 'linkedin')?.url ?? 'https://linkedin.com/in/elkingarcia',
            location: contact.find((c: any) => c.contact_type === 'location')?.value ?? 'Buenos Aires, Argentina'
          }
        }

        console.log('✅ Actualizando contexto con:', newContent)
        console.log('🔗 LinkedIn URL cargada:', newContent.contactInfo.linkedinUrl)
        setContent(newContent)
      } catch (error) {
        console.error('❌ Error cargando contenido desde Supabase:', error)
      }
    }

    // carga inicial
    fetchContent()

    // Polling cada 10 segundos para detectar cambios
    const pollInterval = setInterval(() => {
      console.log('🔄 Polling para cambios...')
      fetchContent()
    }, 10000)

    return () => {
      console.log('🧹 Limpiando polling...')
      clearInterval(pollInterval)
    }
  }, [language])

  const updateTypewriterTexts = (texts: string[]) => {
    setContent(prev => ({ ...prev, typewriterTexts: texts }))
  }

  const updateProjectContent = (index: number, title: string, description: string) => {
    setContent(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index 
          ? { ...project, title, description }
          : project
      ),
      projectTitles: prev.projectTitles.map((t, i) => i === index ? title : t),
      projectDescriptions: prev.projectDescriptions.map((d, i) => i === index ? description : d)
    }))
  }

  const updateAboutContent = (title: string, description: string) => {
    setContent(prev => ({ ...prev, aboutTitle: title, aboutDescription: description }))
  }

  const updateContactInfo = (info: Partial<AdminContent['contactInfo']>) => {
    setContent(prev => ({ ...prev, contactInfo: { ...prev.contactInfo, ...info } }))
  }

  const resetToDefault = () => {
    setContent(defaultContent)
  }

  const refreshContent = async () => {
    if (!isSupabaseConfigured()) return
    
    console.log('🔄 Forzando recarga de contenido para idioma:', language)
    try {
      const [typewriterRes, projectsRes, aboutRes, contactRes] = await Promise.all([
        supabase.from('typewriter_texts').select('*').eq('is_active', true).eq('language', language).order('order_index'),
        supabase.from('projects').select('*').order('order_index'),
        supabase.from('about_info').select('*').eq('is_active', true),
        supabase.from('contact_info').select('*').eq('is_active', true).order('order_index')
      ])

      const typewriter = typewriterRes.data ?? []
      const projects = projectsRes.data ?? []
      const about = aboutRes.data ?? []
      const contact = contactRes.data ?? []

      const newContent = {
        typewriterTexts: typewriter.map((t: any) => t.text_content),
        projects: projects, // Incluir el array completo de proyectos
        projectTitles: projects.map((p: any) => p.title).slice(0, 4),
        projectDescriptions: projects.map((p: any) => p.description).slice(0, 4),
        aboutTitle: about[0]?.title ?? 'Acerca de mí',
        aboutDescription: about[0]?.description ?? 'Soy un diseñador UX/UI con más de 5 años de experiencia creando experiencias digitales excepcionales.',
        aboutInfo: about, // Incluir los objetos completos de aboutInfo
        contactInfo: {
          whatsapp: contact.find((c: any) => c.contact_type === 'whatsapp')?.value ?? '+54 11 1234-5678',
          linkedin: contact.find((c: any) => c.contact_type === 'linkedin')?.value ?? 'Conectar',
          linkedinUrl: contact.find((c: any) => c.contact_type === 'linkedin')?.url ?? 'https://linkedin.com/in/elkingarcia',
          location: contact.find((c: any) => c.contact_type === 'location')?.value ?? 'Buenos Aires, Argentina'
        }
      }

      console.log('✅ Contenido recargado:', newContent)
      setContent(newContent)
    } catch (error) {
      console.error('❌ Error recargando contenido:', error)
    }
  }

  return (
    <AdminContext.Provider value={{
      content,
      updateTypewriterTexts,
      updateProjectContent,
      updateAboutContent,
      updateContactInfo,
      resetToDefault,
      refreshContent
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

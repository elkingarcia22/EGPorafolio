'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { supabase } from '@/lib/supabase-client'
import { isSupabaseConfigured } from '@/lib/mock-data'
import { useDesignTokens } from '@/hooks/useDesignTokens'
import { useNotificationHelpers } from '@/components/ui/notification-system'
import { NeoButton } from '@/components/ui/neo-button'
import { NeoInput } from '@/components/ui/neo-input'
import { NeoTextarea } from '@/components/ui/neo-textarea'
import { NeoSelect } from '@/components/ui/neo-select'
import { NeoCard } from '@/components/ui/neo-card'

// Función para determinar el mejor color de texto basado en el gradiente
const getTextColorForGradient = (gradientCss: string) => {
  // Extraer colores del gradiente para determinar si es claro u oscuro
  const colors = gradientCss.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g) || []
  
  if (colors.length === 0) {
    return { color: '#ffffff', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }
  }
  
  // Calcular luminancia promedio de los colores
  let totalLuminance = 0
  colors.forEach(color => {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    totalLuminance += luminance
  })
  
  const avgLuminance = totalLuminance / colors.length
  
  // Si el gradiente es claro, usar texto oscuro, si es oscuro, usar texto claro
  if (avgLuminance > 0.5) {
    return { 
      color: '#000000', 
      textShadow: '2px 2px 4px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.5)' 
    }
  } else {
    return { 
      color: '#ffffff', 
      textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.5)' 
    }
  }
}

interface AdminData {
  typewriterTexts: Array<{ id: string; text_content: string; order_index: number }>
  projects: Array<{ 
    id: string; 
    title: string; 
    title_es?: string;
    title_en?: string;
    description: string; 
    description_es?: string;
    description_en?: string;
    cover_image_url?: string; 
    order_index: number;
    status?: string;
    featured?: boolean;
    slug?: string;
  }>
  aboutInfo: Array<{ 
    id: string; 
    title: string; 
    description: string; 
    profile_image_url?: string;
    section: string;
    language: string;
    order_index?: number;
  }>
  contactInfo: Array<{ id: string; contact_type: string; label: string; value: string; url?: string; language?: string; icon_name: string; order_index: number }>
  siteImages: Array<{ id: string; image_name: string; image_url: string; section: string; usage_context: string }>
  colors: Array<{ id: string; name: string; gradient_css: string; is_active: boolean; is_default: boolean }>
}

export default function AdminPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const designTokens = useDesignTokens()
  const { success, error: showError, info, warning } = useNotificationHelpers()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState<'typewriter' | 'projects' | 'about' | 'contact' | 'images' | 'colors'>('typewriter')
  const [data, setData] = useState<AdminData>({
    typewriterTexts: [],
    projects: [],
    aboutInfo: [],
    contactInfo: [],
    siteImages: [],
    colors: []
  })
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)

  // supabase ya está importado

  useEffect(() => {
    // Verificar si ya está autenticado
    const authStatus = localStorage.getItem('admin_authenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      loadData()
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      // Simular validación de contraseña
      if (password === 'Lineadesangre22') {
    setIsAuthenticated(true)
        localStorage.setItem('admin_authenticated', 'true')
        await loadData()
      } else {
        setError('Contraseña incorrecta')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
    setIsLoading(false)
    }
  }

  const loadData = async () => {
    if (!isSupabaseConfigured()) {
      // Usar datos mock si Supabase no está configurado
      setData({
        typewriterTexts: [
          { id: '1', text_content: 'Diseñador UX/UI senior specialist', order_index: 1 },
          { id: '2', text_content: 'Diseño de interacciones', order_index: 2 },
          { id: '3', text_content: 'Diseño de estrategias', order_index: 3 },
          { id: '4', text_content: 'Diseño inteligente IA', order_index: 4 }
        ],
        projects: [
          { id: '1', title: 'UX Research', description: 'Investigación profunda de usuarios para crear experiencias excepcionales y centradas en el ser humano', order_index: 1, cover_image_url: '' },
          { id: '2', title: 'UI Design', description: 'Diseño de interfaces modernas, funcionales y visualmente impactantes que conectan con los usuarios', order_index: 2, cover_image_url: '' },
          { id: '3', title: 'Estrategia Digital', description: 'Desarrollo de estrategias digitales integrales que transforman marcas y productos', order_index: 3, cover_image_url: '' },
          { id: '4', title: 'Diseño con IA', description: 'Proyectos innovadores que combinan inteligencia artificial con diseño creativo', order_index: 4, cover_image_url: '' }
        ],
        aboutInfo: [
          { 
            id: '1', 
            title: 'Del output al outcome: diseño que entrega resultados reales.', 
            description: 'Senior Product & UX/UI Designer con más de 10 años de experiencia liderando proyectos digitales de principio a fin. Trabajo de manera estratégica y planificada, combinando investigación, diseño visual y sistemas de diseño para asegurar consistencia, escalabilidad y eficiencia. Complemento mi trabajo con herramientas de IA que me permiten acelerar la ideación y validación, logrando productos más robustos y efectivos.',
            section: 'main',
            language: 'es'
          },
          {
            id: '2',
            title: '10+ años en UX/UI & Product Design',
            description: 'Especialización en productos digitales',
            section: 'experience',
            language: 'es',
            order_index: 1
          },
          {
            id: '3',
            title: '15+ proyectos completados',
            description: 'Desde startups hasta empresas',
            section: 'experience',
            language: 'es',
            order_index: 2
          },
          {
            id: '4',
            title: 'Sistemas Estratégicos',
            description: 'Escalables y consistentes',
            section: 'experience',
            language: 'es',
            order_index: 3
          },
          {
            id: '5',
            title: 'Research & Strategy',
            description: 'Insights, outcomes',
            section: 'specialties',
            language: 'es',
            order_index: 1
          },
          {
            id: '6',
            title: 'Interaction Design',
            description: 'Micro-experiences, usability',
            section: 'specialties',
            language: 'es',
            order_index: 2
          },
          {
            id: '7',
            title: 'AI-Enhanced Design',
            description: 'Optimization, agility',
            section: 'specialties',
            language: 'es',
            order_index: 3
          },
          {
            id: '8',
            title: 'Foto de Perfil',
            description: '',
            section: 'photo',
            language: 'es',
            profile_image_url: ''
          }
        ],
        contactInfo: [
          { id: '1', contact_type: 'whatsapp', label: 'WhatsApp', value: '+54 11 1234-5678', icon_name: 'whatsapp', order_index: 1 },
          { id: '2', contact_type: 'linkedin', label: 'LinkedIn', value: 'Conectar', icon_name: 'linkedin', order_index: 2 },
          { id: '3', contact_type: 'location', label: 'Ubicación', value: 'Buenos Aires, Argentina', icon_name: 'location', order_index: 3 }
        ],
        siteImages: [],
        colors: [
          {
            id: '1',
            name: 'Gradiente Original',
            gradient_css: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)',
            is_active: true,
            is_default: true
          }
        ]
      })
      return
    }

    try {
      // Cargar textos del typewriter
      const { data: typewriterData } = await supabase
        .from('typewriter_texts')
        .select('*')
        .eq('is_active', true)
        .order('order_index')

      // Cargar proyectos
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .order('order_index')

      // Cargar información personal
      const { data: aboutData } = await supabase
        .from('about_info')
        .select('*')
        .eq('is_active', true)

      // Cargar información de contacto
      const { data: contactData } = await supabase
        .from('contact_info')
        .select('*')
        .eq('is_active', true)
        .order('order_index')
      

      // Cargar imágenes
      const { data: imagesData } = await supabase
        .from('site_images')
        .select('*')
        .eq('is_active', true)

      // Cargar colores
      console.log('🎨 Cargando colores desde Supabase...')
      const { data: colorsData, error: colorsError } = await supabase
        .from('colors')
        .select('*')
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('name', { ascending: true })
      
      if (colorsError) {
        console.error('❌ Error cargando colores:', colorsError)
      } else {
        console.log('✅ Colores cargados:', colorsData)
      }

      const newData = {
        typewriterTexts: typewriterData || [],
        projects: projectsData || [],
        aboutInfo: aboutData || [],
        contactInfo: contactData || [],
        siteImages: imagesData || [],
        colors: colorsData || []
      }
      
      console.log('📊 Estableciendo datos en el estado:', {
        colors: newData.colors,
        colorsCount: newData.colors.length
      })
      
      setData(newData)
      
    } catch (error: any) {
      console.error('❌ Error loading data:', error)
      console.error('📊 Detalles del error:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code
      })
      
      // Si es un error de tabla no encontrada, mostrar mensaje específico
      if (error?.message?.includes('relation "colors" does not exist')) {
        console.warn('⚠️ La tabla colors no existe. Ejecuta el SQL de creación primero.')
      }
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_authenticated')
    setPassword('')
    setData({
      typewriterTexts: [],
      projects: [],
      aboutInfo: [],
      contactInfo: [],
      siteImages: [],
      colors: []
    })
  }

  const handleRefreshData = async () => {
    console.log('🔄 Recargando datos...')
    await loadData()
  }

  const handleEdit = (item: any, type: string) => {
    setEditingItem({ ...item, type })
    setIsEditing(true)
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      console.log('❌ No se seleccionó ningún archivo')
      return
    }

    console.log('📁 Archivo seleccionado:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    })

    try {
      setIsLoading(true)
      
      // El bucket "images" ya existe (confirmado en Dashboard)
      console.log('🪣 Usando bucket "images" existente')
      
      // Crear un nombre único para el archivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `project-images/${fileName}`

      console.log('📤 Preparando subida:', {
        fileName,
        filePath,
        fileSize: file.size,
        fileType: file.type
      })
      
      // Verificar permisos del bucket (opcional)
      console.log('🔐 Verificando acceso al bucket...')
      try {
        const { data: bucketInfo, error: bucketError } = await supabase.storage.getBucket('images')
        if (bucketError) {
          console.warn('⚠️ No se pudo obtener info del bucket (normal para anon key):', bucketError.message)
        } else {
          console.log('📊 Información del bucket:', bucketInfo)
        }
      } catch (error) {
        console.warn('⚠️ Error verificando bucket (continuando...):', error)
      }
      
      // Subir archivo a Supabase Storage
      console.log('⬆️ Iniciando subida...')
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) {
        console.error('❌ Error uploading file:', uploadError)
        console.error('❌ Detalles del error:', {
          message: uploadError.message,
          name: uploadError.name
        })
        throw uploadError
      }

      console.log('✅ Imagen subida exitosamente:', uploadData)

      // Obtener URL pública de la imagen
      console.log('🔗 Generando URL pública...')
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      console.log('🔗 URL pública generada:', publicUrl)

      // Verificar que la URL es accesible
      console.log('🌐 Verificando accesibilidad de la URL...')
      try {
        const response = await fetch(publicUrl, { method: 'HEAD' })
        console.log('📡 Respuesta de verificación:', response.status, response.statusText)
      } catch (fetchError) {
        console.warn('⚠️ No se pudo verificar la URL:', fetchError)
      }

      // Actualizar el elemento con la URL de la imagen según el tipo
      console.log('💾 Actualizando elemento con URL de imagen...')
      
      if (editingItem.type === 'about_photo') {
        setEditingItem({ ...editingItem, profile_image_url: publicUrl })
      } else {
        setEditingItem({ ...editingItem, cover_image_url: publicUrl })
      }
      
      // Guardar automáticamente en la base de datos si el elemento ya existe
      if (editingItem.id) {
        console.log('💾 Guardando URL en la base de datos...')
        
        if (editingItem.type === 'about_photo') {
          // Actualizar imagen de perfil
          const { error: updateError } = await supabase
            .from('about_info')
            .update({ profile_image_url: publicUrl })
            .eq('id', editingItem.id)
          
          if (updateError) {
            console.error('❌ Error guardando URL en BD:', updateError)
            throw updateError
          }
          
          // También actualizar la imagen para el mismo perfil en el otro idioma
          console.log('🌐 Actualizando imagen de perfil en ambos idiomas...')
          const { error: updateOtherLangError } = await supabase
            .from('about_info')
            .update({ profile_image_url: publicUrl })
            .eq('section', 'photo')
            .neq('id', editingItem.id)
          
          if (updateOtherLangError) {
            console.warn('⚠️ No se pudo actualizar el otro idioma (normal si no existe):', updateOtherLangError.message)
          } else {
            console.log('✅ Imagen de perfil actualizada en ambos idiomas')
          }
        } else {
          // Actualizar imagen de proyecto
          const { error: updateError } = await supabase
            .from('projects')
            .update({ cover_image_url: publicUrl })
            .eq('id', editingItem.id)
          
          if (updateError) {
            console.error('❌ Error guardando URL en BD:', updateError)
            throw updateError
          }
          
          // También actualizar la imagen para el mismo proyecto en el otro idioma
          console.log('🌐 Actualizando imagen en ambos idiomas...')
          const { error: updateOtherLangError } = await supabase
            .from('projects')
            .update({ cover_image_url: publicUrl })
            .eq('order_index', editingItem.order_index)
            .neq('id', editingItem.id)
          
          if (updateOtherLangError) {
            console.warn('⚠️ No se pudo actualizar el otro idioma (normal si no existe):', updateOtherLangError.message)
          } else {
            console.log('✅ Imagen actualizada en ambos idiomas')
          }
        }
        
        console.log('✅ URL guardada en la base de datos')
        // Recargar datos para reflejar cambios
        await loadData()
      }
      
      console.log('✅ Imagen actualizada exitosamente')
      
    } catch (error: any) {
      console.error('❌ Error uploading image:', error)
      console.error('❌ Stack trace:', error.stack)
      
      let errorMessage = 'Error al subir la imagen. '
      if (error.message?.includes('JWT')) {
        errorMessage += 'Problema de autenticación. Verifica las credenciales de Supabase.'
      } else if (error.message?.includes('permission')) {
        errorMessage += 'Problema de permisos. Verifica las políticas del bucket.'
      } else if (error.message?.includes('size')) {
        errorMessage += 'Archivo muy grande. Máximo 5MB.'
      } else {
        errorMessage += 'Verifica que Supabase esté configurado correctamente.'
      }
      
      showError('Error al guardar', errorMessage)
    } finally {
      setIsLoading(false)
      console.log('🏁 Proceso de subida finalizado')
    }
  }

  const handleSave = async () => {
    console.log('🚀 handleSave iniciado')
    console.log('🔍 editingItem:', editingItem)
    
    if (!editingItem) {
      console.log('❌ No hay editingItem, saliendo')
      return
    }

    try {
      console.log('🔄 Procesando editingItem...')
      const { type, ...itemData } = editingItem
      delete itemData.type
      console.log('✅ itemData procesado:', itemData)

      // Mapear los nuevos tipos a las tablas de la base de datos
      let tableName = type
      if (type.startsWith('about_')) {
        tableName = 'about_info'
      }

      console.log('🔍 Debug handleSave:')
      console.log('  - type:', type)
      console.log('  - tableName:', tableName)
      console.log('  - editingItem:', editingItem)
      console.log('  - itemData:', itemData)
      console.log('  - editingItem.id:', editingItem?.id)

      let result
      if (editingItem.id && editingItem.id !== '') {
        // Actualizar
        console.log('🔄 Actualizando elemento con ID:', editingItem.id)
        result = await supabase
          .from(tableName)
          .update(itemData)
          .eq('id', editingItem.id)
      } else {
        // Crear nuevo
        console.log('➕ Creando nuevo elemento')
        result = await supabase
          .from(tableName)
          .insert(itemData)
      }

      if (result.error) {
        console.error('❌ Error de Supabase:', result.error)
        console.error('🔍 Datos que se intentaron guardar:', itemData)
        console.error('🔍 Tabla:', activeTab)
        console.error('🔍 Operación:', editingItem ? 'UPDATE' : 'INSERT')
        console.error('🔍 ID del elemento:', editingItem?.id)
        console.error('🔍 editingItem completo:', editingItem)
        console.error('🔍 Condición editingItem.id:', !!editingItem.id)
        throw result.error
      }

      console.log('✅ Elemento guardado exitosamente')
      setIsEditing(false)
      setEditingItem(null)
      console.log('🔄 Recargando datos después del guardado...')
      await loadData()
      console.log('✅ Datos recargados exitosamente')
    } catch (error: any) {
      console.error('❌ Error saving:', error)
      console.error('🔍 Error completo:', JSON.stringify(error, null, 2))
      console.error('📊 Detalles del error:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        status: error?.status,
        statusText: error?.statusText
      })
      console.error('🔍 Configuración de Supabase:', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configurado' : 'No configurado',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configurado' : 'No configurado',
        serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configurado' : 'No configurado'
      })
      
      // Mostrar error más específico al usuario
      let errorMessage = 'Error al guardar el elemento'
      if (error?.message?.includes('relation "colors" does not exist')) {
        errorMessage = 'La tabla de colores no existe. Ejecuta el SQL de creación primero.'
      } else if (error?.message?.includes('permission denied')) {
        errorMessage = 'Error de permisos. Verifica las políticas de RLS.'
      } else if (error?.message) {
        errorMessage = `Error: ${error.message}`
      }
      
      showError('Error al guardar', errorMessage)
    }
  }

  const handleDelete = async (id: string, type: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este elemento?')) return

    try {
      // Mapear los nuevos tipos a las tablas de la base de datos
      let tableName = type
      if (type.startsWith('about_')) {
        tableName = 'about_info'
      }

      const result = await supabase
        .from(tableName)
        .update({ is_active: false })
        .eq('id', id)

      if (result.error) throw result.error

      await loadData()
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const handleApplyGradient = async (gradient: any) => {
    try {
      console.log('🎨 Aplicando gradiente:', gradient.name)
      
      // Primero, quitar el estado de "por defecto" de todos los gradientes
      const { error: clearError } = await supabase
        .from('colors')
        .update({ is_default: false })
        .neq('id', '00000000-0000-0000-0000-000000000000')

      if (clearError) {
        console.error('❌ Error limpiando gradientes por defecto:', clearError)
        throw clearError
      }

      // Luego, establecer el gradiente seleccionado como por defecto
      const { error: applyError } = await supabase
        .from('colors')
        .update({ is_default: true })
        .eq('id', gradient.id)

      if (applyError) {
        console.error('❌ Error aplicando gradiente:', applyError)
        throw applyError
      }

      console.log('✅ Gradiente aplicado exitosamente:', gradient.name)
      
      // Recargar datos para reflejar los cambios
      await loadData()
      
      // Marcar en localStorage que se actualizó un gradiente
      localStorage.setItem('admin-gradient-updated', Date.now().toString())
      
      // Mostrar mensaje de éxito
      success('Gradiente aplicado', `¡Gradiente "${gradient.name}" aplicado exitosamente al sitio!`)
      
    } catch (error) {
      console.error('❌ Error aplicando gradiente:', error)
      showError('Error al aplicar gradiente', 'Por favor, inténtalo de nuevo.')
    }
  }

  const handleAddNew = (type: string) => {
    const newItem: any = { type }
    
    switch (type) {
      case 'typewriter_texts':
        newItem.text_content = ''
        newItem.order_index = data.typewriterTexts.length + 1
        newItem.is_active = true
        break
      case 'projects':
        newItem.title = ''
        newItem.title_es = ''
        newItem.title_en = ''
        newItem.description = ''
        newItem.description_es = ''
        newItem.description_en = ''
        newItem.cover_image_url = ''
        newItem.order_index = data.projects.length + 1
        newItem.status = 'published'
        newItem.featured = false
        newItem.slug = ''
        newItem.language = 'es'
        break
      case 'about_main':
        newItem.title = ''
        newItem.description = ''
        newItem.section = 'main'
        newItem.language = 'es'
        newItem.is_active = true
        break
      case 'about_experience':
        newItem.title = ''
        newItem.description = ''
        newItem.section = 'experience'
        newItem.language = 'es'
        newItem.order_index = (data.aboutInfo.filter(item => item.section === 'experience').length) + 1
        newItem.is_active = true
        break
      case 'about_specialties':
        newItem.title = ''
        newItem.description = ''
        newItem.section = 'specialties'
        newItem.language = 'es'
        newItem.order_index = (data.aboutInfo.filter(item => item.section === 'specialties').length) + 1
        newItem.is_active = true
        break
      case 'about_photo':
        newItem.title = 'Foto de Perfil'
        newItem.description = ''
        newItem.section = 'photo'
        newItem.language = 'es'
        newItem.profile_image_url = ''
        newItem.is_active = true
        break
      case 'about_info':
        newItem.title = ''
        newItem.description = ''
        newItem.is_active = true
        break
      case 'contact_info':
        newItem.contact_type = ''
        newItem.label = ''
        newItem.value = ''
        newItem.icon_name = ''
        newItem.order_index = data.contactInfo.length + 1
        newItem.is_active = true
        break
      case 'site_images':
        newItem.image_name = ''
        newItem.image_url = ''
        newItem.section = ''
        newItem.usage_context = ''
        newItem.is_active = true
        break
      case 'colors':
        newItem.name = ''
        newItem.gradient_css = ''
        newItem.is_active = true
        newItem.is_default = false
        break
    }

    setEditingItem(newItem)
    setIsEditing(true)
  }

  if (!isAuthenticated) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900"
        style={{ 
          fontFamily: designTokens.typography.fontFamily.sans 
        }}
      >
        <NeoCard className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <svg 
                className="w-8 h-8 mr-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                strokeWidth={2}
                style={{ color: designTokens.colors.text.secondary }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h1 
                className="text-3xl font-bold"
                style={{ 
                  color: designTokens.colors.text.primary,
                  fontSize: designTokens.typography.fontSize['3xl'],
                  fontWeight: designTokens.typography.fontWeight.bold
                }}
              >
                Panel de Administración
              </h1>
            </div>
            <p 
              className="text-sm"
              style={{ 
                color: designTokens.colors.text.secondary,
                fontSize: designTokens.typography.fontSize.sm
              }}
            >
              Ingresa la contraseña para acceder
              </p>
            </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
              <NeoInput
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                required
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  style={{ color: designTokens.colors.text.tertiary }}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {error && (
                <p 
                  className="text-sm mt-2"
                  style={{ 
                    color: designTokens.colors.state.error,
                    fontSize: designTokens.typography.fontSize.sm
                  }}
                >
                  {error}
                </p>
              )}
            </div>

              <NeoButton
                type="submit"
              variant="primary"
              disabled={isLoading || !password}
              className="w-full"
              style={{ 
                background: designTokens.colors.primary.gradient,
                fontSize: designTokens.typography.fontSize.base,
                fontWeight: designTokens.typography.fontWeight.medium
              }}
            >
              {isLoading ? 'Verificando...' : 'Acceder'}
              </NeoButton>
            </form>

          <div className="mt-6 text-center">
            <NeoButton
              variant="ghost"
              onClick={() => router.push('/')}
              className="flex items-center justify-center space-x-2 mx-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Volver al sitio</span>
            </NeoButton>
          </div>
          </NeoCard>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      style={{ 
        fontFamily: designTokens.typography.fontFamily.sans 
      }}
    >
      {/* Header */}
      <div 
        className="shadow-sm border-b bg-white dark:bg-black border-gray-200 dark:border-gray-800"
        style={{ 
          boxShadow: designTokens.boxShadow.sm
        }}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg 
                className="w-8 h-8" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                strokeWidth={2}
                style={{ color: designTokens.colors.text.secondary }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <h1 
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                  style={{ 
                    fontSize: designTokens.typography.fontSize['2xl'],
                    fontWeight: designTokens.typography.fontWeight.bold
                  }}
                >
                Panel de Administración
              </h1>
                <p 
                  className="text-sm text-gray-600 dark:text-gray-400"
                  style={{ 
                    fontSize: designTokens.typography.fontSize.sm
                  }}
                >
                  Gestiona el contenido de tu portafolio
                </p>
            </div>
            </div>
            <div className="flex items-center space-x-2">
              <NeoButton
                variant="ghost"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center space-x-2"
              >
                {theme === 'dark' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
                <span>{theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
              </NeoButton>
              <NeoButton
                variant="ghost"
                onClick={() => {
                  // Abrir página de prueba de gradientes en nueva pestaña
                  window.open('/test-gradients', '_blank')
                }}
                className="flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
                <span>Probar Gradientes</span>
              </NeoButton>
              <NeoButton
                variant="ghost"
                onClick={() => {
                  // Abrir en nueva pestaña para que se recargue automáticamente
                  window.open('/', '_blank')
                }}
                className="flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>Ver Sitio</span>
              </NeoButton>
              <NeoButton
                variant="secondary"
                onClick={handleLogout}
                className="flex items-center space-x-2"
                style={{ 
                  background: designTokens.colors.state.error,
                  color: designTokens.colors.text.white
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Cerrar Sesión</span>
              </NeoButton>
            </div>
          </div>
        </div>
      </div>

      {/* Banner de advertencia si Supabase no está configurado */}
      {!isSupabaseConfigured() && (
        <div 
          className="border-l-4 p-4"
          style={{ 
            background: '#FEF3C7',
            borderColor: designTokens.colors.state.warning
          }}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
                style={{ color: designTokens.colors.state.warning }}
              >
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p 
                className="text-sm"
                style={{ 
                  color: '#92400E',
                  fontSize: designTokens.typography.fontSize.sm
                }}
              >
                <strong>Modo de desarrollo:</strong> Supabase no está configurado. Los cambios se guardan localmente.
                <br />
                <a href="/scripts/setup-env.js" className="underline">Configura Supabase</a> para persistir los datos.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
          {/* Sidebar */}
        <div 
          className="w-64 shadow-sm border-r min-h-screen bg-white dark:bg-black border-gray-200 dark:border-gray-800"
          style={{ 
            boxShadow: designTokens.boxShadow.sm
          }}
        >
          <nav className="p-4">
            <div className="space-y-2">
              {[
                { 
                  key: 'typewriter', 
                  label: 'Textos Typewriter', 
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )
                },
                { 
                  key: 'projects', 
                  label: 'Cards Proyectos', 
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  )
                },
                { 
                  key: 'about', 
                  label: 'Acerca de Mí', 
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )
                },
                { 
                  key: 'contact', 
                  label: 'Contacto', 
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  )
                },
                { 
                  key: 'colors', 
                  label: 'Colores', 
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                  )
                }
              ].map(tab => (
                  <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors"
                  style={{
                    background: activeTab === tab.key 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'transparent',
                    color: activeTab === tab.key 
                      ? 'transparent' 
                      : designTokens.colors.text.secondary,
                    borderRadius: designTokens.borderRadius.lg,
                    fontSize: designTokens.typography.fontSize.sm,
                    fontWeight: designTokens.typography.fontWeight.medium,
                    transition: `all ${designTokens.transition.duration[200]} ${designTokens.transition.timing.out}`
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.key) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.key) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  <span style={{ color: activeTab === tab.key ? 'transparent' : designTokens.colors.text.secondary, backgroundImage: activeTab === tab.key ? designTokens.colors.primary.gradient : 'none', WebkitBackgroundClip: activeTab === tab.key ? 'text' : 'initial', backgroundClip: activeTab === tab.key ? 'text' : 'initial' }}>
                    {tab.icon}
                  </span>
                  <span style={{ color: activeTab === tab.key ? 'transparent' : designTokens.colors.text.secondary, backgroundImage: activeTab === tab.key ? designTokens.colors.primary.gradient : 'none', WebkitBackgroundClip: activeTab === tab.key ? 'text' : 'initial', backgroundClip: activeTab === tab.key ? 'text' : 'initial' }}>{tab.label}</span>
                  </button>
                ))}
            </div>
              </nav>
        </div>

          {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-50 dark:bg-black">
          {activeTab === 'typewriter' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 
                  className="text-xl font-semibold"
                  style={{ 
                    color: designTokens.colors.text.primary,
                    fontSize: designTokens.typography.fontSize.xl,
                    fontWeight: designTokens.typography.fontWeight.semibold
                  }}
                >
                  Textos Typewriter
                  </h2>
                <NeoButton
                  variant="primary"
                  onClick={() => handleAddNew('typewriter_texts')}
                  className="flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Agregar Texto</span>
                </NeoButton>
                  </div>
              <NeoCard className="overflow-hidden">
                <table className="min-w-full divide-y" style={{ borderColor: designTokens.colors.background.gray[200] }}>
                  <thead style={{ background: designTokens.colors.background.gray[50] }}>
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ 
                          color: designTokens.colors.text.secondary,
                          fontSize: designTokens.typography.fontSize.xs,
                          fontWeight: designTokens.typography.fontWeight.medium
                        }}
                      >
                        Orden
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ 
                          color: designTokens.colors.text.secondary,
                          fontSize: designTokens.typography.fontSize.xs,
                          fontWeight: designTokens.typography.fontWeight.medium
                        }}
                      >
                        Texto
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ 
                          color: designTokens.colors.text.secondary,
                          fontSize: designTokens.typography.fontSize.xs,
                          fontWeight: designTokens.typography.fontWeight.medium
                        }}
                      >
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: designTokens.colors.background.gray[200] }}>
                    {data.typewriterTexts.map((item) => (
                      <tr key={item.id}>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm"
                          style={{ 
                            color: designTokens.colors.text.primary,
                            fontSize: designTokens.typography.fontSize.sm
                          }}
                        >
                          {item.order_index}
                        </td>
                        <td 
                          className="px-6 py-4 text-sm"
                          style={{ 
                            color: designTokens.colors.text.primary,
                            fontSize: designTokens.typography.fontSize.sm
                          }}
                        >
                          {item.text_content}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <NeoButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item, 'typewriter_texts')}
                            className="mr-3"
                            style={{ color: designTokens.colors.text.secondary }}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                          </NeoButton>
                          <NeoButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id, 'typewriter_texts')}
                            style={{ color: designTokens.colors.state.error }}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                          </NeoButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                  </NeoCard>
                </div>
              )}

          {activeTab === 'projects' && (
                  <div>
              <div className="flex items-center justify-between mb-6">
                <h2 
                  className="text-xl font-semibold"
                  style={{ 
                    color: designTokens.colors.text.primary,
                    fontSize: designTokens.typography.fontSize.xl,
                    fontWeight: designTokens.typography.fontWeight.semibold
                  }}
                >
                  Cards Proyectos
                </h2>
                <NeoButton
                  variant="primary"
                  onClick={() => handleAddNew('projects')}
                  className="flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Agregar Card</span>
                </NeoButton>
                  </div>
              <NeoCard className="overflow-hidden">
                <table className="min-w-full divide-y" style={{ borderColor: designTokens.colors.background.gray[200] }}>
                  <thead style={{ background: designTokens.colors.background.gray[50] }}>
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ 
                          color: designTokens.colors.text.secondary,
                          fontSize: designTokens.typography.fontSize.xs,
                          fontWeight: designTokens.typography.fontWeight.medium
                        }}
                      >
                        Orden
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ 
                          color: designTokens.colors.text.secondary,
                          fontSize: designTokens.typography.fontSize.xs,
                          fontWeight: designTokens.typography.fontWeight.medium
                        }}
                      >
                        Título (ES)
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ 
                          color: designTokens.colors.text.secondary,
                          fontSize: designTokens.typography.fontSize.xs,
                          fontWeight: designTokens.typography.fontWeight.medium
                        }}
                      >
                        Título (EN)
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ 
                          color: designTokens.colors.text.secondary,
                          fontSize: designTokens.typography.fontSize.xs,
                          fontWeight: designTokens.typography.fontWeight.medium
                        }}
                      >
                        Descripción (ES)
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ 
                          color: designTokens.colors.text.secondary,
                          fontSize: designTokens.typography.fontSize.xs,
                          fontWeight: designTokens.typography.fontWeight.medium
                        }}
                      >
                        Descripción (EN)
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ 
                          color: designTokens.colors.text.secondary,
                          fontSize: designTokens.typography.fontSize.xs,
                          fontWeight: designTokens.typography.fontWeight.medium
                        }}
                      >
                        Imagen
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ 
                          color: designTokens.colors.text.secondary,
                          fontSize: designTokens.typography.fontSize.xs,
                          fontWeight: designTokens.typography.fontWeight.medium
                        }}
                      >
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: designTokens.colors.background.gray[200] }}>
                    {(() => {
                      console.log('🔍 Admin - data.projects:', data.projects);
                      console.log('🔍 Admin - data.projects.length:', data.projects?.length || 0);
                      console.log('🔍 Admin - data:', data);
                      return data.projects.map((item) => (
                      <tr key={item.id}>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm"
                          style={{ 
                            color: designTokens.colors.text.primary,
                            fontSize: designTokens.typography.fontSize.sm
                          }}
                        >
                          {item.order_index}
                        </td>
                        <td 
                          className="px-6 py-4 text-sm font-medium"
                          style={{ 
                            color: designTokens.colors.text.primary,
                            fontSize: designTokens.typography.fontSize.sm
                          }}
                        >
                          {item.title_es || item.title}
                        </td>
                        <td 
                          className="px-6 py-4 text-sm font-medium"
                          style={{ 
                            color: designTokens.colors.text.primary,
                            fontSize: designTokens.typography.fontSize.sm
                          }}
                        >
                          {item.title_en || 'Sin traducir'}
                        </td>
                        <td 
                          className="px-6 py-4 text-sm max-w-xs truncate"
                          style={{ 
                            color: designTokens.colors.text.primary,
                            fontSize: designTokens.typography.fontSize.sm
                          }}
                        >
                          {item.description_es || item.description}
                        </td>
                        <td 
                          className="px-6 py-4 text-sm max-w-xs truncate"
                          style={{ 
                            color: designTokens.colors.text.primary,
                            fontSize: designTokens.typography.fontSize.sm
                          }}
                        >
                          {item.description_en || 'Sin traducir'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {item.cover_image_url ? (
                            <img 
                              src={item.cover_image_url} 
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                  </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <NeoButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item, 'projects')}
                            className="mr-3"
                            style={{ color: designTokens.colors.text.secondary }}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                          </NeoButton>
                          <NeoButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id, 'projects')}
                            style={{ color: designTokens.colors.state.error }}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                          </NeoButton>
                        </td>
                      </tr>
                    ));
                    })()}
                  </tbody>
                </table>
                          </NeoCard>
                </div>
              )}

          {activeTab === 'about' && (
            <div className="space-y-8">
              {/* Sección Principal - Título y Descripción */}
              <NeoCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Información Principal
                    </h2>
                  <NeoButton
                    onClick={() => handleAddNew('about_main')}
                    variant="primary"
                    className="flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Agregar Información</span>
                    </NeoButton>
                  </div>
                  
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Idioma
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Título Principal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Descripción
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
                      {data.aboutInfo.filter(item => item.section === 'main').map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            <span className={`px-2 py-1 text-xs rounded-full ${item.language === 'es' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                              {item.language === 'es' ? 'ES' : 'EN'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                            {item.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <NeoButton
                              onClick={() => handleEdit(item, 'about_main')}
                              variant="ghost"
                              size="sm"
                              className="mr-2"
                            >
                              Editar
                            </NeoButton>
                            <NeoButton
                              onClick={() => handleDelete(item.id, 'about_main')}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Eliminar
                            </NeoButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                          </div>
              </NeoCard>

              {/* Sección Experiencia */}
              <NeoCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Experiencia
                  </h2>
                  <NeoButton
                    onClick={() => handleAddNew('about_experience')}
                    variant="primary"
                    className="flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Agregar Experiencia</span>
                  </NeoButton>
                        </div>
                
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Idioma
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Título
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Descripción
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Orden
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
                      {data.aboutInfo.filter(item => item.section === 'experience').sort((a, b) => (a.order_index || 0) - (b.order_index || 0)).map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            <span className={`px-2 py-1 text-xs rounded-full ${item.language === 'es' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                              {item.language === 'es' ? 'ES' : 'EN'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                            {item.description}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {item.order_index}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <NeoButton
                              onClick={() => handleEdit(item, 'about_experience')}
                              variant="ghost"
                              size="sm"
                              className="mr-2"
                            >
                              Editar
                            </NeoButton>
                            <NeoButton
                              onClick={() => handleDelete(item.id, 'about_experience')}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Eliminar
                            </NeoButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                        </div>
                      </NeoCard>

              {/* Sección Especialidades */}
              <NeoCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Especialidades
                  </h2>
                  <NeoButton
                    onClick={() => handleAddNew('about_specialties')}
                    variant="primary"
                    className="flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Agregar Especialidad</span>
                  </NeoButton>
                </div>
                
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Idioma
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Título
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Descripción
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Orden
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
                      {data.aboutInfo.filter(item => item.section === 'specialties').sort((a, b) => (a.order_index || 0) - (b.order_index || 0)).map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            <span className={`px-2 py-1 text-xs rounded-full ${item.language === 'es' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                              {item.language === 'es' ? 'ES' : 'EN'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                            {item.description}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {item.order_index}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <NeoButton
                              onClick={() => handleEdit(item, 'about_specialties')}
                              variant="ghost"
                              size="sm"
                              className="mr-2"
                            >
                              Editar
                            </NeoButton>
                            <NeoButton
                              onClick={() => handleDelete(item.id, 'about_specialties')}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Eliminar
                            </NeoButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
              </NeoCard>

              {/* Sección Foto de Perfil */}
              <NeoCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Foto de Perfil
                    </h2>
                  <NeoButton
                    onClick={() => handleAddNew('about_photo')}
                    variant="primary"
                    className="flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Agregar Foto</span>
                    </NeoButton>
                  </div>
                  
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Idioma
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Imagen
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          URL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
                      {data.aboutInfo.filter(item => item.section === 'photo').map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            <span className={`px-2 py-1 text-xs rounded-full ${item.language === 'es' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                              {item.language === 'es' ? 'ES' : 'EN'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {item.profile_image_url ? (
                              <img 
                                src={item.profile_image_url} 
                                alt="Profile" 
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                            {item.profile_image_url || 'Sin imagen'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <NeoButton
                              onClick={() => handleEdit(item, 'about_photo')}
                              variant="ghost"
                              size="sm"
                              className="mr-2"
                            >
                              Editar
                            </NeoButton>
                            <NeoButton
                              onClick={() => handleDelete(item.id, 'about_photo')}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Eliminar
                            </NeoButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                          </div>
              </NeoCard>
                        </div>
          )}

          {activeTab === 'contact' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Información de Contacto
                    </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleRefreshData}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Recargar
                  </button>
                  <button
                    onClick={() => handleAddNew('contact_info')}
                    className="px-4 py-2 text-white rounded-lg transition-colors"
                    style={{ background: designTokens.colors.primary.gradient }}
                  >
                    Agregar Contacto
                  </button>
                </div>
                  </div>
              <div className="bg-white dark:bg-black rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Idioma
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Etiqueta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        URL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.contactInfo.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {item.contact_type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {item.language || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {item.label}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {item.value}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {item.url ? (
                            <a 
                              href={item.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                              {item.url}
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(item, 'contact_info')}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 mr-3"
                          >
                              Editar
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, 'contact_info')}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                              Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                  </div>
                </div>
              )}

          {activeTab === 'images' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Imágenes del Sitio
                  </h2>
                <button
                  onClick={() => handleAddNew('site_images')}
                  className="px-4 py-2 text-white rounded-lg transition-colors"
                  style={{ background: designTokens.colors.primary.gradient }}
                >
                  Agregar Imagen
                </button>
                            </div>
              <div className="bg-white dark:bg-black rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Sección
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        URL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.siteImages.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {item.image_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {item.section}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                          {item.image_url}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(item, 'site_images')}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 mr-3"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, 'site_images')}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                  </div>
                </div>
              )}

          {activeTab === 'colors' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Gestión de Colores
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleRefreshData}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Recargar
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm('¿Estás seguro de que quieres restaurar el gradiente original? Esto cambiará el gradiente por defecto.')) {
                        try {
                          // Buscar el gradiente original
                          const originalGradient = data.colors.find(c => c.name === 'Gradiente Original')
                          if (originalGradient) {
                            // Actualizar todos los gradientes para que no sean por defecto
                            await supabase
                              .from('colors')
                              .update({ is_default: false })
                              .neq('id', '00000000-0000-0000-0000-000000000000')
                            
                            // Establecer el gradiente original como por defecto
                            await supabase
                              .from('colors')
                              .update({ is_default: true })
                              .eq('id', originalGradient.id)
                            
                            await loadData()
                            
                            // Marcar en localStorage que se actualizó un gradiente
                            localStorage.setItem('admin-gradient-updated', Date.now().toString())
                            
                            success('Gradiente restaurado', 'Gradiente original restaurado exitosamente')
                          } else {
                            warning('Gradiente no encontrado', 'No se encontró el gradiente original')
                          }
                        } catch (error) {
                          console.error('Error restaurando gradiente:', error)
                          showError('Error al restaurar', 'Error al restaurar el gradiente original')
                        }
                      }
                    }}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    Restaurar Original
                  </button>
                  <button
                    onClick={() => handleAddNew('colors')}
                    className="px-4 py-2 text-white rounded-lg transition-colors"
                    style={{ background: designTokens.colors.primary.gradient }}
                  >
                    Agregar Gradiente
                  </button>
                </div>
              </div>
              
              {/* Vista previa del gradiente actual */}
              <div className="mb-6 p-4 bg-white dark:bg-black rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Vista Previa del Gradiente Actual
                </h3>
                <div 
                  className="w-full h-20 rounded-lg flex items-center justify-center font-medium relative overflow-hidden"
                  style={{ 
                    background: (() => {
                      const gradient = data.colors.find(c => c.is_default)?.gradient_css || 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)'
                      return gradient
                        .replace(/background:\s*/g, '') // Remover "background:" duplicado
                        .replace(/;+$/, '') // Remover punto y coma al final
                        .trim()
                    })()
                  }}
                >
                  {/* Texto con contraste automático */}
                  <span 
                    className="drop-shadow-lg"
                    style={{
                      ...getTextColorForGradient(data.colors.find(c => c.is_default)?.gradient_css || 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)'),
                      fontWeight: '600',
                      fontSize: '16px',
                      textAlign: 'center',
                      padding: '0 12px'
                  }}
                >
                  {data.colors.find(c => c.is_default)?.name || 'Gradiente Original'}
                  </span>
                  
                  {/* Overlay semi-transparente para mejorar legibilidad */}
                  <div 
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: 'linear-gradient(45deg, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0.1) 100%)',
                      pointerEvents: 'none'
                    }}
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-black rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Vista Previa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        CSS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.colors.map((item) => {
                      console.log('🎨 [TABLA] Renderizando color:', item.name, 'CSS:', item.gradient_css)
                      return (
                      <tr key={item.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {item.name}
                          {item.is_default && (
                            <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full dark:bg-gray-700 dark:text-gray-200">
                              Por defecto
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div 
                            className="w-16 h-8 rounded border"
                            style={{ 
                              background: (() => {
                                console.log('🎨 [TABLA] CSS original:', item.gradient_css)
                                
                                if (!item.gradient_css || item.gradient_css.trim() === '') {
                                  console.log('🎨 [TABLA] CSS vacío, usando fallback')
                                  return 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
                                }
                                
                                let processedGradient = item.gradient_css
                                
                                // Si contiene múltiples declaraciones background, buscar la mejor
                                if (processedGradient.includes(';')) {
                                  const declarations = processedGradient.split(';').map((d: string) => d.trim()).filter((d: string) => d)
                                  console.log('🎨 [TABLA] Declaraciones encontradas:', declarations)
                                  
                                  // Priorizar linear-gradient sobre -webkit-linear-gradient
                                  const standardGradient = declarations.find(d => d.includes('linear-gradient') && !d.includes('-webkit-'))
                                  const webkitGradient = declarations.find(d => d.includes('-webkit-linear-gradient'))
                                  
                                  console.log('🎨 [TABLA] Gradiente estándar:', standardGradient)
                                  console.log('🎨 [TABLA] Gradiente webkit:', webkitGradient)
                                  
                                  if (standardGradient) {
                                    processedGradient = standardGradient
                                    console.log('🎨 [TABLA] Usando gradiente estándar')
                                  } else if (webkitGradient) {
                                    // Convertir -webkit-linear-gradient a linear-gradient
                                    processedGradient = webkitGradient.replace('-webkit-linear-gradient', 'linear-gradient')
                                    console.log('🎨 [TABLA] Convirtiendo webkit a estándar')
                                  } else {
                                    processedGradient = declarations[0]
                                    console.log('🎨 [TABLA] Usando primera declaración')
                                  }
                                }
                                
                                // Remover "background:" si está presente
                                processedGradient = processedGradient.replace(/background:\s*/g, '')
                                
                                // Limpiar espacios y caracteres extra
                                processedGradient = processedGradient.trim()
                                
                                console.log('🎨 [TABLA] Gradiente procesado:', processedGradient)
                                
                                // Si no es un gradiente válido, usar fallback
                                if (!processedGradient.includes('gradient')) {
                                  console.log('🎨 [TABLA] No es gradiente válido, usando fallback')
                                  return 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
                                }
                                
                                console.log('🎨 [TABLA] ¿Es válido?', true)
                                return processedGradient
                              })()
                            }}
                          ></div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                          {item.gradient_css}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {item.is_active ? (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              Activo
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                              Inactivo
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(item, 'colors')}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 mr-3"
                          >
                            Editar
                          </button>
                          {!item.is_default && (
                            <button
                              onClick={() => handleDelete(item.id, 'colors')}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 mr-3"
                            >
                              Eliminar
                            </button>
                          )}
                          <button
                            onClick={() => handleApplyGradient(item)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            disabled={item.is_default}
                          >
                            {item.is_default ? 'Aplicado' : 'Aplicar'}
                          </button>
                        </td>
                      </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && editingItem && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ 
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: designTokens.zIndex.modal
          }}
        >
          <div 
            className="w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 rounded-2xl shadow-2xl bg-white dark:bg-black"
            style={{ 
              borderRadius: designTokens.borderRadius['2xl'],
              boxShadow: designTokens.boxShadow['2xl']
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 
                className="text-lg font-semibold text-gray-900 dark:text-white"
                style={{ 
                  fontSize: designTokens.typography.fontSize.lg,
                  fontWeight: designTokens.typography.fontWeight.semibold
                }}
              >
                {editingItem.id ? 'Editar' : 'Agregar'} {editingItem.type === 'typewriter_texts' ? 'Texto' : editingItem.type === 'projects' ? 'Proyecto' : 'Elemento'}
              </h3>
              <NeoButton
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </NeoButton>
            </div>

            <div className="space-y-6">
              {editingItem.type === 'typewriter_texts' && (
                <>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Orden
                    </label>
                          <NeoInput
                      type="number"
                      value={editingItem.order_index || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, order_index: parseInt(e.target.value) })}
                      placeholder="Orden de aparición"
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Texto
                    </label>
                    <NeoTextarea
                      value={editingItem.text_content || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, text_content: e.target.value })}
                      placeholder="Ingresa el texto que aparecerá en el typewriter"
                      rows={4}
                    />
                  </div>
                </>
              )}

              {editingItem.type === 'projects' && (
                <>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Orden
                    </label>
                          <NeoInput
                      type="number"
                      value={editingItem.order_index || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, order_index: parseInt(e.target.value) })}
                      placeholder="Orden de aparición"
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Título (Español)
                    </label>
                    <NeoInput
                      type="text"
                      value={editingItem.title_es || editingItem.title || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, title_es: e.target.value })}
                      placeholder="Título del proyecto en español"
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Título (English)
                    </label>
                    <NeoInput
                      type="text"
                      value={editingItem.title_en || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, title_en: e.target.value })}
                      placeholder="Project title in English"
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Descripción (Español)
                    </label>
                    <NeoTextarea
                      value={editingItem.description_es || editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description_es: e.target.value })}
                      placeholder="Descripción del proyecto en español"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Descripción (English)
                    </label>
                    <NeoTextarea
                      value={editingItem.description_en || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description_en: e.target.value })}
                      placeholder="Project description in English"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Imagen
                    </label>
                    <div className="space-y-4">
                      {editingItem.cover_image_url && (
                        <div className="flex items-center space-x-4">
                          <img 
                            src={editingItem.cover_image_url} 
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                          <NeoButton
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingItem({ ...editingItem, cover_image_url: '' })}
                            style={{ color: designTokens.colors.state.error }}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                          </NeoButton>
                  </div>
                      )}
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label 
                          htmlFor="image-upload" 
                          className="cursor-pointer flex flex-col items-center space-y-2"
                        >
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {editingItem.cover_image_url ? 'Cambiar imagen' : 'Subir imagen'}
                          </span>
                        </label>
                </div>
                    </div>
                  </div>
                </>
              )}

              {/* Sección Principal */}
              {editingItem.type === 'about_main' && (
                <>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Idioma
                    </label>
                    <NeoSelect
                      value={editingItem.language || 'es'}
                      onChange={(e) => setEditingItem({ ...editingItem, language: e.target.value })}
                      options={[
                        { value: 'es', label: 'Español' },
                        { value: 'en', label: 'English' }
                      ]}
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Título Principal
                    </label>
                              <NeoInput
                      type="text"
                      value={editingItem.title || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      placeholder="Del output al outcome: diseño que entrega resultados reales."
                    />
                            </div>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Descripción
                    </label>
                    <NeoTextarea
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      placeholder="Senior Product & UX/UI Designer con más de 10 años de experiencia..."
                      rows={6}
                    />
                        </div>
                </>
              )}

              {/* Experiencia */}
              {editingItem.type === 'about_experience' && (
                <>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Idioma
                    </label>
                    <NeoSelect
                      value={editingItem.language || 'es'}
                      onChange={(e) => setEditingItem({ ...editingItem, language: e.target.value })}
                      options={[
                        { value: 'es', label: 'Español' },
                        { value: 'en', label: 'English' }
                      ]}
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Orden
                    </label>
                    <NeoInput
                      type="number"
                      value={editingItem.order_index || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, order_index: parseInt(e.target.value) })}
                      placeholder="1, 2, 3..."
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Título
                    </label>
                    <NeoInput
                      type="text"
                      value={editingItem.title || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      placeholder="10+ years in UX/UI & Product Design"
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Descripción
                    </label>
                    <NeoTextarea
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      placeholder="Specialization in digital products"
                      rows={3}
                    />
                  </div>
                </>
              )}
                  
              {/* Especialidades */}
              {editingItem.type === 'about_specialties' && (
                <>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Idioma
                    </label>
                    <NeoSelect
                      value={editingItem.language || 'es'}
                      onChange={(e) => setEditingItem({ ...editingItem, language: e.target.value })}
                      options={[
                        { value: 'es', label: 'Español' },
                        { value: 'en', label: 'English' }
                      ]}
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Orden
                    </label>
                    <NeoInput
                      type="number"
                      value={editingItem.order_index || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, order_index: parseInt(e.target.value) })}
                      placeholder="1, 2, 3..."
                    />
                </div>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Título
                    </label>
                    <NeoInput
                      type="text"
                      value={editingItem.title || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      placeholder="Research & Strategy"
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Descripción
                    </label>
                    <NeoTextarea
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      placeholder="Insights, outcomes"
                      rows={3}
                    />
                  </div>
                </>
              )}

              {/* Foto de Perfil */}
              {editingItem.type === 'about_photo' && (
                <>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Idioma
                    </label>
                    <NeoSelect
                      value={editingItem.language || 'es'}
                      onChange={(e) => setEditingItem({ ...editingItem, language: e.target.value })}
                      options={[
                        { value: 'es', label: 'Español' },
                        { value: 'en', label: 'English' }
                      ]}
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Imagen de Perfil
                    </label>
                    <div className="space-y-4">
                      {editingItem.profile_image_url && (
                        <div className="flex items-center space-x-4">
                          <img 
                            src={editingItem.profile_image_url} 
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                          <NeoButton
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingItem({ ...editingItem, profile_image_url: '' })}
                            style={{ color: designTokens.colors.state.error }}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                          </NeoButton>
                  </div>
                      )}
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="profile-image-upload"
                        />
                        <label 
                          htmlFor="profile-image-upload" 
                          className="cursor-pointer flex flex-col items-center space-y-2"
                        >
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {editingItem.profile_image_url ? 'Cambiar imagen' : 'Subir imagen de perfil'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Sección Legacy - about_info */}
              {editingItem.type === 'about_info' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={editingItem.title || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white"
                      placeholder="Título de la sección"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-32"
                      placeholder="Descripción personal"
                    />
                  </div>
                </>
              )}

              {editingItem.type === 'contact_info' && (
                <>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Tipo de Contacto
                    </label>
                    <NeoSelect
                      value={editingItem.contact_type || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, contact_type: e.target.value })}
                      options={[
                        { value: '', label: 'Seleccionar tipo' },
                        { value: 'whatsapp', label: 'WhatsApp' },
                        { value: 'linkedin', label: 'LinkedIn' },
                        { value: 'email', label: 'Email' },
                        { value: 'location', label: 'Ubicación' },
                        { value: 'phone', label: 'Teléfono' }
                      ]}
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Etiqueta
                    </label>
                        <NeoInput
                      type="text"
                      value={editingItem.label || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                      placeholder="Etiqueta del contacto"
                        />
                      </div>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Valor
                    </label>
                        <NeoInput
                      type="text"
                      value={editingItem.value || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                      placeholder="Valor del contacto"
                    />
                  </div>
                  {editingItem.contact_type === 'linkedin' && (
                    <div>
                      <label 
                        className="block text-sm font-medium mb-2"
                        style={{ 
                          color: designTokens.colors.text.primary,
                          fontSize: designTokens.typography.fontSize.sm,
                          fontWeight: designTokens.typography.fontWeight.medium
                        }}
                      >
                        URL de LinkedIn
                      </label>
                      <NeoInput
                        type="url"
                        value={editingItem.url || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                        placeholder="https://linkedin.com/in/tu-perfil"
                      />
                    </div>
                  )}
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Orden
                    </label>
                        <NeoInput
                      type="number"
                      value={editingItem.order_index || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, order_index: parseInt(e.target.value) })}
                      placeholder="Orden de aparición"
                        />
                      </div>
                </>
              )}

              {editingItem.type === 'site_images' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre de la Imagen
                    </label>
                    <input
                      type="text"
                      value={editingItem.image_name || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, image_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white"
                      placeholder="Nombre descriptivo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sección
                    </label>
                    <select
                      value={editingItem.section || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, section: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white"
                    >
                      <option value="">Seleccionar sección</option>
                      <option value="hero">Hero</option>
                      <option value="projects">Proyectos</option>
                      <option value="about">Acerca de</option>
                      <option value="contact">Contacto</option>
                    </select>
                </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      URL de la Imagen
                    </label>
                    <input
                      type="url"
                      value={editingItem.image_url || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white"
                      placeholder="https://ejemplo.com/imagen.jpg"
                        />
                      </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contexto de Uso
                    </label>
                    <input
                      type="text"
                      value={editingItem.usage_context || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, usage_context: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white"
                      placeholder="Ej: portada, perfil, proyecto1"
                    />
                  </div>
                </>
              )}

              {editingItem.type === 'colors' && (
                <>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      Nombre del Gradiente
                    </label>
                    <NeoInput
                      type="text"
                      value={editingItem.name || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      placeholder="Ej: Gradiente Azul-Verde"
                    />
                  </div>
                  
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: designTokens.colors.text.primary,
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium
                      }}
                    >
                      CSS del Gradiente
                    </label>
                    <NeoTextarea
                      value={editingItem.gradient_css || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, gradient_css: e.target.value })}
                      placeholder="linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Ejemplo: linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)
                    </p>
                  </div>

                  {/* Vista previa del gradiente */}
                  <div>
                    <div>
                      <label 
                        className="block text-sm font-medium mb-2"
                        style={{ 
                          color: designTokens.colors.text.primary,
                          fontSize: designTokens.typography.fontSize.sm,
                          fontWeight: designTokens.typography.fontWeight.medium
                        }}
                      >
                        Vista Previa
                      </label>
                      <div 
                        className="w-full h-16 rounded-lg border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center font-medium relative overflow-hidden"
                        style={{ 
                          background: (() => {
                            if (!editingItem.gradient_css || editingItem.gradient_css.trim() === '') {
                              return 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
                            }
                            
                            let processedGradient = editingItem.gradient_css
                            console.log('🎨 CSS original:', processedGradient)
                            
                            // Si contiene múltiples declaraciones background, buscar la mejor
                            if (processedGradient.includes(';')) {
                              const declarations = processedGradient.split(';').map((d: string) => d.trim()).filter((d: string) => d)
                              console.log('🎨 Declaraciones encontradas:', declarations)
                              
                              // Priorizar linear-gradient sobre -webkit-linear-gradient
                              const standardGradient = declarations.find((d: string) => d.includes('linear-gradient') && !d.includes('-webkit-'))
                              const webkitGradient = declarations.find((d: string) => d.includes('-webkit-linear-gradient'))
                              
                              console.log('🎨 Gradiente estándar:', standardGradient)
                              console.log('🎨 Gradiente webkit:', webkitGradient)
                              
                              if (standardGradient) {
                                processedGradient = standardGradient
                                console.log('🎨 Usando gradiente estándar')
                              } else if (webkitGradient) {
                                // Convertir -webkit-linear-gradient a linear-gradient
                                processedGradient = webkitGradient.replace('-webkit-linear-gradient', 'linear-gradient')
                                console.log('🎨 Convirtiendo webkit a estándar')
                              } else {
                                processedGradient = declarations[0]
                                console.log('🎨 Usando primera declaración')
                              }
                            }
                            
                            // Remover "background:" si está presente
                            processedGradient = processedGradient.replace(/background:\s*/g, '')
                            
                            // Limpiar espacios y caracteres extra
                            processedGradient = processedGradient.trim()
                            
                            console.log('🎨 Gradiente procesado:', processedGradient)
                            
                            // Si no es un gradiente válido, usar fallback
                            if (!processedGradient.includes('gradient')) {
                              console.log('🎨 No es gradiente válido, usando fallback')
                              return 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
                            }
                            
                            console.log('🎨 ¿Es válido?', true)
                            return processedGradient
                          })()
                        }}
                      >
                        {/* Texto con contraste automático */}
                        <span 
                          className="drop-shadow-lg"
                          style={{
                            ...getTextColorForGradient(editingItem.gradient_css),
                            fontWeight: '600',
                            fontSize: '14px',
                            textAlign: 'center',
                            padding: '0 8px'
                        }}
                      >
                        {editingItem.name || 'Vista previa del gradiente'}
                        </span>
                        
                        {/* Overlay semi-transparente para mejorar legibilidad */}
                        <div 
                          className="absolute inset-0 rounded-lg"
                          style={{
                            background: 'linear-gradient(45deg, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0.1) 100%)',
                            pointerEvents: 'none'
                          }}
                        />
                      </div>
                      
                      {/* Mensaje cuando no hay gradiente */}
                      {(!editingItem.gradient_css || editingItem.gradient_css.trim() === '') && (
                        <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            ⚠️ Escribe un CSS de gradiente válido arriba para ver la vista previa
                          </p>
                    </div>
                  )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingItem.is_default || false}
                        onChange={(e) => setEditingItem({ ...editingItem, is_default: e.target.checked })}
                        className="mr-2"
                      />
                      <span 
                        className="text-sm"
                        style={{ 
                          color: designTokens.colors.text.primary,
                          fontSize: designTokens.typography.fontSize.sm,
                          fontWeight: designTokens.typography.fontWeight.medium
                        }}
                      >
                        Establecer como gradiente por defecto
                      </span>
                    </label>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <NeoButton
                variant="ghost"
                onClick={() => setIsEditing(false)}
                className="flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancelar</span>
              </NeoButton>
              <NeoButton
                variant="primary"
                onClick={handleSave}
                className="flex items-center space-x-2"
                style={{ 
                  background: designTokens.colors.primary.gradient,
                  fontSize: designTokens.typography.fontSize.sm,
                  fontWeight: designTokens.typography.fontWeight.medium
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Guardar</span>
                </NeoButton>
              </div>
        </div>
      </div>
      )}
    </div>
  )
}
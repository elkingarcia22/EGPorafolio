'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import { isSupabaseConfigured } from '@/lib/mock-data'

interface AdminData {
  typewriterTexts: Array<{ id: string; text_content: string; order_index: number }>
  projects: Array<{ id: string; title: string; description: string; cover_image_url?: string; order_index: number }>
  aboutInfo: Array<{ id: string; title: string; description: string; profile_image_url?: string }>
  contactInfo: Array<{ id: string; contact_type: string; label: string; value: string; icon_name: string; order_index: number }>
  siteImages: Array<{ id: string; image_name: string; image_url: string; section: string; usage_context: string }>
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState<'typewriter' | 'projects' | 'about' | 'contact' | 'images'>('typewriter')
  const [data, setData] = useState<AdminData>({
    typewriterTexts: [],
    projects: [],
    aboutInfo: [],
    contactInfo: [],
    siteImages: []
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
          { id: '1', title: 'UX Research', description: 'Investigación profunda de usuarios para crear experiencias excepcionales y centradas en el ser humano', order_index: 1 },
          { id: '2', title: 'UI Design', description: 'Diseño de interfaces modernas, funcionales y visualmente impactantes que conectan con los usuarios', order_index: 2 },
          { id: '3', title: 'Estrategia Digital', description: 'Desarrollo de estrategias digitales integrales que transforman marcas y productos', order_index: 3 },
          { id: '4', title: 'Diseño con IA', description: 'Proyectos innovadores que combinan inteligencia artificial con diseño creativo', order_index: 4 }
        ],
        aboutInfo: [
          { id: '1', title: 'Acerca de mí', description: 'Soy un diseñador UX/UI con más de 5 años de experiencia creando experiencias digitales excepcionales.' }
        ],
        contactInfo: [
          { id: '1', contact_type: 'whatsapp', label: 'WhatsApp', value: '+54 11 1234-5678', icon_name: 'whatsapp', order_index: 1 },
          { id: '2', contact_type: 'linkedin', label: 'LinkedIn', value: 'Conectar', icon_name: 'linkedin', order_index: 2 },
          { id: '3', contact_type: 'location', label: 'Ubicación', value: 'Buenos Aires, Argentina', icon_name: 'location', order_index: 3 }
        ],
        siteImages: []
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
        .eq('is_active', true)
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

      setData({
        typewriterTexts: typewriterData || [],
        projects: projectsData || [],
        aboutInfo: aboutData || [],
        contactInfo: contactData || [],
        siteImages: imagesData || []
      })
    } catch (error) {
      console.error('Error loading data:', error)
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
      siteImages: []
    })
  }

  const handleEdit = (item: any, type: string) => {
    setEditingItem({ ...item, type })
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!editingItem) return

    try {
      const { type, ...itemData } = editingItem
      delete itemData.type

      let result
      if (editingItem.id) {
        // Actualizar
        result = await supabase
          .from(type)
          .update(itemData)
          .eq('id', editingItem.id)
      } else {
        // Crear nuevo
        result = await supabase
          .from(type)
          .insert(itemData)
      }

      if (result.error) throw result.error

      setIsEditing(false)
      setEditingItem(null)
      await loadData()
    } catch (error) {
      console.error('Error saving:', error)
    }
  }

  const handleDelete = async (id: string, type: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este elemento?')) return

    try {
      const result = await supabase
        .from(type)
        .update({ is_active: false })
        .eq('id', id)

      if (result.error) throw result.error

      await loadData()
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const handleAddNew = (type: string) => {
    const newItem: any = { type }
    
    switch (type) {
      case 'typewriter_texts':
        newItem.text_content = ''
        newItem.order_index = data.typewriterTexts.length + 1
        break
      case 'projects':
        newItem.title = ''
        newItem.description = ''
        newItem.order_index = data.projects.length + 1
        break
      case 'about_info':
        newItem.title = ''
        newItem.description = ''
        break
      case 'contact_info':
        newItem.contact_type = ''
        newItem.label = ''
        newItem.value = ''
        newItem.icon_name = ''
        newItem.order_index = data.contactInfo.length + 1
        break
    }

    setEditingItem(newItem)
    setIsEditing(true)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Panel de Administración
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Ingresa la contraseña para acceder
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full px-4 py-3 pr-12 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:from-blue-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {isLoading ? 'Verificando...' : 'Acceder'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Panel de Administración
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gestiona el contenido de tu portafolio
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Ver Sitio
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Banner de advertencia si Supabase no está configurado */}
      {!isSupabaseConfigured() && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
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
        <div className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              {[
                { key: 'typewriter', label: 'Textos Typewriter', icon: '⌨️' },
                { key: 'projects', label: 'Proyectos', icon: '💼' },
                { key: 'about', label: 'Acerca de Mí', icon: '👤' },
                { key: 'contact', label: 'Contacto', icon: '📞' },
                { key: 'images', label: 'Imágenes', icon: '🖼️' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'typewriter' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Textos Typewriter
                </h2>
                <button
                  onClick={() => handleAddNew('typewriter_texts')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Agregar Texto
                </button>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Orden
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Texto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.typewriterTexts.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {item.order_index}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {item.text_content}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(item, 'typewriter_texts')}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, 'typewriter_texts')}
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

          {activeTab === 'projects' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Proyectos
                </h2>
                <button
                  onClick={() => handleAddNew('projects')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Agregar Proyecto
                </button>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Orden
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Título
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.projects.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {item.order_index}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(item, 'projects')}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, 'projects')}
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

          {/* Similar tables for other tabs... */}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingItem.id ? 'Editar' : 'Agregar'} {editingItem.type === 'typewriter_texts' ? 'Texto' : editingItem.type === 'projects' ? 'Proyecto' : 'Elemento'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {editingItem.type === 'typewriter_texts' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Orden
                    </label>
                    <input
                      type="number"
                      value={editingItem.order_index || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, order_index: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Texto
                    </label>
                    <textarea
                      value={editingItem.text_content || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, text_content: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-24"
                      placeholder="Ingresa el texto que aparecerá en el typewriter"
                    />
                  </div>
                </>
              )}

              {editingItem.type === 'projects' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Orden
                    </label>
                    <input
                      type="number"
                      value={editingItem.order_index || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, order_index: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={editingItem.title || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Título del proyecto"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-24"
                      placeholder="Descripción del proyecto"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
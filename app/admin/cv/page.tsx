'use client'

import { useState, useEffect } from 'react'
import { useCV } from '@/hooks/useCV'
import { useDesignTokens } from '@/hooks/useDesignTokens'
import { useLanguage } from '@/contexts/language-context'
import { useFileUpload } from '@/hooks/useFileUpload'
import { FileUpload } from '@/components/ui/file-upload'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  Upload, 
  FileText, 
  Calendar,
  Globe,
  Save,
  X,
  AlertCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export default function AdminCVPage() {
  const { 
    cvDocuments, 
    loading, 
    error, 
    createCV, 
    updateCV, 
    deleteCV, 
    downloadCV,
    fetchCVDocuments 
  } = useCV()
  const designTokens = useDesignTokens()
  const { t } = useLanguage()
  const { uploadFile, deleteFile, createBucket, isUploading } = useFileUpload()
  
  const [isCreating, setIsCreating] = useState(false)
  const [editingCV, setEditingCV] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file_url: '',
    file_name: '',
    file_size: 0,
    file_type: 'application/pdf',
    language: 'es',
    version: '1.0',
    is_active: true,
    metadata: {}
  })

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      file_url: '',
      file_name: '',
      file_size: 0,
      file_type: 'application/pdf',
      language: 'es',
      version: '1.0',
      is_active: true,
      metadata: {}
    })
    setSelectedFile(null)
    setIsCreating(false)
    setEditingCV(null)
  }

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let fileUrl = formData.file_url
      let fileName = formData.file_name
      let fileSize = formData.file_size

      // Si hay un archivo seleccionado, subirlo primero
      if (selectedFile) {
        // Crear bucket si no existe
        await createBucket('cv-documents')
        
        // Subir archivo
        const uploadResult = await uploadFile(selectedFile, 'cv-documents', 'cv')
        
        if (!uploadResult.success) {
          toast.error(`Error al subir archivo: ${uploadResult.error}`)
          return
        }

        fileUrl = uploadResult.url!
        fileName = selectedFile.name
        fileSize = selectedFile.size
      }

      // Asegurar que solo un CV esté activo
      const cvData = {
        ...formData,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
        is_active: formData.is_active,
        created_by: 'admin' // Usuario administrador
      }

      if (editingCV) {
        await updateCV(editingCV, cvData)
        toast.success('CV actualizado exitosamente')
      } else {
        await createCV(cvData)
        toast.success('CV creado exitosamente')
      }
      
      resetForm()
    } catch (error) {
      toast.error('Error al guardar el CV')
    }
  }

  // Manejar selección de archivo
  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    // Actualizar automáticamente el nombre del archivo
    setFormData(prev => ({
      ...prev,
      file_name: file.name
    }))
  }

  // Manejar eliminación de archivo
  const handleFileRemove = () => {
    setSelectedFile(null)
    setFormData(prev => ({
      ...prev,
      file_name: '',
      file_url: ''
    }))
  }

  // Manejar edición
  const handleEdit = (cv: any) => {
    setFormData({
      title: cv.title,
      description: cv.description || '',
      file_url: cv.file_url,
      file_name: cv.file_name,
      file_size: cv.file_size || 0,
      file_type: cv.file_type,
      language: cv.language,
      version: cv.version,
      is_active: cv.is_active,
      metadata: cv.metadata || {}
    })
    setSelectedFile(null) // No cargar archivo existente
    setEditingCV(cv.id)
    setIsCreating(false)
  }

  // Manejar eliminación
  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este CV?')) {
      try {
        await deleteCV(id)
        toast.success('CV eliminado exitosamente')
      } catch (error) {
        toast.error('Error al eliminar el CV')
      }
    }
  }

  // Manejar carga de archivo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        file_url: `/cv-${Date.now()}-${file.name}`
      }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-black dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
               style={{borderColor: designTokens.colors.primary.gradient}}></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando CVs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-black dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Gestión de CVs
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Administra los documentos de hoja de vida
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-2xl mt-4 sm:mt-0"
            style={{background: designTokens.colors.primary.gradient}}
          >
            <Plus className="h-5 w-5" />
            Nuevo CV
          </motion.button>
        </div>

        {/* Formulario de creación/edición */}
        <AnimatePresence>
          {(isCreating || editingCV) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingCV ? 'Editar CV' : 'Crear nuevo CV'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="CV Elkin Garcia - Diseñador UX/UI"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Archivo PDF *
                    </label>
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      onFileRemove={handleFileRemove}
                      selectedFile={selectedFile}
                      acceptedTypes={['.pdf']}
                      maxSize={10}
                    />
                    {!selectedFile && formData.file_url && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Archivo actual:</strong> {formData.file_name}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                          Sube un nuevo archivo para reemplazarlo
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Idioma
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Versión
                    </label>
                    <input
                      type="text"
                      value={formData.version}
                      onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tamaño del archivo (bytes)
                    </label>
                    <input
                      type="number"
                      value={formData.file_size}
                      onChange={(e) => setFormData(prev => ({ ...prev, file_size: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1024000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descripción del CV..."
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">CV activo</span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    type="submit"
                    disabled={isUploading}
                    whileHover={{ scale: isUploading ? 1 : 1.05 }}
                    whileTap={{ scale: isUploading ? 1 : 0.95 }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                      isUploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    style={{background: designTokens.colors.primary.gradient}}
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        {editingCV ? 'Actualizar' : 'Crear'} CV
                      </>
                    )}
                  </motion.button>
                  
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de CVs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvDocuments.map((cv) => (
            <motion.div
              key={cv.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {cv.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {cv.description || 'Sin descripción'}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    cv.is_active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {cv.is_active ? 'Activo' : 'Inactivo'}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <FileText className="h-4 w-4" />
                    <span>{cv.file_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Globe className="h-4 w-4" />
                    <span>{cv.language.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(cv.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => downloadCV(cv)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span className="text-sm">Descargar</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(cv)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="text-sm">Editar</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(cv.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {cvDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay CVs registrados
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Comienza creando tu primer CV
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-2xl mx-auto"
              style={{background: designTokens.colors.primary.gradient}}
            >
              <Plus className="h-5 w-5" />
              Crear primer CV
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}

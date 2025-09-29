'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Home, 
  Download, 
  Share, 
  Mail, 
  Eye, 
  ArrowLeft,
  FileText,
  Calendar,
  Globe,
  User,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Star,
  Heart,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Tag,
  Filter,
  Sort,
  Grid,
  List,
  Edit,
  Trash2,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'

export default function TestDarkPage() {
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState('buttons')

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const testSections = [
    { id: 'buttons', name: 'Botones', icon: Settings },
    { id: 'cards', name: 'Tarjetas', icon: FileText },
    { id: 'forms', name: 'Formularios', icon: Edit },
    { id: 'navigation', name: 'Navegación', icon: Menu },
    { id: 'alerts', name: 'Alertas', icon: AlertCircle },
    { id: 'badges', name: 'Badges', icon: Tag },
    { id: 'gradients', name: 'Gradientes', icon: Star },
    { id: 'text', name: 'Texto', icon: MessageCircle }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900-pure via-white to-gray-900-pure dark:from-dark-surface dark:via-dark-surface dark:to-dark-surface">
      {/* Header de prueba */}
      <div className="bg-white dark:bg-dark-surface-variant border-b border-gray-200 border-gray-800-pure">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900-pure dark:hover:text-white hover:bg-gray-300 hover-dark-surface-container transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Volver al inicio</span>
              </motion.button>
              
              <h1 className="text-2xl font-bold text-gray-800-pure dark:text-white">
                Página de Prueba - Modo Oscuro
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Tooltip content="Cambiar tema">
                <Button
                  onClick={toggleTheme}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                  {theme === 'dark' ? 'Claro' : 'Oscuro'}
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de navegación */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-surface-container rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900-pure dark:text-white mb-4">
                Elementos de Prueba
              </h2>
              <nav className="space-y-2">
                {testSections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setSelectedTab(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedTab === section.id
                          ? 'bg-gray-200 dark:bg-dark-surface-container-high text-gray-900-pure dark:text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface-container'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{section.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            {/* Sección de Botones */}
            {selectedTab === 'buttons' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-dark-surface-container rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900-pure dark:text-white mb-6">
                    Botones
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Botones primarios */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-700-pure dark:text-gray-300">
                        Botones Primarios
                      </h4>
                      <div className="space-y-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-2 bg-gray-200 dark:bg-dark-surface-container border border-gray-300 border-gray-800-pure rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 hover-dark-surface-container transition-colors"
                        >
                          Botón Normal
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-2 rounded-lg text-white transition-all duration-300 hover:shadow-lg"
                          style={{background: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)'}}
                        >
                          Botón con Gradiente
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-2 bg-white dark:bg-dark-surface-container border border-gray-300 border-gray-800-pure rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-surface-container-high transition-colors"
                        >
                          Botón Outline
                        </motion.button>
                      </div>
                    </div>

                    {/* Botones con iconos */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-700-pure dark:text-gray-300">
                        Botones con Iconos
                      </h4>
                      <div className="space-y-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-dark-surface-container border border-gray-300 border-gray-800-pure rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 hover-dark-surface-container transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          Descargar
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-dark-surface-container border border-gray-300 border-gray-800-pure rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 hover-dark-surface-container transition-colors"
                        >
                          <Share className="h-4 w-4" />
                          Compartir
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-dark-surface-container border border-gray-300 border-gray-800-pure rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 hover-dark-surface-container transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                          Enviar
                        </motion.button>
                      </div>
                    </div>

                    {/* Estados de botones */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-700-pure dark:text-gray-300">
                        Estados
                      </h4>
                      <div className="space-y-3">
                        <button
                          disabled
                          className="w-full px-4 py-2 bg-gray-100 dark:bg-dark-surface-container-high border border-gray-200 border-gray-800-pure rounded-lg text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        >
                          Deshabilitado
                        </button>
                        
                        <button className="w-full px-4 py-2 bg-gray-200 dark:bg-dark-surface-container border border-gray-300 border-gray-800-pure rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 hover-dark-surface-container transition-colors">
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Cargando...
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sección de Tarjetas */}
            {selectedTab === 'cards' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-dark-surface-container rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900-pure dark:text-white mb-6">
                    Tarjetas
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Tarjeta simple */}
                    <div className="bg-white dark:bg-dark-surface-container-high rounded-xl shadow-md p-6 border border-gray-200 border-gray-800-pure">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gray-100 dark:bg-dark-surface-container rounded-lg">
                          <FileText className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900-pure dark:text-white">
                          Tarjeta Simple
                        </h4>
                      </div>
                      <p className="text-gray-600-pure dark:text-gray-300 text-sm">
                        Esta es una tarjeta simple con contenido de ejemplo para probar los estilos del modo oscuro.
                      </p>
                    </div>

                    {/* Tarjeta con gradiente */}
                    <div className="bg-white dark:bg-dark-surface-container-high rounded-xl shadow-md p-6 border border-gray-200 border-gray-800-pure relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10 dark:from-blue-500/5 dark:to-green-500/5"></div>
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-lg" style={{background: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)'}}>
                            <Star className="h-5 w-5 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900-pure dark:text-white">
                            Tarjeta con Gradiente
                          </h4>
                        </div>
                        <p className="text-gray-600-pure dark:text-gray-300 text-sm">
                          Esta tarjeta tiene un fondo con gradiente sutil para destacar el contenido.
                        </p>
                      </div>
                    </div>

                    {/* Tarjeta interactiva */}
                    <div className="bg-white dark:bg-dark-surface-container-high rounded-xl shadow-md p-6 border border-gray-200 border-gray-800-pure hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gray-100 dark:bg-dark-surface-container rounded-lg">
                          <Heart className="h-5 w-5 text-red-500" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900-pure dark:text-white">
                          Tarjeta Interactiva
                        </h4>
                      </div>
                      <p className="text-gray-600-pure dark:text-gray-300 text-sm mb-4">
                        Esta tarjeta tiene efectos de hover y es clickeable.
                      </p>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-gray-100 dark:bg-dark-surface-container text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-dark-surface-container-high transition-colors">
                          Acción 1
                        </button>
                        <button className="px-3 py-1 bg-gray-100 dark:bg-dark-surface-container text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-dark-surface-container-high transition-colors">
                          Acción 2
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sección de Formularios */}
            {selectedTab === 'forms' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-dark-surface-container rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900-pure dark:text-white mb-6">
                    Formularios
                  </h3>
                  
                  <div className="max-w-2xl space-y-6">
                    {/* Inputs básicos */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-700-pure dark:text-gray-300">
                        Campos de Entrada
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700-pure dark:text-gray-300 mb-2">
                            Nombre
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 bg-white dark:bg-dark-surface-container-high border border-gray-300 border-gray-800-pure rounded-lg text-gray-900-pure dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ingresa tu nombre"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700-pure dark:text-gray-300 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            className="w-full px-3 py-2 bg-white dark:bg-dark-surface-container-high border border-gray-300 border-gray-800-pure rounded-lg text-gray-900-pure dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="tu@email.com"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700-pure dark:text-gray-300 mb-2">
                            Mensaje
                          </label>
                          <textarea
                            rows={4}
                            className="w-full px-3 py-2 bg-white dark:bg-dark-surface-container-high border border-gray-300 border-gray-800-pure rounded-lg text-gray-900-pure dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Escribe tu mensaje aquí..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Selects */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-700-pure dark:text-gray-300">
                        Selectores
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700-pure dark:text-gray-300 mb-2">
                            País
                          </label>
                          <select className="w-full px-3 py-2 bg-white dark:bg-dark-surface-container-high border border-gray-300 border-gray-800-pure rounded-lg text-gray-900-pure dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>Selecciona un país</option>
                            <option>Colombia</option>
                            <option>México</option>
                            <option>España</option>
                            <option>Argentina</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Checkboxes y radios */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-700-pure dark:text-gray-300">
                        Opciones
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="terms"
                            className="w-4 h-4 text-blue-600 bg-white dark:bg-dark-surface-container-high border border-gray-300 border-gray-800-pure rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <label htmlFor="terms" className="text-sm text-gray-700-pure dark:text-gray-300">
                            Acepto los términos y condiciones
                          </label>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            id="option1"
                            name="option"
                            className="w-4 h-4 text-blue-600 bg-white dark:bg-dark-surface-container-high border border-gray-300 border-gray-800-pure focus:ring-blue-500 focus:ring-2"
                          />
                          <label htmlFor="option1" className="text-sm text-gray-700-pure dark:text-gray-300">
                            Opción 1
                          </label>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            id="option2"
                            name="option"
                            className="w-4 h-4 text-blue-600 bg-white dark:bg-dark-surface-container-high border border-gray-300 border-gray-800-pure focus:ring-blue-500 focus:ring-2"
                          />
                          <label htmlFor="option2" className="text-sm text-gray-700-pure dark:text-gray-300">
                            Opción 2
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sección de Navegación */}
            {selectedTab === 'navigation' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-dark-surface-container rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900-pure dark:text-white mb-6">
                    Navegación
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Breadcrumbs */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700-pure dark:text-gray-300 mb-3">
                        Breadcrumbs
                      </h4>
                      <nav className="flex items-center space-x-2 text-sm">
                        <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                          Inicio
                        </a>
                        <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500 rotate-[-90deg]" />
                        <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                          Categoría
                        </a>
                        <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500 rotate-[-90deg]" />
                        <span className="text-gray-900-pure dark:text-white font-medium">
                          Página Actual
                        </span>
                      </nav>
                    </div>

                    {/* Tabs */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700-pure dark:text-gray-300 mb-3">
                        Pestañas
                      </h4>
                      <div className="border-b border-gray-200 border-gray-800-pure">
                        <nav className="flex space-x-8">
                          {['General', 'Configuración', 'Avanzado'].map((tab, index) => (
                            <button
                              key={tab}
                              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                index === 0
                                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                        </nav>
                      </div>
                    </div>

                    {/* Paginación */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700-pure dark:text-gray-300 mb-3">
                        Paginación
                      </h4>
                      <div className="flex items-center justify-center space-x-2">
                        <button className="px-3 py-2 bg-white dark:bg-dark-surface-container-high border border-gray-300 border-gray-800-pure rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface-container transition-colors">
                          Anterior
                        </button>
                        <button className="px-3 py-2 bg-blue-500 text-white rounded-lg">1</button>
                        <button className="px-3 py-2 bg-white dark:bg-dark-surface-container-high border border-gray-300 border-gray-800-pure rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-surface-container transition-colors">
                          2
                        </button>
                        <button className="px-3 py-2 bg-white dark:bg-dark-surface-container-high border border-gray-300 border-gray-800-pure rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-surface-container transition-colors">
                          3
                        </button>
                        <button className="px-3 py-2 bg-white dark:bg-dark-surface-container-high border border-gray-300 border-gray-800-pure rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface-container transition-colors">
                          Siguiente
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sección de Alertas */}
            {selectedTab === 'alerts' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-dark-surface-container rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900-pure dark:text-white mb-6">
                    Alertas
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Alerta de éxito */}
                    <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                          Éxito
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          La operación se completó exitosamente.
                        </p>
                      </div>
                    </div>

                    {/* Alerta de error */}
                    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                          Error
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                          Ha ocurrido un error. Por favor, inténtalo de nuevo.
                        </p>
                      </div>
                    </div>

                    {/* Alerta de advertencia */}
                    <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          Advertencia
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                          Ten cuidado con esta acción.
                        </p>
                      </div>
                    </div>

                    {/* Alerta informativa */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Información
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Esta es una información importante.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sección de Badges */}
            {selectedTab === 'badges' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-dark-surface-container rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900-pure dark:text-white mb-6">
                    Badges
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Badges básicos */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700-pure dark:text-gray-300 mb-3">
                        Badges Básicos
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-dark-surface-container-high text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium">
                          Default
                        </span>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                          Azul
                        </span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                          Verde
                        </span>
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full text-xs font-medium">
                          Rojo
                        </span>
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-medium">
                          Amarillo
                        </span>
                      </div>
                    </div>

                    {/* Badges con gradiente */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700-pure dark:text-gray-300 mb-3">
                        Badges con Gradiente
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <span 
                          className="px-3 py-1 text-white rounded-full text-xs font-medium"
                          style={{background: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)'}}
                        >
                          Gradiente
                        </span>
                        <span 
                          className="px-3 py-1 text-white rounded-full text-xs font-medium"
                          style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)'}}
                        >
                          Naranja
                        </span>
                        <span 
                          className="px-3 py-1 text-white rounded-full text-xs font-medium"
                          style={{background: 'linear-gradient(135deg, #A8E6CF 0%, #88D8C0 100%)'}}
                        >
                          Verde
                        </span>
                      </div>
                    </div>

                    {/* Badges de estado */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700-pure dark:text-gray-300 mb-3">
                        Estados
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-xs font-medium flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Activo
                        </span>
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full text-xs font-medium flex items-center gap-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Inactivo
                        </span>
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-medium flex items-center gap-1">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          Pendiente
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sección de Gradientes */}
            {selectedTab === 'gradients' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-dark-surface-container rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900-pure dark:text-white mb-6">
                    Gradientes
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Gradiente principal */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700-pure dark:text-gray-300">
                        Gradiente Principal
                      </h4>
                      <div 
                        className="h-24 rounded-lg flex items-center justify-center text-white font-medium"
                        style={{background: 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)'}}
                      >
                        #16A2FF → #35D07F
                      </div>
                    </div>

                    {/* Gradiente alternativo */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700-pure dark:text-gray-300">
                        Gradiente Alternativo
                      </h4>
                      <div 
                        className="h-24 rounded-lg flex items-center justify-center text-white font-medium"
                        style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)'}}
                      >
                        #FF6B6B → #FFE66D
                      </div>
                    </div>

                    {/* Gradiente neutro */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700-pure dark:text-gray-300">
                        Gradiente Neutro
                      </h4>
                      <div 
                        className="h-24 rounded-lg flex items-center justify-center text-white font-medium"
                        style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}
                      >
                        #667eea → #764ba2
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sección de Texto */}
            {selectedTab === 'text' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-dark-surface-container rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900-pure dark:text-white mb-6">
                    Tipografía
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Títulos */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700-pure dark:text-gray-300 mb-3">
                        Títulos
                      </h4>
                      <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-gray-900-pure dark:text-white">
                          Título H1
                        </h1>
                        <h2 className="text-3xl font-bold text-gray-900-pure dark:text-white">
                          Título H2
                        </h2>
                        <h3 className="text-2xl font-bold text-gray-900-pure dark:text-white">
                          Título H3
                        </h3>
                        <h4 className="text-xl font-semibold text-gray-900-pure dark:text-white">
                          Título H4
                        </h4>
                        <h5 className="text-lg font-semibold text-gray-900-pure dark:text-white">
                          Título H5
                        </h5>
                        <h6 className="text-base font-semibold text-gray-900-pure dark:text-white">
                          Título H6
                        </h6>
                      </div>
                    </div>

                    {/* Texto del cuerpo */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700-pure dark:text-gray-300 mb-3">
                        Texto del Cuerpo
                      </h4>
                      <div className="space-y-2">
                        <p className="text-base text-gray-700-pure dark:text-gray-300">
                          Este es un párrafo normal con texto del cuerpo. Debe ser fácil de leer tanto en modo claro como oscuro.
                        </p>
                        <p className="text-sm text-gray-600-pure dark:text-gray-400">
                          Este es un texto más pequeño, ideal para descripciones o información secundaria.
                        </p>
                        <p className="text-xs text-gray-500-pure dark:text-gray-500">
                          Este es un texto muy pequeño, perfecto para notas o información adicional.
                        </p>
                      </div>
                    </div>

                    {/* Enlaces */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700-pure dark:text-gray-300 mb-3">
                        Enlaces
                      </h4>
                      <div className="space-y-2">
                        <p className="text-gray-700-pure dark:text-gray-300">
                          Este es un <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">enlace normal</a> en el texto.
                        </p>
                        <p className="text-gray-700-pure dark:text-gray-300">
                          Este es un <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">enlace destacado</a> con peso de fuente medio.
                        </p>
                      </div>
                    </div>

                    {/* Código */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700-pure dark:text-gray-300 mb-3">
                        Código
                      </h4>
                      <div className="space-y-2">
                        <p className="text-gray-700-pure dark:text-gray-300">
                          Usa <code className="px-2 py-1 bg-gray-100 dark:bg-dark-surface-container-high text-gray-800 dark:text-gray-200 rounded text-sm font-mono">código inline</code> para referencias cortas.
                        </p>
                        <pre className="bg-gray-100 dark:bg-dark-surface-container-high p-4 rounded-lg overflow-x-auto">
                          <code className="text-sm text-gray-800 dark:text-gray-200 font-mono">
{`// Código de bloque
function ejemplo() {
  return "Hola mundo";
}`}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

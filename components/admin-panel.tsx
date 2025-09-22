'use client'

import { useState } from 'react'

interface AdminPanelProps {
  isAdmin: boolean
  onLogout: () => void
}

export default function AdminPanel({ isAdmin, onLogout }: AdminPanelProps) {
  const [sections, setSections] = useState({
    home: true,
    proyectos: true,
    acerca: true,
    contacto: true
  })

  const handleToggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleDeleteSection = (section: keyof typeof sections) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la sección ${section}?`)) {
      setSections(prev => ({
        ...prev,
        [section]: false
      }))
    }
  }

  if (!isAdmin) return null

  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-lg z-40 max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-black dark:text-white">
          Panel de Administración
        </h3>
        <button
          onClick={onLogout}
          className="text-red-500 hover:text-red-600 text-sm font-medium"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="space-y-3">
        {Object.entries(sections).map(([section, isVisible]) => (
          <div key={section} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={() => handleToggleSection(section as keyof typeof sections)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {section === 'proyectos' ? 'Mi trabajo' : 
                 section === 'acerca' ? 'Acerca de mí' : 
                 section === 'contacto' ? 'Contacto' : 'Home'}
              </span>
            </div>
            <button
              onClick={() => handleDeleteSection(section as keyof typeof sections)}
              className="text-red-500 hover:text-red-600 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Modo administrador activo
        </p>
      </div>
    </div>
  )
}

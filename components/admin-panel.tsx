'use client'

import { useState } from 'react'
import { useAdmin } from '@/contexts/admin-context'

interface AdminPanelProps {
  isAdmin: boolean
  onLogout: () => void
}

export default function AdminPanel({ isAdmin, onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'proyectos' | 'acerca' | 'contacto'>('home')
  const { content, updateTypewriterTexts, updateProjectContent, updateAboutContent, updateContactInfo, resetToDefault } = useAdmin()

  const [editingTexts, setEditingTexts] = useState(content.typewriterTexts)
  const [editingProject, setEditingProject] = useState({ index: 0, title: '', description: '' })
  const [editingAbout, setEditingAbout] = useState({ title: content.aboutTitle, description: content.aboutDescription })
  const [editingContact, setEditingContact] = useState(content.contactInfo)

  if (!isAdmin) return null

  const handleSaveTypewriterTexts = () => {
    updateTypewriterTexts(editingTexts)
  }

  const handleSaveProject = () => {
    updateProjectContent(editingProject.index, editingProject.title, editingProject.description)
  }

  const handleSaveAbout = () => {
    updateAboutContent(editingAbout.title, editingAbout.description)
  }

  const handleSaveContact = () => {
    updateContactInfo(editingContact)
  }

  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-lg z-40 w-96 max-h-[80vh] overflow-y-auto">
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

      {/* Tabs */}
      <div className="flex space-x-2 mb-4">
        {[
          { key: 'home', label: 'Home' },
          { key: 'proyectos', label: 'Proyectos' },
          { key: 'acerca', label: 'Acerca' },
          { key: 'contacto', label: 'Contacto' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      <div className="space-y-4">
        {activeTab === 'home' && (
          <div>
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
              Texto Auto-Escribible
            </h4>
            <div className="space-y-2">
              {editingTexts.map((text, index) => (
                <input
                  key={index}
                  type="text"
                  value={text}
                  onChange={(e) => {
                    const newTexts = [...editingTexts]
                    newTexts[index] = e.target.value
                    setEditingTexts(newTexts)
                  }}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200"
                  placeholder={`Texto ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleSaveTypewriterTexts}
              className="w-full mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              Guardar Cambios
            </button>
          </div>
        )}

        {activeTab === 'proyectos' && (
          <div>
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
              Proyectos
            </h4>
            <div className="space-y-3">
              <select
                value={editingProject.index}
                onChange={(e) => {
                  const index = parseInt(e.target.value)
                  setEditingProject({
                    index,
                    title: content.projectTitles[index],
                    description: content.projectDescriptions[index]
                  })
                }}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200"
              >
                {content.projectTitles.map((title, index) => (
                  <option key={index} value={index}>{title}</option>
                ))}
              </select>
              <input
                type="text"
                value={editingProject.title}
                onChange={(e) => setEditingProject(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200"
                placeholder="Título del proyecto"
              />
              <textarea
                value={editingProject.description}
                onChange={(e) => setEditingProject(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 h-20 resize-none"
                placeholder="Descripción del proyecto"
              />
            </div>
            <button
              onClick={handleSaveProject}
              className="w-full mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              Guardar Proyecto
            </button>
          </div>
        )}

        {activeTab === 'acerca' && (
          <div>
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
              Acerca de Mí
            </h4>
            <div className="space-y-3">
              <input
                type="text"
                value={editingAbout.title}
                onChange={(e) => setEditingAbout(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200"
                placeholder="Título"
              />
              <textarea
                value={editingAbout.description}
                onChange={(e) => setEditingAbout(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 h-24 resize-none"
                placeholder="Descripción"
              />
            </div>
            <button
              onClick={handleSaveAbout}
              className="w-full mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              Guardar Cambios
            </button>
          </div>
        )}

        {activeTab === 'contacto' && (
          <div>
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
              Información de Contacto
            </h4>
            <div className="space-y-3">
              <input
                type="text"
                value={editingContact.whatsapp}
                onChange={(e) => setEditingContact(prev => ({ ...prev, whatsapp: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200"
                placeholder="WhatsApp"
              />
              <input
                type="text"
                value={editingContact.linkedin}
                onChange={(e) => setEditingContact(prev => ({ ...prev, linkedin: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200"
                placeholder="LinkedIn"
              />
              <input
                type="text"
                value={editingContact.location}
                onChange={(e) => setEditingContact(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200"
                placeholder="Ubicación"
              />
            </div>
            <button
              onClick={handleSaveContact}
              className="w-full mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              Guardar Cambios
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={resetToDefault}
          className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
        >
          Restaurar Valores por Defecto
        </button>
      </div>
    </div>
  )
}

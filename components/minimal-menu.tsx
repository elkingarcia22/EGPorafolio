'use client'

import { useState } from 'react'
import Link from 'next/link'

export const MinimalMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { name: 'Mi trabajo', href: '/proyectos' },
    { name: 'Hoja de vida', href: '/cv' },
    { name: 'Contacto', href: '/contacto' },
    { name: 'Administración', href: '/admin' }
  ]

  return (
    <div className="relative">
      {/* Botón de menú */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col gap-1 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200"
      >
        <div className={`w-6 h-0.5 bg-gray-600 dark:bg-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
        <div className={`w-6 h-0.5 bg-gray-600 dark:bg-gray-400 transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
        <div className={`w-6 h-0.5 bg-gray-600 dark:bg-gray-400 transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute top-12 left-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 min-w-[200px] z-50">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 text-sm font-light"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

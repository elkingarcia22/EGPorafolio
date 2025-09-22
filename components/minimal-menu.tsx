'use client'

import { useState } from 'react'
import Link from 'next/link'

export const MinimalMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Mi trabajo', href: '/#proyectos' },
    { name: 'Hoja de vida', href: '/cv' },
    { name: 'Contacto', href: '/contacto' },
    { name: 'Administración', href: '/admin' }
  ]

  return (
    <div className="flex items-center">
      {/* Botón de menú */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col gap-1 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200 z-50"
      >
        <div className={`w-6 h-0.5 bg-gray-600 dark:bg-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
        <div className={`w-6 h-0.5 bg-gray-600 dark:bg-gray-400 transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
        <div className={`w-6 h-0.5 bg-gray-600 dark:bg-gray-400 transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
      </button>

      {/* Menú expandible horizontal */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-w-96 opacity-100' : 'max-w-0 opacity-0'}`}>
        <div className="flex items-center space-x-6 pl-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm font-light whitespace-nowrap px-2 py-1 group"
              onClick={(e) => {
                setIsOpen(false)
                // Si es un enlace interno con hash, hacer scroll suave
                if (item.href.startsWith('/#')) {
                  e.preventDefault()
                  const targetId = item.href.substring(2) // Remover '/#'
                  const targetElement = document.getElementById(targetId)
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' })
                  }
                }
              }}
            >
              {item.name}
              {/* Línea animada con gradiente */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 group-hover:w-full transition-all duration-300 ease-out"></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useState } from 'react'

interface MinimalMenuProps {
  onAdminClick: () => void
}

export const MinimalMenu = ({ onAdminClick }: MinimalMenuProps) => {
  const menuItems = [
    { name: 'Home', href: '/#home' },
    { name: 'Mi trabajo', href: '/#proyectos' },
    { name: 'Acerca de mí', href: '/#acerca' },
    { name: 'Contacto', href: '/#contacto' },
    { name: 'Hoja de vida', href: '/cv' },
    { name: 'Administrador', href: '#', isAdmin: true }
  ]

  return (
    <div className="flex items-center group">
      {/* Botón de menú */}
      <div className="flex flex-col gap-1 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200 z-50">
        <div className="w-6 h-0.5 bg-gray-600 dark:bg-gray-400 transition-transform duration-300 group-hover:rotate-45 group-hover:translate-y-1.5"></div>
        <div className="w-6 h-0.5 bg-gray-600 dark:bg-gray-400 transition-opacity duration-300 group-hover:opacity-0"></div>
        <div className="w-6 h-0.5 bg-gray-600 dark:bg-gray-400 transition-transform duration-300 group-hover:-rotate-45 group-hover:-translate-y-1.5"></div>
      </div>

      {/* Menú expandible horizontal - se activa con hover */}
      <div className="overflow-hidden transition-all duration-500 ease-in-out group-hover:max-w-96 group-hover:opacity-100 max-w-0 opacity-0">
        <div className="flex items-center space-x-6 pl-4">
          {menuItems.map((item, index) => (
            item.isAdmin ? (
              <button
                key={index}
                onClick={onAdminClick}
                className="relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm font-light whitespace-nowrap px-2 py-1 group/item"
              >
                {item.name}
                {/* Línea animada con gradiente - solo aparece en hover del elemento individual */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 group-hover/item:w-full transition-all duration-300 ease-out"></div>
              </button>
            ) : (
              <Link
                key={index}
                href={item.href}
                className="relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm font-light whitespace-nowrap px-2 py-1 group/item"
                onClick={(e) => {
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
                {/* Línea animada con gradiente - solo aparece en hover del elemento individual */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 group-hover/item:w-full transition-all duration-300 ease-out"></div>
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  )
}

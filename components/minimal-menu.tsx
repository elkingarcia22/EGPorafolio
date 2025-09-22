'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

interface MinimalMenuProps {
  onAdminClick: () => void
}

export const MinimalMenu = ({ onAdminClick }: MinimalMenuProps) => {
  const { t, language } = useLanguage()
  
  console.log('📋 MinimalMenu renderizado, idioma:', language)
  
  const menuItems = [
    { name: t('nav.home'), href: '/#home' },
    { name: t('home.myWork'), href: '/#proyectos' },
    { name: t('nav.about'), href: '/#acerca' },
    { name: t('nav.contact'), href: '/#contacto' },
    { name: 'CV', href: '/cv' },
    { name: t('nav.admin'), href: '/admin', isAdmin: true }
  ]

  console.log('📋 MinimalMenu items traducidos:', menuItems)

  return (
    <div className="flex items-center group">
      {/* Botón de menú */}
      <div className="flex flex-col gap-1 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200 z-50">
        <div className="w-6 h-0.5 bg-gray-600 dark:bg-gray-400 transition-transform duration-300 group-hover:rotate-45 group-hover:translate-y-1.5"></div>
        <div className="w-6 h-0.5 bg-gray-600 dark:bg-gray-400 transition-opacity duration-300 group-hover:opacity-0"></div>
        <div className="w-6 h-0.5 bg-gray-600 dark:bg-gray-400 transition-transform duration-300 group-hover:-rotate-45 group-hover:-translate-y-1.5"></div>
      </div>

      {/* Menú expandible horizontal - se activa con hover */}
      <div className="overflow-hidden transition-all duration-500 ease-in-out group-hover:max-w-[600px] group-hover:opacity-100 max-w-0 opacity-0">
        <div className="flex items-center space-x-4 pl-4">
          {menuItems.map((item, index) => {
            console.log(`Rendering item ${index}:`, item.name, 'isAdmin:', item.isAdmin)
            return item.isAdmin ? (
              <Link
                key={index}
                href={item.href}
                className="relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm font-light whitespace-nowrap px-2 py-1 group/item"
              >
                {item.name}
                {/* Línea animada con gradiente - solo aparece en hover del elemento individual */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 group-hover/item:w-full transition-all duration-300 ease-out"></div>
              </Link>
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
          })}
        </div>
      </div>
    </div>
  )
}

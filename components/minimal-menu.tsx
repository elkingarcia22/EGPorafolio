'use client'

import Link from 'next/link'
import { useState, useMemo, useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useDesignTokens } from '@/hooks/useDesignTokens'
import { Tooltip } from './ui/tooltip'

interface MinimalMenuProps {
  onAdminClick: () => void
}

export const MinimalMenu = ({ onAdminClick }: MinimalMenuProps) => {
  const { t, language } = useLanguage()
  const designTokens = useDesignTokens()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showCloseButton, setShowCloseButton] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const closeButtonTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  const menuItems = useMemo(() => [
    { name: t('nav.home'), href: '/#home' },
    { name: t('home.myWork'), href: '/#proyectos' },
    { name: t('nav.about'), href: '/#acerca' },
    { name: t('nav.contact'), href: '/#contacto' },
    { name: 'CV', href: '/cv' },
    { name: t('nav.admin'), href: '/admin', isAdmin: true }
  ], [t, language])

  // Función para alternar el menú
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    
    // Si se abre por click, iniciar timer para mostrar botón X después de 3 segundos
    if (!isMenuOpen) {
      closeButtonTimerRef.current = setTimeout(() => {
        setShowCloseButton(true)
      }, 3000)
    } else {
      // Si se cierra, limpiar timer y ocultar botón X
      setShowCloseButton(false)
      if (closeButtonTimerRef.current) {
        clearTimeout(closeButtonTimerRef.current)
      }
    }
  }

  // Función para cerrar el menú
  const closeMenu = () => {
    setIsMenuOpen(false)
    setIsHovered(false)
    setShowCloseButton(false)
    if (closeButtonTimerRef.current) {
      clearTimeout(closeButtonTimerRef.current)
    }
  }

  // Función para manejar hover - solo para efectos visuales, no para abrir menú
  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  // Efecto para cerrar el menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (closeButtonTimerRef.current) {
        clearTimeout(closeButtonTimerRef.current)
      }
    }
  }, [])

  return (
    <div 
      ref={menuRef}
      className="flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Botón de menú - clickeable para abrir/cerrar, se convierte en X después de 3 segundos */}
      <Tooltip content={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}>
        <button 
          onClick={toggleMenu}
          className="flex items-center justify-center w-8 h-8 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 z-50 group relative"
        >
        {showCloseButton ? (
          // Botón X después de 3 segundos
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Botón hamburguesa normal
          <div className="flex flex-col gap-1">
            <div className={`w-5 h-0.5 bg-gray-600 dark:bg-gray-400 transition-transform duration-300 ${
              isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
            }`}></div>
            <div className={`w-5 h-0.5 bg-gray-600 dark:bg-gray-400 transition-opacity duration-300 ${
              isMenuOpen ? 'opacity-0' : ''
            }`}></div>
            <div className={`w-5 h-0.5 bg-gray-600 dark:bg-gray-400 transition-transform duration-300 ${
              isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`}></div>
          </div>
        )}
        </button>
      </Tooltip>

      {/* Menú expandible horizontal - se activa con hover o click */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
        isMenuOpen 
          ? 'max-w-[600px] opacity-100 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg' 
          : 'max-w-0 opacity-0'
      }`}>
        <div className={`flex items-center space-x-4 ${isMenuOpen ? 'pl-0' : 'pl-4'}`}>
          {menuItems.map((item, index) => {
            return item.isAdmin ? (
              <Link
                key={index}
                href={item.href}
                onClick={closeMenu}
                className="relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm font-light whitespace-nowrap px-2 py-1 group/item"
              >
                {item.name}
                {/* Línea animada con gradiente - solo aparece en hover del elemento individual */}
                <div 
                  className="absolute bottom-0 left-0 w-0 h-0.5 group-hover/item:w-full transition-all duration-300 ease-out"
                  style={{ background: designTokens.colors.primary.gradient }}
                ></div>
              </Link>
            ) : (
              <Link
                key={index}
                href={item.href}
                className="relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm font-light whitespace-nowrap px-2 py-1 group/item"
                onClick={(e) => {
                  // Cerrar el menú
                  closeMenu()
                  
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
                <div 
                  className="absolute bottom-0 left-0 w-0 h-0.5 group-hover/item:w-full transition-all duration-300 ease-out"
                  style={{ background: designTokens.colors.primary.gradient }}
                ></div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

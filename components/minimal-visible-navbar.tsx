'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useDesignTokens } from '@/hooks/useDesignTokens'
import { useTheme } from 'next-themes'
import { LanguageToggle } from './language-toggle'
import { AccessibilityToolbar } from './accessibility-toolbar'
import { Tooltip } from './ui/tooltip'

interface MinimalVisibleNavbarProps {
  onAdminClick: () => void
}

export const MinimalVisibleNavbar = ({ onAdminClick }: MinimalVisibleNavbarProps) => {
  const { t, language } = useLanguage()
  const designTokens = useDesignTokens()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    setMounted(true)
    
    // Si estamos en la página del CV
    if (window.location.pathname === '/cv') {
      setActiveSection('cv')
      return
    }
    
    // Solo configurar scroll spy si estamos en la página principal
    if (window.location.pathname !== '/') {
      return
    }

    const sections = ['home', 'proyectos', 'acerca', 'contacto']
    
    // Función para detectar la sección activa
    const detectActiveSection = () => {
      let currentSection = 'home' // Default
      let maxVisibleArea = 0

      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top
          const elementBottom = rect.bottom
          const viewportHeight = window.innerHeight
          
          // Calcular el área visible de la sección
          const visibleTop = Math.max(0, elementTop)
          const visibleBottom = Math.min(viewportHeight, elementBottom)
          const visibleHeight = Math.max(0, visibleBottom - visibleTop)
          const visibleArea = visibleHeight * rect.width
          
          // Una sección está activa si tiene la mayor área visible
          // Umbral dinámico basado en el tamaño de pantalla y sección
          const visibilityPercentage = visibleHeight / rect.height
          
          // En pantallas grandes, usar umbral más bajo
          // En pantallas pequeñas, usar umbral más alto
          const isLargeScreen = viewportHeight > 800
          const isSmallSection = rect.height < viewportHeight * 0.5 // Sección pequeña si es menos del 50% del viewport
          
          // Debug para cada sección
          console.log(`🔍 ${sectionId}:`, {
            top: elementTop,
            bottom: elementBottom,
            height: rect.height,
            viewportHeight,
            visibleHeight,
            visibleArea,
            percentage: ((visibleHeight / rect.height) * 100).toFixed(1) + '%',
            isSmallSection,
            minThreshold: isSmallSection ? 0.05 : (isLargeScreen ? 0.1 : 0.2)
          })
          
          // Umbral más permisivo para secciones pequeñas
          let minThreshold
          if (isSmallSection) {
            minThreshold = 0.05 // 5% para secciones pequeñas como "proyectos"
          } else if (isLargeScreen) {
            minThreshold = 0.1 // 10% en pantallas grandes
          } else {
            minThreshold = 0.2 // 20% en pantallas pequeñas
          }
          
          // También considerar secciones que están principalmente en el viewport
          const isMainlyVisible = elementTop <= viewportHeight * 0.3 && elementBottom >= viewportHeight * 0.1
          
          // Para secciones pequeñas, también considerar si están en el centro del viewport
          const isInCenter = elementTop <= viewportHeight * 0.4 && elementBottom >= viewportHeight * 0.2
          
          if ((visibilityPercentage >= minThreshold || isMainlyVisible || (isSmallSection && isInCenter)) && visibleArea > maxVisibleArea) {
            maxVisibleArea = visibleArea
            currentSection = sectionId
          }
        } else {
          console.warn(`⚠️ Elemento no encontrado: ${sectionId}`)
        }
      })

      console.log(`🎯 Sección activa detectada: ${currentSection} (área visible: ${maxVisibleArea.toFixed(0)})`)
      setActiveSection(currentSection)
    }

    // Configurar Intersection Observer como respaldo
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -70% 0px',
      threshold: [0, 0.1, 0.5, 1]
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          const sectionId = entry.target.id
          if (sections.includes(sectionId)) {
            console.log(`👁️ Intersection Observer detectó: ${sectionId} (ratio: ${entry.intersectionRatio})`)
            setActiveSection(sectionId)
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observar todas las secciones
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId)
      if (element) {
        observer.observe(element)
        console.log(`👀 Observando: ${sectionId}`)
      }
    })

    // Scroll listener como método principal
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
      detectActiveSection()
    }

    // Detectar sección inicial
    setTimeout(() => {
      detectActiveSection()
    }, 100)

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'

  const menuItems = [
    { name: t('nav.home'), href: '/#home', id: 'home' },
    { name: t('home.myWork'), href: '/#proyectos', id: 'proyectos' },
    { name: t('nav.about'), href: '/#acerca', id: 'acerca' },
    { name: t('nav.contact'), href: '/#contacto', id: 'contacto' },
    { name: t('nav.cv'), href: '/cv', id: 'cv' }
  ]

  const handleNavClick = (e: React.MouseEvent, item: any) => {
    if (item.href.startsWith('/#')) {
      e.preventDefault()
      const targetId = item.href.substring(2)
      
      if (window.location.pathname === '/') {
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        window.location.href = `/#${targetId}`
      }
    }
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 dark:bg-dark-surface-variant/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50' 
        : 'bg-transparent'
    }`}>
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        
        {/* Logo - Nombre y título a la izquierda */}
        <div className="flex items-center space-x-2">
          <Link 
            href="/#home" 
            className="text-lg font-bold text-gray-700 dark:text-gray-300 hover:opacity-70 transition-opacity"
            onClick={(e) => handleNavClick(e, { href: '/#home' })}
          >
            Elkin Garcia
          </Link>
          <span className="text-sm font-normal text-gray-700 dark:text-gray-300">
            UX/UI Design Specialist
          </span>
        </div>

        {/* Navigation Menu - Centrado */}
        <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
          {menuItems.map((item, index) => (
            <div key={index} className="relative">
              <Link
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`text-sm font-normal transition-colors duration-200 relative group ${
                  activeSection === item.id
                    ? 'text-gray-700 dark:text-gray-300'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {item.name}
                {/* Línea inferior animada */}
                <div className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${
                  activeSection === item.id
                    ? 'w-full'
                    : 'w-0 group-hover:w-full'
                }`} style={{
                  background: activeSection === item.id 
                    ? designTokens.colors.primary.gradient 
                    : 'rgb(75 85 99)'
                }}></div>
              </Link>
            </div>
          ))}
        </nav>

        {/* Right Side Controls - Con icono de admin */}
        <div className="flex items-center space-x-2">
          {/* Idioma - Usando componente existente */}
          <LanguageToggle />

          {/* Accesibilidad - Usando componente existente */}
          <AccessibilityToolbar />
          
          <Tooltip content={isDark ? 'Modo claro' : 'Modo oscuro'}>
            <button 
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </Tooltip>

          {/* Icono de Administrador */}
          <Tooltip content="Panel de Administración">
            <button 
              onClick={(e) => {
                console.log('🔧 Admin button clicked in MinimalVisibleNavbar')
                console.log('🔧 onAdminClick function:', onAdminClick)
                e.preventDefault()
                e.stopPropagation()
                if (onAdminClick) {
                  onAdminClick()
                } else {
                  console.error('🔧 onAdminClick is not defined!')
                }
              }}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </Tooltip>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <MobileMenu items={menuItems} onAdminClick={onAdminClick} activeSection={activeSection} />
        </div>
      </div>
    </div>
  )
}

// Componente para menú móvil minimalista
const MobileMenu = ({ items, onAdminClick, activeSection }: any) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavClick = (e: React.MouseEvent, item: any) => {
    if (item.href.startsWith('/#')) {
      e.preventDefault()
      const targetId = item.href.substring(2)
      
      if (window.location.pathname === '/') {
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        window.location.href = `/#${targetId}`
      }
    }
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white/95 dark:bg-dark-surface-variant/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 py-2">
          {items.map((item: any, index: number) => (
            <div key={index}>
              <Link
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`block w-full text-left px-4 py-2 text-sm font-normal transition-colors duration-200 ${
                  activeSection === item.id
                    ? 'text-gray-700 dark:text-gray-300'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {item.name}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

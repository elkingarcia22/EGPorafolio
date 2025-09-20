'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, Briefcase, Code, GraduationCap, MessageCircle, FileText, Sun, Moon, Settings } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Projects', href: '/proyectos', icon: Briefcase },
  { name: 'Skills', href: '/habilidades', icon: Code },
  { name: 'Experience', href: '/experiencia', icon: GraduationCap },
  { name: 'Contact', href: '/contacto', icon: MessageCircle },
]

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { theme, toggleTheme, mounted, isDark } = useTheme()

  return (
    <>
      {/* Neumorphic Navigation Bar */}
      <nav className="w-full z-50">
        <div className="neumorphic-nav-container">
          {/* Left Section - Logo */}
          <div className="flex items-center">
            <Link href="/" className="neumorphic-logo">
              <span className="text-black font-bold text-lg">EG</span>
            </Link>
          </div>

          {/* Center Section - Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <div className={`neumorphic-nav-item ${isActive ? 'neumorphic-nav-item-active' : ''}`}>
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                    <span className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                      {item.name}
                    </span>
                    {isActive && <div className="neumorphic-nav-indicator" />}
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Right Section - Utility Icons */}
          <div className="flex items-center space-x-4">
            {/* CV Button with notification dot */}
            <Link href="/cv" className="relative">
              <div className="neumorphic-icon">
                <FileText className="w-4 h-4 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full" />
              </div>
            </Link>

            {/* Theme Toggle */}
            <button 
              className="neumorphic-icon"
              onClick={toggleTheme}
              disabled={!mounted}
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {mounted && isDark ? (
                <Sun className="w-4 h-4 text-gray-600" />
              ) : (
                <Moon className="w-4 h-4 text-gray-600" />
              )}
            </button>

            {/* Settings */}
            <Link href="/admin" className="neumorphic-icon">
              <Settings className="w-4 h-4 text-gray-600" />
            </Link>

            {/* Mobile menu button */}
            <button
              className="neumorphic-icon md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-4 h-4 text-gray-600" /> : <Menu className="w-4 h-4 text-gray-600" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Mobile menu */}
          <div className="absolute top-24 left-4 right-4 neumorphic-mobile-menu">
            <div className="p-6 space-y-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block"
                  >
                    <div className={`neumorphic-mobile-item ${isActive ? 'neumorphic-mobile-item-active' : ''}`}>
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : 'text-gray-600'}`} />
                      <span className={`font-medium ${isActive ? 'text-blue-500' : 'text-gray-600'}`}>
                        {item.name}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

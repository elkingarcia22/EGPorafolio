'use client'

import { useState } from 'react'

interface AdminModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthenticate: () => void
}

export default function AdminModal({ isOpen, onClose, onAuthenticate }: AdminModalProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simular validación
    setTimeout(() => {
      if (password === 'Lineadesangre22') {
        onAuthenticate()
        setPassword('')
        onClose()
      } else {
        setError('Contraseña incorrecta')
      }
      setIsLoading(false)
    }, 500)
  }

  const handleClose = () => {
    setPassword('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-thin text-black dark:text-white mb-2">
            Acceso de Administrador
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ingresa la contraseña para acceder al modo administrador
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !password}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:from-blue-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {isLoading ? 'Verificando...' : 'Acceder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

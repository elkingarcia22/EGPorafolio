'use client'

import { useAdmin } from '@/contexts/admin-context'
import { useLanguage } from '@/contexts/language-context'
import { AdminProvider } from '@/contexts/admin-context'
import { LanguageProvider } from '@/contexts/language-context'
import { ThemeProvider } from 'next-themes'
import { useState, useEffect } from 'react'

function TestImageContent() {
  const { content } = useAdmin()
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log('🧪 TestImagePage montado')
  }, [])

  if (!mounted) {
    return <div className="p-8">Cargando...</div>
  }

  // Logs detallados
  console.log('🧪 === INICIO LOGS TEST IMAGEN ===')
  console.log('🧪 content completo:', content)
  console.log('🧪 content.projects:', content?.projects)
  console.log('🧪 content.projects type:', typeof content?.projects)
  console.log('🧪 content.projects length:', content?.projects?.length)
  console.log('🧪 content.projects[0]:', content?.projects?.[0])
  console.log('🧪 content.projects[0]?.cover_image_url:', content?.projects?.[0]?.cover_image_url)
  console.log('🧪 URL type:', typeof content?.projects?.[0]?.cover_image_url)
  console.log('🧪 URL length:', content?.projects?.[0]?.cover_image_url?.length)
  console.log('🧪 URL is empty string:', content?.projects?.[0]?.cover_image_url === '')
  console.log('🧪 URL is null:', content?.projects?.[0]?.cover_image_url === null)
  console.log('🧪 URL is undefined:', content?.projects?.[0]?.cover_image_url === undefined)
  console.log('🧪 content.projectTitles:', content?.projectTitles)
  console.log('🧪 content.projectTitles[0]:', content?.projectTitles?.[0])
  console.log('🧪 === FIN LOGS TEST IMAGEN ===')

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          🧪 Test de Imágenes - Debug Controlado
        </h1>

        {/* Información de debug */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            📊 Información de Debug
          </h2>
          <div className="space-y-2 text-sm">
            <p><strong>content existe:</strong> {content ? '✅ Sí' : '❌ No'}</p>
            <p><strong>content.projects existe:</strong> {content?.projects ? '✅ Sí' : '❌ No'}</p>
            <p><strong>content.projects type:</strong> {typeof content?.projects}</p>
            <p><strong>content.projects length:</strong> {content?.projects?.length || 'N/A'}</p>
            <p><strong>content.projects[0] existe:</strong> {content?.projects?.[0] ? '✅ Sí' : '❌ No'}</p>
            <p><strong>cover_image_url existe:</strong> {content?.projects?.[0]?.cover_image_url ? '✅ Sí' : '❌ No'}</p>
            <p><strong>cover_image_url valor:</strong> {content?.projects?.[0]?.cover_image_url || 'N/A'}</p>
            <p><strong>projectTitles[0]:</strong> {content?.projectTitles?.[0] || 'N/A'}</p>
          </div>
        </div>

        {/* Test de imagen */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            🖼️ Test de Imagen
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Imagen con verificación */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
                Imagen con Verificación
              </h3>
              <div className="relative h-64 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden">
                {content?.projects && content.projects[0]?.cover_image_url ? (
                  <img 
                    src={content.projects[0].cover_image_url} 
                    alt={content.projectTitles?.[0] || 'Proyecto'}
                    className="w-full h-full object-cover"
                    onLoad={() => console.log('✅ Imagen cargada exitosamente')}
                    onError={(e) => console.log('❌ Error cargando imagen:', e)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                    <span className="text-white font-medium">Sin imagen</span>
                  </div>
                )}
              </div>
            </div>

            {/* Imagen directa (sin verificación) */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
                Imagen Directa (Sin Verificación)
              </h3>
              <div className="relative h-64 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden">
                {content?.projects?.[0]?.cover_image_url ? (
                  <img 
                    src={content.projects[0].cover_image_url} 
                    alt="Test directo"
                    className="w-full h-full object-cover"
                    onLoad={() => console.log('✅ Imagen directa cargada')}
                    onError={(e) => console.log('❌ Error imagen directa:', e)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-red-200 dark:bg-red-800">
                    <p className="text-red-800 dark:text-red-200 text-center">
                      No hay URL de imagen disponible<br/>
                      <span className="text-sm">URL: {content?.projects?.[0]?.cover_image_url || 'undefined'}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* URL de la imagen */}
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
            <h4 className="font-medium mb-2 text-gray-900 dark:text-white">URL de la imagen:</h4>
            <code className="text-sm text-gray-600 dark:text-gray-300 break-all">
              {content?.projects?.[0]?.cover_image_url || 'No hay URL disponible'}
            </code>
          </div>
        </div>

        {/* Test de fetch manual */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mt-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            🔗 Test de Fetch Manual
          </h2>
          <button 
            onClick={async () => {
              const url = content?.projects?.[0]?.cover_image_url
              if (url) {
                console.log('🔗 Probando fetch a:', url)
                try {
                  const response = await fetch(url, { method: 'HEAD' })
                  console.log('📡 Respuesta fetch:', response.status, response.statusText)
                  console.log('📡 Headers:', Object.fromEntries(response.headers.entries()))
                } catch (error) {
                  console.log('❌ Error en fetch:', error)
                }
              } else {
                console.log('❌ No hay URL para probar')
              }
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Probar Fetch de Imagen
          </button>
        </div>

        {/* Datos completos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mt-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            📋 Datos Completos
          </h2>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-xs overflow-auto max-h-96">
            {JSON.stringify(content, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default function TestImagePage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <AdminProvider>
          <TestImageContent />
        </AdminProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

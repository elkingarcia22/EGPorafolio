import type { Meta, StoryObj } from '@storybook/react'
import { designTokens } from '@/lib/design-tokens'

const meta: Meta = {
  title: 'Design System/Tokens',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Sistema de tokens de diseño del portafolio EG. Define todos los valores reutilizables como colores, tipografía, espaciado, etc.'
      }
    }
  }
}

export default meta
type Story = StoryObj

// Componente para mostrar colores
const ColorPalette = ({ colors, title }: { colors: Record<string, any>, title: string }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{title}</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Object.entries(colors).map(([key, value]) => {
        // Manejar objetos anidados (como primary.blue, primary.green, etc.)
        if (typeof value === 'object' && value !== null) {
          return (
            <div key={key} className="col-span-full">
              <h4 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">{key}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 ml-4">
                {Object.entries(value).map(([subKey, subValue]) => (
                  <div key={subKey} className="text-center">
                    <div 
                      className="w-full h-16 rounded-lg mb-2 border border-gray-200 dark:border-gray-700"
                      style={{ 
                        backgroundColor: typeof subValue === 'string' && subValue.startsWith('#') ? subValue : undefined,
                        background: typeof subValue === 'string' && subValue.includes('gradient') ? subValue : undefined
                      }}
                    />
                    <p className="text-xs font-mono text-gray-600 dark:text-gray-400">{subKey}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{String(subValue)}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        }
        
        // Manejar valores simples
        return (
          <div key={key} className="text-center">
            <div 
              className="w-full h-16 rounded-lg mb-2 border border-gray-200 dark:border-gray-700"
              style={{ 
                backgroundColor: typeof value === 'string' && value.startsWith('#') ? value : undefined,
                background: typeof value === 'string' && value.includes('gradient') ? value : undefined
              }}
            />
            <p className="text-xs font-mono text-gray-600 dark:text-gray-400">{key}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">{String(value)}</p>
          </div>
        )
      })}
    </div>
  </div>
)

// Componente para mostrar tipografía
const TypographyShowcase = () => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Tipografía</h3>
    
    {/* Tamaños de fuente */}
    <div className="mb-6">
      <h4 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Tamaños de Fuente</h4>
      <div className="space-y-2">
        {Object.entries(designTokens.typography.fontSize).map(([key, value]) => (
          <div key={key} className="flex items-center gap-4">
            <span className="w-16 text-sm font-mono text-gray-500 dark:text-gray-400">{key}</span>
            <span className="w-20 text-sm font-mono text-gray-500 dark:text-gray-400">{value}</span>
            <span 
              className="text-gray-800 dark:text-white"
              style={{ fontSize: value }}
            >
              The quick brown fox jumps over the lazy dog
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Pesos de fuente */}
    <div className="mb-6">
      <h4 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Pesos de Fuente</h4>
      <div className="space-y-2">
        {Object.entries(designTokens.typography.fontWeight).map(([key, value]) => (
          <div key={key} className="flex items-center gap-4">
            <span className="w-20 text-sm font-mono text-gray-500 dark:text-gray-400">{key}</span>
            <span className="w-12 text-sm font-mono text-gray-500 dark:text-gray-400">{value}</span>
            <span 
              className="text-gray-800 dark:text-white"
              style={{ fontWeight: value }}
            >
              The quick brown fox jumps over the lazy dog
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

// Componente para mostrar espaciado
const SpacingShowcase = () => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Espaciado</h3>
    <div className="space-y-3">
      {Object.entries(designTokens.spacing).map(([key, value]) => (
        <div key={key} className="flex items-center gap-4">
          <span className="w-16 text-sm font-mono text-gray-500 dark:text-gray-400">{key}</span>
          <span className="w-20 text-sm font-mono text-gray-500 dark:text-gray-400">{value}</span>
          <div 
            className="bg-blue-500 h-4 rounded"
            style={{ width: value }}
          />
        </div>
      ))}
    </div>
  </div>
)

// Componente para mostrar bordes
const BorderRadiusShowcase = () => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Border Radius</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(designTokens.borderRadius).map(([key, value]) => (
        <div key={key} className="text-center">
          <div 
            className="w-16 h-16 bg-blue-500 mx-auto mb-2"
            style={{ borderRadius: value }}
          />
          <p className="text-xs font-mono text-gray-600 dark:text-gray-400">{key}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{value}</p>
        </div>
      ))}
    </div>
  </div>
)

// Componente para mostrar sombras
const ShadowShowcase = () => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Sombras</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {Object.entries(designTokens.boxShadow).map(([key, value]) => (
        <div key={key} className="text-center">
          <div 
            className="w-20 h-20 bg-white dark:bg-gray-800 mx-auto mb-2 rounded-lg"
            style={{ boxShadow: value }}
          />
          <p className="text-xs font-mono text-gray-600 dark:text-gray-400">{key}</p>
        </div>
      ))}
    </div>
  </div>
)

export const Colors: Story = {
  render: () => (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Design Tokens - Colores</h1>
      
      <ColorPalette colors={designTokens.colors.primary} title="Colores Primarios" />
      <ColorPalette colors={designTokens.colors.text} title="Colores de Texto" />
      <ColorPalette colors={designTokens.colors.background} title="Colores de Fondo" />
      <ColorPalette colors={designTokens.colors.state} title="Estados" />
    </div>
  )
}

export const Typography: Story = {
  render: () => (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Design Tokens - Tipografía</h1>
      <TypographyShowcase />
    </div>
  )
}

export const Spacing: Story = {
  render: () => (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Design Tokens - Espaciado</h1>
      <SpacingShowcase />
    </div>
  )
}

export const BorderRadius: Story = {
  render: () => (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Design Tokens - Border Radius</h1>
      <BorderRadiusShowcase />
    </div>
  )
}

export const Shadows: Story = {
  render: () => (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Design Tokens - Sombras</h1>
      <ShadowShowcase />
    </div>
  )
}

export const AllTokens: Story = {
  render: () => (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Design Tokens - Completo</h1>
      
      <ColorPalette colors={designTokens.colors.primary} title="Colores Primarios" />
      <ColorPalette colors={designTokens.colors.text} title="Colores de Texto" />
      <ColorPalette colors={designTokens.colors.background} title="Colores de Fondo" />
      <ColorPalette colors={designTokens.colors.state} title="Estados" />
      
      <TypographyShowcase />
      <SpacingShowcase />
      <BorderRadiusShowcase />
      <ShadowShowcase />
    </div>
  )
}
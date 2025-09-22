import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  title: 'Design System/Tokens',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Tokens de diseño del sistema: colores, tipografía y espaciado. Estos tokens definen la identidad visual consistente de la aplicación.'
      }
    }
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

// Componente para mostrar colores
const ColorPalette = ({ colors, title }: { colors: Record<string, string>, title: string }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-normal text-gray-600 dark:text-white">{title}</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Object.entries(colors).map(([name, value]) => (
        <div key={name} className="space-y-2">
          <div 
            className="w-full h-16 rounded-lg border border-gray-200 dark:border-gray-700"
            style={{ backgroundColor: value }}
          />
          <div className="text-xs">
            <div className="font-mono text-gray-600 dark:text-gray-400">{name}</div>
            <div className="font-mono text-gray-500 dark:text-gray-500">{value}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

// Componente para mostrar tipografía
const TypographyScale = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-normal text-gray-600 dark:text-white">Escala Tipográfica</h3>
    
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-normal text-gray-600 dark:text-white mb-2">Heading 1 - 4xl</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">font-normal, text-gray-600 dark:text-white</p>
      </div>
      
      <div>
        <h2 className="text-3xl font-normal text-gray-600 dark:text-white mb-2">Heading 2 - 3xl</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">font-normal, text-gray-600 dark:text-white</p>
      </div>
      
      <div>
        <h3 className="text-2xl font-normal text-gray-600 dark:text-white mb-2">Heading 3 - 2xl</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">font-normal, text-gray-600 dark:text-white</p>
      </div>
      
      <div>
        <h4 className="text-xl font-normal text-gray-600 dark:text-white mb-2">Heading 4 - xl</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">font-normal, text-gray-600 dark:text-white</p>
      </div>
      
      <div>
        <h5 className="text-lg font-normal text-gray-600 dark:text-white mb-2">Heading 5 - lg</h5>
        <p className="text-sm text-gray-500 dark:text-gray-400">font-normal, text-gray-600 dark:text-white</p>
      </div>
      
      <div>
        <p className="text-base font-normal text-gray-600 dark:text-gray-300 mb-2">Body Text - base</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">font-normal, text-gray-600 dark:text-gray-300</p>
      </div>
      
      <div>
        <p className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-2">Small Text - sm</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">font-normal, text-gray-500 dark:text-gray-400</p>
      </div>
      
      <div>
        <p className="text-xs font-normal text-gray-500 dark:text-gray-400 mb-2">Extra Small - xs</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">font-normal, text-gray-500 dark:text-gray-400</p>
      </div>
    </div>
  </div>
)

// Componente para mostrar espaciado
const SpacingScale = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-normal text-gray-600 dark:text-white">Escala de Espaciado</h3>
    
    <div className="space-y-4">
      {[1, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64].map((size) => (
        <div key={size} className="flex items-center gap-4">
          <div className="w-16 text-sm font-mono text-gray-600 dark:text-gray-400">
            {size * 4}px
          </div>
          <div 
            className="bg-gray-200 dark:bg-gray-700"
            style={{ width: `${size * 4}px`, height: '20px' }}
          />
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {size} ({size * 4}px)
          </div>
        </div>
      ))}
    </div>
  </div>
)

export const Colors: Story = {
  render: () => (
    <div className="p-8 space-y-8 bg-white dark:bg-[#0a0a0a] min-h-screen">
      <div>
        <h1 className="text-3xl font-normal text-gray-600 dark:text-white mb-2">Tokens de Color</h1>
        <p className="text-gray-500 dark:text-gray-400">Paleta de colores del sistema de diseño</p>
      </div>
      
      <ColorPalette 
        title="Grises Principales"
        colors={{
          'gray-50': '#f9fafb',
          'gray-100': '#f3f4f6',
          'gray-200': '#e5e7eb',
          'gray-300': '#d1d5db',
          'gray-400': '#9ca3af',
          'gray-500': '#6b7280',
          'gray-600': '#4b5563',
          'gray-700': '#374151',
          'gray-800': '#1f2937',
          'gray-900': '#111827'
        }}
      />
      
      <ColorPalette 
        title="Colores de Fondo"
        colors={{
          'white': '#ffffff',
          'dark-bg': '#0a0a0a',
          'white/95': 'rgba(255, 255, 255, 0.95)',
          'dark-bg/95': 'rgba(10, 10, 10, 0.95)'
        }}
      />
      
      <ColorPalette 
        title="Colores de Texto"
        colors={{
          'text-primary': '#4b5563',
          'text-primary-dark': '#ffffff',
          'text-secondary': '#6b7280',
          'text-secondary-dark': '#9ca3af',
          'text-muted': '#6b7280',
          'text-muted-dark': '#9ca3af'
        }}
      />
      
      <ColorPalette 
        title="Colores de Borde"
        colors={{
          'border-light': '#e5e7eb',
          'border-light-dark': '#374151',
          'border-muted': 'rgba(229, 231, 235, 0.5)',
          'border-muted-dark': 'rgba(55, 65, 81, 0.5)'
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Paleta completa de colores utilizados en el sistema de diseño. Incluye grises, fondos, textos y bordes para modo claro y oscuro.'
      }
    }
  }
}

export const Typography: Story = {
  render: () => (
    <div className="p-8 space-y-8 bg-white dark:bg-[#0a0a0a] min-h-screen">
      <div>
        <h1 className="text-3xl font-normal text-gray-600 dark:text-white mb-2">Tokens de Tipografía</h1>
        <p className="text-gray-500 dark:text-gray-400">Escala tipográfica y pesos de fuente del sistema</p>
      </div>
      
      <TypographyScale />
      
      <div className="space-y-4">
        <h3 className="text-lg font-normal text-gray-600 dark:text-white">Pesos de Fuente</h3>
        <div className="space-y-2">
          <div className="text-base font-thin text-gray-600 dark:text-white">font-thin (100)</div>
          <div className="text-base font-light text-gray-600 dark:text-white">font-light (300)</div>
          <div className="text-base font-normal text-gray-600 dark:text-white">font-normal (400) - Usado por defecto</div>
          <div className="text-base font-medium text-gray-600 dark:text-white">font-medium (500)</div>
          <div className="text-base font-semibold text-gray-600 dark:text-white">font-semibold (600)</div>
          <div className="text-base font-bold text-gray-600 dark:text-white">font-bold (700)</div>
          <div className="text-base font-extrabold text-gray-600 dark:text-white">font-extrabold (800)</div>
          <div className="text-base font-black text-gray-600 dark:text-white">font-black (900)</div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-normal text-gray-600 dark:text-white">Familia de Fuentes</h3>
        <div className="space-y-2">
          <div className="text-base font-normal text-gray-600 dark:text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
            Inter - Fuente principal del sistema
          </div>
          <div className="text-base font-normal text-gray-600 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Outfit - Para títulos especiales
          </div>
          <div className="text-base font-normal text-gray-600 dark:text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Space Grotesk - Para elementos técnicos
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Sistema tipográfico completo con escalas, pesos y familias de fuentes utilizadas en la aplicación.'
      }
    }
  }
}

export const Spacing: Story = {
  render: () => (
    <div className="p-8 space-y-8 bg-white dark:bg-[#0a0a0a] min-h-screen">
      <div>
        <h1 className="text-3xl font-normal text-gray-600 dark:text-white mb-2">Tokens de Espaciado</h1>
        <p className="text-gray-500 dark:text-gray-400">Escala de espaciado basada en múltiplos de 4px</p>
      </div>
      
      <SpacingScale />
      
      <div className="space-y-4">
        <h3 className="text-lg font-normal text-gray-600 dark:text-white">Uso en Componentes</h3>
        <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <strong>Padding:</strong> p-4 (16px), p-6 (24px), p-8 (32px)
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <strong>Margin:</strong> m-4 (16px), m-6 (24px), m-8 (32px)
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <strong>Gap:</strong> gap-2 (8px), gap-4 (16px), gap-6 (24px)
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <strong>Espaciado vertical:</strong> space-y-4 (16px), space-y-6 (24px), space-y-8 (32px)
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Sistema de espaciado consistente basado en múltiplos de 4px para mantener la armonía visual.'
      }
    }
  }
}

export const AllTokens: Story = {
  render: () => (
    <div className="p-8 space-y-12 bg-white dark:bg-[#0a0a0a] min-h-screen">
      <div>
        <h1 className="text-4xl font-normal text-gray-600 dark:text-white mb-4">Sistema de Diseño</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">Tokens de diseño completos para mantener consistencia visual</p>
      </div>
      
      <div className="grid gap-8">
        <div>
          <h2 className="text-2xl font-normal text-gray-600 dark:text-white mb-4">Colores</h2>
          <ColorPalette 
            title="Grises Principales"
            colors={{
              'gray-600': '#4b5563',
              'gray-500': '#6b7280',
              'gray-400': '#9ca3af',
              'gray-300': '#d1d5db',
              'white': '#ffffff',
              'dark-bg': '#0a0a0a'
            }}
          />
        </div>
        
        <div>
          <h2 className="text-2xl font-normal text-gray-600 dark:text-white mb-4">Tipografía</h2>
          <div className="space-y-3">
            <h1 className="text-3xl font-normal text-gray-600 dark:text-white">Título Principal</h1>
            <h2 className="text-2xl font-normal text-gray-600 dark:text-white">Título Secundario</h2>
            <h3 className="text-xl font-normal text-gray-600 dark:text-white">Título Terciario</h3>
            <p className="text-base font-normal text-gray-600 dark:text-gray-300">Texto del cuerpo principal</p>
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Texto secundario o de apoyo</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-normal text-gray-600 dark:text-white mb-4">Espaciado</h2>
          <div className="space-y-2">
            {[1, 2, 4, 6, 8, 12, 16, 24, 32].map((size) => (
              <div key={size} className="flex items-center gap-4">
                <div className="w-12 text-sm font-mono text-gray-600 dark:text-gray-400">
                  {size * 4}px
                </div>
                <div 
                  className="bg-gray-200 dark:bg-gray-700"
                  style={{ width: `${size * 4}px`, height: '16px' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Vista consolidada de todos los tokens de diseño del sistema para referencia rápida.'
      }
    }
  }
}

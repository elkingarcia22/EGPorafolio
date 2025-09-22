import type { Meta, StoryObj } from '@storybook/react'
import { Floating3DBackground } from '@/components/floating-3d-background'

const meta: Meta<typeof Floating3DBackground> = {
  title: 'Components/Floating3DBackground',
  component: Floating3DBackground,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-[#f0f0f3] dark:bg-[#0a0a0a] transition-colors duration-300 relative">
      <Floating3DBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-4xl mx-auto px-8">
          <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-6">
            Fondo 3D Neumórfico
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Formas geométricas 3D flotantes con efectos neumórficos.
            Cubos, esferas y pirámides que crean un ambiente futurista y dinámico.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="p-6 rounded-2xl" style={{
              background: '#f0f0f3',
              boxShadow: '20px 20px 40px #d1d9e6, -20px -20px 40px #ffffff'
            }}>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Formas 3D</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Cubos, esferas, pirámides y cilindros con perspectiva real</p>
            </div>
            <div className="p-6 rounded-2xl" style={{
              background: '#f0f0f3',
              boxShadow: '20px 20px 40px #d1d9e6, -20px -20px 40px #ffffff'
            }}>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Efectos Avanzados</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Gradientes, sombras múltiples y transformaciones 3D</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const WithContent: Story = {
  render: () => (
    <div className="min-h-screen bg-[#f0f0f3] dark:bg-[#0a0a0a] transition-colors duration-300 relative">
      <Floating3DBackground />
      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white text-center mb-8">
            Portfolio con Fondo 3D
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl" style={{
              background: '#f0f0f3',
              boxShadow: '20px 20px 40px #d1d9e6, -20px -20px 40px #ffffff'
            }}>
              <h3 className="text-gray-800 dark:text-white text-xl font-semibold mb-4">Proyectos</h3>
              <p className="text-gray-600 dark:text-gray-300">Explora mi trabajo más reciente en diseño UX/UI.</p>
            </div>
            
            <div className="p-8 rounded-2xl" style={{
              background: '#f0f0f3',
              boxShadow: '20px 20px 40px #d1d9e6, -20px -20px 40px #ffffff'
            }}>
              <h3 className="text-gray-800 dark:text-white text-xl font-semibold mb-4">Experiencia</h3>
              <p className="text-gray-600 dark:text-gray-300">Mi trayectoria profesional y logros destacados.</p>
            </div>
            
            <div className="p-8 rounded-2xl" style={{
              background: '#f0f0f3',
              boxShadow: '20px 20px 40px #d1d9e6, -20px -20px 40px #ffffff'
            }}>
              <h3 className="text-gray-800 dark:text-white text-xl font-semibold mb-4">Habilidades</h3>
              <p className="text-gray-600 dark:text-gray-300">Tecnologías y herramientas que domino.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Shapes3D: Story = {
  render: () => (
    <div className="min-h-screen bg-[#f0f0f3] dark:bg-[#0a0a0a] transition-colors duration-300 relative">
      <Floating3DBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-3xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
            Formas 3D Flotantes
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Observa las formas geométricas 3D con efectos neumórficos avanzados
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 rounded-xl" style={{
              background: '#f0f0f3',
              boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff'
            }}>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Cubos 3D</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Con rotaciones y perspectivas realistas</p>
            </div>
            <div className="p-4 rounded-xl" style={{
              background: '#f0f0f3',
              boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff'
            }}>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Esferas</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Con gradientes radiales y sombras suaves</p>
            </div>
            <div className="p-4 rounded-xl" style={{
              background: '#f0f0f3',
              boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff'
            }}>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Pirámides</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Formas triangulares con efectos de profundidad</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

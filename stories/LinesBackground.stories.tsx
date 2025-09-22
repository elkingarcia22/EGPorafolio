import type { Meta, StoryObj } from '@storybook/react'
import { LinesBackground } from '@/components/lines-background'

const meta: Meta<typeof LinesBackground> = {
  title: 'Components/LinesBackground',
  component: LinesBackground,
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
      <LinesBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-4xl mx-auto px-8">
          <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-6">
            Fondo de Líneas Elegantes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Líneas simples y elegantes que crean un ambiente minimalista y moderno.
            Diseño limpio con movimiento sutil y efectos neumórficos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="p-6 rounded-2xl" style={{
              background: '#f0f0f3',
              boxShadow: '20px 20px 40px #d1d9e6, -20px -20px 40px #ffffff'
            }}>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Líneas Limpias</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Diseño minimalista con líneas horizontales, verticales y diagonales</p>
            </div>
            <div className="p-6 rounded-2xl" style={{
              background: '#f0f0f3',
              boxShadow: '20px 20px 40px #d1d9e6, -20px -20px 40px #ffffff'
            }}>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Movimiento Sutil</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Animaciones suaves que no distraen del contenido</p>
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
      <LinesBackground />
      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white text-center mb-8">
            Portfolio con Líneas Elegantes
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

export const LinesOnly: Story = {
  render: () => (
    <div className="min-h-screen bg-[#f0f0f3] dark:bg-[#0a0a0a] transition-colors duration-300 relative">
      <LinesBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-3xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
            Solo Líneas Elegantes
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Observa las líneas flotando suavemente en el fondo
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 rounded-xl" style={{
              background: '#f0f0f3',
              boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff'
            }}>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Horizontales</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Líneas que cruzan la pantalla</p>
            </div>
            <div className="p-4 rounded-xl" style={{
              background: '#f0f0f3',
              boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff'
            }}>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Verticales</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Líneas que van de arriba a abajo</p>
            </div>
            <div className="p-4 rounded-xl" style={{
              background: '#f0f0f3',
              boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff'
            }}>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Diagonales</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Líneas con ángulos dinámicos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

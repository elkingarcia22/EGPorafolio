import type { Meta, StoryObj } from '@storybook/react'
import { GeometricBackground } from '@/components/geometric-background'

const meta: Meta<typeof GeometricBackground> = {
  title: 'Components/GeometricBackground',
  component: GeometricBackground,
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
      <GeometricBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">
            Fondo Geométrico
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Formas geométricas grandes con estilo neomorfismo que crean un fondo dinámico y moderno.
            Prueba cambiar entre modo claro y oscuro para ver la diferencia.
          </p>
        </div>
      </div>
    </div>
  ),
}

export const WithContent: Story = {
  render: () => (
    <div className="min-h-screen bg-[#f0f0f3] dark:bg-[#0a0a0a] transition-colors duration-300 relative">
      <GeometricBackground />
      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white text-center mb-8">
            Portfolio con Fondo Geométrico
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="neo-card p-8">
              <h3 className="text-gray-800 dark:text-white text-xl font-semibold mb-4">Proyectos</h3>
              <p className="text-gray-600 dark:text-gray-300">Explora mi trabajo más reciente en diseño UX/UI.</p>
            </div>
            
            <div className="neo-card p-8">
              <h3 className="text-gray-800 dark:text-white text-xl font-semibold mb-4">Experiencia</h3>
              <p className="text-gray-600 dark:text-gray-300">Mi trayectoria profesional y logros destacados.</p>
            </div>
            
            <div className="neo-card p-8">
              <h3 className="text-gray-800 dark:text-white text-xl font-semibold mb-4">Habilidades</h3>
              <p className="text-gray-600 dark:text-gray-300">Tecnologías y herramientas que domino.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const ShapesOnly: Story = {
  render: () => (
    <div className="min-h-screen bg-[#f0f0f3] dark:bg-[#0a0a0a] transition-colors duration-300 relative">
      <GeometricBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Solo Formas Geométricas
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Observa las formas flotando en el fondo
          </p>
        </div>
      </div>
    </div>
  ),
}

import type { Meta, StoryObj } from '@storybook/react'
import { Navigation } from '@/components/navigation'

const meta: Meta<typeof Navigation> = {
  title: 'Showcase/MenuShowcase',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const FullMenu: Story = {
  render: () => (
    <div className="bg-[#f0f0f3] dark:bg-[#0a0a0a] min-h-screen transition-colors duration-300">
      <Navigation />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white text-center mb-4">
            Portfolio UX/UI Designer
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 text-xl max-w-3xl mx-auto mb-12">
            Diseñador senior especializado en experiencias de usuario excepcionales con estilo neomorfismo.
            Prueba el botón de tema para ver la diferencia entre modo claro y oscuro.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
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

export const MenuOnly: Story = {
  render: () => (
    <div className="bg-[#f0f0f3] dark:bg-[#0a0a0a] min-h-screen transition-colors duration-300">
      <Navigation />
    </div>
  ),
}

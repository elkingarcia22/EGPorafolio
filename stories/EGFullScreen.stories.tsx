import type { Meta, StoryObj } from '@storybook/react'
import { EGFullScreen } from '@/components/eg-fullscreen'

const meta: Meta<typeof EGFullScreen> = {
  title: 'Components/EGFullScreen',
  component: EGFullScreen,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-[#f0f0f3] dark:bg-[#0a0a0a] transition-colors duration-300 relative overflow-hidden">
      <EGFullScreen />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-4xl mx-auto px-8">
          <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-6">
            Letras EG Pantalla Completa
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Las letras "EG" en tamaño gigante ocupando toda la pantalla.
            Un diseño impactante y dramático para tu portafolio.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="p-6 rounded-2xl" style={{
              background: '#f0f0f3',
              boxShadow: '20px 20px 40px #d1d9e6, -20px -20px 40px #ffffff'
            }}>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Tamaño Gigante</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">50rem de altura para máximo impacto visual</p>
            </div>
            <div className="p-6 rounded-2xl" style={{
              background: '#f0f0f3',
              boxShadow: '20px 20px 40px #d1d9e6, -20px -20px 40px #ffffff'
            }}>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Efectos Dramáticos</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Sombras neumórficas de hasta 240px</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const FullScreen: Story = {
  render: () => (
    <div className="min-h-screen bg-[#f0f0f3] dark:bg-[#0a0a0a] transition-colors duration-300 relative overflow-hidden">
      <EGFullScreen />
    </div>
  ),
}

export const WithNavigation: Story = {
  render: () => (
    <div className="min-h-screen bg-[#f0f0f3] dark:bg-[#0a0a0a] transition-colors duration-300 relative overflow-hidden">
      <div className="relative z-10 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Portfolio Elkin García</h1>
          <div className="flex gap-4">
            <button className="px-4 py-2 rounded-lg bg-[#f0f0f3] text-gray-800 dark:text-white" style={{
              boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff'
            }}>
              Home
            </button>
            <button className="px-4 py-2 rounded-lg bg-[#f0f0f3] text-gray-800 dark:text-white" style={{
              boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff'
            }}>
              Alternative
            </button>
          </div>
        </div>
      </div>
      <EGFullScreen />
    </div>
  ),
}

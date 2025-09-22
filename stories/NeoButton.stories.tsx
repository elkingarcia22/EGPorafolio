import type { Meta, StoryObj } from '@storybook/react'
import { NeoButton } from '@/components/ui/neo-button'
import { Loader2, Star, Heart, Download } from 'lucide-react'

const meta: Meta<typeof NeoButton> = {
  title: 'Components/NeoButton',
  component: NeoButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Botón minimalista con variantes y estados. Actualizado al estilo minimalista con colores consistentes y tipografía regular.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost'],
      description: 'Variante visual del botón'
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño del botón'
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Estado de carga'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Estado deshabilitado'
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Ancho completo'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Botón Primario',
    variant: 'primary'
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón primario con fondo gris oscuro y texto blanco. Ideal para acciones principales.'
      }
    }
  }
}

export const Secondary: Story = {
  args: {
    children: 'Botón Secundario',
    variant: 'secondary'
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón secundario con fondo gris claro. Perfecto para acciones secundarias.'
      }
    }
  }
}

export const Outline: Story = {
  args: {
    children: 'Botón Outline',
    variant: 'outline'
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón con borde y fondo transparente. Ideal para acciones menos prominentes.'
      }
    }
  }
}

export const Ghost: Story = {
  args: {
    children: 'Botón Ghost',
    variant: 'ghost'
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón fantasma con solo texto. Perfecto para acciones sutiles.'
      }
    }
  }
}

export const WithIcon: Story = {
  args: {
    children: 'Con Icono',
    variant: 'primary',
    icon: <Star className="h-4 w-4" />
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón con icono a la izquierda del texto.'
      }
    }
  }
}

export const Loading: Story = {
  args: {
    children: 'Cargando...',
    variant: 'primary',
    loading: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón en estado de carga con spinner animado.'
      }
    }
  }
}

export const Disabled: Story = {
  args: {
    children: 'Deshabilitado',
    variant: 'primary',
    disabled: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón deshabilitado con opacidad reducida.'
      }
    }
  }
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <NeoButton variant="primary" size="sm">Pequeño</NeoButton>
      <NeoButton variant="primary" size="md">Mediano</NeoButton>
      <NeoButton variant="primary" size="lg">Grande</NeoButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes tamaños disponibles: pequeño, mediano y grande.'
      }
    }
  }
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <NeoButton variant="primary">Primario</NeoButton>
        <NeoButton variant="secondary">Secundario</NeoButton>
        <NeoButton variant="outline">Outline</NeoButton>
        <NeoButton variant="ghost">Ghost</NeoButton>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Todas las variantes disponibles en una vista comparativa.'
      }
    }
  }
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <NeoButton variant="primary" icon={<Star className="h-4 w-4" />}>
        Favorito
      </NeoButton>
      <NeoButton variant="secondary" icon={<Heart className="h-4 w-4" />}>
        Me Gusta
      </NeoButton>
      <NeoButton variant="outline" icon={<Download className="h-4 w-4" />}>
        Descargar
      </NeoButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Botones con diferentes iconos para diferentes acciones.'
      }
    }
  }
}

export const FullWidth: Story = {
  args: {
    children: 'Ancho Completo',
    variant: 'primary',
    fullWidth: true
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    )
  ],
  parameters: {
    docs: {
      description: {
        story: 'Botón que ocupa todo el ancho disponible de su contenedor.'
      }
    }
  }
}

export const DarkMode: Story = {
  args: {
    children: 'Modo Oscuro',
    variant: 'primary'
  },
  decorators: [
    (Story) => (
      <div className="dark bg-[#0a0a0a] p-8 rounded-lg">
        <Story />
      </div>
    )
  ],
  parameters: {
    docs: {
      description: {
        story: 'Botón en modo oscuro con los colores apropiados.'
      }
    }
  }
}

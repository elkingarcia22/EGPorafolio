import type { Meta, StoryObj } from '@storybook/react'
import { NeoButton } from '../components/ui/neo-button'

const meta: Meta<typeof NeoButton> = {
  title: 'Components/NeoButton',
  component: NeoButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Botón con estilo neuromórfico minimalista.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Contenido del botón'
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary'],
      description: 'Variante del botón'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño del botón'
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado'
    },
    onClick: {
      action: 'clicked',
      description: 'Función de click'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Botón por defecto',
    variant: 'default',
    size: 'md',
    disabled: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón con estilo por defecto.'
      }
    }
  }
}

export const Primary: Story = {
  args: {
    children: 'Botón primario',
    variant: 'primary',
    size: 'md',
    disabled: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón con variante primaria.'
      }
    }
  }
}

export const Secondary: Story = {
  args: {
    children: 'Botón secundario',
    variant: 'secondary',
    size: 'md',
    disabled: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón con variante secundaria.'
      }
    }
  }
}

export const Small: Story = {
  args: {
    children: 'Pequeño',
    variant: 'default',
    size: 'sm',
    disabled: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón de tamaño pequeño.'
      }
    }
  }
}

export const Large: Story = {
  args: {
    children: 'Botón grande',
    variant: 'default',
    size: 'lg',
    disabled: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón de tamaño grande.'
      }
    }
  }
}

export const Disabled: Story = {
  args: {
    children: 'Botón deshabilitado',
    variant: 'default',
    size: 'md',
    disabled: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Botón en estado deshabilitado.'
      }
    }
  }
}
/**
 * Design Tokens - Sistema de diseño consistente
 * Define todos los valores de diseño reutilizables del portafolio
 */

// Función para procesar el CSS del gradiente
const processGradient = (gradientCss?: string) => {
  if (!gradientCss || gradientCss.trim() === '') {
    return 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)'
  }
  
  let processedGradient = gradientCss
  
  // Remover "background:" duplicado al inicio
  processedGradient = processedGradient.replace(/^background:\s*/, '')
  
  // Si contiene múltiples declaraciones background, buscar la mejor
  if (processedGradient.includes(';')) {
    const declarations = processedGradient.split(';').map(d => d.trim()).filter(d => d)
    
    // Priorizar linear-gradient sobre -webkit-linear-gradient
    const standardGradient = declarations.find(d => d.includes('linear-gradient') && !d.includes('-webkit-'))
    const webkitGradient = declarations.find(d => d.includes('-webkit-linear-gradient'))
    const radialGradient = declarations.find(d => d.includes('radial-gradient'))
    
    if (standardGradient) {
      processedGradient = standardGradient
    } else if (webkitGradient) {
      // Convertir -webkit-linear-gradient a linear-gradient
      processedGradient = webkitGradient.replace('-webkit-linear-gradient', 'linear-gradient')
    } else if (radialGradient) {
      processedGradient = radialGradient
    } else {
      processedGradient = declarations[0]
    }
  }
  
  // Remover "background:" si está presente en cualquier parte
  processedGradient = processedGradient.replace(/background:\s*/g, '')
  
  // Limpiar espacios y caracteres extra
  processedGradient = processedGradient.trim()
  
  // Si no es un gradiente válido, usar fallback
  if (!processedGradient.includes('gradient')) {
    return 'linear-gradient(135deg, #16A2FF 0%, #35D07F 100%)'
  }
  
  return processedGradient
}

// Función para obtener design tokens dinámicos
export const getDesignTokens = (currentGradient?: string) => ({
  // Colores
  colors: {
    // Gradiente principal
    primary: {
      gradient: processGradient(currentGradient),
      blue: '#16A2FF',
      green: '#35D07F',
    },
    
    // Colores de texto
    text: {
      primary: '#374151', // gray-700
      secondary: '#6B7280', // gray-500
      tertiary: '#9CA3AF', // gray-400
      white: '#FFFFFF',
      dark: '#111827', // gray-900
    },
    
    // Colores de fondo
    background: {
      light: '#FFFFFF',
      dark: '#0A0A0A',
      gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
      }
    },
    
    // Estados
    state: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    }
  },

  // Tipografía
  typography: {
    // Familias de fuentes
    fontFamily: {
      sans: 'system-ui, -apple-system, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, monospace',
    },
    
    // Tamaños de fuente
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
      '7xl': '4.5rem',  // 72px
    },
    
    // Pesos de fuente
    fontWeight: {
      thin: '100',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    
    // Alturas de línea
    lineHeight: {
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    }
  },

  // Espaciado
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
    40: '10rem',    // 160px
    48: '12rem',    // 192px
    56: '14rem',    // 224px
    64: '16rem',    // 256px
  },

  // Bordes
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Sombras
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
  },

  // Transiciones
  transition: {
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    timing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-index
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  }
} as const)

// Design tokens estáticos para compatibilidad
export const designTokens = getDesignTokens()

// Tipos TypeScript para los tokens
export type DesignTokens = ReturnType<typeof getDesignTokens>
export type ColorToken = keyof ReturnType<typeof getDesignTokens>['colors']
export type TypographyToken = keyof ReturnType<typeof getDesignTokens>['typography']
export type SpacingToken = keyof ReturnType<typeof getDesignTokens>['spacing']

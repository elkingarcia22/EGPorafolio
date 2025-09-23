'use client'

import { useColors } from '@/contexts/colors-context'
import { getDesignTokens } from '@/lib/design-tokens'

/**
 * Hook personalizado para obtener design tokens dinámicos
 * Incluye el gradiente actual del contexto de colores
 */
export const useDesignTokens = () => {
  const { currentGradient } = useColors()
  const tokens = getDesignTokens(currentGradient)
  return tokens
}

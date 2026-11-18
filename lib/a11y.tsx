'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { readStored, writeStored } from './storage'

export type TextSize = 'base' | 'lg' | 'xl'
export type MotionPref = 'auto' | 'reduced' | 'full'

export interface A11ySettings {
  text: TextSize
  highContrast: boolean
  motion: MotionPref
  underlineLinks: boolean
}

interface A11yContextValue {
  settings: A11ySettings
  update: (patch: Partial<A11ySettings>) => void
  reset: () => void
  /** true cuando hay que evitar animaciones (preferencia del sistema o del panel) */
  reducedMotion: boolean
}

const STORAGE_KEY = 'eg.a11y'
const DEFAULTS: A11ySettings = {
  text: 'base',
  highContrast: false,
  motion: 'auto',
  underlineLinks: false,
}

const A11yContext = createContext<A11yContextValue | null>(null)

function parseSettings(raw: string | null): A11ySettings {
  if (!raw) return DEFAULTS
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return DEFAULTS
    const p = parsed as Partial<A11ySettings>
    return {
      text: p.text === 'lg' || p.text === 'xl' ? p.text : 'base',
      highContrast: p.highContrast === true,
      motion: p.motion === 'reduced' || p.motion === 'full' ? p.motion : 'auto',
      underlineLinks: p.underlineLinks === true,
    }
  } catch {
    return DEFAULTS
  }
}

function useSystemReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return reduced
}

export function A11yProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<A11ySettings>(DEFAULTS)
  const systemReduced = useSystemReducedMotion()

  useEffect(() => {
    setSettings(parseSettings(readStored(STORAGE_KEY)))
  }, [])

  const reducedMotion =
    settings.motion === 'reduced' || (settings.motion === 'auto' && systemReduced)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.text = settings.text
    root.dataset.contrast = settings.highContrast ? 'high' : 'normal'
    root.dataset.links = settings.underlineLinks ? 'underline' : 'auto'
    root.dataset.motion = reducedMotion ? 'reduced' : 'full'
  }, [settings, reducedMotion])

  const update = useCallback((patch: Partial<A11ySettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      writeStored(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setSettings(DEFAULTS)
    writeStored(STORAGE_KEY, JSON.stringify(DEFAULTS))
  }, [])

  const value = useMemo(
    () => ({ settings, update, reset, reducedMotion }),
    [settings, update, reset, reducedMotion],
  )

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>
}

export function useA11y(): A11yContextValue {
  const ctx = useContext(A11yContext)
  if (!ctx) throw new Error('useA11y debe usarse dentro de <A11yProvider>')
  return ctx
}

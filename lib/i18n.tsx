'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { readStored, writeStored } from './storage'

export type Locale = 'es' | 'en'
/** Texto bilingüe. Todo el contenido del sitio usa este formato. */
export type L = Readonly<Record<Locale, string>>

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (text: L) => string
}

const STORAGE_KEY = 'eg.locale'
const LocaleContext = createContext<LocaleContextValue | null>(null)

function isLocale(value: unknown): value is Locale {
  return value === 'es' || value === 'en'
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es')

  useEffect(() => {
    const stored = readStored(STORAGE_KEY)
    if (isLocale(stored)) setLocaleState(stored)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    writeStored(STORAGE_KEY, next)
  }, [])

  const t = useCallback((text: L) => text[locale], [locale])
  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale debe usarse dentro de <LocaleProvider>')
  return ctx
}

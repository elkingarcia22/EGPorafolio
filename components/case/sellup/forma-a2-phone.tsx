'use client'

import { useEffect, useRef } from 'react'
import { Loader2, PhoneCall } from 'lucide-react'
import { useA11y } from '@/lib/a11y'

/**
 * «Revelar teléfono» con efecto de descifrado: los dígitos se barajan mientras
 * consulta Apollo y luego Lusha, y se fijan uno a uno al final. Escribe en el DOM
 * con requestAnimationFrame (sin re-render por cuadro).
 */

export type A2Phone = 'idle' | 'apollo' | 'lusha' | 'done'

const NUMBER = '+52 55 4821 0937'
const DIGITS = '0123456789'

function useScramble(state: A2Phone, reduced: boolean) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (state === 'idle') {
      el.textContent = NUMBER.replace(/\d/g, '•')
      return
    }
    if (reduced) {
      el.textContent = state === 'done' ? NUMBER : NUMBER.replace(/\d/g, '•')
      return
    }
    if (state === 'done') {
      // al terminar, los dígitos se fijan de izquierda a derecha
      let fixed = 0
      let raf = 0
      let last = 0
      const settle = (now: number) => {
        if (now - last > 28) {
          last = now
          fixed += 1
          el.textContent = NUMBER.split('').map((c, i) => (i < fixed || !/\d/.test(c) ? c : DIGITS[Math.floor(Math.random() * 10)])).join('')
        }
        if (fixed < NUMBER.length) raf = requestAnimationFrame(settle)
      }
      raf = requestAnimationFrame(settle)
      return () => cancelAnimationFrame(raf)
    }
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      if (now - last > 45) {
        last = now
        el.textContent = NUMBER.replace(/\d/g, () => DIGITS[Math.floor(Math.random() * 10)])
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [state, reduced])
  return ref
}

/** Tarjeta que reemplaza al botón «Revelar teléfono» del detalle. */
export function PhoneDecoder({ state, pressed }: { state: A2Phone; pressed: boolean }) {
  const { reducedMotion } = useA11y()
  const ref = useScramble(state, reducedMotion)
  const done = state === 'done'
  return (
    <div
      className="rounded-lg border px-3 py-2 font-[Inter,ui-sans-serif,system-ui] transition-all duration-300"
      style={{
        borderColor: done ? 'rgba(16,185,129,0.5)' : state === 'idle' ? 'transparent' : 'rgba(107,140,255,0.55)',
        background: done ? '#10261f' : state === 'idle' ? '#6b8cff' : '#18203a',
        minWidth: state === 'idle' ? undefined : 270,
        transform: pressed ? 'scale(0.95)' : 'none',
        boxShadow: state === 'apollo' || state === 'lusha' ? '0 0 0 4px rgba(107,140,255,0.18), 0 0 28px rgba(126,43,224,0.45)' : 'none',
      }}
    >
      {state === 'idle' ? (
        <span className="flex items-center gap-2 text-[13px] font-medium text-[#0a0a0a]"><PhoneCall className="h-3.5 w-3.5" />Revelar teléfono</span>
      ) : (
        <>
          <span className={`flex items-center gap-1.5 text-[11.5px] ${done ? 'text-emerald-300' : 'text-[#9db0ff]'}`}>
            {!done && <Loader2 className="h-3 w-3 animate-spin" />}
            {state === 'apollo' ? 'Consultando Apollo…' : state === 'lusha' ? 'Apollo sin número · probando Lusha…' : 'Teléfono · Lusha · 1 crédito'}
          </span>
          <span ref={ref} className="mt-0.5 block font-mono text-[15px] tabular-nums tracking-wide text-white" />
        </>
      )}
    </div>
  )
}

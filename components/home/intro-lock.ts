/** Teclas que desplazan la página */
const SCROLL_KEYS = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Spacebar'])

let locked = false
/** Posición en la que debe quedarse la página mientras nadie la mueve a propósito */
let expected = 0
/** Hasta cuándo (performance.now) la entrada automática está moviendo la página */
let drivingUntil = 0
/** Margen para que el último cuadro de la bajada automática no cuente como scroll propio */
const SETTLE_MS = 120

/** Si la página se movió por otra vía (barra, teclado, gesto), vuelve a donde estaba. */
const holdPosition = () => {
  if (performance.now() < drivingUntil) {
    expected = window.scrollY
    return
  }
  if (Math.abs(window.scrollY - expected) > 2) window.scrollTo(0, expected)
}

const block = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
}
const blockKeys = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement | null
  // En campos de texto las teclas siguen funcionando.
  if (target?.closest('input, textarea, [contenteditable="true"]')) return
  if (SCROLL_KEYS.has(event.key)) block(event)
}

/**
 * Bloqueo del scroll durante la primera entrada (carga → titular → EG → firma):
 * la rueda, el gesto táctil y las teclas no mueven la página; solo la entrada
 * automática la desplaza. Se escucha en captura sobre la ventana para que Lenis
 * no reciba esos eventos. No se usa `lenis.stop()`: pone `overflow: hidden` en
 * la página y el hero fijado (sticky) deja de quedarse en pantalla. Además, si
 * la página se mueve por cualquier otra vía (barra de scroll, teclado, gesto),
 * vuelve a su lugar; solo la entrada automática (`drive`) la puede mover.
 */
export const introLock = {
  lock(): void {
    if (locked) return
    locked = true
    expected = window.scrollY
    window.addEventListener('scroll', holdPosition, { passive: true })
    window.addEventListener('wheel', block, { capture: true, passive: false })
    window.addEventListener('touchmove', block, { capture: true, passive: false })
    window.addEventListener('keydown', blockKeys, { capture: true })
  },
  unlock(): void {
    if (!locked) return
    locked = false
    window.removeEventListener('scroll', holdPosition)
    window.removeEventListener('wheel', block, { capture: true })
    window.removeEventListener('touchmove', block, { capture: true })
    window.removeEventListener('keydown', blockKeys, { capture: true })
  },
  isLocked(): boolean {
    return locked
  },
  /** La entrada automática va a mover la página durante `durationMs`. */
  drive(durationMs: number): void {
    drivingUntil = performance.now() + durationMs + SETTLE_MS
  },
}

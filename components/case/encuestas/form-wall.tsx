'use client'

import Image from 'next/image'
import { useLocale } from '@/lib/i18n'
import { SHOTS, type ShotKey } from '@/lib/content/cases/encuestas/case'

const ROWS: readonly { keys: readonly ShotKey[]; dir: 'fwd' | 'rev'; dur: string }[] = [
  { keys: ['lista', 'crear', 'secciones', 'banco', 'bienvenida', 'previewBienvenida', 'previewPreguntas', 'plantillas'], dir: 'fwd', dur: '110s' },
  { keys: ['heatmap', 'favorabilidad', 'enps', 'ia', 'accionables', 'comentarios', 'participacion', 'comparativo'], dir: 'rev', dur: '95s' },
  { keys: ['cargarAnaliza', 'general', 'cargarDatos', 'demograficos', 'cargarEstructura', 'participantes', 'previewFinal', 'descargas'], dir: 'fwd', dur: '125s' },
]

function Tile({ k, hidden }: { k: ShotKey; hidden: boolean }) {
  const { t } = useLocale()
  const s = SHOTS[k]
  return (
    <figure className="w-[11rem] shrink-0 overflow-hidden rounded-lg bg-white shadow-[0_24px_50px_-24px_rgba(10,11,13,0.6)] ring-1 ring-black/10 sm:w-[20rem]" aria-hidden={hidden}>
      <Image src={s.src} width={s.width} height={s.height} alt={hidden ? '' : t(s.alt)} sizes="(min-width: 640px) 320px, 176px" className="block h-auto w-full" />
    </figure>
  )
}

/** El producto entero de un vistazo: tres filas de pantallas reales que se cruzan despacio. */
export function ScreensWall() {
  const { t } = useLocale()
  return (
    <figure data-reveal className="encf-wall relative -mx-[var(--gutter)] overflow-hidden py-6 md:mx-0 md:rounded-3xl md:bg-fg/[0.05]">
      <div className="[perspective:1600px]">
        <div className="space-y-5 [transform:rotateX(14deg)_rotateZ(-5deg)_scale(1.12)]">
          {ROWS.map((row, i) => (
            <div key={i} className="encf-row" data-dir={row.dir} style={{ ['--encf-dur' as string]: row.dur }}>
              {[...row.keys, ...row.keys].map((k, j) => (
                <Tile key={`${k}-${j}`} k={k} hidden={j >= row.keys.length} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(var(--bg))_0%,transparent_14%,transparent_86%,rgb(var(--bg))_100%)]" aria-hidden="true" />
      <figcaption className="relative mt-6 px-[var(--gutter)] text-center font-mono text-[11px] uppercase tracking-[0.14em] opacity-60 md:px-0">
        {t({ es: '25 pantallas reales del prototipo · pasa el cursor para detener', en: '25 real prototype screens · hover to pause' })}
      </figcaption>
    </figure>
  )
}

'use client'

import { useCallback, useRef, useState } from 'react'
import { MockScreen } from '@/components/mock/mock-screen'
import { useLocale } from '@/lib/i18n'
import { COPY } from '@/lib/content/copy'
import type { Project } from '@/lib/content/projects'


/** 05 · Forma: comparador wireframe ↔ interfaz final (arrastre o teclado). */
export function FormCompare({ project }: { project: Project }) {
  const { t } = useLocale()
  const [split, setSplit] = useState(50)
  const frameRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updateFromPointer = useCallback((clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = ((clientX - rect.left) / rect.width) * 100
    setSplit(Math.max(0, Math.min(100, pct)))
  }, [])

  const isMobile = project.mock === 'mobile'

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <span className="mono-label opacity-60">← {t(COPY.case.wire)}</span>
        <span className="mono-label opacity-40">{t(COPY.case.drag)}</span>
        <span className="mono-label opacity-60">{t(COPY.case.ui)} →</span>
      </div>

      <div className={isMobile ? 'mx-auto max-w-xs' : ''}>
        <div
          ref={frameRef}
          className="relative touch-none select-none overflow-hidden shadow-2xl ring-1 ring-fg/10"
          data-cursor="↔"
          onPointerDown={(e) => {
            dragging.current = true
            e.currentTarget.setPointerCapture(e.pointerId)
            updateFromPointer(e.clientX)
          }}
          onPointerMove={(e) => dragging.current && updateFromPointer(e.clientX)}
          onPointerUp={() => {
            dragging.current = false
          }}
        >
          <MockScreen kind={project.mock} mode="ui" accent={project.accent} />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
            <MockScreen kind={project.mock} mode="wire" accent={project.accent} className="h-full" />
          </div>
          <div className="absolute inset-y-0 w-0.5 bg-signal" style={{ left: `${split}%` }} aria-hidden="true">
            <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-signal text-xs text-paper">
              ↔
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(split)}
            onChange={(e) => setSplit(Number(e.target.value))}
            aria-label={`${t(COPY.case.wire)} / ${t(COPY.case.ui)}`}
            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>
      </div>
      <p className="max-w-2xl leading-relaxed opacity-75">{t(project.form.caption)}</p>
    </div>
  )
}

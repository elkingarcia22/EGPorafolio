'use client'

import { useLocale, type L } from '@/lib/i18n'
import { SHOTS } from '@/lib/content/cases/encuestas/case'
import { LiveBuilder } from './form-builder'
import { ResultsTabs, StepperShots, UploadPipeline } from './form-flows'
import { FAV, Lock, Screen } from './shared'

const ROUTE = '/admin/desempeno-cultura/encuestas'

function Part({ index, title, lead, children }: { index: string; title: L; lead: L; children: React.ReactNode }) {
  const { t } = useLocale()
  return (
    <section className="border-t border-fg/15 pt-10">
      <div className="mb-8 grid gap-4 lg:grid-cols-12">
        <p data-reveal className="mono-label text-signal lg:col-span-3">{index}</p>
        <div className="lg:col-span-9">
          <h3 data-reveal="mask" className="text-[clamp(1.5rem,1rem+1.4vw,2.2rem)] font-light leading-tight">{t(title)}</h3>
          <p data-reveal className="mt-3 max-w-[60ch] leading-relaxed opacity-75">{t(lead)}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

const HOME_NOTES: readonly L[] = [
  { es: 'Cinco atajos para crear, con NOM 035 primero: es la que más preguntan los clientes de México.', en: 'Five create shortcuts, NOM 035 first: it’s what customers in Mexico ask for most.' },
  { es: '«Para atender» ordena por riesgo lo que necesita una acción hoy, y cada riesgo trae su botón.', en: '“To address” ranks by risk what needs action today, and each risk brings its button.' },
  { es: 'Las tarjetas y la tabla no pueden contar historias distintas: cada métrica es exactamente un filtro de la lista.', en: 'Cards and table can’t tell different stories: each metric is exactly a list filter.' },
]

const CELL_STATES: readonly { label: L; hint: L; render: React.ReactNode }[] = [
  { label: { es: 'Número con color', en: 'Colored number' }, hint: { es: 'el promedio de 1 a 5 de ese cruce', en: 'that cross’s 1–5 average' }, render: <span className="rounded-md px-2 py-1 font-mono text-sm text-[#14161a]" style={{ background: FAV[3] }}>4,2</span> },
  { label: { es: 'Número gris', en: 'Grey number' }, hint: { es: 'fuera de las bandas resaltadas', en: 'outside highlighted bands' }, render: <span className="rounded-md bg-fg/10 px-2 py-1 font-mono text-sm opacity-60">3,4</span> },
  { label: { es: 'Reservado', en: 'Reserved' }, hint: { es: 'tiene respuestas, pero no llega al mínimo', en: 'has answers, but below the minimum' }, render: <span className="rounded-md bg-fg/10 px-2 py-1.5 opacity-70"><Lock className="h-4 w-4" /></span> },
  { label: { es: 'Sin respuestas', en: 'No answers' }, hint: { es: 'nadie de ese grupo ha respondido', en: 'nobody in that group has answered' }, render: <span className="font-mono text-lg opacity-50">—</span> },
  { label: { es: 'Sin escala', en: 'No scale' }, hint: { es: 'abierta u opciones: no hay nada de 1 a 5', en: 'open or options: nothing on 1–5' }, render: <span className="text-lg opacity-60">💬</span> },
  { label: { es: 'Nivel oculto', en: 'Hidden level' }, hint: { es: 'ese nivel está apagado en «Niveles»', en: 'that level is off in “Levels”' }, render: <span className="inline-block h-7 w-10 rounded-md border border-dashed border-fg/30" /> },
]

/** 05 · Forma: el producto completo, de la lista a la acción, con piezas para tocar y capturas reales. */
export function SurveyForm() {
  const { t } = useLocale()
  return (
    <div className="space-y-24">
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">
        {t({ es: 'Seis superficies, una sola encuesta por debajo: el mismo borrador alimenta la vista previa, los resultados y cada archivo descargable, así que ninguna pantalla puede contradecir a otra. Todas las capturas son del prototipo real, corriendo en local.', en: 'Six surfaces, a single survey underneath: the same draft feeds the preview, the results and every downloadable file, so no screen can contradict another. Every screenshot is from the real prototype, running locally.' })}
      </p>

      <Part index="5.1 · Inicio" title={{ es: 'Lo primero que ves es lo que necesita atención', en: 'The first thing you see is what needs attention' }} lead={{ es: 'La lista dejó de ser un archivo de encuestas y pasó a ser una bandeja de trabajo.', en: 'The list stopped being a survey archive and became a work inbox.' }}>
        <div className="grid gap-8 lg:grid-cols-12">
          <div data-reveal="device" className="lg:col-span-8">
            <Screen shot={SHOTS.lista} route={ROUTE} />
          </div>
          <ol className="space-y-6 lg:col-span-4">
            {HOME_NOTES.map((n, i) => (
              <li key={n.es} data-reveal="right" className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-signal font-mono text-[11px] text-paper">{i + 1}</span>
                <p className="leading-relaxed opacity-80">{t(n)}</p>
              </li>
            ))}
          </ol>
        </div>
      </Part>

      <Part index="5.2 · Crear" title={{ es: 'Cinco pasos con un candado real', en: 'Five steps with a real lock' }} lead={{ es: 'Toca cada paso. El orden no es decoración: decide qué se puede preguntar.', en: 'Tap each step. The order isn’t decoration: it decides what can be asked.' }}>
        <StepperShots />
      </Part>

      <Part index="5.3 · Secciones" title={{ es: 'Un árbol que se ordena solo', en: 'A tree that orders itself' }} lead={{ es: 'Pruébalo: agrega una subsección dentro de «Confianza» y mira el tope de tres niveles; borra una sección con contenido y te dice qué se lleva; deja una vacía y el resumen no te deja seguir.', en: 'Try it: add a subsection inside “Trust” and hit the three-level cap; delete a section with content and it tells you what goes with it; leave one empty and the summary won’t let you continue.' }}>
        <div data-reveal>
          <LiveBuilder />
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div data-reveal="device">
            <Screen shot={SHOTS.banco} route={`${ROUTE}/crear`} sizes="(min-width: 768px) 35vw, 100vw" />
            <p className="mt-3 text-sm opacity-70">{t({ es: 'Banco de preguntas: por tipo y por sección, se marca una pregunta o la sección entera.', en: 'Question bank: by type and section, pick one question or the whole section.' })}</p>
          </div>
          <div data-reveal="device">
            <Screen shot={SHOTS.plantillas} route={ROUTE} sizes="(min-width: 768px) 35vw, 100vw" />
            <p className="mt-3 text-sm opacity-70">{t({ es: 'Plantillas: Cultura y Clima en versión corta (30) o completa (50). La completa es la corta más preguntas, para comparar año a año.', en: 'Templates: Culture and Climate in short (30) or full (50). The full one is the short one plus questions, to compare year over year.' })}</p>
          </div>
        </div>
      </Part>

      <Part index="5.4 · Histórico" title={{ es: 'Traer lo que se midió por fuera', en: 'Bring in what was measured elsewhere' }} lead={{ es: 'La primera medición en UBITS no tiene con qué compararse si no llega su historia. La carga lee el archivo, propone y deja que la persona confirme; luego sigue en segundo plano.', en: 'The first UBITS measurement has nothing to compare against unless its history arrives. The upload reads the file, proposes and lets a person confirm; then it continues in the background.' }}>
        <UploadPipeline />
      </Part>

      <Part index="5.5 · Responder" title={{ es: 'La pantalla que no existía', en: 'The screen that didn’t exist' }} lead={{ es: 'Responder no tenía ni historia de usuario. La vista previa es el ensayo de esa experiencia: la promesa de privacidad dicha al empezar, una página por subsección y el avance siempre a la vista.', en: 'Answering didn’t even have a user story. The preview rehearses that experience: the privacy promise stated up front, one page per subsection and progress always in view.' }}>
        <div className="relative pb-[12%]">
          <div data-reveal="device" className="relative z-10 w-[78%]">
            <Screen shot={SHOTS.previewBienvenida} route="/encuesta/clima-q1-2026" sizes="(min-width: 1024px) 50vw, 90vw" />
          </div>
          <div data-reveal="device" className="absolute right-0 top-[22%] z-20 w-[62%]">
            <Screen shot={SHOTS.previewPreguntas} route="/encuesta/clima-q1-2026/1.1" sizes="(min-width: 1024px) 40vw, 70vw" />
          </div>
        </div>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { es: 'Cada pregunta Likert va en su tarjeta, con su escala completa: se lee y se contesta mejor que una fila de tabla.', en: 'Each Likert question gets its own card with the full scale: it reads and answers better than a table row.' },
            { es: 'El índice de la derecha dice cuánto falta por sección; con más de 14 páginas los puntitos pasan a «Página 7 de 22».', en: 'The right index shows what’s left per section; past 14 pages the dots become “Page 7 of 22”.' },
            { es: 'No se avanza con obligatorias sin responder, y la última página dice «Enviar y finalizar», no «Siguiente».', en: 'You can’t advance with required questions unanswered, and the last page says “Send and finish”, not “Next”.' },
          ].map((n) => (
            <li key={n.es} data-reveal className="border-t border-fg/15 pt-4 text-sm leading-relaxed opacity-80">{t(n)}</li>
          ))}
        </ul>
      </Part>

      <Part index="5.6 · Resultados" title={{ es: 'Una pregunta por pestaña', en: 'One question per tab' }} lead={{ es: 'El demográfico elegido viaja entre pestañas: pasar de «participación por área» a «mapa de calor por área» es un solo pensamiento.', en: 'The chosen demographic travels across tabs: going from “participation by area” to “heatmap by area” is a single thought.' }}>
        <ResultsTabs />
        <p data-reveal className="mono-label mb-5 mt-14 opacity-60">{t({ es: 'Los seis estados de una celda del mapa de calor', en: 'The six states of a heatmap cell' })}</p>
        <ul className="grid gap-px overflow-hidden border border-fg/15 bg-fg/15 sm:grid-cols-2 lg:grid-cols-3">
          {CELL_STATES.map((s) => (
            <li key={s.label.es} data-reveal className="flex items-center gap-4 bg-bg p-5">
              <span className="flex w-14 shrink-0 justify-center" aria-hidden="true">{s.render}</span>
              <span>
                <span className="block text-sm font-medium">{t(s.label)}</span>
                <span className="block text-xs opacity-60">{t(s.hint)}</span>
              </span>
            </li>
          ))}
        </ul>
      </Part>
    </div>
  )
}

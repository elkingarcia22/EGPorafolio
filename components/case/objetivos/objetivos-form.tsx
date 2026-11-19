'use client'

import { useLocale } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { Block, Body, SubHead } from '@/components/case/barberlytics/ui'
import { AlignmentMap } from './alignment-map'
import { CycleReading } from './forma-lectura'
import { PlaygroundReel } from './playground-reel'

/** 05 · La forma: el producto construido, en capturas reales del playground. */
export function ObjetivosForm() {
  const { t } = useLocale()
  const { form } = OBJ_CASE
  return (
    <div>
      <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">{t(form.lead)}</p>

      <Block className="!mt-12">
        <SubHead index="5.1">{t({ es: 'Leer un ciclo en cinco preguntas', en: 'Reading a cycle in five questions' })}</SubHead>
        <Body className="mb-8">{t({ es: 'Resultados no es un tablero de cifras sueltas: está ordenado por las preguntas que se hace quien administra. Cada pregunta enciende su bloque real, con su gráfico y las cifras de un ciclo del staging. Avanza solo o toca un número.', en: 'Results isn’t a board of loose figures: it’s ordered by the questions an admin asks. Each question lights up its real block, with its chart and the figures of a staging cycle. It advances on its own, or tap a number.' })}</Body>
        <CycleReading />
      </Block>

      <Block>
        <SubHead index="5.2">{t({ es: 'El mapa de alineación', en: 'The alignment map' })}</SubHead>
        <Body className="mb-8">{t({ es: 'El mismo mapa de la pestaña Alineación, con su geometría y sus cifras: cada área fluye hacia el objetivo de empresa que empuja. Los flujos crecen al aparecer y el recorrido enciende un objetivo a la vez; pasa por un área para ver a qué aporta.', en: 'The same map from the Alignment tab, with its geometry and figures: each area flows into the company goal it pushes. Flows grow in as it appears and the tour lights one goal at a time; hover an area to see what it feeds.' })}</Body>
        <AlignmentMap />
      </Block>

      <Block>
        <SubHead index="5.3">{t({ es: 'Y así se ve en el playground', en: 'And this is how it looks in the playground' })}</SubHead>
        <Body className="mb-8">{t({ es: 'Las páginas reales, enteras y a su resolución: cada una baja sola dentro del navegador y el minimapa marca por dónde va.', en: 'The real pages, whole and at their own resolution: each scrolls on its own inside the browser and the minimap shows where it is.' })}</Body>
        <PlaygroundReel />
      </Block>
    </div>
  )
}

'use client'

import { useLocale } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { Block, Body, SubHead } from '@/components/case/barberlytics/ui'
import { AlignmentBuilder } from './alignment-builder'
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
        <SubHead index="5.2">{t({ es: 'Alinear: el último paso de crear un ciclo', en: 'Align: the last step of creating a cycle' })}</SubHead>
        <Body className="mb-8">{t({ es: 'Antes de publicar, cada meta asignada se conecta con el objetivo de empresa al que empuja: se arrastra su punto azul y el contador sube hasta «3 de 3 alineados · 100 %». Son las tarjetas del ciclo «KPIs corporativos 2026» del staging. Pruébalo: arrastra un punto o toca una flecha para cortarla.', en: 'Before publishing, each assigned goal is connected to the company goal it pushes: you drag its blue dot and the counter climbs to “3 of 3 aligned · 100 %”. These are the cards of the “KPIs corporativos 2026” cycle on staging. Try it: drag a dot or tap an arrow to cut it.' })}</Body>
        <AlignmentBuilder />
      </Block>

      <Block>
        <SubHead index="5.3">{t({ es: 'Y así se ve en el playground', en: 'And this is how it looks in the playground' })}</SubHead>
        <Body className="mb-8">{t({ es: 'Las páginas reales, enteras y a su resolución: cada una baja sola dentro del navegador y el minimapa marca por dónde va.', en: 'The real pages, whole and at their own resolution: each scrolls on its own inside the browser and the minimap shows where it is.' })}</Body>
        <PlaygroundReel />
      </Block>
    </div>
  )
}

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
        <Body className="mb-8">{t({ es: 'Resultados no es un tablero de cifras sueltas: está ordenado por las preguntas que se hace quien administra. Cada pregunta enciende su bloque real, con su gráfico y las cifras de un ciclo de prueba. Avanza solo o toca un número.', en: 'Results isn’t a board of loose figures: it’s ordered by the questions an admin asks. Each question lights up its real block, with its chart and the figures of a test cycle. It advances on its own, or tap a number.' })}</Body>
        <CycleReading />
      </Block>

      <Block>
        <SubHead index="5.2">{t({ es: 'Alinear: el último paso de crear un ciclo', en: 'Align: the last step of creating a cycle' })}</SubHead>
        <Body className="mb-8">{t({ es: 'Antes de publicar, el último paso conecta lo asignado con la estrategia. La vista «Colaboradores» lo muestra en cascada: cada persona aporta a su grupo y cada grupo a los objetivos de empresa. La cámara arranca en una tarjeta y se aleja hasta ver todo el ciclo, con las personas, áreas y aportes de un ciclo de prueba.', en: 'Before publishing, the last step connects what was assigned with strategy. The “Collaborators” view shows it as a cascade: each person feeds their group and each group the company goals. The camera starts on one card and pulls back to the whole cycle, with the real people, areas and contributions from a test cycle.' })}</Body>
        <AlignmentBuilder />
      </Block>

      <Block>
        <SubHead index="5.3">{t({ es: 'Y así se ve el producto construido', en: 'And this is the built product' })}</SubHead>
        <Body className="mb-8">{t({ es: 'Las páginas reales, enteras y a su resolución: cada una baja sola dentro del navegador y el minimapa marca por dónde va.', en: 'The real pages, whole and at their own resolution: each scrolls on its own inside the browser and the minimap shows where it is.' })}</Body>
        <PlaygroundReel />
      </Block>
    </div>
  )
}

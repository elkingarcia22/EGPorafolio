'use client'

import { useLocale } from '@/lib/i18n'
import { LiveBuilder } from './form-builder'
import { ResultsCollage } from './form-collage'
import { HeatmapReal } from './form-heatmap'
import { BrowserFrame, Moment } from './form-moments'
import { TemplatesFan } from './form-fan'
import { PhoneAnswer } from './form-answer'
import { ProductTour } from './form-tour'
import './form.css'

const ROUTE = '/admin/desempeno-cultura/encuestas'

/** 05 · Forma: el producto entero en movimiento y, después, los seis momentos que lo hacen ganar. */
export function SurveyForm() {
  const { t } = useLocale()
  return (
    <div className="space-y-24 md:space-y-32">
      <div className="space-y-10">
        <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">
          {t({ es: 'Seis superficies, una sola encuesta por debajo: el mismo borrador alimenta la vista previa, los resultados y cada archivo descargable, así que ninguna pantalla puede contradecir a otra. Primero un recorrido por el producto real; después, los momentos que lo hacen distinto.', en: 'Six surfaces, a single survey underneath: the same draft feeds the preview, the results and every downloadable file, so no screen can contradict another. First a tour of the real product; then the moments that make it different.' })}
        </p>
        <ProductTour />
      </div>

      <Moment
        index={t({ es: 'Momento 01 · Plantillas', en: 'Moment 01 · Templates' })}
        title={{ es: 'Empezar nunca es una hoja en blanco', en: 'Starting is never a blank page' }}
        why={{ es: 'Cinco atajos en la portada, con NOM 035 primero porque es lo que más piden los clientes de México. Cada plantilla trae sus reglas: la de la norma llega de solo lectura y exige participación completa.', en: 'Five shortcuts on the home page, NOM 035 first because it’s what Mexican customers ask for most. Each template carries its rules: the norm’s arrives read-only and requires full participation.' }}
      >
        <TemplatesFan />
      </Moment>

      <Moment
        flip
        index={t({ es: 'Momento 02 · Secciones', en: 'Moment 02 · Sections' })}
        title={{ es: 'Un árbol que se ordena solo', en: 'A tree that orders itself' }}
        why={{ es: 'Pruébalo: agrega una subsección dentro de «Confianza» y choca con el tope de tres niveles; borra una sección con contenido y te dice qué se lleva. La numeración y el tiempo estimado salen solos.', en: 'Try it: add a subsection inside “Trust” and hit the three-level cap; delete a section with content and it tells you what goes with it. Numbering and estimated time update themselves.' }}
      >
        <BrowserFrame route={`${ROUTE}/crear · ${t({ es: 'Secciones y preguntas', en: 'Sections and questions' })}`}>
          <LiveBuilder />
        </BrowserFrame>
      </Moment>

      <Moment
        wide
        index={t({ es: 'Momento 03 · Anonimato', en: 'Moment 03 · Anonymity' })}
        title={{ es: 'La privacidad viaja a cada celda', en: 'Privacy travels to every cell' }}
        why={{ es: 'Un grupo con respuestas pero por debajo del mínimo se ve con candado, nunca con un número, y su ayuda dice por qué. El mínimo arranca en 5 y no baja de 3. Pasa el cursor por la primera fila para ver lo que muestra cada celda.', en: 'A group with answers but below the minimum shows a lock, never a number, and its tooltip says why. The minimum starts at 5 and never goes below 3. Hover the first row to see what each cell shows.' }}
      >
        <HeatmapReal />
      </Moment>

      <Moment
        wide
        index={t({ es: 'Momento 04 · Responder', en: 'Moment 04 · Answering' })}
        title={{ es: 'Terminar se siente como terminar', en: 'Finishing feels like finishing' }}
        why={{ es: 'Responder no tenía ni historia de usuario. Ahora la promesa de privacidad va al empezar, cada subsección es una página, el 0–10 abre una pregunta según la banda elegida y el envío cierra con una celebración, no con un «Enviado».', en: 'Answering didn’t even have a user story. Now the privacy promise comes first, each subsection is a page, the 0–10 opens a follow-up by band, and sending ends in a celebration, not a “Sent”.' }}
      >
        <PhoneAnswer />
      </Moment>

      <Moment
        wide
        index={t({ es: 'Momento 05 · Resultados', en: 'Moment 05 · Results' })}
        title={{ es: 'Todo lo que dice una medición', en: 'Everything a measurement says' }}
        why={{ es: 'Participación, favorabilidad, eNPS, sentimiento de los comentarios, mapa de calor, lecturas de la IA y accionables: cada vista responde una sola pregunta con la gráfica que le sirve. Las cifras son las reales del playground.', en: 'Participation, favorability, eNPS, comment sentiment, heatmap, AI readings and actions: each view answers a single question with the chart that suits it. The figures are the playground’s real ones.' }}
      >
        <ResultsCollage />
      </Moment>
    </div>
  )
}

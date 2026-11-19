'use client'

import { useLocale } from '@/lib/i18n'
import { LiveBuilder } from './form-builder'
import { ResultsTabs, UploadPipeline } from './form-flows'
import { AnonymityHeatmap, BrowserFrame, Moment, TemplatesFan } from './form-moments'
import { PhoneAnswer } from './form-phone'
import { ScreensWall } from './form-wall'
import './form.css'

const ROUTE = '/admin/desempeno-cultura/encuestas'

/** 05 · Forma: el producto entero en movimiento y, después, los seis momentos que lo hacen ganar. */
export function SurveyForm() {
  const { t } = useLocale()
  return (
    <div className="space-y-24 md:space-y-32">
      <div className="space-y-10">
        <p data-reveal className="max-w-[62ch] text-lg leading-relaxed opacity-80">
          {t({ es: 'Seis superficies, una sola encuesta por debajo: el mismo borrador alimenta la vista previa, los resultados y cada archivo descargable, así que ninguna pantalla puede contradecir a otra. Primero el producto entero; después, los momentos que lo hacen distinto.', en: 'Six surfaces, a single survey underneath: the same draft feeds the preview, the results and every downloadable file, so no screen can contradict another. First the whole product; then the moments that make it different.' })}
        </p>
        <ScreensWall />
      </div>

      <Moment
        index={t({ es: 'Momento 01 · Plantillas', en: 'Moment 01 · Templates' })}
        title={{ es: 'Empezar nunca es una hoja en blanco', en: 'Starting is never a blank page' }}
        why={{ es: 'Cinco atajos en la portada, con NOM 035 primero porque es lo que más piden los clientes de México. Cada plantilla trae sus reglas: la de la norma llega de solo lectura y exige participación completa.', en: 'Five shortcuts on the home page, NOM 035 first because it’s what Mexican customers ask for most. Each template carries its rules: the norm’s arrives read-only and requires full participation.' }}
        shot="plantillas"
      >
        <TemplatesFan />
      </Moment>

      <Moment
        flip
        index={t({ es: 'Momento 02 · Secciones', en: 'Moment 02 · Sections' })}
        title={{ es: 'Un árbol que se ordena solo', en: 'A tree that orders itself' }}
        why={{ es: 'Pruébalo: agrega una subsección dentro de «Confianza» y choca con el tope de tres niveles; borra una sección con contenido y te dice qué se lleva. La numeración y el tiempo estimado salen solos.', en: 'Try it: add a subsection inside “Trust” and hit the three-level cap; delete a section with content and it tells you what goes with it. Numbering and estimated time update themselves.' }}
        shot="secciones"
        route={`${ROUTE}/crear`}
      >
        <BrowserFrame route={`${ROUTE}/crear · ${t({ es: 'Secciones y preguntas', en: 'Sections and questions' })}`}>
          <LiveBuilder />
        </BrowserFrame>
      </Moment>

      <Moment
        index={t({ es: 'Momento 03 · Anonimato', en: 'Moment 03 · Anonymity' })}
        title={{ es: 'La privacidad viaja a cada celda', en: 'Privacy travels to every cell' }}
        why={{ es: 'Un grupo con respuestas pero por debajo del mínimo se ve con candado, nunca con un número. El mínimo arranca en 5 y no baja de 3: prueba a moverlo y mira qué áreas se abren.', en: 'A group with answers but below the minimum shows a lock, never a number. The minimum starts at 5 and never goes below 3: move it and watch which areas open.' }}
        shot="heatmap"
        route={`${ROUTE}/open-cultura-ola2-2026/resultados`}
      >
        <AnonymityHeatmap />
      </Moment>

      <Moment
        flip
        index={t({ es: 'Momento 04 · Responder', en: 'Moment 04 · Answering' })}
        title={{ es: 'Terminar se siente como terminar', en: 'Finishing feels like finishing' }}
        why={{ es: 'Responder no tenía ni historia de usuario. Ahora la promesa de privacidad va al empezar, cada subsección es una página, el 0–10 abre una pregunta según la banda elegida y el envío cierra con una celebración, no con un «Enviado».', en: 'Answering didn’t even have a user story. Now the privacy promise comes first, each subsection is a page, the 0–10 opens a follow-up by band, and sending ends in a celebration, not a “Sent”.' }}
        shot="previewFinal"
        route="/encuesta/clima-q1-2026"
      >
        <PhoneAnswer />
      </Moment>

      <Moment
        index={t({ es: 'Momento 05 · Histórico', en: 'Moment 05 · History' })}
        title={{ es: 'Lo que se midió por fuera, adentro en minutos', en: 'What was measured elsewhere, inside in minutes' }}
        why={{ es: 'La IA lee el archivo y propone; la persona confirma. Quien coincide por correo se vincula solo, quien solo coincide por nombre lo decide alguien, y los indicadores salen del mismo archivo.', en: 'AI reads the file and proposes; a person confirms. Matches by email link themselves, name-only matches are decided by someone, and the indicators come from the same file.' }}
        shot="cargarEstructura"
      >
        <UploadPipeline />
      </Moment>

      <Moment
        flip
        index={t({ es: 'Momento 06 · Resultados', en: 'Moment 06 · Results' })}
        title={{ es: 'Una pregunta por pestaña', en: 'One question per tab' }}
        why={{ es: 'Cada vista responde una sola pregunta y la responde con la gráfica que le sirve. El demográfico elegido viaja entre pestañas: de «participación por área» a «mapa por área» es un solo pensamiento.', en: 'Each view answers a single question with the chart that suits it. The chosen demographic travels across tabs: from “participation by area” to “map by area” is a single thought.' }}
        shot="favorabilidad"
        route={`${ROUTE}/c2026-1/resultados`}
      >
        <ResultsTabs />
      </Moment>
    </div>
  )
}

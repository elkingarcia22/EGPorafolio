import type { L } from '@/lib/i18n'

export interface ProcessStage {
  title: L
  body: L
  ai: L
}

/** Las seis etapas con las que se cuenta cada caso (portada y agente). */
export const PROCESS_STAGES: readonly ProcessStage[] = [
  {
    title: { es: 'Los puntos', en: 'The dots' },
    body: { es: 'Escucho el problema sin filtros: entrevistas, datos, soporte. Todavía no hay forma.', en: 'I listen to the problem unfiltered: interviews, data, support. No shape yet.' },
    ai: { es: 'Agrupa cientos de notas en minutos.', en: 'Clusters hundreds of notes in minutes.' },
  },
  {
    title: { es: 'Patrones', en: 'Patterns' },
    body: { es: 'Comparo productos y voces hasta que aparece lo que se repite.', en: 'I compare products and voices until what repeats shows up.' },
    ai: { es: 'Contrasto hipótesis con usuarios sintéticos.', en: 'Stress-tests hypotheses with synthetic users.' },
  },
  {
    title: { es: 'La idea', en: 'The idea' },
    body: { es: 'Una pregunta —¿cómo podríamos…?— y pocos principios que deciden lo demás.', en: 'One question —how might we…?— and a few principles that decide the rest.' },
    ai: { es: 'Busca los casos que rompen cada principio.', en: 'Finds the cases that break each principle.' },
  },
  {
    title: { es: 'Forma', en: 'Form' },
    body: { es: 'Pantallas reales y sistema de diseño. Pruebo rápido y afino lo que funciona.', en: 'Real screens and a design system. I test fast and refine what works.' },
    ai: { es: 'Prototipos en código el mismo día.', en: 'Coded prototypes the same day.' },
  },
  {
    title: { es: 'IA en el proceso', en: 'AI in the process' },
    body: { es: 'Si el producto lleva IA, también se diseña cómo piensa: reglas, límites y evaluaciones.', en: 'If the product carries AI, how it thinks is designed too: rules, limits and evaluations.' },
    ai: { es: 'Evaluaciones que corren contra el modelo real.', en: 'Evaluations that run against the real model.' },
  },
  {
    title: { es: 'Impacto', en: 'Impact' },
    body: { es: 'Sale al mundo y se mide: adopción, uso y resultados.', en: 'It ships and gets measured: adoption, usage and outcomes.' },
    ai: { es: 'Herramientas que hoy usan miles de personas.', en: 'Tools used today by thousands of people.' },
  },
]
